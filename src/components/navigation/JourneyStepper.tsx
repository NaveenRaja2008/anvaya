'use client';

import React from 'react';
import {
  Compass,
  CheckCircle2,
  Cpu,
  Flame,
  Scale,
  Rocket,
  FileCheck2,
  LayoutDashboard
} from 'lucide-react';
import { useTranslation } from '../../i18n/context';

export type StageId =
  | 'OVERVIEW'
  | 'DISCOVER'
  | 'PROVE'
  | 'SIMULATE'
  | 'BREAK'
  | 'STRUCTURE'
  | 'ACT'
  | 'EVIDENCE';

interface JourneyStepperProps {
  activeStage: StageId;
  onSelectStage: (stage: StageId) => void;
  decisionState?: string;
  isBusinessBroken?: boolean;
}

export const JourneyStepper: React.FC<JourneyStepperProps> = ({
  activeStage,
  onSelectStage,
  decisionState,
  isBusinessBroken
}) => {
  const { t } = useTranslation();

  const stages: {
    id: StageId;
    label: string;
    sub: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'OVERVIEW',
      label: t('nav.overview'),
      sub: 'System Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'DISCOVER',
      label: t('nav.discover'),
      sub: 'Person + Place DNA',
      icon: Compass
    },
    {
      id: 'PROVE',
      label: t('nav.prove'),
      sub: 'Demand Evidence',
      icon: CheckCircle2
    },
    {
      id: 'SIMULATE',
      label: t('nav.simulate'),
      sub: 'Digital Twin',
      icon: Cpu
    },
    {
      id: 'BREAK',
      label: t('nav.break'),
      sub: 'Failure Autopsy',
      icon: Flame
    },
    {
      id: 'STRUCTURE',
      label: t('nav.structure'),
      sub: 'Debt Capacity',
      icon: Scale
    },
    {
      id: 'ACT',
      label: t('nav.act'),
      sub: 'Decision & Milestones',
      icon: Rocket
    },
    {
      id: 'EVIDENCE',
      label: t('nav.evidence'),
      sub: 'Claims & Provenance',
      icon: FileCheck2
    }
  ];

  return (
    <nav className="border-b border-slate-200 bg-slate-50/70 px-4 py-2 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {stages.map((st) => {
          const Icon = st.icon;
          const isActive = activeStage === st.id;
          const isHeroBreak = st.id === 'BREAK';

          return (
            <button
              key={st.id}
              onClick={() => onSelectStage(st.id)}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200 dark:bg-slate-800 dark:text-white dark:ring-slate-700'
                  : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                  isActive
                    ? isHeroBreak
                      ? 'bg-rose-600 text-white'
                      : 'bg-emerald-700 text-white'
                    : isHeroBreak
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    : 'bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-bold ${
                      isActive ? 'text-slate-900 dark:text-white' : ''
                    }`}
                  >
                    {st.label}
                  </span>
                  {st.id === 'BREAK' && isBusinessBroken && (
                    <span
                      className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"
                      title="Shocks Active"
                    />
                  )}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {st.sub}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
