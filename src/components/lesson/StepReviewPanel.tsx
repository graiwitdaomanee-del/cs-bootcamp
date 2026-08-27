import type { LessonStep } from '../../types/step';
import type { StepAnswerRecord } from '../../types/progress';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

function ReviewChoiceList({
  options,
  correctIds,
  selectedIds,
}: {
  options: { id: string; label: string }[];
  correctIds: string[];
  selectedIds: string[];
}) {
  const correctSet = new Set(correctIds);
  const selectedSet = new Set(selectedIds);
  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const isCorrect = correctSet.has(opt.id);
        const isSelected = selectedSet.has(opt.id);
        let cls = 'border-surface-variant bg-surface-container-low text-secondary';
        if (isCorrect && isSelected) cls = 'border-success-green/40 bg-success-green/10 text-success-green';
        else if (isCorrect && !isSelected) cls = 'border-warning-gold/40 bg-warning-gold/10 text-tertiary';
        else if (!isCorrect && isSelected) cls = 'border-error/40 bg-error-container text-on-error-container';
        return (
          <div key={opt.id} className={`rounded-lg border px-3 py-2 font-sans text-sm ${cls}`}>
            {opt.label}
            {isSelected && <span className="ml-2 text-xs">(คำตอบที่เลือกไว้)</span>}
          </div>
        );
      })}
    </div>
  );
}

export function StepReviewPanel({
  step,
  answerRecord,
  onPrev,
  onNext,
  canPrev,
  canNext,
  onRetakeQuiz,
}: {
  step: LessonStep;
  answerRecord: StepAnswerRecord | undefined;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  onRetakeQuiz: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-2">
        <Badge tone="accent">โหมดทบทวน</Badge>
        {answerRecord?.isCorrect === true && <Badge tone="success">ตอบถูก</Badge>}
        {answerRecord?.isCorrect === false && <Badge tone="danger">ตอบผิด</Badge>}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {step.type === 'info' && <p className="text-sm text-secondary">ขั้นตอนข้อมูล ไม่มีคำตอบให้ทบทวน</p>}

        {step.type === 'free-text' && (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-secondary">คำตอบที่บันทึกไว้</p>
              <p className="mt-1 rounded-lg border border-surface-variant bg-surface-container-low p-3 text-sm text-on-surface">
                {typeof answerRecord?.answer === 'string' && answerRecord.answer
                  ? answerRecord.answer
                  : 'ไม่มีคำตอบที่บันทึกไว้'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-secondary">คำตอบตัวอย่าง</p>
              <p className="mt-1 text-sm text-secondary">{step.modelAnswer}</p>
            </div>
          </div>
        )}

        {step.type === 'live-chat-mock' && (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-secondary">ข้อความตอบกลับที่บันทึกไว้</p>
              <p className="mt-1 rounded-lg border border-surface-variant bg-surface-container-low p-3 text-sm text-on-surface">
                {typeof answerRecord?.answer === 'string' && answerRecord.answer
                  ? answerRecord.answer
                  : 'ไม่มีคำตอบที่บันทึกไว้'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-secondary">คำตอบตัวอย่าง</p>
              <p className="mt-1 text-sm text-secondary">{step.modelReply}</p>
            </div>
          </div>
        )}

        {step.type === 'phone-call-mock' && (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-secondary">คำตอบเสียงที่บันทึกไว้</p>
              <p className="mt-1 rounded-lg border border-surface-variant bg-surface-container-low p-3 text-sm text-on-surface">
                {typeof answerRecord?.answer === 'string' && answerRecord.answer
                  ? answerRecord.answer
                  : 'ไม่มีคำตอบที่บันทึกไว้'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-secondary">แนวทางคำตอบ</p>
              <p className="mt-1 text-sm text-secondary">{step.modelReplyDescription}</p>
            </div>
          </div>
        )}

        {step.type === 'single-choice' && (
          <ReviewChoiceList
            options={step.options}
            correctIds={[step.correctOptionId]}
            selectedIds={typeof answerRecord?.answer === 'string' ? [answerRecord.answer] : []}
          />
        )}

        {step.type === 'multi-choice' && (
          <ReviewChoiceList
            options={step.options}
            correctIds={step.correctOptionIds}
            selectedIds={Array.isArray(answerRecord?.answer) ? answerRecord.answer : []}
          />
        )}

        {step.type === 'salesforce-mock-timed' &&
          (() => {
            let parsed: Record<string, string | null> | null = null;
            if (typeof answerRecord?.answer === 'string') {
              try {
                parsed = JSON.parse(answerRecord.answer);
              } catch {
                parsed = null;
              }
            }
            return (
              <div className="space-y-2 text-sm">
                <p className="text-xs font-semibold text-secondary">เคสที่บันทึกไว้</p>
                <div className="rounded-lg border border-surface-variant bg-surface-container-low p-3 text-on-surface-variant">
                  <p>บัญชี: {parsed?.account ?? '—'}</p>
                  <p>หัวข้อ: {parsed?.subject || '—'}</p>
                  <p>รายละเอียด: {parsed?.description || '—'}</p>
                  <p>ลำดับความสำคัญ: {parsed?.priority || '—'}</p>
                  <p>ประเภทเคส: {parsed?.caseType || '—'}</p>
                </div>
              </div>
            );
          })()}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-surface-variant pt-4">
        <div className="flex gap-2">
          <Button variant="secondary" disabled={!canPrev} onClick={onPrev}>
            ← ก่อนหน้า
          </Button>
          <Button variant="secondary" disabled={!canNext} onClick={onNext}>
            ถัดไป →
          </Button>
        </div>
        <Button onClick={onRetakeQuiz}>ทำแบบทดสอบใหม่</Button>
      </div>
    </div>
  );
}
