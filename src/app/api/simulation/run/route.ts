import { NextResponse } from 'next/server';
import { SimulationRunSchema } from '../../schemas';
import { stateStore } from '@/storage/state-store';
import { runDigitalTwinSimulation } from '@/domain/digital-twin';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validated = SimulationRunSchema.parse(json);

    const simulationInputs = {
      ...validated,
      seasonalityMonthlyFactors: stateStore.getState().simulationInputs.seasonalityMonthlyFactors
    };

    const newState = stateStore.updateSimulationInputs(simulationInputs);

    return NextResponse.json({
      success: true,
      digitalTwin: newState.digitalTwin,
      simulationInputs: newState.simulationInputs
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.errors ? error.errors : error.message
    }, { status: 400 });
  }
}
