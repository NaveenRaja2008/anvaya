import { NextResponse } from 'next/server';
import { RepaymentCalcSchema } from '../../schemas';
import { calculateRepaymentSchedule } from '@/domain/repayment-engine';
import { stateStore } from '@/storage/state-store';

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}));
    let schedule;

    if (json.loanAmount) {
      const validated = RepaymentCalcSchema.parse(json);
      schedule = calculateRepaymentSchedule(
        validated.loanAmount,
        validated.annualInterestRate,
        validated.tenureMonths,
        validated.moratoriumMonths
      );
    } else {
      schedule = stateStore.getState().repaymentSchedule;
    }

    return NextResponse.json({
      success: true,
      repaymentSchedule: schedule,
      capitalScenarios: stateStore.getState().capitalScenarios
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.errors ? error.errors : error.message
    }, { status: 400 });
  }
}
