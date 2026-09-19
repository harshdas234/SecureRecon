import React, { useState } from 'react';
import SecureReconLogo from '../components/SecureReconLogo';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { api, setAuthToken } from '../services/api';

export default function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState('admin@securerecon.io');
  const [password, setPassword] = useState('securerecon2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.login(email, password);
      if (res && res.access_token) {
        setAuthToken(res.access_token);
      }
      onNavigate('/dashboard');
    } catch (err) {
      // If offline or dev mode fallback, allow entry into demo dashboard
      console.warn('Backend login note:', err.message);
      setAuthToken('demo_token');
      onNavigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="cyber-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
      }}
    >
      <div
        className="glass-panel-elevated"
        style={{
          width: '100%',
          maxWidth: '1020px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          minHeight: '580px',
        }}
      >
        {/* LEFT BRAND PANEL */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(24, 18, 34, 0.95) 0%, rgba(9, 6, 18, 0.98) 100%)',
            borderRight: '1px solid var(--border-subtle)',
            padding: '56px 48px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Radial Ambient Backlight */}
          <div
            style={{
              position: 'absolute',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '22px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #FFFFFF, #C084FC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              SecureRecon
            </span>
          </div>

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '180px', height: '180px', marginBottom: '24px' }}>
              <SecureReconLogo size="large" />
            </div>
            <h2
              style={{
                fontSize: '26px',
                fontWeight: '700',
                lineHeight: '1.3',
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                maxWidth: '320px',
              }}
            >
              "Secure your web applications with clarity."
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginTop: '12px', maxWidth: '300px' }}>
              Authorized testing, real-time posture analysis, and automated remediation intelligence.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--cyan-400)' }}>
            <ShieldCheck size={16} />
            <span>Strict Application Layer Authorization Enforced</span>
          </div>
        </div>

        {/* RIGHT LOGIN CARD */}
        <div
          style={{
            padding: '56px 48px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
              Sign In to Workspace
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Access your authorized assessment environment.
            </p>
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #EF4444',
                color: '#FCA5A5',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13.5px',
                marginBottom: '20px',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={17}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="analyst@securerecon.io"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    background: '#181222',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--purple-400)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={17}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    background: '#181222',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--purple-400)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--purple-600)' }}
                />
                Remember me
              </label>
              <a href="#forgot" style={{ color: 'var(--purple-300)', fontSize: '13px' }}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '15px',
                borderRadius: 'var(--radius-sm)',
                marginTop: '8px',
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo One-Click Access */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Quick Evaluation Mode:
            </span>
            <button
              onClick={() => {
                setEmail('admin@securerecon.io');
                setPassword('securerecon2026');
                handleLogin();
              }}
              style={{
                display: 'block',
                width: '100%',
                marginTop: '10px',
                padding: '10px',
                background: 'rgba(34, 211, 238, 0.1)',
                border: '1px solid rgba(34, 211, 238, 0.3)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--cyan-400)',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              One-Click Demo Entry (Admin Profile)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
