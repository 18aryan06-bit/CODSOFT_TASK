/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { brand: { 50: "#fff7ed", 100: "#ffedd5", 500: "#f97316", 600: "#ea580c", 700: "#c2410c" } },
      boxShadow: { soft: "0 16px 50px rgba(0, 0, 0, 0.28)" }
    },
  },
  plugins: [],
};
