/**
 * ArthaOS - Comprehensive Unit & Financial Mathematics Test Suite
 * Validates Tax calculations, UPI Scam Detection, SMS Ingestion, and SME Formulas
 */

import { Formatters } from '../js/utils/formatters.js';
import { BudgetingEngine } from '../js/modules/budgeting.js';
import { ScamShieldEngine } from '../js/modules/scamShield.js';
import { TaxEngine } from '../js/modules/taxEngine.js';
import { PortfolioEngine } from '../js/modules/portfolio.js';
import { SmeFinanceEngine } from '../js/modules/smeFinance.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('\n===============================================================');
console.log('🧪 RUNNING ARTHA OS TEST SUITE');
console.log('===============================================================\n');

// 1. FORMATTER TESTS
console.log('1. Testing Indian Rupee Currency Formatters:');
assert(Formatters.currency(125000) === '₹1,25,000', 'Formats ₹1,25,000 with Indian numbering');
assert(Formatters.currency(14500000) === '₹1,45,00,000', 'Formats Crores correctly (₹1,45,00,000)');
assert(Formatters.compactCurrency(250000) === '₹2.50 L', 'Formats ₹2.50 Lakhs compactly');
assert(Formatters.compactCurrency(15000000) === '₹1.50 Cr', 'Formats ₹1.50 Crores compactly');

// 2. SMS PARSER TESTS
console.log('\n2. Testing Natural Language Bank SMS Ingestion:');
const hdfcSMS = "Sent Rs. 489.00 from HDFC Bank A/C *4012 to SWIGGY UPI ref 43198001 on 14-11-26. Avail Bal: Rs 42,100.50.";
const parsedHdfc = BudgetingEngine.parseSMS(hdfcSMS);
assert(parsedHdfc.type === 'debit', 'Identifies HDFC debit transaction');
assert(parsedHdfc.amount === 489, 'Extracts amount 489 correctly');
assert(parsedHdfc.merchant === 'Swiggy', 'Normalizes merchant to Swiggy');
assert(parsedHdfc.category === 'Food & Dining', 'Categorizes Swiggy as Food & Dining');
assert(parsedHdfc.account.includes('4012'), 'Extracts masked account number');
assert(parsedHdfc.refId === '43198001', 'Extracts UPI reference number');

const salarySMS = "Your A/C XXXX1099 has been credited with INR 1,45,000.00 on 01-Nov-26 by NEFT-INFOSYS SALARY.";
const parsedSalary = BudgetingEngine.parseSMS(salarySMS);
assert(parsedSalary.type === 'credit', 'Identifies Salary credit transaction');
assert(parsedSalary.amount === 145000, 'Extracts salary amount 1,45,000');
assert(parsedSalary.category === 'Salary & Inflow', 'Categorizes as Salary & Inflow');

// 3. SCAM SHIELD TESTS
console.log('\n3. Testing UPI Shield & Phishing Guardian:');
const reverseQrScam = "Scan this QR code and ENTER YOUR 6-DIGIT UPI PIN to receive Rs 25,000 lottery into your account.";
const scamScan = ScamShieldEngine.analyze(reverseQrScam);
assert(scamScan.score >= 70, 'Flags reverse-QR PIN entry as critical scam (score >= 70)');
assert(scamScan.matchedVectors.some(v => v.id === 'reverse_qr_pin'), 'Triggers Reverse QR fraud vector');

const genuineSMS = "Sent Rs. 320.00 from HDFC Bank A/c 4012 to Uber India via UPI ref 4321901. Available balance Rs 42,100.";
const genuineScan = ScamShieldEngine.analyze(genuineSMS);
assert(genuineScan.riskLevel === 'SAFE', 'Correctly identifies genuine Uber notification as SAFE');

// 4. TAX ARCHITECT TESTS (BUDGET 2025-26)
console.log('\n4. Testing Budget 2025-26 Tax Architect:');
// Under ₹7.75L salaried, New Regime tax is ₹0 due to standard deduction ₹75k + 87A rebate
const lowIncome = TaxEngine.calculateNewRegime(775000);
assert(lowIncome.totalTax === 0, 'Zero tax in New Regime up to ₹7.75 Lakhs for salaried individuals');

// Techie with ₹22L CTC
const comparison = TaxEngine.compareRegimes(2200000, {
  basicSalary: 990000,
  actualRentPaidMonthly: 30000,
  isMetro: true,
  deductions80C: 150000,
  deductions80D: 25000,
  nps80CCD: 50000,
  homeLoanInterest: 0
});
assert(comparison.recommendedRegime === 'NEW' || comparison.recommendedRegime === 'OLD', 'Produces clear winning regime');
assert(comparison.savings > 0, 'Calculates non-zero tax savings between regimes');
assert(comparison.crossoverDeductionsNeeded > 0, 'Calculates exact crossover threshold');

// 5. PORTFOLIO WEALTH SIMULATION TESTS
console.log('\n5. Testing Wealth Compounding & SIP Simulation:');
const wealthSim = PortfolioEngine.simulateWealth({
  monthlySIP: 10000,
  equityReturnRate: 12.0,
  fdReturnRate: 6.0,
  inflationRate: 6.0,
  years: 10
});
assert(wealthSim.totalInvested === 1200000, 'Total invested after 10 years is ₹12,00,000');
assert(wealthSim.equityFinalValue > wealthSim.fdFinalValue, 'Equity SIP beats Fixed Deposit substantially');
assert(wealthSim.wealthAlphaOverFD > 500000, 'Equity creates substantial alpha over traditional FD');

// 6. SME FINANCE & GST TESTS
console.log('\n6. Testing MSME Finance & GST Engine:');
const gstCalc = SmeFinanceEngine.calculateGST({
  baseAmount: 100000,
  gstRate: 18,
  isInterState: false,
  inputTaxCreditAvailable: 5000
});
assert(gstCalc.totalGST === 18000, 'Calculates 18% GST correctly (₹18,000)');
assert(gstCalc.cgstAmount === 9000 && gstCalc.sgstAmount === 9000, 'Splits 9% CGST and 9% SGST for intra-state');
assert(gstCalc.netGstPayable === 13000, 'Reconciles Input Tax Credit (18,000 - 5,000 = 13,000)');

const loanStress = SmeFinanceEngine.stressTestLoan({
  loanAmount: 1000000,
  annualInterestRate: 12.0,
  tenureMonths: 36,
  monthlyOperatingCashFlow: 80000
});
assert(loanStress.monthlyEMI > 30000 && loanStress.monthlyEMI < 35000, 'Calculates realistic EMI (~₹33,214)');
assert(parseFloat(loanStress.dscr) > 2.0, 'Calculates healthy DSCR (> 2.0x)');

console.log('\n===============================================================');
console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('===============================================================\n');

if (failed > 0) process.exit(1);
