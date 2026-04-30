import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8F0",
        cherry: "#C83E4D",
        rosefog: "#F4D8D8",
        ink: "#2B2523",
        cocoa: "#725747"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(96, 54, 43, 0.12)"
      }
    },
  },
  plugins: [],
};

export default config;
