/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'], // Important: Paths to your components
  important: '#root',
  theme: {
    extend: {
      colors: {
        navbar: '#262D38',
        primary: '#009966',
        secondary: 'hsl(0, 5.70%, 89.60%)',
        'primary-light': 'hsl(160, 75%, 50%)',
        'active-link': '#FF6B6B',
        'button-bg': '#009966',
        'button-hover-bg': '#FF6B6B',
        'text-highlight': 'hsl(160, 100%, 30%)',
        'text-sub': 'hsl(223, 7%, 18%)',
        'base-black': 'hsl(216, 15%, 9%)',
        'base-white': 'hsl(0, 0%, 100%)',
      },
      spacing: {},
      height: {
        'main-body': 'calc(100vh - 64px)',
      },
    },
  },
  plugins: [],
};
