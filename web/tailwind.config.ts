import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border:     'hsl(var(--border))',
        input:      'hsl(var(--input))',
        ring:       'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        highlight: 'hsl(var(--highlight))',
        /* badge domain colours */
        cyan:    { 400: '#22d3ee', 500: '#06b6d4' },
        blue:    { 400: '#60a5fa', 500: '#3b82f6' },
        violet:  { 400: '#a78bfa', 500: '#8b5cf6' },
        rose:    { 400: '#fb7185', 500: '#f43f5e' },
        amber:   { 400: '#fbbf24', 500: '#f59e0b' },
        emerald: { 400: '#34d399', 500: '#10b981' },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans:    ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Funnel Display', 'sans-serif'],
        serif:   ['Instrument Serif', 'Georgia', 'serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        label:   ['Space Mono', 'monospace'],
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(22px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'line-up': {
          '0%':   { transform: 'translateY(108%)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':       { opacity: '0.25', transform: 'scale(1.8)' },
        },
        'stats-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-5px)' },
        },
        'grid-fade': {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'border-spin': {
          '0%':   { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'scroll-bounce': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '50%':       { transform: 'translateY(5px)', opacity: '0.8' },
        },
      },
      animation: {
        'fade-up':       'fade-up 0.65s cubic-bezier(0.22,1,0.36,1) forwards',
        'line-up':       'line-up 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-dot':     'pulse-dot 2.2s ease-in-out infinite',
        'stats-float':   'stats-float 5s ease-in-out infinite',
        'grid-fade':     'grid-fade 0.4s cubic-bezier(0.22,1,0.36,1)',
        shimmer:         'shimmer 2s linear infinite',
        'scroll-bounce': 'scroll-bounce 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
