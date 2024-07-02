/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      colors: {
        'background-black': '#121212',
      },
    },
  },

  plugins: [],
};

module.exports = config;
