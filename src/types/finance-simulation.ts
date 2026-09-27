import { EvidenceType } from './domain';

export interface ValidationQuestion {
  id: string;
  text: string;
  type: 'SINGLE_CHOICE' | 'NUMERIC' | 'TEXT';
  options?: string[];
}

export interface ValidationResponse {
  id: string;
  respondentId: string;
  respondentType: 'CONSUMER' | 'RETAILER' | 'WHOLESALER' | 'INSTITUTION';
  isInterested: boolean;
  purchaseIntent: 'UNLIKELY' | 'MAYBE' | 'PROBABLE' | 'DEFINITE';
  acceptedPricePerUnit: number;
  expectedMonthlyQuantity: number;
  currentAlternative: string;
  switchingFactor: string;
  preferredPurchaseChannel: string;
  feedbackNotes?: string;
  createdAt: string;
  isDemoData: boolean;
}

export interface ValidationExperiment {
  id: string;
  opportunityId: string;
  targetSampleSize: number;
  actualResponsesCount: number;
  channels: ('QR_CODE' | 'WHATSAPP' | 'DIRECT_INTERVIEW')[];
  metrics: {
    totalSample: number;
    interestedCount: number;
    demandValidationRate: number; // percentage (0 - 100)
    purchaseIntentScore: number; // percentage (0 - 100)
    priceAcceptanceRate: number; // percentage (0 - 100)
    repeatPotentialScore: number; // percentage (0 - 100)
    averageAcceptedPrice: number;
    medianAcceptedPrice: number;
  };
  evidenceStrength: 'WEAK' | 'MODERATE' | 'STRONG';
  isDemoSample: boolean;
  status: 'ACTIVE' | 'CONCLUDED';
}

export interface SimulationInputs {
  initialInvestment: number; // Machinery, setup, deposits
  sellingPricePerUnit: number;
  monthlyProductionUnits: number;
  fixedCosts: {
    rent: number;
    utilities: number;
    fixedSalaries: number;
    maintenance: number;
    marketingAndAdmin: number;
  };
  variableCostsPerUnit: {
    rawMaterials: number;
    directLabour: number;
    packaging: number;
    transportDelivery: number;
    otherConsumables: number;
  };
  workingCapitalCycleDays: number; // Raw material to cash conversion cycle
  paymentDelayDays: number; // Receivables delay from buyers
  seasonalityMonthlyFactors: number[]; // 12 multipliers, baseline 1.0
  growthRateAnnualPercent: number;
}

export interface MonthlyFinancialSnapshot {
  month: number;
  unitsSold: number;
  grossRevenue: number;
  totalVariableCost: number;
  contributionMargin: number;
  totalFixedCost: number;
  operatingSurplus: number; // EBITDA
  netCashFlow: number;
  cumulativeCashBalance: number;
  isCashNegative: boolean;
}

export interface DigitalTwinOutput {
  inputs: SimulationInputs;
  monthlyRevenue: number;
  monthlyVariableCost: number;
  monthlyFixedCost: number;
  totalMonthlyOperatingCost: number;
  contributionMarginPerUnit: number;
  contributionMarginRatio: number; // CM / Price
  monthlySurplus: number; // Revenue - Variable - Fixed
  annualProjectedSurplus: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  marginOfSafetyUnits: number;
  marginOfSafetyPercentage: number;
  workingCapitalRequirement: number;
  minCashRunwayMonths: number;
  monthlyProjections: MonthlyFinancialSnapshot[];
}

export interface StressShocks {
  demandChangePercent: number; // e.g. -20
  sellingPriceChangePercent: number; // e.g. -10
  rawMaterialCostChangePercent: number; // e.g. +15
  operatingFixedCostChangePercent: number; // e.g. +10
  paymentDelayAdditionalDays: number; // e.g. +30
  supplyDisruptionDays: number; // e.g. 15
  transportCostChangePercent: number; // e.g. +20
  equipmentDowntimeDays: number; // e.g. 5
}

export interface FailureCondition {
  id: string;
  trigger: string;
  impactDescription: string;
  affectedMetric: string;
  baseValue: number;
  stressValue: number;
  failurePointThreshold: number;
  isBreached: boolean;
  recoveryPossibility: 'HIGH' | 'MODERATE' | 'LOW' | 'EXTREMELY_DIFFICULT';
  recoveryStrategy: string;
}

export interface FailureTreeNode {
  id: string;
  label: string;
  category: 'DEMAND' | 'COST' | 'CASH_FLOW' | 'SUPPLY' | 'OPERATIONAL' | 'SEASONAL';
  isEarliestBreach: boolean;
  status: 'SAFE' | 'STRESSED' | 'CRITICAL_FAILURE';
  thresholdText: string;
  impactText: string;
  children?: FailureTreeNode[];
}

export interface ResilienceBoundary {
  parameter: string;
  unit: string;
  baseValue: number;
  safeZone: { min: number; max: number };
  stressedZone: { min: number; max: number };
  failureThreshold: number;
  currentStressValue: number;
  status: 'SAFE' | 'STRESSED' | 'FAILED';
  explanation: string;
}

export interface ResilienceEnvelope {
  overallResilienceScore: number; // 0 - 100
  resilienceRating: 'ROBUST' | 'MODERATE_BUFFER' | 'FRAGILE' | 'CRITICAL_RISK';
  boundaries: {
    demand: ResilienceBoundary;
    rawMaterial: ResilienceBoundary;
    sellingPrice: ResilienceBoundary;
    fixedCost: ResilienceBoundary;
    workingCapitalDelay: ResilienceBoundary;
  };
  summary: string;
}

export interface LoanScheme {
  id: 'MICRO_FINANCE' | 'TERM_LOAN';
  name: string;
  minProjectCost: number;
  maxProjectCost: number;
  maxFundingPercent: number; // e.g. 90%
  maxLoanAmount: number; // e.g. 1,25,000 or 45,00,000
  annualInterestRate: number; // e.g. 0.065 or 0.08
  tenureMonths: number; // 36 or 84
  moratoriumMonths: number; // 3 or 6
  applicableCategory: string;
}

export interface RepaymentInstallment {
  month: number;
  isMoratorium: boolean;
  openingPrincipal: number;
  principalPayment: number;
  interestPayment: number;
  totalEmi: number;
  closingPrincipal: number;
}

export interface RepaymentSchedule {
  schemeId: string;
  schemeName: string;
  loanAmount: number;
  interestRateAnnual: number;
  tenureMonths: number;
  moratoriumMonths: number;
  monthlyEmiDuringRepayment: number;
  totalInterestPaid: number;
  totalAmountPayable: number;
  quarterlyEmi: number;
  installments: RepaymentInstallment[];
}

export interface CapitalScenario {
  id: 'SCENARIO_A' | 'SCENARIO_B' | 'SCENARIO_C' | 'SCENARIO_D';
  name: string;
  description: string;
  projectCost: number;
  ownContribution: number;
  loanAmount: number;
  schemeId: 'MICRO_FINANCE' | 'TERM_LOAN' | 'NONE';
  monthlyRepayment: number;
  workingCapitalBuffer: number;
  stressCaseMonthlySurplus: number;
  stressCaseDscr: number;
  baseCaseDscr: number;
  affordabilityStatus: 'HIGHLY_AFFORDABLE' | 'BORDERLINE' | 'UNSUSTAINABLE';
}

export interface DebtCapacityAnalysis {
  projectCost: number;
  ownCapitalAvailable: number;
  baseMonthlyOperatingSurplus: number;
  stressMonthlyOperatingSurplus: number;
  maximumEligibleLoan: number; // Scheme legal maximum
  maximumAffordableLoan: number; // Derived from Base Case DSCR = 1.5x
  modelledSustainableLoan: number; // Derived from Stress Case DSCR = 1.25x
  eligibleVsSustainableGap: number; // eligible - sustainable
  baseCaseDscr: number;
  stressCaseDscr: number;
  dscrStatus: 'HEALTHY' | 'MARGINAL' | 'DANGEROUS';
  keyInsight: string;
}

export type DecisionState =
  | 'READY_FOR_PILOT'
  | 'VALIDATE_MORE'
  | 'REDUCE_SCALE'
  | 'RESTRUCTURE_CAPITAL'
  | 'DO_NOT_BORROW_YET';

export interface FinalDecision {
  state: DecisionState;
  title: string;
  badgeColor: 'emerald' | 'amber' | 'blue' | 'rose' | 'purple';
  whySummary: string;
  evidenceBacking: string[];
  simulationBacking: string[];
  failureConditionWarning: string;
  debtImplications: string;
  immediateNextAction: string;
  whatWouldChangeMind: {
    currentConstraint: string;
    triggerCondition: string;
    newRecommendation: string;
  }[];
}

export interface ActionPlanMilestone {
  dayWindow: '7_DAYS' | '30_DAYS' | '90_DAYS';
  category: 'VALIDATION' | 'SUPPLIER_SETUP' | 'PILOT' | 'CAPITAL_FINANCING' | 'RISK_MITIGATION';
  title: string;
  tasks: string[];
  targetOutcome: string;
  estimatedCost: number;
}
