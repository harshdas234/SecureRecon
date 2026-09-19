import React, { useState } from 'react';
import SecureReconLogo from '../components/SecureReconLogo';
import Navbar from '../components/Navbar';
import { api } from '../services/api';
import {
  Shield,
  Search,
  Lock,
  Layers,
  FileCode,
  FormInput,
  Cookie as CookieIcon,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Sparkles,
  TrendingUp,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Terminal,
  Globe
} from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  const [heroUrl, setHeroUrl] = useState('https://google.com');
  const [launching, setLaunching] = useState(false);

  const handleQuickStart = async (e) => {
    if (e) e.preventDefault();
    const urlToScan = (heroUrl || 'https://google.com').trim();
    setLaunching(true);
    try {
      const res = await api.createScan({ target_url: urlToScan });
      if (res && res.id) {
        onNavigate(`/scans/${res.id}/running`);
      } else {
        onNavigate('/scans/running');
      }
    } catch (err) {
      console.warn('Quick scan note:', err.message);
      onNavigate('/scans/new');
    } finally {
      setLaunching(false);
    }
  };

  const pipelineSteps = [
    { label: 'Website', desc: 'Authorized Target' },
    { label: 'Pages', desc: 'Discovered Routes' },
    { label: 'Forms', desc: 'CSRF & Inputs' },
    { label: 'JavaScript', desc: 'Client Secrets & Libs' },
    { label: 'Cookies', desc: 'Flags & Scope' },
    { label: 'Security Headers', desc: 'CSP, HSTS, XFO' },
    { label: 'Findings', desc: 'Triage & Severity' },
    { label: 'Vulnerabilities', desc: 'Remediation Roadmap' },
    { label: 'Reports', desc: 'Executive & Technical' },
  ];

  return (
    <div className="cyber-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onNavigate={onNavigate} currentRoute="/" />

      {/* HERO SECTION */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '120px 48px 60px 48px',
          maxWidth: '1360px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: '56px',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* LEFT HERO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Small Badge */}
            <div style={{ display: 'flex' }}>
              <span
                className="badge-pill badge-purple"
                style={{
                  padding: '6px 14px',
                  fontSize: '12px',
                  boxShadow: '0 0 16px rgba(124, 58, 237, 0.25)',
                }}
              >
                <Shield size={14} style={{ color: 'var(--cyan-400)' }} />
                AUTHORIZED WEB SECURITY PLATFORM
              </span>
            </div>

            {/* Main Heading */}
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '64px',
                fontWeight: '900',
                lineHeight: '1.05',
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #FFFFFF 20%, #C084FC 70%, #22D3EE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '-4px',
              }}
            >
              SecureRecon
            </h1>

            {/* Large Secondary Heading */}
            <h2
              style={{
                fontSize: '38px',
                fontWeight: '700',
                lineHeight: '1.2',
                color: '#F1F5F9',
                letterSpacing: '-0.02em',
              }}
            >
              See Your Web Application <br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #A855F7, #22D3EE)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Through a Security Lens.
              </span>
            </h2>

            {/* Supporting Text */}
            <p
              style={{
                fontSize: '17px',
                lineHeight: '1.65',
                color: 'var(--text-secondary)',
                maxWidth: '560px',
              }}
            >
              Discover security weaknesses, analyze web application behavior, and manage
              vulnerabilities from one unified security workspace.
            </p>

            {/* DIRECT PROMINENT URL INPUT BOX */}
            <div
              style={{
                background: 'rgba(24, 18, 34, 0.9)',
                border: '1.5px solid var(--purple-500)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 10px 8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                maxWidth: '620px',
                boxShadow: '0 8px 25px rgba(124, 58, 237, 0.35)',
                marginTop: '4px',
              }}
            >
              <Globe size={20} style={{ color: 'var(--cyan-400)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Enter authorized URL (e.g. https://google.com)"
                value={heroUrl}
                onChange={(e) => setHeroUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuickStart()}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontFamily: 'monospace',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleQuickStart}
                disabled={launching}
                className="btn-primary"
                style={{
                  padding: '11px 22px',
                  fontSize: '14.5px',
                  borderRadius: 'var(--radius-sm)',
                  whiteSpace: 'nowrap',
                }}
              >
                {launching ? 'Starting...' : 'Start Assessment'}
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Quick Preset Chips */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '-10px', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Quick Examples:</span>
              <button
                type="button"
                onClick={() => setHeroUrl('https://google.com')}
                style={{
                  background: heroUrl === 'https://google.com' ? 'rgba(34, 211, 238, 0.25)' : 'rgba(34, 211, 238, 0.12)',
                  border: '1px solid rgba(34, 211, 238, 0.4)',
                  color: 'var(--cyan-400)',
                  borderRadius: '4px',
                  padding: '3px 10px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                🚀 https://google.com
              </button>
              <button
                type="button"
                onClick={() => setHeroUrl('https://demo.example.test')}
                style={{
                  background: heroUrl === 'https://demo.example.test' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(124, 58, 237, 0.12)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  color: 'var(--purple-300)',
                  borderRadius: '4px',
                  padding: '3px 10px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                🛡️ https://demo.example.test
              </button>
            </div>

            {/* Secondary Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px' }}>
              <button
                onClick={() => onNavigate('/scans/new')}
                className="btn-secondary"
                style={{
                  padding: '11px 22px',
                  fontSize: '14px',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                Custom Assessment Wizard
              </button>

              <button
                onClick={() => onNavigate('/dashboard')}
                className="btn-secondary"
                style={{
                  padding: '11px 22px',
                  fontSize: '14px',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <Terminal size={16} style={{ color: 'var(--cyan-400)' }} />
                Explore Dashboard
              </button>
            </div>

            {/* Micro reassurance */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                marginTop: '12px',
                fontSize: '12.5px',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} style={{ color: '#10B981' }} />
                Strict Scope Control
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} style={{ color: '#10B981' }} />
                Passive & Non-Destructive
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} style={{ color: '#10B981' }} />
                OWASP Web Standard
              </div>
            </div>
          </div>

          {/* RIGHT HERO: Official Tactical Cyber Shield Logo Emblem */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 0',
              width: '100%',
            }}
          >
            <SecureReconLogo size="hero" />
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* SECTION 1: EVERYTHING YOU NEED */}
      {/* ================================================== */}
      <section
        id="features"
        style={{
          padding: '100px 48px',
          maxWidth: '1360px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="badge-pill badge-purple" style={{ marginBottom: '12px' }}>
            Comprehensive Capabilities
          </span>
          <h2 style={{ fontSize: '36px', fontWeight: '800' }}>
            Everything You Need to Understand Your Web Security
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '16px' }}>
            Purpose-built for modern web applications without the noise of infrastructure tools.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}
        >
          {[
            {
              title: 'Web Application Discovery',
              desc: 'Passively map application endpoints, links, and route architectures within authorized boundaries.',
              icon: Search,
            },
            {
              title: 'Security Header Analysis',
              desc: 'Evaluate Content-Security-Policy (CSP), HSTS, X-Frame-Options, and Referrer-Policy configurations.',
              icon: ShieldCheck,
            },
            {
              title: 'Cookie Security',
              desc: 'Audit SameSite, Secure, and HttpOnly attributes to prevent session theft and cross-site leaks.',
              icon: CookieIcon,
            },
            {
              title: 'JavaScript Analysis',
              desc: 'Inspect client scripts for exposed API secrets, outdated third-party dependencies, and DOM patterns.',
              icon: FileCode,
            },
            {
              title: 'Form Analysis',
              desc: 'Detect missing anti-CSRF synchronizer tokens, sensitive input handling, and plain HTTP actions.',
              icon: FormInput,
            },
            {
              title: 'Vulnerability Management',
              desc: 'Triage, prioritize, and track remediation workflows from identification through resolution.',
              icon: Layers,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: '32px 28px',
                  borderRadius: 'var(--radius-lg)',
                  transition: 'all 0.25s ease',
                  border: '1px solid rgba(124, 58, 237, 0.18)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--purple-400)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(124, 58, 237, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.18)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(124, 58, 237, 0.15)',
                    border: '1px solid rgba(124, 58, 237, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <Icon size={24} style={{ color: 'var(--purple-300)' }} />
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: '700', marginBottom: '10px' }}>
                  {item.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: '1.6' }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================== */}
      {/* SECTION 2: BUILT FOR MODERN WEB APPLICATIONS */}
      {/* ================================================== */}
      <section
        id="how-it-works"
        style={{
          padding: '100px 48px',
          maxWidth: '1360px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="badge-pill badge-cyan" style={{ marginBottom: '12px' }}>
            Structured Pipeline
          </span>
          <h2 style={{ fontSize: '36px', fontWeight: '800' }}>
            Built for Modern Web Applications
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '16px' }}>
            From single-page applications to corporate portals, SecureRecon traces the full application context.
          </p>
        </div>

        {/* Visual Diagram with Glowing Purple Connection Lines */}
        <div
          className="glass-panel-elevated"
          style={{
            padding: '48px 36px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            {pipelineSteps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    minWidth: '100px',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: idx === 0 || idx === pipelineSteps.length - 1 ? 'linear-gradient(135deg, var(--purple-600), var(--cyan-400))' : '#181222',
                      border: '2px solid var(--purple-400)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '14px',
                      color: idx === 0 || idx === pipelineSteps.length - 1 ? '#090612' : 'var(--purple-300)',
                      boxShadow: '0 0 16px rgba(168, 85, 247, 0.4)',
                      marginBottom: '10px',
                    }}
                  >
                    0{idx + 1}
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#FFFFFF' }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {step.desc}
                  </div>
                </div>

                {idx < pipelineSteps.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: '2px',
                      minWidth: '20px',
                      background: 'linear-gradient(90deg, #A855F7, #22D3EE)',
                      boxShadow: '0 0 10px rgba(168, 85, 247, 0.7)',
                      position: 'relative',
                      marginTop: '-24px',
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* SECTION 3: SECURITY VISIBILITY WITHOUT THE NOISE */}
      {/* ================================================== */}
      <section
        id="security"
        style={{
          padding: '80px 48px',
          maxWidth: '1360px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge-pill badge-purple" style={{ marginBottom: '12px' }}>
            Unified Dashboard Preview
          </span>
          <h2 style={{ fontSize: '36px', fontWeight: '800' }}>
            Security Visibility Without the Noise
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '16px' }}>
            Actionable security intelligence that engineering and security teams can immediately trust.
          </p>
        </div>

        {/* Dashboard Preview Component */}
        <div
          className="glass-panel-elevated"
          style={{
            padding: '36px',
            border: '1px solid rgba(168, 85, 247, 0.3)',
          }}
        >
          {/* Top Metric Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr repeat(4, 1fr)',
              gap: '20px',
              marginBottom: '28px',
            }}
          >
            {/* Security Score Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(17, 16, 26, 0.8) 100%)',
                border: '1px solid var(--purple-500)',
                borderRadius: 'var(--radius-md)',
                padding: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Security Score
                </span>
                <div style={{ fontSize: '42px', fontWeight: '900', color: '#C084FC', marginTop: '4px' }}>
                  82 <span style={{ fontSize: '20px', color: 'var(--text-dim)' }}>/ 100</span>
                </div>
                <div style={{ fontSize: '12px', color: '#34D399', fontWeight: '600' }}>
                  Posture Rating: Solid Defense (B+)
                </div>
              </div>
              <div style={{ width: '56px', height: '56px' }}>
                <SecureReconLogo size="medium" />
              </div>
            </div>

            {/* Websites */}
            <div
              style={{
                background: '#151124',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '22px',
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Websites</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', margin: '4px 0' }}>3</div>
              <div style={{ fontSize: '12px', color: 'var(--cyan-400)' }}>100% Authorized</div>
            </div>

            {/* Pages Analyzed */}
            <div
              style={{
                background: '#151124',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '22px',
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pages Analyzed</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', margin: '4px 0' }}>42</div>
              <div style={{ fontSize: '12px', color: 'var(--purple-300)' }}>Across 3 Web Apps</div>
            </div>

            {/* Open Findings */}
            <div
              style={{
                background: '#151124',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '22px',
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Open Findings</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', margin: '4px 0' }}>7</div>
              <div style={{ fontSize: '12px', color: '#FBBF24' }}>Prioritized by CVSS</div>
            </div>

            {/* Critical Findings */}
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '22px',
              }}
            >
              <div style={{ fontSize: '12px', color: '#F87171' }}>Critical Findings</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#EF4444', margin: '4px 0' }}>1</div>
              <div style={{ fontSize: '12px', color: '#FCA5A5' }}>Client-Side Secret Exposure</div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button
              onClick={() => onNavigate('/dashboard')}
              className="btn-primary"
              style={{ padding: '8px 20px', fontSize: '13.5px' }}
            >
              Open Full Interactive Dashboard
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* SECTION 4: UNDERSTAND EVERY FINDING */}
      {/* ================================================== */}
      <section
        style={{
          padding: '80px 48px',
          maxWidth: '1360px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge-pill badge-purple" style={{ marginBottom: '12px' }}>
            Triaged Intelligence
          </span>
          <h2 style={{ fontSize: '36px', fontWeight: '800' }}>
            Understand Every Finding
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '16px' }}>
            Contextual evidence, blast radius analysis, and precise remediation guides.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {/* CRITICAL CARD */}
          <div
            className="glass-panel"
            style={{
              padding: '28px',
              borderRadius: 'var(--radius-lg)',
              borderLeft: '4px solid #EF4444',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="badge-pill badge-critical">CRITICAL</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CVSS 9.1</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
              Client-Side Security Issue
            </h3>
            <div
              style={{
                fontSize: '12.5px',
                color: 'var(--text-muted)',
                background: '#090612',
                padding: '6px 10px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                marginBottom: '14px',
              }}
            >
              Affected page: /account/profile
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              High-privilege management token pattern detected inside minified frontend JavaScript bundle.
            </p>
          </div>

          {/* MEDIUM CARD */}
          <div
            className="glass-panel"
            style={{
              padding: '28px',
              borderRadius: 'var(--radius-lg)',
              borderLeft: '4px solid #F59E0B',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="badge-pill badge-medium">MEDIUM</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CVSS 5.4</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
              Missing Security Header
            </h3>
            <div
              style={{
                fontSize: '12.5px',
                color: 'var(--text-muted)',
                background: '#090612',
                padding: '6px 10px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                marginBottom: '14px',
              }}
            >
              Affected page: /dashboard
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Absence of Content Security Policy (CSP) header allows potential execution of injected inline scripts.
            </p>
          </div>

          {/* LOW CARD */}
          <div
            className="glass-panel"
            style={{
              padding: '28px',
              borderRadius: 'var(--radius-lg)',
              borderLeft: '4px solid #3B82F6',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="badge-pill badge-low">LOW</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CVSS 3.8</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
              Cookie Configuration Issue
            </h3>
            <div
              style={{
                fontSize: '12.5px',
                color: 'var(--text-muted)',
                background: '#090612',
                padding: '6px 10px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                marginBottom: '14px',
              }}
            >
              Affected page: /login
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Session cookie generated without HttpOnly directive, making it vulnerable to client-side script extraction.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* SECTION 5: FROM DISCOVERY TO REPORT */}
      {/* ================================================== */}
      <section
        style={{
          padding: '80px 48px',
          maxWidth: '1360px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge-pill badge-purple" style={{ marginBottom: '12px' }}>
            Lifecycle
          </span>
          <h2 style={{ fontSize: '36px', fontWeight: '800' }}>
            From Discovery to Report
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '16px' }}>
            A smooth 5-stage workflow designed for both security specialists and developers.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
          {[
            { num: '01', title: 'Add Website', desc: 'Confirm verified ownership or authorization scope.' },
            { num: '02', title: 'Configure Assessment', desc: 'Select scan depth, profiles, and passive criteria.' },
            { num: '03', title: 'Analyze Web App', desc: 'Real-time 8-phase inspection via WebSocket feed.' },
            { num: '04', title: 'Review Findings', desc: 'Interactive triage with CVSS scores and evidence.' },
            { num: '05', title: 'Generate Report', desc: 'Export executive PDF, technical HTML, or JSON.' },
          ].map((s, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '24px 20px',
                borderRadius: 'var(--radius-md)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '36px',
                  fontWeight: '900',
                  color: 'rgba(168, 85, 247, 0.3)',
                  marginBottom: '10px',
                }}
              >
                {s.num}
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>
                {s.title}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================== */}
      {/* SECTION 6: AI-ASSISTED SECURITY ANALYSIS */}
      {/* ================================================== */}
      <section
        style={{
          padding: '80px 48px',
          maxWidth: '1360px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          className="glass-panel-elevated"
          style={{
            padding: '48px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={18} style={{ color: 'var(--cyan-400)' }} />
              <span className="badge-pill badge-cyan">AI-Assisted Security Analysis</span>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1.25', marginBottom: '16px' }}>
              Autonomous Synthesis of Web Application Risk
            </h2>
            <div
              style={{
                padding: '16px 20px',
                borderRadius: '10px',
                background: 'rgba(124, 58, 237, 0.12)',
                borderLeft: '4px solid var(--cyan-400)',
                fontSize: '15px',
                fontWeight: '500',
                color: '#FFFFFF',
                marginBottom: '20px',
                fontStyle: 'italic',
              }}
            >
              "Your latest assessment identified 7 security observations across 42 pages."
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: '1.6', marginBottom: '24px' }}>
              SecureRecon AI contextualizes individual findings across the entire application graph,
              distilling alert noise into an executive risk summary with actionable code-level remediation.
            </p>
            <button
              onClick={() => onNavigate('/ai-analysis')}
              className="btn-primary"
              style={{ padding: '10px 22px' }}
            >
              Explore AI Security Intelligence
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Right AI Feature Matrix */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                background: '#181222',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '16px 20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong style={{ color: '#F87171', fontSize: '14px' }}>Critical Findings</strong>
                <span className="badge-pill badge-critical">1 Action Required</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Exposed API token on /account/profile identified for immediate credential revocation.
              </p>
            </div>

            <div
              style={{
                background: '#181222',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '16px 20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong style={{ color: 'var(--cyan-400)', fontSize: '14px' }}>Recommended Remediation</strong>
                <span className="badge-pill badge-cyan">4 Step Roadmap</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Prioritized fix queue: Credential Rotation &gt; HttpOnly Flags &gt; Strict CSP Deployment.
              </p>
            </div>

            <div
              style={{
                background: '#181222',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '16px 20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong style={{ color: 'var(--purple-300)', fontSize: '14px' }}>Affected Pages</strong>
                <span className="badge-pill badge-purple">42 Cataloged</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Authentication surface (/login) and User Portal (/account/profile) mapped.
              </p>
            </div>

            <div
              style={{
                background: '#181222',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '16px 20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong style={{ color: '#34D399', fontSize: '14px' }}>Security Trends</strong>
                <span className="badge-pill badge-secure">+10 pts in 90 Days</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Progressive improvement from 72/100 to current 82/100 posture score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* SECTION 7: PROFESSIONAL SECURITY REPORTS */}
      {/* ================================================== */}
      <section
        id="reports"
        style={{
          padding: '80px 48px',
          maxWidth: '1360px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge-pill badge-purple" style={{ marginBottom: '12px' }}>
            Board-Ready Deliverables
          </span>
          <h2 style={{ fontSize: '36px', fontWeight: '800' }}>
            Professional Security Reports
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '16px' }}>
            Export executive summaries and deep technical audits with official SecureRecon branding.
          </p>
        </div>

        {/* Report Preview Card */}
        <div
          className="glass-panel"
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            padding: '36px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-medium)',
            boxShadow: '0 20px 50px rgba(124, 58, 237, 0.2)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px' }}>
                <SecureReconLogo size="small" />
              </div>
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: '800' }}>
                  SecureRecon Web Security Assessment
                </h4>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Report Format: Comprehensive Technical Assessment
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Security Score</span>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#C084FC' }}>
                82 / 100
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              padding: '16px',
              background: '#090612',
              borderRadius: '10px',
              marginBottom: '24px',
            }}
          >
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Critical</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#EF4444' }}>1</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>High</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#F97316' }}>3</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Medium</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#EAB308' }}>8</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Low</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#3B82F6' }}>5</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => onNavigate('/reports')}
              className="btn-primary"
              style={{ padding: '10px 24px', fontSize: '14px' }}
            >
              Generate Report
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* SECTION 8: FINAL CTA */}
      {/* ================================================== */}
      <section
        style={{
          padding: '120px 48px',
          maxWidth: '1100px',
          margin: '0 auto',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div
          className="glass-panel-elevated"
          style={{
            padding: '64px 48px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <h2 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Start Seeing Your Web Application Differently.
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: 'var(--text-secondary)',
              maxWidth: '650px',
              margin: '0 auto 36px auto',
              lineHeight: '1.6',
            }}
          >
            SecureRecon gives your team a clear view of web application security.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '18px' }}>
            <button
              onClick={() => onNavigate('/scans/new')}
              className="btn-primary"
              style={{ padding: '14px 32px', fontSize: '16px', borderRadius: 'var(--radius-md)' }}
            >
              Start Assessment
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onNavigate('/dashboard')}
              className="btn-secondary"
              style={{ padding: '14px 28px', fontSize: '16px', borderRadius: 'var(--radius-md)' }}
            >
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '40px 48px',
          maxWidth: '1360px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'var(--text-muted)',
          fontSize: '13px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px' }}>
            <SecureReconLogo size="small" />
          </div>
          <span style={{ fontWeight: '700', color: '#FFFFFF' }}>SecureRecon</span>
          <span>— Web Application Security, Simplified.</span>
        </div>
        <div>
          Authorized Testing Only &bull; Strict Web Application Scope &bull; &copy; 2026 SecureRecon
        </div>
      </footer>
    </div>
  );
}
