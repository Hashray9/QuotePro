import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Search, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { customers } from '../data/customers';
import { products, categories } from '../data/products';
import { formatCurrency } from '../utils/messageParser';

export default function QuotationForm({ onClose }) {
  const { currentUser, generateManualQuotation } = useApp();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearch, setCustomerSearch] = useState('');
  
  const [selectedItems, setSelectedItems] = useState([]); // { product: {}, qty: 1 }
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return customers.slice(0, 5); // Show first 5 initially
    return customers.filter(c => 
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch) ||
      c.city.toLowerCase().includes(customerSearch.toLowerCase())
    ).slice(0, 5);
  }, [customerSearch]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchSearch = !productSearch || 
                          p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.model.toLowerCase().includes(productSearch.toLowerCase());
      return matchCat && matchSearch;
    }).slice(0, 8); // Limit to keep UI responsive
  }, [productSearch, categoryFilter]);

  const handleAddItem = (product) => {
    const existing = selectedItems.find(i => i.product.id === product.id);
    if (existing) {
      setSelectedItems(selectedItems.map(i => 
        i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
      ));
    } else {
      setSelectedItems([...selectedItems, { product, qty: 1 }]);
    }
  };

  const handleUpdateQty = (productId, delta) => {
    setSelectedItems(selectedItems.map(i => {
      if (i.product.id === productId) {
        const newQty = Math.max(1, i.qty + delta);
        return { ...i, qty: newQty };
      }
      return i;
    }));
  };

  const handleRemoveItem = (productId) => {
    setSelectedItems(selectedItems.filter(i => i.product.id !== productId));
  };

  const calculateTotal = () => {
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
    const gst = subtotal * 0.18;
    return subtotal + gst;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      alert("Please select a customer");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Please add at least one product");
      return;
    }

    generateManualQuotation(currentUser.salespersonId, selectedCustomer, selectedItems);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px'
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          background: 'var(--bg-primary, #fff)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '800px',
          maxHeight: isMobile ? '100vh' : '90vh',
          height: isMobile ? '100%' : 'auto',
          borderRadius: isMobile ? '0' : '16px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          overflow: 'hidden'
        }}
      >
        <div style={{
          padding: '16px 20px', background: 'var(--primary-dark)', color: 'white',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Create Quotation Manually</h3>
          <button onClick={onClose} style={{ background: 'none', color: 'white', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ 
          display: 'flex', 
          flex: 1, 
          overflow: 'hidden', 
          flexDirection: isMobile ? 'column' : 'row' 
        }}>
          {/* Left panel - Selection */}
          <div style={{ 
            flex: 1, 
            padding: isMobile ? '16px' : '20px', 
            overflowY: 'auto', 
            borderRight: isMobile ? 'none' : '1px solid var(--border)',
            borderBottom: isMobile ? '1px solid var(--border)' : 'none'
          }}>
            
            {/* Customer Selection */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--text-primary)' }}>1. Select Customer</h4>
              {!selectedCustomer ? (
                <>
                  <div className="search-input-wrapper" style={{ marginBottom: '12px' }}>
                    <Search size={16} />
                    <input 
                      type="text" 
                      placeholder="Search customers by name, phone or city..." 
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filteredCustomers.map(c => (
                      <div 
                        key={c.id} 
                        onClick={() => setSelectedCustomer(c)}
                        style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                      >
                        <div>
                          <div style={{ fontWeight: 500 }}>{c.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{c.city} • {c.phone}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ padding: '12px 16px', background: 'var(--primary-bg)', border: '1px solid var(--primary-light)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>{selectedCustomer.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selectedCustomer.city} • {selectedCustomer.phone}</div>
                  </div>
                  <button onClick={() => setSelectedCustomer(null)} style={{ background: 'none', color: 'var(--text-secondary)', fontSize: '13px', border: 'none', cursor: 'pointer' }}>
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* Product Selection */}
            <div>
              <h4 style={{ marginBottom: '12px', color: 'var(--text-primary)' }}>2. Add Products</h4>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'white' }}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <div className="search-input-wrapper" style={{ flex: 1 }}>
                  <Search size={16} />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '8px' }}>
                {filteredProducts.map(p => (
                  <div key={p.id} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px', lineHeight: 1.3 }}>{p.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--primary-dark)', fontWeight: 600 }}>{formatCurrency(p.price)}</div>
                    </div>
                    <button 
                      onClick={() => handleAddItem(p)}
                      style={{ marginTop: '8px', background: 'var(--primary-light)', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right panel - Summary */}
          <div style={{ 
            width: isMobile ? '100%' : '320px', 
            background: '#f8f9fa', 
            display: 'flex', 
            flexDirection: 'column',
            maxHeight: isMobile ? '300px' : 'auto',
            borderTop: isMobile ? '1px solid var(--border)' : 'none'
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>
              Quotation Summary
            </div>
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
              {selectedItems.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '40px' }}>
                  No products added yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedItems.map((item) => (
                    <div key={item.product.id} style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '8px', paddingRight: '20px', position: 'relative' }}>
                        {item.product.name}
                        <button 
                          onClick={() => handleRemoveItem(item.product.id)}
                          style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', padding: 0 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: 'var(--primary-dark)', fontWeight: 600, fontSize: '14px' }}>
                          {formatCurrency(item.product.price * item.qty)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0f2f5', padding: '4px', borderRadius: '4px' }}>
                          <button onClick={() => handleUpdateQty(item.product.id, -1)} style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                          <span style={{ fontSize: '13px', fontWeight: 500, minWidth: '16px', textAlign: 'center' }}>{item.qty}</span>
                          <button onClick={() => handleUpdateQty(item.product.id, 1)} style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div style={{ padding: '20px', background: 'white', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: 600, fontSize: '16px' }}>
                <span>Total (incl. GST)</span>
                <span style={{ color: 'var(--primary-dark)' }}>{formatCurrency(calculateTotal())}</span>
              </div>
              <button 
                onClick={handleSubmit}
                disabled={!selectedCustomer || selectedItems.length === 0}
                style={{
                  width: '100%', padding: '14px', borderRadius: '8px', 
                  background: (!selectedCustomer || selectedItems.length === 0) ? '#ccc' : 'var(--primary)',
                  color: 'white', border: 'none', fontWeight: 600, fontSize: '15px',
                  cursor: (!selectedCustomer || selectedItems.length === 0) ? 'not-allowed' : 'pointer'
                }}
              >
                Generate Quotation
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
