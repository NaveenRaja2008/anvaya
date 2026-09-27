import { LoanScheme } from '../types/finance-simulation';

export const SCHEME_CONFIGS: Record<'MICRO_FINANCE' | 'TERM_LOAN', LoanScheme> = {
  MICRO_FINANCE: {
    id: 'MICRO_FINANCE',
    name: 'Micro Finance Scheme (Sub-₹1.4L Target)',
    minProjectCost: 10000,
    maxProjectCost: 140000,
    maxFundingPercent: 0.90, // 90%
    maxLoanAmount: 125000,
    annualInterestRate: 0.065, // 6.5% p.a.
    tenureMonths: 36, // 3 years
    moratoriumMonths: 3,
    applicableCategory: 'Micro-enterprises, rural livelihoods, artisan & food units'
  },
  TERM_LOAN: {
    id: 'TERM_LOAN',
    name: 'Term Loan Scheme (Enterprise Growth)',
    minProjectCost: 140001,
    maxProjectCost: 5000000, // ₹50 Lakhs
    maxFundingPercent: 0.90, // 90%
    maxLoanAmount: 4500000, // ₹45 Lakhs
    annualInterestRate: 0.08, // 8.0% p.a.
    tenureMonths: 84, // 7 years
    moratoriumMonths: 6,
    applicableCategory: 'Small enterprises, mechanized units, commercial scaling'
  }
};

export interface SchemeRoutingResult {
  recommendedScheme: LoanScheme | null;
  projectCost: number;
  promoterContributionMin: number;
  maximumEligibleLoan: number;
  actualProposedLoan: number;
  fundingPercentage: number;
  eligibilityStatus: 'ELIGIBLE' | 'EXCEEDS_MAX_LIMIT' | 'BELOW_MIN_LIMIT';
  rulesTriggered: string[];
}

export function routeLoanScheme(
  projectCost: number,
  requestedLoanAmount?: number
): SchemeRoutingResult {
  const rulesTriggered: string[] = [];

  if (projectCost <= 0) {
    throw new Error('Project cost must be greater than zero');
  }

  let selectedScheme: LoanScheme | null = null;
  let eligibilityStatus: 'ELIGIBLE' | 'EXCEEDS_MAX_LIMIT' | 'BELOW_MIN_LIMIT' = 'ELIGIBLE';

  if (projectCost <= SCHEME_CONFIGS.MICRO_FINANCE.maxProjectCost) {
    selectedScheme = SCHEME_CONFIGS.MICRO_FINANCE;
    rulesTriggered.push(`Project cost (₹${projectCost.toLocaleString('en-IN')}) <= ₹1,40,000 threshold -> Micro Finance Scheme selected.`);
    rulesTriggered.push(`Maximum funding capped at 90% of project cost or ₹1,25,000 (whichever is lower).`);
    rulesTriggered.push(`Beneficiary interest rate: 6.5% p.a. with 3-year tenure and 3-month moratorium.`);
  } else if (projectCost <= SCHEME_CONFIGS.TERM_LOAN.maxProjectCost) {
    selectedScheme = SCHEME_CONFIGS.TERM_LOAN;
    rulesTriggered.push(`Project cost (₹${projectCost.toLocaleString('en-IN')}) > ₹1,40,000 and <= ₹50,00,000 -> Term Loan Scheme selected.`);
    rulesTriggered.push(`Maximum funding capped at 90% of project cost or ₹45,00,000 (whichever is lower).`);
    rulesTriggered.push(`Interest rate: 8.0% p.a. with 7-year tenure and 6-month moratorium.`);
  } else {
    eligibilityStatus = 'EXCEEDS_MAX_LIMIT';
    rulesTriggered.push(`Project cost exceeds ₹50,00,000 maximum scheme cap.`);
  }

  if (!selectedScheme) {
    return {
      recommendedScheme: null,
      projectCost,
      promoterContributionMin: projectCost,
      maximumEligibleLoan: 0,
      actualProposedLoan: 0,
      fundingPercentage: 0,
      eligibilityStatus,
      rulesTriggered
    };
  }

  const statutoryMaxFunding = Math.round(projectCost * selectedScheme.maxFundingPercent);
  const maximumEligibleLoan = Math.min(statutoryMaxFunding, selectedScheme.maxLoanAmount);
  const promoterContributionMin = projectCost - maximumEligibleLoan;

  const actualProposedLoan = requestedLoanAmount !== undefined
    ? Math.min(requestedLoanAmount, maximumEligibleLoan)
    : maximumEligibleLoan;

  const fundingPercentage = projectCost > 0
    ? Math.round((actualProposedLoan / projectCost) * 1000) / 10
    : 0;

  return {
    recommendedScheme: selectedScheme,
    projectCost,
    promoterContributionMin,
    maximumEligibleLoan,
    actualProposedLoan,
    fundingPercentage,
    eligibilityStatus,
    rulesTriggered
  };
}
