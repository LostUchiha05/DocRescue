export const PRESET_QUESTIONS = [
  "What is the applicant's date of birth?",
  "Are there any discrepancies between documents?",
  "Which fields require human verification?",
  "List all official document identifiers.",
  "What residential address is confirmed across the documents?",
  "What is the total utility bill amount due and due date?"
];

export const getAIResponseForQuery = (query, documents, resolvedDob = null) => {
  const q = query.toLowerCase();

  if (q.includes('date of birth') || q.includes('dob') || q.includes('birth date') || q.includes('born')) {
    if (resolvedDob) {
      return {
        answer: `The applicant's verified date of birth is **${resolvedDob}** (resolved after cross-document reconciliation).`,
        sources: [
          { doc: 'Aadhaar_rahul_sharma.jpg', field: 'Date of Birth', value: '12/05/2002', confidence: 96, status: 'Verified' },
          { doc: 'PAN_Card_rahul.jpg', field: 'Date of Birth', value: '12/05/2003', confidence: 71, status: 'Overridden/Reconciled' }
        ],
        notes: `The conflict has been resolved by human verification to canonical value: ${resolvedDob}.`
      };
    }
    return {
      answer: `The applicant's date of birth is primarily recorded as **12/05/2002** on the Aadhaar Card. However, the PAN Card shows **12/05/2003** with a lower confidence rating (71%).`,
      sources: [
        { doc: 'Aadhaar_rahul_sharma.jpg', field: 'Date of Birth', value: '12/05/2002', confidence: 96, status: 'High Confidence' },
        { doc: 'PAN_Card_rahul.jpg', field: 'Date of Birth', value: '12/05/2003', confidence: 71, status: 'Needs Review' }
      ],
      notes: '⚠ Discrepancy detected: Please verify the PAN card date in the Review Queue.'
    };
  }

  if (q.includes('discrepanc') || q.includes('mismatch') || q.includes('conflict') || q.includes('difference')) {
    if (resolvedDob) {
      return {
        answer: `All identified discrepancies have been reconciled. The prior Date of Birth mismatch was resolved to **${resolvedDob}**. Name ("Rahul Sharma") and residential address ("Flat 402, Shivam Heights, Andheri West, Mumbai") are consistent across all documents.`,
        sources: [
          { doc: 'Aadhaar_rahul_sharma.jpg', field: 'Full Name', value: 'Rahul Sharma', confidence: 98, status: 'Verified' },
          { doc: 'PAN_Card_rahul.jpg', field: 'Full Name', value: 'Rahul Sharma', confidence: 97, status: 'Verified' },
          { doc: 'Electricity_Bill_MSEDCL.jpg', field: 'Premise Address', value: 'Flat 402, Shivam Heights...', confidence: 88, status: 'Verified' }
        ],
        notes: 'KYC Consistency Score: 100% (Conflict Resolved)'
      };
    }
    return {
      answer: `There is **1 active discrepancy** detected across the submitted files:\n\n• **Date of Birth Mismatch**:\n  - **Aadhaar Card**: \`12/05/2002\` (Confidence: 96%)\n  - **PAN Card**: \`12/05/2003\` (Confidence: 71%, low OCR confidence on last digit)`,
      sources: [
        { doc: 'Aadhaar_rahul_sharma.jpg', field: 'Date of Birth', value: '12/05/2002', confidence: 96, status: 'Verified' },
        { doc: 'PAN_Card_rahul.jpg', field: 'Date of Birth', value: '12/05/2003', confidence: 71, status: 'Needs Review' }
      ],
      notes: 'Recommendation: The Aadhaar value is higher confidence. Navigate to Reconcile/Review to accept canonical value.'
    };
  }

  if (q.includes('review') || q.includes('verif') || q.includes('attention') || q.includes('flag')) {
    return {
      answer: `Currently, **2 fields** were flagged for human attention:\n\n1. **PAN Card → Date of Birth**: \`12/05/2003\` (71% confidence, conflict with Aadhaar)\n2. **Electricity Bill → Consumer Number**: \`028549102941\` (82% confidence, faint dot-matrix print)`,
      sources: [
        { doc: 'PAN_Card_rahul.jpg', field: 'Date of Birth', value: '12/05/2003', confidence: 71, status: 'Needs Review' },
        { doc: 'Electricity_Bill_MSEDCL.jpg', field: 'Consumer Number', value: '028549102941', confidence: 82, status: 'Needs Review' }
      ],
      notes: 'All other 16 fields passed automated verification criteria (>90% confidence).'
    };
  }

  if (q.includes('id') || q.includes('identifier') || q.includes('number') || q.includes('card number')) {
    return {
      answer: `Here are the extracted official identification and account numbers:\n\n• **Aadhaar Number**: \`XXXX XXXX 1234\` (UIDAI)\n• **PAN Number**: \`ABCDE1234F\` (Income Tax Dept)\n• **Electricity Consumer No**: \`028549102941\` (MSEDCL)`,
      sources: [
        { doc: 'Aadhaar_rahul_sharma.jpg', field: 'Aadhaar Number', value: 'XXXX XXXX 1234', confidence: 97, status: 'Verified' },
        { doc: 'PAN_Card_rahul.jpg', field: 'PAN Number', value: 'ABCDE1234F', confidence: 99, status: 'Verified' },
        { doc: 'Electricity_Bill_MSEDCL.jpg', field: 'Consumer Number', value: '028549102941', confidence: 82, status: 'Verified' }
      ],
      notes: 'All IDs formatted and validated against respective government checksum algorithms.'
    };
  }

  if (q.includes('address') || q.includes('location') || q.includes('residen') || q.includes('mumbai')) {
    return {
      answer: `The verified residential address is:\n\n**Flat 402, Shivam Heights, Off Link Road, Andheri West, Mumbai, Maharashtra 400058**\n\nThis address matches between the **Aadhaar Card** and the **Electricity Utility Bill**, confirming valid proof of residence in Maharashtra.`,
      sources: [
        { doc: 'Aadhaar_rahul_sharma.jpg', field: 'Residential Address', value: 'Flat 402, Shivam Heights...', confidence: 94, status: 'Verified' },
        { doc: 'Electricity_Bill_MSEDCL.jpg', field: 'Connection Address', value: 'Flat 402, Shivam Heights...', confidence: 88, status: 'Verified' }
      ],
      notes: 'Address match score: 98.4% (Fuzzy Levenshtein similarity after normalisation).'
    };
  }

  if (q.includes('bill') || q.includes('due') || q.includes('amount') || q.includes('utility') || q.includes('electricity')) {
    return {
      answer: `The utility bill details from **MSEDCL (Maharashtra State Electricity Distribution Co.)** are:\n\n• **Total Amount Due**: \`₹2,840.00\`\n• **Payment Due Date**: \`22/08/2026\`\n• **Bill Generation Date**: \`04/08/2026\`\n• **Consumer Number**: \`028549102941\``,
      sources: [
        { doc: 'Electricity_Bill_MSEDCL.jpg', field: 'Total Amount Due', value: '₹2,840.00', confidence: 95, status: 'Verified' },
        { doc: 'Electricity_Bill_MSEDCL.jpg', field: 'Payment Due Date', value: '22/08/2026', confidence: 90, status: 'Verified' }
      ],
      notes: 'Utility bill is active and recent (< 3 months old), meeting standard enterprise KYC criteria.'
    };
  }

  // Fallback realistic response
  return {
    answer: `Based on the 3 processed documents for applicant **Rahul Sharma**, the system has extracted 18 entities across Identity and Proof of Address domains with an average confidence score of **94.2%**.`,
    sources: [
      { doc: 'Aadhaar_rahul_sharma.jpg', field: 'Multiple Fields', value: 'Identity & Address', confidence: 95, status: 'Verified' },
      { doc: 'PAN_Card_rahul.jpg', field: 'Multiple Fields', value: 'Tax Identity', confidence: 91, status: 'Verified' },
      { doc: 'Electricity_Bill_MSEDCL.jpg', field: 'Multiple Fields', value: 'Utility Validation', confidence: 89, status: 'Verified' }
    ],
    notes: 'You can ask specific questions regarding Date of Birth, Address verification, discrepancies, or account numbers.'
  };
};
