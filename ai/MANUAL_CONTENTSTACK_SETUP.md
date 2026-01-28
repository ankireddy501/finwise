# Manual Contentstack Setup Guide

Since the seed script is experiencing DNS resolution issues, you can manually create the content types and entries in the Contentstack dashboard.

## Access Contentstack Dashboard

1. Go to: **https://au-app.contentstack.com/**
2. Log in with your credentials
3. Select your stack: `blt0feaf330086422ec`

## Content Types to Create

### 1. Calculator Category

**Go to:** Content Types → Create New

**Title:** Calculator Category  
**UID:** `calculator_category`

**Fields:**
- `title` (Text, Mandatory, Unique)
- `key` (Text, Mandatory, Unique)
- `description` (Text, Multiline)
- `order` (Number)
- `icon` (Text)

**Save and Publish**

---

### 2. Calculator

**Title:** Calculator  
**UID:** `calculator`

**Fields:**
- `title` (Text, Mandatory)
- `key` (Text, Mandatory, Unique)
- `category` (Reference, Reference to: `calculator_category`, Mandatory)
- `summary` (Text, Multiline)
- `disclaimer` (Text, Multiline)
- `config` (Text, Multiline, Mandatory) - Store JSON as text
- `enabled` (Boolean, Mandatory, Default: true)

**Save and Publish**

---

### 3. Education Article

**Title:** Education Article  
**UID:** `education_article`

**Fields:**
- `title` (Text, Mandatory)
- `key` (Text, Mandatory, Unique)
- `category` (Text)
- `summary` (Text, Multiline)
- `body` (Text, Multiline)
- `order` (Number)

**Save and Publish**

---

### 4. Credit Card

**Title:** Credit Card  
**UID:** `credit_card`

**Fields:**
- `name` (Text, Mandatory)
- `key` (Text, Mandatory, Unique)
- `issuer` (Text)
- `annual_fee` (Number)
- `welcome_bonus` (Text, Multiline)
- `lounge_access` (Text)
- `insurance_coverage` (Text, Multiline)
- `reward_structure` (Text, Multiline, Mandatory) - Store JSON as text

**Save and Publish**

---

### 5. Page

**Title:** Page  
**UID:** `page`

**Fields:**
- `title` (Text, Mandatory)
- `key` (Text, Mandatory, Unique)
- `route` (Text, Mandatory)
- `description` (Text, Multiline)
- `seo_title` (Text)
- `seo_description` (Text, Multiline)
- `enabled` (Boolean, Default: true)

**Save and Publish**

---

### 6. Dashboard Card

**Title:** Dashboard Card  
**UID:** `dashboard_card`

**Fields:**
- `title` (Text, Mandatory)
- `key` (Text, Mandatory, Unique)
- `description` (Text, Multiline, Mandatory)
- `route` (Text, Mandatory)
- `icon_color` (Text)
- `border_color` (Text)
- `link_text` (Text)
- `order` (Number)
- `enabled` (Boolean, Default: true)

**Save and Publish**

---

### 7. Travel Goal

**Title:** Travel Goal  
**UID:** `travel_goal`

**Fields:**
- `name` (Text, Mandatory)
- `key` (Text, Mandatory, Unique)
- `points_required` (Number, Mandatory)
- `estimated_value` (Number)
- `description` (Text, Multiline)
- `icon` (Text)

**Save and Publish**

---

### 8. Rewards Category

**Title:** Rewards Category  
**UID:** `rewards_category`

**Fields:**
- `title` (Text, Mandatory)
- `key` (Text, Mandatory, Unique)
- `icon` (Text)
- `icon_color` (Text)
- `order` (Number)

**Save and Publish**

---

### 9. Rewards Item

**Title:** Rewards Item  
**UID:** `rewards_item`

**Fields:**
- `name` (Text, Mandatory)
- `key` (Text, Mandatory, Unique)
- `category` (Reference, Reference to: `rewards_category`, Mandatory)
- `points_required` (Text, Mandatory)
- `value` (Text, Mandatory)
- `order` (Number)

**Save and Publish**

---

### 10. Navigation Item

**Title:** Navigation Item  
**UID:** `navigation_item`

**Fields:**
- `label` (Text, Mandatory)
- `key` (Text, Mandatory, Unique)
- `route` (Text, Mandatory)
- `icon` (Text)
- `section` (Text)
- `order` (Number)
- `enabled` (Boolean, Default: true)

**Save and Publish**

---

## Sample Entries to Create

After creating content types, you can create sample entries. See `CONTENTSTACK_CONTENT_SUMMARY.md` for detailed entry data.

### Quick Start Entries:

**Calculator Categories:**
1. Investments (key: `investments`)
2. Loans (key: `loans`)
3. Retirement (key: `retirement`)
4. Family (key: `family`)
5. Tax (key: `tax`)
6. Currency (key: `currency`)

**Pages:**
1. Dashboard (key: `dashboard`, route: `/`)
2. Credit Cards (key: `credit_cards`, route: `/credit-cards`)
3. Rewards (key: `rewards`, route: `/rewards`)
4. Education (key: `education`, route: `/education`)

---

## Alternative: Use Contentstack API via Browser Console

If you can access the dashboard, you can also use the browser console to run API calls directly. However, the seed script is the recommended approach once network connectivity is restored.

---

## Next Steps

1. Create all 10 content types as listed above
2. Create sample entries for each content type
3. Verify entries are published
4. Update React components to fetch from Contentstack

For detailed entry data, refer to:
- `CONTENTSTACK_CONTENT_SUMMARY.md`
- `CONTENT_EXTRACTION_GUIDE.md`
- `slfp-contentstack-seed/seed.ts` (for JSON config examples)
