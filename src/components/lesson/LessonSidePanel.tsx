import { useEffect, useMemo, useRef, useState } from 'react';
import type { LessonStep } from '../../types/step';
import type { UserProgress } from '../../types/progress';
import type { ChatTurn } from '../../types/tutor';
import { useAppStore } from '../../store/useAppStore';
import { isKnowledgeHubEntryUnlocked } from '../../utils/lessonAccess';
import {
  buildTutorReply,
  demoExamples,
  extractKeyPoints,
  matchKeyPoints,
  TUTOR_INTRO,
  TUTOR_INTRO_SHORT,
} from '../../utils/tutorEngine';
import { id as makeId } from '../../utils/id';
import { Icon } from '../common/Icon';
import { KnowledgeHub } from './KnowledgeHub';
import { AiTutorPanel } from './AiTutorPanel';

type Tab = 'kb' | 'tutor';

const REPLY_DELAY_MS = 600;

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 font-display text-xs font-semibold transition-colors ${
        active
          ? 'bg-surface-white text-on-surface shadow-ambient'
          : 'text-secondary hover:text-on-surface'
      }`}
    >
      <Icon name={icon} filled={active} className="text-[16px]" />
      {label}
    </button>
  );
}

/**
 * The bottom-left panel of the lesson player / quiz runner: the existing Knowledge Hub
 * plus a mock AI tutor tab. Conversation state lives here (not the store), so it survives
 * step navigation and tab switches within a session and resets on reload like everything else.
 */
export function LessonSidePanel({ userProgress, step }: { userProgress: UserProgress; step: LessonStep }) {
  const lessons = useAppStore((s) => s.lessons);
  const knowledgeHubEntries = useAppStore((s) => s.knowledgeHubEntries);

  const [tab, setTab] = useState<Tab>('kb');
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [hintLevelByStep, setHintLevelByStep] = useState<Record<string, number>>({});
  // Everything the trainee has typed about the current step, so keyword matching is cumulative
  // across the conversation rather than only looking at the latest message.
  const [transcriptByStep, setTranscriptByStep] = useState<Record<string, string>>({});
  const [isTyping, setIsTyping] = useState(false);
  const seenStepRef = useRef<string | null>(null);

  const unlockedKbEntries = useMemo(
    () =>
      knowledgeHubEntries.filter((e) => isKnowledgeHubEntryUnlocked(e.unlockedByLessonId, userProgress)),
    [knowledgeHubEntries, userProgress],
  );
  const completedLessonTitles = useMemo(
    () =>
      lessons.filter((l) => userProgress.lessons[l.id]?.status === 'completed').map((l) => l.title),
    [lessons, userProgress],
  );

  // Demo-walkthrough hint: this step's key points + which of them the conversation has covered.
  const stepKeyPoints = useMemo(() => extractKeyPoints(step), [step]);
  const stepExamples = useMemo(() => demoExamples(step), [step]);
  const coveredTerms = useMemo(() => {
    const transcript = transcriptByStep[step.id] ?? '';
    if (!transcript) return new Set<string>();
    return new Set(matchKeyPoints(transcript, stepKeyPoints).hit.map((k) => k.term));
  }, [transcriptByStep, step.id, stepKeyPoints]);

  // On first mount and on every step change, drop a divider + a short tutor greeting.
  useEffect(() => {
    if (seenStepRef.current === step.id) return;
    const first = seenStepRef.current === null;
    seenStepRef.current = step.id;
    const now = Date.now();
    setTurns((prev) => [
      ...prev,
      { id: makeId('turn'), role: 'divider', text: step.prompt, ts: now },
      { id: makeId('turn'), role: 'tutor', text: first ? TUTOR_INTRO : TUTOR_INTRO_SHORT, ts: now + 1 },
    ]);
  }, [step.id, step.prompt]);

  function handleSend(message: string) {
    if (isTyping) return;
    const now = Date.now();
    setTurns((prev) => [...prev, { id: makeId('turn'), role: 'trainee', text: message, ts: now }]);
    setIsTyping(true);

    const stepId = step.id;
    const substantive = message.trim().length >= 2;
    const prior = transcriptByStep[stepId] ?? '';
    const cumulative = substantive && prior ? `${prior}\n${message}` : message;

    const reply = buildTutorReply({
      step,
      message: cumulative,
      hintLevel: hintLevelByStep[stepId] ?? 0,
      unlockedKbEntries,
      completedLessonTitles,
    });
    if (substantive) {
      setTranscriptByStep((prev) => ({ ...prev, [stepId]: cumulative }));
    }
    window.setTimeout(() => {
      setTurns((prev) => [
        ...prev,
        { id: makeId('turn'), role: 'tutor', text: reply.text, ts: Date.now() },
      ]);
      setHintLevelByStep((prev) => ({ ...prev, [stepId]: reply.nextHintLevel }));
      setIsTyping(false);
    }, REPLY_DELAY_MS);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex shrink-0 gap-1 rounded-lg bg-surface-container-low p-1">
        <TabButton active={tab === 'kb'} onClick={() => setTab('kb')} icon="lightbulb" label="คลังความรู้" />
        <TabButton
          active={tab === 'tutor'}
          onClick={() => setTab('tutor')}
          icon="psychology"
          label="AI ติวเตอร์"
        />
      </div>

      <div className={tab === 'kb' ? 'flex min-h-0 flex-1 flex-col' : 'hidden'}>
        <KnowledgeHub userProgress={userProgress} />
      </div>
      <div className={tab === 'tutor' ? 'flex min-h-0 flex-1 flex-col' : 'hidden'}>
        <AiTutorPanel
          turns={turns}
          isTyping={isTyping}
          active={tab === 'tutor'}
          keyPoints={stepKeyPoints}
          coveredTerms={coveredTerms}
          examples={stepExamples}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
