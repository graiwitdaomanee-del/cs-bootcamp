import type { StepType } from '../../types/step';
import { Icon } from '../common/Icon';
import { STEP_TYPE_ICONS, STEP_TYPE_LABELS } from './StepEditor';

const BLOCK_DESCRIPTIONS: Record<StepType, string> = {
  info: 'เนื้อหาข้อความ/สื่อ',
  'free-text': 'ให้พิมพ์คำตอบ',
  'single-choice': 'เลือกคำตอบเดียว',
  'multi-choice': 'เลือกได้หลายคำตอบ',
  'salesforce-mock-timed': 'จำลองหน้าจอ Salesforce',
  'live-chat-mock': 'จำลองแชทแบบโต้ตอบ',
  'phone-call-mock': 'จำลองสายโทรเข้า (อัดเสียงตอบ)',
};

const ALL_TYPES: StepType[] = [
  'info',
  'free-text',
  'single-choice',
  'multi-choice',
  'live-chat-mock',
  'salesforce-mock-timed',
  'phone-call-mock',
];

export function AddBlockPalette({
  allowedTypes,
  onAdd,
}: {
  allowedTypes?: StepType[];
  onAdd: (type: StepType) => void;
}) {
  const types = allowedTypes ?? ALL_TYPES;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onAdd(type)}
          className="flex items-center gap-2 rounded-lg border border-outline-variant p-2.5 text-left transition-all hover:border-success-green hover:bg-success-green/5"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-surface-container-low text-secondary">
            <Icon name={STEP_TYPE_ICONS[type]} className="text-[18px]" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-sans text-xs font-semibold text-on-surface">
              {STEP_TYPE_LABELS[type]}
            </span>
            <span className="block truncate font-mono text-[10px] text-secondary">{BLOCK_DESCRIPTIONS[type]}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
