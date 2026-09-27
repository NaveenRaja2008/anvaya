import { NextResponse } from 'next/server';
import { DiscoverOpportunitySchema } from '../../schemas';
import { stateStore } from '@/storage/state-store';
import { defaultDataProvider } from '@/providers/demo-data-provider';

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}));
    const validated = DiscoverOpportunitySchema.parse(json);

    const currentState = stateStore.getState();
    const profile = currentState.profile;

    let economicDna = currentState.economicDna;
    if (validated.location?.district) {
      economicDna = await defaultDataProvider.getLocalEconomicDna({
        district: validated.location.district,
        villageOrTown: validated.location.villageOrTown,
        state: validated.location.state || 'Karnataka'
      });
    }

    const opportunities = await defaultDataProvider.getOpportunitiesForProfile(profile, economicDna);

    return NextResponse.json({
      success: true,
      opportunities,
      saturation: currentState.saturation,
      profileId: profile.id,
      economicDnaId: economicDna.locationId
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.errors ? error.errors : error.message
    }, { status: 400 });
  }
}
