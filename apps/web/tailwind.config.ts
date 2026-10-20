import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Core travel redesign palette
        travel: {
          bg: '#F8F7F2',         // Main background (warm white / ivory)
          alt: '#EAF1F7',        // Alternate section background (pale mist blue-grey)
          navy: '#14263D',       // Main text & deep navy accents
          slate: '#4B5E76',      // Muted secondary text
          muted: '#62758F',      // Light muted captions
          yellow: '#F5BE19',     // Primary accent (warm golden taxi yellow)
          'yellow-hover': '#DFAC13',
          'yellow-light': '#FEF8E7',
          card: '#FFFFFF',       // Clean white card background
          border: '#E2E8F0',     // Subtle card border
          'border-light': '#EFF3F7',
        },
        brand: {
          // Primary Accent from user spec
          gold: '#F5BE19',
          'gold-hover': '#DFAC13',
          'gold-light': '#FEF8E7',
          'gold-muted': '#FDE68A',
          // Refined deep crimson for emergency & callout actions (no neon/harsh red)
          crimson: '#B91C1C',
          'crimson-hover': '#991B1B',
          'crimson-dark': '#7F1D1D',
          // Forest/Emerald green for WhatsApp & verified trust badges
          emerald: '#15803D',
          'emerald-hover': '#166534',
          'emerald-light': '#DCFCE7',
          // Deep navy
          navy: '#14263D',
          'navy-dark': '#0F1E30',
          'navy-light': '#1E3A5F',
        },
        // Updated daylight-friendly palette replacing harsh darks
        himalaya: {
          950: '#14263D', // Remapped to deep readable navy
          900: '#1E3550',
          850: '#F8F7F2', // Remapped to warm white
          800: '#EAF1F7', // Remapped to pale blue-grey
          750: '#E2E8F0', // Border
          700: '#CBD5E1', // Line border
          600: '#64748B', // Muted text
          500: '#4B5E76', // Secondary text
          400: '#334155', // Body text
          300: '#1E293B', // High contrast text
          200: '#E2E8F0', // Light borders
          100: '#F1F5F9', // Light surface
          50: '#FFFFFF',  // Pure white
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'Sora', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg, rgba(234, 241, 247, 0.4) 0%, rgba(248, 247, 242, 1) 100%)',
        'card-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #FAFCFE 100%)',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(20, 38, 61, 0.05), 0 1px 2px -1px rgba(20, 38, 61, 0.05)',
        'card': '0 4px 20px -2px rgba(20, 38, 61, 0.06), 0 2px 6px -1px rgba(20, 38, 61, 0.03)',
        'card-hover': '0 12px 32px -4px rgba(20, 38, 61, 0.10), 0 4px 12px -2px rgba(20, 38, 61, 0.05)',
        'button-yellow': '0 4px 14px 0 rgba(245, 190, 25, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
