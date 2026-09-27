import { ValidationExperiment, ValidationResponse } from '../types/finance-simulation';

export function aggregateValidationExperiment(
  opportunityId: string,
  proposedPrice: number,
  responses: ValidationResponse[]
): ValidationExperiment {
  const totalSample = responses.length;

  if (totalSample === 0) {
    return {
      id: `VAL-${opportunityId}`,
      opportunityId,
      targetSampleSize: 20,
      actualResponsesCount: 0,
      channels: ['DIRECT_INTERVIEW', 'WHATSAPP', 'QR_CODE'],
      metrics: {
        totalSample: 0,
        interestedCount: 0,
        demandValidationRate: 0,
        purchaseIntentScore: 0,
        priceAcceptanceRate: 0,
        repeatPotentialScore: 0,
        averageAcceptedPrice: 0,
        medianAcceptedPrice: 0
      },
      evidenceStrength: 'WEAK',
      isDemoSample: true,
      status: 'ACTIVE'
    };
  }

  const interestedResponses = responses.filter(r => r.isInterested);
  const interestedCount = interestedResponses.length;
  const demandValidationRate = Math.round((interestedCount / totalSample) * 100);

  // Purchase intent scoring
  // DEFINITE = 1.0, PROBABLE = 0.75, MAYBE = 0.4, UNLIKELY = 0
  let totalIntentWeight = 0;
  responses.forEach(r => {
    if (r.purchaseIntent === 'DEFINITE') totalIntentWeight += 1.0;
    else if (r.purchaseIntent === 'PROBABLE') totalIntentWeight += 0.75;
    else if (r.purchaseIntent === 'MAYBE') totalIntentWeight += 0.40;
  });
  const purchaseIntentScore = Math.round((totalIntentWeight / totalSample) * 100);

  // Price acceptance
  const priceAcceptedCount = responses.filter(r => r.acceptedPricePerUnit >= proposedPrice).length;
  const priceAcceptanceRate = Math.round((priceAcceptedCount / totalSample) * 100);

  // Repeat potential: based on expected monthly quantity >= 2 units
  const repeatCount = responses.filter(r => r.expectedMonthlyQuantity >= 2).length;
  const repeatPotentialScore = Math.round((repeatCount / totalSample) * 100);

  // Price stats
  const validPrices = responses.map(r => r.acceptedPricePerUnit).filter(p => p > 0);
  const sumPrice = validPrices.reduce((acc, val) => acc + val, 0);
  const averageAcceptedPrice = validPrices.length > 0 ? Math.round((sumPrice / validPrices.length) * 10) / 10 : proposedPrice;

  validPrices.sort((a, b) => a - b);
  const mid = Math.floor(validPrices.length / 2);
  const medianAcceptedPrice = validPrices.length > 0
    ? (validPrices.length % 2 !== 0 ? validPrices[mid] : (validPrices[mid - 1] + validPrices[mid]) / 2)
    : proposedPrice;

  // Determine evidence strength based on sample size and metrics
  let evidenceStrength: 'WEAK' | 'MODERATE' | 'STRONG' = 'WEAK';
  if (totalSample >= 15 && demandValidationRate >= 65 && (priceAcceptanceRate >= 40 || purchaseIntentScore >= 60)) {
    evidenceStrength = 'STRONG';
  } else if (totalSample >= 8 && demandValidationRate >= 50) {
    evidenceStrength = 'MODERATE';
  }

  const isDemo = responses.some(r => r.isDemoData);

  return {
    id: `VAL-${opportunityId}`,
    opportunityId,
    targetSampleSize: 20,
    actualResponsesCount: totalSample,
    channels: ['QR_CODE', 'WHATSAPP', 'DIRECT_INTERVIEW'],
    metrics: {
      totalSample,
      interestedCount,
      demandValidationRate,
      purchaseIntentScore,
      priceAcceptanceRate,
      repeatPotentialScore,
      averageAcceptedPrice,
      medianAcceptedPrice
    },
    evidenceStrength,
    isDemoSample: isDemo,
    status: totalSample >= 20 ? 'CONCLUDED' : 'ACTIVE'
  };
}
