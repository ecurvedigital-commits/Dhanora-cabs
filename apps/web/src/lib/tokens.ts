/**
 * Design Tokens & Brand Constants for Dehradun Cab Platform
 * Based on dehraduncab.in brand references and cinematic Himalayan design specifications.
 */

export const BRAND_TOKENS = {
  name: 'Dhanora Cab Service',
  shortName: 'Dhanora Cab',
  tagline: 'Safe • Comfortable • On Time',
  subtitle: 'Reliable, Safe & Affordable Cabs for Local, Outstation & Chardham Trips',
  logo: '/images/logo.jpg',
  phonePrimary: '+91 75058 00684',
  phoneSecondary: '+91 75058 00684',
  phoneCallUrl: 'tel:+917505800684',
  whatsappUrl: 'https://wa.me/917505800684?text=Hi%20Dhanora%20Cab%20Service,%20I%20would%20like%20to%20inquire%20about%20a%20taxi%20booking.',
  email: 'dhanoracab@gmail.com',
  address: 'Dehradun & Uttarakhand 248001',
  operatingHours: '24 Hours / 7 Days a Week',

  contact: {
    phone: '+91 75058 00684',
    secondaryPhone: '+91 75058 00684',
    phoneCallUrl: 'tel:+917505800684',
    whatsappUrl: 'https://wa.me/917505800684?text=Hi%20Dhanora%20Cab%20Service,%20I%20would%20like%20to%20inquire%20about%20a%20taxi%20booking.',
    email: 'dhanoracab@gmail.com',
    address: 'Dehradun & Uttarakhand 248001',
    hours: '24 Hours / 7 Days a Week',
  },

  colors: {
    bgMain: '#F8F7F2',
    bgAlt: '#EAF1F7',
    textMain: '#14263D',
    textMuted: '#4B5E76',
    primaryAccent: '#F5BE19',
    primaryAccentHover: '#DFAC13',
    primaryAccentLight: '#FEF8E7',
    cardBg: '#FFFFFF',
    borderLight: '#E2E8F0',
    crimsonRed: '#B91C1C',
    crimsonRedHover: '#991B1B',
    whatsappGreen: '#15803D',
    deepNavy: '#14263D',
    // Backward-compatibility keys mapped cleanly
    primaryGold: '#F5BE19',
    primaryGoldHover: '#DFAC13',
    primaryGoldLight: '#FEF8E7',
    bgDark: '#F8F7F2',
    bgCard: '#FFFFFF',
    borderDark: '#E2E8F0',
  },
} as const;

export interface VehicleOption {
  id: string;
  name: string;
  category: 'Sedan' | 'SUV' | 'Tempo' | 'Bus';
  models: string;
  seatingCapacity: number;
  luggageCapacity: number;
  perKmRate: number;
  extraHourRate: number;
  nightCharges: number;
  features: string[];
  recommendedFor: string;
  badge?: string;
}

export const FLEET_OPTIONS: VehicleOption[] = [
  {
    id: 'sedan',
    name: 'Swift Dzire / Toyota Etios',
    category: 'Sedan',
    models: 'Maruti Suzuki Dzire, Toyota Etios, Hyundai Aura',
    seatingCapacity: 4,
    luggageCapacity: 2,
    perKmRate: 13,
    extraHourRate: 120,
    nightCharges: 300,
    features: ['Air Conditioned', 'Spacious Boot Space', 'Clean & Sanitized', 'Music System'],
    recommendedFor: 'Airport drops, local city touring, solo travelers & couples',
    badge: 'Most Popular',
  },
  {
    id: 'suv-ertiga',
    name: 'Maruti Ertiga',
    category: 'SUV',
    models: 'Maruti Suzuki Ertiga Smart Hybrid',
    seatingCapacity: 6,
    luggageCapacity: 3,
    perKmRate: 16,
    extraHourRate: 150,
    nightCharges: 400,
    features: ['Dual AC', 'Mountain-Tuned Suspension', 'Spacious Seating', 'Phone Chargers'],
    recommendedFor: 'Family trips to Mussoorie, Rishikesh, Haridwar & Corbett',
  },
  {
    id: 'suv-innova',
    name: 'Toyota Innova / Crysta',
    category: 'SUV',
    models: 'Toyota Innova Crysta 2.4 VX/ZX',
    seatingCapacity: 7,
    luggageCapacity: 4,
    perKmRate: 18,
    extraHourRate: 180,
    nightCharges: 450,
    features: ['Captain Seats Available', 'Superior Mountain Safety', 'Heavy Luggage Carrier', 'High Ground Clearance'],
    recommendedFor: 'Chardham Yatra, Delhi highway journeys & corporate VIP travel',
    badge: 'Himalayan Specialist',
  },
  {
    id: 'tempo-12',
    name: '12 / 16 Seater Tempo Traveller',
    category: 'Tempo',
    models: 'Force Motors Traveller Luxury Edition',
    seatingCapacity: 12,
    luggageCapacity: 8,
    perKmRate: 25,
    extraHourRate: 250,
    nightCharges: 500,
    features: ['Push-back Reclining Seats', 'Individual AC Vents', 'Rooftop Carrier', 'LED Screen & Audio'],
    recommendedFor: 'Pilgrimage groups, trekking squads, destination weddings',
    badge: 'Group Choice',
  },
  {
    id: 'bus-luxury',
    name: '27 & 45 Seater Executive Bus',
    category: 'Bus',
    models: 'Tata / Eicher Air Suspension Deluxe Coach',
    seatingCapacity: 27,
    luggageCapacity: 20,
    perKmRate: 45,
    extraHourRate: 400,
    nightCharges: 600,
    features: ['Air Suspension', 'Comfortable Recliners', 'Dedicated Tour Guide Mic', 'Emergency Exit Safety'],
    recommendedFor: 'School excursions, pilgrim yatras & corporate offsites',
  },
];

export interface RouteItem {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  approxDuration: string;
  startingPrice: number;
  highlight: string;
  routeType: 'Outstation' | 'Hill Climb' | 'Airport' | 'Pilgrimage';
  isPopular?: boolean;
}

export const POPULAR_ROUTES: RouteItem[] = [
  {
    id: 'dehradun-delhi',
    from: 'Dehradun',
    to: 'Delhi NCR (Airport / Railway)',
    distanceKm: 255,
    approxDuration: '4.5 Hours',
    startingPrice: 2999,
    highlight: 'Direct via Saharanpur Expressway. Doorstep pickup and IGI Airport drop-off.',
    routeType: 'Outstation',
    isPopular: true,
  },
  {
    id: 'dehradun-mussoorie',
    from: 'Dehradun',
    to: 'Mussoorie (Mall Road / Kempty)',
    distanceKm: 34,
    approxDuration: '1.2 Hours',
    startingPrice: 1200,
    highlight: 'Scenic mountain climb via Rajpur Road. Hairpin bends driven by certified mountain drivers.',
    routeType: 'Hill Climb',
    isPopular: true,
  },
  {
    id: 'dehradun-airport',
    from: 'Dehradun City / Clock Tower',
    to: 'Jolly Grant Airport (DED)',
    distanceKm: 30,
    approxDuration: '45 Minutes',
    startingPrice: 899,
    highlight: 'Punctual, guaranteed on-time airport transfer with flight tracking & luggage support.',
    routeType: 'Airport',
    isPopular: true,
  },
  {
    id: 'dehradun-haridwar',
    from: 'Dehradun',
    to: 'Haridwar (Har Ki Pauri)',
    distanceKm: 54,
    approxDuration: '1.2 Hours',
    startingPrice: 1499,
    highlight: 'Smooth highway drive along the Ganga river. Get dropped right at your ghat, temple, or ashram.',
    routeType: 'Pilgrimage',
    isPopular: true,
  },
  {
    id: 'dehradun-rishikesh',
    from: 'Dehradun',
    to: 'Rishikesh (Tapovan / Laxman Jhula)',
    distanceKm: 45,
    approxDuration: '1.0 Hour',
    startingPrice: 1299,
    highlight: 'Quick ride to the yoga capital. Easy doorstep drops at riverside resorts, ashrams, and rafting camps.',
    routeType: 'Outstation',
    isPopular: true,
  },
  {
    id: 'dehradun-chandigarh',
    from: 'Dehradun',
    to: 'Chandigarh / Mohali',
    distanceKm: 170,
    approxDuration: '3.5 Hours',
    startingPrice: 2499,
    highlight: 'Via Paonta Sahib & Nahan bypass. Fast, comfortable interstate executive taxi service.',
    routeType: 'Outstation',
    isPopular: true,
  },
];

export interface TourPackageItem {
  id: string;
  title: string;
  duration: string;
  startingPrice: number;
  placesCovered: string[];
  description: string;
  badge?: string;
  season: string;
}

export const TOUR_PACKAGES: TourPackageItem[] = [
  {
    id: 'chardham-full',
    title: 'Complete Chardham Yatra by Private Cab',
    duration: '10 Days / 9 Nights',
    startingPrice: 28500,
    placesCovered: ['Yamunotri', 'Gangotri', 'Kedarnath', 'Badrinath', 'Haridwar'],
    description: 'The complete four-shrine pilgrimage. Travel in comfort with oxygen support, a senior hill driver, and full temple assistance.',
    badge: 'Sacred Pilgrimage',
    season: 'May – November',
  },
  {
    id: 'do-dham-kedar-badri',
    title: 'Do Dham Yatra (Kedarnath & Badrinath)',
    duration: '6 Days / 5 Nights',
    startingPrice: 18500,
    placesCovered: ['Kedarnath', 'Badrinath', 'Guptkashi', 'Joshimath', 'Rudraprayag'],
    description: 'A sacred journey to Kedarnath and Badrinath. Enjoy safe mountain driving, timely temple drops, and comfortable hotel halts.',
    badge: 'High Demand',
    season: 'May – November',
  },
  {
    id: 'mussoorie-dhanaulti',
    title: 'Mussoorie, Dhanaulti & Kanatal Hill Escape',
    duration: '3 Days / 2 Nights',
    startingPrice: 6999,
    placesCovered: ['Kempty Falls', 'Mall Road', 'Eco Park Dhanaulti', 'Surkanda Devi', 'Tehri Lake'],
    description: 'Misty pine forests, snow-clad peaks view, and relaxing hill station weekend road trip from Dehradun.',
    badge: 'Weekend Getaway',
    season: 'All Year Round',
  },
  {
    id: 'rishikesh-camping',
    title: 'Rishikesh Adventure & Holy Ganga Aarti Tour',
    duration: '2 Days / 1 Night',
    startingPrice: 4500,
    placesCovered: ['Triveni Ghat', 'Ram Jhula', 'Laxman Jhula', 'Shivpuri Rafting', 'Neelkanth'],
    description: 'River rafting, cliff jumps, evening Ganga Aarti, and peaceful luxury camping by the river.',
    season: 'September – June',
  },
];

export interface ReviewItem {
  id: string;
  author: string;
  location: string;
  route: string;
  rating: number;
  review: string;
  vehicleUsed: string;
}

export const CUSTOMER_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Rajni Bisht',
    location: 'Dehradun',
    route: 'Dehradun to Haridwar',
    rating: 5,
    review: 'I had a wonderful experience with Dehradun Cab during my trip to Haridwar. The driver was very friendly and helpful, guided us well and made us feel safe and comfortable throughout the journey. The fare was very budget-friendly with no surprise extras.',
    vehicleUsed: 'Swift Dzire',
  },
  {
    id: 'rev-2',
    author: 'Roshan Khan',
    location: 'Delhi',
    route: 'Emergency Airport Transfer',
    rating: 5,
    review: 'Had an urgent flight from Jolly Grant Airport. Called Dhanora Cab on +91 75058 00684 and they sent a car within 15 minutes! The driver was professional, drove exceptionally safely on the highway, and I reached right on time. Outstanding emergency response.',
    vehicleUsed: 'Innova Crysta',
  },
  {
    id: 'rev-3',
    author: 'Ankit Kumar',
    location: 'Chandigarh',
    route: 'Dehradun to Mussoorie Hill Climb',
    rating: 5,
    review: 'Planned a trip to Mussoorie with college friends. The booking process was super smooth, customer care was courteous, and the driver navigated the steep mountain curves with extreme skill. Truly the best cab service in Uttarakhand.',
    vehicleUsed: 'Maruti Ertiga',
  },
  {
    id: 'rev-4',
    author: 'Priya Laxmi',
    location: 'Hyderabad',
    route: 'Chardham Yatra 10-Day Tour',
    rating: 5,
    review: 'Booked a Tempo Traveller for our 12-member family Chardham Yatra. The vehicle was spotless, pushback seats were comfortable for our elders, and the driver was experienced with high-altitude roads. Round-trip support from Dehradun was flawless.',
    vehicleUsed: '12-Seater Tempo Traveller',
  },
  {
    id: 'rev-5',
    author: 'Anil Kumar',
    location: 'Noida',
    route: 'Regular Business Travel (Dehradun – Delhi)',
    rating: 5,
    review: 'I travel weekly for government consultancy work between Delhi and Dehradun. Competitive rates, verified chauffeurs, GST bills delivered promptly, and unmatched reliability. I have been their daily customer for over 2 years now.',
    vehicleUsed: 'Toyota Etios',
  },
];

export interface FaqItem {
  id: string;
  category: 'Billing & Pricing' | 'Airport & Outstation' | 'Hill Safety' | 'Booking & Policies';
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Billing & Pricing',
    question: 'Are highway tolls, parking, and driver night allowances included in the quote?',
    answer: 'Yes, all our quoted outstation and one-way taxi fares are 100% all-inclusive. FASTag highway tolls, state border permits, fuel, and driver night allowances are clearly itemized and bundled upfront. You pay exactly the price quoted on your booking confirmation — with zero hidden surprises or extra roadside demands.',
  },
  {
    id: 'faq-2',
    category: 'Airport & Outstation',
    question: 'What happens if my flight arrives late at Jolly Grant Airport (DED)?',
    answer: 'We track your incoming domestic flight in real time using your flight number. If your flight is delayed or rescheduled, your chauffeur automatically adjusts their pickup time at no extra charge. You will never pay waiting penalties for airline delays, and your driver will be waiting outside the arrival terminal holding your name board.',
  },
  {
    id: 'faq-3',
    category: 'Hill Safety',
    question: 'Is the AC kept running during steep hill climbs to Mussoorie and Dhanaulti?',
    answer: 'Yes, our entire mountain fleet (Swift Dzire, Maruti Ertiga, Toyota Innova Crysta, and Force Tempo Travellers) features well-serviced, high-capacity dual-AC units that operate smoothly on steep hill climbs without engine strain. You enjoy a cool, comfortable cabin throughout your journey.',
  },
  {
    id: 'faq-4',
    category: 'Airport & Outstation',
    question: 'Can we stop for meals, restrooms, or scenic photography along the highway?',
    answer: 'Absolutely! Our chauffeurs willingly pause at safe, hygienic family restaurants (such as Cheetal Grand or Namaste Asia on Delhi Expressway, and Kolhukhet viewpoints on Mussoorie road) for meals, tea, or clean washroom halts at no extra charge. We understand that mountain transit requires comfortable breaks.',
  },
  {
    id: 'faq-5',
    category: 'Booking & Policies',
    question: 'What is your cancellation policy, and how quickly is the advance refunded?',
    answer: 'We provide free cancellation up to 2 hours before your scheduled pickup for local city and airport rides, and up to 24 hours before outstation and Chardham packages. Any advance token deposit is immediately refunded in full via UPI without cancellation deductions.',
  },
  {
    id: 'faq-6',
    category: 'Hill Safety',
    question: 'Are your chauffeurs specially trained and licensed for Himalayan mountain roads?',
    answer: 'Yes, 100% of our mountain chauffeurs hold commercial hill driving endorsements certified by Uttarakhand RTO, with a minimum of 5 to 10 years of experience driving ghat roads, sharp hairpin turns, fog belts, and high-altitude Chardham routes (Kedarnath, Badrinath, Gangotri, Yamunotri).',
  },
  {
    id: 'faq-7',
    category: 'Billing & Pricing',
    question: 'Do you provide official GST tax invoices for corporate travel reimbursement?',
    answer: 'Yes. Every booking automatically generates an official GST-compliant tax invoice containing your company name, GSTIN number, route details, and tax breakdown. You can download your invoice anytime from our /track page or receive it directly on WhatsApp and email.',
  },
  {
    id: 'faq-8',
    category: 'Booking & Policies',
    question: 'How far in advance should I book my cab or Chardham Yatra package?',
    answer: 'For standard outstation trips (Delhi, Chandigarh, Haridwar) or airport transfers, booking 2 to 4 hours in advance or same-day morning is sufficient. For peak Chardham Yatra (May–June & September–October) and holiday long weekends, advance booking of 1 to 2 weeks is recommended to secure your preferred vehicle (especially Innova Crysta & Tempo Travellers).',
  },
  {
    id: 'faq-9',
    category: 'Booking & Policies',
    question: 'Do you offer doorstep pickup from any residential area or hotel in Dehradun?',
    answer: 'Yes, we provide 100% doorstep pickup from any address in Dehradun — including Rajpur Road, Sahastradhara, GMS Road, Clement Town, Premnagar, Selaqui, FRI, ISBT, and Dehradun Railway Station. Your driver contacts you 30 minutes prior to arrival.',
  },
  {
    id: 'faq-10',
    category: 'Billing & Pricing',
    question: 'What payment modes are accepted, and do I have to pay the full fare upfront?',
    answer: 'No upfront full payment is required. You only pay a small 20% advance token to lock your vehicle and driver schedule. The remaining 80% balance can be paid directly to the chauffeur upon arrival at your destination using Google Pay, PhonePe, Paytm UPI, cash, or credit/debit cards.',
  },
];

