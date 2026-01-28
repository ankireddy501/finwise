import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/utils';
import { Plane, Utensils, ShoppingBag, Fuel } from 'lucide-react';
import { useCreditCards, useTravelGoals, CreditCard, TravelGoal } from '@/lib/contentstack-hooks';

interface CardData {
  id: string;
  name: string;
  rewardRate: number; // points per 100
  pointValue: number; // ₹ value per point
  annualFee: number;
  loungeAccess: boolean;
  benefits: string[];
  categoryMultipliers: Record<string, number>;
}

const CreditCardsPage: React.FC = () => {
  const { cards: contentstackCards, loading: cardsLoading } = useCreditCards();
  const { goals: travelGoals, loading: goalsLoading } = useTravelGoals();

  // Convert Contentstack cards to CardData format
  const [cards, setCards] = useState<CardData[]>([]);
  const [displayTravelGoals, setDisplayTravelGoals] = useState<TravelGoal[]>([]);

  useEffect(() => {
    if (contentstackCards.length > 0) {
      const convertedCards = contentstackCards.map((card: CreditCard) => {
        try {
          const rewardStructure = card.rewardStructure ? JSON.parse(card.rewardStructure) : {};
          return {
            id: card.uid,
            name: card.name,
            rewardRate: rewardStructure.rewardRate || 2,
            pointValue: rewardStructure.pointValue || 0.25,
            annualFee: card.annualFee || 0,
            loungeAccess: card.loungeAccess || false,
            benefits: rewardStructure.benefits || [],
            categoryMultipliers: rewardStructure.categoryMultipliers || {},
          };
        } catch (e) {
          console.error('Error parsing reward structure for card:', card.name, e);
          return {
            id: card.uid,
            name: card.name,
            rewardRate: 2,
            pointValue: 0.25,
            annualFee: card.annualFee || 0,
            loungeAccess: card.loungeAccess || false,
            benefits: [],
            categoryMultipliers: {},
          };
        }
      });
      setCards(convertedCards);
    } else {
      // Fallback data
      setCards([
        {
          id: "1",
          name: "FinWise Infinity",
          rewardRate: 5,
          pointValue: 1,
          annualFee: 5000,
          loungeAccess: true,
          benefits: ["Unlimited Lounge", "Travel Insurance", "Concierge"],
          categoryMultipliers: { dining: 2, travel: 3, shopping: 1, fuel: 1, groceries: 1.5 }
        },
        {
          id: "2",
          name: "Reward Max Pro",
          rewardRate: 2,
          pointValue: 0.25,
          annualFee: 1000,
          loungeAccess: false,
          benefits: ["Milestone Vouchers", "Fuel Surcharge Waiver"],
          categoryMultipliers: { dining: 1.5, travel: 1, shopping: 2, fuel: 1, groceries: 2 }
        },
        {
          id: "3",
          name: "Traveler Select",
          rewardRate: 4,
          pointValue: 0.7,
          annualFee: 2500,
          loungeAccess: true,
          benefits: ["Priority Pass", "Foreign Markup 1.99%"],
          categoryMultipliers: { dining: 1, travel: 5, shopping: 1, fuel: 1, groceries: 1 }
        }
      ]);
    }
  }, [contentstackCards]);

  useEffect(() => {
    if (travelGoals.length > 0) {
      setDisplayTravelGoals(travelGoals);
    } else {
      // Fallback data
      setDisplayTravelGoals([
        { uid: '1', title: 'Dubai Package', name: 'Dubai Package', key: 'dubai', pointsRequired: 50000, estimatedValue: 45000 },
        { uid: '2', title: 'Singapore Gateway', name: 'Singapore Gateway', key: 'singapore', pointsRequired: 75000, estimatedValue: 65000 },
        { uid: '3', title: 'Thailand Retreat', name: 'Thailand Retreat', key: 'thailand', pointsRequired: 40000, estimatedValue: 35000 },
      ]);
    }
  }, [travelGoals]);

  const [spending, setSpending] = useState({
    dining: 5000,
    travel: 10000,
    shopping: 15000,
    fuel: 3000,
    groceries: 7000,
  });

  const calculateRewards = (card: CardData) => {
    let totalPoints = 0;
    (Object.keys(spending) as Array<keyof typeof spending>).forEach(cat => {
      const amount = spending[cat];
      const multiplier = card.categoryMultipliers[cat] || 1;
      totalPoints += (amount / 100) * card.rewardRate * multiplier;
    });
    return Math.round(totalPoints);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Credit Card Rewards Optimizer</h2>
        <p className="text-muted-foreground">Compare cards based on your actual spending and map points to travel goals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Monthly Spending</CardTitle>
            <CardDescription>Adjust your typical monthly expenses per category.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="capitalize flex items-center gap-2">
                  <Utensils className="w-4 h-4" /> Dining
                </Label>
                <span className="font-medium">{formatCurrency(spending.dining)}</span>
              </div>
              <Slider 
                value={[spending.dining]} 
                onValueChange={(v) => setSpending({...spending, dining: v[0]})} 
                max={50000} step={500}
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="capitalize flex items-center gap-2">
                  <Plane className="w-4 h-4" /> Travel
                </Label>
                <span className="font-medium">{formatCurrency(spending.travel)}</span>
              </div>
              <Slider 
                value={[spending.travel]} 
                onValueChange={(v) => setSpending({...spending, travel: v[0]})} 
                max={100000} step={1000}
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="capitalize flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Shopping
                </Label>
                <span className="font-medium">{formatCurrency(spending.shopping)}</span>
              </div>
              <Slider 
                value={[spending.shopping]} 
                onValueChange={(v) => setSpending({...spending, shopping: v[0]})} 
                max={100000} step={1000}
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="capitalize flex items-center gap-2">
                  <Fuel className="w-4 h-4" /> Fuel
                </Label>
                <span className="font-medium">{formatCurrency(spending.fuel)}</span>
              </div>
              <Slider 
                value={[spending.fuel]} 
                onValueChange={(v) => setSpending({...spending, fuel: v[0]})} 
                max={20000} step={500}
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="capitalize flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Groceries
                </Label>
                <span className="font-medium">{formatCurrency(spending.groceries)}</span>
              </div>
              <Slider 
                value={[spending.groceries]} 
                onValueChange={(v) => setSpending({...spending, groceries: v[0]})} 
                max={30000} step={500}
              />
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {cards.map(card => {
              const points = calculateRewards(card);
              const cashValue = points * card.pointValue;
              const netValue = (cashValue * 12) - card.annualFee;

              return (
                <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-all border-l-4 border-l-primary">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-md flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <CardTitle className="text-xl">{card.name}</CardTitle>
                        <CardDescription>Annual Fee: {formatCurrency(card.annualFee)}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">{points} pts/month</p>
                      <p className="text-xs text-muted-foreground">≈ {formatCurrency(cashValue)} value</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Travel Goal Progress</p>
                        <div className="space-y-4">
                          {displayTravelGoals.map(goal => {
                            const goalPoints = goal.pointsRequired || 0;
                            const progress = Math.min(100, (points * 12 / goalPoints) * 100);
                            return (
                              <div key={goal.uid || goal.name} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="flex items-center gap-1"><Plane className="w-4 h-4" /> {goal.name}</span>
                                  <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary transition-all duration-1000" 
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Net Annual Benefit</p>
                        <div className="flex flex-col items-center justify-center h-full bg-slate-50 rounded-xl border p-4">
                          <p className={`text-3xl font-bold ${netValue > 0 ? 'text-success' : 'text-destructive'}`}>
                            {formatCurrency(netValue)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">Annual savings after fee</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardsPage;
