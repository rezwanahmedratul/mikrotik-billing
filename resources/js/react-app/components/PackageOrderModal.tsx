import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PackageItem } from '../types/site';

export interface PackageOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: PackageItem | null;
}

export const PackageOrderModal: React.FC<PackageOrderModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });
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

  if (!isOpen || !selectedPackage) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      setError('Please fill in your name, phone number, and installation address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/public/order-package', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          ...formData,
          package_name: selectedPackage.package || selectedPackage.name,
          price: selectedPackage.price,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } else {
        setError(data.message || 'Error creating order request.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl saas-card p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
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

            <h3 className="text-2xl font-extrabold text-white font-sans">Connection Booked!</h3>
            <p className="text-xs text-zinc-300 max-w-sm mx-auto leading-relaxed font-sans">
              {result.message}
            </p>

            <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/10 text-xs font-mono space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-zinc-500">Plan:</span>
                <span className="text-white font-bold">{selectedPackage.package || selectedPackage.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Speed:</span>
                <span className="text-white font-bold">{selectedPackage.speed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Rate:</span>
                <span className="text-white font-bold">
                  ৳ {Number(selectedPackage.price || 0).toLocaleString()} / mo
                </span>
              </div>
              {result.order_id && (
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-zinc-500">Order Ref #:</span>
                  <span className="text-white font-bold font-mono">#{result.order_id}</span>
                </div>
              )}
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
                <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
                <span>Fast Fiber Deployment</span>
              </div>
              <h2 className="text-xl font-bold text-white font-sans">Order Fiber Connection</h2>
              <p className="text-xs text-zinc-400 mt-1 font-sans">
                Selected:{' '}
                <span className="text-white font-semibold">
                  {selectedPackage.package || selectedPackage.name} ({selectedPackage.speed}) • ৳{' '}
                  {Number(selectedPackage.price || 0).toLocaleString()} / mo
                </span>
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
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shakil Ahmed"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="saas-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="saas-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="saas-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Installation / House Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Building No, Flat, Road, Area, District"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="saas-input"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Additional Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Preferred installation timing, ONU requirements, etc."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="saas-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="saas-btn-primary w-full"
              >
                {loading ? (
                  <span>Transmitting Request...</span>
                ) : (
                  <>
                    <span>Confirm Connection Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PackageOrderModal;
