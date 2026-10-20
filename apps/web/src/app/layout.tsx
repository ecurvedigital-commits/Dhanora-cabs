import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Sora, Playfair_Display } from 'next/font/google';
import './globals.css';
import { TaxiServiceJsonLd, FAQPageJsonLd } from '../components/JsonLd';
import { WhatsAppChatWidget } from '../components/WhatsAppChatWidget';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.dhanoracabs.com'),
  title: {
    default: 'Dhanora Cab Service | Safe • Comfortable • On Time | Taxi Booking Dehradun',
    template: '%s | Dhanora Cab Service',
  },
  description:
    'Dhanora Cab Service - Premier Uttarakhand & Dehradun taxi service. 24x7 Outstation cabs to Delhi, Mussoorie, Haridwar, Rishikesh, Jolly Grant airport transfers, and Chardham Yatra packages. Call or WhatsApp +91 75058 00684.',
  keywords: [
    'Dhanora Cab Service',
    'Dhanora Cab',
    'Taxi service in Dehradun',
    'Cab booking Dehradun',
    'Dehradun to Delhi taxi',
    'Dehradun to Mussoorie cab',
    'Jolly Grant airport taxi transfer',
    'Chardham Yatra taxi service',
    'Uttarakhand taxi booking',
    'One way cab Dehradun',
    'Innova Crysta hire Dehradun',
  ],
  authors: [{ name: 'Dhanora Cab Service', url: 'https://www.dhanoracabs.com' }],
  creator: 'Dhanora Cab Service',
  publisher: 'Dhanora Cab Service',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Dhanora Cab Service — Safe • Comfortable • On Time',
    description:
      'Premier verified taxi service in Dehradun & Uttarakhand starting at ₹12/km. 24x7 bookings: +91 75058 00684.',
    url: 'https://www.dhanoracabs.com/',
    siteName: 'Dhanora Cab Service',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/logo.jpg',
        width: 800,
        height: 800,
        alt: 'Dhanora Cab Service Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dhanora Cab Service — Premier Uttarakhand Taxi Booking',
    description:
      'Dehradun to Delhi, Mussoorie, Airport transfers, and Chardham Yatra cabs. 24x7 Call/WhatsApp: +91 75058 00684.',
    images: ['/images/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/logo.jpg',
    apple: '/images/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${sora.variable} ${playfair.variable}`}>
      <head>
        <TaxiServiceJsonLd />
        <FAQPageJsonLd />
      </head>
      <body className="bg-[#F8F7F2] text-[#14263D] min-h-screen selection:bg-[#F5BE19] selection:text-[#14263D]">
        {children}
        <WhatsAppChatWidget />
      </body>
    </html>
  );
}
