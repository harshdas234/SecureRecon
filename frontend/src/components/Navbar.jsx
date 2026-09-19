import React, { useState, useEffect } from 'react';
import SecureReconLogo from './SecureReconLogo';
import { Shield, Sparkles, ArrowRight, Lock } from 'lucide-react';

export default function Navbar({ onNavigate, currentRoute }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Security', href: '#security' },
    { label: 'Reports', href: '#reports' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Documentation', href: '#docs' },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    if (currentRoute !== '/') {
      onNavigate('/');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: '74px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 36px',
        transition: 'all 0.3s ease',
        background: scrolled
          ? 'rgba(9, 6, 18, 0.85)'
          : 'rgba(9, 6, 18, 0.4)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled
          ? '1px solid rgba(124, 58, 237, 0.25)'
          : '1px solid rgba(124, 58, 237, 0.08)',
        boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.5)' : 'none',
      }}
    >
      {/* Brand & 3D Logo */}
      <div
        onClick={() => onNavigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
        }}
      >
        <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center' }}>
          <SecureReconLogo size="small" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '22px',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #C084FC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SecureRecon
          </span>
          <span
            style={{
              fontSize: '9.5px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginTop: '-2px',
            }}
          >
            Web App Security
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '28px',
        }}
      >
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => handleLinkClick(e, link.href)}
            style={{
              color: 'var(--text-secondary)',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#C084FC')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Right CTAs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={() => onNavigate('/login')}
          className="btn-secondary"
          style={{
            padding: '8px 18px',
            fontSize: '13.5px',
          }}
        >
          <Lock size={14} style={{ color: 'var(--purple-300)' }} />
          Login
        </button>

        <button
          onClick={() => onNavigate('/dashboard')}
          className="btn-primary"
          style={{
            padding: '8px 20px',
            fontSize: '13.5px',
          }}
        >
          Get Started
          <ArrowRight size={14} />
        </button>
      </div>
    </header>
  );
}
