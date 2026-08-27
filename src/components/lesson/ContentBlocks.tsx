import type { ContentBlock } from '../../types/contentBlock';
import { MediaPlaceholder } from './MediaPlaceholder';

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((block) => {
        if (block.type === 'text') {
          return (
            <p key={block.id} className="whitespace-pre-line font-sans text-sm leading-relaxed text-on-surface-variant">
              {block.text}
            </p>
          );
        }
        return <MediaPlaceholder key={block.id} media={{ type: block.type, caption: block.caption }} />;
      })}
    </div>
  );
}
