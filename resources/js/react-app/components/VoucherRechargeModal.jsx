import React, { useState } from 'react';
import { X, Ticket, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function VoucherRechargeModal({ isOpen, onClose }) {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { success: bool, message: '', amount: '' }
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !code) {
      setError("Please provide both your account username/ID and the voucher code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/public/recharge-voucher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          username: username.trim(),
          code: code.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setError(data.message || 'Voucher recharge failed. Please double check the code.');
      }
    } catch (err) {
      setError('Connection failure. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl glass-panel-elevated p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {result ? (
          /* Success Card */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-extrabold text-white">Recharge Complete!</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {result.message}
            </p>

            <div className="p-4 rounded-xl bg-zinc-950 border border-white/5 text-xs font-mono space-y-1 text-left">
              <div className="flex justify-between">
                <span className="text-zinc-500">Account:</span>
                <span className="text-white font-bold">{username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Credited Amount:</span>
                <span className="text-emerald-400 font-bold">BDT {result.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Service Status:</span>
                <span className="text-cyan-400 font-bold">Active & Online</span>
              </div>
            </div>

            <button
              onClick={() => { setResult(null); onClose(); }}
              className="w-full py-3 rounded-xl btn-monochrome-primary text-xs font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          /* Recharge Form */
          <>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                <Ticket className="w-3 h-3" />
                <span>Instant Account Top-Up</span>
              </div>
              <h3 className="text-xl font-bold text-white">Recharge via Voucher</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Enter your PPPoE customer ID and the code from your scratch card or digital voucher.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Customer ID or PPPoE Username *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CUST-10492 or username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Voucher / Scratch Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VCH-8921-9481"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono tracking-wider"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl btn-monochrome-primary text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? (
                    <span>Validating Voucher...</span>
                  ) : (
                    <>
                      <span>Recharge Account Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Alternative Portal Payment Link */}
            <div className="pt-3 border-t border-white/10 text-center">
              <span className="text-xs text-zinc-400">Prefer bKash, Nagad or Cards? </span>
              <a href="/portal" className="text-xs font-bold text-cyan-400 hover:underline">
                Pay in Customer Portal →
              </a>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
