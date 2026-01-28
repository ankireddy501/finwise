import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Gift, Coins, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useRewardsCategories, useRewardsItems, RewardsCategory, RewardsItem } from '@/lib/contentstack-hooks';

const RewardsPage: React.FC = () => {
  const { categories: rewardsCategories, loading: categoriesLoading } = useRewardsCategories();
  
  // Get icon component from icon name string
  const getIcon = (iconName?: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Plane: <Plane className="w-8 h-8 text-blue-500" />,
      Coins: <Coins className="w-8 h-8 text-yellow-500" />,
      ShoppingBag: <ShoppingBag className="w-8 h-8 text-pink-500" />,
    };
    return iconMap[iconName || ''] || <Gift className="w-8 h-8 text-primary" />;
  };

  // Fallback categories if Contentstack fails
  const categories = rewardsCategories.length > 0 
    ? rewardsCategories.map(cat => ({
        title: cat.name,
        icon: getIcon(cat.icon),
        key: cat.key,
      }))
    : [
        { title: "Travel Packages", icon: <Plane className="w-8 h-8 text-blue-500" />, key: 'travel' },
        { title: "Gold & Silver", icon: <Coins className="w-8 h-8 text-yellow-500" />, key: 'gold' },
        { title: "Vouchers & Merch", icon: <ShoppingBag className="w-8 h-8 text-pink-500" />, key: 'vouchers' },
      ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Redemption Options</h2>
        <p className="text-muted-foreground">See how you can use your accumulated reward points.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, idx) => {
          // Fetch items for this category
          const RewardsCategoryComponent = ({ categoryKey }: { categoryKey?: string }) => {
            const { items, loading } = useRewardsItems(categoryKey);
            
            if (loading) {
              return (
                <div className="space-y-4">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              );
            }

            // Fallback items if none found
            const displayItems = items.length > 0 ? items : [
              { uid: '1', title: 'No items', name: 'No items available', key: 'none', pointsRequired: '0', value: '₹0' },
            ];

            return (
              <div className="space-y-4">
                {displayItems.map((item: RewardsItem) => (
                  <div key={item.uid} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.value || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{item.pointsRequired || '0'} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            );
          };

          return (
            <Card key={cat.key || idx} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 bg-muted rounded-xl">{cat.icon}</div>
                <CardTitle>{cat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <RewardsCategoryComponent categoryKey={cat.key} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-primary/5 border-primary/10">
        <CardContent className="p-8 text-center">
          <Gift className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Maximize your points?</h3>
          <p className="text-muted-foreground mb-4">Use our Credit Card Optimizer to find the best card for your spending pattern.</p>
          <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Check Optimizer
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsPage;
