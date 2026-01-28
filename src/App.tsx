import React, { Suspense, lazy } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Calculator, CreditCard, GraduationCap, Gift, Leaf, TrendingUp, Banknote, Landmark, Users, ReceiptIndianRupee, ArrowLeftRight, Cloud, Zap } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Collapsible } from '@/components/ui/collapsible'
import { useDashboardCards, useNavigationItems } from '@/lib/contentstack-hooks'

// Lazy load all calculator components for code splitting
const NPSCalculator = lazy(() => import('./pages/calculators/NPSCalculator'))
const TaxCalculator = lazy(() => import('./pages/calculators/TaxCalculator'))
const SIPCalculator = lazy(() => import('./pages/calculators/SIPCalculator'))
const InflationCalculator = lazy(() => import('./pages/calculators/InflationCalculator'))
const EMICalculator = lazy(() => import('./pages/calculators/EMICalculator'))
const HousingLoanCalculator = lazy(() => import('./pages/calculators/HousingLoanCalculator'))
const GoldLoanCalculator = lazy(() => import('./pages/calculators/GoldLoanCalculator'))
const PersonalLoanCalculator = lazy(() => import('./pages/calculators/PersonalLoanCalculator'))
const PFCalculator = lazy(() => import('./pages/calculators/PFCalculator'))
const GratuityCalculator = lazy(() => import('./pages/calculators/GratuityCalculator'))
const SSYCalculator = lazy(() => import('./pages/calculators/SSYCalculator'))
const MarriagePlanningCalculator = lazy(() => import('./pages/calculators/MarriagePlanningCalculator'))
const CurrencyConverter = lazy(() => import('./pages/calculators/CurrencyConverter'))
const AWSCostCalculator = lazy(() => import('./pages/calculators/AWSCostCalculator'))
const AzureCostCalculator = lazy(() => import('./pages/calculators/AzureCostCalculator'))
const GCPCostCalculator = lazy(() => import('./pages/calculators/GCPCostCalculator'))
const CarbonFootprintCalculator = lazy(() => import('./pages/calculators/CarbonFootprintCalculator'))
const CreditCardsPage = lazy(() => import('./pages/CreditCardsPage'))
const RewardsPage = lazy(() => import('./pages/RewardsPage'))
const EducationPage = lazy(() => import('./pages/EducationPage'))

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
)

function App() {
  const location = useLocation()

  const NavLink = ({ to, children, icon }: { to: string; children: React.ReactNode; icon?: React.ReactNode }) => {
    const isActive = location.pathname === to
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent group transition-colors ${
          isActive ? 'bg-accent border-l-2 border-l-primary' : ''
        }`}
      >
        {icon || <Calculator className="w-4 h-4 text-muted-foreground group-hover:text-primary" />}
        <span className={`text-sm ${isActive ? 'font-semibold text-primary' : ''}`}>{children}</span>
      </Link>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-72 border-r bg-card hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary tracking-tight">FinWise</h1>
          <p className="text-xs text-muted-foreground font-medium">Smart Life Financial Planning</p>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-2">
            {/* Dashboard - Always Visible */}
            <Link 
              to="/" 
              className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent group transition-colors mb-4 ${
                location.pathname === '/' ? 'bg-accent border-l-2 border-l-primary' : ''
              }`}
            >
              <LayoutDashboard className="w-5 h-5 group-hover:text-primary" />
              <span className={`font-medium ${location.pathname === '/' ? 'text-primary' : ''}`}>Dashboard</span>
            </Link>

            {/* Investments */}
            <Collapsible 
              title="Investments" 
              icon={<TrendingUp className="w-4 h-4" />}
              routes={['/calculators/sip', '/calculators/inflation']}
            >
              <NavLink to="/calculators/sip">SIP Calculator</NavLink>
              <NavLink to="/calculators/inflation">Inflation</NavLink>
            </Collapsible>

            {/* Loans */}
            <Collapsible 
              title="Loans" 
              icon={<Banknote className="w-4 h-4" />}
              routes={['/calculators/emi', '/calculators/housing', '/calculators/gold', '/calculators/personal']}
            >
              <NavLink to="/calculators/emi">Generic EMI</NavLink>
              <NavLink to="/calculators/housing">Housing Loan</NavLink>
              <NavLink to="/calculators/gold">Gold Loan</NavLink>
              <NavLink to="/calculators/personal">Personal Loan</NavLink>
            </Collapsible>

            {/* Retirement */}
            <Collapsible 
              title="Retirement" 
              icon={<Landmark className="w-4 h-4" />}
              routes={['/calculators/nps', '/calculators/pf', '/calculators/gratuity']}
            >
              <NavLink to="/calculators/nps">NPS Calculator</NavLink>
              <NavLink to="/calculators/pf">PF Calculator</NavLink>
              <NavLink to="/calculators/gratuity">Gratuity</NavLink>
            </Collapsible>

            {/* Family Planning */}
            <Collapsible 
              title="Family Planning" 
              icon={<Users className="w-4 h-4" />}
              routes={['/calculators/ssy', '/calculators/marriage']}
            >
              <NavLink to="/calculators/ssy">SSY (Sukanya)</NavLink>
              <NavLink to="/calculators/marriage">Marriage Planning</NavLink>
            </Collapsible>

            {/* Tax & Currency */}
            <Collapsible 
              title="Tax & Currency" 
              icon={<ReceiptIndianRupee className="w-4 h-4" />}
              routes={['/calculators/tax', '/calculators/currency']}
            >
              <NavLink to="/calculators/tax">Income Tax</NavLink>
              <NavLink to="/calculators/currency">Currency Converter</NavLink>
            </Collapsible>

            {/* Cloud & Environment */}
            <Collapsible 
              title="Cloud & Environment" 
              icon={<Cloud className="w-4 h-4" />}
              routes={['/calculators/aws', '/calculators/azure', '/calculators/gcp', '/calculators/carbon']}
            >
              <NavLink to="/calculators/aws" icon={<Calculator className="w-4 h-4" />}>AWS Cost</NavLink>
              <NavLink to="/calculators/azure" icon={<Calculator className="w-4 h-4" />}>Azure Cost</NavLink>
              <NavLink to="/calculators/gcp" icon={<Calculator className="w-4 h-4" />}>GCP Cost</NavLink>
              <NavLink to="/calculators/carbon" icon={<Leaf className="w-4 h-4" />}>Carbon Footprint</NavLink>
            </Collapsible>

            {/* Credit & Rewards */}
            <Collapsible 
              title="Credit & Rewards" 
              icon={<CreditCard className="w-4 h-4" />}
              routes={['/credit-cards', '/rewards']}
            >
              <NavLink to="/credit-cards" icon={<CreditCard className="w-4 h-4" />}>Card Comparison</NavLink>
              <NavLink to="/rewards" icon={<Gift className="w-4 h-4" />}>Redemption Rewards</NavLink>
            </Collapsible>

            {/* Learning */}
            <Collapsible 
              title="Learning" 
              icon={<GraduationCap className="w-4 h-4" />}
              routes={['/education']}
            >
              <NavLink to="/education" icon={<GraduationCap className="w-4 h-4" />}>Education & Tips</NavLink>
            </Collapsible>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        <div className="max-w-6xl mx-auto p-8">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calculators/nps" element={<NPSCalculator />} />
              <Route path="/calculators/tax" element={<TaxCalculator />} />
              <Route path="/calculators/sip" element={<SIPCalculator />} />
              <Route path="/calculators/inflation" element={<InflationCalculator />} />
              <Route path="/calculators/emi" element={<EMICalculator />} />
              <Route path="/calculators/housing" element={<HousingLoanCalculator />} />
              <Route path="/calculators/gold" element={<GoldLoanCalculator />} />
              <Route path="/calculators/personal" element={<PersonalLoanCalculator />} />
              <Route path="/calculators/pf" element={<PFCalculator />} />
              <Route path="/calculators/gratuity" element={<GratuityCalculator />} />
              <Route path="/calculators/ssy" element={<SSYCalculator />} />
              <Route path="/calculators/marriage" element={<MarriagePlanningCalculator />} />
              <Route path="/calculators/currency" element={<CurrencyConverter />} />
              <Route path="/calculators/aws" element={<AWSCostCalculator />} />
              <Route path="/calculators/azure" element={<AzureCostCalculator />} />
              <Route path="/calculators/gcp" element={<GCPCostCalculator />} />
              <Route path="/calculators/carbon" element={<CarbonFootprintCalculator />} />
              <Route path="/credit-cards" element={<CreditCardsPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/education" element={<EducationPage />} />
              <Route path="/tips" element={<EducationPage />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  )
}



function Dashboard() {
  const { cards, loading, error } = useDashboardCards();

  // Helper to get color class from color string
  const getColorClasses = (color?: string) => {
    const colorMap: Record<string, { border: string; bg: string; text: string }> = {
      primary: { border: 'border-l-primary', bg: 'bg-primary/10', text: 'text-primary' },
      success: { border: 'border-l-success', bg: 'bg-success/10', text: 'text-success' },
      blue: { border: 'border-l-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-500' },
      amber: { border: 'border-l-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-500' },
      red: { border: 'border-l-red-500', bg: 'bg-red-500/10', text: 'text-red-500' },
      yellow: { border: 'border-l-yellow-600', bg: 'bg-yellow-600/10', text: 'text-yellow-600' },
    };
    return colorMap[color || 'primary'] || colorMap.primary;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading dashboard cards:', error);
  }

  // Fallback cards if Contentstack fails
  const displayCards = cards.length > 0 ? cards : [
    { title: 'NPS Calculator', description: 'Plan your retirement', route: '/calculators/nps', color: 'primary' },
    { title: 'Income Tax Planner', description: 'Compare tax regimes', route: '/calculators/tax', color: 'success' },
    { title: 'SIP Calculator', description: 'Visualize compounding', route: '/calculators/sip', color: 'blue' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold tracking-tight mb-2">Financial Dashboard</h2>
        <p className="text-muted-foreground text-lg">Plan your future with precision using our intelligent financial tools.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayCards.map((card: any, index: number) => {
          const colors = getColorClasses(card.color);
          return (
            <Card key={card.uid || index} className={`hover:shadow-lg transition-all border-l-4 ${colors.border}`}>
              <CardHeader>
                <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4 ${colors.text}`}>
                  <Calculator className="w-6 h-6" />
                </div>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description || ''}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={card.route || '#'} className={`${colors.text} hover:underline font-semibold flex items-center gap-2`}>
                  Calculate →
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>


      <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-bold">Smart Credit Rewards</h3>
            <p className="text-muted-foreground">Stop guessing which card to use. Map your reward points to travel goals like Dubai, Singapore, or Thailand.</p>
            <Link to="/credit-cards" className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
              Compare Credit Cards
            </Link>
          </div>
          <div className="w-full md:w-1/3 aspect-video bg-white rounded-xl shadow-sm border p-4 flex items-center justify-center">
            <CreditCard className="w-16 h-16 text-primary/20" />
          </div>
        </div>
      </div>
    </div>
  )
}


export default App
