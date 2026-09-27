import { NextResponse } from 'next/server';
import { stateStore } from '@/storage/state-store';

export async function POST(request: Request) {
  try {
    const currentState = stateStore.getState();
    const resilience = currentState.resilienceEnvelope;

    return NextResponse.json({
      success: true,
      resilienceEnvelope: resilience
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
