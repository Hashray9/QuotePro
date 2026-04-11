import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, Flame, CheckCircle, Clock, Search, MessageCircle, AlertCircle, RefreshCw, PenTool, Mic, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/messageParser';

export default function SalesDashboard() {
  const { currentUser, chatHistories, updateQuotationStage, updateQuotation, showQuotationPreview } = useApp();
  const [activeFilter, setActiveFilter] = useState('pending'); // 'pending', 'upcoming', 'completed'
  const [noteModal, setNoteModal] = useState(null); // { messageId: string, quoteId: string }
  const [noteText, setNoteText] = useState('');
  const [nextFollowUpOffset, setNextFollowUpOffset] = useState(2); // days

  const quotes = useMemo(() => {
    const history = chatHistories[currentUser.salespersonId] || [];
    return history.filter(m => m.type === 'quotation').map(m => ({ ...m.quotation, messageId: m.id }));
  }, [chatHistories, currentUser]);

  const now = new Date();

  // Categorize
  const pending = quotes.filter(q => q.followUpDate && new Date(q.followUpDate) <= now && !['Won', 'Lost'].includes(q.stage));
  const upcoming = quotes.filter(q => q.followUpDate && new Date(q.followUpDate) > now && !['Won', 'Lost'].includes(q.stage));
  const completed = quotes.filter(q => ['Won', 'Lost'].includes(q.stage));

  const displayList = activeFilter === 'pending' ? pending : activeFilter === 'upcoming' ? upcoming : completed;

  const handleSnooze = (messageId, days) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + days);
    updateQuotation(currentUser.salespersonId, messageId, {
      followUpDate: newDate.toISOString(),
      stage: 'Follow-Up'
    });
  };

  const handleWhatsApp = (q) => {
    const text = `Hi ${q.customer.name},\nDid you get a chance to review the quotation (Ref: ${q.id}) we shared? Let me know if you have any questions!`;
    window.open(`https://wa.me/91${q.customer.phone}?text=${encodeURIComponent(text)}`, '_blank');
    updateQuotationStage(currentUser.salespersonId, q.messageId, 'Negotiating', false);
  };

  const saveNote = () => {
    if (!noteModal) return;
    const q = quotes.find(q => q.messageId === noteModal.messageId);
    if (!q) return;

    const newDate = new Date();
    newDate.setDate(newDate.getDate() + nextFollowUpOffset);

    const newNote = {
      date: new Date().toISOString(),
      type: 'text',
      content: noteText
    };

    updateQuotation(currentUser.salespersonId, q.messageId, {
      notes: [...(q.notes || []), newNote],
      followUpDate: newDate.toISOString(),
      stage: 'Negotiating'
    });
    setNoteModal(null);
    setNoteText('');
  };

  const simulateVoiceNote = () => {
    setNoteText(prev => prev + (prev ? ' ' : '') + '🎤 [Voice Note Recorded: Customer needs time till weekend.]');
  };

  return (
    <div style={{ padding: '20px', overflowY: 'auto', flex: 1, backgroundColor: '#f0f2f5' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Bell size={24} style={{ color: 'var(--primary)' }} />
        Action Dashboard
      </h2>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Overdue</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444' }}>{pending.length}</div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Upcoming</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>{upcoming.length}</div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Won Deals</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>{quotes.filter(q => q.stage === 'Won').length}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button 
          onClick={() => setActiveFilter('pending')}
          style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ef4444', background: activeFilter === 'pending' ? '#fef2f2' : 'white', color: '#ef4444', fontWeight: 600, fontSize: '13px' }}>
          Action Required ({pending.length})
        </button>
        <button 
          onClick={() => setActiveFilter('upcoming')}
          style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #f59e0b', background: activeFilter === 'upcoming' ? '#fffbeb' : 'white', color: '#f59e0b', fontWeight: 600, fontSize: '13px' }}>
          Upcoming ({upcoming.length})
        </button>
        <button 
          onClick={() => setActiveFilter('completed')}
          style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #10b981', background: activeFilter === 'completed' ? '#ecfdf5' : 'white', color: '#10b981', fontWeight: 600, fontSize: '13px' }}>
          Completed ({completed.length})
        </button>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {displayList.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
            No quotes in this category.
          </div>
        )}
        {displayList.map((q, idx) => (
          <motion.div 
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            style={{ background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--primary-dark)' }}>{q.customer.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{q.id} • {q.items.length} items</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(q.total)}</div>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: activeFilter === 'pending' ? '#fee2e2' : activeFilter === 'upcoming' ? '#fef3c7' : '#d1fae5', color: activeFilter === 'pending' ? '#ef4444' : activeFilter === 'upcoming' ? '#f59e0b' : '#10b981', fontWeight: 600, marginTop: '4px' }}>
                  {q.stage}
                </span>
              </div>
            </div>

            {/* Notes preview */}
            {q.notes && q.notes.length > 0 && (
              <div style={{ background: '#f8f9fa', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', fontStyle: 'italic', borderLeft: '2px solid var(--border)' }}>
                Last Note: "{q.notes[q.notes.length - 1].content}"
              </div>
            )}

            {/* Actions */}
            {activeFilter !== 'completed' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                <button onClick={() => showQuotationPreview(q)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'white', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '8px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                  <FileText size={14} /> PDF
                </button>
                <button onClick={() => handleWhatsApp(q)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'var(--primary-bg)', color: 'var(--primary)', border: '1px solid var(--primary-light)', padding: '8px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                  <MessageCircle size={14} /> Ping on WA
                </button>
                <button onClick={() => setNoteModal({ messageId: q.messageId, quoteId: q.id })} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'white', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '8px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                  <PenTool size={14} /> Log Action
                </button>
                <button onClick={() => updateQuotationStage(currentUser.salespersonId, q.messageId, 'Won', false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#10b981', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                  <CheckCircle size={14} /> Won
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Note Modal */}
      {noteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{ background: 'white', width: '100%', maxWidth: '400px', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '16px', background: 'var(--primary-dark)', color: 'white', fontWeight: 600 }}>
              Update CRM ({noteModal.quoteId})
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Log Meeting/Call Notes</label>
                <textarea 
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="What did the customer say?"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', minHeight: '80px', fontFamily: 'inherit' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <button onClick={simulateVoiceNote} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5', padding: '8px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  <Mic size={16} /> Record Voice Note
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Next Follow-up In</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 7, 14].map(days => (
                    <button key={days} onClick={() => setNextFollowUpOffset(days)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid', backgroundColor: nextFollowUpOffset === days ? 'var(--primary)' : 'white', borderColor: nextFollowUpOffset === days ? 'var(--primary)' : 'var(--border)', color: nextFollowUpOffset === days ? 'white' : 'var(--text-primary)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                      {days}d
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setNoteModal(null)} style={{ flex: 1, padding: '12px', background: 'white', border: '1px solid var(--border)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={saveNote} style={{ flex: 1, padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                  Save Update
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
