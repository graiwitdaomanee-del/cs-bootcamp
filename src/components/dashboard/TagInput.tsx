import { useState } from 'react';
import { Icon } from '../common/Icon';

/** Normalizes free-text tag entry: lowercase, spaces/underscores to hyphens, strips other punctuation. */
function normalizeTag(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9ก-๙-]/g, '');
}

export function TagInput({
  tags,
  onChange,
  placeholder = 'พิมพ์แท็กแล้วกด Enter',
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');

  function commitDraft() {
    const normalized = normalizeTag(draft);
    if (normalized && !tags.includes(normalized)) {
      onChange([...tags, normalized]);
    }
    setDraft('');
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-white p-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full bg-success-green/10 px-2.5 py-1 font-mono text-xs text-success-green"
          >
            #{tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-error">
              <Icon name="close" className="text-[12px]" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              commitDraft();
            } else if (e.key === 'Backspace' && draft === '' && tags.length > 0) {
              removeTag(tags[tags.length - 1]);
            }
          }}
          onBlur={commitDraft}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="min-w-[120px] flex-1 border-none bg-transparent px-1 py-0.5 font-sans text-sm text-on-surface outline-none"
        />
      </div>
      <p className="mt-1 font-mono text-[10px] text-secondary">
        แท็กจะถูกแปลงเป็นตัวพิมพ์เล็กและใช้ - แทนช่องว่างโดยอัตโนมัติ
      </p>
    </div>
  );
}
