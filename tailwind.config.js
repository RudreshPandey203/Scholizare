/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
        'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors:{
        primary:"#F3ECFC",
        secondary:"#D5AEFF",
        bg:"#9A62D7",
      },
      fontFamily: {

        jacques: "Jacques Francois, serif",
        lalezar: "Lalezar, system-ui",
      },
    },
  },
  plugins: [],
}