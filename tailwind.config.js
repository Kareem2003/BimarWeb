/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      primary: "#16423C",
      test:"#6A9C89",
      secondary: "#C4DAD2",
      tertiary: "#FD9B63",
      background: "#E9EFEC",
      textColor: "#2E354C",
      white: "#fff",
      black: "#000",
      red: "#f00",
    },
    extend: {
      animation: {
        "slide-in": "slideIn 0.5s ease-out",
      },
      keyframes: {
        slideIn: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
      },
    },
  },
  plugins: [],
};
