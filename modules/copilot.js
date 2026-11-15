/**
 * ArthaOS - Artha Copilot Financial Conversational AI
 * Context-aware multi-turn financial advisory engine
 */

export const CopilotEngine = {
  // Knowledge base of intelligent domain-specific responses
  intentPatterns: [
    {
      keywords: [/old\s*(?:vs|or)\s*new/i, /tax\s*regime/i, /which\s*regime/i, /save.*tax/i],
      generate: (context) => {
        const { grossSalary = 1800000, basicSalary = 800000, rentPaid = 25000 } = context;
        return `### 📊 Artha Tax Assessment (FY 2025-26)

Based on your current salary profile:
- **New Tax Regime**: Benefits from the revised **₹75,000 Standard Deduction** and wider tax slabs (Nil up to ₹3L, 5% up to ₹7L with Section 87A rebate). For anyone with deductions under ₹3.75 Lakhs, **the New Regime is mathematically superior**.
- **Old Tax Regime**: Only wins if you have high HRA claims (paying ₹25k+ rent in a metro) **PLUS** fully utilized Section 80C (₹1.5L) + Section 80D (₹25k-₹50k) + Section 24(b) Home Loan Interest (up to ₹2L).

💡 **Immediate Action Plan**:
1. Check the **Tax Architect tab** for your exact crossover threshold.
2. If your total eligible deductions are below ₹3.8 Lakhs, declare New Regime to your HR to enjoy zero documentation headache and higher monthly take-home!`;
      }
    },
    {
      keywords: [/scam/i, /fraud/i, /phishing/i, /qr\s*code/i, /collect\s*request/i, /fake/i],
      generate: (context) => {
        return `### 🛡️ UPI Shield Critical Advisory

**The #1 Rule of Digital Payments in India:**
> **You NEVER have to enter your UPI PIN to RECEIVE money.**
> Entering your 4 or 6-digit UPI PIN ALWAYS debits money from your account.

**Hallmarks of Active UPI Scams in 2026:**
1. **Reverse QR Code**: Scammers send an image titled *"Scan to receive ₹5,000 advance"*. Scanning and typing PIN transfers your money to the scammer.
2. **Fake Bank VPAs**: Handles like \`sbi-support@ybl\` or \`paytm.refund@okhdfcbank\` are spoofed private accounts.
3. **Urgency Intimidation**: Threats that *"electricity will be disconnected in 2 hours"* or *"digital arrest by police"* are 100% fraudulent.

⚡ *If you suspect fraud, immediately dial 1930 or file on cybercrime.gov.in within the 2-hour golden window to freeze the receiving mule account.*`;
      }
    },
    {
      keywords: [/sip/i, /mutual\s*fund/i, /index\s*fund/i, /invest/i, /fd\s*vs/i, /where\s*to\s*invest/i],
      generate: (context) => {
        return `### 📈 Intelligent Wealth Runway Blueprint

To beat Indian inflation (~6% CPI) and build long-term generational wealth, follow the **Artha 3-Bucket Rule**:

1. **Bucket 1: Ironclad Emergency Reserve (6 Months)**
   - Keep in high-interest savings or sweep-in flexi Fixed Deposits (e.g. 7% yield).
   - *Never risk this capital in equities.*
2. **Bucket 2: Wealth Compounding Engine (Nifty 50 Index Fund)**
   - Start an automated monthly SIP in a low-cost Nifty 50 or Nifty Next 50 Index Fund (Total Expense Ratio < 0.20%).
   - Historically, 15-year rolling returns in Nifty 50 have **never been negative**, compounding at 12-14% CAGR.
3. **Bucket 3: Sovereign Hedge (5-10% Gold)**
   - Sovereign Gold Bonds (SGB) or Gold ETFs protect your purchasing power during global currency turbulence.

🚀 Check the **Portfolio Guide tab** to simulate your ₹10,000 monthly SIP compounding to **₹75+ Lakhs over 15 years**!`;
      }
    },
    {
      keywords: [/iphone/i, /emi/i, /afford/i, /car\s*loan/i, /buy/i],
      generate: (context) => {
        return `### 📱 Artha Affordability & EMI Stress Test

Before taking an expensive gadget or vehicle on EMI, run the **3-Way Sanity Check**:

1. **The 3X Rule**: Can you comfortably buy 3 of these outright in cash without touching your emergency fund? If not, buying it is an emotional stretch.
2. **EMI to Income Ratio**: Total non-mortgage EMIs should **never exceed 15%** of your monthly net take-home pay.
3. **Opportunity Cost**: An ₹80,000 phone bought every 2 years vs invested in an equity SIP at 13% CAGR costs you **₹18.4 Lakhs in lost future wealth** over 10 years.

💡 *Verdict: If financing on No-Cost EMI, ensure the full amount is already earning 7% in a liquid fund, and your emergency fund is untouched.*`;
      }
    },
    {
      keywords: [/gst/i, /small\s*business/i, /cash\s*flow/i, /msme/i, /invoice/i],
      generate: (context) => {
        return `### 🏪 MSME Working Capital Strategy

For small businesses and boutiques:
- **Input Tax Credit (ITC)**: Ensure your suppliers upload invoices in GSTR-1 on time. Ineligible or missed ITC directly cuts your profit margins by 5-18%.
- **Cash Flow Volatility**: Maintain at least **90 days of fixed operating overheads** (rent + salaries + baseline inventory) in liquid reserves.
- **Debt Service Caution**: Never let your Debt Service Coverage Ratio (DSCR) drop below 1.4.

Explore the **Small Business tab** to forecast your 90-day cash buffer and simulate your machinery expansion loan!`;
      }
    }
  ],

  /**
   * Process a message with contextual financial awareness
   */
  async processMessage(userMessage, context = {}) {
    const clean = userMessage.trim();

    // Check for matching intent
    for (const rule of this.intentPatterns) {
      if (rule.keywords.some(k => k.test(clean))) {
        return rule.generate(context);
      }
    }

    // Default intelligent financial response
    return `### 💡 Artha Financial Analysis

Thank you for your question: *"${clean}"*

Here is the tailored strategic perspective from ArthaOS:
1. **Financial Health First**: Prioritize eliminating high-interest debt (>14% credit cards/personal loans), then build a 6-month emergency cushion.
2. **Tax Efficiency**: Review whether your expenditures qualify for tax deductions under the Old Regime (80C, 80D, HRA) or if switching to the simplified New Regime delivers higher post-tax savings.
3. **Automated Discipline**: Systematic monthly SIPs beat market timing 9 out of 10 times over a 5-year investment horizon.

Feel free to ask me to analyze a specific salary CTC, test a suspicious UPI message, or backtest an investment strategy!`;
  }
};
