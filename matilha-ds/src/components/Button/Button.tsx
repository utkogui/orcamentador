import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'secondary-inverted'
  | 'ui'
  /** @deprecated Use `primary` — alias de identidade Matilha */
  | 'brand'
  /** @deprecated Use `secondary-inverted` */
  | 'brand-outline';
export type ButtonSize = 'large' | 'medium';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'large',
  loading = false,
  startIcon,
  endIcon,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      className={[
        styles.button,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        loading ? styles.loading : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        startIcon && <span className={styles.icon}>{startIcon}</span>
      )}
      <span className={styles.label}>{children}</span>
      {!loading && endIcon && <span className={styles.icon}>{endIcon}</span>}
    </button>
  );
}
