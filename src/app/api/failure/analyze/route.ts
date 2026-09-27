import { NextResponse } from 'next/server';
import { stateStore } from '@/storage/state-store';

export async function POST(request: Request) {
  try {
    const currentState = stateStore.getState();
    const result = currentState.stressResult;

    return NextResponse.json({
      success: true,
      firstFailureCondition: result.firstFailureCondition,
      allFailureConditions: result.allFailureConditions,
      failureTree: result.failureTree,
      isBusinessBroken: result.isBusinessBroken,
      earliestFailureCategory: result.earliestFailureCategory
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
