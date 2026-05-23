/**
 * Transport Jobs — Logistics partners browse and accept pickup jobs
 * Route: /transport-jobs
 * Standalone layout (no site header/footer)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Truck, LogOut, User, MapPin, Calendar, Package,
  CheckCircle2, Clock, ArrowLeft, Bell, IndianRupee,
  Navigation, Route, ChevronRight, AlertCircle, Star,
} from 'lucide-react';
import { transportJobs } from '@/lib/mockData';
import type { TransportJob } from '@/lib/mockData';

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<TransportJob['status'], { label: string; color: string; bg: string; border: string; Icon: typeof Truck }> = {
  Open:       { label: 'Open',       color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200',  Icon: Clock },
  Assigned:   { label: 'Assigned',   color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',   Icon: Truck },
  'Picked Up':{ label: 'Picked Up',  color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200',  Icon: Navigation },
  Delivered:  { label: 'Delivered',  color: 'text-gray-500',   bg: 'bg-gray-100',  border: 'border-gray-200',   Icon: CheckCircle2 },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function TransportJobs() {
  const [jobs, setJobs]           = useState<TransportJob[]>(transportJobs);
  const [activeTab, setActiveTab] = useState<'open' | 'my-jobs' | 'completed'>('open');
  const [confirmJob, setConfirmJob] = useState<TransportJob | null>(null);
  const [acceptedId, setAcceptedId] = useState<string | null>(null);

  const openJobs      = jobs.filter((j) => j.status === 'Open');
  const myJobs        = jobs.filter((j) => j.status === 'Assigned' || j.status === 'Picked Up');
  const completedJobs = jobs.filter((j) => j.status === 'Delivered');

  const totalEarnings = completedJobs.reduce((s, j) => s + j.paymentAmount, 0);
  const pendingEarnings = myJobs.reduce((s, j) => s + j.paymentAmount, 0);

  const handleAccept = (job: TransportJob) => {
    setAcceptedId(job.id);
    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id
            ? { ...j, status: 'Assigned' as const, assignedTo: 'FastMove Logistics' }
            : j
        )
      );
      setAcceptedId(null);
      setConfirmJob(null);
      setActiveTab('my-jobs');
    }, 1500);
  };

  const handleAdvanceStatus = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j;
        if (j.status === 'Assigned')   return { ...j, status: 'Picked Up' as const };
        if (j.status === 'Picked Up')  return { ...j, status: 'Delivered' as const };
        return j;
      })
    );
  };

  const tabCounts = { open: openJobs.length, 'my-jobs': myJobs.length, completed: completedJobs.length };

  return (
    <>
      <title>Transport Jobs – KisanUnnati Nexus</title>
      <meta name="description" content="Browse and accept produce transport jobs on KisanUnnati Nexus." />

      <div className="min-h-screen bg-background">
        {/* ── Top Bar ── */}
        <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/" className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Back">
                <ArrowLeft size={17} className="text-muted-foreground" />
              </a>
              <a href="/" className="flex items-center gap-1">
                <Truck size={20} style={{ color: '#1a5c2a' }} />
                <span className="font-bold text-base" style={{ color: '#1a5c2a' }}>KisanUnnati</span>
                <span className="font-bold text-base" style={{ color: '#c9a227' }}>Nexus</span>
              </a>
              <span className="hidden sm:block text-xs text-muted-foreground border-l border-border pl-3">Transport Jobs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Notifications">
                  <Bell size={18} className="text-muted-foreground" />
                  {openJobs.length > 0 && (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-green-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                      {openJobs.length}
                    </span>
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User size={15} className="text-blue-600" />
                </div>
                <span className="hidden sm:block text-sm font-medium">FastMove Logistics</span>
              </div>
              <a href="/" className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Sign out">
                <LogOut size={17} className="text-muted-foreground" />
              </a>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {/* ── Page Header ── */}
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-foreground">Transport Jobs</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Browse available pickup jobs — accept and earn by transporting produce to buyers.</p>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Open Jobs',        value: openJobs.length,                                     Icon: Clock,        color: '#1a5c2a', bg: '#dcfce7' },
              { label: 'Active Jobs',      value: myJobs.length,                                       Icon: Truck,        color: '#2563eb', bg: '#dbeafe' },
              { label: 'Completed',        value: completedJobs.length,                                Icon: CheckCircle2, color: '#6b7280', bg: '#f3f4f6' },
              { label: 'Total Earned',     value: `₹${(totalEarnings/1000).toFixed(0)}K`,              Icon: IndianRupee,  color: '#c9a227', bg: '#fef9c3' },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-xl p-4 border border-border">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2" style={{ background: s.bg }}>
                  <s.Icon size={16} style={{ color: s.color }} />
                </div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Pending earnings banner */}
          {pendingEarnings > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200 mb-5">
              <IndianRupee size={16} className="text-blue-600 shrink-0" />
              <p className="text-sm font-semibold text-blue-700">
                ₹{pendingEarnings.toLocaleString('en-IN')} pending from {myJobs.length} active job{myJobs.length > 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* ── Tabs ── */}
          <div className="flex gap-1 bg-card rounded-xl p-1 border border-border mb-5 w-fit">
            {([['open', 'Open Jobs'], ['my-jobs', 'My Jobs'], ['completed', 'Completed']] as const).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === id ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                {label}
                {tabCounts[id] > 0 && (
                  <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === id ? 'bg-white/20' : 'bg-muted'}`}>
                    {tabCounts[id]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Job list ── */}
          {(() => {
            const list = activeTab === 'open' ? openJobs : activeTab === 'my-jobs' ? myJobs : completedJobs;
            if (list.length === 0) {
              return (
                <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
                  <Truck size={36} className="mx-auto text-muted-foreground opacity-30 mb-3" />
                  <p className="text-sm font-semibold text-muted-foreground">
                    {activeTab === 'open' ? 'No open jobs right now' : activeTab === 'my-jobs' ? 'No active jobs' : 'No completed jobs yet'}
                  </p>
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {list.map((job, i) => {
                  const cfg = STATUS_CFG[job.status];
                  const isAccepting = acceptedId === job.id;
                  void isAccepting; // used for animation state
                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Job header */}
                      <div className="p-4 pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                              <cfg.Icon size={18} className={cfg.color} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-bold text-foreground">{job.id}</span>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                                  {cfg.label}
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-foreground mt-0.5">{job.crop}</p>
                              <p className="text-xs text-muted-foreground">Farmer: {job.farmerName}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xl font-bold" style={{ color: '#1a5c2a' }}>₹{job.paymentAmount.toLocaleString('en-IN')}</p>
                            <p className="text-xs text-muted-foreground">Transport fee</p>
                          </div>
                        </div>
                      </div>

                      {/* Route info */}
                      <div className="px-4 py-3 border-t border-border bg-muted/30">
                        <div className="flex items-start gap-3">
                          {/* Route visual */}
                          <div className="flex flex-col items-center gap-1 shrink-0 mt-0.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                            <div className="w-0.5 h-6 bg-border" />
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#c9a227' }} />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div>
                              <p className="text-xs font-semibold text-foreground">Pickup</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin size={10} /> {job.pickupLocation}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-foreground">Drop-off</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin size={10} /> {job.dropLocation}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0 space-y-1">
                            <div className="flex items-center gap-1 justify-end text-xs text-muted-foreground">
                              <Route size={11} />
                              <span className="font-semibold">{job.distance}</span>
                            </div>
                            <div className="flex items-center gap-1 justify-end text-xs text-muted-foreground">
                              <Package size={11} />
                              <span>{job.quantity} Qtl</span>
                            </div>
                            <div className="flex items-center gap-1 justify-end text-xs text-muted-foreground">
                              <Truck size={11} />
                              <span className="text-right">{job.vehicleType}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar size={11} />
                          <span>Scheduled: <span className="font-semibold text-foreground">{job.scheduledDate}</span></span>
                        </div>

                        {/* Actions */}
                        {job.status === 'Open' && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setConfirmJob(job)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-sm hover:shadow-md transition-all"
                            style={{ background: 'linear-gradient(135deg,#1a5c2a,#2d7a3e)' }}
                          >
                            <CheckCircle2 size={13} />
                            Accept Job
                          </motion.button>
                        )}

                        {(job.status === 'Assigned' || job.status === 'Picked Up') && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleAdvanceStatus(job.id)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-sm hover:shadow-md transition-all"
                            style={{ background: 'linear-gradient(135deg,#2563eb,#3b82f6)' }}
                          >
                            <ChevronRight size={13} />
                            {job.status === 'Assigned' ? 'Mark Picked Up' : 'Mark Delivered'}
                          </motion.button>
                        )}

                        {job.status === 'Delivered' && (
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                            <CheckCircle2 size={13} />
                            Completed · ₹{job.paymentAmount.toLocaleString('en-IN')} earned
                          </div>
                        )}
                      </div>

                      {/* Assigned to banner */}
                      {job.assignedTo && job.status !== 'Delivered' && (
                        <div className="px-4 pb-3">
                          <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-1.5 border border-blue-100">
                            <Star size={11} />
                            Assigned to: {job.assignedTo}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            );
          })()}
        </main>

        {/* ── Accept Job Confirmation Modal ── */}
        <AnimatePresence>
          {confirmJob && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={() => !acceptedId && setConfirmJob(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-50 px-4"
              >
                <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
                  <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#1a5c2a,#c9a227,#1a5c2a)' }} />

                  <div className="p-6">
                    <AnimatePresence mode="wait">
                      {acceptedId ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center py-4 gap-3"
                        >
                          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 size={32} className="text-green-600" />
                          </div>
                          <p className="text-base font-bold text-green-700">Job Accepted!</p>
                          <p className="text-sm text-muted-foreground text-center">
                            Head to {confirmJob.pickupLocation} on {confirmJob.scheduledDate}.
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                              <Truck size={18} style={{ color: '#1a5c2a' }} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground">Accept Transport Job?</p>
                              <p className="text-xs text-muted-foreground">{confirmJob.id}</p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-5 p-3 rounded-xl bg-muted/50 border border-border text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Crop</span>
                              <span className="font-semibold text-foreground">{confirmJob.crop}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Pickup</span>
                              <span className="font-semibold text-foreground">{confirmJob.pickupLocation}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Drop-off</span>
                              <span className="font-semibold text-foreground">{confirmJob.dropLocation}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Distance</span>
                              <span className="font-semibold text-foreground">{confirmJob.distance}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Date</span>
                              <span className="font-semibold text-foreground">{confirmJob.scheduledDate}</span>
                            </div>
                            <div className="flex justify-between border-t border-border pt-2 mt-1">
                              <span className="text-muted-foreground font-semibold">Payment</span>
                              <span className="font-bold text-base" style={{ color: '#1a5c2a' }}>₹{confirmJob.paymentAmount.toLocaleString('en-IN')}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 mb-4">
                            <AlertCircle size={13} className="text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700">
                              By accepting, you commit to picking up the produce on the scheduled date. Payment is released on delivery confirmation.
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => setConfirmJob(null)}
                              className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
                            >
                              Cancel
                            </button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleAccept(confirmJob)}
                              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white shadow-md flex items-center justify-center gap-2"
                              style={{ background: 'linear-gradient(135deg,#1a5c2a,#2d7a3e)' }}
                            >
                              <CheckCircle2 size={14} />
                              Confirm Accept
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
