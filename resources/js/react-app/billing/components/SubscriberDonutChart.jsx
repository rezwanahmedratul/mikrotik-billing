import React from 'react';
import { Users } from 'lucide-react';

export default function SubscriberDonutChart({ statusItems = [], totalCustomers = 0, formatNumber }) {
  // Monochrome palette matching reference screenshot
  const monochromeColors = {
    Active: '#ffffff',
    Pending: '#e4e4e7',
    Free: '#a1a1aa',
    Disabled: '#71717a',
    Inactive: '#52525b',
  };

  return (
    <div
      className="card p-3.5 p-md-4 h-100 d-flex flex-column justify-content-between"
      style={{
        background: '#111115',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
      }}
    >
      <div>
        <div className="d-flex align-items-center gap-2 mb-0.5">
          <Users size={16} style={{ color: '#d1d1d6' }} />
          <h5 className="fw-bold mb-0 text-white" style={{ fontSize: '0.96rem', letterSpacing: '-0.01em' }}>
            Subscriber Breakdown
          </h5>
        </div>
        <p className="small mb-3" style={{ fontSize: '0.76rem', color: '#71717a' }}>
          Distribution of client account lifecycle
        </p>

        {/* Donut SVG */}
        <div className="d-flex justify-content-center position-relative my-3">
          <svg width="180" height="180" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#222228" strokeWidth="11" />

            {(() => {
              let accumulatedPct = 0;
              const circumference = 2 * Math.PI * 38;

              return statusItems.map((item, idx) => {
                const color = monochromeColors[item.label] || item.color || '#a1a1aa';
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
                    stroke={color}
                    strokeWidth="11"
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
              fontSize="14"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              {formatNumber(totalCustomers)}
            </text>
            <text
              x="50"
              y="61"
              textAnchor="middle"
              fill="#71717a"
              fontSize="6.5"
              fontWeight="600"
              letterSpacing="0.05em"
              fontFamily="sans-serif"
            >
              TOTAL SUBSCRIBERS
            </text>
          </svg>
        </div>
      </div>

      {/* Status Legend List matching screenshot */}
      <div
        className="d-flex flex-column gap-2 pt-3 border-top"
        style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}
      >
        {statusItems.map((item) => {
          const color = monochromeColors[item.label] || item.color || '#a1a1aa';
          return (
            <div key={item.label} className="d-flex align-items-center justify-content-between small">
              <div className="d-flex align-items-center gap-2">
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: color,
                  }}
                ></span>
                <span style={{ color: '#a1a1aa', fontSize: '0.78rem' }}>{item.label}</span>
              </div>
              <div className="d-flex align-items-center gap-1.5">
                <span className="fw-semibold text-white font-mono" style={{ fontSize: '0.8rem' }}>
                  {formatNumber(item.count)}
                </span>
                <span style={{ color: '#71717a', fontSize: '0.74rem' }}>
                  ({item.percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
