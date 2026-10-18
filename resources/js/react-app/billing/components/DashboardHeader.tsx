import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  PlusCircle,
  Receipt,
  Server,
  FileText,
  RefreshCw,
  BarChart3,
  Users,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from '../useTheme';

export interface DashboardHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  refreshInterval: number;
  setRefreshInterval: (interval: number) => void;
  lastUpdated: Date;
  routerCount?: number;
}

interface RefreshIntervalOption {
  value: number;
  label: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeTab,
  setActiveTab,
  isRefreshing,
  onRefresh,
  refreshInterval,
  setRefreshInterval,
  lastUpdated,
  routerCount = 0,
}) => {
  const { isDark, palette } = useTheme();
  const [isIntervalOpen, setIsIntervalOpen] = useState<boolean>(false);

  const intervals: RefreshIntervalOption[] = [
    { value: 0, label: 'Manual' },
    { value: 15, label: 'Every 15s' },
    { value: 30, label: 'Every 30s' },
    { value: 60, label: 'Every 60s' },
  ];

  const currentIntervalLabel = intervals.find((i) => i.value === refreshInterval)?.label || 'Manual';

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          TOP HEADER COMMAND DECK
      ───────────────────────────────────────────────────────────── */}
      <div
        className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4 p-3.5 rounded-3"
        style={{
          background: 'var(--mono-card)',
          border: '1px solid var(--mono-card-border)',
        }}
      >
        {/* Left: Brand / Hub Identity */}
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
            style={{
              width: 42,
              height: 42,
              background: 'var(--mono-surface-elevated)',
              border: '1px solid var(--mono-card-border)',
            }}
          >
            <Activity size={20} style={{ color: 'var(--mono-text-primary)' }} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h4 className="fw-bold mb-0" style={{ fontSize: '1.2rem', letterSpacing: '-0.02em', color: 'var(--mono-text-primary)' }}>
                ISP Operations Command Hub
              </h4>
              <span
                className="badge d-inline-flex align-items-center gap-1.5 py-1 px-2"
                style={{
                  background: 'var(--mono-surface-elevated)',
                  color: 'var(--mono-text-secondary)',
                  border: '1px solid var(--mono-card-border)',
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
                />
                Live Telemetry
              </span>
            </div>
            <p className="mb-0 small" style={{ fontSize: '0.78rem', color: 'var(--mono-text-muted)' }}>
              Real-time financial telemetry, subscriber life cycle, and MikroTik NOC control
            </p>
          </div>
        </div>

        {/* Right: Quick Actions Bar */}
        <div className="d-flex flex-wrap align-items-center gap-2">
          {/* New Customer: Solid Pill Button */}
          <a
            href="/billing/create-customer"
            className="btn btn-sm d-inline-flex align-items-center gap-1.5 px-3 py-1.5 text-decoration-none shadow-sm"
            style={{
              background: palette.buttonPrimaryBg,
              color: palette.buttonPrimaryText,
              fontWeight: 600,
              fontSize: '0.8rem',
              borderRadius: 8,
              border: 'none',
              transition: 'background 0.15s ease',
            }}
          >
            <PlusCircle size={15} style={{ color: palette.buttonPrimaryText }} />
            <span>New Customer</span>
          </a>

          {/* Collect Bill Button */}
          <a
            href="/billing/payment-collection"
            className="btn btn-sm d-inline-flex align-items-center gap-1.5 px-3 py-1.5 text-decoration-none"
            style={{
              background: palette.buttonSecondaryBg,
              border: `1px solid ${palette.buttonSecondaryBorder}`,
              color: palette.buttonSecondaryText,
              fontSize: '0.8rem',
              fontWeight: 500,
              borderRadius: 8,
            }}
          >
            <Receipt size={14} style={{ color: 'var(--mono-text-secondary)' }} />
            <span>Collect Bill</span>
          </a>

          {/* MikroTik NOC Button */}
          <button
            onClick={() => setActiveTab('mikrotik')}
            className="btn btn-sm d-inline-flex align-items-center gap-1.5 px-3 py-1.5"
            style={{
              background: activeTab === 'mikrotik' ? (isDark ? '#ffffff' : '#09090b') : palette.buttonSecondaryBg,
              border: `1px solid ${activeTab === 'mikrotik' ? (isDark ? '#ffffff' : '#09090b') : palette.buttonSecondaryBorder}`,
              color: activeTab === 'mikrotik' ? (isDark ? '#09090b' : '#ffffff') : palette.buttonSecondaryText,
              fontSize: '0.8rem',
              fontWeight: activeTab === 'mikrotik' ? 700 : 500,
              borderRadius: 8,
              boxShadow: activeTab === 'mikrotik' ? (isDark ? '0 2px 8px rgba(255, 255, 255, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.25)') : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Server size={14} style={{ color: activeTab === 'mikrotik' ? (isDark ? '#09090b' : '#ffffff') : 'var(--mono-text-secondary)' }} />
            <span>MikroTik NOC</span>
          </button>

          {/* Invoices Button */}
          <a
            href="/billing/payment-invoice"
            className="btn btn-sm d-inline-flex align-items-center gap-1.5 px-3 py-1.5 text-decoration-none"
            style={{
              background: palette.buttonSecondaryBg,
              border: `1px solid ${palette.buttonSecondaryBorder}`,
              color: palette.buttonSecondaryText,
              fontSize: '0.8rem',
              fontWeight: 500,
              borderRadius: 8,
            }}
          >
            <FileText size={14} style={{ color: 'var(--mono-text-secondary)' }} />
            <span>Invoices</span>
          </a>

          {/* Refresh Controls: Custom Minimal Dropdown Button */}
          <div className="position-relative">
            <button
              onClick={() => setIsIntervalOpen(!isIntervalOpen)}
              className="btn btn-sm d-inline-flex align-items-center gap-1.5 px-3 py-1.5"
              style={{
                background: palette.buttonSecondaryBg,
                border: `1px solid ${palette.buttonSecondaryBorder}`,
                color: palette.buttonSecondaryText,
                fontSize: '0.8rem',
                fontWeight: 500,
                borderRadius: 8,
              }}
              title="Auto-refresh setting"
            >
              <Settings size={14} style={{ color: 'var(--mono-text-secondary)' }} />
              <span>{currentIntervalLabel}</span>
              <ChevronDown size={12} style={{ color: 'var(--mono-text-muted)' }} />
            </button>

            <AnimatePresence>
              {isIntervalOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="position-absolute end-0 mt-1 py-1 rounded-2 shadow-2xl z-50"
                  style={{
                    background: palette.cardBg,
                    border: `1px solid ${palette.cardBorderHover}`,
                    minWidth: 130,
                    zIndex: 100,
                  }}
                >
                  {intervals.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => {
                        setRefreshInterval(item.value);
                        setIsIntervalOpen(false);
                      }}
                      className="dropdown-item px-3 py-1.5 small text-start d-flex align-items-center justify-content-between w-100 border-0"
                      style={{
                        background: refreshInterval === item.value ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)') : 'transparent',
                        color: refreshInterval === item.value ? 'var(--mono-text-primary)' : 'var(--mono-text-secondary)',
                        fontSize: '0.75rem',
                      }}
                    >
                      <span>{item.label}</span>
                      {refreshInterval === item.value && (
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--mono-text-primary)' }} />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Instant Manual Refresh Spinner */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="btn btn-sm d-inline-flex align-items-center justify-content-center p-2"
            style={{
              background: palette.buttonSecondaryBg,
              border: `1px solid ${palette.buttonSecondaryBorder}`,
              color: palette.buttonSecondaryText,
              borderRadius: 8,
            }}
            title={`Refresh data (Last updated ${lastUpdated.toLocaleTimeString()})`}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB SWITCHER SEGMENTED BAR
      ───────────────────────────────────────────────────────────── */}
      <div
        className="d-flex align-items-center gap-1.5 p-1 rounded-3 mb-4"
        style={{
          background: 'var(--mono-card)',
          border: '1px solid var(--mono-card-border)',
          width: 'fit-content',
        }}
      >
        {[
          { id: 'overview', label: 'Overview & Financials', icon: BarChart3 },
          {
            id: 'mikrotik',
            label: 'MikroTik Control NOC',
            icon: Server,
            badge: routerCount ? `${routerCount} Routers` : '0 Routers',
          },
          { id: 'subscribers', label: 'Subscribers & Resellers', icon: Users },
          { id: 'collections', label: 'Live Payment Stream', icon: Receipt },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="position-relative d-inline-flex align-items-center gap-2 px-3 py-1.5"
              style={{
                color: isActive ? (isDark ? '#09090b' : '#ffffff') : 'var(--mono-text-secondary)',
                background: isActive ? (isDark ? '#ffffff' : '#09090b') : 'transparent',
                border: isActive ? (isDark ? '1px solid #ffffff' : '1px solid #09090b') : '1px solid transparent',
                borderRadius: 7,
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? (isDark ? '0 2px 8px rgba(255, 255, 255, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.25)') : 'none',
              }}
            >
              <Icon size={14} style={{ color: isActive ? (isDark ? '#09090b' : '#ffffff') : 'var(--mono-text-muted)' }} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className="badge font-mono"
                  style={{
                    background: isActive ? (isDark ? 'rgba(9, 9, 11, 0.12)' : 'rgba(255, 255, 255, 0.2)') : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'),
                    color: isActive ? (isDark ? '#09090b' : '#ffffff') : 'var(--mono-text-secondary)',
                    border: '1px solid transparent',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default DashboardHeader;
