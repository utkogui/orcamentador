import type { BrandElementName } from '../tokens/brand';

/** Registry de elementos visuais da marca — Figma Branding → Elementos visuais */
export const brandElementRegistry: Record<
  BrandElementName,
  { figmaNodeId: string; asset?: string }
> = {
  Totem: { figmaNodeId: '4064:5448' },
  Default: { figmaNodeId: '4064:5450' },
  'Lightning 2': { figmaNodeId: '4064:5452' },
  'Lightning 3': { figmaNodeId: '4064:5460' },
  Waves: { figmaNodeId: '4064:5454' },
  Dawn: { figmaNodeId: '4064:5458', asset: 'dawn.svg' },
  Rainbow: { figmaNodeId: '4064:5462' },
  Magnet: { figmaNodeId: '4064:5464' },
  Party: { figmaNodeId: '4064:5466' },
  'Soft Star': { figmaNodeId: '4064:5468' },
  'Drop 2': { figmaNodeId: '4064:5470' },
  Portal: { figmaNodeId: '4064:5472' },
  Warm: { figmaNodeId: '4064:5474' },
  'Asterisk 3': { figmaNodeId: '4064:5476' },
  'Asterisk 1': { figmaNodeId: '4064:5497' },
  Asterisk: { figmaNodeId: '4064:5544', asset: 'asterisk.svg' },
  Caterpillar: { figmaNodeId: '4064:5478' },
  Smile: { figmaNodeId: '4064:5480' },
  'Rhode Island': { figmaNodeId: '4064:5495' },
  'Orange Ricky': { figmaNodeId: '4064:5505' },
  Team: { figmaNodeId: '4064:5499' },
  Transparency: { figmaNodeId: '4064:5501' },
  Teewee: { figmaNodeId: '4064:5503' },
  'Spiral 1': { figmaNodeId: '4064:5511' },
  'Spiral 2': { figmaNodeId: '4064:5513' },
  'Spiral 3': { figmaNodeId: '4064:5515' },
  'Heavy Waves': { figmaNodeId: '4064:5517' },
  'Zig Zag': { figmaNodeId: '4064:5519' },
  Trust: { figmaNodeId: '4064:5521' },
  Explosion: { figmaNodeId: '4064:5507' },
  Hole: { figmaNodeId: '4064:5509' },
  Grid: { figmaNodeId: '4064:5523', asset: 'grid.svg' },
};

export const brandElementNames = Object.keys(brandElementRegistry) as BrandElementName[];
