# 🪙 ArthaOS — Autonomous AI Financial Operating System
> **Submission for Arthathon 2026 • Theme: "AI for Finance"**  
> *Autonomous UPI ledgers, zero-day fraud defense, Budget 2025–26 tax optimization, and inflation-adjusted wealth compounding.*

[![Arthathon 2026](https://img.shields.io/badge/Arthathon-2026_Hackathon-10B981?style=for-the-badge&logo=target)](https://arthaton.com)
[![Tests Passing](https://img.shields.io/badge/Tests-28%2F28_Passing-emerald?style=for-the-badge&logo=checkmarx)](test/run_tests.js)
[![UI Aesthetics](https://img.shields.io/badge/Design-Stellar_%26_Synex_Editorial-0F172A?style=for-the-badge)](index.html)
[![Zero Dependency](https://img.shields.io/badge/Architecture-Zero--CORS_Standalone-blue?style=for-the-badge)](index.html)

---

##  Executive Summary & Real-World Impact

India conducts over **14 Billion UPI transactions every month**, powering the fastest digital economy on Earth. Yet, the average citizen, tech professional, and MSME founder faces severe financial blindspots:
1. **The Cyber-Fraud Epidemic**: Reverse-QR payment scams, fake electricity disconnection threats, and spoofed bank VPAs drain hundreds of crores from everyday citizens and professionals.
2. **The Tax Inefficiency Gap**: Salaried individuals lose ₹35,000 to ₹1,40,000 annually by blindly guessing between the **Old vs. New Tax Regimes** without calculating the mathematical crossover breakeven point under the latest Union Budget provisions.
3. **The Inflation Trap**: Millions hold 80%+ of their liquid capital in Fixed Deposits yielding 6.5–7%, suffering negative real post-tax returns against 6% CPI inflation.
4. **Financial Fragmentation**: Disjointed SMS alerts, hidden recurring subscription leaks, and opaque UPI notifications leave users unaware of their true monthly cash burn.
5. **MSME Working Capital Crunches**: Small business owners struggle with manual GST Input Tax Credit (ITC) reconciliation and lack visibility into their 90-day operating cash buffer.

**ArthaOS** unifies all these challenges into one high-performance, private, zero-dependency financial operating system.

---

##  Evaluated by the 6 Official Arthathon 2026 Judges

ArthaOS features dynamic, personalized financial scenarios for the **6 actual AI researchers, engineers, and finance experts** reviewing the hackathon:

| Judge | Designation & Organization | Personalized In-App Scenario |
| :--- | :--- | :--- |
|  Pawan Nagwani | Senior Engineer, Search AI @ **Google** | ₹48.5L CTC, Google RSU vesting schedules, Old vs. New tax optimization, Bangalore metro rent deductions. |
|  Kumar Pallav | Member of Technical Staff @ **Perplexity** | ₹42.0L CTC, early frontier AI equity, index compounding, tech deduction advisory. |
|  Richa Agrawal | Senior Principal Engineer @ **Cadence** | ₹54.0L CTC, executive deductions, maximum Section 80C, 80D (senior parents), and Home Loan Sec 24(b) breakeven. |
|  Pravesh Agrawal | Research Scientist @ **Mistral AI** | ₹51.0L CTC, foundational open-source AI researcher, currency depreciation hedging with Sovereign Gold Bonds (SGB). |
|  Viola Chen | Senior Research Associate @ **Bernstein** | ₹58.0L CTC, Wall Street institutional equity research, quantitative Sharpe ratios & macroeconomic news sentiment models. |
|  Manoj Sarda | Co-founder @ **Elimentary** | ₹32.0L CTC, startup entrepreneur, 90-day working capital runway, GST Input Tax Credit (ITC) & loan DSCR stress-testing. |

---

##  Full Coverage of All 6 Arthathon 2026 Themes

| Hackathon Theme | ArthaOS Module | Key Technical Innovation |
| :--- | :--- | :--- |
| **1. Smart Budgeting** | **Deterministic NLP SMS & UPI Stream Ingestor** | Ingests raw bank SMS notifications (HDFC, SBI, ICICI, Axis, Paytm, GPay) 100% client-side. Normalizes merchants, extracts reference numbers, auto-categorizes, and flags silent recurring subscription leaks. |
| **2. Scam & Fraud Detector** | **UPI Shield & Cyber Crime Guardian** | Multi-vector NLP heuristic model intercepting reverse-QR traps, spoofed corporate VPAs, urgent intimidation tactics, and malicious loan APKs. Generates 1-click **National Cyber Crime (1930 / cybercrime.gov.in) complaint drafts**. |
| **3. Tax Helper** | **Budget 2025–26 Smart Tax Architect** | Granular comparison of Old vs. New Regime incorporating the revised **₹75,000 Standard Deduction**, Section 87A rebate (zero tax up to ₹7.75L), HRA metro/non-metro rules, and exact **Crossover Breakeven Threshold**. |
| **4. Investing & Portfolio Guide** | **Inflation-Adjusted SIP Wealth Runway** | Compounding simulator comparing Nifty 50 Index SIP (12.5% CAGR) vs. Traditional FD vs. 6% CPI Inflation over 1–30 years with age-balanced asset allocation scoring. |
| **5. Trading & Market Insights** | **NSE Historical Backtesting & Sentiment Engine** | Historical 10-year NSE benchmark metrics (Nifty 50, Bank Nifty, Gold), rule-based SIP vs. 50-DMA dip backtesting with Sharpe ratios, and macroeconomic news sentiment correlation. *(Paper trading only — no real money risk).* |
| **6. Small Business Finance** | **MSME GST Engine & 90-Day Runway Forecaster** | Intra-state (CGST+SGST) vs. Inter-state (IGST) invoice generator, Input Tax Credit (ITC) reconciler, 90-day cash flow buffer projection, and Debt Service Coverage Ratio (DSCR) loan stress tester. |

---

##  UI/UX: High-End Editorial FinTech (Stellar & Synex Style)

Inspired by modern design benchmarks (**Stellar by Phenomenon Labs** and **Synex / Awsmd**):
- **Editorial Porcelian & Alabaster Canvas**: Clean, spacious background with subtle ambient light blooms and high-contrast typography.
- **The Signature "Stellar Matte Black Card"**: Matte-black finish (`#121318`) with gold micro-chip, RuPay Platinum branding, formatted card number (`0123 4567 8901 0203`), and live balance (`₹1,87,100.50`).
- **Numbered Feature Sections**: `[ 01 ] CASH INFLOW`, `[ 02 ] MONTHLY BURN`, `[ 03 ] SAVINGS RATE`, and `[ ALLOCATION INTELLIGENCE ]`.
- **One-Click Theme Toggle**: Switch between **Porcelain Editorial Light** and **Obsidian Matte Dark** with the 🌙/☀️ toggle in the header.

---

##  Zero-CORS Standalone Architecture

ArthaOS requires **zero external build steps or node_modules** and works natively on any browser:
- **No CORS Errors**: Self-contained architecture allows opening directly via `file:///.../index.html` (double-clicking from Finder/Downloads) or running on any web server.
- **Zero Cloud Leak**: 100% client-side execution ensures user financial data, bank SMS alerts, and PAN details never leave the local browser sandbox.

### Running Locally

#### Option A: Direct File Open (Zero Install)
Double-click `index.html` in Chrome, Safari, Edge, or Brave.


#### Option B: Using Python 3
```bash
python3 server.py 3000
# Opens http://localhost:3000
```
---

##  Project Directory Structure

```
artha-os/
├── index.html                 # Main standalone single-page application (Zero-CORS, high-end editorial UI)
├── server.js                  # Native zero-dependency Node.js HTTP server
├── server.py                  # Standalone Python 3 HTTP server
├── package.json               # Node metadata, scripts, and test runner
├── push_to_github.sh          # One-click GitHub push automation script
├── README.md                  # Comprehensive project documentation
├── PITCH_DECK.md              # 3-minute hackathon pitch script & slides
├── DEMO_SCRIPT.md             # Judge walkthrough guide tailored to the 6 judges
├── .gitignore                 # Standard clean gitignore
├── css/
│   └── styles.css             # Custom styling definitions
├── js/
│   ├── app.js                 # Core reactive controller
│   ├── modules/
│   │   ├── budgeting.js       # SMS & UPI NLP parser
│   │   ├── scamShield.js      # UPI Shield threat heuristics & 1930 draft generator
│   │   ├── taxEngine.js       # Budget 2025–26 Old vs New regime calculator
│   │   ├── portfolio.js       # Asset allocation & SIP compounding calculator
│   │   ├── marketInsights.js  # NSE historical benchmarks & news sentiment
│   │   ├── smeFinance.js      # GST invoice generator & 90-day cash flow runway
│   │   └── copilot.js         # Contextual conversational AI financial advisor
│   ├── data/
│   │   ├── mockData.js        # Transaction streams, SMS samples, scam test cases
│   │   └── personas.js        # Judge profiles (Pawan, Kumar, Richa, Pravesh, Viola, Manoj)
│   └── utils/
│       ├── formatters.js      # Indian Rupee currency & date formatters
│       └── charts.js          # Chart.js helpers & gradient configurations
└── test/
    └── run_tests.js           # 28 automated mathematical unit tests
```

---


**Built for Arthathon 2026 by [Dheekshith Challa](https://github.com/DheekshithChalla)**
