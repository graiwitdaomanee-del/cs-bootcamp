import type { LessonStep } from '../types/step';
import type { KnowledgeHubEntry } from '../types/knowledgeHub';

/**
 * Mock AI tutor. No network, no model — it compares what the trainee types against the
 * key points a step already carries (sampleAnswerKeywords / correct options / idealCase)
 * and walks an escalating hint ladder. It never prints the model answer.
 */

export type CoachMode = 'keyword' | 'reasoning' | 'takeaway';

export interface KeyPoint {
  /** The phrase as authored in the seed — safe to echo back once the trainee has said it. */
  term: string;
  /** Lowercased term + paraphrases; any of these appearing in the message counts as covered. */
  matchers: string[];
}

export interface MatchResult {
  hit: KeyPoint[];
  missing: KeyPoint[];
}

export interface TutorContext {
  step: LessonStep;
  message: string;
  /** Substantive hints already given for THIS step (0 on the first message). */
  hintLevel: number;
  /** KB entries currently unlocked for this trainee. */
  unlockedKbEntries: KnowledgeHubEntry[];
  /** Titles of lessons this trainee has completed, for "remember from lesson X" callbacks. */
  completedLessonTitles: string[];
}

export interface TutorReply {
  text: string;
  nextHintLevel: number;
  /** True once the trainee has covered every key point — the UI can ease off. */
  resolved: boolean;
}

export const TUTOR_INTRO =
  'สวัสดี เราเป็นติวเตอร์จำลองของบทนี้ พิมพ์สิ่งที่คุณกำลังคิดเกี่ยวกับข้อนี้มาได้เลย ' +
  'เราจะช่วยตั้งคำถามและชี้จุดที่ยังขาด แต่จะไม่บอกคำตอบตรง ๆ นะ';

export const TUTOR_INTRO_SHORT =
  'มาถึงข้อใหม่แล้ว — บอกเราว่าคุณคิดยังไงกับข้อนี้ เดี๋ยวเราชวนคิดต่อ';

/**
 * Thai paraphrase map. Keys are canonical seed keywords (lowercased); values are other
 * surface forms a trainee might type. Deliberately conservative — this is a coach, not a
 * grader, so an occasional "keep going" when the trainee was close does no harm.
 */
const SYNONYMS: Record<string, string[]> = {
  'เข้าใจ': ['เห็นใจ', 'เข้าอกเข้าใจ', 'เข้าใจความรู้สึก', 'รับรู้ความรู้สึก'],
  'ขอโทษ': ['เสียใจ', 'ขออภัย', 'ต้องขอโทษ', 'ขอโทษด้วย'],
  'ตรวจสอบ': ['เช็ก', 'เช็ค', 'ดูให้', 'ตรวจดู', 'สอบทาน', 'ไล่ดู', 'ตรวจเช็ก'],
  'ติดตาม': ['ตามเรื่อง', 'ตามให้', 'ตามต่อ', 'ติดตามผล', 'ตามเคส'],
  'อัปเดต': ['อัพเดท', 'อัพเดต', 'แจ้งความคืบหน้า', 'รายงานความคืบหน้า'],
  'แจ้งผล': ['แจ้งกลับ', 'แจ้งความคืบหน้า', 'บอกผล', 'อัปเดตผล', 'แจ้งให้ทราบ'],
  'แจ้งกลับ': ['ติดต่อกลับ', 'ตอบกลับ', 'แจ้งผลกลับ'],
  'คืนเงิน': ['รีฟันด์', 'refund', 'เงินคืน', 'ขอเงินคืน'],
  'ชดเชย': ['เยียวยา', 'ชดใช้', 'คืนส่วนต่าง', 'ชดเชยเงิน'],
  'หลักฐาน': ['รูปถ่าย', 'ภาพถ่าย', 'รูปภาพ', 'หลักฐานการแพ็ก', 'บันทึกภาพ', 'proof'],
  'พิจารณา': ['ประเมิน', 'ดูความเหมาะสม', 'ชั่งน้ำหนัก'],
  'บันทึกเคส': ['เปิดเคส', 'สร้างเคส', 'ลงเคส', 'บันทึกเรื่อง', 'log เคส'],
  'ส่งต่อ': ['เอสคาเลท', 'escalate', 'ส่งต่อทีม', 'ส่งเรื่องต่อ', 'ยกระดับ', 'ส่งให้ทีม'],
  'ระยะเวลา': ['กรอบเวลา', 'ภายในกี่วัน', 'ใช้เวลา', 'กำหนดเวลา', 'sla', 'เมื่อไหร่', 'ภายใน'],
  'ช่วงเวลา': ['ชั่วโมงเร่งด่วน', 'ช่วงพีค', 'เวลานั้น', 'ช่วงนั้น'],
  'ไรเดอร์': ['คนขับ', 'พนักงานส่ง', 'rider', 'ไรเดอร์ว่าง'],
  'พื้นที่': ['โซน', 'ย่าน', 'บริเวณ', 'area'],
  'เมนู': ['รายการอาหาร', 'menu', 'รายการเมนู'],
  'หมวดหมู่': ['หมวด', 'category', 'ประเภทเมนู'],
  'โปรไฟล์': ['หน้าร้าน', 'profile', 'ข้อมูลร้าน', 'โปรไฟล์ร้าน'],
  'การจัดอันดับ': ['อันดับการค้นหา', 'ranking', 'ลำดับการแสดง', 'อันดับ'],
  'ค้นหา': ['เสิร์ช', 'search', 'หาในแอป'],
  'มองเห็น': ['การมองเห็น', 'ถูกค้นเจอ', 'visibility', 'ปรากฏ'],
  'โฆษณา': ['ads', 'แอด', 'ยิงแอด', 'ad', 'ค่าโฆษณา'],
  'จ่ายเงิน': ['เสียเงิน', 'จ่ายเพิ่ม', 'จ่ายค่าโฆษณา'],
  'ค่าใช้จ่าย': ['ค่าบริการ', 'ค่าธรรมเนียม', 'ต้นทุน'],
  'ยอดโอน': ['เงินโอน', 'ยอดเงินเข้า', 'payout', 'ยอดที่ได้รับ'],
  'ของขาด': ['ของหาย', 'ของไม่ครบ', 'สินค้าขาด', 'ขาดรายการ'],
  'ไม่ครบ': ['ไม่สมบูรณ์', 'ขาด', 'ยังไม่ครบ', 'ไม่เต็ม'],
  'bom': ['สูตร', 'สูตรการผลิต', 'bill of materials', 'สูตรสินค้า'],
  'สูตร': ['bom', 'สูตรการผลิต', 'ส่วนผสม'],
  'ตัดสต๊อก': ['ตัดสต็อก', 'หักสต๊อก', 'ลดสต๊อก', 'ตัดวัตถุดิบ', 'หักวัตถุดิบ'],
  'วัตถุดิบ': ['ส่วนผสม', 'ของในสต๊อก', 'ingredient'],
  'อัตโนมัติ': ['ออโต้', 'ตัดเอง', 'ระบบทำให้เอง', 'automatic'],
  'เชื่อมต่อ': ['สัญญาณ', 'ต่อเน็ต', 'การเชื่อมต่อ', 'wifi', 'ไวไฟ', 'บลูทูธ', 'เน็ต'],
  'กระดาษ': ['ม้วนกระดาษ', 'กระดาษสลิป', 'กระดาษหมด'],
  'เปิดเครื่อง': ['เปิดปิดเครื่อง', 'รีสตาร์ทเครื่อง', 'พาวเวอร์', 'แบตเตอรี่', 'แบต'],
  'รีสตาร์ท': ['เปิดปิดใหม่', 'restart', 'รีเครื่อง', 'รีบูต', 'รีแอป'],
  'แอปพื้นหลัง': ['แอปที่เปิดค้าง', 'background app', 'ปิดแอปอื่น'],
  'พื้นที่ว่าง': ['ความจุ', 'storage', 'เมโมรี่', 'พื้นที่เก็บข้อมูล'],
  'ค่าคอมมิชชัน': ['ค่า gp', 'gp', 'ส่วนแบ่ง', 'คอมมิชชัน'],
  'โปรโมชัน': ['โปร', 'ส่วนลด', 'แคมเปญ', 'promotion'],
  'ระบบ': ['แอป', 'แพลตฟอร์ม', 'system'],
  'สนับสนุน': ['ทีมสนับสนุน', 'ทีมซัพพอร์ต', 'support', 'ฝ่ายช่วยเหลือ'],
  'ทีละเรื่อง': ['ทีละประเด็น', 'แยกเป็นข้อ', 'ทีละข้อ'],
};

interface Category {
  match: string[];
  label: string;
  probe: string;
}

const CATEGORIES: Category[] = [
  {
    match: ['เข้าใจ', 'ขอโทษ', 'เห็นใจ', 'ขออภัย', 'เสียใจ', 'น้ำเสียง'],
    label: 'การเปิดด้วยความเข้าใจต่อความรู้สึกของอีกฝ่าย',
    probe:
      'ตอนนี้อีกฝ่ายกำลังรู้สึกยังไง แล้วประโยคแรกของคุณรับความรู้สึกนั้นก่อนจะเข้าเรื่องข้อมูลไหม?',
  },
  {
    match: ['7 วัน', 'ระยะเวลา', 'ช่วงเวลา', 'กรอบเวลา', 'sla', 'เมื่อไหร่', 'ภายใน', 'กำหนดเวลา'],
    label: 'การบอกกรอบเวลาที่ชัดเจน',
    probe:
      'ถ้าคุณเป็นฝ่ายที่ต้องรอ คุณอยากรู้ "ภายในเมื่อไหร่" แค่ไหน — คำตอบตอนนี้ระบุกรอบเวลาให้เขาหรือยัง?',
  },
  {
    match: ['ติดตาม', 'อัปเดต', 'อัพเดท', 'แจ้งผล', 'แจ้งกลับ', 'ความคืบหน้า', 'ตามเรื่อง', 'ตามเคส'],
    label: 'การรับปากว่าจะติดตามและแจ้งผลกลับ',
    probe:
      'หลังจบบทสนทนานี้ ใครเป็นคนตามเรื่องต่อ และอีกฝ่ายจะได้รู้ผลตอนไหน ผ่านช่องทางไหน?',
  },
  {
    match: ['ตรวจสอบ', 'หลักฐาน', 'เช็ก', 'ตรวจดู', 'พิจารณา', 'รูปภาพ', 'รูปถ่าย', 'ประเมิน'],
    label: 'ขั้นตอนการตรวจสอบข้อเท็จจริงก่อนสรุป',
    probe:
      'ก่อนจะสรุปว่าใครผิดหรือจะชดเชยเท่าไหร่ คุณต้องดูข้อมูลอะไรบ้าง และจะบอกอีกฝ่ายไหมว่ากำลังตรวจสอบอยู่?',
  },
  {
    match: ['คืนเงิน', 'ชดเชย', 'เงินคืน', 'ยอดโอน', 'ชดใช้', 'ส่วนต่าง', 'รีฟันด์'],
    label: 'แนวทางเรื่องการคืนเงินหรือชดเชย',
    probe:
      'ถ้าตรวจสอบแล้วพบว่าเป็นความผิดพลาดของระบบจริง ขั้นถัดไปเรื่องเงินของอีกฝ่ายคืออะไร?',
  },
  {
    match: ['ส่งต่อ', 'บันทึกเคส', 'เปิดเคส', 'เอสคาเลท', 'escalate', 'ยกระดับ', 'ทีม'],
    label: 'การบันทึกเคสและส่งต่อทีมที่รับผิดชอบ',
    probe: 'เรื่องนี้จบที่คุณได้เลย หรือควรบันทึกเป็นเคสและส่งต่อให้ทีมอื่นดูแลต่อ?',
  },
  {
    match: ['ทีละเรื่อง', 'ความเร่งด่วน', 'priority', 'ก่อนหลัง', 'ลำดับ', 'ผลกระทบ', 'เร่งด่วน'],
    label: 'การจัดลำดับตามผลกระทบ ไม่ใช่ลำดับที่ทักเข้ามา',
    probe:
      'ถ้ามีหลายเรื่องพร้อมกัน เกณฑ์ตัดสินว่าทำอันไหนก่อนคืออะไร — ใครทักมาก่อน หรือผลกระทบของใครหนักกว่า?',
  },
  {
    match: ['เชื่อมต่อ', 'รีสตาร์ท', 'เปิดเครื่อง', 'กระดาษ', 'แบต', 'สัญญาณ', 'พื้นที่ว่าง', 'แอปพื้นหลัง', 'wifi'],
    label: 'การไล่ตรวจสาเหตุพื้นฐานก่อนส่งต่อทีมช่าง',
    probe:
      'ก่อนจะบอกว่าเครื่องเสีย มีอะไรพื้นฐานให้ลองก่อนไหม เช่น การเชื่อมต่อ การเปิดปิดเครื่อง หรือวัสดุสิ้นเปลือง?',
  },
  {
    match: ['เมนู', 'โปรไฟล์', 'หมวดหมู่', 'ไม่ครบ', 'การจัดอันดับ', 'ค้นหา', 'มองเห็น', 'ครบถ้วน', 'เผยแพร่'],
    label: 'ความครบถ้วนของเมนูหรือโปรไฟล์และผลต่อการถูกค้นเจอ',
    probe:
      'การที่ร้านถูกค้นเจอยากมักเกี่ยวกับความครบถ้วนหรือสถานะเผยแพร่ของเมนู/โปรไฟล์ มากกว่าค่าโฆษณา — คำตอบของคุณชี้ไปทางไหน?',
  },
  {
    match: ['โฆษณา', 'จ่ายเงิน', 'อันดับสูงขึ้น', 'ค่าใช้จ่าย', 'โปรโมชัน', 'ค่าคอมมิชชัน', 'gp'],
    label: 'การแยกเรื่องค่าโฆษณาออกจากสาเหตุที่แท้จริง',
    probe: 'อาการนี้เกิดจากการจ่ายค่าโฆษณาโดยตรง หรือมีสาเหตุอื่นที่ควรตรวจสอบก่อน?',
  },
  {
    match: ['bom', 'สูตร', 'ตัดสต๊อก', 'วัตถุดิบ', 'อัตโนมัติ', 'สต็อก', 'สต๊อก'],
    label: 'การตั้งสูตร (BOM) เพื่อให้ระบบตัดสต๊อกอัตโนมัติ',
    probe: 'ถ้าอยากให้วัตถุดิบถูกหักออกเองเวลาขาย ต้องตั้งค่าอะไรในระบบก่อน?',
  },
];

const FALLBACK_CATEGORY: Category = {
  label: 'อีกประเด็นสำคัญที่คำตอบที่ดีมักครอบคลุม',
  match: [],
  probe:
    'ลองนึกถึงสิ่งที่อีกฝ่ายต้องเจอ "หลังจาก" บทสนทนานี้จบ มีขั้นตอนไหนที่คำตอบยังไม่ได้พูดถึงไหม?',
};

function categoryOf(term: string): Category {
  const t = term.trim().toLowerCase();
  if (!t) return FALLBACK_CATEGORY;
  for (const c of CATEGORIES) {
    if (c.match.some((k) => t.includes(k) || k.includes(t))) return c;
  }
  return FALLBACK_CATEGORY;
}

function withParaphrases(term: string): string[] {
  const key = term.trim().toLowerCase();
  if (!key) return [];
  return [key, ...(SYNONYMS[key] ?? []).map((s) => s.toLowerCase())];
}

function toKeyPoints(terms: string[]): KeyPoint[] {
  return terms
    .map((t) => t.trim())
    .filter(Boolean)
    .map((term) => ({ term, matchers: withParaphrases(term) }));
}

export function coachModeFor(step: LessonStep): CoachMode {
  switch (step.type) {
    case 'free-text':
    case 'live-chat-mock':
    case 'phone-call-mock':
    case 'salesforce-mock-timed':
      return 'keyword';
    case 'single-choice':
    case 'multi-choice':
      return 'reasoning';
    default:
      return 'takeaway';
  }
}

export function extractKeyPoints(step: LessonStep): KeyPoint[] {
  switch (step.type) {
    case 'free-text':
      return toKeyPoints(step.sampleAnswerKeywords);
    case 'live-chat-mock':
    case 'phone-call-mock':
      return toKeyPoints(step.sampleReplyKeywords);
    case 'salesforce-mock-timed': {
      const account = step.mockAccounts.find((a) => a.id === step.idealCase.accountId);
      return toKeyPoints([
        step.idealCase.priority,
        step.idealCase.caseType,
        ...(account ? [account.merchantName] : []),
      ]);
    }
    default:
      return [];
  }
}

export function matchKeyPoints(message: string, keyPoints: KeyPoint[]): MatchResult {
  const haystack = message.toLowerCase();
  const hit: KeyPoint[] = [];
  const missing: KeyPoint[] = [];
  for (const kp of keyPoints) {
    const covered = kp.matchers.some((m) => m.length > 0 && haystack.includes(m));
    (covered ? hit : missing).push(kp);
  }
  return { hit, missing };
}

function thaiTokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s,.!?()"'“”–—/:;]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3);
}

function pickKbEntry(entries: KnowledgeHubEntry[], needles: string[]): KnowledgeHubEntry | null {
  let best: KnowledgeHubEntry | null = null;
  let bestScore = 0;
  for (const e of entries) {
    const hay = `${e.title} ${e.body} ${e.tags.join(' ')}`.toLowerCase();
    let score = 0;
    for (const n of needles) {
      if (n.length >= 2 && hay.includes(n)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = e;
    }
  }
  return bestScore > 0 ? best : null;
}

function termList(points: KeyPoint[]): string {
  return points.map((p) => `"${p.term}"`).join(', ');
}

function opener(step: LessonStep): string {
  switch (step.type) {
    case 'free-text':
      return 'ก่อนพิมพ์คำตอบจริง ลองบอกเราว่าอีกฝ่ายต้องการอะไรมากที่สุด และมีนโยบายหรือขั้นตอนไหนเกี่ยวข้องบ้าง?';
    case 'live-chat-mock':
      return 'ลองคิดถึงประโยคแรกที่จะพิมพ์ตอบ: มันรับความรู้สึกของลูกค้าก่อนแล้วค่อยเข้าเรื่องไหม?';
    case 'phone-call-mock':
      return 'ทางโทรศัพท์น้ำเสียงสำคัญ ลองบอกเราว่าคุณจะเปิดสายยังไง และจะสรุปขั้นตอนถัดไปให้ผู้โทรยังไง?';
    case 'salesforce-mock-timed':
      return 'ก่อนกรอกเคส ลองบอกเหตุผลของคุณ: เคสนี้ควรเป็น priority ระดับไหน และ case type แบบไหน เพราะอะไร?';
    default:
      return 'ลองสรุปสิ่งที่คุณกำลังคิดมาเป็นข้อ ๆ แล้วเราจะช่วยดูว่าอะไรยังขาด';
  }
}

function keywordReply(
  step: LessonStep,
  message: string,
  hintLevel: number,
  kb: KnowledgeHubEntry[],
  completedTitles: string[],
): TutorReply {
  const keyPoints = extractKeyPoints(step);
  if (keyPoints.length === 0) return reasoningReply(step, hintLevel, kb);

  const { hit, missing } = matchKeyPoints(message, keyPoints);
  const total = keyPoints.length;

  if (missing.length === 0) {
    return {
      text: `ครบแล้ว — คุณพูดถึง ${termList(hit)} ครบทุกประเด็นหลัก ลองเรียบเรียงเป็นคำตอบเต็ม ๆ ในแท็บคำตอบทางขวาได้เลย`,
      nextHintLevel: hintLevel,
      resolved: true,
    };
  }

  const next = Math.min(hintLevel + 1, 3);
  const gap = categoryOf(missing[0].term);

  if (hintLevel <= 0) {
    const ack = hit.length ? `เห็นว่าคุณพูดถึง ${termList(hit)} แล้ว ดีมาก — ` : '';
    return { text: `${ack}${opener(step)}`, nextHintLevel: next, resolved: false };
  }

  if (hintLevel === 1) {
    const got = hit.length
      ? `ตอนนี้คุณครอบคลุมแล้ว ${hit.length}/${total} ประเด็น (${termList(hit)}) `
      : `ตอนนี้ยังไม่เห็นประเด็นหลักเลยสักข้อ (มีทั้งหมด ${total} ข้อ) `;
    return {
      text: `${got}— ที่ยังขาดคือเรื่อง${gap.label} ลองเพิ่มมุมนั้นดู`,
      nextHintLevel: next,
      resolved: false,
    };
  }

  if (hintLevel === 2) {
    const recall = completedTitles.length
      ? ` (ลองดึงแนวคิดจากบท "${completedTitles[completedTitles.length - 1]}" มาปรับใช้)`
      : '';
    return { text: `${gap.probe}${recall}`, nextHintLevel: next, resolved: false };
  }

  const entry = pickKbEntry(kb, missing.flatMap((p) => p.matchers));
  const where = entry
    ? `เปิดแท็บ "คลังความรู้" แล้วอ่านหัวข้อ "${entry.title}" อีกครั้ง`
    : 'เปิดแท็บ "คลังความรู้" แล้วทบทวนหัวข้อที่เกี่ยวกับสถานการณ์นี้';
  const gotTail = hit.length ? ` (ที่คุณมีแล้ว: ${termList(hit)})` : '';
  return {
    text: `ลองแบบนี้: ${where} จากนั้นกลับมาปรับคำตอบ — เรายังไม่เฉลยให้ แต่จะช่วยเช็กให้อีกรอบ${gotTail}`,
    nextHintLevel: 3,
    resolved: false,
  };
}

function explanationText(step: LessonStep): string {
  if (step.type === 'single-choice' || step.type === 'multi-choice') return step.explanation;
  return '';
}

function reasoningReply(step: LessonStep, hintLevel: number, kb: KnowledgeHubEntry[]): TutorReply {
  const next = Math.min(hintLevel + 1, 3);
  if (hintLevel <= 0) {
    return {
      text: 'คุณกำลังเอนไปทางตัวเลือกไหน แล้วเหตุผลหลักคืออะไร? อธิบายเป็นภาษาของคุณเองสั้น ๆ',
      nextHintLevel: next,
      resolved: false,
    };
  }
  if (hintLevel === 1) {
    return {
      text:
        'ลองแยกให้ชัด: อะไรคือสิ่งที่อีกฝ่าย "ต้องการก่อน" กับอะไรคือขั้นตอนเอกสารหรือระบบ ' +
        'แล้วตัวเลือกไหนตอบสิ่งที่สำคัญกว่า?',
      nextHintLevel: next,
      resolved: false,
    };
  }
  if (hintLevel === 2) {
    return {
      text:
        'ตัดตัวเลือกที่ "ดูเหมือนถูกแต่ไม่ตอบโจทย์หลัก" ออกทีละข้อ เหลือข้อที่จัดการผลกระทบสำคัญที่สุด ' +
        'แล้วถามตัวเองว่าทำไมอีกข้อถึงไม่ใช่',
      nextHintLevel: next,
      resolved: false,
    };
  }
  const entry = pickKbEntry(kb, thaiTokens(`${step.prompt} ${explanationText(step)}`));
  const where = entry
    ? `เปิดแท็บ "คลังความรู้" อ่านหัวข้อ "${entry.title}" แล้วลองเลือกใหม่`
    : 'เปิดแท็บ "คลังความรู้" ทบทวนหลักการที่เกี่ยวข้อง แล้วลองเลือกใหม่';
  return {
    text: `${where} — เราไม่บอกว่าข้อไหนถูก แต่หลักการในนั้นจะช่วยให้คุณตัดสินใจได้เอง`,
    nextHintLevel: 3,
    resolved: false,
  };
}

function takeawayReply(step: LessonStep, hintLevel: number, kb: KnowledgeHubEntry[]): TutorReply {
  const next = Math.min(hintLevel + 1, 3);
  if (hintLevel <= 0) {
    return {
      text: 'บทนี้อยากให้คุณจำอะไรกลับไปใช้จริงมากที่สุด? ลองสรุปเป็นประโยคเดียว',
      nextHintLevel: next,
      resolved: false,
    };
  }
  if (hintLevel === 1) {
    return {
      text: 'เชื่อมกับงานจริงหน่อย: ถ้าพรุ่งนี้เจอสถานการณ์แบบในบทนี้ คุณจะทำอะไรต่างจากเดิม?',
      nextHintLevel: next,
      resolved: false,
    };
  }
  if (hintLevel === 2) {
    return {
      text: 'มีคำหรือชื่อระบบในบทนี้ที่คุณยังไม่แน่ใจความหมายไหม? พิมพ์มาได้ เดี๋ยวเราชวนคิดต่อ',
      nextHintLevel: next,
      resolved: false,
    };
  }
  const entry = pickKbEntry(kb, thaiTokens(step.prompt));
  const where = entry
    ? `หัวข้อ "${entry.title}" ในแท็บ "คลังความรู้"`
    : 'หัวข้อที่เกี่ยวข้องในแท็บ "คลังความรู้"';
  return {
    text: `ลองเปิด ${where} ประกอบ แล้วสรุปสิ่งที่ได้กลับมาเล่าให้เราฟัง`,
    nextHintLevel: 3,
    resolved: false,
  };
}

export function buildTutorReply(ctx: TutorContext): TutorReply {
  const { step, message, hintLevel, unlockedKbEntries, completedLessonTitles } = ctx;
  const trimmed = message.trim();

  if (trimmed.length < 2) {
    return {
      text: 'พิมพ์สิ่งที่คุณกำลังคิดมาสัก 1–2 ประโยคก่อนนะ แล้วเราจะช่วยตั้งคำถามต่อ',
      nextHintLevel: hintLevel,
      resolved: false,
    };
  }

  switch (coachModeFor(step)) {
    case 'keyword':
      return keywordReply(step, trimmed, hintLevel, unlockedKbEntries, completedLessonTitles);
    case 'reasoning':
      return reasoningReply(step, hintLevel, unlockedKbEntries);
    case 'takeaway':
      return takeawayReply(step, hintLevel, unlockedKbEntries);
  }
}
