/**
 * ArthaOS - Utility Formatters
 * Specialized for Indian Financial System (INR numbering, Lakhs, Crores)
 */

export const Formatters = {
  /**
   * Format number to Indian Rupee notation (e.g. ₹1,25,000.00 or ₹1,25,000)
   */
  currency(amount, includeDecimals = false) {
    if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
    const num = Number(amount);
    const sign = num < 0 ? '-' : '';
    const absNum = Math.abs(num);
    
    const parts = absNum.toFixed(includeDecimals ? 2 : 0).split('.');
    let intPart = parts[0];
    const decPart = parts.length > 1 ? '.' + parts[1] : '';

    // Indian numbering format: 3 digits rightmost, then groups of 2 digits
    if (intPart.length > 3) {
      const lastThree = intPart.substring(intPart.length - 3);
      const otherNumbers = intPart.substring(0, intPart.length - 3);
      intPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
    }

    return `${sign}₹${intPart}${includeDecimals ? decPart : ''}`;
  },

  /**
   * Compact Indian notation (₹12.5 K, ₹4.5 L, ₹1.2 Cr)
   */
  compactCurrency(amount) {
    if (isNaN(amount) || amount === null) return '₹0';
    const num = Math.abs(Number(amount));
    const sign = Number(amount) < 0 ? '-' : '';

    if (num >= 10000000) {
      return `${sign}₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `${sign}₹${(num / 100000).toFixed(2)} L`;
    } else if (num >= 1000) {
      return `${sign}₹${(num / 1000).toFixed(1)} K`;
    }
    return `${sign}₹${num.toFixed(0)}`;
  },

  /**
   * Percentage formatter (+12.4% / -3.1%)
   */
  percentage(val, showPlus = true) {
    if (isNaN(val)) return '0.0%';
    const num = Number(val);
    const sign = num > 0 && showPlus ? '+' : '';
    return `${sign}${num.toFixed(1)}%`;
  },

  /**
   * Format Date to standard Indian format: "15 Nov 2026, 10:45 AM"
   */
  dateTime(dateString) {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dateString || 'N/A';
    }
  },

  /**
   * Date only "15 Nov 2026"
   */
  date(dateString) {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString || 'N/A';
    }
  },

  /**
   * Truncate string with ellipsis
   */
  truncate(str, max = 24) {
    if (!str) return '';
    return str.length > max ? str.substring(0, max) + '...' : str;
  }
};
