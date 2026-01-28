import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const TaxCalculator: React.FC = () => {
  const [grossIncome, setGrossIncome] = useState<number>(1200000);
  const [hra, setHra] = useState<number>(0);
  const [section80C, setSection80C] = useState<number>(150000);
  const [section80D, setSection80D] = useState<number>(25000);
  const [section24, setSection24] = useState<number>(0); // Home Loan Interest
  const [nps80CCD, setNps80CCD] = useState<number>(0);

  const [taxData, setTaxData] = useState({
    oldRegime: { taxableIncome: 0, tax: 0, cess: 0, totalTax: 0 },
    newRegime: { taxableIncome: 0, tax: 0, cess: 0, totalTax: 0 },
    savings: 0,
    recommended: '' as 'Old' | 'New'
  });

  useEffect(() => {
    calculateTax();
  }, [grossIncome, hra, section80C, section80D, section24, nps80CCD]);

  const calculateTax = () => {
    // Old Regime Deductions
    const standardDeductionOld = 50000;
    const totalDeductionsOld = 
      standardDeductionOld + 
      hra + 
      Math.min(section80C, 150000) + 
      Math.min(section80D, 75000) + 
      Math.min(section24, 200000) + 
      Math.min(nps80CCD, 50000);
    
    const taxableIncomeOld = Math.max(0, grossIncome - totalDeductionsOld);
    const taxOld = calculateOldRegimeTax(taxableIncomeOld);
    const cessOld = taxOld * 0.04;

    // New Regime Deductions (Standard Deduction only)
    const standardDeductionNew = 75000;
    const taxableIncomeNew = Math.max(0, grossIncome - standardDeductionNew);
    const taxNew = calculateNewRegimeTax(taxableIncomeNew);
    const cessNew = taxNew * 0.04;

    const totalTaxOld = taxOld + cessOld;
    const totalTaxNew = taxNew + cessNew;

    setTaxData({
      oldRegime: { taxableIncome: taxableIncomeOld, tax: taxOld, cess: cessOld, totalTax: totalTaxOld },
      newRegime: { taxableIncome: taxableIncomeNew, tax: taxNew, cess: cessNew, totalTax: totalTaxNew },
      savings: Math.abs(totalTaxOld - totalTaxNew),
      recommended: totalTaxOld < totalTaxNew ? 'Old' : 'New'
    });
  };

  const calculateOldRegimeTax = (income: number) => {
    let tax = 0;
    if (income <= 250000) return 0;
    
    // Rebate under 87A for Old Regime if taxable income <= 5L
    if (income <= 500000) {
        // Technically tax is 5% above 2.5L, but rebate makes it zero
        return 0;
    }

    if (income > 1000000) {
      tax += (income - 1000000) * 0.3;
      income = 1000000;
    }
    if (income > 500000) {
      tax += (income - 500000) * 0.2;
      income = 500000;
    }
    if (income > 250000) {
      tax += (income - 250000) * 0.05;
    }
    return tax;
  };

  const calculateNewRegimeTax = (income: number) => {
    let tax = 0;
    // Rebate under 87A for New Regime if taxable income <= 7L
    if (income <= 700000) return 0;

    if (income > 1500000) {
      tax += (income - 1500000) * 0.3;
      income = 1500000;
    }
    if (income > 1200000) {
      tax += (income - 1200000) * 0.2;
      income = 1200000;
    }
    if (income > 1000000) {
      tax += (income - 1000000) * 0.15;
      income = 1000000;
    }
    if (income > 700000) {
      tax += (income - 700000) * 0.1;
      income = 700000;
    }
    if (income > 300000) {
      tax += (income - 300000) * 0.05;
    }
    return tax;
  };

  const chartData = [
    { name: 'Old Regime', tax: taxData.oldRegime.totalTax },
    { name: 'New Regime', tax: taxData.newRegime.totalTax },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Income Tax Calculator</h2>
        <p className="text-muted-foreground">Compare Old vs New Tax Regime (FY 2024-25)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Income & Deductions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Gross Annual Income</Label>
              <Input
                type="number"
                value={grossIncome}
                onChange={(e) => setGrossIncome(Number(e.target.value))}
              />
              <Slider
                value={[grossIncome]}
                onValueChange={(v) => setGrossIncome(v[0])}
                min={300000}
                max={5000000}
                step={50000}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <Label className="text-primary">Deductions (Old Regime Only)</Label>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Label>Section 80C (PPF, ELSS, etc.)</Label>
                  <span>{formatCurrency(section80C)}</span>
                </div>
                <Input
                  type="number"
                  value={section80C}
                  onChange={(e) => setSection80C(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Label>Section 24 (Home Loan Interest)</Label>
                  <span>{formatCurrency(section24)}</span>
                </div>
                <Input
                  type="number"
                  value={section24}
                  onChange={(e) => setSection24(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Label>Section 80D (Health Insurance)</Label>
                  <span>{formatCurrency(section80D)}</span>
                </div>
                <Input
                  type="number"
                  value={section80D}
                  onChange={(e) => setSection80D(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Label>HRA Exemption</Label>
                  <span>{formatCurrency(hra)}</span>
                </div>
                <Input
                  type="number"
                  value={hra}
                  onChange={(e) => setHra(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardDescription>Recommended Regime</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {taxData.recommended} Regime 
                <span className="text-lg font-normal text-muted-foreground">
                  (Saves {formatCurrency(taxData.savings)})
                </span>
              </CardTitle>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Old Regime</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm border-b py-2">
                  <span className="text-muted-foreground">Taxable Income</span>
                  <span className="font-medium">{formatCurrency(taxData.oldRegime.taxableIncome)}</span>
                </div>
                <div className="flex justify-between text-sm border-b py-2">
                  <span className="text-muted-foreground">Base Tax</span>
                  <span className="font-medium">{formatCurrency(taxData.oldRegime.tax)}</span>
                </div>
                <div className="flex justify-between text-sm border-b py-2">
                  <span className="text-muted-foreground">Cess (4%)</span>
                  <span className="font-medium">{formatCurrency(taxData.oldRegime.cess)}</span>
                </div>
                <div className="flex justify-between text-lg pt-2 font-bold text-primary">
                  <span>Total Tax</span>
                  <span>{formatCurrency(taxData.oldRegime.totalTax)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">New Regime</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm border-b py-2">
                  <span className="text-muted-foreground">Taxable Income</span>
                  <span className="font-medium">{formatCurrency(taxData.newRegime.taxableIncome)}</span>
                </div>
                <div className="flex justify-between text-sm border-b py-2">
                  <span className="text-muted-foreground">Base Tax</span>
                  <span className="font-medium">{formatCurrency(taxData.newRegime.tax)}</span>
                </div>
                <div className="flex justify-between text-sm border-b py-2">
                  <span className="text-muted-foreground">Cess (4%)</span>
                  <span className="font-medium">{formatCurrency(taxData.newRegime.cess)}</span>
                </div>
                <div className="flex justify-between text-lg pt-2 font-bold text-success">
                  <span>Total Tax</span>
                  <span>{formatCurrency(taxData.newRegime.totalTax)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tax Comparison</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" tickFormatter={(v) => `₹${v/1000}k`} />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="tax" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === taxData.recommended + ' Regime' ? '#10b981' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground italic">
                Disclaimer: This calculation is based on the tax slabs for FY 2024-25. Actual tax liability may differ based on specific exemptions and rules.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;
