import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SSYCalculator: React.FC = () => {
  const [yearlyDeposit, setYearlyDeposit] = useState<number>(50000);
  const [girlAge, setGirlAge] = useState<number>(1);
  const [interestRate, setInterestRate] = useState<number>(8.2);

  const [results, setResults] = useState({
    maturityValue: 0,
    totalDeposit: 0,
    totalInterest: 0,
    maturityYear: 0,
    yearlyData: [] as any[],
  });

  useEffect(() => {
    calculateSSY();
  }, [yearlyDeposit, girlAge, interestRate]);

  const calculateSSY = () => {
    const maturityDuration = 21;
    const depositDuration = 15;
    const rate = interestRate / 100;
    
    let balance = 0;
    let totalDeposit = 0;
    const yearlyData = [];
    const currentYear = new Date().getFullYear();

    for (let year = 1; year <= maturityDuration; year++) {
      if (year <= depositDuration) {
        balance += yearlyDeposit;
        totalDeposit += yearlyDeposit;
      }
      
      const interest = balance * rate;
      balance += interest;

      yearlyData.push({
        year: currentYear + year,
        age: girlAge + year,
        balance: Math.round(balance),
        deposit: totalDeposit,
        interest: Math.round(balance - totalDeposit),
      });
    }

    setResults({
      maturityValue: balance,
      totalDeposit,
      totalInterest: balance - totalDeposit,
      maturityYear: currentYear + maturityDuration,
      yearlyData,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Sukanya Samriddhi Yojana (SSY)</h2>
        <p className="text-muted-foreground">Plan for your daughter's future with the SSY calculator.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Plan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Yearly Investment</Label>
                <span className="font-medium">{formatCurrency(yearlyDeposit)}</span>
              </div>
              <Input
                type="number"
                value={yearlyDeposit}
                onChange={(e) => setYearlyDeposit(Number(e.target.value))}
              />
              <Slider
                value={[yearlyDeposit]}
                onValueChange={(v) => setYearlyDeposit(v[0])}
                min={250}
                max={150000}
                step={500}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Girl's Current Age</Label>
                <span className="font-medium">{girlAge} years</span>
              </div>
              <Slider
                value={[girlAge]}
                onValueChange={(v) => setGirlAge(v[0])}
                min={0}
                max={10}
                step={1}
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
                max={10}
                step={0.1}
              />
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-pink-50 border-pink-200">
            <CardHeader className="text-center pb-2">
              <CardDescription className="text-pink-800">Maturity Value (at 21 years)</CardDescription>
              <CardTitle className="text-4xl text-pink-600 font-bold">{formatCurrency(results.maturityValue)}</CardTitle>
              <CardDescription className="text-pink-700">Maturity Year: {results.maturityYear}</CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Deposit (15 Years)</CardDescription>
                <CardTitle className="text-xl font-bold">{formatCurrency(results.totalDeposit)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Interest Earned</CardDescription>
                <CardTitle className="text-xl text-success font-bold">{formatCurrency(results.totalInterest)}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Maturity Projection</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results.yearlyData}>
                  <defs>
                    <linearGradient id="colorSSY" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#db2777" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#db2777" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="age" label={{ value: 'Girl Age', position: 'insideBottom', offset: -5 }} />
                  <YAxis tickFormatter={(v) => `₹${v/100000}L`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#db2777" 
                    fillOpacity={1} 
                    fill="url(#colorSSY)" 
                    name="Maturity Value" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="deposit" 
                    stroke="#94a3b8" 
                    fill="#94a3b8" 
                    fillOpacity={0.3} 
                    name="Total Invested" 
                  />
                </AreaChart>
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

export default SSYCalculator;
