import React, { useState, useEffect } from 'react';
import {
  CalendarClock,
  Bell,
  ScrollText,
  Users,
  Settings as SettingsIcon,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Server,
  Activity,
  UserPlus
} from 'lucide-react';
import { api } from '../services/api';

/* ==========================================================
   1. SCHEDULER
========================================================== */
export function SchedulerPage() {
  const [schedules, setSchedules] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [selectedWeb, setSelectedWeb] = useState('');
  const [freq, setFreq] = useState('Weekly');

  useEffect(() => {
    api.getScheduler().then(setSchedules).catch(() => {});
    api.getWebsites().then((list) => {
      if (list && list.length > 0) {
        setWebsites(list);
        setSelectedWeb(list[0].id);
      }
    }).catch(() => {});
  }, []);

  const handleCreate = async () => {
    try {
      await api.createScheduledScan({ website_id: selectedWeb, frequency: freq });
      api.getScheduler().then(setSchedules);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Automated Assessment Scheduler</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>
          Configure recurring periodic assessments across authorized web applications.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Target Website</label>
          <select
            value={selectedWeb}
            onChange={(e) => setSelectedWeb(e.target.value)}
            style={{ width: '100%', padding: '9px 12px', background: '#181222', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff' }}
          >
            {websites.map((w) => (
              <option key={w.id} value={w.id}>{w.name} ({w.url})</option>
            ))}
          </select>
        </div>

        <div style={{ width: '220px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Frequency</label>
          <select
            value={freq}
            onChange={(e) => setFreq(e.target.value)}
            style={{ width: '100%', padding: '9px 12px', background: '#181222', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff' }}
          >
            <option value="Daily">Daily Assessment</option>
            <option value="Weekly">Weekly (Every Sunday)</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        <button onClick={handleCreate} className="btn-primary" style={{ padding: '9px 20px', fontSize: '13.5px' }}>
          <Plus size={15} />
          Add Schedule
        </button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ background: '#181222', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px 20px' }}>Authorized Target</th>
              <th style={{ padding: '14px 20px' }}>Cadence</th>
              <th style={{ padding: '14px 20px' }}>Cron Syntax</th>
              <th style={{ padding: '14px 20px' }}>Next Scheduled Execution</th>
              <th style={{ padding: '14px 20px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '14px 20px', fontWeight: '700', color: '#fff' }}>{s.website_name || 'Demo Target'}</td>
                <td style={{ padding: '14px 20px', color: 'var(--cyan-400)' }}>{s.frequency}</td>
                <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: 'var(--purple-300)' }}>{s.cron_expr}</td>
                <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>
                  {s.next_run ? new Date(s.next_run).toLocaleString() : 'Pending calculation'}
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span className="badge-pill badge-secure">Active</span>
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
   2. NOTIFICATIONS
========================================================== */
export function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    api.getNotifications().then(setNotifs).catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Security Notifications & Alerts</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>
          Real-time alerts for critical findings, completed audits, and engine updates.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {notifs.map((n) => (
          <div
            key={n.id}
            className="glass-panel"
            style={{
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderLeft: `4px solid ${
                n.level === 'critical' ? '#EF4444' : n.level === 'success' ? '#10B981' : 'var(--purple-500)'
              }`,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className={`badge-pill ${n.level === 'critical' ? 'badge-critical' : n.level === 'success' ? 'badge-secure' : 'badge-purple'}`}>
                  {n.level}
                </span>
                <strong style={{ fontSize: '15px', color: '#fff' }}>{n.title}</strong>
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>{n.message}</p>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {new Date(n.created_at).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================
   3. AUDIT LOGS
========================================================== */
export function LogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.getLogs().then(setLogs).catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Audit & Operation Logs</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>
          Tamper-evident audit trail of all assessment actions, user authentications, and scope verifications.
        </p>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#181222', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px 18px' }}>Timestamp</th>
              <th style={{ padding: '12px 18px' }}>Principal</th>
              <th style={{ padding: '12px 18px' }}>Action</th>
              <th style={{ padding: '12px 18px' }}>Resource Target</th>
              <th style={{ padding: '12px 18px' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px 18px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {new Date(l.timestamp).toLocaleTimeString()}
                </td>
                <td style={{ padding: '12px 18px', color: 'var(--cyan-400)' }}>{l.user_email}</td>
                <td style={{ padding: '12px 18px', fontWeight: '700', color: '#fff' }}>{l.action}</td>
                <td style={{ padding: '12px 18px', color: 'var(--purple-300)' }}>{l.resource}</td>
                <td style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>{l.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==========================================================
   4. TEAM MANAGEMENT
========================================================== */
export function TeamPage() {
  const [members, setMembers] = useState([
    { id: '1', full_name: 'Alex Mercer', email: 'admin@securerecon.io', role: 'admin', is_active: true },
    { id: '2', full_name: 'Elena Rostova', email: 'analyst@securerecon.io', role: 'analyst', is_active: true },
    { id: '3', full_name: 'Marcus Chen', email: 'devops@securerecon.io', role: 'viewer', is_active: true },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Team & Access Control</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>
            Role-based authorization for security analysts, engineers, and auditors.
          </p>
        </div>
        <button className="btn-primary" style={{ fontSize: '13.5px', padding: '9px 18px' }}>
          <UserPlus size={15} />
          Invite Security Member
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {members.map((m) => (
          <div key={m.id} className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple-600), var(--cyan-400))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#090612' }}>
                {m.full_name.substring(0, 2).toUpperCase()}
              </div>
              <span className="badge-pill badge-purple">{m.role}</span>
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#fff' }}>{m.full_name}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>{m.email}</p>
            <div style={{ fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} /> Active Authorized
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================
   5. SETTINGS
========================================================== */
export function SettingsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Platform Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>
          Global parameters for request throttling, notifications, and scan safety controls.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
            Crawler User-Agent Identification
          </label>
          <input
            type="text"
            readOnly
            value="SecureRecon-Security-Auditor/1.0 (+https://securerecon.io/compliance)"
            style={{ width: '100%', padding: '10px 14px', background: '#181222', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--cyan-400)', fontFamily: 'monospace' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
            Passive Mode Throttling Limit
          </label>
          <input
            type="text"
            readOnly
            value="10 requests per second (Adaptive Rate Limiting)"
            style={{ width: '100%', padding: '10px 14px', background: '#181222', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
            Alert Webhook URL
          </label>
          <input
            type="text"
            placeholder="https://hooks.slack.com/services/..."
            defaultValue="https://hooks.slack.com/services/SECURE/RECON/HOOK"
            style={{ width: '100%', padding: '10px 14px', background: '#181222', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff' }}
          />
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', padding: '14px', borderRadius: '6px', color: '#34D399', fontSize: '13px' }}>
          ✓ Scope Protection: Infrastructure scans, IP ranges, port scans, and fuzzing are globally locked out.
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   6. ADMIN PANEL
========================================================== */
export function AdminPage() {
  const [stats, setStats] = useState({
    engine_version: 'SecureRecon Core v1.0.0-PROD',
    system_status: 'All Defensive Services Operational',
    active_workers: 4,
    total_scans_conducted: 18,
    managed_websites: 3,
    registered_security_users: 3,
    db_engine: 'SQLAlchemy 2.0 (Dual SQLite/PostgreSQL Architecture)',
    memory_usage: '184 MB',
    average_scan_duration: '48 seconds',
    strict_scope_enforcement: 'Active (IP ranges and network ports blocked)',
  });

  useEffect(() => {
    api.getAdminStats().then(setStats).catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Admin Console & System Health</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>
          Defensive engine diagnostics, worker capacity, and operational telemetry.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Defensive System Status</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#34D399', margin: '8px 0' }}>
            ● {stats.system_status}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{stats.engine_version}</div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Background Scan Workers</div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', margin: '6px 0' }}>
            {stats.active_workers}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--cyan-400)' }}>Ready for concurrent jobs</div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Database Layer</div>
          <div style={{ fontSize: '15.5px', fontWeight: '700', color: '#C084FC', margin: '8px 0' }}>
            {stats.db_engine}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>RAM: {stats.memory_usage}</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#fff' }}>
          Scope Enforcement Status
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13.5px' }}>
          <div style={{ background: '#181222', padding: '14px', borderRadius: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Network Port Probing:</span>{' '}
            <strong style={{ color: '#EF4444' }}>STRICTLY DISABLED</strong>
          </div>
          <div style={{ background: '#181222', padding: '14px', borderRadius: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>IP Range / CIDR Scan:</span>{' '}
            <strong style={{ color: '#EF4444' }}>STRICTLY FORBIDDEN</strong>
          </div>
          <div style={{ background: '#181222', padding: '14px', borderRadius: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Passive Header & Cookie Audit:</span>{' '}
            <strong style={{ color: '#10B981' }}>ENFORCED</strong>
          </div>
          <div style={{ background: '#181222', padding: '14px', borderRadius: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Average Assessment Time:</span>{' '}
            <strong style={{ color: 'var(--cyan-400)' }}>{stats.average_scan_duration}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
