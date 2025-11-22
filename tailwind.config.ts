import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5CF6',
          dark: '#7C3AED',
        },
        dark: {
          DEFAULT: '#1F2937',
          light: '#374151',
          lighter: '#4B5563',
        },
        background: {
          DEFAULT: '#111827',
          card: '#1F2937',
        }
      },
    },
  },
  plugins: [],
}
export default config
