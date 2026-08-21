import type { Config } from "tailwindcss";

/** Exact palette sampled from Brewed Coffee House mockup */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        marble: {
          DEFAULT: "#EBE4D9",
          light: "#F3EDE4",
          warm: "#E5DDD0",
        },
        tan: {
          DEFAULT: "#D9C4A3",
          light: "#E5D4B8",
          dark: "#C9B08E",
        },
        sage: {
          DEFAULT: "#A3B18A",
          light: "#B5C4A0",
          medium: "#95A67F",
          deep: "#8A9A75",
        },
        rose: {
          DEFAULT: "#D4A99A",
          light: "#EBD5CF",
          pink: "#E8C8BE",
          circle: "#DFB8B0",
        },
        cream: {
          DEFAULT: "#FAF6F0",
          dark: "#F0EBE3",
          card: "#F5EFE6",
        },
        coffee: {
          DEFAULT: "#3E2723",
          light: "#5C4A42",
          muted: "#8B7355",
        },
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E8D48B",
        },
        linen: {
          DEFAULT: "#E0D5C8",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px rgba(62, 39, 35, 0.06)",
        modal: "0 20px 56px rgba(62, 39, 35, 0.12)",
        glass: "0 8px 28px rgba(62, 39, 35, 0.05)",
        float: "0 6px 24px rgba(62, 39, 35, 0.08)",
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
