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

export interface RouterHardware {
  board_name?: string;
  architecture?: string;
  cpu_count?: number;
  cpu_load?: number;
  uptime?: string;
  used_memory?: number;
  total_memory?: number;
  memory_percent?: number;
  free_hdd?: number;
  hdd_percent?: number;
  cpu_temp?: number;
  voltage?: number;
  version?: string;
}

export interface RouterData {
  id: number;
  router_name: string;
  ip_address: string;
  api_port?: number;
  is_online?: boolean;
  is_connected?: boolean;
  connection_type?: string;
  users_count?: number;
  hardware?: RouterHardware | null;
}

export interface PingData {
  success: boolean;
  latency_ms?: number;
  type?: string;
}

export interface RouterCardProps {
  router: RouterData;
  ping?: PingData | null;
  isPinging?: boolean;
  isSyncing?: boolean;
  onToggleConnect: (id: number) => void;
  onPingTest: (router: RouterData) => void;
  onSyncRouter: (id: number) => void;
  onOpenSessions: (routerName: string) => void;
  onRebootClick: (router: RouterData) => void;
  onEditClick: (router: RouterData) => void;
  onDeleteClick: (router: RouterData) => void;
  formatBytes: (bytes?: number) => string;
}

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
}: RouterCardProps) {
  const hw = router.hardware;
  const isOnline = !!router.is_online;
  const cpuLoad = hw ? hw.cpu_load || 0 : 0;
  const cpuColor = cpuLoad > 80 ? '#fb7185' : 'var(--mono-text-primary)';

  return (
    <div
      className="card p-3.5 h-100 hover-lift d-flex flex-column justify-content-between"
      style={{
        background: 'var(--mono-card)',
        border: `1px solid ${isOnline ? 'var(--mono-card-border)' : 'rgba(251, 113, 133, 0.3)'}`,
        borderRadius: 14,
      }}
    >
      <div>
        {/* Card Top Title & Connection Toggle */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h6 className="fw-bold mb-0" style={{ fontSize: '0.94rem', color: 'var(--mono-text-primary)' }}>
                {router.router_name}
              </h6>
              <span
                className="badge d-inline-flex align-items-center gap-1 font-mono"
                style={{
                  background: isOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 113, 133, 0.1)',
                  color: isOnline ? '#34d399' : '#fb7185',
                  border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.25)' : 'rgba(251, 113, 133, 0.25)'}`,
                  fontSize: '0.66rem',
                  padding: '2px 7px',
                  borderRadius: 6,
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: isOnline ? '#10b981' : '#fb7185',
                  }}
                />
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
              checked={!!router.is_connected}
              onChange={() => onToggleConnect(router.id)}
              style={{
                cursor: 'pointer',
                background: router.is_connected ? 'var(--mono-text-primary)' : 'var(--mono-surface-elevated)',
                borderColor: 'var(--mono-card-border)',
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
                background: 'var(--mono-surface-elevated)',
                color: 'var(--mono-text-muted)',
                border: '1px solid var(--mono-card-border)',
                fontSize: '0.68rem',
                borderRadius: 6,
                padding: '2px 7px',
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
            <div className="mb-2">
              <div className="d-flex justify-content-between align-items-center small mb-1" style={{ fontSize: '0.74rem' }}>
                <span className="text-muted d-flex align-items-center gap-1">
                  <Cpu size={12} /> CPU ({hw.cpu_count} Cores)
                </span>
                <span className="fw-bold font-mono" style={{ color: cpuColor }}>
                  {cpuLoad}%
                </span>
              </div>
              <div className="rounded-pill overflow-hidden" style={{ height: 4, background: 'var(--mono-surface-elevated)' }}>
                <div
                  style={{
                    width: `${Math.max(4, cpuLoad)}%`,
                    height: '100%',
                    background: cpuColor,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>

            {/* RAM */}
            <div className="mb-2">
              <div className="d-flex justify-content-between align-items-center small mb-1" style={{ fontSize: '0.74rem' }}>
                <span className="text-muted d-flex align-items-center gap-1">
                  <Zap size={12} /> RAM ({formatBytes(hw.used_memory)} / {formatBytes(hw.total_memory)})
                </span>
                <span className="fw-bold font-mono" style={{ color: 'var(--mono-text-primary)' }}>
                  {hw.memory_percent}%
                </span>
              </div>
              <div className="rounded-pill overflow-hidden" style={{ height: 4, background: 'var(--mono-surface-elevated)' }}>
                <div
                  style={{
                    width: `${hw.memory_percent || 0}%`,
                    height: '100%',
                    background: 'var(--mono-text-secondary)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>

            {/* HDD */}
            <div>
              <div className="d-flex justify-content-between align-items-center small mb-1" style={{ fontSize: '0.74rem' }}>
                <span className="text-muted d-flex align-items-center gap-1">
                  <HardDrive size={12} /> Storage ({formatBytes(hw.free_hdd)} free)
                </span>
                <span className="fw-bold font-mono" style={{ color: 'var(--mono-text-primary)' }}>
                  {hw.hdd_percent}%
                </span>
              </div>
              <div className="rounded-pill overflow-hidden" style={{ height: 4, background: 'var(--mono-surface-elevated)' }}>
                <div
                  style={{
                    width: `${hw.hdd_percent || 0}%`,
                    height: '100%',
                    background: 'var(--mono-text-muted)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="p-3 text-center text-muted small mb-3"
            style={{
              background: 'var(--mono-surface-elevated)',
              border: '1px solid var(--mono-card-border)',
              borderRadius: 8,
              fontSize: '0.75rem',
            }}
          >
            Telemetry currently unavailable for this device. Check IP socket or API port.
          </div>
        )}

        {/* Sensor & Version Badges */}
        <div
          className="d-flex flex-wrap align-items-center gap-1.5 mb-3 pt-2 border-top"
          style={{ borderColor: 'var(--mono-card-border)' }}
        >
          <span
            className="badge"
            style={{
              background: 'var(--mono-surface-elevated)',
              color: 'var(--mono-text-secondary)',
              border: '1px solid var(--mono-card-border)',
              fontSize: '0.68rem',
              borderRadius: 6,
              padding: '2px 7px',
            }}
          >
            <Users size={10} className="me-1 d-inline" />
            {router.users_count || 0} Subscribers
          </span>
          {hw?.cpu_temp && (
            <span
              className="badge"
              style={{
                background: 'var(--mono-surface-elevated)',
                color: 'var(--mono-text-secondary)',
                border: '1px solid var(--mono-card-border)',
                fontSize: '0.68rem',
                borderRadius: 6,
                padding: '2px 7px',
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
                background: 'var(--mono-surface-elevated)',
                color: 'var(--mono-text-secondary)',
                border: '1px solid var(--mono-card-border)',
                fontSize: '0.68rem',
                borderRadius: 6,
                padding: '2px 7px',
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
                background: 'var(--mono-surface-elevated)',
                color: 'var(--mono-text-muted)',
                border: '1px solid var(--mono-card-border)',
                fontSize: '0.68rem',
                borderRadius: 6,
                padding: '2px 7px',
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
                background: ping.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(251, 113, 133, 0.15)',
                color: ping.success ? '#34d399' : '#fb7185',
                border: `1px solid ${ping.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(251, 113, 133, 0.3)'}`,
                fontSize: '0.68rem',
                borderRadius: 6,
                padding: '2px 7px',
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
        style={{ borderColor: 'var(--mono-card-border)' }}
      >
        <div className="d-flex align-items-center gap-1">
          {/* Ping button */}
          <button
            onClick={() => onPingTest(router)}
            disabled={isPinging}
            className="btn btn-sm p-1.5 px-2.5 d-inline-flex align-items-center gap-1.5"
            style={{
              background: 'var(--mono-surface-elevated)',
              border: '1px solid var(--mono-card-border)',
              color: 'var(--mono-text-primary)',
              borderRadius: 8,
              fontSize: '0.72rem',
              fontWeight: 500,
            }}
            title="Test socket latency"
          >
            <Activity size={12} className={isPinging ? 'animate-spin' : ''} style={{ color: 'var(--mono-text-secondary)' }} />
            <span>{isPinging ? '...' : 'Ping'}</span>
          </button>

          {/* Sync button */}
          <button
            onClick={() => onSyncRouter(router.id)}
            disabled={isSyncing || !router.is_connected}
            className="btn btn-sm p-1.5 px-2.5 d-inline-flex align-items-center gap-1.5"
            style={{
              background: 'var(--mono-surface-elevated)',
              border: '1px solid var(--mono-card-border)',
              color: 'var(--mono-text-primary)',
              borderRadius: 8,
              fontSize: '0.72rem',
              fontWeight: 500,
            }}
            title="Synchronize subscribers & profiles"
          >
            <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} style={{ color: 'var(--mono-text-secondary)' }} />
            <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
          </button>

          {/* Active Sessions */}
          <button
            onClick={() => onOpenSessions(router.router_name)}
            className="btn btn-sm p-1.5 px-2.5 d-inline-flex align-items-center gap-1.5"
            style={{
              background: 'var(--mono-surface-elevated)',
              border: '1px solid var(--mono-card-border)',
              color: 'var(--mono-text-primary)',
              borderRadius: 8,
              fontSize: '0.72rem',
              fontWeight: 500,
            }}
            title="View active subscriber sessions"
          >
            <Radio size={12} style={{ color: 'var(--mono-text-secondary)' }} />
            <span>Sessions</span>
          </button>
        </div>

        <div className="d-flex align-items-center gap-1">
          {/* Reboot */}
          <button
            onClick={() => onRebootClick(router)}
            className="btn btn-sm p-1.5"
            style={{
              background: 'var(--mono-surface-elevated)',
              border: '1px solid var(--mono-card-border)',
              color: 'var(--mono-text-muted)',
              borderRadius: 8,
            }}
            title="Reboot router"
          >
            <RotateCcw size={13} />
          </button>

          {/* Edit */}
          <button
            onClick={() => onEditClick(router)}
            className="btn btn-sm p-1.5"
            style={{
              background: 'var(--mono-surface-elevated)',
              border: '1px solid var(--mono-card-border)',
              color: 'var(--mono-text-secondary)',
              borderRadius: 8,
            }}
            title="Edit credentials"
          >
            <Edit2 size={13} />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDeleteClick(router)}
            className="btn btn-sm p-1.5"
            style={{
              background: 'var(--mono-surface-elevated)',
              border: '1px solid rgba(251, 113, 133, 0.3)',
              color: '#fb7185',
              borderRadius: 8,
            }}
            title="Delete router"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
