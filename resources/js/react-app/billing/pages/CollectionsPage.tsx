import React from 'react';
import { motion } from 'framer-motion';
import {
  Receipt,
  Search,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';

export interface CollectionItem {
  id?: number | string;
  customer_bill_unique_id?: string;
  collection_amount?: number | string;
  collection_date?: string;
  payment_method?: string;
  customer?: {
    customer_unique_id?: string;
    full_name?: string;
    package_name?: string;
  };
}

export interface CollectionsPageProps {
  filteredCollections?: CollectionItem[];
  collectionsSearch?: string;
  setCollectionsSearch: (val: string) => void;
  copiedId?: string | number | null;
  copyToClipboard: (text: string, id: string | number) => void;
  formatCurrency: (amount: number | string) => string;
}

export default function CollectionsPage({
  filteredCollections = [],
  collectionsSearch = '',
  setCollectionsSearch,
  copiedId = null,
  copyToClipboard,
  formatCurrency,
}: CollectionsPageProps) {
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
          borderRadius: 14,
        }}
      >
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
          <div className="d-flex align-items-center gap-2">
            <Receipt size={17} style={{ color: 'var(--mono-text-secondary)' }} />
            <h5 className="fw-bold mb-0" style={{ fontSize: '0.94rem', letterSpacing: '-0.01em', color: 'var(--mono-text-primary)' }}>
              Real-Time Payment Collections Stream
            </h5>
            <span
              className="badge font-mono"
              style={{
                background: 'var(--mono-surface-elevated)',
                color: 'var(--mono-text-secondary)',
                border: '1px solid var(--mono-card-border)',
                fontSize: '0.68rem',
                borderRadius: 6,
                padding: '3px 7px',
              }}
            >
              Latest {filteredCollections.length} Records
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <div className="position-relative" style={{ minWidth: 240 }}>
              <Search
                size={14}
                className="position-absolute"
                style={{ left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--mono-text-muted)' }}
              />
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Filter by customer, ID, method..."
                value={collectionsSearch}
                onChange={(e) => setCollectionsSearch(e.target.value)}
                style={{
                  fontSize: '0.78rem',
                  paddingLeft: 32,
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
                fontWeight: 500,
              }}
            >
              <span>Full Audit Report</span>
              <ChevronRight size={14} />
            </a>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table mb-0 align-middle" style={{ '--bs-table-bg': 'transparent', color: 'var(--mono-text-primary)' } as React.CSSProperties}>
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
                    <tr key={col.id || idx} style={{ borderBottom: '1px solid var(--mono-hairline)' }}>
                      <td>
                        <span
                          className="badge d-inline-flex align-items-center gap-1 font-mono"
                          onClick={() => copyToClipboard(uniqueId, uniqueId)}
                          style={{
                            background: 'var(--mono-surface-elevated)',
                            color: 'var(--mono-text-primary)',
                            border: '1px solid var(--mono-card-border)',
                            cursor: 'pointer',
                            borderRadius: 6,
                            padding: '3px 7px',
                          }}
                          title="Click to copy ID"
                        >
                          {uniqueId}
                          {isCopied ? (
                            <Check size={10} style={{ color: '#34d399' }} />
                          ) : (
                            <Copy size={10} style={{ color: 'var(--mono-text-muted)' }} />
                          )}
                        </span>
                      </td>
                      <td className="fw-semibold" style={{ color: 'var(--mono-text-primary)' }}>
                        {col.customer?.full_name || 'Subscriber'}
                      </td>
                      <td>
                        <span
                          className="badge font-mono"
                          style={{
                            background: 'var(--mono-surface-elevated)',
                            color: 'var(--mono-text-secondary)',
                            border: '1px solid var(--mono-card-border)',
                            borderRadius: 6,
                            padding: '3px 7px',
                          }}
                        >
                          {col.customer?.package_name || 'Internet Plan'}
                        </span>
                      </td>
                      <td>
                        <span className="font-mono fw-bold" style={{ color: '#34d399' }}>
                          {formatCurrency(col.collection_amount || 0)}
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
                            borderRadius: 6,
                            padding: '3px 7px',
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
