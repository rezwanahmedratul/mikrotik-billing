import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Check, 
  X, 
  ArrowRight, 
  Zap, 
  Sparkles, 
  SlidersHorizontal 
} from 'lucide-react';

export default function AllPackagesPage({ packages = [], onSelectPackage, onBackToHome }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(5000);

  const filtered = packages.filter(pkg => {
    const matchesSearch = (pkg.package || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (pkg.speed || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (pkg.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCat = selectedCategory === 'all' || pkg.category === selectedCategory;
    const matchesPrice = parseFloat(pkg.price || 0) <= maxPrice;

    return matchesSearch && matchesCat && matchesPrice;
  });

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Top Navigation & Header */}
      <div className="space-y-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
              <Zap className="w-3 h-3" />
              <span>Full Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              All Fiber Optic Packages
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Compare our unmetered symmetrical speed profiles, dedicated BDIX caches, and enterprise IP offerings.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-zinc-400">Showing {filtered.length} of {packages.length} Packages</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-6 rounded-2xl glass-panel-elevated border border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Search input */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search plan or speed (e.g. 50 Mbps)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-white/10">
            {[
              { id: 'all', label: 'All' },
              { id: 'home', label: 'Home' },
              { id: 'gamer', label: 'Gamer' },
              { id: 'corporate', label: 'SME' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-white text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Max Price Slider */}
          <div className="flex items-center gap-3 bg-zinc-950 px-3 py-1.5 rounded-xl border border-white/10">
            <div className="text-[11px] font-mono text-zinc-400 whitespace-nowrap">
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
          const isFeatured = pkg.is_featured;
          const features = Array.isArray(pkg.features) ? pkg.features : (
            pkg.features ? JSON.parse(pkg.features) : [
              `${pkg.speed || 'Fast'} Symmetrical Speed`,
              "100Mbps BDIX Peering",
              "Zero FUP Limit",
              "24/7 Field Support"
            ]
          );

          return (
            <div
              key={pkg.id || idx}
              className={`rounded-2xl p-6 glass-card border flex flex-col justify-between space-y-4 ${
                isFeatured ? 'border-white/30 bg-zinc-900/80' : 'border-white/10'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-400">{pkg.plan_label || "BROADBAND"}</span>
                    <h3 className="text-lg font-bold text-white">{pkg.package}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-zinc-900 text-cyan-400 border border-white/5">
                    {pkg.speed}
                  </span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-white">৳ {parseFloat(pkg.price || 0).toLocaleString()}</span>
                  <span className="text-xs text-zinc-400">/ mo</span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed min-h-[32px]">
                  {pkg.description || "Uninterrupted gigabit optical connectivity."}
                </p>

                <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                  {features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onSelectPackage(pkg)}
                  className="w-full py-2.5 rounded-xl btn-monochrome-primary text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Select & Connect</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Matrix Table */}
      <div className="pt-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Feature Comparison Matrix</h2>
          <p className="text-xs text-zinc-400 mt-1">Detailed technical specifications across package tiers.</p>
        </div>

        <div className="overflow-x-auto rounded-2xl glass-panel-elevated border border-white/10">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-zinc-950/80 text-zinc-400 border-b border-white/10 font-mono text-[11px] uppercase">
              <tr>
                <th className="p-4">Package Profile</th>
                <th className="p-4">Down / Up Ratio</th>
                <th className="p-4">BDIX Throughput</th>
                <th className="p-4">IP Assignment</th>
                <th className="p-4">Latency Priority</th>
                <th className="p-4">Monthly Rate</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {packages.map((pkg, idx) => (
                <tr key={pkg.id || idx} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>{pkg.package}</span>
                  </td>
                  <td className="p-4 font-mono text-zinc-300">1:1 Symmetrical</td>
                  <td className="p-4 font-mono text-cyan-400 font-semibold">Up to 100 Mbps</td>
                  <td className="p-4 text-zinc-400">
                    {idx >= 2 ? "Static Public IPv4 Available" : "Dynamic Carrier NAT"}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      idx >= 2 ? "bg-indigo-500/10 text-indigo-400" : "bg-zinc-800 text-zinc-400"
                    }`}>
                      {idx >= 2 ? "Ultra-Low Gamer" : "Standard QoS"}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-white">
                    ৳ {parseFloat(pkg.price || 0).toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onSelectPackage(pkg)}
                      className="px-3 py-1.5 rounded-lg btn-monochrome-outline text-xs font-medium cursor-pointer hover:bg-white hover:text-zinc-950"
                    >
                      Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
