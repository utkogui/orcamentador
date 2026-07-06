import { brandPalette } from '../../tokens/brand';
import styles from './ColorDots.module.css';

export interface ColorDotsProps {
  /** Quantidade de dots (máx. 7 — paleta principal) */
  count?: number;
  className?: string;
}

/** Quadradinhos coloridos / Doges do branding Matilha */
export function ColorDots({ count = 7, className = '' }: ColorDotsProps) {
  const colors = brandPalette.slice(0, Math.min(count, brandPalette.length));

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')} aria-hidden="true">
      {colors.map((color) => (
        <span key={color} className={styles.dot} style={{ backgroundColor: color }} />
      ))}
    </div>
  );
}
