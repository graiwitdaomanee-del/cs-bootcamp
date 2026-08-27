import type { Lesson, LessonDifficulty } from '../../types/lesson';
import type { LessonStatus } from '../../types/progress';
import { Badge } from '../common/Badge';
import { Icon } from '../common/Icon';

const statusConfig: Record<
  LessonStatus,
  { label: string; tone: 'neutral' | 'success' | 'warning' | 'accent'; icon: string; filled: boolean }
> = {
  locked: { label: 'ล็อกอยู่', tone: 'neutral', icon: 'lock', filled: true },
  available: { label: 'พร้อมเรียน', tone: 'accent', icon: 'play_circle', filled: true },
  'in-progress': { label: 'กำลังเรียน', tone: 'warning', icon: 'hourglass_top', filled: false },
  completed: { label: 'เรียนจบแล้ว', tone: 'success', icon: 'check_circle', filled: true },
};

const DIFFICULTY_CONFIG: Record<LessonDifficulty, { label: string; tone: 'success' | 'warning' | 'danger' }> = {
  easy: { label: 'ง่าย', tone: 'success' },
  medium: { label: 'ปานกลาง', tone: 'warning' },
  hard: { label: 'ยาก', tone: 'danger' },
};

export function LessonCard({
  lesson,
  status,
  onClick,
}: {
  lesson: Lesson;
  status: LessonStatus;
  onClick?: () => void;
}) {
  const config = statusConfig[status];
  const clickable = status === 'available' || status === 'in-progress' || status === 'completed';

  return (
    <button
      onClick={clickable ? onClick : undefined}
      disabled={!clickable}
      className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left shadow-ambient transition-all ${
        status === 'locked'
          ? 'border-surface-variant bg-surface-container-low opacity-60'
          : 'border-surface-variant bg-surface-white hover:border-success-green hover:bg-success-green/5'
      }`}
    >
      <Icon name={config.icon} filled={config.filled} className="mt-0.5 text-2xl text-secondary" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-semibold text-on-surface">{lesson.title}</h3>
          <Badge tone={DIFFICULTY_CONFIG[lesson.difficulty].tone}>
            {DIFFICULTY_CONFIG[lesson.difficulty].label}
          </Badge>
          {lesson.isPlaceholder && <Badge tone="neutral">ตัวอย่าง</Badge>}
        </div>
        <p className="mt-1 font-sans text-sm text-secondary">{lesson.summary}</p>
        <div className="mt-2 flex items-center gap-3 font-mono text-xs text-secondary">
          <span className="flex items-center gap-1">
            <Icon name="bolt" filled className="text-warning-gold text-[14px]" /> {lesson.xpReward} XP
          </span>
          <span className="flex items-center gap-1">
            <Icon name="schedule" className="text-[14px]" /> {lesson.estimatedMinutes} นาที
          </span>
        </div>
      </div>
      <Badge tone={config.tone}>{config.label}</Badge>
    </button>
  );
}
