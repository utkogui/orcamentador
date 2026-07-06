import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Input.module.css';

export type InputState = 'default' | 'hover' | 'focus' | 'active' | 'filled' | 'error' | 'disabled';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  showHelper?: boolean;
}

export function Input({
  label = 'Label',
  helperText = 'Helper text',
  error = false,
  startIcon,
  endIcon,
  showHelper = true,
  disabled,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id ?? `matilha-input-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={[styles.wrapper, disabled ? styles.disabled : '', className].filter(Boolean).join(' ')}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <div className={[styles.field, error ? styles.error : ''].filter(Boolean).join(' ')}>
        {startIcon && <span className={styles.icon}>{startIcon}</span>}
        <input
          id={inputId}
          className={[styles.input, 'matilha-focus-ring'].join(' ')}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={showHelper ? `${inputId}-helper` : undefined}
          {...props}
        />
        {endIcon && <span className={styles.icon}>{endIcon}</span>}
      </div>
      {showHelper && (
        <p id={`${inputId}-helper`} className={[styles.helper, error ? styles.helperError : ''].filter(Boolean).join(' ')}>
          {helperText}
        </p>
      )}
    </div>
  );
}
