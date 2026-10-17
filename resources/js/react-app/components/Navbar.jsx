import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Activity, 
  Gauge, 
  Ticket, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronRight, 
  LogIn, 
  ExternalLink 
} from 'lucide-react';

export default function Navbar({ 
  siteName = "Smart ISP", 
  siteLogo = null, 
  onOpenSpeedTest, 
  onOpenRecharge, 
  activePage, 
  setActivePage 
}) {
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
    { label: "Plan Calculator", href: "#calculator", page: "home" },
    { label: "Infrastructure", href: "#network", page: "home" },
    { label: "Coverage", href: "#coverage", page: "home" },
    { label: "Contact", href: "#contact", page: "home" },
  ];

  const handleNavClick = (e, link) => {
    if (activePage !== 'home' && link.page === 'home') {
      setActivePage('home');
      setTimeout(() => {
        const el = document.querySelector(link.href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (link.page === 'packages' && activePage !== 'packages') {
      // If clicking Packages, we can switch view or scroll
      setActivePage('packages');
    } else {
      const el = document.querySelector(link.href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'py-3 backdrop-blur-xl bg-[#09090b]/80 border-b border-white/10 shadow-2xl' 
        : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand & Operational Indicator */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActivePage('home')}
              className="flex items-center gap-3 text-left bg-transparent border-0 cursor-pointer p-0"
            >
              {siteLogo ? (
                <img src={siteLogo} alt={siteName} className="h-9 w-auto object-contain" />
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/15 flex items-center justify-center text-white shadow-inner">
                    <Wifi className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-white font-sans">
                    {siteName}
                  </span>
                </div>
              )}
            </button>

            {/* Micro-Accent Operational Status Pill */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-xs text-zinc-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot-emerald inline-block"></span>
              <span className="text-emerald-400 font-medium">Core 100%</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">4ms BDIX</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-zinc-950/60 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(e, link);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  (activePage === link.page && link.page === 'packages')
                    ? 'bg-white text-zinc-950 font-semibold shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Speed Test Trigger with subtle cyan accent */}
            <button
              onClick={onOpenSpeedTest}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 text-zinc-200 border border-white/10 hover:border-cyan-500/40 hover:text-cyan-300 hover:bg-zinc-800 transition-all duration-200 shadow-sm cursor-pointer"
              title="Test real-time bandwidth & latency"
            >
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>Speed Test</span>
            </button>

            {/* Quick Voucher Recharge with subtle emerald accent */}
            <button
              onClick={onOpenRecharge}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 text-zinc-200 border border-white/10 hover:border-emerald-500/40 hover:text-emerald-300 hover:bg-zinc-800 transition-all duration-200 shadow-sm cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5 text-emerald-400" />
              <span>Recharge</span>
            </button>

            {/* Client Login (Monochrome clean) */}
            <a
              href="/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all duration-200 shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenRecharge}
              className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-emerald-400"
              title="Quick Recharge"
            >
              <Ticket className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 bg-[#09090b]/95 backdrop-blur-2xl border-b border-white/10 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot-emerald inline-block"></span>
              Core Status: <span className="text-emerald-400">Online</span>
            </span>
            <span>Ping: 4ms BDIX</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenSpeedTest(); }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-zinc-900 border border-white/10 text-xs font-medium text-cyan-400"
            >
              <Gauge className="w-4 h-4" />
              <span>Speed Test</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenRecharge(); }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-zinc-900 border border-white/10 text-xs font-medium text-emerald-400"
            >
              <Ticket className="w-4 h-4" />
              <span>Voucher Recharge</span>
            </button>
          </div>

          <div className="space-y-1 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(e, link);
                }}
                className="block px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex gap-2">
            <a
              href="/portal"
              className="flex-1 text-center py-2 px-3 rounded-lg text-xs font-medium bg-zinc-900 text-zinc-200 border border-white/10"
            >
              Customer Portal
            </a>
            <a
              href="/login"
              className="flex-1 text-center py-2 px-3 rounded-lg text-xs font-semibold bg-white text-zinc-950"
            >
              Login
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
