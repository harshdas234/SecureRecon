import React, { useState, useEffect } from 'react';
import {
  FileCode2,
  FormInput,
  FileText,
  Cookie as CookieIcon,
  ShieldCheck,
  Cpu,
  Camera,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Code
} from 'lucide-react';
import { api } from '../services/api';

/* ==========================================================
   1. PAGES ANALYSIS
========================================================== */
export function PagesAnalysisPage() {
  const [pages, setPages] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.getPages().then((data) => {
      if (data && data.length > 0) setPages(data);
      else {
        setPages([
          { id: '1', path: '/', title: 'SecureRecon Demo Portal - Enterprise Landing', status_code: 200, response_time_ms: 118, forms_count: 1, links_count: 18, headers_count: 11 },
          { id: '2', path: '/login', title: 'SecureRecon Authentication Gateway', status_code: 200, response_time_ms: 95, forms_count: 1, links_count: 6, headers_count: 10 },
          { id: '3', path: '/dashboard', title: 'Management Console - Security Visibility', status_code: 200, response_time_ms: 142, forms_count: 0, links_count: 24, headers_count: 9 },
          { id: '4', path: '/account/profile', title: 'User Profile Settings & Token Controls', status_code: 200, response_time_ms: 130, forms_count: 2, links_count: 12, headers_count: 8 },
        ]);
      }
    }).catch(() => {});
  }, []);

  const filtered = pages.filter((p) => p.path.toLowerCase().includes(filter.toLowerCase()) || p.title.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Pages Discovery</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>
            Catalog of all authorized web routes mapped during assessment.
          </p>
        </div>
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search discovered routes..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              background: '#181222',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: '#FFFFFF',
              fontSize: '13.5px',
            }}
          />
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ background: '#181222', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px 18px' }}>Route Path</th>
              <th style={{ padding: '14px 18px' }}>Status</th>
              <th style={{ padding: '14px 18px' }}>Page Title</th>
              <th style={{ padding: '14px 18px' }}>Response Time</th>
              <th style={{ padding: '14px 18px' }}>Forms</th>
              <th style={{ padding: '14px 18px' }}>Links</th>
              <th style={{ padding: '14px 18px' }}>Headers</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: 'var(--cyan-400)', fontWeight: '600' }}>
                  {p.path}
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span className="badge-pill badge-secure">{p.status_code} OK</span>
                </td>
                <td style={{ padding: '14px 18px', color: '#FFFFFF', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.title}
                </td>
                <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>{p.response_time_ms} ms</td>
                <td style={{ padding: '14px 18px' }}>{p.forms_count}</td>
                <td style={{ padding: '14px 18px' }}>{p.links_count}</td>
                <td style={{ padding: '14px 18px' }}>{p.headers_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==========================================================
   2. FORMS ANALYSIS
========================================================== */
export function FormsAnalysisPage() {
  const [forms, setForms] = useState([
    {
      id: 'f1',
      action: '/api/auth/login',
      method: 'POST',
      has_csrf: false,
      password_inputs_count: 1,
      inputs_count: 3,
      page_url: '/login',
    },
    {
      id: 'f2',
      action: '/api/user/update-profile',
      method: 'POST',
      has_csrf: true,
      password_inputs_count: 0,
      inputs_count: 4,
      page_url: '/account/profile',
    },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Form Security Analysis</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>
          Inspection of web form actions, submission methods, and anti-CSRF token protection.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {forms.map((f) => (
          <div key={f.id} className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="badge-pill badge-purple">{f.method} Method</span>
              {f.has_csrf ? (
                <span className="badge-pill badge-secure">
                  <CheckCircle2 size={12} /> CSRF Protected
                </span>
              ) : (
                <span className="badge-pill badge-critical">
                  <XCircle size={12} /> Missing CSRF Token
                </span>
              )}
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: '#FFFFFF' }}>
              Form Destination: <code style={{ color: 'var(--cyan-400)' }}>{f.action}</code>
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Embedded on route: <strong>{f.page_url}</strong>
            </p>

            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', background: '#181222', padding: '12px', borderRadius: '8px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Total Inputs:</span>{' '}
                <strong style={{ color: '#FFFFFF' }}>{f.inputs_count}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Password Inputs:</span>{' '}
                <strong style={{ color: f.password_inputs_count > 0 ? '#FBBF24' : '#FFFFFF' }}>
                  {f.password_inputs_count}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================
   3. JAVASCRIPT ANALYSIS
========================================================== */
export function JavascriptAnalysisPage() {
  const [scripts, setScripts] = useState([
    {
      id: 'js1',
      filename: 'app-bundle.min.js',
      url: '/assets/app-bundle.min.js',
      size_bytes: 348210,
      has_sensitive_patterns: true,
      library_name: 'React Core',
      library_version: '18.3.1',
      is_outdated: false,
    },
    {
      id: 'js2',
      filename: 'vendor-legacy.js',
      url: '/assets/vendor-legacy.js',
      size_bytes: 184920,
      has_sensitive_patterns: false,
      library_name: 'Lodash',
      library_version: '4.17.15',
      is_outdated: true,
    },
    {
      id: 'js3',
      filename: 'analytics.js',
      url: '/assets/analytics.js',
      size_bytes: 42100,
      has_sensitive_patterns: false,
      library_name: 'Custom Telemetry',
      library_version: '1.0.2',
      is_outdated: false,
    },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>JavaScript Security Audit</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>
          Passive script analysis for client-side API token leakage and outdated third-party dependencies.
        </p>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ background: '#181222', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px 18px' }}>Script Asset</th>
              <th style={{ padding: '14px 18px' }}>Size</th>
              <th style={{ padding: '14px 18px' }}>Library Identified</th>
              <th style={{ padding: '14px 18px' }}>Version Status</th>
              <th style={{ padding: '14px 18px' }}>Secrets / Patterns</th>
            </tr>
          </thead>
          <tbody>
            {scripts.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: 'var(--purple-300)', fontWeight: '600' }}>
                  {s.filename}
                </td>
                <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>
                  {(s.size_bytes / 1024).toFixed(1)} KB
                </td>
                <td style={{ padding: '14px 18px', color: '#FFFFFF' }}>{s.library_name}</td>
                <td style={{ padding: '14px 18px' }}>
                  {s.is_outdated ? (
                    <span className="badge-pill badge-medium">v{s.library_version} (Outdated)</span>
                  ) : (
                    <span className="badge-pill badge-secure">v{s.library_version} (Latest)</span>
                  )}
                </td>
                <td style={{ padding: '14px 18px' }}>
                  {s.has_sensitive_patterns ? (
                    <span className="badge-pill badge-critical">
                      <AlertTriangle size={12} /> Token Pattern Exposed
                    </span>
                  ) : (
                    <span className="badge-pill badge-secure">Clean</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==========================================================
   4. COOKIES ANALYSIS
========================================================== */
export function CookiesAnalysisPage() {
  const [cookies, setCookies] = useState([
    { id: 'c1', name: 'session_token', domain: 'demo.example.test', path: '/', is_secure: true, is_httponly: false, same_site: 'Lax', expires: 'Session', risk_level: 'Medium' },
    { id: 'c2', name: 'sr_device_ctx', domain: 'demo.example.test', path: '/', is_secure: true, is_httponly: true, same_site: 'Strict', expires: '30 days', risk_level: 'Secure' },
    { id: 'c3', name: 'theme_pref', domain: 'demo.example.test', path: '/', is_secure: false, is_httponly: false, same_site: 'None', expires: '1 year', risk_level: 'Low' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Cookie Security Posture</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>
          Verification of HttpOnly, Secure, and SameSite flags on all observed session and state cookies.
        </p>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ background: '#181222', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px 18px' }}>Cookie Identifier</th>
              <th style={{ padding: '14px 18px' }}>Secure Flag</th>
              <th style={{ padding: '14px 18px' }}>HttpOnly Flag</th>
              <th style={{ padding: '14px 18px' }}>SameSite</th>
              <th style={{ padding: '14px 18px' }}>Lifespan</th>
              <th style={{ padding: '14px 18px' }}>Risk Rating</th>
            </tr>
          </thead>
          <tbody>
            {cookies.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: 'var(--cyan-400)', fontWeight: '600' }}>
                  {c.name}
                </td>
                <td style={{ padding: '14px 18px' }}>
                  {c.is_secure ? <span className="badge-pill badge-secure">True</span> : <span className="badge-pill badge-critical">False</span>}
                </td>
                <td style={{ padding: '14px 18px' }}>
                  {c.is_httponly ? <span className="badge-pill badge-secure">True</span> : <span className="badge-pill badge-medium">Missing</span>}
                </td>
                <td style={{ padding: '14px 18px', color: '#FFFFFF' }}>{c.same_site}</td>
                <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>{c.expires}</td>
                <td style={{ padding: '14px 18px' }}>
                  <span className={`badge-pill ${c.risk_level === 'Secure' ? 'badge-secure' : c.risk_level === 'Medium' ? 'badge-medium' : 'badge-low'}`}>
                    {c.risk_level}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==========================================================
   5. SECURITY HEADERS ANALYSIS
========================================================== */
export function SecurityHeadersPage() {
  const headers = [
    { name: 'Content-Security-Policy', value: null, present: false, grade: 'F', rec: 'Configure strict script-src and default-src directives.' },
    { name: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains', present: true, grade: 'A+', rec: 'Enforced with 1 year duration and subdomains.' },
    { name: 'X-Frame-Options', value: 'SAMEORIGIN', present: true, grade: 'A', rec: 'Clickjacking prevention active.' },
    { name: 'X-Content-Type-Options', value: 'nosniff', present: true, grade: 'A', rec: 'MIME sniffing mitigation verified.' },
    { name: 'Referrer-Policy', value: null, present: false, grade: 'F', rec: 'Set to strict-origin-when-cross-origin.' },
    { name: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()', present: true, grade: 'A', rec: 'Sensitive hardware interfaces locked.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Security Header Analysis</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>
          Defensive HTTP response header compliance following OWASP Application Security guidelines.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {headers.map((h, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '22px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <strong style={{ fontSize: '16px', color: '#FFFFFF' }}>{h.name}</strong>
              <span
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: h.grade.startsWith('A') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: `1px solid ${h.grade.startsWith('A') ? '#10B981' : '#EF4444'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  color: h.grade.startsWith('A') ? '#34D399' : '#F87171',
                }}
              >
                {h.grade}
              </span>
            </div>

            <div style={{ fontSize: '12.5px', fontFamily: 'monospace', color: h.present ? 'var(--cyan-400)' : 'var(--text-dim)', background: '#181222', padding: '8px 12px', borderRadius: '6px', marginBottom: '12px' }}>
              {h.value || '(Header Absent)'}
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              <strong>Guidance:</strong> {h.rec}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================
   6. TECHNOLOGIES STACK
========================================================== */
export function TechnologiesPage() {
  const techs = [
    { name: 'React', category: 'JavaScript Framework', version: '18.3.1', confidence: 99 },
    { name: 'Vite', category: 'Build Tool / Bundler', version: '5.4.0', confidence: 95 },
    { name: 'FastAPI', category: 'Backend Engine', version: '0.115.0', confidence: 96 },
    { name: 'Nginx', category: 'Reverse Proxy / Web Server', version: '1.25.4', confidence: 90 },
    { name: 'Tailwind / CSS', category: 'Style Architecture', version: 'Vanilla CSS Design System', confidence: 100 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Fingerprinted Technologies</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>
          Passive identification of client and application tier software components.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {techs.map((t, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="badge-pill badge-purple">{t.category}</span>
              <span style={{ fontSize: '12px', color: 'var(--cyan-400)' }}>{t.confidence}% Match</span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
              {t.name}
            </h3>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Version: {t.version}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================
   7. SCREENSHOTS GALLERY
========================================================== */
export function ScreenshotsPage() {
  const shots = [
    { title: 'Landing Route (/)', viewport: 'Desktop 1440x900', status: 'Rendered Cleanly' },
    { title: 'Authentication (/login)', viewport: 'Desktop 1440x900', status: 'Rendered Cleanly' },
    { title: 'Management (/dashboard)', viewport: 'Desktop 1440x900', status: 'Rendered Cleanly' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Visual Page Captures</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>
          Client-side visual rendering captures recorded during assessment crawl.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {shots.map((s, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div
              style={{
                height: '200px',
                background: 'linear-gradient(135deg, #181222, #11101A)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-subtle)',
                marginBottom: '14px',
              }}
            >
              <Camera size={36} style={{ color: 'var(--purple-400)', opacity: 0.6 }} />
            </div>
            <h4 style={{ fontSize: '15.5px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
              {s.title}
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>{s.viewport}</span>
              <span style={{ color: '#10B981' }}>{s.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
