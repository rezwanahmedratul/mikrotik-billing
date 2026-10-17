import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Sparkles, Wifi } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PackageOrderModal({ isOpen, onClose, selectedPackage }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { success: bool, message: '', order_id: '' }

  if (!isOpen || !selectedPackage) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill in your name, phone number, and address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/public/order-package', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          ...formData,
          package_name: selectedPackage.package || selectedPackage.plan_label,
          price: selectedPackage.price
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } else {
        alert(data.message || 'Error creating order request.');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel-elevated p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {result ? (
          /* Success Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-extrabold text-white">Connection Booked!</h3>
            <p className="text-xs text-zinc-300 max-w-sm mx-auto leading-relaxed">
              {result.message}
            </p>

            <div className="p-4 rounded-xl bg-zinc-950 border border-white/5 text-xs font-mono space-y-1 text-left">
              <div className="flex justify-between">
                <span className="text-zinc-500">Plan:</span>
                <span className="text-white font-bold">{selectedPackage.package}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Speed:</span>
                <span className="text-cyan-400 font-bold">{selectedPackage.speed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Rate:</span>
                <span className="text-white font-bold">৳ {parseFloat(selectedPackage.price || 0).toLocaleString()} / mo</span>
              </div>
              {result.order_id && (
                <div className="flex justify-between pt-1 border-t border-white/5">
                  <span className="text-zinc-500">Order Ref #:</span>
                  <span className="text-emerald-400 font-bold">#{result.order_id}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => { setResult(null); onClose(); }}
              className="w-full py-3 rounded-xl btn-monochrome-primary text-xs font-semibold cursor-pointer"
            >
              Done & Return
            </button>
          </div>
        ) : (
          /* Order Form */
          <>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Fast Fiber Deployment</span>
              </div>
              <h3 className="text-xl font-bold text-white">Order Fiber Connection</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Selected: <span className="text-white font-semibold">{selectedPackage.package}</span> ({selectedPackage.speed}) • ৳ {parseFloat(selectedPackage.price || 0).toLocaleString()} / mo
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shakil Ahmed"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Installation / House Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Building No, Flat, Road, Area, District"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Additional Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Preferred installation timing, ONU requirements, etc."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl btn-monochrome-primary text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? (
                    <span>Submitting Order...</span>
                  ) : (
                    <>
                      <span>Confirm Connection Request</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
