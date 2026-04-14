import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { salespeople } from '../data/salespeople';
import { getLastMessage, getQuotationCount } from '../data/chatHistory';
import { Search, MessageSquare, Package, Users, LogOut, BarChart3, ArrowLeft, FileText, Bot, FilePlus, LayoutDashboard, Bell, X } from 'lucide-react';
import { formatCurrency } from '../utils/messageParser';
import ChatArea from '../components/ChatArea';
import Products from './Products';
import Customers from './Customers';
import QuotationPreview from '../components/QuotationPreview';
import QuotationForm from '../components/QuotationForm';
import SalesDashboard from './SalesDashboard';
import AdminDashboard from './AdminDashboard';

export default function Dashboard() {
  const {
    currentUser, selectedSalesperson, selectSalesperson, logout,
    chatHistories, activeQuotationPreview: quotationPreview, hideQuotationPreview, showQuotationPreview
  } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('chats'); // chats, products, customers
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [notification, setNotification] = useState(null);

  const isAdmin = currentUser?.role === 'admin';
  const isSalesperson = currentUser?.role === 'salesperson';

  // For salesperson, only show their own chat
  const visibleSalespeople = useMemo(() => {
    if (isSalesperson) {
      return salespeople.filter(sp => sp.id === currentUser.salespersonId);
    }
    return salespeople.filter(sp =>
      sp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.region.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, currentUser, isSalesperson]);

  const handleSelectSalesperson = (id) => {
    selectSalesperson(id);
    setActiveTab('chats');
    setMobileShowChat(true);
  };

  const handleBackToList = () => {
    setMobileShowChat(false);
  };

  // Stats for admin
  const totalQuotations = useMemo(() => {
    return Object.values(chatHistories).reduce((total, history) =>
      total + history.filter(m => m.type === 'quotation').length, 0
    );
  }, [chatHistories]);

  // Compute follow-up notifications
  useEffect(() => {
    let overdue = 0;
    let upcoming = 0;
    const now = new Date();
    
    Object.keys(chatHistories).forEach(spId => {
       if (isSalesperson && String(spId) !== String(currentUser.salespersonId)) return;
       
       const history = chatHistories[spId] || [];
       history.filter(m => m.type === 'quotation').forEach(m => {
          const q = m.quotation;
          if (q.followUpDate && !['Won', 'Lost'].includes(q.stage)) {
             const fDate = new Date(q.followUpDate);
             if (fDate < now && fDate.toDateString() !== now.toDateString()) {
                overdue++;
             } else if (fDate.toDateString() === now.toDateString()) {
                upcoming++;
             }
          }
       });
    });

    if (overdue > 0 || upcoming > 0) {
      setNotification({ overdue, upcoming });
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => setNotification(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [chatHistories, isSalesperson, currentUser]);

  const renderSidebar = () => (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <img src="/images/logo.png" alt="Logo" className="sidebar-logo" />
          <div>
            <div className="sidebar-title">
              {isAdmin ? 'Admin Panel' : salespeople.find(s => s.id === currentUser?.salespersonId)?.name}
            </div>
            <div className="sidebar-subtitle">
              {isAdmin ? `${totalQuotations} quotations today` : 'Salesperson'}
            </div>
          </div>
        </div>
        <div className="sidebar-header-actions">
          <button onClick={logout} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Search */}
      {isAdmin && (
        <div className="sidebar-search">
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search salespeople..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      {(!isAdmin && activeTab === 'chats') || isAdmin ? (
        <div className="salesperson-list">
          {isAdmin ? (
            <>
              <motion.div
                style={{
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '13px'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <BarChart3 size={16} />
                <span>{salespeople.filter(s => s.status === 'online').length} salespeople online • {totalQuotations} quotes today</span>
              </motion.div>
              <AnimatePresence>
                {visibleSalespeople.map((sp, idx) => {
                  const lastMsg = getLastMessage(sp.id);
                  const quotationCount = getQuotationCount(sp.id);
                  return (
                    <motion.div
                      key={sp.id}
                      className={`salesperson-item ${selectedSalesperson === sp.id ? 'active' : ''}`}
                      onClick={() => handleSelectSalesperson(sp.id)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="avatar">
                        <div className="avatar-circle" style={{ background: sp.color }}>
                          {sp.initials}
                        </div>
                        {sp.status === 'online' && <div className="online-indicator" />}
                      </div>
                      <div className="salesperson-info">
                        <div className="salesperson-name-row">
                          <span className="salesperson-name">{sp.name}</span>
                          <span className="salesperson-time">{lastMsg.time}</span>
                        </div>
                        <div className="salesperson-preview">{lastMsg.text}</div>
                      </div>
                      {quotationCount > 0 && (
                        <div className="unread-badge">{quotationCount}</div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </>
          ) : (
            <div className="quotation-cards-list" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {chatHistories[currentUser.salespersonId]?.filter(m => m.type === 'quotation').length > 0 ? (
                chatHistories[currentUser.salespersonId]
                  .filter(m => m.type === 'quotation')
                  .slice().reverse()
                  .map((qMsg, idx) => (
                    <motion.div
                      key={qMsg.id}
                      className="quotation-card"
                      style={{ cursor: 'pointer' }}
                      onClick={() => showQuotationPreview(qMsg.quotation)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="quotation-card-header">
                        <h4>📄 {qMsg.quotation.id}</h4>
                        <span className={`quotation-card-status ${qMsg.quotation.status}`}>
                          {qMsg.quotation.status}
                        </span>
                      </div>
                      <div className="quotation-card-body">
                        <div className="quotation-card-customer">{qMsg.quotation.customer.name}</div>
                        <div className="quotation-card-city">{qMsg.quotation.customer.city}</div>
                        <div className="quotation-card-items">
                          {qMsg.quotation.items.map((qi, i) => (
                            <div key={i}>• {qi.qty}x {qi.product.name}</div>
                          ))}
                        </div>
                        <div className="quotation-card-total">
                          <span className="quotation-card-total-label">Grand Total (incl. GST)</span>
                          <span className="quotation-card-total-amount">
                            {formatCurrency(qMsg.quotation.total)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '20px', fontSize: '14px' }}>
                  No quotations created yet.
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
      {!isAdmin && activeTab === 'products' && <Products />}
      {!isAdmin && activeTab === 'customers' && <Customers />}
      {!isAdmin && activeTab === 'dashboard' && <SalesDashboard />}

      {/* FABs for Salesperson */}
      {!isAdmin && (
        <div className="fab-container">
          <div className="fab-button-wrapper">
            <span className="fab-label">Manual Form</span>
            <button className="fab-button secondary" onClick={() => setShowQuotationForm(true)}>
              <FilePlus size={20} />
            </button>
          </div>
          <div className="fab-button-wrapper">
            <span className="fab-label">Talk to AI</span>
            <button className="fab-button" onClick={() => handleSelectSalesperson(currentUser.salespersonId)}>
              <Bot size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <div className="bottom-nav">
        <button
          className={`nav-item ${activeTab === 'chats' ? 'active' : ''}`}
          onClick={() => setActiveTab('chats')}
        >
          <FileText size={20} />
          <span>Quotes</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => { setActiveTab('dashboard'); if (isAdmin) setMobileShowChat(true); }}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>
        {isAdmin && (
          <button
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => { setActiveTab('products'); setMobileShowChat(true); }}
          >
            <Package size={20} />
            <span>Products</span>
          </button>
        )}
        <button
          className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => { setActiveTab('customers'); if (isAdmin) setMobileShowChat(true); }}
        >
          <Users size={20} />
          <span>Customers</span>
        </button>
      </div>
    </div>
  );

  const renderMainArea = () => {
    if (isAdmin && activeTab === 'dashboard') {
      return (
        <div className="main-content">
          <AdminDashboard />
        </div>
      );
    }
    
    if (isAdmin && activeTab === 'products') {
      return (
        <div className="main-content">
          <Products />
        </div>
      );
    }

    if (isAdmin && activeTab === 'customers') {
      return (
        <div className="main-content">
          <Customers />
        </div>
      );
    }

    if (activeTab !== 'chats' && !isAdmin) {
      return null;
    }

    if (!selectedSalesperson && activeTab === 'chats') {
      return (
        <div className="main-content">
          <div className="empty-state">
            <motion.div
              className="empty-state-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <MessageSquare size={36} />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              ElectroMart QuotePro
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {isAdmin
                ? 'Select a salesperson from the left to view their chat history and quotations.'
                : 'Start a conversation to generate instant quotations. Type a message like "Quotation for Rajesh - 2 Samsung 55 inch TV"'
              }
            </motion.p>
          </div>
        </div>
      );
    }

    if (isAdmin && activeTab === 'chats' && selectedSalesperson) {
      const salespersonData = salespeople.find(s => s.id === selectedSalesperson);
      return (
        <div className="main-content" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="chat-header">
            <button className="back-button icon-button" onClick={handleBackToList}>
              <ArrowLeft size={20} />
            </button>
            <div className="chat-header-info">
              <div className="avatar">
                 <div className="avatar-circle" style={{ background: salespersonData?.color }}>
                   {salespersonData?.initials}
                 </div>
              </div>
              <div className="chat-header-info">
                <div className="chat-header-name">{salespersonData?.name}'s Quotations</div>
                <div className="chat-header-status">Viewing all quotes created by this salesperson</div>
              </div>
            </div>
          </div>
          <div className="quotation-cards-list" style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', alignContent: 'start', backgroundColor: '#f0f2f5' }}>
            {chatHistories[selectedSalesperson]?.filter(m => m.type === 'quotation').length > 0 ? (
              chatHistories[selectedSalesperson]
                .filter(m => m.type === 'quotation')
                .slice().reverse()
                .map((qMsg, idx) => (
                  <motion.div
                    key={qMsg.id}
                    className="quotation-card"
                    style={{ cursor: 'pointer', background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}
                    onClick={() => showQuotationPreview(qMsg.quotation)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="quotation-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--primary-dark)' }}>📄 {qMsg.quotation.id}</h4>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {qMsg.quotation.isUpdated && (
                          <span style={{ 
                            background: '#fff7ed', 
                            color: '#c2410c', 
                            fontSize: '9px', 
                            fontWeight: 700, 
                            padding: '1px 5px', 
                            borderRadius: '4px',
                            border: '1px solid #ffedd5',
                            textTransform: 'uppercase'
                          }}>
                            Updated
                          </span>
                        )}
                        <span className={`quotation-card-status ${qMsg.quotation.status}`} style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', fontWeight: 600 }}>
                          {qMsg.quotation.status === 'draft' ? 'Draft' : 
                           qMsg.quotation.status === 'sent' ? 'Sent' : 
                           qMsg.quotation.status === 'viewed' ? 'Viewed' : qMsg.quotation.status}
                        </span>
                      </div>
                    </div>
                    <div className="quotation-card-body" style={{ flex: 1 }}>
                      <div className="quotation-card-customer" style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{qMsg.quotation.customer.name}</div>
                      <div className="quotation-card-city" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        {qMsg.quotation.customer.city} • Quote No: {qMsg.quotation.id}
                      </div>
                      <div className="quotation-card-items" style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '8px', background: 'var(--primary-bg)', borderRadius: '6px' }}>
                        {qMsg.quotation.items.map((qi, i) => (
                          <div key={i}>• {qi.qty}x {qi.product.name}</div>
                        ))}
                      </div>
                    </div>
                    <div className="quotation-card-total" style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span className="quotation-card-total-label" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Grand Total</span>
                         <span className="quotation-card-total-amount" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary-dark)' }}>
                           {formatCurrency(qMsg.quotation.total)}
                         </span>
                       </div>
                       <div style={{ fontSize: '10px', color: 'var(--text-light)', textAlign: 'right', fontStyle: 'italic' }}>
                         Valid till: {new Date(qMsg.quotation.validTill).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                       </div>
                    </div>
                  </motion.div>
                ))
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px', fontSize: '15px', gridColumn: '1 / -1' }}>
                No quotations created by this salesperson yet.
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="main-content">
        <ChatArea
          salespersonId={selectedSalesperson}
          isAdmin={isAdmin}
          onBack={handleBackToList}
        />
      </div>
    );
  };

  return (
    <div className={`app-container ${mobileShowChat && selectedSalesperson ? 'has-chat' : ''}`}>
      {renderSidebar()}
      {renderMainArea()}

      {/* Quotation Preview Modal */}
      <AnimatePresence>
        {quotationPreview && (
          <QuotationPreview
            quotation={quotationPreview}
            onClose={hideQuotationPreview}
          />
        )}
      </AnimatePresence>

      {/* Quotation Form Modal */}
      <AnimatePresence>
        {showQuotationForm && (
          <QuotationForm onClose={() => setShowQuotationForm(false)} />
        )}
      </AnimatePresence>

      {/* Floating Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: 20 }}
            animate={{ opacity: 1, y: 20, x: -20 }}
            exit={{ opacity: 0, scale: 0.9, x: 50 }}
            style={{
              position: 'fixed',
              top: 'calc(20px + env(safe-area-inset-top))',
              right: '20px',
              paddingRight: 'calc(20px + env(safe-area-inset-right))',
              background: 'white',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              borderRadius: '12px',
              padding: '16px 20px',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              borderLeft: '4px solid #ef4444'
            }}
          >
            <div style={{ background: '#fef2f2', padding: '8px', borderRadius: '50%', color: '#ef4444' }}>
              <Bell size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Follow-up Action Required
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {notification.overdue > 0 && <span style={{ color: '#ef4444', fontWeight: 600 }}>{notification.overdue} overdue quotes</span>}
                {notification.overdue > 0 && notification.upcoming > 0 && ' and '}
                {notification.upcoming > 0 && <span style={{ color: '#f59e0b', fontWeight: 600 }}>{notification.upcoming} quotes scheduled for today</span>}.
              </div>
              <button 
                onClick={() => {
                  setActiveTab('dashboard');
                  setNotification(null);
                }}
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>Take Action</span>
              </button>
            </div>
            <button 
              onClick={() => setNotification(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
