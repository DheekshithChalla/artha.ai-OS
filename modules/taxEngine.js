/**
 * ArthaOS - Smart Tax Architect (Updated for Budget 2025-26)
 * Precise Old vs New Regime calculation, HRA calculator, and Crossover Deduction Optimizer
 */

export const TaxEngine = {
  // Budget 2025-26 Constants
  STANDARD_DEDUCTION_NEW: 75000,
  STANDARD_DEDUCTION_OLD: 50000,
  REBATE_87A_LIMIT_NEW: 700000,
  REBATE_87A_LIMIT_OLD: 500000,
  CESS_RATE: 0.04,

  /**
   * Calculate HRA Exemption under Section 10(13A) (Old Regime only)
   */
  calculateHRAExemption({ basicSalary, actualRentPaidMonthly, isMetro = true }) {
    if (!actualRentPaidMonthly || actualRentPaidMonthly <= 0 || !basicSalary) {
      return 0;
    }
    const annualRent = actualRentPaidMonthly * 12;
    const assumedHRA = basicSalary * (isMetro ? 0.50 : 0.40); // 50% in metro, 40% non-metro
    const tenPercentBasic = basicSalary * 0.10;
    const rentMinusTen = Math.max(0, annualRent - tenPercentBasic);
    const metroCap = basicSalary * (isMetro ? 0.50 : 0.40);

    // Exemption is minimum of the three conditions
    const exemption = Math.min(assumedHRA, rentMinusTen, metroCap);
    return Math.max(0, Math.round(exemption));
  },

  /**
   * Compute Tax under New Regime (FY 2025-26 / AY 2026-27)
   */
  calculateNewRegime(grossSalary) {
    const taxableIncome = Math.max(0, grossSalary - this.STANDARD_DEDUCTION_NEW);

    // Slabs:
    // 0 - 3L: 0%
    // 3L - 7L: 5% (max 20,000)
    // 7L - 10L: 10% (max 30,000)
    // 10L - 12L: 15% (max 30,000)
    // 12L - 15L: 20% (max 60,000)
    // > 15L: 30%
    let tax = 0;

    if (taxableIncome <= 300000) {
      tax = 0;
    } else if (taxableIncome <= 700000) {
      tax = (taxableIncome - 300000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = 20000 + (taxableIncome - 700000) * 0.10;
    } else if (taxableIncome <= 1200000) {
      tax = 20000 + 30000 + (taxableIncome - 1000000) * 0.15;
    } else if (taxableIncome <= 1500000) {
      tax = 20000 + 30000 + 30000 + (taxableIncome - 1200000) * 0.20;
    } else {
      tax = 20000 + 30000 + 30000 + 60000 + (taxableIncome - 1500000) * 0.30;
    }

    // Section 87A Rebate: if taxable income <= 7,00,000, tax is NIL (marginal relief applies)
    if (taxableIncome <= this.REBATE_87A_LIMIT_NEW) {
      tax = 0;
    }

    const cess = Math.round(tax * this.CESS_RATE);
    const totalTax = Math.round(tax + cess);

    return {
      grossSalary,
      deductions: this.STANDARD_DEDUCTION_NEW,
      taxableIncome,
      baseTax: Math.round(tax),
      cess,
      totalTax,
      effectiveRate: grossSalary > 0 ? ((totalTax / grossSalary) * 100).toFixed(1) : 0
    };
  },

  /**
   * Compute Tax under Old Regime
   */
  calculateOldRegime(grossSalary, deductionsInput) {
    const {
      deductions80C = 0,
      deductions80D = 0,
      nps80CCD = 0,
      homeLoanInterest = 0,
      hraExemption = 0
    } = deductionsInput;

    const capped80C = Math.min(150000, Math.max(0, deductions80C));
    const capped80D = Math.min(100000, Math.max(0, deductions80D)); // self + senior parents
    const cappedNps = Math.min(50000, Math.max(0, nps80CCD));
    const cappedHomeLoan = Math.min(200000, Math.max(0, homeLoanInterest));
    const totalItemizedDeductions = capped80C + capped80D + cappedNps + cappedHomeLoan + hraExemption;

    const totalDeductions = this.STANDARD_DEDUCTION_OLD + totalItemizedDeductions;
    const taxableIncome = Math.max(0, grossSalary - totalDeductions);

    // Old Slabs:
    // 0 - 2.5L: 0%
    // 2.5L - 5L: 5% (max 12,500)
    // 5L - 10L: 20% (max 1,00,000)
    // > 10L: 30%
    let tax = 0;
    if (taxableIncome <= 250000) {
      tax = 0;
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = 12500 + (taxableIncome - 500000) * 0.20;
    } else {
      tax = 12500 + 100000 + (taxableIncome - 1000000) * 0.30;
    }

    // Section 87A Rebate for Old Regime: if taxable income <= 5L, rebate up to 12.5k
    if (taxableIncome <= this.REBATE_87A_LIMIT_OLD) {
      tax = 0;
    }

    const cess = Math.round(tax * this.CESS_RATE);
    const totalTax = Math.round(tax + cess);

    return {
      grossSalary,
      standardDeduction: this.STANDARD_DEDUCTION_OLD,
      itemizedDeductions: totalItemizedDeductions,
      deductionsBreakdown: {
        section80C: capped80C,
        section80D: capped80D,
        nps80CCD: cappedNps,
        homeLoanInterest: cappedHomeLoan,
        hraExemption: Math.round(hraExemption)
      },
      totalDeductions,
      taxableIncome,
      baseTax: Math.round(tax),
      cess,
      totalTax,
      effectiveRate: grossSalary > 0 ? ((totalTax / grossSalary) * 100).toFixed(1) : 0
    };
  },

  /**
   * Side-by-side comparison & recommendation
   */
  compareRegimes(grossSalary, deductionsInput) {
    const hraExemption = this.calculateHRAExemption(deductionsInput);
    const oldRegime = this.calculateOldRegime(grossSalary, { ...deductionsInput, hraExemption });
    const newRegime = this.calculateNewRegime(grossSalary);

    const diff = Math.abs(oldRegime.totalTax - newRegime.totalTax);
    let recommendedRegime = 'NEW';
    let savings = 0;
    let rationale = '';

    if (newRegime.totalTax < oldRegime.totalTax) {
      recommendedRegime = 'NEW';
      savings = oldRegime.totalTax - newRegime.totalTax;
      rationale = `Choose New Tax Regime to save ₹${savings.toLocaleString('en-IN')}. It offers wider slabs, a ₹75,000 standard deduction, and requires zero paperwork or forced investments.`;
    } else if (oldRegime.totalTax < newRegime.totalTax) {
      recommendedRegime = 'OLD';
      savings = newRegime.totalTax - oldRegime.totalTax;
      rationale = `Choose Old Tax Regime to save ₹${savings.toLocaleString('en-IN')}. Your combined deductions (HRA, 80C, 80D, Home Loan) exceed the crossover threshold, making the old deductions worthwhile.`;
    } else {
      recommendedRegime = 'EITHER';
      savings = 0;
      rationale = `Both regimes result in the exact same tax liability (₹${newRegime.totalTax.toLocaleString('en-IN')}). New Regime is generally preferred for simpler compliance with zero documentation.`;
    }

    // Estimate the Crossover Deduction Point
    // How much total deductions in Old Regime are needed to match New Regime tax?
    let crossoverDeductionsNeeded = 0;
    if (grossSalary > 775000) {
      // Approximate iterative search for equal tax
      for (let testD = 100000; testD <= 1200000; testD += 10000) {
        const testOld = this.calculateOldRegime(grossSalary, { deductions80C: Math.min(150000, testD), hraExemption: Math.max(0, testD - 150000) });
        if (testOld.totalTax <= newRegime.totalTax) {
          crossoverDeductionsNeeded = testD;
          break;
        }
      }
    }

    return {
      grossSalary,
      oldRegime,
      newRegime,
      recommendedRegime,
      savings,
      rationale,
      crossoverDeductionsNeeded
    };
  }
};
