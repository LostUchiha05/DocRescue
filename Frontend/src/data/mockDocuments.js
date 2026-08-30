export const SAMPLE_DOCUMENTS = [
  {
    id: 'doc-aadhaar',
    name: 'Aadhaar_Rahul.jpg',
    category: 'Identity Document',
    subType: 'Aadhaar Card',
    size: '2.4 MB',
    format: 'JPG',
    uploadedAt: '2 min ago',
    quality: {
      overall: 94,
      blur: 92,
      brightness: 88,
      contrast: 85,
      skew: 1.2,
      crop: 'Good',
      status: 'Good Quality',
      notes: 'High-clarity scan, optimal orientation and legible fonts.'
    },
    improvements: {
      readability: '+85%',
      noiseReduction: '-92%',
      contrastBoost: '+140%',
      deskewApplied: '1.2° Corrected'
    },
    fields: [
      {
        id: 'f-adh-1',
        key: 'doc_number',
        label: 'Document Number',
        value: 'XXXX XXXX 1234',
        rawOcr: 'XXXX XXXX 1234',
        confidence: 97,
        status: 'verified',
        category: 'Identity',
        bbox: { x: 22, y: 70, w: 56, h: 10 }
      },
      {
        id: 'f-adh-2',
        key: 'full_name',
        label: 'Name',
        value: 'Rahul Sharma',
        rawOcr: 'Rahul Sharma',
        confidence: 98,
        status: 'verified',
        category: 'Personal',
        bbox: { x: 34, y: 30, w: 42, h: 8 }
      },
      {
        id: 'f-adh-3',
        key: 'dob',
        label: 'Date of Birth',
        value: '12/05/2002',
        rawOcr: '12/05/2002',
        confidence: 96,
        status: 'verified',
        category: 'Personal',
        bbox: { x: 34, y: 40, w: 32, h: 7 }
      },
      {
        id: 'f-adh-4',
        key: 'gender',
        label: 'Gender',
        value: 'Male',
        rawOcr: 'Male / MALE',
        confidence: 99,
        status: 'verified',
        category: 'Personal',
        bbox: { x: 34, y: 49, w: 20, h: 7 }
      },
      {
        id: 'f-adh-5',
        key: 'address',
        label: 'Address',
        value: 'Mumbai, Maharashtra',
        rawOcr: 'Flat 402, Shivam Heights, Andheri West, Mumbai, Maharashtra 400058',
        confidence: 91,
        status: 'verified',
        category: 'Location',
        bbox: { x: 18, y: 78, w: 76, h: 14 }
      }
    ]
  },
  {
    id: 'doc-pan',
    name: 'PAN_Rahul.jpg',
    category: 'Identity Document',
    subType: 'PAN Card',
    size: '1.8 MB',
    format: 'JPG',
    uploadedAt: '5 min ago',
    quality: {
      overall: 88,
      blur: 82,
      brightness: 86,
      contrast: 78,
      skew: 1.8,
      crop: 'Good',
      status: 'Fair Quality',
      notes: 'Slight glare across bottom right, resolution acceptable.'
    },
    improvements: {
      readability: '+82%',
      noiseReduction: '-89%',
      contrastBoost: '+120%',
      deskewApplied: '1.8° Corrected'
    },
    fields: [
      {
        id: 'f-pan-1',
        key: 'pan_number',
        label: 'PAN Number',
        value: 'ABCDE1234F',
        rawOcr: 'ABCDE1234F',
        confidence: 99,
        status: 'verified',
        category: 'Identity',
        bbox: { x: 20, y: 70, w: 48, h: 10 }
      },
      {
        id: 'f-pan-2',
        key: 'full_name',
        label: 'Name',
        value: 'Rahul Sharma',
        rawOcr: 'RAHUL SHARMA',
        confidence: 98,
        status: 'verified',
        category: 'Personal',
        bbox: { x: 20, y: 32, w: 50, h: 8 }
      },
      {
        id: 'f-pan-3',
        key: 'father_name',
        label: "Father's Name",
        value: 'Suresh Sharma',
        rawOcr: 'SURESH SHARMA',
        confidence: 94,
        status: 'verified',
        category: 'Personal',
        bbox: { x: 20, y: 44, w: 50, h: 8 }
      },
      {
        id: 'f-pan-4',
        key: 'dob',
        label: 'Date of Birth',
        value: '12/05/2003',
        originalValue: '12/05/2003',
        rawOcr: '12/05/2003',
        confidence: 71,
        status: 'needs_review',
        category: 'Personal',
        reason: '⚠ Date of Birth mismatch with Aadhaar Card (12/05/2002).',
        bbox: { x: 20, y: 56, w: 32, h: 8 }
      }
    ]
  },
  {
    id: 'doc-utility',
    name: 'Utility_Bill.jpg',
    category: 'Address Proof',
    subType: 'Utility Bill',
    size: '3.1 MB',
    format: 'JPG',
    uploadedAt: '8 min ago',
    quality: {
      overall: 61,
      blur: 48,
      brightness: 62,
      contrast: 52,
      skew: -4.8,
      crop: 'Marginal',
      status: 'Poor Quality',
      notes: 'Low resolution scan, dot matrix print, requires enhancement.'
    },
    improvements: {
      readability: '+92%',
      noiseReduction: '-96%',
      contrastBoost: '+175%',
      deskewApplied: '4.8° Corrected'
    },
    fields: [
      {
        id: 'f-utl-1',
        key: 'consumer_number',
        label: 'Consumer Number',
        value: 'UTL784512',
        rawOcr: 'UTL784512',
        confidence: 96,
        status: 'verified',
        category: 'Billing',
        bbox: { x: 14, y: 28, w: 42, h: 8 }
      },
      {
        id: 'f-utl-2',
        key: 'service_provider',
        label: 'Service Provider',
        value: 'Demo Electricity',
        rawOcr: 'DEMO ELECTRICITY BOARD',
        confidence: 94,
        status: 'verified',
        category: 'Billing',
        bbox: { x: 14, y: 12, w: 72, h: 10 }
      },
      {
        id: 'f-utl-3',
        key: 'bill_date',
        label: 'Bill Date',
        value: '10/08/2026',
        rawOcr: '10-AUG-2026',
        confidence: 92,
        status: 'verified',
        category: 'Timeline',
        bbox: { x: 64, y: 28, w: 28, h: 7 }
      },
      {
        id: 'f-utl-4',
        key: 'due_date',
        label: 'Due Date',
        value: '25/08/2026',
        rawOcr: '25-AUG-2026',
        confidence: 90,
        status: 'verified',
        category: 'Timeline',
        bbox: { x: 64, y: 37, w: 28, h: 7 }
      },
      {
        id: 'f-utl-5',
        key: 'total_amount_due',
        label: 'Total Amount Due',
        value: '₹1,840',
        rawOcr: 'INR 1840',
        confidence: 95,
        status: 'verified',
        category: 'Financial',
        bbox: { x: 58, y: 78, w: 36, h: 10 }
      }
    ]
  }
];

export const MOCK_PROCESSING_LOGS = [
  { time: '09:42:01.102', stage: 'Quality Analysis', message: 'Calculated blur (38%), luminance histogram, and skew angle (-4.8°).' },
  { time: '09:42:01.840', stage: 'Image Enhancement', message: 'Applied adaptive threshold binarization & deskew rotation transformation.' },
  { time: '09:42:02.410', stage: 'Layout Detection', message: 'Identified 3 tabular zones, 1 photo bounding block, and 2 official header regions.' },
  { time: '09:42:03.115', stage: 'Intelligent OCR', message: 'Extracted raw tokens with multi-pass neural recognition engine.' },
  { time: '09:42:03.890', stage: 'Entity Extraction', message: 'Mapped structured key-value entities to dynamic document schemas.' },
  { time: '09:42:04.520', stage: 'Confidence Scoring', message: 'High confidence fields (>90%), 1 flagged for human verification.' },
  { time: '09:42:05.200', stage: 'Cross-Doc Analysis', message: 'Detected DOB discrepancy between Aadhaar (12/05/2002) and PAN (12/05/2003).' }
];
