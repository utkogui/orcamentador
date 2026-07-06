import type { ImgHTMLAttributes } from 'react';
import type { LogoVariant } from '../../tokens/brand';
import styles from './Logo.module.css';

import logoMatilha from '../../../logo/svg/logo-matilha.svg';
import logoM from '../../../logo/svg/logo-m.svg';
import logoCraftedby from '../../../logo/svg/logo-craftedby.svg';
import logoBadge from '../../../logo/svg/logo-badge.svg';

const logoSources: Record<LogoVariant, string> = {
  matilha: logoMatilha,
  m: logoM,
  craftedby: logoCraftedby,
  badge: logoBadge,
};

const defaultAlt: Record<LogoVariant, string> = {
  matilha: 'Matilha',
  m: 'Matilha — logotipo M',
  craftedby: 'Crafted by Matilha Estúdio',
  badge: 'Matilha Estúdio — badge',
};

export interface LogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  variant?: LogoVariant;
  alt?: string;
  /** Inverte para branco no dark mode quando `auto` (padrão). */
  tone?: 'auto' | 'dark' | 'light';
}

export function Logo({
  variant = 'matilha',
  alt,
  tone = 'auto',
  className = '',
  ...props
}: LogoProps) {
  return (
    <img
      src={logoSources[variant]}
      alt={alt ?? defaultAlt[variant]}
      className={[styles.logo, styles[variant], styles[`tone-${tone}`], className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
