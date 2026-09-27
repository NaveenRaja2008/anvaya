'use client';

import React from 'react';
import {
  X,
  Code2,
  CheckCircle,
  HelpCircle,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Binary,
  Scale
} from 'lucide-react';
import { AnvayaAppState } from '@/storage/state-store';
import { EvidenceBadge } from '../evidence/EvidenceBadge';

interface HowAnvayaDecidedDrawerProps {
  state: AnvayaAppState;
  isOpen: boolean;
  onClose: () => void;
}

export const HowAnvayaDecidedDrawer: React.FC<HowAnvayaDecidedDrawerProps> = ({
  state,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const { profile, economicDna, opportunities, selectedOpportunityId, digitalTwin, stressResult, debtCapacity, finalDecision } = state;
  const selectedOpp = opportunities.find(o => o.id === selectedOpportunityId) || opportunities[0];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs">
      <div className="h-full w-full max-w-2xl bg-white shadow-2xl overflow-y-auto dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 space-y-6">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-indigo-600" />
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                How ANVAYA Decided: Technical Audit
              </h2>
              <p className="text-xs text-slate-500">
                Full deterministic execution chain for technical review
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 6 Step Pipeline Visual Trace */}
        <div className="space-y-5 text-xs">
          {/* Step 1: Input Declarations */}
          <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold uppercase text-[10px] text-slate-500">
                Step 1: Input Vector & User Declarations
              </span>
              <EvidenceBadge type="USER_PROVIDED" size="sm" />
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              Profile: <strong>{profile.name}</strong>, Village: <strong>{profile.location.villageOrTown}</strong>, Capital: <strong>₹{profile.capitalAvailable.toLocaleString('en-IN')}</strong>, Workspace: <strong>{profile.assets.workspaceAreaSqFt} sq ft</strong>, Two-Wheeler: <strong>{profile.assets.hasTwoWheeler ? 'Yes' : 'No'}</strong>.
            </p>
          </div>

          {/* Step 2: Location DNA & APMC Sourcing Evidence */}
          <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold uppercase text-[10px] text-slate-500">
                Step 2: Empirical Economic DNA Evidence
              </span>
              <EvidenceBadge type="OBSERVED" size="sm" />
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              Koppal APMC benchmarked millet prices at ₹24/unit equivalent. Location supply score: <strong>86/100</strong>. Zero branded 500g pouches identified in Kuknoor village retail audit.
            </p>
          </div>

          {/* Step 3: Opportunity Fit Model Equations */}
          <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold uppercase text-[10px] text-slate-500">
                Step 3: Opportunity Fit Equation (Deterministic)
              </span>
              <EvidenceBadge type="INFERRED" size="sm" />
            </div>
            <div className="font-mono bg-white p-2.5 rounded border border-slate-200 dark:bg-slate-900 dark:border-slate-700 text-[11px] space-y-1">
              <p>FitScore = 0.20*(CapitalFit) + 0.20*(SkillFit) + 0.15*(Demand) + 0.15*(Location) + 0.10*(Asset) + 0.10*(Competition) + 0.10*(Risk)</p>
              <p className="text-emerald-700 dark:text-emerald-400 font-bold">
                Computed Score = 0.20*({selectedOpp.fitBreakdown.capitalFit}) + 0.20*({selectedOpp.fitBreakdown.skillFit}) + ... = {selectedOpp.fitBreakdown.compositeScore}/100
              </p>
            </div>
          </div>

          {/* Step 4: Digital Twin Break-Even Formulas */}
          <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold uppercase text-[10px] text-slate-500">
                Step 4: Digital Twin & Unit Economics Formulas
              </span>
              <EvidenceBadge type="SIMULATED" size="sm" />
            </div>
            <div className="font-mono bg-white p-2.5 rounded border border-slate-200 dark:bg-slate-900 dark:border-slate-700 text-[11px] space-y-1">
              <p>Unit Contribution Margin (CM) = Price (₹60) - Unit VC (₹34) = ₹26.00</p>
              <p>Break-Even Units = Fixed Costs (₹7,500) / CM (₹26) = {digitalTwin.breakEvenUnits} units/mo</p>
              <p>Margin of Safety = (1,000 - {digitalTwin.breakEvenUnits}) / 1,000 = {digitalTwin.marginOfSafetyPercentage}%</p>
            </div>
          </div>

          {/* Step 5: Stress Shock & Failure Autopsy Solution */}
          <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold uppercase text-[10px] text-slate-500">
                Step 5: Failure Condition Solving (Cash Burn Threshold)
              </span>
              <EvidenceBadge type="SIMULATED" size="sm" />
            </div>
            <div className="font-mono bg-white p-2.5 rounded border border-slate-200 dark:bg-slate-900 dark:border-slate-700 text-[11px] space-y-1">
              <p>Solving for Monthly Operating Surplus &lt;= ₹0:</p>
              <p className="text-rose-600 font-bold">
                First Failure Point: Monthly sales drop below {digitalTwin.breakEvenUnits} units (-{100 - Math.round((digitalTwin.breakEvenUnits / 1000) * 100)}% demand shock)
              </p>
            </div>
          </div>

          {/* Step 6: Debt Capacity & Sustainable Borrowing Ceiling */}
          <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold uppercase text-[10px] text-slate-500">
                Step 6: Eligible vs Sustainable Debt Formulation
              </span>
              <EvidenceBadge type="SIMULATED" size="sm" />
            </div>
            <div className="font-mono bg-white p-2.5 rounded border border-slate-200 dark:bg-slate-900 dark:border-slate-700 text-[11px] space-y-1">
              <p>Statutory Scheme Max: Project Cost (₹95k) * 90% = ₹{debtCapacity.maximumEligibleLoan.toLocaleString('en-IN')}</p>
              <p>Modelled Sustainable Loan: Solving for Stress DSCR &gt;= 1.25x = ₹{debtCapacity.modelledSustainableLoan.toLocaleString('en-IN')}</p>
              <p className="text-indigo-700 dark:text-indigo-400 font-bold">
                Deficit Gap Prevented = ₹{debtCapacity.eligibleVsSustainableGap.toLocaleString('en-IN')} (Overborrowing Avoided)
              </p>
            </div>
          </div>

          {/* Step 7: Final Synthesized Decision */}
          <div className="rounded-lg border border-emerald-300 p-4 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40">
            <span className="font-extrabold uppercase text-[10px] text-emerald-800 dark:text-emerald-300 block mb-1">
              Step 7: Final Decision Output
            </span>
            <p className="font-bold text-sm text-slate-900 dark:text-white">
              {finalDecision.title} (State: {finalDecision.state})
            </p>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              {finalDecision.debtImplications}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
