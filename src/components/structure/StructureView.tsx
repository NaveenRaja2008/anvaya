'use client';

import React from 'react';
import {
  Scale,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Calendar,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { AnvayaAppState } from '@/storage/state-store';
import { EvidenceBadge } from '../evidence/EvidenceBadge';

interface StructureViewProps {
  state: AnvayaAppState;
  onProceedToAct: () => void;
}

export const StructureView: React.FC<StructureViewProps> = ({
  state,
  onProceedToAct
}) => {
  const { capitalScenarios, debtCapacity, repaymentSchedule, digitalTwin } = state;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Stage 5: Structure the Debt
            </h1>
            <EvidenceBadge type="SIMULATED" />
            <EvidenceBadge type="INFERRED" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Capital Sandbox, Scheme Router, Debt Capacity Engine, and Repayment Amortization Schedule.
          </p>
        </div>

        <button
          onClick={onProceedToAct}
          className="rounded-lg bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 self-start sm:self-auto"
        >
          Proceed to Final Decision & Action Plan →
        </button>
      </div>

      {/* Hero Insight Callout: ELIGIBLE ≠ AFFORDABLE ≠ SUSTAINABLE */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-6 shadow-xs dark:border-indigo-900/60 dark:bg-indigo-950/30">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-200 px-2.5 py-0.5 text-[10px] font-black uppercase text-indigo-900 dark:bg-indigo-900 dark:text-indigo-200">
                Core ANVAYA Insight
              </span>
              <span className="text-lg font-black tracking-tight text-indigo-950 dark:text-indigo-100">
                ELIGIBLE ≠ AFFORDABLE ≠ SUSTAINABLE
              </span>
            </div>
            <p className="text-xs text-indigo-900/80 dark:text-indigo-200/80 max-w-2xl leading-relaxed">
              {debtCapacity.keyInsight}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 shrink-0 text-center">
            <div className="rounded-lg bg-white p-3 shadow-xs dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">1. Eligible</span>
              <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                ₹{debtCapacity.maximumEligibleLoan.toLocaleString('en-IN')}
              </p>
              <span className="text-[9px] text-slate-400">Scheme Cap (90%)</span>
            </div>

            <div className="rounded-lg bg-white p-3 shadow-xs dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">2. Affordable</span>
              <p className="text-sm sm:text-base font-black text-blue-700 dark:text-blue-400">
                ₹{debtCapacity.maximumAffordableLoan.toLocaleString('en-IN')}
              </p>
              <span className="text-[9px] text-slate-400">Base DSCR 1.5x</span>
            </div>

            <div className="rounded-lg bg-white p-3 shadow-xs dark:bg-slate-800 border-2 border-emerald-600 dark:border-emerald-500">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block uppercase">
                3. Sustainable
              </span>
              <p className="text-sm sm:text-base font-black text-emerald-800 dark:text-emerald-300">
                ₹{debtCapacity.modelledSustainableLoan.toLocaleString('en-IN')}
              </p>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">Safe Under Shock</span>
            </div>
          </div>
        </div>
      </div>

      {/* Capital Sandbox: 4 Scenarios Comparison */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Capital Sandbox: Co-Financing Architecture
            </h2>
            <p className="text-xs text-slate-500">Comparing 4 funding paths to prevent over-borrowing</p>
          </div>
          <EvidenceBadge type="SIMULATED" size="sm" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {capitalScenarios.map((sc) => {
            const isRecommended = sc.id === 'SCENARIO_D' || sc.id === 'SCENARIO_B';
            return (
              <div
                key={sc.id}
                className={`rounded-xl border p-4 shadow-xs flex flex-col justify-between ${
                  sc.id === 'SCENARIO_D'
                    ? 'border-emerald-600 bg-emerald-50/20 ring-2 ring-emerald-600/30 dark:border-emerald-500 dark:bg-emerald-950/20'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {sc.id.replace('_', ' ')}
                    </span>
                    {sc.id === 'SCENARIO_D' && (
                      <span className="rounded bg-emerald-700 px-2 py-0.5 text-[9px] font-black text-white">
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{sc.name}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{sc.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Project Cost:</span>
                    <span className="font-mono font-bold">₹{sc.projectCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Own Savings:</span>
                    <span className="font-mono font-bold">₹{sc.ownContribution.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Loan Borrowed:</span>
                    <span className="font-mono font-bold text-indigo-700 dark:text-indigo-400">
                      ₹{sc.loanAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monthly EMI:</span>
                    <span className="font-mono font-bold">
                      {sc.monthlyRepayment > 0 ? `₹${sc.monthlyRepayment.toLocaleString('en-IN')}` : '₹0'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Base DSCR:</span>
                    <span className="font-mono font-extrabold text-slate-900 dark:text-white">
                      {sc.baseCaseDscr === 999 ? '∞' : `${sc.baseCaseDscr}x`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Stress DSCR:</span>
                    <span className={`font-mono font-extrabold ${sc.stressCaseDscr >= 1.25 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'}`}>
                      {sc.stressCaseDscr === 999 ? '∞' : `${sc.stressCaseDscr}x`}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2">
                  <span
                    className={`block text-center rounded py-1 text-[10px] font-extrabold ${
                      sc.affordabilityStatus === 'HIGHLY_AFFORDABLE'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : sc.affordabilityStatus === 'BORDERLINE'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {sc.affordabilityStatus.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheme Router & Repayment Schedule */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Scheme Router Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Statutory Scheme Router (SIH Rules)
            </h3>
            <EvidenceBadge type="INFERRED" size="sm" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Selected Scheme</span>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                {repaymentSchedule.schemeName}
              </p>
            </div>

            <div className="space-y-1.5 border-t border-slate-100 pt-2 dark:border-slate-800 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Beneficiary Interest Rate:</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {(repaymentSchedule.interestRateAnnual * 100).toFixed(1)}% p.a.
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Loan Tenure:</span>
                <span className="font-mono font-bold">{repaymentSchedule.tenureMonths} Months (3 Years)</span>
              </div>
              <div className="flex justify-between">
                <span>Initial Moratorium Buffer:</span>
                <span className="font-mono font-bold text-indigo-700 dark:text-indigo-400">
                  {repaymentSchedule.moratoriumMonths} Months (Principal paused)
                </span>
              </div>
              <div className="flex justify-between">
                <span>Active Amortization Months:</span>
                <span className="font-mono font-bold">
                  {repaymentSchedule.tenureMonths - repaymentSchedule.moratoriumMonths} Months
                </span>
              </div>
              <div className="flex justify-between">
                <span>Quarterly Equivalent Debt Service:</span>
                <span className="font-mono font-bold">
                  ₹{repaymentSchedule.quarterlyEmi.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Repayment Illustration Summary */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Repayment Engine Illustration
              </h3>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">
                ILLUSTRATIVE REPAYMENT MODEL
              </span>
            </div>
            <EvidenceBadge type="SIMULATED" size="sm" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs mb-4">
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold uppercase">Monthly EMI</span>
              <p className="text-xl font-black text-emerald-900 dark:text-emerald-200 font-mono">
                ₹{repaymentSchedule.monthlyEmiDuringRepayment.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400">Post 3-month moratorium</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Total Interest Over Term</span>
              <p className="text-xl font-black text-slate-900 dark:text-white font-mono">
                ₹{repaymentSchedule.totalInterestPaid.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-slate-400">Total payable: ₹{repaymentSchedule.totalAmountPayable.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* First 6 Months Amortization Preview */}
          <div className="overflow-x-auto text-[11px] font-mono">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 dark:bg-slate-800">
                <tr>
                  <th className="py-1.5 px-2">Month</th>
                  <th className="py-1.5 px-2">Phase</th>
                  <th className="py-1.5 px-2">Principal</th>
                  <th className="py-1.5 px-2">Interest</th>
                  <th className="py-1.5 px-2">Total EMI</th>
                  <th className="py-1.5 px-2">Closing Bal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {repaymentSchedule.installments.slice(0, 6).map((inst) => (
                  <tr key={inst.month}>
                    <td className="py-1.5 px-2 font-sans font-bold">M{inst.month}</td>
                    <td className="py-1.5 px-2">
                      <span className={`px-1 py-0.5 rounded text-[9px] font-bold ${
                        inst.isMoratorium
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {inst.isMoratorium ? 'Moratorium' : 'Amortizing'}
                      </span>
                    </td>
                    <td className="py-1.5 px-2">₹{inst.principalPayment.toLocaleString('en-IN')}</td>
                    <td className="py-1.5 px-2">₹{inst.interestPayment.toLocaleString('en-IN')}</td>
                    <td className="py-1.5 px-2 font-bold">₹{inst.totalEmi.toLocaleString('en-IN')}</td>
                    <td className="py-1.5 px-2">₹{inst.closingPrincipal.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
