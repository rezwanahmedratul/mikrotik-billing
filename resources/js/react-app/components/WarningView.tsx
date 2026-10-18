import React from 'react';
import { AlertTriangle, Ticket, ExternalLink, Phone } from 'lucide-react';

export interface WarningViewProps {
  onOpenRecharge: () => void;
  onBackToHome: () => void;
  sitePhone?: string;
}

export const WarningView: React.FC<WarningViewProps> = ({
  onOpenRecharge,
  onBackToHome,
  sitePhone = '+880 1700-000000',
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#09090b] relative">
      <div className="ambient-glow-top"></div>

      <div className="relative z-10 w-full max-w-md rounded-2xl saas-card p-8 border border-white/10 text-center space-y-6 shadow-2xl">
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/15 flex items-center justify-center text-white mx-auto shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-zinc-900 border border-white/10 text-zinc-300">
            <span>SERVICE PAUSED</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white font-sans">Account Subscription Expired</h1>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto font-sans">
            Your internet session has expired due to pending billing. Recharging or entering your voucher card will reactivate high-speed connection immediately.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={onOpenRecharge}
            className="saas-btn-primary w-full"
          >
            <Ticket className="w-4 h-4" />
            <span>Recharge with Scratch Voucher</span>
          </button>

          <a
            href="/portal"
            className="saas-btn-secondary w-full"
          >
            <ExternalLink className="w-4 h-4 text-zinc-400" />
            <span>Pay Online (bKash / Nagad / Cards)</span>
          </a>
        </div>

        {/* Support Hotline */}
        <div className="pt-4 border-t border-white/10 text-xs text-zinc-400 space-y-1 font-sans">
          <div>Need immediate activation assistance?</div>
          <a
            href={`tel:${sitePhone}`}
            className="font-mono font-bold text-white hover:text-zinc-300 flex items-center justify-center gap-1.5 pt-1"
          >
            <Phone className="w-3.5 h-3.5 text-zinc-400" />
            <span>{sitePhone}</span>
          </a>
        </div>

        <div className="pt-2">
          <button
            onClick={onBackToHome}
            className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            ← Return to Main Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningView;
