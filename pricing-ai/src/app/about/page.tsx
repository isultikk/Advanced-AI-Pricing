import Link from "next/link";
import {
  TrendingUp, Search, Activity, Sparkles, ArrowLeft,
  Database, Brain, BarChart3, Target, Zap, GitMerge,
  Package, Users, ChevronRight,
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-700 font-medium transition-colors"
          >
            <ArrowLeft size={15} /> Back to App
          </Link>
          <div className="h-5 w-px bg-slate-200" />
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-violet-600 flex items-center justify-center">
              <TrendingUp size={14} className="text-white" />
            </div>
            <span className="text-base font-black text-slate-900 tracking-tight">PriceAI</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full text-xs font-bold mb-4">
            <Sparkles size={12} /> 
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">
            About PriceAI
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
            PriceAI is a dynamic pricing intelligence platform that combines real-time market price
            comparison with AI-driven pricing strategy — helping buyers find the best deal and
            sellers find the optimal price.
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <GitMerge size={20} className="text-violet-500" /> How the Two Tools Work Together
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-start gap-0">
              <Step
                number={1}
                icon={<Search size={18} className="text-violet-600" />}
                color="bg-violet-50 border-violet-200"
                title="Search the Market"
                description="Search any product and instantly see prices across Zara, Adidas, Nike, H&M, Amazon, ASOS, and Uniqlo. Gemini AI analyzes the results and identifies the best deal, discount patterns, and whether to buy now or wait."
              />
              <div className="hidden sm:flex items-center self-center px-2">
                <ChevronRight size={20} className="text-slate-300" />
              </div>
              <Step
                number={2}
                icon={<Target size={18} className="text-emerald-600" />}
                color="bg-emerald-50 border-emerald-200"
                title="Bridge to the Optimizer"
                description="Click 'Optimize Your Pricing' on any result. The market average price is automatically loaded as your competitor price benchmark — no manual entry needed."
              />
              <div className="hidden sm:flex items-center self-center px-2">
                <ChevronRight size={20} className="text-slate-300" />
              </div>
              <Step
                number={3}
                icon={<Activity size={18} className="text-blue-600" />}
                color="bg-blue-50 border-blue-200"
                title="Optimize Your Price"
                description="Set your unit cost and ad spend. The Random Forest model simulates 120 price points and finds the one that maximizes profit. Gemini then delivers a full strategy: positioning, margin analysis, risks, and action items."
              />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Search size={18} className="text-violet-500" /> Market Search
            </h2>
            <ul className="space-y-3 text-sm text-slate-600">
              <FeatureItem icon={<Database size={14} className="text-violet-400" />}
                text="Covers 17 major fashion and lifestyle stores" />
              <FeatureItem icon={<BarChart3 size={14} className="text-violet-400" />}
                text="Category-aware pricing: shoes, jackets, accessories each use realistic base prices" />
              <FeatureItem icon={<Sparkles size={14} className="text-violet-400" />}
                text="Gemini AI provides a verdict (Excellent / Good / Fair / Expensive), best deal, and savings tips" />
              <FeatureItem icon={<Zap size={14} className="text-violet-400" />}
                text="Shows discounts, stock availability, ratings, and delivery time per store" />
            </ul>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Activity size={18} className="text-blue-500" /> Price Optimizer
            </h2>
            <ul className="space-y-3 text-sm text-slate-600">
              <FeatureItem icon={<Brain size={14} className="text-blue-400" />}
                text="Random Forest model trained on 2,000 synthetic market scenarios" />
              <FeatureItem icon={<BarChart3 size={14} className="text-blue-400" />}
                text="Simulates 120 price points and selects the profit-maximizing one" />
              <FeatureItem icon={<Users size={14} className="text-blue-400" />}
                text="Accounts for seasonality, ad spend impact, and competitor positioning" />
              <FeatureItem icon={<Sparkles size={14} className="text-blue-400" />}
                text="Gemini strategy layer adds competitive edge analysis, margin insights, and action items" />
            </ul>
          </section>
        </div>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-10">
          <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
            <Package size={18} className="text-slate-500" /> Technology Stack
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <TechCard label="Backend" value="Python · FastAPI" color="bg-slate-900 text-white" />
            <TechCard label="ML Model" value="Random Forest · scikit-learn" color="bg-blue-600 text-white" />
            <TechCard label="AI Analysis" value="Gemini 2.0 Flash" color="bg-violet-600 text-white" />
            <TechCard label="Frontend" value="Next.js · Tailwind · Recharts" color="bg-emerald-600 text-white" />
          </div>
        </section>

        <section className="bg-violet-600 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-2">Ready to find the best price?</h2>
          <p className="text-violet-200 mb-6">Search any product and let Gemini AI do the analysis.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-violet-700 font-bold rounded-xl text-sm hover:bg-violet-50 transition-colors shadow-sm"
          >
            <Search size={16} /> Start Searching
          </Link>
        </section>
      </main>
    </div>
  );
}

function Step({
  number, icon, color, title, description,
}: {
  number: number;
  icon: React.ReactNode;
  color: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex-1 flex flex-col gap-3 py-2 px-1">
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Step {number}</span>
        </div>
        <h3 className="font-bold text-slate-800 text-sm mb-1">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span>{text}</span>
    </li>
  );
}

function TechCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`rounded-xl p-4 ${color}`}>
      <p className="text-[10px] font-bold opacity-70 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}
