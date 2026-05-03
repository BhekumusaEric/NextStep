/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6D5DF6',
        coral: '#FF6B6B',
        mint: '#4ECDC4',
        gold: '#FFC857',
        bg: '#000000',
        card: '#0F0F0F',
        cardAlt: '#161616',
        border: '#2F2F2F',
        textPrimary: '#E7E9EA',
        textSecondary: '#71767B',
        textMuted: '#3E4144',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
