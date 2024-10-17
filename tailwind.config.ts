import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#38bdf8', // sky-400
          DEFAULT: '#0ea5e9', // sky-600
          dark: '#0284c7', // sky-700
        },
        secondary: {
          light: '#3b82f6', // blue-400
          DEFAULT: '#2563eb', // blue-500
          dark: '#1d4ed8', // blue-600
        },
        background: '#D3D3D3'
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
