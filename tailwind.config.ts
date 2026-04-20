import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo"],
      },
      colors: {
        ink: {
          50: "#f7f7f6",
          100: "#ececea",
          200: "#d6d6d2",
          300: "#b2b2ac",
          400: "#8a8a82",
          500: "#6a6a62",
          600: "#52524c",
          700: "#3f3f3a",
          800: "#2a2a27",
          900: "#1a1a18",
          950: "#0f0f0e",
        },
        parchment: {
          50: "#fbf9f4",
          100: "#f5f1e7",
          200: "#ebe3cf",
          300: "#ddd1ae",
        },
        sludge: {
          red: "#b4322c",
          amber: "#c9861f",
          indigo: "#3b4a79",
          teal: "#2f6b68",
          plum: "#6b2f5c",
          slate: "#445065",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scan": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "scan": "scan 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
