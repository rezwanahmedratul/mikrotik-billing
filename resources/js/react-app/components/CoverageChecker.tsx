import React, { useState } from 'react';
import { MapPin, Search, CheckCircle2, ArrowRight } from 'lucide-react';

export interface CoverageCheckerProps {
  onOrderInArea: (areaName: string) => void;
}

interface CoverageResult {
  area: string;
  status: string;
  latency: string;
  ports: string;
  eta: string;
}

export const CoverageChecker: React.FC<CoverageCheckerProps> = ({ onOrderInArea }) => {
  const [customInput, setCustomInput] = useState<string>('');
  const [checking, setChecking] = useState<boolean>(false);
  const [result, setResult] = useState<CoverageResult | null>(null);

  const popularAreas = [
    'Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur',
    'Mohakhali', 'Bashundhara R/A', 'Badda', 'Madan', 'Netrokona'
  ];

  const handleCheck = (areaName?: string) => {
    const target = areaName || customInput;
    if (!target) return;

    setChecking(true);
    setResult(null);

    setTimeout(() => {
      setChecking(false);
      setResult({
        area: target,
        status: 'available',
        latency: '3ms - 5ms',
        ports: 'GPON 2.5G Ready',
        eta: 'Same Day Dispatch (within 4 hours)'
      });
    }, 700);
  };

  return (
    <section id="coverage" className="py-20 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 text-xs font-mono text-zinc-300 shadow-sm mb-4">
            <MapPin className="w-3.5 h-3.5 text-zinc-300" />
            <span>Service Availability Matrix</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans mb-3">
            Check Fiber in Your Neighborhood.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Instant optical distribution node check for residential buildings, commercial offices, and IT complexes.
          </p>
        </div>

        <div className="max-w-3xl mx-auto rounded-2xl saas-card p-6 sm:p-8 border border-white/10 shadow-2xl">
          {/* Search Box */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Enter your street, building, or area name..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                className="saas-input pl-10"
              />
            </div>
            <button
              onClick={() => handleCheck()}
              disabled={checking}
              className="saas-btn-primary"
            >
              {checking ? (
                <span>Checking ODF...</span>
              ) : (
                <>
                  <span>Check Availability</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Quick Select Popular Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-4">
            <span className="text-xs text-zinc-500 font-mono mr-1">Quick Select:</span>
            {popularAreas.slice(0, 7).map((area) => (
              <button
                key={area}
                onClick={() => {
                  setCustomInput(area);
                  handleCheck(area);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-mono bg-zinc-900/80 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
              >
                {area}
              </button>
            ))}
          </div>

          {/* Result Card */}
          {result && (
            <div className="mt-6 p-5 sm:p-6 rounded-xl bg-zinc-950/80 border border-white/15 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white font-sans">Fiber Ready in {result.area}!</h3>
                    <p className="text-xs text-zinc-400 font-mono">Distribution Hub: Direct Core Link Available</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-white text-zinc-950 shadow-sm">
                  READY
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center pt-3 border-t border-white/10 text-xs font-mono">
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5">
                  <div className="text-zinc-500 text-[10px] mb-1">LOCAL PING</div>
                  <div className="text-white font-bold">{result.latency}</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5">
                  <div className="text-zinc-500 text-[10px] mb-1">CAPACITY</div>
                  <div className="text-white font-bold">{result.ports}</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5">
                  <div className="text-zinc-500 text-[10px] mb-1">DEPLOYMENT</div>
                  <div className="text-white font-bold">~4 Hours</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOrderInArea(result.area)}
                  className="saas-btn-primary w-full"
                >
                  <span>Book Connection in {result.area}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CoverageChecker;
