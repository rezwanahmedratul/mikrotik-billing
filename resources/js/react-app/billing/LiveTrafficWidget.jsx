import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowDownCircle,
  ArrowUpCircle,
  Pause,
  Play,
  RefreshCw,
  Sliders,
  Wifi,
} from 'lucide-react';

export default function LiveTrafficWidget({ routers = [], initialRouter = null, interfaces = [] }) {
  const [selectedRouter, setSelectedRouter] = useState(
    initialRouter || routers.find((r) => r.is_connected)?.router_name || routers[0]?.router_name || ''
  );
  const [selectedInterface, setSelectedInterface] = useState(interfaces[0] || 'ether1');
  const [isPaused, setIsPaused] = useState(false);
  const [history, setHistory] = useState(() => Array.from({ length: 25 }, () => ({ rx: 0, tx: 0 })));
  const [currentSpeed, setCurrentSpeed] = useState({ rx: 0, tx: 0, rx_mbps: 0, tx_mbps: 0 });
  const [peakSpeed, setPeakSpeed] = useState({ rx: 0, tx: 0 });

  const pollIntervalRef = useRef(null);

  // When router changes, reset interface
  useEffect(() => {
    if (selectedRouter) {
      fetchInterfacesForRouter(selectedRouter);
    }
  }, [selectedRouter]);

  // Polling effect
  useEffect(() => {
    if (!selectedRouter || !selectedInterface || isPaused) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      return;
    }

    const fetchTraffic = async () => {
      try {
        const res = await fetch(
          `/billing/api/mikrotik/live-traffic?router_name=${encodeURIComponent(selectedRouter)}&interface=${encodeURIComponent(selectedInterface)}`,
          {
            headers: {
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
          }
        );
        const data = await res.json();
        if (data.success) {
          const rx = data.rx_bps || 0;
          const tx = data.tx_bps || 0;
          const rx_mbps = data.rx_mbps || 0;
          const tx_mbps = data.tx_mbps || 0;

          setCurrentSpeed({ rx, tx, rx_mbps, tx_mbps });

          setPeakSpeed((prev) => ({
            rx: Math.max(prev.rx, rx_mbps),
            tx: Math.max(prev.tx, tx_mbps),
          }));

          setHistory((prev) => {
            const next = [...prev.slice(1), { rx: rx_mbps, tx: tx_mbps }];
            return next;
          });
        }
      } catch (err) {
        // silent polling catch
      }
    };

    fetchTraffic();
    pollIntervalRef.current = setInterval(fetchTraffic, 2000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [selectedRouter, selectedInterface, isPaused]);

  const [availableInterfaces, setAvailableInterfaces] = useState(interfaces);

  const fetchInterfacesForRouter = async (rName) => {
    // If interfaces passed from parent, use them as default, otherwise fallback
    if (interfaces.length > 0) {
      setAvailableInterfaces(interfaces);
      if (!interfaces.includes(selectedInterface)) {
        setSelectedInterface(interfaces[0]);
      }
    }
  };

  const formatSpeed = (mbps) => {
    if (mbps >= 1000) {
      return `${(mbps / 1000).toFixed(2)} Gbps`;
    }
    if (mbps >= 1) {
      return `${mbps.toFixed(2)} Mbps`;
    }
    return `${Math.round(mbps * 1000)} Kbps`;
  };

  // SVG Chart points calculation
  const maxVal = Math.max(...history.map((d) => Math.max(d.rx, d.tx)), 10) * 1.2;
  const width = 600;
  const height = 140;

  const getPoints = (key) => {
    return history
      .map((d, i) => {
        const x = (i / (history.length - 1)) * width;
        const y = height - (d[key] / maxVal) * (height - 20) - 10;
        return `${x},${y}`;
      })
      .join(' ');
  };

  const rxPoints = getPoints('rx');
  const txPoints = getPoints('tx');

  const rxAreaPoints = `0,${height} ${rxPoints} ${width},${height}`;
  const txAreaPoints = `0,${height} ${txPoints} ${width},${height}`;

  return (
    <div
      className="card p-3.5 p-md-4 mb-4"
      style={{
        background: '#111115',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
      }}
    >
      {/* Top Header & Interface selector */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
        <div className="d-flex align-items-center gap-2.5">
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{ width: 36, height: 36, background: '#16161c', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            <Activity size={17} style={{ color: '#d1d1d6' }} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="fw-bold mb-0 text-white" style={{ fontSize: '0.96rem', letterSpacing: '-0.01em' }}>
                Live Interface Bandwidth Monitor
              </h5>
              {!isPaused && (
                <span
                  className="badge font-mono"
                  style={{
                    background: '#18181f',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    fontSize: '0.68rem',
                    borderRadius: 5,
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: '#38bdf8',
                      boxShadow: '0 0 6px #38bdf8',
                      marginRight: 4,
                    }}
                  ></span>
                  Streaming
                </span>
              )}
            </div>
            <p className="small mb-0" style={{ fontSize: '0.76rem', color: '#71717a' }}>
              Real-time traffic telemetry via RouterOS socket monitor
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="d-flex flex-wrap align-items-center gap-2">
          {routers.length > 1 && (
            <select
              className="form-select form-select-sm"
              value={selectedRouter}
              onChange={(e) => setSelectedRouter(e.target.value)}
              style={{
                width: 'auto',
                fontSize: '0.78rem',
                background: '#16161c',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: '#fafafa',
                borderRadius: 8,
              }}
            >
              {routers.map((r) => (
                <option key={r.id || r.router_name} value={r.router_name}>
                  {r.router_name}
                </option>
              ))}
            </select>
          )}

          <select
            className="form-select form-select-sm font-mono"
            value={selectedInterface}
            onChange={(e) => setSelectedInterface(e.target.value)}
            style={{
              width: 'auto',
              fontSize: '0.78rem',
              background: '#16161c',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fafafa',
              borderRadius: 8,
            }}
          >
            {availableInterfaces.map((ifName) => (
              <option key={ifName} value={ifName}>
                {ifName}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="btn btn-sm d-inline-flex align-items-center gap-1.5 px-3 py-1.5"
            style={{
              background: '#16161b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#e4e4e7',
              borderRadius: 8,
              fontSize: '0.8rem',
            }}
            title={isPaused ? 'Resume live stream' : 'Pause live stream'}
          >
            {isPaused ? <Play size={13} style={{ color: '#10b981' }} /> : <Pause size={13} />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
        </div>
      </div>

      {/* Speed Metrics Pills */}
      <div className="row g-2 mb-3">
        <div className="col-6 col-md-3">
          <div
            className="p-2.5 rounded-3 d-flex align-items-center justify-content-between"
            style={{ background: '#16161c', border: '1px solid rgba(255, 255, 255, 0.06)' }}
          >
            <div className="d-flex align-items-center gap-2">
              <ArrowDownCircle size={16} style={{ color: '#10b981' }} />
              <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                Rx (Download)
              </span>
            </div>
            <span className="font-mono fw-bold text-white" style={{ fontSize: '0.88rem' }}>
              {formatSpeed(currentSpeed.rx_mbps)}
            </span>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div
            className="p-2.5 rounded-3 d-flex align-items-center justify-content-between"
            style={{ background: '#16161c', border: '1px solid rgba(255, 255, 255, 0.06)' }}
          >
            <div className="d-flex align-items-center gap-2">
              <ArrowUpCircle size={16} style={{ color: '#38bdf8' }} />
              <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                Tx (Upload)
              </span>
            </div>
            <span className="font-mono fw-bold text-white" style={{ fontSize: '0.88rem' }}>
              {formatSpeed(currentSpeed.tx_mbps)}
            </span>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div
            className="p-2.5 rounded-3 d-flex align-items-center justify-content-between"
            style={{ background: '#16161c', border: '1px solid rgba(255, 255, 255, 0.06)' }}
          >
            <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
              Peak Rx
            </span>
            <span className="font-mono text-muted" style={{ fontSize: '0.8rem' }}>
              {formatSpeed(peakSpeed.rx)}
            </span>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div
            className="p-2.5 rounded-3 d-flex align-items-center justify-content-between"
            style={{ background: '#16161c', border: '1px solid rgba(255, 255, 255, 0.06)' }}
          >
            <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
              Peak Tx
            </span>
            <span className="font-mono text-muted" style={{ fontSize: '0.8rem' }}>
              {formatSpeed(peakSpeed.tx)}
            </span>
          </div>
        </div>
      </div>

      {/* Real-time SVG Area Waveform Graph */}
      <div className="position-relative w-100 rounded-3 overflow-hidden" style={{ height: 140, background: '#0e0e12' }}>
        <svg className="w-100 h-100" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="rxGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="txGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Gridlines */}
          {[0.25, 0.5, 0.75].map((pct, i) => {
            const y = height - pct * (height - 20) - 10;
            return (
              <line
                key={i}
                x1="0"
                y1={y}
                x2={width}
                y2={y}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Rx Area & Line */}
          <polygon points={rxAreaPoints} fill="url(#rxGradient)" />
          <polyline points={rxPoints} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />

          {/* Tx Area & Line */}
          <polygon points={txAreaPoints} fill="url(#txGradient)" />
          <polyline points={txPoints} fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
        </svg>

        {/* Legend Overlay */}
        <div
          className="position-absolute d-flex align-items-center gap-3 p-1.5 px-2.5 rounded-2"
          style={{
            top: 8,
            right: 12,
            background: 'rgba(18, 18, 24, 0.75)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.72rem',
          }}
        >
          <div className="d-flex align-items-center gap-1.5">
            <span style={{ width: 8, height: 2, background: '#10b981' }}></span>
            <span className="text-muted">Rx (In)</span>
          </div>
          <div className="d-flex align-items-center gap-1.5">
            <span style={{ width: 8, height: 2, background: '#38bdf8' }}></span>
            <span className="text-muted">Tx (Out)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
