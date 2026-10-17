import React, { useState } from 'react';
import { Check, ArrowRight, Zap, Sparkles, Shield, Wifi } from 'lucide-react';

export default function PackageSection({ packages = [], onSelectPackage, onShowAllPackages }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'home' | 'gamer' | 'corporate'

  const filteredPackages = packages.filter(pkg => {
    if (filter === 'all') return true;
    if (pkg.category) return pkg.category === filter;
    // Fallback keyword filter
    const name = (pkg.package || pkg.plan_label || '').toLowerCase();
    if (filter === 'gamer') return name.includes('gamer') || name.includes('gaming') || name.includes('pro');
    if (filter === 'corporate') return name.includes('corporate') || name.includes('enterprise') || name.includes('sme');
    return !name.includes('gamer') && !name.includes('corporate');
  });

  return (
    <section id="packages" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Unmetered High-Speed Plans</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Transparent, Gigabit Pricing.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Symmetrical bandwidth, dedicated BDIX cache, zero data caps, and 24/7 dedicated local field assistance.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-4">
            {[
              { id: 'all', label: 'All Packages' },
              { id: 'home', label: 'Residential Fiber' },
              { id: 'gamer', label: 'Ultra Low-Ping Gamer' },
              { id: 'corporate', label: 'Corporate & SME' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  filter === tab.id
                    ? 'bg-white text-zinc-950 shadow-md'
                    : 'bg-zinc-900/80 text-zinc-400 border border-white/5 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPackages.map((pkg, idx) => {
            const isFeatured = pkg.is_featured || idx === 1;
            const features = Array.isArray(pkg.features) ? pkg.features : (
              pkg.features ? JSON.parse(pkg.features) : [
                `${pkg.speed || 'High Speed'} Symmetrical`,
                "BDIX 100Mbps Turbo Cache",
                "Zero Data Caps & Unlimited FUP",
                "Optical Fiber Direct to Home",
                "24/7 Priority Support"
              ]
            );

            return (
              <div
                key={pkg.id || idx}
                className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
                  isFeatured 
                    ? 'glass-panel-elevated border-white/25 shadow-2xl scale-[1.02] ring-1 ring-white/10' 
                    : 'glass-card border-white/10'
                }`}
              >
                {/* Badge if featured or custom badge */}
                {(isFeatured || pkg.accent_badge) && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-gradient-to-r from-cyan-400 to-indigo-500 text-zinc-950 shadow-lg">
                      {pkg.accent_badge || 'MOST POPULAR'}
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Plan Name & Tagline */}
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      {pkg.plan_label || "FIBER BROADBAND"}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      {pkg.package}
                    </h3>
                  </div>

                  {/* Speed Badge */}
                  <div className="p-3 rounded-xl bg-zinc-950/70 border border-white/5 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Bandwidth</span>
                    <span className="text-lg font-extrabold font-mono text-cyan-400">
                      {pkg.speed}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 pt-1">
                    <span className="text-3xl font-extrabold font-mono text-white">
                      ৳ {parseFloat(pkg.price || 0).toLocaleString()}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">/ month</span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed min-h-[36px]">
                    {pkg.description || "High-performance uninterrupted optical connection."}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 pt-2 border-t border-white/10 text-xs">
                    {features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-zinc-300">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                        </span>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-6">
                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
                      isFeatured 
                        ? 'btn-monochrome-primary shadow-lg' 
                        : 'btn-monochrome-outline hover:bg-white hover:text-zinc-950'
                    }`}
                  >
                    <span>Get Connected</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* View All Packages Footer CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={onShowAllPackages}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-monochrome-outline text-xs font-semibold hover:border-white/40 cursor-pointer"
          >
            <span>View Full Package Catalog & Feature Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
