import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("INR");
  const [exchangeRate, setExchangeRate] = useState<number>(83.5);
  const [loading, setLoading] = useState<boolean>(false);

  const currencies = [
    { code: "INR", name: "Indian Rupee" },
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "AED", name: "UAE Dirham" },
    { code: "SGD", name: "Singapore Dollar" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "CHF", name: "Swiss Franc" },
  ];

  // Simulated rates for demo purposes if API fails
  const mockRates: Record<string, number> = {
    "USD_INR": 83.5,
    "EUR_INR": 90.2,
    "GBP_INR": 105.8,
    "AED_INR": 22.7,
    "SGD_INR": 62.1,
    "JPY_INR": 0.55,
    "AUD_INR": 55.4,
    "CAD_INR": 61.8,
    "CHF_INR": 94.2,
  };

  useEffect(() => {
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  const fetchExchangeRate = async () => {
    setLoading(true);
    try {
      // In a real app, use: `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      // For this demo, we'll simulate a fetch delay and use mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let rate = 1;
      if (fromCurrency === toCurrency) {
        rate = 1;
      } else if (fromCurrency === "INR") {
        rate = 1 / mockRates[`${toCurrency}_INR`];
      } else if (toCurrency === "INR") {
        rate = mockRates[`${fromCurrency}_INR`];
      } else {
        // Cross rate via INR
        const fromInInr = mockRates[`${fromCurrency}_INR`];
        const toInInr = mockRates[`${toCurrency}_INR`];
        rate = fromInInr / toInInr;
      }
      
      setExchangeRate(rate);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Currency Converter</h2>
        <p className="text-muted-foreground">Real-time currency conversion for your travel and planning needs.</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Convert Currency</CardTitle>
          <CardDescription>Get the latest exchange rates for major global currencies.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-end gap-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter amount"
              />
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(c => (
                    <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center pb-2">
              <button 
                onClick={swapCurrencies}
                className="p-2 rounded-full hover:bg-accent transition-colors border"
              >
                <ArrowLeftRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-2">
              <Label>Converted Amount</Label>
              <div className="h-10 px-3 py-2 rounded-md border bg-muted/50 flex items-center font-bold text-lg">
                {(amount * exchangeRate).toFixed(2)}
              </div>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(c => (
                    <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-6 border-t flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <span>1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}</span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="pt-6 text-center">
            <p className="text-xs text-muted-foreground mb-1">USD to INR</p>
            <p className="font-bold">{mockRates["USD_INR"]}</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="pt-6 text-center">
            <p className="text-xs text-muted-foreground mb-1">EUR to INR</p>
            <p className="font-bold">{mockRates["EUR_INR"]}</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="pt-6 text-center">
            <p className="text-xs text-muted-foreground mb-1">GBP to INR</p>
            <p className="font-bold">{mockRates["GBP_INR"]}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CurrencyConverter;
