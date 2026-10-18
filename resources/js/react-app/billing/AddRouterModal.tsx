import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Server,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Activity,
} from 'lucide-react';
import { useTheme } from './useTheme';

export interface RouterFormData {
  id?: number | null;
  router_name: string;
  ip_address: string;
  username: string;
  password?: string;
  ssh_port?: number;
  api_port?: number;
}

export interface AddRouterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRouterSaved: (router: any) => void;
  editingRouter?: any | null;
}

export default function AddRouterModal({
  isOpen,
  onClose,
  onRouterSaved,
  editingRouter = null,
}: AddRouterModalProps) {
  const { isDark, palette } = useTheme();
  const [formData, setFormData] = useState<RouterFormData>({
    id: editingRouter?.id || null,
    router_name: editingRouter?.router_name || '',
    ip_address: editingRouter?.ip_address || '',
    username: editingRouter?.username || 'admin',
    password: '',
    ssh_port: editingRouter?.ssh_port || 22,
    api_port: editingRouter?.api_port || 8728,
  });

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setTestResult(null);
    setError(null);
  };

  const handleTestConnection = async () => {
    if (!formData.ip_address || !formData.username) {
      setError('Please provide an IP address and username to test.');
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    setError(null);

    try {
      const res = await fetch('/billing/api/mikrotik/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test failed',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.router_name || !formData.ip_address || !formData.username) {
      setError('Router Name, IP Address, and Username are required.');
      return;
    }

    if (!editingRouter && !formData.password) {
      setError('Password is required for new routers.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch('/billing/api/mikrotik/router', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        onRouterSaved(data.router);
        onClose();
      } else {
        setError(data.message || 'Failed to save router.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="modal-backdrop-custom d-flex align-items-center justify-content-center p-3"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 5, 7, 0.82)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1050,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden w-100 shadow-2xl"
          style={{
            maxWidth: 580,
            background: palette.cardBg,
            border: `1px solid ${palette.cardBorder}`,
            borderRadius: 16,
          }}
        >
          {/* Header */}
          <div
            className="p-3.5 px-4 d-flex align-items-center justify-content-between border-bottom"
            style={{ borderColor: palette.cardBorder, background: palette.surfaceElevated }}
          >
            <div className="d-flex align-items-center gap-2.5">
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: 36,
                  height: 36,
                  background: palette.cardBg,
                  border: `1px solid ${palette.cardBorder}`,
                  borderRadius: 10,
                }}
              >
                <Server size={18} style={{ color: palette.textPrimary }} />
              </div>
              <div>
                <h6 className="fw-bold mb-0" style={{ fontSize: '0.95rem', letterSpacing: '-0.01em', color: palette.textPrimary }}>
                  {editingRouter ? 'Edit MikroTik Router' : 'Register New MikroTik Router'}
                </h6>
                <p className="small mb-0" style={{ fontSize: '0.74rem', color: palette.textMuted }}>
                  RouterOS API & SSH telemetry credentials
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn btn-sm btn-link p-1 text-muted"
              style={{ textDecoration: 'none' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSave} className="p-4">
            {error && (
              <div
                className="p-2.5 px-3 mb-3 d-flex align-items-center gap-2"
                style={{
                  background: 'rgba(251, 113, 133, 0.12)',
                  border: '1px solid rgba(251, 113, 133, 0.3)',
                  color: '#fb7185',
                  fontSize: '0.8rem',
                  borderRadius: 8,
                }}
              >
                <AlertTriangle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label text-muted small fw-medium mb-1" style={{ fontSize: '0.75rem' }}>
                  Router Identifier Name *
                </label>
                <input
                  type="text"
                  name="router_name"
                  className="form-control form-control-sm"
                  placeholder="e.g. Core-CCR2004-POP1"
                  value={formData.router_name}
                  onChange={handleChange}
                  required
                  style={{
                    background: palette.surfaceElevated,
                    borderColor: palette.cardBorder,
                    color: palette.textPrimary,
                    fontSize: '0.82rem',
                    borderRadius: 8,
                  }}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label text-muted small fw-medium mb-1" style={{ fontSize: '0.75rem' }}>
                  IP Address / Hostname *
                </label>
                <input
                  type="text"
                  name="ip_address"
                  className="form-control form-control-sm font-mono"
                  placeholder="192.168.88.1"
                  value={formData.ip_address}
                  onChange={handleChange}
                  required
                  style={{
                    background: palette.surfaceElevated,
                    borderColor: palette.cardBorder,
                    color: palette.textPrimary,
                    fontSize: '0.82rem',
                    borderRadius: 8,
                  }}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label text-muted small fw-medium mb-1" style={{ fontSize: '0.75rem' }}>
                  API Username *
                </label>
                <input
                  type="text"
                  name="username"
                  className="form-control form-control-sm"
                  placeholder="admin"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  style={{
                    background: palette.surfaceElevated,
                    borderColor: palette.cardBorder,
                    color: palette.textPrimary,
                    fontSize: '0.82rem',
                    borderRadius: 8,
                  }}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label text-muted small fw-medium mb-1" style={{ fontSize: '0.75rem' }}>
                  Password {editingRouter && '(Leave blank to retain)'} *
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control form-control-sm font-mono"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editingRouter}
                  style={{
                    background: palette.surfaceElevated,
                    borderColor: palette.cardBorder,
                    color: palette.textPrimary,
                    fontSize: '0.82rem',
                    borderRadius: 8,
                  }}
                />
              </div>

              <div className="col-6">
                <label className="form-label text-muted small fw-medium mb-1" style={{ fontSize: '0.75rem' }}>
                  API Port (Default: 8728)
                </label>
                <input
                  type="number"
                  name="api_port"
                  className="form-control form-control-sm font-mono"
                  placeholder="8728"
                  value={formData.api_port}
                  onChange={handleChange}
                  style={{
                    background: palette.surfaceElevated,
                    borderColor: palette.cardBorder,
                    color: palette.textPrimary,
                    fontSize: '0.82rem',
                    borderRadius: 8,
                  }}
                />
              </div>

              <div className="col-6">
                <label className="form-label text-muted small fw-medium mb-1" style={{ fontSize: '0.75rem' }}>
                  SSH Port (Default: 22)
                </label>
                <input
                  type="number"
                  name="ssh_port"
                  className="form-control form-control-sm font-mono"
                  placeholder="22"
                  value={formData.ssh_port}
                  onChange={handleChange}
                  style={{
                    background: palette.surfaceElevated,
                    borderColor: palette.cardBorder,
                    color: palette.textPrimary,
                    fontSize: '0.82rem',
                    borderRadius: 8,
                  }}
                />
              </div>
            </div>

            {/* Connection Test Output Card */}
            {testResult && (
              <div
                className="p-3 mb-3 d-flex align-items-center justify-content-between"
                style={{
                  background: testResult.success ? 'rgba(16, 185, 129, 0.08)' : 'rgba(251, 113, 133, 0.08)',
                  border: `1px solid ${testResult.success ? 'rgba(16, 185, 129, 0.25)' : 'rgba(251, 113, 133, 0.25)'}`,
                  borderRadius: 10,
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  {testResult.success ? (
                    <CheckCircle2 size={16} style={{ color: '#34d399' }} />
                  ) : (
                    <AlertTriangle size={16} style={{ color: '#fb7185' }} />
                  )}
                  <span className="small fw-medium" style={{ fontSize: '0.8rem', color: palette.textPrimary }}>
                    {testResult.message}
                  </span>
                </div>

                {testResult.latency_ms !== undefined && (
                  <span
                    className="badge font-mono"
                    style={{
                      background: palette.badgeBg,
                      color: palette.badgeText,
                      border: `1px solid ${palette.badgeBorder}`,
                      borderRadius: 6,
                    }}
                  >
                    {testResult.latency_ms} ms
                  </span>
                )}
              </div>
            )}

            {/* Actions Bar */}
            <div
              className="d-flex align-items-center justify-content-between pt-3 border-top"
              style={{ borderColor: palette.cardBorder }}
            >
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="btn btn-sm d-inline-flex align-items-center gap-1.5 px-3 py-1.5"
                style={{
                  fontSize: '0.8rem',
                  background: palette.buttonSecondaryBg,
                  border: `1px solid ${palette.buttonSecondaryBorder}`,
                  color: palette.buttonSecondaryText,
                  borderRadius: 8,
                  fontWeight: 500,
                }}
              >
                {isTesting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Testing Socket...</span>
                  </>
                ) : (
                  <>
                    <Activity size={13} style={{ color: 'var(--mono-text-secondary)' }} />
                    <span>Ping & Test</span>
                  </>
                )}
              </button>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-sm px-3 py-1.5"
                  style={{
                    fontSize: '0.8rem',
                    background: palette.buttonSecondaryBg,
                    border: `1px solid ${palette.buttonSecondaryBorder}`,
                    color: palette.buttonSecondaryText,
                    borderRadius: 8,
                    fontWeight: 500,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-sm d-inline-flex align-items-center gap-1.5 px-3 py-1.5"
                  style={{
                    fontSize: '0.8rem',
                    background: palette.buttonPrimaryBg,
                    color: palette.buttonPrimaryText,
                    borderRadius: 8,
                    fontWeight: 600,
                    border: 'none',
                  }}
                >
                  {isSaving && <Loader2 size={13} className="animate-spin" />}
                  <span>{editingRouter ? 'Save Changes' : 'Connect Router'}</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
