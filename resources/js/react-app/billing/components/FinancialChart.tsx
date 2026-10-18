import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { useTheme } from '../useTheme';

export interface FinancialMonthData {
  month: string;
  prev: number;
  curr: number;
  diff: number;
  cumPrev: number;
  cumCurr: number;
}

export interface FinancialChartProps {
  chartData?: FinancialMonthData[];
  maxChartValue?: number;
  formatCurrency: (amount: number) => string;
  formatNumber: (num: number) => string;
}

export default function FinancialChart({
  chartData = [],
  maxChartValue = 1150,
  formatCurrency,
  formatNumber,
}: FinancialChartProps) {
  const { isDark, palette } = useTheme();
  const [chartView, setChartView] = useState<'comparison' | 'difference' | 'cumulative'>('comparison');
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  // Compute fixed 4 grid tick lines
  const ticks = [1, 0.75, 0.5, 0.25, 0];

  return (
    <div
      className="card p-3.5 p-md-4 h-100 d-flex flex-column justify-content-between"
      style={{
        background: 'var(--mono-card)',
        border: '1px solid var(--mono-card-border)',
        borderRadius: 14,
      }}
    >
      {/* Header & Mode Switcher */}
      <div>
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-0.5">
              <BarChart3 size={16} style={{ color: 'var(--mono-text-secondary)' }} />
              <h5 className="fw-bold mb-0" style={{ fontSize: '0.94rem', letterSpacing: '-0.01em', color: 'var(--mono-text-primary)' }}>
                Financial Performance & Cashflow
              </h5>
            </div>
            <p className="small mb-0" style={{ fontSize: '0.76rem', color: 'var(--mono-text-muted)' }}>
              Comparing Previous Years Current Year Revenue Trends (BDT ৳)
            </p>
          </div>

          {/* Segmented Control */}
          <div
            className="d-inline-flex align-items-center p-1 rounded-3"
            style={{
              background: 'var(--mono-surface-elevated)',
              border: '1px solid var(--mono-card-border)',
              borderRadius: 10,
            }}
          >
            {[
              { id: 'comparison' as const, label: 'Monthly Comparison' },
              { id: 'difference' as const, label: 'Growth Delta' },
              { id: 'cumulative' as const, label: 'Cumulative' },
            ].map((btn) => {
              const isActive = chartView === btn.id;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setChartView(btn.id)}
                  className="btn btn-sm border-0 py-1 px-2.5"
                  style={{
                    background: isActive ? (isDark ? '#ffffff' : '#09090b') : 'transparent',
                    color: isActive ? (isDark ? '#09090b' : '#ffffff') : 'var(--mono-text-secondary)',
                    fontSize: '0.72rem',
                    fontWeight: isActive ? 600 : 500,
                    borderRadius: 7,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive SVG Chart */}
        <div className="position-relative w-100" style={{ height: 260 }}>
          <svg className="w-100 h-100" viewBox="0 0 620 240" preserveAspectRatio="none">
            {/* Gridlines & Y-Axis Labels */}
            {ticks.map((pct, i) => {
              const y = 200 - pct * 170;
              return (
                <g key={i}>
                  <line
                    x1="45"
                    y1={y}
                    x2="610"
                    y2={y}
                    stroke={palette.chartGrid}
                    strokeDasharray="3 3"
                  />
                  <text
                    x="38"
                    y={y + 3}
                    textAnchor="end"
                    fill={palette.chartText}
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {formatNumber(Math.round(maxChartValue * pct))}
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {chartData.map((d, i) => {
              const colWidth = 46;
              const x = 54 + i * colWidth;
              const isHovered = hoveredMonth === d.month;

              if (chartView === 'comparison') {
                const prevH = Math.max(2, (d.prev / maxChartValue) * 170);
                const currH = Math.max(2, (d.curr / maxChartValue) * 170);

                return (
                  <g
                    key={d.month}
                    onMouseEnter={() => setHoveredMonth(d.month)}
                    onMouseLeave={() => setHoveredMonth(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {isHovered && (
                      <rect
                        x={x - 2}
                        y="30"
                        width={36}
                        height={175}
                        fill={isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'}
                        rx="4"
                      />
                    )}

                    {/* Previous Year Pill */}
                    <rect
                      x={x}
                      y={200 - prevH}
                      width={13}
                      height={prevH}
                      rx={3}
                      fill={isHovered ? palette.chartPrevBarHover : palette.chartPrevBar}
                    />

                    {/* Current Year Pill */}
                    <rect
                      x={x + 15}
                      y={200 - currH}
                      width={13}
                      height={currH}
                      rx={3}
                      fill={isHovered ? palette.chartCurrBarHover : palette.chartCurrBar}
                    />

                    {/* Month Label */}
                    <text
                      x={x + 14}
                      y="225"
                      textAnchor="middle"
                      fill={isHovered ? 'var(--mono-text-primary)' : 'var(--mono-text-muted)'}
                      fontSize="9.5"
                      fontWeight={isHovered ? '600' : '400'}
                    >
                      {d.month}
                    </text>
                  </g>
                );
              }

              if (chartView === 'difference') {
                const isPositive = d.diff >= 0;
                const diffH = Math.max(3, (Math.abs(d.diff) / maxChartValue) * 170);
                const color = isPositive ? '#10b981' : '#fb7185';

                return (
                  <g
                    key={d.month}
                    onMouseEnter={() => setHoveredMonth(d.month)}
                    onMouseLeave={() => setHoveredMonth(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {isHovered && (
                      <rect
                        x={x - 2}
                        y="30"
                        width={32}
                        height={175}
                        fill={isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'}
                        rx="4"
                      />
                    )}
                    <rect
                      x={x + 4}
                      y={200 - diffH}
                      width={18}
                      height={diffH}
                      rx={3}
                      fill={color}
                      opacity={isHovered ? 1 : 0.85}
                    />
                    <text
                      x={x + 13}
                      y="225"
                      textAnchor="middle"
                      fill={isHovered ? 'var(--mono-text-primary)' : 'var(--mono-text-muted)'}
                      fontSize="9.5"
                      fontWeight={isHovered ? '600' : '400'}
                    >
                      {d.month}
                    </text>
                  </g>
                );
              }

              // Cumulative View
              const prevH = Math.max(2, (d.cumPrev / maxChartValue) * 170);
              const currH = Math.max(2, (d.cumCurr / maxChartValue) * 170);

              return (
                <g
                  key={d.month}
                  onMouseEnter={() => setHoveredMonth(d.month)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {isHovered && (
                    <rect
                      x={x - 2}
                      y="30"
                      width={36}
                      height={175}
                      fill={isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'}
                      rx="4"
                    />
                  )}
                  <rect x={x} y={200 - prevH} width={13} height={prevH} rx={3} fill={palette.chartPrevBar} />
                  <rect x={x + 15} y={200 - currH} width={13} height={currH} rx={3} fill={palette.chartCurrBar} />
                  <text
                    x={x + 14}
                    y="225"
                    textAnchor="middle"
                    fill={isHovered ? 'var(--mono-text-primary)' : 'var(--mono-text-muted)'}
                    fontSize="9.5"
                  >
                    {d.month}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip */}
          {hoveredMonth && (
            (() => {
              const mData = chartData.find((d) => d.month === hoveredMonth);
              if (!mData) return null;
              return (
                <div
                  className="position-absolute p-2.5 shadow-2xl"
                  style={{
                    top: 10,
                    right: 20,
                    background: palette.cardBg,
                    border: `1px solid ${palette.cardBorderHover}`,
                    borderRadius: 12,
                    fontSize: '0.74rem',
                    zIndex: 10,
                    minWidth: 160,
                  }}
                >
                  <div className="fw-bold mb-1.5" style={{ color: 'var(--mono-text-primary)' }}>
                    {mData.month} Overview
                  </div>
                  <div className="d-flex justify-content-between mb-1" style={{ color: 'var(--mono-text-muted)' }}>
                    <span>Prev Year:</span>
                    <span className="font-mono" style={{ color: 'var(--mono-text-primary)' }}>{formatCurrency(mData.prev)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1.5" style={{ color: 'var(--mono-text-muted)' }}>
                    <span>Curr Year:</span>
                    <span className="font-mono" style={{ color: 'var(--mono-text-primary)' }}>{formatCurrency(mData.curr)}</span>
                  </div>
                  <div className="d-flex justify-content-between pt-1 border-top" style={{ borderColor: 'var(--mono-card-border)' }}>
                    <span>Delta:</span>
                    <span className="font-mono" style={{ color: mData.diff >= 0 ? '#10b981' : '#fb7185' }}>
                      {mData.diff >= 0 ? '+' : ''}
                      {formatCurrency(mData.diff)}
                    </span>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </div>

      {/* Legend */}
      <div
        className="d-flex align-items-center justify-content-center gap-4 pt-3 border-top"
        style={{ borderColor: 'var(--mono-card-border)', fontSize: '0.74rem' }}
      >
        <div className="d-flex align-items-center gap-1.5">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: palette.chartPrevBar }} />
          <span style={{ color: 'var(--mono-text-secondary)' }}>Previous Year</span>
        </div>
        <div className="d-flex align-items-center gap-1.5">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: palette.chartCurrBar }} />
          <span style={{ color: 'var(--mono-text-secondary)' }}>Current Year</span>
        </div>
        <div className="d-flex align-items-center gap-1.5">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: isDark ? '#636366' : '#94a3b8' }} />
          <span style={{ color: 'var(--mono-text-secondary)' }}>Growth Spread</span>
        </div>
      </div>
    </div>
  );
}
