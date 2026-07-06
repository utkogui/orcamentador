/** Tokens de cor extraídos da aba 💎Styleguide → Color (Figma UI Kit) */
export const colors = {
  neutral: {
    100: '#FFFFFF',
    200: '#F2F2F2',
    300: '#E0E0E0',
    400: '#C2C2C2',
    500: '#9E9E9E',
    600: '#858585',
    700: '#595959',
    800: '#323232',
    900: '#191919',
    1000: '#000000',
  },
  brand: {
    primary: {
      100: '#8AA8EF',
      200: '#5381E9',
      300: '#2B63E3',
      400: '#204BAC',
      500: '#193880',
    },
    secondary: {
      100: '#D5C2FF',
      200: '#AC85FF',
      300: '#8247FF',
      400: '#631AFF',
      500: '#4208BF',
    },
  },
  system: {
    success: { 100: '#93D2AD', 200: '#5CBA83', 300: '#478F65' },
    warning: { 100: '#FFE680', 200: '#FFD83C', 300: '#D5B120' },
    danger: { 100: '#F68684', 200: '#E94C49', 300: '#BF2A27' },
  },
  alpha: {
    light: { 100: 'rgba(255, 255, 255, 0.3)', 200: 'rgba(255, 255, 255, 0.56)', 300: 'rgba(255, 255, 255, 0.8)' },
    dark: { 100: 'rgba(0, 0, 0, 0.3)', 200: 'rgba(0, 0, 0, 0.56)', 300: 'rgba(0, 0, 0, 0.8)' },
  },
} as const;

export type ColorToken = typeof colors;
