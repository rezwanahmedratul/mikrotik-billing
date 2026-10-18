import React from 'react';
import {
  Server,
  Activity,
  Cpu,
  Zap,
  HardDrive,
  Clock,
  Thermometer,
  Users,
  RefreshCw,
  Radio,
  RotateCcw,
  Edit2,
  Trash2,
} from 'lucide-react';

export default function RouterCard({
  router,
  ping,
  isPinging,
  isSyncing,
  onToggleConnect,
  onPingTest,
  onSyncRouter,
  onOpenSessions,
  onRebootClick,
  onEditClick,
  onDeleteClick,
  formatBytes,
}) {
  const hw = router.hardware;
  const isOnline = router.is_online;
  const cpuLoad = hw ? hw.cpu_load : 0;
  const cpuColor = cpuLoad > 80 ? '#f43f5e' : cpuLoad > 50 ? '#f59e0b' : '#10b981';

  return (
    <div
      className="card p-3.5 h-100 hover-lift d-flex flex-column justify-content-between"
      style={{
        background: '#121216',
        border: `1px solid ${isOnline ? 'rgba(255, 255, 255, 0.08)' : 'rgba(244, 63, 94, 0.2)'}`,
      }}
    >
      <div>
        {/* Card Top Title & Connection Toggle */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h6 className="fw-bold mb-0 text-white" style={{ fontSize: '0.96rem' }}>
                {router.router_name}
              </h6>
              <span
                className="badge"
                style={{
                  background: isOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                  color: isOnline ? '#34d399' : '#fb7185',
                  border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                  fontSize: '0.65rem',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: isOnline ? '#10b981' : '#f43f5e',
                    boxShadow: `0 0 6px ${isOnline ? '#10b981' : '#f43f5e'}`,
                    marginRight: 4,
                  }}
                ></span>
                {isOnline ? router.connection_type || 'API' : 'Offline'}
              </span>
            </div>
            <div className="small font-mono text-muted mt-0.5" style={{ fontSize: '0.74rem' }}>
              {router.ip_address} • Port {router.api_port || 8728}
            </div>
          </div>

          {/* Connected Switch Toggle */}
          <div className="form-check form-switch mb-0" title="Toggle router active status">
            <input
              className="form-check-input"
              type="checkbox"
              checked={router.is_connected}
              onChange={() => onToggleConnect(router.id)}
              style={{
                cursor: 'pointer',
                background: router.is_connected ? '#10b981' : '#3f3f46',
                borderColor: 'transparent',
              }}
            />
          </div>
        </div>

        {/* Device Model & Uptime */}
        <div className="d-flex align-items-center justify-content-between mb-3 text-muted small" style={{ fontSize: '0.74rem' }}>
          <span>
            {hw?.board_name || 'RouterOS'} ({hw?.architecture || 'ROS'})
          </span>
          {hw?.uptime && (
            <span
              className="badge font-mono"
              style={{
                background: '#18181c',
                color: '#a1a1aa',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.68rem',
              }}
            >
              <Clock size={10} className="me-1 d-inline" />
              {hw.uptime}
            </span>
          )}
        </div>

        {/* Hardware Meters (CPU, RAM, Storage) */}
        {hw ? (
          <div className="space-y-2.5 mb-3">
            {/* CPU */}
            <div>
              <div className="d-flex justify-content-between align-items-center small mb-1" style={{ fontSize: '0.74rem' }}>
                <span className="text-muted d-flex align-items-center gap-1">
                  <Cpu size={12} /> CPU ({hw.cpu_count} Cores)
                </span>
                <span className="fw-bold font-mono" style={{ color: cpuColor }}>
                  {cpuLoad}%
                </span>
              </div>
              <div className="rounded-pill overflow-hidden" style={{ height: 5, background: '#27272a' }}>
                <div
                  style={{
                    width: `${Math.max(4, cpuLoad)}%`,
                    height: '100%',
                    background: cpuColor,
                    transition: 'width 0.3s ease',
                  }}
                ></div>
              </div>
            </div>

            {/* RAM */}
            <div>
              <div className="d-flex justify-content-between align-items-center small mb-1" style={{ fontSize: '0.74rem' }}>
                <span className="text-muted d-flex align-items-center gap-1">
                  <Zap size={12} /> RAM ({formatBytes(hw.used_memory)} / {formatBytes(hw.total_memory)})
                </span>
                <span className="fw-bold font-mono text-white">{hw.memory_percent}%</span>
              </div>
              <div className="rounded-pill overflow-hidden" style={{ height: 5, background: '#27272a' }}>
                <div
                  style={{
                    width: `${hw.memory_percent}%`,
                    height: '100%',
                    background: '#06b6d4',
                    transition: 'width 0.3s ease',
                  }}
                ></div>
              </div>
            </div>

            {/* HDD */}
            <div>
              <div className="d-flex justify-content-between align-items-center small mb-1" style={{ fontSize: '0.74rem' }}>
                <span className="text-muted d-flex align-items-center gap-1">
                  <HardDrive size={12} /> Storage ({formatBytes(hw.free_hdd)} free)
                </span>
                <span className="fw-bold font-mono text-white">{hw.hdd_percent}%</span>
              </div>
              <div className="rounded-pill overflow-hidden" style={{ height: 5, background: '#27272a' }}>
                <div
                  style={{
                    width: `${hw.hdd_percent}%`,
                    height: '100%',
                    background: '#8b5cf6',
                    transition: 'width 0.3s ease',
                  }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2 text-center text-muted small mb-3" style={{ background: '#16161c', fontSize: '0.75rem' }}>
            Telemetry currently unavailable for this device. Check IP socket or API port.
          </div>
        )}

        {/* Sensor & Version Badges */}
        <div
          className="d-flex flex-wrap align-items-center gap-1.5 mb-3 pt-2 border-top"
          style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}
        >
          <span
            className="badge"
            style={{
              background: '#18181c',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              fontSize: '0.68rem',
            }}
          >
            <Users size={10} className="me-1 d-inline" />
            {router.users_count} Subscribers
          </span>
          {hw?.cpu_temp && (
            <span
              className="badge"
              style={{
                background: '#18181c',
                color: '#fb923c',
                border: '1px solid rgba(251, 146, 60, 0.25)',
                fontSize: '0.68rem',
              }}
            >
              <Thermometer size={10} className="me-1 d-inline" />
              {hw.cpu_temp}°C
            </span>
          )}
          {hw?.voltage && (
            <span
              className="badge"
              style={{
                background: '#18181c',
                color: '#fbbf24',
                border: '1px solid rgba(251, 191, 36, 0.25)',
                fontSize: '0.68rem',
              }}
            >
              <Zap size={10} className="me-1 d-inline" />
              {hw.voltage}V
            </span>
          )}
          {hw?.version && (
            <span
              className="badge font-mono"
              style={{
                background: '#18181c',
                color: '#a1a1aa',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.68rem',
              }}
            >
              v{hw.version}
            </span>
          )}

          {/* Real-time Ping Latency Badge */}
          {ping && (
            <span
              className="badge font-mono"
              style={{
                background: ping.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: ping.success ? '#34d399' : '#fb7185',
                border: `1px solid ${ping.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                fontSize: '0.68rem',
              }}
            >
              {ping.success ? `${ping.latency_ms}ms (${ping.type})` : 'Timeout'}
            </span>
          )}
        </div>
      </div>

      {/* Operational Action Buttons Bar */}
      <div
        className="d-flex flex-wrap align-items-center justify-content-between gap-1 pt-2 border-top"
        style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
      >
        <div className="d-flex align-items-center gap-1">
          {/* Ping button */}
          <button
            onClick={() => onPingTest(router)}
            disabled={isPinging}
            className="btn btn-sm btn-secondary p-1.5 px-2 d-inline-flex align-items-center gap-1"
            style={{ fontSize: '0.72rem' }}
            title="Test socket latency"
          >
            <Activity size={12} className={isPinging ? 'animate-spin' : ''} style={{ color: '#38bdf8' }} />
            <span>{isPinging ? '...' : 'Ping'}</span>
          </button>

          {/* Sync button */}
          <button
            onClick={() => onSyncRouter(router.id)}
            disabled={isSyncing || !router.is_connected}
            className="btn btn-sm btn-secondary p-1.5 px-2 d-inline-flex align-items-center gap-1"
            style={{ fontSize: '0.72rem' }}
            title="Synchronize subscribers & profiles"
          >
            <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} style={{ color: '#10b981' }} />
            <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
          </button>

          {/* Active Sessions */}
          <button
            onClick={() => onOpenSessions(router.router_name)}
            className="btn btn-sm btn-secondary p-1.5 px-2 d-inline-flex align-items-center gap-1"
            style={{ fontSize: '0.72rem' }}
            title="View active subscriber sessions"
          >
            <Radio size={12} style={{ color: '#c084fc' }} />
            <span>Sessions</span>
          </button>
        </div>

        <div className="d-flex align-items-center gap-1">
          {/* Reboot */}
          <button
            onClick={() => onRebootClick(router)}
            className="btn btn-sm btn-secondary p-1.5"
            title="Reboot router"
          >
            <RotateCcw size={12} style={{ color: '#fb923c' }} />
          </button>

          {/* Edit */}
          <button
            onClick={() => onEditClick(router)}
            className="btn btn-sm btn-secondary p-1.5"
            title="Edit credentials"
          >
            <Edit2 size={12} />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDeleteClick(router)}
            className="btn btn-sm btn-secondary p-1.5 text-danger"
            title="Delete router"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
