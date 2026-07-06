/**
 * Catálogo de ícones do Styleguide → Icons
 * Mapeia nomes semânticos para ícones Heroicons (outline/solid) e custom.
 *
 * Uso com @heroicons/react (peer dependency opcional):
 *   import { ArrowUpIcon } from '@heroicons/react/24/outline';
 *   import { iconRegistry } from '@matilha/design-system';
 */
export const iconRegistry = {
  heroiconsOutline: [
    'arrow-up', 'arrow-down', 'arrow-left', 'arrow-right',
    'arrow-small-left', 'arrow-small-right', 'arrow-small-up', 'arrow-small-down',
    'arrow-long-left', 'arrow-long-up', 'arrow-long-right', 'arrow-long-down',
    'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up',
    'arrow-path', 'arrow-left-on-rectangle', 'arrow-right-on-rectangle',
    'arrow-up-tray', 'arrow-top-right-on-square', 'arrow-up-circle', 'link', 'printer',
    'shopping-bag', 'eye', 'eye-slash', 'bars-3-bottom-left', 'bars-3-bottom-right',
    'bars-3-center-left', 'bars-3', 'share', 'adjustments-horizontal',
    'x-circle', 'x-mark', 'minus', 'minus-small', 'plus-circle', 'plus', 'plus-small',
    'cog-6-tooth', 'cog-8-tooth', 'magnifying-glass-minus', 'magnifying-glass-plus',
    'magnifying-glass', 'paper-clip', 'key', 'map-pin', 'star', 'calendar',
    'credit-card', 'truck', 'user-circle', 'trash', 'phone', 'home', 'heart',
    'inbox-arrow-down', 'inbox', 'lock-closed', 'lock-open',
  ],
  heroiconsSolid: [
    'map-pin', 'star', 'calendar', 'credit-card', 'truck', 'user-circle',
    'trash', 'phone', 'home', 'heart', 'inbox-arrow-down', 'inbox',
    'lock-closed', 'lock-open',
  ],
  custom: [
    'exclamation-circle', 'exclamation-triangle', 'info-circle', 'x-octagon',
    'circle-wavy-check', 'check', 'dots-vertical', 'dots-horizontal',
    'message-square', 'mail', 'send', 'delete', 'copy', 'keyhole', 'wifi',
    'loader-duo-tone', 'loader-spinner', 'eye-closed', 'shopping-cart', 'pencil',
  ],
  logos: [
    'twitter', 'facebook', 'medium', 'linkedin', 'instagram',
    'behance', 'youtube', 'whatsapp',
  ],
} as const;

export type HeroiconOutlineName = (typeof iconRegistry.heroiconsOutline)[number];
export type HeroiconSolidName = (typeof iconRegistry.heroiconsSolid)[number];
export type CustomIconName = (typeof iconRegistry.custom)[number];
export type LogoIconName = (typeof iconRegistry.logos)[number];

/** Converte nome kebab-case para PascalCase + sufixo Icon (Heroicons) */
export function toHeroiconComponentName(name: string, suffix = 'Icon'): string {
  return (
    name
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + suffix
  );
}
