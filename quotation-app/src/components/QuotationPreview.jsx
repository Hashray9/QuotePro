import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, MessageCircle, FileText, Loader2 } from 'lucide-react';
import { generateQuotationPDF, downloadPDF, shareOnWhatsApp } from '../utils/pdfGenerator';
import { formatCurrency } from '../utils/messageParser';

export default function QuotationPreview({ quotation, onClose }) {
  const [generating, setGenerating] = useState(false);

  if (!quotation || !quotation.customer || !quotation.items) {
    return null;
  }

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const doc = await generateQuotationPDF(quotation);
      downloadPDF(doc, `${quotation.id}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
    }
    setGenerating(false);
  };

  const handleWhatsAppShare = async () => {
    setGenerating(true);
    try {
      // First generate and download the PDF
      const doc = await generateQuotationPDF(quotation);
      downloadPDF(doc, `${quotation.id}.pdf`);
      // Then open WhatsApp with the message
      setTimeout(() => {
        shareOnWhatsApp(quotation);
      }, 500);
    } catch (err) {
      console.error('Share failed:', err);
    }
    setGenerating(false);
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h2>
            <FileText size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
            Quotation Preview — {quotation.id}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body - Preview */}
        <div className="modal-body" style={{ padding: '20px', backgroundColor: '#eef2f6' }}>
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #000',
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto',
            fontFamily: 'Arial, sans-serif',
            color: '#000'
          }}>
            {/* Header Row */}
            <div style={{ display: 'flex', borderBottom: '1px solid #000' }}>
              {/* Left Company Info */}
              <div style={{ flex: 1, padding: '10px', borderRight: '1px solid #000' }}>
                <div style={{ color: '#d71e28', fontSize: '26px', fontWeight: 'bold' }}>ElectroMart Solutions</div>
                <div style={{ color: '#28a03c', fontSize: '13px', fontStyle: 'italic', fontWeight: 'bold', marginBottom: '4px' }}>Business Growth Platform</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>ElectroMart Solutions</div>
                <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                  42 Electronics Plaza, Andheri West, Mumbai - 400058.<br />
                  Contact: +91 98981 92203<br />
                  Email: sales@electromart.in<br />
                  Web: www.electromart.in<br />
                  GSTIN : 27AABCE1234F1ZQ
                </div>
              </div>
              {/* Right Quotation Details */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ backgroundColor: '#dcdcdc', padding: '6px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid #000' }}>
                  QUOTATION
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, fontSize: '11px' }}>
                  <div style={{ display: 'flex', borderBottom: '1px solid #000', flex: 1 }}>
                    <div style={{ flex: 1, padding: '4px 8px', fontWeight: 'bold', borderRight: '1px solid #000' }}>Quotation No.</div>
                    <div style={{ flex: 1, padding: '4px 8px', textAlign: 'right' }}>{quotation.id}</div>
                  </div>
                  <div style={{ display: 'flex', borderBottom: '1px solid #000', flex: 1 }}>
                    <div style={{ flex: 1, padding: '4px 8px', fontWeight: 'bold', borderRight: '1px solid #000' }}>Date</div>
                    <div style={{ flex: 1, padding: '4px 8px', textAlign: 'right' }}>{quotation.date}</div>
                  </div>
                  <div style={{ display: 'flex', borderBottom: '1px solid #000', flex: 1 }}>
                    <div style={{ flex: 1, padding: '4px 8px', fontWeight: 'bold', borderRight: '1px solid #000' }}>Terms of Payment</div>
                    <div style={{ flex: 1, padding: '4px 8px', textAlign: 'right' }}>30 days Credit</div>
                  </div>
                  <div style={{ display: 'flex', flex: 1 }}>
                    <div style={{ flex: 1, padding: '4px 8px', fontWeight: 'bold', borderRight: '1px solid #000' }}>Client ID</div>
                    <div style={{ flex: 1, padding: '4px 8px', textAlign: 'right' }}>{quotation.customer.id || '57'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* To Section */}
            <div style={{ padding: '10px', borderBottom: '1px solid #000', fontSize: '12px', lineHeight: '1.5' }}>
              <div>To:</div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{quotation.customer.name.toUpperCase()},</div>
              <div>{quotation.customer.address}</div>
              <div>{quotation.customer.city}</div>
              <div style={{ marginTop: '5px' }}>Dear {quotation.customer.name.split(' ')[0]}</div>
              <div style={{ marginTop: '5px', fontWeight: 'bold' }}>Subject:- Quote for electrical and electronics</div>
            </div>

            {/* Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', borderBottom: '1px solid #000' }}>
              <thead>
                <tr style={{ backgroundColor: '#e6e6e6' }}>
                  <th style={{ padding: '6px', borderRight: '1px solid #000', borderBottom: '1px solid #000', width: '30px' }}>SN</th>
                  <th style={{ padding: '6px', borderRight: '1px solid #000', borderBottom: '1px solid #000', textAlign: 'left' }}>Description</th>
                  <th style={{ padding: '6px', borderRight: '1px solid #000', borderBottom: '1px solid #000', width: '80px' }}>HSN Code</th>
                  <th style={{ padding: '6px', borderRight: '1px solid #000', borderBottom: '1px solid #000', width: '50px' }}>Qty</th>
                  <th style={{ padding: '6px', borderBottom: '1px solid #000', width: '90px' }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '6px', borderRight: '1px solid #000', textAlign: 'center', fontWeight: 'bold' }}>{idx + 1}</td>
                    <td style={{ padding: '6px', borderRight: '1px solid #000' }}>
                      <div style={{ fontWeight: 'bold' }}>{item.product.name}</div>
                      {item.product.model && <div style={{ marginTop: '4px' }}>• Model :- {item.product.model}</div>}
                      <div style={{ marginTop: '2px' }}>• Brand Name :- {item.product.brand || 'Appliance'}</div>
                    </td>
                    <td style={{ padding: '6px', borderRight: '1px solid #000', textAlign: 'center' }}>8528</td>
                    <td style={{ padding: '6px', borderRight: '1px solid #000', textAlign: 'center' }}>{item.qty}.0</td>
                    <td style={{ padding: '6px', textAlign: 'right' }}>
                      {formatCurrency(item.price).replace('₹', '')}<br />per Nos
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Box */}
            <div style={{ display: 'flex', borderBottom: '1px solid #000' }}>
              {/* Note left side */}
              <div style={{ flex: '1.5', padding: '10px', borderRight: '1px solid #000', fontSize: '11px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '12px' }}>Note:</div>
                <div style={{ marginTop: '4px' }}>Quote valid for 10days</div>
              </div>
              {/* Totals right side */}
              <div style={{ flex: '1', padding: '10px', fontSize: '11px', lineHeight: '1.6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>Sub Total</span>
                  <span>:</span>
                  <span>{formatCurrency(quotation.subtotal).replace('₹', '')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>SGST 9 Tax (9.0%) Extra</span>
                  <span>:</span>
                  <span>{formatCurrency(quotation.gst / 2).replace('₹', '')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>CGST 9 Tax (9.0%) Extra</span>
                  <span>:</span>
                  <span>{formatCurrency(quotation.gst / 2).replace('₹', '')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Round Off</span>
                  <span>:</span>
                  <span>0.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '4px' }}>
                  <span>Total Amount</span>
                  <span>:</span>
                  <span>{formatCurrency(quotation.total).replace('₹', '')}</span>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div style={{ padding: '10px', fontSize: '11px', borderBottom: '1px solid #000', display: 'flex' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '6px' }}>Terms and Conditions:</div>
                <div style={{ display: 'flex', marginBottom: '2px' }}><div style={{ width: '80px' }}>1.GST</div><div style={{ width: '10px' }}>:</div><div>28% for supply</div></div>
                <div style={{ display: 'flex', marginBottom: '2px' }}><div style={{ width: '80px' }}>2.GST</div><div style={{ width: '10px' }}>:</div><div>18% for erection</div></div>
                <div style={{ display: 'flex', marginBottom: '2px' }}><div style={{ width: '80px' }}>3.Delivery</div><div style={{ width: '10px' }}>:</div><div>15days</div></div>
                <div style={{ display: 'flex', marginBottom: '2px' }}><div style={{ width: '80px' }}>4.Transporting</div><div style={{ width: '10px' }}>:</div><div>Rs1500 + 28%extra</div></div>
              </div>
              <div style={{ width: '200px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 'bold' }}>For ElectroMart Solutions,</div>
                <div style={{ height: '40px' }}>
                  <svg width="80" height="30" viewBox="0 0 100 40">
                    <path d="M10,20 Q20,5 30,25 T50,15 T70,30 T90,20" fill="none" stroke="#2c3e50" strokeWidth="2" />
                  </svg>
                </div>
                <div>Authorized Signatory</div>
              </div>
            </div>

            {/* Footer Brands */}
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
              <div style={{ color: '#003399', fontWeight: 'bold', fontSize: '20px' }}>SAMSUNG</div>
              <div style={{ color: '#cc0000', fontWeight: 'bold', fontSize: '24px' }}>ONIDA</div>
              <div style={{ color: '#990033', fontWeight: 'bold', fontSize: '20px' }}>LG</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ color: '#666', fontWeight: 'bold', fontSize: '18px' }}>Whirlpool</div>
                <div style={{ color: '#666', fontSize: '8px' }}>SENSING THE DIFFERENCE</div>
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '5px', fontSize: '11px', borderTop: '1px solid #ddd' }}>
              This is a Software Generated Quotation.
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="modal-footer">
          <button className="btn-outline" onClick={onClose}>
            <X size={16} /> Close
          </button>
          <button className="btn-primary" onClick={handleDownload} disabled={generating}>
            {generating ? <Loader2 size={16} className="spinning" /> : <Download size={16} />}
            Download PDF
          </button>
          <button className="btn-whatsapp" onClick={handleWhatsAppShare} disabled={generating}>
            <MessageCircle size={16} /> Share WhatsApp
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
