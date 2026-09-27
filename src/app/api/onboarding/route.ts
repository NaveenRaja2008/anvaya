import { NextResponse } from 'next/server';
import { OnboardingSchema } from '../schemas';
import { stateStore } from '@/storage/state-store';
import { defaultDataProvider } from '@/providers/demo-data-provider';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validated = OnboardingSchema.parse(json);

    // Fetch local economic DNA for location
    const economicDna = await defaultDataProvider.getLocalEconomicDna({
      district: validated.district,
      villageOrTown: validated.villageOrTown,
      state: validated.state
    });

    const updatedProfile = {
      id: `EP-${Date.now()}`,
      name: validated.name,
      location: {
        district: validated.district,
        subDistrictOrBlock: validated.subDistrictOrBlock || 'Block-1',
        villageOrTown: validated.villageOrTown,
        state: validated.state
      },
      capitalAvailable: validated.capitalAvailable,
      assets: validated.assets,
      skills: validated.skills,
      workExperienceYears: validated.workExperienceYears,
      experienceDescription: validated.experienceDescription || '',
      interests: validated.interests,
      timeAvailabilityHoursPerDay: validated.timeAvailabilityHoursPerDay,
      familySupport: validated.familySupport,
      labourAvailability: validated.labourAvailability,
      transportAccess: validated.transportAccess || validated.assets.hasTwoWheeler || validated.assets.hasFourWheelerOrCommercialVehicle,
      storageAccess: validated.storageAccess || validated.assets.hasHomeWorkspace,
      existingInfrastructure: validated.existingInfrastructure,
      preferredBusinessType: validated.preferredBusinessType,
      riskPreference: validated.riskPreference,
      targetMonthlyIncome: validated.targetMonthlyIncome,
      hasBusinessIdea: validated.hasBusinessIdea,
      initialIdeaDescription: validated.initialIdeaDescription
    };

    const newState = stateStore.updateProfile(updatedProfile);

    return NextResponse.json({
      success: true,
      message: 'Adaptive onboarding completed and entrepreneur profile generated',
      profile: newState.profile,
      state: newState
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.errors ? error.errors : error.message
    }, { status: 400 });
  }
}
