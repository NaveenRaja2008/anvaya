import { DigitalTwinOutput, MonthlyFinancialSnapshot, SimulationInputs } from '../types/finance-simulation';

export function runDigitalTwinSimulation(inputs: SimulationInputs): DigitalTwinOutput {
  const {
    sellingPricePerUnit,
    monthlyProductionUnits,
    fixedCosts,
    variableCostsPerUnit,
    workingCapitalCycleDays,
    paymentDelayDays,
    seasonalityMonthlyFactors,
    growthRateAnnualPercent
  } = inputs;

  const unitVariableCost =
    variableCostsPerUnit.rawMaterials +
    variableCostsPerUnit.directLabour +
    variableCostsPerUnit.packaging +
    variableCostsPerUnit.transportDelivery +
    variableCostsPerUnit.otherConsumables;

  const monthlyRevenue = monthlyProductionUnits * sellingPricePerUnit;
  const monthlyVariableCost = monthlyProductionUnits * unitVariableCost;
  const monthlyFixedCost =
    fixedCosts.rent +
    fixedCosts.utilities +
    fixedCosts.fixedSalaries +
    fixedCosts.maintenance +
    fixedCosts.marketingAndAdmin;

  const totalMonthlyOperatingCost = monthlyVariableCost + monthlyFixedCost;
  const contributionMarginPerUnit = sellingPricePerUnit - unitVariableCost;
  const contributionMarginRatio = sellingPricePerUnit > 0
    ? contributionMarginPerUnit / sellingPricePerUnit
    : 0;

  const monthlySurplus = monthlyRevenue - totalMonthlyOperatingCost;
  const annualProjectedSurplus = monthlySurplus * 12;

  // Break-even deterministic calculations
  let breakEvenUnits = 0;
  let breakEvenRevenue = 0;
  if (contributionMarginPerUnit > 0) {
    breakEvenUnits = Math.ceil(monthlyFixedCost / contributionMarginPerUnit);
    breakEvenRevenue = Math.round(breakEvenUnits * sellingPricePerUnit);
  } else {
    // If unit contribution is negative, break-even is unattainable
    breakEvenUnits = Infinity;
    breakEvenRevenue = Infinity;
  }

  const marginOfSafetyUnits = breakEvenUnits !== Infinity
    ? monthlyProductionUnits - breakEvenUnits
    : -monthlyProductionUnits;
  const marginOfSafetyPercentage = monthlyProductionUnits > 0 && breakEvenUnits !== Infinity
    ? Math.round(((monthlyProductionUnits - breakEvenUnits) / monthlyProductionUnits) * 1000) / 10
    : -100;

  // Working capital requirement formula:
  // Operating costs tied up in inventory/production cycle + Receivables delayed
  const dailyOperatingCost = totalMonthlyOperatingCost / 30;
  const dailyRevenue = monthlyRevenue / 30;
  const inventoryCashNeeded = dailyOperatingCost * Math.max(0, workingCapitalCycleDays);
  const receivablesCashNeeded = dailyRevenue * Math.max(0, paymentDelayDays);
  const workingCapitalRequirement = Math.round(inventoryCashNeeded + receivablesCashNeeded);

  // 12-Month Month-by-Month Simulation with Seasonality and Growth
  const monthlyProjections: MonthlyFinancialSnapshot[] = [];
  let cumulativeCashBalance = workingCapitalRequirement > 0 ? workingCapitalRequirement : 25000;
  let minCumulativeCash = cumulativeCashBalance;

  const monthlyGrowthFactor = Math.pow(1 + (growthRateAnnualPercent || 0) / 100, 1 / 12) - 1;

  for (let m = 1; m <= 12; m++) {
    const seasonMultiplier = seasonalityMonthlyFactors?.[m - 1] ?? 1.0;
    const compoundGrowth = Math.pow(1 + monthlyGrowthFactor, m - 1);
    const projectedUnits = Math.round(monthlyProductionUnits * seasonMultiplier * compoundGrowth);

    const grossRevenue = projectedUnits * sellingPricePerUnit;
    const totalVarCost = projectedUnits * unitVariableCost;
    const totalFixCost = monthlyFixedCost;
    const contribMargin = grossRevenue - totalVarCost;
    const opSurplus = contribMargin - totalFixCost;

    // Payment delay cash lag impact
    const netCashFlow = opSurplus;
    cumulativeCashBalance += netCashFlow;

    if (cumulativeCashBalance < minCumulativeCash) {
      minCumulativeCash = cumulativeCashBalance;
    }

    monthlyProjections.push({
      month: m,
      unitsSold: projectedUnits,
      grossRevenue,
      totalVariableCost: totalVarCost,
      contributionMargin: contribMargin,
      totalFixedCost: totalFixCost,
      operatingSurplus: opSurplus,
      netCashFlow,
      cumulativeCashBalance,
      isCashNegative: cumulativeCashBalance < 0
    });
  }

  // Calculate cash runway
  const monthlyBurn = monthlySurplus < 0 ? Math.abs(monthlySurplus) : 0;
  const minCashRunwayMonths = monthlyBurn > 0
    ? Math.round((Math.max(0, cumulativeCashBalance) / monthlyBurn) * 10) / 10
    : 24; // >24 months safe buffer

  return {
    inputs,
    monthlyRevenue,
    monthlyVariableCost,
    monthlyFixedCost,
    totalMonthlyOperatingCost,
    contributionMarginPerUnit,
    contributionMarginRatio,
    monthlySurplus,
    annualProjectedSurplus,
    breakEvenUnits,
    breakEvenRevenue,
    marginOfSafetyUnits,
    marginOfSafetyPercentage,
    workingCapitalRequirement,
    minCashRunwayMonths,
    monthlyProjections
  };
}
