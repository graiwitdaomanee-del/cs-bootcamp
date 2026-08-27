import { useState } from 'react';
import type { KnowledgeHubEntry, KnowledgeHubEntryInput } from '../../types/knowledgeHub';
import type { Lesson } from '../../types/lesson';
import { Button } from '../common/Button';
import { TagInput } from './TagInput';

function emptyEntryInput(defaultLessonId: string): KnowledgeHubEntryInput {
  return {
    title: '',
    body: '',
    tags: [],
    unlockedByLessonId: defaultLessonId,
  };
}

export function KnowledgeHubEntryEditorDialog({
  entry,
  lessons,
  onSave,
  onClose,
}: {
  entry: KnowledgeHubEntry | null;
  lessons: Lesson[];
  onSave: (input: KnowledgeHubEntryInput) => void;
  onClose: () => void;
}) {
  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);
  const [form, setForm] = useState<KnowledgeHubEntryInput>(
    entry
      ? { title: entry.title, body: entry.body, tags: entry.tags, unlockedByLessonId: entry.unlockedByLessonId }
      : emptyEntryInput(sortedLessons[0]?.id ?? ''),
  );

  function handleSave() {
    if (!form.title.trim()) {
      alert('กรุณากรอกชื่อหัวข้อความรู้');
      return;
    }
    if (!form.body.trim()) {
      alert('กรุณากรอกเนื้อหา');
      return;
    }
    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-surface-variant bg-surface-white p-6 shadow-xl">
        <h3 className="mb-4 font-display text-base font-semibold text-on-surface">
          {entry ? 'แก้ไขความรู้' : 'สร้างความรู้ใหม่'}
        </h3>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block font-mono text-xs font-semibold text-secondary">หัวข้อ</label>
            <input
              className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 font-sans text-sm text-on-surface focus:border-success-green focus:outline-none"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="เช่น คู่มือน้ำเสียง (Tone Guide)"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-semibold text-secondary">เนื้อหา</label>
            <textarea
              className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 font-sans text-sm text-on-surface focus:border-success-green focus:outline-none"
              rows={5}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-semibold text-secondary">แท็ก</label>
            <TagInput tags={form.tags} onChange={(tags) => setForm({ ...form, tags })} />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-semibold text-secondary">
              ปลดล็อกเมื่อเรียนบทเรียน
            </label>
            <select
              className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 font-sans text-sm text-on-surface focus:border-success-green focus:outline-none"
              value={form.unlockedByLessonId}
              onChange={(e) => setForm({ ...form, unlockedByLessonId: e.target.value })}
            >
              {sortedLessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button onClick={handleSave}>บันทึกความรู้</Button>
        </div>
      </div>
    </div>
  );
}
