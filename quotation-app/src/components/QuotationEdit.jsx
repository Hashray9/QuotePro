import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, Save, Search, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { products } from '../data/products';
import { formatCurrency } from '../utils/messageParser';

export default function QuotationEdit({ quotation, messageId, salespersonId, onClose }) {
  const { updateQuotationItems } = useApp();
  const [items, setItems] = useState(
    quotation.items.map(item => ({
      ...item,
      id: item.product.id // handy for mapping
    }))
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery]);

  const subtotal = useMemo(() => 
    items.reduce((sum, item) => sum + (item.price * item.qty), 0)
  , [items]);

  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const handleUpdateQty = (productId, delta) => {
    setItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const handleRemoveItem = (productId) => {
    if (items.length === 1) {
      alert("Quotation must have at least one item.");
      return;
    }
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleAddProduct = (product) => {
    const existing = items.find(item => item.product.id === product.id);
    if (existing) {
      handleUpdateQty(product.id, 1);
    } else {
      setItems(prev => [...prev, {
        product: {
          id: product.id,
          name: product.name,
          model: product.model,
          image: product.image,
          brand: product.brand
        },
        qty: 1,
        price: product.price
      }]);
    }
    setSearchQuery('');
  };

  const handleSave = () => {
    updateQuotationItems(salespersonId, messageId, items);
    onClose();
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
        style={{ maxWidth: '600px', padding: 0 }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Edit Quotation {quotation.id}</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body" style={{ padding: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Item List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Items</h3>
            {items.map((item) => (
              <div key={item.product.id} style={{ display: 'flex', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '12px', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                  <img src={item.product.image || '/images/products/placeholder.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.product.name}</div>
                  <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '13px' }}>{formatCurrency(item.price)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => handleUpdateQty(item.product.id, -1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #cbd5e1', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Minus size={14} /></button>
                  <span style={{ fontWeight: 700, width: '20px', textAlign: 'center' }}>{item.qty}</span>
                  <button onClick={() => handleUpdateQty(item.product.id, 1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #cbd5e1', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Plus size={14} /></button>
                  <button onClick={() => handleRemoveItem(item.product.id)} style={{ marginLeft: '8px', color: '#ef4444', padding: '6px', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Product */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Add Products</h3>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}>
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search products to add..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px' }}
              />
              
              <AnimatePresence>
                {filteredProducts.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 10, overflow: 'hidden', border: '1px solid #e2e8f0' }}
                  >
                    {filteredProducts.map(p => (
                      <div 
                        key={p.id} 
                        onClick={() => handleAddProduct(p)}
                        style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                        className="search-item-hover"
                      >
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{p.brand}</div>
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(p.price)}</div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Summary */}
          <div style={{ padding: '16px', borderRadius: '12px', background: '#f1f5f9', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>GST (18%)</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(gst)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '8px' }}>
              <span style={{ fontWeight: 700 }}>Total Payable</span>
              <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '18px' }}>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ padding: '16px 20px', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
          <button className="btn-outline" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} style={{ flex: 2, gap: '8px' }}>
            <Save size={18} /> Update Quotation
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
