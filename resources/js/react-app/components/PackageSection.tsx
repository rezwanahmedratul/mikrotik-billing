import React, { useState } from 'react';
import { Check, ArrowRight, Zap } from 'lucide-react';
import { PackageItem } from '../types/site';

export interface PackageSectionProps {
  packages?: PackageItem[];
  onSelectPackage: (pkg: PackageItem) => void;
  onShowAllPackages: () => void;
}

export const PackageSection: React.FC<PackageSectionProps> = ({
  packages = [],
  onSelectPackage,
  onShowAllPackages,
}) => {
  const [filter, setFilter] = useState<'all' | 'home' | 'gamer' | 'corporate'>('all');

  const filteredPackages = packages.filter((pkg) => {
    if (filter === 'all') return true;
    if (pkg.category) return pkg.category === filter;
    const name = (pkg.package || pkg.name || '').toLowerCase();
    if (filter === 'gamer') return name.includes('gamer') || name.includes('gaming') || name.includes('pro');
    if (filter === 'corporate') return name.includes('corporate') || name.includes('enterprise') || name.includes('sme');
    return !name.includes('gamer') && !name.includes('corporate');
  });

  return (
    <section id="packages" className="pt-28 pb-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 text-xs font-mono text-zinc-300 shadow-sm mb-4">
            <Zap className="w-3.5 h-3.5 text-zinc-300" />
            <span>Unmetered High-Speed Plans</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans mb-3">
            Transparent, Gigabit Pricing.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed mb-6">
            Symmetrical bandwidth, dedicated BDIX cache, zero data caps, and 24/7 dedicated local field assistance.
          </p>

          {/* Category Tabs Segmented Island */}
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 bg-zinc-900/60 p-1.5 rounded-xl border border-white/10 backdrop-blur-md">
            {[
              { id: 'all' as const, label: 'All Packages' },
              { id: 'home' as const, label: 'Residential Fiber' },
              { id: 'gamer' as const, label: 'Ultra Low-Ping Gamer' },
              { id: 'corporate' as const, label: 'Corporate & SME' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  filter === tab.id
                    ? 'bg-white text-zinc-950 font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
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
            const isFeatured = pkg.popular || pkg.featured || idx === 1;
            const features = Array.isArray(pkg.features)
              ? pkg.features
              : (typeof pkg.features === 'string'
                  ? JSON.parse(pkg.features)
                  : [
                      `${pkg.speed || 'High Speed'} Symmetrical`,
                      'BDIX 100Mbps Turbo Cache',
                      'Zero Data Caps & Unlimited FUP',
                      'Optical Fiber Direct to Home',
                      '24/7 Priority Support',
                    ]);

            return (
              <div
                key={pkg.id || idx}
                className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 border ${
                  isFeatured
                    ? 'bg-zinc-900/90 border-white/25 shadow-2xl ring-1 ring-white/15'
                    : 'bg-zinc-900/40 border-white/10 hover:border-white/20 hover:bg-zinc-900/60'
                }`}
              >
                {/* Badge if featured or custom badge */}
                {(isFeatured || pkg.badge) && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-white text-zinc-950 shadow-md">
                      {pkg.badge || 'BEST VALUE'}
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Name & Tagline */}
                  <div className="mb-4">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      {pkg.category?.toUpperCase() || 'FIBER BROADBAND'}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">
                      {pkg.package || pkg.name}
                    </h3>
                  </div>

                  {/* Speed Box */}
                  <div className="p-3 rounded-xl bg-zinc-950/70 border border-white/10 flex items-center justify-between mb-4">
                    <span className="text-xs text-zinc-400">Bandwidth</span>
                    <span className="text-base font-bold font-mono text-white">
                      {pkg.speed}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-3xl font-extrabold font-mono text-white">
                      ৳ {Number(pkg.price || 0).toLocaleString()}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">/ month</span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed min-h-[36px] mb-4">
                    {pkg.description || 'High-performance uninterrupted optical connection.'}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 pt-3 border-t border-white/10 text-xs mb-6">
                    {features.map((feat: string, fIdx: number) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-zinc-300">
                        <span className="w-4 h-4 rounded-full bg-white/5 border border-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </span>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <div>
                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150 ${
                      isFeatured
                        ? 'bg-white text-zinc-950 hover:bg-zinc-200 shadow-md'
                        : 'bg-zinc-800 text-zinc-200 border border-white/10 hover:bg-zinc-700 hover:text-white'
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
            className="saas-btn-secondary"
          >
            <span>View Full Package Catalog & Feature Matrix</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PackageSection;
