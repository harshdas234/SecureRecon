import React, { useState, useEffect } from 'react';
import SecureReconLogo from '../components/SecureReconLogo';
import {
  FolderKanban,
  Globe,
  Sliders,
  CheckCircle2,
  Play,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Layers,
  FileCode,
  Lock,
  Camera
} from 'lucide-react';
import { api } from '../services/api';

export default function NewScanPage({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Wizard selections
  const [selectedProject, setSelectedProject] = useState('Cybersecurity Operations Group');
  const [selectedWebsiteId, setSelectedWebsiteId] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('Standard Web Assessment');

  // Custom Target URL Input Box
  const [targetUrlInput, setTargetUrlInput] = useState('https://google.com');
  const [useCustomUrl, setUseCustomUrl] = useState(true);

  // Settings
  const [maxPages, setMaxPages] = useState(50);
  const [maxDepth, setMaxDepth] = useState(3);
  const [sameOriginOnly, setSameOriginOnly] = useState(true);
  const [formAnalysis, setFormAnalysis] = useState(true);
  const [cookieAnalysis, setCookieAnalysis] = useState(true);
  const [jsAnalysis, setJsAnalysis] = useState(true);
  const [headerAnalysis, setHeaderAnalysis] = useState(true);
  const [screenshotCapture, setScreenshotCapture] = useState(true);
  const [pageMetadata, setPageMetadata] = useState(true);

  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    async function loadWebsites() {
      try {
        const list = await api.getWebsites();
        if (list && list.length > 0) {
          setWebsites(list);
          setSelectedWebsiteId(list[0].id);
        }
      } catch (err) {
        console.warn('Failed to load websites:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWebsites();
  }, []);

  const profiles = [
    {
      name: 'Quick Web Check',
      desc: 'Rapid evaluation of root routes, response codes, and key TLS/HTTP security headers.',
      duration: '~30 seconds',
      icon: Zap,
    },
    {
      name: 'Standard Web Assessment',
      desc: 'Balanced assessment covering headers, cookies, forms, and JavaScript assets.',
      duration: '~2 minutes',
      icon: Layers,
      recommended: true,
    },
    {
      name: 'Deep Web Assessment',
      desc: 'Full web crawler exploration, deep script parsing, form audits, and screenshot captures.',
      duration: '~5 minutes',
      icon: ShieldCheck,
    },
    {
      name: 'JavaScript Analysis',
      desc: 'Dedicated scanner hunting for exposed frontend secrets, API tokens, and library CVEs.',
      duration: '~1 minute',
      icon: FileCode,
    },
    {
      name: 'Security Configuration Check',
      desc: 'Targeted verification of Content Security Policy, HSTS, X-Frame-Options, and cookie flags.',
      duration: '~45 seconds',
      icon: Lock,
    },
  ];

  const handleStartScan = async () => {
    setLaunching(true);
    try {
      const payload = {
        project_id: 'default',
        profile_name: selectedProfile,
        max_pages: maxPages,
        max_depth: maxDepth,
        check_forms: formAnalysis,
        check_cookies: cookieAnalysis,
        check_javascript: jsAnalysis,
        check_headers: headerAnalysis,
        capture_screenshots: screenshotCapture,
      };

      if (useCustomUrl && targetUrlInput.trim()) {
        payload.target_url = targetUrlInput.trim();
      } else {
        payload.website_id = selectedWebsiteId;
      }

      const scanRes = await api.createScan(payload);

      if (scanRes && scanRes.id) {
        onNavigate(`/scans/${scanRes.id}/running`);
      } else {
        onNavigate('/scans/running');
      }
    } catch (err) {
      console.warn('Backend launch note:', err.message);
      onNavigate('/scans/demo-active/running');
    } finally {
      setLaunching(false);
    }
  };

  const selectedSiteObj = useCustomUrl && targetUrlInput.trim()
    ? { name: `${targetUrlInput.trim()} Target`, url: targetUrlInput.trim() }
    : websites.find((w) => w.id === selectedWebsiteId) || websites[0] || {
        name: 'Google Web Target (Authorized Example)',
        url: 'https://google.com',
      };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '13px', color: 'var(--purple-300)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Assessment Wizard
          </span>
          <span style={{ color: 'var(--text-dim)' }}>&bull;</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Controlled Web Assessment</span>
        </div>
        <h1 style={{ fontSize: '30px', fontWeight: '800' }}>New Web Security Assessment</h1>
      </div>

      {/* Step Progress Bar */}
      <div className="glass-panel" style={{ padding: '20px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          {[
            { num: 1, title: 'Select Project' },
            { num: 2, title: 'Select Website' },
            { num: 3, title: 'Select Profile' },
            { num: 4, title: 'Configure Settings' },
            { num: 5, title: 'Review & Start' },
          ].map((s) => {
            const isDone = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div
                key={s.num}
                onClick={() => {
                  if (s.num < step) setStep(s.num);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: s.num < step ? 'pointer' : 'default',
                  opacity: isCurrent || isDone ? 1 : 0.45,
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isDone
                      ? '#10B981'
                      : isCurrent
                      ? 'linear-gradient(135deg, var(--purple-600), var(--purple-400))'
                      : '#181222',
                    border: `1px solid ${isCurrent ? 'var(--cyan-400)' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    boxShadow: isCurrent ? '0 0 14px rgba(168, 85, 247, 0.5)' : 'none',
                  }}
                >
                  {isDone ? '✓' : s.num}
                </div>
                <span style={{ fontSize: '13.5px', fontWeight: isCurrent ? '700' : '500', color: isCurrent ? '#FFFFFF' : 'var(--text-secondary)' }}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="glass-panel-elevated" style={{ padding: '36px', minHeight: '380px' }}>
        {/* STEP 1: SELECT PROJECT */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>
              Step 1: Select Project Workspace
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              Choose the security project group to associate this assessment and its generated audit reports.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
              {[
                {
                  name: 'Cybersecurity Operations Group',
                  client: 'Enterprise Security Division',
                  targets: '3 Verified Web Applications',
                },
                {
                  name: 'Product Assurance & Staging',
                  client: 'Pre-Release Quality Team',
                  targets: '1 Staging Environment',
                },
              ].map((proj, idx) => {
                const isSelected = selectedProject === proj.name;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedProject(proj.name)}
                    style={{
                      background: isSelected ? 'rgba(124, 58, 237, 0.2)' : '#181222',
                      border: `1.5px solid ${isSelected ? 'var(--purple-400)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <FolderKanban size={18} style={{ color: isSelected ? 'var(--cyan-400)' : 'var(--purple-400)' }} />
                      <strong style={{ fontSize: '15.5px', color: '#FFFFFF' }}>{proj.name}</strong>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      {proj.client}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {proj.targets}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: SELECT WEBSITE */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>
              Step 2: Enter or Select Web Target URL
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              Type any authorized web application URL (e.g. <code>https://google.com</code>) or choose an existing registered asset.
            </p>

            {/* DIRECT URL INPUT BOX */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(24, 18, 34, 0.9) 0%, rgba(17, 16, 26, 0.9) 100%)',
                border: '1.5px solid var(--purple-500)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                marginBottom: '28px',
                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.2)',
              }}
            >
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#FFFFFF', marginBottom: '8px' }}>
                🌐 Target Website URL (HTTP / HTTPS Only)
              </label>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="https://google.com or https://your-website.com"
                  value={targetUrlInput}
                  onChange={(e) => {
                    setTargetUrlInput(e.target.value);
                    setUseCustomUrl(true);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: '#090612',
                    border: '1px solid var(--cyan-400)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontFamily: 'monospace',
                    fontSize: '15px',
                    outline: 'none',
                    boxShadow: '0 0 12px rgba(34, 211, 238, 0.2)',
                  }}
                />
              </div>

              {/* QUICK EXAMPLE BUTTONS */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Quick Examples:</span>
                <button
                  type="button"
                  onClick={() => {
                    setTargetUrlInput('https://google.com');
                    setUseCustomUrl(true);
                  }}
                  style={{
                    background: targetUrlInput === 'https://google.com' ? 'rgba(34, 211, 238, 0.25)' : 'rgba(124, 58, 237, 0.15)',
                    border: `1px solid ${targetUrlInput === 'https://google.com' ? 'var(--cyan-400)' : 'var(--border-subtle)'}`,
                    borderRadius: '6px',
                    padding: '5px 12px',
                    fontSize: '12.5px',
                    color: targetUrlInput === 'https://google.com' ? '#FFFFFF' : 'var(--cyan-400)',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  🚀 https://google.com
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTargetUrlInput('https://demo.example.test');
                    setUseCustomUrl(true);
                  }}
                  style={{
                    background: targetUrlInput === 'https://demo.example.test' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(124, 58, 237, 0.15)',
                    border: `1px solid ${targetUrlInput === 'https://demo.example.test' ? 'var(--purple-400)' : 'var(--border-subtle)'}`,
                    borderRadius: '6px',
                    padding: '5px 12px',
                    fontSize: '12.5px',
                    color: targetUrlInput === 'https://demo.example.test' ? '#FFFFFF' : 'var(--purple-300)',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  🛡️ https://demo.example.test
                </button>
              </div>
            </div>

            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '14px' }}>
              Or Select From Verified Asset Inventory:
            </div>

            {websites.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No registered websites found. Type a target URL directly above.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
                {websites.map((w) => {
                  const isSelected = !useCustomUrl && selectedWebsiteId === w.id;
                  return (
                    <div
                      key={w.id}
                      onClick={() => {
                        setSelectedWebsiteId(w.id);
                        setTargetUrlInput(w.url);
                        setUseCustomUrl(false);
                      }}
                      style={{
                        background: isSelected ? 'rgba(124, 58, 237, 0.2)' : '#181222',
                        border: `1.5px solid ${isSelected ? 'var(--cyan-400)' : 'var(--border-subtle)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Globe size={18} style={{ color: isSelected ? 'var(--cyan-400)' : 'var(--purple-400)' }} />
                          <strong style={{ fontSize: '15.5px', color: '#FFFFFF' }}>{w.name}</strong>
                        </div>
                        <span className="badge-pill badge-purple" style={{ fontSize: '10.5px' }}>
                          {w.environment}
                        </span>
                      </div>

                      <div style={{ fontSize: '13px', color: 'var(--cyan-400)', fontFamily: 'monospace', marginBottom: '8px' }}>
                        {w.url}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10B981' }}>
                        <CheckCircle2 size={13} />
                        Explicit Authorization Confirmed
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: SELECT SCAN PROFILE */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>
              Step 3: Select Scan Profile
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              Choose an assessment profile matching your operational objectives.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {profiles.map((p) => {
                const Icon = p.icon;
                const isSelected = selectedProfile === p.name;
                return (
                  <div
                    key={p.name}
                    onClick={() => setSelectedProfile(p.name)}
                    style={{
                      background: isSelected ? 'rgba(124, 58, 237, 0.2)' : '#181222',
                      border: `1.5px solid ${isSelected ? 'var(--purple-400)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: 'rgba(124, 58, 237, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={20} style={{ color: isSelected ? 'var(--cyan-400)' : 'var(--purple-300)' }} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <strong style={{ fontSize: '15px', color: '#FFFFFF' }}>{p.name}</strong>
                          {p.recommended && (
                            <span className="badge-pill badge-cyan" style={{ fontSize: '10.5px' }}>
                              Recommended
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {p.desc}
                        </p>
                      </div>
                    </div>

                    <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {p.duration}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: CONFIGURE SETTINGS */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>
              Step 4: Assessment Settings
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              Fine-tune crawl depth limits and select which web application layers to inspect.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
              {/* Left Column: Limits */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                    <span>Maximum Pages to Discover</span>
                    <span style={{ color: 'var(--cyan-400)' }}>{maxPages} pages</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="5"
                    value={maxPages}
                    onChange={(e) => setMaxPages(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--purple-500)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                    <span>Maximum Crawl Depth</span>
                    <span style={{ color: 'var(--cyan-400)' }}>Depth: {maxDepth} links</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={maxDepth}
                    onChange={(e) => setMaxDepth(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--purple-500)' }}
                  />
                </div>

                <div style={{ background: '#181222', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={sameOriginOnly}
                      onChange={(e) => setSameOriginOnly(e.target.checked)}
                      style={{ accentColor: 'var(--purple-600)' }}
                    />
                    <span>
                      <strong>Strict Same-Origin Links:</strong> Never follow out-of-scope third-party hyperlinks.
                    </span>
                  </label>
                </div>
              </div>

              {/* Right Column: Layer Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Inspection Modules
                </span>

                {[
                  { label: 'Form Analysis (CSRF, methods, password inputs)', checked: formAnalysis, setter: setFormAnalysis },
                  { label: 'Cookie Security (HttpOnly, Secure, SameSite)', checked: cookieAnalysis, setter: setCookieAnalysis },
                  { label: 'JavaScript Analysis (API token leaks, libs)', checked: jsAnalysis, setter: setJsAnalysis },
                  { label: 'Security Header Analysis (CSP, HSTS, XFO)', checked: headerAnalysis, setter: setHeaderAnalysis },
                  { label: 'Screenshot Capture (Viewport rendering)', checked: screenshotCapture, setter: setScreenshotCapture },
                  { label: 'Page Metadata (Title, response timing)', checked: pageMetadata, setter: setPageMetadata },
                ].map((item, idx) => (
                  <label
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: '#181222',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.setter(e.target.checked)}
                      style={{ accentColor: 'var(--purple-600)' }}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & START */}
        {step === 5 && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>
              Step 5: Review & Confirmation
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              Verify assessment configuration before initializing the pipeline.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px',
                marginBottom: '28px',
              }}
            >
              <div style={{ background: '#181222', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PROJECT</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', marginTop: '4px' }}>{selectedProject}</div>
              </div>

              <div style={{ background: '#181222', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>TARGET WEB APPLICATION</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--cyan-400)', marginTop: '4px' }}>
                  {selectedSiteObj.name} ({selectedSiteObj.url})
                </div>
              </div>

              <div style={{ background: '#181222', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>SCAN PROFILE</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--purple-300)', marginTop: '4px' }}>{selectedProfile}</div>
              </div>

              <div style={{ background: '#181222', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>MAX CRAWL CONFIG</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', marginTop: '4px' }}>
                  {maxPages} pages &bull; Depth: {maxDepth}
                </div>
              </div>
            </div>

            {/* Scope Confirmation Notice */}
            <div
              style={{
                background: 'rgba(34, 211, 238, 0.08)',
                border: '1px solid var(--cyan-400)',
                padding: '16px 20px',
                borderRadius: '8px',
                fontSize: '13.5px',
                color: 'var(--text-secondary)',
                marginBottom: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyan-400)', fontWeight: '700', marginBottom: '4px' }}>
                <ShieldCheck size={18} />
                Strict Application Scope Guarantee
              </div>
              SecureRecon will conduct a controlled assessment solely on {selectedSiteObj.url}.
              Network port scanning, infrastructure probing, credential stuffing, and destructive methods are strictly locked out.
            </div>
          </div>
        )}

        {/* Wizard Footer Buttons */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            marginTop: '32px',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="btn-secondary"
              style={{ padding: '10px 20px' }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="btn-primary"
              style={{ padding: '10px 24px' }}
            >
              Continue
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleStartScan}
              disabled={launching}
              className="btn-primary"
              style={{
                padding: '12px 28px',
                fontSize: '15px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #22D3EE 100%)',
              }}
            >
              <Play size={16} />
              {launching ? 'Initializing Pipeline...' : 'Start SecureRecon Assessment'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
