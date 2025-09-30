"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search, Star, Truck, ShoppingBag, TrendingUp, TrendingDown,
  Minus, Sparkles, CheckCircle, XCircle, ExternalLink,
  Zap, Tag, BarChart3, Package, Megaphone, Users, Calendar,
  ArrowRight, ChevronDown, ChevronUp, Activity, Target,
  AlertCircle, Award, Info,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";

const ALL_STORES = [
  { id: "zara",       name: "Zara",           color: "bg-stone-900 text-white" },
  { id: "adidas",     name: "Adidas",         color: "bg-black text-white" },
  { id: "nike",       name: "Nike",           color: "bg-orange-600 text-white" },
  { id: "hm",         name: "H&M",            color: "bg-red-600 text-white" },
  { id: "amazon",     name: "Amazon",         color: "bg-amber-500 text-black" },
  { id: "asos",       name: "ASOS",           color: "bg-zinc-800 text-white" },
  { id: "uniqlo",     name: "Uniqlo",         color: "bg-red-700 text-white" },
  { id: "mango",      name: "Mango",          color: "bg-amber-600 text-white" },
  { id: "puma",       name: "Puma",           color: "bg-neutral-900 text-white" },
  { id: "levis",      name: "Levi's",         color: "bg-indigo-600 text-white" },
  { id: "tommy",      name: "Tommy Hilfiger", color: "bg-blue-800 text-white" },
  { id: "newbalance", name: "New Balance",    color: "bg-slate-600 text-white" },
  { id: "shein",      name: "Shein",          color: "bg-pink-500 text-white" },
  { id: "zalando",    name: "Zalando",        color: "bg-rose-500 text-white" },
  { id: "gap",        name: "Gap",            color: "bg-blue-600 text-white" },
  { id: "pullbear",   name: "Pull&Bear",      color: "bg-neutral-700 text-white" },
  { id: "primark",    name: "Primark",        color: "bg-teal-600 text-white" },
];

const SUGGESTIONS = [
  "Nike Air Force 1", "Zara Linen Shirt", "Adidas Ultraboost", "H&M Oversized Hoodie",
];

type PriceResult = {
  store_id: string;
  store_name: string;
  store_url: string;
  product_name: string;
  price: number;
  original_price: number | null;
  currency: string;
  in_stock: boolean;
  rating: number;
  reviews: number;
  delivery_days: number;
  description: string;
};

type MarketAnalysis = {
  summary: string;
  best_deal: string;
  recommendation: string;
  market_insights: string[];
  savings_tip: string;
  price_trend: string;
  verdict: string;
};

type OptimizeResult = {
  optimal_price: number;
  expected_profit: number;
  expected_demand: number;
  chart_data: { price: number; profit: number; demand: number }[];
};

type OptimizerInsights = {
  positioning: string;
  margin_insight: string;
  competitive_edge: string;
  risks: string;
  action_items: string[];
  confidence: string;
};

type MarketContext = {
  query: string;
  avg_price: number;
  min_price: number;
  max_price: number;
  store_count: number;
};

const VERDICT_CONFIG: Record<string, { label: string; cls: string }> = {
  excellent: { label: "Excellent Value", cls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  good: { label: "Good Value", cls: "bg-blue-100 text-blue-800 border-blue-200" },
  fair: { label: "Fair Price", cls: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  expensive: { label: "Overpriced", cls: "bg-red-100 text-red-800 border-red-200" },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={11}
          className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
        />
      ))}
    </div>
  );
}

function PriceCard({
  result, isBest, onUseAsComp,
}: {
  result: PriceResult;
  isBest: boolean;
  onUseAsComp: (price: number, storeName: string) => void;
}) {
  const discount = result.original_price
    ? Math.round((1 - result.price / result.original_price) * 100)
    : null;
  const store = ALL_STORES.find((s) => s.id === result.store_id);

  return (
    <div
      className={`relative rounded-2xl border bg-white overflow-hidden transition-all duration-200 hover:shadow-lg ${
        isBest
          ? "border-emerald-400 shadow-md ring-1 ring-emerald-200"
          : "border-slate-200 shadow-sm hover:border-slate-300"
      }`}
    >
      {isBest && (
        <div className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 text-center tracking-widest uppercase">
          Best Price
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${store?.color ?? "bg-slate-100 text-slate-800"}`}>
              {result.store_name}
            </span>
            {discount && (
              <span className="text-xs font-bold px-2 py-1 bg-rose-100 text-rose-700 rounded-lg">
                -{discount}%
              </span>
            )}
          </div>
          {result.in_stock ? (
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium shrink-0">
              <CheckCircle size={12} /> In Stock
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium shrink-0">
              <XCircle size={12} /> Out of Stock
            </span>
          )}
        </div>

        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">${result.price}</span>
            {result.original_price && (
              <span className="text-sm text-slate-400 line-through">${result.original_price}</span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">{result.description}</p>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <StarRating rating={result.rating} />
          <span className="text-[11px] text-slate-500">
            {result.rating} ({result.reviews.toLocaleString()})
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-4">
          <Truck size={12} />
          <span>Ships in {result.delivery_days} day{result.delivery_days > 1 ? "s" : ""}</span>
        </div>

        <div className="flex flex-col gap-2">
          <a
            href={result.store_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-colors ${
              result.in_stock
                ? isBest
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "bg-slate-900 hover:bg-slate-700 text-white"
                : "bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none"
            }`}
          >
            {result.in_stock ? <><ExternalLink size={13} /> View Deal</> : "Unavailable"}
          </a>
          {result.in_stock && (
            <button
              onClick={() => onUseAsComp(result.price, result.store_name)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold border border-violet-300 text-violet-700 hover:bg-violet-50 transition-colors"
            >
              <Target size={12} /> Optimize Against This Price
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MarketAnalysisPanel({
  analysis, loading,
}: {
  analysis: MarketAnalysis | null;
  loading: boolean;
}) {
  const [open, setOpen] = useState(true);
  const trendIcon = analysis?.price_trend?.toLowerCase().startsWith("rising")
    ? <TrendingUp size={14} className="text-rose-500" />
    : analysis?.price_trend?.toLowerCase().startsWith("falling")
    ? <TrendingDown size={14} className="text-emerald-500" />
    : <Minus size={14} className="text-slate-400" />;
  const vConf = analysis?.verdict ? VERDICT_CONFIG[analysis.verdict.toLowerCase()] ?? VERDICT_CONFIG.good : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
            <Sparkles size={14} className="text-violet-600" />
          </div>
          <span className="font-bold text-slate-800 text-sm">Gemini AI Analysis</span>
          {vConf && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${vConf.cls}`}>
              {vConf.label}
            </span>
          )}
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-100">
          {loading && (
            <div className="py-8 flex flex-col items-center gap-3 text-slate-400">
              <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Analyzing with Gemini AI...</span>
            </div>
          )}
          {!loading && !analysis && (
            <p className="text-xs text-slate-400 py-4 text-center">Search for a product to see AI insights.</p>
          )}
          {!loading && analysis && (
            <>
              <p className="text-sm text-slate-600 leading-relaxed pt-2">{analysis.summary}</p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex gap-2">
                <ShoppingBag size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide mb-0.5">Best Deal</p>
                  <p className="text-sm text-emerald-800 font-medium">{analysis.best_deal}</p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2">
                <Zap size={15} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wide mb-0.5">Recommendation</p>
                  <p className="text-sm text-blue-800">{analysis.recommendation}</p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <BarChart3 size={13} className="text-slate-400" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Market Insights</p>
                </div>
                <ul className="space-y-1.5">
                  {analysis.market_insights.map((ins, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="w-4 h-4 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {ins}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
                <Tag size={15} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-0.5">Savings Tip</p>
                  <p className="text-sm text-amber-800">{analysis.savings_tip}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                {trendIcon}
                <span className="font-medium">Price Trend:</span>
                <span className="text-slate-500">{analysis.price_trend}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ControlCard({
  label, icon, value, onChange, min, max, step = 1,
}: {
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-3">
        {icon} {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={value}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-24 p-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:border-violet-400"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-violet-600"
        />
      </div>
    </div>
  );
}

function OptimizerInsightsPanel({
  insights, loading,
}: {
  insights: OptimizerInsights | null;
  loading: boolean;
}) {
  const confColor = insights?.confidence?.toLowerCase().startsWith("high")
    ? "text-emerald-600"
    : insights?.confidence?.toLowerCase().startsWith("low")
    ? "text-rose-500"
    : "text-amber-600";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
          <Sparkles size={14} className="text-violet-600" />
        </div>
        <span className="font-bold text-slate-800 text-sm">Gemini Strategy Insights</span>
      </div>
      <div className="p-5 space-y-4">
        {loading && (
          <div className="py-6 flex flex-col items-center gap-3 text-slate-400">
            <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Generating strategy...</span>
          </div>
        )}
        {!loading && !insights && (
          <p className="text-xs text-slate-400 text-center py-4">Run the optimizer to get strategic insights.</p>
        )}
        {!loading && insights && (
          <>
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-3">
              <p className="text-[10px] font-bold text-violet-700 uppercase tracking-wide mb-1">Market Positioning</p>
              <p className="text-sm text-violet-900">{insights.positioning}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wide mb-1">Margin Analysis</p>
              <p className="text-sm text-blue-900">{insights.margin_insight}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide mb-1">Competitive Edge</p>
              <p className="text-sm text-emerald-900">{insights.competitive_edge}</p>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex gap-2">
              <AlertCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wide mb-0.5">Watch Out</p>
                <p className="text-sm text-rose-900">{insights.risks}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                <Award size={12} /> Action Items
              </p>
              <ul className="space-y-1.5">
                {insights.action_items.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <p className={`text-xs font-semibold ${confColor}`}>
              Confidence: {insights.confidence}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"search" | "optimizer">("search");

  const [searchInput, setSearchInput] = useState("");
  const [selectedStores, setSelectedStores] = useState<string[]>(ALL_STORES.map((s) => s.id));
  const [searchResults, setSearchResults] = useState<PriceResult[]>([]);
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(null);
  const [activeQuery, setActiveQuery] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [brandFiltered, setBrandFiltered] = useState(false);

  const [marketContext, setMarketContext] = useState<MarketContext | null>(null);

  const [optimizerParams, setOptimizerParams] = useState({
    cost: 50, ad_spend: 100, comp_price: 110, month: 6,
  });
  const [optimizeResult, setOptimizeResult] = useState<OptimizeResult | null>(null);
  const [optimizerInsights, setOptimizerInsights] = useState<OptimizerInsights | null>(null);
  const [loadingOptimize, setLoadingOptimize] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const toggleStore = (id: string) => {
    setSelectedStores((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((s) => s !== id) : prev) : [...prev, id]
    );
  };

  const runSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) return;
      setLoadingSearch(true);
      setLoadingAnalysis(true);
      setHasSearched(true);
      setSearchResults([]);
      setMarketAnalysis(null);
      setActiveQuery(query);
      setBrandFiltered(false);

      try {
        const searchRes = await fetch("http://localhost:8000/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, stores: selectedStores }),
        });
        const searchData = await searchRes.json();
        const results: PriceResult[] = searchData.results ?? [];
        setSearchResults(results);
        setBrandFiltered(searchData.brand_filtered ?? false);
        setLoadingSearch(false);

        const analyzeRes = await fetch("http://localhost:8000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, prices: results }),
        });
        const analyzeData = await analyzeRes.json();
        setMarketAnalysis(analyzeData.analysis ?? null);
      } catch {
        setLoadingSearch(false);
      } finally {
        setLoadingAnalysis(false);
      }
    },
    [selectedStores]
  );

  const handleUseAsCompetitor = (price: number) => {
    const inStock = searchResults.filter((r) => r.in_stock);
    const prices = inStock.map((r) => r.price);
    const avg = prices.length ? Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100 : price;
    const min = prices.length ? Math.min(...prices) : price;
    const max = prices.length ? Math.max(...prices) : price;

    setMarketContext({
      query: activeQuery,
      avg_price: avg,
      min_price: min,
      max_price: max,
      store_count: searchResults.length,
    });
    setOptimizerParams((p) => ({ ...p, comp_price: avg }));
    setOptimizeResult(null);
    setOptimizerInsights(null);
    setActiveTab("optimizer");
  };

  const runOptimize = async () => {
    setLoadingOptimize(true);
    setLoadingInsights(false);
    setOptimizeResult(null);
    setOptimizerInsights(null);

    try {
      const res = await fetch("http://localhost:8000/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(optimizerParams),
      });
      const data: OptimizeResult = await res.json();
      setOptimizeResult(data);
      setLoadingOptimize(false);

      setLoadingInsights(true);
      const insRes = await fetch("http://localhost:8000/optimize-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...optimizerParams,
          optimal_price: data.optimal_price,
          expected_profit: data.expected_profit,
          market_context: marketContext,
        }),
      });
      const insData = await insRes.json();
      setOptimizerInsights(insData.insights ?? null);
    } catch {
      setLoadingOptimize(false);
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    if (activeTab === "optimizer" && !optimizeResult && !loadingOptimize) {
      runOptimize();
    }
  }, [activeTab]);

  const bestPriceId = useMemo(
    () => searchResults.filter((r) => r.in_stock).sort((a, b) => a.price - b.price)[0]?.store_id ?? null,
    [searchResults]
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-0 flex items-center gap-0">
          <div className="flex items-center gap-2.5 py-4 pr-8 border-r border-slate-200 mr-6">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tight">PriceAI</span>
          </div>

          <nav className="flex items-center gap-1 flex-1">
            <TabButton
              active={activeTab === "search"}
              onClick={() => setActiveTab("search")}
              icon={<Search size={15} />}
              label="Market Search"
              badge={hasSearched && searchResults.length > 0 ? `${searchResults.length} stores` : undefined}
            />
            <TabButton
              active={activeTab === "optimizer"}
              onClick={() => setActiveTab("optimizer")}
              icon={<Activity size={15} />}
              label="Price Optimizer"
              badge={marketContext ? `↳ ${marketContext.query}` : undefined}
              highlight={!!marketContext}
            />
          </nav>

          <div className="flex items-center gap-3 ml-auto">
            <Link
              href="/about"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-violet-700 hover:bg-violet-50 rounded-lg transition-colors"
            >
              <Info size={14} /> About
            </Link>
            {activeTab === "search" && hasSearched && searchResults.length > 0 && (
              <button
                onClick={() => handleUseAsCompetitor(
                  Math.min(...searchResults.filter((r) => r.in_stock).map((r) => r.price))
                )}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Optimize Your Pricing <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {activeTab === "search" && (
          <div>
            <div className={`transition-all duration-300 ${hasSearched ? "mb-6" : "mb-10 mt-12 text-center"}`}>
              {!hasSearched && (
                <>
                  <h1 className="text-4xl font-black text-slate-900 mb-3">
                    Find the Best Price — Instantly
                  </h1>
                  <p className="text-slate-500 text-lg mb-8">
                    Compare prices across Zara, Adidas, Nike, H&M, Amazon and more.
                    Then optimize your own pricing with AI.
                  </p>
                </>
              )}

              <form
                onSubmit={(e) => { e.preventDefault(); runSearch(searchInput); }}
                className={`flex gap-3 ${!hasSearched ? "max-w-2xl mx-auto" : ""}`}
              >
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search any product..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300 bg-white shadow-sm text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!searchInput.trim() || loadingSearch}
                  className="px-7 py-3.5 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-bold rounded-2xl text-sm transition-colors shadow-sm flex items-center gap-2"
                >
                  {loadingSearch
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Search size={16} />}
                  Search
                </button>
              </form>

              {!hasSearched && (
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSearchInput(s); runSearch(s); }}
                      className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-violet-400 hover:text-violet-600 transition-colors shadow-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-slate-400 font-medium">
                  {selectedStores.length}/{ALL_STORES.length} stores
                </span>
                <button
                  onClick={() => setSelectedStores(ALL_STORES.map((s) => s.id))}
                  className="text-xs text-violet-600 hover:text-violet-800 font-semibold transition-colors"
                >
                  All
                </button>
                <span className="text-slate-300 text-xs">·</span>
                <button
                  onClick={() => setSelectedStores([ALL_STORES[0].id])}
                  className="text-xs text-slate-500 hover:text-slate-700 font-semibold transition-colors"
                >
                  None
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_STORES.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => toggleStore(store.id)}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${
                      selectedStores.includes(store.id)
                        ? `${store.color} border-transparent shadow-sm`
                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-400"
                    }`}
                  >
                    {store.name}
                  </button>
                ))}
              </div>
            </div>

            {hasSearched && (
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  {activeQuery && (
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <p className="text-sm text-slate-500">
                        Results for{" "}
                        <span className="font-semibold text-slate-700">&ldquo;{activeQuery}&rdquo;</span>
                        {!loadingSearch && searchResults.length > 0 && (
                          <> — {searchResults.filter((r) => r.in_stock).length} in stock</>
                        )}
                      </p>
                      {!loadingSearch && brandFiltered && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full font-medium">
                          <CheckCircle size={11} />
                          Showing only stores that carry this brand
                        </span>
                      )}
                    </div>
                  )}

                  {loadingSearch ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {selectedStores.map((id) => (
                        <div key={id} className="rounded-2xl border border-slate-200 bg-white h-64 animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {searchResults.map((r) => (
                        <PriceCard
                          key={r.store_id}
                          result={r}
                          isBest={r.store_id === bestPriceId}
                          onUseAsComp={handleUseAsCompetitor}
                        />
                      ))}
                    </div>
                  )}

                  {!loadingSearch && searchResults.length > 0 && (
                    <div className="mt-6 p-4 bg-violet-50 border border-violet-200 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center shrink-0">
                          <Activity size={16} className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-violet-900">Ready to price your own product?</p>
                          <p className="text-xs text-violet-600">
                            Use this market data to find your optimal selling price
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUseAsCompetitor(
                          Math.min(...searchResults.filter((r) => r.in_stock).map((r) => r.price))
                        )}
                        className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
                      >
                        Open Optimizer <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="lg:w-80 xl:w-96 shrink-0">
                  <div className="lg:sticky lg:top-24">
                    <MarketAnalysisPanel analysis={marketAnalysis} loading={loadingAnalysis} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "optimizer" && (
          <div>
            {marketContext && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-emerald-900">
                    Market data loaded: &ldquo;{marketContext.query}&rdquo;
                  </p>
                  <p className="text-xs text-emerald-700">
                    {marketContext.store_count} stores · avg ${marketContext.avg_price} · range ${marketContext.min_price}–${marketContext.max_price} · competitor price set to market avg
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("search")}
                  className="text-xs text-emerald-700 underline underline-offset-2 shrink-0"
                >
                  Update search
                </button>
              </div>
            )}

            {!marketContext && (
              <div className="mb-6 p-4 bg-slate-100 border border-slate-200 rounded-2xl flex items-center gap-3">
                <Search size={16} className="text-slate-500 shrink-0" />
                <p className="text-sm text-slate-600">
                  Tip: Search for a product first and click{" "}
                  <span className="font-semibold">Optimize Your Pricing</span> to auto-fill market data.
                </p>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-72 xl:w-80 shrink-0 space-y-3">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Pricing Parameters</h2>
                <ControlCard label="Unit Cost ($)" icon={<Package size={14} />} value={optimizerParams.cost} onChange={(v) => setOptimizerParams((p) => ({ ...p, cost: v }))} min={5} max={300} />
                <ControlCard label="Ad Spend ($)" icon={<Megaphone size={14} />} value={optimizerParams.ad_spend} onChange={(v) => setOptimizerParams((p) => ({ ...p, ad_spend: v }))} min={0} max={1000} />
                <ControlCard label="Competitor Price ($)" icon={<Users size={14} />} value={optimizerParams.comp_price} onChange={(v) => setOptimizerParams((p) => ({ ...p, comp_price: v }))} min={10} max={500} />

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-3">
                    <Calendar size={14} /> Month: {optimizerParams.month}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={optimizerParams.month}
                    onChange={(e) => setOptimizerParams((p) => ({ ...p, month: parseInt(e.target.value) }))}
                    className="w-full accent-violet-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Jan</span><span>Jun</span><span>Dec</span>
                  </div>
                </div>

                <button
                  onClick={runOptimize}
                  disabled={loadingOptimize}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {loadingOptimize
                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Optimizing...</>
                    : <><Activity size={16} /> Find Optimal Price</>}
                </button>

                {optimizeResult && (
                  <div className="bg-violet-600 text-white p-5 rounded-2xl shadow-lg">
                    <p className="text-violet-200 text-[11px] font-bold uppercase tracking-wide">Optimal Price</p>
                    <p className="text-4xl font-black mt-1">${optimizeResult.optimal_price}</p>
                    <div className="mt-3 pt-3 border-t border-violet-500 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-violet-200">Expected Profit</span>
                        <span className="font-bold">${optimizeResult.expected_profit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-violet-200">Predicted Demand</span>
                        <span className="font-bold">{optimizeResult.expected_demand} units</span>
                      </div>
                      {marketContext && (
                        <div className="flex justify-between text-sm">
                          <span className="text-violet-200">vs. Market Avg</span>
                          <span className={`font-bold ${optimizeResult.optimal_price > marketContext.avg_price ? "text-rose-300" : "text-emerald-300"}`}>
                            {optimizeResult.optimal_price > marketContext.avg_price ? "+" : ""}
                            ${(optimizeResult.optimal_price - marketContext.avg_price).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <BarChart3 size={18} className="text-violet-500" /> Profit vs. Price Curve
                  </h3>
                  <div className="h-72">
                    {loadingOptimize ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : optimizeResult ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={optimizeResult.chart_data}>
                          <defs>
                            <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="price" tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
                          <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} tick={{ fontSize: 11 }} />
                          <Tooltip
                            formatter={(v: number, name: string) => [`$${v.toLocaleString()}`, name === "profit" ? "Profit" : name]}
                            labelFormatter={(l) => `Price: $${l}`}
                          />
                          <Area
                            type="monotone"
                            dataKey="profit"
                            stroke="#7c3aed"
                            fill="url(#profitGrad)"
                            strokeWidth={2.5}
                          />
                          <ReferenceLine
                            x={optimizeResult.optimal_price}
                            stroke="#ef4444"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            label={{ value: "Optimal", position: "top", fontSize: 11, fill: "#ef4444" }}
                          />
                          {marketContext && (
                            <ReferenceLine
                              x={marketContext.avg_price}
                              stroke="#10b981"
                              strokeWidth={1.5}
                              strokeDasharray="4 4"
                              label={{ value: "Market Avg", position: "insideTopRight", fontSize: 10, fill: "#10b981" }}
                            />
                          )}
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                        Click &ldquo;Find Optimal Price&rdquo; to run the model
                      </div>
                    )}
                  </div>
                  {optimizeResult && marketContext && (
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-red-500 inline-block" /> Optimal Price
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-emerald-500 inline-block" /> Market Average
                      </span>
                    </div>
                  )}
                </div>

                <OptimizerInsightsPanel insights={optimizerInsights} loading={loadingInsights} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function TabButton({
  active, onClick, icon, label, badge, highlight,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3.5 text-sm font-semibold border-b-2 transition-all ${
        active
          ? "border-violet-600 text-violet-700"
          : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
      }`}
    >
      {icon}
      {label}
      {badge && (
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
            highlight
              ? "bg-violet-100 text-violet-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
