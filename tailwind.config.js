/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Unbounded', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        noir: {
          base: '#07070b',
          surface: '#0d0d18',
          card: '#13131f',
          'card-hover': '#1a1a2e',
          border: 'rgba(255,255,255,0.06)',
        },
        neon: {
          cyan: '#00f4ff',
          fuchsia: '#d946ef',
        },
      },
      animation: {
        'gradient-drift': 'gradient-drift 20s ease infinite',
        'fade-up': 'fade-up 0.8s ease-out forwards',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'gradient-drift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
