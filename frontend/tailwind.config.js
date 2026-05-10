/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1463ff',
          orange: '#ff6b35',
          ink: '#101828'
        }
      },
      boxShadow: {
        soft: '0 18px 50px rgba(16, 24, 40, 0.12)'
      }
    }
  },
  plugins: []
};
