
import type { Config } from "tailwindcss"

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        min1370: "1370px",
      },
      transitionProperty: {
        "grid-cols": "grid-template-columns",
      },
    },
  },
  plugins: [],
} satisfies Config
