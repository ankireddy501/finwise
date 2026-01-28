import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Server, Database, HardDrive, Network, Cloud } from 'lucide-react';

const AzureCostCalculator: React.FC = () => {
  // Compute (Virtual Machines)
  const [vmInstances, setVmInstances] = useState<number>(2);
  const [vmSize, setVmSize] = useState<string>('Standard_B2s');
  const [vmHoursPerMonth, setVmHoursPerMonth] = useState<number>(730);

  // Storage (Blob Storage)
  const [blobStorageGB, setBlobStorageGB] = useState<number>(100);
  const [blobTransactions, setBlobTransactions] = useState<number>(100000);

  // Database (Azure SQL)
  const [sqlInstances, setSqlInstances] = useState<number>(1);
  const [sqlTier, setSqlTier] = useState<string>('S2');
  const [sqlStorageGB, setSqlStorageGB] = useState<number>(100);

  // Data Transfer
  const [dataTransferOutGB, setDataTransferOutGB] = useState<number>(100);

  // Functions (Azure Functions)
  const [functionExecutions, setFunctionExecutions] = useState<number>(1000000);
  const [functionComputeGBSeconds, setFunctionComputeGBSeconds] = useState<number>(100000);

  const [results, setResults] = useState({
    totalMonthly: 0,
    totalAnnual: 0,
    breakdown: [] as any[],
  });

  // Azure Pricing (approximate, in USD - convert to INR)
  const vmPricing: Record<string, number> = {
    'Standard_B1s': 0.0104,
    'Standard_B1ms': 0.0208,
    'Standard_B2s': 0.0416,
    'Standard_B2ms': 0.0832,
    'Standard_D2s_v3': 0.096,
    'Standard_D4s_v3': 0.192,
    'Standard_F2s_v2': 0.085,
    'Standard_F4s_v2': 0.17,
  };

  const sqlPricing: Record<string, number> = {
    'S0': 0.015,
    'S1': 0.030,
    'S2': 0.060,
    'S3': 0.120,
    'P1': 0.465,
    'P2': 0.930,
  };

  useEffect(() => {
    calculateAzureCost();
  }, [vmInstances, vmSize, vmHoursPerMonth, blobStorageGB, blobTransactions, sqlInstances, sqlTier, sqlStorageGB, dataTransferOutGB, functionExecutions, functionComputeGBSeconds]);

  const calculateAzureCost = () => {
    const usdToInr = 83;

    // VM Cost
    const vmHourlyRate = vmPricing[vmSize] || 0.0416;
    const vmMonthly = vmInstances * vmHourlyRate * vmHoursPerMonth * usdToInr;

    // Blob Storage Cost
    const blobStorageCost = (blobStorageGB * 0.018) * usdToInr; // $0.018 per GB
    const blobTransactionCost = (blobTransactions / 10000 * 0.004) * usdToInr; // $0.004 per 10K transactions
    const blobMonthly = blobStorageCost + blobTransactionCost;

    // SQL Database Cost
    const sqlHourlyRate = sqlPricing[sqlTier] || 0.060;
    const sqlComputeMonthly = sqlInstances * sqlHourlyRate * 730 * usdToInr;
    const sqlStorageMonthly = (sqlStorageGB * 0.115) * usdToInr; // $0.115 per GB
    const sqlMonthly = sqlComputeMonthly + sqlStorageMonthly;

    // Data Transfer Cost
    const dataTransferMonthly = (dataTransferOutGB * 0.087) * usdToInr; // $0.087 per GB

    // Functions Cost
    const functionExecutionCost = (functionExecutions / 1000000 * 0.20) * usdToInr;
    const functionComputeCost = (functionComputeGBSeconds / 1000000 * 0.000016) * usdToInr;
    const functionMonthly = functionExecutionCost + functionComputeCost;

    const totalMonthly = vmMonthly + blobMonthly + sqlMonthly + dataTransferMonthly + functionMonthly;
    const totalAnnual = totalMonthly * 12;

    const breakdown = [
      { name: 'Virtual Machines', value: Math.round(vmMonthly), color: '#0078D4' },
      { name: 'Blob Storage', value: Math.round(blobMonthly), color: '#0078D4' },
      { name: 'SQL Database', value: Math.round(sqlMonthly), color: '#0078D4' },
      { name: 'Data Transfer', value: Math.round(dataTransferMonthly), color: '#0078D4' },
      { name: 'Azure Functions', value: Math.round(functionMonthly), color: '#0078D4' },
    ];

    setResults({
      totalMonthly,
      totalAnnual,
      breakdown,
    });
  };

  const COLORS = ['#0078D4', '#0078D4', '#0078D4', '#0078D4', '#0078D4'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Azure Cost Calculator</h2>
        <p className="text-muted-foreground">Estimate your monthly and annual Microsoft Azure cloud infrastructure costs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Service Configuration</CardTitle>
            <CardDescription>Configure your Azure services usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* VM Section */}
            <div className="space-y-4 border-b pb-6">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">Virtual Machines</Label>
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
                  <Label>VM Size</Label>
                  <Select value={vmSize} onValueChange={setVmSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard_B1s">Standard_B1s</SelectItem>
                      <SelectItem value="Standard_B1ms">Standard_B1ms</SelectItem>
                      <SelectItem value="Standard_B2s">Standard_B2s</SelectItem>
                      <SelectItem value="Standard_B2ms">Standard_B2ms</SelectItem>
                      <SelectItem value="Standard_D2s_v3">Standard_D2s_v3</SelectItem>
                      <SelectItem value="Standard_D4s_v3">Standard_D4s_v3</SelectItem>
                      <SelectItem value="Standard_F2s_v2">Standard_F2s_v2</SelectItem>
                      <SelectItem value="Standard_F4s_v2">Standard_F4s_v2</SelectItem>
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

            {/* Blob Storage Section */}
            <div className="space-y-4 border-b pb-6">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">Blob Storage</Label>
              </div>
              <div className="space-y-4 pl-7">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Storage (GB)</Label>
                    <Input
                      type="number"
                      value={blobStorageGB}
                      onChange={(e) => setBlobStorageGB(Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Transactions per Month</Label>
                    <Input
                      type="number"
                      value={blobTransactions}
                      onChange={(e) => setBlobTransactions(Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SQL Database Section */}
            <div className="space-y-4 border-b pb-6">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">Azure SQL Database</Label>
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
                  <Label>Service Tier</Label>
                  <Select value={sqlTier} onValueChange={setSqlTier}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S0">S0 (Basic)</SelectItem>
                      <SelectItem value="S1">S1 (Standard)</SelectItem>
                      <SelectItem value="S2">S2 (Standard)</SelectItem>
                      <SelectItem value="S3">S3 (Standard)</SelectItem>
                      <SelectItem value="P1">P1 (Premium)</SelectItem>
                      <SelectItem value="P2">P2 (Premium)</SelectItem>
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

            {/* Azure Functions */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">Azure Functions</Label>
              </div>
              <div className="space-y-4 pl-7">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Executions per Month</Label>
                    <Input
                      type="number"
                      value={functionExecutions}
                      onChange={(e) => setFunctionExecutions(Number(e.target.value))}
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
            This is an estimate for planning purposes only. Actual costs may vary based on actual usage, region, discounts, and reserved instances. Consult Azure pricing calculator for accurate estimates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AzureCostCalculator;
