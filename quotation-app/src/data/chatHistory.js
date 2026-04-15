// Pre-seeded chat histories for demo
// Types: 'sent' (salesperson message), 'system' (AI response), 'quotation' (generated quotation card)
// Dates are relative to TODAY (April 15, 2026) so categories always work

const now = new Date();
const daysAgo = (d) => { const dt = new Date(now); dt.setDate(dt.getDate() - d); return dt; };
const daysFromNow = (d) => { const dt = new Date(now); dt.setDate(dt.getDate() + d); return dt; };
const fmt = (dt) => dt.toISOString();
const fmtDate = (dt) => dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export const chatHistories = {

  // ─────────────────────────────────────────
  // 1. RAVI KUMAR — West Mumbai (High Performer)
  // ─────────────────────────────────────────
  1: [
    { id: 'rk-m1', type: 'sent', text: 'Quotation for Rajesh Kumar - 1 LG OLED 65 inch TV', time: '09:15 AM', date: fmtDate(daysAgo(7)) },
    {
      id: 'rk-q1', type: 'quotation', time: '09:18 AM', date: fmtDate(daysAgo(7)),
      quotation: {
        id: 'QT-2026-001',
        customer: { id: 1, name: 'Rajesh Kumar', phone: '9876543210', city: 'Mumbai', address: '45 MG Road, Sector 12' },
        items: [{ product: { id: 5, name: 'LG 65" OLED 4K TV', price: 159990 }, qty: 1, price: 159990 }],
        subtotal: 159990, gst: 28798.2, total: 188788.2,
        date: fmtDate(daysAgo(7)), createdAt: fmt(daysAgo(7)),
        status: 'sent', stage: 'Negotiating',
        followUpDate: fmt(daysAgo(2)), // OVERDUE → Action Required
        notes: [{ date: fmt(daysAgo(4)), type: 'text', content: 'Customer showed interest, asked for 5% discount.' }],
        validTill: fmt(daysFromNow(3))
      }
    },
    { id: 'rk-m2', type: 'sent', text: 'Quote for Amit Gupta - 2 Samsung AC 1.5 ton', time: '11:30 AM', date: fmtDate(daysAgo(5)) },
    {
      id: 'rk-q2', type: 'quotation', time: '11:35 AM', date: fmtDate(daysAgo(5)),
      quotation: {
        id: 'QT-2026-002',
        customer: { id: 4, name: 'Amit Gupta', phone: '9876543213', city: 'Lucknow', address: '34 Civil Lines, Hazratganj' },
        items: [{ product: { id: 31, name: 'Daikin 1.5T 5 Star Inverter AC', price: 47990 }, qty: 2, price: 47990 }],
        subtotal: 95980, gst: 17276.4, total: 113256.4,
        date: fmtDate(daysAgo(5)), createdAt: fmt(daysAgo(5)),
        status: 'viewed', stage: 'Follow-Up',
        followUpDate: fmt(daysAgo(1)), // OVERDUE → Action Required
        notes: [{ date: fmt(daysAgo(3)), type: 'text', content: 'Client viewed quote, needs approval from partner.' }],
        validTill: fmt(daysFromNow(5))
      }
    },
    {
      id: 'rk-q3', type: 'quotation', time: '02:00 PM', date: fmtDate(daysAgo(3)),
      quotation: {
        id: 'QT-2026-003',
        customer: { id: 9, name: 'Vikram Joshi', phone: '9876543218', city: 'Pune', address: '101 FC Road, Shivajinagar' },
        items: [
          { product: { id: 24, name: 'HP 14s Core i5 Laptop', price: 52990 }, qty: 1, price: 52990 },
          { product: { id: 25, name: 'Dell Inspiron 15 Core i7', price: 74990 }, qty: 1, price: 74990 }
        ],
        subtotal: 127980, gst: 23036.4, total: 151016.4,
        date: fmtDate(daysAgo(3)), createdAt: fmt(daysAgo(3)),
        status: 'sent', stage: 'Sent',
        followUpDate: fmt(daysFromNow(4)), // Upcoming
        notes: [],
        validTill: fmt(daysFromNow(7))
      }
    },
    {
      id: 'rk-q4', type: 'quotation', time: '04:30 PM', date: fmtDate(daysAgo(10)),
      quotation: {
        id: 'QT-2026-004',
        customer: { id: 12, name: 'Neha Kapoor', phone: '9876543221', city: 'Bangalore', address: '23 Brigade Road' },
        items: [{ product: { id: 36, name: 'Samsung 7kg Front Load Washer', price: 28990 }, qty: 1, price: 28990 }],
        subtotal: 28990, gst: 5218.2, total: 34208.2,
        date: fmtDate(daysAgo(10)), createdAt: fmt(daysAgo(10)),
        status: 'viewed', stage: 'Won', // Completed - Won
        followUpDate: fmt(daysAgo(5)),
        notes: [{ date: fmt(daysAgo(6)), type: 'text', content: 'Order confirmed! Payment received.' }],
        validTill: fmt(daysAgo(1))
      }
    },
    {
      id: 'rk-q5', type: 'quotation', time: '10:00 AM', date: fmtDate(daysAgo(14)),
      quotation: {
        id: 'QT-2026-005',
        customer: { id: 16, name: 'Kavita Nair', phone: '9876543225', city: 'Kochi', address: '12 MG Road, Ernakulam' },
        items: [{ product: { id: 13, name: 'Sony 55" Bravia 4K TV', price: 59990 }, qty: 1, price: 59990 }],
        subtotal: 59990, gst: 10798.2, total: 70788.2,
        date: fmtDate(daysAgo(14)), createdAt: fmt(daysAgo(14)),
        status: 'sent', stage: 'Lost', // Completed - Lost
        followUpDate: fmt(daysAgo(8)),
        notes: [{ date: fmt(daysAgo(9)), type: 'text', content: 'Customer bought from competitor, price was lower.' }],
        validTill: fmt(daysAgo(4))
      }
    },
    {
      id: 'rk-q6', type: 'quotation', time: '03:00 PM', date: fmtDate(daysAgo(2)),
      quotation: {
        id: 'QT-2026-006',
        customer: { id: 17, name: 'Rohit Malhotra', phone: '9876543226', city: 'Chandigarh', address: '67 Sector 17' },
        items: [{ product: { id: 31, name: 'Daikin 1.5T 5 Star Inverter AC', price: 47990 }, qty: 3, price: 47990 }],
        subtotal: 143970, gst: 25914.6, total: 169884.6,
        date: fmtDate(daysAgo(2)), createdAt: fmt(daysAgo(2)),
        status: 'draft', stage: 'Sent',
        followUpDate: fmt(daysFromNow(6)), // Upcoming
        notes: [],
        validTill: fmt(daysFromNow(8))
      }
    }
  ],

  // ─────────────────────────────────────────
  // 2. SNEHA PATEL — South Delhi
  // ─────────────────────────────────────────
  2: [
    {
      id: 'sp-q1', type: 'quotation', time: '09:45 AM', date: fmtDate(daysAgo(6)),
      quotation: {
        id: 'QT-2026-011',
        customer: { id: 7, name: 'Priya Mehta', phone: '9876543216', city: 'Mumbai', address: '23 Linking Road, Bandra' },
        items: [{ product: { id: 31, name: 'Daikin 1.5T 5 Star Inverter AC', price: 47990 }, qty: 2, price: 47990 }],
        subtotal: 95980, gst: 17276.4, total: 113256.4,
        date: fmtDate(daysAgo(6)), createdAt: fmt(daysAgo(6)),
        status: 'viewed', stage: 'Negotiating',
        followUpDate: fmt(daysAgo(1)), // OVERDUE → Action Required
        notes: [{ date: fmt(daysAgo(3)), type: 'text', content: 'Needs EMI option, asked about 0% scheme.' }],
        validTill: fmt(daysFromNow(4))
      }
    },
    {
      id: 'sp-q2', type: 'quotation', time: '01:00 PM', date: fmtDate(daysAgo(4)),
      quotation: {
        id: 'QT-2026-012',
        customer: { id: 8, name: 'Priya Sharma', phone: '9876543217', city: 'Delhi', address: '67 Janpath, Connaught Place' },
        items: [{ product: { id: 5, name: 'LG 55" 4K OLED TV', price: 119990 }, qty: 1, price: 119990 }],
        subtotal: 119990, gst: 21598.2, total: 141588.2,
        date: fmtDate(daysAgo(4)), createdAt: fmt(daysAgo(4)),
        status: 'sent', stage: 'Follow-Up',
        followUpDate: fmt(daysFromNow(2)), // Upcoming
        notes: [],
        validTill: fmt(daysFromNow(6))
      }
    },
    {
      id: 'sp-q3', type: 'quotation', time: '04:00 PM', date: fmtDate(daysAgo(9)),
      quotation: {
        id: 'QT-2026-013',
        customer: { id: 10, name: 'Sunita Reddy', phone: '9876543219', city: 'Hyderabad', address: '45 Jubilee Hills, Road No 5' },
        items: [
          { product: { id: 36, name: 'Samsung 7kg Front Load Washer', price: 28990 }, qty: 1, price: 28990 },
          { product: { id: 37, name: 'LG 8kg Top Load Washer', price: 22990 }, qty: 1, price: 22990 }
        ],
        subtotal: 51980, gst: 9356.4, total: 61336.4,
        date: fmtDate(daysAgo(9)), createdAt: fmt(daysAgo(9)),
        status: 'sent', stage: 'Won', // Completed - Won
        followUpDate: fmt(daysAgo(5)),
        notes: [{ date: fmt(daysAgo(6)), type: 'text', content: 'Deal closed! Delivery scheduled for 18th.' }],
        validTill: fmt(daysAgo(1))
      }
    },
    {
      id: 'sp-q4', type: 'quotation', time: '11:30 AM', date: fmtDate(daysAgo(12)),
      quotation: {
        id: 'QT-2026-014',
        customer: { id: 14, name: 'Anjali Desai', phone: '9876543223', city: 'Ahmedabad', address: '89 Sarkhej Road, Satellite' },
        items: [{ product: { id: 24, name: 'HP 14s Core i5 Laptop', price: 52990 }, qty: 2, price: 52990 }],
        subtotal: 105980, gst: 19076.4, total: 125056.4,
        date: fmtDate(daysAgo(12)), createdAt: fmt(daysAgo(12)),
        status: 'viewed', stage: 'Lost', // Completed - Lost
        followUpDate: fmt(daysAgo(7)),
        notes: [{ date: fmt(daysAgo(8)), type: 'text', content: 'Budget cut, project postponed to Q3.' }],
        validTill: fmt(daysAgo(2))
      }
    },
    {
      id: 'sp-q5', type: 'quotation', time: '03:15 PM', date: fmtDate(daysAgo(1)),
      quotation: {
        id: 'QT-2026-015',
        customer: { id: 19, name: 'Sanjay Bhatia', phone: '9876543228', city: 'Delhi', address: '23 Laxmi Nagar, Dwarka' },
        items: [{ product: { id: 13, name: 'Sony 55" Bravia 4K TV', price: 59990 }, qty: 2, price: 59990 }],
        subtotal: 119980, gst: 21596.4, total: 141576.4,
        date: fmtDate(daysAgo(1)), createdAt: fmt(daysAgo(1)),
        status: 'draft', stage: 'Sent',
        followUpDate: fmt(daysFromNow(5)), // Upcoming
        notes: [],
        validTill: fmt(daysFromNow(9))
      }
    }
  ],

  // ─────────────────────────────────────────
  // 3. ARJUN MEHTA — Ahmedabad
  // ─────────────────────────────────────────
  3: [
    { id: 'am-m1', type: 'sent', text: 'Quote for Deepak Agarwal - 1 Samsung Washer', time: '10:00 AM', date: fmtDate(daysAgo(14)) },
    {
      id: 'am-q1', type: 'quotation', time: '10:05 AM', date: fmtDate(daysAgo(14)),
      quotation: {
        id: 'QT-2026-021',
        customer: { id: 11, name: 'Deepak Agarwal', phone: '9876543220', city: 'Jaipur', address: '78 MI Road, Pink City' },
        items: [{ product: { id: 36, name: 'Samsung 7kg Front Load Washer', price: 28990 }, qty: 1, price: 28990 }],
        subtotal: 28990, gst: 5218.2, total: 34208.2,
        date: fmtDate(daysAgo(14)), createdAt: fmt(daysAgo(14)),
        status: 'sent', stage: 'Won', // Completed - Won
        followUpDate: fmt(daysAgo(9)),
        notes: [{ date: fmt(daysAgo(10)), type: 'text', content: 'Closed deal! ₹34,208 received.' }],
        validTill: fmt(daysAgo(4))
      }
    },
    {
      id: 'am-q2', type: 'quotation', time: '02:30 PM', date: fmtDate(daysAgo(8)),
      quotation: {
        id: 'QT-2026-022',
        customer: { id: 3, name: 'Rajesh Patel', phone: '9876543212', city: 'Ahmedabad', address: '12 Ashram Road, Navrangpura' },
        items: [
          { product: { id: 5, name: 'LG 55" 4K OLED TV', price: 119990 }, qty: 1, price: 119990 },
          { product: { id: 31, name: 'Daikin 1.5T 5 Star Inverter AC', price: 47990 }, qty: 2, price: 47990 }
        ],
        subtotal: 215970, gst: 38874.6, total: 254844.6,
        date: fmtDate(daysAgo(8)), createdAt: fmt(daysAgo(8)),
        status: 'viewed', stage: 'Negotiating',
        followUpDate: fmt(daysAgo(2)), // OVERDUE → Action Required
        notes: [{ date: fmt(daysAgo(5)), type: 'text', content: 'Met at showroom. Wants bundle discount of 8%.' }],
        validTill: fmt(daysFromNow(2))
      }
    },
    {
      id: 'am-q3', type: 'quotation', time: '11:00 AM', date: fmtDate(daysAgo(5)),
      quotation: {
        id: 'QT-2026-023',
        customer: { id: 14, name: 'Anjali Desai', phone: '9876543223', city: 'Ahmedabad', address: '89 Sarkhej Road, Satellite' },
        items: [{ product: { id: 24, name: 'HP 14s Core i5 Laptop', price: 52990 }, qty: 3, price: 52990 }],
        subtotal: 158970, gst: 28614.6, total: 187584.6,
        date: fmtDate(daysAgo(5)), createdAt: fmt(daysAgo(5)),
        status: 'sent', stage: 'Follow-Up',
        followUpDate: fmt(daysAgo(1)), // OVERDUE → Action Required
        notes: [],
        validTill: fmt(daysFromNow(5))
      }
    },
    {
      id: 'am-q4', type: 'quotation', time: '04:00 PM', date: fmtDate(daysAgo(2)),
      quotation: {
        id: 'QT-2026-024',
        customer: { id: 17, name: 'Rohit Malhotra', phone: '9876543226', city: 'Chandigarh', address: '67 Sector 17' },
        items: [{ product: { id: 13, name: 'Sony 55" Bravia 4K TV', price: 59990 }, qty: 2, price: 59990 }],
        subtotal: 119980, gst: 21596.4, total: 141576.4,
        date: fmtDate(daysAgo(2)), createdAt: fmt(daysAgo(2)),
        status: 'draft', stage: 'Sent',
        followUpDate: fmt(daysFromNow(3)), // Upcoming
        notes: [],
        validTill: fmt(daysFromNow(8))
      }
    },
    {
      id: 'am-q5', type: 'quotation', time: '10:30 AM', date: fmtDate(daysAgo(1)),
      quotation: {
        id: 'QT-2026-025',
        customer: { id: 20, name: 'Pooja Saxena', phone: '9876543229', city: 'Bhopal', address: '78 Arera Colony, MP Nagar' },
        items: [{ product: { id: 31, name: 'Daikin 1.5T 5 Star Inverter AC', price: 47990 }, qty: 1, price: 47990 }],
        subtotal: 47990, gst: 8638.2, total: 56628.2,
        date: fmtDate(daysAgo(1)), createdAt: fmt(daysAgo(1)),
        status: 'sent', stage: 'Sent',
        followUpDate: fmt(daysFromNow(7)), // Upcoming
        notes: [],
        validTill: fmt(daysFromNow(10))
      }
    },
    {
      id: 'am-q6', type: 'quotation', time: '05:00 PM', date: fmtDate(daysAgo(20)),
      quotation: {
        id: 'QT-2026-026',
        customer: { id: 13, name: 'Suresh Yadav', phone: '9876543222', city: 'Shimla', address: '56 Mall Road, Shimla' },
        items: [{ product: { id: 36, name: 'Samsung 7kg Front Load Washer', price: 28990 }, qty: 2, price: 28990 }],
        subtotal: 57980, gst: 10436.4, total: 68416.4,
        date: fmtDate(daysAgo(20)), createdAt: fmt(daysAgo(20)),
        status: 'sent', stage: 'Lost', // Completed - Lost
        followUpDate: fmt(daysAgo(13)),
        notes: [{ date: fmt(daysAgo(14)), type: 'text', content: 'Customer bought locally, could not match price.' }],
        validTill: fmt(daysAgo(10))
      }
    }
  ],

  // ─────────────────────────────────────────
  // 4. DIVYA SINGH — Pune
  // ─────────────────────────────────────────
  4: [
    {
      id: 'ds-q1', type: 'quotation', time: '09:00 AM', date: fmtDate(daysAgo(7)),
      quotation: {
        id: 'QT-2026-031',
        customer: { id: 9, name: 'Vikram Joshi', phone: '9876543218', city: 'Pune', address: '101 FC Road, Shivajinagar' },
        items: [{ product: { id: 5, name: 'LG 65" OLED 4K TV', price: 159990 }, qty: 1, price: 159990 }],
        subtotal: 159990, gst: 28798.2, total: 188788.2,
        date: fmtDate(daysAgo(7)), createdAt: fmt(daysAgo(7)),
        status: 'viewed', stage: 'Negotiating',
        followUpDate: fmt(daysAgo(2)), // OVERDUE → Action Required
        notes: [{ date: fmt(daysAgo(4)), type: 'text', content: 'Customer wants extended warranty included.' }],
        validTill: fmt(daysFromNow(3))
      }
    },
    {
      id: 'ds-q2', type: 'quotation', time: '01:30 PM', date: fmtDate(daysAgo(3)),
      quotation: {
        id: 'QT-2026-032',
        customer: { id: 15, name: 'Manoj Tiwari', phone: '9876543224', city: 'Patna', address: '34 Boring Road, Patna City' },
        items: [{ product: { id: 24, name: 'HP 14s Core i5 Laptop', price: 52990 }, qty: 2, price: 52990 }],
        subtotal: 105980, gst: 19076.4, total: 125056.4,
        date: fmtDate(daysAgo(3)), createdAt: fmt(daysAgo(3)),
        status: 'sent', stage: 'Sent',
        followUpDate: fmt(daysFromNow(4)), // Upcoming
        notes: [],
        validTill: fmt(daysFromNow(7))
      }
    },
    {
      id: 'ds-q3', type: 'quotation', time: '03:45 PM', date: fmtDate(daysAgo(11)),
      quotation: {
        id: 'QT-2026-033',
        customer: { id: 2, name: 'Rajesh Sharma', phone: '9876543211', city: 'Delhi', address: '78 Gandhi Nagar, Near Station' },
        items: [{ product: { id: 31, name: 'Daikin 1.5T 5 Star Inverter AC', price: 47990 }, qty: 4, price: 47990 }],
        subtotal: 191960, gst: 34552.8, total: 226512.8,
        date: fmtDate(daysAgo(11)), createdAt: fmt(daysAgo(11)),
        status: 'sent', stage: 'Won', // Completed - Won
        followUpDate: fmt(daysAgo(6)),
        notes: [{ date: fmt(daysAgo(7)), type: 'text', content: 'Bulk order confirmed for office building.' }],
        validTill: fmt(daysAgo(1))
      }
    },
    {
      id: 'ds-q4', type: 'quotation', time: '10:00 AM', date: fmtDate(daysAgo(1)),
      quotation: {
        id: 'QT-2026-034',
        customer: { id: 6, name: 'Amit Singh', phone: '9876543215', city: 'Dehradun', address: '56 Rajpur Road, Clock Tower' },
        items: [{ product: { id: 13, name: 'Sony 55" Bravia 4K TV', price: 59990 }, qty: 1, price: 59990 }],
        subtotal: 59990, gst: 10798.2, total: 70788.2,
        date: fmtDate(daysAgo(1)), createdAt: fmt(daysAgo(1)),
        status: 'draft', stage: 'Follow-Up',
        followUpDate: fmt(daysFromNow(2)), // Upcoming
        notes: [],
        validTill: fmt(daysFromNow(9))
      }
    }
  ],

  // ─────────────────────────────────────────
  // 5. KARAN JOSHI — Jaipur
  // ─────────────────────────────────────────
  5: [
    {
      id: 'kj-q1', type: 'quotation', time: '10:30 AM', date: fmtDate(daysAgo(6)),
      quotation: {
        id: 'QT-2026-041',
        customer: { id: 11, name: 'Deepak Agarwal', phone: '9876543220', city: 'Jaipur', address: '78 MI Road, Pink City' },
        items: [{ product: { id: 36, name: 'Samsung 7kg Front Load Washer', price: 28990 }, qty: 2, price: 28990 }],
        subtotal: 57980, gst: 10436.4, total: 68416.4,
        date: fmtDate(daysAgo(6)), createdAt: fmt(daysAgo(6)),
        status: 'viewed', stage: 'Negotiating',
        followUpDate: fmt(daysAgo(1)), // OVERDUE → Action Required
        notes: [{ date: fmt(daysAgo(3)), type: 'text', content: 'Requested delivery before festival season.' }],
        validTill: fmt(daysFromNow(4))
      }
    },
    {
      id: 'kj-q2', type: 'quotation', time: '02:00 PM', date: fmtDate(daysAgo(4)),
      quotation: {
        id: 'QT-2026-042',
        customer: { id: 20, name: 'Pooja Saxena', phone: '9876543229', city: 'Bhopal', address: '78 Arera Colony, MP Nagar' },
        items: [{ product: { id: 5, name: 'LG 55" 4K OLED TV', price: 119990 }, qty: 1, price: 119990 }],
        subtotal: 119990, gst: 21598.2, total: 141588.2,
        date: fmtDate(daysAgo(4)), createdAt: fmt(daysAgo(4)),
        status: 'sent', stage: 'Sent',
        followUpDate: fmt(daysFromNow(3)), // Upcoming
        notes: [],
        validTill: fmt(daysFromNow(6))
      }
    },
    {
      id: 'kj-q3', type: 'quotation', time: '04:15 PM', date: fmtDate(daysAgo(10)),
      quotation: {
        id: 'QT-2026-043',
        customer: { id: 13, name: 'Suresh Yadav', phone: '9876543222', city: 'Shimla', address: '56 Mall Road, Shimla' },
        items: [{ product: { id: 31, name: 'Daikin 1.5T 5 Star Inverter AC', price: 47990 }, qty: 2, price: 47990 }],
        subtotal: 95980, gst: 17276.4, total: 113256.4,
        date: fmtDate(daysAgo(10)), createdAt: fmt(daysAgo(10)),
        status: 'sent', stage: 'Won', // Completed - Won
        followUpDate: fmt(daysAgo(5)),
        notes: [{ date: fmt(daysAgo(6)), type: 'text', content: 'Payment cleared. Installation scheduled.' }],
        validTill: fmt(daysAgo(1))
      }
    },
    {
      id: 'kj-q4', type: 'quotation', time: '11:45 AM', date: fmtDate(daysAgo(2)),
      quotation: {
        id: 'QT-2026-044',
        customer: { id: 19, name: 'Sanjay Bhatia', phone: '9876543228', city: 'Delhi', address: '23 Laxmi Nagar, Dwarka' },
        items: [{ product: { id: 24, name: 'HP 14s Core i5 Laptop', price: 52990 }, qty: 1, price: 52990 }],
        subtotal: 52990, gst: 9538.2, total: 62528.2,
        date: fmtDate(daysAgo(2)), createdAt: fmt(daysAgo(2)),
        status: 'draft', stage: 'Follow-Up',
        followUpDate: fmt(daysFromNow(5)), // Upcoming
        notes: [],
        validTill: fmt(daysFromNow(8))
      }
    }
  ],

  // ─────────────────────────────────────────
  // 6. NISHA GUPTA — Bangalore
  // ─────────────────────────────────────────
  6: [
    {
      id: 'ng-q1', type: 'quotation', time: '09:30 AM', date: fmtDate(daysAgo(5)),
      quotation: {
        id: 'QT-2026-051',
        customer: { id: 12, name: 'Neha Kapoor', phone: '9876543221', city: 'Bangalore', address: '23 Brigade Road, MG Circle' },
        items: [{ product: { id: 5, name: 'LG 65" OLED 4K TV', price: 159990 }, qty: 1, price: 159990 }],
        subtotal: 159990, gst: 28798.2, total: 188788.2,
        date: fmtDate(daysAgo(5)), createdAt: fmt(daysAgo(5)),
        status: 'viewed', stage: 'Negotiating',
        followUpDate: fmt(daysAgo(1)), // OVERDUE → Action Required
        notes: [{ date: fmt(daysAgo(2)), type: 'text', content: 'Customer comparing with Amazon price.' }],
        validTill: fmt(daysFromNow(5))
      }
    },
    {
      id: 'ng-q2', type: 'quotation', time: '01:00 PM', date: fmtDate(daysAgo(2)),
      quotation: {
        id: 'QT-2026-052',
        customer: { id: 16, name: 'Kavita Nair', phone: '9876543225', city: 'Kochi', address: '12 MG Road, Ernakulam' },
        items: [{ product: { id: 31, name: 'Daikin 1.5T 5 Star Inverter AC', price: 47990 }, qty: 2, price: 47990 }],
        subtotal: 95980, gst: 17276.4, total: 113256.4,
        date: fmtDate(daysAgo(2)), createdAt: fmt(daysAgo(2)),
        status: 'sent', stage: 'Sent',
        followUpDate: fmt(daysFromNow(4)), // Upcoming
        notes: [],
        validTill: fmt(daysFromNow(8))
      }
    },
    {
      id: 'ng-q3', type: 'quotation', time: '04:30 PM', date: fmtDate(daysAgo(12)),
      quotation: {
        id: 'QT-2026-053',
        customer: { id: 4, name: 'Amit Gupta', phone: '9876543213', city: 'Lucknow', address: '34 Civil Lines, Hazratganj' },
        items: [{ product: { id: 13, name: 'Sony 55" Bravia 4K TV', price: 59990 }, qty: 2, price: 59990 }],
        subtotal: 119980, gst: 21596.4, total: 141576.4,
        date: fmtDate(daysAgo(12)), createdAt: fmt(daysAgo(12)),
        status: 'sent', stage: 'Won', // Completed - Won
        followUpDate: fmt(daysAgo(7)),
        notes: [{ date: fmt(daysAgo(8)), type: 'text', content: 'Order confirmed, dispatched via BlueDart.' }],
        validTill: fmt(daysAgo(2))
      }
    }
  ],

  // ─────────────────────────────────────────
  // 7. RAHUL VERMA — Chennai
  // ─────────────────────────────────────────
  7: [
    {
      id: 'rv-q1', type: 'quotation', time: '10:00 AM', date: fmtDate(daysAgo(8)),
      quotation: {
        id: 'QT-2026-061',
        customer: { id: 18, name: 'Meena Iyer', phone: '9876543227', city: 'Chennai', address: '45 Anna Nagar, T Nagar' },
        items: [{ product: { id: 31, name: 'Daikin 1.5T 5 Star Inverter AC', price: 47990 }, qty: 3, price: 47990 }],
        subtotal: 143970, gst: 25914.6, total: 169884.6,
        date: fmtDate(daysAgo(8)), createdAt: fmt(daysAgo(8)),
        status: 'viewed', stage: 'Follow-Up',
        followUpDate: fmt(daysAgo(3)), // OVERDUE → Action Required
        notes: [{ date: fmt(daysAgo(5)), type: 'text', content: 'Office renovation pending, will confirm by end of month.' }],
        validTill: fmt(daysFromNow(2))
      }
    },
    {
      id: 'rv-q2', type: 'quotation', time: '02:00 PM', date: fmtDate(daysAgo(3)),
      quotation: {
        id: 'QT-2026-062',
        customer: { id: 10, name: 'Sunita Reddy', phone: '9876543219', city: 'Hyderabad', address: '45 Jubilee Hills, Road No 5' },
        items: [{ product: { id: 5, name: 'LG 55" 4K OLED TV', price: 119990 }, qty: 1, price: 119990 }],
        subtotal: 119990, gst: 21598.2, total: 141588.2,
        date: fmtDate(daysAgo(3)), createdAt: fmt(daysAgo(3)),
        status: 'sent', stage: 'Sent',
        followUpDate: fmt(daysFromNow(3)), // Upcoming
        notes: [],
        validTill: fmt(daysFromNow(7))
      }
    },
    {
      id: 'rv-q3', type: 'quotation', time: '11:30 AM', date: fmtDate(daysAgo(15)),
      quotation: {
        id: 'QT-2026-063',
        customer: { id: 15, name: 'Manoj Tiwari', phone: '9876543224', city: 'Patna', address: '34 Boring Road, Patna City' },
        items: [{ product: { id: 36, name: 'Samsung 7kg Front Load Washer', price: 28990 }, qty: 2, price: 28990 }],
        subtotal: 57980, gst: 10436.4, total: 68416.4,
        date: fmtDate(daysAgo(15)), createdAt: fmt(daysAgo(15)),
        status: 'sent', stage: 'Won', // Completed - Won
        followUpDate: fmt(daysAgo(9)),
        notes: [{ date: fmt(daysAgo(10)), type: 'text', content: 'Won! Best deal of the month.' }],
        validTill: fmt(daysAgo(5))
      }
    },
    {
      id: 'rv-q4', type: 'quotation', time: '03:00 PM', date: fmtDate(daysAgo(18)),
      quotation: {
        id: 'QT-2026-064',
        customer: { id: 17, name: 'Rohit Malhotra', phone: '9876543226', city: 'Chandigarh', address: '67 Sector 17' },
        items: [{ product: { id: 24, name: 'HP 14s Core i5 Laptop', price: 52990 }, qty: 3, price: 52990 }],
        subtotal: 158970, gst: 28614.6, total: 187584.6,
        date: fmtDate(daysAgo(18)), createdAt: fmt(daysAgo(18)),
        status: 'sent', stage: 'Lost', // Completed - Lost
        followUpDate: fmt(daysAgo(12)),
        notes: [{ date: fmt(daysAgo(13)), type: 'text', content: 'Customer went with a lower price from online portal.' }],
        validTill: fmt(daysAgo(8))
      }
    }
  ]
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
