import type { HTMLAttributes } from 'react';
import { brandCopy } from '../../tokens/brand';
import styles from './Tagline.module.css';

export interface TaglineProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: string;
}

export function Tagline({ children = brandCopy.tagline, className = '', ...props }: TaglineProps) {
  return (
    <p className={[styles.tagline, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </p>
  );
}
