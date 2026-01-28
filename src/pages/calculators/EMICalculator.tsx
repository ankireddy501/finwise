import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { formatCurrency } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const EMICalculator: React.FC = () => {
  const [principal, setPrincipal] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(10);
  const [isYears, setIsYears] = useState<boolean>(true);

  const [results, setResults] = useState({
    emi: 0,
    totalInterest: 0,
    totalPayment: 0,
  });

  useEffect(() => {
    calculateEMI();
  }, [principal, interestRate, tenure, isYears]);

  const calculateEMI = () => {
    const P = principal;
    const r = interestRate / 12 / 100;
    const n = isYears ? tenure * 12 : tenure;

    if (r === 0) {
      const emi = P / n;
      setResults({
        emi,
        totalInterest: 0,
        totalPayment: P,
      });
      return;
    }

    // Formula: EMI = P × r × (1 + r)^n / [(1 + r)^n - 1]
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    setResults({
      emi,
      totalInterest,
      totalPayment,
    });
  };

  const pieData = [
    { name: 'Principal', value: principal },
    { name: 'Total Interest', value: results.totalInterest },
  ];

  const COLORS = ['#3b82f6', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">EMI Calculator</h2>
        <p className="text-muted-foreground">Quickly calculate EMI for any loan type.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Principal Amount</Label>
                <span className="font-medium">{formatCurrency(principal)}</span>
              </div>
              <Input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
              />
              <Slider
                value={[principal]}
                onValueChange={(v) => setPrincipal(v[0])}
                min={10000}
                max={10000000}
                step={10000}
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
                min={1}
                max={30}
                step={0.1}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Tenure ({isYears ? 'Years' : 'Months'})</Label>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="tenure-toggle" className="text-xs text-muted-foreground">Months</Label>
                  <Switch 
                    id="tenure-toggle" 
                    checked={isYears} 
                    onCheckedChange={setIsYears} 
                  />
                  <Label htmlFor="tenure-toggle" className="text-xs text-muted-foreground">Years</Label>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-24"
                />
                <Slider
                  className="flex-1"
                  value={[tenure]}
                  onValueChange={(v) => setTenure(v[0])}
                  min={1}
                  max={isYears ? 30 : 360}
                  step={1}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="text-center pb-2">
              <CardDescription>Monthly EMI</CardDescription>
              <CardTitle className="text-4xl text-primary font-bold">{formatCurrency(results.emi)}</CardTitle>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Interest Payable</CardDescription>
                <CardTitle className="text-xl text-destructive">{formatCurrency(results.totalInterest)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Amount Payable</CardDescription>
                <CardTitle className="text-xl">{formatCurrency(results.totalPayment)}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Breakup of Total Payment</CardTitle>
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

export default EMICalculator;
