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
  const [isIntervalOpen, setIsIntervalOpen] = useState(false);

  const intervals = [
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
          background: '#111115',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Left: Brand / Hub Identity */}
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
            style={{
              width: 42,
              height: 42,
              background: '#16161c',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Activity size={20} className="text-white" />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h4 className="fw-bold mb-0 text-white" style={{ fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
                ISP Operations Command Hub
              </h4>
              <span
                className="badge d-inline-flex align-items-center gap-1.5 py-1 px-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#e4e4e7',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
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
            <p className="mb-0 small" style={{ fontSize: '0.78rem', color: '#8e8e93' }}>
              Real-time financial telemetry, subscriber life cycle, and MikroTik NOC control
            </p>
          </div>
        </div>

        {/* Right: Quick Actions Bar matching screenshot */}
        <div className="d-flex flex-wrap align-items-center gap-2">
          {/* New Customer: Solid White Pill Button */}
          <a
            href="/billing/create-customer"
            className="btn btn-sm d-inline-flex align-items-center gap-1.5 px-3 py-1.5 text-decoration-none shadow-sm"
            style={{
              background: '#ffffff',
              color: '#09090b',
              fontWeight: 600,
              fontSize: '0.8rem',
              borderRadius: 8,
              border: 'none',
              transition: 'background 0.15s ease',
            }}
          >
            <PlusCircle size={15} style={{ color: '#09090b' }} />
            <span>New Customer</span>
          </a>

          {/* Collect Bill Button */}
          <a
            href="/billing/payment-collection"
            className="btn btn-sm d-inline-flex align-items-center gap-1.5 px-3 py-1.5 text-decoration-none"
            style={{
              background: '#16161b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#e4e4e7',
              fontSize: '0.8rem',
              fontWeight: 500,
              borderRadius: 8,
            }}
          >
            <Receipt size={14} style={{ color: '#a1a1aa' }} />
            <span>Collect Bill</span>
          </a>

          {/* MikroTik NOC Button */}
          <button
            onClick={() => setActiveTab('mikrotik')}
            className="btn btn-sm d-inline-flex align-items-center gap-1.5 px-3 py-1.5"
            style={{
              background: activeTab === 'mikrotik' ? '#1f1f26' : '#16161b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#e4e4e7',
              fontSize: '0.8rem',
              fontWeight: 500,
              borderRadius: 8,
            }}
          >
            <Server size={14} style={{ color: '#a1a1aa' }} />
            <span>MikroTik NOC</span>
          </button>

          {/* Invoices Button */}
          <a
            href="/billing/payment-invoice"
            className="btn btn-sm d-inline-flex align-items-center gap-1.5 px-3 py-1.5 text-decoration-none"
            style={{
              background: '#16161b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#e4e4e7',
              fontSize: '0.8rem',
              fontWeight: 500,
              borderRadius: 8,
            }}
          >
            <FileText size={14} style={{ color: '#a1a1aa' }} />
            <span>Invoices</span>
          </a>

          {/* Refresh Controls: Custom Minimal Dropdown Button */}
          <div className="position-relative">
            <button
              onClick={() => setIsIntervalOpen(!isIntervalOpen)}
              className="btn btn-sm d-inline-flex align-items-center gap-1.5 px-3 py-1.5"
              style={{
                background: '#16161b',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#e4e4e7',
                fontSize: '0.8rem',
                fontWeight: 500,
                borderRadius: 8,
              }}
              title="Auto-refresh setting"
            >
              <Settings size={14} style={{ color: '#a1a1aa' }} />
              <span>{currentIntervalLabel}</span>
              <ChevronDown size={12} style={{ color: '#71717a' }} />
            </button>

            <AnimatePresence>
              {isIntervalOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="position-absolute end-0 mt-1 py-1 rounded-2 shadow-2xl z-50"
                  style={{
                    background: '#16161c',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
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
                        background: refreshInterval === item.value ? 'rgba(255,255,255,0.08)' : 'transparent',
                        color: refreshInterval === item.value ? '#ffffff' : '#a1a1aa',
                        fontSize: '0.75rem',
                      }}
                    >
                      <span>{item.label}</span>
                      {refreshInterval === item.value && (
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#ffffff' }}></span>
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
              background: '#16161b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#e4e4e7',
              borderRadius: 8,
            }}
            title={`Refresh data (Last updated ${lastUpdated.toLocaleTimeString()})`}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB SWITCHER SEGMENTED BAR (MATCHING SCREENSHOT)
      ───────────────────────────────────────────────────────────── */}
      <div
        className="d-flex align-items-center gap-1.5 p-1 rounded-3 mb-4"
        style={{
          background: '#111115',
          border: '1px solid rgba(255, 255, 255, 0.08)',
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
                color: isActive ? '#ffffff' : '#8e8e93',
                background: isActive ? '#1c1c24' : 'transparent',
                border: isActive ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid transparent',
                borderRadius: 7,
                fontSize: '0.8rem',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={14} style={{ color: isActive ? '#ffffff' : '#71717a' }} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className="badge font-mono"
                  style={{
                    background: isActive ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.06)',
                    color: isActive ? '#ffffff' : '#a1a1aa',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
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
}
