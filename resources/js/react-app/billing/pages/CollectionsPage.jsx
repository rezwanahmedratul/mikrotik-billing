import React from 'react';
import { motion } from 'framer-motion';
import {
  Receipt,
  Search,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';

export default function CollectionsPage({
  filteredCollections = [],
  collectionsSearch = '',
  setCollectionsSearch,
  copiedId = null,
  copyToClipboard,
  formatCurrency,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
    >
      <div
        className="card p-3.5 p-md-4"
        style={{
          background: 'var(--mono-card)',
          border: '1px solid var(--mono-card-border)',
          borderRadius: 12,
        }}
      >
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
          <div className="d-flex align-items-center gap-2">
            <Receipt size={17} style={{ color: 'var(--mono-text-secondary)' }} />
            <h5 className="fw-bold mb-0" style={{ fontSize: '0.96rem', letterSpacing: '-0.01em', color: 'var(--mono-text-primary)' }}>
              Real-Time Payment Collections Stream
            </h5>
            <span
              className="badge font-mono"
              style={{
                background: 'var(--mono-surface-elevated)',
                color: 'var(--mono-text-secondary)',
                border: '1px solid var(--mono-card-border)',
                fontSize: '0.68rem',
                borderRadius: 5,
              }}
            >
              Latest {filteredCollections.length} Records
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <div className="position-relative" style={{ minWidth: 240 }}>
              <Search size={14} className="position-absolute text-muted" style={{ left: 10, top: 9 }} />
              <input
                type="text"
                className="form-control form-control-sm ps-4"
                placeholder="Filter by customer, ID, method..."
                value={collectionsSearch}
                onChange={(e) => setCollectionsSearch(e.target.value)}
                style={{
                  fontSize: '0.78rem',
                  background: 'var(--mono-surface-elevated)',
                  borderColor: 'var(--mono-card-border)',
                  color: 'var(--mono-text-primary)',
                  borderRadius: 8,
                }}
              />
            </div>
            <a
              href="/billing/collection-report"
              className="btn btn-sm d-inline-flex align-items-center gap-1.5 px-3 py-1.5 text-decoration-none"
              style={{
                background: 'var(--mono-surface-elevated)',
                border: '1px solid var(--mono-card-border)',
                color: 'var(--mono-text-primary)',
                borderRadius: 8,
                fontSize: '0.8rem',
              }}
            >
              <span>Full Audit Report</span>
              <ChevronRight size={14} />
            </a>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table mb-0 align-middle" style={{ '--bs-table-bg': 'transparent', color: 'var(--mono-text-primary)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--mono-card-border)' }}>
                <th style={{ color: 'var(--mono-text-muted)', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 600, background: 'transparent' }}>CUSTOMER ID</th>
                <th style={{ color: 'var(--mono-text-muted)', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 600, background: 'transparent' }}>CLIENT NAME</th>
                <th style={{ color: 'var(--mono-text-muted)', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 600, background: 'transparent' }}>PACKAGE</th>
                <th style={{ color: 'var(--mono-text-muted)', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 600, background: 'transparent' }}>AMOUNT COLLECTED</th>
                <th style={{ color: 'var(--mono-text-muted)', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 600, background: 'transparent' }}>PAYMENT DATE</th>
                <th style={{ color: 'var(--mono-text-muted)', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 600, background: 'transparent' }}>METHOD</th>
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
                            background: 'var(--mono-surface-elevated)',
                            color: 'var(--mono-text-primary)',
                            border: '1px solid var(--mono-card-border)',
                            cursor: 'pointer',
                          }}
                          title="Click to copy ID"
                        >
                          {uniqueId}
                          {isCopied ? (
                            <Check size={10} style={{ color: '#059669' }} />
                          ) : (
                            <Copy size={10} style={{ color: 'var(--mono-text-muted)' }} />
                          )}
                        </span>
                      </td>
                      <td className="fw-semibold" style={{ color: 'var(--mono-text-primary)' }}>{col.customer?.full_name || 'Subscriber'}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: 'var(--mono-surface-elevated)',
                            color: '#0891b2',
                            border: '1px solid rgba(8, 145, 178, 0.25)',
                          }}
                        >
                          {col.customer?.package_name || 'Internet Plan'}
                        </span>
                      </td>
                      <td>
                        <span className="font-mono fw-bold" style={{ color: '#059669' }}>
                          {formatCurrency(col.collection_amount)}
                        </span>
                      </td>
                      <td className="text-muted small">
                        {col.collection_date ? new Date(col.collection_date).toLocaleDateString() : 'Today'}
                      </td>
                      <td>
                        <span
                          className="badge text-uppercase"
                          style={{
                            background: 'var(--mono-surface-elevated)',
                            color: 'var(--mono-text-secondary)',
                            border: '1px solid var(--mono-card-border)',
                            fontSize: '0.68rem',
                          }}
                        >
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
    </motion.div>
  );
}
