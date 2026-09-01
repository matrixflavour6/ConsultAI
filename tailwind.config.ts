import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1F2A24",       // deep moss-ink, primary text/dark surfaces
        paper: "#F6F3EC",     // warm parchment background
        moss: "#3F5D46",      // primary brand green
        clay: "#B5673A",      // warm accent for actions/highlights
        line: "#D9D2C1",      // hairline borders on paper
        slate: "#5C6660",     // secondary text
      },
      fontFamily: {
        serif: ["'Source Serif 4'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "3px",
        md: "5px",
      },
    },
  },
  plugins: [],
};
export default config;
