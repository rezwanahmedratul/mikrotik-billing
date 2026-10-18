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
            badgeText="Network"
            badgeColor="#a1a1aa"
          />
        </div>

        <div className="col-6 col-md-3">
          <MetricCard
            title="Reseller Customers"
            value={formatNumber(reseller.total_customers)}
            subtitle={`${reseller.active_customers || 0} Active Subscribers`}
            icon={Users}
            badgeText="Subscribers"
            badgeDot={true}
            badgeColor="#34d399"
          />
        </div>

        <div className="col-6 col-md-3">
          <MetricCard
            title="Reseller Float Balances"
            value={formatCurrency(reseller.total_balance)}
            subtitle="Float balance in reseller wallets"
            icon={Wallet}
            badgeText="Deposit"
            badgeDot={true}
            badgeColor="#34d399"
          />
        </div>

        <div className="col-6 col-md-3">
          <MetricCard
            title="Total Commissions"
            value={formatCurrency(reseller.total_commission)}
            subtitle="Commissions earned by agents"
            icon={TrendingUp}
            badgeText="Commissions"
            badgeColor="#c084fc"
          />
        </div>
      </div>

      {/* ── SUBSCRIBER MANAGEMENT CARDS ── */}
      <div
        className="card p-3.5 p-md-4 mb-4"
        style={{
          background: 'var(--mono-card)',
          border: '1px solid var(--mono-card-border)',
          borderRadius: 12,
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h6 className="fw-bold mb-0" style={{ fontSize: '0.96rem', letterSpacing: '-0.01em', color: 'var(--mono-text-primary)' }}>
              Subscriber Lifecycle Management
            </h6>
            <p className="small mb-0" style={{ fontSize: '0.76rem', color: 'var(--mono-text-muted)' }}>
              Direct access to account stages and provisioning status
            </p>
          </div>
          <a
            href="/billing/customers"
            className="btn btn-sm d-inline-flex align-items-center gap-1.5 px-3 py-1.5 text-decoration-none"
            style={{
              background: 'var(--mono-surface-elevated)',
              border: '1px solid var(--mono-card-border)',
              color: 'var(--mono-text-primary)',
              fontSize: '0.8rem',
              borderRadius: 8,
            }}
          >
            <span>Customer Directory</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-4">
            <a
              href="/billing/new/customers"
              className="p-3.5 rounded-3 d-block text-decoration-none hover-lift h-100"
              style={{ background: 'var(--mono-surface-elevated)', border: '1px solid var(--mono-card-border)' }}
            >
              <div className="d-flex align-items-center gap-2.5 mb-2">
                <div
                  className="d-flex align-items-center justify-content-center rounded-2"
                  style={{ width: 32, height: 32, background: 'rgba(56, 189, 248, 0.1)', color: '#0891b2' }}
                >
                  <UserPlus size={16} />
                </div>
                <div className="fw-bold" style={{ fontSize: '0.9rem', color: 'var(--mono-text-primary)' }}>
                  Recent Signups
                </div>
              </div>
              <div className="font-mono fw-bold mb-1" style={{ fontSize: '1.2rem', color: 'var(--mono-text-primary)' }}>
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
              style={{ background: 'var(--mono-surface-elevated)', border: '1px solid var(--mono-card-border)' }}
            >
              <div className="d-flex align-items-center gap-2.5 mb-2">
                <div
                  className="d-flex align-items-center justify-content-center rounded-2"
                  style={{ width: 32, height: 32, background: 'rgba(245, 158, 11, 0.1)', color: '#d97706' }}
                >
                  <UserCheck size={16} />
                </div>
                <div className="fw-bold" style={{ fontSize: '0.9rem', color: 'var(--mono-text-primary)' }}>
                  Pending Provisioning
                </div>
              </div>
              <div className="font-mono fw-bold mb-1" style={{ fontSize: '1.2rem', color: '#d97706' }}>
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
              style={{ background: 'var(--mono-surface-elevated)', border: '1px solid var(--mono-card-border)' }}
            >
              <div className="d-flex align-items-center gap-2.5 mb-2">
                <div
                  className="d-flex align-items-center justify-content-center rounded-2"
                  style={{ width: 32, height: 32, background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }}
                >
                  <UserX size={16} />
                </div>
                <div className="fw-bold" style={{ fontSize: '0.9rem', color: 'var(--mono-text-primary)' }}>
                  Temporary Disabled
                </div>
              </div>
              <div className="font-mono fw-bold mb-1" style={{ fontSize: '1.2rem', color: '#f43f5e' }}>
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
