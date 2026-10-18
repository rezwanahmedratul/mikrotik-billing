import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Calendar,
  Zap,
  AlertTriangle,
  Wifi,
  Users,
  Layers,
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import FinancialChart, { FinancialMonthData } from '../components/FinancialChart';
import SubscriberDonutChart, { SubscriberStatusItem } from '../components/SubscriberDonutChart';

export interface OverviewPageProps {
  billInfo?: any;
  customersData?: any;
  totalRevenue?: number;
  activePercent?: number;
  chartData?: FinancialMonthData[];
  maxChartValue?: number;
  statusItems?: SubscriberStatusItem[];
  formatCurrency: (amount: number | string) => string;
  formatNumber: (num: number | string) => string;
}

export default function OverviewPage({
  billInfo = {},
  customersData = {},
  totalRevenue = 0,
  activePercent = 0,
  chartData = [],
  maxChartValue = 1000,
  statusItems = [],
  formatCurrency,
  formatNumber,
}: OverviewPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
    >
      {/* ── 6 KEY TELEMETRY CARDS ROW ── */}
      <div className="row g-3 mb-4">
        {/* Total Realized */}
        <div className="col-12 col-sm-6 col-xl-2">
          <MetricCard
            title="Total Realized"
            value={formatCurrency(totalRevenue)}
            subtitle="Broadband + Hotspot"
            icon={DollarSign}
            badgeText="YTD Realized"
          />
        </div>

        {/* Monthly Rent (MFR) */}
        <div className="col-12 col-sm-6 col-xl-2">
          <MetricCard
            title="Monthly Rent (MFR)"
            value={formatCurrency(billInfo.monthly_rent || 0)}
            subtitle="Target monthly billing"
            icon={Calendar}
            badgeText="Expected"
          />
        </div>

        {/* Today Collected */}
        <div className="col-12 col-sm-6 col-xl-2">
          <MetricCard
            title="Today Collected"
            value={formatCurrency(billInfo.today_paid_amount || 0)}
            subtitle="Cash + Gateway stream"
            icon={Zap}
            badgeText="Live"
          />
        </div>

        {/* Pending Active Due */}
        <div className="col-12 col-sm-6 col-xl-2">
          <MetricCard
            title="Pending Active Due"
            value={formatCurrency(billInfo.due_amount || 0)}
            subtitle="Outstanding receivables"
            icon={AlertTriangle}
            badgeText="Overdue"
          />
        </div>

        {/* Hotspot Sales */}
        <div className="col-12 col-sm-6 col-xl-2">
          <MetricCard
            title="Hotspot Sales"
            value={formatCurrency(billInfo.hotspot_total || 0)}
            subtitle={`Today: ${formatCurrency(billInfo.hotspot_today || 0)}`}
            icon={Wifi}
            badgeText="Vouchers"
          />
        </div>

        {/* Subscriber Health */}
        <div className="col-12 col-sm-6 col-xl-2">
          <MetricCard
            title="Subscriber Health"
            value={`${activePercent}%`}
            subtitle="Active subscriber ratio"
            icon={Users}
            badgeText="Active"
            badgeDot={true}
          />
        </div>
      </div>

      {/* ── CHARTS ROW: 12-MONTH FINANCIAL GRAPH + SUBSCRIBER BREAKDOWN ── */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-8">
          <FinancialChart
            chartData={chartData}
            maxChartValue={maxChartValue}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
          />
        </div>

        <div className="col-12 col-xl-4">
          <SubscriberDonutChart
            statusItems={statusItems}
            totalCustomers={customersData.total || 0}
            formatNumber={formatNumber}
          />
        </div>
      </div>

      {/* ── BILLING MATRIX BY SUBSCRIBER STATUS TABLE ── */}
      {billInfo.by_status && (
        <div
          className="card p-3.5 p-md-4 mb-4"
          style={{
            background: 'var(--mono-card)',
            border: '1px solid var(--mono-card-border)',
            borderRadius: 14,
          }}
        >
          <div className="d-flex align-items-center gap-2 mb-3">
            <Layers size={17} style={{ color: 'var(--mono-text-secondary)' }} />
            <h5 className="fw-bold mb-0" style={{ fontSize: '0.94rem', letterSpacing: '-0.01em', color: 'var(--mono-text-primary)' }}>
              Billing Matrix by Subscriber Status
            </h5>
          </div>

          <div className="table-responsive">
            <table className="table mb-0 align-middle" style={{ '--bs-table-bg': 'transparent', color: 'var(--mono-text-primary)' } as React.CSSProperties}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--mono-card-border)' }}>
                  <th style={{ width: '25%', color: 'var(--mono-text-muted)', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 600, background: 'transparent' }}>
                    STATUS GROUP
                  </th>
                  <th style={{ width: '25%', color: 'var(--mono-text-muted)', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 600, background: 'transparent' }}>
                    MONTHLY RENT
                  </th>
                  <th style={{ width: '25%', color: 'var(--mono-text-muted)', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 600, background: 'transparent' }}>
                    ADVANCE PAID
                  </th>
                  <th style={{ width: '25%', color: 'var(--mono-text-muted)', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 600, background: 'transparent' }}>
                    PENDING DUE AMOUNT
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(billInfo.by_status).map(([st, row]: [string, any]) => {
                  const statusColors: Record<string, string> = {
                    active: '#34d399',
                    free: 'var(--mono-text-secondary)',
                    inactive: '#fb7185',
                    pending: '#fbbf24',
                  };
                  const color = statusColors[st] || 'var(--mono-text-primary)';

                  return (
                    <tr key={st} style={{ borderBottom: '1px solid var(--mono-hairline)' }}>
                      <td>
                        <span
                          className="badge text-capitalize d-inline-flex align-items-center gap-1.5"
                          style={{
                            background: 'var(--mono-surface-elevated)',
                            color,
                            border: `1px solid var(--mono-card-border)`,
                            fontSize: '0.72rem',
                            fontWeight: 500,
                            padding: '3px 8px',
                            borderRadius: 6,
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-block',
                              width: 5,
                              height: 5,
                              borderRadius: '50%',
                              background: color,
                            }}
                          />
                          {st}
                        </span>
                      </td>
                      <td className="font-mono fw-semibold" style={{ fontSize: '0.84rem', color: 'var(--mono-text-primary)' }}>
                        {formatCurrency(row.monthly_rent || 0)}
                      </td>
                      <td className="font-mono" style={{ fontSize: '0.84rem', color: 'var(--mono-text-secondary)' }}>
                        {formatCurrency(row.advance || 0)}
                      </td>
                      <td className="font-mono" style={{ fontSize: '0.84rem', color: Number(row.due_amount) > 0 ? '#fb7185' : 'var(--mono-text-muted)' }}>
                        {formatCurrency(row.due_amount || 0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
