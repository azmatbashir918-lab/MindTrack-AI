/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#00E5FF',
        'secondary': '#7C4DFF',
        'success': '#00C853',
        'warning': '#FFD600',
        'danger': '#FF1744',
        'dark-bg': '#0A0F1C',
        'dark-card': '#111729',
        'dark-border': '#1A1F35',
      },
      backgroundColor: {
        'dark': '#0A0F1C',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00E5FF 0%, #7C4DFF 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0A0F1C 0%, #111729 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
