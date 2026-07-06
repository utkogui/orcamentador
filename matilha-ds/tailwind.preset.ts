import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

/**
 * Preset Tailwind Matilha — cores, fontes e componentes de marca.
 * Uso no app consumidor:
 *   import matilhaPreset from '@matilha/design-system/tailwind';
 *   export default { presets: [matilhaPreset], content: [...] };
 */
const matilhaPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        neutral: {
          100: '#ffffff',
          200: '#f2f2f2',
          300: '#e0e0e0',
          400: '#c2c2c2',
          500: '#9e9e9e',
          600: '#858585',
          700: '#595959',
          800: '#323232',
          900: '#191919',
          1000: '#000000',
        },
        primary: {
          100: '#8aa8ef',
          200: '#5381e9',
          300: '#2b63e3',
          400: '#204bac',
          500: '#193880',
          DEFAULT: '#2b63e3',
        },
        secondary: {
          100: '#d5c2ff',
          200: '#ac85ff',
          300: '#8247ff',
          400: '#631aff',
          500: '#4208bf',
          DEFAULT: '#8247ff',
        },
        success: {
          100: '#93d2ad',
          200: '#5cba83',
          300: '#478f65',
          DEFAULT: '#5cba83',
        },
        warning: {
          100: '#ffe680',
          200: '#ffd83c',
          300: '#d5b120',
          DEFAULT: '#ffd83c',
        },
        danger: {
          100: '#f68684',
          200: '#e94c49',
          300: '#bf2a27',
          DEFAULT: '#e94c49',
        },
        brand: {
          yellow: '#fbd951',
          green: '#a5e6ba',
          'dark-orange': '#eb6239',
          orange: '#fd9c27',
          blue: '#3ca8fb',
          purple: '#bc83f3',
          'purple-alt': '#876bdb',
          pink: '#fea0fb',
          black: '#000000',
          white: '#ffffff',
        },
      },
      fontFamily: {
        brand: ['Moderat', 'system-ui', 'sans-serif'],
        display: ['Moderat', 'system-ui', 'sans-serif'],
        heading: ['Moderat', 'system-ui', 'sans-serif'],
        body: ['"Roboto Slab"', 'Georgia', 'serif'],
        mono: ['"Roboto Mono"', 'ui-monospace', 'monospace'],
        extended: ['"Moderat Extended"', 'Moderat', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xs: '2px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        pill: '32px',
      },
      spacing: {
        'matilha-1': '0.25rem',
        'matilha-2': '0.5rem',
        'matilha-3': '0.75rem',
        'matilha-4': '1rem',
        'matilha-5': '1.5rem',
        'matilha-6': '2rem',
        'matilha-7': '2.5rem',
        'matilha-8': '3.5rem',
      },
      boxShadow: {
        'matilha-100': '0 1px 2px rgba(16, 24, 40, 0.06), 0 1px 3px rgba(16, 24, 40, 0.1)',
        'matilha-200': '0 2px 4px -2px rgba(16, 24, 40, 0.06), 0 4px 8px -2px rgba(16, 24, 40, 0.1)',
        'matilha-300': '0 4px 6px -2px rgba(16, 24, 40, 0.05), 0 12px 16px -4px rgba(16, 24, 40, 0.1)',
        'matilha-400': '0 8px 8px -4px rgba(16, 24, 40, 0.04), 0 20px 24px -4px rgba(16, 24, 40, 0.1)',
        'matilha-500': '0 32px 64px -12px rgba(16, 24, 39, 0.2)',
        'matilha-focus': '0 0 0 3px #8aa8ef',
      },
      letterSpacing: {
        matilha: '0.02em',
        overline: '0.04em',
      },
    },
  },
  plugins: [
    plugin(({ addComponents, addUtilities, theme }) => {
      addComponents({
        /* Canvas de marca — preto + branco + amarelo */
        '.matilha-brand-canvas': {
          backgroundColor: theme('colors.brand.black'),
          color: theme('colors.brand.white'),
          fontFamily: theme('fontFamily.brand'),
        },
        '.matilha-brand-accent': {
          color: theme('colors.brand.yellow'),
        },
        /* Botão principal — identidade Matilha (amarelo) */
        '.matilha-btn-primary': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme('spacing.matilha-3'),
          minHeight: '3.5rem',
          padding: `${theme('spacing.matilha-4')} ${theme('spacing.matilha-5')}`,
          backgroundColor: theme('colors.brand.yellow'),
          color: theme('colors.brand.black'),
          border: `2px solid ${theme('colors.brand.yellow')}`,
          borderRadius: theme('borderRadius.sm'),
          fontFamily: theme('fontFamily.brand'),
          fontWeight: '700',
          fontSize: '1.125rem',
          lineHeight: '1',
          letterSpacing: theme('letterSpacing.matilha'),
          cursor: 'pointer',
          transition: 'background-color 0.15s ease, border-color 0.15s ease',
          '&:hover:not(:disabled)': {
            backgroundColor: '#f5d033',
            borderColor: '#f5d033',
          },
          '&:active:not(:disabled)': {
            backgroundColor: '#e8c42e',
            borderColor: '#e8c42e',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        /* Alias legado — mesmo estilo do primary de marca */
        '.matilha-btn-brand': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme('spacing.matilha-3'),
          minHeight: '3.5rem',
          padding: `${theme('spacing.matilha-4')} ${theme('spacing.matilha-5')}`,
          backgroundColor: theme('colors.brand.yellow'),
          color: theme('colors.brand.black'),
          border: `2px solid ${theme('colors.brand.yellow')}`,
          borderRadius: theme('borderRadius.sm'),
          fontFamily: theme('fontFamily.brand'),
          fontWeight: '700',
          fontSize: '1.125rem',
          lineHeight: '1',
          letterSpacing: theme('letterSpacing.matilha'),
          cursor: 'pointer',
        },
        /* Secundário — outline amarelo em fundo claro */
        '.matilha-btn-secondary': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme('spacing.matilha-3'),
          minHeight: '3.5rem',
          padding: `${theme('spacing.matilha-4')} ${theme('spacing.matilha-5')}`,
          backgroundColor: 'transparent',
          color: theme('colors.brand.black'),
          border: `2px solid ${theme('colors.brand.yellow')}`,
          borderRadius: theme('borderRadius.sm'),
          fontFamily: theme('fontFamily.brand'),
          fontWeight: '700',
          fontSize: '1.125rem',
          lineHeight: '1',
          letterSpacing: theme('letterSpacing.matilha'),
          cursor: 'pointer',
          transition: 'background-color 0.15s ease, border-color 0.15s ease',
          '&:hover:not(:disabled)': {
            backgroundColor: 'rgba(251, 217, 81, 0.16)',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        /* Secundário invertido — outline branco sobre preto */
        '.matilha-btn-brand-outline': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme('spacing.matilha-3'),
          minHeight: '3.5rem',
          padding: `${theme('spacing.matilha-4')} ${theme('spacing.matilha-5')}`,
          backgroundColor: 'transparent',
          color: theme('colors.brand.white'),
          border: `2px solid ${theme('colors.brand.white')}`,
          borderRadius: theme('borderRadius.sm'),
          fontFamily: theme('fontFamily.brand'),
          fontWeight: '700',
          fontSize: '1.125rem',
          lineHeight: '1',
          letterSpacing: theme('letterSpacing.matilha'),
          cursor: 'pointer',
          transition: 'background-color 0.15s ease, color 0.15s ease',
          '&:hover:not(:disabled)': {
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        /* Botão UI Kit — azul (apps internos / dashboards) */
        '.matilha-btn-ui': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme('spacing.matilha-3'),
          minHeight: '3.5rem',
          padding: `${theme('spacing.matilha-4')} ${theme('spacing.matilha-5')}`,
          backgroundColor: theme('colors.primary.300'),
          color: theme('colors.neutral.100'),
          border: `2px solid ${theme('colors.primary.300')}`,
          borderRadius: theme('borderRadius.sm'),
          fontFamily: theme('fontFamily.heading'),
          fontWeight: '600',
          fontSize: '1.125rem',
          lineHeight: '1',
          letterSpacing: theme('letterSpacing.matilha'),
          cursor: 'pointer',
          transition: 'background-color 0.15s ease, border-color 0.15s ease',
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.primary.400'),
            borderColor: theme('colors.primary.400'),
          },
          '&:active:not(:disabled)': {
            backgroundColor: theme('colors.primary.500'),
            borderColor: theme('colors.primary.500'),
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        '.matilha-input': {
          width: '100%',
          height: '2.5rem',
          padding: `${theme('spacing.matilha-2')} ${theme('spacing.matilha-4')}`,
          backgroundColor: theme('colors.neutral.100'),
          color: theme('colors.neutral.900'),
          border: `1px solid ${theme('colors.neutral.300')}`,
          borderRadius: theme('borderRadius.sm'),
          fontFamily: theme('fontFamily.body'),
          fontWeight: '500',
          fontSize: '1rem',
          lineHeight: '1.2',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.brand.yellow'),
            boxShadow: '0 0 0 3px rgba(251, 217, 81, 0.45)',
          },
          '&::placeholder': {
            color: theme('colors.neutral.500'),
          },
        },
        '.matilha-card': {
          backgroundColor: theme('colors.neutral.100'),
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.matilha-200'),
          padding: theme('spacing.matilha-6'),
        },
        '.matilha-card-brand': {
          backgroundColor: theme('colors.brand.black'),
          color: theme('colors.brand.white'),
          borderRadius: theme('borderRadius.lg'),
          padding: theme('spacing.matilha-6'),
          border: `1px solid ${theme('colors.neutral.800')}`,
        },
      });

      addUtilities({
        '.text-brand-yellow': { color: theme('colors.brand.yellow') },
        '.text-brand-white': { color: theme('colors.brand.white') },
        '.bg-brand-black': { backgroundColor: theme('colors.brand.black') },
        '.bg-brand-yellow': { backgroundColor: theme('colors.brand.yellow') },
        '.border-brand-yellow': { borderColor: theme('colors.brand.yellow') },
        '.font-brand': { fontFamily: theme('fontFamily.brand') },
        '.font-body-slab': { fontFamily: theme('fontFamily.body') },
      });
    }),
  ],
};

export default matilhaPreset;
