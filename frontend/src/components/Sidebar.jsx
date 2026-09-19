import React from 'react';
import SecureReconLogo from './SecureReconLogo';
import {
  LayoutDashboard,
  FolderKanban,
  Globe,
  PlusCircle,
  Activity,
  History,
  FileCode2,
  FormInput,
  FileText,
  Cookie,
  ShieldCheck,
  Cpu,
  Camera,
  AlertTriangle,
  Search,
  Sparkles,
  FileSpreadsheet,
  CalendarClock,
  Bell,
  ScrollText,
  Users,
  Settings,
  ShieldAlert,
  LogOut,
  ExternalLink
} from 'lucide-react';

export default function Sidebar({ currentRoute, onNavigate }) {
  const navSections = [
    {
      title: null,
      items: [
        { label: 'Overview', route: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'WEB ASSESSMENT',
      items: [
        { label: 'Projects', route: '/projects', icon: FolderKanban },
        { label: 'Websites', route: '/websites', icon: Globe },
        { label: 'New Scan', route: '/scans/new', icon: PlusCircle, badge: 'Wizard' },
        { label: 'Running Scans', route: '/scans/running', icon: Activity, badge: 'Live' },
        { label: 'Scan History', route: '/scans/history', icon: History },
      ],
    },
    {
      title: 'WEB ANALYSIS',
      items: [
        { label: 'Pages', route: '/pages', icon: FileCode2 },
        { label: 'Forms', route: '/forms', icon: FormInput },
        { label: 'JavaScript', route: '/javascript', icon: FileText },
        { label: 'Cookies', route: '/cookies', icon: Cookie },
        { label: 'Security Headers', route: '/security-headers', icon: ShieldCheck },
        { label: 'Technologies', route: '/technologies', icon: Cpu },
        { label: 'Screenshots', route: '/screenshots', icon: Camera },
      ],
    },
    {
      title: 'SECURITY',
      items: [
        { label: 'Vulnerabilities', route: '/vulnerabilities', icon: AlertTriangle, count: 3 },
        { label: 'Findings', route: '/findings', icon: Search },
        { label: 'AI Analysis', route: '/ai-analysis', icon: Sparkles, badge: 'AI' },
        { label: 'Reports', route: '/reports', icon: FileSpreadsheet },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Scheduler', route: '/scheduler', icon: CalendarClock },
        { label: 'Notifications', route: '/notifications', icon: Bell, count: 2 },
        { label: 'Logs', route: '/logs', icon: ScrollText },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        { label: 'Team', route: '/team', icon: Users },
        { label: 'Settings', route: '/settings', icon: Settings },
      ],
    },
    {
      title: 'ADMIN',
      items: [
        { label: 'Admin Panel', route: '/admin', icon: ShieldAlert },
      ],
    },
  ];

  return (
    <aside
      style={{
        width: '260px',
        minWidth: '260px',
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Brand Header */}
      <div
        onClick={() => onNavigate('/')}
        style={{
          padding: '20px 20px 16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
        }}
      >
        <div style={{ width: '38px', height: '38px' }}>
          <SecureReconLogo size="small" />
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '19px',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #C084FC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SecureRecon
          </div>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              letterSpacing: '0.04em',
            }}
          >
            Authorized Assessment
          </div>
        </div>
      </div>

      {/* Nav List with custom scroll */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px 12px 24px 12px',
        }}
      >
        {navSections.map((sec, idx) => (
          <div key={idx} style={{ marginBottom: '18px' }}>
            {sec.title && (
              <div
                style={{
                  fontSize: '10.5px',
                  fontWeight: '700',
                  color: 'var(--text-dim)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '6px 12px',
                }}
              >
                {sec.title}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => onNavigate(item.route)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: isActive
                        ? 'linear-gradient(90deg, rgba(124, 58, 237, 0.28) 0%, rgba(168, 85, 247, 0.12) 100%)'
                        : 'transparent',
                      border: isActive
                        ? '1px solid rgba(168, 85, 247, 0.35)'
                        : '1px solid transparent',
                      color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                      fontSize: '13.5px',
                      fontWeight: isActive ? '600' : '500',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(124, 58, 237, 0.08)';
                        e.currentTarget.style.color = '#FFFFFF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon
                        size={17}
                        style={{
                          color: isActive ? 'var(--cyan-400)' : 'var(--purple-400)',
                          filter: isActive ? 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.5))' : 'none',
                        }}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        style={{
                          fontSize: '10px',
                          padding: '2px 7px',
                          borderRadius: '10px',
                          background: item.badge === 'Live' ? 'rgba(34, 211, 238, 0.15)' : 'rgba(168, 85, 247, 0.2)',
                          color: item.badge === 'Live' ? 'var(--cyan-400)' : 'var(--purple-300)',
                          border: `1px solid ${item.badge === 'Live' ? 'rgba(34, 211, 238, 0.3)' : 'rgba(168, 85, 247, 0.4)'}`,
                          fontWeight: '700',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}

                    {item.count !== undefined && (
                      <span
                        style={{
                          fontSize: '11px',
                          padding: '1px 6px',
                          borderRadius: '10px',
                          background: item.label === 'Vulnerabilities' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(124, 58, 237, 0.2)',
                          color: item.label === 'Vulnerabilities' ? '#F87171' : 'var(--purple-200)',
                          fontWeight: '700',
                        }}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User / Scope Footer */}
      <div
        style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(9, 6, 18, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--purple-600), var(--cyan-400))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '12px',
              color: '#090612',
            }}
          >
            AM
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>
              Alex Mercer
            </div>
            <div style={{ fontSize: '11px', color: 'var(--cyan-400)' }}>
              Authorized Lead
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('/')}
          title="Return to Public Portal"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <ExternalLink size={16} />
        </button>
      </div>
    </aside>
  );
}
