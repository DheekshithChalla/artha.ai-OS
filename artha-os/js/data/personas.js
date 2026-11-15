/**
 * ArthaOS - Judge Demonstration Personas
 * Instant 1-click test configurations designed to showcase all 6 hackathon tracks
 */

export const JudgePersonas = {
  aarav: {
    id: 'aarav',
    name: 'Aarav Sharma',
    avatar: '👨‍💻',
    tagline: '26 • Senior Software Engineer, Bengaluru',
    context: 'High earner with chaotic UPI spending (Swiggy, Uber, SaaS), unsure whether Old or New Tax Regime saves more money under Budget 2025-26.',
    profile: {
      monthlySalary: 165000,
      annualCTC: 2200000,
      basicSalary: 990000, // 45% of CTC
      actualRentPaidMonthly: 30000, // 3.6L/year in Metro (Bengaluru)
      isMetro: true,
      deductions80C: 150000,
      deductions80D: 25000,
      nps80CCD: 50000,
      homeLoanInterest: 0,
      monthlySavingsTarget: 50000,
      currentPortfolio: {
        equity: 65,
        debt: 20,
        gold: 5,
        cash: 10,
        totalNetWorth: 1450000
      }
    },
    sampleScam: {
      text: "Collect Request of ₹14,999.00 from VPA: sbi-refund-portal@ybl. Remark: 'SBI IT-Refund Auto Release. Enter PIN to verify claim.'",
      vpa: "sbi-refund-portal@ybl"
    },
    sampleSMS: "Sent Rs. 489.00 from HDFC Bank A/C *4012 to SWIGGY UPI ref 43198001 on 14-11-26. Avail Bal: Rs 42,100.50.",
    copilotPrompt: "My annual CTC is ₹22 Lakhs and I pay ₹30,000 monthly rent in Bangalore. Should I choose the Old or New Tax Regime for FY 2025-26?"
  },

  meera: {
    id: 'meera',
    name: 'Meera Patel',
    avatar: '🏪',
    tagline: '38 • Textile Boutique Owner, Jaipur',
    context: 'MSME owner managing ₹6L monthly turnover, battling GST Input Tax Credit (ITC) reconciliations, irregular client receivables, and evaluating a machinery expansion loan.',
    profile: {
      monthlySalary: 85000,
      annualCTC: 1200000,
      basicSalary: 600000,
      actualRentPaidMonthly: 15000,
      isMetro: false,
      deductions80C: 100000,
      deductions80D: 25000,
      nps80CCD: 0,
      homeLoanInterest: 180000,
      monthlySavingsTarget: 25000,
      currentPortfolio: {
        equity: 30,
        debt: 45,
        gold: 15,
        cash: 10,
        totalNetWorth: 2800000
      }
    },
    sampleScam: {
      text: "Urgent GST Compliance Notice: Your GSTIN 08AAACR1234F1Z9 has an overdue penalty of Rs 18,500. Pay immediately at https://gst-eportal-audit.live to avoid immediate bank account freezing.",
      vpa: "gst-audit@okaxis"
    },
    sampleSMS: "A/C *8821 credited with Rs 1,85,000.00 from FABRIC WHOLESALER SURAT via IMPS ref 99481200. Avail Bal: Rs 4,12,000.",
    copilotPrompt: "I am taking a ₹15 Lakh business loan at 11.5% interest for 3 years. Will my current monthly operating cash flow safely cover the EMI?"
  },

  ramesh: {
    id: 'ramesh',
    name: 'Ramesh Kulkarni',
    avatar: '👴',
    tagline: '63 • Retired Bank Manager, Pune',
    context: 'Senior citizen living on pension + Fixed Deposits (FDs). Frequent target of WhatsApp electricity scams and fake digital arrest threats; portfolio losing purchasing power to inflation.',
    profile: {
      monthlySalary: 45000, // Pension
      annualCTC: 650000,
      basicSalary: 400000,
      actualRentPaidMonthly: 0, // Owns home
      isMetro: false,
      deductions80C: 50000,
      deductions80D: 50000, // Senior citizen limit
      nps80CCD: 0,
      homeLoanInterest: 0,
      monthlySavingsTarget: 10000,
      currentPortfolio: {
        equity: 10,
        debt: 80, // High FD concentration
        gold: 5,
        cash: 5,
        totalNetWorth: 4500000
      }
    },
    sampleScam: {
      text: "Urgent Notice: Dear Consumer, your electricity power supply will be disconnected tonight at 9:30 PM from power house because your previous month bill was not updated. Call our nodal officer at 9382109921 immediately.",
      vpa: "elec-collector@paytm"
    },
    sampleSMS: "A/C 2201 credited with Rs. 42,500.00 on 01-Nov-26 towards CENTRAL PENSION. Bal Rs 1,48,900. - Canara Bank",
    copilotPrompt: "I have ₹40 Lakhs in Bank Fixed Deposits yielding 7% interest. Am I losing money to inflation, and is it safe to allocate some to conservative index funds?"
  },

  ananya: {
    id: 'ananya',
    name: 'Ananya Verma',
    avatar: '🎓',
    tagline: '21 • Tech Intern / College Graduate, New Delhi',
    context: 'First job stipend ₹35,000/month. Wants to break the habit of spending everything on Zomato, avoid predatory instant-loan apps, and start her first ₹3,000 SIP.',
    profile: {
      monthlySalary: 35000,
      annualCTC: 420000,
      basicSalary: 210000,
      actualRentPaidMonthly: 12000,
      isMetro: true,
      deductions80C: 0,
      deductions80D: 0,
      nps80CCD: 0,
      homeLoanInterest: 0,
      monthlySavingsTarget: 8000,
      currentPortfolio: {
        equity: 0,
        debt: 20,
        gold: 0,
        cash: 80,
        totalNetWorth: 65000
      }
    },
    sampleScam: {
      text: "Congratulations! Your PAN is approved for instant loan of Rs 50,000 at 0% interest with no CIBIL score. Download fast loan APK http://bit.ly/cash-now-apk to get funds in 5 minutes.",
      vpa: "quick-instant-loan@upi"
    },
    sampleSMS: "Sent Rs. 380.00 to Chai Point via GPay UPI ref 9940121. Account Balance Rs 8,450. - Axis Bank",
    copilotPrompt: "I earn ₹35,000 per month as a fresher. How should I divide my salary between rent, living expenses, emergency fund, and my first mutual fund SIP?"
  }
};
