import type { Account } from '../../types/account';
import { useAppStore } from '../../store/useAppStore';
import { getLessonStatus } from '../../utils/lessonAccess';
import { ProgressBar } from '../common/ProgressBar';
import { Icon } from '../common/Icon';
import { CourseGrid } from './CourseGrid';

export function UserDashboard({ account }: { account: Account }) {
  const lessons = useAppStore((s) => s.lessons);
  const progress = useAppStore((s) => s.progress[account.id]);

  const visibleLessons = lessons.filter((l) => !l.isHidden);
  const completedCount = visibleLessons.filter(
    (l) => getLessonStatus(l, progress) === 'completed',
  ).length;
  const completionRatio = visibleLessons.length > 0 ? completedCount / visibleLessons.length : 0;

  return (
    <div>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-surface-variant bg-surface-white p-6 shadow-ambient md:col-span-1">
          <h1 className="font-display text-xl font-bold text-on-surface">
            ยินดีต้อนรับกลับมา, {account.name} <Icon name="waving_hand" filled className="inline text-warning-gold" />
          </h1>
          <p className="mt-1 font-sans text-sm text-secondary">
            เรียนจบแล้ว {completedCount} จาก {visibleLessons.length} บทเรียน
          </p>
          <div className="mt-4">
            <ProgressBar value={completionRatio} tone="xp" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-surface-variant bg-surface-white p-5 shadow-ambient">
          <div>
            <div className="mb-1 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-secondary">
              <Icon name="local_fire_department" filled className="text-warning-gold text-[16px]" /> Current Streak
            </div>
            <h4 className="font-display text-2xl font-bold text-on-surface">{progress.streakDays} วัน</h4>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-warning-gold/20 bg-warning-gold/10">
            <Icon name="local_fire_department" filled className="text-warning-gold text-3xl" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-surface-variant bg-surface-white p-5 shadow-ambient">
          <div>
            <div className="mb-1 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-secondary">
              <Icon name="star" filled className="text-success-green text-[16px]" /> Total XP
            </div>
            <h4 className="font-display text-2xl font-bold text-on-surface">{progress.xp}</h4>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-success-green/20 bg-success-green/10">
            <span className="font-mono text-xs font-bold text-success-green">
              Lv. {Math.max(1, Math.floor(progress.xp / 100))}
            </span>
          </div>
        </div>
      </div>

      <h2 className="mb-3 font-mono text-sm font-semibold uppercase tracking-wider text-secondary">
        คอร์สเรียนของคุณ
      </h2>
      <CourseGrid userProgress={progress} />
    </div>
  );
}
