import type { ImgHTMLAttributes } from 'react';
import type { BrandElementName } from '../../tokens/brand';
import { brandElementRegistry } from '../brandElementRegistry';
import styles from './BrandElement.module.css';

import dawn from '../../assets/brand/elements/dawn.svg';
import asterisk from '../../assets/brand/elements/asterisk.svg';
import grid from '../../assets/brand/elements/grid.svg';

const localAssets: Partial<Record<BrandElementName, string>> = {
  Dawn: dawn,
  Asterisk: asterisk,
  Grid: grid,
};

export interface BrandElementProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt'> {
  name: BrandElementName;
  alt?: string;
}

export function BrandElement({ name, alt, className = '', ...props }: BrandElementProps) {
  const entry = brandElementRegistry[name];
  const src = localAssets[name];

  if (!src) {
    return (
      <span
        className={[styles.placeholder, className].filter(Boolean).join(' ')}
        role="img"
        aria-label={alt ?? `Elemento de marca: ${name}`}
        title={`Exporte ${name} do Figma (node ${entry.figmaNodeId})`}
        {...(props as object)}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt ?? `Elemento de marca Matilha: ${name}`}
      className={[styles.element, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
