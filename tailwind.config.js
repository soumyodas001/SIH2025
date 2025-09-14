/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./**/*.{html,js}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "caramellatte"],
  },
}