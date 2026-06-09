import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "jolly-navy": {
          DEFAULT: "#1B3664",
          dark: "#122347",
          light: "#2A4F8F",
        },
        "jolly-yellow": {
          DEFAULT: "#FFC200",
          dark: "#E6A800",
          light: "#FFD84D",
        },
      },
      fontFamily: {
        heading: ["var(--font-prompt)", "sans-serif"],
        body: ["var(--font-sarabun)", "sans-serif"],
        sans: ["var(--font-sarabun)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
