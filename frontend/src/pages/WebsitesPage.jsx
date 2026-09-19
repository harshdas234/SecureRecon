import React, { useState, useEffect } from 'react';
import SecureReconLogo from '../components/SecureReconLogo';
import {
  Globe,
  Plus,
  Shield,
  ShieldAlert,
  CheckCircle2,
  Trash2,
  Play,
  ExternalLink,
  Tag,
  Server,
  Layers,
  Info
} from 'lucide-react';
import { api } from '../services/api';

export default function WebsitesPage({ onNavigate }) {
  const [websites, setWebsites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [environment, setEnvironment] = useState('Production');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('web-app, authorized');
  const [isAuthorized, setIsAuthorized] = useState(false);

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      const data = await api.getWebsites();
      if (data) setWebsites(data);
    } catch (err) {
      console.warn('Failed to load websites:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  const handleAddWebsite = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!isAuthorized) {
      setFormError('You must confirm explicit testing authorization.');
      return;
    }

    setSubmitting(true);
    try {
      await api.createWebsite({
        project_id: 'default',
        name,
        url,
        environment,
        description,
        tags,
        is_authorized: isAuthorized,
      });
      setShowModal(false);
      setName('');
      setUrl('');
      setIsAuthorized(false);
      fetchWebsites();
    } catch (err) {
      setFormError(err.message || 'Failed to add website. Ensure URL is valid and contains no IP/port ranges.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to remove this authorized website?')) {
      try {
        await api.deleteWebsite(id);
        fetchWebsites();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: 'var(--purple-300)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Inventory
            </span>
            <span style={{ color: 'var(--text-dim)' }}>&bull;</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Authorized Assets</span>
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: '800' }}>Authorized Websites</h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
          style={{ fontSize: '13.5px', padding: '10px 22px' }}
        >
          <Plus size={16} />
          Add Authorized Website
        </button>
      </div>

      {/* Scope Notice Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          borderLeft: '4px solid var(--cyan-400)',
          background: 'rgba(34, 211, 238, 0.05)',
        }}
      >
        <Info size={20} style={{ color: 'var(--cyan-400)', flexShrink: 0 }} />
        <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
          <strong>Controlled Web Scope Enforced:</strong> SecureRecon strictly audits the web application layer (HTTP headers, cookies, forms, scripts, routes). IP ranges, CIDR blocks, port scans, and infrastructure fuzzing are prohibited.
        </div>
      </div>

      {/* Website Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>Loading authorized assets...</div>
      ) : websites.length === 0 ? (
        /* Empty State with Branded SecureRecon element */
        <div
          className="glass-panel"
          style={{
            padding: '64px 32px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '80px', height: '80px', marginBottom: '20px' }}>
            <SecureReconLogo size="medium" />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
            No websites yet
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', maxWidth: '420px', marginBottom: '24px' }}>
            Add your first authorized website to begin your SecureRecon assessment.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
            style={{ padding: '10px 24px' }}
          >
            <Plus size={16} />
            Add Website
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '22px' }}>
          {websites.map((w) => (
            <div
              key={w.id}
              className="glass-panel"
              style={{
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span className="badge-pill badge-purple" style={{ fontSize: '11px', marginBottom: '6px' }}>
                      {w.environment}
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF' }}>
                      {w.name}
                    </h3>
                  </div>
                  <div
                    style={{
                      background: 'rgba(124, 58, 237, 0.15)',
                      border: '1px solid var(--purple-500)',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SCORE</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#C084FC' }}>
                      {w.last_score || 82}
                    </div>
                  </div>
                </div>

                {/* Target URL */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    color: 'var(--cyan-400)',
                    fontFamily: 'monospace',
                    background: '#090612',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    marginBottom: '14px',
                  }}
                >
                  <Globe size={14} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {w.url}
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
                  {w.description || 'Verified web application asset under active security monitoring.'}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                  {w.tags.split(',').map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '11px',
                        background: '#181222',
                        color: 'var(--text-muted)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(124, 58, 237, 0.15)',
                      }}
                    >
                      #{t.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10B981' }}>
                  <CheckCircle2 size={14} />
                  <span>Authorized</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleDelete(w.id)}
                    title="Delete Website"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-dim)',
                      cursor: 'pointer',
                      padding: '6px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
                  >
                    <Trash2 size={16} />
                  </button>

                  <button
                    onClick={() => onNavigate('/scans/new')}
                    className="btn-primary"
                    style={{ padding: '6px 14px', fontSize: '12.5px' }}
                  >
                    <Play size={13} />
                    Scan Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD WEBSITE MODAL */}
      {showModal && (
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
              maxWidth: '560px',
              padding: '36px',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Add Authorized Website</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '22px', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            {formError && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #EF4444',
                  color: '#FCA5A5',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  marginBottom: '18px',
                }}
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleAddWebsite} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  Website Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Corporate Portal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#181222',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  Website URL * (Websites only &bull; No IP ranges/ports)
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://demo.example.test"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#181222',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    outline: 'none',
                    fontFamily: 'monospace',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                    Environment
                  </label>
                  <select
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#181222',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#FFFFFF',
                      outline: 'none',
                    }}
                  >
                    <option value="Production">Production</option>
                    <option value="Staging">Staging</option>
                    <option value="QA">QA / Testing</option>
                    <option value="Development">Development</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="web-app, internal"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#181222',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#FFFFFF',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Primary web application for client management."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#181222',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              {/* MANDATORY AUTHORIZATION CONFIRMATION */}
              <div
                style={{
                  background: 'rgba(124, 58, 237, 0.12)',
                  border: '1px solid var(--purple-500)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px',
                }}
              >
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', lineHeight: '1.4' }}>
                  <input
                    type="checkbox"
                    checked={isAuthorized}
                    onChange={(e) => setIsAuthorized(e.target.checked)}
                    style={{ marginTop: '3px', accentColor: 'var(--purple-600)' }}
                  />
                  <span>
                    <strong>"I confirm that I own this website or have explicit authorization to perform security testing."</strong>
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                  style={{ padding: '9px 18px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !isAuthorized}
                  className="btn-primary"
                  style={{ padding: '9px 22px', opacity: isAuthorized ? 1 : 0.5 }}
                >
                  {submitting ? 'Registering...' : 'Add Website Target'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
