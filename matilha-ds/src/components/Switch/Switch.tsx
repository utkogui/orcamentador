import type { InputHTMLAttributes } from 'react';
import styles from './Switch.module.css';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showLabel?: boolean;
}

export function Switch({
  label = 'Label text',
  showLabel = true,
  className = '',
  id,
  ...props
}: SwitchProps) {
  const switchId = id ?? `matilha-switch-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <label className={[styles.wrapper, className].filter(Boolean).join(' ')} htmlFor={switchId}>
      <input type="checkbox" role="switch" id={switchId} className={[styles.input, 'matilha-focus-ring'].join(' ')} {...props} />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      {showLabel && <span className={styles.label}>{label}</span>}
    </label>
  );
}
