import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
const plugin = require("tailwindcss/plugin");
const config: Config = {
  content: [
    "./src/*.{ts,tsx}",
    "./stories/*.{ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/*.{ts,tsx}",
    "./stories/*.{ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    nextui(),
    require("tailwindcss-react-aria-components"),
    require("tailwindcss-animate"),
  ],
};
export default config;
