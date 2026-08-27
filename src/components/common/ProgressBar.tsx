export function ProgressBar({ value, tone = 'accent' }: { value: number; tone?: 'accent' | 'xp' }) {
  const pct = Math.min(100, Math.max(0, value * 100));
  const barColor = tone === 'xp' ? 'bg-warning-gold' : 'bg-success-green';
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
      <div
        className={`h-full rounded-full ${barColor} transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
