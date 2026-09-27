import { ActionPlanMilestone, DebtCapacityAnalysis, DigitalTwinOutput, FailureCondition, FinalDecision, ResilienceEnvelope, ValidationExperiment } from '../types/finance-simulation';

export function evaluateFinalDecision(
  validation: ValidationExperiment,
  simulation: DigitalTwinOutput,
  firstFailure: FailureCondition | null,
  resilience: ResilienceEnvelope,
  debtCapacity: DebtCapacityAnalysis
): FinalDecision {
  const isValidationStrong = validation.evidenceStrength === 'STRONG' && validation.metrics.demandValidationRate >= 65;
  const isValidationWeak = validation.metrics.demandValidationRate < 50 || validation.actualResponsesCount < 10;
  const isCashFlowSolid = simulation.monthlySurplus >= 12000;
  const isStressDeficit = debtCapacity.stressMonthlyOperatingSurplus <= 0;
  const isDscrDangerous = debtCapacity.stressCaseDscr < 1.1;

  let state: FinalDecision['state'] = 'READY_FOR_PILOT';
  let title = 'Recommended: Staged Pilot Execution (Scenario D)';
  let badgeColor: FinalDecision['badgeColor'] = 'emerald';
  let whySummary = '';
  let failureWarning = '';
  let debtImplications = '';
  let nextAction = '';

  if (isValidationWeak) {
    state = 'VALIDATE_MORE';
    title = 'Recommended: Validate More Demand Before Committing Capital';
    badgeColor = 'amber';
    whySummary = `Current micro-market validation sample (${validation.actualResponsesCount} respondents, ${validation.metrics.demandValidationRate}% intent) does not provide sufficient statistical confidence to commit borrowed capital.`;
    failureWarning = `If real-world sales drop even 15% below projection, the business faces early liquidity crunch.`;
    debtImplications = `Do not draw term loan debt until at least 15 verified advance customer commitments are secured.`;
    nextAction = `Execute 10 additional face-to-face consumer taste/pricing tests in Koppal town weekly market.`;
  } else if (isStressDeficit || isDscrDangerous) {
    state = 'RESTRUCTURE_CAPITAL';
    title = 'Recommended: Restructure Capital — Cap Debt to Sustainable Limit';
    badgeColor = 'blue';
    whySummary = `While statutory eligible loan is ₹${debtCapacity.maximumEligibleLoan.toLocaleString('en-IN')}, simulated stress testing proves the enterprise can safely sustain only ₹${debtCapacity.modelledSustainableLoan.toLocaleString('en-IN')}. Borrowing the full eligible amount creates high default risk during rural price shocks.`;
    failureWarning = firstFailure ? firstFailure.impactDescription : `Stress cash flow falls below required monthly loan debt service.`;
    debtImplications = `Borrow no more than ₹${debtCapacity.modelledSustainableLoan.toLocaleString('en-IN')} (Eligible vs Sustainable gap: ₹${debtCapacity.eligibleVsSustainableGap.toLocaleString('en-IN')}). Fund balance via own savings or phased equipment procurement.`;
    nextAction = `Apply for Micro Finance scheme at reduced loan ceiling (₹${debtCapacity.modelledSustainableLoan.toLocaleString('en-IN')}) with 3-month moratorium buffer.`;
  } else if (resilience.resilienceRating === 'CRITICAL_RISK') {
    state = 'REDUCE_SCALE';
    title = 'Recommended: Reduce Scale to Lower Fixed Overhead Burden';
    badgeColor = 'rose';
    whySummary = `Fixed monthly overheads (₹${simulation.monthlyFixedCost.toLocaleString('en-IN')}) create an elevated break-even requirement (${simulation.breakEvenUnits} units).`;
    failureWarning = `A raw material price surge or small competitor undercut pushes operation into losses.`;
    debtImplications = `Downscale machinery procurement to reduce monthly loan EMI burden.`;
    nextAction = `Negotiate shared workspace or defer dedicated commercial space rental until Month 4.`;
  } else {
    state = 'READY_FOR_PILOT';
    title = 'Recommended: Ready for Staged Micro-Pilot';
    badgeColor = 'emerald';
    whySummary = `Unit economics demonstrate healthy contribution margin (₹${simulation.contributionMarginPerUnit}/unit), demand validation is positive (${validation.metrics.demandValidationRate}% intent across ${validation.actualResponsesCount} respondents), and stress-case DSCR (${debtCapacity.stressCaseDscr}x) provides safety buffer.`;
    failureWarning = firstFailure ? `Modelled failure occurs if monthly demand falls below ${firstFailure.failurePointThreshold} units.` : `Maintain minimum 30-day working capital buffer.`;
    debtImplications = `Staged loan structure of ₹${debtCapacity.modelledSustainableLoan.toLocaleString('en-IN')} is affordable with comfortable debt service coverage.`;
    nextAction = `Finalize grain supplier contract for 200kg pearl/foxtail millet batch and start trial production.`;
  }

  const whatWouldChangeMind = [
    {
      currentConstraint: `Demand validation rate is ${validation.metrics.demandValidationRate}% across ${validation.actualResponsesCount} micro-survey respondents.`,
      triggerCondition: `If verified recurring weekly purchase contracts drop below 8 retailers (or demand validation rate falls below 45%).`,
      newRecommendation: `Downgrade to 'DO NOT BORROW YET' and re-evaluate product packaging / recipe.`
    },
    {
      currentConstraint: `Modelled raw material price assumes ₹${simulation.inputs.variableCostsPerUnit.rawMaterials}/unit farm-gate procurement.`,
      triggerCondition: `If local open-market millet grain prices surge past ₹${Math.round(simulation.inputs.variableCostsPerUnit.rawMaterials * 1.25)}/kg (+25%) without ability to pass costs to consumers.`,
      newRecommendation: `Switch to 'RESTRUCTURE_CAPITAL' and require direct farmer cluster backward linkages before buying grinding machinery.`
    },
    {
      currentConstraint: `Working capital receivables delay is currently modelled at ${simulation.inputs.paymentDelayDays} days.`,
      triggerCondition: `If institutional buyers demand >45-day payment credit terms.`,
      newRecommendation: `Halt credit sales; restrict distribution strictly to cash-on-delivery (COD) retail distribution.`
    }
  ];

  return {
    state,
    title,
    badgeColor,
    whySummary,
    evidenceBacking: [
      `Demand Validation: ${validation.metrics.interestedCount}/${validation.actualResponsesCount} respondents interested (${validation.metrics.demandValidationRate}%).`,
      `Price Acceptance: Average accepted price ₹${validation.metrics.averageAcceptedPrice} vs proposed ₹${simulation.inputs.sellingPricePerUnit}.`,
      `Repeat Potential: ${validation.metrics.repeatPotentialScore}% indicate recurring monthly purchases.`
    ],
    simulationBacking: [
      `Monthly Net Surplus: ₹${simulation.monthlySurplus.toLocaleString('en-IN')}/mo at base operating capacity.`,
      `Break-even point: ${simulation.breakEvenUnits} units/mo (Margin of Safety: ${simulation.marginOfSafetyPercentage}%).`,
      `Debt Service Coverage: Base DSCR ${debtCapacity.baseCaseDscr}x, Stress DSCR ${debtCapacity.stressCaseDscr}x.`
    ],
    failureConditionWarning: failureWarning,
    debtImplications,
    immediateNextAction: nextAction,
    whatWouldChangeMind
  };
}

export function generateStructuredActionPlan(
  opportunityTitle: string,
  proposedLoanAmount: number,
  workingCapitalBuffer: number
): ActionPlanMilestone[] {
  return [
    {
      dayWindow: '7_DAYS',
      category: 'VALIDATION',
      title: 'Field Validation & Sampling Protocol',
      tasks: [
        'Prepare 15 physical trial sample packs in unbranded food-grade pouches.',
        'Distribute samples to 5 local tea stalls and 5 Kirana store owners in village cluster.',
        'Record structured sensory feedback (taste, texture, willingness to pay ₹60/pack).'
      ],
      targetOutcome: 'At least 7 of 10 merchants agree to keep 5 trial packs on consignment.',
      estimatedCost: 1500
    },
    {
      dayWindow: '7_DAYS',
      category: 'SUPPLIER_SETUP',
      title: 'Farmer Procurement Linkage',
      tasks: [
        'Visit 2 local Raitha Samparka Kendras (RSK) or farmer producer organizations (FPO).',
        'Secure written price quotes for grade-A pearl millet and foxtail millet at wholesale rate.',
        'Inspect moisture content and cleaning standards to avoid wastage.'
      ],
      targetOutcome: 'Lock in raw material supply at benchmark cost with 7-day credit or bulk discount.',
      estimatedCost: 3000
    },
    {
      dayWindow: '30_DAYS',
      category: 'PILOT',
      title: 'Micro-Batch Pilot Production',
      tasks: [
        'Set up home shed workspace with hygiene partition, stainless steel tables, and heat sealer.',
        'Obtain basic FSSAI registration (online portal, ₹100 annual fee).',
        'Produce initial 400 pilot units using existing domestic grinder / rented commercial mixer.',
        'Track exact yield, electricity units consumed, and packaging waste per batch.'
      ],
      targetOutcome: 'Verify unit production cost is within ₹32 - ₹36/unit envelope.',
      estimatedCost: 15000
    },
    {
      dayWindow: '30_DAYS',
      category: 'CAPITAL_FINANCING',
      title: 'Scheme Application & Documentation',
      tasks: [
        `Prepare ANVAYA Pre-Loan Intelligence dossier with micro-validation evidence register.`,
        `Submit loan application for ₹${proposedLoanAmount.toLocaleString('en-IN')} under Micro Finance scheme.`,
        'Ensure 3-month moratorium is formally registered in bank sanction letter.',
        `Protect ₹${workingCapitalBuffer.toLocaleString('en-IN')} liquid cash buffer in separate savings account.`
      ],
      targetOutcome: 'Bank in-principle sanction with verified sustainable EMI structure.',
      estimatedCost: 1000
    },
    {
      dayWindow: '90_DAYS',
      category: 'RISK_MITIGATION',
      title: 'Channel Diversification & Stress Resilience',
      tasks: [
        'Onboard 15 active weekly retail touchpoints across 3 neighboring villages.',
        'Implement strict 7-day payment settlement cycle to prevent receivables lockup.',
        'Create standard operating procedure (SOP) for equipment maintenance to avoid downtime.',
        'Accumulate 2 months of debt service EMI in liquid bank deposit before scaling production.'
      ],
      targetOutcome: 'Achieve steady 900+ units/mo sales with cash-positive balance sheet.',
      estimatedCost: 8000
    }
  ];
}
