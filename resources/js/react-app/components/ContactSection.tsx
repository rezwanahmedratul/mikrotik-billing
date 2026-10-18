import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Radio,
  Server,
  ShieldCheck,
} from 'lucide-react';
import { SiteData } from '../types/site';

export interface ContactSectionProps {
  siteData?: SiteData;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ siteData = {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    comment: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || (!formData.phone && !formData.email) || !formData.comment) {
      setStatus({
        type: 'error',
        message: 'Please fill in your name, contact info (phone or email), and message.',
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/public/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus({
          type: 'success',
          message: data.message || 'Your inquiry has been received! Our support desk will reach out.',
        });
        setFormData({ name: '', phone: '', email: '', comment: '' });
      } else {
        setStatus({
          type: 'error',
          message: data.message || 'Something went wrong. Please call our hotline directly.',
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Network connection error. Please try again or call our hotline.',
      });
    } finally {
      setLoading(false);
    }
  };

  const address = siteData?.site_address || 'House 14, Road 5, Block C, Banani, Dhaka';
  const phone = siteData?.site_phone || '+880 1700-000000';
  const email = siteData?.site_email || 'support@smartisp.net';

  return (
    <section id="contact" className="py-20 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 text-xs font-mono text-zinc-300 shadow-sm mb-4">
            <Mail className="w-3.5 h-3.5 text-zinc-300" />
            <span>24/7 Field Support Desk</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans mb-3">
            Connect With Our Engineers.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Have a question about fiber routing, corporate leased lines, or account renewal? We are always online.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Contact Details & Regional NOC Info */}
          <div className="space-y-6">
            <div className="saas-card p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-white font-sans">Central Operations Center</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Direct fiber cross-connects and regional maintenance teams deployed 24/7 across all service districts.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-zinc-500 uppercase">Headquarters</div>
                    <div className="text-sm font-medium text-white">{address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-zinc-500 uppercase">24/7 NOC Hotline</div>
                    <a href={`tel:${phone}`} className="text-sm font-mono font-bold text-white hover:text-zinc-300 transition-colors">
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-zinc-500 uppercase">Support Email</div>
                    <a href={`mailto:${email}`} className="text-sm font-mono text-zinc-300 hover:text-white transition-colors">
                      {email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-white/10 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Support Queue Status:</span>
                </div>
                <span className="text-emerald-400 font-bold">Average Wait &lt; 2 Mins</span>
              </div>
            </div>

            {/* Regional NOC Hubs & Escalation Matrix */}
            <div className="saas-card p-6 sm:p-7 border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-zinc-300" />
                  <h4 className="text-sm font-bold text-white font-sans">Regional Field Dispatch Hubs</h4>
                </div>
                <span className="saas-badge">24/7 ON-CALL</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Equipped with optical fusion splicers, OTDR fault locators, and standby power generators for rapid localized link repairs.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-zinc-950/70 border border-white/5 text-xs font-mono">
                  <div className="text-zinc-500 text-[10px] mb-1">NORTH ZONE NOC</div>
                  <div className="text-white font-semibold">Gulshan & Banani</div>
                  <div className="text-emerald-400 text-[11px] mt-1">● Active Shift</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/70 border border-white/5 text-xs font-mono">
                  <div className="text-zinc-500 text-[10px] mb-1">WEST ZONE NOC</div>
                  <div className="text-white font-semibold">Dhanmondi & Mirpur</div>
                  <div className="text-emerald-400 text-[11px] mt-1">● Active Shift</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Contact Message Form */}
          <div className="saas-card p-6 sm:p-8 border border-white/10 shadow-xl space-y-5">
            <div>
              <h3 className="text-xl font-bold text-white font-sans">Send Direct Inquiry</h3>
              <p className="text-xs text-zinc-400 mt-1 font-sans">
                Fill in the details below and a network engineer will get back to you promptly.
              </p>
            </div>

            {status && (
              <div
                className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
                  status.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asif Mahmud"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="saas-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
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
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="saas-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Message or Inquiries *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your inquiry, new connection request, or routing questions..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="saas-input resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="saas-btn-primary w-full"
              >
                {loading ? (
                  <span>Dispatching Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Operations</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
