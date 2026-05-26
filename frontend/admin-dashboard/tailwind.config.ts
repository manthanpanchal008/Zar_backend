import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        zar: {
          gold: "#D0B480",
          black: "#000000",
          title: "#A38274",
          muted: "#666666",
          bg: "#F8F6F2",
        },
      },
      boxShadow: {
        panel: "0 6px 22px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
