import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

const GratuityCalculator: React.FC = () => {
  const [basicSalary, setBasicSalary] = useState<number>(50000);
  const [yearsOfService, setYearsOfService] = useState<number>(5);
  const [orgType, setOrgType] = useState<string>("covered");

  const [results, setResults] = useState({
    gratuityAmount: 0,
    isEligible: true,
  });

  useEffect(() => {
    calculateGratuity();
  }, [basicSalary, yearsOfService, orgType]);

  const calculateGratuity = () => {
    const isEligible = yearsOfService >= 5;
    let gratuityAmount = 0;

    if (isEligible) {
      if (orgType === "covered") {
        // Formula: (Last Drawn Basic + DA) × 15 × Years of Service / 26
        gratuityAmount = (basicSalary * 15 * yearsOfService) / 26;
      } else {
        // Formula: (Last Drawn Basic + DA) × 15 × Years of Service / 30
        gratuityAmount = (basicSalary * 15 * yearsOfService) / 30;
      }
    }

    setResults({
      gratuityAmount,
      isEligible,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Gratuity Calculator</h2>
        <p className="text-muted-foreground">Calculate the gratuity amount you are entitled to after years of service.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Last Drawn Basic + DA</Label>
                <span className="font-medium">{formatCurrency(basicSalary)}</span>
              </div>
              <Input
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
              />
              <Slider
                value={[basicSalary]}
                onValueChange={(v) => setBasicSalary(v[0])}
                min={5000}
                max={500000}
                step={1000}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Years of Service</Label>
                <span className="font-medium">{yearsOfService} years</span>
              </div>
              <Slider
                value={[yearsOfService]}
                onValueChange={(v) => setYearsOfService(v[0])}
                min={1}
                max={40}
                step={1}
              />
            </div>

            <div className="space-y-4">
              <Label>Organization Type</Label>
              <Select value={orgType} onValueChange={setOrgType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="covered">Covered under Gratuity Act</SelectItem>
                  <SelectItem value="not_covered">Not covered under Gratuity Act</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {!results.isEligible && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3 text-amber-800">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Eligibility Criteria</p>
                <p className="text-sm">You must complete at least 5 years of continuous service to be eligible for gratuity.</p>
              </div>
            </div>
          )}

          <Card className={results.isEligible ? "bg-primary/5 border-primary/20" : "opacity-50"}>
            <CardHeader className="text-center pb-2">
              <CardDescription>Estimated Gratuity Amount</CardDescription>
              <CardTitle className="text-4xl text-primary font-bold">
                {results.isEligible ? formatCurrency(results.gratuityAmount) : "₹0"}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Tax Exemption</span>
                <span className="font-medium">Up to ₹20,00,000</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Minimum Service</span>
                <span className="font-medium">5 Years</span>
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                *The formula used for organizations covered under the Act is (15/26) × Last Drawn Salary × Years of Service. For others, it is (15/30) × Last Drawn Salary × Years of Service.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground italic">
                Disclaimer: This is an estimate for planning purposes only. Actual returns may vary. Consult a certified financial advisor for personalized advice.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GratuityCalculator;
