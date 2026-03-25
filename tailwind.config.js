/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
            colors: {
        primary: "#AAFF34",      // green
        secondary: "#43347E",    // dark violet
        accent: "#A0B1FF",       // light blue
        base: "#000002",         // main black background
        surface: "#F1F4F3",      // light background
        muted: "#9499A4"         // grey text / borders
      },
        fontFamily: {
        primary: ["Azeret Mono", "mono"],
        heading: ["Poppins", "sans-serif"],
        mono: ["Fira Code", "monospace"]
      }

    },
  },
  plugins: [],
}

