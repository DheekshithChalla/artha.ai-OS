/**
 * ArthaOS - Small Business Finance & GST Engine
 * GST invoice generator, 90-day cash flow runway forecaster, and EMI stress tester
 */

export const SmeFinanceEngine = {
  /**
   * GST Invoice Calculation (Intra-state vs Inter-state)
   */
  calculateGST({ baseAmount = 50000, gstRate = 18, isInterState = false, inputTaxCreditAvailable = 3500 }) {
    const totalGSTRateDecimal = gstRate / 100;
    const totalGSTAmount = baseAmount * totalGSTRateDecimal;

    let cgstRate = 0, cgstAmount = 0;
    let sgstRate = 0, sgstAmount = 0;
    let igstRate = 0, igstAmount = 0;

    if (isInterState) {
      igRate = gstRate;
      igstAmount = totalGSTAmount;
    } else {
      cgstRate = gstRate / 2;
      cgstAmount = totalGSTAmount / 2;
      sgstRate = gstRate / 2;
      sgstAmount = totalGSTAmount / 2;
    }

    const grossInvoiceAmount = baseAmount + totalGSTAmount;
    const netGstPayable = Math.max(0, totalGSTAmount - inputTaxCreditAvailable);

    return {
      baseAmount,
      gstRate,
      isInterState,
      cgstRate,
      cgstAmount: Math.round(cgstAmount),
      sgstRate,
      sgstAmount: Math.round(sgstAmount),
      igstRate,
      igstAmount: Math.round(igstAmount),
      totalGST: Math.round(totalGSTAmount),
      grossInvoiceAmount: Math.round(grossInvoiceAmount),
      inputTaxCreditAvailable,
      netGstPayable: Math.round(netGstPayable)
    };
  },

  /**
   * 90-Day Cash Flow Runway & Working Capital Forecast
   */
  forecastRunway({ currentCash = 450000, monthlyInflows = 380000, monthlyFixedOutflows = 240000, monthlyVariableOutflows = 90000 }) {
    const netMonthlyBurnOrSurplus = monthlyInflows - (monthlyFixedOutflows + monthlyVariableOutflows);
    const dailyInflow = monthlyInflows / 30;
    const dailyOutflow = (monthlyFixedOutflows + monthlyVariableOutflows) / 30;

    const runwayPoints = [];
    let runningBalance = currentCash;
    let lowestDip = currentCash;
    let lowestDay = 0;

    for (let day = 1; day <= 90; day++) {
      // Periodic impacts (Day 1: Salaries, Day 15: Advance Tax / GST, Day 25: Supplier invoices)
      let dayOutflow = dailyOutflow;
      let dayInflow = dailyInflow;

      if (day % 30 === 1) dayOutflow += 40000; // Salary surge
      if (day % 30 === 15) dayOutflow += 25000; // GST remittance
      if (day % 15 === 0) dayInflow += 35000; // Client milestone collection

      runningBalance = runningBalance + dayInflow - dayOutflow;
      if (runningBalance < lowestDip) {
        lowestDip = runningBalance;
        lowestDay = day;
      }

      if (day % 5 === 0 || day === 90) {
        runwayPoints.push({
          day: `Day ${day}`,
          balance: Math.round(runningBalance),
          status: runningBalance > 150000 ? 'Healthy' : runningBalance > 50000 ? 'Tight' : 'Critical'
        });
      }
    }

    const monthsOfRunway = (monthlyFixedOutflows + monthlyVariableOutflows) > 0 
      ? (currentCash / (monthlyFixedOutflows + monthlyVariableOutflows)).toFixed(1)
      : '12+';

    return {
      currentCash,
      monthlyInflows,
      monthlyOutflows: monthlyFixedOutflows + monthlyVariableOutflows,
      netMonthlySurplus: netMonthlyBurnOrSurplus,
      monthsOfRunway,
      lowestDip: Math.round(lowestDip),
      lowestDay,
      runwayPoints,
      healthStatus: netMonthlyBurnOrSurplus >= 0 ? 'Cash Flow Positive' : 'Burning Working Capital'
    };
  },

  /**
   * EMI Stress Tester & Debt Service Coverage Ratio (DSCR)
   */
  stressTestLoan({ loanAmount = 1500000, annualInterestRate = 11.5, tenureMonths = 36, monthlyOperatingCashFlow = 95000 }) {
    const monthlyRate = (annualInterestRate / 100) / 12;
    // Standard EMI Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - loanAmount;

    // DSCR = Net Operating Income / Total Debt Service
    const dscr = monthlyOperatingCashFlow / emi;

    let verdict = 'SAFE TO BORROW';
    let badgeClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    let guidance = 'Your monthly operating cash flow comfortably covers the EMI with a robust cushion for unexpected business slowdowns.';

    if (dscr < 1.15) {
      verdict = 'HIGH RISK: OVERLEVERAGED';
      badgeClass = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      guidance = 'Danger: The EMI consumes more than 85% of your operational cash flow. A single client payment delay could force loan default.';
    } else if (dscr < 1.45) {
      verdict = 'MODERATE CAUTION';
      badgeClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      guidance = 'Manageable, but tight. Consider extending tenure to 48 months or securing an overdraft line instead of a fixed term loan.';
    }

    return {
      loanAmount,
      annualInterestRate,
      tenureMonths,
      monthlyEMI: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      dscr: dscr.toFixed(2),
      verdict,
      badgeClass,
      guidance,
      maxSafeEMI: Math.round(monthlyOperatingCashFlow * 0.40)
    };
  }
};
