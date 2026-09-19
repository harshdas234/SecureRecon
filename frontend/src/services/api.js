/**
 * SecureRecon API Client
 * Connects to the FastAPI backend with token authorization and response handling.
 */

const RAW_API_BASE = import.meta.env.VITE_API_BASE || '/api';
const API_BASE = RAW_API_BASE.replace(/\/+$/, '');

export const getAuthToken = () => localStorage.getItem('sr_token');
export const setAuthToken = (token) => localStorage.setItem('sr_token', token);
export const removeAuthToken = () => localStorage.removeItem('sr_token');

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(errData.detail || `Request failed with status ${res.status}`);
    }

    if (res.status === 204) return null;
    return await res.json();
  } catch (err) {
    console.warn(`API Error [${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  getCurrentUser: () => request('/auth/me'),

  // Dashboard
  getDashboardStats: () => request('/dashboard/stats'),

  // Websites
  getWebsites: () => request('/websites'),
  getWebsite: (id) => request(`/websites/${id}`),
  createWebsite: (data) => request('/websites', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  deleteWebsite: (id) => request(`/websites/${id}`, { method: 'DELETE' }),

  // Scans
  getScans: () => request('/scans'),
  getScan: (id) => request(`/scans/${id}`),
  createScan: (data) => request('/scans', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  cancelScan: (id) => request(`/scans/${id}/cancel`, { method: 'POST' }),

  // Analysis
  getPages: (scanId) => request(`/pages${scanId ? `?scan_id=${scanId}` : ''}`),
  getForms: (scanId) => request(`/forms${scanId ? `?scan_id=${scanId}` : ''}`),
  getJavascript: (scanId) => request(`/javascript${scanId ? `?scan_id=${scanId}` : ''}`),
  getCookies: (scanId) => request(`/cookies${scanId ? `?scan_id=${scanId}` : ''}`),
  getSecurityHeaders: (scanId) => request(`/security-headers${scanId ? `?scan_id=${scanId}` : ''}`),
  getTechnologies: (scanId) => request(`/technologies${scanId ? `?scan_id=${scanId}` : ''}`),
  getScreenshots: (scanId) => request(`/screenshots${scanId ? `?scan_id=${scanId}` : ''}`),

  // Vulnerabilities & Findings
  getFindings: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.scanId) params.append('scan_id', filters.scanId);
    if (filters.severity) params.append('severity', filters.severity);
    if (filters.status) params.append('status', filters.status);
    return request(`/findings?${params.toString()}`);
  },
  updateFindingStatus: (id, status) => request(`/findings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),

  // AI Analysis
  getLatestAiAnalysis: () => request('/ai-analysis/latest'),
  getAiAnalysisForScan: (scanId) => request(`/ai-analysis/${scanId}`),

  // Reports
  getReports: () => request('/reports'),
  generateReport: (data) => request('/reports/generate', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Operations
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'POST' }),
  getLogs: () => request('/logs'),
  getScheduler: () => request('/scheduler'),
  createScheduledScan: (data) => request('/scheduler', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getTeam: () => request('/team'),
  getSettings: () => request('/settings'),
  getAdminStats: () => request('/admin/stats'),
};
