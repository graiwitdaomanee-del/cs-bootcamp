import type { KnowledgeHubEntry } from '../../types/knowledgeHub';
import type { Lesson } from '../../types/lesson';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import { KnowledgeHubEntryCard } from '../lesson/KnowledgeHubEntryCard';

export function KnowledgeHubPreviewDialog({
  entry,
  lesson,
  onClose,
}: {
  entry: KnowledgeHubEntry;
  lesson: Lesson | undefined;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl border border-surface-variant bg-surface-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-2">
          <Icon name="visibility" className="text-success-green" />
          <h3 className="font-display text-base font-semibold text-on-surface">พรีวิวสำหรับพนักงาน Training</h3>
        </div>
        <KnowledgeHubEntryCard entry={entry} />
        <p className="mt-3 font-mono text-xs text-secondary">
          ปลดล็อกเมื่อเรียน: {lesson ? lesson.title : 'ไม่ระบุบทเรียน'}
        </p>
        <div className="mt-5 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            ปิด
          </Button>
        </div>
      </div>
    </div>
  );
}
