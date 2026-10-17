import React, { useState } from 'react';
import { Sliders, Tv, Download, Smartphone, Check, ArrowRight, Zap, ShieldAlert } from 'lucide-react';

export default function BandwidthCalculator({ onOrderCustom }) {
  const [speed, setSpeed] = useState(50); // in Mbps

  // Calculations
  const calculate4kStreams = (s) => Math.max(1, Math.floor(s / 25));
  const calculateDevices = (s) => Math.max(2, Math.floor(s / 6));
  
  // 50 GB game download time in minutes
  const calculateDownloadTime = (s) => {
    // 50GB = 400,000 Megabits. At 's' Mbps:
    const seconds = 400000 / s;
    const minutes = Math.round(seconds / 60);
    if (minutes >= 60) {
      const hours = (minutes / 60).toFixed(1);
      return `${hours} hours`;
    }
    return `${minutes} mins`;
  };

  // Estimated price curve
  const calculatePrice = (s) => {
    if (s <= 25) return 600;
    if (s <= 50) return 1000;
    if (s <= 80) return 1500;
    if (s <= 150) return 2500;
    if (s <= 300) return 4500;
    return Math.round(s * 14);
  };

  const getTierName = (s) => {
    if (s <= 30) return "Home Essential";
    if (s <= 60) return "Family & Streaming";
    if (s <= 120) return "Gamer & Creator";
    return "Enterprise Gigabit";
  };

  return (
    <section id="calculator" className="py-20 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Bandwidth Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tailor Your Perfect Speed.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Drag the slider to match your household device count and see instant real-world streaming & download metrics.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-2xl glass-panel-elevated p-6 sm:p-10 border border-white/10">
          
          {/* Speed Slider Section */}
          <div className="space-y-6 pb-8 border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <span className="text-xs uppercase font-mono text-zinc-400 tracking-wider">Required Bandwidth</span>
                <div className="text-xs text-indigo-400 font-medium mt-0.5">{getTierName(speed)}</div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-extrabold font-mono text-white tracking-tight">{speed}</span>
                <span className="text-sm font-bold font-mono text-cyan-400">Mbps</span>
              </div>
            </div>

            {/* Range Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min="15"
                max="300"
                step="5"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                aria-label="Bandwidth speed slider"
              />
              <div className="flex justify-between text-[11px] font-mono text-zinc-500 pt-1">
                <span>15 Mbps</span>
                <span>75 Mbps</span>
                <span>150 Mbps</span>
                <span>300 Mbps</span>
              </div>
            </div>
          </div>

          {/* Dynamic Metrics Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-8 border-b border-white/10">
            
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-zinc-400 text-xs">
                <Tv className="w-4 h-4 text-cyan-400" />
                <span>4K Ultra HD Streams</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white pt-1">
                {calculate4kStreams(speed)} <span className="text-xs font-normal text-zinc-400">Simultaneous</span>
              </div>
              <p className="text-[11px] text-zinc-500">Smooth 60FPS Netflix, Prime & YouTube</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-zinc-400 text-xs">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>50 GB Game Download</span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400 pt-1">
                ~{calculateDownloadTime(speed)}
              </div>
              <p className="text-[11px] text-zinc-500">Steam, Epic Games & PS5 updates</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-zinc-400 text-xs">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span>Concurrent Devices</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white pt-1">
                {calculateDevices(speed)}+ <span className="text-xs font-normal text-zinc-400">Devices</span>
              </div>
              <p className="text-[11px] text-zinc-500">Laptops, Phones, Smart TVs & IoT</p>
            </div>

          </div>

          {/* Bottom Summary & Order CTA */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-zinc-400">Estimated Monthly Subscription</div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-extrabold font-mono text-white">৳ {calculatePrice(speed).toLocaleString()}</span>
                <span className="text-xs text-zinc-400">/ month</span>
              </div>
            </div>

            <button
              onClick={() => onOrderCustom({
                package: `Custom ${speed} Mbps Plan`,
                price: calculatePrice(speed),
                speed: `${speed} Mbps`
              })}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl btn-monochrome-primary text-sm font-semibold cursor-pointer shadow-lg"
            >
              <span>Connect with {speed} Mbps</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
