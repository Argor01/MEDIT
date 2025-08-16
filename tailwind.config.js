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
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#fdf2f8',
          500: '#ec4899',
          600: '#db2777',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-organ': 'pulse-organ 2s ease-in-out infinite',
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
      },
    },
  },
  plugins: [],
}