import { NextResponse } from 'next/server';
import { StressTestSchema } from '../../schemas';
import { stateStore } from '@/storage/state-store';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validated = StressTestSchema.parse(json);

    const newState = stateStore.updateStressShocks(validated);

    return NextResponse.json({
      success: true,
      shocksApplied: newState.stressShocks,
      baseCase: newState.stressResult.baseCase,
      stressCase: newState.stressResult.stressCase,
      firstFailureCondition: newState.stressResult.firstFailureCondition,
      isBusinessBroken: newState.stressResult.isBusinessBroken,
      failureTree: newState.stressResult.failureTree,
      resilienceEnvelope: newState.resilienceEnvelope
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.errors ? error.errors : error.message
    }, { status: 400 });
  }
}
