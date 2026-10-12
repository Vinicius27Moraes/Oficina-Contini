import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#0D1114",
          900: "#12171B",
          800: "#1B2227",
          700: "#262F35",
          600: "#37424A",
          500: "#4C5860",
        },
        steel: {
          400: "#7C93A6",
          300: "#9FB3C2",
        },
        amber: {
          500: "#FFB020",
          400: "#FFC24D",
          950: "#3D2A00",
        },
        paper: "#F4F5F3",
        ink: "#12171B",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "10px",
      },
    },
  },
  plugins: [],
};
export default config;
