import { NextResponse } from 'next/server';
import { ValidationResponseSchema } from '../../schemas';
import { stateStore } from '@/storage/state-store';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validated = ValidationResponseSchema.parse(json);

    const newState = stateStore.addValidationResponse({
      respondentId: validated.respondentIdentifier || `RESP-USER-${Date.now()}`,
      respondentType: validated.respondentType,
      isInterested: validated.isInterested,
      purchaseIntent: validated.purchaseIntent,
      acceptedPricePerUnit: validated.acceptedPricePerUnit,
      expectedMonthlyQuantity: validated.expectedMonthlyQuantity,
      currentAlternative: validated.currentAlternative || 'None',
      switchingFactor: validated.switchingFactor || 'Better price and quality',
      preferredPurchaseChannel: validated.preferredPurchaseChannel || 'Local shop',
      feedbackNotes: validated.feedbackNotes,
      isDemoData: false
    });

    return NextResponse.json({
      success: true,
      message: 'Validation response recorded and downstream metrics recalculated',
      experiment: newState.validationExperiment,
      responsesCount: newState.validationResponses.length
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.errors ? error.errors : error.message
    }, { status: 400 });
  }
}
