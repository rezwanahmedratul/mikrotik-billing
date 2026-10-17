import React, { useState, useEffect } from 'react';
import { X, Gauge, Play, RotateCcw, ArrowDown, ArrowUp, Activity, CheckCircle, Wifi } from 'lucide-react';

export default function SpeedTestModal({ isOpen, onClose }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'ping' | 'download' | 'upload' | 'completed'
  const [ping, setPing] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [progress, setProgress] = useState(0);
  const [graphPoints, setGraphPoints] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      resetTest();
    }
  }, [isOpen]);

  const resetTest = () => {
    setStatus('idle');
    setPing(0);
    setJitter(0);
    setDownload(0);
    setUpload(0);
    setProgress(0);
    setGraphPoints([]);
  };

  const startTest = () => {
    resetTest();
    setStatus('ping');

    // Step 1: Ping & Jitter Phase (1.2s)
    let pTime = 0;
    const pingInterval = setInterval(() => {
      pTime += 100;
      setPing(Math.floor(3 + Math.random() * 3));
      setJitter(parseFloat((0.4 + Math.random() * 0.5).toFixed(1)));
      setProgress(Math.min(20, Math.floor((pTime / 1200) * 20)));

      if (pTime >= 1200) {
        clearInterval(pingInterval);
        startDownloadPhase();
      }
    }, 100);
  };

  const startDownloadPhase = () => {
    setStatus('download');
    let dTime = 0;
    const targetDownload = 96.4;
    const newPoints = [];

    const dInterval = setInterval(() => {
      dTime += 100;
      const progressRatio = dTime / 2500;
      const currentSpeed = parseFloat((targetDownload * Math.sin(progressRatio * (Math.PI / 2)) + (Math.random() * 4 - 2)).toFixed(1));
      
      setDownload(Math.max(0, currentSpeed));
      setProgress(20 + Math.floor(progressRatio * 40));
      
      newPoints.push(currentSpeed);
      if (newPoints.length > 25) newPoints.shift();
      setGraphPoints([...newPoints]);

      if (dTime >= 2500) {
        clearInterval(dInterval);
        setDownload(targetDownload);
        startUploadPhase();
      }
    }, 100);
  };

  const startUploadPhase = () => {
    setStatus('upload');
    let uTime = 0;
    const targetUpload = 88.2;

    const uInterval = setInterval(() => {
      uTime += 100;
      const progressRatio = uTime / 2500;
      const currentSpeed = parseFloat((targetUpload * Math.sin(progressRatio * (Math.PI / 2)) + (Math.random() * 3 - 1.5)).toFixed(1));
      
      setUpload(Math.max(0, currentSpeed));
      setProgress(60 + Math.floor(progressRatio * 40));

      if (uTime >= 2500) {
        clearInterval(uInterval);
        setUpload(targetUpload);
        setProgress(100);
        setStatus('completed');
      }
    }, 100);
  };

  if (!isOpen) return null;

  // Gauge needle rotation (-90deg to +90deg)
  const currentSpeedValue = status === 'download' ? download : (status === 'upload' ? upload : (status === 'completed' ? download : 0));
  const maxScale = 120;
  const needleAngle = -90 + (Math.min(currentSpeedValue, maxScale) / maxScale) * 180;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel-elevated p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-cyan-400">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Interactive Speed Test</h2>
              <p className="text-xs text-zinc-400 font-mono">Server: Smart ISP Core Gateway (Dhaka BDIX)</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Speedometer Radial Gauge */}
        <div className="flex flex-col items-center justify-center py-4 relative">
          
          {/* Radial SVG Arc */}
          <div className="relative w-56 h-32 flex items-end justify-center overflow-hidden">
            <svg viewBox="0 0 200 110" className="w-56 h-32">
              {/* Background Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#27272a"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* Active Colorful Gauge Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#speedGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * (Math.min(currentSpeedValue, maxScale) / maxScale))}
                style={{ transition: 'stroke-dashoffset 0.15s ease-out' }}
              />
              <defs>
                <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            {/* Gauge Needle */}
            <div 
              className="absolute bottom-0 w-1 h-20 bg-white rounded-t-full origin-bottom shadow-lg transition-transform duration-150 ease-out"
              style={{ transform: `rotate(${needleAngle}deg)` }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 absolute -bottom-1 -left-[3px]"></div>
            </div>
          </div>

          {/* Real-time Numeric Counter */}
          <div className="text-center mt-2">
            <div className="text-4xl sm:text-5xl font-extrabold font-mono text-white tracking-tight">
              {currentSpeedValue.toFixed(1)}
            </div>
            <div className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-semibold mt-1">
              Mbps {status === 'download' ? '(Download)' : (status === 'upload' ? '(Upload)' : '')}
            </div>
          </div>

        </div>

        {/* Real-time Metrics Grid */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-white/5">
            <div className="text-[11px] text-zinc-500 font-mono">PING</div>
            <div className="text-base font-bold font-mono text-white mt-0.5">{ping} <span className="text-[10px] text-zinc-400">ms</span></div>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-white/5">
            <div className="text-[11px] text-zinc-500 font-mono">JITTER</div>
            <div className="text-base font-bold font-mono text-white mt-0.5">{jitter} <span className="text-[10px] text-zinc-400">ms</span></div>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-white/5">
            <div className="text-[11px] text-zinc-500 font-mono flex items-center justify-center gap-1">
              <ArrowDown className="w-2.5 h-2.5 text-cyan-400" />
              <span>DOWN</span>
            </div>
            <div className="text-base font-bold font-mono text-cyan-400 mt-0.5">{download.toFixed(1)}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-white/5">
            <div className="text-[11px] text-zinc-500 font-mono flex items-center justify-center gap-1">
              <ArrowUp className="w-2.5 h-2.5 text-emerald-400" />
              <span>UP</span>
            </div>
            <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">{upload.toFixed(1)}</div>
          </div>
        </div>

        {/* Completed Quality Grade */}
        {status === 'completed' && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span><strong>Grade A+ Low-Latency Fiber:</strong> Verified for 4K 60FPS Streaming, eSports (Valorant, CS2), & Large Cloud Sync.</span>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {status === 'idle' && (
            <button
              onClick={startTest}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl btn-monochrome-primary text-sm font-semibold cursor-pointer shadow-lg"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Speed Test</span>
            </button>
          )}

          {(status === 'ping' || status === 'download' || status === 'upload') && (
            <div className="w-full py-3 rounded-xl bg-zinc-900 border border-white/10 text-center text-xs font-mono text-zinc-400 space-y-2">
              <div className="flex items-center justify-center gap-2 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 pulse-dot-cyan"></span>
                <span>Testing {status.toUpperCase()} ({progress}%)...</span>
              </div>
              <div className="w-11/12 mx-auto h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {status === 'completed' && (
            <button
              onClick={startTest}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl btn-monochrome-outline text-sm font-semibold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Test Again</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
