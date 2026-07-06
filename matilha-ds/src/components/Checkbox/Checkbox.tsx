"use client";

import { forwardRef, useEffect } from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showLabel?: boolean;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label = 'Label text',
    showLabel = true,
    indeterminate = false,
    className = '',
    id,
    ...props
  },
  forwardedRef,
) {
  const checkboxId = id ?? `matilha-checkbox-${label.replace(/\s+/g, '-').toLowerCase()}`;

  useEffect(() => {
    const node = document.getElementById(checkboxId) as HTMLInputElement | null;
    if (node) {
      node.indeterminate = indeterminate;
    }
  }, [checkboxId, indeterminate]);

  return (
    <label className={[styles.wrapper, className].filter(Boolean).join(' ')} htmlFor={checkboxId}>
      <input
        type="checkbox"
        id={checkboxId}
        ref={forwardedRef}
        className={[styles.input, 'matilha-focus-ring'].join(' ')}
        {...props}
      />
      <span className={styles.control} aria-hidden="true">
        <svg className={styles.checkIcon} viewBox="0 0 12 10" fill="none">
          <path d="M1 5.5L4.5 9L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className={styles.indeterminate} />
      </span>
      {showLabel && <span className={styles.label}>{label}</span>}
    </label>
  );
});
