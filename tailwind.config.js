/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",   
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        // Admin accent — amber
        admin: {
          DEFAULT: "#f59e0b",
          light:   "#fbbf24",
          glow:    "rgba(245,158,11,0.15)",
        },
        // Faculty accent — blue
        faculty: {
          DEFAULT: "#3b82f6",
          light:   "#60a5fa",
          glow:    "rgba(59,130,246,0.15)",
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-40": "40px 40px",
      },
    },
  },
  plugins: [],
};