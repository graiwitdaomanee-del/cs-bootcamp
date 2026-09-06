import type { StepType } from '../../types/step';
import { Icon } from '../common/Icon';
import { STEP_TYPE_ICONS } from './StepEditor';

/** Short, plain-language names for the "add" buttons (no English parenthetical). */
const ADD_LABELS: Record<StepType, string> = {
  info: 'เนื้อหา / ข้อมูล',
  'free-text': 'พิมพ์คำตอบ',
  'single-choice': 'เลือกคำตอบเดียว',
  'multi-choice': 'เลือกได้หลายคำตอบ',
  'live-chat-mock': 'จำลอง Live Chat',
  'salesforce-mock-timed': 'จำลอง Salesforce (จับเวลา)',
  'phone-call-mock': 'จำลองสายโทรเข้า',
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
          className="flex items-center gap-2 rounded-lg border border-outline-variant px-2.5 py-2 text-left transition-all hover:border-success-green hover:bg-success-green/5"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-surface-container-low text-secondary">
            <Icon name={STEP_TYPE_ICONS[type]} className="text-[16px]" />
          </span>
          <span className="truncate font-sans text-xs font-semibold text-on-surface">{ADD_LABELS[type]}</span>
        </button>
      ))}
    </div>
  );
}
