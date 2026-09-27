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
      currentState.debtCapacity.ownCapitalAvailable - currentState.debtCapacity.modelledSustainableLoan
    );

    return NextResponse.json({
      success: true,
      decision: currentState.finalDecision,
      actionPlan,
      whatChangesMind: currentState.finalDecision.whatWouldChangeMind
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
