import React, { useState, useEffect } from 'react';
import SecureReconLogo from '../components/SecureReconLogo';
import {
  Sparkles,
  TrendingUp,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  Zap,
  BarChart2
} from 'lucide-react';
import { api } from '../services/api';

export default function AiAnalysisPage() {
  const [aiData, setAiData] = useState({
    executive_summary:
      'Your latest assessment identified 7 security observations across 42 pages. SecureRecon detected strong baseline encryption but identified a critical client-side API token exposure on /account/profile along with missing CSP headers on authenticated management routes.',
    risk_score: 78,
    risk_level: 'Elevated',
    key_observations: [
      { title: 'Client-Side Secrets', status: 'Critical', detail: 'Exposed API key token in profile bundle.' },
      { title: 'HSTS Enforced', status: 'Secure', detail: 'HSTS correctly set with max-age 31536000.' },
      { title: 'Anti-Clickjacking', status: 'Secure', detail: 'X-Frame-Options set to SAMEORIGIN.' },
      { title: 'CSP Header', status: 'Attention', detail: 'Missing CSP on dashboard route.' },
      { title: 'Cookie Hardening', status: 'Attention', detail: 'HttpOnly flag missing on session token.' },
    ],
    remediation_roadmap: [
      { priority: 'P0 (Immediate)', action: 'Revoke and rotate exposed analytics secret token on /account/profile', effort: '1 hour' },
      { priority: 'P1 (High)', action: 'Enforce HttpOnly flag on all Set-Cookie session headers', effort: '2 hours' },
      { priority: 'P2 (Medium)', action: 'Implement Content-Security-Policy with strict script-src', effort: '1 day' },
      { priority: 'P3 (Low)', action: 'Set Referrer-Policy to strict-origin-when-cross-origin', effort: '30 mins' },
    ],
    recurring_issues: [
      { category: 'Missing Headers', count: 2, trend: 'Unchanged' },
      { category: 'Cookie Configuration', count: 1, trend: 'Decreased' },
    ],
    security_trends: [
      { month: 'May', score: 74 },
      { month: 'Jun', score: 76 },
      { month: 'Jul', score: 79 },
      { month: 'Aug', score: 80 },
      { month: 'Sep', score: 82 },
    ],
  });

  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    api.getLatestAiAnalysis().then((data) => {
      if (data) setAiData(data);
    }).catch(() => {});
  }, []);

  const handleReanalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: 'var(--cyan-400)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              SecureRecon Intelligence
            </span>
            <span style={{ color: 'var(--text-dim)' }}>&bull;</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Autonomous Synthesis</span>
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: '800' }}>AI Security Analysis</h1>
        </div>

        <button
          onClick={handleReanalyze}
          disabled={analyzing}
          className="btn-primary"
          style={{ fontSize: '13.5px', padding: '9px 18px' }}
        >
          <RotateCcw size={15} className={analyzing ? 'radar-sweep' : ''} />
          {analyzing ? 'Synthesizing...' : 'Regenerate Analysis'}
        </button>
      </div>

      {/* Top Banner Executive Summary */}
      <div
        className="glass-panel-elevated"
        style={{
          padding: '32px',
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: '32px',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(34, 211, 238, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={18} style={{ color: 'var(--cyan-400)' }} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Executive Risk Synthesis</h2>
          </div>

          <p style={{ fontSize: '15.5px', lineHeight: '1.65', color: '#FFFFFF', fontStyle: 'italic', marginBottom: '16px' }}>
            "{aiData.executive_summary}"
          </p>

          <div style={{ display: 'flex', gap: '20px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            <span>Scope: Authorized Web Assets Only</span>
            <span>&bull;</span>
            <span>Evaluation Engine: Passive OWASP AI Model</span>
          </div>
        </div>

        {/* Risk Score Widget */}
        <div
          style={{
            background: '#181222',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Composite Risk Score
          </div>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#F87171', margin: '4px 0' }}>
            {aiData.risk_score}
          </div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#FCA5A5' }}>
            Risk Level: {aiData.risk_level}
          </div>
        </div>
      </div>

      {/* Grid: Key Observations & Remediation Roadmap */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Key Observations */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '16px', color: '#FFFFFF' }}>
            Key Assessment Observations
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {aiData.key_observations.map((obs, idx) => (
              <div
                key={idx}
                style={{
                  background: '#181222',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ fontSize: '14px', color: '#FFFFFF' }}>{obs.title}</strong>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {obs.detail}
                  </p>
                </div>
                <span
                  className={`badge-pill ${
                    obs.status === 'Critical'
                      ? 'badge-critical'
                      : obs.status === 'Secure'
                      ? 'badge-secure'
                      : 'badge-medium'
                  }`}
                >
                  {obs.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Remediation Roadmap */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '16px', color: '#FFFFFF' }}>
            Recommended Remediation Roadmap
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {aiData.remediation_roadmap.map((plan, idx) => (
              <div
                key={idx}
                style={{
                  background: '#181222',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--cyan-400)' }}>{plan.priority}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Estimated effort: {plan.effort}</span>
                </div>
                <p style={{ fontSize: '13.5px', color: '#FFFFFF', lineHeight: '1.4' }}>
                  {plan.action}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recurring Issues & Security Trends */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Recurring Issues */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '16px', color: '#FFFFFF' }}>
            Recurring Weakness Detection
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {aiData.recurring_issues.map((rec, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#181222',
                  padding: '14px 16px',
                  borderRadius: '8px',
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>{rec.category}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Detected in multiple scans</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#FBBF24' }}>{rec.count} instances</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Trend: {rec.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Trends */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '16px', color: '#FFFFFF' }}>
            Security Posture Trajectory
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', padding: '0 10px' }}>
            {aiData.security_trends.map((t, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#C084FC' }}>{t.score}</span>
                <div
                  style={{
                    width: '28px',
                    height: `${(t.score - 50) * 3}px`,
                    background: 'linear-gradient(180deg, var(--cyan-400), var(--purple-600))',
                    borderRadius: '4px 4px 0 0',
                  }}
                />
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{t.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
