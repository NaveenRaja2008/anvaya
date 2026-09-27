import { NextResponse } from 'next/server';
import { defaultDataProvider } from '@/providers/demo-data-provider';
import { stateStore } from '@/storage/state-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get('district');
  const villageOrTown = searchParams.get('village');
  const state = searchParams.get('state');

  const currentState = stateStore.getState();

  const economicDna = await defaultDataProvider.getLocalEconomicDna({
    district: district || currentState.profile.location.district,
    villageOrTown: villageOrTown || currentState.profile.location.villageOrTown,
    state: state || currentState.profile.location.state
  });

  const commodityPrices = await defaultDataProvider.getPrimaryCommodityPrices(
    district || currentState.profile.location.district
  );

  return NextResponse.json({
    success: true,
    economicDna,
    commodityPrices
  });
}
