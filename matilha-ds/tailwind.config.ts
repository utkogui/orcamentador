import type { Config } from 'tailwindcss';
import matilhaPreset from './tailwind.preset';

/** Config interna do pacote matilha-ds */
export default {
  presets: [matilhaPreset],
  content: ['./src/**/*.{ts,tsx}'],
} satisfies Config;
