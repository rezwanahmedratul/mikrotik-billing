import React, { useState } from 'react';
import { ArrowLeft, Search, Check, ArrowRight, Zap } from 'lucide-react';
import { PackageItem } from '../types/site';

export interface AllPackagesPageProps {
  packages?: PackageItem[];
  onSelectPackage: (pkg: PackageItem) => void;
  onBackToHome: () => void;
}

export const AllPackagesPage: React.FC<AllPackagesPageProps> = ({
  packages = [],
  onSelectPackage,
  onBackToHome,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(5000);

  const filtered = packages.filter((pkg) => {
    const pkgName = (pkg.package || pkg.name || '').toLowerCase();
    const pkgSpeed = (pkg.speed || '').toLowerCase();
    const pkgDesc = (pkg.description || '').toLowerCase();
    const term = searchTerm.toLowerCase();

    const matchesSearch = pkgName.includes(term) || pkgSpeed.includes(term) || pkgDesc.includes(term);
    const matchesCat = selectedCategory === 'all' || pkg.category === selectedCategory;
    const matchesPrice = Number(pkg.price || 0) <= maxPrice;

    return matchesSearch && matchesCat && matchesPrice;
  });

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top Navigation & Header */}
      <div className="space-y-4">
        <button
          onClick={onBackToHome}
          className="saas-btn-secondary py-1.5 px-3 text-xs font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-zinc-900 border border-white/10 text-zinc-300 mb-3">
              <Zap className="w-3.5 h-3.5 text-zinc-300" />
              <span>Full Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
              All Fiber Optic Packages
            </h1>
            <p className="text-sm text-zinc-400 mt-2 max-w-xl font-sans">
              Compare our unmetered symmetrical speed profiles, dedicated BDIX caches, and enterprise IP offerings.
            </p>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs font-mono text-zinc-400">
              Showing {filtered.length} of {packages.length} Packages
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl saas-card border border-white/10 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search input */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search plan or speed (e.g. 50 Mbps)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="saas-input pl-10"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-zinc-950/80 p-1 rounded-xl border border-white/10">
            {[
              { id: 'all', label: 'All' },
              { id: 'home', label: 'Home' },
              { id: 'gamer', label: 'Gamer' },
              { id: 'corporate', label: 'SME' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-white text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Max Price Slider */}
          <div className="flex items-center gap-3 bg-zinc-950/80 px-4 py-2 rounded-xl border border-white/10">
            <div className="text-xs font-mono text-zinc-400 whitespace-nowrap">
              Max: <span className="text-white font-bold">৳{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="5000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((pkg, idx) => {
          const isFeatured = pkg.popular || pkg.featured;
          const features = Array.isArray(pkg.features)
            ? pkg.features
            : typeof pkg.features === 'string'
            ? JSON.parse(pkg.features)
            : [
                `${pkg.speed || 'Fast'} Symmetrical Speed`,
                '100Mbps BDIX Peering',
                'Zero FUP Limit',
                '24/7 Field Support',
              ];

          return (
            <div
              key={pkg.id || idx}
              className={`rounded-2xl p-6 sm:p-7 saas-card border flex flex-col justify-between space-y-4 ${
                isFeatured ? 'border-white/25 bg-zinc-900/80 ring-1 ring-white/15' : 'border-white/10'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-400">
                      {pkg.category?.toUpperCase() || 'BROADBAND'}
                    </span>
                    <h3 className="text-lg font-bold text-white font-sans mt-0.5">
                      {pkg.package || pkg.name}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-zinc-900 text-white border border-white/10">
                    {pkg.speed}
                  </span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-white">
                    ৳ {Number(pkg.price || 0).toLocaleString()}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">/ mo</span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed min-h-[32px] font-sans">
                  {pkg.description || 'Uninterrupted gigabit optical connectivity.'}
                </p>

                <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
                  {features.map((feat: string, fIdx: number) => (
                    <div key={fIdx} className="flex items-start gap-2 text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-zinc-300 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onSelectPackage(pkg)}
                  className="saas-btn-primary w-full"
                >
                  <span>Select & Connect</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllPackagesPage;
