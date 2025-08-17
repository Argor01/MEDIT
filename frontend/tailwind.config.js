/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // Added to support @apply usage in globals.css
        background: '#ffffff',
        foreground: '#111827',
        border: '#e5e7eb',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-organ': 'pulse-organ 2s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '25%': { transform: 'translateY(-8px)' },
          '50%': { transform: 'translateY(-12px)' },
          '75%': { transform: 'translateY(-8px)' },
        },
        'pulse-organ': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' },
          '50%': { boxShadow: '0 0 25px rgba(59, 130, 246, 0.8)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '20%': { transform: 'scale(1.12)' },
          '40%': { transform: 'scale(0.98)' },
          '60%': { transform: 'scale(1.08)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}