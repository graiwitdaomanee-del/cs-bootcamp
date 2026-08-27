import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../common/Icon';

export function CountdownTimer({
  timeLimitSeconds,
  paused,
  onExpire,
  variant = 'light',
}: {
  timeLimitSeconds: number;
  paused: boolean;
  onExpire: () => void;
  /** 'light' sits on a colored/dark header bar (default); 'plain' sits directly on a white card. */
  variant?: 'light' | 'plain';
}) {
  const [remaining, setRemaining] = useState(timeLimitSeconds);
  const expiredRef = useRef(false);

  useEffect(() => {
    if (paused) return;
    if (remaining <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true;
        onExpire();
      }
      return;
    }
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining, paused, onExpire]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isLow = remaining <= 30 && remaining > 0;
  const isExpired = remaining <= 0;

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-sm font-bold ${
        isExpired
          ? 'border-error/30 bg-error-container text-error'
          : isLow
            ? 'animate-pulse-danger border-error/30 bg-error-container/60 text-error'
            : variant === 'plain'
              ? 'border-outline-variant bg-surface-container-low text-on-surface-variant'
              : 'border-white/30 bg-white/10 text-white'
      }`}
    >
      <Icon name="timer" className="text-[16px]" />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
