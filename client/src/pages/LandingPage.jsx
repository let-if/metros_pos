// client/src/pages/LandingPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Award, CreditCard, Printer, ShieldCheck, CheckCircle2, ArrowRight, Zap, Users, BarChart3, Phone, Mail, Sparkles, Layers, Cpu, Database, Eye } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  // 3D Tilt State for Hero Card
  const [heroTilt, setHeroTilt] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' });

  // 3D Multi-Level Zoom State (0 = Normal View, 1 = Deep Feature Zoom, 2 = Core Architecture Zoom)
  const [zoomLevel, setZoomLevel] = useState(0);
  const [activeFeature, setActiveFeature] = useState(null);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setHeroTilt({
      transform: `perspective(1000px) rotateX(${(-y / 15).toFixed(2)}deg) rotateY(${(x / 15).toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setHeroTilt({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-in-out'
    });
  };

  const featuresData = [
    {
      id: 'credit',
      title: 'Yeketena Credit Ledger',
      icon: CreditCard,
      summary: 'Maintain precise customer credit logs with real-time balance updates and transparent transaction audits.',
      deepDetail: 'Built on relational database constraints that automatically calculate outstanding liabilities, link credit sales directly to named customer profiles, and trigger instant warning indicators when limits approach thresholds.',
      architecture: 'Prisma ORM relational schema with automated foreign-key cascade updates for secure audit trails.'
    },
    {
      id: 'loyalty',
      title: 'VIP Loyalty Rewards CRM',
      icon: Award,
      summary: 'Automatically segment shoppers into Bronze, Silver, and Gold VIP tiers based on earned points.',
      deepDetail: 'Provides cashiers with instant phone-number lookup during checkout. Unlocks automated point accumulation per transaction and enables one-click 100 ETB discount redemptions right at the register.',
      architecture: 'State-synchronized React modal hooks communicating with secure server-side validation endpoints.'
    },
    {
      id: 'print',
      title: '80mm Thermal Receipt Stream',
      icon: Printer,
      summary: 'One-click physical receipt printing optimized for standard thermal rolls with ERCA fiscal data.',
      deepDetail: 'Eliminates browser chrome and dialogue clutter. Forces strict 80mm roll dimensions via dedicated @media print CSS stylesheets, formatting TIN numbers, VAT breakdowns, and QR verification blocks cleanly.',
      architecture: 'CSS media-query isolation combined with hidden DOM element targeting for pristine hardware output.'
    },
    {
      id: 'security',
      title: 'Role-Based Staff Permissions',
      icon: ShieldCheck,
      summary: 'Granular security guards protecting register drawers, refunds, and custom item price overrides.',
      deepDetail: 'Separates cashier permissions from admin privileges. Unauthorized staff attempting to execute refunds or price changes encounter immediate security lockouts and audit alerts.',
      architecture: 'JWT authentication middleware paired with frontend permission condition rendering.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#022036] text-slate-100 font-sans selection:bg-yellow-400 selection:text-[#022036] overflow-x-hidden relative">
      
      {/* Background Glow Ambient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-yellow-500/20 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-yellow-400 text-[#022036] flex items-center justify-center font-extrabold shadow-lg shadow-yellow-400/20">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">Meret<span className="text-yellow-400">POS</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-300">
          <a href="#features" className="hover:text-yellow-400 transition-colors">3D Architecture</a>
          <a href="#pricing" className="hover:text-yellow-400 transition-colors">Pricing</a>
          <a href="#contact" className="hover:text-yellow-400 transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-yellow-400 hover:text-white transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 rounded-xl bg-yellow-400 text-[#022036] font-extrabold text-xs hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20 cursor-pointer flex items-center gap-1.5"
          >
            Launch POS <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section with 3D Tilt Mockup */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-extrabold tracking-wide shadow-sm">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Next-Gen Ethiopian Retail Infrastructure
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            The Ultimate <span className="text-yellow-400 drop-shadow-md">POS & Inventory</span> Ecosystem.
          </h1>
          
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
            Engineered for high-speed performance. Handle <span className="text-yellow-400 font-bold">Yeketena credits</span>, automated VIP customer tiers, and lightning-fast thermal printing with absolute precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-yellow-400 text-[#022036] font-extrabold text-xs hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-400/25 cursor-pointer flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              Get Started Now <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center backdrop-blur-md"
            >
              Explore 3D Architecture
            </a>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-yellow-400" /> Cash, Telebirr & Credit</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-yellow-400" /> ERCA Fiscal Compliant</span>
          </div>
        </div>

        {/* 3D Interactive Hover Tilt Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={heroTilt}
            className="w-full max-w-md rounded-3xl bg-gradient-to-br from-slate-900/90 to-[#022036] border border-yellow-500/40 shadow-2xl p-6 space-y-5 cursor-pointer transform-gpu backdrop-blur-xl relative group"
          >
            <div className="absolute -top-3 -right-3 bg-yellow-400 text-[#022036] font-extrabold text-[10px] px-3 py-1 rounded-full shadow-lg">
              Live Terminal 3D
            </div>

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-yellow-400 tracking-wider">Register Simulation</p>
                <h3 className="font-extrabold text-sm text-white mt-0.5">MeretPOS Core Engine</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold animate-pulse">
                ● SYNCED
              </span>
            </div>

            <div className="space-y-2.5 bg-black/40 p-4 rounded-2xl border border-white/5 font-mono text-xs shadow-inner">
              <div className="flex justify-between text-slate-300">
                <span>1x Premium Teff (50kg)</span>
                <span className="font-bold text-white">4,800.00 ETB</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>2x Cooking Oil 5L</span>
                <span className="font-bold text-white">1,900.00 ETB</span>
              </div>
              <div className="flex justify-between text-slate-300 pt-2 border-t border-white/10">
                <span>VIP Points Discount</span>
                <span className="text-emerald-400 font-bold">-100.00 ETB</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-yellow-400 text-[#022036] flex items-center justify-between shadow-xl">
              <div>
                <p className="text-[10px] font-bold uppercase opacity-80">Final Amount Due</p>
                <p className="text-base font-extrabold font-mono">6,600.00 ETB</p>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-[#022036] text-yellow-400 font-bold text-xs shadow-sm">
                Paid (Yeketena Credit)
              </span>
            </div>

            <div className="text-center pt-1">
              <p className="text-[10px] text-slate-400 group-hover:text-yellow-400 transition-colors">✨ Move your cursor over this card to activate 3D tilt.</p>
            </div>
          </div>
        </div>

      </section>

      {/* 3D Multi-Level Zoom Architecture Section */}
      <section id="features" className="py-24 bg-slate-900/80 border-t border-b border-yellow-500/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-yellow-400">Interactive 3D Deep Zoom</h2>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">Click Any Module to Zoom Out & Inspect Architecture</h3>
            <p className="text-xs text-slate-300">Experience our multi-level architectural expansion. Click a feature card to reveal deep technical specs, database schemas, and workflow mechanics.</p>
          </div>

          {/* Zoom Level Indicator Bar */}
          <div className="flex items-center justify-center gap-4 text-xs font-bold">
            <button
              onClick={() => { setZoomLevel(0); setActiveFeature(null); }}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${zoomLevel === 0 ? 'bg-yellow-400 text-[#022036] shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              1. Overview Mode
            </button>
            <button
              disabled={zoomLevel < 1}
              onClick={() => setZoomLevel(1)}
              className={`px-4 py-2 rounded-xl transition-all ${zoomLevel >= 1 ? 'bg-yellow-400 text-[#022036] shadow-lg cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              2. Deep Detail Zoom Out {zoomLevel >= 1 && 'active'}
            </button>
            <button
              disabled={zoomLevel < 2}
              onClick={() => setZoomLevel(2)}
              className={`px-4 py-2 rounded-xl transition-all ${zoomLevel >= 2 ? 'bg-yellow-400 text-[#022036] shadow-lg cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              3. Core Architecture Zoom Out {zoomLevel >= 2 && 'active'}
            </button>
          </div>

          {/* Interactive Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuresData.map((f) => {
              const Icon = f.icon;
              const isSelected = activeFeature?.id === f.id;

              return (
                <div
                  key={f.id}
                  onClick={() => {
                    setActiveFeature(f);
                    setZoomLevel(isSelected ? 0 : 2);
                  }}
                  className={`p-6 rounded-3xl bg-[#022036] border transition-all cursor-pointer shadow-xl space-y-4 relative overflow-hidden group transform hover:-translate-y-1 ${
                    isSelected ? 'border-yellow-400 ring-2 ring-yellow-400/40 bg-gradient-to-b from-[#022036] to-slate-900 scale-105' : 'border-yellow-500/20 hover:border-yellow-400/50'
                  }`}
                >
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                    <Icon className="h-16 w-16 text-yellow-400" />
                  </div>

                  <div className="h-12 w-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 flex items-center justify-center font-bold">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h4 className="font-extrabold text-sm text-white">{f.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{f.summary}</p>

                  <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-yellow-400">
                    <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {isSelected ? 'Zoomed In' : 'Click to 3D Zoom Out'}</span>
                    <ArrowRight className={`h-4 w-4 transform transition-transform ${isSelected ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic 3D Zoom Out Inspection Modal / Drawer */}
          {activeFeature && (
            <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#022036] to-slate-900 border-2 border-yellow-400 shadow-2xl space-y-6 animate-fadeIn transition-all">
              <div className="flex items-center justify-between border-b border-yellow-500/30 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-yellow-400 text-[#022036] flex items-center justify-center font-bold">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-yellow-400 tracking-wider">3D Zoom Inspector Active</span>
                    <h3 className="font-extrabold text-lg text-white">{activeFeature.title} — Architectural Breakdown</h3>
                  </div>
                </div>
                <button
                  onClick={() => { setActiveFeature(null); setZoomLevel(0); }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer transition-colors"
                >
                  Close Inspection ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <p className="font-bold text-yellow-400 uppercase tracking-wide flex items-center gap-1.5">
                    <Cpu className="h-4 w-4" /> Deep Technical Workflow
                  </p>
                  <p className="text-slate-300 leading-relaxed">{activeFeature.deepDetail}</p>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <p className="font-bold text-yellow-400 uppercase tracking-wide flex items-center gap-1.5">
                    <Database className="h-4 w-4" /> Database & Stack Implementation
                  </p>
                  <p className="text-slate-300 leading-relaxed">{activeFeature.architecture}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-6 space-y-16 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-yellow-400">Simple Local Subscription</h2>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">Affordable Plans for Growing Ethiopian Businesses</h3>
          <p className="text-xs text-slate-300">Choose the right tier for your store. Transparent pricing in local currency.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Starter Plan */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 flex flex-col justify-between shadow-xl backdrop-blur-md">
            <div className="space-y-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300">Starter Shop</span>
              <div>
                <span className="text-4xl font-extrabold text-white">1,200</span>
                <span className="text-xs text-slate-400 ml-1">ETB / month</span>
              </div>
              <p className="text-xs text-slate-400">Ideal for single-register mini-markets and boutiques.</p>
              
              <ul className="space-y-3 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-yellow-400" /> Core POS Fast Checkout</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-yellow-400" /> Up to 500 Inventory Items</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-yellow-400" /> Cash & Telebirr Payments</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-yellow-400" /> 80mm Thermal Receipt Printing</li>
              </ul>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
            >
              Get Started
            </button>
          </div>

          {/* Pro Business Plan */}
          <div className="p-8 rounded-3xl bg-[#022036] border-2 border-yellow-400 space-y-6 flex flex-col justify-between shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-4 right-4 bg-yellow-400 text-[#022036] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Most Popular
            </div>

            <div className="space-y-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">Pro Enterprise</span>
              <div>
                <span className="text-4xl font-extrabold text-white">3,000</span>
                <span className="text-xs text-slate-400 ml-1">ETB / month</span>
              </div>
              <p className="text-xs text-slate-300">For established stores requiring full credits and multi-user roles.</p>
              
              <ul className="space-y-3 text-xs text-slate-200 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-yellow-400" /> Everything in Starter</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-yellow-400" /> Unlimited Inventory Items</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-yellow-400" /> Yeketena Credit Management</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-yellow-400" /> VIP Loyalty CRM & Points</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-yellow-400" /> Role-Based Security & Permissions</li>
              </ul>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-xl bg-yellow-400 text-[#022036] font-extrabold text-xs hover:bg-yellow-300 transition-all shadow-lg cursor-pointer"
            >
              Start Free Trial
            </button>
          </div>

        </div>
      </section>

      {/* Footer / Contact with Exact User Details */}
      <footer id="contact" className="border-t border-yellow-500/20 bg-slate-900 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-yellow-400 text-[#022036] flex items-center justify-center font-extrabold shadow-md">
              <ShoppingCart className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-white">Meret<span className="text-yellow-400">POS</span> © 2026</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
            <a href="tel:0900460680" className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors">
              <Phone className="h-3.5 w-3.5 text-yellow-400" /> 0900460680
            </a>
            <a href="mailto:letifylkal8@gmail.com" className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors">
              <Mail className="h-3.5 w-3.5 text-yellow-400" /> letifylkal8@gmail.com
            </a>
            <span className="text-slate-500">Addis Ababa, Ethiopia</span>
          </div>
        </div>
      </footer>

    </div>
  );
}