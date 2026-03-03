import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        base: "#12161C",
        panel: "#171C24",
        accent: "#4EA6FF",
        text: "#EAF1FF",
        muted: "#96A0B5"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(78,166,255,0.35), 0 20px 50px rgba(78,166,255,0.12)"
      }
    }
  },
  plugins: []
};

export default config;