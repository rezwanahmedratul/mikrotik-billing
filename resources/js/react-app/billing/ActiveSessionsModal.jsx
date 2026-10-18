import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Users,
  Search,
  RefreshCw,
  Clock,
  Wifi,
  Copy,
  Check,
  Radio,
  Server,
  Loader2,
} from 'lucide-react';

export default function ActiveSessionsModal({ isOpen, onClose, routerName }) {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState(null);

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

  const copyToClipboard = (text) => {
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
        className="modal-backdrop-custom fixed-inset d-flex align-items-center justify-content-center p-3"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 5, 7, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 1050,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-4 overflow-hidden w-100 shadow-2xl d-flex flex-column"
          style={{
            maxWidth: 780,
            maxHeight: '85vh',
            background: '#101014',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          {/* Header */}
          <div
            className="p-3.5 px-4 d-flex align-items-center justify-content-between border-bottom flex-shrink-0"
            style={{ borderColor: 'rgba(255, 255, 255, 0.08)', background: '#141419' }}
          >
            <div className="d-flex align-items-center gap-2.5">
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ width: 34, height: 34, background: '#1c1c24', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              >
                <Radio size={18} style={{ color: '#10b981' }} />
              </div>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h6 className="fw-bold mb-0 text-white" style={{ fontSize: '0.95rem' }}>
                    Active PPPoE Sessions
                  </h6>
                  <span
                    className="badge"
                    style={{
                      background: 'rgba(16, 185, 129, 0.12)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      fontSize: '0.7rem',
                    }}
                  >
                    {sessions.length} Live
                  </span>
                </div>
                <p className="text-muted small mb-0" style={{ fontSize: '0.74rem' }}>
                  Target Router: <span className="text-white fw-medium">{routerName}</span>
                </p>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                onClick={fetchSessions}
                disabled={isLoading}
                className="btn btn-sm btn-secondary p-1.5"
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
          <div className="p-3 px-4 border-bottom flex-shrink-0" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
            <div className="position-relative">
              <Search size={14} className="position-absolute text-muted" style={{ left: 12, top: 10 }} />
              <input
                type="text"
                className="form-control form-control-sm ps-4"
                placeholder="Search by username, IP, MAC address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: '#16161c',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#fafafa',
                  fontSize: '0.8rem',
                }}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-grow-1 overflow-auto p-0">
            {isLoading ? (
              <div className="p-5 text-center text-muted">
                <Loader2 size={24} className="animate-spin mb-2 d-inline-block text-white" />
                <p className="small mb-0">Querying active sessions from {routerName}...</p>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="p-5 text-center text-muted">
                <p className="small mb-0">No active PPPoE sessions found matching your query.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table mb-0 align-middle" style={{ fontSize: '0.8rem' }}>
                  <thead style={{ background: '#121217', position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr>
                      <th className="ps-4">Subscriber User</th>
                      <th>IP Address</th>
                      <th>Caller ID / MAC</th>
                      <th>Uptime</th>
                      <th className="pe-4 text-end">Service</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSessions.map((s, idx) => (
                      <tr key={s.session_id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                        <td className="ps-4">
                          <span className="fw-semibold text-white">{s.name}</span>
                        </td>
                        <td>
                          <span
                            className="font-mono text-muted d-inline-flex align-items-center gap-1"
                            onClick={() => copyToClipboard(s.address)}
                            style={{ cursor: 'pointer' }}
                            title="Click to copy IP"
                          >
                            <span className="text-info">{s.address}</span>
                            {copiedText === s.address ? (
                              <Check size={11} style={{ color: '#10b981' }} />
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
                              background: '#16161c',
                              color: '#a1a1aa',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              fontSize: '0.68rem',
                            }}
                          >
                            <Clock size={10} className="me-1 d-inline" />
                            {s.uptime}
                          </span>
                        </td>
                        <td className="pe-4 text-end">
                          <span
                            className="badge text-uppercase"
                            style={{
                              background: 'rgba(6, 182, 212, 0.1)',
                              color: '#38bdf8',
                              border: '1px solid rgba(6, 182, 212, 0.25)',
                              fontSize: '0.65rem',
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
            style={{ borderColor: 'rgba(255, 255, 255, 0.08)', background: '#141419' }}
          >
            <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
              Showing {filteredSessions.length} of {sessions.length} sessions
            </span>
            <button onClick={onClose} className="btn btn-sm btn-secondary" style={{ fontSize: '0.8rem' }}>
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
