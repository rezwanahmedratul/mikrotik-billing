import React, { useState, useEffect } from 'react';
import { X, Ticket, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface VoucherRechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoucherRechargeModal: React.FC<VoucherRechargeModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !code) {
      setError('Please provide both your account username/ID and the voucher code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/public/recharge-voucher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          username: username.trim(),
          code: code.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
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
      <div className="relative w-full max-w-md rounded-2xl saas-card p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {result ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-extrabold text-white font-sans">Recharge Complete!</h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">{result.message}</p>

            <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/10 text-xs font-mono space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-zinc-500">Account:</span>
                <span className="text-white font-bold">{username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Credited Amount:</span>
                <span className="text-white font-bold">BDT {result.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Service Status:</span>
                <span className="text-emerald-400 font-bold">Active & Online</span>
              </div>
            </div>

            <button
              onClick={() => {
                setResult(null);
                onClose();
              }}
              className="saas-btn-primary w-full"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-zinc-900 border border-white/10 text-zinc-300 mb-3">
                <Ticket className="w-3.5 h-3.5 text-zinc-300" />
                <span>Instant Account Top-Up</span>
              </div>
              <h2 className="text-xl font-bold text-white font-sans">Recharge via Voucher</h2>
              <p className="text-xs text-zinc-400 mt-1 font-sans">
                Enter your PPPoE customer ID and the code from your scratch card or digital voucher.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Customer ID or PPPoE Username *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CUST-10492 or username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="saas-input"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Voucher / Scratch Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VCH-8921-9481"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="saas-input font-mono tracking-wider"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="saas-btn-primary w-full"
              >
                {loading ? (
                  <span>Validating Voucher...</span>
                ) : (
                  <>
                    <span>Recharge Account Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-zinc-500 font-sans">
              Prefer bKash, Nagad or Cards?{' '}
              <a href="/portal" className="text-zinc-300 hover:text-white transition-colors">
                Pay in Customer Portal →
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VoucherRechargeModal;
