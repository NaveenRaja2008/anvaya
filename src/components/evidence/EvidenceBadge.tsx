'use client';

import React from 'react';
import { EvidenceType } from '@/types/domain';
import { createEvidenceBadgeMetadata } from '@/domain/evidence-engine';
import { useTranslation } from '@/i18n/context';

interface EvidenceBadgeProps {
  type: EvidenceType;
  confidence?: number;
  source?: string;
  size?: 'sm' | 'md' | 'lg';
  showConfidence?: boolean;
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({
  type,
  confidence,
  source,
  size = 'md',
  showConfidence = false
}) => {
  const meta = createEvidenceBadgeMetadata(type);
  const { getEvidenceLabel } = useTranslation();
  const localizedLabel = getEvidenceLabel(type);

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 font-medium tracking-wider',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide',
    lg: 'text-sm px-3 py-1.5 font-bold tracking-wide'
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs transition-all ${meta.badgeClass} ${sizeClasses}`}
      title={`${localizedLabel}: ${meta.description}${source ? ` (Source: ${source})` : ''}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
      <span>{localizedLabel}</span>
      {showConfidence && confidence !== undefined && (
        <span className="opacity-75 font-mono text-[10px] border-l border-current/30 pl-1">
          {confidence}%
        </span>
      )}
    </span>
  );
};
