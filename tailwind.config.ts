import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        background: '#0A0A0F',
        bg: {
          deep: '#0A0A0F',
          primary: '#0F0F14',
          elevated: '#1A1A22',
          subtle: '#24242E',
          hover: '#2E2E3A',
        },
        // Surfaces
        secondary: '#1A1A22',
        // Textes
        primary: '#F5F5F4',
        muted: '#6B6B7A',
        text: {
          primary: '#F5F5F4',
          secondary: '#A8A8B3',
          muted: '#6B6B7A',
          disabled: '#4A4A55',
        },
        // Or - Palette unifiée
        gold: {
          300: '#E5C478',
          400: '#D4A853',
          500: '#C49545',
          600: '#A67C3A',
          DEFAULT: '#D4A853',
        },
        accent: {
          DEFAULT: '#D4A853',
          emerald: '#34D399',
          rose: '#FB7185',
        },
      },
      fontFamily: {
        display: ['Spectral', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Spectral', 'Georgia', 'serif'],
      },
      keyframes: {
        'breathe': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        'glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '0.9' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
