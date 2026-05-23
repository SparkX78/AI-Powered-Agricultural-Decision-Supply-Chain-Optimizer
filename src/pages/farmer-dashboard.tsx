import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp, Truck, History, Bell, Mic, ChevronRight,
  ArrowUpRight, ArrowDownRight, CheckCircle2, Clock, AlertCircle,
  Sprout, LogOut, User, IndianRupee, Plus,
} from 'lucide-react';
import { marketPrices, shipments, orderHistory } from '@/lib/mockData';
import type { ShipmentStatus } from '@/lib/mockData';
import VoiceAssistant from '@/components/VoiceAssistant';
import type { Section } from '@/components/VoiceAssistant';

const STATUS_CFG: Record<ShipmentStatus, { label: string; color: string; bg: string; border: string; Icon: typeof Truck }> = {
  Pending:    { label: 'Pending',    color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200',  Icon: Clock },
  'In Transit':{ label: 'In Transit', color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',   Icon: Truck },
  Delivered:  { label: 'Delivered',  color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200',  Icon: CheckCircle2 },
  Cancelled:  { label: 'Cancelled',  color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200',    Icon: AlertCircle },
};

const STEPS: ShipmentStatus[] = ['Pending', 'In Transit', 'Delivered'];

const notifications = [
  { id: 1, text: 'Your wheat shipment SHP-2026-0847 is in transit', time: '2h ago', read: false },
  { id: 2, text: 'Tomato prices up 5.1% at Vashi APMC today',       time: '4h ago', read: false },
  { id: 3, text: 'New buyer inquiry for Rice — Basmati 1121',        time: '1d ago', read: true  },
];

export default function FarmerDashboard() {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [voiceOpen, setVoiceOpen]         = useState(false);
  const [notifOpen, setNotifOpen]         = useState(false);
  const [notifs, setNotifs]               = useState(notifications);

  const pricesRef   = useRef<HTMLDivElement>(null);
  const trackingRef = useRef<HTMLDivElement>(null);
  const historyRef  = useRef<HTMLDivElement>(null);
  const refs = { prices: pricesRef, tracking: trackingRef, history: historyRef };

  const unread = notifs.filter((n) => !n.read).length;

  const scrollTo = (section: Section) => {
    setActiveSection(section);
    if (section !== 'overview') {
      setTimeout(() => refs[section as keyof typeof refs]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  };

  const navItems = [
    { id: 'overview' as Section, label: 'Overview',       Icon: Sprout },
    { id: 'prices'   as Section, label: 'Market Prices',  Icon: TrendingUp },
    { id: 'tracking' as Section, label: 'Track Shipments',Icon: Truck },
    { id: 'history'  as Section, label: 'Order History',  Icon: History },
  ];

  const totalEarnings = orderHistory.reduce((s, o) => s + o.amount, 0);

  return (
    <>
      <title>Farmer Dashboard – KisanUnnati Nexus</title>
      <meta name="description" content="Farmer dashboard — track prices, shipments, and orders on KisanUnnati Nexus." />

      <div className="min-h-screen bg-background">
        {/* ── Top Bar ── */}
        <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-1">
                <Sprout size={20} style={{ color: '#1a5c2a' }} />
                <span className="font-bold text-base" style={{ color: '#1a5c2a' }}>KisanUnnati</span>
                <span className="font-bold text-base" style={{ color: '#c9a227' }}>Nexus</span>
              </a>
              <span className="hidden sm:block text-xs text-muted-foreground border-l border-border pl-3">Farmer Dashboard</span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label={`${unread} unread notifications`}
                >
                  <Bell size={19} className="text-muted-foreground" />
                  {unread > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-80 bg-card rounded-xl shadow-xl border border-border z-50"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <span className="text-sm font-semibold">Notifications</span>
                        <button
                          onClick={() => setNotifs((p) => p.map((n) => ({ ...n, read: true })))}
                          className="text-xs text-primary hover:underline"
                        >
                          Mark all read
                        </button>
                      </div>
                      {notifs.map((n) => (
                        <div key={n.id} className={`px-4 py-3 border-b border-border last:border-0 ${!n.read ? 'bg-green-50/60' : ''}`}>
                          <p className="text-xs text-foreground leading-relaxed">{n.text}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Voice button */}
              <button
                onClick={() => setVoiceOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg,#1a5c2a,#2d7a3e)' }}
                aria-label="Open voice assistant"
              >
                <Mic size={15} />
                <span className="hidden sm:inline">Voice</span>
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <User size={15} className="text-primary" />
                </div>
                <span className="hidden sm:block text-sm font-medium">Ramesh Patel</span>
              </div>
              <a href="/" className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Sign out">
                <LogOut size={17} className="text-muted-foreground" />
              </a>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Greeting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Good morning, Ramesh! 🌤️</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Here's your farm overview for Monday, 06 April 2026.</p>
            </div>
            <a
              href="/post-produce"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg transition-all self-start sm:self-auto"
              style={{ background: 'linear-gradient(135deg,#1a5c2a,#2d7a3e)' }}
            >
              <Plus size={15} />
              Post Produce
            </a>
          </div>

          {/* Nav tabs */}
          <nav aria-label="Dashboard sections" className="flex gap-1 bg-card rounded-xl p-1 border border-border mb-6 overflow-x-auto">
            {navItems.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeSection === id ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </nav>

          {/* ── Overview Cards ── */}
          <section aria-label="Summary statistics" className="mb-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Active Shipments', value: '2',                               Icon: Truck,        color: '#1a5c2a', bg: '#dcfce7', sub: '1 in transit' },
                { label: 'Total Earnings',   value: `₹${(totalEarnings/1000).toFixed(0)}K`, Icon: IndianRupee,  color: '#c9a227', bg: '#fef9c3', sub: 'This season' },
                { label: 'Orders Done',      value: '5',                               Icon: CheckCircle2, color: '#1a5c2a', bg: '#dcfce7', sub: 'All time' },
                { label: 'Pending Orders',   value: '1',                               Icon: Clock,        color: '#c9a227', bg: '#fef9c3', sub: 'Awaiting dispatch' },
              ].map((c) => (
                <motion.div
                  key={c.label}
                  whileHover={{ y: -3, boxShadow: '0 8px 28px rgba(26,92,42,0.10)' }}
                  className="bg-card rounded-xl p-4 border border-border transition-all duration-200 cursor-default"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: c.bg }}>
                    <c.Icon size={18} style={{ color: c.color }} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{c.value}</p>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{c.label}</p>
                  <p className="text-xs text-muted-foreground">{c.sub}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Market Prices ── */}
          <section ref={pricesRef} aria-labelledby="prices-h" className="mb-8 scroll-mt-20">
            <div className="flex items-center justify-between mb-4">
              <h2 id="prices-h" className="text-lg font-bold text-foreground">Today's Market Prices</h2>
              <span className="text-xs text-muted-foreground bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">
                Live • 06 Apr 2026
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {marketPrices.map((item, i) => (
                <motion.div
                  key={item.crop}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' }}
                  whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(26,92,42,0.09)' }}
                  className="bg-card rounded-xl p-4 border border-border transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl" role="img" aria-label={item.crop}>{item.emoji}</span>
                    <span className={`flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${item.change >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {item.change >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                      {Math.abs(item.change)}%
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground">{item.crop}</p>
                  <p className="text-[11px] text-muted-foreground">{item.variety}</p>
                  <p className="text-xl font-bold mt-1" style={{ color: '#1a5c2a' }}>₹{item.price.toLocaleString('en-IN')}</p>
                  <p className="text-[11px] text-muted-foreground">{item.unit}</p>
                  <div className="mt-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground truncate">{item.mandi}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Shipment Tracking ── */}
          <section ref={trackingRef} aria-labelledby="tracking-h" className="mb-8 scroll-mt-20">
            <div className="flex items-center justify-between mb-4">
              <h2 id="tracking-h" className="text-lg font-bold text-foreground">Track Shipments</h2>
              <a href="/shipment-tracking" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                Full tracking <ChevronRight size={12} />
              </a>
            </div>
            <div className="space-y-3">
              {shipments.map((s, i) => {
                const cfg = STATUS_CFG[s.status];
                const stepIdx = STEPS.indexOf(s.status as typeof STEPS[number]);
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.3, ease: 'easeOut' }}
                    whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(26,92,42,0.08)' }}
                    className="bg-card rounded-xl p-4 border border-border transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
                          <cfg.Icon size={18} className={cfg.color} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-foreground">{s.id}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                              {s.status}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{s.crop} • {s.quantity}</p>
                          <p className="text-xs text-muted-foreground">{s.origin} → {s.destination}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-foreground">₹{s.amount.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-muted-foreground">Exp: {s.expectedDelivery}</p>
                        <a href={`/shipment-tracking?id=${s.id}`} className="inline-flex items-center gap-0.5 text-xs text-primary font-semibold hover:underline mt-0.5">
                          Track <ChevronRight size={11} />
                        </a>
                      </div>
                    </div>
                    {/* Progress */}
                    <div className="mt-3 flex items-center gap-0">
                      {STEPS.map((step, idx) => {
                        const done = idx <= stepIdx;
                        return (
                          <div key={step} className="flex items-center flex-1">
                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors duration-300 ${done ? 'bg-primary' : 'bg-muted'}`} />
                            {idx < STEPS.length - 1 && (
                              <div className={`flex-1 h-0.5 transition-colors duration-300 ${idx < stepIdx ? 'bg-primary' : 'bg-muted'}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-1">
                      {STEPS.map((step) => (
                        <span key={step} className="text-[10px] text-muted-foreground">{step}</span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* ── Order History ── */}
          <section ref={historyRef} aria-labelledby="history-h" className="mb-8 scroll-mt-20">
            <h2 id="history-h" className="text-lg font-bold text-foreground mb-4">Order History</h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" role="table">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      {['Order ID', 'Crop', 'Buyer', 'Amount', 'Date', 'Status'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orderHistory.map((o, i) => {
                      const cfg = STATUS_CFG[o.status];
                      return (
                        <motion.tr
                          key={o.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.04 }}
                          className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-4 py-3 font-mono text-xs text-foreground whitespace-nowrap">{o.id}</td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-foreground">{o.crop}</p>
                            <p className="text-xs text-muted-foreground">{o.quantity}</p>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{o.buyer}</td>
                          <td className="px-4 py-3 font-bold text-foreground whitespace-nowrap">₹{o.amount.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{o.date}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full border whitespace-nowrap ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                              {o.status}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>

        {/* ── Voice FAB ── */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setVoiceOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full text-white shadow-xl flex items-center justify-center z-40 hover:shadow-2xl transition-shadow"
          style={{ background: 'linear-gradient(135deg,#1a5c2a,#2d7a3e)' }}
          aria-label="Open voice assistant"
        >
          <Mic size={22} />
        </motion.button>

        {/* ── Voice Assistant ── */}
        <VoiceAssistant
          open={voiceOpen}
          onClose={() => setVoiceOpen(false)}
          onNavigate={(section) => scrollTo(section)}
        />
      </div>
    </>
  );
}
