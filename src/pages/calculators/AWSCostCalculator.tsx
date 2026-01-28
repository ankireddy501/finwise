import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Server, Database, HardDrive, Network, Cloud } from 'lucide-react';

const AWSCostCalculator: React.FC = () => {
  // Compute (EC2)
  const [ec2Instances, setEc2Instances] = useState<number>(2);
  const [ec2InstanceType, setEc2InstanceType] = useState<string>('t3.medium');
  const [ec2HoursPerMonth, setEc2HoursPerMonth] = useState<number>(730); // 24/7

  // Storage (S3)
  const [s3StorageGB, setS3StorageGB] = useState<number>(100);
  const [s3Requests, setS3Requests] = useState<number>(100000);

  // Database (RDS)
  const [rdsInstances, setRdsInstances] = useState<number>(1);
  const [rdsInstanceType, setRdsInstanceType] = useState<string>('db.t3.medium');
  const [rdsStorageGB, setRdsStorageGB] = useState<number>(100);

  // Data Transfer
  const [dataTransferOutGB, setDataTransferOutGB] = useState<number>(100);

  // Lambda
  const [lambdaRequests, setLambdaRequests] = useState<number>(1000000);
  const [lambdaComputeGBSeconds, setLambdaComputeGBSeconds] = useState<number>(100000);

  const [results, setResults] = useState({
    totalMonthly: 0,
    totalAnnual: 0,
    breakdown: [] as any[],
  });

  // AWS Pricing (approximate, in USD - convert to INR)
  const ec2Pricing: Record<string, number> = {
    't3.micro': 0.0104,
    't3.small': 0.0208,
    't3.medium': 0.0416,
    't3.large': 0.0832,
    'm5.large': 0.096,
    'm5.xlarge': 0.192,
    'c5.large': 0.085,
    'c5.xlarge': 0.17,
  };

  const rdsPricing: Record<string, number> = {
    'db.t3.micro': 0.017,
    'db.t3.small': 0.034,
    'db.t3.medium': 0.068,
    'db.t3.large': 0.136,
    'db.m5.large': 0.171,
    'db.m5.xlarge': 0.342,
  };

  useEffect(() => {
    calculateAWSCost();
  }, [ec2Instances, ec2InstanceType, ec2HoursPerMonth, s3StorageGB, s3Requests, rdsInstances, rdsInstanceType, rdsStorageGB, dataTransferOutGB, lambdaRequests, lambdaComputeGBSeconds]);

  const calculateAWSCost = () => {
    const usdToInr = 83; // Approximate conversion rate

    // EC2 Cost
    const ec2HourlyRate = ec2Pricing[ec2InstanceType] || 0.0416;
    const ec2Monthly = ec2Instances * ec2HourlyRate * ec2HoursPerMonth * usdToInr;

    // S3 Cost
    const s3StorageCost = (s3StorageGB * 0.023) * usdToInr; // $0.023 per GB
    const s3RequestCost = (s3Requests / 1000 * 0.0004) * usdToInr; // $0.0004 per 1000 requests
    const s3Monthly = s3StorageCost + s3RequestCost;

    // RDS Cost
    const rdsHourlyRate = rdsPricing[rdsInstanceType] || 0.068;
    const rdsComputeMonthly = rdsInstances * rdsHourlyRate * 730 * usdToInr;
    const rdsStorageMonthly = (rdsStorageGB * 0.115) * usdToInr; // $0.115 per GB
    const rdsMonthly = rdsComputeMonthly + rdsStorageMonthly;

    // Data Transfer Cost
    const dataTransferMonthly = (dataTransferOutGB * 0.09) * usdToInr; // $0.09 per GB (first 10TB)

    // Lambda Cost
    const lambdaRequestCost = (lambdaRequests / 1000000 * 0.20) * usdToInr; // $0.20 per 1M requests
    const lambdaComputeCost = (lambdaComputeGBSeconds / 1000000 * 0.0000166667) * usdToInr; // $0.0000166667 per GB-second
    const lambdaMonthly = lambdaRequestCost + lambdaComputeCost;

    const totalMonthly = ec2Monthly + s3Monthly + rdsMonthly + dataTransferMonthly + lambdaMonthly;
    const totalAnnual = totalMonthly * 12;

    const breakdown = [
      { name: 'EC2 Compute', value: Math.round(ec2Monthly), color: '#FF9900' },
      { name: 'S3 Storage', value: Math.round(s3Monthly), color: '#232F3E' },
      { name: 'RDS Database', value: Math.round(rdsMonthly), color: '#3F48CC' },
      { name: 'Data Transfer', value: Math.round(dataTransferMonthly), color: '#FF9900' },
      { name: 'Lambda', value: Math.round(lambdaMonthly), color: '#FF9900' },
    ];

    setResults({
      totalMonthly,
      totalAnnual,
      breakdown,
    });
  };

  const COLORS = ['#FF9900', '#232F3E', '#3F48CC', '#146EB4', '#FF9900'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AWS Cost Calculator</h2>
        <p className="text-muted-foreground">Estimate your monthly and annual AWS cloud infrastructure costs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Service Configuration</CardTitle>
            <CardDescription>Configure your AWS services usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* EC2 Section */}
            <div className="space-y-4 border-b pb-6">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">EC2 Compute</Label>
              </div>
              <div className="space-y-4 pl-7">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Number of Instances</Label>
                    <span className="text-sm font-medium">{ec2Instances}</span>
                  </div>
                  <Slider
                    value={[ec2Instances]}
                    onValueChange={(value) => setEc2Instances(value[0])}
                    min={1}
                    max={50}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instance Type</Label>
                  <Select value={ec2InstanceType} onValueChange={setEc2InstanceType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="t3.micro">t3.micro</SelectItem>
                      <SelectItem value="t3.small">t3.small</SelectItem>
                      <SelectItem value="t3.medium">t3.medium</SelectItem>
                      <SelectItem value="t3.large">t3.large</SelectItem>
                      <SelectItem value="m5.large">m5.large</SelectItem>
                      <SelectItem value="m5.xlarge">m5.xlarge</SelectItem>
                      <SelectItem value="c5.large">c5.large</SelectItem>
                      <SelectItem value="c5.xlarge">c5.xlarge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Hours per Month</Label>
                    <span className="text-sm font-medium">{ec2HoursPerMonth}</span>
                  </div>
                  <Slider
                    value={[ec2HoursPerMonth]}
                    onValueChange={(value) => setEc2HoursPerMonth(value[0])}
                    min={1}
                    max={730}
                    step={1}
                  />
                </div>
              </div>
            </div>

            {/* S3 Section */}
            <div className="space-y-4 border-b pb-6">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">S3 Storage</Label>
              </div>
              <div className="space-y-4 pl-7">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Storage (GB)</Label>
                    <Input
                      type="number"
                      value={s3StorageGB}
                      onChange={(e) => setS3StorageGB(Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Requests per Month</Label>
                    <Input
                      type="number"
                      value={s3Requests}
                      onChange={(e) => setS3Requests(Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RDS Section */}
            <div className="space-y-4 border-b pb-6">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">RDS Database</Label>
              </div>
              <div className="space-y-4 pl-7">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Number of Instances</Label>
                    <span className="text-sm font-medium">{rdsInstances}</span>
                  </div>
                  <Slider
                    value={[rdsInstances]}
                    onValueChange={(value) => setRdsInstances(value[0])}
                    min={1}
                    max={10}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instance Type</Label>
                  <Select value={rdsInstanceType} onValueChange={setRdsInstanceType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="db.t3.micro">db.t3.micro</SelectItem>
                      <SelectItem value="db.t3.small">db.t3.small</SelectItem>
                      <SelectItem value="db.t3.medium">db.t3.medium</SelectItem>
                      <SelectItem value="db.t3.large">db.t3.large</SelectItem>
                      <SelectItem value="db.m5.large">db.m5.large</SelectItem>
                      <SelectItem value="db.m5.xlarge">db.m5.xlarge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Storage (GB)</Label>
                    <Input
                      type="number"
                      value={rdsStorageGB}
                      onChange={(e) => setRdsStorageGB(Number(e.target.value))}
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

            {/* Lambda */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">Lambda Functions</Label>
              </div>
              <div className="space-y-4 pl-7">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Requests per Month</Label>
                    <Input
                      type="number"
                      value={lambdaRequests}
                      onChange={(e) => setLambdaRequests(Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Compute (GB-seconds)</Label>
                    <Input
                      type="number"
                      value={lambdaComputeGBSeconds}
                      onChange={(e) => setLambdaComputeGBSeconds(Number(e.target.value))}
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
            This is an estimate for planning purposes only. Actual costs may vary based on actual usage, region, discounts, and reserved instances. Consult AWS pricing calculator for accurate estimates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AWSCostCalculator;
