'use client';

import React from 'react';
import {
  Compass,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Layers,
  Sparkles,
  BarChart3,
  Scale,
  Users
} from 'lucide-react';
import { AnvayaAppState } from '@/storage/state-store';
import { EvidenceBadge } from '../evidence/EvidenceBadge';
import { OpportunityHypothesis } from '@/types/domain';

interface DiscoverViewProps {
  state: AnvayaAppState;
  onSelectOpportunity: (id: string) => void;
  onOpenOnboarding: () => void;
  onProceedToProve: () => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  state,
  onSelectOpportunity,
  onOpenOnboarding,
  onProceedToProve
}) => {
  const { profile, economicDna, opportunities, selectedOpportunityId, saturation } = state;
  const selectedOpp = opportunities.find(o => o.id === selectedOpportunityId) || opportunities[0];

  const dimensionsList = [
    { key: 'demand', label: 'DEMAND', dim: economicDna.dimensions.demand, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50' },
    { key: 'competition', label: 'COMPETITION', dim: economicDna.dimensions.competition, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50' },
    { key: 'supply', label: 'SUPPLY', dim: economicDna.dimensions.supply, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' },
    { key: 'purchasingPower', label: 'PURCHASING POWER', dim: economicDna.dimensions.purchasingPower, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50' },
    { key: 'connectivity', label: 'CONNECTIVITY', dim: economicDna.dimensions.connectivity, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/50' },
    { key: 'seasonality', label: 'SEASONALITY', dim: economicDna.dimensions.seasonality, color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/50' },
    { key: 'localResources', label: 'LOCAL RESOURCES', dim: economicDna.dimensions.localResources, color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/50' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Stage 1: Reverse Business Discovery
            </h1>
            <EvidenceBadge type="DEMO_DATA" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Matching <strong className="text-slate-800 dark:text-slate-200">{profile.name}</strong>’s assets & capital with the economic DNA of <strong className="text-slate-800 dark:text-slate-200">{economicDna.villageOrTown}, {economicDna.district}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenOnboarding}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Adjust Entrepreneur Profile
          </button>
          <button
            onClick={onProceedToProve}
            className="rounded-lg bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800"
          >
            Proceed to Prove Demand →
          </button>
        </div>
      </div>

      {/* Section 1: Local Economic DNA (7 Dimensions) */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Local Economic DNA: {economicDna.villageOrTown}, {economicDna.district}
            </h2>
            <EvidenceBadge type="OBSERVED" size="sm" />
            <EvidenceBadge type="DEMO_DATA" size="sm" />
          </div>
          <span className="text-xs text-slate-500 font-medium">7 Core Dimensions</span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 mb-5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
          <strong>Summary:</strong> {economicDna.summary}
        </p>

        {/* 7 Dimensions Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {dimensionsList.map((item) => (
            <div
              key={item.key}
              className="rounded-lg border border-slate-200 p-3.5 dark:border-slate-800 dark:bg-slate-800/40"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-md ${item.color}`}>
                  {item.label}
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {item.dim.score}/100
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden dark:bg-slate-700 mb-2">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${item.dim.score}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                {item.dim.description}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <EvidenceBadge type={item.dim.evidenceType} size="sm" />
                <span className="text-[10px] text-slate-400 font-mono">{item.dim.rating}</span>
              </div>
            </div>
          ))}

          {/* Local Supply Gaps Box */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3.5 dark:border-emerald-900/60 dark:bg-emerald-950/30">
            <span className="text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
              LOCAL SUPPLY GAPS
            </span>
            <ul className="mt-2 space-y-1 text-xs text-emerald-900 dark:text-emerald-200">
              {economicDna.localSupplyGaps.map((gap, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Section 2: Opportunity Hypotheses (Radar & Personalization) */}
      <div>
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Opportunity Hypotheses & Explainable Fit
            </h2>
            <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-extrabold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              OPPORTUNITY HYPOTHESIS — NOT GUARANTEED
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Every score breaks down into: Capital Fit + Asset Fit + Skill Fit + Demand Signal + Competition Signal + Risk Compatibility.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {opportunities.map((opp) => {
            const isSelected = opp.id === selectedOpportunityId;
            return (
              <div
                key={opp.id}
                className={`rounded-xl border p-5 shadow-xs transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/20 ring-2 ring-emerald-600/30 dark:border-emerald-500 dark:bg-emerald-950/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {opp.category.replace(/_/g, ' ')}
                      </span>
                      <EvidenceBadge type="INFERRED" size="sm" />
                      {isSelected && (
                        <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-extrabold text-white">
                          ACTIVE SELECTION
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{opp.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{opp.tagline}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                      {opp.fitBreakdown.compositeScore}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">FIT SCORE</span>
                  </div>
                </div>

                {/* Explainable Fit Component Breakdown */}
                <div className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-2">
                    Explainable Fit Radar:
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded bg-white p-1.5 shadow-xs dark:bg-slate-700">
                      <span className="text-[10px] text-slate-400 block font-medium">Capital Fit</span>
                      <strong className="text-slate-800 dark:text-slate-200">{opp.fitBreakdown.capitalFit}%</strong>
                    </div>
                    <div className="rounded bg-white p-1.5 shadow-xs dark:bg-slate-700">
                      <span className="text-[10px] text-slate-400 block font-medium">Skill Fit</span>
                      <strong className="text-slate-800 dark:text-slate-200">{opp.fitBreakdown.skillFit}%</strong>
                    </div>
                    <div className="rounded bg-white p-1.5 shadow-xs dark:bg-slate-700">
                      <span className="text-[10px] text-slate-400 block font-medium">Asset Fit</span>
                      <strong className="text-slate-800 dark:text-slate-200">{opp.fitBreakdown.assetFit}%</strong>
                    </div>
                    <div className="rounded bg-white p-1.5 shadow-xs dark:bg-slate-700">
                      <span className="text-[10px] text-slate-400 block font-medium">Demand Signal</span>
                      <strong className="text-slate-800 dark:text-slate-200">{opp.fitBreakdown.demandSignal}%</strong>
                    </div>
                    <div className="rounded bg-white p-1.5 shadow-xs dark:bg-slate-700">
                      <span className="text-[10px] text-slate-400 block font-medium">Competition</span>
                      <strong className="text-slate-800 dark:text-slate-200">{opp.fitBreakdown.competitionSignal}%</strong>
                    </div>
                    <div className="rounded bg-white p-1.5 shadow-xs dark:bg-slate-700">
                      <span className="text-[10px] text-slate-400 block font-medium">Risk Compat</span>
                      <strong className="text-slate-800 dark:text-slate-200">{opp.fitBreakdown.riskCompatibility}%</strong>
                    </div>
                  </div>
                </div>

                {/* Capital & Financial summary */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs border-t border-slate-100 pt-3 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400">Total Project Cost:</span>
                    <p className="font-extrabold text-slate-900 dark:text-white">
                      ₹{opp.capitalRequirement.totalProjectCost.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Unit Pack Price:</span>
                    <p className="font-extrabold text-slate-900 dark:text-white">
                      ₹{opp.defaultUnitEconomics.sellingPricePerUnit}
                    </p>
                  </div>
                </div>

                {/* Why fits person & location */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <p>
                    <strong className="text-emerald-700 dark:text-emerald-400">Why fits person:</strong>{' '}
                    {opp.whyFitsPerson[0]}
                  </p>
                  <p>
                    <strong className="text-blue-700 dark:text-blue-400">Why fits location:</strong>{' '}
                    {opp.whyFitsLocation[0]}
                  </p>
                </div>

                {/* Key Risks */}
                <div className="mt-3 flex items-start gap-1.5 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/30 p-2 rounded">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span><strong>Key Risk:</strong> {opp.keyRisks[0]}</span>
                </div>

                {/* Selection Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Saturation: <strong className="text-slate-700 dark:text-slate-300">{opp.saturationRisk}</strong>
                  </span>
                  {isSelected ? (
                    <button
                      disabled
                      className="rounded-lg bg-emerald-800 px-3 py-1.5 text-xs font-bold text-white opacity-90 cursor-default"
                    >
                      ✓ Selected for Simulation
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectOpportunity(opp.id)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      Select This Hypothesis
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Opportunity Saturation Intelligence */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Opportunity Saturation Intelligence (OSI)
            </h2>
            <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              Ecosystem Safety Model
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
            Status: {saturation.status.replace(/_/g, ' ')}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
          ANVAYA models local demand capacity to protect village entrepreneurs from entering oversupplied micro-markets and sparking destructive price wars.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 border-t border-b border-slate-100 py-3 dark:border-slate-800">
          <div>
            <span className="text-[11px] text-slate-400">Estimated Local Demand</span>
            <p className="text-base font-black text-slate-900 dark:text-white">
              {saturation.estimatedLocalDemandUnits.toLocaleString('en-IN')} units/mo
            </p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">Existing Category Supply</span>
            <p className="text-base font-black text-slate-900 dark:text-white">
              {saturation.estimatedExistingSupplyUnits.toLocaleString('en-IN')} units/mo
            </p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">Proposed New Capacity</span>
            <p className="text-base font-black text-slate-900 dark:text-white">
              +{saturation.proposedAdditionalCapacityUnits.toLocaleString('en-IN')} units/mo
            </p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">Post-Entry Saturation Ratio</span>
            <p className="text-base font-black text-indigo-700 dark:text-indigo-400">
              {(saturation.postEntrySaturationRatio * 100).toFixed(0)}%
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-slate-50 p-3.5 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
          <p><strong>Saturation Analysis:</strong> {saturation.riskExplanation}</p>
          {saturation.alternativeNiches.length > 0 && (
            <div className="mt-2">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Recommended Differentiated Niches:</span>
              <ul className="mt-1 list-disc pl-4 space-y-0.5">
                {saturation.alternativeNiches.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
