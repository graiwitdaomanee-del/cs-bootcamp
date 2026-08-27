import type { StepMedia } from '../../types/step';
import { Icon } from '../common/Icon';

export function MediaPlaceholder({ media }: { media: StepMedia }) {
  return (
    <div className="mb-3 flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-outline-variant bg-surface-container-low text-secondary">
      <Icon name={media.type === 'video' ? 'play_circle' : 'image'} filled className="text-3xl" />
      <span className="font-sans text-xs font-medium">
        {media.type === 'video' ? 'วิดีโอ (ตัวอย่างสาธิต)' : 'รูปภาพ (ตัวอย่างสาธิต)'}
      </span>
      <span className="px-4 text-center font-sans text-[11px] text-secondary">{media.caption}</span>
    </div>
  );
}
