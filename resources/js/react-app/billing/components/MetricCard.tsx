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
  badgeColor = '#a1a1aa',
  trendType = 'neutral',
  progressPercent,
  progressColor = '#10b981',
}: MetricCardProps) {
  const displayBadge = badgeText || trendText;
  const isDot = badgeDot || (trendType === 'positive' && !badgeText);
  const resolvedBadgeColor =
    badgeColor !== '#a1a1aa'
      ? badgeColor
      : trendType === 'positive'
      ? '#34d399'
      : trendType === 'negative'
      ? '#fb7185'
      : '#a1a1aa';

  return (
    <div
      className="card p-3.5 h-100 hover-lift d-flex flex-column justify-content-between"
      style={{
        background: 'var(--mono-card)',
        border: '1px solid var(--mono-card-border)',
        borderRadius: 14,
      }}
    >
      {/* Top Row: Title & Icon Container */}
      <div>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="small fw-medium" style={{ fontSize: '0.78rem', color: 'var(--mono-text-muted)' }}>
            {title}
          </span>
          {Icon && (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: 30,
                height: 30,
                background: 'var(--mono-surface-elevated)',
                border: '1px solid var(--mono-card-border)',
                borderRadius: 8,
              }}
            >
              <Icon size={15} style={{ color: 'var(--mono-text-secondary)' }} />
            </div>
          )}
        </div>

        {/* Middle: Big Value */}
        <div
          className="fw-bold font-mono mb-2"
          style={{ fontSize: '1.45rem', letterSpacing: '-0.02em', lineHeight: 1.1, color: 'var(--mono-text-primary)' }}
        >
          {value}
        </div>

        {/* Optional Progress Bar */}
        {progressPercent !== undefined && progressPercent !== null && (
          <div className="rounded-pill overflow-hidden my-2" style={{ height: 4, background: 'var(--mono-surface-elevated)' }}>
            <div
              style={{
                width: `${Math.min(100, Math.max(4, Number(progressPercent)))}%`,
                height: '100%',
                background: progressColor,
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        )}
      </div>

      {/* Bottom Row: Subtitle & Tag Badge */}
      <div
        className="d-flex align-items-center justify-content-between pt-1"
        style={{ fontSize: '0.74rem' }}
      >
        <span className="text-truncate me-1" style={{ color: 'var(--mono-text-muted)' }}>
          {subtitle}
        </span>

        {displayBadge && (
          <span
            className="badge d-inline-flex align-items-center gap-1 font-mono flex-shrink-0"
            style={{
              background: 'var(--mono-surface-elevated)',
              color: resolvedBadgeColor,
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
                  background: resolvedBadgeColor === '#34d399' ? '#10b981' : resolvedBadgeColor,
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
