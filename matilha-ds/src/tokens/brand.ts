/**
 * Tokens de marca Matilha — extraídos do Figma Branding
 * @see https://www.figma.com/design/NdXU8DZIy1CTIABGRPXiI5/Branding?node-id=4064-5297
 */
export const brandColors = {
  yellow: '#FBD951',
  green: '#A5E6BA',
  darkOrange: '#EB6239',
  orange: '#FD9C27',
  blue: '#3CA8FB',
  purple: '#BC83F3',
  purpleAlt: '#876BDB',
  pink: '#FEA0FB',
  black: '#000000',
  white: '#FFFFFF',
} as const;

/** Cores primárias históricas da marca — amarelo + branco sobre fundo preto */
export const brandPrimary = {
  background: brandColors.black,
  accent: brandColors.yellow,
  foreground: brandColors.white,
} as const;

/**
 * Paleta color code / suporte (quadradinhos, Doges).
 * O azul entra aqui como apoio visual — não é cor primária de marca.
 */
export const brandColorCode = [
  brandColors.darkOrange,
  brandColors.green,
  brandColors.purpleAlt,
  brandColors.pink,
  brandColors.orange,
  brandColors.yellow,
  brandColors.blue,
] as const;

/** @deprecated Use brandColorCode — mantido por compatibilidade */
export const brandPalette = brandColorCode;

export const brandCopy = {
  tagline: 'Um só não faz uma matilha.',
  descriptor: 'Especializados em criar soluções para produtos digitais, serviços e marcas de impacto',
  studioName: 'matilha estúdio',
} as const;

export const brandTypography = {
  fontFamily: '"Moderat", system-ui, sans-serif',
  weights: {
    regular: 400,
    bold: 700,
    extendedBold: 700,
  },
} as const;

export type BrandColorName = keyof typeof brandColors;

export type LogoVariant = 'matilha' | 'm' | 'craftedby' | 'badge';

export type BrandElementName =
  | 'Totem'
  | 'Default'
  | 'Lightning 2'
  | 'Lightning 3'
  | 'Waves'
  | 'Dawn'
  | 'Rainbow'
  | 'Magnet'
  | 'Party'
  | 'Soft Star'
  | 'Drop 2'
  | 'Portal'
  | 'Warm'
  | 'Asterisk 3'
  | 'Asterisk 1'
  | 'Asterisk'
  | 'Caterpillar'
  | 'Smile'
  | 'Rhode Island'
  | 'Orange Ricky'
  | 'Team'
  | 'Transparency'
  | 'Teewee'
  | 'Spiral 1'
  | 'Spiral 2'
  | 'Spiral 3'
  | 'Heavy Waves'
  | 'Zig Zag'
  | 'Trust'
  | 'Explosion'
  | 'Hole'
  | 'Grid';
