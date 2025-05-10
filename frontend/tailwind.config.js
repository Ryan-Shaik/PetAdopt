/** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: '#0D9488',    // Teal
//         secondary: '#F59E0B',  // Orange
//         background: '#F3F4F6', // Light Gray
//         text: '#1F2937',       // Dark Gray
//         'light-gray': '#F3F4F6',
//         'dark-gray': '#1F2937',
//       },
//       fontFamily: {
//         sans: ['Inter', 'sans-serif'],
//         serif: ['Merriweather', 'serif'],
//       },
//       fontSize: {
//         'xs': '12px',
//         'sm': '14px',
//         'base': '16px',
//         'lg': '18px',
//         'xl': '24px',
//         '2xl': '30px',
//       }
//     },
//   },
//   plugins: [],
// }
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
      },
    },
  },
  plugins: [],
};