/**
 * ArthaOS - UPI Shield & Phishing Scam Detection Engine
 * Multi-vector NLP & heuristic threat analyzer for Indian cyber-fraud patterns
 */

export const ScamShieldEngine = {
  // Official Banking Handles for Whitelist/Verification
  verifiedVpaSuffixes: [
    '@okhdfcbank', '@okaxis', '@okicici', '@oksbi', '@paytm', '@ybl', 
    '@ibl', '@axl', '@apl', '@barodampay', '@idfcbank', '@kotak'
  ],

  // Known Fraud Keywords & Deception Patterns
  fraudVectors: [
    {
      id: 'reverse_qr_pin',
      name: 'Reverse QR / PIN to Receive Trap',
      severity: 45,
      description: 'The golden rule of UPI: You NEVER need to enter your UPI PIN to receive money. Entering PIN always debits your account.',
      test: (text) => /(?:enter|type|scan).*upi\s*pin.*(?:receive|claim|accept|credit|get\s*money)/i.test(text) ||
                      /(?:receive|claim|accept).*enter.*pin/i.test(text) ||
                      /(?:scan.*qr.*code.*to\s*receive)/i.test(text)
    },
    {
      id: 'spoofed_vpa',
      name: 'VPA Impersonation / Fake Bank Handle',
      severity: 35,
      description: 'Uses official keywords (sbi, paytm, kyc, refund, nodal) in unauthorized handles to impersonate legitimate banks.',
      test: (text, vpa) => {
        const combined = (text + ' ' + (vpa || '')).toLowerCase();
        return /(?:sbi-refund|paytm-kyc|it-refund|nodal-officer|rbi-verification|gst-audit|police-cyber)/i.test(combined);
      }
    },
    {
      id: 'urgency_intimidation',
      name: 'High-Pressure Urgency & Intimidation',
      severity: 30,
      description: 'Creates artificial panic (power cut tonight, SIM blocked in 24 hours, police digital arrest) to disable critical thinking.',
      test: (text) => /(?:disconnected\s*tonight|within\s*\d+\s*(?:hours|mins|minutes)|account\s*block|sim\s*block|arrest|digital\s*arrest|court\s*order|immediate.*penalty)/i.test(text)
    },
    {
      id: 'malicious_apk_url',
      name: 'Suspicious Domain / Malicious APK Link',
      severity: 40,
      description: 'Distributes remote-access trojans (AnyDesk, QuickSupport, predatory loan APKs) via URL shorteners or suspicious TLDs.',
      test: (text) => /(?:bit\.ly|tinyurl|\.apk|http:\/\/(?!www\.hdfcbank|www\.sbi|www\.icicibank)[^\s]+|\.live|\.xyz|\.top)/i.test(text)
    },
    {
      id: 'lottery_predatory_loan',
      name: 'Too-Good-To-Be-True / Predatory Loan Bait',
      severity: 25,
      description: 'Promises instant millions, lucky draw prizes, or 0-interest instant loans without credit checks.',
      test: (text) => /(?:won\s*rs|lottery|lucky\s*draw|diwali\s*mega|0%\s*interest.*no\s*cibil|instant\s*loan.*5\s*min)/i.test(text)
    }
  ],

  /**
   * Analyze input message / collect request
   */
  analyze(input, optionalVpa = '') {
    if (!input || typeof input !== 'string') {
      return {
        score: 0,
        riskLevel: 'SAFE',
        vectors: [],
        advice: 'No message provided to scan.'
      };
    }

    const matchedVectors = [];
    let rawScore = 0;

    for (const vector of this.fraudVectors) {
      if (vector.test(input, optionalVpa)) {
        matchedVectors.push({
          id: vector.id,
          name: vector.name,
          severity: vector.severity,
          description: vector.description
        });
        rawScore += vector.severity;
      }
    }

    // Normalizing Score (Cap at 99 for realism)
    const finalScore = Math.min(99, rawScore);

    // Risk Classification
    let riskLevel = 'SAFE';
    let badgeClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    let summary = 'This transaction or message appears genuine and consistent with verified bank notifications.';
    let recommendations = [
      'Standard hygiene: Never share OTP or PIN with anyone over phone.',
      'Check SMS sender ID (e.g. AD-HDFCBK, VK-SBIIN).'
    ];

    if (finalScore >= 75) {
      riskLevel = 'CRITICAL FRAUD ALERT';
      badgeClass = 'text-rose-400 bg-rose-500/10 border-rose-500/30 animate-pulse';
      summary = 'EXTREME DANGER: This is a verified cyber-fraud attempt designed to drain your bank account.';
      recommendations = [
        'DO NOT enter your 4 or 6-digit UPI PIN under any circumstance.',
        'DO NOT click any link or download the APK.',
        'Block the sender immediately on WhatsApp / SMS.',
        'Report the mobile number on Government Chakshu Portal (sancharsaathi.gov.in).',
        'Call National Cyber Crime Helpline: 1930 immediately if money was debited.'
      ];
    } else if (finalScore >= 40) {
      riskLevel = 'HIGH SUSPICION';
      badgeClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      summary = 'HIGH RISK: Contains multiple manipulative psychological triggers and unverified payment channels.';
      recommendations = [
        'Verify independently directly through the official bank app or official electricity board portal.',
        'Never call the personal phone numbers mentioned in the SMS.',
        'Reject any pending collect request in your UPI app.'
      ];
    } else if (finalScore > 0) {
      riskLevel = 'CAUTION';
      badgeClass = 'text-amber-300 bg-amber-500/10 border-amber-500/20';
      summary = 'Contains mild alert patterns. Exercise caution before proceeding.';
      recommendations = [
        'Verify merchant details before confirming payment.'
      ];
    }

    return {
      score: finalScore,
      riskLevel,
      badgeClass,
      summary,
      matchedVectors,
      recommendations,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Generate an official complaint text for 1930 / cybercrime.gov.in
   */
  generateComplaintDraft(scamText, victimName = 'Citizen', incidentVpa = 'N/A') {
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });

    return `COMPLAINT REGARDING ONLINE FINANCIAL FRAUD ATTEMPT
Date of Incident: ${dateStr}
Complainant Name: ${victimName}
Suspected Fraud Vector: Digital UPI Collect / Phishing Trap
Suspected VPA/Identifier: ${incidentVpa}

EVIDENCE & MESSAGE DETAILS:
"${scamText}"

INCIDENT DESCRIPTION:
I received the above deceptive message attempting to illicitly extract funds through reverse-charge deception / impersonation of official authorities. No authorized bank or utility requests UPI PIN entry or urgent APK downloads.

REQUESTED ACTION:
1. Block the fraudulent VPA / phone number across the NPCI UPI switch.
2. Flag the domain / phone number on the DoT TAFCOP & Chakshu cyber-safety databases.
3. Prevent further targeting of senior citizens and vulnerable users.

Submitted via ArthaOS Cyber Shield for National Cyber Crime Portal (cybercrime.gov.in / Dial 1930).`;
  }
};
