/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        noto: "Noto Sans",
      },
      backgroundImage: {
        mainBackground: "url('/assets/background.jpg')",
      },
    },
  },
  plugins: [],
};
