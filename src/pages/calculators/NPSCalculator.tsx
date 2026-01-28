import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const NPSCalculator: React.FC = () => {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(10000);
  const [expectedReturn, setExpectedReturn] = useState<number>(10);
  const [annuityPercent, setAnnuityPercent] = useState<number>(40);
  const [annuityReturn, setAnnuityReturn] = useState<number>(6);

  const [results, setResults] = useState({
    totalContribution: 0,
    totalInterest: 0,
    totalCorpus: 0,
    lumpSum: 0,
    annuityAmount: 0,
    monthlyPension: 0,
    yearlyData: [] as any[],
  });

  useEffect(() => {
    calculateNPS();
  }, [currentAge, retirementAge, monthlyInvestment, expectedReturn, annuityPercent, annuityReturn]);

  const calculateNPS = () => {
    const yearsToInvest = retirementAge - currentAge;
    const months = yearsToInvest * 12;
    const monthlyRate = expectedReturn / 12 / 100;

    // FV = P × [(1 + r)^n - 1] / r × (1 + r)
    const totalCorpus = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalContribution = monthlyInvestment * months;
    const totalInterest = totalCorpus - totalContribution;

    const annuityAmount = (totalCorpus * annuityPercent) / 100;
    const lumpSum = totalCorpus - annuityAmount;
    const monthlyPension = (annuityAmount * (annuityReturn / 100)) / 12;

    // Generate year-wise data for chart
    const yearlyData = [];
    for (let i = 1; i <= yearsToInvest; i++) {
      const m = i * 12;
      const corpus = monthlyInvestment * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate);
      yearlyData.push({
        year: currentAge + i,
        corpus: Math.round(corpus),
        contribution: monthlyInvestment * m,
        interest: Math.round(corpus - (monthlyInvestment * m)),
      });
    }

    setResults({
      totalContribution,
      totalInterest,
      totalCorpus,
      lumpSum,
      annuityAmount,
      monthlyPension,
      yearlyData,
    });
  };

  const pieData = [
    { name: 'Total Contribution', value: results.totalContribution },
    { name: 'Total Interest', value: results.totalInterest },
  ];

  const COLORS = ['#3b82f6', '#10b981'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">NPS Calculator</h2>
        <p className="text-muted-foreground">Estimate your retirement corpus with National Pension System.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Investment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Current Age</Label>
                <span className="font-medium">{currentAge} years</span>
              </div>
              <Slider
                value={[currentAge]}
                onValueChange={(v) => setCurrentAge(v[0])}
                min={18}
                max={60}
                step={1}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Retirement Age</Label>
                <span className="font-medium">{retirementAge} years</span>
              </div>
              <Slider
                value={[retirementAge]}
                onValueChange={(v) => setRetirementAge(v[0])}
                min={Math.max(currentAge + 1, 60)}
                max={70}
                step={1}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Monthly Contribution</Label>
                <span className="font-medium">{formatCurrency(monthlyInvestment)}</span>
              </div>
              <Input
                type="number"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="mt-2"
              />
              <Slider
                value={[monthlyInvestment]}
                onValueChange={(v) => setMonthlyInvestment(v[0])}
                min={500}
                max={200000}
                step={500}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Expected Return (%)</Label>
                <span className="font-medium">{expectedReturn}%</span>
              </div>
              <Slider
                value={[expectedReturn]}
                onValueChange={(v) => setExpectedReturn(v[0])}
                min={5}
                max={15}
                step={0.5}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Annuity Purchase (%)</Label>
                <span className="font-medium">{annuityPercent}%</span>
              </div>
              <Slider
                value={[annuityPercent]}
                onValueChange={(v) => setAnnuityPercent(v[0])}
                min={40}
                max={100}
                step={1}
              />
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardDescription>Total Corpus at Retirement</CardDescription>
                <CardTitle className="text-2xl text-primary">{formatCurrency(results.totalCorpus)}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-success/5 border-success/20">
              <CardHeader className="pb-2">
                <CardDescription>Estimated Monthly Pension</CardDescription>
                <CardTitle className="text-2xl text-success">{formatCurrency(results.monthlyPension)}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Results Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="growth">Growth Chart</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
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
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Total Invested</span>
                        <span className="font-semibold">{formatCurrency(results.totalContribution)}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Total Interest</span>
                        <span className="font-semibold text-success">{formatCurrency(results.totalInterest)}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Lump Sum (60%)</span>
                        <span className="font-semibold">{formatCurrency(results.lumpSum)}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Annuity (40%)</span>
                        <span className="font-semibold">{formatCurrency(results.annuityAmount)}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="growth" className="pt-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={results.yearlyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="year" />
                        <YAxis tickFormatter={(v) => `₹${v/100000}L`} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="contribution" stackId="a" fill="#3b82f6" name="Investment" />
                        <Bar dataKey="interest" stackId="a" fill="#10b981" name="Interest" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
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

export default NPSCalculator;
