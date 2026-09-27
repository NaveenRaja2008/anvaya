import { NextResponse } from 'next/server';
import { stateStore } from '@/storage/state-store';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const currentState = stateStore.getState();
    const opportunityId = body.opportunityId || currentState.selectedOpportunityId;

    return NextResponse.json({
      success: true,
      experiment: currentState.validationExperiment,
      responsesCount: currentState.validationResponses.length,
      channels: ['QR_CODE', 'WHATSAPP', 'DIRECT_INTERVIEW'],
      qrCodeDataUrl: `https://anvaya.gov.in/v/${opportunityId}`,
      whatsappShareUrl: `https://wa.me/?text=Please%20help%20validate%20our%20local%20enterprise%20in%20Kuknoor:%20https://anvaya.gov.in/v/${opportunityId}`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
