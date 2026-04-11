import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, CheckCircle, Clock, Bell, Check } from 'lucide-react';
import { salespeople } from '../data/salespeople';
import { chatHistories } from '../data/chatHistory';

export default function AdminDashboard() {
  const [pingedState, setPingedState] = useState({});

  const handlePing = (spId) => {
    setPingedState(prev => ({ ...prev, [spId]: true }));
    setTimeout(() => {
      setPingedState(prev => ({ ...prev, [spId]: false }));
    }, 3000);
  };

  const stats = useMemo(() => {
    let totalQuotes = 0;
    let wonQuotes = 0;
    
    // Revenue (Won) & Pipeline (Sent/Viewed/Draft)
    const summary = {
      revenue: { today: 0, yesterday: 0, week: 0, month: 0 },
      pipeline: { today: 0, yesterday: 0, week: 0, month: 0 }
    };

    // Fix demo date to April 9, 2026
    const now = new Date('2026-04-09T23:59:59');
    const todayStr = '2026-04-09';
    const yesterdayDate = new Date(now); yesterdayDate.setDate(now.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];
    
    // Calendar week (Monday April 6 to Sunday April 12)
    const weekStart = new Date('2026-04-06T00:00:00');
    const monthStart = new Date('2026-04-01T00:00:00');

    const productVelocity = {};
    const spStats = salespeople.map(sp => {
      const history = chatHistories[sp.id] || [];
      const quotes = history.filter(m => m.type === 'quotation').map(m => m.quotation);
      
      let spTotalValue = 0;
      let spWonTotalValue = 0;

      quotes.forEach(q => {
        const qDate = new Date(q.createdAt || q.date);
        const qDateStr = q.createdAt ? q.createdAt.split('T')[0] : '';
        const isWon = q.stage === 'Won';
        const isPipeline = ['Sent', 'Draft', 'Follow-Up', 'Negotiating'].includes(q.stage) || ['sent', 'draft', 'viewed'].includes(q.status);
        
        const val = q.total || 0;
        totalQuotes++;
        if (isWon) wonQuotes++;

        // Categorize into timeframes
        const targets = isWon ? summary.revenue : (isPipeline ? summary.pipeline : null);
        
        if (targets) {
          if (qDateStr === todayStr) targets.today += val;
          if (qDateStr === yesterdayStr) targets.yesterday += val;
          if (qDate >= weekStart) targets.week += val;
          if (qDate >= monthStart) targets.month += val;
        }

        spTotalValue += val;
        if (isWon) spWonTotalValue += val;

        q.items.forEach(item => {
           const pName = item.product.name || 'Unknown';
           productVelocity[pName] = (productVelocity[pName] || 0) + item.qty;
        });
      });

      return {
        ...sp,
        totalQuotes: quotes.length,
        totalValue: spTotalValue,
        wonValue: spWonTotalValue,
        wonQuotes: quotes.filter(q => q.stage === 'Won').length,
        conversionRate: quotes.length > 0 ? Math.round((quotes.filter(q => q.stage === 'Won').length / quotes.length) * 100) : 0,
      };
    }).sort((a, b) => b.wonValue - a.wonValue); // Sort by revenue (won value)

    const topProducts = Object.entries(productVelocity)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { totalQuotes, wonQuotes, summary, topProducts, spStats };
  }, []);

  const renderStatCard = (title, data, icon, color) => (
    <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: color }}>
        {icon}
        <span style={{ fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '2px' }}>Today</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>₹{new Intl.NumberFormat('en-IN').format(data.today)}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '2px' }}>Yesterday</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-secondary)' }}>₹{new Intl.NumberFormat('en-IN').format(data.yesterday)}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '2px' }}>This Week</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: color }}>₹{new Intl.NumberFormat('en-IN').format(data.week)}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '2px' }}>This Month</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>₹{new Intl.NumberFormat('en-IN').format(data.month)}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '24px', flex: 1, overflowY: 'auto', backgroundColor: '#f0f2f5' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '4px' }}>Manager Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Real-time revenue tracking and team performance.</p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-light)' }}>
          Last updated: Today, 10:00 AM
        </div>
      </div>

      {/* Revenue & Pipeline KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {renderStatCard('Total Revenue (Won)', stats.summary.revenue, <TrendingUp size={20} />, '#10b981')}
        {renderStatCard('Sales Pipeline (Sent)', stats.summary.pipeline, <BarChart3 size={20} />, '#3b82f6')}
      </div>

      {/* Leaderboard */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={20} color="var(--primary)" />
          Team Leaderboard
        </h3>
      </div>
      
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: '32px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)' }}>Rank</th>
              <th style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)' }}>Salesman</th>
              <th style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>Total Quotes</th>
              <th style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>Won Revenue</th>
              <th style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>Conversion</th>
              <th style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {stats.spStats.map((sp, idx) => (
              <tr key={sp.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx < 3 ? 'rgba(255,215,0,0.03)' : 'white' }}>
                <td style={{ padding: '16px' }}>
                  {idx === 0 && <span style={{ fontSize: '20px' }} title="Top Performer">🥇</span>}
                  {idx === 1 && <span style={{ fontSize: '20px' }}>🥈</span>}
                  {idx === 2 && <span style={{ fontSize: '20px' }}>🥉</span>}
                  {idx > 2 && <span style={{ paddingLeft: '8px', color: 'var(--text-light)', fontWeight: 600 }}>{idx + 1}</span>}
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="avatar-circle small" style={{ background: sp.color, border: idx === 0 ? '2px solid gold' : 'none' }}>{sp.initials}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{sp.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{sp.region}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px', textAlign: 'center', fontWeight: 500 }}>{sp.totalQuotes}</td>
                <td style={{ padding: '16px', textAlign: 'center', color: '#10b981', fontWeight: 700 }}>₹{new Intl.NumberFormat('en-IN').format(sp.wonValue)}</td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '12px', background: sp.conversionRate > 40 ? '#d1fae5' : '#f1f5f9', color: sp.conversionRate > 40 ? '#10b981' : 'var(--text-secondary)', fontWeight: 600, fontSize: '13px' }}>
                    {sp.conversionRate}%
                  </div>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <button 
                    onClick={() => handlePing(sp.id)}
                    disabled={pingedState[sp.id]}
                    style={{ 
                      background: pingedState[sp.id] ? '#f1f5f9' : 'var(--primary-bg)', 
                      color: pingedState[sp.id] ? '#cbd5e1' : 'var(--primary)', 
                      border: 'none', 
                      borderRadius: '50%', 
                      width: '36px', 
                      height: '36px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: pingedState[sp.id] ? 'default' : 'pointer',
                      margin: '0 auto'
                    }}
                  >
                    {pingedState[sp.id] ? <Check size={18} /> : <Bell size={18} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="#10b981" />
            Top Selling Products
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.topProducts.map((prod, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{prod.name}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>{prod.count} quotes</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

