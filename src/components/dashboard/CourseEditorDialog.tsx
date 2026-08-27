import { useState } from 'react';
import type { Course, CourseInput, CourseStatus } from '../../types/course';
import { Button } from '../common/Button';

function emptyCourseInput(order: number): CourseInput {
  return {
    slug: '',
    title: '',
    shortName: '',
    description: '',
    icon: '📘',
    logoUrl: undefined,
    status: 'active',
    order,
  };
}

export function CourseEditorDialog({
  course,
  nextOrder,
  onSave,
  onClose,
}: {
  course: Course | null;
  nextOrder: number;
  onSave: (input: CourseInput) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CourseInput>(
    course
      ? {
          slug: course.slug,
          title: course.title,
          shortName: course.shortName,
          description: course.description,
          icon: course.icon,
          logoUrl: course.logoUrl,
          status: course.status,
          order: course.order,
        }
      : emptyCourseInput(nextOrder),
  );

  function handleLogoFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, logoUrl: typeof reader.result === 'string' ? reader.result : undefined }));
    };
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!form.title.trim()) {
      alert('กรุณากรอกชื่อคอร์ส');
      return;
    }
    const slug = form.slug.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    onSave({ ...form, slug, shortName: form.shortName.trim() || form.title });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl border border-surface-variant bg-surface-white p-6 shadow-xl">
        <h3 className="mb-4 text-base font-semibold text-on-surface">
          {course ? 'แก้ไขคอร์ส' : 'สร้างคอร์สใหม่'}
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-secondary">ไอคอน</label>
              <input
                className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-center text-lg"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-secondary">ชื่อคอร์ส</label>
              <input
                className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-secondary">โลโก้คอร์ส (ถ้าไม่อัปโหลด จะใช้ไอคอนด้านบนแทน)</label>
            <div className="flex items-center gap-3">
              {form.logoUrl ? (
                <img src={form.logoUrl} alt="ตัวอย่างโลโก้" className="h-12 w-12 rounded-lg border border-surface-variant object-cover" />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-outline-variant text-2xl">
                  {form.icon}
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                className="flex-1 text-xs text-secondary"
                onChange={(e) => handleLogoFile(e.target.files?.[0])}
              />
              {form.logoUrl && (
                <Button variant="ghost" className="text-xs" onClick={() => setForm({ ...form, logoUrl: undefined })}>
                  ลบโลโก้
                </Button>
              )}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-secondary">ชื่อย่อ (แสดงบนป้าย)</label>
            <input
              className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface"
              value={form.shortName}
              onChange={(e) => setForm({ ...form, shortName: e.target.value })}
              placeholder="เช่น WMA"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-secondary">คำอธิบาย</label>
            <textarea
              className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-secondary">สถานะ</label>
            <select
              className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as CourseStatus })}
            >
              <option value="active">เปิดใช้งาน (Active)</option>
              <option value="wip">กำลังจัดทำ (Coming Soon)</option>
            </select>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button onClick={handleSave}>บันทึกคอร์ส</Button>
        </div>
      </div>
    </div>
  );
}
