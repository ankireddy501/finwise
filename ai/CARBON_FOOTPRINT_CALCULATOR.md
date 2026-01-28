# Carbon Footprint Calculator

## Overview

A comprehensive carbon footprint calculator that estimates your annual CO₂ emissions and calculates how many trees you need to plant to offset your carbon footprint.

## Features

### 1. Transportation Emissions
- **Car Usage**: Kilometers per month, fuel type (petrol/diesel), fuel efficiency
- **Two-Wheeler**: Kilometers per month
- **Public Transport**: Kilometers per month (bus, train, metro)
- **Air Travel**: Flight hours per year

### 2. Energy (Home) Emissions
- **Electricity**: kWh consumption per month
- **LPG**: Number of cylinders per month
- **CNG**: Kilograms per month

### 3. Lifestyle Emissions
- **Diet**: Number of meat meals per week
- **Shopping**: Monthly shopping amount in ₹

## Calculations

### Emission Factors (kg CO₂ per unit)
- Petrol: 2.31 kg CO₂ per liter
- Diesel: 2.68 kg CO₂ per liter
- CNG: 1.5 kg CO₂ per kg
- LPG: 1.5 kg CO₂ per kg (14.2 kg per cylinder)
- Electricity: 0.82 kg CO₂ per kWh (India grid average)
- Public Transport: 0.05 kg CO₂ per km
- Two-Wheeler: 0.12 kg CO₂ per km
- Flight: 90 kg CO₂ per hour
- Meat Meal: 3.5 kg CO₂ per meal
- Shopping: 0.001 kg CO₂ per ₹ (approximate)

### Tree Calculation
- **One tree absorbs approximately 20 kg CO₂ per year** (average over 20 years)
- Formula: `Trees Needed = Total Annual CO₂ (kg) / 20`

## Outputs

1. **Total Annual Carbon Footprint**
   - In tons CO₂
   - In kg CO₂

2. **Trees to Plant**
   - Exact number of trees needed to offset annual emissions
   - Highlighted in a prominent success card

3. **Emission Breakdown**
   - Pie chart showing percentage by category:
     - Transportation
     - Energy (Home)
     - Lifestyle

4. **Monthly Trend Chart**
   - Stacked bar chart showing monthly emissions breakdown
   - Helps visualize seasonal variations

## Tree Planting Guide

The calculator includes an educational section with:

### Why Plant Trees?
- One tree absorbs ~20 kg CO₂ per year
- Improves air quality and reduces pollution
- Provides habitat for wildlife
- Helps combat climate change

### Best Trees for Carbon Sequestration (India)
- Neem (Azadirachta indica)
- Peepal (Ficus religiosa)
- Banyan (Ficus benghalensis)
- Mango (Mangifera indica)
- Teak (Tectona grandis)

### How to Get Started
1. Contact local NGOs or tree planting organizations
2. Participate in community tree planting drives
3. Plant trees in your garden or community spaces
4. Support reforestation projects through donations
5. Use apps like Grow-Trees, One Tree Planted, or local initiatives

## Implementation

### File Created
- `src/pages/calculators/CarbonFootprintCalculator.tsx`

### Integration
- **Route**: `/calculators/carbon`
- **Navigation**: Added to "Cloud Cost" section in sidebar
- **Contentstack**: Added to seed script with "Environment" category

### UI Features
- Tabbed interface for easy navigation (Transportation, Energy, Lifestyle)
- Real-time calculations as inputs change
- Visual charts (Pie chart for breakdown, Bar chart for monthly trends)
- Educational content about tree planting
- Indian context (LPG cylinders, ₹ currency, Indian tree species)

## Usage Example

**Input:**
- Car: 1000 km/month, Petrol, 15 km/liter
- Electricity: 300 kWh/month
- Meat: 7 meals/week

**Output:**
- Annual CO₂: ~4.5 tons
- Trees Needed: ~225 trees

## Environmental Impact

This calculator helps users:
1. **Awareness**: Understand their carbon footprint
2. **Action**: Know exactly how many trees to plant
3. **Education**: Learn about carbon offsetting
4. **Motivation**: See the impact of lifestyle changes

## Future Enhancements

Potential additions:
- Comparison with national/global averages
- Tips to reduce carbon footprint
- Integration with tree planting organizations
- Carbon offset cost calculator
- Monthly tracking and goals
- Family/household calculations

---

**Note**: Emission factors are based on standard values and may vary. Tree absorption rates are averages. Consult environmental experts for accurate carbon offset strategies.
