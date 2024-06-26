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
      keyframes: {
        'fly-top': {
          '0%': {translate: '0% -100%'}
        },
        'grow-h': {
          '0%': {scale: '100% 0%'}
        }
      },
      animation: {
        'fly-top': 'fly-top 1s cubic-bezier(.12,.94,0,1.02)',
        'grow-h': 'grow-h 0.7s cubic-bezier(.12,.94,0,1.02)'
      }
    },
  },
  plugins: [],
};
export default config;
