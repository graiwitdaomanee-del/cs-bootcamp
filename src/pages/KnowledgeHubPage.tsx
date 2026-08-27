import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { PageBreadcrumb } from '../components/common/PageBreadcrumb';
import { SearchInput } from '../components/common/SearchInput';
import { Button } from '../components/common/Button';
import { KnowledgeHubEntryCard } from '../components/lesson/KnowledgeHubEntryCard';
import { KnowledgeHubEntryEditorDialog } from '../components/dashboard/KnowledgeHubEntryEditorDialog';
import { KnowledgeHubPreviewDialog } from '../components/dashboard/KnowledgeHubPreviewDialog';
import { ConfirmDialog } from '../components/dashboard/ConfirmDialog';
import { Icon } from '../components/common/Icon';
import { useAppStore } from '../store/useAppStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { isKnowledgeHubEntryUnlocked } from '../utils/lessonAccess';
import type { KnowledgeHubEntry } from '../types/knowledgeHub';

export function KnowledgeHubPage() {
  const account = useCurrentUser();
  const entries = useAppStore((s) => s.knowledgeHubEntries);
  const lessons = useAppStore((s) => s.lessons);
  const progressByUser = useAppStore((s) => s.progress);
  const addKnowledgeHubEntry = useAppStore((s) => s.addKnowledgeHubEntry);
  const updateKnowledgeHubEntry = useAppStore((s) => s.updateKnowledgeHubEntry);
  const deleteKnowledgeHubEntry = useAppStore((s) => s.deleteKnowledgeHubEntry);
  const [query, setQuery] = useState('');
  const [editingEntry, setEditingEntry] = useState<KnowledgeHubEntry | 'new' | null>(null);
  const [previewingEntry, setPreviewingEntry] = useState<KnowledgeHubEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<KnowledgeHubEntry | null>(null);

  if (!account) return <Navigate to="/login" replace />;

  const userProgress = progressByUser[account.id];
  const isAdmin = account.role === 'admin';

  const visibleEntries = isAdmin
    ? entries
    : entries.filter((e) => userProgress && isKnowledgeHubEntryUnlocked(e.unlockedByLessonId, userProgress));

  const q = query.trim().toLowerCase();
  const filteredEntries = q
    ? visibleEntries.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.body.toLowerCase().includes(q) ||
          e.tags.some((tag) => tag.toLowerCase().includes(q)),
      )
    : visibleEntries;

  const lessonById = new Map(lessons.map((l) => [l.id, l]));
  const groups = new Map<string, typeof entries>();
  for (const entry of filteredEntries) {
    const key = entry.unlockedByLessonId;
    const group = groups.get(key) ?? [];
    group.push(entry);
    groups.set(key, group);
  }
  const sortedGroupKeys = [...groups.keys()].sort((a, b) => {
    const orderA = lessonById.get(a)?.order ?? 0;
    const orderB = lessonById.get(b)?.order ?? 0;
    return orderA - orderB;
  });

  return (
    <AppShell>
      <PageBreadcrumb items={[{ label: 'คลังความรู้' }]} />
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 font-display text-xl font-bold text-on-surface">
            <Icon name="lightbulb" filled className="text-success-green text-2xl" /> คลังความรู้ (Knowledge Hub)
          </h1>
          <p className="mt-1 font-sans text-sm text-secondary">
            {isAdmin
              ? 'มุมมองผู้ดูแลระบบ — แสดงรายการความรู้ทั้งหมดในระบบ ไม่ว่าพนักงาน Training จะปลดล็อกแล้วหรือไม่'
              : `ความรู้ที่คุณปลดล็อกแล้วจากการเรียน — ${visibleEntries.length}/${entries.length} รายการ`}
          </p>
        </div>
        {isAdmin && lessons.length > 0 && (
          <Button onClick={() => setEditingEntry('new')}>+ สร้างความรู้ใหม่</Button>
        )}
      </div>

      <div className="mb-6 max-w-md">
        <SearchInput value={query} onChange={setQuery} placeholder="ค้นหาคลังความรู้..." />
      </div>

      {sortedGroupKeys.length === 0 ? (
        <p className="rounded-xl border border-dashed border-outline-variant bg-surface-white p-6 font-sans text-sm text-secondary">
          {isAdmin ? 'ไม่พบข้อมูลที่ค้นหา' : 'ยังไม่มีความรู้ที่ปลดล็อก — เริ่มเรียนบทเรียนแรกเพื่อปลดล็อกคลังความรู้'}
        </p>
      ) : (
        <div className="space-y-8">
          {sortedGroupKeys.map((lessonId) => {
            const lesson = lessonById.get(lessonId);
            const groupEntries = groups.get(lessonId)!;
            return (
              <div key={lessonId}>
                <h2 className="mb-3 font-mono text-sm font-semibold uppercase tracking-wider text-secondary">
                  {lesson ? lesson.title : 'ไม่ระบุบทเรียน'}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {groupEntries.map((entry) =>
                    isAdmin ? (
                      <div key={entry.id} className="flex flex-col gap-2">
                        <KnowledgeHubEntryCard entry={entry} />
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="secondary"
                            className="text-xs"
                            onClick={() => setPreviewingEntry(entry)}
                          >
                            พรีวิว
                          </Button>
                          <Button variant="secondary" className="text-xs" onClick={() => setEditingEntry(entry)}>
                            แก้ไข
                          </Button>
                          <Button variant="danger" className="text-xs" onClick={() => setDeletingEntry(entry)}>
                            ลบ
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <KnowledgeHubEntryCard key={entry.id} entry={entry} />
                    ),
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingEntry && (
        <KnowledgeHubEntryEditorDialog
          entry={editingEntry === 'new' ? null : editingEntry}
          lessons={lessons}
          onSave={(input) => {
            if (editingEntry === 'new') {
              addKnowledgeHubEntry(input);
            } else {
              updateKnowledgeHubEntry(editingEntry.id, input);
            }
            setEditingEntry(null);
          }}
          onClose={() => setEditingEntry(null)}
        />
      )}

      {previewingEntry && (
        <KnowledgeHubPreviewDialog
          entry={previewingEntry}
          lesson={lessonById.get(previewingEntry.unlockedByLessonId)}
          onClose={() => setPreviewingEntry(null)}
        />
      )}

      {deletingEntry && (
        <ConfirmDialog
          title="ลบความรู้นี้หรือไม่?"
          message={`การลบ "${deletingEntry.title}" จะเป็นการลบถาวรและไม่สามารถย้อนกลับได้`}
          confirmLabel="ลบ"
          danger
          onConfirm={() => {
            deleteKnowledgeHubEntry(deletingEntry.id);
            setDeletingEntry(null);
          }}
          onCancel={() => setDeletingEntry(null)}
        />
      )}
    </AppShell>
  );
}
