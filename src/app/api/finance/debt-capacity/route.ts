import { NextResponse } from 'next/server';
import { stateStore } from '@/storage/state-store';

export async function POST(request: Request) {
  try {
    const currentState = stateStore.getState();

    return NextResponse.json({
      success: true,
      debtCapacity: currentState.debtCapacity,
      capitalScenarios: currentState.capitalScenarios,
      keyInsight: currentState.debtCapacity.keyInsight
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
