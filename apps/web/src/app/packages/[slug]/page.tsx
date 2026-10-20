import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingMobileBar } from '@/components/FloatingMobileBar';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { TOUR_PACKAGES, BRAND_TOKENS, FLEET_OPTIONS } from '@/lib/tokens';
import {
  Compass,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Phone,
  MessageCircle,
  Star,
  Users,
  ChevronRight,
  Check,
  AlertCircle,
  Car,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TOUR_PACKAGES.map((pkg) => ({
    slug: pkg.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = TOUR_PACKAGES.find((p) => p.id === slug);

  if (!pkg) {
    return {
      title: 'Tour Package Not Found | Dhanora Cab Service',
    };
  }

  const title = `${pkg.title} | Dhanora Cab Service Tour Packages`;
  const description = `${pkg.description} Includes certified mountain driver, toll taxes, fuel, and customized hill road stops. 24x7 bookings: +91 75058 00684.`;

  return {
    title,
    description,
    keywords: [
      pkg.title,
      `${pkg.title} cost`,
      `${pkg.title} cab booking`,
      'Uttarakhand private car tour',
      'Dhanora Cab Service packages',
    ],
    alternates: {
      canonical: `/packages/${slug}`,
    },
    openGraph: {
      title,
      description: pkg.description,
      url: `https://www.dhanoracabs.com/packages/${slug}`,
      images: ['/images/logo.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: pkg.description,
      images: ['/images/logo.jpg'],
    },
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const pkg = TOUR_PACKAGES.find((p) => p.id === slug);

  if (!pkg) {
    notFound();
  }

  // Sample structured daily itineraries for the packages
  const getDailyItinerary = (id: string) => {
    switch (id) {
      case 'chardham-full':
        return [
          { day: 'Day 1', title: 'Dehradun to Barkot / Yamunotri Base', desc: 'Pickup from Dehradun ISBT or Jolly Grant Airport. Scenic road drive via Mussoorie and Kempty Falls to Barkot (215 km / 7 hrs).' },
          { day: 'Day 2', title: 'Yamunotri Dham Darshan & Return Barkot', desc: 'Drive to Janki Chatti. 6 km pony/trek to holy Yamunotri shrine, thermal bath in Surya Kund, and return to Barkot hotel.' },
          { day: 'Day 3', title: 'Barkot to Uttarkashi (Kashi Vishwanath)', desc: 'Drive alongside the Bhagirathi river to Uttarkashi. Evening visit to ancient Kashi Vishwanath temple and Ganga Aarti.' },
          { day: 'Day 4', title: 'Uttarkashi to Gangotri Dham & Back', desc: 'Early morning drive to Gangotri (100 km). Holy dip in Bhagirathi river, temple darshan, and explore Harsil valley.' },
          { day: 'Day 5', title: 'Uttarkashi to Guptkashi / Sitapur', desc: 'Long scenic drive to the Mandakini valley via Tehri dam bypass and Tilwara to base camps at Guptkashi/Sonprayag.' },
          { day: 'Day 6', title: 'Kedarnath Trek & Divine Darshan', desc: 'Transfer to Gaurikund. Trek / helicopter to Kedarnath Ji. Evening Shiva temple Aarti surrounded by snow-covered peaks.' },
          { day: 'Day 7', title: 'Kedarnath Return to Guptkashi / Chopta', desc: 'Morning darshan, trek down to Gaurikund where your chauffeur awaits. Relaxing night halt at Guptkashi or Chopta.' },
          { day: 'Day 8', title: 'Guptkashi to Badrinath Dham via Joshimath', desc: 'Drive through beautiful Chopta pine forests, Mandal valley, and Joshimath to reach holy Badrinath Ji (190 km).' },
          { day: 'Day 9', title: 'Badrinath Darshan, Mana Village to Rudraprayag', desc: 'Morning Tapt Kund bath & Badrivishal darshan. Visit India’s first village Mana, Vyas Gufa, then drive to Rudraprayag confluence.' },
          { day: 'Day 10', title: 'Rudraprayag to Rishikesh & Dehradun Drop', desc: 'Return drive along the Alaknanda corridor via Devprayag Sangam. Drop at Dehradun Railway Station or Airport with divine blessings.' },
        ];
      case 'do-dham-kedar-badri':
        return [
          { day: 'Day 1', title: 'Dehradun to Guptkashi / Phata', desc: 'Early morning mountain transit via Rishikesh, Devprayag Sangam and Rudraprayag along the Mandakini river.' },
          { day: 'Day 2', title: 'Guptkashi to Kedarnath Shrine', desc: 'Early transfer to Sonprayag/Gaurikund. Trek or helipad transfer to Kedarnath. Witness the majestic evening Aarti.' },
          { day: 'Day 3', title: 'Kedarnath Darshan & Night at Chopta', desc: 'Morning temple worship, descend to Gaurikund, and drive through the Swiss-like alpine meadows of Chopta.' },
          { day: 'Day 4', title: 'Chopta to Badrinath Dham', desc: 'Ascend to Badrinath via Joshimath. Check-in to hotel and attend the sacred evening Vishnu Aarti.' },
          { day: 'Day 5', title: 'Badrinath Darshan, Mana Village to Srinagar (Garhwal)', desc: 'Temple darshan, visit Bhim Pul and Saraswati river origin at Mana village. Afternoon drive to Srinagar Garhwal.' },
          { day: 'Day 6', title: 'Srinagar to Dehradun via Rishikesh', desc: 'Return journey with stoppage at Ram Jhula & Laxman Jhula, Rishikesh. Safe doorstep drop-off in Dehradun.' },
        ];
      default:
        return [
          { day: 'Day 1', title: 'Dehradun to Destination & Local Sightseeing', desc: 'Doorstep pickup from Dehradun in your sanitized AC cab. Check-in and scenic exploration of prime viewpoints.' },
          { day: 'Day 2', title: 'Nature Walks, Adventure & Cultural Trails', desc: 'Full day sightseeing with dedicated chauffeur on standby. Sunset panoramic view and local market visit.' },
          { day: 'Day 3', title: 'Return Road Journey to Dehradun', desc: 'Morning leisurely breakfast, souvenir shopping, and smooth return transit to your home, station or airport in Dehradun.' },
        ];
    }
  };

  const itinerary = getDailyItinerary(pkg.id);

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#14263D] flex flex-col antialiased">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tour Packages', url: '/packages' },
          { name: pkg.title, url: `/packages/${pkg.id}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TouristTrip',
            name: pkg.title,
            description: pkg.description,
            touristType: ['Pilgrims', 'Families', 'Adventure Travelers'],
            offers: {
              '@type': 'Offer',
              description: `Tour package booking for ${pkg.title} on request`,
              availability: 'https://schema.org/InStock',
              seller: {
                '@type': 'LocalBusiness',
                name: 'Dhanora Cab Service',
                telephone: '+91 75058 00684',
                url: 'https://www.dhanoracabs.com',
              },
            },
          }),
        }}
      />
      <Header />

      <main className="flex-grow">
        {/* Breadcrumb Header */}
        <section className="bg-gradient-to-b from-[#EAF1F7] via-[#F3F6F9] to-[#F8F7F2] pt-8 pb-10 px-4 border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto space-y-4">
            <nav className="flex items-center gap-2 text-xs text-[#62758F]">
              <Link href="/" className="hover:text-[#14263D]">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/packages" className="hover:text-[#14263D]">Packages</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#14263D] font-bold truncate">{pkg.title}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                {pkg.badge && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#FEF8E7] text-[#B48505] border border-[#F5BE19]/40 uppercase tracking-wide">
                    {pkg.badge}
                  </span>
                )}
                <h1 className="font-display font-black text-2xl sm:text-4xl text-[#14263D] tracking-tight">
                  {pkg.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#4B5E76]">
                  <span className="flex items-center gap-1 font-semibold text-[#14263D]">
                    <Clock className="w-4 h-4 text-[#F5BE19]" />
                    {pkg.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-[#15803D]" />
                    Season: {pkg.season}
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
                    Verified Mountain Driver
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#CBD5E1] shadow-card text-right shrink-0">
                <span className="text-[10px] text-[#62758F] uppercase font-bold block">Tour Package Tariff</span>
                <span className="font-display font-bold text-xl sm:text-2xl text-[#14263D]">
                  On Request
                </span>
                <span className="text-[11px] text-[#15803D] font-bold block">Call / WhatsApp for Custom Quote</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout */}
        <section className="py-10 px-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Itinerary & Inclusions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-4">
              <h2 className="font-display font-black text-lg text-[#14263D]">Tour Overview</h2>
              <p className="text-sm text-[#4B5E76] leading-relaxed">{pkg.description}</p>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-[#62758F] uppercase tracking-wider block">Key Highlights:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-[#14263D]">
                    <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                    <span>Doorstep Pickup & Drop across Dehradun</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#14263D]">
                    <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                    <span>Experienced Hill Drivers with 10+ yrs Garhwal terrain</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#14263D]">
                    <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                    <span>Sanitized, Well-Maintained Commercial Vehicles</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#14263D]">
                    <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                    <span>Emergency Oxygen Cylinder Assistance on high altitude</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Day-by-Day Itinerary */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-6">
              <h2 className="font-display font-black text-lg text-[#14263D] flex items-center justify-between">
                <span>Detailed Day-by-Day Road Itinerary</span>
                <span className="text-xs font-normal text-[#62758F]">{itinerary.length} Days</span>
              </h2>

              <div className="relative border-l-2 border-[#CBD5E1] ml-3 space-y-6 pl-5">
                {itinerary.map((dayItem, idx) => (
                  <div key={idx} className="relative space-y-1">
                    {/* Circle marker */}
                    <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-[#F5BE19] border-2 border-white shadow-xs" />
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#14263D] text-[#F5BE19] uppercase">
                        {dayItem.day}
                      </span>
                      <h3 className="font-bold text-sm text-[#14263D]">{dayItem.title}</h3>
                    </div>
                    <p className="text-xs text-[#4B5E76] leading-relaxed pt-0.5">{dayItem.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions and Exclusions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-[#86EFAC] p-5 shadow-card space-y-3">
                <h3 className="font-bold text-sm text-[#15803D] flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>What is Included</span>
                </h3>
                <ul className="space-y-2 text-xs text-[#334155]">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#15803D] mt-0.5 shrink-0" />
                    <span>Dedicated AC cab for entire duration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#15803D] mt-0.5 shrink-0" />
                    <span>Driver allowance, night charges & meals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#15803D] mt-0.5 shrink-0" />
                    <span>Toll taxes, state boundary permits & green cess</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#15803D] mt-0.5 shrink-0" />
                    <span>Fuel charges for scheduled itinerary</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-card space-y-3">
                <h3 className="font-bold text-sm text-[#62758F] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#B91C1C]" />
                  <span>What is Excluded</span>
                </h3>
                <ul className="space-y-2 text-xs text-[#4B5E76]">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Hotel accommodations (available on request)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Temple VIP darshan tickets or priest fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Helicopter tickets, pony/mule/doli charges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Personal expenses, laundry, and meals</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Fleet Tariff Matrix & Booking Inquiry */}
          <div className="space-y-6">
            <div id="book" className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-4 sticky top-20">
              <h3 className="font-display font-black text-lg text-[#14263D]">
                Select Vehicle for This Tour
              </h3>
              <p className="text-xs text-[#62758F]">
                Transparent total package pricing for the entire {pkg.duration}:
              </p>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl border-2 border-[#F5BE19] bg-[#FEF8E7] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#14263D]">Sedan (Dzire / Etios)</div>
                    <div className="text-[10px] text-[#62758F]">Max 4 Passengers + 3 Bags</div>
                  </div>
                  <div className="font-bold text-xs text-[#14263D]">
                    On Request
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-[#CBD5E1] bg-white hover:border-[#F5BE19] flex items-center justify-between text-xs transition-colors">
                  <div>
                    <div className="font-bold text-[#14263D]">Mountain SUV (Innova Crysta)</div>
                    <div className="text-[10px] text-[#62758F]">Max 6 Passengers + 5 Bags</div>
                  </div>
                  <div className="font-bold text-xs text-[#14263D]">
                    On Request
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-[#CBD5E1] bg-white hover:border-[#F5BE19] flex items-center justify-between text-xs transition-colors">
                  <div>
                    <div className="font-bold text-[#14263D]">Tempo Traveller (12 Seater)</div>
                    <div className="text-[10px] text-[#62758F]">Max 12 Passengers + Pushback</div>
                  </div>
                  <div className="font-bold text-xs text-[#14263D]">
                    On Request
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] space-y-3">
                <a
                  href={`https://wa.me/917505800684?text=Hi%20Dhanora%20Cab,%20I%20am%20interested%20in%20booking%20${encodeURIComponent(
                    pkg.title,
                  )}%20(${pkg.duration}).%20Please%20share%20driver%20details%20and%20exact%20dates.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Reserve via WhatsApp</span>
                </a>

                <a
                  href={BRAND_TOKENS.phoneCallUrl}
                  className="w-full py-3 rounded-xl bg-[#F5BE19] hover:bg-[#DFAC13] text-[#14263D] font-black text-xs uppercase tracking-wider shadow-button-yellow flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Desk: {BRAND_TOKENS.phonePrimary}</span>
                </a>
              </div>

              <div className="text-[10px] text-center text-[#62758F] flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Zero advance deposit needed to lock initial date query</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingMobileBar />
    </div>
  );
}
