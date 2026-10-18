import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: LucideIcon | React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>;
  badgeText?: string;
  trendText?: string;
  badgeDot?: boolean;
  badgeColor?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  progressPercent?: number;
  progressColor?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  trendText,
  badgeDot = false,
  trendType = 'neutral',
  progressPercent,
}: MetricCardProps) {
  const displayBadge = badgeText || trendText;
  const isDot = badgeDot || trendType === 'positive';

  return (
    <div
      className="card p-4 h-100 d-flex flex-column justify-content-between transition-all"
      style={{
        background: 'var(--mono-card)',
        border: '1px solid var(--mono-card-border)',
        borderRadius: 14,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = 'var(--mono-card-border-hover)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.borderColor = 'var(--mono-card-border)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
      }}
    >
      {/* ── TOP ROW: TITLE & MINIMAL MONOCHROME ICON ── */}
      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span
            className="fw-semibold text-truncate pe-2"
            style={{
              fontSize: '0.82rem',
              color: 'var(--mono-text-secondary)',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </span>
          {Icon && (
            <div
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: 32,
                height: 32,
                background: 'var(--mono-surface-elevated)',
                border: '1px solid var(--mono-card-border)',
                borderRadius: 8,
                color: 'var(--mono-text-primary)',
              }}
            >
              <Icon size={15} />
            </div>
          )}
        </div>

        {/* ── MIDDLE: HERO VALUE ── */}
        <div
          className="fw-bold font-mono mb-3"
          style={{
            fontSize: '1.75rem',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            color: 'var(--mono-text-primary)',
          }}
        >
          {value}
        </div>

        {/* Optional Progress Bar */}
        {progressPercent !== undefined && progressPercent !== null && (
          <div
            className="rounded-pill overflow-hidden my-2.5"
            style={{
              height: 4,
              background: 'var(--mono-surface-elevated)',
              border: '1px solid var(--mono-card-border)',
            }}
          >
            <div
              style={{
                width: `${Math.min(100, Math.max(4, Number(progressPercent)))}%`,
                height: '100%',
                background: 'var(--mono-text-primary)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        )}
      </div>

      {/* ── BOTTOM ROW: SUBTITLE & MINIMAL MONOCHROME STATUS BADGE ── */}
      <div
        className="d-flex align-items-center justify-content-between pt-2 border-top"
        style={{
          borderColor: 'var(--mono-card-border)',
          fontSize: '0.76rem',
        }}
      >
        <span
          className="text-truncate me-2"
          style={{
            color: 'var(--mono-text-muted)',
            fontWeight: 400,
          }}
        >
          {subtitle}
        </span>

        {displayBadge && (
          <span
            className="badge d-inline-flex align-items-center gap-1.5 font-mono flex-shrink-0"
            style={{
              background: 'var(--mono-surface-elevated)',
              color: 'var(--mono-text-secondary)',
              border: '1px solid var(--mono-card-border)',
              fontSize: '0.68rem',
              fontWeight: 500,
              padding: '3px 8px',
              borderRadius: 6,
            }}
          >
            {isDot && (
              <span
                style={{
                  display: 'inline-block',
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: 'var(--mono-text-primary)',
                }}
              />
            )}
            {displayBadge}
          </span>
        )}
      </div>
    </div>
  );
}
