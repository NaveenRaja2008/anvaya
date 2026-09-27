'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  QrCode,
  Share2,
  PlusCircle,
  HelpCircle,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Users,
  DollarSign
} from 'lucide-react';
import { AnvayaAppState } from '@/storage/state-store';
import { EvidenceBadge } from '../evidence/EvidenceBadge';

interface ProveViewProps {
  state: AnvayaAppState;
  onAddResponse: (response: any) => Promise<void>;
  onProceedToSimulate: () => void;
}

export const ProveView: React.FC<ProveViewProps> = ({
  state,
  onAddResponse,
  onProceedToSimulate
}) => {
  const { validationExperiment, validationResponses, selectedOpportunityId, opportunities } = state;
  const selectedOpp = opportunities.find(o => o.id === selectedOpportunityId) || opportunities[0];

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    respondentIdentifier: '',
    respondentType: 'CONSUMER',
    isInterested: true,
    purchaseIntent: 'DEFINITE',
    acceptedPricePerUnit: selectedOpp.defaultUnitEconomics.sellingPricePerUnit,
    expectedMonthlyQuantity: 2,
    currentAlternative: 'Loose uncleaned grain from mandi',
    switchingFactor: 'Pouch packaging and cleanliness',
    preferredPurchaseChannel: 'Local village Kirana',
    feedbackNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAddResponse({
        opportunityId: selectedOpp.id,
        respondentIdentifier: formData.respondentIdentifier || `RESP-MANUAL-${Date.now()}`,
        respondentType: formData.respondentType,
        isInterested: formData.isInterested,
        purchaseIntent: formData.purchaseIntent,
        acceptedPricePerUnit: Number(formData.acceptedPricePerUnit),
        expectedMonthlyQuantity: Number(formData.expectedMonthlyQuantity),
        currentAlternative: formData.currentAlternative,
        switchingFactor: formData.switchingFactor,
        preferredPurchaseChannel: formData.preferredPurchaseChannel,
        feedbackNotes: formData.feedbackNotes
      });
      setShowAddModal(false);
      setFormData({
        respondentIdentifier: '',
        respondentType: 'CONSUMER',
        isInterested: true,
        purchaseIntent: 'DEFINITE',
        acceptedPricePerUnit: selectedOpp.defaultUnitEconomics.sellingPricePerUnit,
        expectedMonthlyQuantity: 2,
        currentAlternative: '',
        switchingFactor: '',
        preferredPurchaseChannel: '',
        feedbackNotes: ''
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Stage 2: Prove Before You Borrow
            </h1>
            <EvidenceBadge type="VALIDATED" />
            <EvidenceBadge type="DEMO_DATA" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Micro-market customer and merchant demand validation for{' '}
            <strong className="text-slate-800 dark:text-slate-200">{selectedOpp.title}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <PlusCircle className="h-4 w-4 text-emerald-600" />
            <span>Add Manual Survey Response</span>
          </button>
          <button
            onClick={onProceedToSimulate}
            className="rounded-lg bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800"
          >
            Proceed to Digital Twin →
          </button>
        </div>
      </div>

      {/* Prominent Demo Sample Disclaimer Banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900 shadow-xs dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200">
        <div className="flex items-start gap-2.5">
          <HelpCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-extrabold uppercase tracking-wider text-[11px] text-blue-800 dark:text-blue-300">
              MICRO-VALIDATION DEMO SAMPLE (N = {validationExperiment.actualResponsesCount})
            </p>
            <p>
              This is an empirical micro-market validation sample collected across village Kiranas, households, and canteens. It establishes indicative demand intent and price elasticity, but does not imply broad statistical significance.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demand Validation</span>
          <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
            {validationExperiment.metrics.demandValidationRate}%
          </p>
          <span className="text-[11px] text-slate-500">
            {validationExperiment.metrics.interestedCount} / {validationExperiment.metrics.totalSample} Interested
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Purchase Intent</span>
          <p className="text-2xl font-black text-blue-700 dark:text-blue-400">
            {validationExperiment.metrics.purchaseIntentScore}%
          </p>
          <span className="text-[11px] text-slate-500">Weighted intent score</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price Acceptance</span>
          <p className="text-2xl font-black text-indigo-700 dark:text-indigo-400">
            {validationExperiment.metrics.priceAcceptanceRate}%
          </p>
          <span className="text-[11px] text-slate-500">Accept ₹{selectedOpp.defaultUnitEconomics.sellingPricePerUnit} price</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Accepted Price</span>
          <p className="text-2xl font-black text-teal-700 dark:text-teal-400">
            ₹{validationExperiment.metrics.averageAcceptedPrice}
          </p>
          <span className="text-[11px] text-slate-500">Target benchmark: ₹{selectedOpp.defaultUnitEconomics.sellingPricePerUnit}</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Evidence Strength</span>
          <div className="mt-1">
            <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-sm font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {validationExperiment.evidenceStrength}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Directly strengthens fit score</span>
        </div>
      </div>

      {/* Survey Channels */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* QR Survey Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 mb-3">
            <div className="rounded-md bg-slate-100 p-1.5 dark:bg-slate-800">
              <QrCode className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">QR-Code Field Survey</h3>
              <p className="text-[11px] text-slate-500">Printable counter standee for shops</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 p-4 dark:border-slate-800">
            <div className="h-28 w-28 bg-slate-900 text-white flex items-center justify-center rounded-md font-mono text-[10px] text-center p-2">
              [ANVAYA QR: /v/{selectedOpp.id}]
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-mono">anvaya.gov.in/v/{selectedOpp.id}</p>
          </div>
        </div>

        {/* WhatsApp Interaction Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 mb-3">
            <div className="rounded-md bg-emerald-100 p-1.5 dark:bg-emerald-950">
              <Share2 className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">WhatsApp Micro-Survey</h3>
              <p className="text-[11px] text-slate-500">Conversational 3-question survey</p>
            </div>
          </div>
          <div className="rounded-lg bg-emerald-50/50 p-3 text-xs text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-200 space-y-2 font-sans border border-emerald-100 dark:border-emerald-900">
            <p className="font-semibold">"Namaskara! Ramesh Kumar here from Kuknoor village."</p>
            <p>1. Would you buy cleaned, packaged 500g millet flour?</p>
            <p>2. Would ₹60/pack be acceptable?</p>
            <p>3. How many packs do you need each month?</p>
          </div>
        </div>

        {/* What Would Change It Box */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs dark:border-amber-900/60 dark:bg-amber-950/30">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-4 w-4 text-amber-700 dark:text-amber-400" />
            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">How Validation Affects Borrowing</h3>
          </div>
          <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
            If demand validation falls below <strong>50%</strong> or repeat potential drops below <strong>40%</strong>, ANVAYA locks downstream borrowing and flags <strong>'VALIDATE MORE BEFORE COMMITTING CAPITAL'</strong>.
          </p>
          <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-900/60 text-xs font-semibold text-amber-800 dark:text-amber-300">
            Current Status: High Intent ({validationExperiment.metrics.demandValidationRate}%) — Safe to Proceed.
          </div>
        </div>
      </div>

      {/* Field Responses Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Field Validation Responses ({validationResponses.length} Records)
            </h3>
            <p className="text-xs text-slate-500">Detailed qualitative notes and willingness-to-pay</p>
          </div>
          <EvidenceBadge type="VALIDATED" size="sm" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-extrabold uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="py-2.5 px-3">Respondent</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Interest</th>
                <th className="py-2.5 px-3">Purchase Intent</th>
                <th className="py-2.5 px-3">Accepted Price</th>
                <th className="py-2.5 px-3">Monthly Qty</th>
                <th className="py-2.5 px-3">Switching Factor & Qualitative Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {validationResponses.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                    {r.respondentId}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium dark:bg-slate-800">
                      {r.respondentType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {r.isInterested ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                      </span>
                    ) : (
                      <span className="font-bold text-slate-400">No</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-medium">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        r.purchaseIntent === 'DEFINITE'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : r.purchaseIntent === 'PROBABLE'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {r.purchaseIntent}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    ₹{r.acceptedPricePerUnit}
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    {r.expectedMonthlyQuantity} units
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 max-w-xs">
                    <p className="font-medium text-slate-800 dark:text-slate-200">{r.switchingFactor}</p>
                    {r.feedbackNotes && (
                      <p className="text-[11px] text-slate-500 italic mt-0.5">"{r.feedbackNotes}"</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Survey Response Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Add New Micro-Market Response
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter real field interaction feedback to update validation scores downstream.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold block mb-1">Respondent Name / Shop Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Tea Stall or Household Name"
                  value={formData.respondentIdentifier}
                  onChange={(e) => setFormData({ ...formData, respondentIdentifier: e.target.value })}
                  className="w-full rounded-md border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Respondent Type</label>
                  <select
                    value={formData.respondentType}
                    onChange={(e) => setFormData({ ...formData, respondentType: e.target.value as any })}
                    className="w-full rounded-md border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="CONSUMER">Village Household</option>
                    <option value="RETAILER">Kirana Retailer</option>
                    <option value="WHOLESALER">Mandi Wholesaler</option>
                    <option value="INSTITUTION">Canteen / Casterer</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Purchase Intent</label>
                  <select
                    value={formData.purchaseIntent}
                    onChange={(e) => setFormData({ ...formData, purchaseIntent: e.target.value as any })}
                    className="w-full rounded-md border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="DEFINITE">Definite (100%)</option>
                    <option value="PROBABLE">Probable (75%)</option>
                    <option value="MAYBE">Maybe (40%)</option>
                    <option value="UNLIKELY">Unlikely (0%)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Accepted Price (₹/pack)</label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={formData.acceptedPricePerUnit}
                    onChange={(e) => setFormData({ ...formData, acceptedPricePerUnit: Number(e.target.value) })}
                    className="w-full rounded-md border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Expected Monthly Quantity</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={formData.expectedMonthlyQuantity}
                    onChange={(e) => setFormData({ ...formData, expectedMonthlyQuantity: Number(e.target.value) })}
                    className="w-full rounded-md border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Reason for Switching / Key Need</label>
                <input
                  type="text"
                  placeholder="e.g. Convenience, hygienic packaging, fresh grinding"
                  value={formData.switchingFactor}
                  onChange={(e) => setFormData({ ...formData, switchingFactor: e.target.value })}
                  className="w-full rounded-md border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Qualitative Feedback Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Demanded smaller 250g trial sachet or 10-day payment credit"
                  value={formData.feedbackNotes}
                  onChange={(e) => setFormData({ ...formData, feedbackNotes: e.target.value })}
                  className="w-full rounded-md border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Add Response & Recalculate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
