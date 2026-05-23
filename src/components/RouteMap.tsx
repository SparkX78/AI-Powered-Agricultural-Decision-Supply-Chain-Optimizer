import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Truck, Navigation, MapPin } from 'lucide-react';
import type { ShipmentStatus } from '@/lib/mockData';

// ── Approximate SVG coordinates for Indian cities ────────────────────────────
// Canvas: 500×420, India bounding box lat 8–37°N, lon 68–97°E
const toXY = (lat: number, lon: number): [number, number] => {
  const x = ((lon - 68) / (97 - 68)) * 460 + 20;
  const y = ((37 - lat) / (37 - 8)) * 380 + 20;
  return [Math.round(x), Math.round(y)];
};

interface CityDef {
  coord: [number, number];
  label: string;
}

const CITIES: Record<string, CityDef> = {
  'Ludhiana, Punjab':         { coord: toXY(30.9,  75.85), label: 'Ludhiana' },
  'Amritsar, Punjab':         { coord: toXY(31.63, 74.87), label: 'Amritsar' },
  'Karnal, Haryana':          { coord: toXY(29.68, 76.99), label: 'Karnal' },
  'Ambala, Haryana':          { coord: toXY(30.38, 76.78), label: 'Ambala' },
  'Azadpur Mandi, Delhi':     { coord: toXY(28.72, 77.18), label: 'Delhi' },
  'Delhi':                    { coord: toXY(28.61, 77.21), label: 'Delhi' },
  'Agra, Uttar Pradesh':      { coord: toXY(27.18, 78.01), label: 'Agra' },
  'Mathura, Uttar Pradesh':   { coord: toXY(27.49, 77.67), label: 'Mathura' },
  'Nashik, Maharashtra':      { coord: toXY(19.99, 73.79), label: 'Nashik' },
  'Pune APMC, Pune':          { coord: toXY(18.52, 73.86), label: 'Pune' },
  'Pune':                     { coord: toXY(18.52, 73.86), label: 'Pune' },
  'Vashi APMC, Mumbai':       { coord: toXY(19.07, 72.88), label: 'Mumbai' },
  'Mumbai':                   { coord: toXY(19.07, 72.88), label: 'Mumbai' },
  'Lasalgaon, Maharashtra':   { coord: toXY(20.12, 74.03), label: 'Lasalgaon' },
  'Hyderabad APMC':           { coord: toXY(17.38, 78.49), label: 'Hyderabad' },
  'Hyderabad':                { coord: toXY(17.38, 78.49), label: 'Hyderabad' },
  'Gulbarga, Karnataka':      { coord: toXY(17.33, 76.82), label: 'Gulbarga' },
  'Bengaluru APMC':           { coord: toXY(12.97, 77.59), label: 'Bengaluru' },
  'Bengaluru':                { coord: toXY(12.97, 77.59), label: 'Bengaluru' },
};

const WAYPOINTS: Record<string, string[]> = {
  'Ludhiana, Punjab|Azadpur Mandi, Delhi':       ['Ambala, Haryana'],
  'Karnal, Haryana|Vashi APMC, Mumbai':          ['Delhi', 'Agra, Uttar Pradesh', 'Nashik, Maharashtra'],
  'Agra, Uttar Pradesh|Azadpur Mandi, Delhi':    ['Mathura, Uttar Pradesh'],
  'Nashik, Maharashtra|Pune APMC, Pune':         [],
  'Lasalgaon, Maharashtra|Hyderabad APMC':       ['Nashik, Maharashtra'],
  'Gulbarga, Karnataka|Bengaluru APMC':          [],
};

const resolveCity = (place: string): CityDef | null => {
  if (CITIES[place]) return CITIES[place];
  for (const key of Object.keys(CITIES)) {
    if (place.includes(key.split(',')[0]) || key.includes(place.split(',')[0])) {
      return CITIES[key];
    }
  }
  return null;
};

interface RoutePoint { name: string; label: string; coord: [number, number]; }

const buildRoute = (origin: string, dest: string): RoutePoint[] => {
  const pts: RoutePoint[] = [];
  const o = resolveCity(origin);
  if (o) pts.push({ name: origin, label: o.label, coord: o.coord });

  const wps = WAYPOINTS[`${origin}|${dest}`] ?? [];
  for (const wp of wps) {
    const c = resolveCity(wp);
    if (c) pts.push({ name: wp, label: c.label, coord: c.coord });
  }

  const d = resolveCity(dest);
  if (d) pts.push({ name: dest, label: d.label, coord: d.coord });
  return pts;
};

// Smooth cubic-bezier SVG path
const smoothPath = (pts: [number, number][]): string => {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1], c = pts[i];
    const mx = p[0] + (c[0] - p[0]) * 0.5;
    d += ` C ${mx} ${p[1]}, ${mx} ${c[1]}, ${c[0]} ${c[1]}`;
  }
  return d;
};

// Interpolate position along polyline at t ∈ [0,1]
const lerpPolyline = (pts: [number, number][], t: number): [number, number] => {
  if (!pts.length) return [0, 0];
  if (t <= 0) return pts[0];
  if (t >= 1) return pts[pts.length - 1];
  const segs = pts.length - 1;
  const st = t * segs;
  const si = Math.min(Math.floor(st), segs - 1);
  const lt = st - si;
  const a = pts[si], b = pts[si + 1];
  return [a[0] + (b[0] - a[0]) * lt, a[1] + (b[1] - a[1]) * lt];
};

const progressFor = (s: ShipmentStatus) =>
  s === 'Delivered' ? 1 : s === 'In Transit' ? 0.55 : 0;

// ── Background city dots (major cities not on route) ─────────────────────────
const BG_CITIES: Array<{ coord: [number, number]; name: string }> = [
  { coord: toXY(28.61, 77.21),  name: 'Delhi' },
  { coord: toXY(19.07, 72.88),  name: 'Mumbai' },
  { coord: toXY(13.08, 80.27),  name: 'Chennai' },
  { coord: toXY(22.57, 88.36),  name: 'Kolkata' },
  { coord: toXY(17.38, 78.49),  name: 'Hyderabad' },
  { coord: toXY(12.97, 77.59),  name: 'Bengaluru' },
  { coord: toXY(23.02, 72.57),  name: 'Ahmedabad' },
  { coord: toXY(26.92, 75.79),  name: 'Jaipur' },
  { coord: toXY(21.14, 79.08),  name: 'Nagpur' },
  { coord: toXY(25.59, 85.13),  name: 'Patna' },
  { coord: toXY(26.84, 80.94),  name: 'Lucknow' },
  { coord: toXY(18.52, 73.86),  name: 'Pune' },
  { coord: toXY(30.73, 76.78),  name: 'Chandigarh' },
  { coord: toXY(23.25, 77.41),  name: 'Bhopal' },
  { coord: toXY(20.29, 85.82),  name: 'Bhubaneswar' },
];

// ── Major road lines (simplified NH network) ─────────────────────────────────
const ROADS: Array<[number, number][]> = [
  // NH-1 / NH-44: Amritsar → Delhi → Bengaluru
  [toXY(31.63,74.87), toXY(30.9,75.85), toXY(30.38,76.78), toXY(29.68,76.99), toXY(28.61,77.21),
   toXY(27.18,78.01), toXY(26.84,80.94), toXY(23.25,77.41), toXY(17.38,78.49), toXY(12.97,77.59)],
  // NH-48: Delhi → Mumbai
  [toXY(28.61,77.21), toXY(26.92,75.79), toXY(23.02,72.57), toXY(19.99,73.79), toXY(19.07,72.88)],
  // NH-16: Kolkata → Chennai
  [toXY(22.57,88.36), toXY(20.29,85.82), toXY(17.38,78.49), toXY(13.08,80.27)],
  // NH-6: Mumbai → Kolkata
  [toXY(19.07,72.88), toXY(21.14,79.08), toXY(22.57,88.36)],
  // NH-27: East-West corridor
  [toXY(25.59,85.13), toXY(26.84,80.94), toXY(26.92,75.79), toXY(23.02,72.57)],
];

interface RouteMapProps {
  origin: string;
  destination: string;
  status: ShipmentStatus;
  vehicleNo: string;
  logisticsPartner: string;
}

export default function RouteMap({ origin, destination, status, vehicleNo, logisticsPartner }: RouteMapProps) {
  const animPathRef = useRef<SVGPathElement>(null);
  const [truckPos, setTruckPos] = useState<[number, number]>([0, 0]);
  const [ready, setReady] = useState(false);

  const route = buildRoute(origin, destination);
  const coords = route.map((p) => p.coord);
  const svgPath = smoothPath(coords);
  const progress = progressFor(status);

  const statusColor = status === 'Delivered' ? '#16a34a' : status === 'In Transit' ? '#2563eb' : '#d97706';
  const statusBg    = status === 'Delivered' ? '#dcfce7' : status === 'In Transit' ? '#dbeafe' : '#fef3c7';

  useEffect(() => {
    setReady(false);
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, [origin, destination]);

  useEffect(() => {
    setTruckPos(lerpPolyline(coords, progress));
  }, [progress, origin, destination]);

  const hasRoute = route.length >= 2;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Navigation size={14} className="text-primary" />
          <span className="text-sm font-bold text-foreground">Route Map</span>
          <span className="text-xs text-muted-foreground">— {route[0]?.label ?? '?'} → {route[route.length - 1]?.label ?? '?'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: statusBg, color: statusColor }}>
            {status}
          </span>
          <span className="text-[11px] text-muted-foreground font-mono hidden sm:block">{vehicleNo}</span>
        </div>
      </div>

      {/* ── SVG Map ── */}
      <div className="relative" style={{ background: 'linear-gradient(135deg, #e8f4f0 0%, #dbeafe 50%, #e8f4f0 100%)' }}>
        {hasRoute ? (
          <svg
            viewBox="0 0 500 420"
            className="w-full"
            style={{ maxHeight: 380, display: 'block' }}
            aria-label={`Route map from ${origin} to ${destination}`}
            role="img"
          >
            <defs>
              {/* Glow filter for route line */}
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              {/* Drop shadow */}
              <filter id="pin-shadow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033" />
              </filter>
              {/* Truck glow */}
              <filter id="truck-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              {/* Clip to map area */}
              <clipPath id="map-clip">
                <rect x="0" y="0" width="500" height="420" />
              </clipPath>
              {/* Animated dash for route */}
              <linearGradient id="route-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1a5c2a" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>

            {/* ── Ocean / background ── */}
            <rect x="0" y="0" width="500" height="420" fill="#bfdbfe" opacity="0.25" rx="0" />

            {/* ── Terrain fill (India landmass approximation) ── */}
            <rect x="100" y="15" width="310" height="390" rx="8" fill="#e8f5e9" opacity="0.6" />

            {/* ── Grid lines (subtle) ── */}
            {[0,1,2,3,4,5,6,7,8,9].map((i) => (
              <line key={`h${i}`} x1="0" y1={i*46+10} x2="500" y2={i*46+10}
                stroke="#94a3b8" strokeWidth="0.4" opacity="0.3" />
            ))}
            {[0,1,2,3,4,5,6,7,8,9,10].map((i) => (
              <line key={`v${i}`} x1={i*50} y1="0" x2={i*50} y2="420"
                stroke="#94a3b8" strokeWidth="0.4" opacity="0.3" />
            ))}

            {/* ── National Highway network (background roads) ── */}
            {ROADS.map((road, ri) => (
              <polyline
                key={ri}
                points={road.map(([x, y]) => `${x},${y}`).join(' ')}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1.5"
                opacity="0.35"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* ── Background city dots ── */}
            {BG_CITIES.map((city) => (
              <g key={city.name}>
                <circle cx={city.coord[0]} cy={city.coord[1]} r="3" fill="#94a3b8" opacity="0.5" />
                <text x={city.coord[0] + 5} y={city.coord[1] + 3}
                  fontSize="7.5" fill="#64748b" opacity="0.6"
                  fontFamily="system-ui, sans-serif">
                  {city.name}
                </text>
              </g>
            ))}

            {/* ── Route: shadow/halo ── */}
            <path d={svgPath} fill="none" stroke="white" strokeWidth="7" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" />

            {/* ── Route: dashed grey (full path) ── */}
            <path d={svgPath} fill="none" stroke="#94a3b8" strokeWidth="2.5"
              strokeDasharray="7 5" strokeLinecap="round" opacity="0.7" />

            {/* ── Route: animated progress ── */}
            {ready && (
              <motion.path
                ref={animPathRef}
                d={svgPath}
                fill="none"
                stroke="url(#route-grad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: progress, opacity: 1 }}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
              />
            )}

            {/* ── Waypoint stops ── */}
            {route.slice(1, -1).map((pt) => (
              <g key={pt.name}>
                {/* Road-style waypoint */}
                <circle cx={pt.coord[0]} cy={pt.coord[1]} r="7" fill="white" stroke="#64748b" strokeWidth="1.5" filter="url(#pin-shadow)" />
                <circle cx={pt.coord[0]} cy={pt.coord[1]} r="3.5" fill="#64748b" />
                {/* Label bubble */}
                <rect
                  x={pt.coord[0] + 10} y={pt.coord[1] - 9}
                  width={pt.label.length * 5.5 + 6} height="14"
                  rx="3" fill="white" opacity="0.85"
                />
                <text x={pt.coord[0] + 13} y={pt.coord[1] + 1}
                  fontSize="8.5" fill="#334155" fontWeight="600"
                  fontFamily="system-ui, sans-serif">
                  {pt.label}
                </text>
              </g>
            ))}

            {/* ── Origin pin ── */}
            {coords.length > 0 && (
              <g filter="url(#pin-shadow)">
                {/* Pin shape */}
                <ellipse cx={coords[0][0]} cy={coords[0][1] + 18} rx="5" ry="2.5" fill="#00000022" />
                <path
                  d={`M ${coords[0][0]} ${coords[0][1] - 18}
                      C ${coords[0][0] - 12} ${coords[0][1] - 18},
                        ${coords[0][0] - 12} ${coords[0][1]},
                        ${coords[0][0]} ${coords[0][1] + 2}
                      C ${coords[0][0] + 12} ${coords[0][1]},
                        ${coords[0][0] + 12} ${coords[0][1] - 18},
                        ${coords[0][0]} ${coords[0][1] - 18} Z`}
                  fill="#1a5c2a"
                />
                <circle cx={coords[0][0]} cy={coords[0][1] - 11} r="5" fill="white" opacity="0.9" />
                {/* Label */}
                <rect
                  x={coords[0][0] - route[0].label.length * 3 - 4}
                  y={coords[0][1] - 36}
                  width={route[0].label.length * 6 + 8} height="14"
                  rx="3" fill="#1a5c2a"
                />
                <text
                  x={coords[0][0]} y={coords[0][1] - 26}
                  textAnchor="middle" fontSize="8.5" fill="white" fontWeight="700"
                  fontFamily="system-ui, sans-serif">
                  {route[0].label}
                </text>
              </g>
            )}

            {/* ── Destination pin ── */}
            {coords.length > 1 && (
              <g filter="url(#pin-shadow)">
                <ellipse cx={coords[coords.length-1][0]} cy={coords[coords.length-1][1] + 18} rx="5" ry="2.5" fill="#00000022" />
                <path
                  d={`M ${coords[coords.length-1][0]} ${coords[coords.length-1][1] - 18}
                      C ${coords[coords.length-1][0] - 12} ${coords[coords.length-1][1] - 18},
                        ${coords[coords.length-1][0] - 12} ${coords[coords.length-1][1]},
                        ${coords[coords.length-1][0]} ${coords[coords.length-1][1] + 2}
                      C ${coords[coords.length-1][0] + 12} ${coords[coords.length-1][1]},
                        ${coords[coords.length-1][0] + 12} ${coords[coords.length-1][1] - 18},
                        ${coords[coords.length-1][0]} ${coords[coords.length-1][1] - 18} Z`}
                  fill="#c9a227"
                />
                <circle cx={coords[coords.length-1][0]} cy={coords[coords.length-1][1] - 11} r="5" fill="white" opacity="0.9" />
                {/* Label */}
                <rect
                  x={coords[coords.length-1][0] - route[route.length-1].label.length * 3 - 4}
                  y={coords[coords.length-1][1] - 36}
                  width={route[route.length-1].label.length * 6 + 8} height="14"
                  rx="3" fill="#c9a227"
                />
                <text
                  x={coords[coords.length-1][0]} y={coords[coords.length-1][1] - 26}
                  textAnchor="middle" fontSize="8.5" fill="white" fontWeight="700"
                  fontFamily="system-ui, sans-serif">
                  {route[route.length-1].label}
                </text>
              </g>
            )}

            {/* ── Animated truck ── */}
            {status !== 'Pending' && truckPos[0] > 0 && ready && (
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.4, type: 'spring', stiffness: 200 }}
              >
                {/* Pulsing ring for In Transit */}
                {status === 'In Transit' && (
                  <>
                    <motion.circle
                      cx={truckPos[0]} cy={truckPos[1]} r="18"
                      fill="none" stroke="#2563eb" strokeWidth="2"
                      initial={{ opacity: 0.7, scale: 1 }}
                      animate={{ opacity: 0, scale: 2.2 }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                    />
                    <motion.circle
                      cx={truckPos[0]} cy={truckPos[1]} r="14"
                      fill="none" stroke="#2563eb" strokeWidth="1.5"
                      initial={{ opacity: 0.5, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.8 }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
                    />
                  </>
                )}
                {/* Truck circle bg */}
                <circle
                  cx={truckPos[0]} cy={truckPos[1]} r="14"
                  fill={status === 'Delivered' ? '#16a34a' : '#2563eb'}
                  filter="url(#truck-glow)"
                />
                <circle cx={truckPos[0]} cy={truckPos[1]} r="13" fill={status === 'Delivered' ? '#16a34a' : '#2563eb'} />
                {/* Truck emoji */}
                <text x={truckPos[0]} y={truckPos[1] + 5}
                  textAnchor="middle" fontSize="14"
                  fontFamily="system-ui, sans-serif">
                  🚛
                </text>
              </motion.g>
            )}

            {/* ── Pending: dashed start indicator ── */}
            {status === 'Pending' && coords.length > 0 && (
              <motion.circle
                cx={coords[0][0]} cy={coords[0][1]}
                r="10" fill="none" stroke="#d97706" strokeWidth="2"
                strokeDasharray="4 3"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: `${coords[0][0]}px ${coords[0][1]}px` }}
              />
            )}

            {/* ── Legend ── */}
            <g transform="translate(10, 395)">
              <rect x="0" y="-10" width="490" height="18" rx="4" fill="white" opacity="0.7" />
              {/* Origin */}
              <rect x="8" y="-5" width="8" height="8" rx="1" fill="#1a5c2a" />
              <text x="20" y="2" fontSize="8" fill="#334155" fontFamily="system-ui">Origin</text>
              {/* Destination */}
              <rect x="58" y="-5" width="8" height="8" rx="1" fill="#c9a227" />
              <text x="70" y="2" fontSize="8" fill="#334155" fontFamily="system-ui">Destination</text>
              {/* Waypoint */}
              <circle cx="128" cy="-1" r="4" fill="white" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="128" cy="-1" r="2" fill="#64748b" />
              <text x="136" y="2" fontSize="8" fill="#334155" fontFamily="system-ui">Waypoint</text>
              {/* NH */}
              <line x1="186" y1="-1" x2="202" y2="-1" stroke="#fbbf24" strokeWidth="2" />
              <text x="206" y="2" fontSize="8" fill="#334155" fontFamily="system-ui">National Highway</text>
              {/* Route */}
              <line x1="298" y1="-1" x2="314" y2="-1" stroke="#1a5c2a" strokeWidth="2.5" />
              <text x="318" y="2" fontSize="8" fill="#334155" fontFamily="system-ui">Your Route</text>
            </g>
          </svg>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <MapPin size={36} style={{ color: '#1a5c2a' }} />
            <p className="text-sm font-bold text-foreground">{origin.split(',')[0]} → {destination.split(',')[0]}</p>
            <p className="text-xs text-muted-foreground">Route visualization not available for this corridor</p>
          </div>
        )}

        {/* ── Bottom info bar ── */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-border/50 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#1a5c2a' }} />
              <span className="text-xs font-semibold text-foreground">{origin.split(',')[0]}</span>
            </div>
            <span className="text-muted-foreground text-xs">→</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#c9a227' }} />
              <span className="text-xs font-semibold text-foreground">{destination.split(',')[0]}</span>
            </div>
            {route.slice(1, -1).length > 0 && (
              <span className="text-[10px] text-muted-foreground">
                via {route.slice(1, -1).map(p => p.label).join(', ')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Truck size={11} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{logisticsPartner}</span>
          </div>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="px-5 py-3.5 border-t border-border bg-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-foreground">Journey Progress</span>
          <span className="text-xs font-bold tabular-nums" style={{ color: statusColor }}>
            {Math.round(progress * 100)}%
          </span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{ background: `linear-gradient(90deg, #1a5c2a, ${statusColor})` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          >
            {/* Shimmer */}
            {status === 'In Transit' && (
              <motion.div
                className="absolute inset-0 bg-white/30"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.5 }}
              />
            )}
          </motion.div>
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-muted-foreground font-medium">{route[0]?.label ?? origin.split(',')[0]}</span>
          {route.slice(1, -1).map((wp) => (
            <span key={wp.name} className="text-[10px] text-muted-foreground">{wp.label}</span>
          ))}
          <span className="text-[10px] text-muted-foreground font-medium">{route[route.length - 1]?.label ?? destination.split(',')[0]}</span>
        </div>
      </div>
    </div>
  );
}
