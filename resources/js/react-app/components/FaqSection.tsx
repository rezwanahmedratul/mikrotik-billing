import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { defaultFaqs, FaqItem } from '../data/defaultData';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 relative border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 text-xs font-mono text-zinc-300 shadow-sm mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-zinc-300" />
            <span>Common Inquiries</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans mb-3">
            Frequently Asked Questions.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about our fiber optic deployment, billing, and routing.
          </p>
        </div>

        <div className="space-y-3">
          {defaultFaqs.map((faq: FaqItem, idx: number) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all duration-200 border overflow-hidden ${
                  isOpen
                    ? 'bg-zinc-900/90 border-white/25 shadow-xl ring-1 ring-white/10'
                    : 'bg-zinc-900/40 border-white/10 hover:border-white/20 hover:bg-zinc-900/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  style={{ background: 'transparent' }}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer text-white transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-white font-sans">
                    {faq.q}
                  </span>
                  <div className={`w-7 h-7 rounded-lg bg-zinc-800/80 flex items-center justify-center text-zinc-300 flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-white text-zinc-950' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/10 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
