const colors = require("tailwindcss/colors");
const { fontFamily } = require("tailwindcss/defaultTheme");
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
               black: "#23272A",
               white: "#FFFFFF",
               transparent: "transparent",
               current: "currentColor",
               blue: {
                    DEFAULT: "#7289DA",
               },
               red: {
                    DEFAULT: "#ED4245",
               },
               green: {
                    400: "#3BA55C",
                    DEFAULT: "#3BA55C",
               },
          },
          fontFamily: {
               whitney: ["whitney", "sans-serif"],
          },
          extend: {
               fontFamily: {
                    poppins: ["var(--font-poppins)"],
                    whitney: ["var(--font-whitney)"],
                    ginto: ["var(--font-ginto)"],
                    sans: ["var(--font-whitney)", ...fontFamily.sans],
               },
               gray: {
                    200: "#80848e",
                    300: "#36373d",
                    400: "#40444b",
                    500: "#2b2d31",
                    600: "#292b2f",
                    700: "#202225",
                    800: "#1e1f22",
               },
               colors: {
                    blue: {
                         900: "#7289DA",
                         1000: "#080c17",
                    },
               },
          },
     },
     plugins: [],
};
