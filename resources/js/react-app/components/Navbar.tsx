import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Gauge,
  Ticket,
  LogIn,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

export interface NavbarProps {
  siteName?: string;
  siteLogo?: string | null;
  onOpenSpeedTest: () => void;
  onOpenRecharge: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  siteName = "Smart ISP",
  siteLogo = null,
  onOpenSpeedTest,
  onOpenRecharge,
  activePage,
  setActivePage,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#hero", page: "home" },
    { label: "Packages", href: "#packages", page: "packages" },
    { label: "Calculator", href: "#calculator", page: "home" },
    { label: "Network", href: "#network", page: "home" },
    { label: "Coverage", href: "#coverage", page: "home" },
    { label: "Contact", href: "#contact", page: "home" },
  ];

  const handleNavClick = (e: React.MouseEvent, link: typeof navLinks[0]) => {
    e.preventDefault();
    if (link.page === 'packages') {
      setActivePage('packages');
    } else {
      if (activePage !== 'home') {
        setActivePage('home');
        setTimeout(() => {
          const el = document.querySelector(link.href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        const el = document.querySelector(link.href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 transition-all duration-300">
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 border border-white/10 px-4 sm:px-6 py-2.5 sm:py-3 shadow-2xl flex items-center justify-between ${
          scrolled
            ? 'bg-zinc-950/90 backdrop-blur-2xl border-white/15'
            : 'bg-zinc-950/75 backdrop-blur-xl'
        }`}
      >
        {/* Brand & Telemetry Indicator */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2.5 text-left bg-transparent border-0 cursor-pointer p-0 group"
          >
            {siteLogo ? (
              <img src={siteLogo} alt={siteName} className="h-8 sm:h-9 w-auto object-contain" />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/15 flex items-center justify-center text-white shadow-inner flex-shrink-0 group-hover:border-white/30 transition-all">
                  <Wifi className="w-4 h-4 text-white" />
                </div>
                <span className="text-base sm:text-lg font-bold tracking-tight text-white font-sans">
                  {siteName}
                </span>
              </div>
            )}
          </button>

          {/* Micro-Accent Operational Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-xs text-zinc-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot-emerald inline-block"></span>
            <span className="text-zinc-200 font-medium">Core 100%</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">4ms BDIX</span>
          </div>
        </div>

        {/* Desktop Nav Links Island */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 p-1.5 rounded-xl border border-white/10 backdrop-blur-md">
          {navLinks.map((link) => {
            const isPackages = link.page === 'packages' && activePage === 'packages';
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  isPackages
                    ? 'bg-white/10 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-2.5">
          {/* Speed Test Trigger */}
          <button
            id="nav-speedtest-btn"
            onClick={onOpenSpeedTest}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 text-zinc-200 border border-white/10 hover:border-white/25 hover:text-white hover:bg-zinc-800 transition-all duration-150 cursor-pointer shadow-sm"
            title="Test real-time bandwidth & latency"
          >
            <Gauge className="w-3.5 h-3.5 text-zinc-400" />
            <span>Speed Test</span>
          </button>

          {/* Quick Voucher Recharge */}
          <button
            id="nav-recharge-btn"
            onClick={onOpenRecharge}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 text-zinc-200 border border-white/10 hover:border-white/25 hover:text-white hover:bg-zinc-800 transition-all duration-150 cursor-pointer shadow-sm"
          >
            <Ticket className="w-3.5 h-3.5 text-zinc-400" />
            <span>Recharge</span>
          </button>

          {/* Client Login (Monochrome clean) */}
          <a
            href="/login"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all duration-150 shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-7xl mx-auto mt-2 p-4 rounded-2xl bg-zinc-950/95 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col gap-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2 mt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSpeedTest();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-medium bg-zinc-900 text-zinc-200 border border-white/10"
            >
              <Gauge className="w-4 h-4 text-zinc-400" />
              <span>Speed Test</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRecharge();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-medium bg-zinc-900 text-zinc-200 border border-white/10"
            >
              <Ticket className="w-4 h-4 text-zinc-400" />
              <span>Voucher Recharge</span>
            </button>
            <a
              href="/login"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold bg-white text-zinc-950"
            >
              <LogIn className="w-4 h-4" />
              <span>Client Login</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
