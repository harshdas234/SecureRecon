import React, { useState, useEffect } from 'react';
import SecureReconLogo from '../components/SecureReconLogo';
import {
  Shield,
  Activity,
  Globe,
  FileCode2,
  AlertTriangle,
  TrendingUp,
  PlusCircle,
  Clock,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';

export default function DashboardPage({ onNavigate }) {
  const [stats, setStats] = useState({
    security_score: 82,
    max_score: 100,
    cards: { websites: 3, active_scans: 0, pages_analyzed: 42, open_findings: 7, critical_findings: 1 },
    severity: { critical: 1, high: 3, medium: 8, low: 5, informational: 2 },
    charts: {
      score_trend: [
        { date: 'May', score: 72 },
        { date: 'Jun', score: 75 },
        { date: 'Jul', score: 78 },
        { date: 'Aug', score: 80 },
        { date: 'Sep', score: 82 },
      ],
      vulnerability_trend: [
        { month: 'May', critical: 3, high: 7, medium: 12, low: 9 },
        { month: 'Jun', critical: 2, high: 5, medium: 10, low: 7 },
        { month: 'Jul', critical: 2, high: 4, medium: 9, low: 6 },
        { month: 'Aug', critical: 1, high: 3, medium: 8, low: 6 },
        { month: 'Sep', critical: 1, high: 3, medium: 8, low: 5 },
      ],
      scan_activity: [
        { day: 'Mon', scans: 4 },
        { day: 'Tue', scans: 6 },
        { day: 'Wed', scans: 3 },
        { day: 'Thu', scans: 8 },
        { day: 'Fri', scans: 5 },
        { day: 'Sat', scans: 2 },
        { day: 'Sun', scans: 1 },
      ],
      finding_distribution: [
        { name: 'Client-Side Security', value: 35, color: '#EF4444' },
        { name: 'Security Headers', value: 30, color: '#F59E0B' },
        { name: 'Cookie Security', value: 20, color: '#3B82F6' },
        { name: 'Form Protection', value: 15, color: '#8B5CF6' },
      ],
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getDashboardStats();
        if (data) setStats(data);
      } catch (err) {
        console.warn('Using seeded dashboard stats');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: 'var(--purple-300)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              SecureRecon
            </span>
            <span style={{ color: 'var(--text-dim)' }}>&bull;</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Authorized Perimeter</span>
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: '800' }}>Security Overview</h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => onNavigate('/websites')}
            className="btn-secondary"
            style={{ fontSize: '13.5px', padding: '9px 18px' }}
          >
            <Globe size={15} />
            Manage Websites
          </button>
          <button
            onClick={() => onNavigate('/scans/new')}
            className="btn-primary"
            style={{ fontSize: '13.5px', padding: '9px 20px' }}
          >
            <PlusCircle size={15} />
            Start Assessment
          </button>
        </div>
      </div>

      {/* Hero Score & KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr repeat(4, 1fr)',
          gap: '20px',
        }}
      >
        {/* Security Score Gauge Card */}
        <div
          className="glass-panel-elevated"
          style={{
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Security Posture Score
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '8px 0 4px 0' }}>
              <span style={{ fontSize: '46px', fontWeight: '900', color: '#C084FC', fontFamily: 'var(--font-heading)' }}>
                {stats.security_score}
              </span>
              <span style={{ fontSize: '20px', color: 'var(--text-dim)', fontWeight: '700' }}>
                / 100
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#34D399', fontWeight: '600' }}>
              <TrendingUp size={14} />
              <span>+2.5% increase this month</span>
            </div>
          </div>

          <div style={{ width: '84px', height: '84px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SecureReconLogo size="medium" />
          </div>
        </div>

        {/* Websites */}
        <div
          className="glass-panel"
          style={{ padding: '22px', cursor: 'pointer' }}
          onClick={() => onNavigate('/websites')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px' }}>
            <span>Authorized Websites</span>
            <Globe size={16} style={{ color: 'var(--cyan-400)' }} />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', margin: '8px 0 4px 0' }}>
            {stats.cards.websites}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--cyan-400)' }}>100% In-Scope</div>
        </div>

        {/* Active Scans */}
        <div
          className="glass-panel"
          style={{ padding: '22px', cursor: 'pointer' }}
          onClick={() => onNavigate('/scans/running')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px' }}>
            <span>Active Scans</span>
            <Activity size={16} style={{ color: 'var(--purple-400)' }} />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', margin: '8px 0 4px 0' }}>
            {stats.cards.active_scans}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {stats.cards.active_scans > 0 ? 'Evaluating targets...' : 'Ready for launch'}
          </div>
        </div>

        {/* Pages Analyzed */}
        <div
          className="glass-panel"
          style={{ padding: '22px', cursor: 'pointer' }}
          onClick={() => onNavigate('/pages')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px' }}>
            <span>Pages Analyzed</span>
            <FileCode2 size={16} style={{ color: 'var(--purple-300)' }} />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', margin: '8px 0 4px 0' }}>
            {stats.cards.pages_analyzed}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Discovered & Audited</div>
        </div>

        {/* Open Findings */}
        <div
          className="glass-panel"
          style={{ padding: '22px', cursor: 'pointer' }}
          onClick={() => onNavigate('/findings')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px' }}>
            <span>Open Findings</span>
            <AlertTriangle size={16} style={{ color: '#F87171' }} />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', margin: '8px 0 4px 0' }}>
            {stats.cards.open_findings}
          </div>
          <div style={{ fontSize: '12px', color: '#F87171', fontWeight: '600' }}>
            {stats.cards.critical_findings} Critical Action
          </div>
        </div>
      </div>

      {/* Severity Counters Row */}
      <div
        className="glass-panel"
        style={{
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Finding Severity Breakdown:
        </span>

        <div style={{ display: 'flex', gap: '20px', flex: 1, marginLeft: '32px' }}>
          <div
            onClick={() => onNavigate('/vulnerabilities')}
            style={{
              flex: 1,
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '8px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '12.5px', color: '#FCA5A5', fontWeight: '600' }}>Critical</span>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#EF4444' }}>{stats.severity.critical}</span>
          </div>

          <div
            onClick={() => onNavigate('/vulnerabilities')}
            style={{
              flex: 1,
              background: 'rgba(249, 115, 22, 0.12)',
              border: '1px solid rgba(249, 115, 22, 0.35)',
              borderRadius: '8px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '12.5px', color: '#FDBA74', fontWeight: '600' }}>High</span>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#F97316' }}>{stats.severity.high}</span>
          </div>

          <div
            onClick={() => onNavigate('/vulnerabilities')}
            style={{
              flex: 1,
              background: 'rgba(234, 179, 8, 0.12)',
              border: '1px solid rgba(234, 179, 8, 0.35)',
              borderRadius: '8px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '12.5px', color: '#FDE047', fontWeight: '600' }}>Medium</span>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#EAB308' }}>{stats.severity.medium}</span>
          </div>

          <div
            onClick={() => onNavigate('/vulnerabilities')}
            style={{
              flex: 1,
              background: 'rgba(59, 130, 246, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              borderRadius: '8px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '12.5px', color: '#93C5FD', fontWeight: '600' }}>Low</span>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#3B82F6' }}>{stats.severity.low}</span>
          </div>

          <div
            onClick={() => onNavigate('/vulnerabilities')}
            style={{
              flex: 1,
              background: 'rgba(148, 163, 184, 0.12)',
              border: '1px solid rgba(148, 163, 184, 0.25)',
              borderRadius: '8px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '12.5px', color: '#CBD5E1', fontWeight: '600' }}>Informational</span>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#94A3B8' }}>{stats.severity.informational}</span>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        {/* Vulnerability Trend Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Vulnerability Trend</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Historical finding distribution over past 5 months</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '11.5px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#EF4444' }}>&bull; Critical</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F97316' }}>&bull; High</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#EAB308' }}>&bull; Medium</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#3B82F6' }}>&bull; Low</span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '10px' }}>
            {stats.charts.vulnerability_trend.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '140px' }}>
                  <div style={{ width: '8px', height: `${item.critical * 35}px`, background: '#EF4444', borderRadius: '4px 4px 0 0' }} />
                  <div style={{ width: '8px', height: `${item.high * 15}px`, background: '#F97316', borderRadius: '4px 4px 0 0' }} />
                  <div style={{ width: '8px', height: `${item.medium * 10}px`, background: '#EAB308', borderRadius: '4px 4px 0 0' }} />
                  <div style={{ width: '8px', height: `${item.low * 12}px`, background: '#3B82F6', borderRadius: '4px 4px 0 0' }} />
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Score Trend */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Security Score Trend</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Composite security score evolution</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', padding: '0 10px' }}>
            {stats.charts.score_trend.map((s, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#C084FC' }}>{s.score}</div>
                <div
                  style={{
                    width: '24px',
                    height: `${(s.score - 50) * 4}px`,
                    background: 'linear-gradient(180deg, #A855F7 0%, rgba(124, 58, 237, 0.2) 100%)',
                    borderRadius: '6px 6px 0 0',
                    border: '1px solid var(--purple-400)',
                  }}
                />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Scan Activity & Finding Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Weekly Scan Activity */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Assessment Activity</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Daily web scans executed across projects</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px' }}>
            {stats.charts.scan_activity.map((a, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                <div
                  style={{
                    width: '16px',
                    height: `${a.scans * 14}px`,
                    background: 'linear-gradient(180deg, var(--cyan-400) 0%, rgba(34, 211, 238, 0.2) 100%)',
                    borderRadius: '4px 4px 0 0',
                  }}
                />
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{a.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Finding Distribution */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Finding Distribution</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Breakdown by web security domain</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.charts.finding_distribution.map((cat, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{cat.name}</span>
                  <span style={{ fontWeight: '700', color: cat.color }}>{cat.value}%</span>
                </div>
                <div style={{ width: '100%', height: '7px', background: '#181222', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.value}%`, height: '100%', background: cat.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
