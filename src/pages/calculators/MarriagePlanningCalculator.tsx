import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MarriagePlanningCalculator: React.FC = () => {
  const [currentCost, setCurrentCost] = useState<number>(1000000);
  const [childAge, setChildAge] = useState<number>(5);
  const [marriageAge, setMarriageAge] = useState<number>(25);
  const [inflation, setInflation] = useState<number>(6);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);

  const [results, setResults] = useState({
    futureCost: 0,
    monthlySIP: 0,
    lumpSum: 0,
    yearsLeft: 0,
  });

  useEffect(() => {
    calculateMarriageFund();
  }, [currentCost, childAge, marriageAge, inflation, expectedReturn]);

  const calculateMarriageFund = () => {
    const yearsLeft = marriageAge - childAge;
    if (yearsLeft <= 0) return;

    // Future Cost = Current Cost * (1 + inflation)^yearsLeft
    const futureCost = currentCost * Math.pow(1 + inflation / 100, yearsLeft);

    // Monthly SIP Required
    const r = expectedReturn / 100 / 12;
    const n = yearsLeft * 12;
    const monthlySIP = (futureCost * r) / ((Math.pow(1 + r, n) - 1) * (1 + r));

    // Lump Sum Required Today
    const lumpSum = futureCost / Math.pow(1 + expectedReturn / 100, yearsLeft);

    setResults({
      futureCost,
      monthlySIP,
      lumpSum,
      yearsLeft,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Marriage Planning Calculator</h2>
        <p className="text-muted-foreground">Estimate future wedding costs and plan your investments today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Planning Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Current Wedding Cost</Label>
                <span className="font-medium">{formatCurrency(currentCost)}</span>
              </div>
              <Input
                type="number"
                value={currentCost}
                onChange={(e) => setCurrentCost(Number(e.target.value))}
              />
              <Slider
                value={[currentCost]}
                onValueChange={(v) => setCurrentCost(v[0])}
                min={100000}
                max={50000000}
                step={100000}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Child's Current Age</Label>
                <span className="font-medium">{childAge} years</span>
              </div>
              <Slider
                value={[childAge]}
                onValueChange={(v) => setChildAge(v[0])}
                min={0}
                max={20}
                step={1}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Target Marriage Age</Label>
                <span className="font-medium">{marriageAge} years</span>
              </div>
              <Slider
                value={[marriageAge]}
                onValueChange={(v) => setMarriageAge(v[0])}
                min={childAge + 1}
                max={35}
                step={1}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between">
                <Label>Expected Inflation (%)</Label>
                <span className="font-medium">{inflation}%</span>
              </div>
              <Slider
                value={[inflation]}
                onValueChange={(v) => setInflation(v[0])}
                min={4}
                max={10}
                step={0.5}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Investment Return (%)</Label>
                <span className="font-medium">{expectedReturn}%</span>
              </div>
              <Slider
                value={[expectedReturn]}
                onValueChange={(v) => setExpectedReturn(v[0])}
                min={8}
                max={15}
                step={0.5}
              />
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="text-center pb-2">
              <CardDescription>Future Wedding Cost (in {results.yearsLeft} years)</CardDescription>
              <CardTitle className="text-4xl text-primary font-bold">{formatCurrency(results.futureCost)}</CardTitle>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-success">
              <CardHeader className="pb-2">
                <CardDescription>Monthly SIP Required</CardDescription>
                <CardTitle className="text-2xl text-success font-bold">{formatCurrency(results.monthlySIP)}</CardTitle>
                <CardDescription>To reach goal in {results.yearsLeft} years</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardDescription>Lump Sum Required Today</CardDescription>
                <CardTitle className="text-2xl text-blue-600 font-bold">{formatCurrency(results.lumpSum)}</CardTitle>
                <CardDescription>One-time investment today</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Why plan early?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <p>
                  Inflation at <span className="font-bold">{inflation}%</span> means your <span className="font-bold">{formatCurrency(currentCost)}</span> wedding will cost <span className="font-bold text-primary">{formatCurrency(results.futureCost)}</span> in {results.yearsLeft} years.
                </p>
                <p>
                  By starting a SIP of <span className="font-bold text-success">{formatCurrency(results.monthlySIP)}</span> today at <span className="font-bold">{expectedReturn}%</span> return, you can comfortably accumulate the required corpus.
                </p>
              </div>
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

export default MarriagePlanningCalculator;
