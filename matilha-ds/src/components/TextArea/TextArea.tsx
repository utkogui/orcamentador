import type { TextareaHTMLAttributes } from 'react';
import styles from './TextArea.module.css';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  showHelper?: boolean;
}

export function TextArea({
  label = 'Label',
  helperText = 'Helper text',
  error = false,
  showHelper = true,
  disabled,
  className = '',
  id,
  rows = 4,
  ...props
}: TextAreaProps) {
  const inputId = id ?? `matilha-textarea-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={[styles.wrapper, disabled ? styles.disabled : '', className].filter(Boolean).join(' ')}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <div className={[styles.field, error ? styles.error : ''].filter(Boolean).join(' ')}>
        <textarea
          id={inputId}
          rows={rows}
          className={[styles.textarea, 'matilha-focus-ring'].join(' ')}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={showHelper ? `${inputId}-helper` : undefined}
          {...props}
        />
      </div>
      {showHelper && (
        <p id={`${inputId}-helper`} className={[styles.helper, error ? styles.helperError : ''].filter(Boolean).join(' ')}>
          {helperText}
        </p>
      )}
    </div>
  );
}
