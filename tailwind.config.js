/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./src/**/*.{js,jsx,ts,tsx,html}', './public/index.html'],

  content: ['.src/**/*.*.{html, js, ts, tsx, jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
