/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0d1117',
          800: '#161b22',
          700: '#1c2333',
          600: '#21262d',
          500: '#30363d',
        },
        teal: {
          400: '#2ea8a0',
          500: '#1a9590',
          600: '#158078',
        },
        accent: '#f4c542',
      },
      fontFamily: {
        sans: ['var(--font-main)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
      },
    },
  },
  plugins: [],
}
