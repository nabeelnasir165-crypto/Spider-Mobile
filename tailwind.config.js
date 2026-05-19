/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Premium tech palette
        ink: {
          50: "#f7f8fa",
          100: "#eef0f4",
          200: "#dadee6",
          300: "#b9c0cd",
          400: "#8e96a8",
          500: "#6b7385",
          600: "#4a5160",
          700: "#363c47",
          800: "#22262e",
          900: "#13161c",
          950: "#0a0c11",
        },
        accent: {
          50: "#ecfaff",
          100: "#cef3ff",
          200: "#a2e8ff",
          300: "#60d8ff",
          400: "#18bdfa",
          500: "#009fe0",
          600: "#007fbb",
          700: "#066698",
          800: "#0b557b",
          900: "#0f4767",
          950: "#072d44",
        },
        brand: {
          DEFAULT: "#0EA5E9",
          dark: "#0284C7",
          light: "#7DD3FC",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px' }],
        'display-xl': ['clamp(2.75rem, 6vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.035em', fontWeight: '700' }],
        'display-lg': ['clamp(2.25rem, 5vw, 4rem)', { lineHeight: '1.08', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-md': ['clamp(1.75rem, 3.5vw, 2.75rem)', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '700' }],
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)',
        'soft-lg': '0 12px 40px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.04)',
        'glow': '0 0 60px rgba(14, 165, 233, 0.35)',
        'glow-sm': '0 0 24px rgba(14, 165, 233, 0.25)',
      },
      backgroundImage: {
        'grid-light': "linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)",
        'radial-fade': 'radial-gradient(circle at 50% 0%, rgba(14,165,233,0.18), transparent 60%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'shimmer': 'shimmer 2.4s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
