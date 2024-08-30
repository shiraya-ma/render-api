'use strict';
import { nextui } from "@nextui-org/react";

const themeColor = {
  primary: {
    50:  "#ddefed",
    100: "#aad8d2",
    200: "#73bfb5",
    300: "#3aa698",
    400: "#009383",
    500: "#00816f",
    600: "#007563",
    700: "#006655",
    800: "#005647",
    900: "#003b2c",
    DEFUALT: "#3aa698",
    foreground: '#fff'
  }
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    nextui({
      extend: {
        theme: {
          dark: {
            colors: themeColor
          },
          light: {
            colors: themeColor
          }
        }
      }
    })
  ],
};
