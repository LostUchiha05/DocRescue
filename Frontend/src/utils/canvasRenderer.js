// Renders high-fidelity, realistic synthetic document representations
// Clearly labeled as DEMO DOCUMENT for hackathon presentation and compliance

export const drawDocumentCanvas = (canvas, docId, mode = 'raw', filterOverrides = {}) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  ctx.save();

  const isEnhanced = mode === 'enhanced';

  // Apply deskew / transform
  ctx.translate(width / 2, height / 2);
  if (!isEnhanced) {
    if (docId === 'doc-aadhaar') ctx.rotate((3.8 * Math.PI) / 180);
    else if (docId === 'doc-pan') ctx.rotate((-1.8 * Math.PI) / 180);
    else if (docId === 'doc-utility') ctx.rotate((-4.8 * Math.PI) / 180);
  } else if (!filterOverrides.deskew) {
    // If user toggled deskew off in enhanced mode
    ctx.rotate((2.0 * Math.PI) / 180);
  }
  ctx.translate(-width / 2, -height / 2);

  // Background and Card Frame
  if (docId === 'doc-aadhaar') {
    drawAadhaar(ctx, width, height, isEnhanced, filterOverrides);
  } else if (docId === 'doc-pan') {
    drawPAN(ctx, width, height, isEnhanced, filterOverrides);
  } else if (docId === 'doc-utility') {
    drawUtilityBill(ctx, width, height, isEnhanced, filterOverrides);
  } else {
    drawGenericDoc(ctx, width, height, isEnhanced);
  }

  ctx.restore();

  // Apply raw degradation overlay if in raw mode
  if (!isEnhanced) {
    applyArtifactOverlay(ctx, width, height);
  }
};

function drawAadhaar(ctx, w, h, enhanced, filters) {
  // Background card
  ctx.fillStyle = enhanced ? (filters.binarize ? '#FFFFFF' : '#FAFAFA') : '#E8E5DD';
  ctx.fillRect(40, 40, w - 80, h - 80);

  // Card Border
  ctx.strokeStyle = enhanced ? '#94A3B8' : '#A8A29E';
  ctx.lineWidth = enhanced ? 2 : 1;
  ctx.strokeRect(40, 40, w - 80, h - 80);

  // Watermark Demo Stamp
  ctx.save();
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillStyle = enhanced ? 'rgba(79, 70, 229, 0.15)' : 'rgba(100, 116, 139, 0.2)';
  ctx.textAlign = 'right';
  ctx.fillText('DEMO DOCUMENT • FICTIONAL SAMPLE', w - 50, 60);
  ctx.restore();

  // Header Banner
  const gradient = ctx.createLinearGradient(40, 40, w - 40, 40);
  gradient.addColorStop(0, enhanced ? '#EA580C' : '#C2410C');
  gradient.addColorStop(0.5, enhanced ? '#FFFFFF' : '#E5E5E5');
  gradient.addColorStop(1, enhanced ? '#16A34A' : '#15803D');
  ctx.fillStyle = gradient;
  ctx.fillRect(45, 45, w - 90, 8);

  // Header Text
  ctx.fillStyle = enhanced ? '#0F172A' : '#475569';
  ctx.font = enhanced ? 'bold 15px Inter, sans-serif' : '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DEMO IDENTITY CARD', w / 2, 80);
  ctx.font = enhanced ? '10px Inter, sans-serif' : '9px sans-serif';
  ctx.fillText('Unique Identification Authority (Sample)', w / 2, 96);

  // Photo Area
  ctx.fillStyle = enhanced ? '#E2E8F0' : '#CBD5E1';
  ctx.fillRect(65, 120, 110, 135);
  ctx.strokeStyle = '#94A3B8';
  ctx.strokeRect(65, 120, 110, 135);

  // Photo Silhouette
  ctx.fillStyle = '#64748B';
  ctx.beginPath();
  ctx.arc(120, 170, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(120, 235, 42, Math.PI, 0);
  ctx.fill();

  // Details Fields
  ctx.textAlign = 'left';
  ctx.fillStyle = enhanced ? '#0F172A' : '#334155';

  ctx.font = enhanced ? 'bold 13px Inter, sans-serif' : '12px sans-serif';
  ctx.fillText('Name: Rahul Sharma', 195, 145);

  ctx.font = enhanced ? '12px Inter, sans-serif' : '11px sans-serif';
  ctx.fillText('DOB: 12/05/2002', 195, 175);
  ctx.fillText('Gender: Male', 195, 205);
  ctx.fillText('Address: Mumbai, Maharashtra', 195, 235);

  // Document Number Big Band
  ctx.fillStyle = enhanced ? '#0F172A' : '#1E293B';
  ctx.font = enhanced ? 'bold 20px JetBrains Mono, monospace' : '18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('XXXX  XXXX  1234', w / 2, 295);

  // Red line underline
  ctx.fillStyle = '#DC2626';
  ctx.fillRect(120, 308, w - 240, 2.5);

  // Address bottom section
  ctx.textAlign = 'center';
  ctx.fillStyle = enhanced ? '#475569' : '#64748B';
  ctx.font = enhanced ? '10px Inter, sans-serif' : '9px sans-serif';
  ctx.fillText('Flat 402, Shivam Heights, Andheri West, Mumbai, Maharashtra 400058', w / 2, 330);

  // Barcode simulation
  for (let i = 80; i < w - 80; i += 6) {
    ctx.fillStyle = i % 12 === 0 ? '#0F172A' : '#64748B';
    ctx.fillRect(i, 350, (i % 4) + 1, 14);
  }
}

function drawPAN(ctx, w, h, enhanced, filters) {
  // Background card
  ctx.fillStyle = enhanced ? (filters.binarize ? '#FFFFFF' : '#F8FAFC') : '#DDE3EA';
  ctx.fillRect(40, 40, w - 80, h - 80);

  ctx.strokeStyle = enhanced ? '#94A3B8' : '#64748B';
  ctx.lineWidth = enhanced ? 2 : 1.5;
  ctx.strokeRect(40, 40, w - 80, h - 80);

  // PAN Blue Header
  ctx.fillStyle = enhanced ? '#1E3A8A' : '#1E293B';
  ctx.fillRect(42, 42, w - 84, 42);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = enhanced ? 'bold 13px Inter, sans-serif' : '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('INCOME TAX DEPARTMENT (DEMO)', w / 2, 60);
  ctx.font = '9px Inter, sans-serif';
  ctx.fillText('GOVT. OF INDIA / भारत सरकार (SAMPLE)', w / 2, 75);

  // Photo
  ctx.fillStyle = enhanced ? '#E2E8F0' : '#CBD5E1';
  ctx.fillRect(65, 110, 95, 115);
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(112, 150, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(112, 210, 34, Math.PI, 0);
  ctx.fill();

  // QR Code square
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(w - 165, 110, 95, 95);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(w - 157, 118, 79, 79);
  ctx.fillStyle = '#0F172A';
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if ((r + c) % 2 === 0) ctx.fillRect(w - 153 + c * 15, 122 + r * 15, 11, 11);
    }
  }

  // PAN Fields
  ctx.textAlign = 'left';
  ctx.fillStyle = enhanced ? '#0F172A' : '#334155';

  ctx.font = '9px Inter, sans-serif';
  ctx.fillText('Permanent Account Number Card (DEMO)', 180, 110);

  ctx.font = enhanced ? 'bold 20px JetBrains Mono, monospace' : '18px monospace';
  ctx.fillText('ABCDE1234F', 180, 136);

  ctx.font = '9px Inter, sans-serif';
  ctx.fillText("Name / नाम", 180, 160);
  ctx.font = enhanced ? '600 13px Inter, sans-serif' : '12px sans-serif';
  ctx.fillText('RAHUL SHARMA', 180, 176);

  ctx.font = '9px Inter, sans-serif';
  ctx.fillText("Father's Name / पिता का नाम", 180, 200);
  ctx.font = enhanced ? '600 13px Inter, sans-serif' : '12px sans-serif';
  ctx.fillText('SURESH SHARMA', 180, 216);

  ctx.font = '9px Inter, sans-serif';
  ctx.fillText("Date of Birth / जन्म तिथि", 180, 240);
  ctx.font = enhanced ? '600 13px Inter, sans-serif' : '12px sans-serif';
  ctx.fillText('12/05/2003', 180, 256);

  // Hologram Ribbon
  ctx.fillStyle = enhanced ? '#F59E0B' : '#B45309';
  ctx.fillRect(65, 240, 95, 22);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 8px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('★ DEMO VERIFIED ★', 112, 254);
}

function drawUtilityBill(ctx, w, h, enhanced, filters) {
  // Paper sheet
  ctx.fillStyle = enhanced ? (filters.binarize ? '#FFFFFF' : '#FDFDFD') : '#EFECE6';
  ctx.fillRect(35, 30, w - 70, h - 60);

  ctx.strokeStyle = enhanced ? '#CBD5E1' : '#A8A29E';
  ctx.lineWidth = 1;
  ctx.strokeRect(35, 30, w - 70, h - 60);

  // Header Box
  ctx.fillStyle = enhanced ? '#0284C7' : '#0369A1';
  ctx.fillRect(45, 40, w - 90, 40);

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = enhanced ? 'bold 14px Inter, sans-serif' : '13px sans-serif';
  ctx.fillText('DEMO ELECTRICITY BOARD (UTILITY BILL)', w / 2, 58);
  ctx.font = '9px Inter, sans-serif';
  ctx.fillText('MONTHLY POWER CONSUMPTION STATEMENT', w / 2, 72);

  // Grid Box
  ctx.fillStyle = enhanced ? '#F8FAFC' : '#E2E8F0';
  ctx.fillRect(45, 90, w - 90, 80);
  ctx.strokeStyle = '#CBD5E1';
  ctx.strokeRect(45, 90, w - 90, 80);

  ctx.textAlign = 'left';
  ctx.fillStyle = enhanced ? '#0F172A' : '#334155';

  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('Consumer Number:', 60, 114);
  ctx.font = enhanced ? 'bold 12px JetBrains Mono' : '11px monospace';
  ctx.fillText('UTL784512', 170, 114);

  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('Service Provider:', 60, 138);
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('Demo Electricity', 170, 138);

  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('Bill Date:', w - 240, 114);
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('10/08/2026', w - 160, 114);

  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('Due Date:', w - 240, 138);
  ctx.font = enhanced ? 'bold 11px Inter, sans-serif' : '11px sans-serif';
  ctx.fillText('25/08/2026', w - 160, 138);

  // Premise Address
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('Connection / Premise Address:', 60, 195);
  ctx.font = enhanced ? '600 11px Inter, sans-serif' : '10px sans-serif';
  ctx.fillText('Flat 402, Shivam Heights, Andheri West, Mumbai, Maharashtra 400058', 60, 215);

  // Total Due Banner
  ctx.fillStyle = enhanced ? '#DC2626' : '#B91C1C';
  ctx.fillRect(45, 330, w - 90, 35);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = enhanced ? 'bold 14px Inter, sans-serif' : '13px sans-serif';
  ctx.fillText('TOTAL AMOUNT DUE:', 65, 353);
  ctx.textAlign = 'right';
  ctx.font = enhanced ? 'bold 16px JetBrains Mono' : '15px monospace';
  ctx.fillText('₹ 1,840', w - 65, 353);
}

function drawGenericDoc(ctx, w, h, enhanced) {
  ctx.fillStyle = enhanced ? '#FFFFFF' : '#E2E8F0';
  ctx.fillRect(40, 40, w - 80, h - 80);
  ctx.strokeStyle = '#94A3B8';
  ctx.strokeRect(40, 40, w - 80, h - 80);

  ctx.fillStyle = '#334155';
  ctx.font = '16px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DEMO DOCUMENT PREVIEW', w / 2, h / 2);
}

function applyArtifactOverlay(ctx, w, h) {
  const grad = ctx.createRadialGradient(w / 2, h / 2, w / 4, w / 2, h / 2, w / 1.4);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(40,30,10,0.18)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const size = Math.random() * 2.5;
    ctx.fillRect(x, y, size, size);
  }
}
