'use client';

import React from 'react';
import {
  Compass,
  CheckCircle2,
  Cpu,
  Flame,
  Scale,
  Rocket,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Banknote,
  Wrench
} from 'lucide-react';
import { AnvayaAppState } from '@/storage/state-store';
import { EvidenceBadge } from '../evidence/EvidenceBadge';
import { StageId } from '../navigation/JourneyStepper';
import { useTranslation } from '@/i18n/context';

interface OverviewDashboardProps {
  state: AnvayaAppState;
  onNavigate: (stage: StageId) => void;
  onOpenOnboarding: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  state,
  onNavigate,
  onOpenOnboarding
}) => {
  const { t, getDomainTerm } = useTranslation();
  const {
    profile,
    opportunities,
    selectedOpportunityId,
    digitalTwin,
    stressResult,
    debtCapacity,
    finalDecision
  } = state;
  const selectedOpp =
    opportunities.find((o) => o.id === selectedOpportunityId) || opportunities[0];

  const journeyCards: {
    stage: StageId;
    stepNumber: string;
    title: string;
    subtitle: string;
    metric: string;
    metricLabel: string;
    status: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }[] = [
    {
      stage: 'DISCOVER',
      stepNumber: 'STAGE 01',
      title: t('nav.discover'),
      subtitle: 'Reverse Business Discovery from Person + Place DNA',
      metric: `${selectedOpp.fitBreakdown.compositeScore}/100`,
      metricLabel: t('overview.fitScore'),
      status: `${opportunities.length} Hypotheses Screened`,
      icon: Compass,
      accentColor: 'border-l-emerald-600'
    },
    {
      stage: 'PROVE',
      stepNumber: 'STAGE 02',
      title: t('nav.prove'),
      subtitle: 'Micro-Market Customer & Retailer Validation',
      metric: `${state.validationExperiment.metrics.demandValidationRate}%`,
      metricLabel: t('prove.purchaseIntent'),
      status: `${state.validationResponses.length} Field Respondents`,
      icon: CheckCircle2,
      accentColor: 'border-l-blue-600'
    },
    {
      stage: 'SIMULATE',
      stepNumber: 'STAGE 03',
      title: t('nav.simulate'),
      subtitle: 'Deterministic Digital Twin & Unit Economics',
      metric: `₹${digitalTwin.monthlySurplus.toLocaleString('en-IN')}`,
      metricLabel: t('simulate.monthlySurplus'),
      status: `Break-even: ${digitalTwin.breakEvenUnits} units/mo`,
      icon: Cpu,
      accentColor: 'border-l-teal-600'
    },
    {
      stage: 'BREAK',
      stepNumber: 'STAGE 04',
      title: t('nav.break'),
      subtitle: 'Stress Testing & Failure Autopsy (Hero Feature)',
      metric: stressResult.isBusinessBroken ? 'Broken' : 'Viable',
      metricLabel: 'Under Stress',
      status: stressResult.firstFailureCondition
        ? 'Failure Point Identified'
        : 'Resilient',
      icon: Flame,
      accentColor: 'border-l-rose-600'
    },
    {
      stage: 'STRUCTURE',
      stepNumber: 'STAGE 05',
      title: t('nav.structure'),
      subtitle: 'Capital Sandbox & Scheme Routing',
      metric: `₹${debtCapacity.modelledSustainableLoan.toLocaleString('en-IN')}`,
      metricLabel: getDomainTerm('debtCapacity') || 'Sustainable Loan',
      status: `Eligible: ₹${debtCapacity.maximumEligibleLoan.toLocaleString('en-IN')}`,
      icon: Scale,
      accentColor: 'border-l-amber-600'
    },
    {
      stage: 'ACT',
      stepNumber: 'STAGE 06',
      title: t('nav.act'),
      subtitle: 'Final Decision & 7/30/90 Day Milestones',
      metric: finalDecision.state.replace(/_/g, ' '),
      metricLabel: 'Decision State',
      status: 'Action Plan Ready',
      icon: Rocket,
      accentColor: 'border-l-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Core Proposition */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {t('overview.badge')}
              </span>
              <EvidenceBadge type="SIMULATED" />
              <EvidenceBadge type="DEMO_DATA" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {t('overview.title')}
            </h1>
            <p className="max-w-3xl text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('overview.heroDesc')}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:shrink-0">
            <button
              onClick={() => onNavigate('BREAK')}
              className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-rose-700 transition-colors"
            >
              <Flame className="h-4 w-4" />
              <span>{t('overview.breakTheBusinessBtn')}</span>
            </button>
            <button
              onClick={() => onNavigate('DISCOVER')}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <span>{t('overview.exploreBtn')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Core Principle Callout */}
        <div className="mt-5 grid grid-cols-1 gap-3 rounded-lg border border-emerald-100 bg-emerald-50/70 p-3.5 sm:grid-cols-3 dark:border-emerald-900/60 dark:bg-emerald-950/30">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-emerald-900 dark:text-emerald-200">
                {t('overview.empiricalTitle')}{' '}
              </span>
              <p className="text-emerald-700 dark:text-emerald-400">
                {t('overview.empiricalDesc')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Flame className="h-5 w-5 text-rose-700 dark:text-rose-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                {t('overview.failureTitle')}{' '}
              </span>
              <p className="text-slate-600 dark:text-slate-300">
                {t('overview.failureDesc')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Scale className="h-5 w-5 text-indigo-700 dark:text-indigo-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                {t('overview.eligibleTitle')}{' '}
              </span>
              <p className="text-slate-600 dark:text-slate-300">
                {t('overview.eligibleDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Entrepreneur & Opportunity Profile Banner */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Entrepreneur Profile Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {profile.name}
                </h3>
                <EvidenceBadge type="USER_PROVIDED" size="sm" />
              </div>
              <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {profile.location.villageOrTown}, {profile.location.district} District,{' '}
                {profile.location.state}
              </p>
            </div>
            <button
              onClick={onOpenOnboarding}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {t('overview.editProfile')}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 text-xs">
            <div>
              <span className="text-[11px] text-slate-500 block">
                {t('overview.availableCapital')}
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                ₹{profile.capitalAvailable.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">
                {t('overview.homeWorkspace')}
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {profile.assets.workspaceAreaSqFt} sq ft shed
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">
                {t('overview.mobility')}
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {profile.assets.hasTwoWheeler ? 'Two-Wheeler' : 'None'}
              </span>
            </div>
          </div>
        </div>

        {/* Selected Opportunity Overview Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-emerald-800 dark:text-emerald-300 uppercase">
                {t('overview.topOpportunity')}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {selectedOpp.title}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-800 dark:text-emerald-300 font-mono">
                {selectedOpp.fitBreakdown.compositeScore}
              </span>
              <span className="text-xs text-slate-400">/100 {t('overview.fitScore')}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">{t('overview.projectCost')}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                ₹{selectedOpp.capitalRequirement.totalProjectCost.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">{t('overview.unitPackPrice')}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                ₹{selectedOpp.defaultUnitEconomics.sellingPricePerUnit}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">{t('overview.saturationRisk')}</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Low (OSI: 0.35)
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-[11px] text-slate-500">
              {opportunities.length} Total Hypotheses Screened
            </span>
            <button
              onClick={() => onNavigate('DISCOVER')}
              className="font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
            >
              {t('overview.compareHypotheses')}
            </button>
          </div>
        </div>
      </div>

      {/* 6-Stage Journey Pipeline Progression Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            {t('overview.pipelineTitle')}
          </h2>
          <span className="text-xs text-slate-500">
            {t('overview.pipelineSubtitle')}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {journeyCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.stage}
                onClick={() => onNavigate(card.stage)}
                className={`group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4.5 text-left shadow-xs transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 border-l-4 ${card.accentColor}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400">
                      {card.stepNumber}
                    </span>
                    <Icon className="h-4 w-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {card.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {card.metricLabel}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                      {card.metric}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
