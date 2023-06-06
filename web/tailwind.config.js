const colors = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */
module.exports = {
     content: [
          "./app/**/*.{js,ts,jsx,tsx}",
          "./pages/**/*.{js,ts,jsx,tsx}",
          "./components/**/*.{js,ts,jsx,tsx}",
          // Or if using `src` directory:
          "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
          colors: {
               ...colors,
               black: "#080c17",
               white: "#f2fAf2",
               transparent: "transparent",
               current: "currentColor",
          },
          fontFamily: {
               whitney: ["whitney", "sans-serif"],
          },
          extend: {
               fontFamily: {
                    poppins: ["var(--font-poppins)"],
                    whitney: ["var(--font-whitney)"],
                    ginto: ["var(--font-ginto)"],
               },
               colors: {
                    blue: {
                         900: "#181444",
                         1000: "#080c17",
                    },
               },
          },
     },
     plugins: [],
};
