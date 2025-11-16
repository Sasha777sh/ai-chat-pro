import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'edem-dark': '#0C0C0E',
        'edem-surface': '#1A1A1D',
        'edem-secondary-bg': '#111113',
        'edem-line': '#27272A',
        'edem-main': '#F1F1F2',
        'edem-secondary': '#DCDCDC',
        'edem-muted': '#7A7A7A',
        'edem-sage': '#C1934E',
        'edem-shadow': '#C95B5B',
        'edem-live': '#4EAEC1',
        'edem-child': '#A0D17A',
        'edem-mirror': '#B6A8FF',
      },
      boxShadow: {
        'edem-glow': '0 0 20px rgba(255,255,255,0.08)',
        'edem-glow-strong': '0 0 25px rgba(255,255,255,0.12)',
        'edem-inner': 'inset 0 0 10px rgba(0,0,0,0.4)',
        'edem-text-glow': '0 0 12px rgba(255,255,255,0.06)',
      },
      textShadow: {
        'edem-glow': '0 0 12px rgba(255,255,255,0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
