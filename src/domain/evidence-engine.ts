import { EvidenceItem, EvidenceType } from '../types/domain';

export class EvidenceRegistry {
  private items: Map<string, EvidenceItem> = new Map();

  constructor(initialItems: EvidenceItem[] = []) {
    initialItems.forEach(item => this.register(item));
  }

  register(item: EvidenceItem): void {
    this.items.set(item.id, item);
  }

  getAll(): EvidenceItem[] {
    return Array.from(this.items.values());
  }

  getById(id: string): EvidenceItem | undefined {
    return this.items.get(id);
  }

  filterByType(type: EvidenceType): EvidenceItem[] {
    return this.getAll().filter(item => item.evidenceType === type);
  }

  filterByCategory(category: EvidenceItem['category']): EvidenceItem[] {
    return this.getAll().filter(item => item.category === category);
  }

  getMetricsSummary() {
    const all = this.getAll();
    const total = all.length;
    const byType: Record<EvidenceType, number> = {
      OBSERVED: 0,
      INFERRED: 0,
      VALIDATED: 0,
      SIMULATED: 0,
      USER_PROVIDED: 0,
      DEMO_DATA: 0
    };

    all.forEach(item => {
      byType[item.evidenceType] = (byType[item.evidenceType] || 0) + 1;
    });

    const avgConfidence = total > 0
      ? Math.round(all.reduce((acc, it) => acc + it.confidence, 0) / total)
      : 0;

    return {
      total,
      byType,
      avgConfidence
    };
  }
}

export function createEvidenceBadgeMetadata(type: EvidenceType): {
  label: string;
  badgeClass: string;
  dotClass: string;
  description: string;
} {
  switch (type) {
    case 'OBSERVED':
      return {
        label: 'OBSERVED',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
        dotClass: 'bg-emerald-500',
        description: 'Direct empirical measurement from verified public or field data source.'
      };
    case 'VALIDATED':
      return {
        label: 'VALIDATED',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
        dotClass: 'bg-blue-500',
        description: 'Empirically tested via micro-market customer validation survey.'
      };
    case 'USER_PROVIDED':
      return {
        label: 'USER PROVIDED',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
        dotClass: 'bg-indigo-500',
        description: 'Directly declared by the entrepreneur during adaptive onboarding.'
      };
    case 'INFERRED':
      return {
        label: 'INFERRED',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
        dotClass: 'bg-amber-500',
        description: 'Derived via domain intelligence models from surrounding market signals.'
      };
    case 'SIMULATED':
      return {
        label: 'SIMULATED',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
        dotClass: 'bg-purple-500',
        description: 'Computed deterministically using digital twin financial & stress equations.'
      };
    case 'DEMO_DATA':
    default:
      return {
        label: 'DEMO DATA',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        dotClass: 'bg-slate-500',
        description: 'Seeded demonstrative data for prototype workflow testing. Not live government stats.'
      };
  }
}
