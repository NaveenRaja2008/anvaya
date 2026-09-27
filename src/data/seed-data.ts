import { EntrepreneurProfile, EvidenceItem, LocalEconomicDna, OpportunityHypothesis } from '../types/domain';
import { ValidationResponse } from '../types/finance-simulation';

export const DEMO_ENTREPRENEUR_PROFILE: EntrepreneurProfile = {
  id: 'EP-RAMESH-001',
  name: 'Ramesh Kumar',
  age: 29,
  location: {
    district: 'Koppal',
    subDistrictOrBlock: 'Yelburga',
    villageOrTown: 'Kuknoor',
    state: 'Karnataka',
    lgdCode: '603412'
  },
  capitalAvailable: 100000, // ₹1,00,000
  assets: {
    hasLand: false,
    hasHomeWorkspace: true,
    workspaceAreaSqFt: 240,
    hasCommercialSpace: false,
    hasTwoWheeler: true,
    hasFourWheelerOrCommercialVehicle: false,
    hasColdStorageAccess: false,
    hasPowerBackup: false,
    machineryOwned: ['Domestic high-torque grinder (1.5 HP)']
  },
  skills: ['Food Preparation & Recipe Blending', 'Grain Sorting & Grading', 'Basic Packaging', 'Local Retail Sales'],
  workExperienceYears: 3,
  experienceDescription: '3 years assisting in rural grain aggregation mandi and local highway canteen food preparation.',
  interests: ['Agro-food processing', 'Packaged healthy food products', 'Local market trading'],
  timeAvailabilityHoursPerDay: 9,
  familySupport: true,
  labourAvailability: 'FAMILY',
  transportAccess: true, // Owns two-wheeler
  storageAccess: true, // Dry home store room
  existingInfrastructure: ['240 sq ft paved home shed', 'Single-phase electricity connection', 'Motorbike with cargo carrier'],
  preferredBusinessType: ['FOOD_PROCESSING', 'AGRI_ALLIED'],
  riskPreference: 'MEDIUM',
  targetMonthlyIncome: 20000,
  hasBusinessIdea: false,
  initialIdeaDescription: undefined,
  createdAt: '2026-09-20T10:00:00Z',
  updatedAt: '2026-09-20T10:00:00Z'
};

export const DEMO_LOCAL_ECONOMIC_DNA: LocalEconomicDna = {
  locationId: 'LOC-KA-KOPPAL-KUKNOOR',
  villageOrTown: 'Kuknoor',
  district: 'Koppal',
  state: 'Karnataka',
  isDemoData: true,
  dimensions: {
    demand: {
      score: 76,
      rating: 'HIGH',
      description: 'Rising household demand for hygienic, stone-free packaged millet flours and breakfast mixes across 12 weekly rural markets.',
      evidenceType: 'DEMO_DATA',
      source: 'District Rural Livelihood Mission Field Survey (Demonstrative)',
      keyDrivers: ['Dietary shift towards millets (Sajje / Navane)', 'Urban returnee influence', 'School and anganwadi nutritional requirements']
    },
    competition: {
      score: 42,
      rating: 'MODERATE',
      description: 'Loose unbranded grains sold in open gunny bags with high debris; only 1 semi-organized mill operating 14 km away.',
      evidenceType: 'DEMO_DATA',
      source: 'Local Market Trade Audit (Demonstrative)',
      keyDrivers: ['Zero branded 500g pouch options in village Kiranas', 'Traditional chakki mills have high adulteration perception']
    },
    supply: {
      score: 86,
      rating: 'VERY_HIGH',
      description: 'Major pearl millet (Bajra) and foxtail millet production belt with direct farm-gate procurement within 8 km radius.',
      evidenceType: 'DEMO_DATA',
      source: 'Karnataka State Agricultural Produce Market Committee Data (Demonstrative)',
      keyDrivers: ['Abundant post-kharif harvest surplus', 'Koppal APMC benchmark prices 20% below state capital retail']
    },
    purchasingPower: {
      score: 56,
      rating: 'MODERATE',
      description: 'Agrarian household cash flows tied to harvest cycles; steady weekly expenditure on packaged grocery staples.',
      evidenceType: 'DEMO_DATA',
      source: 'SECC Household Economic Indicators (Demonstrative)',
      keyDrivers: ['Average monthly grocery spend ₹4,200/household', 'High sensitivity to price beyond ₹70/kg']
    },
    connectivity: {
      score: 72,
      rating: 'HIGH',
      description: 'Direct state highway SH-30 asphalt road connecting to Koppal district center and nearby taluk weekly haats.',
      evidenceType: 'DEMO_DATA',
      source: 'PMGSY Rural Connectivity Index (Demonstrative)',
      keyDrivers: ['All-weather two-wheeler transit', 'Bus frequency every 30 minutes to Yelburga']
    },
    seasonality: {
      score: 64,
      rating: 'MODERATE',
      description: 'Peak production post-harvest (November-February); summer spike in cooling millet porridge/drink flours.',
      evidenceType: 'DEMO_DATA',
      source: 'Agro-Climatic Seasonal Trends (Demonstrative)',
      keyDrivers: ['Winter roti consumption surge', 'Monsoon humidity requires moisture-proof multi-layer packaging']
    },
    localResources: {
      score: 88,
      rating: 'VERY_HIGH',
      description: 'Rich agricultural biomass, active Raitha Samparka Kendras (RSK), and access to women self-help group packaging labor.',
      evidenceType: 'DEMO_DATA',
      source: 'District Resource Inventory (Demonstrative)',
      keyDrivers: ['Local FPO grain cleaning facility available for custom milling', 'Reliable daytime rural feeder power supply']
    }
  },
  primaryCommodities: ['Pearl Millet (Sajje)', 'Foxtail Millet (Navane)', 'Groundnut', 'Bengal Gram'],
  nearbyMarketDistanceKm: 14,
  keyCustomerSegments: ['Rural family households', 'Semi-urban Kirana store owners', 'Local highway dhabas & tea stalls'],
  localSupplyGaps: ['Packaged roasted millet breakfast rava', 'Stone-cleaned pure bajra flour in moisture-barrier pouches'],
  summary: 'Kuknoor cluster exhibits exceptional raw material abundance and high local staple consumption, with low competition in modern packaged form factors.'
};

export const DEMO_OPPORTUNITIES: OpportunityHypothesis[] = [
  {
    id: 'OPP-MILLET-FOOD-001',
    title: 'Millet-Based Micro Food Enterprise (Clean Packaged Flours & Rava)',
    tagline: 'Value-added processing of local Sajje and Navane into branded 500g kitchen-ready packs.',
    category: 'FOOD_PROCESSING',
    whyFitsPerson: [
      'Matches Ramesh’s 3-year grain aggregation & kitchen blending experience',
      'Uses existing 240 sq ft home workspace, avoiding immediate commercial rental overhead',
      'Distribution leverages two-wheeler with rear carrier box across 15 village Kiranas'
    ],
    whyFitsLocation: [
      'Koppal is Karnataka’s prime millet harvest corridor with low raw material transit costs',
      'Local retail audit shows zero branded 500g millet flour options in 8 nearby panchayats',
      'High seasonal demand during winter and festive culinary seasons'
    ],
    localDemandSignal: 'Estimated 3,200 kg monthly consumption in 5-village cluster, currently serviced by uncleaned open grains.',
    competitionSignal: 'Low to moderate; 1 motorized chakki mill 14 km away charging ₹8/kg milling without packaging.',
    capitalRequirement: {
      minimumInitial: 65000,
      recommendedWorkingCapital: 30000,
      totalProjectCost: 95000
    },
    assetRequirements: ['Micro-pulverizer / grain roaster', 'Continuous band pouch sealer', 'Digital weighing balance'],
    skillRequirements: ['Food safety & hygiene protocol', 'Moisture testing', 'Pouch heat-sealing', 'Direct retail order booking'],
    keyRisks: [
      'Moisture spoilage if sealing temperature is inconsistent',
      'Seasonal grain price spikes during July-August pre-harvest lean window',
      'Kirana store credit demands exceeding 20 days'
    ],
    evidenceStrength: 'STRONG',
    saturationRisk: 'LOW',
    fitBreakdown: {
      entrepreneurFit: 88,
      locationFit: 86,
      capitalFit: 94,
      assetFit: 85,
      skillFit: 82,
      demandSignal: 76,
      competitionSignal: 78,
      riskCompatibility: 80,
      compositeScore: 84
    },
    rationale: 'Top recommendation: Capital requirements fall squarely within Ramesh’s ₹1,00,000 threshold while exploiting Koppal’s massive raw millet surplus.',
    defaultUnitEconomics: {
      unitName: '500g Laminated Pouch',
      sellingPricePerUnit: 60,
      rawMaterialCostPerUnit: 24, // 500g graded millet + spices/cleaning
      laborCostPerUnit: 4,
      packagingAndTransportPerUnit: 6, // 3-layer pouch + fuel
      monthlyProductionCapacity: 1000,
      standardFixedMonthlyCost: 7500 // electricity, maintenance, marketing, FSSAI amortization
    }
  },
  {
    id: 'OPP-OIL-EXPELLER-002',
    title: 'Cold-Pressed Groundnut & Sesame Oil Extraction Unit',
    tagline: 'Mini cold-press wooden expeller for fresh, chemical-free cooking oil.',
    category: 'FOOD_PROCESSING',
    whyFitsPerson: [
      'Utilizes agricultural background and commodity sourcing contacts',
      'High community respect for chemical-free oil production'
    ],
    whyFitsLocation: [
      'High groundnut harvest volumes in Koppal district',
      'Severe adulteration concerns with commercial palm-blended pouch oils'
    ],
    localDemandSignal: 'Moderate to high household consumption of cooking oil (approx 3-4 liters per household/month).',
    competitionSignal: 'Moderate; packaged commercial oils available in every shop at lower price point.',
    capitalRequirement: {
      minimumInitial: 145000,
      recommendedWorkingCapital: 45000,
      totalProjectCost: 190000
    },
    assetRequirements: ['Wooden cold-press rotary expeller (Marachekku)', 'Oil settling tank', 'Food-grade stainless containers'],
    skillRequirements: ['Mechanical expeller operation', 'Oil cake cake separation', 'Seed moisture calibration'],
    keyRisks: [
      'Initial capital (₹1.90L) exceeds Ramesh’s ₹1.0L own savings, requiring >₹90k term loan',
      'High seed working capital requirements',
      'Price competition from subsidized palm oils'
    ],
    evidenceStrength: 'MODERATE',
    saturationRisk: 'LOW',
    fitBreakdown: {
      entrepreneurFit: 70,
      locationFit: 82,
      capitalFit: 52,
      assetFit: 60,
      skillFit: 65,
      demandSignal: 72,
      competitionSignal: 60,
      riskCompatibility: 62,
      compositeScore: 66
    },
    rationale: 'Strong long-term potential, but capital requirement exceeds available savings and requires heavy debt before proof-of-demand.',
    defaultUnitEconomics: {
      unitName: '1-Litre Bottle',
      sellingPricePerUnit: 210,
      rawMaterialCostPerUnit: 140,
      laborCostPerUnit: 12,
      packagingAndTransportPerUnit: 16,
      monthlyProductionCapacity: 450,
      standardFixedMonthlyCost: 11000
    }
  },
  {
    id: 'OPP-CATTLE-FEED-003',
    title: 'Custom Cattle Feed & Mineral Fodder Pelletizing',
    tagline: 'Formulated dairy feed pellets using local millet husk, maize cake and mineral supplements.',
    category: 'AGRI_ALLIED',
    whyFitsPerson: [
      'Knowledge of local dairy farmers and village milk collection centers',
      'Family familiarity with livestock feeding practices'
    ],
    whyFitsLocation: [
      'Thriving smallholder dairy clusters in Kuknoor and Yelburga taluk',
      'High cost of branded corporate cattle feed shipped from Hubli'
    ],
    localDemandSignal: 'Over 450 lactating cows and buffaloes within 6 km dairy cooperative routes.',
    competitionSignal: 'High; established corporate feed brands (Godrej, Nandini) supplied via milk societies.',
    capitalRequirement: {
      minimumInitial: 110000,
      recommendedWorkingCapital: 35000,
      totalProjectCost: 145000
    },
    assetRequirements: ['Pelletizer machine (3 HP)', 'Feed mixer drum', 'Heavy-duty weighing scale'],
    skillRequirements: ['Nutritional feed formulation', 'Pellet moisture drying', 'Quality testing'],
    keyRisks: [
      'Credit risk: Dairy farmers pay only after receiving bi-weekly milk cooperative payments',
      'Seasonal pasture availability reduces concentrate feed demand in monsoons'
    ],
    evidenceStrength: 'MODERATE',
    saturationRisk: 'MODERATE',
    fitBreakdown: {
      entrepreneurFit: 68,
      locationFit: 75,
      capitalFit: 64,
      assetFit: 65,
      skillFit: 58,
      demandSignal: 70,
      competitionSignal: 50,
      riskCompatibility: 65,
      compositeScore: 64
    },
    rationale: 'Steady year-round demand, but brand loyalty to Nandini feed and extended credit cycles increase working capital strain.',
    defaultUnitEconomics: {
      unitName: '25kg Feed Bag',
      sellingPricePerUnit: 680,
      rawMaterialCostPerUnit: 490,
      laborCostPerUnit: 35,
      packagingAndTransportPerUnit: 35,
      monthlyProductionCapacity: 250,
      standardFixedMonthlyCost: 12500
    }
  },
  {
    id: 'OPP-TOOL-RENTAL-004',
    title: 'Agri-Tool Rental & Small Sprayer/Brush-Cutter Servicing Hub',
    tagline: 'Shared farm mechanization tools on hourly rent with local maintenance services.',
    category: 'SERVICES',
    whyFitsPerson: [
      'Two-wheeler enables on-field delivery and retrieval of portable tools',
      'Central village location'
    ],
    whyFitsLocation: [
      'Labor scarcity during weeding and spraying seasons',
      'Smallholder farmers cannot afford individual power weeders and battery sprayers'
    ],
    localDemandSignal: 'Peak seasonal demand for weeders and knapsack sprayers during kharif cropping.',
    competitionSignal: 'Low; local farmers rely on borrowing from neighbors or manual labor.',
    capitalRequirement: {
      minimumInitial: 75000,
      recommendedWorkingCapital: 15000,
      totalProjectCost: 90000
    },
    assetRequirements: ['3x Battery sprayers', '2x Portable brush-cutters', 'Basic tool set & spare parts inventory'],
    skillRequirements: ['2-stroke engine maintenance', 'Electrical battery diagnostics', 'Equipment rental contract management'],
    keyRisks: [
      'Ramesh lacks mechanical diagnostic and repair certification',
      'Severe idle time during dry summer months (4 months low revenue)',
      'Equipment damage during rough field handling'
    ],
    evidenceStrength: 'WEAK',
    saturationRisk: 'LOW',
    fitBreakdown: {
      entrepreneurFit: 55,
      locationFit: 78,
      capitalFit: 88,
      assetFit: 70,
      skillFit: 42,
      demandSignal: 65,
      competitionSignal: 80,
      riskCompatibility: 60,
      compositeScore: 62
    },
    rationale: 'Capital fits well, but the low skill match for mechanical repairs and acute seasonality make this risky as a primary livelihood.',
    defaultUnitEconomics: {
      unitName: 'Daily Equipment Rental Unit',
      sellingPricePerUnit: 350,
      rawMaterialCostPerUnit: 40, // fuel & oil
      laborCostPerUnit: 50,
      packagingAndTransportPerUnit: 30,
      monthlyProductionCapacity: 120,
      standardFixedMonthlyCost: 5500
    }
  }
];

export const DEMO_VALIDATION_RESPONSES: ValidationResponse[] = [
  {
    id: 'RESP-01',
    respondentId: 'MALLAPPA-KIRANA',
    respondentType: 'RETAILER',
    isInterested: true,
    purchaseIntent: 'DEFINITE',
    acceptedPricePerUnit: 60,
    expectedMonthlyQuantity: 40,
    currentAlternative: 'Loose uncleaned bajra from Koppal wholesale mandi',
    switchingFactor: 'Pouch packaging protects against weevils and saves store weighing time',
    preferredPurchaseChannel: 'Doorstep weekly replenishment on two-wheeler',
    feedbackNotes: 'Will take 20 packs on 7-day payment trial. Pack must have transparent window to see flour texture.',
    createdAt: '2026-09-22T09:30:00Z',
    isDemoData: true
  },
  {
    id: 'RESP-02',
    respondentId: 'SARASWATHI-HH',
    respondentType: 'CONSUMER',
    isInterested: true,
    purchaseIntent: 'DEFINITE',
    acceptedPricePerUnit: 60,
    expectedMonthlyQuantity: 4,
    currentAlternative: 'Buying grain and taking to local chakki mill',
    switchingFactor: 'Eliminates 2-hour queue at the local noisy grinding mill',
    preferredPurchaseChannel: 'Village grocery store',
    feedbackNotes: 'Stone-free quality is essential; our children complain of sand particles in chakki flour.',
    createdAt: '2026-09-22T10:15:00Z',
    isDemoData: true
  },
  {
    id: 'RESP-03',
    respondentId: 'VEERANNA-TEA-STALL',
    respondentType: 'RETAILER',
    isInterested: true,
    purchaseIntent: 'PROBABLE',
    acceptedPricePerUnit: 55,
    expectedMonthlyQuantity: 50,
    currentAlternative: 'Wheat rava and maida for breakfast snacks',
    switchingFactor: 'Customers actively asking for millet idli and upma for diabetic diet',
    preferredPurchaseChannel: 'Direct delivery',
    feedbackNotes: 'Need 1kg wholesale catering pack at ₹105 instead of 500g pouches.',
    createdAt: '2026-09-22T11:00:00Z',
    isDemoData: true
  },
  {
    id: 'RESP-04',
    respondentId: 'BASAVARAJ-KIRANA-2',
    respondentType: 'RETAILER',
    isInterested: true,
    purchaseIntent: 'DEFINITE',
    acceptedPricePerUnit: 60,
    expectedMonthlyQuantity: 30,
    currentAlternative: 'Branded wheat flour (Aashirvaad)',
    switchingFactor: 'Local brand, higher retail margin (₹10/pack vs ₹4 on branded wheat)',
    preferredPurchaseChannel: 'Direct delivery',
    feedbackNotes: 'Provide a small cardboard hanging display strip for shop counter.',
    createdAt: '2026-09-22T11:45:00Z',
    isDemoData: true
  },
  {
    id: 'RESP-05',
    respondentId: 'LAKSHMI-HH',
    respondentType: 'CONSUMER',
    isInterested: true,
    purchaseIntent: 'PROBABLE',
    acceptedPricePerUnit: 60,
    expectedMonthlyQuantity: 3,
    currentAlternative: 'Home winnowing and hand pounding',
    switchingFactor: 'Saves strenuous manual labor after farm work',
    preferredPurchaseChannel: 'Village Kirana',
    feedbackNotes: 'Flour must not be too fine; Sajje rotis need slight coarseness to roll properly.',
    createdAt: '2026-09-22T14:10:00Z',
    isDemoData: true
  },
  {
    id: 'RESP-06',
    respondentId: 'PRAKASH-DHABA',
    respondentType: 'INSTITUTION',
    isInterested: true,
    purchaseIntent: 'DEFINITE',
    acceptedPricePerUnit: 58,
    expectedMonthlyQuantity: 80,
    currentAlternative: 'Raw grain gunny bags milled once a month',
    switchingFactor: 'Fresh weekly batches prevent flour from turning bitter',
    preferredPurchaseChannel: 'Bi-weekly delivery',
    feedbackNotes: 'Ready to order 40 kg per fortnight if delivery is dependable before 10 AM.',
    createdAt: '2026-09-22T15:00:00Z',
    isDemoData: true
  },
  {
    id: 'RESP-07',
    respondentId: 'HANUMANTHA-HH',
    respondentType: 'CONSUMER',
    isInterested: false,
    purchaseIntent: 'UNLIKELY',
    acceptedPricePerUnit: 40,
    expectedMonthlyQuantity: 1,
    currentAlternative: 'Government PDS rice and own grown jowar',
    switchingFactor: 'None',
    preferredPurchaseChannel: 'PDS depot',
    feedbackNotes: 'Price ₹60 is too expensive compared to free PDS rations.',
    createdAt: '2026-09-22T15:45:00Z',
    isDemoData: true
  },
  {
    id: 'RESP-08',
    respondentId: 'SHANKAR-KIRANA-3',
    respondentType: 'RETAILER',
    isInterested: true,
    purchaseIntent: 'MAYBE',
    acceptedPricePerUnit: 55,
    expectedMonthlyQuantity: 20,
    currentAlternative: 'Unpackaged local supply',
    switchingFactor: 'Better hygiene',
    preferredPurchaseChannel: 'Direct delivery',
    feedbackNotes: 'Wants 30-day credit period. (Note: ANVAYA recommends rejecting >15 day credit).',
    createdAt: '2026-09-22T16:30:00Z',
    isDemoData: true
  },
  {
    id: 'RESP-09',
    respondentId: 'NAGAMMA-HH',
    respondentType: 'CONSUMER',
    isInterested: true,
    purchaseIntent: 'DEFINITE',
    acceptedPricePerUnit: 65,
    expectedMonthlyQuantity: 4,
    currentAlternative: 'Travelling to Koppal town for organic store items',
    switchingFactor: 'Availability right in Kuknoor village',
    preferredPurchaseChannel: 'Home delivery or local shop',
    feedbackNotes: 'Willing to pay ₹65 if guaranteed unpolished foxtail millet.',
    createdAt: '2026-09-23T09:15:00Z',
    isDemoData: true
  },
  {
    id: 'RESP-10',
    respondentId: 'SHIVANAND-HH',
    respondentType: 'CONSUMER',
    isInterested: true,
    purchaseIntent: 'PROBABLE',
    acceptedPricePerUnit: 60,
    expectedMonthlyQuantity: 2,
    currentAlternative: 'Ready-made wheat vermicelli and biscuits',
    switchingFactor: 'Health benefits for elderly parents',
    preferredPurchaseChannel: 'Village grocery shop',
    feedbackNotes: 'Print easy cooking recipes on the back of the pouch.',
    createdAt: '2026-09-23T10:00:00Z',
    isDemoData: true
  },
  {
    id: 'RESP-11',
    respondentId: 'GANGAMMA-HH',
    respondentType: 'CONSUMER',
    isInterested: false,
    purchaseIntent: 'UNLIKELY',
    acceptedPricePerUnit: 45,
    expectedMonthlyQuantity: 1,
    currentAlternative: 'Grinds own grain at home',
    switchingFactor: 'None',
    preferredPurchaseChannel: 'None',
    feedbackNotes: 'Trusts only home stone grinding.',
    createdAt: '2026-09-23T10:45:00Z',
    isDemoData: true
  },
  {
    id: 'RESP-12',
    respondentId: 'MAHESH-HOTEL',
    respondentType: 'INSTITUTION',
    isInterested: true,
    purchaseIntent: 'PROBABLE',
    acceptedPricePerUnit: 55,
    expectedMonthlyQuantity: 60,
    currentAlternative: 'Commercial sooji / rava',
    switchingFactor: 'Specialty "Millet Day" menu on Sundays',
    preferredPurchaseChannel: 'Weekly drop',
    feedbackNotes: 'Texture consistency must be uniform across batches.',
    createdAt: '2026-09-23T11:30:00Z',
    isDemoData: true
  },
  {
    id: 'RESP-13',
    respondentId: 'CHANDRAKALA-HH',
    respondentType: 'CONSUMER',
    isInterested: true,
    purchaseIntent: 'MAYBE',
    acceptedPricePerUnit: 55,
    expectedMonthlyQuantity: 2,
    currentAlternative: 'Millet flour from maternal home in Raichur',
    switchingFactor: 'Convenience of immediate local availability',
    preferredPurchaseChannel: 'Weekly Shandy (Haat)',
    feedbackNotes: 'Start a stall in Kuknoor Thursday shandy.',
    createdAt: '2026-09-23T12:15:00Z',
    isDemoData: true
  },
  {
    id: 'RESP-14',
    respondentId: 'RAMANNA-FARMER-HH',
    respondentType: 'CONSUMER',
    isInterested: false,
    purchaseIntent: 'UNLIKELY',
    acceptedPricePerUnit: 35,
    expectedMonthlyQuantity: 0,
    currentAlternative: 'Grows own bajra in field',
    switchingFactor: 'None',
    preferredPurchaseChannel: 'Self-sufficient',
    feedbackNotes: 'We grow our own crop; would rather sell raw grain to Ramesh.',
    createdAt: '2026-09-23T14:00:00Z',
    isDemoData: true
  },
  {
    id: 'RESP-15',
    respondentId: 'RENUKA-KIRANA-4',
    respondentType: 'RETAILER',
    isInterested: true,
    purchaseIntent: 'DEFINITE',
    acceptedPricePerUnit: 60,
    expectedMonthlyQuantity: 25,
    currentAlternative: 'Loose grains in open trays',
    switchingFactor: 'Packaged items reduce spillage and rat damage in shop',
    preferredPurchaseChannel: 'Weekly visit',
    feedbackNotes: 'Happy with ₹8 margin per pouch. Will pay cash on delivery.',
    createdAt: '2026-09-23T14:45:00Z',
    isDemoData: true
  },
  {
    id: 'RESP-16',
    respondentId: 'KAVITHA-TEACHER-HH',
    respondentType: 'CONSUMER',
    isInterested: true,
    purchaseIntent: 'DEFINITE',
    acceptedPricePerUnit: 65,
    expectedMonthlyQuantity: 3,
    currentAlternative: 'Town supermarket brands during monthly visits',
    switchingFactor: 'Freshness and supporting local village enterprise',
    preferredPurchaseChannel: 'Pre-order via WhatsApp',
    feedbackNotes: 'Provide WhatsApp number on package for monthly repeat subscription.',
    createdAt: '2026-09-23T15:30:00Z',
    isDemoData: true
  },
  {
    id: 'RESP-17',
    respondentId: 'SURESH-CANTEEN',
    respondentType: 'INSTITUTION',
    isInterested: true,
    purchaseIntent: 'PROBABLE',
    acceptedPricePerUnit: 58,
    expectedMonthlyQuantity: 30,
    currentAlternative: 'Loose chakki flour',
    switchingFactor: 'Cleaner flour with zero grit',
    preferredPurchaseChannel: 'Direct delivery',
    feedbackNotes: 'Delivered in 5kg reusable food containers preferred.',
    createdAt: '2026-09-23T16:15:00Z',
    isDemoData: true
  },
  {
    id: 'RESP-18',
    respondentId: 'DEVAPPA-HH',
    respondentType: 'CONSUMER',
    isInterested: false,
    purchaseIntent: 'UNLIKELY',
    acceptedPricePerUnit: 40,
    expectedMonthlyQuantity: 0,
    currentAlternative: 'Prefers white rice and wheat only',
    switchingFactor: 'None',
    preferredPurchaseChannel: 'None',
    feedbackNotes: 'Does not like the taste of coarse millets.',
    createdAt: '2026-09-23T17:00:00Z',
    isDemoData: true
  },
  {
    id: 'RESP-19',
    respondentId: 'ANITA-HH',
    respondentType: 'CONSUMER',
    isInterested: true,
    purchaseIntent: 'PROBABLE',
    acceptedPricePerUnit: 60,
    expectedMonthlyQuantity: 2,
    currentAlternative: 'Packaged cornflakes from town',
    switchingFactor: 'Healthier traditional breakfast for children',
    preferredPurchaseChannel: 'Kirana shop',
    feedbackNotes: 'Millet upma rava is much preferred over plain flour.',
    createdAt: '2026-09-24T09:30:00Z',
    isDemoData: true
  },
  {
    id: 'RESP-20',
    respondentId: 'KOPPAL-SWEET-MEAT',
    respondentType: 'RETAILER',
    isInterested: true,
    purchaseIntent: 'MAYBE',
    acceptedPricePerUnit: 56,
    expectedMonthlyQuantity: 20,
    currentAlternative: 'Wholesale besan and maida blends',
    switchingFactor: 'Developing new "Millet Laddoo" sweet line',
    preferredPurchaseChannel: 'Delivery to shop',
    feedbackNotes: 'Trial batch needed to test binding consistency in jaggery laddoos.',
    createdAt: '2026-09-24T10:30:00Z',
    isDemoData: true
  }
];

export const DEMO_EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    id: 'EVD-LOC-001',
    claim: 'Location: Kuknoor Village, Koppal District, Karnataka (LGD: 603412)',
    evidenceType: 'OBSERVED',
    source: 'Census of India & Local Government Directory (LGD) Metadata',
    date: '2026-09-01',
    confidence: 100,
    origin: 'Official Administrative Cadastre',
    assumptions: ['Administrative borders and PIN code verified'],
    category: 'location'
  },
  {
    id: 'EVD-CAP-001',
    claim: 'Entrepreneur Available Capital: ₹1,00,000 liquid savings',
    evidenceType: 'USER_PROVIDED',
    source: 'Ramesh Kumar Self-Declaration during Adaptive Onboarding',
    date: '2026-09-20',
    confidence: 95,
    origin: 'Direct User Input',
    assumptions: ['Funds held in savings bank account with immediate withdrawal availability'],
    category: 'financial'
  },
  {
    id: 'EVD-SKL-001',
    claim: 'Vocational Capability: 3 years food preparation and grain sorting experience',
    evidenceType: 'USER_PROVIDED',
    source: 'Entrepreneur Work History Declaration',
    date: '2026-09-20',
    confidence: 90,
    origin: 'Direct User Input',
    assumptions: ['Prior canteen kitchen handling and mandi trading familiarity'],
    category: 'skills'
  },
  {
    id: 'EVD-MKT-001',
    claim: 'High Raw Material Abundance: Koppal is a primary bajra and foxtail millet surplus belt',
    evidenceType: 'OBSERVED',
    source: 'Karnataka State Agricultural Produce Market Committee (APMC) Records',
    date: '2026-08-15',
    confidence: 92,
    origin: 'Public Market Yard Inflow Data',
    assumptions: ['Normal monsoon season crop harvest yield'],
    category: 'market'
  },
  {
    id: 'EVD-VAL-001',
    claim: 'Micro-Market Validation: 14 out of 20 surveyed respondents (70%) exhibit direct purchase interest',
    evidenceType: 'VALIDATED',
    source: 'ANVAYA Field Micro-Market Survey (QR / Direct Merchant Interviews)',
    date: '2026-09-24',
    confidence: 85,
    origin: 'Empirical Field Survey Dataset (20 Respondents)',
    assumptions: ['Sample represents local kiranas, village households, and small food outlets'],
    category: 'validation'
  },
  {
    id: 'EVD-VAL-002',
    claim: 'Average accepted price point is ₹57.8 per 500g pouch against proposed ₹60 benchmark',
    evidenceType: 'VALIDATED',
    source: 'Aggregated Survey Price Sensitivity Analysis',
    date: '2026-09-24',
    confidence: 88,
    origin: 'Customer Willingness-to-Pay responses',
    assumptions: ['Price elasticity allows ₹60 standard retail with ₹50-₹55 bulk wholesale discount'],
    category: 'validation'
  },
  {
    id: 'EVD-SIM-001',
    claim: 'Base Case Operating Surplus: ₹18,500/month at 1,000 units monthly output',
    evidenceType: 'SIMULATED',
    source: 'ANVAYA Business Digital Twin Simulation Engine',
    date: '2026-09-25',
    confidence: 82,
    origin: 'Deterministic Cash Flow Model',
    assumptions: [
      'Raw material procured at ₹24/unit',
      'Electricity and fixed costs at ₹7,500/mo',
      'Full capacity utilization achieved by Month 3'
    ],
    category: 'simulation'
  },
  {
    id: 'EVD-SIM-002',
    claim: 'Break-even volume is 313 units/month (Margin of safety: 68.7%)',
    evidenceType: 'SIMULATED',
    source: 'ANVAYA Break-Even Calculation Engine',
    date: '2026-09-25',
    confidence: 90,
    origin: 'Contribution Margin Equation',
    assumptions: ['Unit contribution margin remains ₹24/unit'],
    category: 'simulation'
  },
  {
    id: 'EVD-SIM-003',
    claim: 'Under combined shock (-20% demand, +15% RM, -10% price), surplus compresses to ₹2,420/month',
    evidenceType: 'SIMULATED',
    source: 'ANVAYA Failure Autopsy & Stress Test Engine',
    date: '2026-09-25',
    confidence: 85,
    origin: 'Sensitivity Shock Simulation Matrix',
    assumptions: ['Fixed overheads cannot be reduced in the short term'],
    category: 'simulation'
  },
  {
    id: 'EVD-FIN-001',
    claim: 'Micro Finance Scheme: Project cost ₹95,000 qualifies for up to 90% funding (max ₹85,500)',
    evidenceType: 'INFERRED',
    source: 'SIH Scheme Routing Rules Configuration',
    date: '2026-09-25',
    confidence: 98,
    origin: 'Deterministic Statutory Scheme Rules Engine',
    assumptions: ['Project cost <= ₹1,40,000 ceiling applies'],
    category: 'financial'
  },
  {
    id: 'EVD-FIN-002',
    claim: 'Modelled Sustainable Loan is ₹48,000 vs Maximum Eligible Loan of ₹85,500 (Gap: ₹37,500)',
    evidenceType: 'SIMULATED',
    source: 'ANVAYA Debt Capacity Engine',
    date: '2026-09-25',
    confidence: 88,
    origin: 'Stress-Case DSCR >= 1.25x Boundary Equation',
    assumptions: ['Debt service must remain safe even during rural demand downturns'],
    category: 'financial'
  }
];
