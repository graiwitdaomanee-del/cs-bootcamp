import { Icon } from '../common/Icon';

/** Inline "why the save was blocked" panel — replaces alert() in the lesson/quiz editors. */
export function EditorIssuesPanel({
  errors,
  onDismiss,
  className = '',
}: {
  errors: string[];
  onDismiss: () => void;
  className?: string;
}) {
  if (errors.length === 0) return null;
  return (
    <div className={`rounded-xl border border-error/30 bg-error-container/40 p-4 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="flex items-center gap-2 font-display text-sm font-semibold text-on-error-container">
          <Icon name="error" filled className="text-[18px]" />
          ยังบันทึกไม่ได้ — มี {errors.length} จุดที่ต้องแก้
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="text-on-error-container/70 hover:text-on-error-container"
          title="ปิด"
        >
          <Icon name="close" className="text-[18px]" />
        </button>
      </div>
      <ul className="mt-2 space-y-1">
        {errors.map((err) => (
          <li key={err} className="flex gap-1.5 font-sans text-xs text-on-error-container">
            <span>•</span>
            {err}
          </li>
        ))}
      </ul>
    </div>
  );
}
