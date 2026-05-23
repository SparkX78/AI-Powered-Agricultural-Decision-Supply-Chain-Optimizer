// ─── Types ────────────────────────────────────────────────────────────────────

export type ShipmentStatus = 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled';
export type UserRole = 'farmer' | 'owner' | 'partner';

// ── Produce Marketplace ───────────────────────────────────────────────────────

export type ProduceCategory = 'Grain' | 'Vegetable' | 'Fruit' | 'Pulse' | 'Oilseed' | 'Spice';
export type ProduceListingStatus = 'Available' | 'Offer Received' | 'Sold' | 'Expired';
export type SellerOfferStatus = 'Pending' | 'Accepted' | 'Rejected';
export type TransportJobStatus = 'Open' | 'Assigned' | 'Picked Up' | 'Delivered';

export interface ProduceListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  crop: string;
  variety: string;
  category: ProduceCategory;
  emoji: string;
  quantityAvailable: number;   // in quintals
  unit: string;
  askingPrice: number;         // per quintal in INR
  harvestDate: string;
  availableFrom: string;
  description: string;
  quality: 'Grade A' | 'Grade B' | 'Grade C';
  status: ProduceListingStatus;
  postedDate: string;
  offersCount: number;
}

export interface SellerOffer {
  id: string;
  listingId: string;
  crop: string;
  farmerName: string;
  farmerLocation: string;
  quantity: number;
  offeredPrice: number;        // per quintal
  totalAmount: number;
  sellerName: string;
  sellerCompany: string;
  deliveryLocation: string;
  message: string;
  status: SellerOfferStatus;
  offerDate: string;
}

export interface TransportJob {
  id: string;
  listingId: string;
  crop: string;
  farmerName: string;
  pickupLocation: string;
  dropLocation: string;
  quantity: number;
  scheduledDate: string;
  paymentAmount: number;       // transport fee in INR
  status: TransportJobStatus;
  assignedTo?: string;
  vehicleType: string;
  distance: string;
  postedDate: string;
}

export interface MarketPrice {
  crop: string;
  variety: string;
  price: number;
  unit: string;
  change: number;
  mandi: string;
  state: string;
  lastUpdated: string;
  emoji: string;
}

export interface TimelineEvent {
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface Shipment {
  id: string;
  crop: string;
  quantity: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  dispatchDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  logisticsPartner: string;
  vehicleNo: string;
  buyerName: string;
  amount: number;
  timeline: TimelineEvent[];
}

export interface OrderHistory {
  id: string;
  crop: string;
  quantity: string;
  buyer: string;
  amount: number;
  date: string;
  status: ShipmentStatus;
}

export interface Farmer {
  id: string;
  name: string;
  village: string;
  state: string;
  crops: string[];
  joinedDate: string;
  totalTrades: number;
  totalRevenue: number;
  status: 'Active' | 'Inactive';
}

// ─── Market Prices ────────────────────────────────────────────────────────────

export const marketPrices: MarketPrice[] = [
  {
    crop: 'Wheat',
    variety: 'Sharbati',
    price: 2150,
    unit: 'per quintal',
    change: 2.3,
    mandi: 'Azadpur Mandi',
    state: 'Delhi',
    lastUpdated: '06 Apr 2026, 09:30 AM',
    emoji: '🌾',
  },
  {
    crop: 'Rice',
    variety: 'Basmati 1121',
    price: 4200,
    unit: 'per quintal',
    change: -0.8,
    mandi: 'Karnal Mandi',
    state: 'Haryana',
    lastUpdated: '06 Apr 2026, 09:15 AM',
    emoji: '🍚',
  },
  {
    crop: 'Tomato',
    variety: 'Hybrid',
    price: 1850,
    unit: 'per quintal',
    change: 5.1,
    mandi: 'Vashi APMC',
    state: 'Maharashtra',
    lastUpdated: '06 Apr 2026, 08:45 AM',
    emoji: '🍅',
  },
  {
    crop: 'Potato',
    variety: 'Kufri Jyoti',
    price: 1200,
    unit: 'per quintal',
    change: -1.5,
    mandi: 'Agra Mandi',
    state: 'Uttar Pradesh',
    lastUpdated: '06 Apr 2026, 09:00 AM',
    emoji: '🥔',
  },
  {
    crop: 'Onion',
    variety: 'Red Nasik',
    price: 2400,
    unit: 'per quintal',
    change: 3.7,
    mandi: 'Lasalgaon Mandi',
    state: 'Maharashtra',
    lastUpdated: '06 Apr 2026, 09:20 AM',
    emoji: '🧅',
  },
  {
    crop: 'Soybean',
    variety: 'JS-335',
    price: 4890,
    unit: 'per quintal',
    change: 1.2,
    mandi: 'Indore Mandi',
    state: 'Madhya Pradesh',
    lastUpdated: '06 Apr 2026, 08:30 AM',
    emoji: '🫘',
  },
  {
    crop: 'Maize',
    variety: 'Yellow Hybrid',
    price: 1680,
    unit: 'per quintal',
    change: -0.3,
    mandi: 'Gulbarga Mandi',
    state: 'Karnataka',
    lastUpdated: '06 Apr 2026, 09:10 AM',
    emoji: '🌽',
  },
  {
    crop: 'Cotton',
    variety: 'Bt Cotton',
    price: 6200,
    unit: 'per quintal',
    change: 0.9,
    mandi: 'Rajkot Mandi',
    state: 'Gujarat',
    lastUpdated: '06 Apr 2026, 09:05 AM',
    emoji: '🌿',
  },
];

// ─── Shipments ────────────────────────────────────────────────────────────────

export const shipments: Shipment[] = [
  {
    id: 'SHP-2026-0847',
    crop: 'Wheat',
    quantity: '24 Quintals',
    origin: 'Ludhiana, Punjab',
    destination: 'Azadpur Mandi, Delhi',
    status: 'In Transit',
    dispatchDate: '04 Apr 2026',
    expectedDelivery: '07 Apr 2026',
    logisticsPartner: 'FastMove Logistics',
    vehicleNo: 'PB-10-AB-4521',
    buyerName: 'Sharma Grain Traders',
    amount: 51600,
    timeline: [
      {
        label: 'Order Created',
        description: 'Shipment order placed by Ramesh Patel',
        timestamp: '03 Apr 2026, 02:00 PM',
        completed: true,
      },
      {
        label: 'Produce Packed',
        description: '24 quintals of Sharbati wheat packed and weighed',
        timestamp: '04 Apr 2026, 07:30 AM',
        completed: true,
      },
      {
        label: 'Dispatched',
        description: 'Vehicle PB-10-AB-4521 departed from Ludhiana',
        timestamp: '04 Apr 2026, 11:00 AM',
        completed: true,
      },
      {
        label: 'In Transit',
        description: 'Shipment en route — currently near Ambala, Haryana',
        timestamp: '05 Apr 2026, 03:00 PM',
        completed: true,
      },
      {
        label: 'Delivered',
        description: 'Awaiting delivery at Azadpur Mandi',
        timestamp: 'Expected 07 Apr 2026',
        completed: false,
      },
    ],
  },
  {
    id: 'SHP-2026-0831',
    crop: 'Rice',
    quantity: '18 Quintals',
    origin: 'Karnal, Haryana',
    destination: 'Vashi APMC, Mumbai',
    status: 'Delivered',
    dispatchDate: '28 Mar 2026',
    expectedDelivery: '01 Apr 2026',
    actualDelivery: '01 Apr 2026',
    logisticsPartner: 'AgroShip India',
    vehicleNo: 'HR-07-CD-8832',
    buyerName: 'Mumbai Rice Wholesale Co.',
    amount: 75600,
    timeline: [
      {
        label: 'Order Created',
        description: 'Shipment order placed',
        timestamp: '27 Mar 2026, 10:00 AM',
        completed: true,
      },
      {
        label: 'Produce Packed',
        description: '18 quintals of Basmati 1121 packed',
        timestamp: '28 Mar 2026, 08:00 AM',
        completed: true,
      },
      {
        label: 'Dispatched',
        description: 'Vehicle departed from Karnal',
        timestamp: '28 Mar 2026, 12:00 PM',
        completed: true,
      },
      {
        label: 'In Transit',
        description: 'Shipment passed through Pune checkpoint',
        timestamp: '31 Mar 2026, 06:00 AM',
        completed: true,
      },
      {
        label: 'Delivered',
        description: 'Successfully delivered and payment released',
        timestamp: '01 Apr 2026, 10:30 AM',
        completed: true,
      },
    ],
  },
  {
    id: 'SHP-2026-0819',
    crop: 'Tomato',
    quantity: '6 Quintals',
    origin: 'Nashik, Maharashtra',
    destination: 'Pune APMC, Pune',
    status: 'Pending',
    dispatchDate: '08 Apr 2026',
    expectedDelivery: '09 Apr 2026',
    logisticsPartner: 'QuickCool Transport',
    vehicleNo: 'MH-15-EF-2210',
    buyerName: 'Fresh Veggies Pvt. Ltd.',
    amount: 11100,
    timeline: [
      {
        label: 'Order Created',
        description: 'Shipment order placed',
        timestamp: '06 Apr 2026, 11:00 AM',
        completed: true,
      },
      {
        label: 'Produce Packed',
        description: 'Awaiting packing on 07 Apr',
        timestamp: 'Expected 07 Apr 2026',
        completed: false,
      },
      {
        label: 'Dispatched',
        description: 'Scheduled for 08 Apr 2026',
        timestamp: 'Expected 08 Apr 2026',
        completed: false,
      },
      {
        label: 'In Transit',
        description: 'Not yet dispatched',
        timestamp: 'Expected 08 Apr 2026',
        completed: false,
      },
      {
        label: 'Delivered',
        description: 'Expected delivery at Pune APMC',
        timestamp: 'Expected 09 Apr 2026',
        completed: false,
      },
    ],
  },
  {
    id: 'SHP-2026-0804',
    crop: 'Potato',
    quantity: '30 Quintals',
    origin: 'Agra, Uttar Pradesh',
    destination: 'Azadpur Mandi, Delhi',
    status: 'Delivered',
    dispatchDate: '20 Mar 2026',
    expectedDelivery: '22 Mar 2026',
    actualDelivery: '22 Mar 2026',
    logisticsPartner: 'FastMove Logistics',
    vehicleNo: 'UP-80-GH-5543',
    buyerName: 'Delhi Potato Traders',
    amount: 36000,
    timeline: [
      {
        label: 'Order Created',
        description: 'Order placed',
        timestamp: '19 Mar 2026, 09:00 AM',
        completed: true,
      },
      {
        label: 'Produce Packed',
        description: '30 quintals packed',
        timestamp: '20 Mar 2026, 07:00 AM',
        completed: true,
      },
      {
        label: 'Dispatched',
        description: 'Vehicle departed from Agra',
        timestamp: '20 Mar 2026, 10:00 AM',
        completed: true,
      },
      {
        label: 'In Transit',
        description: 'Crossed Mathura checkpoint',
        timestamp: '20 Mar 2026, 02:00 PM',
        completed: true,
      },
      {
        label: 'Delivered',
        description: 'Delivered and payment confirmed',
        timestamp: '22 Mar 2026, 09:00 AM',
        completed: true,
      },
    ],
  },
];

// ─── Order History ────────────────────────────────────────────────────────────

export const orderHistory: OrderHistory[] = [
  {
    id: 'ORD-2026-0847',
    crop: 'Wheat',
    quantity: '24 Quintals',
    buyer: 'Sharma Grain Traders',
    amount: 51600,
    date: '04 Apr 2026',
    status: 'In Transit',
  },
  {
    id: 'ORD-2026-0831',
    crop: 'Rice',
    quantity: '18 Quintals',
    buyer: 'Mumbai Rice Wholesale Co.',
    amount: 75600,
    date: '28 Mar 2026',
    status: 'Delivered',
  },
  {
    id: 'ORD-2026-0819',
    crop: 'Tomato',
    quantity: '6 Quintals',
    buyer: 'Fresh Veggies Pvt. Ltd.',
    amount: 11100,
    date: '06 Apr 2026',
    status: 'Pending',
  },
  {
    id: 'ORD-2026-0804',
    crop: 'Potato',
    quantity: '30 Quintals',
    buyer: 'Delhi Potato Traders',
    amount: 36000,
    date: '20 Mar 2026',
    status: 'Delivered',
  },
  {
    id: 'ORD-2026-0788',
    crop: 'Onion',
    quantity: '15 Quintals',
    buyer: 'Spice Route Exports',
    amount: 36000,
    date: '10 Mar 2026',
    status: 'Delivered',
  },
  {
    id: 'ORD-2026-0762',
    crop: 'Maize',
    quantity: '40 Quintals',
    buyer: 'Karnataka Feed Mills',
    amount: 67200,
    date: '25 Feb 2026',
    status: 'Delivered',
  },
];

// ─── Farmers (for Owner Dashboard) ───────────────────────────────────────────

export const farmers: Farmer[] = [
  {
    id: 'FRM-001',
    name: 'Ramesh Patel',
    village: 'Ludhiana',
    state: 'Punjab',
    crops: ['Wheat', 'Rice'],
    joinedDate: '12 Jan 2025',
    totalTrades: 14,
    totalRevenue: 312000,
    status: 'Active',
  },
  {
    id: 'FRM-002',
    name: 'Sunita Devi',
    village: 'Karnal',
    state: 'Haryana',
    crops: ['Rice', 'Wheat'],
    joinedDate: '03 Mar 2025',
    totalTrades: 9,
    totalRevenue: 198000,
    status: 'Active',
  },
  {
    id: 'FRM-003',
    name: 'Gopal Rao',
    village: 'Nashik',
    state: 'Maharashtra',
    crops: ['Tomato', 'Onion'],
    joinedDate: '20 Feb 2025',
    totalTrades: 22,
    totalRevenue: 445000,
    status: 'Active',
  },
  {
    id: 'FRM-004',
    name: 'Meena Kumari',
    village: 'Agra',
    state: 'Uttar Pradesh',
    crops: ['Potato', 'Wheat'],
    joinedDate: '05 Apr 2025',
    totalTrades: 7,
    totalRevenue: 126000,
    status: 'Active',
  },
  {
    id: 'FRM-005',
    name: 'Harjit Singh',
    village: 'Amritsar',
    state: 'Punjab',
    crops: ['Wheat', 'Cotton'],
    joinedDate: '18 Jun 2025',
    totalTrades: 11,
    totalRevenue: 287000,
    status: 'Active',
  },
  {
    id: 'FRM-006',
    name: 'Kavitha Reddy',
    village: 'Gulbarga',
    state: 'Karnataka',
    crops: ['Maize', 'Soybean'],
    joinedDate: '29 Jul 2025',
    totalTrades: 5,
    totalRevenue: 98000,
    status: 'Inactive',
  },
];

// ─── Owner Dashboard Stats ────────────────────────────────────────────────────

export const ownerStats = {
  totalShipments: 1248,
  totalRevenue: 5240000,
  activeFarmers: 10342,
  activeLogisticsPartners: 512,
  pendingShipments: 87,
  deliveredThisMonth: 342,
};

// ─── Chart Data ───────────────────────────────────────────────────────────────

export const dailyActivityData = [
  { day: 'Mon', shipments: 42, orders: 58 },
  { day: 'Tue', shipments: 55, orders: 71 },
  { day: 'Wed', shipments: 38, orders: 49 },
  { day: 'Thu', shipments: 63, orders: 82 },
  { day: 'Fri', shipments: 71, orders: 95 },
  { day: 'Sat', shipments: 48, orders: 61 },
  { day: 'Sun', shipments: 29, orders: 37 },
];

export const shipmentTrendData = [
  { month: 'Oct', delivered: 210, pending: 32 },
  { month: 'Nov', delivered: 245, pending: 28 },
  { month: 'Dec', delivered: 198, pending: 41 },
  { month: 'Jan', delivered: 287, pending: 35 },
  { month: 'Feb', delivered: 312, pending: 29 },
  { month: 'Mar', delivered: 342, pending: 22 },
];

// ─── All Shipments for Owner ──────────────────────────────────────────────────

export const allShipments: Shipment[] = [
  ...shipments,
  {
    id: 'SHP-2026-0791',
    crop: 'Onion',
    quantity: '15 Quintals',
    origin: 'Lasalgaon, Maharashtra',
    destination: 'Hyderabad APMC',
    status: 'Delivered',
    dispatchDate: '10 Mar 2026',
    expectedDelivery: '13 Mar 2026',
    actualDelivery: '13 Mar 2026',
    logisticsPartner: 'AgroShip India',
    vehicleNo: 'MH-09-IJ-7761',
    buyerName: 'Spice Route Exports',
    amount: 36000,
    timeline: [],
  },
  {
    id: 'SHP-2026-0776',
    crop: 'Maize',
    quantity: '40 Quintals',
    origin: 'Gulbarga, Karnataka',
    destination: 'Bengaluru APMC',
    status: 'Delivered',
    dispatchDate: '25 Feb 2026',
    expectedDelivery: '27 Feb 2026',
    actualDelivery: '27 Feb 2026',
    logisticsPartner: 'QuickCool Transport',
    vehicleNo: 'KA-32-KL-3390',
    buyerName: 'Karnataka Feed Mills',
    amount: 67200,
    timeline: [],
  },
];

// ─── Produce Listings (Farmer posts) ─────────────────────────────────────────

export const produceListings: ProduceListing[] = [
  {
    id: 'LST-2026-0101',
    farmerId: 'FRM-001',
    farmerName: 'Ramesh Patel',
    farmerLocation: 'Ludhiana, Punjab',
    crop: 'Wheat',
    variety: 'Sharbati',
    category: 'Grain',
    emoji: '🌾',
    quantityAvailable: 50,
    unit: 'Quintal',
    askingPrice: 2150,
    harvestDate: '28 Mar 2026',
    availableFrom: '05 Apr 2026',
    description: 'Premium Sharbati wheat, well-dried and cleaned. Moisture content below 12%. Suitable for flour mills and export.',
    quality: 'Grade A',
    status: 'Offer Received',
    postedDate: '05 Apr 2026',
    offersCount: 3,
  },
  {
    id: 'LST-2026-0102',
    farmerId: 'FRM-003',
    farmerName: 'Gopal Rao',
    farmerLocation: 'Nashik, Maharashtra',
    crop: 'Tomato',
    variety: 'Hybrid',
    category: 'Vegetable',
    emoji: '🍅',
    quantityAvailable: 12,
    unit: 'Quintal',
    askingPrice: 1900,
    harvestDate: '04 Apr 2026',
    availableFrom: '06 Apr 2026',
    description: 'Fresh hybrid tomatoes, firm and bright red. Ideal for wholesale markets and processing units.',
    quality: 'Grade A',
    status: 'Available',
    postedDate: '06 Apr 2026',
    offersCount: 1,
  },
  {
    id: 'LST-2026-0103',
    farmerId: 'FRM-004',
    farmerName: 'Meena Kumari',
    farmerLocation: 'Agra, Uttar Pradesh',
    crop: 'Potato',
    variety: 'Kufri Jyoti',
    category: 'Vegetable',
    emoji: '🥔',
    quantityAvailable: 80,
    unit: 'Quintal',
    askingPrice: 1200,
    harvestDate: '01 Apr 2026',
    availableFrom: '06 Apr 2026',
    description: 'Kufri Jyoti potatoes, uniform size, low moisture. Suitable for chips industry and retail.',
    quality: 'Grade B',
    status: 'Available',
    postedDate: '06 Apr 2026',
    offersCount: 0,
  },
  {
    id: 'LST-2026-0104',
    farmerId: 'FRM-002',
    farmerName: 'Sunita Devi',
    farmerLocation: 'Karnal, Haryana',
    crop: 'Rice',
    variety: 'Basmati 1121',
    category: 'Grain',
    emoji: '🍚',
    quantityAvailable: 30,
    unit: 'Quintal',
    askingPrice: 4200,
    harvestDate: '20 Mar 2026',
    availableFrom: '01 Apr 2026',
    description: 'Long-grain Basmati 1121, aged 6 months. Excellent aroma and elongation ratio. Export quality.',
    quality: 'Grade A',
    status: 'Sold',
    postedDate: '01 Apr 2026',
    offersCount: 5,
  },
  {
    id: 'LST-2026-0105',
    farmerId: 'FRM-005',
    farmerName: 'Harjit Singh',
    farmerLocation: 'Amritsar, Punjab',
    crop: 'Onion',
    variety: 'Red Nasik',
    category: 'Vegetable',
    emoji: '🧅',
    quantityAvailable: 25,
    unit: 'Quintal',
    askingPrice: 2350,
    harvestDate: '30 Mar 2026',
    availableFrom: '06 Apr 2026',
    description: 'Red Nasik onions, medium to large size, good shelf life. Ideal for retail and export.',
    quality: 'Grade A',
    status: 'Available',
    postedDate: '06 Apr 2026',
    offersCount: 2,
  },
  {
    id: 'LST-2026-0106',
    farmerId: 'FRM-006',
    farmerName: 'Kavitha Reddy',
    farmerLocation: 'Gulbarga, Karnataka',
    crop: 'Maize',
    variety: 'Yellow Hybrid',
    category: 'Grain',
    emoji: '🌽',
    quantityAvailable: 60,
    unit: 'Quintal',
    askingPrice: 1680,
    harvestDate: '25 Mar 2026',
    availableFrom: '05 Apr 2026',
    description: 'Yellow hybrid maize, dry and clean. Suitable for poultry feed and starch processing.',
    quality: 'Grade B',
    status: 'Available',
    postedDate: '05 Apr 2026',
    offersCount: 1,
  },
];

// ─── Seller Offers ────────────────────────────────────────────────────────────

export const sellerOffers: SellerOffer[] = [
  {
    id: 'OFR-2026-0201',
    listingId: 'LST-2026-0101',
    crop: 'Wheat (Sharbati)',
    farmerName: 'Ramesh Patel',
    farmerLocation: 'Ludhiana, Punjab',
    quantity: 50,
    offeredPrice: 2100,
    totalAmount: 105000,
    sellerName: 'Anil Sharma',
    sellerCompany: 'Sharma Grain Traders',
    deliveryLocation: 'Azadpur Mandi, Delhi',
    message: 'We are interested in the full 50 quintals. Can offer ₹2100/quintal with payment within 3 days of delivery.',
    status: 'Pending',
    offerDate: '06 Apr 2026',
  },
  {
    id: 'OFR-2026-0202',
    listingId: 'LST-2026-0101',
    crop: 'Wheat (Sharbati)',
    farmerName: 'Ramesh Patel',
    farmerLocation: 'Ludhiana, Punjab',
    quantity: 30,
    offeredPrice: 2180,
    totalAmount: 65400,
    sellerName: 'Priya Exports',
    sellerCompany: 'Priya Agro Exports Pvt. Ltd.',
    deliveryLocation: 'Amritsar Cold Storage',
    message: 'Looking for 30 quintals for export. Offering ₹2180/quintal — above market rate. Immediate payment.',
    status: 'Pending',
    offerDate: '06 Apr 2026',
  },
  {
    id: 'OFR-2026-0203',
    listingId: 'LST-2026-0102',
    crop: 'Tomato (Hybrid)',
    farmerName: 'Gopal Rao',
    farmerLocation: 'Nashik, Maharashtra',
    quantity: 12,
    offeredPrice: 1850,
    totalAmount: 22200,
    sellerName: 'Ravi Kumar',
    sellerCompany: 'Fresh Veggies Pvt. Ltd.',
    deliveryLocation: 'Pune APMC, Pune',
    message: 'Need all 12 quintals urgently for retail chain. Can arrange transport from your farm.',
    status: 'Accepted',
    offerDate: '06 Apr 2026',
  },
];

// ─── Transport Jobs ───────────────────────────────────────────────────────────

export const transportJobs: TransportJob[] = [
  {
    id: 'TRJ-2026-0301',
    listingId: 'LST-2026-0102',
    crop: 'Tomato (Hybrid)',
    farmerName: 'Gopal Rao',
    pickupLocation: 'Nashik, Maharashtra',
    dropLocation: 'Pune APMC, Pune',
    quantity: 12,
    scheduledDate: '08 Apr 2026',
    paymentAmount: 4800,
    status: 'Open',
    vehicleType: 'Mini Truck (1 Ton)',
    distance: '210 km',
    postedDate: '06 Apr 2026',
  },
  {
    id: 'TRJ-2026-0302',
    listingId: 'LST-2026-0101',
    crop: 'Wheat (Sharbati)',
    farmerName: 'Ramesh Patel',
    pickupLocation: 'Ludhiana, Punjab',
    dropLocation: 'Azadpur Mandi, Delhi',
    quantity: 50,
    scheduledDate: '09 Apr 2026',
    paymentAmount: 12500,
    status: 'Assigned',
    assignedTo: 'FastMove Logistics',
    vehicleType: 'Large Truck (10 Ton)',
    distance: '310 km',
    postedDate: '06 Apr 2026',
  },
  {
    id: 'TRJ-2026-0303',
    listingId: 'LST-2026-0105',
    crop: 'Onion (Red Nasik)',
    farmerName: 'Harjit Singh',
    pickupLocation: 'Amritsar, Punjab',
    dropLocation: 'Chandigarh Wholesale Market',
    quantity: 25,
    scheduledDate: '07 Apr 2026',
    paymentAmount: 5200,
    status: 'Open',
    vehicleType: 'Medium Truck (5 Ton)',
    distance: '230 km',
    postedDate: '06 Apr 2026',
  },
  {
    id: 'TRJ-2026-0304',
    listingId: 'LST-2026-0106',
    crop: 'Maize (Yellow Hybrid)',
    farmerName: 'Kavitha Reddy',
    pickupLocation: 'Gulbarga, Karnataka',
    dropLocation: 'Bengaluru APMC',
    quantity: 60,
    scheduledDate: '10 Apr 2026',
    paymentAmount: 9800,
    status: 'Open',
    vehicleType: 'Large Truck (10 Ton)',
    distance: '620 km',
    postedDate: '06 Apr 2026',
  },
  {
    id: 'TRJ-2026-0305',
    listingId: 'LST-2026-0104',
    crop: 'Rice (Basmati 1121)',
    farmerName: 'Sunita Devi',
    pickupLocation: 'Karnal, Haryana',
    dropLocation: 'Vashi APMC, Mumbai',
    quantity: 30,
    scheduledDate: '02 Apr 2026',
    paymentAmount: 18000,
    status: 'Delivered',
    assignedTo: 'AgroShip India',
    vehicleType: 'Large Truck (10 Ton)',
    distance: '1450 km',
    postedDate: '01 Apr 2026',
  },
];
