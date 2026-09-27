export type EvidenceType =
  | 'OBSERVED'
  | 'INFERRED'
  | 'VALIDATED'
  | 'SIMULATED'
  | 'USER_PROVIDED'
  | 'DEMO_DATA';

export interface EvidenceItem {
  id: string;
  claim: string;
  evidenceType: EvidenceType;
  source: string;
  date: string;
  confidence: number; // 0 - 100
  origin: string;
  assumptions?: string[];
  entityId?: string;
  category: 'location' | 'financial' | 'market' | 'skills' | 'simulation' | 'validation';
}

export type RiskTolerance = 'LOW' | 'MEDIUM' | 'HIGH';
export type BusinessTypePreference = 'MANUFACTURING' | 'FOOD_PROCESSING' | 'SERVICES' | 'RETAIL' | 'AGRI_ALLIED';

export interface EntrepreneurProfile {
  id: string;
  name: string;
  age?: number;
  location: {
    district: string;
    subDistrictOrBlock: string;
    villageOrTown: string;
    state: string;
    lgdCode?: string;
  };
  capitalAvailable: number; // in INR
  assets: {
    hasLand: boolean;
    landAreaSqFt?: number;
    hasHomeWorkspace: boolean;
    workspaceAreaSqFt?: number;
    hasCommercialSpace: boolean;
    hasTwoWheeler: boolean;
    hasFourWheelerOrCommercialVehicle: boolean;
    hasColdStorageAccess: boolean;
    hasPowerBackup: boolean;
    machineryOwned?: string[];
  };
  skills: string[];
  workExperienceYears: number;
  experienceDescription: string;
  interests: string[];
  timeAvailabilityHoursPerDay: number;
  familySupport: boolean;
  labourAvailability: 'SOLO' | 'FAMILY' | 'HIRED_LOCAL';
  transportAccess: boolean;
  storageAccess: boolean;
  existingInfrastructure: string[];
  preferredBusinessType: BusinessTypePreference[];
  riskPreference: RiskTolerance;
  targetMonthlyIncome: number; // in INR
  hasBusinessIdea: boolean;
  initialIdeaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EconomicDnaDimension {
  score: number; // 0 - 100
  rating: 'VERY_LOW' | 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  description: string;
  evidenceType: EvidenceType;
  source: string;
  keyDrivers: string[];
}

export interface LocalEconomicDna {
  locationId: string;
  villageOrTown: string;
  district: string;
  state: string;
  isDemoData: boolean;
  dimensions: {
    demand: EconomicDnaDimension;
    competition: EconomicDnaDimension;
    supply: EconomicDnaDimension;
    purchasingPower: EconomicDnaDimension;
    connectivity: EconomicDnaDimension;
    seasonality: EconomicDnaDimension;
    localResources: EconomicDnaDimension;
  };
  primaryCommodities: string[];
  nearbyMarketDistanceKm: number;
  keyCustomerSegments: string[];
  localSupplyGaps: string[];
  summary: string;
}

export interface FitBreakdown {
  entrepreneurFit: number; // 0-100
  locationFit: number;
  capitalFit: number;
  assetFit: number;
  skillFit: number;
  demandSignal: number;
  competitionSignal: number; // Higher means less hostile competition
  riskCompatibility: number;
  compositeScore: number; // 0-100
}

export interface OpportunityHypothesis {
  id: string;
  title: string;
  tagline: string;
  category: BusinessTypePreference;
  whyFitsPerson: string[];
  whyFitsLocation: string[];
  localDemandSignal: string;
  competitionSignal: string;
  capitalRequirement: {
    minimumInitial: number;
    recommendedWorkingCapital: number;
    totalProjectCost: number;
  };
  assetRequirements: string[];
  skillRequirements: string[];
  keyRisks: string[];
  evidenceStrength: 'WEAK' | 'MODERATE' | 'STRONG';
  saturationRisk: 'LOW' | 'MODERATE' | 'HIGH';
  fitBreakdown: FitBreakdown;
  rationale: string;
  defaultUnitEconomics: {
    unitName: string;
    sellingPricePerUnit: number;
    rawMaterialCostPerUnit: number;
    laborCostPerUnit: number;
    packagingAndTransportPerUnit: number;
    monthlyProductionCapacity: number;
    standardFixedMonthlyCost: number;
  };
}

export interface SaturationIntelligence {
  opportunityId: string;
  category: string;
  location: string;
  estimatedLocalDemandUnits: number;
  estimatedExistingSupplyUnits: number;
  proposedAdditionalCapacityUnits: number;
  currentSaturationRatio: number; // supply / demand
  postEntrySaturationRatio: number;
  saturationIndex: number; // 0 - 100
  status: 'UNDERSUPPLIED' | 'BALANCED' | 'POTENTIAL_LOCAL_OVERSUPPLY' | 'HYPER_SATURATED';
  riskExplanation: string;
  alternativeNiches: string[];
}
