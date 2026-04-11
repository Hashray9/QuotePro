import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { customers } from '../data/customers';
import { Search, Phone, MessageCircle, MapPin } from 'lucide-react';

export default function Customers() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="page-container" style={{ height: '100%' }}>
      {/* Search */}
      <div className="sidebar-search">
        <div className="search-input-wrapper">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Customer list */}
      <div className="customer-list">
        {filtered.map((customer, idx) => (
          <motion.div
            key={customer.id}
            className="customer-row"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.03 }}
          >
            <div className="avatar-circle small" style={{ background: `hsl(${customer.id * 37}, 55%, 45%)` }}>
              {customer.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="customer-details">
              <div className="customer-name">{customer.name}</div>
              <div className="customer-address">
                <MapPin size={11} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
                {customer.address}, {customer.city} - {customer.pincode}
              </div>
            </div>
            <div className="customer-contact">
              <span className="customer-phone">
                <Phone size={12} />
                {customer.phone}
              </span>
              <button
                className="customer-whatsapp-btn"
                onClick={() => window.open(`https://wa.me/91${customer.whatsapp}`, '_blank')}
                title="WhatsApp"
              >
                <MessageCircle size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
