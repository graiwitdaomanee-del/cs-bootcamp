import type { LessonStep } from '../../types/step';
import { Button } from '../common/Button';
import { FreeTextQuestion } from './questions/FreeTextQuestion';
import { SingleChoiceQuestion } from './questions/SingleChoiceQuestion';
import { MultiChoiceQuestion } from './questions/MultiChoiceQuestion';
import { SalesforceMockStep } from './questions/SalesforceMockStep';
import { LiveChatMockQuestion } from './questions/LiveChatMockQuestion';
import { PhoneCallMockQuestion } from './questions/PhoneCallMockQuestion';

export function AnswerPanel({
  step,
  onComplete,
}: {
  step: LessonStep;
  onComplete: (answer: string | string[]) => void;
}) {
  switch (step.type) {
    case 'info':
      return (
        <div>
          <p className="mb-4 font-sans text-sm text-secondary">ขั้นตอนนี้ไม่ต้องตอบคำถาม</p>
          <Button onClick={() => onComplete('')}>ถัดไป</Button>
        </div>
      );
    case 'free-text':
      return <FreeTextQuestion step={step} onComplete={onComplete} />;
    case 'single-choice':
      return <SingleChoiceQuestion step={step} onComplete={onComplete} />;
    case 'multi-choice':
      return <MultiChoiceQuestion step={step} onComplete={onComplete} />;
    case 'salesforce-mock-timed':
      return <SalesforceMockStep step={step} onComplete={onComplete} />;
    case 'live-chat-mock':
      return <LiveChatMockQuestion step={step} onComplete={onComplete} />;
    case 'phone-call-mock':
      return <PhoneCallMockQuestion step={step} onComplete={onComplete} />;
  }
}
