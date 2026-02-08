import colors from 'tailwindcss/colors';
import forms from '@tailwindcss/forms';

export default {
  // content: [ ... ]  <-- keep your existing content paths here
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { colors },
  },
  plugins: [forms],
};