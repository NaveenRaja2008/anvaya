'use client';

import React from 'react';
import {
  FileText,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { EvidenceBadge } from '../evidence/EvidenceBadge';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '../../i18n/context';

interface NavbarProps {
  onResetDemo: () => void;
  onOpenTransparency: () => void;
  onOpenReport: () => void;
  onToggleAssistant: () => void;
  isAssistantOpen: boolean;
  activeStage: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onResetDemo,
  onOpenTransparency,
  onOpenReport,
  onToggleAssistant,
  isAssistantOpen,
  activeStage
}) => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600/30">
            <ShieldCheck className="h-6 w-6 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {t('nav.brand')}
              </span>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                SIH 2026
              </span>
              <EvidenceBadge type="DEMO_DATA" size="sm" />
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {t('nav.brandSubtitle')} •{' '}
              <span className="text-emerald-700 dark:text-emerald-400 italic">
                "{t('nav.tagline')}"
              </span>
            </p>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Multilingual Selector (Highly visible dropdown) */}
          <LanguageSelector />

          {/* Quick Demo Reload button */}
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            title="Reload complete seeded Ramesh Kumar dataset"
          >
            <RotateCcw className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden sm:inline">{t('nav.launchDemo')}</span>
            <span className="sm:hidden">{t('nav.demo')}</span>
          </button>

          {/* Technical Transparency Drawer ("How ANVAYA Decided") */}
          <button
            onClick={onOpenTransparency}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 shadow-xs hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300"
            title="Inspect deterministic calculation logic & evidence inputs"
          >
            <HelpCircle className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden md:inline">{t('nav.howDecided')}</span>
            <span className="md:hidden">{t('nav.audit')}</span>
          </button>

          {/* Executive Report Download / View */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            title="View polished 16-section Executive Report"
          >
            <FileText className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
            <span className="hidden sm:inline">{t('nav.report')}</span>
          </button>

          {/* AI Copilot Drawer Toggle */}
          <button
            onClick={onToggleAssistant}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold shadow-xs transition-colors ${
              isAssistantOpen
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t('nav.copilot')}</span>
            <span className="sm:hidden">AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
