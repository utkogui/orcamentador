import type { InputHTMLAttributes } from 'react';
import styles from './Radio.module.css';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showLabel?: boolean;
}

export function Radio({
  label = 'Label text',
  showLabel = true,
  className = '',
  id,
  ...props
}: RadioProps) {
  const radioId = id ?? `matilha-radio-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <label className={[styles.wrapper, className].filter(Boolean).join(' ')} htmlFor={radioId}>
      <input type="radio" id={radioId} className={[styles.input, 'matilha-focus-ring'].join(' ')} {...props} />
      <span className={styles.control} aria-hidden="true" />
      {showLabel && <span className={styles.label}>{label}</span>}
    </label>
  );
}
