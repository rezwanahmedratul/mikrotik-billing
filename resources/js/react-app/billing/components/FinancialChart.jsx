import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';

export default function FinancialChart({ chartData = [], maxChartValue = 1000, formatCurrency, formatNumber }) {
  const [chartView, setChartView] = useState('comparison'); // 'comparison', 'difference', 'cumulative'
  const [hoveredMonth, setHoveredMonth] = useState(null);

  return (
    <div
      className="card p-3.5 p-md-4 h-100"
      style={{ background: '#121216', border: '1px solid rgba(255, 255, 255, 0.08)' }}
    >
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            <BarChart3 size={18} style={{ color: '#38bdf8' }} />
            <h5 className="fw-bold mb-0 text-white" style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}>
              Financial Performance & Cashflow
            </h5>
          </div>
          <p className="small text-muted mb-0" style={{ fontSize: '0.78rem' }}>
            Comparing Previous Year vs Current Year Revenue Trends (BDT ৳)
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="btn-group btn-group-sm" role="group">
          <button
            type="button"
            className={`btn btn-sm ${chartView === 'comparison' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setChartView('comparison')}
            style={{ fontSize: '0.75rem' }}
          >
            Monthly Comparison
          </button>
          <button
            type="button"
            className={`btn btn-sm ${chartView === 'difference' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setChartView('difference')}
            style={{ fontSize: '0.75rem' }}
          >
            Growth Delta
          </button>
          <button
            type="button"
            className={`btn btn-sm ${chartView === 'cumulative' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setChartView('cumulative')}
            style={{ fontSize: '0.75rem' }}
          >
            Cumulative
          </button>
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div className="position-relative w-100" style={{ height: 260 }}>
        <svg className="w-100 h-100" viewBox="0 0 600 240" preserveAspectRatio="none">
          {/* Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = 200 - pct * 170;
            return (
              <g key={i}>
                <line
                  x1="30"
                  y1={y}
                  x2="590"
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="3 3"
                />
                <text
                  x="25"
                  y={y + 3}
                  textAnchor="end"
                  fill="#52525b"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {formatNumber(maxChartValue * pct)}
                </text>
              </g>
            );
          })}

          {/* Bars / Lines */}
          {chartData.map((d, i) => {
            const colWidth = 46;
            const x = 40 + i * colWidth;
            const isHovered = hoveredMonth === d.month;

            if (chartView === 'comparison') {
              const prevH = Math.max(3, (d.prev / maxChartValue) * 170);
              const currH = Math.max(3, (d.curr / maxChartValue) * 170);

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
                      width={38}
                      height={175}
                      fill="rgba(255, 255, 255, 0.04)"
                      rx="4"
                    />
                  )}
                  <rect
                    x={x}
                    y={200 - prevH}
                    width={14}
                    height={prevH}
                    rx={3}
                    fill={isHovered ? '#52525b' : '#3f3f46'}
                    opacity={0.8}
                  />
                  <rect
                    x={x + 16}
                    y={200 - currH}
                    width={14}
                    height={currH}
                    rx={3}
                    fill={isHovered ? '#38bdf8' : '#0ea5e9'}
                    opacity={0.95}
                  />
                  <text
                    x={x + 15}
                    y={225}
                    textAnchor="middle"
                    fill={isHovered ? '#ffffff' : '#71717a'}
                    fontSize="10"
                    fontWeight={isHovered ? '600' : '400'}
                  >
                    {d.month}
                  </text>
                </g>
              );
            }

            if (chartView === 'difference') {
              const isPositive = d.diff >= 0;
              const diffH = Math.max(4, (Math.abs(d.diff) / maxChartValue) * 170);
              const color = isPositive ? '#10b981' : '#f43f5e';

              return (
                <g
                  key={d.month}
                  onMouseEnter={() => setHoveredMonth(d.month)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {isHovered && (
                    <rect
                      x={x - 4}
                      y="30"
                      width={34}
                      height={175}
                      fill="rgba(255, 255, 255, 0.04)"
                      rx="4"
                    />
                  )}
                  <rect
                    x={x + 3}
                    y={200 - diffH}
                    width={20}
                    height={diffH}
                    rx={3}
                    fill={color}
                    opacity={isHovered ? 1 : 0.8}
                  />
                  <text
                    x={x + 13}
                    y={225}
                    textAnchor="middle"
                    fill={isHovered ? '#ffffff' : '#71717a'}
                    fontSize="10"
                  >
                    {d.month}
                  </text>
                </g>
              );
            }

            // Cumulative View
            const prevH = Math.max(3, (d.cumPrev / maxChartValue) * 170);
            const currH = Math.max(3, (d.cumCurr / maxChartValue) * 170);

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
                    width={38}
                    height={175}
                    fill="rgba(255, 255, 255, 0.04)"
                    rx="4"
                  />
                )}
                <rect x={x} y={200 - prevH} width={14} height={prevH} rx={3} fill="#3f3f46" />
                <rect x={x + 16} y={200 - currH} width={14} height={currH} rx={3} fill="#10b981" />
                <text
                  x={x + 15}
                  y={225}
                  textAnchor="middle"
                  fill={isHovered ? '#ffffff' : '#71717a'}
                  fontSize="10"
                >
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip on Hover */}
        {hoveredMonth && (
          (() => {
            const mData = chartData.find((d) => d.month === hoveredMonth);
            if (!mData) return null;
            return (
              <div
                className="position-absolute p-2.5 rounded-2 shadow-xl"
                style={{
                  top: 10,
                  right: 20,
                  background: '#1c1c24',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '0.75rem',
                  zIndex: 10,
                  minWidth: 160,
                }}
              >
                <div className="fw-bold text-white mb-1">{mData.month} Overview</div>
                <div className="d-flex justify-content-between text-muted mb-0.5">
                  <span>Prev Year:</span>
                  <span className="text-white font-mono">{formatCurrency(mData.prev)}</span>
                </div>
                <div className="d-flex justify-content-between text-muted mb-1">
                  <span>Curr Year:</span>
                  <span className="text-white font-mono" style={{ color: '#38bdf8' }}>
                    {formatCurrency(mData.curr)}
                  </span>
                </div>
                <div className="d-flex justify-content-between pt-1 border-top border-secondary border-opacity-25">
                  <span>Delta:</span>
                  <span className="font-mono" style={{ color: mData.diff >= 0 ? '#34d399' : '#fb7185' }}>
                    {mData.diff >= 0 ? '+' : ''}
                    {formatCurrency(mData.diff)}
                  </span>
                </div>
              </div>
            );
          })()
        )}
      </div>

      {/* Legend */}
      <div
        className="d-flex align-items-center justify-content-center gap-4 mt-3 pt-3 border-top"
        style={{ borderColor: 'rgba(255, 255, 255, 0.06)', fontSize: '0.78rem' }}
      >
        <div className="d-flex align-items-center gap-2">
          <span style={{ width: 10, height: 10, borderRadius: 2, background: '#3f3f46' }}></span>
          <span className="text-muted">Previous Year</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span style={{ width: 10, height: 10, borderRadius: 2, background: '#0ea5e9' }}></span>
          <span className="text-muted">Current Year</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span style={{ width: 10, height: 10, borderRadius: 2, background: '#10b981' }}></span>
          <span className="text-muted">Growth Spread</span>
        </div>
      </div>
    </div>
  );
}
