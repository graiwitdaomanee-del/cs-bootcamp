import type { ContentBlock } from '../../types/contentBlock';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import { id as makeId } from '../../utils/id';

const BLOCK_TYPE_ICONS: Record<ContentBlock['type'], string> = {
  text: 'article',
  image: 'image',
  video: 'play_circle',
};

const BLOCK_TYPE_LABELS: Record<ContentBlock['type'], string> = {
  text: 'ข้อความ',
  image: 'รูปภาพ',
  video: 'วิดีโอ',
};

function newBlock(type: ContentBlock['type']): ContentBlock {
  if (type === 'text') return { id: makeId('block'), type, text: '' };
  return { id: makeId('block'), type, caption: '' };
}

export function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}) {
  function updateBlock(index: number, next: ContentBlock) {
    onChange(blocks.map((b, i) => (i === index ? next : b)));
  }

  function removeBlock(index: number) {
    onChange(blocks.filter((_, i) => i !== index));
  }

  function moveBlock(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function addBlock(type: ContentBlock['type']) {
    onChange([...blocks, newBlock(type)]);
  }

  return (
    <div className="space-y-3">
      {blocks.length === 0 && (
        <p className="rounded-lg border border-dashed border-outline-variant bg-surface-container-low p-4 text-sm text-secondary">
          ยังไม่มีเนื้อหา — เริ่มเพิ่มข้อความ รูปภาพ หรือวิดีโอด้านล่าง
        </p>
      )}
      {blocks.map((block, index) => (
        <div key={block.id} className="rounded-lg border border-surface-variant bg-surface-container-low p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
              <Icon name={BLOCK_TYPE_ICONS[block.type]} className="text-[16px]" /> {BLOCK_TYPE_LABELS[block.type]}
            </span>
            <div className="flex gap-1">
              <Button variant="ghost" className="p-1.5" onClick={() => moveBlock(index, -1)}>
                <Icon name="keyboard_arrow_up" className="text-[16px]" />
              </Button>
              <Button variant="ghost" className="p-1.5" onClick={() => moveBlock(index, 1)}>
                <Icon name="keyboard_arrow_down" className="text-[16px]" />
              </Button>
              <Button variant="danger" className="p-1.5" onClick={() => removeBlock(index)}>
                <Icon name="delete" className="text-[16px]" />
              </Button>
            </div>
          </div>
          {block.type === 'text' ? (
            <textarea
              className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface"
              rows={4}
              placeholder="พิมพ์เนื้อหาข้อความ..."
              value={block.text}
              onChange={(e) => updateBlock(index, { ...block, text: e.target.value })}
            />
          ) : (
            <>
              <input
                className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface"
                placeholder={block.type === 'image' ? 'คำบรรยายรูปภาพ' : 'คำบรรยายวิดีโอ'}
                value={block.caption}
                onChange={(e) => updateBlock(index, { ...block, caption: e.target.value })}
              />
              <p className="mt-1 font-sans text-[11px] text-secondary">
                ระบบนี้ไม่ได้อัปโหลดไฟล์จริง — ใส่คำบรรยายว่าภาพ/วิดีโอนี้แสดงอะไร
              </p>
            </>
          )}
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" className="text-xs" onClick={() => addBlock('text')}>
          + เพิ่มข้อความ
        </Button>
        <Button variant="secondary" className="text-xs" onClick={() => addBlock('image')}>
          + เพิ่มรูปภาพ
        </Button>
        <Button variant="secondary" className="text-xs" onClick={() => addBlock('video')}>
          + เพิ่มวิดีโอ
        </Button>
      </div>
    </div>
  );
}
