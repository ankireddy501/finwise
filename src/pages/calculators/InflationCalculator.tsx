import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const InflationCalculator: React.FC = () => {
  const [currentAmount, setCurrentAmount] = useState<number>(100000);
  const [timePeriod, setTimePeriod] = useState<number>(10);
  const [inflationRate, setInflationRate] = useState<number>(6);

  const [results, setResults] = useState({
    futureValue: 0,
    purchasingPowerLoss: 0,
    yearlyData: [] as any[],
  });

  useEffect(() => {
    calculateInflation();
  }, [currentAmount, timePeriod, inflationRate]);

  const calculateInflation = () => {
    const r = inflationRate / 100;
    const n = timePeriod;
    
    // Future Value = Current Amount * (1 + r)^n
    const futureValue = currentAmount * Math.pow(1 + r, n);
    const purchasingPowerLoss = futureValue - currentAmount;

    const yearlyData = [];
    for (let i = 0; i <= n; i += Math.max(1, Math.floor(n/10))) {
      const fv = currentAmount * Math.pow(1 + r, i);
      yearlyData.push({
        year: `Year ${i}`,
        futureValue: Math.round(fv),
        nominalValue: currentAmount,
      });
    }

    setResults({
      futureValue,
      purchasingPowerLoss,
      yearlyData,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Inflation Calculator</h2>
        <p className="text-muted-foreground">Understand how inflation affects your purchasing power over time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Current Expense/Amount</Label>
                <span className="font-medium">{formatCurrency(currentAmount)}</span>
              </div>
              <Input
                type="number"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(Number(e.target.value))}
              />
              <Slider
                value={[currentAmount]}
                onValueChange={(v) => setCurrentAmount(v[0])}
                min={1000}
                max={10000000}
                step={5000}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Time Period (Years)</Label>
                <span className="font-medium">{timePeriod} years</span>
              </div>
              <Slider
                value={[timePeriod]}
                onValueChange={(v) => setTimePeriod(v[0])}
                min={1}
                max={30}
                step={1}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Expected Inflation Rate (% p.a)</Label>
                <span className="font-medium">{inflationRate}%</span>
              </div>
              <Slider
                value={[inflationRate]}
                onValueChange={(v) => setInflationRate(v[0])}
                min={1}
                max={15}
                step={0.1}
              />
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-destructive/5 border-destructive/20">
              <CardHeader className="pb-2">
                <CardDescription>Future Cost (Inflated)</CardDescription>
                <CardTitle className="text-2xl text-destructive">{formatCurrency(results.futureValue)}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-amber-50 border-amber-200">
              <CardHeader className="pb-2">
                <CardDescription>Purchasing Power Loss</CardDescription>
                <CardTitle className="text-2xl text-amber-600">{formatCurrency(results.purchasingPowerLoss)}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Nominal vs Real Cost Comparison</CardTitle>
              <CardDescription>See how much more you'll need to pay for the same thing in the future.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(v) => `₹${v/100000}L`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="nominalValue" fill="#94a3b8" name="Today's Cost" />
                  <Bar dataKey="futureValue" fill="#ef4444" name="Future Cost" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                In {timePeriod} years, you will need <span className="font-bold text-destructive">{formatCurrency(results.futureValue)}</span> to buy what costs <span className="font-bold">{formatCurrency(currentAmount)}</span> today, assuming a constant {inflationRate}% inflation rate.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InflationCalculator;
