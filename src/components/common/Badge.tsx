type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'accent';

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-surface-container text-secondary border-outline-variant',
  success: 'bg-success-green/10 text-success-green border-success-green/20',
  warning: 'bg-warning-gold/10 text-tertiary border-warning-gold/30',
  danger: 'bg-error-container text-on-error-container border-error/20',
  accent: 'bg-primary-container/10 text-success-green border-primary-container/20',
};

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-wide ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
