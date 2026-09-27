import { EntrepreneurProfile, EvidenceItem, LocalEconomicDna, OpportunityHypothesis } from '../types/domain';
import { ValidationResponse } from '../types/finance-simulation';

export interface LocationLookupParams {
  district: string;
  subDistrictOrBlock?: string;
  villageOrTown?: string;
  state: string;
}

export interface IEconomicDataProvider {
  getLocalEconomicDna(location: LocationLookupParams): Promise<LocalEconomicDna>;
  getPrimaryCommodityPrices(district: string): Promise<{ commodity: string; pricePerQuintal: number; market: string; date: string }[]>;
}

export interface IOpportunityDataProvider {
  getOpportunitiesForProfile(profile: EntrepreneurProfile, economicDna: LocalEconomicDna): Promise<OpportunityHypothesis[]>;
  getOpportunityById(id: string): Promise<OpportunityHypothesis | null>;
}

export interface IValidationDataProvider {
  getValidationResponses(opportunityId: string): Promise<ValidationResponse[]>;
  saveValidationResponse(opportunityId: string, response: Omit<ValidationResponse, 'id' | 'createdAt'>): Promise<ValidationResponse>;
}

export interface IEvidenceDataProvider {
  getEvidenceRegister(): Promise<EvidenceItem[]>;
}

export interface IAnvayaDataProvider extends
  IEconomicDataProvider,
  IOpportunityDataProvider,
  IValidationDataProvider,
  IEvidenceDataProvider {}
