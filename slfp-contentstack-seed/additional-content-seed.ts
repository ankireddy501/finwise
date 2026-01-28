import 'dotenv/config';
import * as contentstack from '@contentstack/management';

/**
 * Additional Content Types and Entries for FinWise Portal
 * 
 * This script adds:
 * 1. NGO Organization content type and entries (for Carbon Footprint Calculator)
 * 2. Cloud Region content type and entries (for Cloud Carbon Footprint)
 * 3. Updates Carbon Footprint Calculator config to include cloud infrastructure
 * 
 * Run this after the main seed.ts script
 */

type Env = {
  CS_API_KEY: string;
  CS_MANAGEMENT_TOKEN: string;
  CS_HOST: string;
  CS_LOCALE: string;
};

function mustGetEnv(key: keyof Env): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env var: ${key}`);
  return v;
}

const API_KEY = mustGetEnv('CS_API_KEY');
const MANAGEMENT_TOKEN = mustGetEnv('CS_MANAGEMENT_TOKEN');
const HOST = mustGetEnv('CS_HOST');
const LOCALE = process.env.CS_LOCALE || 'en-us';

const client = contentstack.client({ host: HOST });
const stack = client.stack({
  api_key: API_KEY,
  management_token: MANAGEMENT_TOKEN,
});

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function contentTypeExists(uid: string): Promise<boolean> {
  try {
    await stack.contentType(uid).fetch();
    return true;
  } catch (e: any) {
    return false;
  }
}

async function upsertContentType(schema: any) {
  const uid = schema?.content_type?.uid;
  if (!uid) throw new Error('content_type.uid missing');

  const exists = await contentTypeExists(uid);

  if (!exists) {
    console.log(`Creating content type: ${uid}`);
    await stack.contentType().create(schema);
    await sleep(300);
    return;
  }

  console.log(`Content type exists, skipping create: ${uid}`);
}

async function findEntryByUniqueKey(contentTypeUid: string, uniqueKeyFieldUid: string, uniqueValue: string) {
  try {
    const query = stack
      .contentType(contentTypeUid)
      .entry()
      .query({ query: { [uniqueKeyFieldUid]: uniqueValue } });

    const res = await query.find();
    const items = res?.items || [];
    return items.length ? items[0] : null;
  } catch (e) {
    return null;
  }
}

async function upsertEntryByKey(
  contentTypeUid: string,
  uniqueKeyFieldUid: string,
  entryData: any
) {
  const uniqueValue = entryData[uniqueKeyFieldUid];
  if (!uniqueValue) {
    throw new Error(`Entry missing unique key field: ${uniqueKeyFieldUid}`);
  }

  const existing = await findEntryByUniqueKey(contentTypeUid, uniqueKeyFieldUid, uniqueValue);

  let entryResult;
  if (existing) {
    console.log(`Updating entry in ${contentTypeUid}: ${uniqueValue}`);
    entryResult = await stack
      .contentType(contentTypeUid)
      .entry(existing.uid)
      .update({ entry: entryData });
  } else {
    console.log(`Creating entry in ${contentTypeUid}: ${uniqueValue}`);
    entryResult = await stack.contentType(contentTypeUid).entry().create({ entry: entryData });
  }

  // Publish the entry (API expects entry object with locales and environments)
  try {
    console.log(`  Publishing entry: ${uniqueValue}...`);
    await stack.contentType(contentTypeUid).entry(entryResult.uid).publish({
      publishDetails: { locales: [LOCALE], environments: ['production'] },
      locale: LOCALE,
    });
    await sleep(200);
  } catch (publishError: any) {
    console.log(`  ⚠️  Could not publish entry (may need manual publish): ${publishError?.message || publishError}`);
  }

  return entryResult;
}

// ============================================================================
// Content Type Schemas
// ============================================================================

const CT_NGO_ORGANIZATION = {
  content_type: {
    title: 'NGO Organization',
    uid: 'ngo_organization',
    description: 'NGOs and organizations that help with tree planting and environmental conservation',
    schema: [
      { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true },
      { display_name: 'Name', uid: 'name', data_type: 'text', mandatory: true, unique: true },
      { display_name: 'Description', uid: 'description', data_type: 'text', multiline: true },
      { display_name: 'Website', uid: 'website', data_type: 'text' },
      { display_name: 'Phone', uid: 'phone', data_type: 'text' },
      { display_name: 'Email', uid: 'email', data_type: 'text' },
      { display_name: 'City', uid: 'city', data_type: 'text', mandatory: true },
      { display_name: 'State', uid: 'state', data_type: 'text' },
      { display_name: 'Country', uid: 'country', data_type: 'text', default_value: 'India' },
      { display_name: 'Focus Areas', uid: 'focus_areas', data_type: 'text', multiple: true },
      { display_name: 'Is National', uid: 'is_national', data_type: 'boolean', default_value: false },
      { display_name: 'Active', uid: 'active', data_type: 'boolean', default_value: true },
    ],
    options: { is_page: false, singleton: false },
  },
};

const CT_CLOUD_REGION = {
  content_type: {
    title: 'Cloud Region',
    uid: 'cloud_region',
    description: 'Cloud provider regions with carbon emission factors',
    schema: [
      { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true },
      { display_name: 'Region Code', uid: 'region_code', data_type: 'text', mandatory: true, unique: true },
      { display_name: 'Region Name', uid: 'region_name', data_type: 'text', mandatory: true },
      { display_name: 'Provider', uid: 'provider', data_type: 'text', mandatory: true },
      { display_name: 'Country', uid: 'country', data_type: 'text' },
      { display_name: 'City', uid: 'city', data_type: 'text' },
      { display_name: 'Carbon Intensity', uid: 'carbon_intensity', data_type: 'number', mandatory: true },
      { display_name: 'Description', uid: 'description', data_type: 'text', multiline: true },
      { display_name: 'Active', uid: 'active', data_type: 'boolean', default_value: true },
    ],
    options: { is_page: false, singleton: false },
  },
};

// ============================================================================
// Seed Functions
// ============================================================================

async function seedNGOs() {
  console.log('\n🌳 Seeding NGO Organizations...');

  const ngos = [
    // Mumbai
    {
      title: 'Grow-Trees.com',
      name: 'grow-trees-com',
      description: 'Plant trees online and track your impact. They plant trees across India including Maharashtra.',
      website: 'https://www.grow-trees.com',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      focus_areas: ['Online tree planting', 'Corporate partnerships', 'Community projects'],
      is_national: true,
      active: true,
    },
    {
      title: 'Vanashakti',
      name: 'vanashakti',
      description: 'Environmental NGO working on forest conservation and tree planting in Mumbai and Maharashtra.',
      website: 'https://www.vanashakti.in',
      phone: '+91-22-2617-0000',
      email: 'info@vanashakti.in',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      focus_areas: ['Forest conservation', 'Urban greening', 'Community awareness'],
      is_national: false,
      active: true,
    },
    {
      title: 'Mumbai Tree Planting Initiative',
      name: 'mumbai-tree-planting',
      description: 'Local initiative focused on increasing green cover in Mumbai through community participation.',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      focus_areas: ['Community tree planting', 'Urban forestry', 'School programs'],
      is_national: false,
      active: true,
    },
    // Delhi
    {
      title: 'Delhi Greens',
      name: 'delhi-greens',
      description: 'Environmental organization promoting green spaces and tree planting in Delhi NCR.',
      website: 'https://delhigreens.org',
      email: 'info@delhigreens.org',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      focus_areas: ['Urban greening', 'Community gardens', 'Environmental education'],
      is_national: false,
      active: true,
    },
    {
      title: 'I Am Gurgaon',
      name: 'i-am-gurgaon',
      description: 'Citizen-led initiative for urban greening and tree planting in Gurgaon and Delhi NCR.',
      website: 'https://www.iamgurgaon.org',
      city: 'Gurgaon',
      state: 'Haryana',
      country: 'India',
      focus_areas: ['Urban forestry', 'Community participation', 'Green infrastructure'],
      is_national: false,
      active: true,
    },
    {
      title: 'Green Yatra',
      name: 'green-yatra',
      description: 'NGO working on environmental conservation and tree planting across Delhi and NCR.',
      website: 'https://www.greenyatra.org',
      phone: '+91-11-4100-0000',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      focus_areas: ['Tree planting', 'Waste management', 'Environmental awareness'],
      is_national: false,
      active: true,
    },
    // Bangalore
    {
      title: 'SayTrees',
      name: 'saytrees',
      description: 'Bangalore-based NGO focused on tree planting and urban greening initiatives.',
      website: 'https://www.saytrees.org',
      phone: '+91-80-4090-0000',
      email: 'info@saytrees.org',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      focus_areas: ['Tree planting', 'Urban forestry', 'Corporate partnerships'],
      is_national: false,
      active: true,
    },
    {
      title: 'Hasiru Dala',
      name: 'hasiru-dala',
      description: 'Environmental organization working on waste management and tree planting in Bangalore.',
      website: 'https://www.hasirudala.in',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      focus_areas: ['Waste management', 'Tree planting', 'Community engagement'],
      is_national: false,
      active: true,
    },
    {
      title: 'Green Bangalore',
      name: 'green-bangalore',
      description: 'Citizen initiative for increasing green cover and tree planting in Bangalore.',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      focus_areas: ['Community tree planting', 'Urban greening', 'Environmental awareness'],
      is_national: false,
      active: true,
    },
    // Hyderabad
    {
      title: 'Hyderabad Tree Planting Foundation',
      name: 'hyderabad-tree-planting',
      description: 'Local NGO dedicated to increasing tree cover in Hyderabad through community participation.',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      focus_areas: ['Tree planting', 'Urban greening', 'Community programs'],
      is_national: false,
      active: true,
    },
    {
      title: 'Green Hyderabad',
      name: 'green-hyderabad',
      description: 'Environmental initiative promoting tree planting and green spaces in Hyderabad.',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      focus_areas: ['Community gardens', 'Tree planting', 'Environmental education'],
      is_national: false,
      active: true,
    },
    // Chennai
    {
      title: 'Chennai Tree Planting Society',
      name: 'chennai-tree-planting',
      description: 'NGO working on urban greening and tree planting initiatives in Chennai.',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      focus_areas: ['Tree planting', 'Urban forestry', 'Community participation'],
      is_national: false,
      active: true,
    },
    {
      title: 'Environmentalist Foundation of India',
      name: 'efi-india',
      description: 'Nationwide organization with active tree planting programs in Chennai.',
      website: 'https://www.efi.org.in',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      focus_areas: ['Tree planting', 'Water conservation', 'Environmental education'],
      is_national: true,
      active: true,
    },
    // Kolkata
    {
      title: 'Kolkata Green Initiative',
      name: 'kolkata-green',
      description: 'Local organization promoting tree planting and green spaces in Kolkata.',
      city: 'Kolkata',
      state: 'West Bengal',
      country: 'India',
      focus_areas: ['Tree planting', 'Urban greening', 'Community awareness'],
      is_national: false,
      active: true,
    },
    {
      title: 'Nature Mates',
      name: 'nature-mates',
      description: 'Kolkata-based NGO working on biodiversity conservation and tree planting.',
      website: 'https://www.naturemates.org',
      city: 'Kolkata',
      state: 'West Bengal',
      country: 'India',
      focus_areas: ['Biodiversity', 'Tree planting', 'Environmental education'],
      is_national: false,
      active: true,
    },
    // Pune
    {
      title: 'Pune Tree Planting Initiative',
      name: 'pune-tree-planting',
      description: 'Community-driven organization for tree planting and urban greening in Pune.',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      focus_areas: ['Tree planting', 'Community participation', 'Urban forestry'],
      is_national: false,
      active: true,
    },
    {
      title: 'Eco Pune',
      name: 'eco-pune',
      description: 'Environmental NGO promoting green initiatives and tree planting in Pune.',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      focus_areas: ['Tree planting', 'Waste management', 'Environmental awareness'],
      is_national: false,
      active: true,
    },
    // National NGOs
    {
      title: 'One Tree Planted',
      name: 'one-tree-planted',
      description: 'International organization with tree planting projects across India.',
      website: 'https://onetreeplanted.org',
      city: 'Multiple',
      state: 'Multiple',
      country: 'India',
      focus_areas: ['Reforestation', 'Global projects', 'Corporate partnerships'],
      is_national: true,
      active: true,
    },
    {
      title: 'SankalpTaru Foundation',
      name: 'sankalptaru',
      description: 'NGO planting trees across India with focus on rural and urban areas.',
      website: 'https://www.sankalptaru.org',
      city: 'Multiple',
      state: 'Multiple',
      country: 'India',
      focus_areas: ['Tree planting', 'Rural development', 'Corporate partnerships'],
      is_national: true,
      active: true,
    },
  ];

  for (const ngo of ngos) {
    await upsertEntryByKey('ngo_organization', 'name', ngo);
    await sleep(100);
  }

  console.log(`✅ Seeded ${ngos.length} NGO organizations`);
  return ngos;
}

async function seedCloudRegions() {
  console.log('\n☁️ Seeding Cloud Regions...');

  const regions = [
    // AWS Regions
    {
      title: 'AWS Mumbai (ap-south-1)',
      region_code: 'ap-south-1',
      region_name: 'Mumbai',
      provider: 'AWS',
      country: 'India',
      city: 'Mumbai',
      carbon_intensity: 0.82,
      description: 'AWS Asia Pacific (Mumbai) region - India grid average carbon intensity',
      active: true,
    },
    {
      title: 'AWS Singapore (ap-southeast-1)',
      region_code: 'ap-southeast-1',
      region_name: 'Singapore',
      provider: 'AWS',
      country: 'Singapore',
      city: 'Singapore',
      carbon_intensity: 0.50,
      description: 'AWS Asia Pacific (Singapore) region',
      active: true,
    },
    {
      title: 'AWS Virginia (us-east-1)',
      region_code: 'us-east-1',
      region_name: 'Virginia',
      provider: 'AWS',
      country: 'USA',
      city: 'Virginia',
      carbon_intensity: 0.40,
      description: 'AWS US East (N. Virginia) region - US grid average',
      active: true,
    },
    {
      title: 'AWS Oregon (us-west-2)',
      region_code: 'us-west-2',
      region_name: 'Oregon',
      provider: 'AWS',
      country: 'USA',
      city: 'Oregon',
      carbon_intensity: 0.30,
      description: 'AWS US West (Oregon) region - renewable energy heavy',
      active: true,
    },
    {
      title: 'AWS Ireland (eu-west-1)',
      region_code: 'eu-west-1',
      region_name: 'Ireland',
      provider: 'AWS',
      country: 'Ireland',
      city: 'Dublin',
      carbon_intensity: 0.30,
      description: 'AWS Europe (Ireland) region - EU grid average',
      active: true,
    },
    // Azure Regions
    {
      title: 'Azure Central India',
      region_code: 'central-india',
      region_name: 'Central India',
      provider: 'Azure',
      country: 'India',
      city: 'Pune',
      carbon_intensity: 0.82,
      description: 'Azure Central India region - India grid average',
      active: true,
    },
    {
      title: 'Azure East US',
      region_code: 'east-us',
      region_name: 'East US',
      provider: 'Azure',
      country: 'USA',
      city: 'Virginia',
      carbon_intensity: 0.40,
      description: 'Azure East US region - US grid average',
      active: true,
    },
    {
      title: 'Azure West Europe',
      region_code: 'west-europe',
      region_name: 'West Europe',
      provider: 'Azure',
      country: 'Netherlands',
      city: 'Amsterdam',
      carbon_intensity: 0.30,
      description: 'Azure West Europe region - EU grid average',
      active: true,
    },
    // GCP Regions
    {
      title: 'GCP Mumbai (asia-south1)',
      region_code: 'asia-south1',
      region_name: 'Mumbai',
      provider: 'GCP',
      country: 'India',
      city: 'Mumbai',
      carbon_intensity: 0.82,
      description: 'GCP Asia South1 (Mumbai) region - India grid average',
      active: true,
    },
    {
      title: 'GCP Iowa (us-central1)',
      region_code: 'us-central1',
      region_name: 'Iowa',
      provider: 'GCP',
      country: 'USA',
      city: 'Iowa',
      carbon_intensity: 0.40,
      description: 'GCP US Central1 (Iowa) region - US grid average',
      active: true,
    },
    {
      title: 'GCP Belgium (europe-west1)',
      region_code: 'europe-west1',
      region_name: 'Belgium',
      provider: 'GCP',
      country: 'Belgium',
      city: 'St. Ghislain',
      carbon_intensity: 0.30,
      description: 'GCP Europe West1 (Belgium) region - EU grid average',
      active: true,
    },
  ];

  for (const region of regions) {
    await upsertEntryByKey('cloud_region', 'region_code', region);
    await sleep(100);
  }

  console.log(`✅ Seeded ${regions.length} cloud regions`);
  return regions;
}

async function updateCarbonFootprintCalculator() {
  console.log('\n🌍 Updating Carbon Footprint Calculator config...');

  const existing = await findEntryByUniqueKey('calculator', 'key', 'carbon_footprint_calculator');
  
  if (!existing) {
    console.log('⚠️ Carbon Footprint Calculator not found. Run main seed.ts first.');
    return;
  }

  const updatedConfig = {
    calculatorType: 'CARBON_FOOTPRINT',
    inputs: {
      transportation: {
        carKmPerMonth: { min: 0, max: 5000, default: 1000 },
        carFuelType: { options: ['petrol', 'diesel'], default: 'petrol' },
        carEfficiency: { min: 5, max: 30, default: 15 },
        bikeKmPerMonth: { min: 0, max: 2000, default: 500 },
        publicTransportKmPerMonth: { min: 0, max: 2000, default: 200 },
        flightHoursPerYear: { min: 0, max: 100, default: 10 },
      },
      energy: {
        electricityKwhPerMonth: { min: 0, max: 2000, default: 300 },
        lpgCylindersPerMonth: { min: 0, max: 5, default: 1 },
        cngKgPerMonth: { min: 0, max: 500, default: 0 },
      },
      lifestyle: {
        meatMealsPerWeek: { min: 0, max: 21, default: 7 },
        shoppingAmountPerMonth: { min: 0, max: 100000, default: 5000, currency: 'INR' },
      },
      cloudInfrastructure: {
        cloudProvider: { options: ['aws', 'azure', 'gcp'], default: 'aws' },
        cloudRegion: { options: ['ap-south-1', 'ap-southeast-1', 'us-east-1', 'us-west-2', 'eu-west-1', 'central-india', 'east-us', 'west-europe', 'asia-south1', 'us-central1', 'europe-west1'], default: 'ap-south-1' },
        computeInstances: { min: 0, max: 50, default: 2 },
        computeHoursPerMonth: { min: 0, max: 744, default: 730 },
        computeInstanceType: { options: ['small', 'medium', 'large', 'xlarge'], default: 'medium' },
        storageGB: { min: 0, max: 100000, default: 100 },
        dataTransferGB: { min: 0, max: 100000, default: 100 },
        databaseInstances: { min: 0, max: 20, default: 1 },
        databaseHoursPerMonth: { min: 0, max: 744, default: 730 },
      },
    },
    outputs: {
      totalAnnualCO2: true,
      totalAnnualCO2Tons: true,
      treesNeeded: true,
      breakdown: true,
      monthlyBreakdown: true,
      cloudCO2Annual: true,
    },
    emissionFactors: {
      petrol: 2.31,
      diesel: 2.68,
      cng: 1.5,
      lpg: 1.5,
      electricity: 0.82,
      publicTransport: 0.05,
      bike: 0.12,
      flight: 90,
      meatMeal: 3.5,
      shopping: 0.001,
    },
    cloudEmissionFactors: {
      'ap-south-1': 0.82,
      'ap-southeast-1': 0.50,
      'us-east-1': 0.40,
      'us-west-2': 0.30,
      'eu-west-1': 0.30,
      'central-india': 0.82,
      'east-us': 0.40,
      'west-europe': 0.30,
      'asia-south1': 0.82,
      'us-central1': 0.40,
      'europe-west1': 0.30,
    },
    computePowerConsumption: {
      small: 0.05,
      medium: 0.10,
      large: 0.20,
      xlarge: 0.40,
    },
    storagePowerConsumption: 0.0001,
    dataTransferPowerConsumption: 0.0005,
    pueFactor: 1.5,
    co2PerTreePerYear: 20,
    features: {
      cityBasedNGOs: true,
      cloudInfrastructure: true,
    },
  };

  await stack
    .contentType('calculator')
    .entry(existing.uid)
    .update({
      entry: {
        config: JSON.stringify(updatedConfig),
      },
    });

  console.log('✅ Updated Carbon Footprint Calculator config');
}

// ============================================================================
// Main Function
// ============================================================================

async function main() {
  console.log('🌱 Seeding additional content types and entries...');
  console.log('Stack:', API_KEY, 'Host:', HOST, 'Locale:', LOCALE);

  try {
    // 1) Create content types
    console.log('\n📦 Creating additional content types...');
    await upsertContentType(CT_NGO_ORGANIZATION);
    await upsertContentType(CT_CLOUD_REGION);

    // 2) Seed entries (content types have no publish in Management SDK; only entries/assets do)
    console.log('\n🌱 Seeding entries...');
    await seedNGOs();
    await seedCloudRegions();
    await updateCarbonFootprintCalculator();

    console.log('\n✅ Additional seeding completed successfully!');
    console.log('\n📋 New Content Types Created:');
    console.log('  - ngo_organization');
    console.log('  - cloud_region');
    console.log('\n✨ All additional content is now published and available in Contentstack!');
  } catch (err: any) {
    console.error('❌ Seeding failed:', err?.message || err);
    if (err?.errors) console.error('Errors:', JSON.stringify(err.errors, null, 2));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
