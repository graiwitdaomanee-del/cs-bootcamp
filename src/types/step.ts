import type { ContentBlock } from './contentBlock';

export type StepType =
  | 'info'
  | 'free-text'
  | 'single-choice'
  | 'multi-choice'
  | 'salesforce-mock-timed'
  | 'live-chat-mock'
  | 'phone-call-mock';

export interface StepMedia {
  type: 'image' | 'video';
  caption: string;
}

interface BaseStep {
  id: string;
  order: number;
  type: StepType;
  prompt: string;
  helperText?: string;
  media?: StepMedia;
  /** Optional per-step countdown; when set, the answer panel shows a timer and auto-submits on expiry. */
  timeLimitSeconds?: number;
}

export interface InfoStep extends BaseStep {
  type: 'info';
  bodyBlocks: ContentBlock[];
}

export interface FreeTextStep extends BaseStep {
  type: 'free-text';
  minLength: number;
  sampleAnswerKeywords: string[];
  modelAnswer: string;
}

export interface ChoiceOption {
  id: string;
  label: string;
}

export interface SingleChoiceStep extends BaseStep {
  type: 'single-choice';
  options: ChoiceOption[];
  correctOptionId: string;
  explanation: string;
}

export interface MultiChoiceStep extends BaseStep {
  type: 'multi-choice';
  options: ChoiceOption[];
  correctOptionIds: string[];
  explanation: string;
}

export interface SalesforceMockAccount {
  id: string;
  merchantName: string;
  businessType: string;
}

export interface SalesforceIdealCase {
  subject: string;
  description: string;
  priority: string;
  caseType: string;
  accountId: string;
}

export interface SalesforceMockStep extends BaseStep {
  type: 'salesforce-mock-timed';
  scenario: string;
  priorityOptions: string[];
  caseTypeOptions: string[];
  mockAccounts: SalesforceMockAccount[];
  idealCase: SalesforceIdealCase;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'agent';
  text: string;
}

export interface LiveChatMockStep extends BaseStep {
  type: 'live-chat-mock';
  openingMessages: ChatMessage[];
  modelReply: string;
  sampleReplyKeywords: string[];
}

export interface PhoneCallMockStep extends BaseStep {
  type: 'phone-call-mock';
  scenario: string;
  /** Transcript lines of what the caller said, shown before the trainee records a reply. */
  callerLines: string[];
  /** Talking points shown after submit, for self-assessment (no audio grading). */
  modelReplyDescription: string;
  sampleReplyKeywords: string[];
}

export type LessonStep =
  | InfoStep
  | FreeTextStep
  | SingleChoiceStep
  | MultiChoiceStep
  | SalesforceMockStep
  | LiveChatMockStep
  | PhoneCallMockStep;
