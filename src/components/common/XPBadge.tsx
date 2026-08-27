import { Icon } from './Icon';

export function XPBadge({ xp, streakDays }: { xp: number; streakDays: number }) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-outline-variant bg-surface-white px-3 py-1.5">
      <span className="flex items-center gap-1 font-mono text-xs font-bold text-tertiary">
        <Icon name="star" filled className="text-warning-gold text-[16px]" /> {xp} XP
      </span>
      <span className="h-4 w-px bg-outline-variant" />
      <span className="flex items-center gap-1 font-mono text-xs font-bold text-tertiary">
        <Icon name="local_fire_department" filled className="text-warning-gold text-[16px]" /> {streakDays} วันติดต่อกัน
      </span>
    </div>
  );
}
