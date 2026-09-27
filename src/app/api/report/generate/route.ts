import { NextResponse } from 'next/server';
import { stateStore } from '@/storage/state-store';
import { generateStructuredActionPlan } from '@/domain/decision-engine';

export async function POST(request: Request) {
  try {
    const currentState = stateStore.getState();
    const selectedOpp = currentState.opportunities.find(o => o.id === currentState.selectedOpportunityId) || currentState.opportunities[0];
    const actionPlan = generateStructuredActionPlan(
      selectedOpp.title,
      currentState.debtCapacity.modelledSustainableLoan,
      25000
    );

    const report = {
      meta: {
        reportId: `ANVAYA-RPT-${Date.now()}`,
        generatedAt: new Date().toISOString(),
        disclaimer: 'ANVAYA is a decision-support prototype. Modelled results depend on the assumptions and evidence provided and are not guarantees of business performance or loan approval.'
      },
      entrepreneurProfile: currentState.profile,
      localEconomicDna: currentState.economicDna,
      opportunityDiscovery: {
        selectedOpportunity: selectedOpp,
        allHypotheses: currentState.opportunities,
        saturationIntelligence: currentState.saturation
      },
      evidenceRegister: currentState.evidenceItems,
      marketValidation: {
        experiment: currentState.validationExperiment,
        sampleSize: currentState.validationResponses.length,
        metrics: currentState.validationExperiment.metrics
      },
      digitalTwin: {
        inputs: currentState.simulationInputs,
        metrics: {
          monthlyRevenue: currentState.digitalTwin.monthlyRevenue,
          monthlyOperatingCost: currentState.digitalTwin.totalMonthlyOperatingCost,
          monthlySurplus: currentState.digitalTwin.monthlySurplus,
          breakEvenUnits: currentState.digitalTwin.breakEvenUnits,
          marginOfSafetyPercentage: currentState.digitalTwin.marginOfSafetyPercentage,
          workingCapitalRequirement: currentState.digitalTwin.workingCapitalRequirement
        }
      },
      failureAutopsy: {
        shocksApplied: currentState.stressShocks,
        firstFailureCondition: currentState.stressResult.firstFailureCondition,
        failureTree: currentState.stressResult.failureTree,
        isBusinessBroken: currentState.stressResult.isBusinessBroken
      },
      resilienceEnvelope: currentState.resilienceEnvelope,
      capitalSandbox: {
        scenarios: currentState.capitalScenarios,
        coreInsight: 'ELIGIBLE ≠ AFFORDABLE ≠ SUSTAINABLE'
      },
      schemeRoute: currentState.debtCapacity,
      repaymentSchedule: currentState.repaymentSchedule,
      finalDecision: currentState.finalDecision,
      actionPlan,
      whatChangesMind: currentState.finalDecision.whatWouldChangeMind
    };

    return NextResponse.json({
      success: true,
      report
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
