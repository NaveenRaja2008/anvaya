'use client';

import React from 'react';
import {
  Rocket,
  CheckCircle2,
  Calendar,
  HelpCircle,
  FileText,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';
import { AnvayaAppState } from '@/storage/state-store';
import { EvidenceBadge } from '../evidence/EvidenceBadge';
import { generateStructuredActionPlan } from '@/domain/decision-engine';

interface ActViewProps {
  state: AnvayaAppState;
  onOpenReport: () => void;
  onOpenTransparency: () => void;
}

export const ActView: React.FC<ActViewProps> = ({
  state,
  onOpenReport,
  onOpenTransparency
}) => {
  const { finalDecision, debtCapacity, selectedOpportunityId, opportunities } = state;
  const selectedOpp = opportunities.find(o => o.id === selectedOpportunityId) || opportunities[0];

  const actionPlan = generateStructuredActionPlan(
    selectedOpp.title,
    debtCapacity.modelledSustainableLoan,
    25000
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Stage 6: Final Decision & Execution Plan
            </h1>
            <EvidenceBadge type="SIMULATED" />
            <EvidenceBadge type="INFERRED" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Synthesized intelligence, 7/30/90-day execution milestones, and quantitative "What Would Change My Mind" criteria.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-800"
          >
            <FileText className="h-4 w-4" />
            <span>Generate Executive Report</span>
          </button>
        </div>
      </div>

      {/* Hero Decision Banner */}
      <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-xs dark:border-emerald-900/60 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                STATE: {finalDecision.state.replace(/_/g, ' ')}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                NON-GUARANTEED DECISION SUPPORT
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {finalDecision.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {finalDecision.whySummary}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shrink-0 text-left md:text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Recommended Loan Cap</span>
            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
              ₹{debtCapacity.modelledSustainableLoan.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-slate-500 block">
              Max Eligible: ₹{debtCapacity.maximumEligibleLoan.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* 3 Decision Pillars */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-slate-100 pt-4 dark:border-slate-800 text-xs">
          <div className="space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Evidence Backing
            </span>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400 pl-5 list-disc">
              {finalDecision.evidenceBacking.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-blue-600" /> Simulation Backing
            </span>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400 pl-5 list-disc">
              {finalDecision.simulationBacking.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-600" /> Failure Autopsy Warning
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-snug">
              {finalDecision.failureConditionWarning}
            </p>
            <p className="text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
              <strong>Immediate Next Step:</strong> {finalDecision.immediateNextAction}
            </p>
          </div>
        </div>
      </div>

      {/* What-Changes-My-Mind Engine */}
      <div className="rounded-xl border border-indigo-200 bg-white p-6 shadow-xs dark:border-indigo-900/60 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                "What Would Change This Recommendation?"
              </h3>
              <p className="text-xs text-slate-500">
                Transparent quantitative guardrails that eliminate black-box recommendations.
              </p>
            </div>
          </div>
          <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
            FALSIFIABILITY ENGINE
          </span>
        </div>

        <div className="space-y-3 text-xs">
          {finalDecision.whatWouldChangeMind.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-slate-200 p-3.5 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40"
            >
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-slate-400 font-medium">Current Assumption: </span>
                  <strong className="text-slate-800 dark:text-slate-200">{item.currentConstraint}</strong>
                </div>
                <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-800 dark:bg-rose-950 dark:text-rose-300 self-start sm:self-auto">
                  SHOCK TRIGGER
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <span className="text-rose-700 dark:text-rose-400 font-semibold">If this happens: </span>
                  <span className="text-slate-700 dark:text-slate-300">{item.triggerCondition}</span>
                </div>
                <div>
                  <span className="text-indigo-700 dark:text-indigo-400 font-semibold">Recommendation changes to: </span>
                  <strong className="text-slate-900 dark:text-white">{item.newRecommendation}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7 / 30 / 90 Day Structured Action Plan */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              7 / 30 / 90-Day Execution Roadmap
            </h3>
          </div>
          <span className="text-xs text-slate-500">Phased risk mitigation before full scale</span>
        </div>

        <div className="space-y-4">
          {actionPlan.map((milestone, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-slate-200 p-4 dark:border-slate-800 text-xs"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-emerald-800 px-2 py-0.5 text-[10px] font-extrabold text-white">
                    {milestone.dayWindow.replace('_', ' ')}
                  </span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {milestone.title}
                  </span>
                </div>
                <span className="font-mono text-slate-500">
                  Estimated Outlay: ₹{milestone.estimatedCost.toLocaleString('en-IN')}
                </span>
              </div>

              <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc pl-5 my-2">
                {milestone.tasks.map((task, tidx) => (
                  <li key={tidx}>{task}</li>
                ))}
              </ul>

              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-slate-500">
                <span>
                  <strong className="text-emerald-700 dark:text-emerald-400">Target Outcome:</strong> {milestone.targetOutcome}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
