import { ResilienceBoundary, ResilienceEnvelope, SimulationInputs } from '../types/finance-simulation';
import { runDigitalTwinSimulation } from './digital-twin';

export function calculateResilienceEnvelope(
  baseInputs: SimulationInputs,
  currentDemandShock = -20,
  currentRmShock = 15,
  currentPriceShock = -10
): ResilienceEnvelope {
  const base = runDigitalTwinSimulation(baseInputs);

  const unitVarCostBase =
    baseInputs.variableCostsPerUnit.rawMaterials +
    baseInputs.variableCostsPerUnit.directLabour +
    baseInputs.variableCostsPerUnit.packaging +
    baseInputs.variableCostsPerUnit.transportDelivery +
    baseInputs.variableCostsPerUnit.otherConsumables;
  const unitContribBase = baseInputs.sellingPricePerUnit - unitVarCostBase;
  const monthlyFixedCost = base.monthlyFixedCost;

  // 1. Demand Tolerance Boundary:
  // Break-even units:
  const breakEvenUnits = unitContribBase > 0 ? Math.ceil(monthlyFixedCost / unitContribBase) : baseInputs.monthlyProductionUnits;
  const maxDemandDropPct = baseInputs.monthlyProductionUnits > 0
    ? -Math.round(((baseInputs.monthlyProductionUnits - breakEvenUnits) / baseInputs.monthlyProductionUnits) * 100)
    : 0;

  const demandBoundary: ResilienceBoundary = {
    parameter: 'Demand Volume Sensitivity',
    unit: '% change from baseline',
    baseValue: 0,
    safeZone: { min: -10, max: 0 },
    stressedZone: { min: maxDemandDropPct, max: -10 },
    failureThreshold: maxDemandDropPct,
    currentStressValue: currentDemandShock,
    status: currentDemandShock <= maxDemandDropPct ? 'FAILED' : (currentDemandShock <= -10 ? 'STRESSED' : 'SAFE'),
    explanation: `Break-even requires ${breakEvenUnits} units/mo. A demand drop beyond ${Math.abs(maxDemandDropPct)}% causes operating cash deficit.`
  };

  // 2. Raw Material Price Tolerance Boundary:
  // Max affordable raw material cost before unit contribution margin becomes zero or doesn't cover fixed costs:
  const otherVarCosts =
    baseInputs.variableCostsPerUnit.directLabour +
    baseInputs.variableCostsPerUnit.packaging +
    baseInputs.variableCostsPerUnit.transportDelivery +
    baseInputs.variableCostsPerUnit.otherConsumables;
  const fixedCostPerUnit = monthlyFixedCost / baseInputs.monthlyProductionUnits;
  const maxRmCostAffordable = baseInputs.sellingPricePerUnit - otherVarCosts - fixedCostPerUnit;
  const maxRmIncreasePct = baseInputs.variableCostsPerUnit.rawMaterials > 0
    ? Math.round(((maxRmCostAffordable - baseInputs.variableCostsPerUnit.rawMaterials) / baseInputs.variableCostsPerUnit.rawMaterials) * 100)
    : 20;

  const rmBoundary: ResilienceBoundary = {
    parameter: 'Raw Material Cost Inflation',
    unit: '% increase from baseline',
    baseValue: 0,
    safeZone: { min: 0, max: 10 },
    stressedZone: { min: 10, max: maxRmIncreasePct },
    failureThreshold: maxRmIncreasePct,
    currentStressValue: currentRmShock,
    status: currentRmShock >= maxRmIncreasePct ? 'FAILED' : (currentRmShock >= 10 ? 'STRESSED' : 'SAFE'),
    explanation: `Current RM is ₹${baseInputs.variableCostsPerUnit.rawMaterials}/unit. Modelled ceiling is ₹${Math.round(maxRmCostAffordable)}/unit (+${maxRmIncreasePct}%).`
  };

  // 3. Selling Price Tolerance Boundary:
  // Min selling price to cover all costs:
  const minFloorPrice = (base.monthlyVariableCost + monthlyFixedCost) / baseInputs.monthlyProductionUnits;
  const maxPriceDropPct = -Math.round(((baseInputs.sellingPricePerUnit - minFloorPrice) / baseInputs.sellingPricePerUnit) * 100);

  const priceBoundary: ResilienceBoundary = {
    parameter: 'Selling Price Erosion',
    unit: '% decline from baseline',
    baseValue: 0,
    safeZone: { min: -5, max: 0 },
    stressedZone: { min: maxPriceDropPct, max: -5 },
    failureThreshold: maxPriceDropPct,
    currentStressValue: currentPriceShock,
    status: currentPriceShock <= maxPriceDropPct ? 'FAILED' : (currentPriceShock <= -5 ? 'STRESSED' : 'SAFE'),
    explanation: `Floor selling price is ₹${Math.round(minFloorPrice * 10) / 10}/unit. Price erosion exceeding ${Math.abs(maxPriceDropPct)}% leads to losses.`
  };

  // 4. Fixed Cost Tolerance Boundary:
  // Max fixed costs covered by total contribution margin:
  const totalBaseContribution = baseInputs.monthlyProductionUnits * unitContribBase;
  const maxFixedCostIncreasePct = monthlyFixedCost > 0
    ? Math.round(((totalBaseContribution - monthlyFixedCost) / monthlyFixedCost) * 100)
    : 30;

  const fixedBoundary: ResilienceBoundary = {
    parameter: 'Fixed Overheads Surge',
    unit: '% increase from baseline',
    baseValue: 0,
    safeZone: { min: 0, max: 15 },
    stressedZone: { min: 15, max: maxFixedCostIncreasePct },
    failureThreshold: maxFixedCostIncreasePct,
    currentStressValue: 10,
    status: 'SAFE',
    explanation: `Contribution buffer allows fixed costs to rise up to +${maxFixedCostIncreasePct}% before deficit.`
  };

  // 5. Working Capital Payment Delay:
  const workingCapitalDelayBoundary: ResilienceBoundary = {
    parameter: 'Payment Delay Tolerance',
    unit: 'Days of receivables lag',
    baseValue: baseInputs.paymentDelayDays,
    safeZone: { min: 0, max: 15 },
    stressedZone: { min: 15, max: 35 },
    failureThreshold: 45,
    currentStressValue: baseInputs.paymentDelayDays + 20,
    status: 'STRESSED',
    explanation: `Working capital buffer can absorb up to 35 days payment lag. At 45+ days, supplier payment default occurs.`
  };

  // Determine Overall Resilience Score (0 - 100)
  let score = 100;
  if (demandBoundary.status === 'FAILED') score -= 35;
  else if (demandBoundary.status === 'STRESSED') score -= 15;

  if (rmBoundary.status === 'FAILED') score -= 25;
  else if (rmBoundary.status === 'STRESSED') score -= 10;

  if (priceBoundary.status === 'FAILED') score -= 25;
  else if (priceBoundary.status === 'STRESSED') score -= 10;

  if (workingCapitalDelayBoundary.status === 'STRESSED') score -= 10;

  score = Math.max(10, Math.min(100, score));

  let resilienceRating: 'ROBUST' | 'MODERATE_BUFFER' | 'FRAGILE' | 'CRITICAL_RISK' = 'MODERATE_BUFFER';
  if (score >= 80) resilienceRating = 'ROBUST';
  else if (score >= 60) resilienceRating = 'MODERATE_BUFFER';
  else if (score >= 40) resilienceRating = 'FRAGILE';
  else resilienceRating = 'CRITICAL_RISK';

  return {
    overallResilienceScore: score,
    resilienceRating,
    boundaries: {
      demand: demandBoundary,
      rawMaterial: rmBoundary,
      sellingPrice: priceBoundary,
      fixedCost: fixedBoundary,
      workingCapitalDelay: workingCapitalDelayBoundary
    },
    summary: `Modelled resilience envelope indicates business can withstand up to ${Math.abs(maxDemandDropPct)}% demand drop or +${maxRmIncreasePct}% raw material inflation before cash burn begins.`
  };
}
