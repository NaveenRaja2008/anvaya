import { z } from 'zod';

export const OnboardingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  district: z.string().min(2, 'District is required'),
  subDistrictOrBlock: z.string().optional(),
  villageOrTown: z.string().min(2, 'Village/Town is required'),
  state: z.string().min(2, 'State is required'),
  capitalAvailable: z.number().nonnegative('Capital cannot be negative'),
  assets: z.object({
    hasLand: z.boolean().default(false),
    landAreaSqFt: z.number().optional(),
    hasHomeWorkspace: z.boolean().default(false),
    workspaceAreaSqFt: z.number().optional(),
    hasCommercialSpace: z.boolean().default(false),
    hasTwoWheeler: z.boolean().default(false),
    hasFourWheelerOrCommercialVehicle: z.boolean().default(false),
    hasColdStorageAccess: z.boolean().default(false),
    hasPowerBackup: z.boolean().default(false),
    machineryOwned: z.array(z.string()).optional()
  }),
  skills: z.array(z.string()).min(1, 'Please specify at least one skill or vocational experience'),
  workExperienceYears: z.number().nonnegative().default(0),
  experienceDescription: z.string().optional(),
  interests: z.array(z.string()).optional().default([]),
  timeAvailabilityHoursPerDay: z.number().min(1).max(24).default(8),
  familySupport: z.boolean().default(true),
  labourAvailability: z.enum(['SOLO', 'FAMILY', 'HIRED_LOCAL']).default('FAMILY'),
  transportAccess: z.boolean().default(false),
  storageAccess: z.boolean().default(false),
  existingInfrastructure: z.array(z.string()).optional().default([]),
  preferredBusinessType: z.array(z.enum(['MANUFACTURING', 'FOOD_PROCESSING', 'SERVICES', 'RETAIL', 'AGRI_ALLIED'])).default(['FOOD_PROCESSING']),
  riskPreference: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  targetMonthlyIncome: z.number().positive().default(20000),
  hasBusinessIdea: z.boolean().default(false),
  initialIdeaDescription: z.string().optional()
});

export const DiscoverOpportunitySchema = z.object({
  profileId: z.string().optional(),
  location: z.object({
    district: z.string(),
    villageOrTown: z.string().optional(),
    state: z.string().optional()
  }).optional()
});

export const ValidationResponseSchema = z.object({
  opportunityId: z.string().min(1),
  respondentIdentifier: z.string().optional(),
  respondentType: z.enum(['CONSUMER', 'RETAILER', 'WHOLESALER', 'INSTITUTION']).default('CONSUMER'),
  isInterested: z.boolean(),
  purchaseIntent: z.enum(['UNLIKELY', 'MAYBE', 'PROBABLE', 'DEFINITE']),
  acceptedPricePerUnit: z.number().positive(),
  expectedMonthlyQuantity: z.number().nonnegative().default(1),
  currentAlternative: z.string().optional(),
  switchingFactor: z.string().optional(),
  preferredPurchaseChannel: z.string().optional(),
  feedbackNotes: z.string().optional()
});

export const SimulationRunSchema = z.object({
  initialInvestment: z.number().positive(),
  sellingPricePerUnit: z.number().positive(),
  monthlyProductionUnits: z.number().positive(),
  fixedCosts: z.object({
    rent: z.number().nonnegative(),
    utilities: z.number().nonnegative(),
    fixedSalaries: z.number().nonnegative(),
    maintenance: z.number().nonnegative(),
    marketingAndAdmin: z.number().nonnegative()
  }),
  variableCostsPerUnit: z.object({
    rawMaterials: z.number().nonnegative(),
    directLabour: z.number().nonnegative(),
    packaging: z.number().nonnegative(),
    transportDelivery: z.number().nonnegative(),
    otherConsumables: z.number().nonnegative()
  }),
  workingCapitalCycleDays: z.number().nonnegative().default(14),
  paymentDelayDays: z.number().nonnegative().default(14),
  growthRateAnnualPercent: z.number().default(5)
});

export const StressTestSchema = z.object({
  demandChangePercent: z.number().min(-90).max(100).default(0),
  sellingPriceChangePercent: z.number().min(-90).max(100).default(0),
  rawMaterialCostChangePercent: z.number().min(-50).max(200).default(0),
  operatingFixedCostChangePercent: z.number().min(-50).max(200).default(0),
  paymentDelayAdditionalDays: z.number().min(0).max(90).default(0),
  supplyDisruptionDays: z.number().min(0).max(30).default(0),
  transportCostChangePercent: z.number().min(0).max(200).default(0),
  equipmentDowntimeDays: z.number().min(0).max(26).default(0)
});

export const RouteSchemeSchema = z.object({
  projectCost: z.number().positive(),
  requestedLoanAmount: z.number().positive().optional()
});

export const RepaymentCalcSchema = z.object({
  loanAmount: z.number().positive(),
  annualInterestRate: z.number().positive(),
  tenureMonths: z.number().positive(),
  moratoriumMonths: z.number().nonnegative().default(0)
});

export const ChatMessageSchema = z.object({
  message: z.string().min(1),
  language: z.enum(['en', 'hi', 'ta', 'te', 'kn', 'ml', 'mr', 'bn', 'gu', 'pa', 'or']).optional().default('en'),
  languagePreference: z.enum(['same_as_interface', 'auto_detect']).optional().default('same_as_interface'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  })).optional()
});
