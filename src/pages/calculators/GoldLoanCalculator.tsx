import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const GoldLoanCalculator: React.FC = () => {
  const [goldWeight, setGoldWeight] = useState<number>(50);
  const [purity, setPurity] = useState<string>("22K");
  const [goldRate, setGoldRate] = useState<number>(7500); // per gram
  const [ltvRatio, setLtvRatio] = useState<number>(75);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [tenureMonths, setTenureMonths] = useState<number>(12);

  const [results, setResults] = useState({
    maxLoan: 0,
    emi: 0,
    totalInterest: 0,
    totalRepayment: 0,
  });

  useEffect(() => {
    calculateGoldLoan();
  }, [goldWeight, purity, goldRate, ltvRatio, interestRate, tenureMonths]);

  const calculateGoldLoan = () => {
    // Adjust gold rate based on purity
    let adjustedRate = goldRate;
    if (purity === "18K") adjustedRate = (goldRate * 18) / 24;
    else if (purity === "22K") adjustedRate = (goldRate * 22) / 24;
    
    const totalGoldValue = goldWeight * adjustedRate;
    const maxLoan = (totalGoldValue * ltvRatio) / 100;
    
    const P = maxLoan;
    const r = interestRate / 12 / 100;
    const n = tenureMonths;

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalRepayment = emi * n;
    const totalInterest = totalRepayment - P;

    setResults({
      maxLoan,
      emi,
      totalInterest,
      totalRepayment,
    });
  };

  const pieData = [
    { name: 'Loan Amount', value: results.maxLoan },
    { name: 'Total Interest', value: results.totalInterest },
  ];

  const COLORS = ['#eab308', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Gold Loan Calculator</h2>
        <p className="text-muted-foreground">Estimate loan eligibility and repayment based on your gold assets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Gold Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Gold Weight (Grams)</Label>
              <Input
                type="number"
                value={goldWeight}
                onChange={(e) => setGoldWeight(Number(e.target.value))}
              />
              <Slider
                value={[goldWeight]}
                onValueChange={(v) => setGoldWeight(v[0])}
                min={1}
                max={1000}
                step={1}
              />
            </div>

            <div className="space-y-4">
              <Label>Gold Purity</Label>
              <Select value={purity} onValueChange={setPurity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Purity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24K">24K (Pure Gold)</SelectItem>
                  <SelectItem value="22K">22K (Standard Jewellery)</SelectItem>
                  <SelectItem value="18K">18K</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Current Gold Rate (per gram)</Label>
                <span className="font-medium">{formatCurrency(goldRate)}</span>
              </div>
              <Input
                type="number"
                value={goldRate}
                onChange={(e) => setGoldRate(Number(e.target.value))}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <Label className="text-primary">Loan Settings</Label>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>LTV Ratio (%)</Label>
                  <span className="font-medium">{ltvRatio}%</span>
                </div>
                <Slider
                  value={[ltvRatio]}
                  onValueChange={(v) => setLtvRatio(v[0])}
                  min={25}
                  max={75}
                  step={5}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Interest Rate (% p.a)</Label>
                  <span className="font-medium">{interestRate}%</span>
                </div>
                <Slider
                  value={[interestRate]}
                  onValueChange={(v) => setInterestRate(v[0])}
                  min={7}
                  max={15}
                  step={0.5}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Tenure (Months)</Label>
                  <span className="font-medium">{tenureMonths} months</span>
                </div>
                <Slider
                  value={[tenureMonths]}
                  onValueChange={(v) => setTenureMonths(v[0])}
                  min={3}
                  max={36}
                  step={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="text-center pb-2">
              <CardDescription className="text-yellow-800">Max Loan Eligible</CardDescription>
              <CardTitle className="text-4xl text-yellow-600 font-bold">{formatCurrency(results.maxLoan)}</CardTitle>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Monthly EMI</CardDescription>
                <CardTitle className="text-xl font-bold">{formatCurrency(results.emi)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Interest</CardDescription>
                <CardTitle className="text-xl text-destructive font-bold">{formatCurrency(results.totalInterest)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Repayment</CardDescription>
                <CardTitle className="text-xl font-bold">{formatCurrency(results.totalRepayment)}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Repayment Breakup</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
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

export default GoldLoanCalculator;
