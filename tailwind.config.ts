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
        turquoise: {
          50: "#e8f5f6",
          100: "#c5e8eb",
          200: "#9fd9de",
          300: "#79c9d1",
          400: "#5cbdc7",
          500: "#3fb1bd",
          600: "#369aa6",
          700: "#2d7f89",
          800: "#24656d",
          900: "#1a4a50",
          950: "#0f2e32",
        },
      },
    },
  },
  plugins: [],
};
export default config;

