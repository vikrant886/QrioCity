/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      boxShadow: {
        'cards': 'inset 18px 18px 54px #bebebe,inset -18px -18px 54px #ffffff',
        'darkcards' : 'inset 10px 10px 22px #101010,inset -10px -10px 22px #262626',
      },
      backgroundImage: {
        'gr': 'linear-gradient(145deg, #181818, #1d1d1d)',
      },
      colors:{
        'whitetext':'#9c9c9c',
        'first': '#1e1f22',
        'second': '#2b2d31',
        'third': '#313338',
        'primary': 'hsl(0 0% 100% / 0.1)',
      }
      ,
      keyframes:{
        dots:{
          '0%':{backgroundSize:'0% 100%'},
          '100%':{backgroundSize:'100% 100%'},
        },
        fill:{
          '0%':{backgroundSize:'0% 100%'},
          '100%':{backgroundSize:'100% 100%'},
        }
      },
      animation:{
        dotss:"dots infinite 1s ease-in",
        slidee: "fill infinite 4s ease-in",
      }
    },
  },
  plugins: [],
}