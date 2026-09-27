import { CapitalScenario, DebtCapacityAnalysis, SimulationInputs, StressShocks } from '../types/finance-simulation';
import { calculateRepaymentSchedule } from './repayment-engine';
import { routeLoanScheme, SCHEME_CONFIGS } from './scheme-router';
import { runDigitalTwinSimulation } from './digital-twin';
import { runStressTestAndAutopsy } from './failure-autopsy';

export function calculateDebtCapacity(
  projectCost: number,
  ownCapitalAvailable: number,
  baseInputs: SimulationInputs,
  stressShocks: StressShocks
): DebtCapacityAnalysis {
  const baseSim = runDigitalTwinSimulation(baseInputs);
  const stressResult = runStressTestAndAutopsy(baseInputs, stressShocks);

  const baseMonthlySurplus = baseSim.monthlySurplus;
  const stressMonthlySurplus = Math.max(0, stressResult.stressCase.monthlySurplus);

  // 1. Statutory Eligible Loan (from Scheme Rules)
  const schemeResult = routeLoanScheme(projectCost);
  const maximumEligibleLoan = schemeResult.maximumEligibleLoan;

  // 2. Maximum Affordable Loan:
  // Benchmarked at DSCR = 1.5x on BASE CASE surplus
  // Max affordable monthly EMI = BaseSurplus / 1.5
  const maxAffordableMonthlyEmi = baseMonthlySurplus > 0 ? baseMonthlySurplus / 1.5 : 0;

  // Reverse calculate loan amount from EMI using scheme parameters
  const interestRate = schemeResult.recommendedScheme?.annualInterestRate ?? 0.065;
  const tenureMonths = schemeResult.recommendedScheme?.tenureMonths ?? 36;
  const moratoriumMonths = schemeResult.recommendedScheme?.moratoriumMonths ?? 3;
  const repaymentMonths = tenureMonths - moratoriumMonths;
  const monthlyRate = interestRate / 12;

  let maximumAffordableLoan = 0;
  if (monthlyRate > 0 && maxAffordableMonthlyEmi > 0) {
    const factor = Math.pow(1 + monthlyRate, repaymentMonths);
    maximumAffordableLoan = Math.round((maxAffordableMonthlyEmi * (factor - 1)) / (monthlyRate * factor));
  }

  // 3. Modelled Sustainable Loan:
  // Must withstand STRESS shocks with DSCR >= 1.25x
  // Stressed max EMI = StressSurplus / 1.25
  const sustainableMonthlyEmi = stressMonthlySurplus > 0 ? stressMonthlySurplus / 1.25 : 0;
  let modelledSustainableLoan = 0;
  if (monthlyRate > 0 && sustainableMonthlyEmi > 0) {
    const factor = Math.pow(1 + monthlyRate, repaymentMonths);
    modelledSustainableLoan = Math.round((sustainableMonthlyEmi * (factor - 1)) / (monthlyRate * factor));
  }

  // Cap loans by project cost funding ceiling
  maximumAffordableLoan = Math.min(maximumAffordableLoan, maximumEligibleLoan);
  modelledSustainableLoan = Math.min(modelledSustainableLoan, maximumEligibleLoan);

  // Calculate actual DSCR under maximum eligible loan repayment
  const eligibleRepayment = calculateRepaymentSchedule(
    maximumEligibleLoan,
    interestRate,
    tenureMonths,
    moratoriumMonths
  );
  const eligibleEmi = eligibleRepayment.monthlyEmiDuringRepayment;

  const baseCaseDscr = eligibleEmi > 0 ? Math.round((baseMonthlySurplus / eligibleEmi) * 100) / 100 : 999;
  const stressCaseDscr = eligibleEmi > 0 ? Math.round((stressMonthlySurplus / eligibleEmi) * 100) / 100 : 999;

  let dscrStatus: 'HEALTHY' | 'MARGINAL' | 'DANGEROUS' = 'HEALTHY';
  if (stressCaseDscr < 1.0) {
    dscrStatus = 'DANGEROUS';
  } else if (stressCaseDscr < 1.3) {
    dscrStatus = 'MARGINAL';
  }

  const eligibleVsSustainableGap = Math.max(0, maximumEligibleLoan - modelledSustainableLoan);

  let keyInsight = '';
  if (eligibleVsSustainableGap > 0) {
    keyInsight = `While banks can legally sanction ₹${maximumEligibleLoan.toLocaleString('en-IN')}, stress simulation demonstrates that borrowing more than ₹${modelledSustainableLoan.toLocaleString('en-IN')} risks debt default during rural demand shocks (Gap: ₹${eligibleVsSustainableGap.toLocaleString('en-IN')}).`;
  } else {
    keyInsight = `The business generates sufficient cash flow to comfortably service the full eligible loan of ₹${maximumEligibleLoan.toLocaleString('en-IN')} even under stress.`;
  }

  return {
    projectCost,
    ownCapitalAvailable,
    baseMonthlyOperatingSurplus: baseMonthlySurplus,
    stressMonthlyOperatingSurplus: stressMonthlySurplus,
    maximumEligibleLoan,
    maximumAffordableLoan,
    modelledSustainableLoan,
    eligibleVsSustainableGap,
    baseCaseDscr,
    stressCaseDscr,
    dscrStatus,
    keyInsight
  };
}

export function generateCapitalScenarios(
  projectCost: number,
  ownCapitalAvailable: number,
  baseInputs: SimulationInputs,
  stressShocks: StressShocks
): CapitalScenario[] {
  const baseSim = runDigitalTwinSimulation(baseInputs);
  const stressSim = runStressTestAndAutopsy(baseInputs, stressShocks);
  const baseSurplus = baseSim.monthlySurplus;
  const stressSurplus = stressSim.stressCase.monthlySurplus;

  const scheme = routeLoanScheme(projectCost);
  const schemeConfig = scheme.recommendedScheme || SCHEME_CONFIGS.MICRO_FINANCE;

  // Scenario A: Own Capital Only (Bootstrapped Micro-Scale)
  const scAProjectCost = Math.min(projectCost, ownCapitalAvailable);
  const scAWorkingCapitalBuffer = ownCapitalAvailable - scAProjectCost;
  const scASurplusBase = Math.round(baseSurplus * (scAProjectCost / projectCost));
  const scASurplusStress = Math.round(stressSurplus * (scAProjectCost / projectCost));

  const scenarioA: CapitalScenario = {
    id: 'SCENARIO_A',
    name: 'Scenario A: Zero Debt (Own Capital Only)',
    description: '100% self-funded micro-pilot. Eliminates fixed monthly EMI obligations completely.',
    projectCost: scAProjectCost,
    ownContribution: scAProjectCost,
    loanAmount: 0,
    schemeId: 'NONE',
    monthlyRepayment: 0,
    workingCapitalBuffer: Math.max(15000, scAWorkingCapitalBuffer),
    stressCaseMonthlySurplus: scASurplusStress,
    baseCaseDscr: 999,
    stressCaseDscr: 999,
    affordabilityStatus: scASurplusStress >= 0 ? 'HIGHLY_AFFORDABLE' : 'BORDERLINE'
  };

  // Scenario B: Own Capital + Small Buffer Loan (Conservative Co-Financing)
  const scBLoan = Math.round(Math.min(projectCost * 0.4, scheme.maximumEligibleLoan * 0.5));
  const scBOwn = Math.min(ownCapitalAvailable, projectCost - scBLoan);
  const scBRepayment = calculateRepaymentSchedule(
    scBLoan,
    schemeConfig.annualInterestRate,
    schemeConfig.tenureMonths,
    schemeConfig.moratoriumMonths
  );
  const scBDscrBase = scBRepayment.monthlyEmiDuringRepayment > 0 ? Math.round((baseSurplus / scBRepayment.monthlyEmiDuringRepayment) * 100) / 100 : 999;
  const scBDscrStress = scBRepayment.monthlyEmiDuringRepayment > 0 ? Math.round((stressSurplus / scBRepayment.monthlyEmiDuringRepayment) * 100) / 100 : 999;

  const scenarioB: CapitalScenario = {
    id: 'SCENARIO_B',
    name: 'Scenario B: Conservative Co-Financing (40% Debt)',
    description: 'Modest loan provides equipment upgrades while leaving significant cushion against shocks.',
    projectCost,
    ownContribution: scBOwn,
    loanAmount: scBLoan,
    schemeId: schemeConfig.id,
    monthlyRepayment: scBRepayment.monthlyEmiDuringRepayment,
    workingCapitalBuffer: ownCapitalAvailable - scBOwn + 10000,
    stressCaseMonthlySurplus: stressSurplus - scBRepayment.monthlyEmiDuringRepayment,
    baseCaseDscr: scBDscrBase,
    stressCaseDscr: scBDscrStress,
    affordabilityStatus: scBDscrStress >= 1.3 ? 'HIGHLY_AFFORDABLE' : (scBDscrStress >= 1.0 ? 'BORDERLINE' : 'UNSUSTAINABLE')
  };

  // Scenario C: Maximum Eligible Loan (Max Statutory Borrowing)
  const scCLoan = scheme.maximumEligibleLoan;
  const scCOwn = projectCost - scCLoan;
  const scCRepayment = calculateRepaymentSchedule(
    scCLoan,
    schemeConfig.annualInterestRate,
    schemeConfig.tenureMonths,
    schemeConfig.moratoriumMonths
  );
  const scCDscrBase = scCRepayment.monthlyEmiDuringRepayment > 0 ? Math.round((baseSurplus / scCRepayment.monthlyEmiDuringRepayment) * 100) / 100 : 999;
  const scCDscrStress = scCRepayment.monthlyEmiDuringRepayment > 0 ? Math.round((stressSurplus / scCRepayment.monthlyEmiDuringRepayment) * 100) / 100 : 999;

  const scenarioC: CapitalScenario = {
    id: 'SCENARIO_C',
    name: 'Scenario C: Maximum Eligible Loan (90% Scheme Cap)',
    description: 'Maximum legal borrowing allowed under government scheme. Highly vulnerable to downturns.',
    projectCost,
    ownContribution: scCOwn,
    loanAmount: scCLoan,
    schemeId: schemeConfig.id,
    monthlyRepayment: scCRepayment.monthlyEmiDuringRepayment,
    workingCapitalBuffer: ownCapitalAvailable - scCOwn,
    stressCaseMonthlySurplus: stressSurplus - scCRepayment.monthlyEmiDuringRepayment,
    baseCaseDscr: scCDscrBase,
    stressCaseDscr: scCDscrStress,
    affordabilityStatus: scCDscrStress >= 1.3 ? 'HIGHLY_AFFORDABLE' : (scCDscrStress >= 1.0 ? 'BORDERLINE' : 'UNSUSTAINABLE')
  };

  // Scenario D: Pilot First -> Expansion Later (Staged Capital Architecture)
  const scDProjectCost = Math.round(projectCost * 0.55);
  const scDLoan = Math.round(scDProjectCost * 0.5);
  const scDOwn = Math.min(ownCapitalAvailable, scDProjectCost - scDLoan);
  const scDRepayment = calculateRepaymentSchedule(
    scDLoan,
    schemeConfig.annualInterestRate,
    schemeConfig.tenureMonths,
    schemeConfig.moratoriumMonths
  );
  const scDSurplusBase = Math.round(baseSurplus * 0.65);
  const scDSurplusStress = Math.round(stressSurplus * 0.65);
  const scDDscrBase = scDRepayment.monthlyEmiDuringRepayment > 0 ? Math.round((scDSurplusBase / scDRepayment.monthlyEmiDuringRepayment) * 100) / 100 : 999;
  const scDDscrStress = scDRepayment.monthlyEmiDuringRepayment > 0 ? Math.round((scDSurplusStress / scDRepayment.monthlyEmiDuringRepayment) * 100) / 100 : 999;

  const scenarioD: CapitalScenario = {
    id: 'SCENARIO_D',
    name: 'Scenario D: Staged Pilot (Pilot First → Expand)',
    description: 'Execute lean 60-day pilot with minimal debt. Scale up to full debt only after repeat orders are proven.',
    projectCost: scDProjectCost,
    ownContribution: scDOwn,
    loanAmount: scDLoan,
    schemeId: schemeConfig.id,
    monthlyRepayment: scDRepayment.monthlyEmiDuringRepayment,
    workingCapitalBuffer: ownCapitalAvailable - scDOwn + 20000,
    stressCaseMonthlySurplus: scDSurplusStress - scDRepayment.monthlyEmiDuringRepayment,
    baseCaseDscr: scDDscrBase,
    stressCaseDscr: scDDscrStress,
    affordabilityStatus: scDDscrStress >= 1.25 ? 'HIGHLY_AFFORDABLE' : 'BORDERLINE'
  };

  return [scenarioA, scenarioB, scenarioC, scenarioD];
}
