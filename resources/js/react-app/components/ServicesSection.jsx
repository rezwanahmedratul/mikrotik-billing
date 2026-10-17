import React from 'react';
import { 
  Cable, 
  Zap, 
  Gamepad2, 
  ShieldCheck, 
  Network, 
  Headphones, 
  Sparkles,
  Server,
  Layers
} from 'lucide-react';
import { defaultServices } from '../data/defaultData';

export default function ServicesSection() {
  const iconMap = {
    Cable: Cable,
    Zap: Zap,
    Gamepad2: Gamepad2,
    ShieldCheck: ShieldCheck,
    Network: Network,
    Headphones: Headphones,
  };

  return (
    <section id="services" className="py-20 relative border-t border-white/5 bg-[#09090b]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Infrastructure Standards</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered from the Core Up.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Every fiber strand is linked directly to our carrier-grade distribution switches with redundant BGP routing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultServices.map((service, idx) => {
            const IconComponent = iconMap[service.icon] || Server;
            return (
              <div 
                key={service.id || idx}
                className="glass-card p-6 rounded-2xl relative group hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white group-hover:border-cyan-500/40 group-hover:text-cyan-400 transition-colors">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-zinc-900 text-zinc-400 border border-white/5">
                    {service.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-zinc-100">
                  {service.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
