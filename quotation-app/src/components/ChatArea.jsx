import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { salespeople } from '../data/salespeople';
import {
  ArrowLeft, MoreVertical, Search, Send, FileText, Share2,
  CheckCheck, Check, Eye, MessageCircle
} from 'lucide-react';
import { formatCurrency } from '../utils/messageParser';
import QuotationEdit from './QuotationEdit';
import { products } from '../data/products';

export default function ChatArea({ salespersonId, isAdmin, onBack }) {
  const {
    chatHistories, sendMessage, processingMessage,
    customerDetection, selectDetectedCustomer, dismissDetection,
    showQuotationPreview, updateQuotationStage
  } = useApp();
  const [inputText, setInputText] = useState('');
  const [showEditModal, setShowEditModal] = useState(null); // {messageId, quotation}
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const sp = salespeople.find(s => s.id === salespersonId);
  const messages = chatHistories[salespersonId] || [];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, processingMessage]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputText]);

  const handleSend = () => {
    if (!inputText.trim() || processingMessage || isAdmin) return;
    sendMessage(salespersonId, inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages by date
  const groupedMessages = [];
  let lastDate = null;
  messages.forEach(msg => {
    if (msg.date !== lastDate) {
      groupedMessages.push({ type: 'date', date: msg.date });
      lastDate = msg.date;
    }
    groupedMessages.push(msg);
  });

  return (
    <>
      {/* Chat Header */}
      <div className="chat-header">
        <button className="back-button" onClick={onBack} style={{
          background: 'none', color: 'white', padding: 8, borderRadius: '50%',
          display: 'flex', alignItems: 'center'
        }}>
          <ArrowLeft size={20} />
        </button>
        <div className="avatar-circle small" style={{ background: !isAdmin ? 'var(--primary-dark)' : sp?.color }}>
          {!isAdmin ? 'AI' : sp?.initials}
        </div>
        <div className="chat-header-info">
          <div className="chat-header-name">{!isAdmin ? "ElectroMart's AI" : sp?.name}</div>
          <div className="chat-header-status">
            {!isAdmin ? '● online' : (sp?.status === 'online' ? '● online' : `${sp?.region}`)}
          </div>
        </div>
        <div className="chat-header-actions">
          <button title="Search"><Search size={18} /></button>
          <button title="More"><MoreVertical size={18} /></button>
        </div>
      </div>

      {/* Messages area */}
      <div className="chat-messages">
        {groupedMessages.map((item, idx) => {
          if (item.type === 'date') {
            return (
              <div key={`date-${idx}`} className="date-separator">
                <span>{item.date}</span>
              </div>
            );
          }

          if (item.type === 'quotation') {
            return (
              <motion.div
                key={item.id}
                className="message-row system"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="quotation-card">
                  <div className="quotation-card-header">
                    <h4>📄 {item.quotation.id}</h4>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {item.quotation.isUpdated && (
                        <span style={{ 
                          background: '#fff7ed', 
                          color: '#c2410c', 
                          fontSize: '10px', 
                          fontWeight: 700, 
                          padding: '2px 6px', 
                          borderRadius: '4px',
                          border: '1px solid #ffedd5',
                          textTransform: 'uppercase'
                        }}>
                          Updated Quote
                        </span>
                      )}
                      <span className={`quotation-card-status ${item.quotation.status}`}>
                        {item.quotation.status === 'draft' ? 'Draft' : 
                         item.quotation.status === 'sent' ? 'Sent' : 
                         item.quotation.status === 'viewed' ? 'Viewed' : item.quotation.status}
                      </span>
                    </div>
                  </div>
                  <div className="quotation-card-body">
                    <div className="quotation-card-customer">{item.quotation.customer.name}</div>
                    <div className="quotation-card-city">
                      {item.quotation.customer.city} • Quote No: {item.quotation.id}
                    </div>
                    <div className="quotation-card-items">
                      {item.quotation.items.map((qi, i) => (
                        <div key={i}>• {qi.qty}x {qi.product.name}</div>
                      ))}
                    </div>
                    <div className="quotation-card-total">
                      <span className="quotation-card-total-label">Grand Total (incl. GST)</span>
                      <span className="quotation-card-total-amount">
                        {formatCurrency(item.quotation.total)}
                      </span>
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: 'var(--text-light)', 
                      marginTop: '8px', 
                      textAlign: 'right',
                      fontStyle: 'italic'
                    }}>
                      Valid till: {new Date(item.quotation.validTill).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="quotation-card-actions">
                    <button onClick={() => showQuotationPreview(item.quotation)}>
                      <Eye size={14} /> View PDF
                    </button>
                    {!isAdmin && (
                      <button onClick={() => setShowEditModal({ messageId: item.id, quotation: item.quotation })} style={{ color: 'var(--primary)' }}>
                        <FileText size={14} /> Edit
                      </button>
                    )}
                    <button onClick={() => {
                      import('../utils/pdfGenerator').then(mod => {
                        mod.shareOnWhatsApp(item.quotation);
                        updateQuotationStage(salespersonId, item.id, 'Sent');
                      });
                    }}>
                      <MessageCircle size={14} /> WhatsApp
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          }

          // Regular messages
          const isSent = item.type === 'sent';
          const isSystem = item.type === 'system';

          return (
            <motion.div
              key={item.id}
              className={`message-row ${isSent ? 'sent' : 'system'}`}
              initial={{ opacity: 0, y: 10, x: isSent ? 20 : -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className={`message-bubble ${isSent ? 'sent' : 'system'}`}>
                <div className="message-text">{item.text}</div>

                {/* Customer detection chips */}
                {item.customerMatches && item.awaitingSelection && customerDetection && (
                  <div className="customer-chips">
                    {item.customerMatches.map(c => (
                      <motion.button
                        key={c.id}
                        className="customer-chip"
                        onClick={() => selectDetectedCustomer(c.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="avatar-circle" style={{
                          width: 28, height: 28, fontSize: 10,
                          background: `hsl(${c.id * 37}, 55%, 45%)`
                        }}>
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="customer-chip-name">{c.name}</div>
                          <div className="customer-chip-city">{c.city}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Already selected customer chips (from history) */}
                {item.customerMatches && item.selectedCustomer && !item.awaitingSelection && (
                  <div className="customer-chips">
                    {item.customerMatches.map(c => (
                      <div
                        key={c.id}
                        className={`customer-chip ${c.id === item.selectedCustomer ? 'selected' : ''}`}
                        style={{ cursor: 'default', opacity: c.id === item.selectedCustomer ? 1 : 0.4 }}
                      >
                        <div className="avatar-circle" style={{
                          width: 28, height: 28, fontSize: 10,
                          background: `hsl(${c.id * 37}, 55%, 45%)`
                        }}>
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="customer-chip-name">{c.name}</div>
                          <div className="customer-chip-city">{c.city}</div>
                        </div>
                        {c.id === item.selectedCustomer && (
                          <Check size={16} style={{ color: 'var(--primary-light)', marginLeft: 'auto' }} />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="message-time">
                  <span>{item.time}</span>
                  {isSent && <CheckCheck size={14} className="read-receipts" />}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Typing indicator */}
        {processingMessage && (
          <motion.div
            className="message-row system"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="typing-indicator">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      {!isAdmin && (
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Type a message... e.g. "Quotation for Rajesh - 2 Samsung 55 inch TV"'
              rows={1}
              disabled={processingMessage}
            />
          </div>
          <motion.button
            className="send-button"
            onClick={handleSend}
            disabled={!inputText.trim() || processingMessage}
            whileTap={{ scale: 0.9 }}
          >
            <Send size={20} />
          </motion.button>
        </div>
      )}

      {/* Admin read-only indicator */}
      {isAdmin && (
        <div style={{
          padding: '12px 16px',
          background: 'var(--border-light)',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6
        }}>
          <Eye size={14} />
          Viewing {sp?.name}'s chat (Read-only)
        </div>
      )}

      {showEditModal && (
        <QuotationEdit 
          quotation={showEditModal.quotation}
          messageId={showEditModal.messageId}
          salespersonId={salespersonId}
          onClose={() => setShowEditModal(null)}
        />
      )}
    </>
  );
}
