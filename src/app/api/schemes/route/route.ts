import { NextResponse } from 'next/server';
import { RouteSchemeSchema } from '../../schemas';
import { routeLoanScheme } from '@/domain/scheme-router';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validated = RouteSchemeSchema.parse(json);

    const routing = routeLoanScheme(validated.projectCost, validated.requestedLoanAmount);

    return NextResponse.json({
      success: true,
      routing
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.errors ? error.errors : error.message
    }, { status: 400 });
  }
}
