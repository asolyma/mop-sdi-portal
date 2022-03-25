module.exports = {
  mode: "jit",
  // These paths are just examples, customize them to match your project structure

  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "hero-pattern": "url('/background.png')",
      },
      fontFamily: {
        Poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  variants: {
    // ...
    scrollbar: ["dark"],
    scrollbar: ["rounded"],
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar-hide"),
    require("tailwind-scrollbar"),
  ],
};
