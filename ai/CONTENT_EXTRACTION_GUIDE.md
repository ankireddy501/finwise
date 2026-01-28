# Content Extraction Guide for Contentstack

This document lists all content that has been extracted from the codebase and moved to Contentstack for easy management.

## Content Types Created

### 1. **Page** (`page`)
Manages page metadata and SEO information.

**Fields:**
- Title
- Key (unique)
- Route
- Description
- SEO Title
- SEO Description
- Enabled

**Sample Entries:**
- Dashboard (`/`)
- Credit Cards (`/credit-cards`)
- Rewards (`/rewards`)
- Education (`/education`)

---

### 2. **Dashboard Card** (`dashboard_card`)
Manages calculator cards displayed on the dashboard.

**Fields:**
- Title
- Key (unique)
- Description
- Route
- Icon Color
- Border Color
- Link Text
- Order
- Enabled

**Sample Entries:**
- NPS Calculator
- Income Tax Planner
- SIP Calculator
- Inflation Calculator
- Home Loan EMI
- Gold Loan

---

### 3. **Calculator Category** (`calculator_category`)
Top-level categories for organizing calculators.

**Fields:**
- Title
- Key (unique)
- Description
- Order
- Icon

**Sample Entries:**
- Investments
- Loans
- Retirement
- Family
- Tax
- Currency

---

### 4. **Calculator** (`calculator`)
Calculator metadata and configuration.

**Fields:**
- Title
- Key (unique)
- Category (reference)
- Summary
- Disclaimer
- Config (JSON string)
- Enabled

**Sample Entries:**
- NPS Calculator
- Income Tax Calculator (with Section 24)

---

### 5. **Credit Card** (`credit_card`)
Credit card catalog with rewards structure.

**Fields:**
- Name
- Key (unique)
- Issuer
- Annual Fee
- Welcome Bonus
- Lounge Access
- Insurance Coverage
- Reward Structure (JSON string)

**Sample Entries:**
- FinWise Infinity
- Reward Max Pro
- Traveler Select

---

### 6. **Travel Goal** (`travel_goal`)
Travel goals for credit card reward point mapping.

**Fields:**
- Name
- Key (unique)
- Points Required
- Estimated Value (INR)
- Description
- Icon

**Sample Entries:**
- Dubai Package (50,000 pts)
- Singapore Gateway (75,000 pts)
- Thailand Retreat (40,000 pts)

---

### 7. **Rewards Category** (`rewards_category`)
Categories for reward redemption options.

**Fields:**
- Title
- Key (unique)
- Icon
- Icon Color
- Order

**Sample Entries:**
- Travel Packages
- Gold & Silver
- Vouchers & Merch

---

### 8. **Rewards Item** (`rewards_item`)
Individual redemption items.

**Fields:**
- Name
- Key (unique)
- Category (reference)
- Points Required
- Value
- Order

**Sample Entries:**
- Dubai 4D/3N
- Singapore Explorer
- 24K Gold Coin (1g)
- Amazon/Flipkart ₹5000
- Starbucks ₹1000

---

### 9. **Navigation Item** (`navigation_item`)
Sidebar navigation items.

**Fields:**
- Label
- Key (unique)
- Route
- Icon
- Section
- Order
- Enabled

**Sample Entries:**
- Dashboard
- All calculator links
- Credit Cards
- Rewards
- Education

---

### 10. **Education Article** (`education_article`)
Financial education modules and tips.

**Fields:**
- Title
- Key (unique)
- Category
- Summary
- Body
- Order

**Sample Entries:**
- Loan Avoidance Tips

---

## Content Extracted from Codebase

### Dashboard Content
- ✅ Page title: "Financial Dashboard"
- ✅ Page description
- ✅ All 6 calculator cards (NPS, Tax, SIP, Inflation, Housing, Gold)
- ✅ Credit Rewards section content

### Credit Cards Page
- ✅ Page title and description
- ✅ All credit card data (3 cards with full reward structures)
- ✅ Travel goals (Dubai, Singapore, Thailand)
- ✅ Category multipliers for spending

### Rewards Page
- ✅ Page title and description
- ✅ 3 redemption categories (Travel, Gold/Silver, Vouchers)
- ✅ All redemption items with points and values
- ✅ Call-to-action content

### Navigation
- ✅ All sidebar navigation items
- ✅ Section groupings (Calculators, Credit & Rewards, Learning)
- ✅ Icons and routes

### Calculator Pages
- ✅ Calculator metadata (titles, descriptions)
- ✅ Calculator configurations (JSON)
- ✅ Disclaimers

### Education Page
- ✅ Article titles and content
- ✅ Categories
- ✅ Loan avoidance tips content

---

## Assets & Images Needed

### Recommended Assets to Upload to Contentstack

1. **Logo/Branding**
   - FinWise logo (SVG/PNG)
   - Favicon

2. **Calculator Icons** (if using custom images)
   - NPS icon
   - Tax icon
   - SIP icon
   - Loan icons
   - Retirement icons

3. **Illustrations** (optional)
   - Dashboard hero image
   - Credit card comparison illustration
   - Financial planning graphics

4. **Travel Package Images** (for rewards)
   - Dubai package image
   - Singapore package image
   - Thailand package image

### How to Add Assets

1. Go to Contentstack Dashboard → **Assets**
2. Click **Upload** or drag & drop files
3. Organize in folders:
   - `/images/logo`
   - `/images/calculators`
   - `/images/travel-packages`
   - `/images/illustrations`

4. Reference assets in content entries using the asset field type

---

## Content Management Workflow

### Adding New Content

1. **New Calculator:**
   - Create entry in `calculator_category` (if new category)
   - Create entry in `calculator` with config JSON
   - Create entry in `dashboard_card` (if shown on dashboard)
   - Create entry in `navigation_item`

2. **New Credit Card:**
   - Create entry in `credit_card`
   - Update reward structure JSON

3. **New Travel Goal:**
   - Create entry in `travel_goal`
   - Points will automatically map in the optimizer

4. **New Rewards Item:**
   - Create entry in `rewards_category` (if new category)
   - Create entry in `rewards_item`

### Updating Content

All content can be updated directly in Contentstack without code changes:
- Calculator descriptions
- Credit card details
- Reward point values
- Navigation labels
- Page SEO metadata

---

## Next Steps

1. **Run the seed script:**
   ```bash
   cd slfp-contentstack-seed
   node --import tsx seed.ts
   ```

2. **Verify content in Contentstack:**
   - Check all content types are created
   - Verify entries are populated
   - Review JSON fields are properly formatted

3. **Update React components** (next phase):
   - Modify components to fetch from Contentstack
   - Replace hardcoded data with API calls
   - Add loading states and error handling

4. **Upload assets:**
   - Add logo and branding images
   - Upload travel package images
   - Add any custom illustrations

---

## Content Structure Summary

```
Contentstack Stack
├── calculator_category (6 entries)
├── calculator (2 entries - NPS, Tax)
├── dashboard_card (6 entries)
├── page (4 entries)
├── credit_card (3 entries)
├── travel_goal (3 entries)
├── rewards_category (3 entries)
├── rewards_item (7 entries)
├── navigation_item (17 entries)
└── education_article (1 entry)
```

All content is now manageable through Contentstack CMS without code deployments!
