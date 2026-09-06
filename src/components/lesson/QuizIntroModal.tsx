import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

/**
 * Shown once the trainee finishes the last lesson step, before the quiz gate.
 * A heads-up that a short randomised quiz comes next — mirrors LessonCompleteModal
 * so the lesson is bookended (steps done → quiz → lesson done).
 */
export function QuizIntroModal({ onStart }: { onStart: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-surface-variant bg-surface-white p-6 text-center shadow-2xl">
        <div className="mb-2 flex justify-center text-tertiary">
          <Icon name="quiz" filled className="text-5xl" />
        </div>
        <h2 className="font-display text-xl font-bold text-on-surface">ทำครบทุกขั้นตอนแล้ว!</h2>
        <p className="mt-2 font-sans text-sm leading-relaxed text-secondary">
          ต่อไปเป็นแบบทดสอบสวมบทบาท — สุ่ม 2–3 ข้อ จากบทเรียนนี้และบทที่คุณผ่านมา
          ต้องตอบถูกทุกข้อจึงจะผ่านบทเรียน (ถ้าไม่ผ่าน ลองใหม่ได้ คำถามจะเปลี่ยนชุดทุกครั้ง)
        </p>
        <div className="mt-5">
          <Button onClick={onStart} className="w-full">
            เริ่มทำแบบทดสอบ <Icon name="arrow_forward" className="text-[16px]" />
          </Button>
        </div>
      </div>
    </div>
  );
}
