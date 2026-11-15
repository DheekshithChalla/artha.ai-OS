/**
 * ArthaOS - Smart Budgeting & SMS/UPI Ingestion Engine
 * Parses raw Indian Bank/UPI SMS text into categorized structured transactions
 */

export const BudgetingEngine = {
  /**
   * Merchant to Category Knowledge Base (Indian Ecosystem)
   */
  categoryRules: [
    { category: 'Food & Dining', patterns: [/swiggy/i, /zomato/i, /mcdonald/i, /starbucks/i, /chai\s*point/i, /domino/i, /burger\s*king/i, /restaurant/i, /cafe/i] },
    { category: 'Groceries & Quick Commerce', patterns: [/blinkit/i, /zepto/i, /instamart/i, /bigbasket/i, /dmart/i, /nature.*basket/i, /supermarket/i, /kirana/i] },
    { category: 'Travel & Commute', patterns: [/uber/i, /ola/i, /rapido/i, /metro/i, /irctc/i, /makemytrip/i, /indigo/i, /petrol/i, /fuel/i, /indian\s*oil/i, /hpcl/i, /bpcl/i] },
    { category: 'Investments & Wealth', patterns: [/zerodha/i, /groww/i, /indmoney/i, /mutual\s*fund/i, /upstox/i, /kuvera/i, /uti\s*mf/i, /hdfc\s*amc/i, /icici\s*pru/i, /sbi\s*mf/i, /sip/i] },
    { category: 'Subscriptions & Digital', patterns: [/netflix/i, /spotify/i, /youtube/i, /amazon\s*prime/i, /hotstar/i, /openai/i, /chatgpt/i, /google\s*one/i, /apple\.com/i, /cult\.fit/i] },
    { category: 'Bills & Utilities', patterns: [/bescom/i, /electricity/i, /jio/i, /airtel/i, /vodafone/i, /vi\s*bill/i, /broadband/i, /act\s*corp/i, /piped\s*gas/i, /water\s*board/i] },
    { category: 'Rent & Housing', patterns: [/rent/i, /landlord/i, /nobroker/i, /society\s*maintenance/i, /housing/i] },
    { category: 'Shopping & E-Commerce', patterns: [/amazon/i, /flipkart/i, /myntra/i, /ajio/i, /zara/i, /h&m/i, /meesho/i, /nykaa/i] },
    { category: 'Salary & Inflow', patterns: [/salary/i, /payroll/i, /credited.*neft/i, /dividend/i, /refund/i, /stipend/i] }
  ],

  /**
   * Parse Indian Bank SMS text
   */
  parseSMS(smsText) {
    if (!smsText || typeof smsText !== 'string') {
      throw new Error("Invalid SMS text provided");
    }

    const clean = smsText.trim();
    
    // 1. Transaction Type (Debit vs Credit)
    let type = 'debit';
    if (/credit|credited|received|deposited|refund/i.test(clean) && !/debit.*credit/i.test(clean)) {
      type = 'credit';
    } else if (/debited|sent|paid|spent|withdrawn/i.test(clean)) {
      type = 'debit';
    }

    // 2. Amount Extraction (handles Rs. 489.00, INR 1,45,000.00, Rs 1250, etc.)
    let amount = 0;
    const amountRegex = /(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{1,2})?)/i;
    const amountMatch = clean.match(amountRegex);
    if (amountMatch && amountMatch[1]) {
      amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }

    // 3. Account Mask / Number
    let account = 'Bank Account';
    const acctMatch = clean.match(/(?:A\/c|Acct|Account|Card)\s*(?:no\.?)?\s*([X\*]*\d{3,4})/i);
    if (acctMatch && acctMatch[1]) {
      account = `A/C ${acctMatch[1]}`;
    }

    // 4. UPI Reference ID / RRN
    let refId = '';
    const refMatch = clean.match(/(?:UPI\s*ref(?:erence)?(?:\s*no\.?)?|Ref\s*No\.?|RRN)\s*[:]?\s*([A-Za-z0-9]+)/i);
    if (refMatch && refMatch[1]) {
      refId = refMatch[1];
    } else {
      refId = 'UPI-' + Math.floor(10000000 + Math.random() * 90000000);
    }

    // 5. Merchant Extraction & Normalization
    let merchant = 'Unknown Merchant';
    if (clean.toLowerCase().includes('swiggy')) merchant = 'Swiggy';
    else if (clean.toLowerCase().includes('zomato')) merchant = 'Zomato';
    else if (clean.toLowerCase().includes('uber')) merchant = 'Uber India';
    else if (clean.toLowerCase().includes('blinkit')) merchant = 'Blinkit';
    else if (clean.toLowerCase().includes('zepto')) merchant = 'Zepto';
    else if (clean.toLowerCase().includes('zerodha')) merchant = 'Zerodha Broking';
    else if (clean.toLowerCase().includes('amazon')) merchant = 'Amazon India';
    else if (clean.toLowerCase().includes('netflix')) merchant = 'Netflix';
    else if (clean.toLowerCase().includes('spotify')) merchant = 'Spotify';
    else if (type === 'credit' && clean.toLowerCase().includes('salary')) merchant = 'Employer Payroll';
    else {
      const toMatch = clean.match(/(?:to|at|towards)\s+([A-Za-z0-9\s\.\&\*\-]+?)(?:\s+(?:on|via|ref|upi|using|for|\.|$))/i);
      if (toMatch && toMatch[1]) {
        merchant = toMatch[1].trim().replace(/\b(UPI|ref|bank|ltd|pvt)\b/gi, '').trim();
        if (!merchant) merchant = 'Direct Transfer';
        else {
          // Title Case formatting
          merchant = merchant.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        }
      }
    }

    // 6. Available Balance
    let balance = null;
    const balMatch = clean.match(/(?:Avail(?:able)?\s*Bal(?:ance)?|Bal(?:ance)?)\s*(?:is)?\s*[:]?\s*(?:Rs\.?|INR|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i);
    if (balMatch && balMatch[1]) {
      balance = parseFloat(balMatch[1].replace(/,/g, ''));
    }

    // 7. Auto-Categorize
    let category = 'Uncategorized';
    for (const rule of this.categoryRules) {
      if (rule.patterns.some(p => p.test(clean) || p.test(merchant))) {
        category = rule.category;
        break;
      }
    }
    if (category === 'Uncategorized' && type === 'credit') {
      category = 'Salary & Inflow';
    }

    return {
      id: 'tx-' + Date.now(),
      date: new Date().toISOString(),
      type,
      amount,
      merchant,
      category,
      account,
      refId,
      balance,
      rawText: clean,
      parsedAt: new Date().toLocaleTimeString()
    };
  },

  /**
   * Aggregate spending by category
   */
  calculateCategoryBreakdown(transactions) {
    const totals = {};
    let totalDebit = 0;
    let totalCredit = 0;

    transactions.forEach(tx => {
      if (tx.type === 'debit') {
        totalDebit += tx.amount;
        totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
      } else {
        totalCredit += tx.amount;
      }
    });

    const categories = Object.keys(totals).map(cat => ({
      category: cat,
      amount: totals[cat],
      percentage: totalDebit > 0 ? ((totals[cat] / totalDebit) * 100).toFixed(1) : 0
    })).sort((a, b) => b.amount - a.amount);

    return {
      totalDebit,
      totalCredit,
      netSavings: totalCredit - totalDebit,
      savingsRate: totalCredit > 0 ? (((totalCredit - totalDebit) / totalCredit) * 100).toFixed(1) : 0,
      categories
    };
  },

  /**
   * Detect Recurring Subscriptions & Silent Leaks
   */
  detectSubscriptionLeaks(subscriptions) {
    const totalMonthly = subscriptions.reduce((sum, s) => sum + s.monthlyCost, 0);
    const totalAnnual = totalMonthly * 12;

    const potentialSavings = subscriptions
      .filter(s => s.recommendation.includes('Save'))
      .reduce((sum, s) => {
        const match = s.recommendation.match(/₹([\d,]+)/);
        return sum + (match ? parseInt(match[1].replace(/,/g, '')) : 0);
      }, 0);

    return {
      totalMonthly,
      totalAnnual,
      potentialSavings,
      count: subscriptions.length,
      dormantCount: subscriptions.filter(s => s.usageStatus.toLowerCase().includes('dormant') || s.usageStatus.toLowerCase().includes('low')).length,
      items: subscriptions
    };
  }
};
