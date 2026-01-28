import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HousingLoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(5000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(20);
  const [processingFeePercent, setProcessingFeePercent] = useState<number>(0.5);

  const [results, setResults] = useState({
    emi: 0,
    totalInterest: 0,
    totalPayment: 0,
    processingFee: 0,
    amortization: [] as any[],
  });

  useEffect(() => {
    calculateHousingLoan();
  }, [loanAmount, interestRate, tenure, processingFeePercent]);

  const calculateHousingLoan = () => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenure * 12;
    const fee = (P * processingFeePercent) / 100;

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    // Amortization (Yearly)
    const amortization = [];
    let remainingBalance = P;
    for (let year = 1; year <= tenure; year++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;
      
      for (let month = 1; month <= 12; month++) {
        const interest = remainingBalance * r;
        const principal = emi - interest;
        yearlyInterest += interest;
        yearlyPrincipal += principal;
        remainingBalance -= principal;
      }

      amortization.push({
        year: `Year ${year}`,
        principal: Math.round(yearlyPrincipal),
        interest: Math.round(yearlyInterest),
        balance: Math.max(0, Math.round(remainingBalance)),
      });
    }

    setResults({
      emi,
      totalInterest,
      totalPayment,
      processingFee: fee,
      amortization,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Housing Loan Calculator</h2>
        <p className="text-muted-foreground">Estimate your home loan EMI and view your yearly repayment schedule.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Home Loan Details</CardTitle>
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
                min={500000}
                max={50000000}
                step={100000}
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
                min={6}
                max={15}
                step={0.1}
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
                min={5}
                max={30}
                step={1}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Processing Fee (%)</Label>
                <span className="font-medium">{processingFeePercent}% ({formatCurrency(results.processingFee)})</span>
              </div>
              <Slider
                value={[processingFeePercent]}
                onValueChange={(v) => setProcessingFeePercent(v[0])}
                min={0}
                max={2}
                step={0.1}
              />
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardDescription>Monthly EMI</CardDescription>
                <CardTitle className="text-3xl text-primary font-bold">{formatCurrency(results.emi)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Interest Payable</CardDescription>
                <CardTitle className="text-xl text-destructive font-bold">{formatCurrency(results.totalInterest)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Amount Payable</CardDescription>
                <CardTitle className="text-xl font-bold">{formatCurrency(results.totalPayment)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Principal Amount</CardDescription>
                <CardTitle className="text-xl font-bold">{formatCurrency(loanAmount)}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Yearly Amortization Schedule</CardTitle>
              <CardDescription>Visualizing how you pay off your principal vs interest over time.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.amortization}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(v) => `₹${v/100000}L`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="principal" stackId="a" fill="#3b82f6" name="Principal Repayment" />
                  <Bar dataKey="interest" stackId="a" fill="#ef4444" name="Interest Paid" />
                </BarChart>
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

export default HousingLoanCalculator;
