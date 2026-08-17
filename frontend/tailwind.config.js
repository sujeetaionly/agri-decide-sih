/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Material 3 Color Tokens from DESIGN.md
        primary: {
          DEFAULT: '#0d631b',
          container: '#2e7d32',
          fixed: '#a3f69c',
          'fixed-dim': '#88d982',
        },
        'on-primary': {
          DEFAULT: '#ffffff',
          container: '#cbffc2',
          fixed: '#002204',
          'fixed-variant': '#005312',
        },
        'inverse-primary': '#88d982',

        secondary: {
          DEFAULT: '#3e6a00',
          container: '#b9f474',
          fixed: '#b9f474',
          'fixed-dim': '#9ed75b',
        },
        'on-secondary': {
          DEFAULT: '#ffffff',
          container: '#437000',
          fixed: '#0f2000',
          'fixed-variant': '#2e4f00',
        },

        tertiary: {
          DEFAULT: '#6d4e45',
          container: '#87665c',
          fixed: '#ffdbd0',
          'fixed-dim': '#e7bdb1',
        },
        'on-tertiary': {
          DEFAULT: '#ffffff',
          container: '#ffede9',
          fixed: '#2c160e',
          'fixed-variant': '#5d4037',
        },

        background: '#f5fced',
        'on-background': '#171d14',

        surface: {
          DEFAULT: '#f5fced',
          dim: '#d5dcce',
          bright: '#f5fced',
          variant: '#dee5d6',
          tint: '#1b6d24',
          'container-lowest': '#ffffff',
          'container-low': '#eff6e7',
          container: '#e9f0e1',
          'container-high': '#e3ebdc',
          'container-highest': '#dee5d6',
        },
        'on-surface': {
          DEFAULT: '#171d14',
          variant: '#40493d',
        },
        'inverse-surface': '#2c3228',
        'inverse-on-surface': '#ecf3e4',

        outline: {
          DEFAULT: '#707a6c',
          variant: '#bfcaba',
        },

        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        'on-error': {
          DEFAULT: '#ffffff',
          container: '#93000a',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans"', 'sans-serif'],
      },
      fontSize: {
        'headline-lg': ['30px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-lg': ['16px', { lineHeight: '20px', letterSpacing: '0.05em', fontWeight: '600' }],
        'label-md': ['14px', { lineHeight: '16px', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'button-text': ['18px', { lineHeight: '24px', fontWeight: '700' }],
      },
      borderRadius: {
        sm: '0.25rem', // 4px
        DEFAULT: '0.5rem', // 8px
        md: '0.75rem', // 12px
        lg: '1rem', // 16px
        xl: '1.5rem', // 24px
      },
      spacing: {
        'touch-target-min': '48px',
        'margin-mobile': '20px',
        gutter: '16px',
        'card-padding': '24px',
      },
      boxShadow: {
        'level-1': '0px 4px 12px rgba(0, 0, 0, 0.04)',
        'level-2': '0px 4px 12px rgba(0, 0, 0, 0.08)',
        'level-3': '0px -8px 24px rgba(0, 0, 0, 0.12)',
        'cta-glow': '0px 8px 16px rgba(13, 99, 27, 0.20)',
        'sticky-bottom': '0px -4px 12px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
