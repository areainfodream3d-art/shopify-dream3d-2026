/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00d4ff',
        'neon-green': '#00ff88',
        'neon-electric': '#0080ff',
        'neon-orange': '#FF8C00', // Arancione Neon
        'neon-amber': '#FFBF00',  // Ambra Neon (per sfumature)
        'neon-fire': '#FF4500',   // Rosso Fuoco Neon (per accenti forti)
        'dark-bg': '#050505',     // Sfondo ancora più scuro per risaltare l'arancione
        'dark-surface': '#121212',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 10px rgba(255, 140, 0, 0.5)' },
          '100%': { textShadow: '0 0 20px rgba(255, 140, 0, 1), 0 0 30px rgba(255, 69, 0, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
