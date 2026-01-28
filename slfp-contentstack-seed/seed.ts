import 'dotenv/config';
import * as contentstack from '@contentstack/management';

/**
 * Smart Life Financial Planning Portal - Contentstack Seeder
 * - Creates core content types
 * - Seeds categories + key entries (NPS, Tax (with Section 24), Education, sample credit card)
 *
 * References:
 * - JS Management SDK supports `host` override and management token auth. (Docs)
 * - AU region CMA host: au-api.contentstack.com (Regions endpoints)
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
const HOST = mustGetEnv('CS_HOST'); // au-api.contentstack.com
const LOCALE = process.env.CS_LOCALE || 'en-us';

// Configure client with host
// Note: If you're behind a proxy, configure HTTP_PROXY/HTTPS_PROXY environment variables
// or use a tool like global-agent: npm install global-agent && require('global-agent/bootstrap')
const client = contentstack.client({
  host: HOST,
  // You can also use authtoken, but management_token is best for service-to-service seeding.
  // (Management token is provided at stack() level below.)
});

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
    // SDK throws if not found / unauthorized
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
    // small delay to avoid eventual consistency issues
    await sleep(300);
    return;
  }

  console.log(`Content type exists, skipping create: ${uid}`);
}

async function findEntryByUniqueKey(contentTypeUid: string, uniqueKeyFieldUid: string, uniqueValue: string) {
  try {
    // Query entries where field == uniqueValue
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

async function createEntry(contentTypeUid: string, entry: any) {
  console.log(`Creating entry in ${contentTypeUid}: ${entry?.title || entry?.name || entry?.key}`);
  return stack.contentType(contentTypeUid).entry().create({ entry });
}

async function upsertEntryByKey(
  contentTypeUid: string,
  uniqueKeyFieldUid: string,
  entry: any
) {
  const keyVal = entry?.[uniqueKeyFieldUid];
  if (!keyVal) throw new Error(`Entry missing unique key field '${uniqueKeyFieldUid}' for CT '${contentTypeUid}'`);

  const existing = await findEntryByUniqueKey(contentTypeUid, uniqueKeyFieldUid, keyVal);

  let entryResult;
  if (!existing) {
    entryResult = await createEntry(contentTypeUid, entry);
  } else {
    console.log(`Entry exists, updating: ${contentTypeUid}.${uniqueKeyFieldUid}=${keyVal}`);
    entryResult = await stack.contentType(contentTypeUid).entry(existing.uid).update({ entry });
  }

  // Publish the entry (API expects entry object with locales and environments)
  try {
    console.log(`  Publishing entry: ${keyVal}...`);
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

/** -----------------------------
 *  Content Type Schemas
 *  -----------------------------
 * Kept intentionally flexible:
 * - calculators store "config" JSON used by your React app
 * - you can evolve without re-modeling fields often
 */

const CT_CALCULATOR_CATEGORY = {
  content_type: {
    title: 'Calculator Category',
    uid: 'calculator_category',
    description: 'Top-level categories for calculators (Investments, Loans, Retirement, etc.)',
    schema: [
      { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
      { display_name: 'Key', uid: 'key', data_type: 'text', mandatory: true, unique: true },
      { display_name: 'Description', uid: 'description', data_type: 'text', multiline: true },
      { display_name: 'Order', uid: 'order', data_type: 'number' },
      { display_name: 'Icon', uid: 'icon', data_type: 'text' },
    ],
    options: { is_page: false, singleton: false },
  },
};

const CT_CALCULATOR = {
  content_type: {
    title: 'Calculator',
    uid: 'calculator',
    description: 'Calculator metadata + configuration JSON for the portal UI',
    schema: [
      { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true },
      { display_name: 'Key', uid: 'key', data_type: 'text', mandatory: true, unique: true },
      {
        display_name: 'Category',
        uid: 'category',
        data_type: 'reference',
        reference_to: ['calculator_category'],
        mandatory: true,
      },
      { display_name: 'Summary', uid: 'summary', data_type: 'text', multiline: true },
      { display_name: 'Disclaimer', uid: 'disclaimer', data_type: 'text', multiline: true },
      {
        display_name: 'Config (JSON)',
        uid: 'config',
        data_type: 'text',
        multiline: true,
        mandatory: true,
      },
      {
        display_name: 'Enabled',
        uid: 'enabled',
        data_type: 'boolean',
        mandatory: true,
        default_value: true,
      },
    ],
    options: { is_page: false, singleton: false },
  },
};

const CT_EDUCATION_ARTICLE = {
  content_type: {
    title: 'Education Article',
    uid: 'education_article',
    description: 'Financial education modules & tips',
    schema: [
      { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true },
      { display_name: 'Key', uid: 'key', data_type: 'text', mandatory: true, unique: true },
      { display_name: 'Category', uid: 'category', data_type: 'text' },
      { display_name: 'Summary', uid: 'summary', data_type: 'text', multiline: true },
      { display_name: 'Body', uid: 'body', data_type: 'text', multiline: true },
      { display_name: 'Order', uid: 'order', data_type: 'number' },
    ],
    options: { is_page: false, singleton: false },
  },
};

const CT_CREDIT_CARD = {
  content_type: {
    title: 'Credit Card',
    uid: 'credit_card',
    description: 'Credit card catalog with rewards structure',
    schema: [
      { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true },
      { display_name: 'Name', uid: 'name', data_type: 'text', mandatory: true },
      { display_name: 'Key', uid: 'key', data_type: 'text', mandatory: true, unique: true },
      { display_name: 'Issuer', uid: 'issuer', data_type: 'text' },
      { display_name: 'Annual Fee (INR)', uid: 'annual_fee', data_type: 'number' },
      { display_name: 'Welcome Bonus', uid: 'welcome_bonus', data_type: 'text', multiline: true },
      { display_name: 'Lounge Access', uid: 'lounge_access', data_type: 'text' },
      { display_name: 'Insurance Coverage', uid: 'insurance_coverage', data_type: 'text', multiline: true },
      {
        display_name: 'Reward Structure (JSON)',
        uid: 'reward_structure',
        data_type: 'text',
        multiline: true,
        mandatory: true,
      },
    ],
    options: { is_page: false, singleton: false },
  },
};

const CT_PAGE = {
  content_type: {
    title: 'Page',
    uid: 'page',
    description: 'Page metadata and content for the portal',
    schema: [
      { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true },
      { display_name: 'Key', uid: 'key', data_type: 'text', mandatory: true, unique: true },
      { display_name: 'Route', uid: 'route', data_type: 'text', mandatory: true },
      { display_name: 'Description', uid: 'description', data_type: 'text', multiline: true },
      { display_name: 'SEO Title', uid: 'seo_title', data_type: 'text' },
      { display_name: 'SEO Description', uid: 'seo_description', data_type: 'text', multiline: true },
      { display_name: 'Enabled', uid: 'enabled', data_type: 'boolean', default_value: true },
    ],
    options: { is_page: false, singleton: false },
  },
};

const CT_DASHBOARD_CARD = {
  content_type: {
    title: 'Dashboard Card',
    uid: 'dashboard_card',
    description: 'Calculator cards displayed on the dashboard',
    schema: [
      { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true },
      { display_name: 'Key', uid: 'key', data_type: 'text', mandatory: true, unique: true },
      { display_name: 'Description', uid: 'description', data_type: 'text', multiline: true, mandatory: true },
      { display_name: 'Route', uid: 'route', data_type: 'text', mandatory: true },
      { display_name: 'Icon Color', uid: 'icon_color', data_type: 'text' },
      { display_name: 'Border Color', uid: 'border_color', data_type: 'text' },
      { display_name: 'Link Text', uid: 'link_text', data_type: 'text' },
      { display_name: 'Order', uid: 'order', data_type: 'number' },
      { display_name: 'Enabled', uid: 'enabled', data_type: 'boolean', default_value: true },
    ],
    options: { is_page: false, singleton: false },
  },
};

const CT_TRAVEL_GOAL = {
  content_type: {
    title: 'Travel Goal',
    uid: 'travel_goal',
    description: 'Travel goals for credit card reward point mapping',
    schema: [
      { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true },
      { display_name: 'Name', uid: 'name', data_type: 'text', mandatory: true },
      { display_name: 'Key', uid: 'key', data_type: 'text', mandatory: true, unique: true },
      { display_name: 'Points Required', uid: 'points_required', data_type: 'number', mandatory: true },
      { display_name: 'Estimated Value (INR)', uid: 'estimated_value', data_type: 'number' },
      { display_name: 'Description', uid: 'description', data_type: 'text', multiline: true },
      { display_name: 'Icon', uid: 'icon', data_type: 'text' },
    ],
    options: { is_page: false, singleton: false },
  },
};

const CT_REWARDS_CATEGORY = {
  content_type: {
    title: 'Rewards Category',
    uid: 'rewards_category',
    description: 'Categories for reward redemption options',
    schema: [
      { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true },
      { display_name: 'Key', uid: 'key', data_type: 'text', mandatory: true, unique: true },
      { display_name: 'Icon', uid: 'icon', data_type: 'text' },
      { display_name: 'Icon Color', uid: 'icon_color', data_type: 'text' },
      { display_name: 'Order', uid: 'order', data_type: 'number' },
    ],
    options: { is_page: false, singleton: false },
  },
};

const CT_REWARDS_ITEM = {
  content_type: {
    title: 'Rewards Item',
    uid: 'rewards_item',
    description: 'Individual redemption items',
    schema: [
      { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true },
      { display_name: 'Name', uid: 'name', data_type: 'text', mandatory: true },
      { display_name: 'Key', uid: 'key', data_type: 'text', mandatory: true, unique: true },
      {
        display_name: 'Category',
        uid: 'category',
        data_type: 'reference',
        reference_to: ['rewards_category'],
        mandatory: true,
      },
      { display_name: 'Points Required', uid: 'points_required', data_type: 'text', mandatory: true },
      { display_name: 'Value', uid: 'value', data_type: 'text', mandatory: true },
      { display_name: 'Order', uid: 'order', data_type: 'number' },
    ],
    options: { is_page: false, singleton: false },
  },
};

const CT_NAVIGATION_ITEM = {
  content_type: {
    title: 'Navigation Item',
    uid: 'navigation_item',
    description: 'Sidebar navigation items',
    schema: [
      { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true },
      { display_name: 'Label', uid: 'label', data_type: 'text', mandatory: true },
      { display_name: 'Key', uid: 'key', data_type: 'text', mandatory: true, unique: true },
      { display_name: 'Route', uid: 'route', data_type: 'text', mandatory: true },
      { display_name: 'Icon', uid: 'icon', data_type: 'text' },
      { display_name: 'Section', uid: 'section', data_type: 'text' },
      { display_name: 'Order', uid: 'order', data_type: 'number' },
      { display_name: 'Enabled', uid: 'enabled', data_type: 'boolean', default_value: true },
    ],
    options: { is_page: false, singleton: false },
  },
};

const DISCLAIMER =
  'This is an estimate for planning purposes only. Actual returns may vary. Consult a certified financial advisor for personalized advice.';

/** -----------------------------
 *  Seed Data
 *  ----------------------------- */

async function seedCategories() {
  const categories = [
    { title: 'Investments', key: 'investments', description: 'SIP, Inflation, and other investment tools', order: 1, icon: 'TrendingUp' },
    { title: 'Loans', key: 'loans', description: 'Home, Gold, Personal loans and EMI tools', order: 2, icon: 'Banknote' },
    { title: 'Retirement', key: 'retirement', description: 'PF, Gratuity, NPS', order: 3, icon: 'Landmark' },
    { title: 'Family', key: 'family', description: 'SSY and Marriage planning', order: 4, icon: 'Users' },
    { title: 'Tax', key: 'tax', description: 'Income tax old vs new', order: 5, icon: 'ReceiptIndianRupee' },
    { title: 'Currency', key: 'currency', description: 'Currency converter', order: 6, icon: 'ArrowLeftRight' },
    { title: 'Cloud Cost', key: 'cloud_cost', description: 'AWS, Azure, GCP cost estimation', order: 7, icon: 'Cloud' },
    { title: 'Environment', key: 'environment', description: 'Carbon footprint and sustainability', order: 8, icon: 'Leaf' },
  ];

  const created: Record<string, any> = {};
  for (const c of categories) {
    const res = await upsertEntryByKey('calculator_category', 'key', c);
    created[c.key] = res;
  }
  return created;
}

function ref(uid: string) {
  // Contentstack reference fields store an array of reference objects:
  return [{ uid, _content_type_uid: 'calculator_category' }];
}

async function seedCalculators(categoryEntriesByKey: Record<string, any>) {
  // We need the referenced entry UID for each category
  const catUid = (key: string) => categoryEntriesByKey[key]?.uid;

  const npsCalculator = {
    title: 'NPS Calculator',
    key: 'nps_calculator',
    category: [{ uid: catUid('retirement'), _content_type_uid: 'calculator_category' }],
    summary: 'Estimate NPS retirement corpus, lump sum vs annuity, and tax benefits under 80CCD.',
    disclaimer: DISCLAIMER,
    enabled: true,
    config: JSON.stringify({
      calculatorType: 'NPS',
      inputs: {
        currentAge: { min: 18, max: 60, default: 30 },
        retirementAge: { min: 60, max: 70, default: 60 },
        monthlyContribution: { min: 500, max: 200000, default: 5000, currency: 'INR' },
        accountType: { options: ['Tier 1', 'Tier 2', 'Both'], default: 'Tier 1' },
        investmentChoice: {
          type: 'ActiveOrAuto',
          active: {
            equityPct: { min: 0, max: 75, default: 50 },
            corporateBondsPct: { min: 0, max: 100, default: 30 },
            govtSecuritiesPct: { min: 0, max: 100, default: 20 },
          },
          autoLifecycle: {
            options: ['Aggressive', 'Moderate', 'Conservative'],
            default: 'Moderate',
          },
        },
      },
      outputs: {
        corpus: true,
        totalContribution: true,
        totalInterest: true,
        lumpSumPct: 60,
        annuityPct: 40,
        estimatedMonthlyPension: true,
      },
      taxBenefits: [
        { section: '80CCD(1)', note: 'Up to 10% of salary (within 80C limit of ₹1.5L)' },
        { section: '80CCD(1B)', note: 'Additional ₹50,000' },
        { section: '80CCD(2)', note: 'Employer contribution (no limit)' },
      ],
      assumptions: {
        // You can change these in CMS later without code deploy
        expectedAnnualReturnPct: 10,
        annuityRatePct: 6,
      },
    }),
  };

  // Tax calculator with Section 24 explicitly included
  const incomeTaxCalculator = {
    title: 'Income Tax Calculator (Old vs New Regime)',
    key: 'income_tax_calculator',
    category: [{ uid: catUid('tax'), _content_type_uid: 'calculator_category' }],
    summary: 'Compare tax liability under old and new regimes (FY 2024-25) including cess and deductions.',
    disclaimer: DISCLAIMER,
    enabled: true,
    config: JSON.stringify({
      calculatorType: 'INCOME_TAX',
      fy: '2024-25',
      standardDeduction: { old: 50000, new: 75000 },
      cessPct: 4,
      slabs: {
        old: [
          { upTo: 250000, ratePct: 0 },
          { upTo: 500000, ratePct: 5 },
          { upTo: 1000000, ratePct: 20 },
          { above: 1000000, ratePct: 30 },
        ],
        new: [
          { upTo: 300000, ratePct: 0 },
          { upTo: 700000, ratePct: 5 },
          { upTo: 1000000, ratePct: 10 },
          { upTo: 1200000, ratePct: 15 },
          { upTo: 1500000, ratePct: 20 },
          { above: 1500000, ratePct: 30 },
        ],
      },
      deductionsOldRegime: [
        { key: 'hra_exemption', label: 'HRA Exemption', type: 'number', max: null },
        { key: 'section_80c', label: 'Section 80C (PF/ELSS/LIC/PPF) - Max ₹1.5L', type: 'number', max: 150000 },
        { key: 'section_80d_self', label: 'Section 80D - Self (Max ₹25K)', type: 'number', max: 25000 },
        { key: 'section_80d_parents', label: 'Section 80D - Parents (Max ₹50K)', type: 'number', max: 50000 },
        { key: 'nps_80ccd_1b', label: 'NPS 80CCD(1B) - Additional ₹50K', type: 'number', max: 50000 },
        // ✅ Section 24 as requested
        { key: 'section_24_home_loan_interest', label: 'Home Loan Interest (Section 24) - Max ₹2L', type: 'number', max: 200000 },
      ],
      inputs: {
        grossIncome: { min: 300000, max: 5000000, default: 1200000 },
      },
      outputs: {
        taxOld: true,
        taxNew: true,
        cess: true,
        effectiveTaxRate: true,
        recommendation: true,
      },
    }),
  };

  const awsCalculator = {
    title: 'AWS Cost Calculator',
    key: 'aws_cost_calculator',
    category: [{ uid: catUid('cloud_cost'), _content_type_uid: 'calculator_category' }],
    summary: 'Estimate monthly and annual AWS cloud infrastructure costs including EC2, S3, RDS, Lambda, and data transfer.',
    disclaimer: DISCLAIMER,
    enabled: true,
    config: JSON.stringify({
      calculatorType: 'AWS_COST',
      services: {
        ec2: { instances: true, instanceTypes: true, hoursPerMonth: true },
        s3: { storage: true, requests: true },
        rds: { instances: true, instanceTypes: true, storage: true },
        dataTransfer: { outbound: true },
        lambda: { requests: true, compute: true },
      },
      outputs: {
        monthlyCost: true,
        annualCost: true,
        breakdown: true,
      },
    }),
  };

  const azureCalculator = {
    title: 'Azure Cost Calculator',
    key: 'azure_cost_calculator',
    category: [{ uid: catUid('cloud_cost'), _content_type_uid: 'calculator_category' }],
    summary: 'Estimate monthly and annual Microsoft Azure cloud infrastructure costs including VMs, Blob Storage, SQL Database, Functions, and data transfer.',
    disclaimer: DISCLAIMER,
    enabled: true,
    config: JSON.stringify({
      calculatorType: 'AZURE_COST',
      services: {
        vms: { instances: true, vmSizes: true, hoursPerMonth: true },
        blobStorage: { storage: true, transactions: true },
        sqlDatabase: { instances: true, tiers: true, storage: true },
        dataTransfer: { outbound: true },
        functions: { executions: true, compute: true },
      },
      outputs: {
        monthlyCost: true,
        annualCost: true,
        breakdown: true,
      },
    }),
  };

  const gcpCalculator = {
    title: 'GCP Cost Calculator',
    key: 'gcp_cost_calculator',
    category: [{ uid: catUid('cloud_cost'), _content_type_uid: 'calculator_category' }],
    summary: 'Estimate monthly and annual Google Cloud Platform infrastructure costs including Compute Engine, Cloud Storage, Cloud SQL, Functions, and data transfer.',
    disclaimer: DISCLAIMER,
    enabled: true,
    config: JSON.stringify({
      calculatorType: 'GCP_COST',
      services: {
        computeEngine: { instances: true, machineTypes: true, hoursPerMonth: true },
        cloudStorage: { storage: true, operations: true },
        cloudSQL: { instances: true, tiers: true, storage: true },
        dataTransfer: { outbound: true },
        cloudFunctions: { invocations: true, compute: true },
      },
      outputs: {
        monthlyCost: true,
        annualCost: true,
        breakdown: true,
      },
    }),
  };

  const carbonFootprintCalculator = {
    title: 'Carbon Footprint Calculator',
    key: 'carbon_footprint_calculator',
    category: [{ uid: catUid('environment'), _content_type_uid: 'calculator_category' }],
    summary: 'Calculate your annual carbon footprint and discover how many trees you need to plant to offset it. Includes transportation, energy, and lifestyle factors.',
    disclaimer: DISCLAIMER,
    enabled: true,
    config: JSON.stringify({
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
      },
      outputs: {
        totalAnnualCO2: true,
        totalAnnualCO2Tons: true,
        treesNeeded: true,
        breakdown: true,
        monthlyBreakdown: true,
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
      co2PerTreePerYear: 20,
    }),
  };

  await upsertEntryByKey('calculator', 'key', npsCalculator);
  await upsertEntryByKey('calculator', 'key', incomeTaxCalculator);
  await upsertEntryByKey('calculator', 'key', awsCalculator);
  await upsertEntryByKey('calculator', 'key', azureCalculator);
  await upsertEntryByKey('calculator', 'key', gcpCalculator);
  await upsertEntryByKey('calculator', 'key', carbonFootprintCalculator);
}

async function seedEducation() {
  const loanAvoidance = {
    title: 'Loan Avoidance Tips',
    key: 'loan_avoidance_tips',
    category: 'Tips & Education',
    summary: 'Strategies to avoid/minimize loans and buy property with less debt.',
    order: 1,
    body: [
      '1) Emergency Fund First — Build 6 months of expenses before aggressive investing.',
      '2) Equity SIPs for Goals — Use SIPs for long-term wealth creation.',
      '3) Dedicated Goal Funds — Separate accounts for major planned expenses.',
      '4) Down Payment Strategy — Aim to save 40–50% before a home purchase.',
      '5) Rent vs Buy Analysis — Evaluate total cost and flexibility.',
      '6) Debt Snowball/Avalanche — Structured payoff strategies.',
    ].join('\n\n'),
  };

  await upsertEntryByKey('education_article', 'key', loanAvoidance);
}

async function seedCreditCards() {
  const sampleCard = {
    title: 'Sample Rewards Card (Demo)',
    name: 'Sample Rewards Card (Demo)',
    key: 'sample_rewards_card_demo',
    issuer: 'Demo Bank',
    annual_fee: 999,
    welcome_bonus: '5,000 points on first spend within 30 days.',
    lounge_access: 'Domestic lounge access (2/quarter)',
    insurance_coverage: 'Air travel insurance up to ₹5L (illustrative).',
    reward_structure: JSON.stringify({
      pointsPer100: {
        dining: 4,
        travel: 4,
        shopping: 2,
        fuel: 1,
        groceries: 2,
      },
      redemption: [
        { type: 'travel', examples: ['Dubai', 'Singapore', 'Thailand'], valuePerPointInr: 0.25 },
        { type: 'cashback', valuePerPointInr: 0.20 },
        { type: 'vouchers', valuePerPointInr: 0.22 },
      ],
      milestones: [{ spendInr: 200000, benefit: 'Extra 2,000 points' }],
    }),
  };

  await upsertEntryByKey('credit_card', 'key', sampleCard);
}

async function seedPages() {
  const pages = [
    {
      title: 'Financial Dashboard',
      key: 'dashboard',
      route: '/',
      description: 'Plan your future with precision using our intelligent financial tools.',
      seo_title: 'Financial Planning Dashboard | FinWise',
      seo_description: 'Comprehensive financial planning tools including calculators, tax planning, and investment advice.',
      enabled: true,
    },
    {
      title: 'Credit Card Rewards Optimizer',
      key: 'credit_cards',
      route: '/credit-cards',
      description: 'Compare cards based on your actual spending and map points to travel goals.',
      seo_title: 'Credit Card Rewards Optimizer | FinWise',
      seo_description: 'Find the best credit card for your spending pattern and maximize reward points.',
      enabled: true,
    },
    {
      title: 'Redemption Options',
      key: 'rewards',
      route: '/rewards',
      description: 'See how you can use your accumulated reward points.',
      seo_title: 'Reward Points Redemption | FinWise',
      seo_description: 'Explore travel packages, gold, vouchers and more redemption options for your credit card points.',
      enabled: true,
    },
    {
      title: 'Financial Education & Tips',
      key: 'education',
      route: '/education',
      description: 'Expert strategies to stay debt-free and build long-term wealth.',
      seo_title: 'Financial Education & Tips | FinWise',
      seo_description: 'Learn about loan avoidance, debt management, and smart financial planning strategies.',
      enabled: true,
    },
  ];

  for (const page of pages) {
    await upsertEntryByKey('page', 'key', page);
  }
}

async function seedDashboardCards() {
  const cards = [
    {
      title: 'NPS Calculator',
      key: 'dashboard_nps',
      description: 'Plan your retirement with National Pension System and estimate your monthly pension.',
      route: '/calculators/nps',
      icon_color: 'primary',
      border_color: 'primary',
      link_text: 'Calculate Retirement →',
      order: 1,
      enabled: true,
    },
    {
      title: 'Income Tax Planner',
      key: 'dashboard_tax',
      description: 'Compare Old vs New tax regimes with Section 24 and other deductions (FY 24-25).',
      route: '/calculators/tax',
      icon_color: 'success',
      border_color: 'success',
      link_text: 'Optimize Tax →',
      order: 2,
      enabled: true,
    },
    {
      title: 'SIP Calculator',
      key: 'dashboard_sip',
      description: 'Visualize the power of compounding for your monthly mutual fund investments.',
      route: '/calculators/sip',
      icon_color: 'blue-500',
      border_color: 'blue-500',
      link_text: 'Plan SIP →',
      order: 3,
      enabled: true,
    },
    {
      title: 'Inflation Calculator',
      key: 'dashboard_inflation',
      description: 'See how inflation eats your savings and calculate future costs of expenses.',
      route: '/calculators/inflation',
      icon_color: 'amber-500',
      border_color: 'amber-500',
      link_text: 'Check Future Cost →',
      order: 4,
      enabled: true,
    },
    {
      title: 'Home Loan EMI',
      key: 'dashboard_housing',
      description: 'Calculate your home loan EMI with full amortization schedule and total interest cost.',
      route: '/calculators/housing',
      icon_color: 'red-500',
      border_color: 'red-500',
      link_text: 'Check Home Loan →',
      order: 5,
      enabled: true,
    },
    {
      title: 'Gold Loan',
      key: 'dashboard_gold',
      description: 'Estimate your loan eligibility against gold jewelry based on current market rates.',
      route: '/calculators/gold',
      icon_color: 'yellow-600',
      border_color: 'yellow-600',
      link_text: 'Calculate Gold Loan →',
      order: 6,
      enabled: true,
    },
  ];

  for (const card of cards) {
    await upsertEntryByKey('dashboard_card', 'key', card);
  }
}

async function seedTravelGoals() {
  const goals = [
    {
      title: 'Dubai Package',
      name: 'Dubai Package',
      key: 'dubai_package',
      points_required: 50000,
      estimated_value: 45000,
      description: '4D/3N Dubai travel package',
      icon: 'Plane',
    },
    {
      title: 'Singapore Gateway',
      name: 'Singapore Gateway',
      key: 'singapore_gateway',
      points_required: 75000,
      estimated_value: 65000,
      description: 'Singapore Explorer package',
      icon: 'Plane',
    },
    {
      title: 'Thailand Retreat',
      name: 'Thailand Retreat',
      key: 'thailand_retreat',
      points_required: 40000,
      estimated_value: 35000,
      description: 'Thailand Beach Bliss package',
      icon: 'Plane',
    },
  ];

  for (const goal of goals) {
    await upsertEntryByKey('travel_goal', 'key', goal);
  }
}

async function seedRewardsCategories() {
  const categories = [
    {
      title: 'Travel Packages',
      key: 'travel_packages',
      icon: 'Plane',
      icon_color: 'blue-500',
      order: 1,
    },
    {
      title: 'Gold & Silver',
      key: 'gold_silver',
      icon: 'Coins',
      icon_color: 'yellow-500',
      order: 2,
    },
    {
      title: 'Vouchers & Merch',
      key: 'vouchers_merch',
      icon: 'ShoppingBag',
      icon_color: 'pink-500',
      order: 3,
    },
  ];

  const created: Record<string, any> = {};
  for (const cat of categories) {
    const res = await upsertEntryByKey('rewards_category', 'key', cat);
    created[cat.key] = res;
  }
  return created;
}

async function seedRewardsItems(categoryEntriesByKey: Record<string, any>) {
  const catUid = (key: string) => categoryEntriesByKey[key]?.uid;

  const items = [
    {
      title: 'Dubai 4D/3N',
      name: 'Dubai 4D/3N',
      key: 'dubai_4d3n',
      category: [{ uid: catUid('travel_packages'), _content_type_uid: 'rewards_category' }],
      points_required: '50,000 pts',
      value: '≈ ₹45,000',
      order: 1,
    },
    {
      title: 'Singapore Explorer',
      name: 'Singapore Explorer',
      key: 'singapore_explorer',
      category: [{ uid: catUid('travel_packages'), _content_type_uid: 'rewards_category' }],
      points_required: '75,000 pts',
      value: '≈ ₹65,000',
      order: 2,
    },
    {
      title: 'Thailand Beach Bliss',
      name: 'Thailand Beach Bliss',
      key: 'thailand_beach',
      category: [{ uid: catUid('travel_packages'), _content_type_uid: 'rewards_category' }],
      points_required: '40,000 pts',
      value: '≈ ₹35,000',
      order: 3,
    },
    {
      title: '24K Gold Coin (1g)',
      name: '24K Gold Coin (1g)',
      key: 'gold_coin_1g',
      category: [{ uid: catUid('gold_silver'), _content_type_uid: 'rewards_category' }],
      points_required: '12,000 pts',
      value: '≈ ₹8,000',
      order: 1,
    },
    {
      title: 'Silver Bar (10g)',
      name: 'Silver Bar (10g)',
      key: 'silver_bar_10g',
      category: [{ uid: catUid('gold_silver'), _content_type_uid: 'rewards_category' }],
      points_required: '2,500 pts',
      value: '≈ ₹1,200',
      order: 2,
    },
    {
      title: 'Amazon/Flipkart ₹5000',
      name: 'Amazon/Flipkart ₹5000',
      key: 'amazon_flipkart_5k',
      category: [{ uid: catUid('vouchers_merch'), _content_type_uid: 'rewards_category' }],
      points_required: '20,000 pts',
      value: '₹5,000',
      order: 1,
    },
    {
      title: 'Starbucks ₹1000',
      name: 'Starbucks ₹1000',
      key: 'starbucks_1k',
      category: [{ uid: catUid('vouchers_merch'), _content_type_uid: 'rewards_category' }],
      points_required: '4,000 pts',
      value: '₹1,000',
      order: 2,
    },
  ];

  for (const item of items) {
    await upsertEntryByKey('rewards_item', 'key', item);
  }
}

async function seedNavigation() {
  const navItems = [
    { title: 'Dashboard', label: 'Dashboard', key: 'nav_dashboard', route: '/', icon: 'LayoutDashboard', section: 'main', order: 1, enabled: true },
    { title: 'NPS Calculator', label: 'NPS Calculator', key: 'nav_nps', route: '/calculators/nps', icon: 'Calculator', section: 'calculators', order: 1, enabled: true },
    { title: 'Income Tax', label: 'Income Tax', key: 'nav_tax', route: '/calculators/tax', icon: 'Calculator', section: 'calculators', order: 2, enabled: true },
    { title: 'SIP Calculator', label: 'SIP Calculator', key: 'nav_sip', route: '/calculators/sip', icon: 'Calculator', section: 'calculators', order: 3, enabled: true },
    { title: 'Inflation', label: 'Inflation', key: 'nav_inflation', route: '/calculators/inflation', icon: 'Calculator', section: 'calculators', order: 4, enabled: true },
    { title: 'Generic EMI', label: 'Generic EMI', key: 'nav_emi', route: '/calculators/emi', icon: 'Calculator', section: 'calculators', order: 5, enabled: true },
    { title: 'Housing Loan', label: 'Housing Loan', key: 'nav_housing', route: '/calculators/housing', icon: 'Calculator', section: 'calculators', order: 6, enabled: true },
    { title: 'Gold Loan', label: 'Gold Loan', key: 'nav_gold', route: '/calculators/gold', icon: 'Calculator', section: 'calculators', order: 7, enabled: true },
    { title: 'Personal Loan', label: 'Personal Loan', key: 'nav_personal', route: '/calculators/personal', icon: 'Calculator', section: 'calculators', order: 8, enabled: true },
    { title: 'PF Calculator', label: 'PF Calculator', key: 'nav_pf', route: '/calculators/pf', icon: 'Calculator', section: 'calculators', order: 9, enabled: true },
    { title: 'Gratuity', label: 'Gratuity', key: 'nav_gratuity', route: '/calculators/gratuity', icon: 'Calculator', section: 'calculators', order: 10, enabled: true },
    { title: 'SSY (Sukanya)', label: 'SSY (Sukanya)', key: 'nav_ssy', route: '/calculators/ssy', icon: 'Calculator', section: 'calculators', order: 11, enabled: true },
    { title: 'Marriage Planning', label: 'Marriage Planning', key: 'nav_marriage', route: '/calculators/marriage', icon: 'Calculator', section: 'calculators', order: 12, enabled: true },
    { title: 'Currency Converter', label: 'Currency Converter', key: 'nav_currency', route: '/calculators/currency', icon: 'Calculator', section: 'calculators', order: 13, enabled: true },
    { title: 'AWS Cost', label: 'AWS Cost', key: 'nav_aws', route: '/calculators/aws', icon: 'Calculator', section: 'calculators', order: 14, enabled: true },
    { title: 'Azure Cost', label: 'Azure Cost', key: 'nav_azure', route: '/calculators/azure', icon: 'Calculator', section: 'calculators', order: 15, enabled: true },
    { title: 'GCP Cost', label: 'GCP Cost', key: 'nav_gcp', route: '/calculators/gcp', icon: 'Calculator', section: 'calculators', order: 16, enabled: true },
    { title: 'Carbon Footprint', label: 'Carbon Footprint', key: 'nav_carbon', route: '/calculators/carbon', icon: 'Leaf', section: 'calculators', order: 17, enabled: true },
    { title: 'Card Comparison', label: 'Card Comparison', key: 'nav_credit_cards', route: '/credit-cards', icon: 'CreditCard', section: 'credit', order: 1, enabled: true },
    { title: 'Redemption Rewards', label: 'Redemption Rewards', key: 'nav_rewards', route: '/rewards', icon: 'Gift', section: 'credit', order: 2, enabled: true },
    { title: 'Education & Tips', label: 'Education & Tips', key: 'nav_education', route: '/education', icon: 'GraduationCap', section: 'learning', order: 1, enabled: true },
  ];

  for (const item of navItems) {
    await upsertEntryByKey('navigation_item', 'key', item);
  }
}

async function seedCreditCardsExtended() {
  const cards = [
    {
      title: 'FinWise Infinity',
      name: 'FinWise Infinity',
      key: 'finwise_infinity',
      issuer: 'FinWise Bank',
      annual_fee: 5000,
      welcome_bonus: '5,000 points on first spend within 30 days.',
      lounge_access: 'Unlimited domestic and international lounge access',
      insurance_coverage: 'Air travel insurance up to ₹50L, lost baggage coverage.',
      reward_structure: JSON.stringify({
        rewardRate: 5,
        pointValue: 1,
        loungeAccess: true,
        benefits: ['Unlimited Lounge', 'Travel Insurance', 'Concierge'],
        categoryMultipliers: { dining: 2, travel: 3, shopping: 1, fuel: 1, groceries: 1.5 },
        redemption: [
          { type: 'travel', examples: ['Dubai', 'Singapore', 'Thailand'], valuePerPointInr: 0.25 },
          { type: 'cashback', valuePerPointInr: 0.20 },
          { type: 'vouchers', valuePerPointInr: 0.22 },
        ],
        milestones: [{ spendInr: 200000, benefit: 'Extra 2,000 points' }],
      }),
    },
    {
      title: 'Reward Max Pro',
      name: 'Reward Max Pro',
      key: 'reward_max_pro',
      issuer: 'Reward Bank',
      annual_fee: 1000,
      welcome_bonus: '2,000 points on first transaction.',
      lounge_access: 'No lounge access',
      insurance_coverage: 'Basic purchase protection.',
      reward_structure: JSON.stringify({
        rewardRate: 2,
        pointValue: 0.25,
        loungeAccess: false,
        benefits: ['Milestone Vouchers', 'Fuel Surcharge Waiver'],
        categoryMultipliers: { dining: 1.5, travel: 1, shopping: 2, fuel: 1, groceries: 2 },
        redemption: [
          { type: 'travel', examples: ['Domestic packages'], valuePerPointInr: 0.20 },
          { type: 'cashback', valuePerPointInr: 0.15 },
          { type: 'vouchers', valuePerPointInr: 0.18 },
        ],
        milestones: [{ spendInr: 100000, benefit: 'Extra 1,000 points' }],
      }),
    },
    {
      title: 'Traveler Select',
      name: 'Traveler Select',
      key: 'traveler_select',
      issuer: 'Travel Bank',
      annual_fee: 2500,
      welcome_bonus: '10,000 points on first international transaction.',
      lounge_access: 'Priority Pass with 4 visits per quarter',
      insurance_coverage: 'Comprehensive travel insurance, trip cancellation coverage.',
      reward_structure: JSON.stringify({
        rewardRate: 4,
        pointValue: 0.7,
        loungeAccess: true,
        benefits: ['Priority Pass', 'Foreign Markup 1.99%'],
        categoryMultipliers: { dining: 1, travel: 5, shopping: 1, fuel: 1, groceries: 1 },
        redemption: [
          { type: 'travel', examples: ['Dubai', 'Singapore', 'Thailand', 'Europe'], valuePerPointInr: 0.30 },
          { type: 'cashback', valuePerPointInr: 0.25 },
          { type: 'vouchers', valuePerPointInr: 0.28 },
        ],
        milestones: [{ spendInr: 300000, benefit: 'Extra 5,000 points' }],
      }),
    },
  ];

  for (const card of cards) {
    await upsertEntryByKey('credit_card', 'key', card);
  }
}

async function main() {
  console.log('Seeding stack:', API_KEY, 'host:', HOST, 'locale:', LOCALE);

  // 1) Create content types
  console.log('\n📦 Creating content types...');
  await upsertContentType(CT_CALCULATOR_CATEGORY);
  await upsertContentType(CT_CALCULATOR);
  await upsertContentType(CT_EDUCATION_ARTICLE);
  await upsertContentType(CT_CREDIT_CARD);
  await upsertContentType(CT_PAGE);
  await upsertContentType(CT_DASHBOARD_CARD);
  await upsertContentType(CT_TRAVEL_GOAL);
  await upsertContentType(CT_REWARDS_CATEGORY);
  await upsertContentType(CT_REWARDS_ITEM);
  await upsertContentType(CT_NAVIGATION_ITEM);

  // 2) Seed base entries (content types have no publish in Management SDK; only entries/assets do)
  console.log('\n🌱 Seeding entries...');
  const categories = await seedCategories();
  await seedCalculators(categories);
  await seedEducation();
  await seedCreditCards();
  await seedCreditCardsExtended();
  await seedPages();
  await seedDashboardCards();
  await seedTravelGoals();
  const rewardsCategories = await seedRewardsCategories();
  await seedRewardsItems(rewardsCategories);
  await seedNavigation();

  console.log('\n✅ Seeding completed successfully!');
  console.log('\n📋 Content Types Created:');
  console.log('  - calculator_category');
  console.log('  - calculator');
  console.log('  - education_article');
  console.log('  - credit_card');
  console.log('  - page');
  console.log('  - dashboard_card');
  console.log('  - travel_goal');
  console.log('  - rewards_category');
  console.log('  - rewards_item');
  console.log('  - navigation_item');
  console.log('\n✨ All content is now published and available in Contentstack!');
  console.log('\n💡 Note: Some entries may need manual publishing if automatic publish failed.');
}

main().catch((err) => {
  console.error('❌ Seeder failed:', err?.message || err);
  process.exit(1);
});

