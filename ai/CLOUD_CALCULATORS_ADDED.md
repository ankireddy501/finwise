# Cloud Cost Calculators Added

## Overview

Three new cloud cost calculators have been added to the FinWise financial planning portal:
- **AWS Cost Calculator**
- **Azure Cost Calculator**
- **GCP Cost Calculator**

## Features

Each calculator estimates monthly and annual cloud infrastructure costs based on:

### AWS Cost Calculator
- **EC2 Compute**: Instance types, count, and hours per month
- **S3 Storage**: Storage size and request volume
- **RDS Database**: Instance types, count, and storage
- **Data Transfer**: Outbound data transfer
- **Lambda**: Function invocations and compute time

### Azure Cost Calculator
- **Virtual Machines**: VM sizes, count, and hours per month
- **Blob Storage**: Storage size and transaction volume
- **SQL Database**: Service tiers, count, and storage
- **Data Transfer**: Outbound data transfer
- **Azure Functions**: Executions and compute time

### GCP Cost Calculator
- **Compute Engine**: Machine types, count, and hours per month
- **Cloud Storage**: Storage size and operations
- **Cloud SQL**: Instance tiers, count, and storage
- **Data Transfer**: Outbound data transfer
- **Cloud Functions**: Invocations and compute time

## Implementation Details

### Files Created
1. `src/pages/calculators/AWSCostCalculator.tsx`
2. `src/pages/calculators/AzureCostCalculator.tsx`
3. `src/pages/calculators/GCPCostCalculator.tsx`

### Files Updated
1. `src/App.tsx`
   - Added imports for all three calculators
   - Added routes: `/calculators/aws`, `/calculators/azure`, `/calculators/gcp`
   - Added navigation items in "Cloud Cost" section

2. `slfp-contentstack-seed/seed.ts`
   - Added "Cloud Cost" category
   - Added three calculator entries with configurations
   - Added navigation items for all three calculators

## Routes

- `/calculators/aws` - AWS Cost Calculator
- `/calculators/azure` - Azure Cost Calculator
- `/calculators/gcp` - GCP Cost Calculator

## Navigation

The calculators appear in a new "Cloud Cost" section in the sidebar navigation, below the main "Calculators" section.

## Contentstack Integration

The calculators are configured in Contentstack with:
- **Category**: Cloud Cost
- **Calculator Entries**: 
  - `aws_cost_calculator`
  - `azure_cost_calculator`
  - `gcp_cost_calculator`
- **Navigation Items**: Added to sidebar navigation

## Pricing Notes

- All pricing is approximate and based on standard on-demand rates
- Prices are converted from USD to INR (approximate rate: 83)
- Actual costs may vary based on:
  - Region selection
  - Reserved instances/committed use discounts
  - Volume discounts
  - Actual usage patterns
  - Data transfer patterns

## Next Steps

1. **Run Seed Script**: Update Contentstack with new calculator entries
2. **Test Calculators**: Verify all three calculators work correctly
3. **Update Pricing**: Adjust pricing data if needed based on current rates
4. **Add to Dashboard**: Optionally add cloud calculator cards to the dashboard

## Usage

Users can:
1. Navigate to any cloud calculator from the sidebar
2. Configure their cloud service usage
3. View estimated monthly and annual costs
4. See cost breakdown by service type
5. Compare costs across different configurations

---

**Note**: These calculators provide estimates for planning purposes. For accurate pricing, users should consult the official pricing calculators from AWS, Azure, and GCP.
