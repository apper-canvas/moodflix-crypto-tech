/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E50914',
        secondary: '#221F1F',
        accent: '#F5F5F1',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        background: '#000000',
        card: '#141414',
        success: '#46D369',
        warning: '#F9D71C',
        error: '#D32F2F',
        info: '#0080FF'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Bebas Neue', 'Inter', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      aspectRatio: {
        'poster': '3/4'
      },
      boxShadow: {
        'movie-card': '0 4px 12px rgba(0, 0, 0, 0.3)',
        'movie-card-hover': '0 8px 24px rgba(229, 9, 20, 0.3)'
      }
    },
  },
  plugins: [],
}