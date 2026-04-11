import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { products, categories, addProduct, addCategory } from '../data/products';
import { Search, Plus, X } from 'lucide-react';

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const [newProduct, setNewProduct] = useState({ name: '', model: '', brand: '', category: 'TVs', price: '', image: '/images/tv.png' });
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const filtered = useMemo(() => {
    // depend on trigger to force re-evaluation when product pushed
    const _ = trigger;
    return products.filter(p => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.model.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search, trigger]);

  const handleSaveProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    
    let finalCategory = newProduct.category;
    if (isAddingNewCategory && newCategoryName.trim()) {
      finalCategory = newCategoryName.trim();
      addCategory(finalCategory);
    }

    // Choose fallback image based on category if no custom image was uploaded
    let finalImage = newProduct.image;
    if (finalImage === '/images/tv.png' && finalCategory !== 'TVs') {
       if (finalCategory === 'Refrigerators') finalImage = '/images/fridge.png';
       else if (finalCategory === 'CCTV') finalImage = '/images/cctv.png';
       else if (finalCategory === 'Computers') finalImage = '/images/laptop.png';
       else if (finalCategory === 'Air Conditioners') finalImage = '/images/ac.png';
       else if (finalCategory === 'Washing Machines') finalImage = '/images/washer.png';
       else finalImage = '/images/logo.png';
    }

    addProduct({
      ...newProduct,
      price: Number(newProduct.price),
      image: finalImage,
      category: finalCategory,
      keywords: [newProduct.brand.toLowerCase(), finalCategory.toLowerCase()]
    });
    setTrigger(t => t + 1);
    setShowAddModal(false);
    setNewProduct({ name: '', model: '', brand: '', category: 'TVs', price: '', image: '/images/tv.png' });
    setIsAddingNewCategory(false);
    setNewCategoryName('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProduct({ ...newProduct, image: imageUrl });
    }
  };

  const formatPrice = (price) => '₹' + new Intl.NumberFormat('en-IN').format(price);

  return (
    <div className="page-container" style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Search in sidebar context */}
      <div className="sidebar-search">
        <div className="search-input-wrapper">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="category-tabs" style={{ padding: '8px 12px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="product-grid" style={{ padding: '24px', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        {filtered.map((product, idx) => (
          <motion.div
            key={product.id}
            className="product-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="product-card-image"
            />
            <div className="product-card-body">
              <div className="product-card-brand">{product.brand}</div>
              <div className="product-card-name">{product.name}</div>
              <div className="product-card-model">{product.model}</div>
              <div className="product-card-footer">
                <span className="product-card-price">{formatPrice(product.price)}</span>
                <span className="product-card-category">{product.category}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="fab-container">
        <div className="fab-button-wrapper">
          <span className="fab-label">Add Product</span>
          <button className="fab-button" onClick={() => setShowAddModal(true)}>
            <Plus size={24} />
          </button>
        </div>
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{ background: 'white', width: '100%', maxWidth: '400px', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '16px', background: 'var(--primary-dark)', color: 'white', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Add New Product
              <X size={20} style={{ cursor: 'pointer' }} onClick={() => setShowAddModal(false)} />
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Name</label>
                <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }} placeholder="e.g. Samsung 55 UHD TV" />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Brand</label>
                  <input type="text" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }} placeholder="e.g. Samsung" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Model</label>
                  <input type="text" value={newProduct.model} onChange={e => setNewProduct({...newProduct, model: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }} placeholder="e.g. UA55" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Category</label>
                  {!isAddingNewCategory ? (
                    <select 
                      value={newProduct.category} 
                      onChange={e => {
                        if (e.target.value === 'ADD_NEW') {
                          setIsAddingNewCategory(true);
                        } else {
                          setNewProduct({...newProduct, category: e.target.value});
                        }
                      }} 
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="ADD_NEW" style={{ fontWeight: 'bold' }}>+ Add New Category...</option>
                    </select>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        value={newCategoryName} 
                        onChange={e => setNewCategoryName(e.target.value)} 
                        autoFocus
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }} 
                        placeholder="New category name" 
                      />
                      <button 
                        onClick={() => { setIsAddingNewCategory(false); setNewCategoryName(''); }}
                        style={{ padding: '0 12px', background: 'var(--border)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Price (₹)</label>
                  <input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }} placeholder="0" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Product Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '8px', border: '1px solid var(--border)', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                     <img src={newProduct.image} alt="preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ flex: 1, fontSize: '13px', padding: '6px' }} />
                </div>
              </div>
              <button onClick={handleSaveProduct} style={{ marginTop: '12px', padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                Add Product to Catalog
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
