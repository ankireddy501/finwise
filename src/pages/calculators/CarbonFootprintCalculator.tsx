import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Car, Plane, Home, Zap, ShoppingBag, TreePine, Leaf, MapPin, ExternalLink, Phone, Mail, Cloud, ArrowRight, Coins, TrendingUp, Circle } from 'lucide-react';
import { useNGOsByCity, useCloudRegions } from '@/lib/contentstack-hooks';

const CarbonFootprintCalculator: React.FC = () => {
  // Transportation
  const [carKmPerMonth, setCarKmPerMonth] = useState<number>(1000);
  const [carFuelType, setCarFuelType] = useState<string>('petrol');
  const [carEfficiency, setCarEfficiency] = useState<number>(15); // km per liter
  const [bikeKmPerMonth, setBikeKmPerMonth] = useState<number>(500);
  const [publicTransportKmPerMonth, setPublicTransportKmPerMonth] = useState<number>(200);
  const [flightHoursPerYear, setFlightHoursPerYear] = useState<number>(10);

  // Energy (Home)
  const [electricityKwhPerMonth, setElectricityKwhPerMonth] = useState<number>(300);
  const [lpgCylindersPerMonth, setLpgCylindersPerMonth] = useState<number>(1);
  const [cngKgPerMonth, setCngKgPerMonth] = useState<number>(0);

  // Lifestyle
  const [meatMealsPerWeek, setMeatMealsPerWeek] = useState<number>(7);
  const [shoppingAmountPerMonth, setShoppingAmountPerMonth] = useState<number>(5000);

  // Cloud Infrastructure
  const [cloudProvider, setCloudProvider] = useState<string>('aws');
  const [cloudRegion, setCloudRegion] = useState<string>('ap-south-1'); // Mumbai region
  const [computeInstances, setComputeInstances] = useState<number>(2);
  const [computeHoursPerMonth, setComputeHoursPerMonth] = useState<number>(730);
  const [computeInstanceType, setComputeInstanceType] = useState<string>('medium');
  const [storageGB, setStorageGB] = useState<number>(100);
  const [dataTransferGB, setDataTransferGB] = useState<number>(100);
  const [databaseInstances, setDatabaseInstances] = useState<number>(1);
  const [databaseHoursPerMonth, setDatabaseHoursPerMonth] = useState<number>(730);

  // City selection for NGO suggestions
  const [selectedCity, setSelectedCity] = useState<string>('mumbai');

  // Fetch NGOs and cloud regions from Contentstack
  const { ngos: contentstackNGOs, loading: ngosLoading } = useNGOsByCity(selectedCity);
  const { regions: cloudRegions, loading: regionsLoading } = useCloudRegions(cloudProvider);

  const [results, setResults] = useState({
    totalAnnualCO2: 0, // in kg
    totalAnnualCO2Tons: 0,
    treesNeeded: 0,
    breakdown: [] as any[],
    monthlyBreakdown: [] as any[],
    cloudCO2Annual: 0,
  });

  // Carbon emission factors (kg CO2 per unit)
  const emissionFactors = {
    petrol: 2.31, // kg CO2 per liter
    diesel: 2.68, // kg CO2 per liter
    cng: 1.5, // kg CO2 per kg
    lpg: 1.5, // kg CO2 per kg
    electricity: 0.82, // kg CO2 per kWh (India grid average)
    publicTransport: 0.05, // kg CO2 per km
    bike: 0.12, // kg CO2 per km
    flight: 90, // kg CO2 per hour
    meatMeal: 3.5, // kg CO2 per meal
    shopping: 0.001, // kg CO2 per rupee (approximate)
  };

  // Cloud infrastructure emission factors
  // Based on average data center PUE (Power Usage Effectiveness) of 1.5 and regional grid carbon intensity
  const cloudEmissionFactors: Record<string, number> = {
    // AWS regions (kg CO2 per kWh)
    'ap-south-1': 0.82, // Mumbai - India grid
    'ap-southeast-1': 0.50, // Singapore
    'us-east-1': 0.40, // Virginia - US grid
    'us-west-2': 0.30, // Oregon - US grid (renewable heavy)
    'eu-west-1': 0.30, // Ireland - EU grid
    // Azure regions
    'central-india': 0.82, // India grid
    'east-us': 0.40, // US grid
    'west-europe': 0.30, // EU grid
    // GCP regions
    'asia-south1': 0.82, // Mumbai - India grid
    'us-central1': 0.40, // US grid
    'europe-west1': 0.30, // EU grid
  };

  // Cloud compute power consumption (kWh per hour per instance type)
  const computePowerConsumption: Record<string, number> = {
    small: 0.05, // ~50W per hour
    medium: 0.10, // ~100W per hour
    large: 0.20, // ~200W per hour
    xlarge: 0.40, // ~400W per hour
  };

  // Cloud storage power consumption (kWh per GB per month)
  const storagePowerConsumption = 0.0001; // ~0.1W per GB per month

  // Data transfer power consumption (kWh per GB)
  const dataTransferPowerConsumption = 0.0005; // Network infrastructure

  // One tree absorbs approximately 20 kg CO2 per year (average over 20 years)
  const CO2_PER_TREE_PER_YEAR = 20;

  // Indian cities with NGO data
  const indianCities = [
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'chennai', label: 'Chennai' },
    { value: 'kolkata', label: 'Kolkata' },
    { value: 'pune', label: 'Pune' },
    { value: 'ahmedabad', label: 'Ahmedabad' },
    { value: 'jaipur', label: 'Jaipur' },
    { value: 'surat', label: 'Surat' },
    { value: 'lucknow', label: 'Lucknow' },
    { value: 'kanpur', label: 'Kanpur' },
    { value: 'nagpur', label: 'Nagpur' },
    { value: 'indore', label: 'Indore' },
    { value: 'thane', label: 'Thane' },
    { value: 'bhopal', label: 'Bhopal' },
    { value: 'visakhapatnam', label: 'Visakhapatnam' },
    { value: 'patna', label: 'Patna' },
    { value: 'vadodara', label: 'Vadodara' },
    { value: 'gurgaon', label: 'Gurgaon' },
  ];

  // NGO data by city
  const ngosByCity: Record<string, Array<{
    name: string;
    description: string;
    website?: string;
    phone?: string;
    email?: string;
    focus: string[];
  }>> = {
    mumbai: [
      {
        name: 'Grow-Trees.com',
        description: 'Plant trees online and track your impact. They plant trees across India including Maharashtra.',
        website: 'https://www.grow-trees.com',
        focus: ['Online tree planting', 'Corporate partnerships', 'Community projects'],
      },
      {
        name: 'Vanashakti',
        description: 'Environmental NGO working on forest conservation and tree planting in Mumbai and Maharashtra.',
        website: 'https://www.vanashakti.in',
        phone: '+91-22-2617-0000',
        email: 'info@vanashakti.in',
        focus: ['Forest conservation', 'Urban greening', 'Community awareness'],
      },
      {
        name: 'Mumbai Tree Planting Initiative',
        description: 'Local initiative focused on increasing green cover in Mumbai through community participation.',
        focus: ['Community tree planting', 'Urban forestry', 'School programs'],
      },
    ],
    delhi: [
      {
        name: 'Delhi Greens',
        description: 'Environmental organization promoting green spaces and tree planting in Delhi NCR.',
        website: 'https://delhigreens.org',
        email: 'info@delhigreens.org',
        focus: ['Urban greening', 'Community gardens', 'Environmental education'],
      },
      {
        name: 'I Am Gurgaon',
        description: 'Citizen-led initiative for urban greening and tree planting in Gurgaon and Delhi NCR.',
        website: 'https://www.iamgurgaon.org',
        focus: ['Urban forestry', 'Community participation', 'Green infrastructure'],
      },
      {
        name: 'Green Yatra',
        description: 'NGO working on environmental conservation and tree planting across Delhi and NCR.',
        website: 'https://www.greenyatra.org',
        phone: '+91-11-4100-0000',
        focus: ['Tree planting', 'Waste management', 'Environmental awareness'],
      },
    ],
    bangalore: [
      {
        name: 'SayTrees',
        description: 'Bangalore-based NGO focused on tree planting and urban greening initiatives.',
        website: 'https://www.saytrees.org',
        phone: '+91-80-4090-0000',
        email: 'info@saytrees.org',
        focus: ['Tree planting', 'Urban forestry', 'Corporate partnerships'],
      },
      {
        name: 'Hasiru Dala',
        description: 'Environmental organization working on waste management and tree planting in Bangalore.',
        website: 'https://www.hasirudala.in',
        focus: ['Waste management', 'Tree planting', 'Community engagement'],
      },
      {
        name: 'Green Bangalore',
        description: 'Citizen initiative for increasing green cover and tree planting in Bangalore.',
        focus: ['Community tree planting', 'Urban greening', 'Environmental awareness'],
      },
    ],
    hyderabad: [
      {
        name: 'Hyderabad Tree Planting Foundation',
        description: 'Local NGO dedicated to increasing tree cover in Hyderabad through community participation.',
        focus: ['Tree planting', 'Urban greening', 'Community programs'],
      },
      {
        name: 'Green Hyderabad',
        description: 'Environmental initiative promoting tree planting and green spaces in Hyderabad.',
        focus: ['Community gardens', 'Tree planting', 'Environmental education'],
      },
    ],
    chennai: [
      {
        name: 'Chennai Tree Planting Society',
        description: 'NGO working on urban greening and tree planting initiatives in Chennai.',
        focus: ['Tree planting', 'Urban forestry', 'Community participation'],
      },
      {
        name: 'Environmentalist Foundation of India',
        description: 'Nationwide organization with active tree planting programs in Chennai.',
        website: 'https://www.efi.org.in',
        focus: ['Tree planting', 'Water conservation', 'Environmental education'],
      },
    ],
    kolkata: [
      {
        name: 'Kolkata Green Initiative',
        description: 'Local organization promoting tree planting and green spaces in Kolkata.',
        focus: ['Tree planting', 'Urban greening', 'Community awareness'],
      },
      {
        name: 'Nature Mates',
        description: 'Kolkata-based NGO working on biodiversity conservation and tree planting.',
        website: 'https://www.naturemates.org',
        focus: ['Biodiversity', 'Tree planting', 'Environmental education'],
      },
    ],
    pune: [
      {
        name: 'Pune Tree Planting Initiative',
        description: 'Community-driven organization for tree planting and urban greening in Pune.',
        focus: ['Tree planting', 'Community participation', 'Urban forestry'],
      },
      {
        name: 'Eco Pune',
        description: 'Environmental NGO promoting green initiatives and tree planting in Pune.',
        focus: ['Tree planting', 'Waste management', 'Environmental awareness'],
      },
    ],
    ahmedabad: [
      {
        name: 'Ahmedabad Green Initiative',
        description: 'NGO working on tree planting and environmental conservation in Ahmedabad.',
        focus: ['Tree planting', 'Urban greening', 'Community programs'],
      },
    ],
    jaipur: [
      {
        name: 'Jaipur Tree Planting Society',
        description: 'Local organization promoting tree planting and green cover in Jaipur.',
        focus: ['Tree planting', 'Urban forestry', 'Community engagement'],
      },
    ],
    surat: [
      {
        name: 'Surat Green Initiative',
        description: 'Environmental organization for tree planting and urban greening in Surat.',
        focus: ['Tree planting', 'Community participation', 'Urban greening'],
      },
    ],
    lucknow: [
      {
        name: 'Lucknow Tree Planting Foundation',
        description: 'NGO dedicated to increasing green cover through tree planting in Lucknow.',
        focus: ['Tree planting', 'Urban greening', 'Community awareness'],
      },
    ],
    kanpur: [
      {
        name: 'Kanpur Green Initiative',
        description: 'Local organization promoting tree planting and environmental conservation.',
        focus: ['Tree planting', 'Community participation', 'Urban forestry'],
      },
    ],
    nagpur: [
      {
        name: 'Nagpur Tree Planting Society',
        description: 'NGO working on tree planting and green initiatives in Nagpur.',
        focus: ['Tree planting', 'Urban greening', 'Community programs'],
      },
    ],
    indore: [
      {
        name: 'Indore Green Initiative',
        description: 'Environmental organization promoting tree planting in Indore.',
        focus: ['Tree planting', 'Community participation', 'Urban forestry'],
      },
    ],
    thane: [
      {
        name: 'Thane Tree Planting Initiative',
        description: 'Local NGO for tree planting and urban greening in Thane.',
        focus: ['Tree planting', 'Urban greening', 'Community awareness'],
      },
    ],
    bhopal: [
      {
        name: 'Bhopal Green Initiative',
        description: 'NGO working on tree planting and environmental conservation in Bhopal.',
        focus: ['Tree planting', 'Community participation', 'Urban forestry'],
      },
    ],
    visakhapatnam: [
      {
        name: 'Visakhapatnam Tree Planting Society',
        description: 'Local organization promoting tree planting and green cover in Visakhapatnam.',
        focus: ['Tree planting', 'Urban greening', 'Community engagement'],
      },
    ],
    patna: [
      {
        name: 'Patna Green Initiative',
        description: 'NGO dedicated to tree planting and environmental conservation in Patna.',
        focus: ['Tree planting', 'Community participation', 'Urban forestry'],
      },
    ],
    vadodara: [
      {
        name: 'Vadodara Tree Planting Foundation',
        description: 'Environmental organization for tree planting and urban greening in Vadodara.',
        focus: ['Tree planting', 'Urban greening', 'Community programs'],
      },
    ],
    gurgaon: [
      {
        name: 'I Am Gurgaon',
        description: 'Citizen-led initiative for urban greening and tree planting in Gurgaon.',
        website: 'https://www.iamgurgaon.org',
        focus: ['Urban forestry', 'Community participation', 'Green infrastructure'],
      },
      {
        name: 'Gurgaon Green Initiative',
        description: 'Local NGO promoting tree planting and environmental conservation in Gurgaon.',
        focus: ['Tree planting', 'Urban greening', 'Community awareness'],
      },
    ],
  };

  // NGO list item shape (optional phone/email for static fallback entries)
  type NGOListItem = { name: string; description?: string; website?: string; phone?: string; email?: string; focus: string[] };

  // Get NGOs for selected city from Contentstack, with fallback to static data
  const getNGOsForCity = (): NGOListItem[] => {
    if (contentstackNGOs.length > 0) {
      return contentstackNGOs.map(ngo => ({
        name: ngo.name,
        description: ngo.description || '',
        website: ngo.website,
        phone: ngo.phone,
        email: ngo.email,
        focus: ngo.focus_areas || [],
      }));
    }

    // Fallback to static data
    const cityNGOs: NGOListItem[] = ngosByCity[selectedCity] || [];
    const nationalNGOs: NGOListItem[] = [
      {
        name: 'Grow-Trees.com',
        description: 'Plant trees online and track your impact. They plant trees across India.',
        website: 'https://www.grow-trees.com',
        focus: ['Online tree planting', 'Corporate partnerships', 'Nationwide projects'],
      },
      {
        name: 'One Tree Planted',
        description: 'International organization with tree planting projects across India.',
        website: 'https://onetreeplanted.org',
        focus: ['Reforestation', 'Global projects', 'Corporate partnerships'],
      },
      {
        name: 'SankalpTaru Foundation',
        description: 'NGO planting trees across India with focus on rural and urban areas.',
        website: 'https://www.sankalptaru.org',
        focus: ['Tree planting', 'Rural development', 'Corporate partnerships'],
      },
    ];
    return [...cityNGOs, ...nationalNGOs];
  };

  // Refetch cloud regions when provider changes
  useEffect(() => {
    // Cloud regions will be refetched automatically by useCloudRegions hook
  }, [cloudProvider]);

  useEffect(() => {
    calculateCarbonFootprint();
  }, [
    carKmPerMonth, carFuelType, carEfficiency, bikeKmPerMonth, publicTransportKmPerMonth, flightHoursPerYear,
    electricityKwhPerMonth, lpgCylindersPerMonth, cngKgPerMonth, meatMealsPerWeek, shoppingAmountPerMonth,
    cloudProvider, cloudRegion, computeInstances, computeHoursPerMonth, computeInstanceType,
    storageGB, dataTransferGB, databaseInstances, databaseHoursPerMonth,
    cloudRegions // Include cloudRegions to recalculate when regions load
  ]);

  const calculateCarbonFootprint = () => {
    // Transportation
    const carLitersPerMonth = carKmPerMonth / carEfficiency;
    const carFuelFactor = carFuelType === 'petrol' ? emissionFactors.petrol : emissionFactors.diesel;
    const carCO2Monthly = carLitersPerMonth * carFuelFactor;
    const carCO2Annual = carCO2Monthly * 12;

    const bikeCO2Annual = (bikeKmPerMonth * emissionFactors.bike) * 12;
    const publicTransportCO2Annual = (publicTransportKmPerMonth * emissionFactors.publicTransport) * 12;
    const flightCO2Annual = flightHoursPerYear * emissionFactors.flight;
    const transportCO2Annual = carCO2Annual + bikeCO2Annual + publicTransportCO2Annual + flightCO2Annual;

    // Energy
    const electricityCO2Annual = (electricityKwhPerMonth * emissionFactors.electricity) * 12;
    const lpgCO2Annual = (lpgCylindersPerMonth * 14.2 * emissionFactors.lpg) * 12; // 14.2 kg per cylinder
    const cngCO2Annual = (cngKgPerMonth * emissionFactors.cng) * 12;
    const energyCO2Annual = electricityCO2Annual + lpgCO2Annual + cngCO2Annual;

    // Lifestyle
    const meatCO2Annual = (meatMealsPerWeek * emissionFactors.meatMeal) * 52;
    const shoppingCO2Annual = (shoppingAmountPerMonth * emissionFactors.shopping) * 12;
    const lifestyleCO2Annual = meatCO2Annual + shoppingCO2Annual;

    // Cloud Infrastructure
    // Get carbon intensity from Contentstack or fallback to static data
    const selectedRegion = cloudRegions.find(r => r.region_code === cloudRegion);
    const regionEmissionFactor = selectedRegion?.carbon_intensity || cloudEmissionFactors[cloudRegion] || 0.82; // Default to India grid
    const computePowerPerHour = computePowerConsumption[computeInstanceType] || 0.10;
    const computeKwhMonthly = computeInstances * computePowerPerHour * computeHoursPerMonth;
    const computeKwhAnnual = computeKwhMonthly * 12;
    const computeCO2Annual = computeKwhAnnual * regionEmissionFactor * 1.5; // PUE factor of 1.5

    const databaseKwhMonthly = databaseInstances * computePowerPerHour * databaseHoursPerMonth;
    const databaseKwhAnnual = databaseKwhMonthly * 12;
    const databaseCO2Annual = databaseKwhAnnual * regionEmissionFactor * 1.5;

    const storageKwhMonthly = storageGB * storagePowerConsumption;
    const storageKwhAnnual = storageKwhMonthly * 12;
    const storageCO2Annual = storageKwhAnnual * regionEmissionFactor * 1.5;

    const dataTransferKwh = dataTransferGB * dataTransferPowerConsumption;
    const dataTransferKwhAnnual = dataTransferKwh * 12;
    const dataTransferCO2Annual = dataTransferKwhAnnual * regionEmissionFactor * 1.5;

    const cloudCO2Annual = computeCO2Annual + databaseCO2Annual + storageCO2Annual + dataTransferCO2Annual;

    const totalAnnualCO2 = transportCO2Annual + energyCO2Annual + lifestyleCO2Annual + cloudCO2Annual;
    const totalAnnualCO2Tons = totalAnnualCO2 / 1000;
    const treesNeeded = Math.ceil(totalAnnualCO2 / CO2_PER_TREE_PER_YEAR);

    const breakdown = [
      { name: 'Transportation', shortName: 'Transport', value: Math.round(transportCO2Annual), color: '#FF6B6B' },
      { name: 'Energy (Home)', shortName: 'Energy', value: Math.round(energyCO2Annual), color: '#4ECDC4' },
      { name: 'Lifestyle', shortName: 'Lifestyle', value: Math.round(lifestyleCO2Annual), color: '#95E1D3' },
      { name: 'Cloud Infrastructure', shortName: 'Cloud', value: Math.round(cloudCO2Annual), color: '#FFA500' },
    ];

    const monthlyBreakdown = [];
    for (let month = 1; month <= 12; month++) {
      monthlyBreakdown.push({
        month: `Month ${month}`,
        transport: Math.round(transportCO2Annual / 12),
        energy: Math.round(energyCO2Annual / 12),
        lifestyle: Math.round(lifestyleCO2Annual / 12),
        cloud: Math.round(cloudCO2Annual / 12),
        total: Math.round(totalAnnualCO2 / 12),
      });
    }

    setResults({
      totalAnnualCO2,
      totalAnnualCO2Tons,
      treesNeeded,
      breakdown,
      monthlyBreakdown,
      cloudCO2Annual,
    });
  };

  const COLORS = ['#FF6B6B', '#4ECDC4', '#95E1D3', '#FFA500'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Carbon Footprint Calculator</h2>
        <p className="text-muted-foreground">Calculate your annual carbon footprint and discover how many trees you need to plant to offset it.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Carbon Footprint</CardTitle>
            <CardDescription>Enter your monthly activities and consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="transport" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="transport">Transportation</TabsTrigger>
                <TabsTrigger value="energy">Energy</TabsTrigger>
                <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
                <TabsTrigger value="cloud">Cloud Infrastructure</TabsTrigger>
              </TabsList>

              <TabsContent value="transport" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Car className="w-5 h-5 text-primary" />
                    <Label className="text-lg font-semibold">Car Usage</Label>
                  </div>
                  <div className="space-y-4 pl-7">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Kilometers per Month</Label>
                        <span className="text-sm font-medium">{carKmPerMonth} km</span>
                      </div>
                      <Slider
                        value={[carKmPerMonth]}
                        onValueChange={(value) => setCarKmPerMonth(value[0])}
                        min={0}
                        max={5000}
                        step={50}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fuel Type</Label>
                      <Select value={carFuelType} onValueChange={setCarFuelType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="petrol">Petrol</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Fuel Efficiency (km/liter)</Label>
                        <Input
                          type="number"
                          value={carEfficiency}
                          onChange={(e) => setCarEfficiency(Number(e.target.value))}
                          className="w-32"
                          min={5}
                          max={30}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Car className="w-5 h-5 text-primary" />
                    <Label className="text-lg font-semibold">Two-Wheeler</Label>
                  </div>
                  <div className="space-y-4 pl-7">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Kilometers per Month</Label>
                        <span className="text-sm font-medium">{bikeKmPerMonth} km</span>
                      </div>
                      <Slider
                        value={[bikeKmPerMonth]}
                        onValueChange={(value) => setBikeKmPerMonth(value[0])}
                        min={0}
                        max={2000}
                        step={50}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Car className="w-5 h-5 text-primary" />
                    <Label className="text-lg font-semibold">Public Transport</Label>
                  </div>
                  <div className="space-y-4 pl-7">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Kilometers per Month</Label>
                        <span className="text-sm font-medium">{publicTransportKmPerMonth} km</span>
                      </div>
                      <Slider
                        value={[publicTransportKmPerMonth]}
                        onValueChange={(value) => setPublicTransportKmPerMonth(value[0])}
                        min={0}
                        max={2000}
                        step={50}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Plane className="w-5 h-5 text-primary" />
                    <Label className="text-lg font-semibold">Air Travel</Label>
                  </div>
                  <div className="space-y-4 pl-7">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Flight Hours per Year</Label>
                        <span className="text-sm font-medium">{flightHoursPerYear} hours</span>
                      </div>
                      <Slider
                        value={[flightHoursPerYear]}
                        onValueChange={(value) => setFlightHoursPerYear(value[0])}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="energy" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-primary" />
                    <Label className="text-lg font-semibold">Electricity</Label>
                  </div>
                  <div className="space-y-4 pl-7">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>kWh per Month</Label>
                        <Input
                          type="number"
                          value={electricityKwhPerMonth}
                          onChange={(e) => setElectricityKwhPerMonth(Number(e.target.value))}
                          className="w-32"
                          min={0}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Home className="w-5 h-5 text-primary" />
                    <Label className="text-lg font-semibold">Cooking Gas</Label>
                  </div>
                  <div className="space-y-4 pl-7">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>LPG Cylinders per Month</Label>
                        <span className="text-sm font-medium">{lpgCylindersPerMonth}</span>
                      </div>
                      <Slider
                        value={[lpgCylindersPerMonth]}
                        onValueChange={(value) => setLpgCylindersPerMonth(value[0])}
                        min={0}
                        max={5}
                        step={0.5}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>CNG (kg) per Month</Label>
                        <Input
                          type="number"
                          value={cngKgPerMonth}
                          onChange={(e) => setCngKgPerMonth(Number(e.target.value))}
                          className="w-32"
                          min={0}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="lifestyle" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    <Label className="text-lg font-semibold">Diet & Shopping</Label>
                  </div>
                  <div className="space-y-4 pl-7">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Meat Meals per Week</Label>
                        <span className="text-sm font-medium">{meatMealsPerWeek}</span>
                      </div>
                      <Slider
                        value={[meatMealsPerWeek]}
                        onValueChange={(value) => setMeatMealsPerWeek(value[0])}
                        min={0}
                        max={21}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground">Reducing meat consumption significantly lowers your carbon footprint</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Shopping Amount per Month (₹)</Label>
                        <Input
                          type="number"
                          value={shoppingAmountPerMonth}
                          onChange={(e) => setShoppingAmountPerMonth(Number(e.target.value))}
                          className="w-32"
                          min={0}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cloud" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Cloud className="w-5 h-5 text-primary" />
                    <Label className="text-lg font-semibold">Cloud Provider & Region</Label>
                  </div>
                  <div className="space-y-4 pl-7">
                    <div className="space-y-2">
                      <Label>Cloud Provider</Label>
                      <Select value={cloudProvider} onValueChange={setCloudProvider}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aws">AWS (Amazon Web Services)</SelectItem>
                          <SelectItem value="azure">Azure (Microsoft)</SelectItem>
                          <SelectItem value="gcp">GCP (Google Cloud Platform)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Region</Label>
                      <Select value={cloudRegion} onValueChange={setCloudRegion}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {regionsLoading ? (
                            <SelectItem value="loading" disabled>Loading regions...</SelectItem>
                          ) : cloudRegions.length > 0 ? (
                            cloudRegions.map((region) => (
                              <SelectItem key={region.uid} value={region.region_code}>
                                {region.region_name} ({region.region_code})
                              </SelectItem>
                            ))
                          ) : (
                            // Fallback static regions
                            <>
                              {cloudProvider === 'aws' && (
                                <>
                                  <SelectItem value="ap-south-1">Mumbai (ap-south-1)</SelectItem>
                                  <SelectItem value="ap-southeast-1">Singapore (ap-southeast-1)</SelectItem>
                                  <SelectItem value="us-east-1">Virginia (us-east-1)</SelectItem>
                                  <SelectItem value="us-west-2">Oregon (us-west-2)</SelectItem>
                                  <SelectItem value="eu-west-1">Ireland (eu-west-1)</SelectItem>
                                </>
                              )}
                              {cloudProvider === 'azure' && (
                                <>
                                  <SelectItem value="central-india">Central India</SelectItem>
                                  <SelectItem value="east-us">East US</SelectItem>
                                  <SelectItem value="west-europe">West Europe</SelectItem>
                                </>
                              )}
                              {cloudProvider === 'gcp' && (
                                <>
                                  <SelectItem value="asia-south1">Mumbai (asia-south1)</SelectItem>
                                  <SelectItem value="us-central1">Iowa (us-central1)</SelectItem>
                                  <SelectItem value="europe-west1">Belgium (europe-west1)</SelectItem>
                                </>
                              )}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Region affects carbon footprint based on local grid energy sources
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Cloud className="w-5 h-5 text-primary" />
                    <Label className="text-lg font-semibold">Compute Resources</Label>
                  </div>
                  <div className="space-y-4 pl-7">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Compute Instances</Label>
                        <span className="text-sm font-medium">{computeInstances}</span>
                      </div>
                      <Slider
                        value={[computeInstances]}
                        onValueChange={(value) => setComputeInstances(value[0])}
                        min={0}
                        max={50}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Instance Type</Label>
                      <Select value={computeInstanceType} onValueChange={setComputeInstanceType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small (~50W)</SelectItem>
                          <SelectItem value="medium">Medium (~100W)</SelectItem>
                          <SelectItem value="large">Large (~200W)</SelectItem>
                          <SelectItem value="xlarge">XLarge (~400W)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Hours per Month</Label>
                        <Input
                          type="number"
                          value={computeHoursPerMonth}
                          onChange={(e) => setComputeHoursPerMonth(Number(e.target.value))}
                          className="w-32"
                          min={0}
                          max={744}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">730 hours = 24/7 operation</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Cloud className="w-5 h-5 text-primary" />
                    <Label className="text-lg font-semibold">Database Resources</Label>
                  </div>
                  <div className="space-y-4 pl-7">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Database Instances</Label>
                        <span className="text-sm font-medium">{databaseInstances}</span>
                      </div>
                      <Slider
                        value={[databaseInstances]}
                        onValueChange={(value) => setDatabaseInstances(value[0])}
                        min={0}
                        max={20}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Hours per Month</Label>
                        <Input
                          type="number"
                          value={databaseHoursPerMonth}
                          onChange={(e) => setDatabaseHoursPerMonth(Number(e.target.value))}
                          className="w-32"
                          min={0}
                          max={744}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Cloud className="w-5 h-5 text-primary" />
                    <Label className="text-lg font-semibold">Storage & Data Transfer</Label>
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
                          min={0}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Data Transfer Out (GB/month)</Label>
                        <Input
                          type="number"
                          value={dataTransferGB}
                          onChange={(e) => setDataTransferGB(Number(e.target.value))}
                          className="w-32"
                          min={0}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {results.cloudCO2Annual > 0 && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Cloud className="w-5 h-5 text-primary" />
                      <Label className="font-semibold text-primary">Cloud Carbon Footprint</Label>
                    </div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {Math.round(results.cloudCO2Annual)} kg CO₂/year
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {((results.cloudCO2Annual / results.totalAnnualCO2) * 100).toFixed(1)}% of your total footprint
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center pb-2">
            <CardDescription>Annual Carbon Footprint</CardDescription>
            <CardTitle className="text-4xl text-primary font-bold">
              {results.totalAnnualCO2Tons.toFixed(2)} tons CO₂
            </CardTitle>
            <CardDescription className="pt-2">
              {Math.round(results.totalAnnualCO2)} kg CO₂ per year
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <TreePine className="w-6 h-6 text-success" />
                <CardTitle className="text-lg text-success">Trees to Plant</CardTitle>
              </div>
              <div className="text-3xl font-bold text-success mb-1">
                {results.treesNeeded}
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Plant {results.treesNeeded} trees to offset your annual carbon footprint
              </p>
              <div className="space-y-2 mt-3">
                <Label className="text-xs font-semibold">Select Your City</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianCities.map((city) => (
                      <SelectItem key={city.value} value={city.value}>
                        {city.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <CardTitle className="text-base font-semibold mb-3">Emission Breakdown</CardTitle>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={results.breakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={false}
                    outerRadius={75}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {results.breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `${Math.round(value)} kg CO₂`}
                    contentStyle={{ fontSize: '12px', padding: '8px' }}
                  />
                </PieChart>
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
                  <span className="text-sm font-semibold">{Math.round(item.value)} kg</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Carbon Footprint Trend</CardTitle>
          <CardDescription>Your carbon emissions breakdown by month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={results.monthlyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${Math.round(value)} kg CO₂`} />
              <Legend />
              <Bar dataKey="transport" stackId="a" fill="#FF6B6B" name="Transportation" />
              <Bar dataKey="energy" stackId="a" fill="#4ECDC4" name="Energy" />
              <Bar dataKey="lifestyle" stackId="a" fill="#95E1D3" name="Lifestyle" />
              <Bar dataKey="cloud" stackId="a" fill="#FFA500" name="Cloud Infrastructure" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tree Planting Guide & NGO Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-success/5 border-success/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-success" />
              <CardTitle>Tree Planting Guide</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Why Plant Trees?</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• One tree absorbs ~20 kg CO₂ per year</li>
                  <li>• Trees improve air quality and reduce pollution</li>
                  <li>• They provide habitat for wildlife</li>
                  <li>• Trees help combat climate change</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Best Trees for Carbon Sequestration</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Neem (Azadirachta indica)</li>
                  <li>• Peepal (Ficus religiosa)</li>
                  <li>• Banyan (Ficus benghalensis)</li>
                  <li>• Mango (Mangifera indica)</li>
                  <li>• Teak (Tectona grandis)</li>
                </ul>
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4 mt-4">
              <h4 className="font-semibold mb-2">How to Get Started</h4>
              <ol className="text-sm space-y-2 text-muted-foreground list-decimal list-inside">
                <li>Contact local NGOs or tree planting organizations</li>
                <li>Participate in community tree planting drives</li>
                <li>Plant trees in your garden or community spaces</li>
                <li>Support reforestation projects through donations</li>
                <li>Use online platforms like Grow-Trees, One Tree Planted, or local initiatives</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              <CardTitle>NGOs in {indianCities.find(c => c.value === selectedCity)?.label || 'Your City'}</CardTitle>
            </div>
            <CardDescription>
              Connect with organizations that can help you plant {results.treesNeeded} trees
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {getNGOsForCity().map((ngo, index) => (
                <div key={index} className="bg-card border rounded-lg p-4 space-y-3">
                  <div>
                    <h4 className="font-semibold text-lg mb-1">{ngo.name}</h4>
                    <p className="text-sm text-muted-foreground">{ngo.description}</p>
                  </div>
                  
                  {ngo.focus && ngo.focus.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Focus Areas:</p>
                      <div className="flex flex-wrap gap-1">
                        {ngo.focus.map((area, i) => (
                          <span
                            key={i}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    {ngo.website && (
                      <a
                        href={ngo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Website
                      </a>
                    )}
                    {ngo.phone && (
                      <a
                        href={`tel:${ngo.phone}`}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        {ngo.phone}
                      </a>
                    )}
                    {ngo.email && (
                      <a
                        href={`mailto:${ngo.email}`}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        Email
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-muted/50 border rounded-lg p-3 mt-4">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> Contact information is subject to change. Please verify details before reaching out. 
                Many NGOs also accept online donations and tree planting sponsorships.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tree Life Cycle & Financial Growth Analogy */}
      <Card className="bg-gradient-to-br from-success/10 via-primary/5 to-success/10 border-success/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TreePine className="w-6 h-6 text-success" />
            <CardTitle>Tree Life Cycle & Financial Growth</CardTitle>
          </div>
          <CardDescription>
            Just like a tree grows from a seed to provide shade for many, your savings grow to provide financial security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tree Life Cycle */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5 text-success" />
                <h3 className="text-lg font-semibold text-success">Tree Life Cycle</h3>
              </div>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-success/30"></div>
                
                {/* Stages */}
                <div className="space-y-6 relative">
                  {/* Stage 1: Seed */}
                  <div className="flex items-start gap-4">
                    <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-success/20 rounded-full flex items-center justify-center border-2 border-success">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className="font-semibold text-success mb-1">🌱 Seed</h4>
                      <p className="text-sm text-muted-foreground">Plant a seed today</p>
                      <p className="text-xs text-muted-foreground mt-1">Small action, big potential</p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center gap-4 pl-8">
                    <ArrowRight className="w-5 h-5 text-success/50 rotate-90" />
                  </div>

                  {/* Stage 2: Sprout */}
                  <div className="flex items-start gap-4">
                    <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-success/30 rounded-full flex items-center justify-center border-2 border-success">
                      <Leaf className="w-6 h-6 text-success" />
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className="font-semibold text-success mb-1">🌿 Sprout</h4>
                      <p className="text-sm text-muted-foreground">First leaves appear</p>
                      <p className="text-xs text-muted-foreground mt-1">Growth begins, roots establish</p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center gap-4 pl-8">
                    <ArrowRight className="w-5 h-5 text-success/50 rotate-90" />
                  </div>

                  {/* Stage 3: Sapling */}
                  <div className="flex items-start gap-4">
                    <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-success/40 rounded-full flex items-center justify-center border-2 border-success">
                      <TreePine className="w-7 h-7 text-success" />
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className="font-semibold text-success mb-1">🌳 Sapling</h4>
                      <p className="text-sm text-muted-foreground">Young tree growing</p>
                      <p className="text-xs text-muted-foreground mt-1">Absorbing CO₂, providing oxygen</p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center gap-4 pl-8">
                    <ArrowRight className="w-5 h-5 text-success/50 rotate-90" />
                  </div>

                  {/* Stage 4: Mature Tree */}
                  <div className="flex items-start gap-4">
                    <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-success/50 rounded-full flex items-center justify-center border-2 border-success">
                      <TreePine className="w-8 h-8 text-success" />
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className="font-semibold text-success mb-1">🌲 Mature Tree</h4>
                      <p className="text-sm text-muted-foreground">Full-grown tree</p>
                      <p className="text-xs text-muted-foreground mt-1">Provides shade for many, cleans air, supports ecosystem</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Growth Analogy */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Coins className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-primary">Financial Growth</h3>
              </div>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/30"></div>
                
                {/* Stages */}
                <div className="space-y-6 relative">
                  {/* Stage 1: Start Saving */}
                  <div className="flex items-start gap-4">
                    <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary">
                      <Coins className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className="font-semibold text-primary mb-1">💰 Start Saving</h4>
                      <p className="text-sm text-muted-foreground">Save small amounts regularly</p>
                      <p className="text-xs text-muted-foreground mt-1">Every rupee counts, compound interest begins</p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center gap-4 pl-8">
                    <ArrowRight className="w-5 h-5 text-primary/50 rotate-90" />
                  </div>

                  {/* Stage 2: Growing Savings */}
                  <div className="flex items-start gap-4">
                    <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center border-2 border-primary">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className="font-semibold text-primary mb-1">📈 Growing Savings</h4>
                      <p className="text-sm text-muted-foreground">Savings accumulate</p>
                      <p className="text-xs text-muted-foreground mt-1">Compound interest working, wealth building</p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center gap-4 pl-8">
                    <ArrowRight className="w-5 h-5 text-primary/50 rotate-90" />
                  </div>

                  {/* Stage 3: Investment */}
                  <div className="flex items-start gap-4">
                    <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-primary/40 rounded-full flex items-center justify-center border-2 border-primary">
                      <TrendingUp className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className="font-semibold text-primary mb-1">💼 Investment</h4>
                      <p className="text-sm text-muted-foreground">Invest in SIP, mutual funds</p>
                      <p className="text-xs text-muted-foreground mt-1">Money grows faster, building wealth</p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center gap-4 pl-8">
                    <ArrowRight className="w-5 h-5 text-primary/50 rotate-90" />
                  </div>

                  {/* Stage 4: Financial Freedom */}
                  <div className="flex items-start gap-4">
                    <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-primary/50 rounded-full flex items-center justify-center border-2 border-primary">
                      <Coins className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className="font-semibold text-primary mb-1">🏆 Financial Freedom</h4>
                      <p className="text-sm text-muted-foreground">Wealth provides security</p>
                      <p className="text-xs text-muted-foreground mt-1">Supports family, enables dreams, creates legacy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Message */}
          <div className="mt-8 p-6 bg-card border-2 border-dashed border-success/30 rounded-lg text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <TreePine className="w-6 h-6 text-success" />
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
              <Coins className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-semibold text-lg mb-2">The Parallel Journey</h4>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Just as a single seed grows into a tree that provides shade for many, 
              your small savings grow into wealth that provides security for your family. 
              <strong className="text-foreground"> Start today</strong> - plant a tree and start saving. 
              Both will grow and benefit generations to come.
            </p>
          </div>

          {/* Action Items */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-5 h-5 text-success" />
                <h5 className="font-semibold text-success">Plant {results.treesNeeded} Trees</h5>
              </div>
              <p className="text-xs text-muted-foreground">
                Offset your carbon footprint and contribute to a greener planet
              </p>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h5 className="font-semibold text-primary">Start Financial Planning</h5>
              </div>
              <p className="text-xs text-muted-foreground">
                Use our calculators to plan your investments and build wealth
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground italic">
            This is an estimate for planning purposes only. Actual carbon footprint may vary based on specific factors. Tree absorption rates are averages over 20 years. Consult environmental experts for accurate carbon offset strategies.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarbonFootprintCalculator;
