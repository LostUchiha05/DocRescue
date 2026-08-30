import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToJSON = (documents, applicantName = '') => {
  const payload = {
    system: "Document Rescue AI Intelligence Engine",
    exportedAt: new Date().toISOString(),

    documents: documents.map(doc => ({
      documentId: doc.id,
      filename: doc.name,
      category: doc.category,
      subType: doc.subType,
      extractedData: doc.extractedData || {},
      fields: (doc.fields || []).map(f => ({
        key: f.key,
        label: f.label,
        value: f.value,
        rawOcrText: f.rawOcr || f.value,
        confidenceScore: f.confidence,
        verificationStatus: f.status,
        humanReviewed: f.status === 'verified',
        boundingCoordinates: f.bbox
      }))
    }))
  };

  const blob = new Blob(
    [JSON.stringify(payload, null, 2)],
    { type: 'application/json' }
  );

  const safeName =
    documents.length === 1
      ? documents[0].name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
      : 'Document_Rescue_Export';

  downloadBlob(
    blob,
    `${safeName}_structured_data.json`
  );
};
export const exportToCSV = (documents, applicantName = 'Rahul Sharma') => {
  const headers = ['Document Name', 'Document Category', 'Field Label', 'Field Key', 'Extracted Value', 'Confidence (%)', 'Verification Status'];
  
  const rows = documents.flatMap(doc =>
    doc.fields.map(f => [
      `"${doc.name}"`,
      `"${doc.category}"`,
      `"${f.label}"`,
      `"${f.key}"`,
      `"${f.value.replace(/"/g, '""')}"`,
      f.confidence,
      `"${f.status.toUpperCase()}"`
    ])
  );

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `Document_Rescue_${applicantName.replace(/\s+/g, '_')}_Master_Data.csv`);
};
export const exportToTXT = (documents, applicantName = 'Document') => {
  let content = '';

  content += 'DOCUMENT RESCUE\n';
  content += '==============================\n\n';

  content += `Applicant: ${applicantName}\n`;
  content += `Exported: ${new Date().toLocaleString()}\n`;
  content += `Documents: ${documents.length}\n\n`;

  documents.forEach((doc, index) => {
    content += '========================================\n';
    content += `DOCUMENT ${index + 1}\n`;
    content += '========================================\n\n';

    content += `File Name: ${doc.name || 'Unknown'}\n`;
    content += `Category: ${doc.category || 'Unknown'}\n`;
    content += `Type: ${doc.subType || 'Unknown'}\n`;

    if (doc.quality?.overall !== undefined) {
      content += `Quality Score: ${doc.quality.overall}%\n`;
    }

    content += '\n';

    if (doc.fields?.length) {
      content += 'EXTRACTED INFORMATION\n';
      content += '------------------------------\n\n';

      doc.fields.forEach((field) => {
        content += `${field.label || field.key || 'Field'}: ${
          field.value ?? ''
        }\n`;

        if (field.confidence !== undefined) {
          content += `Confidence: ${field.confidence}%\n`;
        }

        if (field.status) {
          content += `Status: ${field.status}\n`;
        }

        content += '\n';
      });
    }

    content += '\n';
  });

  const blob = new Blob(
    [content],
    { type: 'text/plain;charset=utf-8' }
  );

  downloadBlob(
    blob,
    `Document_Rescue_${applicantName.replace(/\s+/g, '_')}_Extracted_Text.txt`
  );
};

export const exportToExcel = (documents, applicantName = 'Rahul Sharma') => {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Master Extracted Fields
  const masterData = documents.flatMap(doc =>
    doc.fields.map(f => ({
      'Document': doc.name,
      'Category': doc.category,
      'Type': doc.subType,
      'Field Label': f.label,
      'Extracted Value': f.value,
      'Confidence (%)': f.confidence,
      'Verification Status': f.status === 'verified' ? 'Verified ✓' : 'Needs Review ⚠',
      'Raw OCR': f.rawOcr || f.value
    }))
  );
  const wsMaster = XLSX.utils.json_to_sheet(masterData);
  XLSX.utils.book_append_sheet(wb, wsMaster, 'Verified Master Data');

  // Sheet 2: Document Summary & Quality
  const summaryData = documents.map(doc => ({
    'Document Name': doc.name,
    'Category': doc.category,
    'Sub-Type': doc.subType,
    'File Size': doc.size,
    'Quality Score (%)': doc.quality?.overall,
    'Blur Index (%)': doc.quality?.blur,
    'Skew Angle': `${doc.quality?.skew}°`,
    'Contrast Boost': doc.improvements?.contrastBoost,
    'Readability Delta': doc.improvements?.readability,
    'Total Fields': doc.fields?.length,
    'Verified Fields': doc.fields?.filter(f => f.status === 'verified').length
  }));
  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Document Pipeline Audit');

  XLSX.writeFile(wb, `Document_Rescue_${applicantName.replace(/\s+/g, '_')}_Enterprise_Package.xlsx`);
};

export const exportToPDF = (documents, applicantName = '') => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const safeName =
    documents.length === 1
      ? documents[0].name
          .replace(/\.[^/.]+$/, '')
          .replace(/[^a-zA-Z0-9_-]/g, '_')
      : 'Document_Rescue_Export';

  // Header
  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, 595.28, 70, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DOCUMENT RESCUE', 40, 38);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(148, 163, 184);
  pdf.text(
    'AI Document Intelligence & Extraction Report',
    40,
    54
  );

  pdf.setTextColor(255, 255, 255);
  pdf.text(
    `Generated: ${new Date().toLocaleDateString()}`,
    450,
    45
  );

  let currentY = 95;

  documents.forEach((d, index) => {
    // Document heading
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');

    pdf.text(
      `${index + 1}. ${d.name}`,
      40,
      currentY
    );

    currentY += 16;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(71, 85, 105);

    pdf.text(
      `Type: ${d.documentType || d.subType || 'Unknown'}`,
      40,
      currentY
    );

    currentY += 20;

    // Actual extracted fields
    const tableRows = (d.fields || []).map(f => [
      f.label || f.key || '',
      String(f.value ?? ''),
      `${f.confidence ?? 0}%`,
      f.status === 'verified'
        ? 'Verified'
        : f.status === 'rejected'
        ? 'Rejected'
        : 'Needs Review'
    ]);

    if (tableRows.length === 0) {
      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(9);
      pdf.text(
        'No extracted fields available.',
        40,
        currentY
      );

      currentY += 30;
      return;
    }

    autoTable(pdf, {
      startY: currentY,
      head: [
        ['Field', 'Extracted Value', 'Confidence', 'Status']
      ],
      body: tableRows,

      theme: 'grid',

      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold'
      },

      styles: {
        fontSize: 8,
        cellPadding: 4,
        textColor: [51, 65, 85],
        overflow: 'linebreak'
      },

      columnStyles: {
        0: {
          cellWidth: 140,
          fontStyle: 'bold'
        },
        1: {
          cellWidth: 230
        },
        2: {
          cellWidth: 70,
          halign: 'center'
        },
        3: {
          cellWidth: 75,
          halign: 'center'
        }
      },

      margin: {
        left: 40,
        right: 40
      }
    });

    currentY = pdf.lastAutoTable.finalY + 30;

    // Start a new page when necessary
    if (
      index < documents.length - 1 &&
      currentY > 740
    ) {
      pdf.addPage();
      currentY = 50;
    }
  });

  // Footer on every page
  const pageCount = pdf.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);

    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);

    pdf.text(
      `Document Rescue — Extracted Document Report — Page ${i} of ${pageCount}`,
      40,
      820
    );
  }

  pdf.save(
    `${safeName}_structured_report.pdf`
  );
};
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
