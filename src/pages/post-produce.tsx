/**
 * Post Produce — Farmer lists available crops/vegetables for sale
 * Route: /post-produce
 * Standalone layout (no site header/footer)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sprout, LogOut, User, Plus, Package, CheckCircle2,
  Clock, Tag, MapPin, Calendar, ChevronRight, Eye,
  TrendingUp, Trash2, Edit3, Bell, ArrowLeft,
} from 'lucide-react';
import { produceListings } from '@/lib/mockData';
import type { ProduceListing, ProduceCategory } from '@/lib/mockData';

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES: { value: ProduceCategory; label: string; emoji: string }[] = [
  { value: 'Grain',    label: 'Grain',    emoji: '🌾' },
  { value: 'Vegetable',label: 'Vegetable',emoji: '🥦' },
  { value: 'Fruit',   label: 'Fruit',    emoji: '🍎' },
  { value: 'Pulse',   label: 'Pulse',    emoji: '🫘' },
  { value: 'Oilseed', label: 'Oilseed',  emoji: '🌻' },
  { value: 'Spice',   label: 'Spice',    emoji: '🌶️' },
];

const CROP_EMOJIS: Record<string, string> = {
  Wheat: '🌾', Rice: '🍚', Tomato: '🍅', Potato: '🥔',
  Onion: '🧅', Maize: '🌽', Soybean: '🫘', Cotton: '🌿',
  Garlic: '🧄', Brinjal: '🍆', Chilli: '🌶️', Mango: '🥭',
  Banana: '🍌', Sugarcane: '🎋', Groundnut: '🥜', Mustard: '🌻',
};

const STATUS_CFG: Record<ProduceListing['status'], { label: string; color: string; bg: string; border: string }> = {
  Available:       { label: 'Available',       color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200' },
  'Offer Received':{ label: 'Offer Received',  color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  Sold:            { label: 'Sold',            color: 'text-gray-600',   bg: 'bg-gray-100',  border: 'border-gray-200' },
  Expired:         { label: 'Expired',         color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200' },
};

// ── Form state type ───────────────────────────────────────────────────────────

interface FormData {
  crop: string;
  variety: string;
  category: ProduceCategory | '';
  quantity: string;
  askingPrice: string;
  harvestDate: string;
  availableFrom: string;
  description: string;
  quality: 'Grade A' | 'Grade B' | 'Grade C';
  location: string;
}

const EMPTY_FORM: FormData = {
  crop: '', variety: '', category: '', quantity: '',
  askingPrice: '', harvestDate: '', availableFrom: '',
  description: '', quality: 'Grade A', location: 'Ludhiana, Punjab',
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function PostProduce() {
  const [listings, setListings]   = useState<ProduceListing[]>(
    produceListings.filter((l) => l.farmerId === 'FRM-001')
  );
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors]       = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [deletedId, setDeletedId] = useState<string | null>(null);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: Partial<FormData> = {};
    if (!form.crop.trim())        e.crop = 'Crop name is required';
    if (!form.category)           e.category = ('Select a category' as unknown as ProduceCategory);
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) <= 0)
      e.quantity = 'Enter a valid quantity';
    if (!form.askingPrice || isNaN(Number(form.askingPrice)) || Number(form.askingPrice) <= 0)
      e.askingPrice = 'Enter a valid price';
    if (!form.harvestDate)        e.harvestDate = 'Harvest date is required';
    if (!form.availableFrom)      e.availableFrom = 'Available from date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newListing: ProduceListing = {
      id: `LST-2026-${String(Date.now()).slice(-4)}`,
      farmerId: 'FRM-001',
      farmerName: 'Ramesh Patel',
      farmerLocation: form.location || 'Ludhiana, Punjab',
      crop: form.crop,
      variety: form.variety || 'Standard',
      category: form.category as ProduceCategory,
      emoji: CROP_EMOJIS[form.crop] ?? '🌿',
      quantityAvailable: Number(form.quantity),
      unit: 'Quintal',
      askingPrice: Number(form.askingPrice),
      harvestDate: form.harvestDate,
      availableFrom: form.availableFrom,
      description: form.description || `Fresh ${form.crop}, ${form.quality}.`,
      quality: form.quality,
      status: 'Available',
      postedDate: '06 Apr 2026',
      offersCount: 0,
    };

    setListings((prev) => [newListing, ...prev]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setForm(EMPTY_FORM);
      setErrors({});
    }, 2000);
  };

  const handleDelete = (id: string) => {
    setDeletedId(id);
    setTimeout(() => {
      setListings((prev) => prev.filter((l) => l.id !== id));
      setDeletedId(null);
    }, 400);
  };

  const field = (key: keyof FormData, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  return (
    <>
      <title>Post Produce – KisanUnnati Nexus</title>
      <meta name="description" content="List your crops and vegetables for sale on KisanUnnati Nexus." />

      <div className="min-h-screen bg-background">
        {/* ── Top Bar ── */}
        <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/farmer-dashboard" className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Back to dashboard">
                <ArrowLeft size={17} className="text-muted-foreground" />
              </a>
              <a href="/" className="flex items-center gap-1">
                <Sprout size={20} style={{ color: '#1a5c2a' }} />
                <span className="font-bold text-base" style={{ color: '#1a5c2a' }}>KisanUnnati</span>
                <span className="font-bold text-base" style={{ color: '#c9a227' }}>Nexus</span>
              </a>
              <span className="hidden sm:block text-xs text-muted-foreground border-l border-border pl-3">Post Produce</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Notifications">
                <Bell size={18} className="text-muted-foreground" />
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

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {/* ── Page Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Produce Listings</h1>
              <p className="text-sm text-muted-foreground mt-0.5">List your crops and vegetables — sellers will send you offers directly.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setShowForm(true); setSubmitted(false); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg transition-all"
              style={{ background: 'linear-gradient(135deg,#1a5c2a,#2d7a3e)' }}
            >
              <Plus size={16} />
              Post New Produce
            </motion.button>
          </div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total Listed',    value: listings.length,                                       color: '#1a5c2a', bg: '#dcfce7', Icon: Package },
              { label: 'Available',       value: listings.filter(l=>l.status==='Available').length,      color: '#1a5c2a', bg: '#dcfce7', Icon: CheckCircle2 },
              { label: 'Offers Received', value: listings.filter(l=>l.status==='Offer Received').length, color: '#2563eb', bg: '#dbeafe', Icon: TrendingUp },
              { label: 'Sold',            value: listings.filter(l=>l.status==='Sold').length,           color: '#6b7280', bg: '#f3f4f6', Icon: Tag },
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

          {/* ── Listings grid ── */}
          {listings.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border border-dashed">
              <Package size={40} className="mx-auto text-muted-foreground mb-3 opacity-40" />
              <p className="text-base font-semibold text-muted-foreground">No listings yet</p>
              <p className="text-sm text-muted-foreground mt-1">Click "Post New Produce" to list your first crop.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {listings.map((listing) => {
                  const cfg = STATUS_CFG[listing.status];
                  return (
                    <motion.div
                      key={listing.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: deletedId === listing.id ? 0 : 1, y: 0, scale: deletedId === listing.id ? 0.95 : 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Card header */}
                      <div className="p-4 pb-3">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-3xl" role="img" aria-label={listing.crop}>{listing.emoji}</span>
                            <div>
                              <p className="text-sm font-bold text-foreground">{listing.crop}</p>
                              <p className="text-xs text-muted-foreground">{listing.variety}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                            {cfg.label}
                          </span>
                        </div>

                        {/* Price & Qty */}
                        <div className="flex items-end justify-between mb-3">
                          <div>
                            <p className="text-2xl font-bold" style={{ color: '#1a5c2a' }}>₹{listing.askingPrice.toLocaleString('en-IN')}</p>
                            <p className="text-xs text-muted-foreground">per {listing.unit}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-foreground">{listing.quantityAvailable}</p>
                            <p className="text-xs text-muted-foreground">{listing.unit}s available</p>
                          </div>
                        </div>

                        {/* Quality badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            {listing.quality}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {listing.category}
                          </span>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="px-4 py-2 border-t border-border bg-muted/30 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin size={11} />
                          <span>{listing.farmerLocation}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar size={11} />
                          <span>Available from {listing.availableFrom}</span>
                        </div>
                        {listing.offersCount > 0 && (
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                            <Eye size={11} />
                            <span>{listing.offersCount} offer{listing.offersCount > 1 ? 's' : ''} received</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="px-4 py-3 flex items-center justify-between">
                        <a
                          href={`/seller-marketplace?listing=${listing.id}`}
                          className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          View Offers <ChevronRight size={11} />
                        </a>
                        <div className="flex items-center gap-1">
                          <button
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                            aria-label="Edit listing"
                          >
                            <Edit3 size={14} className="text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleDelete(listing.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            aria-label="Delete listing"
                          >
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </main>

        {/* ── Post Produce Form Modal ── */}
        <AnimatePresence>
          {showForm && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={() => !submitted && setShowForm(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 60, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-xl w-full z-50 max-h-[90vh] overflow-y-auto"
              >
                <div className="bg-card rounded-t-3xl sm:rounded-2xl shadow-2xl border border-border">
                  {/* Gradient bar */}
                  <div className="h-1 w-full rounded-t-3xl sm:rounded-t-2xl" style={{ background: 'linear-gradient(90deg,#1a5c2a,#c9a227,#1a5c2a)' }} />

                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="text-lg font-bold text-foreground">Post New Produce</h2>
                        <p className="text-xs text-muted-foreground">Fill in the details — sellers will see this listing</p>
                      </div>
                      <button
                        onClick={() => setShowForm(false)}
                        className="p-2 rounded-xl hover:bg-muted transition-colors"
                        aria-label="Close form"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Success state */}
                    <AnimatePresence>
                      {submitted && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center py-8 gap-3"
                        >
                          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 size={32} className="text-green-600" />
                          </div>
                          <p className="text-base font-bold text-green-700">Listing Posted!</p>
                          <p className="text-sm text-muted-foreground text-center">
                            Your produce is now visible to sellers. You'll be notified when offers arrive.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!submitted && (
                      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {/* Category */}
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">Category *</label>
                          <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((c) => (
                              <button
                                key={c.value}
                                type="button"
                                onClick={() => field('category', c.value)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                  form.category === c.value
                                    ? 'border-primary bg-green-50 text-primary'
                                    : 'border-border text-muted-foreground hover:border-primary/50'
                                }`}
                              >
                                <span>{c.emoji}</span> {c.label}
                              </button>
                            ))}
                          </div>
                          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                        </div>

                        {/* Crop + Variety */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1">Crop Name *</label>
                            <input
                              type="text"
                              value={form.crop}
                              onChange={(e) => field('crop', e.target.value)}
                              placeholder="e.g. Wheat, Tomato"
                              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                            />
                            {errors.crop && <p className="text-xs text-red-500 mt-0.5">{errors.crop}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1">Variety</label>
                            <input
                              type="text"
                              value={form.variety}
                              onChange={(e) => field('variety', e.target.value)}
                              placeholder="e.g. Sharbati, Hybrid"
                              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                            />
                          </div>
                        </div>

                        {/* Quantity + Price */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1">Quantity (Quintals) *</label>
                            <input
                              type="number"
                              min="1"
                              value={form.quantity}
                              onChange={(e) => field('quantity', e.target.value)}
                              placeholder="e.g. 50"
                              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                            />
                            {errors.quantity && <p className="text-xs text-red-500 mt-0.5">{errors.quantity}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1">Asking Price (₹/Quintal) *</label>
                            <input
                              type="number"
                              min="1"
                              value={form.askingPrice}
                              onChange={(e) => field('askingPrice', e.target.value)}
                              placeholder="e.g. 2150"
                              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                            />
                            {errors.askingPrice && <p className="text-xs text-red-500 mt-0.5">{errors.askingPrice}</p>}
                          </div>
                        </div>

                        {/* Quality */}
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">Quality Grade *</label>
                          <div className="flex gap-2">
                            {(['Grade A', 'Grade B', 'Grade C'] as const).map((g) => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => field('quality', g)}
                                className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                                  form.quality === g
                                    ? 'border-primary bg-green-50 text-primary'
                                    : 'border-border text-muted-foreground hover:border-primary/50'
                                }`}
                              >
                                {g}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1">Harvest Date *</label>
                            <input
                              type="date"
                              value={form.harvestDate}
                              onChange={(e) => field('harvestDate', e.target.value)}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                            />
                            {errors.harvestDate && <p className="text-xs text-red-500 mt-0.5">{errors.harvestDate}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1">Available From *</label>
                            <input
                              type="date"
                              value={form.availableFrom}
                              onChange={(e) => field('availableFrom', e.target.value)}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                            />
                            {errors.availableFrom && <p className="text-xs text-red-500 mt-0.5">{errors.availableFrom}</p>}
                          </div>
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1">
                            <MapPin size={11} className="inline mr-1" />Pickup Location
                          </label>
                          <input
                            type="text"
                            value={form.location}
                            onChange={(e) => field('location', e.target.value)}
                            placeholder="Village, District, State"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1">Description (optional)</label>
                          <textarea
                            rows={3}
                            value={form.description}
                            onChange={(e) => field('description', e.target.value)}
                            placeholder="Describe quality, storage conditions, special notes..."
                            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                          />
                        </div>

                        {/* Total estimate */}
                        {form.quantity && form.askingPrice && (
                          <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200">
                            <span className="text-xs font-semibold text-green-700">Estimated Total Value</span>
                            <span className="text-base font-bold" style={{ color: '#1a5c2a' }}>
                              ₹{(Number(form.quantity) * Number(form.askingPrice)).toLocaleString('en-IN')}
                            </span>
                          </div>
                        )}

                        {/* Submit */}
                        <div className="flex gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
                          >
                            Cancel
                          </button>
                          <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all flex items-center justify-center gap-2"
                            style={{ background: 'linear-gradient(135deg,#1a5c2a,#2d7a3e)' }}
                          >
                            <Clock size={14} />
                            Post Listing
                          </motion.button>
                        </div>
                      </form>
                    )}
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
