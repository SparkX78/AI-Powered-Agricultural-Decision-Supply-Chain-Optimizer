/**
 * Seller Marketplace — Sellers browse farmer produce listings and send offers
 * Route: /seller-marketplace
 * Standalone layout (no site header/footer)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag, LogOut, User, Search, Filter, MapPin, Calendar,
  CheckCircle2, ArrowLeft, Bell,
  Package, Send, X, Star,
} from 'lucide-react';
import { produceListings, sellerOffers } from '@/lib/mockData';
import type { ProduceListing, SellerOffer, ProduceCategory } from '@/lib/mockData';

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<ProduceListing['status'], { label: string; color: string; bg: string; border: string }> = {
  Available:       { label: 'Available',       color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200' },
  'Offer Received':{ label: 'Offer Received',  color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  Sold:            { label: 'Sold',            color: 'text-gray-500',   bg: 'bg-gray-100',  border: 'border-gray-200' },
  Expired:         { label: 'Expired',         color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200' },
};

const OFFER_STATUS_CFG: Record<SellerOffer['status'], { label: string; color: string; bg: string }> = {
  Pending:  { label: 'Pending',  color: 'text-amber-700', bg: 'bg-amber-50' },
  Accepted: { label: 'Accepted', color: 'text-green-700', bg: 'bg-green-50' },
  Rejected: { label: 'Rejected', color: 'text-red-600',   bg: 'bg-red-50'   },
};

const CATEGORIES: ProduceCategory[] = ['Grain', 'Vegetable', 'Fruit', 'Pulse', 'Oilseed', 'Spice'];

// ── Offer form ────────────────────────────────────────────────────────────────

interface OfferForm {
  quantity: string;
  offeredPrice: string;
  deliveryLocation: string;
  message: string;
}

const EMPTY_OFFER: OfferForm = { quantity: '', offeredPrice: '', deliveryLocation: '', message: '' };

// ── Component ─────────────────────────────────────────────────────────────────

export default function SellerMarketplace() {
  const [listings]                    = useState<ProduceListing[]>(produceListings);
  const [myOffers, setMyOffers]       = useState<SellerOffer[]>(sellerOffers);
  const [search, setSearch]           = useState('');
  const [catFilter, setCatFilter]     = useState<ProduceCategory | 'All'>('All');
  const [tab, setTab]                 = useState<'browse' | 'my-offers'>('browse');
  const [selectedListing, setSelectedListing] = useState<ProduceListing | null>(null);
  const [offerForm, setOfferForm]     = useState<OfferForm>(EMPTY_OFFER);
  const [offerErrors, setOfferErrors] = useState<Partial<OfferForm>>({});
  const [offerSent, setOfferSent]     = useState(false);

  // ── Filter listings ─────────────────────────────────────────────────────────
  const filtered = listings.filter((l) => {
    const matchSearch = l.crop.toLowerCase().includes(search.toLowerCase())
      || l.farmerName.toLowerCase().includes(search.toLowerCase())
      || l.farmerLocation.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || l.category === catFilter;
    return matchSearch && matchCat;
  });

  // ── Offer validation ────────────────────────────────────────────────────────
  const validateOffer = (): boolean => {
    const e: Partial<OfferForm> = {};
    if (!offerForm.quantity || isNaN(Number(offerForm.quantity)) || Number(offerForm.quantity) <= 0)
      e.quantity = 'Enter valid quantity';
    if (!offerForm.offeredPrice || isNaN(Number(offerForm.offeredPrice)) || Number(offerForm.offeredPrice) <= 0)
      e.offeredPrice = 'Enter valid price';
    if (!offerForm.deliveryLocation.trim())
      e.deliveryLocation = 'Enter delivery location';
    setOfferErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOffer() || !selectedListing) return;

    const newOffer: SellerOffer = {
      id: `OFR-2026-${String(Date.now()).slice(-4)}`,
      listingId: selectedListing.id,
      crop: `${selectedListing.crop} (${selectedListing.variety})`,
      farmerName: selectedListing.farmerName,
      farmerLocation: selectedListing.farmerLocation,
      quantity: Number(offerForm.quantity),
      offeredPrice: Number(offerForm.offeredPrice),
      totalAmount: Number(offerForm.quantity) * Number(offerForm.offeredPrice),
      sellerName: 'Anil Sharma',
      sellerCompany: 'Sharma Grain Traders',
      deliveryLocation: offerForm.deliveryLocation,
      message: offerForm.message,
      status: 'Pending',
      offerDate: '06 Apr 2026',
    };

    setMyOffers((prev) => [newOffer, ...prev]);
    setOfferSent(true);
    setTimeout(() => {
      setOfferSent(false);
      setSelectedListing(null);
      setOfferForm(EMPTY_OFFER);
      setOfferErrors({});
      setTab('my-offers');
    }, 2000);
  };

  const offerField = (key: keyof OfferForm, value: string) =>
    setOfferForm((p) => ({ ...p, [key]: value }));

  const myPendingOffers  = myOffers.filter((o) => o.status === 'Pending').length;
  const myAcceptedOffers = myOffers.filter((o) => o.status === 'Accepted').length;

  return (
    <>
      <title>Seller Marketplace – KisanUnnati Nexus</title>
      <meta name="description" content="Browse farmer produce listings and send purchase offers on KisanUnnati Nexus." />

      <div className="min-h-screen bg-background">
        {/* ── Top Bar ── */}
        <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/" className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Back">
                <ArrowLeft size={17} className="text-muted-foreground" />
              </a>
              <a href="/" className="flex items-center gap-1">
                <ShoppingBag size={20} style={{ color: '#1a5c2a' }} />
                <span className="font-bold text-base" style={{ color: '#1a5c2a' }}>KisanUnnati</span>
                <span className="font-bold text-base" style={{ color: '#c9a227' }}>Nexus</span>
              </a>
              <span className="hidden sm:block text-xs text-muted-foreground border-l border-border pl-3">Seller Marketplace</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Notifications">
                  <Bell size={18} className="text-muted-foreground" />
                  {myPendingOffers > 0 && (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-blue-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                      {myPendingOffers}
                    </span>
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <User size={15} style={{ color: '#c9a227' }} />
                </div>
                <span className="hidden sm:block text-sm font-medium">Anil Sharma</span>
              </div>
              <a href="/" className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Sign out">
                <LogOut size={17} className="text-muted-foreground" />
              </a>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          {/* ── Page Header ── */}
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-foreground">Produce Marketplace</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Browse fresh listings from farmers across India — send offers directly.</p>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Total Listings',    value: listings.length,                                        Icon: Package,      color: '#1a5c2a', bg: '#dcfce7' },
              { label: 'Available Now',     value: listings.filter(l=>l.status==='Available').length,       Icon: CheckCircle2, color: '#1a5c2a', bg: '#dcfce7' },
              { label: 'My Offers Sent',    value: myOffers.length,                                        Icon: Send,         color: '#2563eb', bg: '#dbeafe' },
              { label: 'Offers Accepted',   value: myAcceptedOffers,                                       Icon: Star,         color: '#c9a227', bg: '#fef9c3' },
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

          {/* ── Tabs ── */}
          <div className="flex gap-1 bg-card rounded-xl p-1 border border-border mb-5 w-fit">
            {([['browse', 'Browse Listings'], ['my-offers', 'My Offers']] as const).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === id ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                {label}
                {id === 'my-offers' && myOffers.length > 0 && (
                  <span className="ml-1.5 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">{myOffers.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── Browse Tab ── */}
          {tab === 'browse' && (
            <>
              {/* Search + Filter */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search crop, farmer, location..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <Filter size={14} className="text-muted-foreground shrink-0" />
                  {(['All', ...CATEGORIES] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCatFilter(c as ProduceCategory | 'All')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all ${
                        catFilter === c
                          ? 'border-primary bg-green-50 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Listings grid */}
              {filtered.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
                  <Package size={36} className="mx-auto text-muted-foreground opacity-30 mb-3" />
                  <p className="text-sm font-semibold text-muted-foreground">No listings found</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((listing, i) => {
                    const cfg = STATUS_CFG[listing.status];
                    const isSold = listing.status === 'Sold';
                    return (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.25 }}
                        className={`bg-card rounded-2xl border border-border overflow-hidden transition-shadow ${isSold ? 'opacity-60' : 'hover:shadow-md'}`}
                      >
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

                          <div className="flex items-end justify-between mb-3">
                            <div>
                              <p className="text-2xl font-bold" style={{ color: '#1a5c2a' }}>₹{listing.askingPrice.toLocaleString('en-IN')}</p>
                              <p className="text-xs text-muted-foreground">per {listing.unit}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-foreground">{listing.quantityAvailable}</p>
                              <p className="text-xs text-muted-foreground">{listing.unit}s</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap mb-3">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                              {listing.quality}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              {listing.category}
                            </span>
                          </div>

                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{listing.description}</p>
                        </div>

                        <div className="px-4 py-2 border-t border-border bg-muted/30 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <User size={11} />
                            <span className="font-medium text-foreground">{listing.farmerName}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin size={11} />
                            <span>{listing.farmerLocation}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar size={11} />
                            <span>Available from {listing.availableFrom}</span>
                          </div>
                        </div>

                        <div className="px-4 py-3">
                          <motion.button
                            whileHover={!isSold ? { scale: 1.02 } : {}}
                            whileTap={!isSold ? { scale: 0.98 } : {}}
                            onClick={() => !isSold && setSelectedListing(listing)}
                            disabled={isSold}
                            className={`w-full py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                              isSold
                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                : 'text-white shadow-sm hover:shadow-md'
                            }`}
                            style={!isSold ? { background: 'linear-gradient(135deg,#1a5c2a,#2d7a3e)' } : {}}
                          >
                            <Send size={13} />
                            {isSold ? 'Already Sold' : 'Send Offer'}
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ── My Offers Tab ── */}
          {tab === 'my-offers' && (
            <div className="space-y-3">
              {myOffers.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
                  <Send size={36} className="mx-auto text-muted-foreground opacity-30 mb-3" />
                  <p className="text-sm font-semibold text-muted-foreground">No offers sent yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Browse listings and send your first offer.</p>
                </div>
              ) : (
                myOffers.map((offer, i) => {
                  const cfg = OFFER_STATUS_CFG[offer.status];
                  return (
                    <motion.div
                      key={offer.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card rounded-2xl border border-border p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                            <ShoppingBag size={17} style={{ color: '#1a5c2a' }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-foreground">{offer.crop}</span>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                                {cfg.label}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              From: {offer.farmerName} · {offer.farmerLocation}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Deliver to: {offer.deliveryLocation}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-base font-bold" style={{ color: '#1a5c2a' }}>
                            ₹{offer.totalAmount.toLocaleString('en-IN')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {offer.quantity} qtl × ₹{offer.offeredPrice}/qtl
                          </p>
                          <p className="text-xs text-muted-foreground">{offer.offerDate}</p>
                        </div>
                      </div>
                      {offer.message && (
                        <div className="mt-3 p-2.5 rounded-lg bg-muted/50 border border-border">
                          <p className="text-xs text-muted-foreground italic">"{offer.message}"</p>
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
        </main>

        {/* ── Send Offer Modal ── */}
        <AnimatePresence>
          {selectedListing && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={() => !offerSent && setSelectedListing(null)}
              />
              <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 60, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg w-full z-50 max-h-[90vh] overflow-y-auto"
              >
                <div className="bg-card rounded-t-3xl sm:rounded-2xl shadow-2xl border border-border">
                  <div className="h-1 w-full rounded-t-3xl sm:rounded-t-2xl" style={{ background: 'linear-gradient(90deg,#1a5c2a,#c9a227,#1a5c2a)' }} />

                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-lg font-bold text-foreground">Send Purchase Offer</h2>
                        <p className="text-xs text-muted-foreground">Your offer goes directly to the farmer</p>
                      </div>
                      <button
                        onClick={() => setSelectedListing(null)}
                        className="p-2 rounded-xl hover:bg-muted transition-colors"
                        aria-label="Close"
                      >
                        <X size={16} className="text-muted-foreground" />
                      </button>
                    </div>

                    {/* Listing summary */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border mb-4">
                      <span className="text-2xl">{selectedListing.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground">{selectedListing.crop} — {selectedListing.variety}</p>
                        <p className="text-xs text-muted-foreground">{selectedListing.farmerName} · {selectedListing.farmerLocation}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold" style={{ color: '#1a5c2a' }}>₹{selectedListing.askingPrice.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-muted-foreground">asking/qtl</p>
                      </div>
                    </div>

                    {/* Success */}
                    <AnimatePresence>
                      {offerSent && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center py-8 gap-3"
                        >
                          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 size={32} className="text-green-600" />
                          </div>
                          <p className="text-base font-bold text-green-700">Offer Sent!</p>
                          <p className="text-sm text-muted-foreground text-center">
                            The farmer will review your offer and respond shortly.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!offerSent && (
                      <form onSubmit={handleSendOffer} className="space-y-4" noValidate>
                        {/* Qty + Price */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1">Quantity (Quintals) *</label>
                            <input
                              type="number"
                              min="1"
                              max={selectedListing.quantityAvailable}
                              value={offerForm.quantity}
                              onChange={(e) => offerField('quantity', e.target.value)}
                              placeholder={`Max ${selectedListing.quantityAvailable}`}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                            />
                            {offerErrors.quantity && <p className="text-xs text-red-500 mt-0.5">{offerErrors.quantity}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1">Your Price (₹/Quintal) *</label>
                            <input
                              type="number"
                              min="1"
                              value={offerForm.offeredPrice}
                              onChange={(e) => offerField('offeredPrice', e.target.value)}
                              placeholder={`Asking: ₹${selectedListing.askingPrice}`}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                            />
                            {offerErrors.offeredPrice && <p className="text-xs text-red-500 mt-0.5">{offerErrors.offeredPrice}</p>}
                          </div>
                        </div>

                        {/* Total */}
                        {offerForm.quantity && offerForm.offeredPrice && (
                          <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200">
                            <span className="text-xs font-semibold text-green-700">Total Offer Value</span>
                            <span className="text-base font-bold" style={{ color: '#1a5c2a' }}>
                              ₹{(Number(offerForm.quantity) * Number(offerForm.offeredPrice)).toLocaleString('en-IN')}
                            </span>
                          </div>
                        )}

                        {/* Delivery location */}
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1">
                            <MapPin size={11} className="inline mr-1" />Delivery Location *
                          </label>
                          <input
                            type="text"
                            value={offerForm.deliveryLocation}
                            onChange={(e) => offerField('deliveryLocation', e.target.value)}
                            placeholder="e.g. Azadpur Mandi, Delhi"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                          />
                          {offerErrors.deliveryLocation && <p className="text-xs text-red-500 mt-0.5">{offerErrors.deliveryLocation}</p>}
                        </div>

                        {/* Message */}
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1">Message to Farmer (optional)</label>
                          <textarea
                            rows={3}
                            value={offerForm.message}
                            onChange={(e) => offerField('message', e.target.value)}
                            placeholder="Introduce yourself, payment terms, special requirements..."
                            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                          />
                        </div>

                        <div className="flex gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => setSelectedListing(null)}
                            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
                          >
                            Cancel
                          </button>
                          <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white shadow-md flex items-center justify-center gap-2"
                            style={{ background: 'linear-gradient(135deg,#1a5c2a,#2d7a3e)' }}
                          >
                            <Send size={14} />
                            Send Offer
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
