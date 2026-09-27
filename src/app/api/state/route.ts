import { NextResponse } from 'next/server';
import { stateStore } from '@/storage/state-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'reset_demo') {
    const freshState = stateStore.resetToDemo();
    return NextResponse.json({ success: true, message: 'Reset to complete seeded demo state', state: freshState });
  }

  return NextResponse.json({ success: true, state: stateStore.getState() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === 'select_opportunity' && body.opportunityId) {
      const state = stateStore.selectOpportunity(body.opportunityId);
      return NextResponse.json({ success: true, state });
    }
    if (body.action === 'set_stage' && body.stage) {
      const state = stateStore.setActiveStage(body.stage);
      return NextResponse.json({ success: true, state });
    }
    return NextResponse.json({ success: true, state: stateStore.getState() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
