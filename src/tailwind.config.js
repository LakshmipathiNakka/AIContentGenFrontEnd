// tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{html,js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          light: "#f0f4f8",
          dark: "#2d2d2d",
        },
        boxShadow: {
          "3d": "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    plugins: [],
  };
  