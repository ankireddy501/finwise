import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Server, Database, HardDrive, Network, Cloud } from 'lucide-react';

const GCPCostCalculator: React.FC = () => {
  // Compute (Compute Engine)
  const [vmInstances, setVmInstances] = useState<number>(2);
  const [vmMachineType, setVmMachineType] = useState<string>('n1-standard-1');
  const [vmHoursPerMonth, setVmHoursPerMonth] = useState<number>(730);

  // Storage (Cloud Storage)
  const [storageGB, setStorageGB] = useState<number>(100);
  const [storageOperations, setStorageOperations] = useState<number>(100000);

  // Database (Cloud SQL)
  const [sqlInstances, setSqlInstances] = useState<number>(1);
  const [sqlTier, setSqlTier] = useState<string>('db-n1-standard-1');
  const [sqlStorageGB, setSqlStorageGB] = useState<number>(100);

  // Data Transfer
  const [dataTransferOutGB, setDataTransferOutGB] = useState<number>(100);

  // Cloud Functions
  const [functionInvocations, setFunctionInvocations] = useState<number>(1000000);
  const [functionComputeGBSeconds, setFunctionComputeGBSeconds] = useState<number>(100000);

  const [results, setResults] = useState({
    totalMonthly: 0,
    totalAnnual: 0,
    breakdown: [] as any[],
  });

  // GCP Pricing (approximate, in USD - convert to INR)
  const vmPricing: Record<string, number> = {
    'f1-micro': 0.0076,
    'g1-small': 0.0257,
    'n1-standard-1': 0.0475,
    'n1-standard-2': 0.0950,
    'n1-standard-4': 0.1900,
    'n1-highmem-2': 0.1184,
    'n1-highmem-4': 0.2368,
  };

  const sqlPricing: Record<string, number> = {
    'db-f1-micro': 0.015,
    'db-g1-small': 0.030,
    'db-n1-standard-1': 0.060,
    'db-n1-standard-2': 0.120,
    'db-n1-standard-4': 0.240,
  };

  useEffect(() => {
    calculateGCPCost();
  }, [vmInstances, vmMachineType, vmHoursPerMonth, storageGB, storageOperations, sqlInstances, sqlTier, sqlStorageGB, dataTransferOutGB, functionInvocations, functionComputeGBSeconds]);

  const calculateGCPCost = () => {
    const usdToInr = 83;

    // Compute Engine Cost
    const vmHourlyRate = vmPricing[vmMachineType] || 0.0475;
    const vmMonthly = vmInstances * vmHourlyRate * vmHoursPerMonth * usdToInr;

    // Cloud Storage Cost
    const storageCost = (storageGB * 0.020) * usdToInr; // $0.020 per GB
    const storageOpsCost = (storageOperations / 10000 * 0.005) * usdToInr; // $0.005 per 10K operations
    const storageMonthly = storageCost + storageOpsCost;

    // Cloud SQL Cost
    const sqlHourlyRate = sqlPricing[sqlTier] || 0.060;
    const sqlComputeMonthly = sqlInstances * sqlHourlyRate * 730 * usdToInr;
    const sqlStorageMonthly = (sqlStorageGB * 0.17) * usdToInr; // $0.17 per GB
    const sqlMonthly = sqlComputeMonthly + sqlStorageMonthly;

    // Data Transfer Cost
    const dataTransferMonthly = (dataTransferOutGB * 0.12) * usdToInr; // $0.12 per GB (first 10TB)

    // Cloud Functions Cost
    const functionInvocationCost = (functionInvocations / 1000000 * 0.40) * usdToInr; // $0.40 per 1M invocations
    const functionComputeCost = (functionComputeGBSeconds / 1000000 * 0.0000025) * usdToInr; // $0.0000025 per GB-second
    const functionMonthly = functionInvocationCost + functionComputeCost;

    const totalMonthly = vmMonthly + storageMonthly + sqlMonthly + dataTransferMonthly + functionMonthly;
    const totalAnnual = totalMonthly * 12;

    const breakdown = [
      { name: 'Compute Engine', value: Math.round(vmMonthly), color: '#4285F4' },
      { name: 'Cloud Storage', value: Math.round(storageMonthly), color: '#4285F4' },
      { name: 'Cloud SQL', value: Math.round(sqlMonthly), color: '#4285F4' },
      { name: 'Data Transfer', value: Math.round(dataTransferMonthly), color: '#4285F4' },
      { name: 'Cloud Functions', value: Math.round(functionMonthly), color: '#4285F4' },
    ];

    setResults({
      totalMonthly,
      totalAnnual,
      breakdown,
    });
  };

  const COLORS = ['#4285F4', '#4285F4', '#4285F4', '#4285F4', '#4285F4'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">GCP Cost Calculator</h2>
        <p className="text-muted-foreground">Estimate your monthly and annual Google Cloud Platform infrastructure costs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Service Configuration</CardTitle>
            <CardDescription>Configure your GCP services usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Compute Engine Section */}
            <div className="space-y-4 border-b pb-6">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">Compute Engine</Label>
              </div>
              <div className="space-y-4 pl-7">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Number of VMs</Label>
                    <span className="text-sm font-medium">{vmInstances}</span>
                  </div>
                  <Slider
                    value={[vmInstances]}
                    onValueChange={(value) => setVmInstances(value[0])}
                    min={1}
                    max={50}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Machine Type</Label>
                  <Select value={vmMachineType} onValueChange={setVmMachineType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="f1-micro">f1-micro</SelectItem>
                      <SelectItem value="g1-small">g1-small</SelectItem>
                      <SelectItem value="n1-standard-1">n1-standard-1</SelectItem>
                      <SelectItem value="n1-standard-2">n1-standard-2</SelectItem>
                      <SelectItem value="n1-standard-4">n1-standard-4</SelectItem>
                      <SelectItem value="n1-highmem-2">n1-highmem-2</SelectItem>
                      <SelectItem value="n1-highmem-4">n1-highmem-4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Hours per Month</Label>
                    <span className="text-sm font-medium">{vmHoursPerMonth}</span>
                  </div>
                  <Slider
                    value={[vmHoursPerMonth]}
                    onValueChange={(value) => setVmHoursPerMonth(value[0])}
                    min={1}
                    max={730}
                    step={1}
                  />
                </div>
              </div>
            </div>

            {/* Cloud Storage Section */}
            <div className="space-y-4 border-b pb-6">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">Cloud Storage</Label>
              </div>
              <div className="space-y-4 pl-7">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Storage (GB)</Label>
                    <Input
                      type="number"
                      value={storageGB}
                      onChange={(e) => setStorageGB(Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Operations per Month</Label>
                    <Input
                      type="number"
                      value={storageOperations}
                      onChange={(e) => setStorageOperations(Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Cloud SQL Section */}
            <div className="space-y-4 border-b pb-6">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">Cloud SQL</Label>
              </div>
              <div className="space-y-4 pl-7">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Number of Instances</Label>
                    <span className="text-sm font-medium">{sqlInstances}</span>
                  </div>
                  <Slider
                    value={[sqlInstances]}
                    onValueChange={(value) => setSqlInstances(value[0])}
                    min={1}
                    max={10}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instance Tier</Label>
                  <Select value={sqlTier} onValueChange={setSqlTier}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="db-f1-micro">db-f1-micro</SelectItem>
                      <SelectItem value="db-g1-small">db-g1-small</SelectItem>
                      <SelectItem value="db-n1-standard-1">db-n1-standard-1</SelectItem>
                      <SelectItem value="db-n1-standard-2">db-n1-standard-2</SelectItem>
                      <SelectItem value="db-n1-standard-4">db-n1-standard-4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Storage (GB)</Label>
                    <Input
                      type="number"
                      value={sqlStorageGB}
                      onChange={(e) => setSqlStorageGB(Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Data Transfer */}
            <div className="space-y-4 border-b pb-6">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">Data Transfer Out (GB)</Label>
              </div>
              <div className="space-y-4 pl-7">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Data Transfer Out per Month</Label>
                    <Input
                      type="number"
                      value={dataTransferOutGB}
                      onChange={(e) => setDataTransferOutGB(Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Cloud Functions */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">Cloud Functions</Label>
              </div>
              <div className="space-y-4 pl-7">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Invocations per Month</Label>
                    <Input
                      type="number"
                      value={functionInvocations}
                      onChange={(e) => setFunctionInvocations(Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Compute (GB-seconds)</Label>
                    <Input
                      type="number"
                      value={functionComputeGBSeconds}
                      onChange={(e) => setFunctionComputeGBSeconds(Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center pb-2">
            <CardDescription>Estimated Monthly Cost</CardDescription>
            <CardTitle className="text-4xl text-primary font-bold">
              {formatCurrency(results.totalMonthly)}
            </CardTitle>
            <CardDescription className="pt-2">
              Annual: {formatCurrency(results.totalAnnual)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <CardTitle className="text-lg mb-4">Cost Breakdown</CardTitle>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={results.breakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {results.breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {results.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground italic">
            This is an estimate for planning purposes only. Actual costs may vary based on actual usage, region, discounts, and committed use discounts. Consult GCP pricing calculator for accurate estimates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GCPCostCalculator;
