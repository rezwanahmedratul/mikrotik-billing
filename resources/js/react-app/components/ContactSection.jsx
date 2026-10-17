import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare,
  Clock,
  Sparkles
} from 'lucide-react';

export default function ContactSection({ siteData = {} }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || (!formData.phone && !formData.email) || !formData.comment) {
      setStatus({
        type: 'error',
        message: 'Please fill in your name, contact info (phone or email), and message.'
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
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus({
          type: 'success',
          message: data.message || 'Your inquiry has been received! Our support desk will reach out.'
        });
        setFormData({ name: '', phone: '', email: '', comment: '' });
      } else {
        setStatus({
          type: 'error',
          message: data.message || 'Something went wrong. Please call our hotline directly.'
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Network connection error. Please try again or call our hotline.'
      });
    } finally {
      setLoading(false);
    }
  };

  const address = siteData?.site_address || "House 14, Road 5, Block C, Banani, Dhaka";
  const phone = siteData?.site_phone || "+880 1700-000000";
  const email = siteData?.site_email || "support@smartisp.net";

  return (
    <section id="contact" className="py-20 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            <span>24/7 Field Support Desk</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Connect With Our Engineers.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Have a question about fiber routing, corporate leased lines, or account renewal? We are always online.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Contact Details & Direct Hotline */}
          <div className="space-y-6">
            <div className="rounded-2xl glass-panel-elevated p-6 sm:p-8 border border-white/10 space-y-6">
              <h3 className="text-xl font-bold text-white">Central Operations Center</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Direct fiber cross-connects and regional maintenance teams deployed 24/7 across all service districts.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-zinc-500 uppercase">Headquarters</div>
                    <div className="text-sm font-medium text-white">{address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-zinc-500 uppercase">24/7 NOC Hotline</div>
                    <a href={`tel:${phone}`} className="text-sm font-mono font-bold text-white hover:text-cyan-400 transition-colors">
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-indigo-400 flex-shrink-0">
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
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-white/5 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Support Queue Status:</span>
                </div>
                <span className="text-emerald-400 font-bold">Average Wait &lt; 2 Mins</span>
              </div>
            </div>

            {/* Embedded Location Map Preview */}
            <div className="rounded-2xl glass-card overflow-hidden border border-white/10 aspect-[16/9]">
              <iframe
                title="Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14602.700319808627!2d90.4045437!3d23.794582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70c15ea1de1%3A0x978563fae3e83344!2sBanani%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Interactive Contact Message Form */}
          <div className="rounded-2xl glass-panel-elevated p-6 sm:p-8 border border-white/10 space-y-5">
            <div>
              <h3 className="text-xl font-bold text-white">Send Direct Inquiry</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Fill in the details below and a network engineer will get back to you promptly.
              </p>
            </div>

            {status && (
              <div className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
                status.type === 'success' 
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' 
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              }`}>
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
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors"
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
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl btn-monochrome-primary text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <span>Dispatching Message...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
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
}
