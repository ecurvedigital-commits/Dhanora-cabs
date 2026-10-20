import React from 'react';
import { FAQS } from '@/lib/tokens';

export function TaxiServiceJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    '@id': 'https://www.dhanoracabs.com',
    name: 'Dhanora Cab Service',
    alternateName: 'Dhanora Cab',
    url: 'https://www.dhanoracabs.com',
    logo: 'https://www.dhanoracabs.com/images/logo.jpg',
    image: 'https://www.dhanoracabs.com/images/logo.jpg',
    description:
      'Premier verified taxi service in Dehradun & Uttarakhand with customized transparent quotes. Outstation cabs to Delhi, Mussoorie, Haridwar, Rishikesh, Jolly Grant airport transfers, and Chardham Yatra packages.',
    telephone: '+91 75058 00684',
    email: 'dhanoracab@gmail.com',
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Credit Card, Debit Card, Net Banking',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Haridwar Bypass Road, Opp. Ring Road',
      addressLocality: 'Dehradun',
      addressRegion: 'Uttarakhand',
      postalCode: '248001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 30.3165,
      longitude: 78.0322,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    areaServed: [
      { '@type': 'City', name: 'Dehradun' },
      { '@type': 'City', name: 'Mussoorie' },
      { '@type': 'City', name: 'Rishikesh' },
      { '@type': 'City', name: 'Haridwar' },
      { '@type': 'Place', name: 'Jolly Grant Airport (DED)' },
      { '@type': 'State', name: 'Uttarakhand' },
      { '@type': 'Place', name: 'Kedarnath' },
      { '@type': 'Place', name: 'Badrinath' },
      { '@type': 'City', name: 'Delhi NCR' },
      { '@type': 'City', name: 'Chandigarh' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Uttarakhand Cab & Tour Tariffs',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Dehradun to Mussoorie Mountain Taxi',
            description: 'One-way and round-trip hill climb with experienced mountain drivers',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Jolly Grant Airport (DED) Direct Taxi Transfer',
            description: 'Guaranteed on-time flight arrival pickup with flight delay tracking',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Dehradun to Delhi NCR Outstation Cab',
            description: 'Doorstep pickup to IGI Airport or Delhi NCR via Saharanpur Expressway',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Do Dham & Char Dham Sacred Yatra Taxi',
            description: 'All-inclusive multi-day pilgrimage in Innova Crysta / Tempo Traveller',
          },
        },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '4820',
      reviewCount: '3150',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQPageJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `https://www.dhanoracabs.com${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

