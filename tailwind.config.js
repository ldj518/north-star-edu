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
          950: '#020617',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
        neon: {
          blue: '#3b82f6',
          purple: '#8b5cf6',
          pink: '#ec4899',
          yellow: '#eab308',
          green: '#22c55e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      // 移动端优化
      screens: {
        'xs': '375px',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
}