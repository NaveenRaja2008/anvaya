import {
  EntrepreneurProfile,
  EvidenceItem,
  LocalEconomicDna,
  OpportunityHypothesis,
  SaturationIntelligence
} from '../types/domain';
import {
  CapitalScenario,
  DebtCapacityAnalysis,
  DigitalTwinOutput,
  FinalDecision,
  LoanScheme,
  RepaymentSchedule,
  ResilienceEnvelope,
  SimulationInputs,
  StressShocks,
  ValidationExperiment,
  ValidationResponse
} from '../types/finance-simulation';
import {
  DEMO_ENTREPRENEUR_PROFILE,
  DEMO_EVIDENCE_ITEMS,
  DEMO_LOCAL_ECONOMIC_DNA,
  DEMO_OPPORTUNITIES,
  DEMO_VALIDATION_RESPONSES
} from '../data/seed-data';
import { EvidenceRegistry } from '../domain/evidence-engine';
import { calculateOpportunityFit, calculateOpportunitySaturation } from '../domain/opportunity-engine';
import { aggregateValidationExperiment } from '../domain/validation-engine';
import { runDigitalTwinSimulation } from '../domain/digital-twin';
import { runStressTestAndAutopsy, StressSimulationResult } from '../domain/failure-autopsy';
import { calculateResilienceEnvelope } from '../domain/resilience-engine';
import { calculateDebtCapacity, generateCapitalScenarios } from '../domain/capital-sandbox';
import { calculateRepaymentSchedule } from '../domain/repayment-engine';
import { routeLoanScheme } from '../domain/scheme-router';
import { evaluateFinalDecision, generateStructuredActionPlan } from '../domain/decision-engine';

export interface AnvayaAppState {
  profile: EntrepreneurProfile;
  economicDna: LocalEconomicDna;
  opportunities: OpportunityHypothesis[];
  selectedOpportunityId: string;
  saturation: SaturationIntelligence;
  validationExperiment: ValidationExperiment;
  validationResponses: ValidationResponse[];
  simulationInputs: SimulationInputs;
  digitalTwin: DigitalTwinOutput;
  stressShocks: StressShocks;
  stressResult: StressSimulationResult;
  resilienceEnvelope: ResilienceEnvelope;
  debtCapacity: DebtCapacityAnalysis;
  capitalScenarios: CapitalScenario[];
  repaymentSchedule: RepaymentSchedule;
  finalDecision: FinalDecision;
  evidenceItems: EvidenceItem[];
  isDemoMode: boolean;
  activeStage: 'OVERVIEW' | 'DISCOVER' | 'PROVE' | 'SIMULATE' | 'BREAK' | 'STRUCTURE' | 'ACT' | 'EVIDENCE';
}

class AnvayaStateStore {
  private state!: AnvayaAppState;
  private evidenceRegistry!: EvidenceRegistry;

  constructor() {
    this.resetToDemo();
  }

  public resetToDemo(): AnvayaAppState {
    const profile = { ...DEMO_ENTREPRENEUR_PROFILE };
    const economicDna = { ...DEMO_LOCAL_ECONOMIC_DNA };
    const opps = DEMO_OPPORTUNITIES.map(o => ({
      ...o,
      fitBreakdown: calculateOpportunityFit(profile, o, economicDna)
    }));
    const selectedOpp = opps[0];

    const saturation = calculateOpportunitySaturation(
      selectedOpp.id,
      selectedOpp.category,
      economicDna.villageOrTown,
      3200, // estimated monthly units in 5 villages
      1400, // existing supply
      selectedOpp.defaultUnitEconomics.monthlyProductionCapacity
    );

    const validationExperiment = aggregateValidationExperiment(
      selectedOpp.id,
      selectedOpp.defaultUnitEconomics.sellingPricePerUnit,
      DEMO_VALIDATION_RESPONSES
    );

    const simulationInputs: SimulationInputs = {
      initialInvestment: selectedOpp.capitalRequirement.minimumInitial,
      sellingPricePerUnit: selectedOpp.defaultUnitEconomics.sellingPricePerUnit,
      monthlyProductionUnits: selectedOpp.defaultUnitEconomics.monthlyProductionCapacity,
      fixedCosts: {
        rent: 2000,
        utilities: 2500,
        fixedSalaries: 0, // Family labor
        maintenance: 1500,
        marketingAndAdmin: 1500
      },
      variableCostsPerUnit: {
        rawMaterials: selectedOpp.defaultUnitEconomics.rawMaterialCostPerUnit,
        directLabour: selectedOpp.defaultUnitEconomics.laborCostPerUnit,
        packaging: 4,
        transportDelivery: 2,
        otherConsumables: 0
      },
      workingCapitalCycleDays: 14,
      paymentDelayDays: 14,
      seasonalityMonthlyFactors: [1.1, 1.15, 1.05, 0.95, 0.9, 0.85, 0.85, 0.9, 1.0, 1.1, 1.2, 1.25],
      growthRateAnnualPercent: 8.0
    };

    const digitalTwin = runDigitalTwinSimulation(simulationInputs);

    const defaultShocks: StressShocks = {
      demandChangePercent: -20,
      sellingPriceChangePercent: -10,
      rawMaterialCostChangePercent: 15,
      operatingFixedCostChangePercent: 10,
      paymentDelayAdditionalDays: 15,
      supplyDisruptionDays: 0,
      transportCostChangePercent: 15,
      equipmentDowntimeDays: 2
    };

    const stressResult = runStressTestAndAutopsy(simulationInputs, defaultShocks);
    const resilienceEnvelope = calculateResilienceEnvelope(
      simulationInputs,
      defaultShocks.demandChangePercent,
      defaultShocks.rawMaterialCostChangePercent,
      defaultShocks.sellingPriceChangePercent
    );

    const debtCapacity = calculateDebtCapacity(
      selectedOpp.capitalRequirement.totalProjectCost,
      profile.capitalAvailable,
      simulationInputs,
      defaultShocks
    );

    const capitalScenarios = generateCapitalScenarios(
      selectedOpp.capitalRequirement.totalProjectCost,
      profile.capitalAvailable,
      simulationInputs,
      defaultShocks
    );

    const schemeRouting = routeLoanScheme(selectedOpp.capitalRequirement.totalProjectCost);
    const repaymentSchedule = calculateRepaymentSchedule(
      debtCapacity.modelledSustainableLoan,
      schemeRouting.recommendedScheme?.annualInterestRate || 0.065,
      schemeRouting.recommendedScheme?.tenureMonths || 36,
      schemeRouting.recommendedScheme?.moratoriumMonths || 3,
      schemeRouting.recommendedScheme?.id,
      schemeRouting.recommendedScheme?.name
    );

    const finalDecision = evaluateFinalDecision(
      validationExperiment,
      digitalTwin,
      stressResult.firstFailureCondition,
      resilienceEnvelope,
      debtCapacity
    );

    this.evidenceRegistry = new EvidenceRegistry([...DEMO_EVIDENCE_ITEMS]);

    this.state = {
      profile,
      economicDna,
      opportunities: opps,
      selectedOpportunityId: selectedOpp.id,
      saturation,
      validationExperiment,
      validationResponses: [...DEMO_VALIDATION_RESPONSES],
      simulationInputs,
      digitalTwin,
      stressShocks: defaultShocks,
      stressResult,
      resilienceEnvelope,
      debtCapacity,
      capitalScenarios,
      repaymentSchedule,
      finalDecision,
      evidenceItems: this.evidenceRegistry.getAll(),
      isDemoMode: true,
      activeStage: 'OVERVIEW'
    };

    return this.state;
  }

  public getState(): AnvayaAppState {
    return this.state;
  }

  public updateProfile(updated: Partial<EntrepreneurProfile>): AnvayaAppState {
    this.state.profile = {
      ...this.state.profile,
      ...updated,
      updatedAt: new Date().toISOString()
    };

    // Recalculate opportunity fits
    this.state.opportunities = this.state.opportunities.map(opp => ({
      ...opp,
      fitBreakdown: calculateOpportunityFit(this.state.profile, opp, this.state.economicDna)
    })).sort((a, b) => b.fitBreakdown.compositeScore - a.fitBreakdown.compositeScore);

    this.recalculateDownstream();
    return this.state;
  }

  public selectOpportunity(oppId: string): AnvayaAppState {
    const opp = this.state.opportunities.find(o => o.id === oppId);
    if (!opp) return this.state;

    this.state.selectedOpportunityId = oppId;

    // Recalculate saturation
    this.state.saturation = calculateOpportunitySaturation(
      opp.id,
      opp.category,
      this.state.economicDna.villageOrTown,
      3000,
      1200,
      opp.defaultUnitEconomics.monthlyProductionCapacity
    );

    // Update simulation inputs with unit economics of newly selected opp
    this.state.simulationInputs = {
      ...this.state.simulationInputs,
      initialInvestment: opp.capitalRequirement.minimumInitial,
      sellingPricePerUnit: opp.defaultUnitEconomics.sellingPricePerUnit,
      monthlyProductionUnits: opp.defaultUnitEconomics.monthlyProductionCapacity,
      variableCostsPerUnit: {
        ...this.state.simulationInputs.variableCostsPerUnit,
        rawMaterials: opp.defaultUnitEconomics.rawMaterialCostPerUnit,
        directLabour: opp.defaultUnitEconomics.laborCostPerUnit
      }
    };

    this.recalculateDownstream();
    return this.state;
  }

  public addValidationResponse(response: Omit<ValidationResponse, 'id' | 'createdAt'>): AnvayaAppState {
    const newRecord: ValidationResponse = {
      ...response,
      id: `RESP-${String(this.state.validationResponses.length + 1).padStart(2, '0')}`,
      createdAt: new Date().toISOString()
    };
    this.state.validationResponses.push(newRecord);

    const selectedOpp = this.getSelectedOpportunity();
    this.state.validationExperiment = aggregateValidationExperiment(
      this.state.selectedOpportunityId,
      selectedOpp.defaultUnitEconomics.sellingPricePerUnit,
      this.state.validationResponses
    );

    this.recalculateDownstream();
    return this.state;
  }

  public updateSimulationInputs(inputs: Partial<SimulationInputs>): AnvayaAppState {
    this.state.simulationInputs = {
      ...this.state.simulationInputs,
      ...inputs
    };
    this.recalculateDownstream();
    return this.state;
  }

  public updateStressShocks(shocks: Partial<StressShocks>): AnvayaAppState {
    this.state.stressShocks = {
      ...this.state.stressShocks,
      ...shocks
    };
    this.recalculateDownstream();
    return this.state;
  }

  public setActiveStage(stage: AnvayaAppState['activeStage']): AnvayaAppState {
    this.state.activeStage = stage;
    return this.state;
  }

  private getSelectedOpportunity(): OpportunityHypothesis {
    return this.state.opportunities.find(o => o.id === this.state.selectedOpportunityId) || this.state.opportunities[0];
  }

  private recalculateDownstream(): void {
    const opp = this.getSelectedOpportunity();

    // 1. Digital Twin
    this.state.digitalTwin = runDigitalTwinSimulation(this.state.simulationInputs);

    // 2. Stress Test & Autopsy
    this.state.stressResult = runStressTestAndAutopsy(this.state.simulationInputs, this.state.stressShocks);

    // 3. Resilience Envelope
    this.state.resilienceEnvelope = calculateResilienceEnvelope(
      this.state.simulationInputs,
      this.state.stressShocks.demandChangePercent,
      this.state.stressShocks.rawMaterialCostChangePercent,
      this.state.stressShocks.sellingPriceChangePercent
    );

    // 4. Debt Capacity & Sandbox
    this.state.debtCapacity = calculateDebtCapacity(
      opp.capitalRequirement.totalProjectCost,
      this.state.profile.capitalAvailable,
      this.state.simulationInputs,
      this.state.stressShocks
    );

    this.state.capitalScenarios = generateCapitalScenarios(
      opp.capitalRequirement.totalProjectCost,
      this.state.profile.capitalAvailable,
      this.state.simulationInputs,
      this.state.stressShocks
    );

    // 5. Scheme & Repayment
    const schemeRouting = routeLoanScheme(opp.capitalRequirement.totalProjectCost);
    this.state.repaymentSchedule = calculateRepaymentSchedule(
      this.state.debtCapacity.modelledSustainableLoan,
      schemeRouting.recommendedScheme?.annualInterestRate || 0.065,
      schemeRouting.recommendedScheme?.tenureMonths || 36,
      schemeRouting.recommendedScheme?.moratoriumMonths || 3,
      schemeRouting.recommendedScheme?.id,
      schemeRouting.recommendedScheme?.name
    );

    // 6. Final Decision
    this.state.finalDecision = evaluateFinalDecision(
      this.state.validationExperiment,
      this.state.digitalTwin,
      this.state.stressResult.firstFailureCondition,
      this.state.resilienceEnvelope,
      this.state.debtCapacity
    );
  }
}

// Global singleton for Next.js in-memory persistence across API routes
const globalForAnvaya = globalThis as unknown as { anvayaStore?: AnvayaStateStore };
export const stateStore = globalForAnvaya.anvayaStore ?? new AnvayaStateStore();
if (process.env.NODE_ENV !== 'production') globalForAnvaya.anvayaStore = stateStore;
