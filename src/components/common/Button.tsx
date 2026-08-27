import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-success-green text-on-primary hover:brightness-110 disabled:bg-success-green/40',
  secondary: 'bg-surface-white text-slate-dark hover:bg-surface-container-low border border-slate-dark',
  danger: 'bg-error-container text-on-error-container border border-error/20 hover:brightness-95',
  ghost: 'bg-transparent text-secondary hover:bg-surface-container-high',
};

export function Button({ variant = 'primary', className = '', disabled, ...rest }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-display text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
      {...rest}
    />
  );
}
