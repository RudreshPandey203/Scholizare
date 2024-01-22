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
        primary:"#367CFF",
        secondary:"#F0F5FF",
        bg:"#9A62D7",
      },
      fontFamily: {
        jacques: "Jacques Francois, serif",
        lalezar: "Lalezar, system-ui",
      },
      dropShadow: {
        '3xl': '4px 3px 10px #E8E8E8',
        '2xl': '0px 0px 5px #E8E8E8'
      },
      animation: {
        shine: "shine 1s",
      },
      keyframes: {
        shine: {
          "100%": { left: "125%" },
        },
      },
    },
  },
  plugins: [],
}
