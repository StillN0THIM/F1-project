/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  // Tells Tailwind to scan all JS/JSX files for class names to include
  theme: {
    extend: {
      colors: {
        f1red: "#e8002d",
        surface: "#141414",
        muted: "#a0a0a0",
      },
      fontFamily: {
        display: ["'Barlow Condensed'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
}