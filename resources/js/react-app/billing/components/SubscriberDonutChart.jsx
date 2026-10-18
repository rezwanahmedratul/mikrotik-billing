import React from 'react';
import { Users } from 'lucide-react';

export default function SubscriberDonutChart({ statusItems = [], totalCustomers = 0, formatNumber }) {
  return (
    <div
      className="card p-3.5 p-md-4 h-100"
      style={{ background: '#121216', border: '1px solid rgba(255, 255, 255, 0.08)' }}
    >
      <div className="d-flex align-items-center gap-2 mb-2">
        <Users size={18} style={{ color: '#10b981' }} />
        <h5 className="fw-bold mb-0 text-white" style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}>
          Subscriber Breakdown
        </h5>
      </div>
      <p className="small text-muted mb-4" style={{ fontSize: '0.78rem' }}>
        Distribution of client account lifecycle
      </p>

      {/* Donut SVG */}
      <div className="d-flex justify-content-center position-relative my-2">
        <svg width="180" height="180" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="38" fill="transparent" stroke="#27272a" strokeWidth="12" />

          {(() => {
            let accumulatedPct = 0;
            const circumference = 2 * Math.PI * 38;

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

          <text
            x="50"
            y="47"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="13"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            {formatNumber(totalCustomers)}
          </text>
          <text x="50" y="60" textAnchor="middle" fill="#71717a" fontSize="7" fontFamily="sans-serif">
            TOTAL SUBSCRIBERS
          </text>
        </svg>
      </div>

      {/* Status Legend List */}
      <div
        className="d-flex flex-column gap-2 mt-4 pt-2 border-top"
        style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}
      >
        {statusItems.map((item) => (
          <div key={item.label} className="d-flex align-items-center justify-content-between small">
            <div className="d-flex align-items-center gap-2">
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: item.color,
                  boxShadow: `0 0 6px ${item.color}`,
                }}
              ></span>
              <span className="text-secondary">{item.label}</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="fw-semibold text-white font-mono">{formatNumber(item.count)}</span>
              <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                ({item.percentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
