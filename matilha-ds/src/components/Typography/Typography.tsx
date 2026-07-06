import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import type { TypographyVariant } from '../../tokens/typography';
import styles from './Typography.module.css';

const variantMap: Record<TypographyVariant, string> = {
  h1: 'matilha-h1',
  h2: 'matilha-h2',
  h3: 'matilha-h3',
  h4: 'matilha-h4',
  h5: 'matilha-h5',
  h6: 'matilha-h6',
  'subtitle-large': 'matilha-subtitle-large',
  'subtitle-small': 'matilha-subtitle-small',
  'paragraph-large': 'matilha-paragraph-large',
  'paragraph-medium': 'matilha-paragraph-medium',
  caption: 'matilha-caption',
  overline: 'matilha-overline',
  'button-large': styles.buttonLarge,
  'button-medium': styles.buttonMedium,
  'button-small': styles.buttonSmall,
  link: styles.link,
  label: styles.label,
  'input-text': styles.inputText,
};

const defaultElement: Partial<Record<TypographyVariant, ElementType>> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  'subtitle-large': 'p',
  'subtitle-small': 'p',
  'paragraph-large': 'p',
  'paragraph-medium': 'p',
  caption: 'span',
  overline: 'span',
  link: 'a',
  label: 'label',
};

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant: TypographyVariant;
  as?: ElementType;
  children: ReactNode;
}

export function Typography({ variant, as, className = '', children, ...props }: TypographyProps) {
  const Component = as ?? defaultElement[variant] ?? 'span';
  const variantClass = variantMap[variant];

  return (
    <Component className={[variantClass, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </Component>
  );
}
