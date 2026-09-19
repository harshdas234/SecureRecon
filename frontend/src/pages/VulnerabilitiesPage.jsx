import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers
} from 'lucide-react';
import { api } from '../services/api';

export default function VulnerabilitiesPage() {
  const [findings, setFindings] = useState([]);
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFindings = async () => {
    try {
      setLoading(true);
      const data = await api.getFindings({
        severity: severityFilter,
        status: statusFilter,
      });
      if (data && data.length > 0) {
        setFindings(data);
      } else {
        // Seed default
        setFindings([
          {
            id: 'find-1',
            title: 'Client-Side Security Issue',
            severity: 'Critical',
            category: 'Client-Side Security',
            affected_url: 'https://demo.example.test/account/profile',
            evidence: "const VITE_MANAGEMENT_TOKEN = 'sk_live_demo_984f93a10'; detected in profile client bundle.",
            description: 'High-privilege management token pattern exposed in publicly distributed client-side JavaScript.',
            impact: 'Potential unauthorized privilege escalation and access to administrative cloud operations.',
            remediation: 'Revoke exposed credentials immediately. Move all API calls requiring authorization keys behind secure server-side proxy routes.',
            status: 'Open',
            cvss_score: 9.1,
            detected_at: new Date().toISOString(),
          },
          {
            id: 'find-2',
            title: 'Missing Security Header',
            severity: 'Medium',
            category: 'Security Configuration',
            affected_url: 'https://demo.example.test/dashboard',
            evidence: "Response header 'Content-Security-Policy' is absent from dashboard responses.",
            description: 'The application does not declare a Content-Security-Policy (CSP) on the dashboard route.',
            impact: 'Vulnerability to Cross-Site Scripting (XSS) and unauthorized resource execution in case of input reflection.',
            remediation: "Configure 'Content-Security-Policy: default-src \\'self\\'; script-src \\'self\\'; frame-ancestors \\'none\\''.",
            status: 'Open',
            cvss_score: 5.4,
            detected_at: new Date().toISOString(),
          },
          {
            id: 'find-3',
            title: 'Cookie Configuration Issue',
            severity: 'Low',
            category: 'Cookie Security',
            affected_url: 'https://demo.example.test/login',
            evidence: 'Set-Cookie: session_token=...; Path=/; Secure; SameSite=Lax (HttpOnly missing)',
            description: 'Session identification cookie does not enforce the HttpOnly security flag.',
            impact: 'Session token could potentially be read by rogue client scripts if an XSS flaw exists.',
            remediation: "Enforce the 'HttpOnly' attribute on all authentication and session state cookies.",
            status: 'Open',
            cvss_score: 3.8,
            detected_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.warn('Findings fetch fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFindings();
  }, [severityFilter, statusFilter]);

  const handleStatusChange = async (findingId, newStatus) => {
    try {
      await api.updateFindingStatus(findingId, newStatus);
      setFindings((prev) =>
        prev.map((f) => (f.id === findingId ? { ...f, status: newStatus } : f))
      );
      if (selectedFinding && selectedFinding.id === findingId) {
        setSelectedFinding((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = findings.filter(
    (f) =>
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.affected_url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '13px', color: 'var(--purple-300)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Triage & Remediation
          </span>
          <span style={{ color: 'var(--text-dim)' }}>&bull;</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Security Findings</span>
        </div>
        <h1 style={{ fontSize: '30px', fontWeight: '800' }}>Vulnerabilities & Findings</h1>
      </div>

      {/* Filter Controls Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <Filter size={15} />
            <span>Severity:</span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['All', 'Critical', 'High', 'Medium', 'Low', 'Informational'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: severityFilter === sev ? '1px solid var(--purple-400)' : '1px solid var(--border-subtle)',
                  background: severityFilter === sev ? 'rgba(124, 58, 237, 0.25)' : '#181222',
                  color: severityFilter === sev ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '7px 12px',
              background: '#181222',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: '#FFFFFF',
              fontSize: '13px',
              outline: 'none',
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Confirmed">Confirmed</option>
            <option value="False Positive">False Positive</option>
            <option value="Accepted Risk">Accepted Risk</option>
            <option value="Resolved">Resolved</option>
          </select>

          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search findings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px 7px 32px',
                background: '#181222',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Findings Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ background: '#181222', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px 20px' }}>Severity</th>
              <th style={{ padding: '14px 20px' }}>Finding Title</th>
              <th style={{ padding: '14px 20px' }}>Category</th>
              <th style={{ padding: '14px 20px' }}>Affected Route</th>
              <th style={{ padding: '14px 20px' }}>CVSS</th>
              <th style={{ padding: '14px 20px' }}>Status</th>
              <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => {
              let sevBadge = 'badge-critical';
              if (f.severity === 'High') sevBadge = 'badge-high';
              else if (f.severity === 'Medium') sevBadge = 'badge-medium';
              else if (f.severity === 'Low') sevBadge = 'badge-low';
              else if (f.severity === 'Informational') sevBadge = 'badge-purple';

              return (
                <tr
                  key={f.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(124, 58, 237, 0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge-pill ${sevBadge}`}>{f.severity}</span>
                  </td>

                  <td style={{ padding: '14px 20px', fontWeight: '700', color: '#FFFFFF' }}>
                    {f.title}
                  </td>

                  <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>
                    {f.category}
                  </td>

                  <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: 'var(--cyan-400)' }}>
                    {f.affected_url.replace('https://demo.example.test', '') || '/'}
                  </td>

                  <td style={{ padding: '14px 20px', fontWeight: '700', color: '#FFFFFF' }}>
                    {f.cvss_score || '5.0'}
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    <span
                      style={{
                        fontSize: '11.5px',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: '600',
                        background: f.status === 'Resolved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(124, 58, 237, 0.15)',
                        color: f.status === 'Resolved' ? '#34D399' : '#C084FC',
                        border: `1px solid ${f.status === 'Resolved' ? '#10B981' : '#7C3AED'}`,
                      }}
                    >
                      {f.status}
                    </span>
                  </td>

                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedFinding(f)}
                      className="btn-secondary"
                      style={{ padding: '5px 12px', fontSize: '12.5px' }}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* DETAIL INSPECTION MODAL / DRAWER */}
      {selectedFinding && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(9, 6, 18, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            className="glass-panel-elevated"
            style={{
              width: '100%',
              maxWidth: '680px',
              padding: '36px',
              borderRadius: 'var(--radius-lg)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="badge-pill badge-critical" style={{ marginBottom: '8px' }}>
                  {selectedFinding.severity} &bull; CVSS {selectedFinding.cvss_score}
                </span>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF' }}>
                  {selectedFinding.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedFinding(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '24px', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Affected Route
                </div>
                <div style={{ background: '#181222', padding: '8px 12px', borderRadius: '6px', fontFamily: 'monospace', color: 'var(--cyan-400)', fontSize: '13px' }}>
                  {selectedFinding.affected_url}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Observed Technical Evidence
                </div>
                <div style={{ background: '#090612', border: '1px solid var(--border-subtle)', padding: '10px 14px', borderRadius: '6px', fontFamily: 'monospace', color: '#F87171', fontSize: '12.5px' }}>
                  {selectedFinding.evidence || 'Header / attribute was omitted in server response.'}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>Description</h4>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {selectedFinding.description}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>Security Impact</h4>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {selectedFinding.impact}
                </p>
              </div>

              <div style={{ background: 'rgba(124, 58, 237, 0.12)', border: '1px solid var(--purple-500)', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#C084FC', marginBottom: '6px' }}>Recommended Remediation</h4>
                <p style={{ fontSize: '13px', color: '#FFFFFF', lineHeight: '1.5' }}>
                  {selectedFinding.remediation}
                </p>
              </div>

              {/* Status Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Update Finding Status
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Open', 'Confirmed', 'False Positive', 'Accepted Risk', 'Resolved'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedFinding.id, st)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        background: selectedFinding.status === st ? 'var(--purple-600)' : '#181222',
                        color: selectedFinding.status === st ? '#FFFFFF' : 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        fontWeight: '600',
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
