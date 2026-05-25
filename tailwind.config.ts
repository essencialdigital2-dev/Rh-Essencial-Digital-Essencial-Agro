import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        oliva: { DEFAULT: '#4e5c2d', light: '#6B7C3E', dark: '#3a4520' },
        dourado: { DEFAULT: '#b5893a', light: '#d4a853', soft: '#f5e6c8' },
        bege: { DEFAULT: '#f9f5ef', dark: '#ede8df' },
        cinza: { DEFAULT: '#6b7280', light: '#f3f4f6', dark: '#374151' },
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
}
export default config
