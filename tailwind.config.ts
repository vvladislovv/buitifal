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
        primary: {
          50: "#fff0f5",
          100: "#ffe0eb",
          200: "#ffc7d9",
          300: "#ff9fbf",
          400: "#ff66a0",
          500: "#ff3380",
          600: "#ff0066",
          700: "#e6005c",
          800: "#cc0052",
          900: "#b30047",
          950: "#800033",
        },
        accent: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d5ff",
          300: "#a4b8ff",
          400: "#7a8fff",
          500: "#5c6eff",
          600: "#4a4eff",
          700: "#3d3dff",
          800: "#3333e6",
          900: "#2e2eb8",
          950: "#1a1a66",
        },
        neon: {
          pink: "#ff00ff",
          cyan: "#00ffff",
          yellow: "#ffff00",
          green: "#00ff00",
          purple: "#9d00ff",
        },
        dark: {
          50: "#f5f5f5",
          100: "#e5e5e5",
          200: "#d4d4d4",
          300: "#a3a3a3",
          400: "#737373",
          500: "#525252",
          600: "#404040",
          700: "#2a2a2a",
          800: "#1a1a1a",
          900: "#0f0f0f",
          950: "#000000",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "bounce-slow": "bounce 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

