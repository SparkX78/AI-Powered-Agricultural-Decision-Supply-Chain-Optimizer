
import { motion } from 'framer-motion';


import {
  Sprout,
  TrendingUp,
  Truck,
  CheckCircle2,
  ArrowRight,
  Star,
  BarChart3,
  Package,
  MapPin,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Supply Chain SVG Graphic ─────────────────────────────────────────────────
function SupplyChainGraphic() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background blob */}
      <div
        className="absolute inset-0 rounded-3xl opacity-10"
        style={{ background: 'radial-gradient(circle at 60% 40%, #c9a227 0%, #1a5c2a 70%)' }}
      />

      <div className="relative z-10 w-full max-w-sm mx-auto px-4">
        {/* Flow nodes */}
        <div className="flex flex-col gap-4">
          {[
            {
              icon: Sprout,
              label: 'Farm',
              sublabel: 'Produce Listed',
              color: '#1a5c2a',
              bg: '#dcfce7',
            },
            {
              icon: Truck,
              label: 'Logistics',
              sublabel: 'Shipment Dispatched',
              color: '#c9a227',
              bg: '#fef9c3',
            },
            {
              icon: Package,
              label: 'Warehouse',
              sublabel: 'Quality Checked',
              color: '#1a5c2a',
              bg: '#dcfce7',
            },
            {
              icon: BarChart3,
              label: 'Market',
              sublabel: 'Trade Completed',
              color: '#c9a227',
              bg: '#fef9c3',
            },
          ].map((node, i) => (
            <motion.div
              key={node.label}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.4, ease: 'easeOut' }}
              className="flex items-center gap-4"
            >
              {/* Connector line */}
              {i > 0 && (
                <div className="absolute left-[2.35rem] mt-[-2rem]" style={{ marginTop: '-1.8rem' }}>
                  <div
                    className="w-0.5 h-4 mx-auto"
                    style={{ background: 'linear-gradient(to bottom, #1a5c2a40, #c9a22740)' }}
                  />
                </div>
              )}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: node.bg }}
              >
                <node.icon size={22} style={{ color: node.color }} />
              </div>
              <div className="flex-1 bg-white rounded-xl px-4 py-3 shadow-sm border border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{node.label}</span>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: node.bg, color: node.color }}
                  >
                    Live
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{node.sublabel}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Network lines decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" stroke="#1a5c2a" strokeWidth="1" fill="none" />
            <circle cx="100" cy="100" r="50" stroke="#c9a227" strokeWidth="1" fill="none" />
            <line x1="20" y1="100" x2="180" y2="100" stroke="#1a5c2a" strokeWidth="1" />
            <line x1="100" y1="20" x2="100" y2="180" stroke="#1a5c2a" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Mini UI Mockup: Produce Tracking ─────────────────────────────────────────
function ProduceTrackingMockup() {
  const items = [
    { name: 'Wheat', qty: '2.4 MT', status: 'In Transit', pct: 65 },
    { name: 'Rice', qty: '1.8 MT', status: 'Delivered', pct: 100 },
    { name: 'Tomatoes', qty: '0.6 MT', status: 'Packed', pct: 30 },
  ];
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-border mt-4 space-y-3">
      {items.map((item) => (
        <div key={item.name}>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-foreground">{item.name}</span>
            <span className="text-muted-foreground">{item.qty}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${item.pct}%`,
                background: item.pct === 100 ? '#1a5c2a' : '#c9a227',
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{item.status}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Mini UI Mockup: Market Prices ────────────────────────────────────────────
function MarketPriceMockup() {
  const prices = [
    { crop: 'Wheat', price: '₹2,150', change: '+2.3%', up: true },
    { crop: 'Rice', price: '₹3,420', change: '-0.8%', up: false },
    { crop: 'Soybean', price: '₹4,890', change: '+5.1%', up: true },
  ];
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-border mt-4 space-y-2">
      {prices.map((p) => (
        <div key={p.crop} className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">{p.crop}</span>
          <span className="text-xs font-semibold text-foreground">{p.price}</span>
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded ${
              p.up ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
            }`}
          >
            {p.change}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Mini UI Mockup: Shipment ─────────────────────────────────────────────────
function ShipmentMockup() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-border mt-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-foreground">SHP-2024-0847</span>
        <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
          In Transit
        </span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        {['Picked Up', 'In Transit', 'Hub', 'Delivered'].map((step, i) => (
          <div key={step} className="flex items-center gap-1 flex-1">
            <div
              className={`w-2 h-2 rounded-full shrink-0 ${i <= 1 ? 'bg-primary' : 'bg-muted'}`}
            />
            {i < 3 && (
              <div className={`flex-1 h-0.5 ${i < 1 ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin size={11} />
        <span>Ludhiana → Delhi Mandi</span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <title>KisanUnnati Nexus | Agritech Platform</title>
      <meta
        name="description"
        content="KisanUnnati Nexus — Smart Agritech Supply Chain Platform connecting farmers, logistics providers, and businesses across India."
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f7f5f0] via-[#f0ede4] to-[#e8f5ec] min-h-[90vh] flex items-center">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#1a5c2a]/5 to-transparent" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#c9a227]/5 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={fadeUp}>
                <span
                  className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border"
                  style={{
                    background: '#dcfce7',
                    color: '#1a5c2a',
                    borderColor: '#bbf7d0',
                  }}
                >
                  <Sprout size={12} />
                  India's Agritech Supply Chain Platform
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <span style={{ color: '#1a5c2a' }}>KisanUnnati</span>
                <br />
                <span style={{ color: '#c9a227' }}>Nexus</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg"
              >
                Smart Agritech Supply Chain Platform for Farmers and Businesses — connecting
                produce, logistics, and markets in one trusted ecosystem.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #1a5c2a, #2d7a3e)' }}
                >
                  For Farmers
                  <ArrowRight size={16} />
                </a>
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 border"
                  style={{
                    background: 'linear-gradient(135deg, #c9a227, #e0b830)',
                    color: '#fff',
                    borderColor: '#c9a227',
                  }}
                >
                  For Businesses
                  <ArrowRight size={16} />
                </a>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                {[
                  { icon: ShieldCheck, text: 'Govt. Verified' },
                  { icon: Users, text: '10,000+ Farmers' },
                  { icon: Zap, text: 'Real-time Tracking' },
                ].map((badge) => (
                  <div key={badge.text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <badge.icon size={14} className="text-primary" />
                    <span>{badge.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Supply Chain Graphic */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
              className="relative h-[480px] lg:h-[520px]"
            >
              <SupplyChainGraphic />
            </motion.div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
              {[
                { value: '10,000+', label: 'Farmers' },
                { value: '500+', label: 'Logistics Partners' },
                { value: '₹50Cr+', label: 'Trade Enabled' },
                { value: '28', label: 'States Covered' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="text-xl font-bold"
                    style={{ fontFamily: 'Sora, sans-serif', color: '#1a5c2a' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES (Bento) ── */}
      <section id="features" className="py-24 bg-[#f7f5f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-widest text-primary mb-2"
            >
              Platform Features
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold text-foreground"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Everything you need to run a{' '}
              <span style={{ color: '#1a5c2a' }}>smarter supply chain</span>
            </motion.h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Card 1 — Produce Tracking (large) */}
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(26,92,42,0.12)' }}
              className="md:col-span-2 bg-white rounded-2xl p-6 border border-border transition-all duration-200"
            >
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full mb-3"
                style={{ background: '#dcfce7', color: '#1a5c2a' }}
              >
                <Sprout size={12} />
                Produce Tracking
              </div>
              <h3
                className="text-xl font-bold text-foreground mb-1"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Real-time Produce Visibility
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Track every batch from harvest to delivery. Know exactly where your produce is at
                every step of the supply chain.
              </p>
              <ProduceTrackingMockup />
            </motion.div>

            {/* Card 2 — Market Prices */}
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(201,162,39,0.12)' }}
              className="bg-white rounded-2xl p-6 border border-border transition-all duration-200"
            >
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full mb-3"
                style={{ background: '#fef9c3', color: '#a16207' }}
              >
                <TrendingUp size={12} />
                Market Intelligence
              </div>
              <h3
                className="text-xl font-bold text-foreground mb-1"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Live Market Prices
              </h3>
              <p className="text-sm text-muted-foreground">
                Access real-time mandi prices and historical trends to make informed selling
                decisions.
              </p>
              <MarketPriceMockup />
            </motion.div>

            {/* Card 3 — Shipment Management */}
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(26,92,42,0.12)' }}
              className="md:col-span-3 bg-white rounded-2xl p-6 border border-border transition-all duration-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                  <div
                    className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full mb-3"
                    style={{ background: '#dcfce7', color: '#1a5c2a' }}
                  >
                    <Truck size={12} />
                    Shipment Management
                  </div>
                  <h3
                    className="text-xl font-bold text-foreground mb-1"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    End-to-End Logistics Control
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Manage shipments, assign logistics partners, and track deliveries in real-time
                    from a single dashboard.
                  </p>
                  <ul className="mt-4 space-y-2">
                    {[
                      'Automated dispatch notifications',
                      'Multi-carrier support',
                      'Proof of delivery capture',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 size={14} className="text-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <ShipmentMockup />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-widest text-primary mb-2"
            >
              How It Works
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold text-foreground"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Three steps to a smarter harvest
            </motion.h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          >
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-20" />

            {[
              {
                step: '01',
                title: 'Register',
                desc: 'Create your profile as a farmer, logistics provider, or business owner. Verify your identity and get started in minutes.',
                color: '#1a5c2a',
                bg: '#dcfce7',
              },
              {
                step: '02',
                title: 'List Produce',
                desc: 'Add your crops with quantity, quality grade, and expected harvest date. Set your price or let the platform suggest market rates.',
                color: '#c9a227',
                bg: '#fef9c3',
              },
              {
                step: '03',
                title: 'Connect & Ship',
                desc: 'Match with verified buyers and logistics partners. Track your shipment in real-time until delivery is confirmed.',
                color: '#1a5c2a',
                bg: '#dcfce7',
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                className="relative flex flex-col items-center text-center"
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shadow-sm"
                  style={{ background: item.bg }}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{ fontFamily: 'Sora, sans-serif', color: item.color }}
                  >
                    {item.step}
                  </span>
                </div>
                <h3
                  className="text-lg font-bold text-foreground mb-2"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FOR FARMERS / FOR BUSINESSES ── */}
      <section id="for-farmers" className="py-24 bg-[#f7f5f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* For Farmers */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="rounded-2xl p-8 border border-border"
              style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' }}
            >
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full mb-5"
                style={{ background: '#bbf7d0', color: '#1a5c2a' }}
              >
                <Sprout size={12} />
                For Farmers
              </div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'Sora, sans-serif', color: '#1a5c2a' }}
              >
                Grow more. Earn more. Worry less.
              </h3>
              <ul className="space-y-3">
                {[
                  'Access live mandi prices before you sell',
                  'Connect directly with verified buyers — no middlemen',
                  'Track your shipments from farm to market',
                  'Get paid faster with digital transactions',
                  'Access government scheme information',
                  'Weather alerts and crop advisory',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#1c2b1e]">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="/login"
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: '#1a5c2a' }}
              >
                Join as Farmer
                <ArrowRight size={15} />
              </a>
            </motion.div>

            {/* For Businesses */}
            <motion.div
              id="for-businesses"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="rounded-2xl p-8 border"
              style={{
                background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                borderColor: '#fde68a',
              }}
            >
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full mb-5"
                style={{ background: '#fde68a', color: '#92400e' }}
              >
                <BarChart3 size={12} />
                For Businesses
              </div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'Sora, sans-serif', color: '#92400e' }}
              >
                Source smarter. Scale faster.
              </h3>
              <ul className="space-y-3">
                {[
                  'Browse verified produce listings from 10,000+ farmers',
                  'Negotiate and close deals on the platform',
                  'Manage bulk orders with automated workflows',
                  'Real-time supply chain visibility dashboard',
                  'Quality-graded produce with certifications',
                  'Analytics on procurement trends and costs',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#1c2b1e]">
                    <CheckCircle2 size={16} style={{ color: '#c9a227' }} className="shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="/login"
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: '#c9a227' }}
              >
                Join as Business
                <ArrowRight size={15} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-widest text-primary mb-2"
            >
              Testimonials
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold text-foreground"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Trusted by farmers and businesses
            </motion.h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                quote:
                  'KisanUnnati Nexus helped me get 18% better prices for my wheat crop. I can now see live mandi rates and choose the best time to sell.',
                name: 'Ramesh Patel',
                role: 'Wheat Farmer, Punjab',
                img: '/airo-assets/images/pages/home/farmer-portrait',
              },
              {
                quote:
                  'Managing procurement for our food processing unit used to be chaotic. Now we have a single dashboard for all our supplier relationships.',
                name: 'Anita Sharma',
                role: 'Operations Head, AgroFoods Ltd.',
                img: '/airo-assets/images/pages/home/business-owner-portrait',
              },
              {
                quote:
                  'The shipment tracking feature is a game-changer. Our delivery disputes dropped by 60% since we started using the platform.',
                name: 'Suresh Kumar',
                role: 'Rice Farmer, Andhra Pradesh',
                img: '/airo-assets/images/pages/home/farmer-portrait',
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(26,92,42,0.08)' }}
                className="bg-[#f7f5f0] rounded-2xl p-6 border border-border transition-all duration-200"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} fill="#c9a227" stroke="none" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 bg-[#0f3318]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col lg:flex-row items-center justify-between gap-8"
          >
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-green-400 mb-3">
                Get Started Today
              </p>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white leading-tight"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Join India's fastest-growing{' '}
                <span style={{ color: '#c9a227' }}>agritech network</span>
              </h2>
              <p className="text-green-200/70 mt-3 text-sm leading-relaxed">
                Whether you're a farmer looking for better prices or a business seeking reliable
                supply — KisanUnnati Nexus is your platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                style={{ background: 'linear-gradient(135deg, #1a5c2a, #2d7a3e)' }}
              >
                Register as Farmer
                <ArrowRight size={16} />
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #c9a227, #e0b830)',
                  color: '#fff',
                }}
              >
                Register as Business
                <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
