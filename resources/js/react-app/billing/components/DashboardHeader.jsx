import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  PlusCircle,
  Receipt,
  Server,
  FileText,
  RefreshCw,
  BarChart3,
  Users,
} from 'lucide-react';

export default function DashboardHeader({
  activeTab,
  setActiveTab,
  isRefreshing,
  onRefresh,
  refreshInterval,
  setRefreshInterval,
  lastUpdated,
  routerCount = 0,
}) {
  return (
    <>
      {/* Top Deck */}
      <div
        className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4 p-3.5 rounded-3"
        style={{
          background: 'rgba(18, 18, 22, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{ width: 44, height: 44, background: '#1c1c24', border: '1px solid rgba(255, 255, 255, 0.12)' }}
          >
            <Activity size={22} style={{ color: '#10b981' }} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h4 className="fw-bold mb-0 text-white" style={{ fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
                ISP Operations Command Hub
              </h4>
              <span
                className="badge"
                style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <span
                  className="glow-dot-emerald me-1.5"
                  style={{
                    display: 'inline-block',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 8px #10b981',
                  }}
                ></span>
                Live Telemetry
              </span>
            </div>
            <p className="mb-0 text-muted small" style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>
              Real-time financial telemetry, subscriber lifecycle, and MikroTik NOC control
            </p>
          </div>
        </div>

        {/* Quick Action Launcher Buttons */}
        <div className="d-flex flex-wrap align-items-center gap-2">
          <a
            href="/billing/create-customer"
            className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1.5 shadow-sm"
          >
            <PlusCircle size={15} />
            <span>New Customer</span>
          </a>
          <a
            href="/billing/payment-collection"
            className="btn btn-sm btn-secondary d-inline-flex align-items-center gap-1.5"
          >
            <Receipt size={15} style={{ color: '#34d399' }} />
            <span>Collect Bill</span>
          </a>
          <button
            onClick={() => setActiveTab('mikrotik')}
            className="btn btn-sm btn-secondary d-inline-flex align-items-center gap-1.5"
          >
            <Server size={15} style={{ color: '#38bdf8' }} />
            <span>MikroTik NOC</span>
          </button>
          <a
            href="/billing/payment-invoice"
            className="btn btn-sm btn-secondary d-inline-flex align-items-center gap-1.5"
          >
            <FileText size={15} style={{ color: '#c084fc' }} />
            <span>Invoices</span>
          </a>

          {/* Refresh controls */}
          <div className="d-flex align-items-center gap-1 ms-lg-2 ps-lg-2 border-start border-secondary border-opacity-25">
            <select
              className="form-select form-select-sm"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              style={{
                width: 'auto',
                fontSize: '0.75rem',
                padding: '0.3rem 0.6rem',
                background: '#141418',
                borderColor: 'rgba(255,255,255,0.12)',
                color: '#a1a1aa',
              }}
              title="Auto-refresh interval"
            >
              <option value={0}>Manual</option>
              <option value={15}>Every 15s</option>
              <option value={30}>Every 30s</option>
              <option value={60}>Every 60s</option>
            </select>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="btn btn-sm btn-secondary d-inline-flex align-items-center justify-content-center p-2"
              title={`Last updated ${lastUpdated.toLocaleTimeString()}`}
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Mode Switcher Navigation Pills with Framer Motion Animated Layout Indicator */}
      <div
        className="d-flex align-items-center gap-1 p-1.5 rounded-3 mb-4"
        style={{
          background: '#101014',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          width: 'fit-content',
        }}
      >
        {[
          { id: 'overview', label: 'Overview & Financials', icon: BarChart3 },
          { id: 'mikrotik', label: 'MikroTik Control NOC', icon: Server, badge: routerCount ? `${routerCount} Routers` : null },
          { id: 'subscribers', label: 'Subscribers & Resellers', icon: Users },
          { id: 'collections', label: 'Live Payment Stream', icon: Receipt },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="mono-tab-pill position-relative"
              style={{
                color: isActive ? '#ffffff' : '#a1a1aa',
                background: 'transparent',
                border: 'none',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeDashboardTab"
                  className="position-absolute top-0 start-0 end-0 bottom-0 rounded-2"
                  style={{
                    background: '#1c1c24',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    zIndex: 0,
                  }}
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span className="position-relative d-inline-flex align-items-center gap-2" style={{ zIndex: 1 }}>
                <Icon size={15} style={{ color: isActive ? '#fafafa' : '#71717a' }} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className="badge"
                    style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                      fontSize: '0.65rem',
                      padding: '2px 5px',
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
