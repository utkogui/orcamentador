import type { HTMLAttributes, ReactNode } from 'react';
import styles from './TipBox.module.css';

export type TipBoxVariant = 'info' | 'warning' | 'success' | 'danger';

export interface TipBoxProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: ReactNode;
  variant?: TipBoxVariant;
}

export function TipBox({ title, children, variant = 'info', className = '', ...props }: TipBoxProps) {
  return (
    <div className={[styles.box, styles[variant], className].filter(Boolean).join(' ')} role="note" {...props}>
      {title && <p className={styles.title}>{title}</p>}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
