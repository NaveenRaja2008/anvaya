import { DigitalTwinOutput, FailureCondition, FailureTreeNode, SimulationInputs, StressShocks } from '../types/finance-simulation';
import { runDigitalTwinSimulation } from './digital-twin';

export interface StressSimulationResult {
  baseCase: DigitalTwinOutput;
  stressCase: DigitalTwinOutput;
  shocksApplied: StressShocks;
  firstFailureCondition: FailureCondition | null;
  allFailureConditions: FailureCondition[];
  failureTree: FailureTreeNode;
  isBusinessBroken: boolean;
  earliestFailureCategory: string | null;
}

export function applyStressShocksToInputs(
  baseInputs: SimulationInputs,
  shocks: StressShocks
): SimulationInputs {
  // 1. Demand shock
  const demandMultiplier = 1 + (shocks.demandChangePercent || 0) / 100;
  // Downtime also cuts effective working days (e.g. 26 standard days - downtimeDays)
  const downtimeMultiplier = Math.max(0.2, (26 - (shocks.equipmentDowntimeDays || 0)) / 26);
  // Supply disruption cuts capacity
  const supplyMultiplier = Math.max(0.2, (30 - (shocks.supplyDisruptionDays || 0)) / 30);

  const stressedMonthlyUnits = Math.max(
    10,
    Math.round(baseInputs.monthlyProductionUnits * demandMultiplier * downtimeMultiplier * supplyMultiplier)
  );

  // 2. Selling price shock
  const priceMultiplier = 1 + (shocks.sellingPriceChangePercent || 0) / 100;
  const stressedSellingPrice = Math.max(1, Math.round(baseInputs.sellingPricePerUnit * priceMultiplier * 100) / 100);

  // 3. Raw materials & transport cost shocks
  const rmMultiplier = 1 + (shocks.rawMaterialCostChangePercent || 0) / 100;
  const transportMultiplier = 1 + (shocks.transportCostChangePercent || 0) / 100;

  const stressedVariableCosts = {
    ...baseInputs.variableCostsPerUnit,
    rawMaterials: Math.round(baseInputs.variableCostsPerUnit.rawMaterials * rmMultiplier * 100) / 100,
    transportDelivery: Math.round(baseInputs.variableCostsPerUnit.transportDelivery * transportMultiplier * 100) / 100
  };

  // 4. Operating fixed costs shock
  const fixedMultiplier = 1 + (shocks.operatingFixedCostChangePercent || 0) / 100;
  const stressedFixedCosts = {
    rent: Math.round(baseInputs.fixedCosts.rent * fixedMultiplier),
    utilities: Math.round(baseInputs.fixedCosts.utilities * fixedMultiplier),
    fixedSalaries: Math.round(baseInputs.fixedCosts.fixedSalaries * fixedMultiplier),
    maintenance: Math.round(baseInputs.fixedCosts.maintenance * fixedMultiplier),
    marketingAndAdmin: Math.round(baseInputs.fixedCosts.marketingAndAdmin * fixedMultiplier)
  };

  // 5. Payment delay days
  const stressedPaymentDelayDays = baseInputs.paymentDelayDays + (shocks.paymentDelayAdditionalDays || 0);

  return {
    ...baseInputs,
    monthlyProductionUnits: stressedMonthlyUnits,
    sellingPricePerUnit: stressedSellingPrice,
    variableCostsPerUnit: stressedVariableCosts,
    fixedCosts: stressedFixedCosts,
    paymentDelayDays: stressedPaymentDelayDays
  };
}

export function runStressTestAndAutopsy(
  baseInputs: SimulationInputs,
  shocks: StressShocks
): StressSimulationResult {
  const baseCase = runDigitalTwinSimulation(baseInputs);
  const stressedInputs = applyStressShocksToInputs(baseInputs, shocks);
  const stressCase = runDigitalTwinSimulation(stressedInputs);

  const failureConditions: FailureCondition[] = [];

  // Check 1: Demand shock breach
  const unitVarCostBase =
    baseInputs.variableCostsPerUnit.rawMaterials +
    baseInputs.variableCostsPerUnit.directLabour +
    baseInputs.variableCostsPerUnit.packaging +
    baseInputs.variableCostsPerUnit.transportDelivery +
    baseInputs.variableCostsPerUnit.otherConsumables;
  const unitContribBase = baseInputs.sellingPricePerUnit - unitVarCostBase;
  const monthlyFixedBase =
    baseInputs.fixedCosts.rent +
    baseInputs.fixedCosts.utilities +
    baseInputs.fixedCosts.fixedSalaries +
    baseInputs.fixedCosts.maintenance +
    baseInputs.fixedCosts.marketingAndAdmin;

  // Exact demand failure point (where surplus = 0)
  const exactDemandBreakEvenUnits = unitContribBase > 0 ? Math.ceil(monthlyFixedBase / unitContribBase) : baseInputs.monthlyProductionUnits;
  const demandBreached = stressCase.monthlyRevenue < stressCase.totalMonthlyOperatingCost || stressCase.inputs.monthlyProductionUnits < exactDemandBreakEvenUnits;

  failureConditions.push({
    id: 'DEMAND_SHOCK_BREACH',
    trigger: `Monthly sales decline by ${Math.abs(shocks.demandChangePercent)}% under stress`,
    impactDescription: `Operating volume drops to ${stressCase.inputs.monthlyProductionUnits} units vs required ${exactDemandBreakEvenUnits} break-even units.`,
    affectedMetric: 'Monthly Net Surplus (EBITDA)',
    baseValue: baseCase.monthlySurplus,
    stressValue: stressCase.monthlySurplus,
    failurePointThreshold: 0,
    isBreached: demandBreached,
    recoveryPossibility: 'MODERATE',
    recoveryStrategy: 'Expand institutional or wholesale contracts to guarantee off-take baseline volume.'
  });

  // Check 2: Raw Material Cost Inflation
  // Exact maximum raw material cost where CM/unit still covers fixed costs at base volume
  const maxAffordableRmCost = baseInputs.sellingPricePerUnit - (monthlyFixedBase / baseInputs.monthlyProductionUnits) -
    (baseInputs.variableCostsPerUnit.directLabour + baseInputs.variableCostsPerUnit.packaging + baseInputs.variableCostsPerUnit.transportDelivery + baseInputs.variableCostsPerUnit.otherConsumables);
  const rmBreached = stressCase.inputs.variableCostsPerUnit.rawMaterials > maxAffordableRmCost;

  failureConditions.push({
    id: 'RAW_MATERIAL_INFLATION_BREACH',
    trigger: `Raw material prices surge by +${shocks.rawMaterialCostChangePercent}%`,
    impactDescription: `Unit raw material reaches ₹${stressCase.inputs.variableCostsPerUnit.rawMaterials} (threshold tolerance: ₹${Math.round(maxAffordableRmCost)}/unit).`,
    affectedMetric: 'Unit Contribution Margin',
    baseValue: baseCase.contributionMarginPerUnit,
    stressValue: stressCase.contributionMarginPerUnit,
    failurePointThreshold: 0,
    isBreached: rmBreached,
    recoveryPossibility: 'HIGH',
    recoveryStrategy: 'Establish local direct farmer-producer sourcing agreements to bypass middlemen markup.'
  });

  // Check 3: Price Deflation / Competitive Undercutting
  // Minimum selling price at base volume: Total Cost / Base Volume
  const minRequiredSellingPrice = baseCase.totalMonthlyOperatingCost / baseInputs.monthlyProductionUnits;
  const priceBreached = stressCase.inputs.sellingPricePerUnit < minRequiredSellingPrice;

  failureConditions.push({
    id: 'PRICE_DROP_BREACH',
    trigger: `Selling price drops by ${Math.abs(shocks.sellingPriceChangePercent)}% due to local competition`,
    impactDescription: `Realized price ₹${stressCase.inputs.sellingPricePerUnit}/unit is below floor production cost ₹${Math.round(minRequiredSellingPrice * 10) / 10}/unit.`,
    affectedMetric: 'Gross Contribution Margin',
    baseValue: baseCase.inputs.sellingPricePerUnit,
    stressValue: stressCase.inputs.sellingPricePerUnit,
    failurePointThreshold: minRequiredSellingPrice,
    isBreached: priceBreached,
    recoveryPossibility: 'MODERATE',
    recoveryStrategy: 'Introduce value-added differentiated pack sizes or organic/quality certification to defend premium.'
  });

  // Check 4: Working Capital Lockup / Payment Delay
  const stressWorkingCapital = stressCase.workingCapitalRequirement;
  const ownCapital = baseInputs.initialInvestment;
  const cashLockupBreached = (shocks.paymentDelayAdditionalDays >= 30) || (stressCase.monthlyProjections.some(p => p.isCashNegative));

  failureConditions.push({
    id: 'CASH_FLOW_LOCKUP_BREACH',
    trigger: `Buyers delay payments by +${shocks.paymentDelayAdditionalDays} additional days`,
    impactDescription: `Working capital requirement spikes to ₹${stressWorkingCapital.toLocaleString('en-IN')}, depleting cash reserves.`,
    affectedMetric: 'Cash Runway & Monthly Liquidity',
    baseValue: baseCase.workingCapitalRequirement,
    stressValue: stressWorkingCapital,
    failurePointThreshold: ownCapital * 1.5,
    isBreached: cashLockupBreached,
    recoveryPossibility: 'LOW',
    recoveryStrategy: 'Mandate partial advance on order placement and strict 7-day payment settlement terms for retailers.'
  });

  // Find the first/most critical breached condition
  const breachedConditions = failureConditions.filter(c => c.isBreached);
  const firstFailureCondition = breachedConditions[0] || null;
  const isBusinessBroken = stressCase.monthlySurplus <= 0 || breachedConditions.length > 0;

  // Construct the structured Failure Tree
  let earliestCategory: 'DEMAND' | 'COST' | 'CASH_FLOW' | 'SUPPLY' | 'OPERATIONAL' | 'SEASONAL' | null = null;

  if (demandBreached) earliestCategory = 'DEMAND';
  else if (rmBreached || priceBreached) earliestCategory = 'COST';
  else if (cashLockupBreached) earliestCategory = 'CASH_FLOW';
  else if (shocks.supplyDisruptionDays > 10) earliestCategory = 'SUPPLY';
  else if (shocks.equipmentDowntimeDays > 3) earliestCategory = 'OPERATIONAL';

  const failureTree: FailureTreeNode = {
    id: 'ROOT',
    label: 'BUSINESS VIABILITY UNDER STRESS',
    category: earliestCategory || 'DEMAND',
    isEarliestBreach: isBusinessBroken,
    status: isBusinessBroken ? 'CRITICAL_FAILURE' : 'SAFE',
    thresholdText: isBusinessBroken ? 'Net Monthly Cash Surplus <= ₹0' : 'Net Surplus Positive',
    impactText: isBusinessBroken
      ? `Under selected shocks, monthly surplus becomes ₹${stressCase.monthlySurplus.toLocaleString('en-IN')}`
      : `Operating surplus remains at ₹${stressCase.monthlySurplus.toLocaleString('en-IN')}`,
    children: [
      {
        id: 'DEMAND_SHOCK_NODE',
        label: 'Demand Volume Shock',
        category: 'DEMAND',
        isEarliestBreach: earliestCategory === 'DEMAND',
        status: demandBreached ? 'CRITICAL_FAILURE' : (shocks.demandChangePercent < 0 ? 'STRESSED' : 'SAFE'),
        thresholdText: `Break-even threshold: ${exactDemandBreakEvenUnits} units/mo`,
        impactText: `Volume tested: ${stressCase.inputs.monthlyProductionUnits} units (${shocks.demandChangePercent}%)`
      },
      {
        id: 'COST_SHOCK_NODE',
        label: 'Cost & Margin Squeeze',
        category: 'COST',
        isEarliestBreach: earliestCategory === 'COST',
        status: (rmBreached || priceBreached) ? 'CRITICAL_FAILURE' : (shocks.rawMaterialCostChangePercent > 0 ? 'STRESSED' : 'SAFE'),
        thresholdText: `Max tolerable RM: ₹${Math.round(maxAffordableRmCost)}/unit`,
        impactText: `Stressed RM cost: ₹${stressCase.inputs.variableCostsPerUnit.rawMaterials}/unit (+${shocks.rawMaterialCostChangePercent}%)`
      },
      {
        id: 'CASH_FLOW_NODE',
        label: 'Payment Delay / Liquidity Lockup',
        category: 'CASH_FLOW',
        isEarliestBreach: earliestCategory === 'CASH_FLOW',
        status: cashLockupBreached ? 'CRITICAL_FAILURE' : (shocks.paymentDelayAdditionalDays > 0 ? 'STRESSED' : 'SAFE'),
        thresholdText: `Max credit extension: 21 days`,
        impactText: `Receivables lag: ${stressCase.inputs.paymentDelayDays} days (+₹${stressWorkingCapital.toLocaleString('en-IN')} working capital tied up)`
      },
      {
        id: 'SUPPLY_NODE',
        label: 'Supply Chain Disruption',
        category: 'SUPPLY',
        isEarliestBreach: earliestCategory === 'SUPPLY',
        status: shocks.supplyDisruptionDays >= 10 ? 'CRITICAL_FAILURE' : (shocks.supplyDisruptionDays > 0 ? 'STRESSED' : 'SAFE'),
        thresholdText: `Buffer inventory: 7 days`,
        impactText: `Disruption duration: ${shocks.supplyDisruptionDays} days lost production`
      },
      {
        id: 'OPERATIONAL_NODE',
        label: 'Equipment & Power Downtime',
        category: 'OPERATIONAL',
        isEarliestBreach: earliestCategory === 'OPERATIONAL',
        status: shocks.equipmentDowntimeDays >= 5 ? 'CRITICAL_FAILURE' : (shocks.equipmentDowntimeDays > 0 ? 'STRESSED' : 'SAFE'),
        thresholdText: `Max tolerated downtime: 3 days/mo`,
        impactText: `Downtime: ${shocks.equipmentDowntimeDays} days (${Math.round((shocks.equipmentDowntimeDays / 26) * 100)}% monthly downtime)`
      }
    ]
  };

  return {
    baseCase,
    stressCase,
    shocksApplied: shocks,
    firstFailureCondition,
    allFailureConditions: failureConditions,
    failureTree,
    isBusinessBroken,
    earliestFailureCategory: earliestCategory
  };
}
