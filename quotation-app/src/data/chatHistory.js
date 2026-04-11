// Pre-seeded chat histories for demo
// Types: 'sent' (salesperson message), 'system' (AI response), 'quotation' (generated quotation card)

// Normalized base dates for fixed demo (Today is April 9, 2026)
const today = new Date('2026-04-09T10:00:00');
const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
const thisWeekStart = new Date('2026-04-06T00:00:00'); // Monday
const lastWeek = new Date(today); lastWeek.setDate(today.getDate() - 10);
const lastMonth = new Date(today); lastMonth.setDate(today.getDate() - 25);

export const chatHistories = {
  // Ravi Kumar - High performer
  1: [
    { id: 'm1', type: 'sent', text: 'Quotation for RajeshPatel - 2 Samsung 55 inch TV', time: '09:15 AM', date: '2026-04-09' },
    { id: 'm5', type: 'quotation', time: '09:20 AM', date: '2026-04-09',
      quotation: {
        id: 'QT-2026-001',
        customer: { id: 3, name: 'Rajesh Patel', phone: '9876543212', city: 'Ahmedabad', address: 'Plot 12, Satellite Area' },
        items: [{ product: { id: 3, name: 'Samsung 55" Crystal 4K UHD TV', price: 52990 }, qty: 2, price: 52990 }],
        subtotal: 105980, gst: 19076.4, total: 125056.4,
        date: '09 Apr 2026', createdAt: today.toISOString(),
        status: 'viewed', stage: 'Won', // WON TODAY
        notes: [], validTill: new Date(today.getTime() + 10 * 86400000).toISOString()
      }
    },
    { id: 'm6', type: 'sent', text: 'Need quote for Amit Singh 1 LG OLED and 1 sony bravia', time: '11:45 AM', date: '2026-04-08' },
    { id: 'm10', type: 'quotation', time: '11:50 AM', date: '2026-04-08',
      quotation: {
        id: 'QT-2026-002',
        customer: { id: 6, name: 'Amit Singh', phone: '9876543215', city: 'Dehradun', address: '45 Rajpur Road' },
        items: [
          { product: { id: 5, name: 'LG 55" 4K OLED TV', price: 119990 }, qty: 1, price: 119990 },
          { product: { id: 13, name: 'Sony 55" Bravia 4K TV', price: 59990 }, qty: 1, price: 59990 }
        ],
        subtotal: 179980, gst: 32396.4, total: 212376.4,
        date: '08 Apr 2026', createdAt: yesterday.toISOString(),
        status: 'sent', stage: 'Sent', // PIPELINE YESTERDAY
        notes: [], validTill: new Date(yesterday.getTime() + 10 * 86400000).toISOString()
      }
    },
    { id: 'm14', type: 'quotation', time: '02:00 PM', date: '2026-04-07',
      quotation: {
        id: 'QT-2026-006',
        customer: { id: 1, name: 'Rajesh Kumar', phone: '9876543210', city: 'Mumbai', address: '45 MG Road' },
        items: [{ product: { id: 31, name: 'Daikin 1.5T 5 Star Inverter AC', price: 47990 }, qty: 2, price: 47990 }],
        subtotal: 95980, gst: 17276.4, total: 113256.4,
        date: '07 Apr 2026', createdAt: thisWeekStart.toISOString(),
        status: 'draft', stage: 'Won', // WON THIS WEEK
        notes: [], validTill: new Date(thisWeekStart.getTime() + 10 * 86400000).toISOString()
      }
    }
  ],
  // Sneha Patel - Middle performer
  2: [
    { id: 's1', type: 'quotation', time: '10:00 AM', date: '2026-04-09',
      quotation: {
        id: 'QT-2026-003',
        customer: { id: 7, name: 'Priya Mehta', phone: '9876543216', city: 'Mumbai' },
        items: [{ product: { id: 31, name: 'Daikin 1.5T 5 Star Inverter AC', price: 47990 }, qty: 1, price: 47990 }],
        subtotal: 47990, gst: 8638.2, total: 56628.2,
        date: '09 Apr 2026', createdAt: today.toISOString(),
        status: 'sent', stage: 'Sent', // PIPELINE TODAY
        notes: [], validTill: new Date(today.getTime() + 10 * 86400000).toISOString()
      }
    },
    { id: 's5', type: 'quotation', time: '04:00 PM', date: '2026-04-08',
      quotation: {
        id: 'QT-2026-004',
        customer: { id: 9, name: 'Vikram Joshi', phone: '9876543218', city: 'Pune' },
        items: [{ product: { id: 24, name: 'HP 14s Core i5 Laptop', price: 52990 }, qty: 1, price: 52990 }],
        subtotal: 52990, gst: 9538.2, total: 62528.2,
        date: '08 Apr 2026', createdAt: yesterday.toISOString(),
        status: 'viewed', stage: 'Won', // WON YESTERDAY
        notes: [], validTill: new Date(yesterday.getTime() + 10 * 86400000).toISOString()
      }
    }
  ],
  // Arjun Mehta
  3: [
    { id: 'a4', type: 'quotation', time: '11:00 AM', date: '2026-04-01',
      quotation: {
        id: 'QT-2026-005',
        customer: { id: 11, name: 'Deepak Agarwal', city: 'Jaipur' },
        items: [{ product: { id: 36, name: 'Samsung 7kg Front Load Washer', price: 28990 }, qty: 1, price: 28990 }],
        subtotal: 28990, gst: 5218.2, total: 34208.2,
        date: '01 Apr 2026', createdAt: new Date('2026-04-01T11:00:00').toISOString(),
        status: 'sent', stage: 'Won', // WON THIS MONTH
        notes: [], validTill: new Date('2026-04-11T11:00:00').toISOString()
      }
    }
  ],
  4: [], 5: [], 6: [], 7: []
};

export function getLastMessage(salespersonId) {
  const history = chatHistories[salespersonId];
  if (!history || history.length === 0) return { text: 'No messages yet', time: '' };
  const last = history[history.length - 1];
  if (last.type === 'quotation') return { text: `📄 Quotation ${last.quotation.id} created`, time: last.time };
  return { text: (last.text || '').substring(0, 45) + ((last.text || '').length > 45 ? '...' : ''), time: last.time };
}

export function getQuotationCount(salespersonId) {
  const history = chatHistories[salespersonId];
  if (!history) return 0;
  return history.filter(m => m.type === 'quotation').length;
}

