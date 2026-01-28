# Additional Contentstack Content Types and Entries

## Overview

This document describes the additional content types and entries needed for the enhanced Carbon Footprint Calculator features:
1. **NGO Organizations** - For city-based NGO suggestions
2. **Cloud Regions** - For cloud infrastructure carbon footprint calculation

## New Content Types

### 1. NGO Organization (`ngo_organization`)

**Purpose**: Store information about NGOs and organizations that help with tree planting and environmental conservation.

**Fields**:
- `title` (text, mandatory) - Display title
- `name` (text, mandatory, unique) - Unique identifier/key
- `description` (text, multiline) - What the NGO does
- `website` (text) - Website URL
- `phone` (text) - Contact phone number
- `email` (text) - Contact email
- `city` (text, mandatory) - City where NGO operates
- `state` (text) - State/Province
- `country` (text, default: "India") - Country
- `focus_areas` (text, multiple) - Array of focus areas (e.g., "Tree planting", "Urban greening")
- `is_national` (boolean, default: false) - Whether NGO operates nationally
- `active` (boolean, default: true) - Whether NGO is currently active

**Usage**: Frontend queries NGOs by city to show relevant organizations in the Carbon Footprint Calculator.

### 2. Cloud Region (`cloud_region`)

**Purpose**: Store cloud provider regions with their carbon emission factors for accurate carbon footprint calculations.

**Fields**:
- `title` (text, mandatory) - Display title
- `region_code` (text, mandatory, unique) - Unique region identifier (e.g., "ap-south-1")
- `region_name` (text, mandatory) - Human-readable region name (e.g., "Mumbai")
- `provider` (text, mandatory) - Cloud provider ("AWS", "Azure", "GCP")
- `country` (text) - Country where region is located
- `city` (text) - City where region is located
- `carbon_intensity` (number, mandatory) - kg CO₂ per kWh for this region
- `description` (text, multiline) - Additional information about the region
- `active` (boolean, default: true) - Whether region is available

**Usage**: Frontend uses region codes to look up carbon intensity factors for cloud infrastructure calculations.

## Updated Content

### Carbon Footprint Calculator Config

The existing `carbon_footprint_calculator` entry in the `calculator` content type needs to be updated with:

**New Config Fields**:
```json
{
  "inputs": {
    "cloudInfrastructure": {
      "cloudProvider": { "options": ["aws", "azure", "gcp"], "default": "aws" },
      "cloudRegion": { "options": [...], "default": "ap-south-1" },
      "computeInstances": { "min": 0, "max": 50, "default": 2 },
      "computeHoursPerMonth": { "min": 0, "max": 744, "default": 730 },
      "computeInstanceType": { "options": ["small", "medium", "large", "xlarge"], "default": "medium" },
      "storageGB": { "min": 0, "max": 100000, "default": 100 },
      "dataTransferGB": { "min": 0, "max": 100000, "default": 100 },
      "databaseInstances": { "min": 0, "max": 20, "default": 1 },
      "databaseHoursPerMonth": { "min": 0, "max": 744, "default": 730 }
    }
  },
  "outputs": {
    "cloudCO2Annual": true
  },
  "cloudEmissionFactors": {
    "ap-south-1": 0.82,
    "ap-southeast-1": 0.50,
    ...
  },
  "computePowerConsumption": {
    "small": 0.05,
    "medium": 0.10,
    "large": 0.20,
    "xlarge": 0.40
  },
  "storagePowerConsumption": 0.0001,
  "dataTransferPowerConsumption": 0.0005,
  "pueFactor": 1.5,
  "features": {
    "cityBasedNGOs": true,
    "cloudInfrastructure": true
  }
}
```

## Seed Script

A new seed script `additional-content-seed.ts` has been created to:

1. **Create Content Types**:
   - `ngo_organization`
   - `cloud_region`

2. **Seed NGO Entries** (20+ NGOs):
   - Mumbai: Grow-Trees.com, Vanashakti, Mumbai Tree Planting Initiative
   - Delhi: Delhi Greens, I Am Gurgaon, Green Yatra
   - Bangalore: SayTrees, Hasiru Dala, Green Bangalore
   - Hyderabad: Hyderabad Tree Planting Foundation, Green Hyderabad
   - Chennai: Chennai Tree Planting Society, Environmentalist Foundation of India
   - Kolkata: Kolkata Green Initiative, Nature Mates
   - Pune: Pune Tree Planting Initiative, Eco Pune
   - National: One Tree Planted, SankalpTaru Foundation

3. **Seed Cloud Region Entries** (11 regions):
   - AWS: Mumbai, Singapore, Virginia, Oregon, Ireland
   - Azure: Central India, East US, West Europe
   - GCP: Mumbai, Iowa, Belgium

4. **Update Carbon Footprint Calculator**:
   - Adds cloud infrastructure inputs
   - Adds cloud emission factors
   - Enables new features

## Running the Seed Script

### Prerequisites

1. Ensure `.env` file exists in `slfp-contentstack-seed/` directory:
```env
CS_API_KEY=blt0feaf330086422ec
CS_MANAGEMENT_TOKEN=your_management_token
CS_HOST=au-api.contentstack.com
CS_LOCALE=en-us
```

2. Install dependencies (if not already done):
```bash
cd slfp-contentstack-seed
npm install
```

### Run the Script

```bash
cd slfp-contentstack-seed
npx tsx additional-content-seed.ts
```

Or if using Node.js directly:
```bash
node --import tsx additional-content-seed.ts
```

### Expected Output

```
🌱 Seeding additional content types and entries...
Stack: blt0feaf330086422ec Host: au-api.contentstack.com Locale: en-us

📦 Creating additional content types...
Creating content type: ngo_organization
Creating content type: cloud_region

🌱 Seeding entries...

🌳 Seeding NGO Organizations...
Creating entry in ngo_organization: grow-trees-com
Creating entry in ngo_organization: vanashakti
...
✅ Seeded 20 NGO organizations

☁️ Seeding Cloud Regions...
Creating entry in cloud_region: ap-south-1
Creating entry in cloud_region: ap-southeast-1
...
✅ Seeded 11 cloud regions

🌍 Updating Carbon Footprint Calculator config...
✅ Updated Carbon Footprint Calculator config

✅ Additional seeding completed successfully!

📋 New Content Types Created:
  - ngo_organization
  - cloud_region

✨ All additional content is now available in Contentstack!
```

## Frontend Integration

### Querying NGOs by City

```typescript
import Stack from '@/lib/contentstack';

// Get NGOs for a specific city
const getNGOsForCity = async (city: string) => {
  const query = Stack.contentType('ngo_organization')
    .entry()
    .query()
    .where('city', city)
    .or()
    .where('is_national', true)
    .toJSON()
    .find();
  
  return query;
};
```

### Querying Cloud Regions

```typescript
// Get all active cloud regions
const getCloudRegions = async (provider?: string) => {
  let query = Stack.contentType('cloud_region')
    .entry()
    .query()
    .where('active', true);
  
  if (provider) {
    query = query.where('provider', provider);
  }
  
  return query.toJSON().find();
};
```

### Using Updated Calculator Config

```typescript
// Get Carbon Footprint Calculator config
const getCarbonFootprintConfig = async () => {
  const entry = await Stack.contentType('calculator')
    .entry()
    .query()
    .where('key', 'carbon_footprint_calculator')
    .toJSON()
    .find();
  
  const config = JSON.parse(entry.items[0].config);
  return config;
};
```

## Content Structure Summary

### NGO Organization Example

```json
{
  "title": "SayTrees",
  "name": "saytrees",
  "description": "Bangalore-based NGO focused on tree planting...",
  "website": "https://www.saytrees.org",
  "phone": "+91-80-4090-0000",
  "email": "info@saytrees.org",
  "city": "Bangalore",
  "state": "Karnataka",
  "country": "India",
  "focus_areas": ["Tree planting", "Urban forestry", "Corporate partnerships"],
  "is_national": false,
  "active": true
}
```

### Cloud Region Example

```json
{
  "title": "AWS Mumbai (ap-south-1)",
  "region_code": "ap-south-1",
  "region_name": "Mumbai",
  "provider": "AWS",
  "country": "India",
  "city": "Mumbai",
  "carbon_intensity": 0.82,
  "description": "AWS Asia Pacific (Mumbai) region - India grid average",
  "active": true
}
```

## Maintenance

### Adding New NGOs

1. Add entry to `seedNGOs()` function in `additional-content-seed.ts`
2. Run the seed script again (it will update existing entries)

### Adding New Cloud Regions

1. Add entry to `seedCloudRegions()` function
2. Update `cloudEmissionFactors` in calculator config
3. Run the seed script

### Updating Carbon Intensity

1. Update `carbon_intensity` field in cloud region entry via Contentstack UI
2. Or update in seed script and re-run

## Notes

- The seed script uses `upsertEntryByKey` which will update existing entries if they already exist
- Content types are only created if they don't exist (won't overwrite)
- All entries are created with `active: true` by default
- National NGOs are marked with `is_national: true` and appear for all cities

---

**Next Steps**: Run the seed script to populate Contentstack with the new content types and entries!
