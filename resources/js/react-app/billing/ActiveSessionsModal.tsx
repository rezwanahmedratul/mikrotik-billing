import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  RefreshCw,
  Clock,
  Copy,
  Check,
  Radio,
  Loader2,
} from 'lucide-react';
import { useTheme } from './useTheme';

export interface SessionItem {
  session_id?: string | number;
  name?: string;
  address?: string;
  caller_id?: string;
  uptime?: string;
  service?: string;
}

export interface ActiveSessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  routerName: string;
}

export default function ActiveSessionsModal({ isOpen, onClose, routerName }: ActiveSessionsModalProps) {
  const { isDark, palette } = useTheme();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && routerName) {
      fetchSessions();
    }
  }, [isOpen, routerName]);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/billing/api/mikrotik/active-sessions?router_name=${encodeURIComponent(routerName)}`, {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.error('Failed to load active sessions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1800);
  };

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter((s) => {
      const name = s.name?.toLowerCase() || '';
      const addr = s.address?.toLowerCase() || '';
      const caller = s.caller_id?.toLowerCase() || '';
      return name.includes(q) || addr.includes(q) || caller.includes(q);
    });
  }, [sessions, searchQuery]);

  if (!isOpen) return null;

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
          background: 'rgba(5, 5, 7, 0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1050,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden w-100 shadow-2xl d-flex flex-column"
          style={{
            maxWidth: 780,
            maxHeight: '85vh',
            background: palette.cardBg,
            border: `1px solid ${palette.cardBorder}`,
            borderRadius: 16,
          }}
        >
          {/* Header */}
          <div
            className="p-3.5 px-4 d-flex align-items-center justify-content-between border-bottom flex-shrink-0"
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
                <Radio size={18} style={{ color: 'var(--mono-text-primary)' }} />
              </div>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h6 className="fw-bold mb-0" style={{ fontSize: '0.95rem', color: palette.textPrimary }}>
                    Active PPPoE Sessions
                  </h6>
                  <span
                    className="badge d-inline-flex align-items-center gap-1 font-mono"
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      fontSize: '0.68rem',
                      borderRadius: 6,
                      padding: '2px 7px',
                    }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981' }} />
                    {sessions.length} Live
                  </span>
                </div>
                <p className="small mb-0" style={{ fontSize: '0.74rem', color: palette.textMuted }}>
                  Target Router: <span className="fw-medium font-mono" style={{ color: palette.textPrimary }}>{routerName}</span>
                </p>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                onClick={fetchSessions}
                disabled={isLoading}
                className="btn btn-sm p-1.5"
                style={{
                  background: palette.buttonSecondaryBg,
                  border: `1px solid ${palette.buttonSecondaryBorder}`,
                  color: palette.buttonSecondaryText,
                  borderRadius: 8,
                }}
                title="Refresh sessions"
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={onClose}
                className="btn btn-sm btn-link p-1 text-muted"
                style={{ textDecoration: 'none' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="p-3 px-4 border-bottom flex-shrink-0" style={{ borderColor: palette.cardBorder }}>
            <div className="position-relative">
              <Search
                size={14}
                className="position-absolute"
                style={{ left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--mono-text-muted)' }}
              />
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search by username, IP, MAC address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: palette.surfaceElevated,
                  borderColor: palette.cardBorder,
                  color: palette.textPrimary,
                  fontSize: '0.8rem',
                  paddingLeft: 34,
                  borderRadius: 8,
                }}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-grow-1 overflow-auto p-0">
            {isLoading ? (
              <div className="p-5 text-center text-muted">
                <Loader2 size={24} className="animate-spin mb-2 d-inline-block" style={{ color: palette.textPrimary }} />
                <p className="small mb-0">Querying active sessions from {routerName}...</p>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="p-5 text-center text-muted">
                <p className="small mb-0">No active PPPoE sessions found matching your query.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table mb-0 align-middle" style={{ fontSize: '0.8rem', '--bs-table-bg': 'transparent', color: 'var(--mono-text-primary)' } as React.CSSProperties}>
                  <thead style={{ background: palette.surfaceElevated, position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr style={{ borderBottom: `1px solid ${palette.cardBorder}` }}>
                      <th className="ps-4" style={{ color: 'var(--mono-text-muted)', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 600 }}>SUBSCRIBER USER</th>
                      <th style={{ color: 'var(--mono-text-muted)', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 600 }}>IP ADDRESS</th>
                      <th style={{ color: 'var(--mono-text-muted)', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 600 }}>CALLER ID / MAC</th>
                      <th style={{ color: 'var(--mono-text-muted)', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 600 }}>UPTIME</th>
                      <th className="pe-4 text-end" style={{ color: 'var(--mono-text-muted)', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 600 }}>SERVICE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSessions.map((s, idx) => (
                      <tr key={s.session_id || idx} style={{ borderBottom: `1px solid ${palette.hairline}` }}>
                        <td className="ps-4">
                          <span className="fw-semibold" style={{ color: palette.textPrimary }}>{s.name}</span>
                        </td>
                        <td>
                          <span
                            className="font-mono d-inline-flex align-items-center gap-1.5"
                            onClick={() => s.address && copyToClipboard(s.address)}
                            style={{ cursor: 'pointer', color: 'var(--mono-text-primary)' }}
                            title="Click to copy IP"
                          >
                            <span>{s.address}</span>
                            {copiedText === s.address ? (
                              <Check size={11} style={{ color: '#34d399' }} />
                            ) : (
                              <Copy size={11} className="opacity-50" />
                            )}
                          </span>
                        </td>
                        <td className="font-mono text-muted" style={{ fontSize: '0.74rem' }}>
                          {s.caller_id}
                        </td>
                        <td>
                          <span
                            className="badge font-mono"
                            style={{
                              background: palette.badgeBg,
                              color: palette.badgeText,
                              border: `1px solid ${palette.badgeBorder}`,
                              fontSize: '0.68rem',
                              borderRadius: 6,
                              padding: '2px 7px',
                            }}
                          >
                            <Clock size={10} className="me-1 d-inline" />
                            {s.uptime}
                          </span>
                        </td>
                        <td className="pe-4 text-end">
                          <span
                            className="badge font-mono text-uppercase"
                            style={{
                              background: palette.badgeBg,
                              color: 'var(--mono-text-secondary)',
                              border: `1px solid ${palette.badgeBorder}`,
                              fontSize: '0.65rem',
                              borderRadius: 6,
                              padding: '2px 7px',
                            }}
                          >
                            {s.service}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="p-3 px-4 d-flex align-items-center justify-content-between border-top flex-shrink-0"
            style={{ borderColor: palette.cardBorder, background: palette.surfaceElevated }}
          >
            <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
              Showing {filteredSessions.length} of {sessions.length} sessions
            </span>
            <button
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
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
