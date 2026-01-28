import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const PersonalLoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(12);
  const [tenure, setTenure] = useState<number>(3);

  const [results, setResults] = useState({
    emi: 0,
    totalInterest: 0,
    totalRepayment: 0,
  });

  useEffect(() => {
    calculatePersonalLoan();
  }, [loanAmount, interestRate, tenure]);

  const calculatePersonalLoan = () => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenure * 12;

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalRepayment = emi * n;
    const totalInterest = totalRepayment - P;

    setResults({
      emi,
      totalInterest,
      totalRepayment,
    });
  };

  const pieData = [
    { name: 'Loan Amount', value: loanAmount },
    { name: 'Total Interest', value: results.totalInterest },
  ];

  const COLORS = ['#6366f1', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Personal Loan Calculator</h2>
        <p className="text-muted-foreground">Calculate EMI and total borrowing cost for personal loans.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Loan Amount</Label>
                <span className="font-medium">{formatCurrency(loanAmount)}</span>
              </div>
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
              />
              <Slider
                value={[loanAmount]}
                onValueChange={(v) => setLoanAmount(v[0])}
                min={50000}
                max={5000000}
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
                min={10}
                max={24}
                step={0.5}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Loan Tenure (Years)</Label>
                <span className="font-medium">{tenure} years</span>
              </div>
              <Slider
                value={[tenure]}
                onValueChange={(v) => setTenure(v[0])}
                min={1}
                max={7}
                step={1}
              />
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-indigo-50 border-indigo-200">
            <CardHeader className="text-center pb-2">
              <CardDescription className="text-indigo-800">Monthly EMI</CardDescription>
              <CardTitle className="text-4xl text-indigo-600 font-bold">{formatCurrency(results.emi)}</CardTitle>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Interest Payable</CardDescription>
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
              <CardTitle>Cost Analysis</CardTitle>
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

export default PersonalLoanCalculator;
