import {
  EntrepreneurProfile,
  FitBreakdown,
  LocalEconomicDna,
  OpportunityHypothesis,
  SaturationIntelligence
} from '../types/domain';

export function calculateOpportunityFit(
  profile: EntrepreneurProfile,
  opportunity: OpportunityHypothesis,
  economicDna: LocalEconomicDna
): FitBreakdown {
  // 1. Capital Fit (0 - 100)
  // How well does user's available capital cover the initial requirement and working capital?
  const minRequired = opportunity.capitalRequirement.minimumInitial;
  const recommended = opportunity.capitalRequirement.totalProjectCost;
  let capitalFit = 0;
  if (profile.capitalAvailable >= recommended) {
    capitalFit = 95;
  } else if (profile.capitalAvailable >= minRequired) {
    capitalFit = 75 + Math.round(((profile.capitalAvailable - minRequired) / (recommended - minRequired)) * 20);
  } else {
    // Has partial capital
    capitalFit = Math.max(20, Math.round((profile.capitalAvailable / minRequired) * 70));
  }

  // 2. Skill Fit (0 - 100)
  // Check overlap of profile skills with required skills using token matching
  const profileTokens = profile.skills
    .flatMap(s => s.toLowerCase().split(/[\s,&/]+/))
    .filter(token => token.length > 3);

  const matchedSkills = opportunity.skillRequirements.filter(req => {
    const reqTokens = req.toLowerCase().split(/[\s,&/]+/).filter(t => t.length > 3);
    return reqTokens.some(rt => profileTokens.some(pt => pt.includes(rt) || rt.includes(pt)));
  });

  const skillRatio = opportunity.skillRequirements.length > 0
    ? matchedSkills.length / opportunity.skillRequirements.length
    : 0.5;
  const skillFit = Math.min(100, Math.round(skillRatio * 75 + (profile.workExperienceYears > 2 ? 25 : profile.workExperienceYears * 10)));

  // 3. Asset Fit (0 - 100)
  let assetScore = 40; // Base baseline
  if (profile.assets.hasHomeWorkspace) assetScore += 20;
  if (profile.assets.hasTwoWheeler || profile.assets.hasFourWheelerOrCommercialVehicle) assetScore += 20;
  if (profile.transportAccess) assetScore += 10;
  if (profile.storageAccess) assetScore += 10;
  const assetFit = Math.min(100, assetScore);

  // 4. Location Fit (0 - 100)
  // Derived from economic DNA connectivity, local resources, and market proximity
  const locConnectivity = economicDna.dimensions.connectivity.score;
  const locResources = economicDna.dimensions.localResources.score;
  const locationFit = Math.round((locConnectivity * 0.4) + (locResources * 0.6));

  // 5. Demand Signal (0 - 100)
  const demandSignal = economicDna.dimensions.demand.score;

  // 6. Competition Signal (0 - 100)
  // Invert hostile competition: if competition is VERY_HIGH (e.g. 80), competitive signal is lower (e.g. 30)
  const competitionRaw = economicDna.dimensions.competition.score;
  const competitionSignal = Math.max(10, 100 - competitionRaw);

  // 7. Risk Compatibility (0 - 100)
  let riskCompatibility = 70;
  if (profile.riskPreference === 'LOW' && opportunity.keyRisks.length > 3) {
    riskCompatibility = 45;
  } else if (profile.riskPreference === 'HIGH') {
    riskCompatibility = 90;
  } else if (profile.riskPreference === 'MEDIUM') {
    riskCompatibility = 75;
  }

  // 8. Entrepreneur Fit (composite of personality, time, labor)
  let entrepreneurFit = 60;
  if (profile.timeAvailabilityHoursPerDay >= 8) entrepreneurFit += 20;
  else if (profile.timeAvailabilityHoursPerDay >= 4) entrepreneurFit += 10;
  if (profile.familySupport) entrepreneurFit += 10;
  if (profile.labourAvailability !== 'SOLO') entrepreneurFit += 10;
  entrepreneurFit = Math.min(100, entrepreneurFit);

  // Explainable Weighted Composite Score:
  // Weights: Capital (20%), Skill (20%), Demand (15%), Location (15%), Asset (10%), Competition (10%), Risk (10%)
  const compositeScore = Math.round(
    capitalFit * 0.20 +
    skillFit * 0.20 +
    demandSignal * 0.15 +
    locationFit * 0.15 +
    assetFit * 0.10 +
    competitionSignal * 0.10 +
    riskCompatibility * 0.10
  );

  return {
    entrepreneurFit,
    locationFit,
    capitalFit,
    assetFit,
    skillFit,
    demandSignal,
    competitionSignal,
    riskCompatibility,
    compositeScore
  };
}

export function calculateOpportunitySaturation(
  opportunityId: string,
  category: string,
  locationName: string,
  estimatedLocalDemandUnits: number,
  estimatedExistingSupplyUnits: number,
  proposedCapacityUnits: number
): SaturationIntelligence {
  const currentRatio = estimatedLocalDemandUnits > 0
    ? Math.round((estimatedExistingSupplyUnits / estimatedLocalDemandUnits) * 100) / 100
    : 1.0;

  const postEntrySupply = estimatedExistingSupplyUnits + proposedCapacityUnits;
  const postEntryRatio = estimatedLocalDemandUnits > 0
    ? Math.round((postEntrySupply / estimatedLocalDemandUnits) * 100) / 100
    : 1.5;

  const saturationIndex = Math.min(100, Math.round(postEntryRatio * 70));

  let status: 'UNDERSUPPLIED' | 'BALANCED' | 'POTENTIAL_LOCAL_OVERSUPPLY' | 'HYPER_SATURATED' = 'BALANCED';
  let riskExplanation = '';
  const alternativeNiches: string[] = [];

  if (postEntryRatio >= 1.25) {
    status = 'HYPER_SATURATED';
    riskExplanation = `Total category supply (${postEntrySupply.toLocaleString('en-IN')} units) exceeds village demand by ${Math.round((postEntryRatio - 1) * 100)}%. Entering this exact generic segment will spark brutal price wars.`;
    alternativeNiches.push('Specialized Value-Added Processing (e.g. Ready-to-cook vacuum packs)');
    alternativeNiches.push('B2B Supply to Institutional Messes / Mid-day meal schemes in neighboring taluk');
  } else if (postEntryRatio >= 0.95) {
    status = 'POTENTIAL_LOCAL_OVERSUPPLY';
    riskExplanation = `Local market is nearing saturation. While individual demand exists, existing unorganized vendors already fulfill ~${Math.round(currentRatio * 100)}% of demand.`;
    alternativeNiches.push('Direct-to-consumer farm-gate branded retail');
    alternativeNiches.push('Millet health snack distribution across 5 nearby village weekly shandies (haats)');
  } else if (postEntryRatio <= 0.60) {
    status = 'UNDERSUPPLIED';
    riskExplanation = `Substantial supply deficit detected. Current producers fulfill under 60% of estimated local weekly consumption. Strong headroom for fresh production.`;
    alternativeNiches.push('Standard local retail expansion');
  } else {
    status = 'BALANCED';
    riskExplanation = `Demand and supply are currently balanced. A superior quality, hygienic, or packaged alternative can capture market share without destructive discounting.`;
  }

  return {
    opportunityId,
    category,
    location: locationName,
    estimatedLocalDemandUnits,
    estimatedExistingSupplyUnits,
    proposedAdditionalCapacityUnits: proposedCapacityUnits,
    currentSaturationRatio: currentRatio,
    postEntrySaturationRatio: postEntryRatio,
    saturationIndex,
    status,
    riskExplanation,
    alternativeNiches
  };
}
