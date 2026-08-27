import { useMemo, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { UserProgress } from '../../types/progress';
import { isKnowledgeHubEntryUnlocked } from '../../utils/lessonAccess';
import { SearchInput } from '../common/SearchInput';
import { ProgressBar } from '../common/ProgressBar';
import { KnowledgeHubEntryCard } from './KnowledgeHubEntryCard';
import { Icon } from '../common/Icon';

export function KnowledgeHub({ userProgress }: { userProgress: UserProgress }) {
  const entries = useAppStore((s) => s.knowledgeHubEntries);
  const [query, setQuery] = useState('');

  const unlockedEntries = useMemo(
    () => entries.filter((e) => isKnowledgeHubEntryUnlocked(e.unlockedByLessonId, userProgress)),
    [entries, userProgress],
  );

  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return unlockedEntries;
    return unlockedEntries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.body.toLowerCase().includes(q) ||
        e.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }, [unlockedEntries, query]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-display text-sm font-semibold text-on-surface">
          <Icon name="lightbulb" filled className="text-success-green text-[18px]" /> คลังความรู้ (Knowledge Hub)
        </h3>
        <span className="font-mono text-xs text-secondary">
          ปลดล็อกแล้ว {unlockedEntries.length}/{entries.length}
        </span>
      </div>
      <div className="mb-2">
        <ProgressBar value={entries.length ? unlockedEntries.length / entries.length : 0} />
      </div>
      <div className="mb-3">
        <SearchInput value={query} onChange={setQuery} placeholder="ค้นหาคลังความรู้..." />
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {filteredEntries.length === 0 ? (
          <p className="font-sans text-xs text-secondary">ไม่พบข้อมูลที่ค้นหา</p>
        ) : (
          filteredEntries.map((entry) => <KnowledgeHubEntryCard key={entry.id} entry={entry} />)
        )}
      </div>
    </div>
  );
}
