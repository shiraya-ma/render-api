'use strict';
import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: [
    'class',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#3aa698",
              foreground: "#fff",
            }
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#3aa698",
              foreground: "#fff",
            },
            background: '#1F2937'
          },
        },
      },
  })
  ],
};

module.exports = config;
