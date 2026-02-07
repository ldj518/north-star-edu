/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#020617', // Main bg
          900: '#0f172a', // Card bg
          800: '#1e293b', // Lighter card
          700: '#334155', // Hover states (Adding this was missing!)
          600: '#475569',
        },
        neon: {
          blue: '#3b82f6',
          purple: '#8b5cf6',
          pink: '#ec4899',
          yellow: '#eab308', // Gold/Star
          green: '#22c55e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'monospace'], // For code/stats
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}