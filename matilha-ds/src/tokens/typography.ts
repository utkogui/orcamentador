/** Tokens tipográficos extraídos da aba 💎Styleguide → Typography */
export const typography = {
  fontFamily: {
    display: '"Moderat", system-ui, sans-serif',
    heading: '"Moderat", system-ui, sans-serif',
    body: '"Roboto Slab", Georgia, serif',
    mono: '"Roboto Mono", ui-monospace, monospace',
    brand: '"Moderat", system-ui, sans-serif',
  },
  desktop: {
    heading: {
      h1: { fontFamily: 'display', fontWeight: 700, fontSize: '3.5rem', lineHeight: 1.2, letterSpacing: '0' },
      h2: { fontFamily: 'display', fontWeight: 700, fontSize: '3rem', lineHeight: 1.2, letterSpacing: '0' },
      h3: { fontFamily: 'heading', fontWeight: 700, fontSize: '2.5rem', lineHeight: 1.2, letterSpacing: '0' },
      h4: { fontFamily: 'heading', fontWeight: 700, fontSize: '2rem', lineHeight: 1.28, letterSpacing: '0' },
      h5: { fontFamily: 'heading', fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.28, letterSpacing: '0' },
      h6: { fontFamily: 'heading', fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.28, letterSpacing: '0' },
    },
    text: {
      subtitleLarge: { fontFamily: 'heading', fontWeight: 500, fontSize: '2rem', lineHeight: 1.36 },
      subtitleSmall: { fontFamily: 'heading', fontWeight: 500, fontSize: '1.25rem', lineHeight: 1.36 },
      paragraphLarge: { fontFamily: 'body', fontWeight: 400, fontSize: '1.1875rem', lineHeight: 1.78 },
      paragraphMedium: { fontFamily: 'body', fontWeight: 400, fontSize: '1rem', lineHeight: 1.78 },
      caption: { fontFamily: 'body', fontWeight: 500, fontSize: '0.75rem', lineHeight: 1.2 },
      overline: { fontFamily: 'heading', fontWeight: 600, fontSize: '0.75rem', lineHeight: 1.2, letterSpacing: '0.04em', textTransform: 'uppercase' as const },
    },
    interactive: {
      buttonLarge: { fontFamily: 'heading', fontWeight: 600, fontSize: '1.125rem', lineHeight: 1, letterSpacing: '0.02em' },
      buttonMedium: { fontFamily: 'heading', fontWeight: 600, fontSize: '1rem', lineHeight: 1, letterSpacing: '0.02em' },
      buttonSmall: { fontFamily: 'heading', fontWeight: 600, fontSize: '0.875rem', lineHeight: 1, letterSpacing: '0.02em' },
      link: { fontFamily: 'body', fontWeight: 700, fontSize: '1rem', lineHeight: 1.6 },
      label: { fontFamily: 'heading', fontWeight: 500, fontSize: '0.875rem', lineHeight: 1 },
      inputText: { fontFamily: 'body', fontWeight: 500, fontSize: '1rem', lineHeight: 1.2 },
    },
  },
  mobile: {
    heading: {
      h1: { fontFamily: 'heading', fontWeight: 700, fontSize: '2.75rem', lineHeight: 1.2 },
      h2: { fontFamily: 'heading', fontWeight: 700, fontSize: '2.5rem', lineHeight: 1.2 },
      h3: { fontFamily: 'heading', fontWeight: 700, fontSize: '2.25rem', lineHeight: 1.2 },
    },
  },
} as const;

export type TypographyVariant =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'subtitle-large' | 'subtitle-small'
  | 'paragraph-large' | 'paragraph-medium'
  | 'caption' | 'overline'
  | 'button-large' | 'button-medium' | 'button-small'
  | 'link' | 'label' | 'input-text';
