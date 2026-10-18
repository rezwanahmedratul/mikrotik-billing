import React from 'react';
import { Wifi, ArrowUp } from 'lucide-react';

export interface FooterProps {
  siteName?: string;
  siteLogo?: string | null;
  setActivePage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  siteName = 'Smart ISP',
  siteLogo = null,
  setActivePage,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-[#060608] pt-16 pb-12 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              {siteLogo ? (
                <img src={siteLogo} alt={siteName} className="h-8 w-auto object-contain" />
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/15 flex items-center justify-center text-white">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <span className="text-base font-bold text-white tracking-tight font-sans">{siteName}</span>
                </div>
              )}
            </div>

            <p className="text-zinc-400 leading-relaxed text-xs font-sans">
              Next-generation optical broadband internet provider powered by MikroTik carrier-grade routing and direct BDIX exchange peering.
            </p>

            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <a href="#hero" onClick={() => setActivePage('home')} className="hover:text-white transition-colors cursor-pointer text-zinc-400">
                  Home
                </a>
              </li>
              <li>
                <button onClick={() => setActivePage('packages')} className="hover:text-white transition-colors text-left p-0 bg-transparent border-0 cursor-pointer text-zinc-400">
                  Fiber Packages
                </button>
              </li>
              <li>
                <a href="#calculator" onClick={() => setActivePage('home')} className="hover:text-white transition-colors cursor-pointer text-zinc-400">
                  Bandwidth Estimator
                </a>
              </li>
              <li>
                <a href="#coverage" onClick={() => setActivePage('home')} className="hover:text-white transition-colors cursor-pointer text-zinc-400">
                  Coverage Zones
                </a>
              </li>
              <li>
                <a href="#network" onClick={() => setActivePage('home')} className="hover:text-white transition-colors cursor-pointer text-zinc-400">
                  Infrastructure
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Portals</h4>
            <ul className="space-y-2">
              <li>
                <a href="/portal" className="text-zinc-300 hover:text-white transition-colors font-medium">
                  Customer Billing Portal
                </a>
              </li>
              <li>
                <a href="/login" className="text-zinc-400 hover:text-white transition-colors">
                  Admin & Reseller Login
                </a>
              </li>
              <li>
                <a href="/recharge/voucher" className="text-zinc-300 hover:text-white transition-colors">
                  Voucher Redemption
                </a>
              </li>
              <li>
                <a href="/warning" className="text-zinc-400 hover:text-white transition-colors">
                  Account Expiry Warning
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Supported Payment Gateways */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Verified Payments</h4>
            <p className="text-zinc-400 leading-relaxed text-[11px] font-sans">
              Instant automated recharge available through Mobile Financial Services and International Cards.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['bKash', 'Nagad', 'Rocket', 'Visa', 'Mastercard', 'UnionPay'].map((gateway) => (
                <span
                  key={gateway}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 font-mono text-[11px] text-zinc-300"
                >
                  {gateway}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} {siteName}. All rights reserved. Precision ISP Infrastructure • Powered by{' '}
            <a
              href="https://codepagol.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              CodePagol
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="saas-btn-secondary py-1.5 px-3 text-xs rounded-xl"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
