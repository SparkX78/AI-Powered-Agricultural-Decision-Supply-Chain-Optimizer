import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Truck, Users, TrendingUp, Package, CheckCircle2, Clock, AlertCircle,
  LogOut, User, Bell, Sprout, BarChart3, ChevronUp, ChevronDown,
} from 'lucide-react';
import { ownerStats, farmers, allShipments, dailyActivityData, shipmentTrendData } from '@/lib/mockData';
import type { ShipmentStatus } from '@/lib/mockData';

const STATUS_CFG: Record<ShipmentStatus, { color: string; bg: string; border: string }> = {
  Pending:     { color: 'text-amber-700', bg: 'bg-amber-50',  border: 'border-amber-200' },
  'In Transit':{ color: 'text-blue-700',  bg: 'bg-blue-50',   border: 'border-blue-200'  },
  Delivered:   { color: 'text-green-700', bg: 'bg-green-50',  border: 'border-green-200' },
  Cancelled:   { color: 'text-red-700',   bg: 'bg-red-50',    border: 'border-red-200'   },
};

// ── Simple bar chart ──────────────────────────────────────────────────────────
function SimpleBarChart({ data, valueKey, labelKey, color }: {
  data: Record<string, number | string>[];
  valueKey: string;
  labelKey: string;
  color: string;
}) {
  const max = Math.max(...data.map((d) => Number(d[valueKey])));
  return (
    <div className="flex items-end gap-2 h-32 w-full pt-4">
      {data.map((d) => {
        const pct = (Number(d[valueKey]) / max) * 100;
        return (
          <div key={String(d[labelKey])} className="flex flex-col items-center gap-1 flex-1">
            <span className="text-[10px] text-muted-foreground font-semibold">{d[valueKey]}</span>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${pct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              className="w-full rounded-t-md min-h-[4px]"
              style={{ background: color }}
            />
            <span className="text-[10px] text-muted-foreground">{d[labelKey]}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Dual bar chart ────────────────────────────────────────────────────────────
function DualBarChart({ data }: { data: typeof shipmentTrendData }) {
  const max = Math.max(...data.flatMap((d) => [d.delivered, d.pending]));
  return (
    <div className="flex items-end gap-3 h-32 w-full pt-4">
      {data.map((d) => (
        <div key={d.month} className="flex flex-col items-center gap-1 flex-1">
          <div className="flex items-end gap-0.5 w-full" style={{ height: '100px' }}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.delivered / max) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              className="flex-1 rounded-t-sm min-h-[4px]"
              style={{ background: '#1a5c2a' }}
            />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.pending / max) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              className="flex-1 rounded-t-sm min-h-[4px]"
              style={{ background: '#c9a227' }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function OwnerDashboard() {
  const [activeTab, setActiveTab]   = useState<'shipments' | 'farmers'>('shipments');
  const [sortField, setSortField]   = useState('');
  const [sortDir, setSortDir]       = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }: { field: string }) =>
    sortField !== field
      ? <ChevronUp size={11} className="text-muted-foreground/40" />
      : sortDir === 'asc'
        ? <ChevronUp size={11} className="text-primary" />
        : <ChevronDown size={11} className="text-primary" />;

  return (
    <>
      <title>Owner Dashboard – KisanUnnati Nexus</title>
      <meta name="description" content="Owner dashboard — manage shipments, farmers, and platform operations." />

      <div className="min-h-screen bg-background">
        {/* ── Header ── */}
        <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-1">
                <Sprout size={20} style={{ color: '#1a5c2a' }} />
                <span className="font-bold text-base" style={{ color: '#1a5c2a' }}>KisanUnnati</span>
                <span className="font-bold text-base" style={{ color: '#c9a227' }}>Nexus</span>
              </a>
              <span className="hidden sm:block text-xs text-muted-foreground border-l border-border pl-3">Owner Dashboard</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Notifications">
                <Bell size={19} className="text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true" />
              </button>
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <User size={15} style={{ color: '#c9a227' }} />
                </div>
                <span className="hidden sm:block text-sm font-semibold">Admin</span>
              </div>
              <a href="/" className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Sign out">
                <LogOut size={17} className="text-muted-foreground" />
              </a>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Owner Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Platform overview — April 2026</p>
          </div>

          {/* ── KPI Cards ── */}
          <section aria-label="Platform KPIs" className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {[
                { label: 'Total Shipments',     value: ownerStats.totalShipments.toLocaleString('en-IN'),          Icon: Truck,    color: '#1a5c2a', bg: '#dcfce7', sub: `${ownerStats.pendingShipments} pending`,  trend: '+12%' },
                { label: 'Total Revenue',        value: `₹${(ownerStats.totalRevenue/100000).toFixed(1)}L`,         Icon: TrendingUp,color: '#c9a227', bg: '#fef9c3', sub: 'This financial year',                    trend: '+18%' },
                { label: 'Active Farmers',       value: ownerStats.activeFarmers.toLocaleString('en-IN'),           Icon: Users,    color: '#1a5c2a', bg: '#dcfce7', sub: '28 states covered',                       trend: '+8%'  },
                { label: 'Logistics Partners',   value: ownerStats.activeLogisticsPartners.toLocaleString('en-IN'), Icon: Package,  color: '#c9a227', bg: '#fef9c3', sub: 'Verified & active',                       trend: '+5%'  },
              ].map((c) => (
                <motion.div
                  key={c.label}
                  whileHover={{ y: -3, boxShadow: '0 8px 28px rgba(26,92,42,0.10)' }}
                  className="bg-card rounded-xl p-5 border border-border transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: c.bg }}>
                      <c.Icon size={18} style={{ color: c.color }} />
                    </div>
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-green-50 text-green-700">{c.trend}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{c.value}</p>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{c.label}</p>
                  <p className="text-xs text-muted-foreground">{c.sub}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ── Charts ── */}
          <section aria-label="Analytics" className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Activity */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
                className="bg-card rounded-xl p-5 border border-border"
              >
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h2 className="text-sm font-bold text-foreground">Daily Shipment Activity</h2>
                    <p className="text-xs text-muted-foreground">This week (Mon–Sun)</p>
                  </div>
                  <BarChart3 size={17} className="text-muted-foreground" />
                </div>
                <SimpleBarChart data={dailyActivityData} valueKey="shipments" labelKey="day" color="#1a5c2a" />
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#1a5c2a' }} />
                    <span className="text-xs text-muted-foreground">Shipments/day</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Avg: {Math.round(dailyActivityData.reduce((a, b) => a + b.shipments, 0) / dailyActivityData.length)}/day
                  </span>
                </div>
              </motion.div>

              {/* Shipment Trends */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' }}
                className="bg-card rounded-xl p-5 border border-border"
              >
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h2 className="text-sm font-bold text-foreground">Shipment Trends</h2>
                    <p className="text-xs text-muted-foreground">Last 6 months</p>
                  </div>
                  <TrendingUp size={17} className="text-muted-foreground" />
                </div>
                <DualBarChart data={shipmentTrendData} />
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#1a5c2a' }} />
                    <span className="text-xs text-muted-foreground">Delivered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#c9a227' }} />
                    <span className="text-xs text-muted-foreground">Pending</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── Status Summary ── */}
          <section aria-label="Shipment status summary" className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Delivered This Month', value: ownerStats.deliveredThisMonth, Icon: CheckCircle2, color: '#1a5c2a', bg: '#dcfce7' },
                { label: 'In Transit',           value: 124,                           Icon: Truck,        color: '#2563eb', bg: '#eff6ff' },
                { label: 'Pending',              value: ownerStats.pendingShipments,   Icon: Clock,        color: '#d97706', bg: '#fffbeb' },
                { label: 'Cancelled',            value: 12,                            Icon: AlertCircle,  color: '#dc2626', bg: '#fef2f2' },
              ].map((s) => (
                <motion.div
                  key={s.label}
                  whileHover={{ y: -2 }}
                  className="bg-card rounded-xl p-4 border border-border flex items-center gap-3 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: s.bg }}>
                    <s.Icon size={18} style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Tables ── */}
          <section aria-label="Data tables">
            <div className="flex gap-1 bg-card rounded-xl p-1 border border-border mb-4 w-fit">
              {(['shipments', 'farmers'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  {tab === 'shipments' ? 'All Shipments' : 'Registered Farmers'}
                </button>
              ))}
            </div>

            {activeTab === 'shipments' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
                className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" role="table">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        {[
                          { label: 'Shipment ID', field: 'id' },
                          { label: 'Crop',        field: 'crop' },
                          { label: 'Route',       field: 'origin' },
                          { label: 'Amount',      field: 'amount' },
                          { label: 'Date',        field: 'dispatchDate' },
                          { label: 'Status',      field: 'status' },
                        ].map((col) => (
                          <th
                            key={col.field}
                            className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors whitespace-nowrap"
                            onClick={() => handleSort(col.field)}
                          >
                            <span className="flex items-center gap-1">{col.label} <SortIcon field={col.field} /></span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {allShipments.map((s, i) => {
                        const cfg = STATUS_CFG[s.status];
                        return (
                          <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                            className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 font-mono text-xs text-foreground whitespace-nowrap">{s.id}</td>
                            <td className="px-4 py-3">
                              <p className="font-semibold text-foreground">{s.crop}</p>
                              <p className="text-xs text-muted-foreground">{s.quantity}</p>
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">
                              <p className="whitespace-nowrap">{s.origin}</p>
                              <p className="whitespace-nowrap">→ {s.destination}</p>
                            </td>
                            <td className="px-4 py-3 font-bold text-foreground whitespace-nowrap">₹{s.amount.toLocaleString('en-IN')}</td>
                            <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{s.dispatchDate}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full border whitespace-nowrap ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                                {s.status}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'farmers' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
                className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" role="table">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        {['Farmer ID', 'Name', 'Location', 'Crops', 'Trades', 'Revenue', 'Status'].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {farmers.map((f, i) => (
                        <motion.tr key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                          className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-foreground">{f.id}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                <Sprout size={13} className="text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-foreground whitespace-nowrap">{f.name}</p>
                                <p className="text-xs text-muted-foreground whitespace-nowrap">Joined {f.joinedDate}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{f.village}, {f.state}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {f.crops.map((c) => (
                                <span key={c} className="text-[10px] px-1.5 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-200 whitespace-nowrap">{c}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-bold text-foreground text-center">{f.totalTrades}</td>
                          <td className="px-4 py-3 font-bold text-foreground whitespace-nowrap">₹{f.totalRevenue.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${f.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-muted text-muted-foreground border-border'}`}>
                              {f.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
