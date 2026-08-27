export function LessonBreadcrumb({
  totalSteps,
  currentIndex,
  answeredIndices,
  onStepClick,
}: {
  totalSteps: number;
  currentIndex: number;
  answeredIndices: Set<number>;
  onStepClick?: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isCurrent = i === currentIndex;
        const isDone = answeredIndices.has(i) && !isCurrent;
        return (
          <div
            key={i}
            onClick={onStepClick ? () => onStepClick(i) : undefined}
            className={`h-2 flex-1 rounded-full transition-colors ${onStepClick ? 'cursor-pointer' : ''} ${
              isCurrent
                ? 'bg-success-green'
                : isDone
                  ? 'bg-warning-gold'
                  : 'bg-surface-container'
            }`}
            title={`ขั้นตอนที่ ${i + 1}`}
          />
        );
      })}
    </div>
  );
}
