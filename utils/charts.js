/**
 * ArthaOS - High-Performance Chart.js Helpers & Aesthetic FinTech Palettes
 * Emerald, Amber, Slate gradients with dark-mode elegance
 */

export const ChartHelpers = {
  // FinTech Color Palette (Clean, Luxurious, Harmonious)
  colors: {
    emerald: '#10B981',
    emeraldLight: '#34D399',
    emeraldGlow: 'rgba(16, 185, 129, 0.15)',
    amber: '#F59E0B',
    amberGlow: 'rgba(245, 158, 11, 0.15)',
    sky: '#0EA5E9',
    purple: '#8B5CF6',
    rose: '#F43F5E',
    slate700: '#334155',
    slate800: '#1E293B',
    textMain: '#F8FAFC',
    textMuted: '#94A3B8'
  },

  /**
   * Initialize or Update Wealth Compounding Chart
   */
  createWealthChart(ctx, yearlyData) {
    const labels = yearlyData.map(d => `Year ${d.year}`);
    const invested = yearlyData.map(d => d.invested);
    const equityNominal = yearlyData.map(d => d.equityNominal);
    const fdNominal = yearlyData.map(d => d.fdNominal);
    const equityReal = yearlyData.map(d => d.equityReal);

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Equity SIP (Nominal 12.5%)',
            data: equityNominal,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointRadius: 3,
            pointHoverRadius: 6
          },
          {
            label: 'Real Equity (Inflation Adjusted)',
            data: equityReal,
            borderColor: '#34D399',
            borderDash: [5, 5],
            borderWidth: 2,
            fill: false,
            tension: 0.35,
            pointRadius: 2
          },
          {
            label: 'Fixed Deposit (Nominal 6.5%)',
            data: fdNominal,
            borderColor: '#F59E0B',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.35,
            pointRadius: 2
          },
          {
            label: 'Total Principal Invested',
            data: invested,
            borderColor: '#64748B',
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderDash: [3, 3],
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#94A3B8', font: { family: 'Inter', size: 12 } }
          },
          tooltip: {
            backgroundColor: '#1E293B',
            titleColor: '#F8FAFC',
            bodyColor: '#E2E8F0',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ₹${context.parsed.y.toLocaleString('en-IN')}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748B' }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#64748B',
              callback: (value) => {
                if (value >= 10000000) return '₹' + (value / 10000000).toFixed(1) + ' Cr';
                if (value >= 100000) return '₹' + (value / 100000).toFixed(0) + ' L';
                return '₹' + (value / 1000).toFixed(0) + ' K';
              }
            }
          }
        }
      }
    });
  },

  /**
   * Budget Category Donut Chart
   */
  createCategoryChart(ctx, categories) {
    const labels = categories.map(c => c.category);
    const data = categories.map(c => c.amount);
    const palette = ['#10B981', '#0EA5E9', '#F59E0B', '#8B5CF6', '#EC4899', '#64748B', '#14B8A6', '#F97316'];

    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: palette.slice(0, data.length),
          borderWidth: 2,
          borderColor: '#111827',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#94A3B8', font: { family: 'Inter', size: 11 } }
          },
          tooltip: {
            backgroundColor: '#1E293B',
            callbacks: {
              label: (context) => ` ${context.label}: ₹${context.parsed.toLocaleString('en-IN')}`
            }
          }
        },
        cutout: '72%'
      }
    });
  },

  /**
   * Tax Comparison Bar Chart
   */
  createTaxComparisonChart(ctx, oldRegime, newRegime) {
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Standard / Itemized Deductions', 'Taxable Net Income', 'Final Tax Liability'],
        datasets: [
          {
            label: 'Old Tax Regime',
            data: [oldRegime.totalDeductions, oldRegime.taxableIncome, oldRegime.totalTax],
            backgroundColor: '#64748B',
            borderRadius: 6
          },
          {
            label: 'New Tax Regime (Budget 2025-26)',
            data: [newRegime.deductions, newRegime.taxableIncome, newRegime.totalTax],
            backgroundColor: '#10B981',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94A3B8' } },
          tooltip: {
            backgroundColor: '#1E293B',
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ₹${context.parsed.y.toLocaleString('en-IN')}`
            }
          }
        },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94A3B8' } },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#64748B',
              callback: (val) => val >= 100000 ? '₹' + (val / 100000).toFixed(1) + ' L' : '₹' + val
            }
          }
        }
      }
    });
  },

  /**
   * 90-Day Cash Flow Runway Chart
   */
  createRunwayChart(ctx, runwayPoints) {
    const labels = runwayPoints.map(p => p.day);
    const balances = runwayPoints.map(p => p.balance);

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Working Capital Cash Balance',
          data: balances,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94A3B8' } },
          tooltip: {
            backgroundColor: '#1E293B',
            callbacks: {
              label: (context) => ` Bank Balance: ₹${context.parsed.y.toLocaleString('en-IN')}`
            }
          }
        },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748B' } },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#64748B',
              callback: (val) => '₹' + (val / 100000).toFixed(1) + ' L'
            }
          }
        }
      }
    });
  }
};
