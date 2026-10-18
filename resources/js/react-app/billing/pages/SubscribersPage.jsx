import React from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Users,
  Wallet,
  TrendingUp,
  ExternalLink,
  UserCheck,
  UserX,
  UserPlus,
} from 'lucide-react';
import MetricCard from '../components/MetricCard';

export default function SubscribersPage({ reseller = {}, customersData = {}, formatCurrency, formatNumber }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
    >
      {/* ── RESELLER ECOSYSTEM ROW ── */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <MetricCard
            title="Total Resellers"
            value={formatNumber(reseller.total_resellers)}
            subtitle={`${reseller.active_resellers || 0} Active • ${reseller.suspended_resellers || 0} Suspended`}
            icon={Briefcase}
            iconColor="#a1a1aa"
            trendText="Network"
            trendType="neutral"
          />
        </div>

        <div className="col-6 col-md-3">
          <MetricCard
            title="Reseller Customers"
            value={formatNumber(reseller.total_customers)}
            subtitle={`${reseller.active_customers || 0} Active Subscribers`}
            icon={Users}
            iconColor="#38bdf8"
            trendText="Subscribers"
            trendType="positive"
          />
        </div>

        <div className="col-6 col-md-3">
          <MetricCard
            title="Reseller Float Balances"
            value={formatCurrency(reseller.total_balance)}
            subtitle="Float balance in reseller wallets"
            icon={Wallet}
            iconColor="#10b981"
            valueColor="#34d399"
            trendText="Deposit"
            trendType="positive"
          />
        </div>

        <div className="col-6 col-md-3">
          <MetricCard
            title="Total Commissions"
            value={formatCurrency(reseller.total_commission)}
            subtitle="Commissions earned by agents"
            icon={TrendingUp}
            iconColor="#c084fc"
            trendText="Commissions"
            trendType="neutral"
          />
        </div>
      </div>

      {/* ── SUBSCRIBER MANAGEMENT CARDS ── */}
      <div
        className="card p-4 mb-4"
        style={{ background: '#121216', border: '1px solid rgba(255, 255, 255, 0.08)' }}
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h6 className="fw-bold text-white mb-0" style={{ fontSize: '1rem' }}>
              Subscriber Lifecycle Management
            </h6>
            <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>
              Direct access to account stages and provisioning status
            </p>
          </div>
          <a href="/billing/customers" className="btn btn-sm btn-secondary d-inline-flex align-items-center gap-1.5">
            <span>Customer Directory</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-4">
            <a
              href="/billing/new/customers"
              className="p-3.5 rounded-3 d-block text-decoration-none hover-lift h-100"
              style={{ background: '#16161c', border: '1px solid rgba(255, 255, 255, 0.06)' }}
            >
              <div className="d-flex align-items-center gap-2.5 mb-2">
                <div
                  className="d-flex align-items-center justify-content-center rounded-2"
                  style={{ width: 32, height: 32, background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}
                >
                  <UserPlus size={16} />
                </div>
                <div className="fw-bold text-white" style={{ fontSize: '0.9rem' }}>
                  Recent Signups
                </div>
              </div>
              <div className="font-mono fw-bold text-white mb-1" style={{ fontSize: '1.2rem' }}>
                {formatNumber(customersData.recent)}
              </div>
              <div className="text-muted small" style={{ fontSize: '0.74rem' }}>
                Subscribers registered in the current billing cycle
              </div>
            </a>
          </div>

          <div className="col-12 col-md-4">
            <a
              href="/billing/customers?status=pending"
              className="p-3.5 rounded-3 d-block text-decoration-none hover-lift h-100"
              style={{ background: '#16161c', border: '1px solid rgba(255, 255, 255, 0.06)' }}
            >
              <div className="d-flex align-items-center gap-2.5 mb-2">
                <div
                  className="d-flex align-items-center justify-content-center rounded-2"
                  style={{ width: 32, height: 32, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}
                >
                  <UserCheck size={16} />
                </div>
                <div className="fw-bold text-white" style={{ fontSize: '0.9rem' }}>
                  Pending Provisioning
                </div>
              </div>
              <div className="font-mono fw-bold text-white mb-1" style={{ fontSize: '1.2rem', color: '#fbbf24' }}>
                {formatNumber(customersData.pending)}
              </div>
              <div className="text-muted small" style={{ fontSize: '0.74rem' }}>
                Accounts awaiting fiber connection or payment verification
              </div>
            </a>
          </div>

          <div className="col-12 col-md-4">
            <a
              href="/billing/customers?status=disable"
              className="p-3.5 rounded-3 d-block text-decoration-none hover-lift h-100"
              style={{ background: '#16161c', border: '1px solid rgba(255, 255, 255, 0.06)' }}
            >
              <div className="d-flex align-items-center gap-2.5 mb-2">
                <div
                  className="d-flex align-items-center justify-content-center rounded-2"
                  style={{ width: 32, height: 32, background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }}
                >
                  <UserX size={16} />
                </div>
                <div className="fw-bold text-white" style={{ fontSize: '0.9rem' }}>
                  Temporary Disabled
                </div>
              </div>
              <div className="font-mono fw-bold text-white mb-1" style={{ fontSize: '1.2rem', color: '#fb7185' }}>
                {formatNumber(customersData.temporary_disable)}
              </div>
              <div className="text-muted small" style={{ fontSize: '0.74rem' }}>
                Suspended profiles on MikroTik due to non-payment or request
              </div>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
