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
          DEFAULT: '#8854C0',
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
      fontFamily: {
        sans: ['Source Sans Pro', 'sans-serif'],
      },
      fontSize: {
        'heading': ['32px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '170%', letterSpacing: '0px', fontWeight: '400' }],
        'link': ['12px', { lineHeight: '200%', letterSpacing: '0px' }],
        'button': ['16px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '600' }],
        'social-button': ['14px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '400' }],
      },
      spacing: {
        '13': '13px',
        '363': '363px',
        '385': '385px',
      },
      width: {
        '363': '363px',
        '385': '385px',
      },
      height: {
        '24': '24px',
        '28': '28px',
        '50': '50px',
      },
      borderRadius: {
        '10': '10px',
      },
      gap: {
        '10': '10px',
      },
      transitionDuration: {
        '0': '0ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'ease-out': 'ease-out',
      },
    },
  },
  plugins: [],
}
export default config
