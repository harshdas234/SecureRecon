import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import WebsitesPage from './pages/WebsitesPage';
import NewScanPage from './pages/NewScanPage';
import RunningScanPage from './pages/RunningScanPage';
import {
  PagesAnalysisPage,
  FormsAnalysisPage,
  JavascriptAnalysisPage,
  CookiesAnalysisPage,
  SecurityHeadersPage,
  TechnologiesPage,
  ScreenshotsPage,
} from './pages/AnalysisPages';
import VulnerabilitiesPage from './pages/VulnerabilitiesPage';
import AiAnalysisPage from './pages/AiAnalysisPage';
import ReportsPage from './pages/ReportsPage';
import {
  SchedulerPage,
  NotificationsPage,
  LogsPage,
  TeamPage,
  SettingsPage,
  AdminPage,
} from './pages/OperationsPages';
import Sidebar from './components/Sidebar';
import { Bell, Search, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [scanParamId, setScanParamId] = useState('demo-active');

  // Handle URL hash / path navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      if (hash.startsWith('/scans/') && hash.endsWith('/running')) {
        const parts = hash.split('/');
        setScanParamId(parts[2] || 'demo-active');
        setCurrentRoute('/scans/running');
      } else {
        setCurrentRoute(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route) => {
    if (route.startsWith('/scans/') && route.endsWith('/running')) {
      const parts = route.split('/');
      setScanParamId(parts[2] || 'demo-active');
      setCurrentRoute('/scans/running');
      window.location.hash = route;
    } else {
      setCurrentRoute(route);
      window.location.hash = route;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Landing Page Route
  if (currentRoute === '/' || currentRoute === '') {
    return <LandingPage onNavigate={navigateTo} />;
  }

  // 2. Login Page Route
  if (currentRoute === '/login') {
    return <LoginPage onNavigate={navigateTo} />;
  }

  // 3. Authenticated Dashboard Layout
  const renderDashboardContent = () => {
    switch (currentRoute) {
      case '/dashboard':
        return <DashboardPage onNavigate={navigateTo} />;
      case '/projects':
        return <WebsitesPage onNavigate={navigateTo} />;
      case '/websites':
        return <WebsitesPage onNavigate={navigateTo} />;
      case '/scans/new':
        return <NewScanPage onNavigate={navigateTo} />;
      case '/scans/running':
      case '/scans/history':
        return <RunningScanPage onNavigate={navigateTo} scanId={scanParamId} />;
      case '/pages':
        return <PagesAnalysisPage />;
      case '/forms':
        return <FormsAnalysisPage />;
      case '/javascript':
        return <JavascriptAnalysisPage />;
      case '/cookies':
        return <CookiesAnalysisPage />;
      case '/security-headers':
        return <SecurityHeadersPage />;
      case '/technologies':
        return <TechnologiesPage />;
      case '/screenshots':
        return <ScreenshotsPage />;
      case '/vulnerabilities':
      case '/findings':
        return <VulnerabilitiesPage />;
      case '/ai-analysis':
        return <AiAnalysisPage />;
      case '/reports':
        return <ReportsPage />;
      case '/scheduler':
        return <SchedulerPage />;
      case '/notifications':
        return <NotificationsPage />;
      case '/logs':
        return <LogsPage />;
      case '/team':
        return <TeamPage />;
      case '/settings':
        return <SettingsPage />;
      case '/admin':
        return <AdminPage />;
      default:
        return <DashboardPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="cyber-bg" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar currentRoute={currentRoute} onNavigate={navigateTo} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Dashboard Top Header Bar */}
        <header
          style={{
            height: '64px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(17, 16, 26, 0.75)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge-pill badge-purple" style={{ fontSize: '11px' }}>
              <ShieldCheck size={13} style={{ color: 'var(--cyan-400)' }} />
              Authorized Scope Enforced
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Web Target: <strong style={{ color: 'var(--cyan-400)' }}>https://demo.example.test</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigateTo('/notifications')}
              title="Notifications"
              style={{
                position: 'relative',
                background: '#181222',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
              }}
            >
              <Bell size={16} />
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#EF4444',
                }}
              />
            </button>

            <button
              onClick={() => navigateTo('/scans/new')}
              className="btn-primary"
              style={{ fontSize: '13px', padding: '7px 16px' }}
            >
              Launch Assessment
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {renderDashboardContent()}
        </main>
      </div>
    </div>
  );
}
