import React from 'react';
import { AlertTriangle, Ticket, ExternalLink, Phone, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function WarningView({ onOpenRecharge, onBackToHome, sitePhone = "+880 1700-000000" }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#09090b] relative">
      <div className="ambient-glow-top"></div>

      <div className="relative z-10 w-full max-w-md rounded-2xl glass-panel-elevated p-8 border border-white/10 text-center space-y-6">
        
        {/* Warning Icon with subtle amber/rose micro-accent */}
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span>SERVICE PAUSED</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Account Subscription Expired</h1>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
            Your internet session has expired due to pending billing. Recharging or entering your voucher card will reactivate high-speed connection immediately.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={onOpenRecharge}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl btn-monochrome-primary text-xs font-semibold cursor-pointer shadow-lg"
          >
            <Ticket className="w-4 h-4" />
            <span>Recharge with Scratch Voucher</span>
          </button>

          <a
            href="/portal"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl btn-monochrome-outline text-xs font-semibold"
          >
            <ExternalLink className="w-4 h-4 text-cyan-400" />
            <span>Pay Online (bKash / Nagad / Cards)</span>
          </a>
        </div>

        {/* Support Hotline */}
        <div className="pt-4 border-t border-white/5 text-xs text-zinc-400 space-y-1">
          <div>Need immediate activation assistance?</div>
          <a href={`tel:${sitePhone}`} className="font-mono font-bold text-white hover:text-cyan-400 flex items-center justify-center gap-1.5 pt-1">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>{sitePhone}</span>
          </a>
        </div>

        <div className="pt-2">
          <button
            onClick={onBackToHome}
            className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            ← Return to Main Homepage
          </button>
        </div>

      </div>
    </div>
  );
}
