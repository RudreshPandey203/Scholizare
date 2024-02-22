/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors:{
        primary:"#367CFF",
        secondary:"#F0F5FF",
        bg:"#9A62D7",
      },
      fontFamily: {
        jacques: "Jacques Francois, serif",
        lalezar: "Lalezar, system-ui",
        merriweather: "Merriweather, serif",
      },
      dropShadow: {
        '3xl': '4px 3px 10px #E8E8E8',
        '2xl': '0px 0px 5px #E8E8E8'
      },
      animation: {
        shine: "shine 1s",
      },
      backgroundImage: {
        gradient:
          "linear-gradient(145.37deg, rgba(255, 255, 255, 0.09) -8.75%, rgba(255, 255, 255, 0.027) 83.95%)",
        gradientHover:
          "linear-gradient(145.37deg, rgba(255, 255, 255, 0.1) -8.75%, rgba(255, 255, 255, 0.057) 83.95%)",
        shine:
          "linear-gradient(45deg, rgba(255,255,255,0) 45%,rgba(255,255,255,1) 50%,rgba(255,255,255,0) 55%,rgba(255,255,255,0) 100%)",
      },

      keyframes: {
        shinee: {
          "0%": { backgroundPosition: "-80%" },
          "100%": { backgroundPosition: "80%" },
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        dash: {
          "0%": { strokeDashoffset: 1000 },
          "100%": { strokeDashoffset: 0 },
        },
      },
    },
  },
  plugins: [],
}
