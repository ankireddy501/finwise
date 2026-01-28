import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SIPCalculator: React.FC = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [duration, setDuration] = useState<number>(10);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);

  const [results, setResults] = useState({
    totalInvested: 0,
    estimatedReturns: 0,
    totalValue: 0,
    yearlyData: [] as any[],
  });

  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, duration, expectedReturn]);

  const calculateSIP = () => {
    const P = monthlyInvestment;
    const i = expectedReturn / 100 / 12;
    const n = duration * 12;

    // Formula: FV = P × [(1 + i)^n - 1] / i × (1 + i)
    const totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvested = P * n;
    const estimatedReturns = totalValue - totalInvested;

    // Generate year-wise data for chart
    const yearlyData = [];
    for (let year = 1; year <= duration; year++) {
      const months = year * 12;
      const value = P * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
      const invested = P * months;
      yearlyData.push({
        year: `Year ${year}`,
        value: Math.round(value),
        invested: Math.round(invested),
        returns: Math.round(value - invested),
      });
    }

    setResults({
      totalInvested,
      estimatedReturns,
      totalValue,
      yearlyData,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">SIP Calculator</h2>
        <p className="text-muted-foreground">Calculate the future value of your monthly SIP investments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Investment Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Monthly Investment</Label>
                <span className="font-medium">{formatCurrency(monthlyInvestment)}</span>
              </div>
              <Input
                type="number"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              />
              <Slider
                value={[monthlyInvestment]}
                onValueChange={(v) => setMonthlyInvestment(v[0])}
                min={500}
                max={100000}
                step={500}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Duration (Years)</Label>
                <span className="font-medium">{duration} years</span>
              </div>
              <Slider
                value={[duration]}
                onValueChange={(v) => setDuration(v[0])}
                min={1}
                max={40}
                step={1}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Expected Return Rate (p.a %)</Label>
                <span className="font-medium">{expectedReturn}%</span>
              </div>
              <Slider
                value={[expectedReturn]}
                onValueChange={(v) => setExpectedReturn(v[0])}
                min={1}
                max={30}
                step={0.5}
              />
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Invested</CardDescription>
                <CardTitle className="text-xl">{formatCurrency(results.totalInvested)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Estimated Returns</CardDescription>
                <CardTitle className="text-xl text-success">{formatCurrency(results.estimatedReturns)}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardDescription>Total Value</CardDescription>
                <CardTitle className="text-xl text-primary">{formatCurrency(results.totalValue)}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Growth Projection</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results.yearlyData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(v) => `₹${v/100000}L`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="invested" 
                    stackId="1" 
                    stroke="#94a3b8" 
                    fill="#94a3b8" 
                    name="Invested Amount" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stackId="2" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    name="Total Value" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground italic">
                Disclaimer: This is an estimate for planning purposes only. Actual returns may vary based on market conditions. Consult a certified financial advisor for personalized advice.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SIPCalculator;
