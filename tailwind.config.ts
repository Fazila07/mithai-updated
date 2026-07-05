/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mithai: {
          maroon:  '#900c00',
          maroonL: '#b01600',
          maroonD: '#6d0900',
          maroonP: '#f7eae8',
          gold:    '#ffa520',
          goldP:   '#fff5ed',
          cream:   '#F7F3EE',
          off:     '#FAFAF8',
          brown:   '#900c00',
          brownL:  '#b01600',
          // palette from inspiration image
          rust:    '#8B3A2A',
          caramel: '#C4622D',
          sand:    '#E8C99A',
          parchment: '#F5E8D0',
          charcoal:'#2A1810',
          warmGray:'#5C3D2E',
          taupe:   '#9B7B6A',
        },
      },
      fontFamily: {
        medino:     ['Medino', 'serif'],
        runiga:     ['Runiga', 'serif'],
        playfair:   ['Playfair Display', 'serif'],
        cormorant:  ['Cormorant Garamond', 'serif'],
        baskerville:['Libre Baskerville', 'serif'],
        dm:         ['DM Sans', 'sans-serif'],
        tanpearl:   ['"Tan Pearl"', 'serif'],
        barlow:     ['Barlow', 'sans-serif'],
        sans:       ['Barlow', 'sans-serif'],
      },
      animation: {
        'float':     'float 4.5s ease-in-out infinite',
        'marquee':   'marquee 24s linear infinite',
        'fadeUp':    'fadeUp 0.65s ease forwards',
        'pulse-glow':'pulseGlow 2s ease-in-out infinite',
        'blob':      'blob 9s ease-in-out infinite alternate',
        'shimmer':   'shimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0) rotate(-1.5deg)' },
          '50%':     { transform: 'translateY(-16px) rotate(1.5deg)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 0 3px rgba(255,165,32,0.28)' },
          '50%':     { boxShadow: '0 0 0 5px rgba(255,165,32,0.14)' },
        },
        blob: {
          '0%':   { transform: 'translate(0,0) scale(1)' },
          '100%': { transform: 'translate(18px,14px) scale(1.07)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'mithai':  '0 4px 24px rgba(144,12,0,0.08)',
        'mithaiH': '0 8px 32px rgba(144,12,0,0.15)',
        'gold':    '0 4px 18px rgba(255,165,32,0.35)',
        'maroon':  '0 6px 24px rgba(144,12,0,0.35)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #FBF5EC 0%, #F5E8D0 30%, #EDD9BC 65%, #E8CFA8 100%)',
        'plate-gradient':'linear-gradient(155deg,#900c00 0%,#b01600 30%,#900c00 65%,#6d0900 100%)',
        'shimmer-gradient':'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}