import type { KnowledgeHubEntry } from '../../types/knowledgeHub';

export function KnowledgeHubEntryCard({ entry }: { entry: KnowledgeHubEntry }) {
  return (
    <div className="rounded-lg border border-surface-variant bg-surface-white p-3 transition-colors hover:border-success-green">
      <h4 className="font-display text-sm font-semibold text-success-green">{entry.title}</h4>
      <p className="mt-1 font-sans text-xs leading-relaxed text-secondary">{entry.body}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {entry.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-surface-container px-2 py-0.5 font-mono text-[10px] text-secondary"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
