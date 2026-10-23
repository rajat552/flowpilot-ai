/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mlh: {
          canvas: '#F8FAFC',
          paper: '#FFFFFF',
          ink: '#0F172A',
          blue: '#0052CC',
          'blue-hover': '#0043A8',
          yellow: '#F59E0B',
          'yellow-light': '#FCD34D',
          amber: '#D97706',
          red: '#DC2626',
          green: '#10B981',
          slate: '#334155',
          subtle: '#64748B',
          border: '#0F172A',
        },
        dark: {
          bg: '#090d16',
          card: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
          subtle: '#475569',
        },
        brand: {
          cyan: '#0284c7',
          teal: '#0d9488',
          indigo: '#4f46e5',
          purple: '#7c3aed',
          emerald: '#059669',
          rose: '#e11d48',
          amber: '#d97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"Space Mono"', '"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        retro: '4px 4px 0px #0F172A',
        'retro-sm': '2px 2px 0px #0F172A',
        'retro-lg': '6px 6px 0px #0F172A',
        'retro-xl': '8px 8px 0px #0F172A',
        'retro-amber': '4px 4px 0px #B45309',
        'retro-blue': '4px 4px 0px #003B94',
        'retro-green': '4px 4px 0px #047857',
        'retro-red': '4px 4px 0px #991B1B',
      },
    },
  },
  plugins: [],
};
