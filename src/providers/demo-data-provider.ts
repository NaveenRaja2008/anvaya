import { EntrepreneurProfile, EvidenceItem, LocalEconomicDna, OpportunityHypothesis } from '../types/domain';
import { ValidationResponse } from '../types/finance-simulation';
import { IAnvayaDataProvider, LocationLookupParams } from './data-provider.interface';
import {
  DEMO_ENTREPRENEUR_PROFILE,
  DEMO_EVIDENCE_ITEMS,
  DEMO_LOCAL_ECONOMIC_DNA,
  DEMO_OPPORTUNITIES,
  DEMO_VALIDATION_RESPONSES
} from '../data/seed-data';
import { calculateOpportunityFit, calculateOpportunitySaturation } from '../domain/opportunity-engine';

export class DemoDataProvider implements IAnvayaDataProvider {
  private validationResponses: Map<string, ValidationResponse[]> = new Map();
  private evidenceItems: EvidenceItem[] = [...DEMO_EVIDENCE_ITEMS];

  constructor() {
    this.validationResponses.set('OPP-MILLET-FOOD-001', [...DEMO_VALIDATION_RESPONSES]);
  }

  async getLocalEconomicDna(location: LocationLookupParams): Promise<LocalEconomicDna> {
    // If querying demo location Koppal, return Koppal profile
    if (location.district.toLowerCase().includes('koppal') || !location.district) {
      return {
        ...DEMO_LOCAL_ECONOMIC_DNA,
        villageOrTown: location.villageOrTown || DEMO_LOCAL_ECONOMIC_DNA.villageOrTown,
        district: location.district || DEMO_LOCAL_ECONOMIC_DNA.district,
        state: location.state || DEMO_LOCAL_ECONOMIC_DNA.state
      };
    }

    // Dynamic generation for other locations clearly tagged as DEMO DATA
    return {
      locationId: `LOC-DEMO-${location.district.toUpperCase().replace(/\s+/g, '-')}`,
      villageOrTown: location.villageOrTown || 'Rural Cluster',
      district: location.district,
      state: location.state,
      isDemoData: true,
      dimensions: {
        demand: {
          score: 68,
          rating: 'MODERATE',
          description: `Modeled local staple consumption and small retail retail footfall in ${location.district}.`,
          evidenceType: 'DEMO_DATA',
          source: 'Simulated Regional Consumption Proxy (Demonstrative)',
          keyDrivers: ['Local retail aggregation', 'Household staple demand']
        },
        competition: {
          score: 52,
          rating: 'MODERATE',
          description: 'Disorganized local market vendors with limited branded product penetration.',
          evidenceType: 'DEMO_DATA',
          source: 'Simulated Trade Registry (Demonstrative)',
          keyDrivers: ['Few mechanized micro-enterprises']
        },
        supply: {
          score: 74,
          rating: 'HIGH',
          description: `Agricultural and rural raw material harvest surplus in ${location.district} hinterlands.`,
          evidenceType: 'DEMO_DATA',
          source: 'Simulated Agro-Inflow Model (Demonstrative)',
          keyDrivers: ['Direct farm proximity']
        },
        purchasingPower: {
          score: 58,
          rating: 'MODERATE',
          description: 'Rural household liquidity influenced by agricultural harvest cycles.',
          evidenceType: 'DEMO_DATA',
          source: 'Simulated Purchasing Indicator (Demonstrative)',
          keyDrivers: ['Weekly market transactions']
        },
        connectivity: {
          score: 70,
          rating: 'HIGH',
          description: 'State and district highway connectivity with regular bus and goods carrier services.',
          evidenceType: 'DEMO_DATA',
          source: 'Simulated Road Network Index (Demonstrative)',
          keyDrivers: ['All-weather connectivity']
        },
        seasonality: {
          score: 62,
          rating: 'MODERATE',
          description: 'Moderate cyclic variations between post-harvest and monsoon planting seasons.',
          evidenceType: 'DEMO_DATA',
          source: 'Simulated Seasonal Curve (Demonstrative)',
          keyDrivers: ['Post-harvest spending spikes']
        },
        localResources: {
          score: 80,
          rating: 'HIGH',
          description: 'Local agricultural labor availability, cooperative societies, and village electricity feeder lines.',
          evidenceType: 'DEMO_DATA',
          source: 'Simulated Resource Survey (Demonstrative)',
          keyDrivers: ['SHG presence', 'FPO network']
        }
      },
      primaryCommodities: ['Millets', 'Oilseeds', 'Pulses', 'Cereals'],
      nearbyMarketDistanceKm: 16,
      keyCustomerSegments: ['Village households', 'Local tea stalls', 'Weekly shandy vendors'],
      localSupplyGaps: ['Packaged hygiene-inspected foodstuffs', 'Direct farm-to-shop grain processing'],
      summary: `Economic profile for ${location.district} demonstrates steady agrarian base with favorable processing headroom.`
    };
  }

  async getPrimaryCommodityPrices(district: string) {
    return [
      { commodity: 'Pearl Millet (Bajra)', pricePerQuintal: 2350, market: `${district} Mandi Yard`, date: '2026-09-24' },
      { commodity: 'Foxtail Millet (Navane)', pricePerQuintal: 3100, market: `${district} Mandi Yard`, date: '2026-09-24' },
      { commodity: 'Groundnut (Pod)', pricePerQuintal: 5800, market: `${district} Mandi Yard`, date: '2026-09-24' },
      { commodity: 'Bengal Gram (Chana)', pricePerQuintal: 5200, market: `${district} Mandi Yard`, date: '2026-09-24' }
    ];
  }

  async getOpportunitiesForProfile(
    profile: EntrepreneurProfile,
    economicDna: LocalEconomicDna
  ): Promise<OpportunityHypothesis[]> {
    // Recalculate deterministic fit for each opportunity based on this exact profile and economic DNA!
    // This strictly fulfills rule: "Two entrepreneurs in the same village must NOT automatically receive the same recommendation."
    return DEMO_OPPORTUNITIES.map(opp => {
      const fitBreakdown = calculateOpportunityFit(profile, opp, economicDna);
      return {
        ...opp,
        fitBreakdown
      };
    }).sort((a, b) => b.fitBreakdown.compositeScore - a.fitBreakdown.compositeScore);
  }

  async getOpportunityById(id: string): Promise<OpportunityHypothesis | null> {
    const opp = DEMO_OPPORTUNITIES.find(o => o.id === id);
    return opp ? { ...opp } : null;
  }

  async getValidationResponses(opportunityId: string): Promise<ValidationResponse[]> {
    return this.validationResponses.get(opportunityId) || [];
  }

  async saveValidationResponse(
    opportunityId: string,
    response: Omit<ValidationResponse, 'id' | 'createdAt'>
  ): Promise<ValidationResponse> {
    const current = this.validationResponses.get(opportunityId) || [];
    const newRecord: ValidationResponse = {
      ...response,
      id: `RESP-${String(current.length + 1).padStart(2, '0')}`,
      createdAt: new Date().toISOString()
    };
    current.push(newRecord);
    this.validationResponses.set(opportunityId, current);
    return newRecord;
  }

  async getEvidenceRegister(): Promise<EvidenceItem[]> {
    return [...this.evidenceItems];
  }
}

export const defaultDataProvider = new DemoDataProvider();
