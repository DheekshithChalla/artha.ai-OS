/**
 * ArthaOS - Core Application Controller
 * Coordinates UI tabs, judge personas, reactive engines, and live charts
 */

import { MockTransactions, SampleBankSMSList, SampleScamTestCases, SubscriptionsLeakCatalog } from './mockData.js';
import { JudgePersonas } from './personas.js';
import { Formatters } from './utils/formatters.js';
import { BudgetingEngine } from './modules/budgeting.js';
import { ScamShieldEngine } from './modules/scamShield.js';
import { TaxEngine } from './modules/taxEngine.js';
import { PortfolioEngine } from './modules/portfolio.js';
import { MarketInsightsEngine } from './modules/marketInsights.js';
import { SmeFinanceEngine } from './modules/smeFinance.js';
import { CopilotEngine } from './modules/copilot.js';
import { ChartHelpers } from './utils/charts.js';

class ArthaApp {
  constructor() {
    this.currentTab = 'dashboard';
    this.currentPersona = 'aarav';
    this.transactions = [...MockTransactions];
    this.subscriptions = [...SubscriptionsLeakCatalog];
    this.activeCharts = {};

    this.taxInputs = {
      grossSalary: 2200000,
      basicSalary: 990000,
      actualRentPaidMonthly: 30000,
      isMetro: true,
      deductions80C: 150000,
      deductions80D: 25000,
      nps80CCD: 50000,
      homeLoanInterest: 0
    };

    this.wealthInputs = {
      monthlySIP: 15000,
      equityReturnRate: 12.5,
      fdReturnRate: 6.5,
      inflationRate: 6.0,
      years: 15
    };

    this.smeInputs = {
      baseAmount: 65000,
      gstRate: 18,
      isInterState: false,
      inputTaxCreditAvailable: 4200,
      currentCash: 480000,
      monthlyInflows: 380000,
      monthlyFixedOutflows: 220000,
      monthlyVariableOutflows: 75000,
      loanAmount: 1200000,
      loanRate: 11.5,
      loanTenure: 36,
      monthlyOpCashFlow: 85000
    };
  }

  init() {
    this.setupNavigation();
    this.setupPersonaSwitcher();
    this.setupBudgetingHandlers();
    this.setupScamShieldHandlers();
    this.setupTaxEngineHandlers();
    this.setupPortfolioHandlers();
    this.setupMarketHandlers();
    this.setupSmeHandlers();
    this.setupCopilotHandlers();
    this.setupExportHandlers();

    // Initial render
    this.applyPersona(this.currentPersona);
    this.renderCurrentTab();

    // Trigger Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  setupNavigation() {
    const navButtons = document.querySelectorAll('[data-nav-target]');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = btn.getAttribute('data-nav-target');
        this.switchTab(target);
      });
    });
  }

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update nav button classes
    document.querySelectorAll('[data-nav-target]').forEach(btn => {
      if (btn.getAttribute('data-nav-target') === tabId) {
        btn.classList.add('nav-tab-active');
      } else {
        btn.classList.remove('nav-tab-active');
      }
    });

    // Update tab visibility
    document.querySelectorAll('.tab-content-panel').forEach(panel => {
      if (panel.id === `tab-${tabId}`) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });

    this.renderCurrentTab();
    if (window.lucide) window.lucide.createIcons();
  }

  setupPersonaSwitcher() {
    const selector = document.getElementById('persona-select');
    if (selector) {
      selector.addEventListener('change', (e) => {
        this.applyPersona(e.target.value);
      });
    }

    // Quick persona pill clicks
    document.querySelectorAll('[data-persona-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-persona-btn');
        this.applyPersona(pid);
      });
    });
  }

  applyPersona(personaId) {
    this.currentPersona = personaId;
    const p = JudgePersonas[personaId];
    if (!p) return;

    // Update Persona Selector UI
    const selector = document.getElementById('persona-select');
    if (selector) selector.value = personaId;

    // Update Header Pill
    const tag = document.getElementById('current-persona-badge');
    if (tag) {
      tag.innerHTML = `${p.avatar} <span class="font-medium text-slate-200">${p.name}</span> <span class="text-xs text-slate-400">(${p.tagline})</span>`;
    }

    // Sync Tax Inputs
    this.taxInputs.grossSalary = p.profile.annualCTC;
    this.taxInputs.basicSalary = p.profile.basicSalary;
    this.taxInputs.actualRentPaidMonthly = p.profile.actualRentPaidMonthly;
    this.taxInputs.isMetro = p.profile.isMetro;
    this.taxInputs.deductions80C = p.profile.deductions80C;
    this.taxInputs.deductions80D = p.profile.deductions80D;
    this.taxInputs.nps80CCD = p.profile.nps80CCD;
    this.taxInputs.homeLoanInterest = p.profile.homeLoanInterest;

    // Populate Tax Inputs in DOM if they exist
    this.syncTaxFormDOM();

    // Populate Scam sample in Scam Tab
    const scamInput = document.getElementById('scam-input-text');
    if (scamInput && p.sampleScam) {
      scamInput.value = p.sampleScam.text;
    }

    // Populate SMS sample in SMS Tab
    const smsInput = document.getElementById('sms-input-text');
    if (smsInput && p.sampleSMS) {
      smsInput.value = p.sampleSMS;
    }

    this.renderCurrentTab();
    this.showToast(`Switched to persona: ${p.name}`);
  }

  syncTaxFormDOM() {
    const grossEl = document.getElementById('tax-input-gross');
    if (grossEl) grossEl.value = this.taxInputs.grossSalary;

    const basicEl = document.getElementById('tax-input-basic');
    if (basicEl) basicEl.value = this.taxInputs.basicSalary;

    const rentEl = document.getElementById('tax-input-rent');
    if (rentEl) rentEl.value = this.taxInputs.actualRentPaidMonthly;

    const sec80CEl = document.getElementById('tax-input-80c');
    if (sec80CEl) sec80CEl.value = this.taxInputs.deductions80C;

    const sec80DEl = document.getElementById('tax-input-80d');
    if (sec80DEl) sec80DEl.value = this.taxInputs.deductions80D;

    const npsEl = document.getElementById('tax-input-nps');
    if (npsEl) npsEl.value = this.taxInputs.nps80CCD;

    const loanEl = document.getElementById('tax-input-loan');
    if (loanEl) loanEl.value = this.taxInputs.homeLoanInterest;

    const metroEl = document.getElementById('tax-input-metro');
    if (metroEl) metroEl.checked = this.taxInputs.isMetro;
  }

  renderCurrentTab() {
    switch (this.currentTab) {
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'budgeting':
        this.renderBudgetingTab();
        break;
      case 'scam-shield':
        this.renderScamShieldTab();
        break;
      case 'tax-engine':
        this.renderTaxEngineTab();
        break;
      case 'portfolio':
        this.renderPortfolioTab();
        break;
      case 'market-insights':
        this.renderMarketTab();
        break;
      case 'sme-finance':
        this.renderSmeTab();
        break;
      case 'copilot':
        this.renderCopilotTab();
        break;
    }
  }

  renderDashboard() {
    const breakdown = BudgetingEngine.calculateCategoryBreakdown(this.transactions);
    const subLeaks = BudgetingEngine.detectSubscriptionLeaks(this.subscriptions);
    const persona = JudgePersonas[this.currentPersona];
    const portfolioHealth = PortfolioEngine.evaluateHealth({
      ...persona.profile.currentPortfolio,
      monthlyExpenses: breakdown.totalDebit / 2
    });

    // Populate Key Metrics
    const totalSpendEl = document.getElementById('dash-metric-spend');
    if (totalSpendEl) totalSpendEl.textContent = Formatters.currency(breakdown.totalDebit);

    const totalIncomeEl = document.getElementById('dash-metric-income');
    if (totalIncomeEl) totalIncomeEl.textContent = Formatters.currency(breakdown.totalCredit);

    const savingsRateEl = document.getElementById('dash-metric-savings-rate');
    if (savingsRateEl) savingsRateEl.textContent = `${breakdown.savingsRate}%`;

    const subLeakEl = document.getElementById('dash-metric-sub-leaks');
    if (subLeakEl) subLeakEl.textContent = Formatters.currency(subLeaks.potentialSavings);

    const healthScoreEl = document.getElementById('dash-health-score');
    if (healthScoreEl) healthScoreEl.textContent = `${portfolioHealth.healthScore}/100`;

    // Render Recent Transactions
    const recentTxList = document.getElementById('dash-recent-tx-list');
    if (recentTxList) {
      recentTxList.innerHTML = this.transactions.slice(0, 5).map(tx => `
        <div class="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full ${tx.type === 'debit' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'} flex items-center justify-center font-bold text-sm">
              ${tx.type === 'debit' ? '↓' : '↑'}
            </div>
            <div>
              <p class="font-medium text-slate-200 text-sm">${tx.merchant}</p>
              <p class="text-xs text-slate-400">${tx.category} • ${Formatters.date(tx.date)}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-semibold text-sm tnum ${tx.type === 'debit' ? 'text-slate-100' : 'text-emerald-400'}">
              ${tx.type === 'debit' ? '-' : '+'}${Formatters.currency(tx.amount)}
            </p>
            <p class="text-xs text-slate-500">${tx.account}</p>
          </div>
        </div>
      `).join('');
    }

    // Render Subscription Leaks
    const subList = document.getElementById('dash-sub-leaks-list');
    if (subList) {
      subList.innerHTML = this.subscriptions.slice(0, 4).map(sub => `
        <div class="p-3 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-amber-500/30 transition">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-sm text-slate-200">${sub.name}</span>
            <span class="text-xs text-amber-400 font-mono font-medium">${Formatters.currency(sub.monthlyCost)}/mo</span>
          </div>
          <p class="text-xs text-slate-400 mt-1">${sub.usageStatus}</p>
          <p class="text-xs text-emerald-400 mt-0.5 font-medium">💡 ${sub.recommendation}</p>
        </div>
      `).join('');
    }

    // Render Category Chart
    const chartCanvas = document.getElementById('dash-category-chart');
    if (chartCanvas) {
      if (this.activeCharts.dashCategory) this.activeCharts.dashCategory.destroy();
      this.activeCharts.dashCategory = ChartHelpers.createCategoryChart(chartCanvas, breakdown.categories);
    }
  }

  setupBudgetingHandlers() {
    const parseBtn = document.getElementById('btn-parse-sms');
    if (parseBtn) {
      parseBtn.addEventListener('click', () => {
        const text = document.getElementById('sms-input-text')?.value;
        if (!text) return this.showToast('Please paste a bank or UPI SMS alert');
        try {
          const parsed = BudgetingEngine.parseSMS(text);
          this.transactions.unshift(parsed);
          this.renderBudgetingTab();
          this.showToast(`Successfully categorized: ${parsed.merchant} (${Formatters.currency(parsed.amount)})`);
          if (window.confetti) window.confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
        } catch (err) {
          this.showToast('Failed to parse SMS format: ' + err.message);
        }
      });
    }

    // Sample SMS buttons
    const samplesContainer = document.getElementById('sms-samples-list');
    if (samplesContainer) {
      samplesContainer.innerHTML = SampleBankSMSList.map((s, idx) => `
        <button class="text-left text-xs p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 text-slate-300 transition" data-sms-sample="${idx}">
          <span class="font-semibold text-emerald-400 block">${s.label}</span>
          <span class="text-slate-400 line-clamp-1">${s.text}</span>
        </button>
      `).join('');

      samplesContainer.querySelectorAll('[data-sms-sample]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-sms-sample'));
          const s = SampleBankSMSList[idx];
          const input = document.getElementById('sms-input-text');
          if (input) input.value = s.text;
        });
      });
    }
  }

  renderBudgetingTab() {
    const breakdown = BudgetingEngine.calculateCategoryBreakdown(this.transactions);

    const fullTxTable = document.getElementById('budget-tx-table-body');
    if (fullTxTable) {
      fullTxTable.innerHTML = this.transactions.map(tx => `
        <tr class="border-b border-slate-800/60 hover:bg-slate-800/20 text-xs transition">
          <td class="p-3 text-slate-400">${Formatters.dateTime(tx.date)}</td>
          <td class="p-3 font-medium text-slate-200">${tx.merchant}</td>
          <td class="p-3"><span class="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px]">${tx.category}</span></td>
          <td class="p-3 text-slate-400 font-mono text-[11px]">${tx.refId || 'N/A'}</td>
          <td class="p-3 text-right font-semibold tnum ${tx.type === 'debit' ? 'text-slate-100' : 'text-emerald-400'}">
            ${tx.type === 'debit' ? '-' : '+'}${Formatters.currency(tx.amount)}
          </td>
        </tr>
      `).join('');
    }

    const catChartCanvas = document.getElementById('budgeting-category-chart');
    if (catChartCanvas) {
      if (this.activeCharts.budgetCategory) this.activeCharts.budgetCategory.destroy();
      this.activeCharts.budgetCategory = ChartHelpers.createCategoryChart(catChartCanvas, breakdown.categories);
    }
  }

  setupScamShieldHandlers() {
    const scanBtn = document.getElementById('btn-scan-scam');
    if (scanBtn) {
      scanBtn.addEventListener('click', () => {
        const text = document.getElementById('scam-input-text')?.value;
        const vpa = document.getElementById('scam-input-vpa')?.value;
        if (!text) return this.showToast('Please paste a message or collect request text');

        const analysis = ScamShieldEngine.analyze(text, vpa);
        this.displayScamResult(analysis, text, vpa);

        if (analysis.score >= 70 && window.confetti) {
          // Alert tone
          this.showToast('🚨 Threat Intercepted! Scam Shield Vector Flagged.');
        } else {
          this.showToast('Scan complete: ' + analysis.riskLevel);
        }
      });
    }

    // Sample Scam Test Cases
    const scamSamplesBox = document.getElementById('scam-samples-grid');
    if (scamSamplesBox) {
      scamSamplesBox.innerHTML = SampleScamTestCases.map((s, idx) => `
        <button class="p-3 text-left rounded-lg bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 text-xs transition" data-scam-idx="${idx}">
          <span class="font-semibold block text-slate-200 mb-1">${s.label}</span>
          <span class="text-slate-400 line-clamp-2">${s.text}</span>
        </button>
      `).join('');

      scamSamplesBox.querySelectorAll('[data-scam-idx]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-scam-idx'));
          const s = SampleScamTestCases[idx];
          const textEl = document.getElementById('scam-input-text');
          if (textEl) textEl.value = s.text;
          const vpaEl = document.getElementById('scam-input-vpa');
          if (vpaEl) vpaEl.value = s.id === 'scam-3' ? 'sbi-refund-portal@ybl' : '';
        });
      });
    }
  }

  displayScamResult(analysis, originalText, incidentVpa) {
    const resultBox = document.getElementById('scam-result-box');
    if (!resultBox) return;

    resultBox.classList.remove('hidden');

    const scoreEl = document.getElementById('scam-score-badge');
    if (scoreEl) {
      scoreEl.className = `badge-pill text-sm px-3 py-1 ${analysis.badgeClass}`;
      scoreEl.innerHTML = `Threat Score: ${analysis.score}/100 • ${analysis.riskLevel}`;
    }

    const summaryEl = document.getElementById('scam-summary-text');
    if (summaryEl) summaryEl.textContent = analysis.summary;

    const vectorsList = document.getElementById('scam-vectors-list');
    if (vectorsList) {
      if (analysis.matchedVectors.length === 0) {
        vectorsList.innerHTML = `<li class="text-slate-400 text-xs italic">No known malicious fraud heuristics triggered.</li>`;
      } else {
        vectorsList.innerHTML = analysis.matchedVectors.map(v => `
          <li class="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-xs">
            <span class="font-bold text-rose-300 block mb-0.5">⚠️ ${v.name} (Risk Weight: +${v.severity})</span>
            <span class="text-slate-300">${v.description}</span>
          </li>
        `).join('');
      }
    }

    const recsList = document.getElementById('scam-recommendations-list');
    if (recsList) {
      recsList.innerHTML = analysis.recommendations.map(r => `
        <li class="flex items-start gap-2 text-xs text-slate-300">
          <span class="text-emerald-400 font-bold">✓</span>
          <span>${r}</span>
        </li>
      `).join('');
    }

    // Set complaint draft text
    const complaintDraft = ScamShieldEngine.generateComplaintDraft(originalText, JudgePersonas[this.currentPersona].name, incidentVpa || 'Unknown');
    const complaintBox = document.getElementById('scam-complaint-draft');
    if (complaintBox) complaintBox.value = complaintDraft;

    const copyBtn = document.getElementById('btn-copy-complaint');
    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(complaintDraft);
        this.showToast('Copied formal complaint draft to clipboard!');
      };
    }
  }

  renderScamShieldTab() {
    // If input already has text from persona, auto-run scan once
    const textEl = document.getElementById('scam-input-text');
    if (textEl && textEl.value && document.getElementById('scam-result-box')?.classList.contains('hidden')) {
      const vpa = document.getElementById('scam-input-vpa')?.value;
      const analysis = ScamShieldEngine.analyze(textEl.value, vpa);
      this.displayScamResult(analysis, textEl.value, vpa);
    }
  }

  setupTaxEngineHandlers() {
    const recalc = () => {
      this.taxInputs.grossSalary = parseFloat(document.getElementById('tax-input-gross')?.value || 0);
      this.taxInputs.basicSalary = parseFloat(document.getElementById('tax-input-basic')?.value || 0);
      this.taxInputs.actualRentPaidMonthly = parseFloat(document.getElementById('tax-input-rent')?.value || 0);
      this.taxInputs.isMetro = document.getElementById('tax-input-metro')?.checked ?? true;
      this.taxInputs.deductions80C = parseFloat(document.getElementById('tax-input-80c')?.value || 0);
      this.taxInputs.deductions80D = parseFloat(document.getElementById('tax-input-80d')?.value || 0);
      this.taxInputs.nps80CCD = parseFloat(document.getElementById('tax-input-nps')?.value || 0);
      this.taxInputs.homeLoanInterest = parseFloat(document.getElementById('tax-input-loan')?.value || 0);

      this.renderTaxEngineTab();
    };

    const inputs = ['tax-input-gross', 'tax-input-basic', 'tax-input-rent', 'tax-input-80c', 'tax-input-80d', 'tax-input-nps', 'tax-input-loan'];
    inputs.forEach(id => {
      document.getElementById(id)?.addEventListener('input', recalc);
    });

    document.getElementById('tax-input-metro')?.addEventListener('change', recalc);
  }

  renderTaxEngineTab() {
    const result = TaxEngine.compareRegimes(this.taxInputs.grossSalary, this.taxInputs);

    // Populate Side-by-Side Cards
    const oldTaxEl = document.getElementById('tax-result-old-tax');
    if (oldTaxEl) oldTaxEl.textContent = Formatters.currency(result.oldRegime.totalTax);

    const oldRateEl = document.getElementById('tax-result-old-rate');
    if (oldRateEl) oldRateEl.textContent = `Effective Tax Rate: ${result.oldRegime.effectiveRate}%`;

    const oldDeductionsEl = document.getElementById('tax-result-old-deductions');
    if (oldDeductionsEl) oldDeductionsEl.textContent = Formatters.currency(result.oldRegime.totalDeductions);

    const newTaxEl = document.getElementById('tax-result-new-tax');
    if (newTaxEl) newTaxEl.textContent = Formatters.currency(result.newRegime.totalTax);

    const newRateEl = document.getElementById('tax-result-new-rate');
    if (newRateEl) newRateEl.textContent = `Effective Tax Rate: ${result.newRegime.effectiveRate}%`;

    const newDeductionsEl = document.getElementById('tax-result-new-deductions');
    if (newDeductionsEl) newDeductionsEl.textContent = Formatters.currency(result.newRegime.deductions);

    // Verdict Badge & Explainer
    const verdictTitle = document.getElementById('tax-verdict-title');
    if (verdictTitle) {
      verdictTitle.innerHTML = result.recommendedRegime === 'NEW'
        ? `🏆 WINNER: New Tax Regime (Saves ${Formatters.currency(result.savings)})`
        : result.recommendedRegime === 'OLD'
        ? `🏆 WINNER: Old Tax Regime (Saves ${Formatters.currency(result.savings)})`
        : `🤝 Both Regimes Equal`;
    }

    const verdictText = document.getElementById('tax-verdict-text');
    if (verdictText) verdictText.textContent = result.rationale;

    const crossoverEl = document.getElementById('tax-crossover-text');
    if (crossoverEl) {
      if (result.crossoverDeductionsNeeded > 0) {
        crossoverEl.textContent = `Breakeven Point: You need total itemized deductions exceeding ${Formatters.currency(result.crossoverDeductionsNeeded)} for Old Regime to save more tax.`;
      } else {
        crossoverEl.textContent = `New Regime is permanently more advantageous for this income slab.`;
      }
    }

    // Tax Comparison Chart
    const chartCanvas = document.getElementById('tax-comparison-chart');
    if (chartCanvas) {
      if (this.activeCharts.taxComparison) this.activeCharts.taxComparison.destroy();
      this.activeCharts.taxComparison = ChartHelpers.createTaxComparisonChart(chartCanvas, result.oldRegime, result.newRegime);
    }
  }

  setupPortfolioHandlers() {
    const recalc = () => {
      this.wealthInputs.monthlySIP = parseFloat(document.getElementById('sip-input-amount')?.value || 10000);
      this.wealthInputs.equityReturnRate = parseFloat(document.getElementById('sip-input-return')?.value || 12.5);
      this.wealthInputs.years = parseInt(document.getElementById('sip-input-years')?.value || 15);
      this.wealthInputs.inflationRate = parseFloat(document.getElementById('sip-input-inflation')?.value || 6.0);

      document.getElementById('sip-val-amount').textContent = Formatters.currency(this.wealthInputs.monthlySIP);
      document.getElementById('sip-val-return').textContent = `${this.wealthInputs.equityReturnRate}%`;
      document.getElementById('sip-val-years').textContent = `${this.wealthInputs.years} Yrs`;

      this.renderPortfolioTab();
    };

    ['sip-input-amount', 'sip-input-return', 'sip-input-years', 'sip-input-inflation'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', recalc);
    });
  }

  renderPortfolioTab() {
    const simulation = PortfolioEngine.simulateWealth(this.wealthInputs);
    const persona = JudgePersonas[this.currentPersona];
    const health = PortfolioEngine.evaluateHealth({
      ...persona.profile.currentPortfolio,
      monthlyExpenses: 45000
    });

    // Populate Wealth Metrics
    const finalValEl = document.getElementById('sip-result-equity-val');
    if (finalValEl) finalValEl.textContent = Formatters.currency(simulation.equityFinalValue);

    const investedEl = document.getElementById('sip-result-invested');
    if (investedEl) investedEl.textContent = Formatters.currency(simulation.totalInvested);

    const wealthCreatedEl = document.getElementById('sip-result-wealth-created');
    if (wealthCreatedEl) wealthCreatedEl.textContent = `+${Formatters.currency(simulation.wealthCreatedBySIP)} (${Formatters.currency(simulation.wealthAlphaOverFD)} above FD)`;

    const realPowerEl = document.getElementById('sip-result-real-power');
    if (realPowerEl) realPowerEl.textContent = `Real Inflation-Adjusted Wealth: ${Formatters.currency(simulation.realEquityValue)}`;

    // Health Score Flags
    const flagsBox = document.getElementById('portfolio-flags-list');
    if (flagsBox) {
      flagsBox.innerHTML = health.flags.map(f => `
        <div class="p-3 rounded-lg ${f.type === 'danger' ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'} border text-xs">
          <span class="font-bold block mb-1">⚠️ ${f.title}</span>
          <span>${f.description}</span>
        </div>
      `).join('');
    }

    // Wealth Chart
    const chartCanvas = document.getElementById('portfolio-wealth-chart');
    if (chartCanvas) {
      if (this.activeCharts.portfolioWealth) this.activeCharts.portfolioWealth.destroy();
      this.activeCharts.portfolioWealth = ChartHelpers.createWealthChart(chartCanvas, simulation.yearlyData);
    }
  }

  setupMarketHandlers() {
    const strategySelect = document.getElementById('market-strategy-select');
    if (strategySelect) {
      strategySelect.addEventListener('change', () => this.renderMarketTab());
    }

    const horizonSlider = document.getElementById('market-horizon-slider');
    if (horizonSlider) {
      horizonSlider.addEventListener('input', (e) => {
        document.getElementById('market-horizon-val').textContent = `${e.target.value} Years`;
        this.renderMarketTab();
      });
    }
  }

  renderMarketTab() {
    const strat = document.getElementById('market-strategy-select')?.value || 'dca';
    const horizon = parseInt(document.getElementById('market-horizon-slider')?.value || '5');
    const result = MarketInsightsEngine.backtestStrategy({ strategy: strat, horizonYears: horizon, monthlyInvestment: 10000 });

    const titleEl = document.getElementById('backtest-strat-title');
    if (titleEl) titleEl.textContent = result.strategyName;

    const corpusEl = document.getElementById('backtest-corpus-val');
    if (corpusEl) corpusEl.textContent = Formatters.currency(result.finalCorpus);

    const cagrEl = document.getElementById('backtest-cagr-val');
    if (cagrEl) cagrEl.textContent = result.cagr;

    const ddEl = document.getElementById('backtest-dd-val');
    if (ddEl) ddEl.textContent = result.maxDrawdown;

    const sharpeEl = document.getElementById('backtest-sharpe-val');
    if (sharpeEl) sharpeEl.textContent = result.sharpeRatio;

    const descEl = document.getElementById('backtest-desc-text');
    if (descEl) descEl.textContent = result.description;

    // Render Benchmarks Table
    const benchBody = document.getElementById('market-benchmarks-body');
    if (benchBody) {
      benchBody.innerHTML = MarketInsightsEngine.benchmarks.map(b => `
        <tr class="border-b border-slate-800 text-xs">
          <td class="p-3 font-semibold text-slate-200">${b.name} <span class="text-slate-500 font-mono text-[10px]">(${b.ticker})</span></td>
          <td class="p-3 text-emerald-400 font-bold">${b.cagr10Y}%</td>
          <td class="p-3 text-slate-300 font-mono">${b.peRatio}</td>
          <td class="p-3 text-slate-400">${b.volatility}%</td>
          <td class="p-3"><span class="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px]">${b.status}</span></td>
        </tr>
      `).join('');
    }

    // Render News Impact Feed
    const newsBox = document.getElementById('market-news-feed');
    if (newsBox) {
      newsBox.innerHTML = MarketInsightsEngine.newsFeed.map(n => `
        <div class="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="font-bold text-slate-300">${n.source} • ${n.time}</span>
            <span class="badge-pill ${n.sentimentScore > 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}">${n.sentiment}</span>
          </div>
          <p class="font-medium text-slate-200 text-xs mb-2">${n.title}</p>
          <div class="text-[11px] text-slate-400 bg-slate-950/40 p-2 rounded flex justify-between items-center">
            <span>🎯 Impact: <strong class="text-slate-300">${n.impactSector}</strong> (${n.predictedImpact})</span>
            <span class="text-emerald-400">Accuracy: ${n.historicalAccuracy}</span>
          </div>
        </div>
      `).join('');
    }
  }

  setupSmeHandlers() {
    const recalcGST = () => {
      this.smeInputs.baseAmount = parseFloat(document.getElementById('sme-gst-base')?.value || 50000);
      this.smeInputs.gstRate = parseFloat(document.getElementById('sme-gst-rate')?.value || 18);
      this.smeInputs.isInterState = document.getElementById('sme-gst-interstate')?.checked ?? false;
      this.smeInputs.inputTaxCreditAvailable = parseFloat(document.getElementById('sme-gst-itc')?.value || 0);
      this.renderSmeTab();
    };

    ['sme-gst-base', 'sme-gst-rate', 'sme-gst-itc'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', recalcGST);
    });
    document.getElementById('sme-gst-interstate')?.addEventListener('change', recalcGST);

    const recalcLoan = () => {
      this.smeInputs.loanAmount = parseFloat(document.getElementById('sme-loan-amount')?.value || 1000000);
      this.smeInputs.loanRate = parseFloat(document.getElementById('sme-loan-rate')?.value || 11.5);
      this.smeInputs.loanTenure = parseInt(document.getElementById('sme-loan-tenure')?.value || 36);
      this.smeInputs.monthlyOpCashFlow = parseFloat(document.getElementById('sme-loan-op-cash')?.value || 80000);
      this.renderSmeTab();
    };

    ['sme-loan-amount', 'sme-loan-rate', 'sme-loan-tenure', 'sme-loan-op-cash'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', recalcLoan);
    });
  }

  renderSmeTab() {
    const gstResult = SmeFinanceEngine.calculateGST(this.smeInputs);
    const runwayResult = SmeFinanceEngine.forecastRunway(this.smeInputs);
    const loanResult = SmeFinanceEngine.stressTestLoan(this.smeInputs);

    // GST Outputs
    const grossInvoiceEl = document.getElementById('sme-res-invoice-total');
    if (grossInvoiceEl) grossInvoiceEl.textContent = Formatters.currency(gstResult.grossInvoiceAmount);

    const netGstPayableEl = document.getElementById('sme-res-net-gst');
    if (netGstPayableEl) netGstPayableEl.textContent = Formatters.currency(gstResult.netGstPayable);

    const gstBreakdownEl = document.getElementById('sme-res-gst-breakdown');
    if (gstBreakdownEl) {
      gstBreakdownEl.textContent = gstResult.isInterState 
        ? `IGST (${gstResult.gstRate}%): ${Formatters.currency(gstResult.igstAmount)}`
        : `CGST (${gstResult.cgstRate}%): ${Formatters.currency(gstResult.cgstAmount)} + SGST (${gstResult.sgstRate}%): ${Formatters.currency(gstResult.sgstAmount)}`;
    }

    // Runway Output
    const runwayMonthsEl = document.getElementById('sme-runway-months');
    if (runwayMonthsEl) runwayMonthsEl.textContent = `${runwayResult.monthsOfRunway} Months`;

    const runwayChartEl = document.getElementById('sme-runway-chart');
    if (runwayChartEl) {
      if (this.activeCharts.smeRunway) this.activeCharts.smeRunway.destroy();
      this.activeCharts.smeRunway = ChartHelpers.createRunwayChart(runwayChartEl, runwayResult.runwayPoints);
    }

    // Loan Output
    const emiEl = document.getElementById('sme-loan-emi');
    if (emiEl) emiEl.textContent = `${Formatters.currency(loanResult.monthlyEMI)}/mo`;

    const dscrEl = document.getElementById('sme-loan-dscr');
    if (dscrEl) dscrEl.textContent = `DSCR: ${loanResult.dscr}x`;

    const loanVerdictEl = document.getElementById('sme-loan-verdict');
    if (loanVerdictEl) {
      loanVerdictEl.className = `badge-pill ${loanResult.badgeClass}`;
      loanVerdictEl.textContent = loanResult.verdict;
    }

    const loanGuidanceEl = document.getElementById('sme-loan-guidance');
    if (loanGuidanceEl) loanGuidanceEl.textContent = loanResult.guidance;
  }

  setupCopilotHandlers() {
    const sendBtn = document.getElementById('btn-send-copilot');
    const input = document.getElementById('copilot-user-input');

    const handleSend = async () => {
      const q = input?.value?.trim();
      if (!q) return;

      this.appendCopilotMessage('user', q);
      input.value = '';

      // Simulated thinking delay for realism
      const typingIndicator = this.appendTypingIndicator();
      const reply = await CopilotEngine.processMessage(q, {
        grossSalary: this.taxInputs.grossSalary,
        basicSalary: this.taxInputs.basicSalary,
        rentPaid: this.taxInputs.actualRentPaidMonthly
      });
      typingIndicator.remove();
      this.appendCopilotMessage('assistant', reply);
    };

    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      });
    }

    // Suggested questions click
    document.querySelectorAll('[data-copilot-prompt]').forEach(btn => {
      btn.addEventListener('click', () => {
        const prompt = btn.getAttribute('data-copilot-prompt');
        if (input) {
          input.value = prompt;
          handleSend();
        }
      });
    });
  }

  appendCopilotMessage(sender, text) {
    const chatContainer = document.getElementById('copilot-messages-container');
    if (!chatContainer) return;

    const div = document.createElement('div');
    div.className = `flex gap-3 text-xs mb-4 ${sender === 'user' ? 'justify-end' : 'justify-start'}`;

    if (sender === 'user') {
      div.innerHTML = `
        <div class="bg-emerald-500/20 border border-emerald-500/30 text-slate-100 p-3 rounded-2xl rounded-tr-none max-w-[80%]">
          ${text}
        </div>
        <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0">You</div>
      `;
    } else {
      div.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs shrink-0">AI</div>
        <div class="bg-slate-900 border border-slate-800 text-slate-200 p-3.5 rounded-2xl rounded-tl-none max-w-[85%] prose prose-invert prose-xs">
          ${window.marked ? window.marked.parse(text) : text.replace(/\n/g, '<br/>')}
        </div>
      `;
    }

    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  appendTypingIndicator() {
    const chatContainer = document.getElementById('copilot-messages-container');
    const div = document.createElement('div');
    div.className = 'flex gap-3 text-xs mb-4 items-center text-slate-400';
    div.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">AI</div>
      <div class="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span class="text-xs text-slate-400 font-mono">Artha thinking...</span>
      </div>
    `;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return div;
  }

  renderCopilotTab() {
    // Populate persona prompt if chat is empty
    const chatContainer = document.getElementById('copilot-messages-container');
    if (chatContainer && chatContainer.children.length === 0) {
      const persona = JudgePersonas[this.currentPersona];
      this.appendCopilotMessage('assistant', `Hello ${persona.name}! I am **Artha Copilot**, your autonomous financial intelligence partner. I have loaded your financial profile (${persona.tagline}). What would you like to solve today?`);
    }
  }

  setupExportHandlers() {
    const exportBtn = document.getElementById('btn-export-audit');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.generateFinancialAuditReport();
      });
    }
  }

  generateFinancialAuditReport() {
    const p = JudgePersonas[this.currentPersona];
    const breakdown = BudgetingEngine.calculateCategoryBreakdown(this.transactions);
    const taxRes = TaxEngine.compareRegimes(this.taxInputs.grossSalary, this.taxInputs);
    const subLeaks = BudgetingEngine.detectSubscriptionLeaks(this.subscriptions);

    const reportContent = `
================================================================================
              ARTHA OS - COMPREHENSIVE FINANCIAL AUDIT REPORT
                        Generated for: ${p.name}
                     Date: ${new Date().toLocaleDateString('en-IN')}
================================================================================

1. EXECUTIVE SUMMARY & PROFILE
   - Age / Profession: ${p.tagline}
   - Monthly Take-Home Spend: ${Formatters.currency(breakdown.totalDebit)}
   - Savings Rate: ${breakdown.savingsRate}%
   - Net Worth Tracked: ${Formatters.currency(p.profile.currentPortfolio.totalNetWorth)}

2. BUDGET & SILENT LEAKS AUDIT
   - Recurring Subscriptions Found: ${subLeaks.count}
   - Annual Subscription Drain: ${Formatters.currency(subLeaks.totalAnnual)}
   - Identified Potential Savings: ${Formatters.currency(subLeaks.potentialSavings)} / year

3. TAX ARCHITECT VERDICT (FY 2025-26 / Budget 2025-26)
   - Gross Annual CTC: ${Formatters.currency(this.taxInputs.grossSalary)}
   - Old Regime Tax Liability: ${Formatters.currency(taxRes.oldRegime.totalTax)}
   - New Regime Tax Liability: ${Formatters.currency(taxRes.newRegime.totalTax)}
   - Recommended Tax Strategy: ${taxRes.recommendedRegime} REGIME
   - Net Tax Saved: ${Formatters.currency(taxRes.savings)}
   - Strategic Rationale: ${taxRes.rationale}

4. SECURITY & UPI SCAM DEFENSE
   - Multi-vector threat scanner verified active.
   - 0-Day Reverse-QR / Fake VPA / Urgent disconnection protection armed.
   - National Cyber Crime (1930 / cybercrime.gov.in) compliant evidence export enabled.

5. WEALTH ENGINE ACTIONABLE ROADMAP
   - Target Equity Benchmark: 65% in Broad Market Index Funds (Nifty 50)
   - Mandatory Liquid Cushion: Maintain 6 months of expenses in Flexi-FD.
   - Maintain 5-10% Sovereign Gold Hedge against currency depreciation.

================================================================================
        ArthaOS - Autonomous AI Financial Operating System (Arthathon 2026)
================================================================================
    `;

    // Download or display modal
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ArthaOS_Audit_${p.id}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    this.showToast('Downloaded Comprehensive Financial Audit Report!');
    if (window.confetti) window.confetti({ particleCount: 50, spread: 70 });
  }

  showToast(message) {
    const toast = document.getElementById('app-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    toast.classList.add('opacity-100');

    setTimeout(() => {
      toast.classList.remove('opacity-100');
      toast.classList.add('opacity-0', 'pointer-events-none');
    }, 3200);
  }
}

// Global bootstrap
window.addEventListener('DOMContentLoaded', () => {
  window.arthaApp = new ArthaApp();
  window.arthaApp.init();
});
