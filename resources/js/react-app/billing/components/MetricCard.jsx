import React from 'react';
import { motion } from 'framer-motion';

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = '#10b981',
  valueColor = '#ffffff',
  trendText,
  trendType = 'positive', // 'positive', 'negative', 'neutral'
  progressPercent = null,
  progressColor = '#10b981',
}) {
  return (
    <div
      className="card p-3 h-100 hover-lift d-flex flex-column justify-content-between"
      style={{
        background: '#121216',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="text-muted small fw-medium" style={{ fontSize: '0.74rem' }}>
            {title}
          </span>
          {Icon && (
            <div
              className="d-flex align-items-center justify-content-center rounded-2"
              style={{
                width: 28,
                height: 28,
                background: '#18181f',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <Icon size={14} style={{ color: iconColor }} />
            </div>
          )}
        </div>

        <div className="fw-bold font-mono mb-1" style={{ fontSize: '1.3rem', color: valueColor, letterSpacing: '-0.02em' }}>
          {value}
        </div>
      </div>

      <div>
        {progressPercent !== null && (
          <div className="rounded-pill overflow-hidden my-2" style={{ height: 4, background: '#27272a' }}>
            <div
              style={{
                width: `${Math.min(100, Math.max(0, progressPercent))}%`,
                height: '100%',
                background: progressColor,
                transition: 'width 0.4s ease',
              }}
            ></div>
          </div>
        )}

        <div className="d-flex align-items-center justify-content-between text-muted small mt-1" style={{ fontSize: '0.72rem' }}>
          <span>{subtitle}</span>
          {trendText && (
            <span
              className="badge font-mono"
              style={{
                background:
                  trendType === 'positive'
                    ? 'rgba(16, 185, 129, 0.12)'
                    : trendType === 'negative'
                    ? 'rgba(244, 63, 94, 0.12)'
                    : 'rgba(255, 255, 255, 0.06)',
                color:
                  trendType === 'positive'
                    ? '#34d399'
                    : trendType === 'negative'
                    ? '#fb7185'
                    : '#a1a1aa',
                fontSize: '0.66rem',
                border: `1px solid ${
                  trendType === 'positive'
                    ? 'rgba(16, 185, 129, 0.25)'
                    : trendType === 'negative'
                    ? 'rgba(244, 63, 94, 0.25)'
                    : 'rgba(255, 255, 255, 0.08)'
                }`,
              }}
            >
              {trendText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
