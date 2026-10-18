import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  CreditCard,
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
      {/* ── 6 KEY TELEMETRY CARDS ROW ── */}
      <div className="row g-3 mb-4">
        {/* Total Revenue */}
        <div className="col-12 col-sm-6 col-xl-2">
          <MetricCard
            title="Total Realized"
            value={formatCurrency(totalRevenue)}
            subtitle="Broadband + Hotspot"
            icon={DollarSign}
            iconColor="#10b981"
            trendText="YTD Realized"
            trendType="positive"
          />
        </div>

        {/* Monthly Rent MRR */}
        <div className="col-12 col-sm-6 col-xl-2">
          <MetricCard
            title="Monthly Rent (MRR)"
            value={formatCurrency(billInfo.monthly_rent)}
            subtitle="Target monthly billing"
            icon={CreditCard}
            iconColor="#38bdf8"
            trendText="Expected"
            trendType="neutral"
          />
        </div>

        {/* Today Collected */}
        <div className="col-12 col-sm-6 col-xl-2">
          <MetricCard
            title="Today Collected"
            value={formatCurrency(billInfo.today_paid_amount)}
            subtitle="Cash + Gateway stream"
            icon={Zap}
            iconColor="#fbbf24"
            valueColor="#34d399"
            trendText="Live"
            trendType="positive"
          />
        </div>

        {/* Active Due Amount */}
        <div className="col-12 col-sm-6 col-xl-2">
          <MetricCard
            title="Pending Active Due"
            value={formatCurrency(billInfo.due_amount)}
            subtitle="Outstanding receivables"
            icon={AlertTriangle}
            iconColor="#f43f5e"
            valueColor="#fb7185"
            trendText="Overdue"
            trendType="negative"
          />
        </div>

        {/* Hotspot Sales */}
        <div className="col-12 col-sm-6 col-xl-2">
          <MetricCard
            title="Hotspot Sales"
            value={formatCurrency(billInfo.hotspot_total)}
            subtitle={`Today: ${formatCurrency(billInfo.hotspot_today)}`}
            icon={Wifi}
            iconColor="#c084fc"
            trendText="Vouchers"
            trendType="neutral"
          />
        </div>

        {/* Subscriber Health Ratio */}
        <div className="col-12 col-sm-6 col-xl-2">
          <MetricCard
            title="Subscriber Health"
            value={`${activePercent}%`}
            subtitle="Active subscriber ratio"
            icon={Users}
            iconColor="#10b981"
            progressPercent={activePercent}
            progressColor="#10b981"
            trendText={`${formatNumber(customersData.active)} Active`}
            trendType="positive"
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
          style={{ background: '#121216', border: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <div className="d-flex align-items-center gap-2 mb-3">
            <Layers size={18} style={{ color: '#c084fc' }} />
            <h5 className="fw-bold mb-0 text-white" style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}>
              Billing Matrix by Subscriber Status
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
                        <span
                          className="badge text-capitalize"
                          style={{
                            background: '#18181c',
                            color,
                            border: `1px solid ${color}40`,
                            fontSize: '0.75rem',
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-block',
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: color,
                              marginRight: 6,
                            }}
                          ></span>
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
    </motion.div>
  );
}
