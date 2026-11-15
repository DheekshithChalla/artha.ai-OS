/**
 * ArthaOS - Investing & Portfolio Engine
 * Asset allocation health scoring, risk flags, and inflation-adjusted SIP compounding
 */

export const PortfolioEngine = {
  /**
   * Evaluate Portfolio Health Score & Risk Flags
   */
  evaluateHealth({ equity, debt, gold, cash, age = 28, monthlyExpenses = 45000, totalNetWorth = 1000000 }) {
    const flags = [];
    let healthScore = 100;

    // Rule of thumb for equity: (110 - age)
    const targetEquity = Math.max(20, Math.min(85, 110 - age));
    const equityDiff = equity - targetEquity;

    if (equityDiff > 25) {
      healthScore -= 15;
      flags.push({
        type: 'warning',
        title: 'High Equity Volatility Exposure',
        description: `Equity allocation (${equity}%) is significantly higher than the age-balanced benchmark (${targetEquity}%). Market downturns could trigger emotional panic.`
      });
    } else if (equityDiff < -30) {
      healthScore -= 20;
      flags.push({
        type: 'danger',
        title: 'Severe Inflation Decay Risk',
        description: `Equity allocation (${equity}%) is critically low. Heavy debt/FD concentration (${debt}%) will lose real purchasing power against 6% CPI inflation.`
      });
    }

    // Emergency Fund / Cash Runway Check
    const liquidCashAmount = (cash / 100) * totalNetWorth;
    const monthsRunway = monthlyExpenses > 0 ? (liquidCashAmount / monthlyExpenses) : 6;

    if (monthsRunway < 3) {
      healthScore -= 25;
      flags.push({
        type: 'danger',
        title: 'Vulnerable Emergency Liquidity',
        description: `Liquid reserves cover only ${monthsRunway.toFixed(1)} months of expenses. Target at least 6 months (₹${(monthlyExpenses * 6).toLocaleString('en-IN')}) in a liquid fund / flexi-FD.`
      });
    } else if (monthsRunway > 18) {
      healthScore -= 10;
      flags.push({
        type: 'info',
        title: 'Excess Idle Cash Drag',
        description: `Holding ${monthsRunway.toFixed(1)} months of expenses in low-yield cash accounts drags down compounding. Deploy excess cash into short-duration debt or index SIPs.`
      });
    }

    // Gold Hedging Check
    if (gold < 3) {
      healthScore -= 8;
      flags.push({
        type: 'info',
        title: 'Missing Sovereign Gold Hedge',
        description: 'Holding 5-10% in Sovereign Gold Bonds (SGB) or Gold ETFs provides an essential historical buffer against currency depreciation.'
      });
    } else if (gold > 25) {
      healthScore -= 12;
      flags.push({
        type: 'warning',
        title: 'Overweight in Non-Productive Metal',
        description: `Gold allocation (${gold}%) is excessive. Gold does not produce business cash flows like corporate equities.`
      });
    }

    let rating = 'EXCELLENT';
    if (healthScore < 60) rating = 'HIGH RISK';
    else if (healthScore < 80) rating = 'MODERATE BALANCE';

    return {
      healthScore: Math.max(30, Math.min(100, healthScore)),
      rating,
      targetEquity,
      monthsRunway: monthsRunway.toFixed(1),
      flags,
      recommendationSummary: this.getRecommendationText(flags, targetEquity, equity)
    };
  },

  getRecommendationText(flags, targetEquity, equity) {
    if (flags.length === 0) {
      return 'Your portfolio is optimally diversified for your age and life stage. Maintain your disciplined SIP schedules!';
    }
    return `Artha Advisor suggests rebalancing towards ${targetEquity}% equity, maintaining a guaranteed 6-month liquid cushion, and utilizing low-cost broad market index funds.`;
  },

  /**
   * SIP vs FD vs Inflation Wealth Compounding Simulation
   */
  simulateWealth({ monthlySIP = 10000, equityReturnRate = 12.5, fdReturnRate = 6.5, inflationRate = 6.0, years = 10 }) {
    const months = years * 12;
    const monthlyEquityRate = (equityReturnRate / 100) / 12;
    const monthlyFdRate = (fdReturnRate / 100) / 12;
    const monthlyInflationRate = (inflationRate / 100) / 12;

    const yearlyData = [];
    let totalInvested = 0;
    let equityFV = 0;
    let fdFV = 0;

    for (let m = 1; m <= months; m++) {
      totalInvested += monthlySIP;
      equityFV = (equityFV + monthlySIP) * (1 + monthlyEquityRate);
      fdFV = (fdFV + monthlySIP) * (1 + monthlyFdRate);

      if (m % 12 === 0) {
        const y = m / 12;
        // Real Purchasing Power = Future Value / (1 + inflation)^years
        const realEquityPurchasingPower = equityFV / Math.pow(1 + (inflationRate / 100), y);
        const realFdPurchasingPower = fdFV / Math.pow(1 + (inflationRate / 100), y);

        yearlyData.push({
          year: y,
          invested: Math.round(totalInvested),
          equityNominal: Math.round(equityFV),
          equityReal: Math.round(realEquityPurchasingPower),
          fdNominal: Math.round(fdFV),
          fdReal: Math.round(realFdPurchasingPower),
          wealthAlpha: Math.round(equityFV - fdFV)
        });
      }
    }

    const finalResult = yearlyData[yearlyData.length - 1] || {};

    return {
      totalInvested: Math.round(totalInvested),
      equityFinalValue: Math.round(equityFV),
      fdFinalValue: Math.round(fdFV),
      wealthCreatedBySIP: Math.round(equityFV - totalInvested),
      wealthAlphaOverFD: Math.round(equityFV - fdFV),
      realEquityValue: finalResult.equityReal || 0,
      realFdValue: finalResult.fdReal || 0,
      yearlyData
    };
  }
};
