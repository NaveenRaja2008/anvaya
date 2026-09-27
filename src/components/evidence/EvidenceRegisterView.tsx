'use client';

import React, { useState } from 'react';
import {
  FileCheck2,
  Filter,
  CheckCircle,
  HelpCircle,
  Calendar,
  Layers,
  Search
} from 'lucide-react';
import { EvidenceItem, EvidenceType } from '@/types/domain';
import { EvidenceBadge } from './EvidenceBadge';
import { useTranslation } from '@/i18n/context';

interface EvidenceRegisterViewProps {
  items: EvidenceItem[];
}

export const EvidenceRegisterView: React.FC<EvidenceRegisterViewProps> = ({ items }) => {
  const { t, getEvidenceLabel } = useTranslation();
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const evidenceTypes: { id: string; label: string }[] = [
    { id: 'ALL', label: t('evidence.allTypes') },
    { id: 'OBSERVED', label: getEvidenceLabel('OBSERVED') },
    { id: 'VALIDATED', label: getEvidenceLabel('VALIDATED') },
    { id: 'USER_PROVIDED', label: getEvidenceLabel('USER_PROVIDED') },
    { id: 'INFERRED', label: getEvidenceLabel('INFERRED') },
    { id: 'SIMULATED', label: getEvidenceLabel('SIMULATED') },
    { id: 'DEMO_DATA', label: getEvidenceLabel('DEMO_DATA') }
  ];

  const filteredItems = items.filter((item) => {
    const matchesType = selectedType === 'ALL' || item.evidenceType === selectedType;
    const matchesQuery =
      searchQuery === '' ||
      item.claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.origin.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <FileCheck2 className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {t('evidence.title')}
          </h1>
          <EvidenceBadge type="OBSERVED" size="sm" />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {t('evidence.subtitle')}
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap gap-1.5">
          {evidenceTypes.map((et) => (
            <button
              key={et.id}
              onClick={() => setSelectedType(et.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                selectedType === et.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {et.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('evidence.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-emerald-600 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Table of Evidence Claims */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">{t('evidence.claimAssertion')}</th>
                <th className="px-4 py-3">{t('evidence.evidenceType')}</th>
                <th className="px-4 py-3">{t('evidence.sourceProvenance')}</th>
                <th className="px-4 py-3">{t('evidence.confidence')}</th>
                <th className="px-4 py-3">{t('evidence.category')}</th>
                <th className="px-4 py-3">{t('evidence.underlyingAssumptions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3.5 max-w-xs font-medium text-slate-900 dark:text-white">
                    {item.claim}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <EvidenceBadge
                      type={item.evidenceType}
                      confidence={item.confidence}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                    <span className="font-semibold block">{item.source}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.origin}</span>
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {item.confidence}%
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 max-w-sm">
                    {item.assumptions && item.assumptions.length > 0 ? (
                      <ul className="list-disc pl-3 space-y-0.5 text-[11px]">
                        {item.assumptions.map((asm, aidx) => (
                          <li key={aidx}>{asm}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-slate-400 italic">None declared</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
