import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server,
  Cpu,
  RefreshCw,
  PlusCircle,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Users,
  Search,
  Shield,
  Radio,
} from 'lucide-react';
import AddRouterModal from './AddRouterModal';
import ActiveSessionsModal from './ActiveSessionsModal';
import LiveTrafficWidget from './LiveTrafficWidget';
import RouterCard from './components/RouterCard';
import SubsystemsGrid from './components/SubsystemsGrid';
import MetricCard from './components/MetricCard';
import { useTheme } from './useTheme';

export default function MikrotikControlDashboard({ initialData = {}, isStandalone = false }) {
  const { theme, isDark, palette } = useTheme();
  const [data, setData] = useState({
    summary: {
      total_routers: 0,
      online_routers: 0,
      offline_routers: 0,
      total_subscribers: 0,
      avg_cpu_load: 0,
    },
    routers: [],
    interfaces: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRouter, setEditingRouter] = useState(null);
  const [activeSessionsRouter, setActiveSessionsRouter] = useState(null);
  const [pingResults, setPingResults] = useState({}); // router_id -> { latency_ms, status, type }
  const [testingPingId, setTestingPingId] = useState(null);
  const [syncingRouterId, setSyncingRouterId] = useState(null);
  const [rebootConfirmRouter, setRebootConfirmRouter] = useState(null);
  const [isRebooting, setIsRebooting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch complete overview on mount
  useEffect(() => {
    fetchOverview();
  }, []);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchOverview = async (quiet = false) => {
    if (!quiet) setIsRefreshing(true);
    try {
      const res = await fetch('/billing/api/mikrotik/overview', {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load MikroTik overview:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Toggle Router Active/Connected
  const handleToggleConnect = async (routerId) => {
    try {
      const res = await fetch('/billing/api/mikrotik/toggle-connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ router_id: routerId }),
      });
      const resData = await res.json();
      if (resData.success) {
        showNotification(resData.message, 'success');
        fetchOverview(true);
      } else {
        showNotification(resData.message, 'error');
      }
    } catch (err) {
      showNotification('Failed to toggle connection: ' + err.message, 'error');
    }
  };

  // Ping Socket Test
  const handlePingTest = async (router) => {
    setTestingPingId(router.id);
    try {
      const res = await fetch('/billing/api/mikrotik/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ router_id: router.id }),
      });
      const resData = await res.json();
      setPingResults((prev) => ({
        ...prev,
        [router.id]: resData,
      }));
    } catch (err) {
      setPingResults((prev) => ({
        ...prev,
        [router.id]: { success: false, message: 'Ping failed' },
      }));
    } finally {
      setTestingPingId(null);
    }
  };

  // Sync Router Secrets
  const handleSyncRouter = async (routerId) => {
    setSyncingRouterId(routerId);
    try {
      const res = await fetch('/billing/api/mikrotik/sync-router', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ router_id: routerId }),
      });
      const resData = await res.json();
      if (resData.success) {
        showNotification(resData.message, 'success');
        fetchOverview(true);
      } else {
        showNotification(resData.message, 'error');
      }
    } catch (err) {
      showNotification('Sync failed: ' + err.message, 'error');
    } finally {
      setSyncingRouterId(null);
    }
  };

  // Sync All Routers
  const handleSyncAll = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/billing/api/mikrotik/sync-router', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({}),
      });
      const resData = await res.json();
      if (resData.success) {
        showNotification(resData.message, 'success');
        fetchOverview(true);
      } else {
        showNotification(resData.message, 'error');
      }
    } catch (err) {
      showNotification('Fleet sync failed: ' + err.message, 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Soft Reboot Router
  const handleReboot = async () => {
    if (!rebootConfirmRouter) return;
    setIsRebooting(true);
    try {
      const res = await fetch('/billing/api/mikrotik/reboot-router', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ router_id: rebootConfirmRouter.id }),
      });
      const resData = await res.json();
      if (resData.success) {
        showNotification(resData.message, 'success');
        setRebootConfirmRouter(null);
        fetchOverview(true);
      } else {
        showNotification(resData.message, 'error');
      }
    } catch (err) {
      showNotification('Reboot command error: ' + err.message, 'error');
    } finally {
      setIsRebooting(false);
    }
  };

  // Delete Router
  const handleDeleteRouter = async (router) => {
    if (!confirm(`Are you sure you want to delete router '${router.router_name}'?`)) return;
    try {
      const res = await fetch(`/billing/api/mikrotik/router/${router.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      const resData = await res.json();
      if (resData.success) {
        showNotification(resData.message, 'success');
        fetchOverview(true);
      } else {
        showNotification(resData.message, 'error');
      }
    } catch (err) {
      showNotification('Delete error: ' + err.message, 'error');
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`;
  };

  // Filter routers by search
  const filteredRouters = useMemo(() => {
    if (!searchQuery.trim()) return data.routers || [];
    const q = searchQuery.toLowerCase();
    return (data.routers || []).filter((r) => {
      const name = r.router_name?.toLowerCase() || '';
      const ip = r.ip_address?.toLowerCase() || '';
      const model = r.hardware?.board_name?.toLowerCase() || '';
      return name.includes(q) || ip.includes(q) || model.includes(q);
    });
  }, [data.routers, searchQuery]);

  const summary = data.summary || {};

  return (
    <div className="mikrotik-control-dashboard" style={{ animation: 'fadeIn 0.25s ease-out' }}>
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="position-fixed top-4 end-4 p-3 rounded-3 shadow-2xl d-flex align-items-center gap-2.5 z-50"
            style={{
              top: 20,
              right: 20,
              zIndex: 9999,
              background: notification.type === 'success' ? (isDark ? '#101014' : '#ffffff') : (isDark ? '#140c0e' : '#fff1f2'),
              border: `1px solid ${notification.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`,
              color: palette.textPrimary,
              boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.8)' : '0 10px 25px rgba(0,0,0,0.1)',
              fontSize: '0.82rem',
            }}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 size={16} style={{ color: '#10b981' }} />
            ) : (
              <AlertTriangle size={16} style={{ color: '#f43f5e' }} />
            )}
            <span>{notification.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          TOP FLEET COMMAND BAR (STANDALONE HEADER)
      {/* ─────────────────────────────────────────────────────────────
          TOP FLEET COMMAND BAR (STANDALONE HEADER)
      ───────────────────────────────────────────────────────────── */}
      {isStandalone && (
        <div
          className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4 p-3.5 rounded-3"
          style={{
            background: palette.cardBg,
            border: `1px solid ${palette.cardBorder}`,
            borderRadius: 12,
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
              style={{
                width: 42,
                height: 42,
                background: palette.surfaceElevated,
                border: `1px solid ${palette.cardBorder}`,
              }}
            >
              <Server size={20} style={{ color: palette.textPrimary }} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h4 className="fw-bold mb-0" style={{ fontSize: '1.2rem', letterSpacing: '-0.02em', color: palette.textPrimary }}>
                  MikroTik NOC Control Hub
                </h4>
                <span
                  className="badge d-inline-flex align-items-center gap-1.5 py-1 px-2"
                  style={{
                    background: palette.badgeBg,
                    color: palette.badgeText,
                    border: `1px solid ${palette.badgeBorder}`,
                    fontSize: '0.68rem',
                    fontWeight: 500,
                    borderRadius: 6,
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: '#10b981',
                      boxShadow: '0 0 6px #10b981',
                    }}
                  ></span>
                  Live Telemetry
                </span>
              </div>
              <p className="mb-0 small" style={{ fontSize: '0.78rem', color: palette.textMuted }}>
                Centralized RouterOS management, interface telemetry, and subscriber tunnels
              </p>
            </div>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2">
            <button
              onClick={() => {
                setEditingRouter(null);
                setIsAddModalOpen(true);
              }}
              className="btn btn-sm d-inline-flex align-items-center gap-1.5 px-3 py-1.5 shadow-sm"
              style={{
                background: palette.buttonPrimaryBg,
                color: palette.buttonPrimaryText,
                fontWeight: 600,
                fontSize: '0.8rem',
                borderRadius: 8,
                border: 'none',
              }}
            >
              <PlusCircle size={15} style={{ color: palette.buttonPrimaryText }} />
              <span>Add Router</span>
            </button>

            <button
              onClick={handleSyncAll}
              disabled={isRefreshing}
              className="btn btn-sm d-inline-flex align-items-center gap-1.5 px-3 py-1.5"
              style={{
                background: palette.buttonSecondaryBg,
                border: `1px solid ${palette.buttonSecondaryBorder}`,
                color: palette.buttonSecondaryText,
                fontSize: '0.8rem',
                fontWeight: 500,
                borderRadius: 8,
              }}
              title="Synchronize all connected routers"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} style={{ color: palette.textSecondary }} />
              <span>Sync Fleet</span>
            </button>

            <button
              onClick={() => fetchOverview(false)}
              disabled={isRefreshing}
              className="btn btn-sm d-inline-flex align-items-center justify-content-center p-2"
              style={{
                background: palette.buttonSecondaryBg,
                border: `1px solid ${palette.buttonSecondaryBorder}`,
                color: palette.buttonSecondaryText,
                borderRadius: 8,
              }}
              title="Refresh hardware telemetry"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          FLEET TELEMETRY STAT CARDS ROW (MODULAR METRIC CARDS)
      ───────────────────────────────────────────────────────────── */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <MetricCard
            title="Total Fleet"
            value={`${summary.total_routers || 0} Devices`}
            subtitle={`${summary.online_routers || 0} Online • ${summary.offline_routers || 0} Offline`}
            icon={Server}
            badgeText={summary.online_routers > 0 ? 'Operational' : 'All Offline'}
            badgeDot={summary.online_routers > 0}
            badgeColor={summary.online_routers > 0 ? '#34d399' : '#fb7185'}
          />
        </div>

        <div className="col-6 col-md-3">
          <MetricCard
            title="Active Secrets / Users"
            value={(summary.total_subscribers || 0).toLocaleString()}
            subtitle="Synchronized across router fleet"
            icon={Users}
            badgeText="Active Tunnels"
            badgeDot={true}
            badgeColor="#34d399"
          />
        </div>

        <div className="col-6 col-md-3">
          <MetricCard
            title="Fleet Avg CPU Load"
            value={`${summary.avg_cpu_load || 0}%`}
            subtitle="Combined core processing load"
            icon={Cpu}
            progressPercent={summary.avg_cpu_load}
            progressColor={summary.avg_cpu_load > 70 ? '#f43f5e' : '#10b981'}
            badgeText={summary.avg_cpu_load > 70 ? 'High' : 'Normal'}
            badgeColor={summary.avg_cpu_load > 70 ? '#fb7185' : '#a1a1aa'}
          />
        </div>

        <div className="col-6 col-md-3">
          <MetricCard
            title="Daemon Socket Pools"
            value="API + SSH"
            subtitle="Persistent socket multiplexing active"
            icon={Shield}
            badgeText="Pool Active"
            badgeDot={true}
            badgeColor="#34d399"
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODULAR LIVE INTERFACE BANDWIDTH GRAPH
      ───────────────────────────────────────────────────────────── */}
      {data.routers.length > 0 && (
        <LiveTrafficWidget
          routers={data.routers}
          interfaces={data.interfaces || ['ether1', 'ether2', 'ether3', 'bridge']}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODULAR ROUTER FLEET CARDS SECTION
      ───────────────────────────────────────────────────────────── */}
      <div className="mb-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
          <div className="d-flex align-items-center gap-2">
            <Radio size={17} style={{ color: palette.textSecondary }} />
            <h5 className="fw-bold mb-0" style={{ fontSize: '0.96rem', letterSpacing: '-0.01em', color: palette.textPrimary }}>
              Router Infrastructure Fleet
            </h5>
            <span
              className="badge font-mono"
              style={{ background: palette.badgeBg, color: palette.badgeText, border: `1px solid ${palette.badgeBorder}`, fontSize: '0.68rem', borderRadius: 5 }}
            >
              {filteredRouters.length} Devices
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <div className="position-relative" style={{ minWidth: 240 }}>
              <Search size={14} className="position-absolute text-muted" style={{ left: 10, top: 9 }} />
              <input
                type="text"
                className="form-control form-control-sm ps-4"
                placeholder="Search router by name, IP, model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '0.78rem', background: palette.surfaceElevated, borderColor: palette.cardBorder, color: palette.textPrimary, borderRadius: 8 }}
              />
            </div>
            {!isStandalone && (
              <button
                onClick={() => {
                  setEditingRouter(null);
                  setIsAddModalOpen(true);
                }}
                className="btn btn-sm d-inline-flex align-items-center gap-1.5 px-3 py-1.5 shadow-sm"
                style={{
                  background: palette.buttonPrimaryBg,
                  color: palette.buttonPrimaryText,
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  borderRadius: 8,
                  border: 'none',
                }}
              >
                <PlusCircle size={14} style={{ color: palette.buttonPrimaryText }} />
                <span>Add Router</span>
              </button>
            )}
          </div>
        </div>

        {filteredRouters.length === 0 ? (
          <div
            className="p-5 text-center rounded-3"
            style={{ background: palette.cardBg, border: `1px solid ${palette.cardBorder}`, borderRadius: 12 }}
          >
            <Server size={32} className="text-muted mb-2 opacity-50" />
            <h6 className="fw-bold" style={{ color: palette.textPrimary }}>No MikroTik Routers Found</h6>
            <p className="text-muted small mb-3">
              {searchQuery ? 'No routers matched your search query.' : 'Register your first MikroTik router to start monitoring.'}
            </p>
            <button
              onClick={() => {
                setEditingRouter(null);
                setIsAddModalOpen(true);
              }}
              className="btn btn-sm px-3 py-1.5 fw-semibold"
              style={{
                background: palette.buttonPrimaryBg,
                color: palette.buttonPrimaryText,
                borderRadius: 8,
                border: 'none',
              }}
            >
              Add MikroTik Router
            </button>
          </div>
        ) : (
          <div className="row g-3">
            {filteredRouters.map((router) => (
              <div key={router.id} className="col-12 col-md-6 col-xl-4">
                <RouterCard
                  router={router}
                  ping={pingResults[router.id]}
                  isPinging={testingPingId === router.id}
                  isSyncing={syncingRouterId === router.id}
                  onToggleConnect={handleToggleConnect}
                  onPingTest={handlePingTest}
                  onSyncRouter={handleSyncRouter}
                  onOpenSessions={(rName) => setActiveSessionsRouter(rName)}
                  onRebootClick={(r) => setRebootConfirmRouter(r)}
                  onEditClick={(r) => {
                    setEditingRouter(r);
                    setIsAddModalOpen(true);
                  }}
                  onDeleteClick={handleDeleteRouter}
                  formatBytes={formatBytes}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODULAR SUBSYSTEMS SHORTCUTS GRID
      ───────────────────────────────────────────────────────────── */}
      <SubsystemsGrid />

      {/* ─────────────────────────────────────────────────────────────
          MODALS
      ───────────────────────────────────────────────────────────── */}
      <AddRouterModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingRouter(null);
        }}
        editingRouter={editingRouter}
        onRouterSaved={() => {
          showNotification('Router successfully configured!', 'success');
          fetchOverview(true);
        }}
      />

      <ActiveSessionsModal
        isOpen={!!activeSessionsRouter}
        onClose={() => setActiveSessionsRouter(null)}
        routerName={activeSessionsRouter}
      />

      {/* Reboot Confirm Modal */}
      <AnimatePresence>
        {rebootConfirmRouter && (
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
              zIndex: 1060,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 rounded-4 shadow-2xl"
              style={{
                maxWidth: 420,
                width: '100%',
                background: palette.cardBg,
                border: '1px solid rgba(244, 63, 94, 0.3)',
              }}
            >
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{ width: 40, height: 40, background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}
                >
                  <RotateCcw size={20} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0" style={{ color: palette.textPrimary }}>Reboot MikroTik Router?</h6>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.75rem' }}>
                    Device: <span className="fw-bold" style={{ color: palette.textPrimary }}>{rebootConfirmRouter.router_name}</span>
                  </p>
                </div>
              </div>

              <p className="small text-muted mb-4" style={{ fontSize: '0.8rem' }}>
                This will trigger a soft reboot on the RouterOS hardware. All active PPPoE and Hotspot sessions on this router will briefly disconnect.
              </p>

              <div className="d-flex align-items-center justify-content-end gap-2">
                <button
                  type="button"
                  onClick={() => setRebootConfirmRouter(null)}
                  className="btn btn-sm btn-secondary"
                  disabled={isRebooting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReboot}
                  disabled={isRebooting}
                  className="btn btn-sm btn-danger d-inline-flex align-items-center gap-1.5"
                >
                  {isRebooting ? <RefreshCw size={13} className="animate-spin" /> : <RotateCcw size={13} />}
                  <span>{isRebooting ? 'Rebooting...' : 'Yes, Reboot Device'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
