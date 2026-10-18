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
        style={{ background: '#121216', border: '1px solid rgba(255, 255, 255, 0.08)' }}
      >
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
          <div className="d-flex align-items-center gap-2">
            <Receipt size={18} style={{ color: '#10b981' }} />
            <h5 className="fw-bold mb-0 text-white" style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}>
              Real-Time Payment Collections Stream
            </h5>
            <span
              className="badge"
              style={{ background: '#18181c', color: '#a1a1aa', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              Latest {filteredCollections.length} Records
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <div className="position-relative" style={{ minWidth: 240 }}>
              <Search size={14} className="position-absolute text-muted" style={{ left: 10, top: 10 }} />
              <input
                type="text"
                className="form-control form-control-sm ps-4"
                placeholder="Filter by customer, ID, method..."
                value={collectionsSearch}
                onChange={(e) => setCollectionsSearch(e.target.value)}
                style={{
                  fontSize: '0.78rem',
                  background: '#16161c',
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: '#fafafa',
                }}
              />
            </div>
            <a
              href="/billing/collection-report"
              className="btn btn-sm btn-secondary d-inline-flex align-items-center gap-1"
            >
              <span>Full Audit Report</span>
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
                          {isCopied ? (
                            <Check size={10} style={{ color: '#10b981' }} />
                          ) : (
                            <Copy size={10} style={{ color: '#71717a' }} />
                          )}
                        </span>
                      </td>
                      <td className="fw-semibold text-white">{col.customer?.full_name || 'Subscriber'}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: '#1c1c24',
                            color: '#38bdf8',
                            border: '1px solid rgba(56, 189, 248, 0.25)',
                          }}
                        >
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
                        <span
                          className="badge text-uppercase"
                          style={{
                            background: '#18181c',
                            color: '#a1a1aa',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
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
