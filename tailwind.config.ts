import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        mono: ["var(--font-roboto-mono)"],
        pressStart: ["var(--press-start)"],
      },
      colors: {
        main: "#11A37F",
        highlight: "#FCD34D",
      },
      fontSize: {
        xxs: "0.625rem", // 10px,
        md: "0.9375rem", // 15px, between text-sm (14px) and text-base (16px)
      },
    },
  },
  plugins: [],
};
export default config;
