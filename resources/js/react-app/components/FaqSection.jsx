import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { defaultFaqs } from '../data/defaultData';

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 relative border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Common Inquiries</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Everything you need to know about our fiber optic deployment, billing, and routing.
          </p>
        </div>

        <div className="space-y-3">
          {defaultFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl glass-card overflow-hidden transition-all duration-200 border border-white/5"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-900/50 transition-colors"
                >
                  <span className="text-sm font-bold text-white font-sans">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? 'rotate-180 text-white' : ''
                  }`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-white/5 font-sans">
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
}
