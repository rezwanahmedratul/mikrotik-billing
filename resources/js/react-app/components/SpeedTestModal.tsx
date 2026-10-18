import React, { useState, useEffect } from 'react';
import { X, Gauge, Play, RotateCcw, ArrowDown, ArrowUp } from 'lucide-react';

export interface SpeedTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpeedTestModal: React.FC<SpeedTestModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<'idle' | 'ping' | 'download' | 'upload' | 'completed'>('idle');
  const [ping, setPing] = useState<number>(0);
  const [jitter, setJitter] = useState<number>(0);
  const [download, setDownload] = useState<number>(0);
  const [upload, setUpload] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      resetTest();
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const resetTest = () => {
    setStatus('idle');
    setPing(0);
    setJitter(0);
    setDownload(0);
    setUpload(0);
    setProgress(0);
  };

  const startTest = () => {
    resetTest();
    setStatus('ping');

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

    const dInterval = setInterval(() => {
      dTime += 100;
      const progressRatio = dTime / 2500;
      const currentSpeed = parseFloat(
        (targetDownload * Math.sin(progressRatio * (Math.PI / 2)) + (Math.random() * 4 - 2)).toFixed(1)
      );

      setDownload(Math.max(0, currentSpeed));
      setProgress(20 + Math.floor(progressRatio * 40));

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
      const currentSpeed = parseFloat(
        (targetUpload * Math.sin(progressRatio * (Math.PI / 2)) + (Math.random() * 3 - 1.5)).toFixed(1)
      );

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

  const currentSpeedValue =
    status === 'download'
      ? download
      : status === 'upload'
      ? upload
      : status === 'completed'
      ? download
      : 0;
  const maxScale = 120;
  const needleAngle = -90 + (Math.min(currentSpeedValue, maxScale) / maxScale) * 180;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl saas-card p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-sans">Interactive Speed Test</h2>
              <p className="text-xs text-zinc-400 font-mono">Server: Smart ISP Core Gateway (Dhaka BDIX)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Speedometer Radial Gauge */}
        <div className="flex flex-col items-center justify-center py-4 relative">
          <div className="relative w-56 h-32 flex items-end justify-center overflow-hidden">
            <svg viewBox="0 0 200 110" className="w-56 h-32">
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#27272a"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#speedGradientMono)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - 251.2 * (Math.min(currentSpeedValue, maxScale) / maxScale)}
                style={{ transition: 'stroke-dashoffset 0.15s ease-out' }}
              />
              <defs>
                <linearGradient id="speedGradientMono" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#71717a" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>

            {/* Gauge Needle */}
            <div
              className="absolute bottom-0 w-1 h-20 bg-white rounded-t-full origin-bottom shadow-lg transition-transform duration-150 ease-out"
              style={{ transform: `rotate(${needleAngle}deg)` }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white absolute -bottom-1 -left-[3px]"></div>
            </div>
          </div>

          {/* Real-time Numeric Counter */}
          <div className="text-center mt-2">
            <div className="text-4xl sm:text-5xl font-extrabold font-mono text-white tracking-tight">
              {currentSpeedValue.toFixed(1)}
            </div>
            <div className="text-xs uppercase tracking-widest font-mono text-zinc-400 font-semibold mt-1">
              Mbps {status === 'download' ? '(Download)' : status === 'upload' ? '(Upload)' : ''}
            </div>
          </div>
        </div>

        {/* Real-time Metrics Grid */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-white/5">
            <div className="text-[11px] text-zinc-500 font-mono">PING</div>
            <div className="text-base font-bold font-mono text-white mt-0.5">
              {ping} <span className="text-[10px] text-zinc-400">ms</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-white/5">
            <div className="text-[11px] text-zinc-500 font-mono">JITTER</div>
            <div className="text-base font-bold font-mono text-white mt-0.5">
              {jitter} <span className="text-[10px] text-zinc-400">ms</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-white/5">
            <div className="text-[11px] text-zinc-500 font-mono flex items-center justify-center gap-1">
              <ArrowDown className="w-2.5 h-2.5 text-zinc-400" />
              <span>DOWN</span>
            </div>
            <div className="text-base font-bold font-mono text-white mt-0.5">{download.toFixed(1)}</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-white/5">
            <div className="text-[11px] text-zinc-500 font-mono flex items-center justify-center gap-1">
              <ArrowUp className="w-2.5 h-2.5 text-zinc-400" />
              <span>UP</span>
            </div>
            <div className="text-base font-bold font-mono text-white mt-0.5">{upload.toFixed(1)}</div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          {status === 'idle' && (
            <button
              onClick={startTest}
              className="saas-btn-primary w-full"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Speed Test</span>
            </button>
          )}

          {(status === 'ping' || status === 'download' || status === 'upload') && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-zinc-400">
                <span>Testing {status.toUpperCase()}...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-150 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {status === 'completed' && (
            <button
              onClick={startTest}
              className="saas-btn-secondary w-full"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Test Connection Again</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeedTestModal;
