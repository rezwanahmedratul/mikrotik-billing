import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Users,
  Wifi,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Server,
  Cpu,
  HardDrive,
  Clock,
  Zap,
  Thermometer,
  ShieldAlert,
  Search,
  RefreshCw,
  PlusCircle,
  Receipt,
  FileText,
  BarChart3,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function BillingDashboard({ initialData }) {
  const [data, setData] = useState(initialData || window.__BILLING_DASHBOARD_DATA__ || {});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(0); // 0 = off, 30, 60
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [chartView, setChartView] = useState('comparison'); // 'comparison', 'difference', 'cumulative'
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [collectionsSearch, setCollectionsSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Auto-refresh timer
  useEffect(() => {
    if (!refreshInterval) return;
    const interval = setInterval(() => {
      fetchLatestStats();
    }, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const fetchLatestStats = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/billing/api/dashboard-stats', {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Failed to refresh stats:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatNumber = (val) => {
    return Number(val || 0).toLocaleString('en-US', {
      maximumFractionDigits: 0,
    });
  };

  const formatCurrency = (val) => {
    return '৳' + Number(val || 0).toLocaleString('en-US', {
      maximumFractionDigits: 0,
    });
  };

  const customersData = data.customersData || {};
  const billInfo = data.billInformationData || {};
  const reseller = data.resellerData || {};
  const systemOverview = data.systemOverview || {};
  const monthlyResults = data.results || {};
  const recentCollections = data.recentCollections || [];

  const totalRevenue = (Number(billInfo.paid_amount) || 0) + (Number(billInfo.hotspot_total) || 0);

  // Month labels
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Chart data calculations
  const chartData = useMemo(() => {
    let cumPrev = 0;
    let cumCurr = 0;

    return monthNames.map((name, idx) => {
      const monthNum = idx + 1;
      const m = monthlyResults[monthNum] || {
        cashflow_previous_year: 0,
        income_current_year: 0,
        revenue_difference: 0,
      };

      const prev = Number(m.cashflow_previous_year) || 0;
      const curr = Number(m.income_current_year) || 0;
      const diff = Number(m.revenue_difference) || 0;

      cumPrev += prev;
      cumCurr += curr;

      return {
        month: name,
        monthNum,
        prev,
        curr,
        diff,
        cumPrev,
        cumCurr,
      };
    });
  }, [monthlyResults]);

  const maxChartValue = useMemo(() => {
    if (chartView === 'cumulative') {
      const last = chartData[chartData.length - 1];
      return Math.max(last?.cumPrev || 1, last?.cumCurr || 1) * 1.15;
    }
    const maxVal = Math.max(
      ...chartData.map((d) => Math.max(d.prev, d.curr, Math.abs(d.diff))),
      1000
    );
    return maxVal * 1.15;
  }, [chartData, chartView]);

  // Customer status breakdown data for Donut Chart
  const statusItems = useMemo(() => {
    const total = Number(customersData.total) || 1;
    const items = [
      { label: 'Active', count: Number(customersData.active) || 0, color: '#10b981', border: 'rgba(16, 185, 129, 0.4)' },
      { label: 'Pending', count: Number(customersData.pending) || 0, color: '#f59e0b', border: 'rgba(245, 158, 11, 0.4)' },
      { label: 'Free', count: Number(customersData.free) || 0, color: '#06b6d4', border: 'rgba(6, 182, 212, 0.4)' },
      { label: 'Disabled', count: Number(customersData.temporary_disable) || 0, color: '#fb923c', border: 'rgba(251, 146, 60, 0.4)' },
      { label: 'Inactive', count: Number(customersData.inactive) || 0, color: '#f43f5e', border: 'rgba(244, 63, 94, 0.4)' },
    ];
    return items.map((item) => ({
      ...item,
      percentage: total > 0 ? ((item.count / total) * 100).toFixed(1) : 0,
    }));
  }, [customersData]);

  // Filter collections
  const filteredCollections = useMemo(() => {
    if (!collectionsSearch.trim()) return recentCollections;
    const q = collectionsSearch.toLowerCase();
    return recentCollections.filter((c) => {
      const name = c.customer?.full_name?.toLowerCase() || '';
      const uid = c.customer_bill_unique_id?.toLowerCase() || '';
      const pkg = c.customer?.package_name?.toLowerCase() || '';
      const method = c.payment_method?.toLowerCase() || '';
      return name.includes(q) || uid.includes(q) || pkg.includes(q) || method.includes(q);
    });
  }, [recentCollections, collectionsSearch]);

  const activePercent = customersData.total > 0
    ? Math.round((Number(customersData.active) / Number(customersData.total)) * 100)
    : 0;

  return (
    <div className="billing-react-dashboard" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      
      {/* ─────────────────────────────────────────────────────────────
          TOP CONTROL & QUICK ACTION BAR
      ───────────────────────────────────────────────────────────── */}
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4 p-3 rounded-3"
           style={{ background: 'rgba(18, 18, 22, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(12px)' }}>
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center justify-content-center rounded-3"
               style={{ width: 44, height: 44, background: '#1c1c24', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <Activity size={22} style={{ color: '#10b981' }} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h4 className="fw-bold mb-0 text-white" style={{ fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
                Billing Operations Hub
              </h4>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <span className="glow-dot-emerald me-1.5" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
                Live
              </span>
            </div>
            <p className="mb-0 text-muted small" style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>
              Real-time telemetry, cashflow metrics, and subscriber management
            </p>
          </div>
        </div>

        {/* Quick Action Launcher Buttons */}
        <div className="d-flex flex-wrap align-items-center gap-2">
          <a href="/billing/create-customer" className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1.5 shadow-sm">
            <PlusCircle size={15} />
            <span>New Customer</span>
          </a>
          <a href="/billing/payment-collection" className="btn btn-sm btn-secondary d-inline-flex align-items-center gap-1.5">
            <Receipt size={15} style={{ color: '#34d399' }} />
            <span>Collect Bill</span>
          </a>
          <a href="/billing/mikrotik" className="btn btn-sm btn-secondary d-inline-flex align-items-center gap-1.5">
            <Server size={15} style={{ color: '#38bdf8' }} />
            <span>MikroTik Sync</span>
          </a>
          <a href="/billing/payment-invoice" className="btn btn-sm btn-secondary d-inline-flex align-items-center gap-1.5">
            <FileText size={15} style={{ color: '#c084fc' }} />
            <span>Invoices</span>
          </a>

          {/* Refresh controls */}
          <div className="d-flex align-items-center gap-1 ms-lg-2 ps-lg-2 border-start border-secondary border-opacity-25">
            <select
              className="form-select form-select-sm"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              style={{ width: 'auto', fontSize: '0.75rem', padding: '0.3rem 0.6rem', background: '#141418', borderColor: 'rgba(255,255,255,0.12)', color: '#a1a1aa' }}
              title="Auto-refresh interval"
            >
              <option value={0}>Manual</option>
              <option value={30}>Every 30s</option>
              <option value={60}>Every 60s</option>
            </select>
            <button
              onClick={fetchLatestStats}
              disabled={isRefreshing}
              className="btn btn-sm btn-secondary d-inline-flex align-items-center justify-content-center p-2"
              title={`Last updated ${lastUpdated.toLocaleTimeString()}`}
            >
              <RefreshCw size={14} className={isRefreshing ? 'spin-icon' : ''} style={{ color: isRefreshing ? '#38bdf8' : '#a1a1aa' }} />
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PRIMARY METRIC KPI CARDS
      ───────────────────────────────────────────────────────────── */}
      <div className="row g-3 mb-4">
        {/* Card 1: Active Users */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 p-3 position-relative overflow-hidden"
               style={{ background: '#121216', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14 }}>
            <div className="d-flex align-items-start justify-content-between mb-2">
              <div>
                <span className="text-uppercase fw-semibold" style={{ fontSize: '0.68rem', color: '#71717a', letterSpacing: '0.08em' }}>
                  Active PPPoE Users
                </span>
                <div className="d-flex align-items-baseline gap-2 mt-1">
                  <h2 className="fw-bold mb-0 text-white" style={{ fontSize: '1.75rem', letterSpacing: '-0.03em' }}>
                    {formatNumber(customersData.active)}
                  </h2>
                  <span style={{ fontSize: '0.82rem', color: '#71717a' }}>
                    / {formatNumber(customersData.total)}
                  </span>
                </div>
              </div>
              <div className="rounded-3 d-flex align-items-center justify-content-center"
                   style={{ width: 42, height: 42, background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <Users size={20} style={{ color: '#10b981' }} />
              </div>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-100 mt-2 mb-2 rounded-pill overflow-hidden" style={{ height: 4, background: '#27272a' }}>
              <div style={{ width: `${activePercent}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)' }}></div>
            </div>

            <div className="d-flex justify-content-between align-items-center small pt-1 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.05)', fontSize: '0.74rem' }}>
              <span style={{ color: '#34d399' }}>
                <Sparkles size={12} className="me-1 d-inline" />
                +{customersData.recent || 0} this month
              </span>
              <span style={{ color: '#71717a' }}>
                {activePercent}% active rate
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Today PPPoE Collection */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 p-3 position-relative overflow-hidden"
               style={{ background: '#121216', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14 }}>
            <div className="d-flex align-items-start justify-content-between mb-2">
              <div>
                <span className="text-uppercase fw-semibold" style={{ fontSize: '0.68rem', color: '#71717a', letterSpacing: '0.08em' }}>
                  Today's PPPoE Sales
                </span>
                <div className="d-flex align-items-baseline gap-1 mt-1">
                  <h2 className="fw-bold mb-0 text-white" style={{ fontSize: '1.75rem', letterSpacing: '-0.03em' }}>
                    {formatCurrency(billInfo.today_paid_amount)}
                  </h2>
                </div>
              </div>
              <div className="rounded-3 d-flex align-items-center justify-content-center"
                   style={{ width: 42, height: 42, background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                <CreditCard size={20} style={{ color: '#06b6d4' }} />
              </div>
            </div>

            <div className="w-100 mt-2 mb-2 rounded-pill overflow-hidden" style={{ height: 4, background: '#27272a' }}>
              <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, #06b6d4, #38bdf8)' }}></div>
            </div>

            <div className="d-flex justify-content-between align-items-center small pt-1 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.05)', fontSize: '0.74rem' }}>
              <span style={{ color: '#38bdf8' }}>
                Mo: {formatCurrency(billInfo.paid_amount)}
              </span>
              <span style={{ color: '#71717a' }}>
                Direct Collection
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Today Hotspot Sales */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 p-3 position-relative overflow-hidden"
               style={{ background: '#121216', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14 }}>
            <div className="d-flex align-items-start justify-content-between mb-2">
              <div>
                <span className="text-uppercase fw-semibold" style={{ fontSize: '0.68rem', color: '#71717a', letterSpacing: '0.08em' }}>
                  Today's Hotspot Sales
                </span>
                <div className="d-flex align-items-baseline gap-1 mt-1">
                  <h2 className="fw-bold mb-0 text-white" style={{ fontSize: '1.75rem', letterSpacing: '-0.03em' }}>
                    {formatCurrency(billInfo.hotspot_today)}
                  </h2>
                </div>
              </div>
              <div className="rounded-3 d-flex align-items-center justify-content-center"
                   style={{ width: 42, height: 42, background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <Wifi size={20} style={{ color: '#f59e0b' }} />
              </div>
            </div>

            <div className="w-100 mt-2 mb-2 rounded-pill overflow-hidden" style={{ height: 4, background: '#27272a' }}>
              <div style={{ width: '45%', height: '100%', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}></div>
            </div>

            <div className="d-flex justify-content-between align-items-center small pt-1 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.05)', fontSize: '0.74rem' }}>
              <span style={{ color: '#fbbf24' }}>
                Mo: {formatCurrency(billInfo.hotspot_total)}
              </span>
              <span style={{ color: '#71717a' }}>
                Voucher Revenue
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Global Total Revenue */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 p-3 position-relative overflow-hidden"
               style={{ background: '#121216', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14 }}>
            <div className="d-flex align-items-start justify-content-between mb-2">
              <div>
                <span className="text-uppercase fw-semibold" style={{ fontSize: '0.68rem', color: '#71717a', letterSpacing: '0.08em' }}>
                  Total Global Revenue
                </span>
                <div className="d-flex align-items-baseline gap-1 mt-1">
                  <h2 className="fw-bold mb-0 text-white" style={{ fontSize: '1.75rem', letterSpacing: '-0.03em' }}>
                    {formatCurrency(totalRevenue)}
                  </h2>
                </div>
              </div>
              <div className="rounded-3 d-flex align-items-center justify-content-center"
                   style={{ width: 42, height: 42, background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                <DollarSign size={20} style={{ color: '#8b5cf6' }} />
              </div>
            </div>

            <div className="w-100 mt-2 mb-2 rounded-pill overflow-hidden" style={{ height: 4, background: '#27272a' }}>
              <div style={{ width: '82%', height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #c084fc)' }}></div>
            </div>

            <div className="d-flex justify-content-between align-items-center small pt-1 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.05)', fontSize: '0.74rem' }}>
              <span style={{ color: '#f59e0b' }}>
                <AlertTriangle size={12} className="me-1 d-inline" />
                Due: {formatCurrency(billInfo.due_amount)}
              </span>
              <span style={{ color: '#71717a' }}>
                Pending Arrears
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RESELLER SUMMARY ROW
      ───────────────────────────────────────────────────────────── */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-3">
          <div className="card p-3 h-100" style={{ background: '#121216', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
            <span className="text-uppercase fw-semibold" style={{ fontSize: '0.68rem', color: '#71717a', letterSpacing: '0.08em' }}>
              Reseller Accounts
            </span>
            <div className="d-flex align-items-baseline gap-2 mt-1">
              <h3 className="fw-bold mb-0 text-white">{reseller.total_resellers || 0}</h3>
              <span className="small text-muted">operators</span>
            </div>
            <div className="mt-2 text-muted small" style={{ fontSize: '0.72rem' }}>
              <span style={{ color: '#34d399' }}>{reseller.active_resellers || 0} active</span>
              <span className="mx-1">/</span>
              <span style={{ color: '#f43f5e' }}>{reseller.suspended_resellers || 0} suspended</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="card p-3 h-100" style={{ background: '#121216', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
            <span className="text-uppercase fw-semibold" style={{ fontSize: '0.68rem', color: '#71717a', letterSpacing: '0.08em' }}>
              Reseller Subscribers
            </span>
            <div className="d-flex align-items-baseline gap-2 mt-1">
              <h3 className="fw-bold mb-0 text-white">{reseller.total_customers || 0}</h3>
              <span className="small text-muted">clients</span>
            </div>
            <div className="mt-2 text-muted small" style={{ fontSize: '0.72rem' }}>
              <span style={{ color: '#38bdf8' }}>{reseller.active_customers || 0} active</span>
              <span className="mx-1">/</span>
              <span style={{ color: '#f59e0b' }}>{reseller.pending_customers || 0} pending</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="card p-3 h-100" style={{ background: '#121216', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
            <span className="text-uppercase fw-semibold" style={{ fontSize: '0.68rem', color: '#71717a', letterSpacing: '0.08em' }}>
              Wallet Balances
            </span>
            <div className="d-flex align-items-baseline gap-2 mt-1">
              <h3 className="fw-bold mb-0 text-white">{formatCurrency(reseller.total_balance)}</h3>
            </div>
            <div className="mt-2 text-muted small" style={{ fontSize: '0.72rem' }}>
              Cumulative prepaid wallet reserves
            </div>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="card p-3 h-100" style={{ background: '#121216', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
            <span className="text-uppercase fw-semibold" style={{ fontSize: '0.68rem', color: '#71717a', letterSpacing: '0.08em' }}>
              Total Commissions
            </span>
            <div className="d-flex align-items-baseline gap-2 mt-1">
              <h3 className="fw-bold mb-0 text-white">{formatCurrency(reseller.total_commission)}</h3>
            </div>
            <div className="mt-2 text-muted small" style={{ fontSize: '0.72rem' }}>
              Total awarded partner earnings
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ROUTER TELEMETRY SECTION
      ───────────────────────────────────────────────────────────── */}
      {Object.keys(systemOverview).length > 0 && (
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <Server size={18} style={{ color: '#38bdf8' }} />
              <h5 className="fw-bold mb-0 text-white" style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}>
                MikroTik Router Infrastructure
              </h5>
              <span className="badge" style={{ background: '#18181c', color: '#a1a1aa', border: '1px solid rgba(255,255,255,0.08)' }}>
                {Object.keys(systemOverview).length} Connected
              </span>
            </div>
            <a href="/billing/mikrotik-setup/traffic" className="btn btn-sm btn-secondary d-inline-flex align-items-center gap-1">
              <span>Live Traffic</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="row g-3">
            {Object.entries(systemOverview).map(([routerName, router]) => {
              if (!router || !router.status) {
                return (
                  <div key={routerName} className="col-12 col-md-6 col-xl-4">
                    <div className="card p-3 h-100" style={{ background: '#121216', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold text-white">{routerName}</span>
                        <span className="badge" style={{ background: 'rgba(244, 63, 94, 0.12)', color: '#fb7185', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                          Offline / Unreachable
                        </span>
                      </div>
                      <p className="small text-muted mt-2 mb-0">Router API socket did not respond to telemetry ping.</p>
                    </div>
                  </div>
                );
              }

              const info = Array.isArray(router.data) ? router.data[0] || {} : router.data || {};
              const cpuLoad = parseInt(String(info['cpu-load'] || 0).replace(/\D/g, ''), 10) || 0;
              const freeMem = parseInt(String(info['free-memory'] || 0).replace(/\D/g, ''), 10) || 0;
              const totalMem = parseInt(String(info['total-memory'] || 0).replace(/\D/g, ''), 10) || 1;
              const usedMem = Math.max(0, totalMem - freeMem);
              const memPercent = Math.min(100, Math.round((usedMem / totalMem) * 100));

              const freeHdd = parseInt(String(info['free-hdd-space'] || 0).replace(/\D/g, ''), 10) || 0;
              const totalHdd = parseInt(String(info['total-hdd-space'] || 0).replace(/\D/g, ''), 10) || 1;
              const usedHdd = Math.max(0, totalHdd - freeHdd);
              const hddPercent = Math.min(100, Math.round((usedHdd / totalHdd) * 100));

              const formatBytes = (bytes) => {
                if (!bytes) return '0 MB';
                const mb = bytes / (1024 * 1024);
                return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`;
              };

              const cpuColor = cpuLoad > 80 ? '#f43f5e' : cpuLoad > 50 ? '#f59e0b' : '#10b981';

              return (
                <div key={routerName} className="col-12 col-md-6 col-xl-4">
                  <div className="card p-3 h-100" style={{ background: '#121216', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="fw-bold mb-0 text-white">{routerName}</h6>
                          <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.65rem' }}>
                            <span className="glow-dot-emerald me-1" style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }}></span>
                            {router.connection_type || 'API'}
                          </span>
                        </div>
                        <div className="small text-muted mt-0.5" style={{ fontSize: '0.74rem' }}>
                          {info['board-name'] || info['model'] || 'RouterOS'} • {info['architecture-name'] || 'tile'}
                        </div>
                      </div>

                      {info['uptime'] && (
                        <span className="badge" style={{ background: '#18181c', color: '#a1a1aa', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.7rem' }}>
                          <Clock size={11} className="me-1 d-inline" />
                          {info['uptime']}
                        </span>
                      )}
                    </div>

                    {/* CPU Bar */}
                    <div className="mb-2.5">
                      <div className="d-flex justify-content-between align-items-center small mb-1" style={{ fontSize: '0.75rem' }}>
                        <span className="text-muted d-flex align-items-center gap-1">
                          <Cpu size={13} /> CPU Load ({info['cpu-count'] || 1} Cores)
                        </span>
                        <span className="fw-bold" style={{ color: cpuColor }}>
                          {cpuLoad}%
                        </span>
                      </div>
                      <div className="rounded-pill overflow-hidden" style={{ height: 6, background: '#27272a' }}>
                        <div style={{ width: `${Math.max(4, cpuLoad)}%`, height: '100%', background: cpuColor, transition: 'width 0.3s ease' }}></div>
                      </div>
                    </div>

                    {/* RAM Bar */}
                    <div className="mb-2.5">
                      <div className="d-flex justify-content-between align-items-center small mb-1" style={{ fontSize: '0.75rem' }}>
                        <span className="text-muted d-flex align-items-center gap-1">
                          <Zap size={13} /> RAM ({formatBytes(usedMem)} / {formatBytes(totalMem)})
                        </span>
                        <span className="fw-bold text-white">
                          {memPercent}%
                        </span>
                      </div>
                      <div className="rounded-pill overflow-hidden" style={{ height: 6, background: '#27272a' }}>
                        <div style={{ width: `${memPercent}%`, height: '100%', background: '#06b6d4', transition: 'width 0.3s ease' }}></div>
                      </div>
                    </div>

                    {/* HDD Bar */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center small mb-1" style={{ fontSize: '0.75rem' }}>
                        <span className="text-muted d-flex align-items-center gap-1">
                          <HardDrive size={13} /> Disk Storage ({formatBytes(freeHdd)} free)
                        </span>
                        <span className="fw-bold text-white">
                          {hddPercent}%
                        </span>
                      </div>
                      <div className="rounded-pill overflow-hidden" style={{ height: 6, background: '#27272a' }}>
                        <div style={{ width: `${hddPercent}%`, height: '100%', background: '#8b5cf6', transition: 'width 0.3s ease' }}></div>
                      </div>
                    </div>

                    {/* Sensor Badges */}
                    <div className="d-flex flex-wrap gap-1.5 pt-2 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
                      {info['cpu-temperature'] && (
                        <span className="badge" style={{ background: '#18181c', color: '#fb923c', border: '1px solid rgba(251, 146, 60, 0.25)', fontSize: '0.68rem' }}>
                          <Thermometer size={10} className="me-1 d-inline" />
                          {info['cpu-temperature']}°C
                        </span>
                      )}
                      {info['voltage'] && (
                        <span className="badge" style={{ background: '#18181c', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.25)', fontSize: '0.68rem' }}>
                          <Zap size={10} className="me-1 d-inline" />
                          {info['voltage']}V
                        </span>
                      )}
                      {info['version'] && (
                        <span className="badge" style={{ background: '#18181c', color: '#a1a1aa', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.68rem' }}>
                          v{info['version']}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          CHARTS ROW: 12-MONTH FINANCIAL GRAPH + CUSTOMER DISTRIBUTION
      ───────────────────────────────────────────────────────────── */}
      <div className="row g-4 mb-4">
        
        {/* 12-Month Performance Chart */}
        <div className="col-12 col-xl-8">
          <div className="card p-3 p-md-4 h-100" style={{ background: '#121216', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-4">
              <div>
                <div className="d-flex align-items-center gap-2">
                  <BarChart3 size={18} style={{ color: '#38bdf8' }} />
                  <h5 className="fw-bold mb-0 text-white" style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}>
                    Financial Performance & Cashflow
                  </h5>
                </div>
                <p className="small text-muted mb-0" style={{ fontSize: '0.78rem' }}>
                  Comparing Previous Year vs Current Year Revenue Trends (BDT ৳)
                </p>
              </div>

              {/* View Switcher Tabs */}
              <div className="btn-group btn-group-sm" role="group">
                <button
                  type="button"
                  className={`btn btn-sm ${chartView === 'comparison' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setChartView('comparison')}
                  style={{ fontSize: '0.75rem' }}
                >
                  Monthly Comparison
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${chartView === 'difference' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setChartView('difference')}
                  style={{ fontSize: '0.75rem' }}
                >
                  Growth Delta
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${chartView === 'cumulative' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setChartView('cumulative')}
                  style={{ fontSize: '0.75rem' }}
                >
                  Cumulative
                </button>
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <div className="position-relative w-100" style={{ height: 260 }}>
              <svg className="w-100 h-100" viewBox="0 0 600 240" preserveAspectRatio="none">
                {/* Gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                  const y = 200 - pct * 170;
                  return (
                    <g key={i}>
                      <line x1="30" y1={y} x2="590" y2={y} stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3 3" />
                      <text x="25" y={y + 3} textAnchor="end" fill="#52525b" fontSize="9" fontFamily="monospace">
                        {formatNumber(maxChartValue * pct)}
                      </text>
                    </g>
                  );
                })}

                {/* Bars / Lines */}
                {chartData.map((d, i) => {
                  const colWidth = 46;
                  const x = 40 + i * colWidth;
                  const isHovered = hoveredMonth === d.month;

                  if (chartView === 'comparison') {
                    const prevH = Math.max(3, (d.prev / maxChartValue) * 170);
                    const currH = Math.max(3, (d.curr / maxChartValue) * 170);

                    return (
                      <g key={d.month} onMouseEnter={() => setHoveredMonth(d.month)} onMouseLeave={() => setHoveredMonth(null)} style={{ cursor: 'pointer' }}>
                        {/* Hover highlight column */}
                        {isHovered && (
                          <rect x={x - 2} y="30" width={38} height="175" fill="rgba(255, 255, 255, 0.04)" rx="4" />
                        )}

                        {/* Previous Year Bar (Dark muted slate) */}
                        <rect
                          x={x}
                          y={200 - prevH}
                          width={14}
                          height={prevH}
                          rx={3}
                          fill={isHovered ? '#52525b' : '#3f3f46'}
                          opacity={0.8}
                        />

                        {/* Current Year Bar (Radiant cyan/white) */}
                        <rect
                          x={x + 16}
                          y={200 - currH}
                          width={14}
                          height={currH}
                          rx={3}
                          fill={isHovered ? '#38bdf8' : '#0ea5e9'}
                          opacity={0.95}
                        />

                        {/* Month Label */}
                        <text
                          x={x + 15}
                          y="225"
                          textAnchor="middle"
                          fill={isHovered ? '#ffffff' : '#71717a'}
                          fontSize="10"
                          fontWeight={isHovered ? '600' : '400'}
                          fontFamily="sans-serif"
                        >
                          {d.month}
                        </text>
                      </g>
                    );
                  }

                  if (chartView === 'difference') {
                    const isPositive = d.diff >= 0;
                    const diffH = Math.max(4, (Math.abs(d.diff) / maxChartValue) * 170);
                    const color = isPositive ? '#10b981' : '#f43f5e';

                    return (
                      <g key={d.month} onMouseEnter={() => setHoveredMonth(d.month)} onMouseLeave={() => setHoveredMonth(null)} style={{ cursor: 'pointer' }}>
                        {isHovered && (
                          <rect x={x - 4} y="30" width={34} height="175" fill="rgba(255, 255, 255, 0.04)" rx="4" />
                        )}

                        <rect
                          x={x + 3}
                          y={200 - diffH}
                          width={20}
                          height={diffH}
                          rx={3}
                          fill={color}
                          opacity={isHovered ? 1 : 0.8}
                        />

                        <text
                          x={x + 13}
                          y="225"
                          textAnchor="middle"
                          fill={isHovered ? '#ffffff' : '#71717a'}
                          fontSize="10"
                          fontFamily="sans-serif"
                        >
                          {d.month}
                        </text>
                      </g>
                    );
                  }

                  // Cumulative View
                  const prevH = Math.max(3, (d.cumPrev / maxChartValue) * 170);
                  const currH = Math.max(3, (d.cumCurr / maxChartValue) * 170);

                  return (
                    <g key={d.month} onMouseEnter={() => setHoveredMonth(d.month)} onMouseLeave={() => setHoveredMonth(null)} style={{ cursor: 'pointer' }}>
                      {isHovered && (
                        <rect x={x - 2} y="30" width={38} height="175" fill="rgba(255, 255, 255, 0.04)" rx="4" />
                      )}
                      <rect x={x} y={200 - prevH} width={14} height={prevH} rx={3} fill="#3f3f46" />
                      <rect x={x + 16} y={200 - currH} width={14} height={currH} rx={3} fill="#10b981" />
                      <text x={x + 15} y="225" textAnchor="middle" fill={isHovered ? '#ffffff' : '#71717a'} fontSize="10">
                        {d.month}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip on Hover */}
              {hoveredMonth && (
                (() => {
                  const mData = chartData.find((d) => d.month === hoveredMonth);
                  if (!mData) return null;
                  return (
                    <div
                      className="position-absolute p-2 rounded-2 shadow-lg"
                      style={{
                        top: 10,
                        right: 20,
                        background: '#1c1c24',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        fontSize: '0.75rem',
                        zIndex: 10,
                        minWidth: 150,
                      }}
                    >
                      <div className="fw-bold text-white mb-1">{mData.month} Summary</div>
                      <div className="d-flex justify-content-between text-muted">
                        <span>Prev Year:</span>
                        <span className="text-white font-mono">{formatCurrency(mData.prev)}</span>
                      </div>
                      <div className="d-flex justify-content-between text-muted">
                        <span>Curr Year:</span>
                        <span className="text-white font-mono" style={{ color: '#38bdf8' }}>{formatCurrency(mData.curr)}</span>
                      </div>
                      <div className="d-flex justify-content-between pt-1 mt-1 border-top border-secondary border-opacity-25">
                        <span>Delta:</span>
                        <span className="font-mono" style={{ color: mData.diff >= 0 ? '#34d399' : '#fb7185' }}>
                          {mData.diff >= 0 ? '+' : ''}{formatCurrency(mData.diff)}
                        </span>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            {/* Legend */}
            <div className="d-flex align-items-center justify-content-center gap-4 mt-3 pt-3 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.06)', fontSize: '0.78rem' }}>
              <div className="d-flex align-items-center gap-2">
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#3f3f46' }}></span>
                <span className="text-muted">Previous Year</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#0ea5e9' }}></span>
                <span className="text-muted">Current Year (Income)</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#10b981' }}></span>
                <span className="text-muted">Growth Spread</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Distribution Donut Chart */}
        <div className="col-12 col-xl-4">
          <div className="card p-3 p-md-4 h-100" style={{ background: '#121216', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <Users size={18} style={{ color: '#10b981' }} />
              <h5 className="fw-bold mb-0 text-white" style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}>
                Subscriber Breakdown
              </h5>
            </div>
            <p className="small text-muted mb-4" style={{ fontSize: '0.78rem' }}>
              Current active state of customer accounts
            </p>

            {/* Donut SVG */}
            <div className="d-flex justify-content-center position-relative my-2">
              <svg width="180" height="180" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#27272a" strokeWidth="12" />

                {/* Slices calculated via strokeDasharray */}
                {(() => {
                  let accumulatedPct = 0;
                  const circumference = 2 * Math.PI * 38; // ~238.76

                  return statusItems.map((item, idx) => {
                    const pct = Number(item.percentage) / 100;
                    const strokeLength = pct * circumference;
                    const strokeDasharray = `${strokeLength} ${circumference - strokeLength}`;
                    const strokeDashoffset = -accumulatedPct * circumference;
                    accumulatedPct += pct;

                    if (item.count === 0) return null;

                    return (
                      <circle
                        key={idx}
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth="12"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 50 50)"
                        style={{ transition: 'stroke-dasharray 0.3s ease' }}
                      />
                    );
                  });
                })()}

                {/* Inner Text */}
                <text x="50" y="47" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                  {formatNumber(customersData.total)}
                </text>
                <text x="50" y="60" textAnchor="middle" fill="#71717a" fontSize="7" fontFamily="sans-serif">
                  TOTAL CLIENTS
                </text>
              </svg>
            </div>

            {/* Status Legend list */}
            <div className="d-flex flex-column gap-2 mt-4 pt-2 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
              {statusItems.map((item) => (
                <div key={item.label} className="d-flex align-items-center justify-content-between small">
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, boxShadow: `0 0 6px ${item.color}` }}></span>
                    <span className="text-secondary">{item.label}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-semibold text-white font-mono">{formatNumber(item.count)}</span>
                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BILLING BY CUSTOMER STATUS COMPARISON MATRIX
      ───────────────────────────────────────────────────────────── */}
      {billInfo.by_status && (
        <div className="card p-3 p-md-4 mb-4" style={{ background: '#121216', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <Layers size={18} style={{ color: '#c084fc' }} />
            <h5 className="fw-bold mb-0 text-white" style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}>
              Billing Matrix by Status
            </h5>
          </div>

          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Status Group</th>
                  <th style={{ width: '25%' }}>Monthly Rent</th>
                  <th style={{ width: '25%' }}>Advance Paid</th>
                  <th style={{ width: '25%' }}>Pending Due Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(billInfo.by_status).map(([st, row]) => {
                  const statusColors = {
                    active: '#10b981',
                    free: '#06b6d4',
                    inactive: '#f43f5e',
                    pending: '#f59e0b',
                  };
                  const color = statusColors[st] || '#ffffff';

                  return (
                    <tr key={st}>
                      <td>
                        <span className="badge text-capitalize" style={{ background: '#18181c', color, border: `1px solid ${color}40`, fontSize: '0.75rem' }}>
                          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: color, marginRight: 6 }}></span>
                          {st}
                        </span>
                      </td>
                      <td className="font-mono text-white fw-semibold">{formatCurrency(row.monthly_rent)}</td>
                      <td className="font-mono text-success">{formatCurrency(row.advance)}</td>
                      <td className="font-mono text-warning">{formatCurrency(row.due_amount)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          RECENT PAYMENT COLLECTIONS STREAM TABLE
      ───────────────────────────────────────────────────────────── */}
      <div className="card p-3 p-md-4" style={{ background: '#121216', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
          <div className="d-flex align-items-center gap-2">
            <Receipt size={18} style={{ color: '#10b981' }} />
            <h5 className="fw-bold mb-0 text-white" style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}>
              Recent Collections Activity Stream
            </h5>
            <span className="badge" style={{ background: '#18181c', color: '#a1a1aa', border: '1px solid rgba(255,255,255,0.08)' }}>
              Latest {filteredCollections.length} Records
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <div className="position-relative" style={{ minWidth: 220 }}>
              <Search size={14} className="position-absolute text-muted" style={{ left: 10, top: 10 }} />
              <input
                type="text"
                className="form-control form-control-sm ps-4"
                placeholder="Filter by customer, ID..."
                value={collectionsSearch}
                onChange={(e) => setCollectionsSearch(e.target.value)}
                style={{ fontSize: '0.78rem' }}
              />
            </div>
            <a href="/billing/collection-report" className="btn btn-sm btn-secondary d-inline-flex align-items-center gap-1">
              <span>Full Report</span>
              <ChevronRight size={14} />
            </a>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table mb-0 align-middle">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Client Name</th>
                <th>Package</th>
                <th>Amount Collected</th>
                <th>Payment Date</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              {filteredCollections.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted small">
                    No recent payment collections matched your search.
                  </td>
                </tr>
              ) : (
                filteredCollections.map((col, idx) => {
                  const uniqueId = col.customer_bill_unique_id || col.customer?.customer_unique_id || 'N/A';
                  const isCopied = copiedId === uniqueId;

                  return (
                    <tr key={col.id || idx}>
                      <td>
                        <span
                          className="badge d-inline-flex align-items-center gap-1 font-mono"
                          onClick={() => copyToClipboard(uniqueId, uniqueId)}
                          style={{
                            background: '#18181c',
                            color: '#e4e4e7',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            cursor: 'pointer',
                          }}
                          title="Click to copy ID"
                        >
                          {uniqueId}
                          {isCopied ? <Check size={10} style={{ color: '#10b981' }} /> : <Copy size={10} style={{ color: '#71717a' }} />}
                        </span>
                      </td>
                      <td className="fw-semibold text-white">
                        {col.customer?.full_name || 'Subscriber'}
                      </td>
                      <td>
                        <span className="badge" style={{ background: '#1c1c24', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                          {col.customer?.package_name || 'Internet Plan'}
                        </span>
                      </td>
                      <td>
                        <span className="font-mono fw-bold" style={{ color: '#34d399' }}>
                          {formatCurrency(col.collection_amount)}
                        </span>
                      </td>
                      <td className="text-muted small">
                        {col.collection_date ? new Date(col.collection_date).toLocaleDateString() : 'Today'}
                      </td>
                      <td>
                        <span className="badge text-uppercase" style={{ background: '#18181c', color: '#a1a1aa', border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.68rem' }}>
                          {col.payment_method || 'Cash / Gateway'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
