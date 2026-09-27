import { RepaymentInstallment, RepaymentSchedule } from '../types/finance-simulation';

export function calculateRepaymentSchedule(
  loanAmount: number,
  annualInterestRate: number,
  tenureMonths: number,
  moratoriumMonths: number,
  schemeId = 'SCHEME_DEFAULT',
  schemeName = 'Enterprise Loan'
): RepaymentSchedule {
  if (loanAmount <= 0) {
    return {
      schemeId,
      schemeName,
      loanAmount: 0,
      interestRateAnnual: annualInterestRate,
      tenureMonths,
      moratoriumMonths,
      monthlyEmiDuringRepayment: 0,
      totalInterestPaid: 0,
      totalAmountPayable: 0,
      quarterlyEmi: 0,
      installments: []
    };
  }

  const monthlyRate = annualInterestRate / 12;
  const repaymentMonths = Math.max(1, tenureMonths - moratoriumMonths);

  // Standard annuity EMI formula for amortization period
  let monthlyEmi = 0;
  if (monthlyRate > 0) {
    const factor = Math.pow(1 + monthlyRate, repaymentMonths);
    monthlyEmi = Math.round((loanAmount * monthlyRate * factor) / (factor - 1));
  } else {
    monthlyEmi = Math.round(loanAmount / repaymentMonths);
  }

  const installments: RepaymentInstallment[] = [];
  let currentPrincipal = loanAmount;
  let totalInterestPaid = 0;

  // Moratorium phase
  for (let m = 1; m <= moratoriumMonths; m++) {
    const interestDuringMoratorium = Math.round(currentPrincipal * monthlyRate);
    totalInterestPaid += interestDuringMoratorium;
    installments.push({
      month: m,
      isMoratorium: true,
      openingPrincipal: currentPrincipal,
      principalPayment: 0,
      interestPayment: interestDuringMoratorium,
      totalEmi: interestDuringMoratorium,
      closingPrincipal: currentPrincipal
    });
  }

  // Amortization phase
  for (let m = moratoriumMonths + 1; m <= tenureMonths; m++) {
    const interestPart = Math.round(currentPrincipal * monthlyRate);
    let principalPart = monthlyEmi - interestPart;

    // Handle last month balance rounding
    if (m === tenureMonths || principalPart > currentPrincipal) {
      principalPart = currentPrincipal;
      monthlyEmi = principalPart + interestPart;
    }

    currentPrincipal = Math.max(0, currentPrincipal - principalPart);
    totalInterestPaid += interestPart;

    installments.push({
      month: m,
      isMoratorium: false,
      openingPrincipal: currentPrincipal + principalPart,
      principalPayment: principalPart,
      interestPayment: interestPart,
      totalEmi: monthlyEmi,
      closingPrincipal: currentPrincipal
    });

    if (currentPrincipal <= 0) {
      break;
    }
  }

  return {
    schemeId,
    schemeName,
    loanAmount,
    interestRateAnnual: annualInterestRate,
    tenureMonths,
    moratoriumMonths,
    monthlyEmiDuringRepayment: monthlyEmi,
    totalInterestPaid,
    totalAmountPayable: loanAmount + totalInterestPaid,
    quarterlyEmi: monthlyEmi * 3,
    installments
  };
}
