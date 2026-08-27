import type { LessonStep } from '../../types/step';
import { MediaPlaceholder } from './MediaPlaceholder';
import { ContentBlocks } from './ContentBlocks';

export function LessonStepContent({ step }: { step: LessonStep }) {
  return (
    <div>
      {step.media && <MediaPlaceholder media={step.media} />}
      <p className="font-display text-base font-medium text-on-surface">{step.prompt}</p>
      {step.helperText && <p className="mt-1 font-sans text-sm text-secondary">{step.helperText}</p>}
      {step.type === 'info' && (
        <div className="mt-3">
          <ContentBlocks blocks={step.bodyBlocks} />
        </div>
      )}
      {(step.type === 'salesforce-mock-timed' || step.type === 'phone-call-mock') && (
        <div className="mt-3 rounded-lg border border-surface-variant bg-surface-container-low p-3">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">สถานการณ์จำลอง</p>
          <p className="mt-1 font-sans text-sm leading-relaxed text-on-surface-variant">{step.scenario}</p>
        </div>
      )}
    </div>
  );
}
