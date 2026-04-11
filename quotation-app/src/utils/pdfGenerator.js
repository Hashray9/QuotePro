import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COMPANY = {
  name: 'ElectroMart Solutions',
  tagline: 'Business Growth Platform',
  address: '42 Electronics Plaza, Andheri West, Mumbai - 400058',
  phone: '+91 98981 92203',
  email: 'sales@electromart.in',
  website: 'www.electromart.in',
  gstin: '27AABCE1234F1ZQ',
};

/**
 * Generate a professional PDF quotation matching CatalystK style
 */
export async function generateQuotationPDF(quotation) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  
  let y = margin;
  
  // Set default border thickness
  doc.setLineWidth(0.3);
  doc.setDrawColor(0);
  
  // 1. HEADER ROW
  const headerHeight = 42;
  doc.rect(margin, y, pageWidth - 2 * margin, headerHeight);
  doc.line(pageWidth / 2, y, pageWidth / 2, y + headerHeight);
  
  // Left: Company Info
  doc.setTextColor(215, 30, 40); // Red
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(COMPANY.name, margin + 2, y + 8);
  
  doc.setTextColor(40, 160, 60); // Green
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bolditalic');
  doc.text(COMPANY.tagline, margin + 2, y + 13);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(COMPANY.name, margin + 2, y + 18);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const addressLines = doc.splitTextToSize(COMPANY.address, (pageWidth / 2) - 4);
  doc.text(addressLines, margin + 2, y + 22);
  doc.text(`Contact: ${COMPANY.phone}`, margin + 2, y + 28);
  doc.text(`Email: ${COMPANY.email}`, margin + 2, y + 32);
  doc.text(`Web: ${COMPANY.website}`, margin + 2, y + 36);
  doc.text(`GSTIN : ${COMPANY.gstin}`, margin + 2, y + 40);
  
  // Right: QUOTATION Title & details
  doc.setFillColor(220, 220, 220);
  doc.rect(pageWidth / 2, y, (pageWidth / 2) - margin, 8, 'F');
  doc.line(pageWidth / 2, y + 8, pageWidth - margin, y + 8); // bottom title border
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTATION', pageWidth * 0.75, y + 5.5, { align: 'center' });
  
  // Sub-grid in right header
  doc.setFontSize(8);
  
  // Row 1
  doc.setFont('helvetica', 'bold');
  doc.text('Quotation No.', pageWidth / 2 + 2, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.text(quotation.id, pageWidth - margin - 2, y + 13, { align: 'right' });
  doc.line(pageWidth / 2, y + 15, pageWidth - margin, y + 15);
  
  // Row 2
  doc.setFont('helvetica', 'bold');
  doc.text('Date', pageWidth / 2 + 2, y + 20);
  doc.setFont('helvetica', 'normal');
  doc.text(quotation.date, pageWidth - margin - 2, y + 20, { align: 'right' });
  doc.line(pageWidth / 2, y + 22, pageWidth - margin, y + 22);
  
  // Row 3
  doc.setFont('helvetica', 'bold');
  doc.text('Terms of Payment', pageWidth / 2 + 2, y + 27);
  doc.setFont('helvetica', 'normal');
  doc.text('30 days Credit', pageWidth - margin - 2, y + 27, { align: 'right' });
  doc.line(pageWidth / 2, y + 29, pageWidth - margin, y + 29);
  
  // Row 4
  doc.setFont('helvetica', 'bold');
  doc.text('Client ID', pageWidth / 2 + 2, y + 34);
  doc.setFont('helvetica', 'normal');
  doc.text(`${quotation.customer.id || '57'}`, pageWidth - margin - 2, y + 34, { align: 'right' });
  
  // Vertical line in right header grid
  doc.line(pageWidth * 0.75, y + 8, pageWidth * 0.75, y + headerHeight);
  
  y += headerHeight;
  
  // 2. CUSTOMER ROW ("To:")
  const customerHeight = 38;
  doc.rect(margin, y, pageWidth - 2 * margin, customerHeight);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('To:', margin + 2, y + 5);
  
  doc.setFontSize(11);
  doc.text(`${quotation.customer.name.toUpperCase()},`, margin + 2, y + 11);
  
  doc.setFontSize(10);
  doc.text(quotation.customer.address || '', margin + 2, y + 17);
  doc.text(quotation.customer.city || '', margin + 2, y + 23);
  
  doc.text(`Dear ${quotation.customer.name.split(' ')[0]}`, margin + 2, y + 29);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Subject:-  Quote for electrical and electronics', margin + 2, y + 35);
  
  y += customerHeight;
  
  // 3. TABLE
  const tableData = quotation.items.map((item, index) => {
    return [
      index + 1,
      { content: `${item.product.name}\n\n${item.product.model ? `• Model :- ${item.product.model}\n` : ''}• Brand Name :- ${item.product.brand || 'Appliance'}` },
      '8528', // Placeholder HSN Code
      `${item.qty}.0`,
      `${formatINR(item.price)}\nper Nos`
    ];
  });
  
  autoTable(doc, {
    startY: y,
    head: [['SN', 'Description', 'HSN Code', 'Qty', 'Price']],
    body: tableData,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.3,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [230, 230, 230],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 'auto', fontStyle: 'bold' },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 25, halign: 'right' },
    },
    margin: { left: margin, right: margin },
    tableWidth: pageWidth - 2 * margin,
  });
  
  y = doc.lastAutoTable.finalY;
  
  // 4. TOTALS ROW
  const totalsBoxHeight = 35;
  doc.rect(margin, y, pageWidth - 2 * margin, totalsBoxHeight);
  
  // Vertical split
  const totalsStartX = pageWidth * 0.6;
  doc.line(totalsStartX, y, totalsStartX, y + totalsBoxHeight);
  
  // Left: Note
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Note:', margin + 2, y + 6);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Quote valid for 10days', margin + 4, y + 12);
  
  // Right: Taxes
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Sub Total', totalsStartX + 2, y + 6);
  doc.text(':', totalsStartX + 42, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(formatINR(quotation.subtotal), pageWidth - margin - 2, y + 6, { align: 'right' });
  
  const sgst = quotation.gst / 2;
  const cgst = quotation.gst / 2;
  
  doc.setFont('helvetica', 'normal');
  doc.text('SGST 9 Tax (9.0%) Extra', totalsStartX + 2, y + 12);
  doc.text(':', totalsStartX + 42, y + 12);
  doc.text(formatINR(sgst), pageWidth - margin - 2, y + 12, { align: 'right' });
  
  doc.text('CGST 9 Tax (9.0%) Extra', totalsStartX + 2, y + 18);
  doc.text(':', totalsStartX + 42, y + 18);
  doc.text(formatINR(cgst), pageWidth - margin - 2, y + 18, { align: 'right' });
  
  doc.text('Round Off', totalsStartX + 2, y + 24);
  doc.text(':', totalsStartX + 42, y + 24);
  doc.text('0.00', pageWidth - margin - 2, y + 24, { align: 'right' });
  
  doc.setFont('helvetica', 'bold');
  doc.text('Total Amount', totalsStartX + 2, y + 30);
  doc.text(':', totalsStartX + 42, y + 30);
  doc.text(formatINR(quotation.total), pageWidth - margin - 2, y + 30, { align: 'right' });
  
  y += totalsBoxHeight;
  
  // 5. TERMS & SIGNATURE ROW
  // Instead of a fixed height, let's take whatever is remaining minus brand footer space
  const brandsFooterHeight = 25;
  const termsBoxHeight = pageHeight - y - margin - brandsFooterHeight - 5; // 5 is spacing
  doc.rect(margin, y, pageWidth - 2 * margin, termsBoxHeight);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Terms and Conditions:', margin + 2, y + 6);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('1.GST', margin + 3, y + 12);
  doc.text(':', margin + 25, y + 12);
  doc.text('28% for supply', margin + 30, y + 12); // From user image
  
  doc.text('2.GST', margin + 3, y + 17);
  doc.text(':', margin + 25, y + 17);
  doc.text('18% for erection', margin + 30, y + 17);
  
  doc.text('3.Delivery', margin + 3, y + 22);
  doc.text(':', margin + 25, y + 22);
  doc.text('15days', margin + 30, y + 22);
  
  doc.text('4.Transporting', margin + 3, y + 27);
  doc.text(':', margin + 25, y + 27);
  doc.text('Rs1500 + 28%extra', margin + 30, y + 27);
  
  // Signature
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`For ${COMPANY.name},`, pageWidth - margin - 8, y + 18, { align: 'right' });
  
  // Simulated signature drawing
  doc.setDrawColor(50, 60, 150); // Dark blue signature
  doc.setLineWidth(0.6);
  const sigX = pageWidth - margin - 40;
  const sigY = y + 30;
  doc.line(sigX, sigY, sigX + 6, sigY - 6);
  doc.line(sigX + 6, sigY - 6, sigX + 12, sigY + 5);
  doc.line(sigX + 12, sigY + 5, sigX + 18, sigY - 2);
  doc.line(sigX + 18, sigY - 2, sigX + 26, sigY + 3);
  doc.setLineWidth(0.3); // reset
  doc.setDrawColor(0);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Authorized Signatory', pageWidth - margin - 8, y + 42, { align: 'right' });
  
  y += termsBoxHeight + 2;
  
  // 6. BRANDS FOOTER
  // Let's create a visual box containing some brand names just like the image
  doc.rect(margin, y, pageWidth - 2 * margin, brandsFooterHeight);
  
  const brandY = y + 15;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 51, 153);
  doc.text('SAMSUNG', margin + 10, brandY);
  
  doc.setFontSize(22);
  doc.setTextColor(204, 0, 0); // Re-creating ONIDA red box text
  doc.text('ONIDA', margin + 55, brandY);
  
  doc.setFontSize(18);
  doc.setTextColor(153, 0, 51);
  doc.text('LG', margin + 110, brandY);
  
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text('Whirlpool', margin + 140, brandY - 2);
  doc.setFontSize(7);
  doc.text('SENSING THE DIFFERENCE', margin + 140, brandY + 4);
  
  doc.setTextColor(0, 0, 0); // reset
  
  // Center Bottom text
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('This is a Software Generated Quotation.', pageWidth / 2, y + brandsFooterHeight + 5, { align: 'center' });

  return doc;
}

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Download PDF
 */
export function downloadPDF(doc, filename) {
  doc.save(filename || 'quotation.pdf');
}

/**
 * Get PDF as Blob for sharing
 */
export function getPDFBlob(doc) {
  return doc.output('blob');
}

/**
 * Open WhatsApp share with quotation details
 */
export function shareOnWhatsApp(quotation) {
  const message = encodeURIComponent(
    `📄 *Quotation ${quotation.id}*\n` +
    `From: *${COMPANY.name}*\n\n` +
    `Dear ${quotation.customer.name},\n\n` +
    `Please find your quotation details below:\n\n` +
    quotation.items.map(item =>
      `• ${item.qty}x ${item.product.name} - ₹${new Intl.NumberFormat('en-IN').format(item.price * item.qty)}`
    ).join('\n') +
    `\n\n*Total: ₹${new Intl.NumberFormat('en-IN').format(Math.round(quotation.total))}* (incl. GST)\n\n` +
    `Valid for 15 days.\n` +
    `Thank you! 🙏\n` +
    `${COMPANY.name}\n${COMPANY.phone}`
  );

  const whatsappNumber = quotation.customer.whatsapp || quotation.customer.phone;
  const url = `https://wa.me/91${whatsappNumber}?text=${message}`;
  window.open(url, '_blank');
}
