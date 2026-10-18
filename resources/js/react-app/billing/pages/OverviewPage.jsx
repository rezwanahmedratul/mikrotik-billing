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
import FinancialChart from '../components/FinancialChart';
import SubscriberDonutChart from '../components/SubscriberDonutChart';

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
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
    >
      {/* ── 6 KEY TELEMETRY CARDS ROW MATCHING SCREENSHOT ── */}
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
            value={formatCurrency(billInfo.monthly_rent)}
            subtitle="Target monthly billing"
            icon={Calendar}
            badgeText="Expected"
          />
        </div>

        {/* Today Collected */}
        <div className="col-12 col-sm-6 col-xl-2">
          <MetricCard
            title="Today Collected"
            value={formatCurrency(billInfo.today_paid_amount)}
            subtitle="Cash + Gateway stream"
            icon={Zap}
            badgeText="Live"
          />
        </div>

        {/* Pending Active Due */}
        <div className="col-12 col-sm-6 col-xl-2">
          <MetricCard
            title="Pending Active Due"
            value={formatCurrency(billInfo.due_amount)}
            subtitle="Outstanding receivables"
            icon={AlertTriangle}
            badgeText="Overdue"
          />
        </div>

        {/* Hotspot Sales */}
        <div className="col-12 col-sm-6 col-xl-2">
          <MetricCard
            title="Hotspot Sales"
            value={formatCurrency(billInfo.hotspot_total)}
            subtitle={`Today: ${formatCurrency(billInfo.hotspot_today)}`}
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
            totalCustomers={customersData.total}
            formatNumber={formatNumber}
          />
        </div>
      </div>

      {/* ── BILLING MATRIX BY SUBSCRIBER STATUS TABLE ── */}
      {billInfo.by_status && (
        <div
          className="card p-3.5 p-md-4 mb-4"
          style={{
            background: '#111115',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
          }}
        >
          <div className="d-flex align-items-center gap-2 mb-3">
            <Layers size={17} style={{ color: '#d1d1d6' }} />
            <h5 className="fw-bold mb-0 text-white" style={{ fontSize: '0.96rem', letterSpacing: '-0.01em' }}>
              Billing Matrix by Subscriber Status
            </h5>
          </div>

          <div className="table-responsive">
            <table className="table mb-0 align-middle" style={{ '--bs-table-bg': 'transparent', color: '#e4e4e7' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <th style={{ width: '25%', color: '#71717a', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 600, background: 'transparent' }}>
                    STATUS GROUP
                  </th>
                  <th style={{ width: '25%', color: '#71717a', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 600, background: 'transparent' }}>
                    MONTHLY RENT
                  </th>
                  <th style={{ width: '25%', color: '#71717a', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 600, background: 'transparent' }}>
                    ADVANCE PAID
                  </th>
                  <th style={{ width: '25%', color: '#71717a', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 600, background: 'transparent' }}>
                    PENDING DUE AMOUNT
                  </th>
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
                    <tr key={st} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td>
                        <span
                          className="badge text-capitalize d-inline-flex align-items-center gap-1.5"
                          style={{
                            background: '#16161c',
                            color,
                            border: `1px solid ${color}30`,
                            fontSize: '0.74rem',
                            fontWeight: 500,
                            padding: '3px 8px',
                            borderRadius: 5,
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
                          ></span>
                          {st}
                        </span>
                      </td>
                      <td className="font-mono text-white fw-semibold" style={{ fontSize: '0.84rem' }}>
                        {formatCurrency(row.monthly_rent)}
                      </td>
                      <td className="font-mono text-success" style={{ fontSize: '0.84rem' }}>
                        {formatCurrency(row.advance)}
                      </td>
                      <td className="font-mono text-warning" style={{ fontSize: '0.84rem' }}>
                        {formatCurrency(row.due_amount)}
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
