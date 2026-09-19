import React, { useState, useRef } from 'react';

/**
 * SecureRecon Official Cybersecurity Logo
 * Replaces the previous 3D wireframe with the official high-tech cyber shield emblem:
 * Glowing metallic bevel shield, circuit traces, integrated padlock/checkmark emblem,
 * and 3D metallic typography.
 * Supports sizes: 'small', 'medium', 'large', 'hero'
 */
export default function SecureReconLogo({ size = 'medium', className = '' }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const heroCardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!heroCardRef.current || size !== 'hero') return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Mild 3D tilt
    setTilt({
      x: -(y / (rect.height / 2)) * 8,
      y: (x / (rect.width / 2)) * 8,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // 1. SMALL SIZE: Navbar & Sidebar Icon (40x40)
  if (size === 'small') {
    return (
      <div
        className={`securerecon-logo-small ${className}`}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1.5px solid rgba(34, 211, 238, 0.5)',
          boxShadow: '0 0 16px rgba(34, 211, 238, 0.35), 0 0 25px rgba(124, 58, 237, 0.25)',
          backgroundImage: "url('/securerecon-hero-logo.jpg')",
          backgroundSize: '215% auto',
          backgroundPosition: '50% 15%',
          backgroundRepeat: 'no-repeat',
          flexShrink: 0,
          position: 'relative',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        title="SecureRecon"
      >
        {/* Subtle cyan glint overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  }

  // 2. MEDIUM SIZE: Dashboard, Report Cover & Inventory Cards (76x76)
  if (size === 'medium') {
    return (
      <div
        className={`securerecon-logo-medium ${className}`}
        style={{
          width: '76px',
          height: '76px',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '2px solid rgba(34, 211, 238, 0.6)',
          boxShadow: '0 0 22px rgba(34, 211, 238, 0.4), 0 8px 24px rgba(0, 0, 0, 0.6)',
          backgroundImage: "url('/securerecon-hero-logo.jpg')",
          backgroundSize: '215% auto',
          backgroundPosition: '50% 15%',
          backgroundRepeat: 'no-repeat',
          flexShrink: 0,
          position: 'relative',
          transition: 'transform 0.25s ease',
        }}
        title="SecureRecon Web Security Shield"
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at top right, rgba(34, 211, 238, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  }

  // 3. LARGE SIZE: Login / Auth Hero (140x140)
  if (size === 'large') {
    return (
      <div
        className={`securerecon-logo-large ${className}`}
        style={{
          width: '140px',
          height: '140px',
          borderRadius: '22px',
          overflow: 'hidden',
          border: '2px solid rgba(34, 211, 238, 0.7)',
          boxShadow: '0 0 35px rgba(34, 211, 238, 0.45), 0 12px 35px rgba(124, 58, 237, 0.35)',
          backgroundImage: "url('/securerecon-hero-logo.jpg')",
          backgroundSize: '215% auto',
          backgroundPosition: '50% 15%',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          animation: 'cyberPulseRing 4s ease-in-out infinite',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(34, 211, 238, 0.15) 0%, transparent 80%)',
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  }

  // 4. HERO SIZE: Main Landing Page Showcase with 3D Tilt, Scanline Beam & Cyber Badges
  return (
    <div
      ref={heroCardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`securerecon-hero-logo-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '540px',
        margin: '0 auto',
        perspective: '1000px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Dynamic Ambient Neon Aura Behind Logo */}
      <div
        style={{
          position: 'absolute',
          width: '90%',
          height: '90%',
          borderRadius: '28px',
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, rgba(124, 58, 237, 0.4) 45%, transparent 75%)',
          filter: 'blur(45px)',
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'cyberPulseRing 5s ease-in-out infinite',
        }}
      />

      {/* Floating Tactical Cyber HUD Badge (Top Right) */}
      <div
        style={{
          position: 'absolute',
          top: '-14px',
          right: '8px',
          zIndex: 4,
          background: 'rgba(17, 16, 26, 0.88)',
          backdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(16, 185, 129, 0.6)',
          borderRadius: '999px',
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          fontWeight: '700',
          color: '#E2E8F0',
          letterSpacing: '0.06em',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5), 0 0 15px rgba(16, 185, 129, 0.3)',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10B981',
            boxShadow: '0 0 10px #10B981',
          }}
        />
        DEFENSE SHIELD ACTIVE
      </div>

      {/* Main 3D Card Chassis */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          borderRadius: '22px',
          overflow: 'hidden',
          border: '1.5px solid rgba(34, 211, 238, 0.45)',
          background: '#090612',
          boxShadow:
            '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(34, 211, 238, 0.25), 0 0 60px rgba(124, 58, 237, 0.25)',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
          cursor: 'pointer',
        }}
      >
        {/* Animated Holographic Cyan Scan Beam */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(34, 211, 238, 0.9) 50%, transparent 100%)',
            boxShadow: '0 0 18px 4px rgba(34, 211, 238, 0.8)',
            zIndex: 3,
            pointerEvents: 'none',
            animation: 'cyberScanBeam 4s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          }}
        />

        {/* High-Resolution Official SecureRecon Shield Emblem Image */}
        <img
          src="/securerecon-hero-logo.jpg"
          alt="SecureRecon - Cybersecurity, Trusted, Innovation"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            objectFit: 'cover',
          }}
        />

        {/* Cyber Bottom Vignette Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50px',
            background: 'linear-gradient(to top, rgba(9, 6, 18, 0.7) 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      </div>

      {/* Floating Tactical Badges Under Logo */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: '14px',
          padding: '0 4px',
          zIndex: 3,
        }}
      >
        <div
          style={{
            background: 'rgba(17, 16, 26, 0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(34, 211, 238, 0.35)',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '11.5px',
            color: 'var(--cyan-400)',
            fontWeight: '600',
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>⚡</span> Real-Time Web Shield
        </div>

        <div
          style={{
            background: 'rgba(17, 16, 26, 0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(124, 58, 237, 0.35)',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '11.5px',
            color: 'var(--purple-300)',
            fontWeight: '600',
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>🔒</span> Web-Layer Scope Control
        </div>
      </div>
    </div>
  );
}
