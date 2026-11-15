/**
 * ArthaOS - Realistic Indian Financial Datasets
 * Includes real-life SMS patterns, UPI streams, fraud vectors, and tax benchmarks
 */

export const MockTransactions = [
  { id: 'tx-101', date: '2026-11-14T20:15:00', type: 'debit', amount: 489, merchant: 'Swiggy', category: 'Food & Dining', upiId: 'swiggy@icici', account: 'HDFC **4012', note: 'Dinner biryani order', isRecurring: false },
  { id: 'tx-102', date: '2026-11-14T14:30:00', type: 'debit', amount: 320, merchant: 'Uber India', category: 'Travel & Commute', upiId: 'uber.india@axis', account: 'HDFC **4012', note: 'Cab to Indiranagar office', isRecurring: false },
  { id: 'tx-103', date: '2026-11-13T19:45:00', type: 'debit', amount: 1250, merchant: 'Blinkit', category: 'Groceries', upiId: 'blinkit@kotak', account: 'HDFC **4012', note: 'Weekly household essentials', isRecurring: false },
  { id: 'tx-104', date: '2026-11-12T09:00:00', type: 'debit', amount: 25000, merchant: 'Zerodha Broking Ltd', category: 'Investments', upiId: 'zerodha@hdfcbank', account: 'HDFC **4012', note: 'Monthly Index SIP Nifty 50', isRecurring: true },
  { id: 'tx-105', date: '2026-11-10T11:20:00', type: 'debit', amount: 649, merchant: 'Netflix Entertainment', category: 'Subscriptions', upiId: 'netflix@citibank', account: 'HDFC **4012', note: 'Netflix 4K Ultra auto-debit', isRecurring: true },
  { id: 'tx-106', date: '2026-11-08T18:10:00', type: 'debit', amount: 1999, merchant: 'Cult.fit Healthcare', category: 'Health & Fitness', upiId: 'cultfit@yesbank', account: 'HDFC **4012', note: 'Gym membership renewal', isRecurring: true },
  { id: 'tx-107', date: '2026-11-05T12:00:00', type: 'debit', amount: 28000, merchant: 'Suresh Kumar (Landlord)', category: 'Rent & Housing', upiId: 'sureshkumar@okhdfcbank', account: 'HDFC **4012', note: '2BHK Apartment Rent Nov 2026', isRecurring: true },
  { id: 'tx-108', date: '2026-11-04T16:40:00', type: 'debit', amount: 1850, merchant: 'BESCOM Electricity', category: 'Bills & Utilities', upiId: 'bescom@sbi', account: 'HDFC **4012', note: 'October Power Bill', isRecurring: false },
  { id: 'tx-109', date: '2026-11-03T10:15:00', type: 'debit', amount: 119, merchant: 'Spotify India', category: 'Subscriptions', upiId: 'spotify@rbl', account: 'HDFC **4012', note: 'Individual Music Plan', isRecurring: true },
  { id: 'tx-110', date: '2026-11-01T08:00:00', type: 'credit', amount: 145000, merchant: 'Infosys Limited', category: 'Salary / Income', upiId: 'salary@icici', account: 'HDFC **4012', note: 'Monthly Salary Credit', isRecurring: true },
  { id: 'tx-111', date: '2026-10-29T21:30:00', type: 'debit', amount: 3450, merchant: 'Amazon India', category: 'Shopping', upiId: 'amazonpay@apl', account: 'HDFC **4012', note: 'Mechanical Keyboard keycaps', isRecurring: false },
  { id: 'tx-112', date: '2026-10-28T13:20:00', type: 'debit', amount: 1999, merchant: 'OpenAI ChatGPT Plus', category: 'Subscriptions', upiId: 'openai@stripe', account: 'HDFC **4012', note: 'AI Assistant Pro Subscription', isRecurring: true },
  { id: 'tx-113', date: '2026-10-25T15:10:00', type: 'debit', amount: 299, merchant: 'Disney+ Hotstar', category: 'Subscriptions', upiId: 'hotstar@kotak', account: 'HDFC **4012', note: 'Super 3-Month Plan auto-renewal', isRecurring: true },
  { id: 'tx-114', date: '2026-10-22T17:05:00', type: 'debit', amount: 130, merchant: 'Google One Cloud 100GB', category: 'Subscriptions', upiId: 'googleplay@axis', account: 'HDFC **4012', note: 'Storage Backup', isRecurring: true }
];

export const SampleBankSMSList = [
  {
    label: "HDFC Bank - Swiggy Debit",
    text: "Sent Rs. 489.00 from HDFC Bank A/C *4012 to SWIGGY UPI ref 43198001 on 14-11-26. Avail Bal: Rs 42,100.50. Not you? SMS BLOCK to 5676712."
  },
  {
    label: "SBI - Salary Credit",
    text: "Your A/C XXXX1099 has been credited with INR 1,45,000.00 on 01-Nov-26 by NEFT-INFOSYS SALARY. Available Balance is INR 1,87,100.00."
  },
  {
    label: "ICICI - Zerodha SIP Debit",
    text: "Dear Customer, Acct XX552 has been debited for INR 25,000.00 on 12-Nov-26 towards UPI/ZERODHA BROKING/zerodha@hdfcbank. Avl Bal INR 89,450.00."
  },
  {
    label: "Axis Bank - Utility Bill",
    text: "Paid Rs 1,850.00 to BESCOM ELECTRICITY via Axis UPI ref 662019 on 04-Nov-2026. Updated Bank Balance Rs 35,200."
  },
  {
    label: "Paytm Payments Bank - Fuel",
    text: "Rs. 2,100 debited from Wallet / Bank linked to 98******10 at INDIAN OIL PETROL PUMP on 09-11-26 19:12. Ref No: PAYTM99201."
  }
];

export const SampleScamTestCases = [
  {
    id: "scam-1",
    label: "🚨 Reverse QR / Enter PIN Scam (Severe)",
    title: "OLX Buyer Reverse-Charge Fraud",
    text: "Dear Seller, I have sent Rs 25,000 for your used Sofa on OLX. Kindly scan this QR code or accept the PhonePe collect request and ENTER YOUR 6-DIGIT UPI PIN to receive money in your bank instantly.",
    expectedRisk: "CRITICAL",
    category: "Reverse QR / Collect Fraud"
  },
  {
    id: "scam-2",
    label: "⚠️ Fake Electricity Disconnection Threat",
    title: "Urgent Power Cut Phishing SMS",
    text: "Urgent Notice: Dear Consumer, your electricity power supply will be disconnected tonight at 9:30 PM from the power station because your previous month bill was not updated. Immediately call our nodal officer Mr. Sharma at 9382109921 to avoid disconnection.",
    expectedRisk: "CRITICAL",
    category: "Social Engineering Phishing"
  },
  {
    id: "scam-3",
    label: "🚨 Spoofed Bank VPA Collect Request",
    title: "Fake SBI / Paytm Refund Collect",
    text: "Collect Request of ₹14,999.00 from VPA: sbi-refund-portal@ybl. Remark: 'SBI IT-Refund Auto Release. Enter PIN to verify claim.'",
    expectedRisk: "CRITICAL",
    category: "VPA Impersonation Fraud"
  },
  {
    id: "scam-4",
    label: "⚠️ Malicious APK Instant Loan Lure",
    title: "Pre-approved Loan APK Scam",
    text: "Congratulations! Your PAN XXXX912F is approved for instant loan of Rs 5,00,000 at 0% interest with no documents. Download our RBI verified partner app at http://bit.ly/fast-cash-apk9 and claim within 30 mins.",
    expectedRisk: "HIGH",
    category: "Malicious APK / Trojan"
  },
  {
    id: "scam-5",
    label: "✅ Genuine UPI Notification (Safe Benchmark)",
    title: "Official HDFC Merchant Alert",
    text: "Sent Rs. 320.00 from HDFC Bank A/c 4012 to Uber India via UPI ref 4321901 on 14-Nov-2026. Available balance Rs 42,100. Call 18002583838 if not you.",
    expectedRisk: "SAFE",
    category: "Verified Transaction"
  }
];

export const SubscriptionsLeakCatalog = [
  { name: 'Netflix 4K Ultra', monthlyCost: 649, annualDrain: 7788, category: 'Entertainment', usageStatus: 'Low (Watched 2 hrs last month)', recommendation: 'Downgrade to Standard or share plan (Save ₹3,600/yr)' },
  { name: 'Spotify Individual', monthlyCost: 119, annualDrain: 1428, category: 'Music', usageStatus: 'Moderate', recommendation: 'Keep or consider Duo plan if sharing' },
  { name: 'ChatGPT Plus', monthlyCost: 1999, annualDrain: 23988, category: 'Productivity', usageStatus: 'High (Used daily)', recommendation: 'Claim as professional tax deduction' },
  { name: 'Cult.fit Elite Pass', monthlyCost: 1999, annualDrain: 23988, category: 'Fitness', usageStatus: 'Dormant (0 check-ins in 40 days)', recommendation: 'Pause membership immediately (Save ₹11,994)' },
  { name: 'Disney+ Hotstar Super', monthlyCost: 299, annualDrain: 1196, category: 'Streaming', usageStatus: 'Dormant (Watched 0 hrs)', recommendation: 'Cancel auto-debit (Save ₹1,196/yr)' },
  { name: 'Google One 100GB', monthlyCost: 130, annualDrain: 1560, category: 'Storage', usageStatus: 'Essential (85% storage used)', recommendation: 'Switch to Annual Billing at ₹1,300 (Save ₹260)' }
];
