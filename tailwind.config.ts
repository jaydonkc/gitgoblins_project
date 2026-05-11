import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        moss: "#3A6B56",
        clay: "#B86F52",
        paper: "#F7F5F0",
      },
      boxShadow: {
        panel: "0 16px 40px rgba(23, 32, 51, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
