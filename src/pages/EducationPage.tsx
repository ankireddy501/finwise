import React, { useState, useEffect } from 'react';
import Stack from '@/lib/contentstack';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, BookOpen, AlertCircle } from 'lucide-react';

interface Tip {
  title: string;
  content: string;
  category: string;
  uid: string;
}

const EducationPage: React.FC = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        // Fetch from education_article content type
        const Query = Stack.ContentType('education_article').Entry.Query();
        const result = await Query.toJSON().find();
        
        if (result && result[0]?.items) {
          const articles = result[0].items.map((item: any) => ({
            uid: item.uid,
            title: item.title,
            category: item.category || 'General',
            content: item.body || item.summary || '',
          }));
          setTips(articles);
        } else {
          throw new Error('No articles found');
        }
      } catch (err) {
        console.error('Contentstack fetch error:', err);
        setError('Could not load educational content from Contentstack. Using fallback data.');
        
        // Fallback static data if fetch fails
        setTips([
          {
            uid: '1',
            title: 'Emergency Fund First',
            category: 'Debt Prevention',
            content: 'Save at least 6 months of expenses before starting aggressive investments. This prevents taking high-interest personal loans during emergencies.'
          },
          {
            uid: '2',
            title: 'Equity SIPs for Long Term',
            category: 'Wealth Creation',
            content: 'For goals more than 5 years away, use Equity SIPs. Compounding works best over long durations.'
          },
          {
            uid: '3',
            title: 'Down Payment Strategy',
            category: 'Home Buying',
            content: 'Try to save at least 40-50% of the property value as down payment. This significantly reduces the interest burden under Section 24.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Financial Education & Tips</h2>
        <p className="text-muted-foreground">Expert strategies to stay debt-free and build long-term wealth.</p>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3 text-amber-800">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Note for Developer:</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip) => (
          <Card key={tip.uid} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="p-2 bg-primary/10 rounded-lg text-primary mb-2">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2 py-1 bg-muted rounded">
                  {tip.category}
                </span>
              </div>
              <CardTitle className="text-xl">{tip.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {tip.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-slate-900 text-white rounded-2xl p-8 mt-12">
        <div className="max-w-3xl space-y-4">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <BookOpen className="text-primary" />
            Loan Avoidance Masterclass
          </h3>
          <p className="text-slate-300">
            Learn why "No Cost EMIs" aren't actually free and how to use the Debt Avalanche method to clear existing liabilities faster.
          </p>
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h4 className="font-bold mb-1 italic text-primary">Debt Snowball</h4>
              <p className="text-sm text-slate-400">Pay off smallest debts first for psychological wins.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h4 className="font-bold mb-1 italic text-primary">Debt Avalanche</h4>
              <p className="text-sm text-slate-400">Pay off highest interest debts first to save maximum money.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationPage;
