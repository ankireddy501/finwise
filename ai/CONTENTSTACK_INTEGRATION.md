# Contentstack Integration - Complete Guide

## Overview

All content, assets, and entries are now configured to be published automatically and fetched from Contentstack using the delivery token `cs1f8c9db6e675ceffa45fbc5c`.

## Changes Made

### 1. Updated Delivery Token
- **File**: `src/lib/contentstack.ts`
- **Change**: Updated default delivery token to `cs1f8c9db6e675ceffa45fbc5c`
- **Note**: Can be overridden via `VITE_CONTENTSTACK_DELIVERY_TOKEN` environment variable

### 2. Added Publish Functionality to Seed Scripts

#### Main Seed Script (`seed.ts`)
- ✅ Added `publishContentType()` function
- ✅ Added `publishEntryByKey()` function that publishes entries after creation/update
- ✅ All content types are published after creation
- ✅ All entries are published after creation/update

#### Additional Content Seed (`additional-content-seed.ts`)
- ✅ Added publish functionality for NGO organizations and cloud regions
- ✅ Content types are published after creation

#### Assets Seed (`assets-seed.ts`)
- ✅ Assets are published after upload

### 3. Created Contentstack Hooks (`src/lib/contentstack-hooks.ts`)

New React hooks for fetching Contentstack data:

- `useCalculatorCategories()` - Fetch calculator categories
- `useCalculators()` - Fetch all calculators
- `useCalculator(key)` - Fetch specific calculator by key
- `useCreditCards()` - Fetch credit cards
- `useEducationArticles()` - Fetch education articles
- `useTravelGoals()` - Fetch travel goals
- `useRewardsCategories()` - Fetch rewards categories
- `useRewardsItems(categoryKey?)` - Fetch rewards items (optionally by category)
- `useDashboardCards()` - Fetch dashboard cards
- `useNavigationItems()` - Fetch navigation items
- `useNGOsByCity(city)` - Fetch NGOs for a city
- `useCloudRegions(provider?)` - Fetch cloud regions (optionally by provider)

### 4. Updated Components to Use Contentstack

#### Dashboard (`src/App.tsx`)
- ✅ Now fetches dashboard cards from Contentstack
- ✅ Falls back to static data if fetch fails
- ✅ Shows loading state

#### Credit Cards Page (`src/pages/CreditCardsPage.tsx`)
- ✅ Fetches credit cards from Contentstack
- ✅ Fetches travel goals from Contentstack
- ✅ Parses reward structure JSON from Contentstack
- ✅ Falls back to static data if fetch fails

#### Rewards Page (`src/pages/RewardsPage.tsx`)
- ✅ Fetches rewards categories from Contentstack
- ✅ Fetches rewards items by category from Contentstack
- ✅ Falls back to static data if fetch fails

#### Education Page (`src/pages/EducationPage.tsx`)
- ✅ Fetches education articles from Contentstack
- ✅ Uses `education_article` content type
- ✅ Falls back to static data if fetch fails

#### Carbon Footprint Calculator (`src/pages/calculators/CarbonFootprintCalculator.tsx`)
- ✅ Fetches NGOs by city from Contentstack
- ✅ Fetches cloud regions by provider from Contentstack
- ✅ Uses cloud region carbon intensity from Contentstack
- ✅ Falls back to static data if fetch fails

## Content Types That Need Publishing

After running seed scripts, ensure these are published in Contentstack:

### Content Types:
1. `calculator_category`
2. `calculator`
3. `education_article`
4. `credit_card`
5. `page`
6. `dashboard_card`
7. `travel_goal`
8. `rewards_category`
9. `rewards_item`
10. `navigation_item`
11. `ngo_organization` (from additional-content-seed.ts)
12. `cloud_region` (from additional-content-seed.ts)

### Entries:
All entries are automatically published by the seed scripts. However, if automatic publishing fails, you may need to:
1. Go to Contentstack Dashboard
2. Navigate to each content type
3. Select all entries
4. Click "Publish" → "Publish Now"

### Assets:
Assets are automatically published by the assets-seed.ts script.

## Environment Variables

Update your `.env` file or Contentstack Launch environment variables:

```env
VITE_CONTENTSTACK_API_KEY=blt0feaf330086422ec
VITE_CONTENTSTACK_DELIVERY_TOKEN=cs1f8c9db6e675ceffa45fbc5c
VITE_CONTENTSTACK_ENVIRONMENT=production
VITE_CONTENTSTACK_HOST=au-cdn.contentstack.com
```

## Running Seed Scripts

### 1. Main Content Types and Entries
```bash
cd slfp-contentstack-seed
npm run seed
```

This will:
- Create all content types
- Publish all content types
- Create all entries
- Publish all entries

### 2. Additional Content (NGOs, Cloud Regions)
```bash
npm run seed:additional
```

This will:
- Create NGO and Cloud Region content types
- Publish content types
- Create entries
- Publish entries
- Update Carbon Footprint Calculator config

### 3. Assets
```bash
npm run seed:assets
```

This will:
- Upload branding assets
- Upload travel package placeholders
- Publish all assets

### 4. All Scripts
```bash
npm run seed:all
```

Runs all three scripts in sequence.

## Frontend Data Flow

### Before (Hardcoded):
```typescript
const cards = [
  { name: "FinWise Infinity", ... },
  // Static data
];
```

### After (Contentstack):
```typescript
const { cards, loading } = useCreditCards();
// Fetches from Contentstack
// Falls back to static data if fetch fails
```

## Error Handling

All hooks include:
- ✅ Loading states
- ✅ Error handling
- ✅ Fallback to static data if Contentstack fetch fails
- ✅ Console error logging for debugging

## Contentstack Query Examples

### Fetch All Calculators
```typescript
const Query = Stack.ContentType('calculator')
  .Entry.Query()
  .where('enabled', true);
const result = await Query.toJSON().find();
```

### Fetch Calculator by Key
```typescript
const Query = Stack.ContentType('calculator')
  .Entry.Query()
  .where('key', 'nps_calculator')
  .where('enabled', true);
const result = await Query.toJSON().find();
```

### Fetch NGOs by City
```typescript
const cityQuery = Stack.ContentType('ngo_organization')
  .Entry.Query()
  .where('active', true)
  .where('city', 'Mumbai');

const nationalQuery = Stack.ContentType('ngo_organization')
  .Entry.Query()
  .where('active', true)
  .where('is_national', true);
```

## Verification Checklist

After running seed scripts, verify:

- [ ] All content types are created in Contentstack
- [ ] All content types are published
- [ ] All entries are created
- [ ] All entries are published
- [ ] Assets are uploaded and published
- [ ] Frontend can fetch data from Contentstack
- [ ] Fallback data works if Contentstack is unavailable

## Troubleshooting

### Entries Not Showing in Frontend
1. Check entries are published (not just saved)
2. Verify delivery token has access to the environment
3. Check browser console for Contentstack errors
4. Verify content type UIDs match exactly

### Publishing Fails
- Some entries may need manual publishing
- Check Contentstack logs for specific errors
- Verify Management Token has publish permissions

### Data Not Loading
- Check network tab for API calls
- Verify delivery token is correct
- Check environment variable is set
- Verify content is published (not draft)

## Next Steps

1. **Run all seed scripts** to populate Contentstack
2. **Verify publishing** in Contentstack dashboard
3. **Test frontend** to ensure data loads from Contentstack
4. **Update content** in Contentstack UI (no code changes needed!)

---

**Status**: ✅ All components updated to fetch from Contentstack with automatic publishing enabled in seed scripts!
