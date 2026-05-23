import { motion } from 'motion/react';
import { Sprout, ShieldCheck, Users, TrendingUp, Truck, Leaf, Star, ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function AboutPage() {
  return (
    <>
      <title>About – KisanUnnati Nexus | Agritech Platform</title>
      <meta name="description" content="Learn about KisanUnnati Nexus — India's smart agritech supply chain platform connecting farmers, logistics, and businesses." />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#f0fdf4] to-background py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border" style={{ background: '#dcfce7', color: '#1a5c2a', borderColor: '#bbf7d0' }}>
                <Leaf size={12} /> Our Story
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
              Empowering India's <span style={{ color: '#1a5c2a' }}>10 crore farmers</span> with technology
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              KisanUnnati Nexus was built with one mission — to remove the barriers between farmers and fair markets, and to make the agricultural supply chain transparent, efficient, and profitable for everyone involved.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, ease: 'easeOut' }}>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Our Mission</p>
              <h2 className="text-3xl font-bold text-foreground mb-4 leading-tight">
                A fair deal for every farmer, every harvest
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For decades, Indian farmers have faced information asymmetry — not knowing the right price, the right buyer, or the right time to sell. Middlemen took large cuts, and farmers received far less than their produce was worth.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                KisanUnnati Nexus changes this by giving farmers direct access to live mandi prices, verified buyers, and real-time shipment tracking — all in one simple platform designed for low digital literacy.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: '10,000+', label: 'Farmers Onboarded', color: '#1a5c2a', bg: '#dcfce7' },
                { value: '₹50Cr+',  label: 'Trade Enabled',     color: '#c9a227', bg: '#fef9c3' },
                { value: '28',      label: 'States Covered',    color: '#1a5c2a', bg: '#dcfce7' },
                { value: '500+',    label: 'Logistics Partners', color: '#c9a227', bg: '#fef9c3' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-5 border border-border text-center" style={{ background: s.bg }}>
                  <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Our Values</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-foreground">What we stand for</motion.h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { Icon: ShieldCheck, title: 'Transparency',  desc: 'Every price, every transaction, every shipment — fully visible to all parties.',        color: '#1a5c2a', bg: '#dcfce7' },
              { Icon: Users,       title: 'Inclusivity',   desc: 'Designed for farmers with low digital literacy. Simple icons, plain language.',          color: '#c9a227', bg: '#fef9c3' },
              { Icon: TrendingUp,  title: 'Fair Pricing',  desc: 'Live mandi rates ensure farmers always know the true market value of their produce.',    color: '#1a5c2a', bg: '#dcfce7' },
              { Icon: Truck,       title: 'Reliability',   desc: 'Verified logistics partners and real-time tracking ensure produce reaches safely.',       color: '#c9a227', bg: '#fef9c3' },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(26,92,42,0.10)' }}
                className="bg-card rounded-xl p-5 border border-border transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: v.bg }}>
                  <v.Icon size={20} style={{ color: v.color }} />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Our Team</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-foreground">Built by people who care about agriculture</motion.h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: 'Arjun Mehta',    role: 'Co-Founder & CEO',       bg: '#dcfce7', color: '#1a5c2a', stars: 5, quote: 'Grew up in a farming family in Gujarat. Built this to solve problems I saw firsthand.' },
              { name: 'Priya Nair',     role: 'Co-Founder & CTO',       bg: '#fef9c3', color: '#c9a227', stars: 5, quote: 'Technology should serve the people who feed us. That\'s why I joined this mission.' },
              { name: 'Vikram Sharma',  role: 'Head of Farmer Relations',bg: '#dcfce7', color: '#1a5c2a', stars: 5, quote: 'I spend 3 weeks every month in the field, listening to farmers and improving the platform.' },
            ].map((m) => (
              <motion.div
                key={m.name}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-background rounded-xl p-6 border border-border transition-all duration-200 text-center"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-border" style={{ background: m.bg }}>
                  <Sprout size={28} style={{ color: m.color }} />
                </div>
                <h3 className="text-sm font-bold text-foreground">{m.name}</h3>
                <p className="text-xs text-primary font-semibold mt-0.5">{m.role}</p>
                <div className="flex justify-center gap-0.5 my-3">
                  {[...Array(m.stars)].map((_, i) => <Star key={i} size={12} fill="#c9a227" stroke="none" />)}
                </div>
                <p className="text-xs text-muted-foreground italic leading-relaxed">"{m.quote}"</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0f3318]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, ease: 'easeOut' }}>
            <h2 className="text-3xl font-bold text-white mb-4">Ready to join the movement?</h2>
            <p className="text-green-200/70 mb-7 text-sm leading-relaxed">
              Whether you're a farmer, a business, or a logistics provider — there's a place for you on KisanUnnati Nexus.
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background: 'linear-gradient(135deg,#1a5c2a,#2d7a3e)' }}
            >
              Get Started Today <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
