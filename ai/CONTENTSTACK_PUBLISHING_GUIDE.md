# Contentstack Publishing & Integration Guide

## Summary

All seed scripts have been updated to automatically publish content types, entries, and assets. The frontend has been updated to fetch all content from Contentstack using the delivery token `cs1f8c9db6e675ceffa45fbc5c`.

## Key Changes

### 1. Delivery Token Updated
- **File**: `src/lib/contentstack.ts`
- **New Token**: `cs1f8c9db6e675ceffa45fbc5c`
- **Environment Variable**: `VITE_CONTENTSTACK_DELIVERY_TOKEN`

### 2. Automatic Publishing

#### Content Types
All content types are automatically published after creation:
- `calculator_category`
- `calculator`
- `education_article`
- `credit_card`
- `page`
- `dashboard_card`
- `travel_goal`
- `rewards_category`
- `rewards_item`
- `navigation_item`
- `ngo_organization`
- `cloud_region`

#### Entries
All entries are automatically published after creation/update:
- Categories
- Calculators
- Credit Cards
- Education Articles
- Dashboard Cards
- Travel Goals
- Rewards Categories & Items
- Navigation Items
- NGO Organizations
- Cloud Regions

#### Assets
All assets are automatically published after upload:
- Favicon
- Logo
- Travel package images

### 3. Frontend Integration

#### New Hooks Library
Created `src/lib/contentstack-hooks.ts` with React hooks:
- `useCalculatorCategories()`
- `useCalculators()`
- `useCalculator(key)`
- `useCreditCards()`
- `useEducationArticles()`
- `useTravelGoals()`
- `useRewardsCategories()`
- `useRewardsItems(categoryKey?)`
- `useDashboardCards()`
- `useNavigationItems()`
- `useNGOsByCity(city)`
- `useCloudRegions(provider?)`

#### Updated Components
- ✅ `App.tsx` - Dashboard fetches cards from Contentstack
- ✅ `CreditCardsPage.tsx` - Fetches cards and travel goals
- ✅ `RewardsPage.tsx` - Fetches categories and items
- ✅ `EducationPage.tsx` - Fetches articles
- ✅ `CarbonFootprintCalculator.tsx` - Fetches NGOs and cloud regions

## Running Seed Scripts

### Step 1: Main Content
```bash
cd slfp-contentstack-seed
npm run seed
```

**What it does:**
1. Creates 10 content types
2. Publishes all content types
3. Creates ~50+ entries
4. Publishes all entries

### Step 2: Additional Content
```bash
npm run seed:additional
```

**What it does:**
1. Creates 2 new content types (NGO, Cloud Region)
2. Publishes content types
3. Creates 20+ NGO entries
4. Creates 11 cloud region entries
5. Publishes all entries
6. Updates Carbon Footprint Calculator config

### Step 3: Assets
```bash
npm run seed:assets
```

**What it does:**
1. Uploads branding assets (favicon, logo)
2. Creates placeholder images
3. Publishes all assets

### Step 4: All Scripts
```bash
npm run seed:all
```

Runs all three scripts in sequence.

## Verification

After running seed scripts:

1. **Check Contentstack Dashboard**:
   - Go to https://au-app.contentstack.com/
   - Verify all content types exist
   - Verify all entries are created
   - Verify entries show "Published" status

2. **Check Assets**:
   - Go to Assets section
   - Verify favicon and logo are uploaded
   - Verify assets show "Published" status

3. **Test Frontend**:
   - Start dev server: `npm run dev`
   - Check browser console for Contentstack API calls
   - Verify data loads from Contentstack
   - Check Network tab for API responses

## Manual Publishing (If Needed)

If automatic publishing fails:

1. **Content Types**:
   - Go to Contentstack → Settings → Content Types
   - Select content type
   - Click "Publish"

2. **Entries**:
   - Go to Contentstack → [Content Type]
   - Select entries
   - Click "Publish" → "Publish Now"

3. **Assets**:
   - Go to Contentstack → Assets
   - Select assets
   - Click "Publish"

## Environment Setup

### For Development
Create `.env` file:
```env
VITE_CONTENTSTACK_API_KEY=blt0feaf330086422ec
VITE_CONTENTSTACK_DELIVERY_TOKEN=cs1f8c9db6e675ceffa45fbc5c
VITE_CONTENTSTACK_ENVIRONMENT=production
VITE_CONTENTSTACK_HOST=au-cdn.contentstack.com
```

### For Contentstack Launch
Set environment variables in Launch dashboard:
- `VITE_CONTENTSTACK_API_KEY`
- `VITE_CONTENTSTACK_DELIVERY_TOKEN`
- `VITE_CONTENTSTACK_ENVIRONMENT`
- `VITE_CONTENTSTACK_HOST`

## Data Flow

```
Contentstack CMS
    ↓ (Publish)
Contentstack Delivery API
    ↓ (Fetch via Delivery Token)
React Hooks (contentstack-hooks.ts)
    ↓ (Provide data)
React Components
    ↓ (Render)
User Interface
```

## Fallback Behavior

All components include fallback to static data if:
- Contentstack API fails
- Network error occurs
- Content not found
- Delivery token invalid

This ensures the app always works, even if Contentstack is unavailable.

## Troubleshooting

### "Content not loading"
1. Check delivery token is correct
2. Verify content is published (not draft)
3. Check browser console for errors
4. Verify environment variable is set

### "Publishing failed"
1. Check Management Token permissions
2. Verify content type schema is valid
3. Check Contentstack logs
4. Try manual publishing

### "Data mismatch"
1. Verify field names match exactly
2. Check JSON parsing (for config fields)
3. Verify content type UIDs are correct
4. Check data types match schema

---

**Status**: ✅ All content types, entries, and assets are configured for automatic publishing. Frontend fetches all data from Contentstack!
