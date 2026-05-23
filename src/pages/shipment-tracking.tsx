import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Truck, CheckCircle2, Clock, AlertCircle, MapPin, Package,
  ChevronRight, ArrowLeft, RefreshCw,
} from 'lucide-react';
import RouteMap from '@/components/RouteMap';
import { allShipments } from '@/lib/mockData';
import type { ShipmentStatus } from '@/lib/mockData';

const STATUS_CFG: Record<ShipmentStatus, { color: string; bg: string; border: string; Icon: typeof Truck }> = {
  Pending:     { color: 'text-amber-700', bg: 'bg-amber-50',  border: 'border-amber-200',  Icon: Clock },
  'In Transit':{ color: 'text-blue-700',  bg: 'bg-blue-50',   border: 'border-blue-200',   Icon: Truck },
  Delivered:   { color: 'text-green-700', bg: 'bg-green-50',  border: 'border-green-200',  Icon: CheckCircle2 },
  Cancelled:   { color: 'text-red-700',   bg: 'bg-red-50',    border: 'border-red-200',    Icon: AlertCircle },
};

const STEPS: ShipmentStatus[] = ['Pending', 'In Transit', 'Delivered'];

export default function ShipmentTrackingPage() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || allShipments[0].id;

  const [selectedId, setSelectedId] = useState(initialId);
  const [shipmentStatuses, setShipmentStatuses] = useState<Record<string, ShipmentStatus>>(
    Object.fromEntries(allShipments.map((s) => [s.id, s.status]))
  );
  const [advancing, setAdvancing] = useState<string | null>(null);

  const selected = allShipments.find((s) => s.id === selectedId) ?? allShipments[0];
  const currentStatus = shipmentStatuses[selected.id];
  const cfg = STATUS_CFG[currentStatus];
  const stepIdx = STEPS.indexOf(currentStatus as typeof STEPS[number]);

  const advanceStatus = async (id: string) => {
    const cur = shipmentStatuses[id];
    const idx = STEPS.indexOf(cur as typeof STEPS[number]);
    if (idx < 0 || idx >= STEPS.length - 1) return;
    setAdvancing(id);
    await new Promise((r) => setTimeout(r, 700));
    setShipmentStatuses((prev) => ({ ...prev, [id]: STEPS[idx + 1] }));
    setAdvancing(null);
  };

  return (
    <>
      <title>Shipment Tracking – KisanUnnati Nexus</title>
      <meta name="description" content="Track your agricultural shipments in real-time on KisanUnnati Nexus." />

      <div className="min-h-screen bg-background py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Back */}
          <a href="/farmer-dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft size={15} />
            Back to Dashboard
          </a>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Shipment Tracking</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Select a shipment to view its full journey</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Shipment List ── */}
            <div className="lg:col-span-1 space-y-2">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Your Shipments</h2>
              {allShipments.map((s) => {
                const st = shipmentStatuses[s.id];
                const c = STATUS_CFG[st];
                const isActive = s.id === selectedId;
                return (
                  <motion.button
                    key={s.id}
                    whileHover={{ x: 2 }}
                    onClick={() => setSelectedId(s.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 ${
                      isActive ? 'border-primary bg-green-50/60 shadow-sm' : 'border-border bg-card hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground font-mono">{s.id}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${c.bg} ${c.color} ${c.border}`}>
                        {st}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-foreground">{s.crop} • {s.quantity}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{s.origin} → {s.destination}</p>
                    {isActive && <ChevronRight size={13} className="text-primary mt-1" />}
                  </motion.button>
                );
              })}
            </div>

            {/* ── Detail Panel ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="lg:col-span-2 space-y-5"
              >
                {/* Header card */}
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-lg font-bold text-foreground font-mono">{selected.id}</span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                          {currentStatus}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{selected.crop} — {selected.quantity}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                        <MapPin size={12} />
                        <span>{selected.origin}</span>
                        <ChevronRight size={11} />
                        <span>{selected.destination}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold text-foreground">₹{selected.amount.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-muted-foreground">Buyer: {selected.buyerName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{selected.logisticsPartner}</p>
                      <p className="text-xs font-mono text-muted-foreground">{selected.vehicleNo}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5">
                    <div className="flex items-center">
                      {STEPS.map((step, idx) => {
                        const done = idx <= stepIdx;
                        const isLast = idx === STEPS.length - 1;
                        return (
                          <div key={step} className={`flex items-center ${!isLast ? 'flex-1' : ''}`}>
                            <div className="flex flex-col items-center">
                              <motion.div
                                animate={{ scale: done ? 1 : 0.85 }}
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                                  done ? 'bg-primary border-primary' : 'bg-card border-border'
                                }`}
                              >
                                {done
                                  ? <CheckCircle2 size={16} className="text-white" />
                                  : <span className="text-xs font-bold text-muted-foreground">{idx + 1}</span>
                                }
                              </motion.div>
                              <span className={`text-[10px] mt-1 font-semibold whitespace-nowrap ${done ? 'text-primary' : 'text-muted-foreground'}`}>
                                {step}
                              </span>
                            </div>
                            {!isLast && (
                              <div className={`flex-1 h-0.5 mx-1 transition-all duration-500 ${idx < stepIdx ? 'bg-primary' : 'bg-border'}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Advance button (demo) */}
                  {currentStatus !== 'Delivered' && currentStatus !== 'Cancelled' && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <button
                        onClick={() => advanceStatus(selected.id)}
                        disabled={advancing === selected.id}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all duration-200 hover:shadow-md disabled:opacity-60"
                        style={{ background: 'linear-gradient(135deg,#1a5c2a,#2d7a3e)' }}
                      >
                        {advancing === selected.id
                          ? <><RefreshCw size={13} className="animate-spin" /> Updating...</>
                          : <><Truck size={13} /> Advance to "{STEPS[stepIdx + 1]}" (Demo)</>
                        }
                      </button>
                      <p className="text-[10px] text-muted-foreground mt-1">Click to simulate status update for demonstration</p>
                    </div>
                  )}
                </div>

                {/* Timeline */}
                {selected.timeline.length > 0 && (
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                      <Package size={15} className="text-primary" />
                      Shipment Timeline
                    </h3>
                    <div className="space-y-0">
                      {selected.timeline.map((event, i) => {
                        const isLast = i === selected.timeline.length - 1;
                        return (
                          <motion.div
                            key={event.label}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.3, ease: 'easeOut' }}
                            className="flex gap-4"
                          >
                            {/* Dot + line */}
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                                event.completed ? 'bg-primary border-primary' : 'bg-card border-border'
                              }`}>
                                {event.completed
                                  ? <CheckCircle2 size={14} className="text-white" />
                                  : <Clock size={14} className="text-muted-foreground" />
                                }
                              </div>
                              {!isLast && <div className={`w-0.5 flex-1 my-1 ${event.completed ? 'bg-primary/30' : 'bg-border'}`} />}
                            </div>
                            {/* Content */}
                            <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
                              <p className={`text-sm font-bold ${event.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {event.label}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                              <p className={`text-[11px] mt-1 font-mono ${event.completed ? 'text-primary' : 'text-muted-foreground'}`}>
                                {event.timestamp}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Route Map */}
                <RouteMap
                  origin={selected.origin}
                  destination={selected.destination}
                  status={currentStatus}
                  vehicleNo={selected.vehicleNo}
                  logisticsPartner={selected.logisticsPartner}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
