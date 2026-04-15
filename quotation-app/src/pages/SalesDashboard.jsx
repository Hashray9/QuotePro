import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle, Clock, MessageCircle, AlertTriangle,
  PenTool, Mic, FileText, TrendingUp, TrendingDown, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/messageParser';


function getDaysLabel(dateStr) {
  if (!dateStr) return null;
  const diff = Math.round((new Date(dateStr) - new Date()) / 86400000);
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, color: '#ef4444', bg: '#fef2f2' };
  if (diff === 0) return { label: 'Due today', color: '#f59e0b', bg: '#fffbeb' };
  return { label: `in ${diff}d`, color: '#10b981', bg: '#ecfdf5' };
}

const STAGE_COLOR = {
  'Draft':       { bg: '#f1f5f9', color: '#64748b' },
  'Sent':        { bg: '#dbeafe', color: '#1d4ed8' },
  'Follow-Up':   { bg: '#fef9c3', color: '#854d0e' },
  'Negotiating': { bg: '#fce7f3', color: '#9d174d' },
  'Won':         { bg: '#d1fae5', color: '#065f46' },
  'Lost':        { bg: '#fee2e2', color: '#991b1b' },
};

export default function SalesDashboard() {
  const { currentUser, chatHistories, updateQuotationStage, updateQuotation, showQuotationPreview } = useApp();
  const [activeFilter, setActiveFilter] = useState('pending');
  const [noteModal, setNoteModal] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [nextFollowUpOffset, setNextFollowUpOffset] = useState(2);

  const quotes = useMemo(() => {
    const history = chatHistories[currentUser.salespersonId] || [];
    return history
      .filter(m => m.type === 'quotation')
      .map(m => ({ ...m.quotation, messageId: m.id }));
  }, [chatHistories, currentUser]);

  const now = new Date();

  const pending  = quotes.filter(q => q.followUpDate && new Date(q.followUpDate) <= now && !['Won', 'Lost'].includes(q.stage));
  const upcoming = quotes.filter(q => q.followUpDate && new Date(q.followUpDate) > now  && !['Won', 'Lost'].includes(q.stage));
  const completed = quotes.filter(q => ['Won', 'Lost'].includes(q.stage));

  const wonTotal = quotes.filter(q => q.stage === 'Won').reduce((s, q) => s + q.total, 0);

  const displayList = activeFilter === 'pending' ? pending : activeFilter === 'upcoming' ? upcoming : completed;

  const handleWhatsApp = (q) => {
    const text = `Hi ${q.customer.name},\nDid you get a chance to review quotation ${q.id}? Let me know if you have any questions!`;
    window.open(`https://wa.me/91${q.customer.phone}?text=${encodeURIComponent(text)}`, '_blank');
    updateQuotationStage(currentUser.salespersonId, q.messageId, 'Negotiating', false);
  };

  const saveNote = () => {
    if (!noteModal) return;
    const q = quotes.find(q => q.messageId === noteModal.messageId);
    if (!q) return;
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + nextFollowUpOffset);
    const newNote = { date: new Date().toISOString(), type: 'text', content: noteText };
    updateQuotation(currentUser.salespersonId, q.messageId, {
      notes: [...(q.notes || []), newNote],
      followUpDate: newDate.toISOString(),
      stage: 'Negotiating'
    });
    setNoteModal(null);
    setNoteText('');
  };

  const tabs = [
    { key: 'pending',   label: 'Action Required', count: pending.length,   color: '#ef4444', activeBg: '#fef2f2', icon: AlertTriangle },
    { key: 'upcoming',  label: 'Upcoming',         count: upcoming.length,  color: '#f59e0b', activeBg: '#fffbeb', icon: Clock },
    { key: 'completed', label: 'Completed',         count: completed.length, color: '#10b981', activeBg: '#ecfdf5', icon: CheckCircle },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', backgroundColor: '#f0f2f5' }}>

      {/* ─── Header ─── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
        padding: '20px 20px 28px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Bell size={20} />
          <span style={{ fontSize: '17px', fontWeight: 700 }}>My CRM Dashboard</span>
        </div>

        {/* ─── KPI Strip ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {[
            { label: 'Overdue', value: pending.length,  color: '#fca5a5', icon: '🔴' },
            { label: 'Upcoming', value: upcoming.length, color: '#fcd34d', icon: '🟡' },
            { label: 'Won 💰',  value: quotes.filter(q => q.stage === 'Won').length, color: '#6ee7b7', icon: '🟢' },
          ].map(kpi => (
            <div key={kpi.label} style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'white' }}>{kpi.value}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', marginTop: '2px' }}>{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* ─── Won Revenue ─── */}
        {wonTotal > 0 && (
          <div style={{
            marginTop: '12px', background: 'rgba(255,255,255,0.12)',
            borderRadius: '10px', padding: '10px 14px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Total Won Revenue</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#6ee7b7' }}>{formatCurrency(wonTotal)}</span>
          </div>
        )}
      </div>

      {/* ─── Tab Bar ─── */}
      <div style={{
        display: 'flex', background: 'white',
        borderBottom: '1px solid var(--border)',
        padding: '0 12px',
        position: 'sticky', top: 0, zIndex: 10,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
      }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              style={{
                flex: 1, padding: '12px 4px', background: 'none', border: 'none',
                borderBottom: active ? `2px solid ${tab.color}` : '2px solid transparent',
                color: active ? tab.color : 'var(--text-secondary)',
                fontWeight: active ? 700 : 500, fontSize: '11px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                transition: 'all 150ms ease', cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Icon size={14} />
                {tab.count > 0 && (
                  <span style={{
                    background: tab.color, color: 'white',
                    borderRadius: '10px', padding: '1px 6px', fontSize: '10px', fontWeight: 700
                  }}>{tab.count}</span>
                )}
              </div>
              <span>{tab.key === 'pending' ? 'Action' : tab.key === 'upcoming' ? 'Upcoming' : 'Done'}</span>
            </button>
          );
        })}
      </div>

      {/* ─── List ─── */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence mode="wait">
          {displayList.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-secondary)' }}
            >
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                {activeFilter === 'pending' ? '✅' : activeFilter === 'upcoming' ? '📅' : '🏆'}
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>All clear!</div>
              <div style={{ fontSize: '13px' }}>
                {activeFilter === 'pending' ? 'No overdue follow-ups.' : activeFilter === 'upcoming' ? 'No upcoming follow-ups scheduled.' : 'No closed deals yet.'}
              </div>
            </motion.div>
          ) : (
            displayList.map((q, idx) => {
              const dayInfo = getDaysLabel(q.followUpDate);
              const stageStyle = STAGE_COLOR[q.stage] || STAGE_COLOR['Draft'];
              const isCompleted = activeFilter === 'completed';
              const isWon  = q.stage === 'Won';
              const isLost = q.stage === 'Lost';

              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: idx * 0.04, duration: 0.25 }}
                  style={{
                    background: 'white',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                    borderLeft: `4px solid ${isWon ? '#10b981' : isLost ? '#ef4444' : activeFilter === 'pending' ? '#ef4444' : '#f59e0b'}`
                  }}
                >
                  {/* Card Header */}
                  <div style={{ padding: '14px 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
                        {q.customer.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {q.customer.city} · {q.id}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary-dark)' }}>
                        {formatCurrency(q.total)}
                      </div>
                      <span style={{
                        fontSize: '10px', padding: '2px 8px', borderRadius: '10px',
                        background: stageStyle.bg, color: stageStyle.color, fontWeight: 700
                      }}>
                        {q.stage}
                      </span>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div style={{ padding: '0 16px 10px' }}>
                    <div style={{
                      background: '#f8fafc', borderRadius: '8px', padding: '8px 12px',
                      fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6
                    }}>
                      {q.items.slice(0, 2).map((it, i) => (
                        <div key={i}>• {it.qty}x {it.product.name}</div>
                      ))}
                      {q.items.length > 2 && <div style={{ color: 'var(--primary)', fontWeight: 500 }}>+{q.items.length - 2} more items</div>}
                    </div>
                  </div>

                  {/* Follow-up or Completion badge */}
                  {dayInfo && !isCompleted && (
                    <div style={{ padding: '0 16px 10px' }}>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        background: dayInfo.bg, color: dayInfo.color,
                        fontSize: '11px', fontWeight: 700, padding: '4px 10px',
                        borderRadius: '20px'
                      }}>
                        <Clock size={11} />
                        Follow-up {dayInfo.label}
                      </div>
                    </div>
                  )}

                  {/* Last Note */}
                  {q.notes && q.notes.length > 0 && (
                    <div style={{ padding: '0 16px 10px' }}>
                      <div style={{
                        background: '#f1f5f9', borderRadius: '8px', padding: '8px 12px',
                        fontSize: '12px', color: 'var(--text-secondary)',
                        borderLeft: '3px solid var(--border)', fontStyle: 'italic'
                      }}>
                        💬 "{q.notes[q.notes.length - 1].content}"
                      </div>
                    </div>
                  )}

                  {/* Completed outcome banner */}
                  {isCompleted && (
                    <div style={{
                      margin: '0 16px 10px',
                      padding: '8px 12px', borderRadius: '8px',
                      background: isWon ? '#d1fae5' : '#fee2e2',
                      display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                      {isWon
                        ? <><TrendingUp size={14} color="#065f46" /><span style={{ fontSize: '12px', fontWeight: 600, color: '#065f46' }}>Deal Won 🎉 — Revenue booked</span></>
                        : <><TrendingDown size={14} color="#991b1b" /><span style={{ fontSize: '12px', fontWeight: 600, color: '#991b1b' }}>Deal Lost — Marked closed</span></>
                      }
                    </div>
                  )}

                  {/* Action Buttons */}
                  {!isCompleted && (
                    <div style={{
                      padding: '10px 16px 14px', borderTop: '1px solid var(--border)',
                      display: 'flex', gap: '8px', flexWrap: 'wrap'
                    }}>
                      <button
                        onClick={() => showQuotationPreview(q)}
                        style={{ flex: 1, minWidth: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#f8fafc', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        <FileText size={13} /> PDF
                      </button>
                      <button
                        onClick={() => handleWhatsApp(q)}
                        style={{ flex: 1, minWidth: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'var(--primary-bg)', color: 'var(--primary)', border: '1px solid var(--primary-light)', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        <MessageCircle size={13} /> WhatsApp
                      </button>
                      <button
                        onClick={() => setNoteModal({ messageId: q.messageId, quoteId: q.id })}
                        style={{ flex: 1, minWidth: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#fffbeb', color: '#92400e', border: '1px solid #fcd34d', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        <PenTool size={13} /> Note
                      </button>
                      <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                        <button
                          onClick={() => updateQuotationStage(currentUser.salespersonId, q.messageId, 'Won', false)}
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#10b981', color: 'white', border: 'none', padding: '9px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                        >
                          <CheckCircle size={14} /> Mark Won
                        </button>
                        <button
                          onClick={() => updateQuotationStage(currentUser.salespersonId, q.messageId, 'Lost', false)}
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5', padding: '9px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                        >
                          <X size={14} /> Mark Lost
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Completed view-only action */}
                  {isCompleted && (
                    <div style={{ padding: '10px 16px 14px', borderTop: '1px solid var(--border)' }}>
                      <button
                        onClick={() => showQuotationPreview(q)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#f8fafc', color: 'var(--text-secondary)', border: '1px solid var(--border)', padding: '9px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        <FileText size={14} /> View Quotation PDF
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* ─── Note Modal ─── */}
      <AnimatePresence>
        {noteModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 2000 }}
            onClick={() => setNoteModal(null)}
          >
            <motion.div
              initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'white', width: '100%', maxWidth: '480px',
                borderRadius: '20px 20px 0 0', overflow: 'hidden',
                paddingBottom: 'calc(16px + var(--sab, 0px))'
              }}
            >
              <div style={{ padding: '16px 20px', background: 'var(--primary-dark)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>Log Action — {noteModal.quoteId}</div>
                <button onClick={() => setNoteModal(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  What happened?
                </label>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="e.g. Customer asked for 5% discount, following up on Friday..."
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '14px', minHeight: '90px', fontFamily: 'inherit', resize: 'none' }}
                  autoFocus
                />
                <button
                  onClick={() => setNoteText(prev => prev + (prev ? ' ' : '') + '🎤 [Voice: Customer needs time till weekend.]')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', width: '100%', justifyContent: 'center' }}
                >
                  <Mic size={15} /> Quick Voice Note
                </button>

                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Schedule follow-up in
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {[1, 2, 7, 14].map(days => (
                      <button
                        key={days}
                        onClick={() => setNextFollowUpOffset(days)}
                        style={{
                          padding: '10px', borderRadius: '8px', border: '1.5px solid',
                          background: nextFollowUpOffset === days ? 'var(--primary)' : 'white',
                          borderColor: nextFollowUpOffset === days ? 'var(--primary)' : 'var(--border)',
                          color: nextFollowUpOffset === days ? 'white' : 'var(--text-primary)',
                          cursor: 'pointer', fontSize: '13px', fontWeight: 600
                        }}
                      >
                        {days === 1 ? 'Tomorrow' : days === 2 ? '2 days' : days === 7 ? '1 week' : '2 weeks'}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button
                    onClick={() => setNoteModal(null)}
                    style={{ flex: 1, padding: '13px', background: 'white', border: '1px solid var(--border)', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveNote}
                    disabled={!noteText.trim()}
                    style={{
                      flex: 2, padding: '13px',
                      background: noteText.trim() ? 'var(--primary)' : 'var(--border)',
                      color: 'white', border: 'none', borderRadius: '10px',
                      fontWeight: 700, cursor: noteText.trim() ? 'pointer' : 'not-allowed', fontSize: '14px'
                    }}
                  >
                    Save & Schedule Follow-up
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
