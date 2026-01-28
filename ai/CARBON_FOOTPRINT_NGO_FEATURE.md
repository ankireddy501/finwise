# Carbon Footprint Calculator - NGO Suggestions Feature

## Overview

Enhanced the Carbon Footprint Calculator to provide city-specific NGO suggestions for tree planting in India, helping users take actionable steps to offset their carbon footprint.

## Features Added

### 1. City Selection
- **20 Major Indian Cities** available for selection:
  - Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata
  - Pune, Ahmedabad, Jaipur, Surat, Lucknow, Kanpur
  - Nagpur, Indore, Thane, Bhopal, Visakhapatnam, Patna
  - Vadodara, Gurgaon

### 2. Tree Planting Recommendations
- **Automatic Calculation**: Shows exact number of trees needed based on carbon footprint
- **Real-time Updates**: Number of trees updates as user changes their lifestyle inputs
- **Visual Display**: Prominent display in the results card with success-themed styling

### 3. City-Specific NGO Suggestions
- **Local NGOs**: Organizations working in the selected city
- **National NGOs**: Organizations working across India (always shown)
- **Contact Information**: 
  - Website links (with external link icon)
  - Phone numbers (clickable tel: links)
  - Email addresses (clickable mailto: links)
- **Focus Areas**: Tags showing what each NGO specializes in

### 4. NGO Database

#### Major Cities with Detailed NGO Data:
- **Mumbai**: Grow-Trees.com, Vanashakti, Mumbai Tree Planting Initiative
- **Delhi**: Delhi Greens, I Am Gurgaon, Green Yatra
- **Bangalore**: SayTrees, Hasiru Dala, Green Bangalore
- **Hyderabad**: Hyderabad Tree Planting Foundation, Green Hyderabad
- **Chennai**: Chennai Tree Planting Society, Environmentalist Foundation of India
- **Kolkata**: Kolkata Green Initiative, Nature Mates
- **Pune**: Pune Tree Planting Initiative, Eco Pune
- **Other Cities**: Local organizations for each city

#### National NGOs (Always Available):
- **Grow-Trees.com**: Online tree planting platform
- **One Tree Planted**: International organization with India projects
- **SankalpTaru Foundation**: Nationwide tree planting initiatives

## User Experience

### Flow:
1. User enters their carbon footprint data (transportation, energy, lifestyle)
2. Calculator shows total CO₂ emissions and **number of trees needed**
3. User selects their city from dropdown
4. System displays relevant NGOs with:
   - Organization name and description
   - Focus areas (tags)
   - Contact information (website, phone, email)
5. User can click links to contact NGOs directly

### UI Components:
- **City Selector**: Dropdown in the results card
- **NGO Cards**: Scrollable list with detailed information
- **Contact Buttons**: Direct links to website, phone, and email
- **Focus Area Tags**: Color-coded badges showing NGO specialties
- **Responsive Design**: Works on mobile and desktop

## Technical Implementation

### State Management:
```typescript
const [selectedCity, setSelectedCity] = useState<string>('mumbai');
```

### Data Structure:
- `indianCities`: Array of city options
- `ngosByCity`: Record mapping city codes to NGO arrays
- Each NGO object contains:
  - `name`: Organization name
  - `description`: What they do
  - `website`: Optional website URL
  - `phone`: Optional phone number
  - `email`: Optional email address
  - `focus`: Array of focus areas

### Functions:
- `getNGOsForCity()`: Returns city-specific NGOs + national NGOs
- Automatically includes national NGOs for all cities
- Falls back gracefully if city has no specific NGOs

## Benefits

1. **Actionable Results**: Users know exactly how many trees to plant
2. **Local Connections**: Find NGOs in their city for easy participation
3. **Multiple Options**: Both local and national NGOs available
4. **Easy Contact**: Direct links to websites, phone, and email
5. **Transparency**: Clear focus areas help users choose the right NGO
6. **Accessibility**: Works for all major Indian cities

## Example Usage

1. User calculates carbon footprint: **5.2 tons CO₂/year**
2. System calculates: **260 trees needed** (5.2 tons × 1000 kg ÷ 20 kg per tree)
3. User selects "Bangalore" from dropdown
4. System shows:
   - SayTrees (local NGO)
   - Hasiru Dala (local NGO)
   - Green Bangalore (local initiative)
   - Grow-Trees.com (national)
   - One Tree Planted (national)
   - SankalpTaru Foundation (national)
5. User clicks website link to contact SayTrees
6. User can plant trees through the NGO or donate

## Future Enhancements

1. **API Integration**: Connect to real-time NGO databases
2. **More Cities**: Add more Indian cities and towns
3. **NGO Verification**: Verify and update NGO contact information
4. **User Reviews**: Allow users to rate NGOs
5. **Event Calendar**: Show upcoming tree planting events
6. **Donation Integration**: Direct donation links
7. **Impact Tracking**: Track trees planted through the platform

## Files Modified

- `src/pages/calculators/CarbonFootprintCalculator.tsx`
  - Added city selector state
  - Added NGO data structures
  - Added city selection UI in results card
  - Added NGO suggestions section
  - Added icons (MapPin, ExternalLink, Phone, Mail)

---

**Result**: Users can now easily find and contact NGOs in their city to help plant the exact number of trees needed to offset their carbon footprint!
