import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PFCalculator: React.FC = () => {
  const [basicSalary, setBasicSalary] = useState<number>(50000);
  const [currentAge, setCurrentAge] = useState<number>(25);
  const [retirementAge, setRetirementAge] = useState<number>(58);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [salaryIncrement, setSalaryIncrement] = useState<number>(8);
  const [interestRate, setInterestRate] = useState<number>(8.15);

  const [results, setResults] = useState({
    totalCorpus: 0,
    employeeContribution: 0,
    employerContribution: 0,
    totalInterest: 0,
    yearlyData: [] as any[],
  });

  useEffect(() => {
    calculatePF();
  }, [basicSalary, currentAge, retirementAge, currentBalance, salaryIncrement, interestRate]);

  const calculatePF = () => {
    const years = retirementAge - currentAge;
    let balance = currentBalance;
    let currentBasic = basicSalary;
    let totalEmployeeContrib = 0;
    let totalEmployerContrib = 0;
    let totalInterest = 0;

    const yearlyData = [];

    for (let year = 1; year <= years; year++) {
      const yearlyEmployeeContrib = currentBasic * 0.12 * 12;
      const yearlyEmployerContrib = (currentBasic * 0.0367) * 12; // 12% - 8.33% (EPS) = 3.67%
      
      const contributionThisYear = yearlyEmployeeContrib + yearlyEmployerContrib;
      
      // Interest is calculated monthly on the average balance, but simplified here yearly
      const interestThisYear = (balance + contributionThisYear / 2) * (interestRate / 100);
      
      balance += contributionThisYear + interestThisYear;
      totalEmployeeContrib += yearlyEmployeeContrib;
      totalEmployerContrib += yearlyEmployerContrib;
      totalInterest += interestThisYear;

      yearlyData.push({
        year: currentAge + year,
        balance: Math.round(balance),
        contribution: Math.round(totalEmployeeContrib + totalEmployerContrib),
        interest: Math.round(totalInterest),
      });

      currentBasic *= (1 + salaryIncrement / 100);
    }

    setResults({
      totalCorpus: balance,
      employeeContribution: totalEmployeeContrib,
      employerContribution: totalEmployerContrib,
      totalInterest: totalInterest,
      yearlyData,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">EPF Calculator</h2>
        <p className="text-muted-foreground">Estimate your Provident Fund corpus at the time of retirement.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Salary & Age Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Monthly Basic Salary + DA</Label>
                <span className="font-medium">{formatCurrency(basicSalary)}</span>
              </div>
              <Input
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
              />
              <Slider
                value={[basicSalary]}
                onValueChange={(v) => setBasicSalary(v[0])}
                min={15000}
                max={200000}
                step={1000}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Current Age</Label>
                <span className="font-medium">{currentAge} years</span>
              </div>
              <Slider
                value={[currentAge]}
                onValueChange={(v) => setCurrentAge(v[0])}
                min={21}
                max={57}
                step={1}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Expected Salary Increment (%)</Label>
                <span className="font-medium">{salaryIncrement}%</span>
              </div>
              <Slider
                value={[salaryIncrement]}
                onValueChange={(v) => setSalaryIncrement(v[0])}
                min={0}
                max={15}
                step={1}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between">
                <Label>Current PF Balance (Optional)</Label>
                <span className="font-medium">{formatCurrency(currentBalance)}</span>
              </div>
              <Input
                type="number"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardDescription>Total PF Corpus at {retirementAge}</CardDescription>
                <CardTitle className="text-3xl text-primary font-bold">{formatCurrency(results.totalCorpus)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Interest Earned</CardDescription>
                <CardTitle className="text-xl text-success font-bold">{formatCurrency(results.totalInterest)}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Employee Contribution (12%)</CardDescription>
                <CardTitle className="text-lg font-bold">{formatCurrency(results.employeeContribution)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Employer Contribution (3.67%)</CardDescription>
                <CardTitle className="text-lg font-bold">{formatCurrency(results.employerContribution)}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>PF Accumulation Chart</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(v) => `₹${v/100000}L`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="contribution" stackId="a" fill="#3b82f6" name="Total Contributions" />
                  <Bar dataKey="interest" stackId="a" fill="#10b981" name="Interest Earned" />
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

export default PFCalculator;
