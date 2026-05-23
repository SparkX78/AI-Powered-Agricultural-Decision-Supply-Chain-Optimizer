import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2,
  Clock, Headphones, Leaf, AlertCircle,
} from 'lucide-react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const CONTACT_CHANNELS = [
  {
    Icon: Phone,
    title: 'Farmer Helpline',
    desc: 'Toll-free support in Hindi, Punjabi, Marathi, Tamil & more',
    value: '1800-XXX-KISAN',
    sub: 'Mon–Sat, 7 AM – 9 PM',
    color: '#1a5c2a',
    bg: '#dcfce7',
    badge: 'Toll Free',
  },
  {
    Icon: Mail,
    title: 'Email Support',
    desc: 'For business inquiries, partnerships, and technical issues',
    value: 'support@kisanunnati.in',
    sub: 'Response within 24 hours',
    color: '#c9a227',
    bg: '#fef9c3',
    badge: null,
  },
  {
    Icon: MessageSquare,
    title: 'WhatsApp',
    desc: 'Quick queries and shipment updates via WhatsApp',
    value: '+91 98765 43210',
    sub: 'Available 8 AM – 8 PM',
    color: '#1a5c2a',
    bg: '#dcfce7',
    badge: 'Fast Reply',
  },
  {
    Icon: MapPin,
    title: 'Head Office',
    desc: 'Visit us for partnership discussions and onboarding',
    value: 'Bengaluru, Karnataka',
    sub: 'Koramangala, 560034',
    color: '#c9a227',
    bg: '#fef9c3',
    badge: null,
  },
];

const FAQS = [
  {
    q: 'How do I register as a farmer on KisanUnnati Nexus?',
    a: 'Click "Get Started" on the homepage, select "Farmer" as your role, and fill in your basic details. Our team will verify your account within 24 hours.',
  },
  {
    q: 'Is the platform available in regional languages?',
    a: 'Yes! The platform supports Hindi, Punjabi, Marathi, Tamil, Telugu, and Kannada. You can switch language from your profile settings.',
  },
  {
    q: 'How are market prices updated?',
    a: 'Prices are sourced from official APMC mandi data and updated every morning by 9 AM. We cover over 200 mandis across 28 states.',
  },
  {
    q: 'What happens if my shipment is delayed?',
    a: 'You will receive an SMS and in-app notification for any delay. You can also contact the logistics partner directly from the shipment tracking page.',
  },
  {
    q: 'How do I become a logistics partner?',
    a: 'Fill in the contact form below and select "Logistics Partnership" as your inquiry type. Our partnerships team will reach out within 2 business days.',
  },
];

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'farmer',
    subject: 'general',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    await new Promise((r) => setTimeout(r, 1200));
    setFormState('success');
  };

  const resetForm = () => {
    setForm({ name: '', email: '', phone: '', role: 'farmer', subject: 'general', message: '' });
    setFormState('idle');
  };

  return (
    <>
      <title>Contact Us – KisanUnnati Nexus</title>
      <meta name="description" content="Get in touch with KisanUnnati Nexus — farmer helpline, email support, WhatsApp, and office address." />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#f0fdf4] to-background py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border mb-4" style={{ background: '#dcfce7', color: '#1a5c2a', borderColor: '#bbf7d0' }}>
              <Headphones size={12} /> We're here to help
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Contact <span style={{ color: '#1a5c2a' }}>KisanUnnati</span> <span style={{ color: '#c9a227' }}>Nexus</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              Whether you're a farmer needing help, a business exploring partnerships, or a logistics provider — we're ready to assist.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Channels */}
      <section className="py-14 bg-background" aria-label="Contact channels">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONTACT_CHANNELS.map((ch, i) => (
              <motion.div
                key={ch.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.3, ease: 'easeOut' }}
                whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(26,92,42,0.10)' }}
                className="bg-card rounded-xl p-5 border border-border transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: ch.bg }}>
                    <ch.Icon size={20} style={{ color: ch.color }} />
                  </div>
                  {ch.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: ch.bg, color: ch.color }}>
                      {ch.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1">{ch.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{ch.desc}</p>
                <p className="text-sm font-bold" style={{ color: ch.color }}>{ch.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={11} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{ch.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + SMS/Voice Placeholders */}
      <section className="py-14 bg-card" aria-label="Contact form">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Left: Form */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-foreground mb-1">Send us a message</h2>
              <p className="text-sm text-muted-foreground mb-6">Fill in the form and we'll get back to you within one business day.</p>

              <AnimatePresence mode="wait">
                {formState === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center justify-center text-center py-16 px-8 bg-green-50 rounded-2xl border border-green-200"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <CheckCircle2 size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Message sent!</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
                      Thank you for reaching out. Our team will respond to <strong>{form.email || 'you'}</strong> within 24 hours.
                    </p>
                    <button
                      onClick={resetForm}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                      style={{ background: 'linear-gradient(135deg,#1a5c2a,#2d7a3e)' }}
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-4"
                    aria-label="Contact form"
                  >
                    {/* Name + Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                          Full Name <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="e.g. Ramesh Patel"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                          autoComplete="name"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                          Mobile Number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="10-digit number"
                          maxLength={10}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                          autoComplete="tel"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                        Email Address <span className="text-red-500" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        autoComplete="email"
                      />
                    </div>

                    {/* Role + Subject */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-foreground mb-1.5">
                          I am a...
                        </label>
                        <select
                          id="role"
                          name="role"
                          value={form.role}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        >
                          <option value="farmer">Farmer</option>
                          <option value="owner">Business Owner</option>
                          <option value="partner">Logistics Partner</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1.5">
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="shipment">Shipment Issue</option>
                          <option value="pricing">Pricing / Market Data</option>
                          <option value="partnership">Logistics Partnership</option>
                          <option value="technical">Technical Support</option>
                          <option value="feedback">Feedback</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                        Message <span className="text-red-500" aria-hidden="true">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Describe your query or issue in detail..."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                      />
                    </div>

                    {formState === 'error' && (
                      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2" role="alert">
                        <AlertCircle size={15} />
                        Something went wrong. Please try again.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={formState === 'submitting'}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                      style={{ background: 'linear-gradient(135deg,#1a5c2a,#2d7a3e)' }}
                    >
                      {formState === 'submitting' ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                          Sending...
                        </>
                      ) : (
                        <><Send size={15} /> Send Message</>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Notification placeholders + info */}
            <div className="lg:col-span-2 space-y-5">

              {/* SMS Notification placeholder */}
              <div className="bg-background rounded-xl border border-border p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#dcfce7' }}>
                    <Phone size={16} style={{ color: '#1a5c2a' }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">SMS Alerts</p>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Coming Soon</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  Get instant SMS notifications for shipment updates, price alerts, and payment confirmations — directly on your mobile.
                </p>
                <div className="space-y-2">
                  {[
                    'Shipment dispatched alerts',
                    'Delivery confirmation SMS',
                    'Price spike notifications',
                    'Payment received updates',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="text-xs text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <button
                  disabled
                  className="mt-4 w-full py-2 rounded-lg text-xs font-semibold text-muted-foreground bg-muted border border-border cursor-not-allowed"
                  aria-label="SMS alerts coming soon"
                >
                  Notify me when available
                </button>
              </div>

              {/* Voice Support placeholder */}
              <div className="bg-background rounded-xl border border-border p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#fef9c3' }}>
                    <Headphones size={16} style={{ color: '#c9a227' }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Voice Support</p>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Coming Soon</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  Speak to our platform in your local language. Ask about prices, track shipments, and get help — all by voice.
                </p>
                <div className="space-y-2">
                  {[
                    'Hindi, Punjabi, Marathi support',
                    'Voice-based shipment tracking',
                    'Mandi price by voice query',
                    'IVR helpline integration',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#c9a227' }} />
                      <span className="text-xs text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <button
                  disabled
                  className="mt-4 w-full py-2 rounded-lg text-xs font-semibold text-muted-foreground bg-muted border border-border cursor-not-allowed"
                  aria-label="Voice support coming soon"
                >
                  Notify me when available
                </button>
              </div>

              {/* Office hours */}
              <div className="bg-gradient-to-br from-[#0f3318] to-[#1a5c2a] rounded-xl p-5 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Leaf size={16} className="text-green-300" />
                  <p className="text-sm font-bold">Support Hours</p>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { day: 'Monday – Friday', time: '8:00 AM – 8:00 PM' },
                    { day: 'Saturday',        time: '9:00 AM – 6:00 PM' },
                    { day: 'Sunday',          time: 'Helpline only (9 AM – 1 PM)' },
                  ].map((row) => (
                    <div key={row.day} className="flex justify-between">
                      <span className="text-green-200/70">{row.day}</span>
                      <span className="font-semibold text-white">{row.time}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 text-xs text-green-200/60">
                  All times are IST (Indian Standard Time)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-background" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">FAQ</p>
            <h2 id="faq-heading" className="text-3xl font-bold text-foreground">Frequently asked questions</h2>
          </div>
          <div className="space-y-3" role="list">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.3, ease: 'easeOut' }}
                className="bg-card rounded-xl border border-border overflow-hidden"
                role="listitem"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/40 transition-colors"
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="text-sm font-semibold text-foreground pr-4">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center border border-border"
                  >
                    <span className="text-muted-foreground text-sm font-bold leading-none">+</span>
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      id={`faq-answer-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
