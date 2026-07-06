import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'default' | 'brand';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
}

/** Badge estilo "NOVO POST NO BLOG" do branding Matilha */
export function Badge({ children, variant = 'default', className = '', ...props }: BadgeProps) {
  return (
    <span className={[styles.badge, styles[variant], className].filter(Boolean).join(' ')} {...props}>
      {children}
    </span>
  );
}
