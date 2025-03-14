/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    theme: {
      extend: {
        colors: {
          primary: '#3b82f6',
          secondary: '#64748b',
          success: '#22c55e',
          warning: '#f59e0b',
          danger: '#ef4444'
        }
      }
    },
    plugins: []
  };