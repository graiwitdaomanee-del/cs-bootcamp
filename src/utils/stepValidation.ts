import type { LessonStep } from '../types/step';

/**
 * Returns a list of human-readable (Thai) problems that would make this step
 * broken or confusing for a trainee. An empty list means the step is complete.
 * Pure — safe to call on every render.
 */
export function getStepIssues(step: LessonStep): string[] {
  const issues: string[] = [];
  const prompt = step.prompt.trim();

  if (step.type === 'info') {
    const emptyBlock = step.bodyBlocks.some((b) =>
      b.type === 'text' ? !b.text.trim() : !b.caption.trim(),
    );
    if (!prompt && step.bodyBlocks.length === 0) {
      issues.push('ยังไม่ได้ใส่หัวข้อหรือเนื้อหา');
    }
    if (emptyBlock) issues.push('มีบล็อกเนื้อหาที่ยังว่างอยู่');
    return issues;
  }

  if (!prompt) issues.push('ยังไม่ได้ใส่โจทย์/หัวข้อคำถาม');

  switch (step.type) {
    case 'free-text': {
      if (!step.modelAnswer.trim()) issues.push('ยังไม่ได้ใส่คำตอบตัวอย่าง');
      if (step.minLength <= 0) issues.push('ความยาวขั้นต่ำต้องมากกว่า 0');
      break;
    }
    case 'single-choice':
    case 'multi-choice': {
      const validIds = new Set(step.options.map((o) => o.id));
      if (step.options.length < 2) issues.push('ต้องมีอย่างน้อย 2 ตัวเลือก');
      if (step.options.some((o) => !o.label.trim())) issues.push('มีตัวเลือกที่ยังว่างอยู่');
      const correct =
        step.type === 'single-choice' ? [step.correctOptionId] : step.correctOptionIds;
      const validCorrect = correct.filter((id) => id && validIds.has(id));
      if (validCorrect.length === 0) {
        issues.push(
          step.type === 'single-choice'
            ? 'ยังไม่ได้เลือกคำตอบที่ถูก'
            : 'ยังไม่ได้เลือกคำตอบที่ถูก (อย่างน้อย 1 ข้อ)',
        );
      }
      if (!step.explanation.trim()) issues.push('ยังไม่ได้ใส่คำอธิบายเฉลย');
      break;
    }
    case 'live-chat-mock': {
      if (step.openingMessages.length === 0) issues.push('ยังไม่มีข้อความบทสนทนาที่มาก่อน');
      if (step.openingMessages.some((m) => !m.text.trim())) {
        issues.push('มีข้อความบทสนทนาที่ยังว่าง');
      }
      if (!step.modelReply.trim()) issues.push('ยังไม่ได้ใส่ข้อความตอบกลับตัวอย่าง');
      break;
    }
    case 'phone-call-mock': {
      if (!step.scenario.trim()) issues.push('ยังไม่ได้ใส่รายละเอียดสถานการณ์การโทร');
      if (step.callerLines.length === 0 || step.callerLines.every((l) => !l.trim())) {
        issues.push('ยังไม่ได้ใส่สิ่งที่ผู้โทรเข้าพูด');
      } else if (step.callerLines.some((l) => !l.trim())) {
        issues.push('มีบรรทัดผู้โทรที่ยังว่าง');
      }
      if (!step.modelReplyDescription.trim()) issues.push('ยังไม่ได้ใส่แนวทางคำตอบ');
      break;
    }
    case 'salesforce-mock-timed': {
      if (!step.scenario.trim()) issues.push('ยังไม่ได้ใส่รายละเอียดสถานการณ์จำลอง');
      if (step.mockAccounts.length === 0) issues.push('ยังไม่มีบัญชีร้านค้าจำลอง');
      if (step.mockAccounts.some((a) => !a.merchantName.trim())) {
        issues.push('มีบัญชีร้านค้าที่ยังไม่ได้ตั้งชื่อ');
      }
      const c = step.idealCase;
      if (!c.subject.trim()) issues.push('ยังไม่ได้ใส่หัวข้อเคสที่ถูกต้อง');
      if (!c.description.trim()) issues.push('ยังไม่ได้ใส่รายละเอียดเคสที่ถูกต้อง');
      if (!c.priority) issues.push('ยังไม่ได้เลือกลำดับความสำคัญที่ถูกต้อง');
      if (!c.caseType) issues.push('ยังไม่ได้เลือกประเภทเคสที่ถูกต้อง');
      if (!c.accountId || !step.mockAccounts.some((a) => a.id === c.accountId)) {
        issues.push('ยังไม่ได้เลือกบัญชีร้านค้าที่ถูกต้อง');
      }
      break;
    }
  }

  return issues;
}
