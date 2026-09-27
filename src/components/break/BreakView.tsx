'use client';

import React, { useState } from 'react';
import {
  Flame,
  AlertTriangle,
  TrendingDown,
  ShieldAlert,
  GitBranch,
  Activity,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Zap
} from 'lucide-react';
import { AnvayaAppState } from '@/storage/state-store';
import { EvidenceBadge } from '../evidence/EvidenceBadge';
import { StressShocks } from '@/types/finance-simulation';

interface BreakViewProps {
  state: AnvayaAppState;
  onApplyShocks: (shocks: Partial<StressShocks>) => Promise<void>;
  onProceedToStructure: () => void;
}

export const BreakView: React.FC<BreakViewProps> = ({
  state,
  onApplyShocks,
  onProceedToStructure
}) => {
  const { stressShocks, stressResult, resilienceEnvelope, digitalTwin, debtCapacity } = state;
  const baseCase = stressResult.baseCase;
  const stressCase = stressResult.stressCase;
  const failure = stressResult.firstFailureCondition;
  const failureTree = stressResult.failureTree;

  // Preset killer stress combos
  const handleKillerCombo = async () => {
    await onApplyShocks({
      demandChangePercent: -20,
      rawMaterialCostChangePercent: 15,
      sellingPriceChangePercent: -10,
      operatingFixedCostChangePercent: 10,
      paymentDelayAdditionalDays: 15
    });
  };

  const handleResetShocks = async () => {
    await onApplyShocks({
      demandChangePercent: 0,
      sellingPriceChangePercent: 0,
      rawMaterialCostChangePercent: 0,
      operatingFixedCostChangePercent: 0,
      paymentDelayAdditionalDays: 0,
      supplyDisruptionDays: 0,
      transportCostChangePercent: 0,
      equipmentDowntimeDays: 0
    });
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-6 shadow-xs dark:border-rose-900/60 dark:bg-rose-950/30">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-600 text-white shadow-xs">
                <Flame className="h-4 w-4" />
              </span>
              <h1 className="text-2xl font-black text-rose-950 dark:text-rose-100">
                BREAK THE BUSINESS
              </h1>
              <EvidenceBadge type="SIMULATED" size="sm" />
            </div>
            <p className="text-sm font-semibold italic text-rose-800 dark:text-rose-300">
              "Don't ask whether the business can survive. Try to find how it fails."
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleKillerCombo}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition-colors"
              title="Apply Demand -20%, RM +15%, Price -10%"
            >
              <Zap className="h-4 w-4" />
              <span>Killer Demo Shock Combo</span>
            </button>
            <button
              onClick={handleResetShocks}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear Shocks</span>
            </button>
            <button
              onClick={onProceedToStructure}
              className="rounded-lg bg-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-800"
            >
              Proceed to Debt Structure →
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Shock Controls */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Activate Sensitivity Shocks
          </h2>
          <span className="text-xs text-slate-500">Live recalculation of digital twin</span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 text-xs">
          {/* Demand Shock */}
          <div className="rounded-lg border border-slate-200 p-3.5 dark:border-slate-800">
            <div className="flex justify-between font-bold mb-1">
              <span>Demand Shock:</span>
              <span className={`font-mono ${stressShocks.demandChangePercent < 0 ? 'text-rose-600 font-extrabold' : ''}`}>
                {stressShocks.demandChangePercent}%
              </span>
            </div>
            <div className="flex gap-1.5 mt-2">
              {[-10, -20, -30].map((val) => (
                <button
                  key={val}
                  onClick={() => onApplyShocks({ demandChangePercent: val })}
                  className={`flex-1 py-1 rounded text-[11px] font-bold border ${
                    stressShocks.demandChangePercent === val
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>

          {/* Raw Material Cost Inflation */}
          <div className="rounded-lg border border-slate-200 p-3.5 dark:border-slate-800">
            <div className="flex justify-between font-bold mb-1">
              <span>Raw Material Cost Surge:</span>
              <span className={`font-mono ${stressShocks.rawMaterialCostChangePercent > 0 ? 'text-rose-600 font-extrabold' : ''}`}>
                +{stressShocks.rawMaterialCostChangePercent}%
              </span>
            </div>
            <div className="flex gap-1.5 mt-2">
              {[10, 15, 25].map((val) => (
                <button
                  key={val}
                  onClick={() => onApplyShocks({ rawMaterialCostChangePercent: val })}
                  className={`flex-1 py-1 rounded text-[11px] font-bold border ${
                    stressShocks.rawMaterialCostChangePercent === val
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                  }`}
                >
                  +{val}%
                </button>
              ))}
            </div>
          </div>

          {/* Selling Price Drop */}
          <div className="rounded-lg border border-slate-200 p-3.5 dark:border-slate-800">
            <div className="flex justify-between font-bold mb-1">
              <span>Price Erosion (Competition):</span>
              <span className={`font-mono ${stressShocks.sellingPriceChangePercent < 0 ? 'text-rose-600 font-extrabold' : ''}`}>
                {stressShocks.sellingPriceChangePercent}%
              </span>
            </div>
            <div className="flex gap-1.5 mt-2">
              {[-5, -10, -20].map((val) => (
                <button
                  key={val}
                  onClick={() => onApplyShocks({ sellingPriceChangePercent: val })}
                  className={`flex-1 py-1 rounded text-[11px] font-bold border ${
                    stressShocks.sellingPriceChangePercent === val
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>

          {/* Receivables Payment Delay */}
          <div className="rounded-lg border border-slate-200 p-3.5 dark:border-slate-800">
            <div className="flex justify-between font-bold mb-1">
              <span>Customer Payment Delay:</span>
              <span className={`font-mono ${stressShocks.paymentDelayAdditionalDays > 0 ? 'text-rose-600 font-extrabold' : ''}`}>
                +{stressShocks.paymentDelayAdditionalDays} days
              </span>
            </div>
            <div className="flex gap-1.5 mt-2">
              {[15, 30, 45].map((val) => (
                <button
                  key={val}
                  onClick={() => onApplyShocks({ paymentDelayAdditionalDays: val })}
                  className={`flex-1 py-1 rounded text-[11px] font-bold border ${
                    stressShocks.paymentDelayAdditionalDays === val
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                  }`}
                >
                  +{val}d
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side: Base Case vs Stress Case */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Financial Comparison: Base Case vs Stress Case
        </h2>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Base Case Column */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 dark:border-slate-700">
              <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                BASE CASE (Normal Conditions)
              </span>
              <EvidenceBadge type="SIMULATED" size="sm" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Monthly Production Volume:</span>
                <span className="font-mono font-bold">{baseCase.inputs.monthlyProductionUnits} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gross Monthly Revenue:</span>
                <span className="font-mono font-bold">₹{baseCase.monthlyRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Operating Costs (Var + Fixed):</span>
                <span className="font-mono font-bold">₹{baseCase.totalMonthlyOperatingCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-black text-sm pt-2 border-t border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400">
                <span>Monthly Surplus (EBITDA):</span>
                <span className="font-mono">₹{baseCase.monthlySurplus.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500 pt-1">
                <span>Break-Even Units:</span>
                <span className="font-mono font-bold">{baseCase.breakEvenUnits} units/mo</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Working Capital Tied Up:</span>
                <span className="font-mono font-bold">₹{baseCase.workingCapitalRequirement.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Stress Case Column */}
          <div className={`rounded-lg border p-4 ${
            stressCase.monthlySurplus <= 0
              ? 'border-rose-300 bg-rose-50/50 dark:border-rose-900/60 dark:bg-rose-950/40'
              : 'border-amber-200 bg-amber-50/30 dark:border-amber-900/60 dark:bg-amber-950/20'
          }`}>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 dark:border-slate-700">
              <span className="font-extrabold text-sm text-rose-950 dark:text-rose-200">
                STRESS CASE (Under Shocks)
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                stressCase.monthlySurplus <= 0 ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
              }`}>
                {stressCase.monthlySurplus <= 0 ? 'DEFICIT / CRACKED' : 'COMPRESSED BUFFER'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Stressed Production Volume:</span>
                <span className="font-mono font-bold">{stressCase.inputs.monthlyProductionUnits} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gross Monthly Revenue:</span>
                <span className="font-mono font-bold">₹{stressCase.monthlyRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Operating Costs:</span>
                <span className="font-mono font-bold">₹{stressCase.totalMonthlyOperatingCost.toLocaleString('en-IN')}</span>
              </div>
              <div className={`flex justify-between font-black text-sm pt-2 border-t border-slate-200 dark:border-slate-700 ${
                stressCase.monthlySurplus <= 0 ? 'text-rose-600' : 'text-amber-700 dark:text-amber-400'
              }`}>
                <span>Monthly Surplus (EBITDA):</span>
                <span className="font-mono">₹{stressCase.monthlySurplus.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500 pt-1">
                <span>Break-Even Units:</span>
                <span className="font-mono font-bold">{stressCase.breakEvenUnits} units/mo</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Working Capital Tied Up:</span>
                <span className="font-mono font-bold text-rose-700 dark:text-rose-400">
                  ₹{stressCase.workingCapitalRequirement.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* First Failure Condition (Failure Autopsy) */}
      <div className="rounded-xl border border-rose-300 bg-white p-6 shadow-xs dark:border-rose-900/80 dark:bg-slate-900">
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert className="h-5 w-5 text-rose-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            FAILURE AUTOPSY: First Failure Condition
          </h2>
          <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-extrabold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            DETERMINISTIC THRESHOLD
          </span>
        </div>

        {failure ? (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-950 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-200 font-medium">
              <strong className="block text-sm mb-1 text-rose-900 dark:text-rose-100">
                Trigger: {failure.trigger}
              </strong>
              <p>{failure.impactDescription}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Affected Metric</span>
                <strong className="text-slate-900 dark:text-white">{failure.affectedMetric}</strong>
              </div>
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Base Value</span>
                <strong className="text-slate-900 dark:text-white font-mono">₹{failure.baseValue.toLocaleString('en-IN')}</strong>
              </div>
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Stressed Value</span>
                <strong className="text-rose-600 font-mono">₹{failure.stressValue.toLocaleString('en-IN')}</strong>
              </div>
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Recovery Possibility</span>
                <strong className="text-amber-700 dark:text-amber-400">{failure.recoveryPossibility}</strong>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <strong className="text-emerald-700 dark:text-emerald-400">Recovery Strategy:</strong>{' '}
              {failure.recoveryStrategy}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-600 dark:text-slate-400">
            No critical failure conditions breached under current test parameters. Try applying stronger shocks above.
          </p>
        )}
      </div>

      {/* Failure Tree */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Failure Tree: Structural Vulnerability Pathways
            </h2>
          </div>
          <span className="text-xs text-slate-400">Earliest failure pathway highlighted</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-lg bg-slate-100 font-bold dark:bg-slate-800 flex items-center justify-between">
            <span>BUSINESS VIABILITY UNDER STRESS</span>
            <span className={failureTree.status === 'CRITICAL_FAILURE' ? 'text-rose-600' : 'text-emerald-600'}>
              {failureTree.thresholdText}
            </span>
          </div>

          <div className="pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-2.5">
            {failureTree.children?.map((node) => {
              const isBreached = node.status === 'CRITICAL_FAILURE';
              return (
                <div
                  key={node.id}
                  className={`p-3 rounded-lg border transition-all ${
                    node.isEarliestBreach
                      ? 'border-rose-400 bg-rose-50/70 ring-2 ring-rose-400/30 dark:border-rose-800 dark:bg-rose-950/30'
                      : isBreached
                      ? 'border-rose-200 bg-rose-50/30 dark:border-rose-900/40 dark:bg-rose-950/20'
                      : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white">{node.label}</span>
                      {node.isEarliestBreach && (
                        <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-black text-white uppercase">
                          EARLIEST BREACH PATHWAY
                        </span>
                      )}
                    </div>
                    <span className={`text-[11px] font-bold ${isBreached ? 'text-rose-600' : 'text-slate-500'}`}>
                      {node.thresholdText}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{node.impactText}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resilience Envelope */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Modelled Resilience Envelope
            </h2>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold dark:bg-slate-800">
              MODELLED RESILIENCE — NOT UNIVERSAL
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
            Rating: {resilienceEnvelope.resilienceRating.replace(/_/g, ' ')} ({resilienceEnvelope.overallResilienceScore}/100)
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
          {resilienceEnvelope.summary}
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
          {Object.entries(resilienceEnvelope.boundaries).slice(0, 3).map(([key, boundary]) => (
            <div key={key} className="rounded-lg border border-slate-200 p-3.5 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{boundary.parameter}</span>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Safe Zone:</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {boundary.safeZone.min}% to {boundary.safeZone.max}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Failure Threshold:</span>
                  <span className="font-mono font-bold text-rose-600">
                    {boundary.failureThreshold}%
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Current Shock:</span>
                  <span className="font-mono font-extrabold text-slate-900 dark:text-white">
                    {boundary.currentStressValue}% ({boundary.status})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
