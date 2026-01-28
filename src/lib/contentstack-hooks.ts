import { useState, useEffect } from 'react';
import Stack from './contentstack';

/**
 * React hooks for fetching Contentstack content
 */

export interface CalculatorCategory {
  uid: string;
  title: string;
  key: string;
  description?: string;
  icon?: string;
  order?: number;
}

export interface Calculator {
  uid: string;
  title: string;
  key: string;
  summary?: string;
  disclaimer?: string;
  enabled: boolean;
  config: string; // JSON string
  category?: CalculatorCategory[];
}

export interface CreditCard {
  uid: string;
  title: string;
  name: string;
  key: string;
  issuer?: string;
  annualFee?: number;
  welcomeBonus?: number;
  loungeAccess?: boolean;
  rewardStructure?: string; // JSON string
}

export interface EducationArticle {
  uid: string;
  title: string;
  key: string;
  category?: string;
  summary?: string;
  body?: string;
}

export interface TravelGoal {
  uid: string;
  title: string;
  name: string;
  key: string;
  pointsRequired?: number;
  estimatedValue?: number;
  description?: string;
}

export interface RewardsCategory {
  uid: string;
  title: string;
  name: string;
  key: string;
  icon?: string;
  order?: number;
}

export interface RewardsItem {
  uid: string;
  title: string;
  name: string;
  key: string;
  pointsRequired?: string;
  value?: string;
  order?: number;
}

export interface DashboardCard {
  uid: string;
  title: string;
  key: string;
  description?: string;
  route?: string;
  icon?: string;
  color?: string;
  order?: number;
}

export interface NavigationItem {
  uid: string;
  title: string;
  label: string;
  key: string;
  route: string;
  icon?: string;
  section?: string;
  order?: number;
  enabled?: boolean;
}

export interface NGOOrganization {
  uid: string;
  title: string;
  name: string;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  city: string;
  state?: string;
  country?: string;
  focus_areas?: string[];
  is_national?: boolean;
  active?: boolean;
}

export interface CloudRegion {
  uid: string;
  title: string;
  region_code: string;
  region_name: string;
  provider: string;
  country?: string;
  city?: string;
  carbon_intensity: number;
  description?: string;
  active?: boolean;
}

/**
 * Hook to fetch calculator categories
 */
export function useCalculatorCategories() {
  const [categories, setCategories] = useState<CalculatorCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const Query = Stack.ContentType('calculator_category').Entry.Query();
        const result = await Query.toJSON().find();
        
        if (result && result[0]?.items) {
          const sorted = result[0].items
            .map((item: any) => ({
              uid: item.uid,
              title: item.title,
              key: item.key,
              description: item.description,
              icon: item.icon,
              order: item.order || 0,
            }))
            .sort((a: CalculatorCategory, b: CalculatorCategory) => (a.order || 0) - (b.order || 0));
          setCategories(sorted);
        }
      } catch (err: any) {
        console.error('Error fetching calculator categories:', err);
        setError(err?.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

/**
 * Hook to fetch calculators
 */
export function useCalculators() {
  const [calculators, setCalculators] = useState<Calculator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalculators = async () => {
      try {
        const Query = Stack.ContentType('calculator')
          .Entry.Query()
          .where('enabled', true);
        const result = await Query.toJSON().find();
        
        if (result && result[0]?.items) {
          const items = result[0].items.map((item: any) => ({
            uid: item.uid,
            title: item.title,
            key: item.key,
            summary: item.summary,
            disclaimer: item.disclaimer,
            enabled: item.enabled,
            config: item.config,
            category: item.category,
          }));
          setCalculators(items);
        }
      } catch (err: any) {
        console.error('Error fetching calculators:', err);
        setError(err?.message || 'Failed to fetch calculators');
      } finally {
        setLoading(false);
      }
    };

    fetchCalculators();
  }, []);

  return { calculators, loading, error };
}

/**
 * Hook to fetch calculator by key
 */
export function useCalculator(key: string) {
  const [calculator, setCalculator] = useState<Calculator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalculator = async () => {
      try {
        const Query = Stack.ContentType('calculator')
          .Entry.Query()
          .where('key', key)
          .where('enabled', true);
        const result = await Query.toJSON().find();
        
        if (result && result[0]?.items?.[0]) {
          const item = result[0].items[0];
          setCalculator({
            uid: item.uid,
            title: item.title,
            key: item.key,
            summary: item.summary,
            disclaimer: item.disclaimer,
            enabled: item.enabled,
            config: item.config,
            category: item.category,
          });
        }
      } catch (err: any) {
        console.error(`Error fetching calculator ${key}:`, err);
        setError(err?.message || 'Failed to fetch calculator');
      } finally {
        setLoading(false);
      }
    };

    if (key) {
      fetchCalculator();
    }
  }, [key]);

  return { calculator, loading, error };
}

/**
 * Hook to fetch credit cards
 */
export function useCreditCards() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const Query = Stack.ContentType('credit_card').Entry.Query();
        const result = await Query.toJSON().find();
        
        if (result && result[0]?.items) {
          const items = result[0].items.map((item: any) => ({
            uid: item.uid,
            title: item.title,
            name: item.name,
            key: item.key,
            issuer: item.issuer,
            annualFee: item.annual_fee,
            welcomeBonus: item.welcome_bonus,
            loungeAccess: item.lounge_access,
            rewardStructure: item.reward_structure,
          }));
          setCards(items);
        }
      } catch (err: any) {
        console.error('Error fetching credit cards:', err);
        setError(err?.message || 'Failed to fetch credit cards');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  return { cards, loading, error };
}

/**
 * Hook to fetch education articles
 */
export function useEducationArticles() {
  const [articles, setArticles] = useState<EducationArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const Query = Stack.ContentType('education_article').Entry.Query();
        const result = await Query.toJSON().find();
        
        if (result && result[0]?.items) {
          const items = result[0].items.map((item: any) => ({
            uid: item.uid,
            title: item.title,
            key: item.key,
            category: item.category,
            summary: item.summary,
            body: item.body,
          }));
          setArticles(items);
        }
      } catch (err: any) {
        console.error('Error fetching education articles:', err);
        setError(err?.message || 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return { articles, loading, error };
}

/**
 * Hook to fetch travel goals
 */
export function useTravelGoals() {
  const [goals, setGoals] = useState<TravelGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const Query = Stack.ContentType('travel_goal').Entry.Query();
        const result = await Query.toJSON().find();
        
        if (result && result[0]?.items) {
          const items = result[0].items.map((item: any) => ({
            uid: item.uid,
            title: item.title,
            name: item.name,
            key: item.key,
            pointsRequired: item.points_required,
            estimatedValue: item.estimated_value,
            description: item.description,
          }));
          setGoals(items);
        }
      } catch (err: any) {
        console.error('Error fetching travel goals:', err);
        setError(err?.message || 'Failed to fetch travel goals');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  return { goals, loading, error };
}

/**
 * Hook to fetch rewards categories
 */
export function useRewardsCategories() {
  const [categories, setCategories] = useState<RewardsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const Query = Stack.ContentType('rewards_category').Entry.Query();
        const result = await Query.toJSON().find();
        
        if (result && result[0]?.items) {
          const sorted = result[0].items
            .map((item: any) => ({
              uid: item.uid,
              title: item.title,
              name: item.name,
              key: item.key,
              icon: item.icon,
              order: item.order || 0,
            }))
            .sort((a: RewardsCategory, b: RewardsCategory) => (a.order || 0) - (b.order || 0));
          setCategories(sorted);
        }
      } catch (err: any) {
        console.error('Error fetching rewards categories:', err);
        setError(err?.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

/**
 * Hook to fetch rewards items
 */
export function useRewardsItems(categoryKey?: string) {
  const [items, setItems] = useState<RewardsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        let Query = Stack.ContentType('rewards_item').Entry.Query();
        
        if (categoryKey) {
          // Note: This assumes category is a reference field
          // You may need to adjust based on your content model
          Query = Query.where('category.key', categoryKey);
        }
        
        const result = await Query.toJSON().find();
        
        if (result && result[0]?.items) {
          const sorted = result[0].items
            .map((item: any) => ({
              uid: item.uid,
              title: item.title,
              name: item.name,
              key: item.key,
              pointsRequired: item.points_required,
              value: item.value,
              order: item.order || 0,
            }))
            .sort((a: RewardsItem, b: RewardsItem) => (a.order || 0) - (b.order || 0));
          setItems(sorted);
        }
      } catch (err: any) {
        console.error('Error fetching rewards items:', err);
        setError(err?.message || 'Failed to fetch rewards items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [categoryKey]);

  return { items, loading, error };
}

/**
 * Hook to fetch dashboard cards
 */
export function useDashboardCards() {
  const [cards, setCards] = useState<DashboardCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const Query = Stack.ContentType('dashboard_card').Entry.Query();
        const result = await Query.toJSON().find();
        
        if (result && result[0]?.items) {
          const sorted = result[0].items
            .map((item: any) => ({
              uid: item.uid,
              title: item.title,
              key: item.key,
              description: item.description,
              route: item.route,
              icon: item.icon,
              color: item.color,
              order: item.order || 0,
            }))
            .sort((a: DashboardCard, b: DashboardCard) => (a.order || 0) - (b.order || 0));
          setCards(sorted);
        }
      } catch (err: any) {
        console.error('Error fetching dashboard cards:', err);
        setError(err?.message || 'Failed to fetch dashboard cards');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  return { cards, loading, error };
}

/**
 * Hook to fetch NGOs by city
 */
export function useNGOsByCity(city: string) {
  const [ngos, setNGOs] = useState<NGOOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        // Fetch NGOs for the city OR national NGOs
        const cityQuery = Stack.ContentType('ngo_organization')
          .Entry.Query()
          .where('active', true)
          .where('city', city);
        
        const nationalQuery = Stack.ContentType('ngo_organization')
          .Entry.Query()
          .where('active', true)
          .where('is_national', true);
        
        const [cityResult, nationalResult] = await Promise.all([
          cityQuery.toJSON().find(),
          nationalQuery.toJSON().find(),
        ]);
        
        const allNGOs: NGOOrganization[] = [];
        
        if (cityResult && cityResult[0]?.items) {
          allNGOs.push(...cityResult[0].items.map((item: any) => ({
            uid: item.uid,
            title: item.title,
            name: item.name,
            description: item.description,
            website: item.website,
            phone: item.phone,
            email: item.email,
            city: item.city,
            state: item.state,
            country: item.country,
            focus_areas: item.focus_areas,
            is_national: item.is_national,
            active: item.active,
          })));
        }
        
        if (nationalResult && nationalResult[0]?.items) {
          const nationalNGOs = nationalResult[0].items.map((item: any) => ({
            uid: item.uid,
            title: item.title,
            name: item.name,
            description: item.description,
            website: item.website,
            phone: item.phone,
            email: item.email,
            city: item.city,
            state: item.state,
            country: item.country,
            focus_areas: item.focus_areas,
            is_national: item.is_national,
            active: item.active,
          }));
          
          // Add national NGOs that aren't already in the list
          nationalNGOs.forEach((ngo: NGOOrganization) => {
            if (!allNGOs.find(n => n.uid === ngo.uid)) {
              allNGOs.push(ngo);
            }
          });
        }
        
        setNGOs(allNGOs);
      } catch (err: any) {
        console.error('Error fetching NGOs:', err);
        setError(err?.message || 'Failed to fetch NGOs');
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchNGOs();
    }
  }, [city]);

  return { ngos, loading, error };
}

/**
 * Hook to fetch cloud regions
 */
export function useCloudRegions(provider?: string) {
  const [regions, setRegions] = useState<CloudRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        let Query = Stack.ContentType('cloud_region')
          .Entry.Query()
          .where('active', true);
        
        if (provider) {
          Query = Query.where('provider', provider);
        }
        
        const result = await Query.toJSON().find();
        
        if (result && result[0]?.items) {
          const items = result[0].items.map((item: any) => ({
            uid: item.uid,
            title: item.title,
            region_code: item.region_code,
            region_name: item.region_name,
            provider: item.provider,
            country: item.country,
            city: item.city,
            carbon_intensity: item.carbon_intensity,
            description: item.description,
            active: item.active,
          }));
          setRegions(items);
        }
      } catch (err: any) {
        console.error('Error fetching cloud regions:', err);
        setError(err?.message || 'Failed to fetch cloud regions');
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, [provider]);

  return { regions, loading, error };
}

/**
 * Hook to fetch navigation items
 */
export function useNavigationItems() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const Query = Stack.ContentType('navigation_item')
          .Entry.Query()
          .where('enabled', true);
        const result = await Query.toJSON().find();
        
        if (result && result[0]?.items) {
          const sorted = result[0].items
            .map((item: any) => ({
              uid: item.uid,
              title: item.title,
              label: item.label,
              key: item.key,
              route: item.route,
              icon: item.icon,
              section: item.section,
              order: item.order || 0,
              enabled: item.enabled,
            }))
            .sort((a: NavigationItem, b: NavigationItem) => (a.order || 0) - (b.order || 0));
          setItems(sorted);
        }
      } catch (err: any) {
        console.error('Error fetching navigation items:', err);
        setError(err?.message || 'Failed to fetch navigation items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return { items, loading, error };
}
