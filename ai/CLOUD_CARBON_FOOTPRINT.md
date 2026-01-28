# Cloud Infrastructure Carbon Footprint Calculator

## Overview

Added cloud infrastructure carbon footprint calculation to the Carbon Footprint Calculator, allowing users to measure and offset emissions from their cloud computing usage.

## Features Added

### 1. Cloud Infrastructure Tab
- New "Cloud Infrastructure" tab alongside Transportation, Energy, and Lifestyle
- Comprehensive inputs for cloud resource usage
- Real-time carbon footprint calculation

### 2. Cloud Provider Selection
- **AWS (Amazon Web Services)**
- **Azure (Microsoft)**
- **GCP (Google Cloud Platform)**

### 3. Region Selection
Different regions have different carbon intensities based on their local energy grids:

#### AWS Regions:
- **Mumbai (ap-south-1)**: 0.82 kg CO₂/kWh (India grid)
- **Singapore (ap-southeast-1)**: 0.50 kg CO₂/kWh
- **Virginia (us-east-1)**: 0.40 kg CO₂/kWh (US grid)
- **Oregon (us-west-2)**: 0.30 kg CO₂/kWh (renewable heavy)
- **Ireland (eu-west-1)**: 0.30 kg CO₂/kWh (EU grid)

#### Azure Regions:
- **Central India**: 0.82 kg CO₂/kWh
- **East US**: 0.40 kg CO₂/kWh
- **West Europe**: 0.30 kg CO₂/kWh

#### GCP Regions:
- **Mumbai (asia-south1)**: 0.82 kg CO₂/kWh
- **Iowa (us-central1)**: 0.40 kg CO₂/kWh
- **Belgium (europe-west1)**: 0.30 kg CO₂/kWh

### 4. Resource Inputs

#### Compute Resources:
- **Number of Instances**: 0-50 instances
- **Instance Type**: Small (~50W), Medium (~100W), Large (~200W), XLarge (~400W)
- **Hours per Month**: 0-744 hours (730 = 24/7 operation)

#### Database Resources:
- **Number of Instances**: 0-20 instances
- **Hours per Month**: 0-744 hours

#### Storage & Data Transfer:
- **Storage (GB)**: Total storage capacity
- **Data Transfer Out (GB/month)**: Monthly data egress

### 5. Carbon Footprint Calculation

The calculator uses industry-standard formulas:

#### Power Consumption:
- **Compute**: Based on instance type and hours
  - Small: 0.05 kWh/hour
  - Medium: 0.10 kWh/hour
  - Large: 0.20 kWh/hour
  - XLarge: 0.40 kWh/hour
- **Database**: Same as compute instances
- **Storage**: 0.0001 kWh per GB per month
- **Data Transfer**: 0.0005 kWh per GB

#### Carbon Emissions:
```
CO₂ = (kWh × Regional Grid Factor × PUE) × 12 months
```
- **PUE (Power Usage Effectiveness)**: 1.5 (industry average)
- Accounts for data center overhead (cooling, networking, etc.)

### 6. Integration with Total Footprint

- Cloud emissions are **automatically added** to total carbon footprint
- Included in breakdown pie chart (orange color)
- Shown in monthly trend chart
- Affects total trees needed calculation

### 7. Real-Time Feedback

- **Cloud Carbon Footprint Card**: Shows annual cloud emissions
- **Percentage of Total**: Displays cloud's contribution to total footprint
- **Visual Indicators**: Color-coded for easy identification

## Example Calculation

### Scenario:
- **Provider**: AWS
- **Region**: Mumbai (ap-south-1)
- **Compute**: 2 medium instances, 730 hours/month
- **Database**: 1 medium instance, 730 hours/month
- **Storage**: 100 GB
- **Data Transfer**: 100 GB/month

### Calculation:
1. **Compute kWh**: 2 × 0.10 × 730 = 146 kWh/month
2. **Database kWh**: 1 × 0.10 × 730 = 73 kWh/month
3. **Storage kWh**: 100 × 0.0001 = 0.01 kWh/month
4. **Data Transfer kWh**: 100 × 0.0005 = 0.05 kWh/month
5. **Total kWh/month**: 219.06 kWh/month
6. **Annual kWh**: 219.06 × 12 = 2,628.72 kWh/year
7. **CO₂ Emissions**: 2,628.72 × 0.82 × 1.5 = **3,233 kg CO₂/year**

### Result:
- **3.23 tons CO₂/year** from cloud infrastructure
- **162 trees needed** to offset cloud emissions alone

## Benefits

1. **Complete Picture**: Users see full carbon footprint including digital infrastructure
2. **Region Awareness**: Understand how region choice affects emissions
3. **Optimization Insights**: Identify high-emission cloud resources
4. **Offset Planning**: Know exactly how many trees needed for cloud usage
5. **Sustainability Goals**: Track progress toward carbon-neutral cloud operations

## Technical Implementation

### State Variables:
```typescript
- cloudProvider: 'aws' | 'azure' | 'gcp'
- cloudRegion: string (region code)
- computeInstances: number
- computeHoursPerMonth: number
- computeInstanceType: 'small' | 'medium' | 'large' | 'xlarge'
- storageGB: number
- dataTransferGB: number
- databaseInstances: number
- databaseHoursPerMonth: number
```

### Emission Factors:
- Regional grid carbon intensity (kg CO₂/kWh)
- PUE factor: 1.5 (data center overhead)
- Power consumption by instance type
- Storage and network power consumption

### Integration:
- Added to `totalAnnualCO2` calculation
- Included in breakdown array
- Added to monthly breakdown chart
- Updates trees needed automatically

## Best Practices for Users

1. **Choose Green Regions**: Select regions with lower carbon intensity (e.g., Oregon, Ireland)
2. **Right-Size Instances**: Use appropriate instance sizes to avoid over-provisioning
3. **Optimize Usage**: Turn off unused instances during non-business hours
4. **Monitor Storage**: Regularly clean up unused storage
5. **Minimize Data Transfer**: Optimize applications to reduce data egress
6. **Use Serverless**: Consider serverless options (Lambda, Functions) for variable workloads
7. **Offset Emissions**: Plant trees or purchase carbon credits to offset cloud emissions

## Future Enhancements

1. **More Providers**: Add other cloud providers (DigitalOcean, Linode, etc.)
2. **More Regions**: Expand region coverage for all providers
3. **Instance-Specific Data**: Use actual power consumption data from cloud providers
4. **Historical Tracking**: Track cloud emissions over time
5. **Optimization Suggestions**: AI-powered recommendations to reduce cloud emissions
6. **Carbon Credits**: Integration with carbon offset marketplaces
7. **API Integration**: Pull actual usage data from cloud provider APIs

## Files Modified

- `src/pages/calculators/CarbonFootprintCalculator.tsx`
  - Added cloud infrastructure state variables
  - Added cloud emission factors and calculations
  - Added Cloud Infrastructure tab UI
  - Updated breakdown and charts to include cloud emissions
  - Added Cloud icon import

---

**Result**: Users can now calculate and offset carbon emissions from their cloud infrastructure, making their digital footprint fully transparent and actionable!
