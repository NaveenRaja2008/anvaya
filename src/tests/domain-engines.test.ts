import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { routeLoanScheme, SCHEME_CONFIGS } from '../domain/scheme-router';
import { calculateRepaymentSchedule } from '../domain/repayment-engine';
import { runDigitalTwinSimulation } from '../domain/digital-twin';
import { runStressTestAndAutopsy } from '../domain/failure-autopsy';
import { calculateResilienceEnvelope } from '../domain/resilience-engine';
import { calculateOpportunityFit, calculateOpportunitySaturation } from '../domain/opportunity-engine';
import { aggregateValidationExperiment } from '../domain/validation-engine';
import { calculateDebtCapacity, generateCapitalScenarios } from '../domain/capital-sandbox';
import { evaluateFinalDecision } from '../domain/decision-engine';
import {
  DEMO_ENTREPRENEUR_PROFILE,
  DEMO_LOCAL_ECONOMIC_DNA,
  DEMO_OPPORTUNITIES,
  DEMO_VALIDATION_RESPONSES
} from '../data/seed-data';
import { SimulationInputs, StressShocks } from '../types/finance-simulation';

describe('ANVAYA Deterministic Domain Engines', () => {
  const sampleInputs: SimulationInputs = {
    initialInvestment: 65000,
    sellingPricePerUnit: 60,
    monthlyProductionUnits: 1000,
    fixedCosts: {
      rent: 2000,
      utilities: 2500,
      fixedSalaries: 0,
      maintenance: 1500,
      marketingAndAdmin: 1500
    },
    variableCostsPerUnit: {
      rawMaterials: 24,
      directLabour: 4,
      packaging: 4,
      transportDelivery: 2,
      otherConsumables: 0
    },
    workingCapitalCycleDays: 14,
    paymentDelayDays: 14,
    seasonalityMonthlyFactors: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    growthRateAnnualPercent: 0
  };

  const sampleShocks: StressShocks = {
    demandChangePercent: -20,
    sellingPriceChangePercent: -10,
    rawMaterialCostChangePercent: 15,
    operatingFixedCostChangePercent: 10,
    paymentDelayAdditionalDays: 15,
    supplyDisruptionDays: 0,
    transportCostChangePercent: 15,
    equipmentDowntimeDays: 2
  };

  describe('1. Scheme Router Engine', () => {
    it('should route sub-₹1.40L project cost to Micro Finance Scheme with 6.5% interest and 3-month moratorium', () => {
      const result = routeLoanScheme(95000);
      assert.equal(result.recommendedScheme?.id, 'MICRO_FINANCE');
      assert.equal(result.recommendedScheme?.annualInterestRate, 0.065);
      assert.equal(result.recommendedScheme?.moratoriumMonths, 3);
      assert.equal(result.maximumEligibleLoan, 85500); // 90% of 95,000
      assert.equal(result.promoterContributionMin, 9500);
    });

    it('should route >₹1.40L project cost to Term Loan Scheme with 8.0% interest and 6-month moratorium', () => {
      const result = routeLoanScheme(250000);
      assert.equal(result.recommendedScheme?.id, 'TERM_LOAN');
      assert.equal(result.recommendedScheme?.annualInterestRate, 0.08);
      assert.equal(result.recommendedScheme?.moratoriumMonths, 6);
      assert.equal(result.maximumEligibleLoan, 225000); // 90% of 250,000
    });

    it('should enforce scheme maximum cap of ₹1,25,000 for Micro Finance', () => {
      const result = routeLoanScheme(140000);
      assert.equal(result.maximumEligibleLoan, 125000); // Capped at maxLoanAmount
    });
  });

  describe('2. Repayment Engine', () => {
    it('should properly calculate EMI with moratorium period and positive interest', () => {
      const schedule = calculateRepaymentSchedule(50000, 0.065, 36, 3);
      assert.equal(schedule.installments.length, 36);
      assert.equal(schedule.moratoriumMonths, 3);

      // Check moratorium months have 0 principal repayment
      assert.equal(schedule.installments[0].isMoratorium, true);
      assert.equal(schedule.installments[0].principalPayment, 0);
      assert.ok(schedule.installments[0].interestPayment > 0);

      // Check amortization phase begins in month 4
      assert.equal(schedule.installments[3].isMoratorium, false);
      assert.ok(schedule.installments[3].principalPayment > 0);
      assert.equal(schedule.installments[35].closingPrincipal, 0);
    });
  });

  describe('3. Digital Twin Simulation Engine', () => {
    it('should deterministically calculate revenue, variable costs, surplus, and break-even', () => {
      const sim = runDigitalTwinSimulation(sampleInputs);
      // Monthly Revenue: 1,000 * 60 = 60,000
      assert.equal(sim.monthlyRevenue, 60000);

      // Variable cost per unit: 24+4+4+2 = 34. Total VC = 34,000
      assert.equal(sim.monthlyVariableCost, 34000);

      // Fixed cost: 2000 + 2500 + 0 + 1500 + 1500 = 7,500
      assert.equal(sim.monthlyFixedCost, 7500);

      // Unit Contribution Margin: 60 - 34 = 26
      assert.equal(sim.contributionMarginPerUnit, 26);

      // Monthly Surplus: 60,000 - 34,000 - 7,500 = 18,500
      assert.equal(sim.monthlySurplus, 18500);

      // Break-even units: Math.ceil(7,500 / 26) = 289
      assert.equal(sim.breakEvenUnits, 289);
      assert.ok(sim.marginOfSafetyPercentage > 50);
    });
  });

  describe('4. Failure Autopsy & Stress Test Engine', () => {
    it('should calculate stress case and detect first failure condition under heavy shock', () => {
      const result = runStressTestAndAutopsy(sampleInputs, sampleShocks);
      assert.ok(result.stressCase.monthlyRevenue < result.baseCase.monthlyRevenue);
      assert.ok(result.stressCase.monthlySurplus < result.baseCase.monthlySurplus);

      // Severe shock test
      const severeShocks: StressShocks = {
        demandChangePercent: -60,
        sellingPriceChangePercent: -20,
        rawMaterialCostChangePercent: 35,
        operatingFixedCostChangePercent: 20,
        paymentDelayAdditionalDays: 30,
        supplyDisruptionDays: 5,
        transportCostChangePercent: 20,
        equipmentDowntimeDays: 4
      };
      const severeResult = runStressTestAndAutopsy(sampleInputs, severeShocks);
      assert.equal(severeResult.isBusinessBroken, true);
      assert.ok(severeResult.firstFailureCondition !== null);
      assert.equal(severeResult.firstFailureCondition?.isBreached, true);
    });
  });

  describe('5. Resilience Envelope Engine', () => {
    it('should determine parameter boundaries and overall resilience rating', () => {
      const envelope = calculateResilienceEnvelope(sampleInputs, -20, 15, -10);
      assert.ok(envelope.boundaries.demand.failureThreshold < -15);
      assert.ok(envelope.boundaries.rawMaterial.failureThreshold > 10);
      assert.ok(envelope.overallResilienceScore >= 10);
      assert.ok(envelope.overallResilienceScore <= 100);
    });
  });

  describe('6. Opportunity Fit & Saturation Engines', () => {
    it('should calculate explainable fit breakdown and give different scores for different profiles', () => {
      const opp = DEMO_OPPORTUNITIES[0];
      const fit1 = calculateOpportunityFit(DEMO_ENTREPRENEUR_PROFILE, opp, DEMO_LOCAL_ECONOMIC_DNA);
      assert.ok(fit1.compositeScore > 70);

      // Modify profile to someone with zero capital and no food skills
      const poorFitProfile = {
        ...DEMO_ENTREPRENEUR_PROFILE,
        capitalAvailable: 5000,
        skills: ['Carpentry'],
        assets: {
          ...DEMO_ENTREPRENEUR_PROFILE.assets,
          hasHomeWorkspace: false,
          hasTwoWheeler: false
        }
      };
      const fit2 = calculateOpportunityFit(poorFitProfile, opp, DEMO_LOCAL_ECONOMIC_DNA);
      assert.ok(fit2.compositeScore < fit1.compositeScore);
      assert.ok(fit2.capitalFit < fit1.capitalFit);
      assert.ok(fit2.skillFit < fit1.skillFit);
    });

    it('should flag potential local oversupply when post-entry supply approaches demand', () => {
      const sat = calculateOpportunitySaturation('OPP-1', 'FOOD', 'Kuknoor', 1000, 950, 200);
      assert.equal(sat.status, 'POTENTIAL_LOCAL_OVERSUPPLY');
      assert.ok(sat.postEntrySaturationRatio >= 0.95);
    });
  });

  describe('7. Validation Scoring Engine', () => {
    it('should aggregate validation survey responses and determine evidence strength', () => {
      const experiment = aggregateValidationExperiment('OPP-MILLET-FOOD-001', 60, DEMO_VALIDATION_RESPONSES);
      assert.equal(experiment.metrics.totalSample, 20);
      assert.equal(experiment.metrics.interestedCount, 16);
      assert.equal(experiment.metrics.demandValidationRate, 80);
      assert.equal(experiment.evidenceStrength, 'STRONG');
    });
  });

  describe('8. Debt Capacity & Capital Sandbox', () => {
    it('should demonstrate that Maximum Eligible Loan != Modelled Sustainable Loan', () => {
      const debt = calculateDebtCapacity(95000, 100000, sampleInputs, sampleShocks);
      assert.equal(debt.maximumEligibleLoan, 85500);
      assert.ok(debt.modelledSustainableLoan <= debt.maximumEligibleLoan);

      const scenarios = generateCapitalScenarios(95000, 100000, sampleInputs, sampleShocks);
      assert.equal(scenarios.length, 4);
      assert.equal(scenarios[0].id, 'SCENARIO_A');
      assert.equal(scenarios[0].loanAmount, 0);
      assert.equal(scenarios[2].id, 'SCENARIO_C');
      assert.equal(scenarios[2].loanAmount, debt.maximumEligibleLoan);
    });
  });

  describe('9. Decision Engine', () => {
    it('should generate final decision and actionable milestones', () => {
      const experiment = aggregateValidationExperiment('OPP-MILLET-FOOD-001', 60, DEMO_VALIDATION_RESPONSES);
      const twin = runDigitalTwinSimulation(sampleInputs);
      const autopsy = runStressTestAndAutopsy(sampleInputs, sampleShocks);
      const resilience = calculateResilienceEnvelope(sampleInputs, -20, 15, -10);
      const debt = calculateDebtCapacity(95000, 100000, sampleInputs, sampleShocks);

      const decision = evaluateFinalDecision(experiment, twin, autopsy.firstFailureCondition, resilience, debt);
      assert.ok(['READY_FOR_PILOT', 'RESTRUCTURE_CAPITAL', 'VALIDATE_MORE'].includes(decision.state));
      assert.ok(decision.whatWouldChangeMind.length > 0);
    });
  });
});
