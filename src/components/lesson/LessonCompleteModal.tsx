import type { Lesson } from '../../types/lesson';
import type { KnowledgeHubEntry } from '../../types/knowledgeHub';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

export function LessonCompleteModal({
  lesson,
  unlockedEntries,
  nextLesson,
  onGoToDashboard,
  onGoToNext,
}: {
  lesson: Lesson;
  unlockedEntries: KnowledgeHubEntry[];
  nextLesson: Lesson | null;
  onGoToDashboard: () => void;
  onGoToNext: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-surface-variant bg-surface-white p-6 text-center shadow-2xl">
        <div className="mb-2 flex justify-center text-success-green">
          <Icon name="celebration" filled className="text-5xl" />
        </div>
        <h2 className="font-display text-xl font-bold text-on-surface">เรียนจบบทเรียนแล้ว!</h2>
        <p className="mt-1 font-sans text-sm text-secondary">{lesson.title}</p>

        <div className="my-5 flex justify-center gap-6">
          <div>
            <div className="font-display text-2xl font-bold text-tertiary">+{lesson.xpReward}</div>
            <div className="font-mono text-xs text-secondary">XP ที่ได้รับ</div>
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-success-green">{unlockedEntries.length}</div>
            <div className="font-mono text-xs text-secondary">ความรู้ที่ปลดล็อก</div>
          </div>
        </div>

        {unlockedEntries.length > 0 && (
          <div className="mb-5 rounded-lg border border-surface-variant bg-surface-container-low p-3 text-left">
            <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
              รายการใหม่ในคลังความรู้
            </p>
            <ul className="space-y-0.5 font-sans text-sm text-on-surface-variant">
              {unlockedEntries.map((e) => (
                <li key={e.id} className="flex items-center gap-1.5">
                  <Icon name="menu_book" className="text-success-green text-[16px]" /> {e.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {nextLesson && <Button onClick={onGoToNext}>เริ่มบทเรียนถัดไป: {nextLesson.title}</Button>}
          <Button variant="secondary" onClick={onGoToDashboard}>
            กลับไปหน้าคอร์ส
          </Button>
        </div>
      </div>
    </div>
  );
}
