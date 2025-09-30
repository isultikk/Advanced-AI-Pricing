'use client';

import { useState, useMemo } from 'react';

export default function BreakEvenPage() {
  const [fixedCosts, setFixedCosts] = useState<string>('50000');
  const [variableCost, setVariableCost] = useState<string>('20');
  const [sellingPrice, setSellingPrice] = useState<string>('50');

  const analytics = useMemo(() => {
    const fc = parseFloat(fixedCosts);
    const vc = parseFloat(variableCost);
    const sp = parseFloat(sellingPrice);

    if (!fc || !vc || !sp || sp <= vc) return null;

    const unitsToBreakEven = Math.ceil(fc / (sp - vc));
    const revenueToBreakEven = unitsToBreakEven * sp;
    const profitMargin = ((sp - vc) / sp) * 100;

    return { unitsToBreakEven, revenueToBreakEven, profitMargin };
  }, [fixedCosts, variableCost, sellingPrice]);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Break-Even Investment Analytics</h1>
        <p className="text-slate-500">Calculate financial viability based on your pricing strategy.</p>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Fixed Costs ($)</label>
          <input type="number" value={fixedCosts} onChange={(e) => setFixedCosts(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Variable Cost per Unit ($)</label>
          <input type="number" value={variableCost} onChange={(e) => setVariableCost(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price ($)</label>
          <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50 border-blue-200" />
        </div>
      </div>

      {analytics ? (
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Break-Even Units</h3>
            <p className="text-3xl font-bold text-slate-900">{analytics.unitsToBreakEven.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Break-Even Revenue</h3>
            <p className="text-3xl font-bold text-green-600">${analytics.revenueToBreakEven.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Gross Profit Margin</h3>
            <p className="text-3xl font-bold text-blue-600">{analytics.profitMargin.toFixed(1)}%</p>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
          Selling price must be greater than variable cost to break even!
        </div>
      )}
    </div>
  );
}