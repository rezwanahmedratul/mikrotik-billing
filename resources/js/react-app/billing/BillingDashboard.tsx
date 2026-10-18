import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import DashboardHeader from './components/DashboardHeader';
import OverviewPage from './pages/OverviewPage';
import MikrotikPage from './pages/MikrotikPage';
import SubscribersPage from './pages/SubscribersPage';
import CollectionsPage from './pages/CollectionsPage';

export interface BillingDashboardProps {
  initialData?: any;
}

export const BillingDashboard: React.FC<BillingDashboardProps> = ({ initialData }) => {
  const [data, setData] = useState<any>(initialData || (typeof window !== 'undefined' ? window.__BILLING_DASHBOARD_DATA__ : {}) || {});
  const [activeTab, setActiveTab] = useState<string>('overview'); // 'overview', 'mikrotik', 'subscribers', 'collections'
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(0); // 0 = off, 15, 30, 60
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [collectionsSearch, setCollectionsSearch] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

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

  const copyToClipboard = (text: string, id: string | number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatNumber = (val: number | string) => {
    return Number(val || 0).toLocaleString('en-US', {
      maximumFractionDigits: 0,
    });
  };

  const formatCurrency = (val: number | string) => {
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
    const maxVal = Math.max(
      ...chartData.map((d) => Math.max(d.prev, d.curr, Math.abs(d.diff))),
      1000
    );
    return maxVal * 1.15;
  }, [chartData]);

  // Customer status breakdown data for Donut Chart
  const statusItems = useMemo(() => {
    const total = Number(customersData.total) || 1;
    const items = [
      { label: 'Active', count: Number(customersData.active) || 0, color: '#10b981' },
      { label: 'Pending', count: Number(customersData.pending) || 0, color: '#f59e0b' },
      { label: 'Free', count: Number(customersData.free) || 0, color: '#06b6d4' },
      { label: 'Disabled', count: Number(customersData.temporary_disable) || 0, color: '#fb923c' },
      { label: 'Inactive', count: Number(customersData.inactive) || 0, color: '#f43f5e' },
    ];
    return items.map((item) => ({
      ...item,
      percentage: total > 0 ? ((item.count / total) * 100).toFixed(1) : '0',
    }));
  }, [customersData]);

  // Filter collections
  const filteredCollections = useMemo(() => {
    if (!collectionsSearch.trim()) return recentCollections;
    const q = collectionsSearch.toLowerCase();
    return recentCollections.filter((c: any) => {
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

  const routerCount = Object.keys(systemOverview).length;

  return (
    <div className="billing-react-dashboard" style={{ animation: 'fadeIn 0.25s ease-out' }}>
      {/* ─────────────────────────────────────────────────────────────
          MODULAR DASHBOARD HEADER DECK & TAB CONTROLLER
      ───────────────────────────────────────────────────────────── */}
      <DashboardHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isRefreshing={isRefreshing}
        onRefresh={fetchLatestStats}
        refreshInterval={refreshInterval}
        setRefreshInterval={setRefreshInterval}
        lastUpdated={lastUpdated}
        routerCount={routerCount}
      />

      {/* ─────────────────────────────────────────────────────────────
          MODULAR PAGES ROUTER
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <OverviewPage
            key="overview"
            billInfo={billInfo}
            customersData={customersData}
            totalRevenue={totalRevenue}
            activePercent={activePercent}
            chartData={chartData}
            maxChartValue={maxChartValue}
            statusItems={statusItems}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
          />
        )}

        {activeTab === 'mikrotik' && (
          <MikrotikPage key="mikrotik" />
        )}

        {activeTab === 'subscribers' && (
          <SubscribersPage
            key="subscribers"
            reseller={reseller}
            customersData={customersData}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
          />
        )}

        {activeTab === 'collections' && (
          <CollectionsPage
            key="collections"
            filteredCollections={filteredCollections}
            collectionsSearch={collectionsSearch}
            setCollectionsSearch={setCollectionsSearch}
            copiedId={copiedId}
            copyToClipboard={copyToClipboard}
            formatCurrency={formatCurrency}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BillingDashboard;
