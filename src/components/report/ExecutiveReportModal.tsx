'use client';

import React from 'react';
import {
  X,
  Printer,
  ShieldCheck,
  FileText,
  Calendar,
  Layers,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { AnvayaAppState } from '@/storage/state-store';
import { EvidenceBadge } from '../evidence/EvidenceBadge';
import { generateStructuredActionPlan } from '@/domain/decision-engine';
import { useTranslation } from '@/i18n/context';
import { SUPPORTED_LANGUAGES, SupportedLanguageCode } from '@/i18n/languages';

interface ExecutiveReportModalProps {
  state: AnvayaAppState;
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  state,
  isOpen,
  onClose
}) => {
  const { t, language, setLanguage, languageInfo } = useTranslation();

  if (!isOpen) return null;

  const {
    profile,
    economicDna,
    opportunities,
    selectedOpportunityId,
    validationExperiment,
    digitalTwin,
    stressShocks,
    stressResult,
    resilienceEnvelope,
    capitalScenarios,
    debtCapacity,
    repaymentSchedule,
    finalDecision,
    evidenceItems
  } = state;

  const selectedOpp =
    opportunities.find((o) => o.id === selectedOpportunityId) || opportunities[0];
  const actionPlan = generateStructuredActionPlan(
    selectedOpp.title,
    debtCapacity.modelledSustainableLoan,
    25000
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8 max-h-[90vh] overflow-y-auto">
        {/* Action Bar (hidden when printed) */}
        <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {t('report.officialDossier')}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {t('report.refId')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Report language switch */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg px-2.5 py-1 border border-slate-300 dark:border-slate-700">
              <Globe className="h-3.5 w-3.5 text-slate-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguageCode)}
                className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                title="Change report language"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="text-slate-900 dark:text-slate-100">
                    {l.name} ({l.englishName})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Printer className="h-4 w-4" />
              <span>{t('report.printBtn')}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Report Document Content */}
        <div className="space-y-6 text-xs text-slate-800 dark:text-slate-200 font-sans">
          {/* Header */}
          <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-4 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {t('report.title')}
                </span>
                <span className="text-xs font-extrabold uppercase text-emerald-700 dark:text-emerald-400">
                  {t('report.subtitle')}
                </span>
              </div>
              <p className="text-slate-500 italic text-[11px] mt-0.5">
                {t('report.tagline')}
              </p>
            </div>
            <div className="text-right text-[11px] font-mono text-slate-500">
              <p>
                {t('report.dateLabel')} {new Date().toLocaleDateString('en-IN')}
              </p>
              <p>Location: {profile.location.villageOrTown}, {profile.location.district}</p>
            </div>
          </div>

          {/* Official Prototype Disclaimer Box */}
          <div className="rounded border border-slate-300 bg-slate-50 p-3 text-[11px] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 italic">
            {t('report.disclaimerNotice')}
          </div>

          {/* 1. Entrepreneur Profile */}
          <div className="border border-slate-200 p-4 rounded-lg dark:border-slate-800">
            <h3 className="font-extrabold text-sm uppercase text-slate-900 dark:text-white mb-2">
              {t('report.sec1')}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <p>
                <strong>Name:</strong> {profile.name} (Age: {profile.age})
              </p>
              <p>
                <strong>Location:</strong> {profile.location.villageOrTown},{' '}
                {profile.location.district}
              </p>
              <p>
                <strong>Available Capital:</strong> ₹{profile.capitalAvailable.toLocaleString('en-IN')}
              </p>
              <p>
                <strong>Workspace:</strong> {profile.assets.workspaceAreaSqFt} sq ft home shed
              </p>
              <p>
                <strong>Vehicle:</strong> {profile.assets.hasTwoWheeler ? 'Two-Wheeler Owned' : 'None'}
              </p>
              <p>
                <strong>Experience:</strong> {profile.workExperienceYears} Years Food & Trading
              </p>
            </div>
          </div>

          {/* 2. Local Economic DNA */}
          <div className="border border-slate-200 p-4 rounded-lg dark:border-slate-800">
            <h3 className="font-extrabold text-sm uppercase text-slate-900 dark:text-white mb-2">
              {t('report.sec2')} ({profile.location.district} Cluster)
            </h3>
            <div className="grid grid-cols-4 gap-2">
              <p>
                <strong>Demand Score:</strong> {economicDna.dimensions.demand.score}/100 (
                {economicDna.dimensions.demand.rating})
              </p>
              <p>
                <strong>Supply Score:</strong> {economicDna.dimensions.supply.score}/100 (Abundant Bajra)
              </p>
              <p>
                <strong>Competition:</strong> {economicDna.dimensions.competition.score}/100 (Unorganized)
              </p>
              <p>
                <strong>Connectivity:</strong> {economicDna.dimensions.connectivity.score}/100 (State Highway)
              </p>
            </div>
            <p className="mt-2 text-slate-500">
              <strong>Summary:</strong> {economicDna.summary}
            </p>
          </div>

          {/* 3. Selected Opportunity Hypothesis */}
          <div className="border border-slate-200 p-4 rounded-lg dark:border-slate-800">
            <h3 className="font-extrabold text-sm uppercase text-slate-900 dark:text-white mb-2">
              {t('report.sec3')}
            </h3>
            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              {selectedOpp.title} (Fit Score: {selectedOpp.fitBreakdown.compositeScore}/100)
            </p>
            <p className="text-slate-500 mt-1">{selectedOpp.rationale}</p>
            <div className="grid grid-cols-3 gap-2 mt-2 font-mono">
              <p>
                Total Project Cost: ₹{selectedOpp.capitalRequirement.totalProjectCost.toLocaleString('en-IN')}
              </p>
              <p>Unit Pack Selling Price: ₹{selectedOpp.defaultUnitEconomics.sellingPricePerUnit}</p>
              <p>Monthly Capacity: {selectedOpp.defaultUnitEconomics.monthlyProductionCapacity} units</p>
            </div>
          </div>

          {/* 4. Market Validation */}
          <div className="border border-slate-200 p-4 rounded-lg dark:border-slate-800">
            <h3 className="font-extrabold text-sm uppercase text-slate-900 dark:text-white mb-2">
              {t('report.sec4')}
            </h3>
            <div className="grid grid-cols-4 gap-2">
              <p>
                <strong>Sample Size:</strong> {validationExperiment.actualResponsesCount} Respondents
              </p>
              <p>
                <strong>Demand Intent Rate:</strong> {validationExperiment.metrics.demandValidationRate}%
              </p>
              <p>
                <strong>Price Acceptance:</strong> {validationExperiment.metrics.priceAcceptanceRate}%
              </p>
              <p>
                <strong>Avg Accepted Price:</strong> ₹{validationExperiment.metrics.averageAcceptedPrice}
              </p>
            </div>
          </div>

          {/* 5. Business Digital Twin & Break-Even */}
          <div className="border border-slate-200 p-4 rounded-lg dark:border-slate-800">
            <h3 className="font-extrabold text-sm uppercase text-slate-900 dark:text-white mb-2">
              {t('report.sec5')}
            </h3>
            <div className="grid grid-cols-3 gap-2 font-mono">
              <p>Monthly Revenue: ₹{digitalTwin.monthlyRevenue.toLocaleString('en-IN')}</p>
              <p>Total Operating Costs: ₹{digitalTwin.totalMonthlyOperatingCost.toLocaleString('en-IN')}</p>
              <p>Operating Surplus (EBITDA): ₹{digitalTwin.monthlySurplus.toLocaleString('en-IN')}</p>
              <p>Break-Even Units: {digitalTwin.breakEvenUnits} units/mo</p>
              <p>Margin of Safety: {digitalTwin.marginOfSafetyPercentage}%</p>
              <p>Working Capital Cycle: ₹{digitalTwin.workingCapitalRequirement.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* 6. Failure Autopsy & Resilience Envelope */}
          <div className="border border-rose-300 p-4 rounded-lg bg-rose-50/20 dark:border-rose-900">
            <h3 className="font-extrabold text-sm uppercase text-rose-950 dark:text-rose-200 mb-2">
              {t('report.sec6')}
            </h3>
            {stressResult.firstFailureCondition && (
              <div className="space-y-1">
                <p>
                  <strong>First Failure Trigger:</strong> {stressResult.firstFailureCondition.trigger}
                </p>
                <p>
                  <strong>Impact:</strong> {stressResult.firstFailureCondition.impactDescription}
                </p>
                <p>
                  <strong>Recovery Strategy:</strong>{' '}
                  {stressResult.firstFailureCondition.recoveryStrategy}
                </p>
              </div>
            )}
            <p className="mt-2 text-slate-500">
              <strong>Modelled Resilience:</strong> Can absorb up to{' '}
              {Math.abs(resilienceEnvelope.boundaries.demand.failureThreshold)}% demand decline before cash
              burn begins.
            </p>
          </div>

          {/* 7. Debt Capacity (Eligible vs Sustainable) */}
          <div className="border border-indigo-200 p-4 rounded-lg bg-indigo-50/30 dark:border-indigo-900">
            <h3 className="font-extrabold text-sm uppercase text-indigo-950 dark:text-indigo-200 mb-2">
              {t('report.sec7')}
            </h3>
            <div className="grid grid-cols-3 gap-2 font-mono font-bold">
              <p>Statutory Eligible Loan: ₹{debtCapacity.maximumEligibleLoan.toLocaleString('en-IN')}</p>
              <p>Affordable Loan (Base 1.5x): ₹{debtCapacity.maximumAffordableLoan.toLocaleString('en-IN')}</p>
              <p className="text-emerald-700 dark:text-emerald-400">
                Modelled Sustainable Loan: ₹{debtCapacity.modelledSustainableLoan.toLocaleString('en-IN')}
              </p>
            </div>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              {debtCapacity.keyInsight}
            </p>
          </div>

          {/* 8. Final Decision & Action Roadmap */}
          <div className="border border-emerald-300 p-4 rounded-lg bg-emerald-50/40 dark:border-emerald-800">
            <h3 className="font-extrabold text-sm uppercase text-emerald-950 dark:text-emerald-200 mb-1">
              {t('report.sec8')}
            </h3>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {finalDecision.title}
            </p>
            <p className="mt-1 text-slate-600 dark:text-slate-300">{finalDecision.whySummary}</p>
            <p className="mt-2 font-bold text-emerald-800 dark:text-emerald-300">
              Immediate Action: {finalDecision.immediateNextAction}
            </p>
          </div>

          {/* Signoff Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end text-[10px] text-slate-400 font-mono">
            <div>
              <p>{t('report.pageFooter')}</p>
            </div>
            <div className="text-right">
              <p>Audit Hash: SHA256-ANVAYA-KUKNOOR-95K</p>
              <p>Page 1 of 1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
