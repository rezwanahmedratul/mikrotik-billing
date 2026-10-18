import React from 'react';
import {
  Cable,
  Zap,
  Gamepad2,
  ShieldCheck,
  Network,
  Headphones,
  Server,
  Layers,
} from 'lucide-react';
import { defaultServices, ServiceItem } from '../data/defaultData';

export const ServicesSection: React.FC = () => {
  const iconMap: Record<string, React.ElementType> = {
    Cable,
    Zap,
    Gamepad2,
    ShieldCheck,
    Network,
    Headphones,
  };

  return (
    <section id="network" className="py-20 relative border-t border-white/5 bg-[#09090b]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 text-xs font-mono text-zinc-300 shadow-sm mb-4">
            <Layers className="w-3.5 h-3.5 text-zinc-300" />
            <span>Infrastructure Standards</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans mb-3">
            Engineered from the Core Up.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Every fiber strand is linked directly to our carrier-grade distribution switches with redundant BGP routing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultServices.map((service: ServiceItem, idx: number) => {
            const IconComponent = iconMap[service.icon] || Server;
            return (
              <div
                key={service.id || idx}
                className="saas-card p-6 sm:p-7 relative group saas-card-hover"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-200 group-hover:border-white/30 group-hover:text-white transition-all">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-zinc-900 text-zinc-400 border border-white/10">
                    {service.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-zinc-100 font-sans">
                  {service.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
