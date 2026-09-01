// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Blue - #2563EB
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#172554',
        },
        // Secondary Cyan - #06B6D4
        secondary: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
        },
        // Success Emerald - #10B981
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        // Warning - #F97316
        warning: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        },
        // Danger/Error - #EF4444
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        // Info - #0EA5E9
        info: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
        },
        // Dashboard Accent - Purple
        purple: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        // Background Colors
        background: '#F8FAFC',
        surface: '#FFFFFF',
        border: '#E2E8F0',
        text: '#0F172A',
        'text-body': '#334155',
        muted: '#64748B',
        // Dark Theme Colors
        'dark-bg': '#0B1220',
        'dark-surface': '#111827',
        'dark-card': '#111827',
        'dark-border': '#334155',
        'dark-text': '#F8FAFC',
        'dark-text-body': '#CBD5E1',
        'dark-muted': '#64748B',
        // Frosted Glass
        'frost': 'rgba(255, 255, 255, 0.6)',
        'frost-dark': 'rgba(15, 23, 42, 0.6)',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', '"Manrope"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        numbers: ['"Space Grotesk"', 'sans-serif'],
      },
      fontSize: {
        'hero': '56px',
        'page-title': '42px',
        'section-title': '30px',
        'card-title': '22px',
        'body': '16px',
        'caption': '14px',
        'small': '12px',
      },
      fontWeight: {
        hero: 800,
        'page-title': 700,
        'section-title': 700,
        'card-title': 600,
        body: 400,
        caption: 400,
        small: 500,
      },
      borderRadius: {
        'button': '14px',
        'input': '14px',
        'card': '22px',
        'modal': '24px',
        'sidebar': '26px',
        'chip': '999px',
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(15,23,42,0.06)',
        'md': '0 8px 24px rgba(15,23,42,0.08)',
        'lg': '0 18px 60px rgba(15,23,42,0.10)',
        'card': '0 12px 40px rgba(15,23,42,0.08)',
        'card-hover': '0 18px 60px rgba(15,23,42,0.12)',
        'frosted': '0 8px 32px rgba(37,99,235,0.08)',
        'frosted-dark': '0 8px 32px rgba(0,0,0,0.3)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'header': '12px',
        'modal': '8px',
        'overlay': '10px',
      },
      animation: {
        'slide-up': 'slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'count-up': 'countUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-from-right': 'slideFromRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideFromRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};