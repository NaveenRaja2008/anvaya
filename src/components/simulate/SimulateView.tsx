'use client';

import React, { useState } from 'react';
import {
  Cpu,
  TrendingUp,
  DollarSign,
  PieChart,
  Layers,
  ArrowRight,
  Sliders,
  RotateCcw,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { AnvayaAppState } from '@/storage/state-store';
import { EvidenceBadge } from '../evidence/EvidenceBadge';
import { SimulationInputs } from '@/types/finance-simulation';

interface SimulateViewProps {
  state: AnvayaAppState;
  onUpdateInputs: (inputs: Partial<SimulationInputs>) => Promise<void>;
  onProceedToBreak: () => void;
}

export const SimulateView: React.FC<SimulateViewProps> = ({
  state,
  onUpdateInputs,
  onProceedToBreak
}) => {
  const { digitalTwin, simulationInputs, opportunities, selectedOpportunityId } = state;
  const selectedOpp = opportunities.find(o => o.id === selectedOpportunityId) || opportunities[0];

  const [activeScenario, setActiveScenario] = useState<'BASE' | 'OPTIMISTIC' | 'CONSERVATIVE' | 'CUSTOM'>('BASE');

  const handleApplyScenario = async (scenario: 'BASE' | 'OPTIMISTIC' | 'CONSERVATIVE') => {
    setActiveScenario(scenario);
    if (scenario === 'BASE') {
      await onUpdateInputs({
        sellingPricePerUnit: selectedOpp.defaultUnitEconomics.sellingPricePerUnit,
        monthlyProductionUnits: selectedOpp.defaultUnitEconomics.monthlyProductionCapacity,
        variableCostsPerUnit: {
          ...simulationInputs.variableCostsPerUnit,
          rawMaterials: selectedOpp.defaultUnitEconomics.rawMaterialCostPerUnit
        }
      });
    } else if (scenario === 'OPTIMISTIC') {
      await onUpdateInputs({
        sellingPricePerUnit: Math.round(selectedOpp.defaultUnitEconomics.sellingPricePerUnit * 1.05),
        monthlyProductionUnits: Math.round(selectedOpp.defaultUnitEconomics.monthlyProductionCapacity * 1.2),
        variableCostsPerUnit: {
          ...simulationInputs.variableCostsPerUnit,
          rawMaterials: Math.round(selectedOpp.defaultUnitEconomics.rawMaterialCostPerUnit * 0.95)
        }
      });
    } else if (scenario === 'CONSERVATIVE') {
      await onUpdateInputs({
        sellingPricePerUnit: Math.round(selectedOpp.defaultUnitEconomics.sellingPricePerUnit * 0.95),
        monthlyProductionUnits: Math.round(selectedOpp.defaultUnitEconomics.monthlyProductionCapacity * 0.8),
        variableCostsPerUnit: {
          ...simulationInputs.variableCostsPerUnit,
          rawMaterials: Math.round(selectedOpp.defaultUnitEconomics.rawMaterialCostPerUnit * 1.10)
        }
      });
    }
  };

  const handleInputChange = async (key: string, value: number) => {
    setActiveScenario('CUSTOM');
    if (key === 'sellingPricePerUnit') {
      await onUpdateInputs({ sellingPricePerUnit: value });
    } else if (key === 'monthlyProductionUnits') {
      await onUpdateInputs({ monthlyProductionUnits: value });
    } else if (key === 'rawMaterials') {
      await onUpdateInputs({
        variableCostsPerUnit: {
          ...simulationInputs.variableCostsPerUnit,
          rawMaterials: value
        }
      });
    } else if (key === 'rent') {
      await onUpdateInputs({
        fixedCosts: {
          ...simulationInputs.fixedCosts,
          rent: value
        }
      });
    } else if (key === 'paymentDelayDays') {
      await onUpdateInputs({ paymentDelayDays: value });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Stage 3: Business Digital Twin
            </h1>
            <EvidenceBadge type="SIMULATED" />
            <EvidenceBadge type="DEMO_DATA" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Deterministic financial simulation, unit economics, break-even and 12-month working capital modeling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleApplyScenario('BASE')}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Reset Base Case
          </button>
          <button
            onClick={onProceedToBreak}
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition-colors"
          >
            <span>Proceed to Break the Business →</span>
          </button>
        </div>
      </div>

      {/* Scenario Manager Selector */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Simulation Scenarios:</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleApplyScenario('BASE')}
            className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
              activeScenario === 'BASE'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            Base Case
          </button>
          <button
            onClick={() => handleApplyScenario('OPTIMISTIC')}
            className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
              activeScenario === 'OPTIMISTIC'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            Optimistic (+20% Vol)
          </button>
          <button
            onClick={() => handleApplyScenario('CONSERVATIVE')}
            className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
              activeScenario === 'CONSERVATIVE'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            Conservative (-20% Vol)
          </button>
          {activeScenario === 'CUSTOM' && (
            <span className="rounded-lg bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              Custom Parameters
            </span>
          )}
        </div>
      </div>

      {/* Key Financial Metrics Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
          <p className="text-xl font-black text-slate-900 dark:text-white">
            ₹{digitalTwin.monthlyRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-500">
            {simulationInputs.monthlyProductionUnits} units @ ₹{simulationInputs.sellingPricePerUnit}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unit Contribution</span>
          <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">
            ₹{digitalTwin.contributionMarginPerUnit}
          </p>
          <span className="text-[11px] text-slate-500">
            Margin: {(digitalTwin.contributionMarginRatio * 100).toFixed(0)}%
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Surplus</span>
          <p className={`text-xl font-black ${digitalTwin.monthlySurplus >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'}`}>
            ₹{digitalTwin.monthlySurplus.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-500">
            Operating EBITDA
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Break-Even Units</span>
          <p className="text-xl font-black text-blue-700 dark:text-blue-400">
            {digitalTwin.breakEvenUnits === Infinity ? 'Unattainable' : `${digitalTwin.breakEvenUnits} units`}
          </p>
          <span className="text-[11px] text-slate-500">
            ₹{digitalTwin.breakEvenRevenue === Infinity ? 'N/A' : digitalTwin.breakEvenRevenue.toLocaleString('en-IN')}/mo
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Margin of Safety</span>
          <p className="text-xl font-black text-indigo-700 dark:text-indigo-400">
            {digitalTwin.marginOfSafetyPercentage}%
          </p>
          <span className="text-[11px] text-slate-500">
            {digitalTwin.marginOfSafetyUnits} units buffer
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Working Capital</span>
          <p className="text-xl font-black text-teal-700 dark:text-teal-400">
            ₹{digitalTwin.workingCapitalRequirement.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-500">
            {simulationInputs.paymentDelayDays}d receivables lag
          </span>
        </div>
      </div>

      {/* Main Interactive Controls & P&L Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Interactive Controls */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Simulation Input Controls
            </h3>
            <span className="text-xs text-slate-500">Deterministic recalculation</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Monthly Units Slider */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Monthly Production Volume:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {simulationInputs.monthlyProductionUnits} units
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="2500"
                step="50"
                value={simulationInputs.monthlyProductionUnits}
                onChange={(e) => handleInputChange('monthlyProductionUnits', Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Selling Price Slider */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Selling Price per Unit:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ₹{simulationInputs.sellingPricePerUnit}
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="120"
                step="2"
                value={simulationInputs.sellingPricePerUnit}
                onChange={(e) => handleInputChange('sellingPricePerUnit', Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Raw Material Cost */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Raw Material Cost / Unit:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ₹{simulationInputs.variableCostsPerUnit.rawMaterials}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="1"
                value={simulationInputs.variableCostsPerUnit.rawMaterials}
                onChange={(e) => handleInputChange('rawMaterials', Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Rent */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Monthly Rent (Home shed baseline):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ₹{simulationInputs.fixedCosts.rent}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="500"
                value={simulationInputs.fixedCosts.rent}
                onChange={(e) => handleInputChange('rent', Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Payment Delay */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Receivables Payment Lag:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {simulationInputs.paymentDelayDays} days
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={simulationInputs.paymentDelayDays}
                onChange={(e) => handleInputChange('paymentDelayDays', Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Cost & Margin Waterfall */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Unit Economics Waterfall
            </h3>
            <EvidenceBadge type="SIMULATED" size="sm" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-slate-800 font-bold">
              <span>Gross Selling Price</span>
              <span className="font-mono text-emerald-700 dark:text-emerald-400">
                ₹{simulationInputs.sellingPricePerUnit}.00
              </span>
            </div>

            <div className="pl-3 border-l-2 border-slate-200 dark:border-slate-700 space-y-1.5 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>- Raw Materials (Grain, cleaning)</span>
                <span className="font-mono">₹{simulationInputs.variableCostsPerUnit.rawMaterials}.00</span>
              </div>
              <div className="flex justify-between">
                <span>- Direct Labour</span>
                <span className="font-mono">₹{simulationInputs.variableCostsPerUnit.directLabour}.00</span>
              </div>
              <div className="flex justify-between">
                <span>- 3-Layer Pouch Packaging</span>
                <span className="font-mono">₹{simulationInputs.variableCostsPerUnit.packaging}.00</span>
              </div>
              <div className="flex justify-between">
                <span>- Two-Wheeler Fuel & Transport</span>
                <span className="font-mono">₹{simulationInputs.variableCostsPerUnit.transportDelivery}.00</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/40 font-bold text-emerald-900 dark:text-emerald-200">
              <span>Unit Contribution Margin</span>
              <span className="font-mono text-base">₹{digitalTwin.contributionMarginPerUnit}.00</span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Total Monthly Variable Costs</span>
                <span className="font-mono font-bold">₹{digitalTwin.monthlyVariableCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Total Monthly Fixed Overheads</span>
                <span className="font-mono font-bold">₹{digitalTwin.monthlyFixedCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Net Monthly Operating Surplus</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400">
                  ₹{digitalTwin.monthlySurplus.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 12-Month Projections Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              12-Month Cash Flow & Seasonality Projections
            </h3>
            <p className="text-xs text-slate-500">
              Factoring in winter harvest surges, summer beverage demand, and payment conversion lags.
            </p>
          </div>
          <EvidenceBadge type="SIMULATED" size="sm" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-[10px] font-extrabold uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="py-2.5 px-3">Month</th>
                <th className="py-2.5 px-3">Units Sold</th>
                <th className="py-2.5 px-3">Gross Revenue</th>
                <th className="py-2.5 px-3">Variable Costs</th>
                <th className="py-2.5 px-3">Fixed Costs</th>
                <th className="py-2.5 px-3">Net Cash Flow</th>
                <th className="py-2.5 px-3">Cumulative Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {digitalTwin.monthlyProjections.map((p) => (
                <tr key={p.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2 px-3 font-sans font-bold">M{p.month}</td>
                  <td className="py-2 px-3">{p.unitsSold}</td>
                  <td className="py-2 px-3">₹{p.grossRevenue.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3">₹{p.totalVariableCost.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3">₹{p.totalFixedCost.toLocaleString('en-IN')}</td>
                  <td className={`py-2 px-3 font-bold ${p.operatingSurplus >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'}`}>
                    ₹{p.operatingSurplus.toLocaleString('en-IN')}
                  </td>
                  <td className={`py-2 px-3 font-bold ${p.cumulativeCashBalance >= 0 ? 'text-slate-800 dark:text-slate-200' : 'text-rose-600'}`}>
                    ₹{p.cumulativeCashBalance.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
