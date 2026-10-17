import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Gauge, 
  Ticket, 
  ShieldCheck, 
  Zap, 
  Server, 
  Cpu, 
  CheckCircle2, 
  Sparkles,
  Wifi
} from 'lucide-react';

export default function Hero({ onOpenSpeedTest, onOpenRecharge, onSelectPackages }) {
  const [latency, setLatency] = useState(4);
  const [packetCount, setPacketCount] = useState(12480);

  // Live micro-fluctuation for network realism
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => {
        const val = 3 + Math.floor(Math.random() * 3);
        return val;
      });
      setPacketCount(prev => prev + Math.floor(Math.random() * 15) + 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="ambient-glow-top"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Tagline / Network Badge with micro-color gradient border */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 text-xs text-zinc-300 font-mono shadow-sm">
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-2.5 h-2.5" />
            </span>
            <span className="text-zinc-200">Carrier-Grade FTTH Fiber</span>
            <span className="text-zinc-600">•</span>
            <span className="text-cyan-400 font-medium">BDIX 10Gbps Peering</span>
          </div>

          {/* Main Title - Monochrome Minimalist Luxury */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] font-sans">
            Ultra-Low Latency. <br />
            <span className="text-gradient-white">Zero Compromise Internet.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Experience unmetered symmetrical gigabit speeds, direct BDIX core routing, and 99.99% carrier uptime engineered for high-performance home & enterprise users.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={onSelectPackages}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold btn-monochrome-primary cursor-pointer shadow-lg"
            >
              <span>Explore Fiber Packages</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSpeedTest}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold btn-monochrome-outline cursor-pointer"
            >
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span>Simulate Speed Test</span>
            </button>

            <button
              onClick={onOpenRecharge}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold btn-monochrome-outline cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-emerald-400" />
              <span>Quick Recharge</span>
            </button>
          </div>

          {/* Micro-Metrics Live Feed Strip */}
          <div className="pt-10">
            <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-6 py-3 rounded-2xl glass-panel text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot-emerald"></span>
                <span>BDIX Latency:</span>
                <span className="font-mono text-white font-semibold">{latency} ms</span>
              </div>
              <div className="hidden sm:block text-zinc-700">•</div>
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Peak Throughput:</span>
                <span className="font-mono text-white font-semibold">10,000 Mbps</span>
              </div>
              <div className="hidden sm:block text-zinc-700">•</div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Core Uptime:</span>
                <span className="font-mono text-emerald-400 font-semibold">99.99% SLA</span>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Interactive Network Visualizer Card */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl glass-panel-elevated p-6 sm:p-8 relative overflow-hidden border border-white/10">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>NODE: DHK-CORE-ROUTER-01 (MikroTik CCR2004)</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">Live Optical Backbone Telemetry</h2>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 border border-white/5">
                Packets: <span className="text-white font-bold">{packetCount.toLocaleString()}</span>
              </span>
              <span className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 border border-white/5">
                Loss: <span className="text-emerald-400 font-bold">0.00%</span>
              </span>
            </div>
          </div>

          {/* Interactive Topology Stream Graphic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Direct Peering</span>
                <Server className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-xl font-bold font-mono text-white">BDIX / NIX-BD</div>
              <p className="text-xs text-zinc-500">YouTube, Netflix, Facebook local caching enabled</p>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/70 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Last-Mile Connection</span>
                <Cpu className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xl font-bold font-mono text-white">FTTH GPON / EPON</div>
              <p className="text-xs text-zinc-500">Direct optical cable with 1.25G / 2.5G port capacity</p>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/70 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Quality of Service</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-bold font-mono text-white">Low-Jitter Queue</div>
              <p className="text-xs text-zinc-500">Real-time gaming & voice VoIP prioritization</p>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
