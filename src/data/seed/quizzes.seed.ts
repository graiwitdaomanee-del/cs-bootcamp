import type { ChatMessage, ChoiceOption, SalesforceIdealCase, SalesforceMockAccount } from '../../types/step';
import type { Quiz, QuizQuestion } from '../../types/quiz';

const SEED_TIMESTAMP = '2026-06-01T00:00:00.000Z';

interface AuthoredChoiceQuestion {
  id: string;
  prompt: string;
  type: 'single-choice' | 'multi-choice';
  options: ChoiceOption[];
  correctOptionIds: string[];
}

interface AuthoredLiveChatQuestion {
  id: string;
  prompt: string;
  openingMessages: ChatMessage[];
  modelReply: string;
  sampleReplyKeywords: string[];
}

interface AuthoredSalesforceQuestion {
  id: string;
  prompt: string;
  scenario: string;
  timeLimitSeconds?: number;
  priorityOptions: string[];
  caseTypeOptions: string[];
  mockAccounts: SalesforceMockAccount[];
  idealCase: SalesforceIdealCase;
}

interface AuthoredPhoneCallQuestion {
  id: string;
  prompt: string;
  scenario: string;
  callerLines: string[];
  modelReplyDescription: string;
  sampleReplyKeywords: string[];
}

/** Converts the lightweight authoring shorthand above into the full LessonStep-shaped QuizQuestion. */
function choiceQuestions(entries: AuthoredChoiceQuestion[]): QuizQuestion[] {
  return entries.map((q) => {
    if (q.type === 'single-choice') {
      const correctOptionId = q.correctOptionIds[0];
      const label = q.options.find((o) => o.id === correctOptionId)?.label ?? '';
      return {
        id: q.id,
        order: 0,
        type: 'single-choice',
        prompt: q.prompt,
        options: q.options,
        correctOptionId,
        explanation: `คำตอบที่ถูกต้อง: ${label}`,
      };
    }
    const labels = q.options
      .filter((o) => q.correctOptionIds.includes(o.id))
      .map((o) => o.label);
    return {
      id: q.id,
      order: 0,
      type: 'multi-choice',
      prompt: q.prompt,
      options: q.options,
      correctOptionIds: q.correctOptionIds,
      explanation: `คำตอบที่ถูกต้อง: ${labels.join(', ')}`,
    };
  });
}

function liveChatQuestions(entries: AuthoredLiveChatQuestion[]): QuizQuestion[] {
  return entries.map((q) => ({
    id: q.id,
    order: 0,
    type: 'live-chat-mock',
    prompt: q.prompt,
    openingMessages: q.openingMessages,
    modelReply: q.modelReply,
    sampleReplyKeywords: q.sampleReplyKeywords,
  }));
}

function salesforceQuestions(entries: AuthoredSalesforceQuestion[]): QuizQuestion[] {
  return entries.map((q) => ({
    id: q.id,
    order: 0,
    type: 'salesforce-mock-timed',
    prompt: q.prompt,
    scenario: q.scenario,
    timeLimitSeconds: q.timeLimitSeconds ?? 120,
    priorityOptions: q.priorityOptions,
    caseTypeOptions: q.caseTypeOptions,
    mockAccounts: q.mockAccounts,
    idealCase: q.idealCase,
  }));
}

function phoneCallQuestions(entries: AuthoredPhoneCallQuestion[]): QuizQuestion[] {
  return entries.map((q) => ({
    id: q.id,
    order: 0,
    type: 'phone-call-mock',
    prompt: q.prompt,
    scenario: q.scenario,
    callerLines: q.callerLines,
    modelReplyDescription: q.modelReplyDescription,
    sampleReplyKeywords: q.sampleReplyKeywords,
  }));
}

/** Question arrays are authored in reading order per-type, then flattened and renumbered here. */
function withOrder(questions: QuizQuestion[]): QuizQuestion[] {
  return questions.map((q, i) => ({ ...q, order: i + 1 }));
}

export const seedQuizzes: Quiz[] = [
  {
    id: 'quiz-welcome-basics',
    title: 'แบบทดสอบพื้นฐาน: ปฐมนิเทศ CS',
    tags: ['welcome'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...liveChatQuestions([
        {
          id: 'q-welcome-1',
          prompt: 'ตอบแชทจากร้านค้าที่ทักมาด้วยความไม่พอใจเรื่องปัญหาที่เกิดซ้ำ',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'นี่เป็นครั้งที่สามแล้วนะคะที่เจอปัญหานี้ซ้ำ ทางร้านเหนื่อยใจมากเลยค่ะ' },
          ],
          modelReply:
            'ขอโทษด้วยจริง ๆ นะคะที่เรื่องนี้เกิดขึ้นซ้ำ ๆ เข้าใจเลยค่ะว่าทำให้เหนื่อยใจ ให้ดิฉันตรวจสอบสาเหตุที่แท้จริงให้ก่อนเลยนะคะ',
          sampleReplyKeywords: ['ขอโทษ', 'เข้าใจ', 'ตรวจสอบ'],
        },
      ]),
      ...choiceQuestions([
        {
          id: 'q-welcome-2',
          prompt: 'แอปใดที่ใช้ประสานงานการจัดส่งระหว่าง LINE MAN และร้านค้า Wongnai?',
          type: 'single-choice',
          options: [
            { id: 'a', label: 'Wongnai Merchant App (WMA)' },
            { id: 'b', label: 'Wongnai POS เท่านั้น' },
            { id: 'c', label: 'แอปขนส่งของบุคคลที่สาม' },
            { id: 'd', label: 'อีเมล' },
          ],
          correctOptionIds: ['a'],
        },
        {
          id: 'q-welcome-3',
          prompt: 'ข้อใดคือพฤติกรรมน้ำเสียงที่ดีของทีมซัพพอร์ต? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: [
            { id: 'a', label: 'แสดงความเข้าใจก่อนอธิบายนโยบาย' },
            { id: 'b', label: 'ใช้รหัสระบบภายในเพื่อให้ดูเป็นทางการ' },
            { id: 'c', label: 'ให้ขั้นตอนถัดไปหรือระยะเวลาที่ชัดเจน' },
            { id: 'd', label: 'ตอบให้กระชับ' },
          ],
          correctOptionIds: ['a', 'c', 'd'],
        },
        {
          id: 'q-welcome-4',
          prompt: 'Wongnai ให้บริการธุรกิจประเภทใดบ้าง?',
          type: 'multi-choice',
          options: [
            { id: 'a', label: 'ร้านอาหารและคาเฟ่' },
            { id: 'b', label: 'สปาและร้านเสริมสวย' },
            { id: 'c', label: 'คลินิก' },
            { id: 'd', label: 'เฉพาะเชนร้านอาหารขนาดใหญ่เท่านั้น' },
          ],
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...phoneCallQuestions([
        {
          id: 'q-welcome-5',
          prompt: 'รับสายจากร้านค้าที่ถามว่าจะคืนเงินให้ลูกค้าได้ไหม',
          scenario:
            'ร้านค้าโทรเข้ามาสอบถามเรื่องการคืนเงินให้ลูกค้าเนื่องจากอาหารไม่ครบ อยากรู้ว่าทำได้ไหมและเมื่อไหร่',
          callerLines: ['สวัสดีค่ะ ลูกค้าขอเงินคืนเรื่องอาหารไม่ครบ ช่วยบอกทีว่าทำได้ไหมคะ'],
          modelReplyDescription:
            'คำตอบที่ดีควรหลีกเลี่ยงคำเด็ดขาดอย่าง "ไม่ได้เลย" หรือ "เป็นไปไม่ได้" ควรเสนอสิ่งที่ทำได้แทน เช่น ตรวจสอบเงื่อนไขและแจ้งระยะเวลาที่คาดว่าจะดำเนินการเสร็จ',
          sampleReplyKeywords: ['ตรวจสอบ', 'เงื่อนไข', 'ดำเนินการ', 'แจ้งผล'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-order-complaint-basics',
    title: 'แบบทดสอบพื้นฐาน: เคสร้องเรียนออเดอร์',
    tags: ['order-complaint'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-order-1',
          prompt: 'ข้อใดคือ 4 กลุ่มปัญหาออเดอร์ที่พบบ่อย?',
          type: 'multi-choice',
          options: [
            { id: 'a', label: 'ของขาดหาย' },
            { id: 'b', label: 'ส่งช้า' },
            { id: 'c', label: 'ออเดอร์ผิด' },
            { id: 'd', label: 'คุณภาพรูปภาพเมนู' },
          ],
          correctOptionIds: ['a', 'b', 'c'],
        },
        {
          id: 'q-order-2',
          prompt: 'ควรใช้เกณฑ์ใดตัดสินว่าจะจัดการเคสร้องเรียนไหนก่อน?',
          type: 'single-choice',
          options: [
            { id: 'a', label: 'ลำดับการทักเข้ามาก่อน-หลัง' },
            { id: 'b', label: 'ผลกระทบ/ความเร่งด่วนของสถานการณ์' },
            { id: 'c', label: 'ปริมาณออเดอร์ของร้านค้า' },
            { id: 'd', label: 'เรียงตามตัวอักษรชื่อร้าน' },
          ],
          correctOptionIds: ['b'],
        },
        {
          id: 'q-order-3',
          prompt: 'อะไรเป็นสาเหตุของความล่าช้าจากโหมด "ร้านยุ่ง" (busy mode)?',
          type: 'single-choice',
          options: [
            { id: 'a', label: 'ระบบล่ม' },
            { id: 'b', label: 'การชะลอรับออเดอร์ช่วงที่มีความต้องการสูงเพื่อรักษาคุณภาพ' },
            { id: 'c', label: 'ร้านค้าปิดก่อนเวลา' },
            { id: 'd', label: 'ไรเดอร์นัดหยุดงาน' },
          ],
          correctOptionIds: ['b'],
        },
        {
          id: 'q-order-5',
          prompt: 'ควรส่งต่อเคสร้องเรียนให้เจ้าหน้าที่ระดับสูงเมื่อใด?',
          type: 'single-choice',
          options: [
            { id: 'a', label: 'เมื่อร้านค้าขอด้วยน้ำเสียงสุภาพเท่านั้น' },
            { id: 'b', label: 'ร้องเรียนซ้ำ 3 ครั้งขึ้นไปใน 7 วัน ยอดคืนเงินเกินเกณฑ์ หรือขอคุยกับหัวหน้างานโดยตรง' },
            { id: 'c', label: 'ไม่ต้องส่งต่อ — เจ้าหน้าที่ทุกคนดูแลทุกเคสเท่ากันหมด' },
            { id: 'd', label: 'เฉพาะร้านค้า VIP เท่านั้น' },
          ],
          correctOptionIds: ['b'],
        },
      ]),
      ...phoneCallQuestions([
        {
          id: 'q-order-4',
          prompt: 'รับสายจากร้านค้าที่แจ้งว่าออเดอร์ของลูกค้าขาดของ',
          scenario:
            'ร้านค้าโทรเข้ามาแจ้งว่าระบบขึ้นว่าส่งสำเร็จแล้ว แต่ลูกค้าโทรกลับมาบอกว่าของขาดหายไป อยากรู้ว่าทางร้านควรทำอย่างไรต่อ',
          callerLines: [
            'สวัสดีค่ะ ระบบขึ้นว่าส่งสำเร็จ แต่ลูกค้าโทรมาบอกว่าของขาดไปหนึ่งอย่างค่ะ',
            'ทางร้านไม่แน่ใจว่าเกิดจากอะไร ช่วยแนะนำหน่อยได้ไหมคะ',
          ],
          modelReplyDescription:
            'คำตอบที่ดีควรอธิบายว่าจะตรวจสอบการยืนยันแพ็กของจากร้าน หลักฐานการจัดส่ง และประวัติการเกิดซ้ำ ก่อนสรุปว่าใครผิด ไม่รีบตัดสินร้านค้า',
          sampleReplyKeywords: ['ตรวจสอบ', 'หลักฐาน', 'แพ็กของ', 'เกิดซ้ำ'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-welcome-order-cross',
    title: 'ทบทวนรวม: น้ำเสียง + เคสร้องเรียนออเดอร์',
    tags: ['welcome', 'order-complaint'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder(
      liveChatQuestions([
        {
          id: 'q-welcome-order-cross',
          prompt: 'ตอบแชทร้านค้าที่ไม่พอใจที่ของมาส่งช้าเป็นครั้งที่สามในสัปดาห์นี้',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'นี่คือครั้งที่สามในสัปดาห์นี้แล้วที่ของมาส่งช้า ลูกค้าบ่นกันเข้ามาเยอะมากค่ะ' },
          ],
          modelReply:
            'เข้าใจเลยค่ะว่าเหตุการณ์แบบนี้เกิดขึ้นซ้ำจนน่าหงุดหงิด ช่วงที่ออเดอร์เยอะระบบอาจชะลอการจ่ายงานเพื่อรักษาคุณภาพ แต่เนื่องจากเกิดซ้ำหลายครั้งแล้ว ดิฉันจะบันทึกเป็นเคสส่งต่อให้ทีมตรวจสอบเชิงลึกให้เลยนะคะ',
          sampleReplyKeywords: ['เข้าใจ', 'ตรวจสอบ', 'บันทึกเคส', 'ส่งต่อ'],
        },
      ]),
    ),
  },
  {
    id: 'quiz-menu-setup-basics',
    title: 'แบบทดสอบพื้นฐาน: ตั้งค่าโปรไฟล์/เมนู WMA',
    tags: ['menu-setup'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-menu-1',
          prompt: 'ขั้นตอนแรกที่ถูกต้องในการเพิ่มเมนูใหม่คืออะไร?',
          type: 'single-choice',
          options: [
            { id: 'a', label: 'สร้าง/เลือกหมวดหมู่ใน Menu Builder' },
            { id: 'b', label: 'ติดต่อฝ่ายโฆษณา' },
            { id: 'c', label: 'Claim โปรไฟล์ร้านใหม่' },
            { id: 'd', label: 'รอให้ระบบซิงก์จาก POS อัตโนมัติ' },
          ],
          correctOptionIds: ['a'],
        },
        {
          id: 'q-menu-2',
          prompt: 'ข้อมูลใดจำเป็นต้องกรอกก่อนเผยแพร่เมนู?',
          type: 'multi-choice',
          options: [
            { id: 'a', label: 'ชื่อเมนู' },
            { id: 'b', label: 'ราคา' },
            { id: 'c', label: 'หมวดหมู่' },
            { id: 'd', label: 'รีวิวจากลูกค้าอย่างน้อย 10 รีวิว' },
          ],
          correctOptionIds: ['a', 'b', 'c'],
        },
        {
          id: 'q-menu-3',
          prompt: 'โปรไฟล์ร้านค้าที่ "ครบถ้วน" ประกอบด้วยอะไรบ้าง?',
          type: 'multi-choice',
          options: [
            { id: 'a', label: 'ชื่อร้านและที่อยู่/ปักหมุดแผนที่' },
            { id: 'b', label: 'เวลาเปิด-ปิด' },
            { id: 'c', label: 'รูปหน้าปก' },
            { id: 'd', label: 'ค่าโฆษณาขั้นต่ำ' },
          ],
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...phoneCallQuestions([
        {
          id: 'q-menu-4',
          prompt: 'รับสายจากร้านค้าที่เปิดร้านมา 2 สัปดาห์แต่หาไม่เจอในระบบค้นหา',
          scenario:
            'ร้านค้าโทรเข้ามาบ่นว่าเปิดร้านมา 2 สัปดาห์แล้วแต่ลูกค้าแทบหาไม่เจอในระบบค้นหาเลย อยากรู้สาเหตุ',
          callerLines: [
            'สวัสดีค่ะ ร้านฉันเปิดมา 2 สัปดาห์แล้ว แต่แทบไม่มีลูกค้าหาเจอในระบบค้นหาเลย',
            'ทำไมถึงเป็นแบบนี้คะ ช่วยดูให้หน่อยได้ไหม',
          ],
          modelReplyDescription:
            'คำตอบที่ดีควรอธิบายว่าสาเหตุที่พบบ่อยคือโปรไฟล์ร้านยังไม่ครบถ้วนหรือเมนูมีรูปภาพ/หมวดหมู่น้อยเกินไป ซึ่งส่งผลต่ออันดับการค้นหา พร้อมเสนอช่วยตรวจสอบความครบถ้วนไปด้วยกัน',
          sampleReplyKeywords: ['โปรไฟล์', 'รูปภาพ', 'หมวดหมู่', 'การจัดอันดับ'],
        },
      ]),
      ...liveChatQuestions([
        {
          id: 'q-menu-5',
          prompt: 'ตอบแชทร้านค้าที่แจ้งว่าเมนูบันทึกไม่ได้',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'พยายามบันทึกเมนูใหม่หลายรอบแล้วแต่ระบบไม่ยอมบันทึกให้เลยค่ะ' },
          ],
          modelReply:
            'เดี๋ยวดิฉันช่วยเช็กให้นะคะ ปัญหานี้ส่วนใหญ่เกิดจากกรอกข้อมูลที่จำเป็นไม่ครบ เช่น ราคาหรือหมวดหมู่ ลองเช็กดูว่าทุกช่องที่มีเครื่องหมายดอกจันกรอกครบหรือยังคะ',
          sampleReplyKeywords: ['กรอกข้อมูล', 'ครบถ้วน', 'หมวดหมู่', 'ตรวจสอบ'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-order-menu-cross',
    title: 'ทบทวนรวม: เคสร้องเรียนออเดอร์ + ตั้งค่าเมนู',
    tags: ['order-complaint', 'menu-setup'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder(
      phoneCallQuestions([
        {
          id: 'q-order-menu-cross',
          prompt: 'รับสายจากร้านค้าใหม่ที่โปรไฟล์ยังไม่ครบถ้วนและกำลังเจอปัญหารับออเดอร์ล่าช้า',
          scenario:
            'ร้านค้าใหม่โทรเข้ามาบ่นว่าออเดอร์เข้าช้าและร้านยังตั้งค่าโปรไฟล์ไม่เสร็จ อยากรู้ว่าควรแก้อะไรก่อน',
          callerLines: [
            'สวัสดีค่ะ ร้านเราเพิ่งเปิดใหม่ ออเดอร์เข้าช้ามากเลยค่ะ',
            'อ้อ แล้วก็ยังตั้งค่าโปรไฟล์ไม่เสร็จดีด้วยค่ะ ไม่รู้เกี่ยวกันไหม',
          ],
          modelReplyDescription:
            'คำตอบที่ดีควรแนะนำให้ตรวจสอบและทำให้โปรไฟล์/เมนูของร้านครบถ้วนพร้อมใช้งานเต็มรูปแบบก่อน เพราะเป็นสาเหตุที่พบบ่อยที่สุดของปัญหาการมองเห็นและการรับออเดอร์ล่าช้าของร้านใหม่',
          sampleReplyKeywords: ['โปรไฟล์', 'ครบถ้วน', 'ตรวจสอบ', 'เมนู'],
        },
      ]),
    ),
  },
  {
    id: 'quiz-ads-payout-basics',
    title: 'แบบทดสอบพื้นฐาน: โฆษณาและยอดโอนเงิน',
    tags: ['ads-payout'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...liveChatQuestions([
        {
          id: 'q-ads-1',
          prompt: 'ตอบแชทร้านค้าที่สงสัยว่าทำไมโดนหักค่าโฆษณาทั้งที่ออเดอร์ไม่เพิ่ม',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'ทำไมสัปดาห์นี้โดนหักค่าโฆษณา ทั้งที่ออเดอร์ไม่ได้เพิ่มขึ้นเลยคะ' },
          ],
          modelReply:
            'เข้าใจเลยค่ะว่าดูเหมือนไม่คุ้ม ค่าโฆษณาจะถูกคิดตามยอดการมองเห็น/คลิกที่เกิดขึ้นจริง ไม่ได้การันตีว่าจะมีออเดอร์เพิ่มเสมอไปนะคะ เดี๋ยวดิฉันดึงรายละเอียดแคมเปญของร้านมาอธิบายเพิ่มเติมให้ค่ะ',
          sampleReplyKeywords: ['การมองเห็น', 'ไม่การันตี', 'ตรวจสอบ', 'แคมเปญ'],
        },
      ]),
      ...choiceQuestions([
        {
          id: 'q-ads-2',
          prompt: 'ยอดโอนเงินของร้านค้าในแต่ละรอบเท่ากับอะไร?',
          type: 'single-choice',
          options: [
            { id: 'a', label: 'มูลค่าออเดอร์ที่เสร็จสมบูรณ์ หักค่าคอมมิชชันและค่าโฆษณา' },
            { id: 'b', label: 'ยอดออเดอร์ทั้งหมดที่สั่ง ไม่ว่าจะเสร็จสมบูรณ์หรือไม่' },
            { id: 'c', label: 'จำนวนคงที่รายเดือน' },
            { id: 'd', label: 'มูลค่าออเดอร์บวกโบนัส' },
          ],
          correctOptionIds: ['a'],
        },
        {
          id: 'q-ads-3',
          prompt: 'ข้อใดคือสาเหตุที่ทำให้ยอดโอนล่าช้าได้จริง? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: [
            { id: 'a', label: 'ระยะเวลาดำเนินการของธนาคาร' },
            { id: 'b', label: 'มีข้อพิพาท/การคืนเงินที่ยังไม่จบในรอบนั้น' },
            { id: 'c', label: 'ข้อมูลบัญชีธนาคารไม่เป็นปัจจุบัน' },
            { id: 'd', label: 'ร้านค้าให้รีวิวลูกค้าในแง่ลบ' },
          ],
          correctOptionIds: ['a', 'b', 'c'],
        },
        {
          id: 'q-ads-5',
          prompt: 'ค่าโฆษณาถูกคิดบิลอย่างไรเทียบกับค่าคอมมิชชันออเดอร์?',
          type: 'single-choice',
          options: [
            { id: 'a', label: 'คิดแยกกัน โดยอิงจากตัวชี้วัดการมองเห็น/การมีส่วนร่วม' },
            { id: 'b', label: 'รวมเป็นยอดเดียวไม่แยกรายการ' },
            { id: 'c', label: 'มาแทนที่ค่าคอมมิชชันทั้งหมด' },
            { id: 'd', label: 'ไม่เคยแจกแจงรายการ' },
          ],
          correctOptionIds: ['a'],
        },
      ]),
      ...phoneCallQuestions([
        {
          id: 'q-ads-4',
          prompt: 'รับสายจากร้านค้าที่ไม่เคยใช้โฆษณามาก่อนและอยากเข้าใจ Sponsored Placement',
          scenario:
            'ร้านค้าโทรเข้ามาถามว่า Sponsored Placement คืออะไรและช่วยอะไรได้บ้าง เพราะไม่เคยใช้งานมาก่อน',
          callerLines: [
            'สวัสดีค่ะ เห็นมีตัวเลือก Sponsored Placement ในแอป มันคืออะไรคะ',
            'จำเป็นต้องใช้ไหม แล้วมันช่วยอะไรร้านได้บ้าง',
          ],
          modelReplyDescription:
            'คำตอบที่ดีควรอธิบายง่าย ๆ ว่าเป็นการจ่ายค่าธรรมเนียมเล็กน้อยเพื่อให้ร้านขึ้นอันดับต้น ๆ เวลาลูกค้าใกล้เคียงค้นหา ช่วยให้ลูกค้าหาเจอง่ายขึ้น โดยไม่ใช้ศัพท์เทคนิคอย่าง impression หรือ CPC',
          sampleReplyKeywords: ['อันดับสูงขึ้น', 'ค้นหา', 'มองเห็น', 'ค่าธรรมเนียม'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-menu-ads-cross',
    title: 'ทบทวนรวม: เมนู + โฆษณา',
    tags: ['menu-setup', 'ads-payout'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder(
      salesforceQuestions([
        {
          id: 'q-menu-ads-cross',
          prompt: 'บันทึกเคสร้านค้าที่เมนูไม่ครบถ้วนและถามเรื่องโฆษณา',
          scenario:
            'ร้านค้าที่มีเมนูไม่ครบถ้วนสอบถามว่าการเปิดโฆษณาจะช่วยแก้ปัญหาการมองเห็นต่ำได้หรือไม่ ตรวจสอบแล้วพบว่าโปรไฟล์/เมนูของร้านยังขาดรูปภาพและหมวดหมู่หลายรายการ',
          priorityOptions: ['Low', 'Medium', 'High', 'Urgent'],
          caseTypeOptions: ['Menu & Listing Support', 'Advertising Billing', 'Payout Discrepancy', 'Order Issue', 'Account Access'],
          mockAccounts: [
            { id: 'acc-1', merchantName: 'ร้านชาไข่มุกหวานเจ๊', businessType: 'ร้านเครื่องดื่ม' },
            { id: 'acc-2', merchantName: 'ร้านกาแฟบ้านคิน', businessType: 'ร้านกาแฟ' },
          ],
          idealCase: {
            subject: 'แนะนำให้แก้ไขความครบถ้วนของเมนูก่อนเปิดโฆษณา — ร้านชาไข่มุกหวานเจ๊',
            description:
              'ร้านชาไข่มุกหวานเจ๊สอบถามว่าการเปิดโฆษณาจะช่วยแก้ปัญหาการมองเห็นต่ำได้หรือไม่ ตรวจสอบแล้วพบว่าเมนูยังขาดรูปภาพและหมวดหมู่หลายรายการ แนะนำให้แก้ไขความครบถ้วนก่อน เพราะให้ผลลัพธ์ยั่งยืนกว่า',
            priority: 'Medium',
            caseType: 'Menu & Listing Support',
            accountId: 'acc-1',
          },
        },
      ]),
    ),
  },
  {
    id: 'quiz-salesforce-basics',
    title: 'แบบทดสอบพื้นฐาน: บันทึกเคสใน Salesforce',
    tags: ['salesforce-case'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-sf-1',
          prompt: 'คำอธิบายเคสที่ดีควรมีอะไรบ้าง?',
          type: 'multi-choice',
          options: [
            { id: 'a', label: 'เกิดอะไรขึ้น' },
            { id: 'b', label: 'หมายเลขออเดอร์/อ้างอิง' },
            { id: 'c', label: 'สิ่งที่ร้านค้าต้องการ' },
            { id: 'd', label: 'ความคิดเห็นส่วนตัวของเจ้าหน้าที่ต่อร้านค้า' },
          ],
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...salesforceQuestions([
        {
          id: 'q-sf-2',
          prompt: 'บันทึกเคสยอดโอนขาดที่ตรงกับยอดคืนเงินให้ทันก่อนหมดเวลา',
          scenario:
            'ร้าน "ร้านตำมั่วเพลิน" แจ้งว่ายอดโอนประจำสัปดาห์ขาดไปพอดีเท่ากับยอดที่ร้านคืนเงินให้ลูกค้าเองไปแล้วสำหรับออเดอร์หนึ่งรายการ ร้านต้องการให้ชดเชยคืน',
          timeLimitSeconds: 150,
          priorityOptions: ['Low', 'Medium', 'High', 'Urgent'],
          caseTypeOptions: ['Payout Discrepancy', 'Order Issue', 'Advertising Billing', 'Account Access'],
          mockAccounts: [
            { id: 'acc-1', merchantName: 'ร้านตำมั่วเพลิน', businessType: 'ร้านอาหาร' },
            { id: 'acc-2', merchantName: 'ร้านกาแฟบ้านคิน', businessType: 'ร้านกาแฟ' },
          ],
          idealCase: {
            subject: 'ยอดโอนขาดเท่ายอดคืนเงิน — ร้านตำมั่วเพลิน',
            description:
              'ยอดโอนประจำสัปดาห์ของร้านตำมั่วเพลินขาดไปพอดีเท่ากับยอดที่ร้านคืนเงินให้ลูกค้าเองไปแล้ว ร้านขอให้ชดเชยยอดที่ขาดคืนให้',
            priority: 'High',
            caseType: 'Payout Discrepancy',
            accountId: 'acc-1',
          },
        },
      ]),
      ...choiceQuestions([
        {
          id: 'q-sf-3',
          prompt: 'ลำดับความสำคัญใดเหมาะกับ "มีผลกระทบทางการเงินหรือความปลอดภัยที่กำลังเกิดขึ้น"?',
          type: 'single-choice',
          options: [
            { id: 'a', label: 'Low' },
            { id: 'b', label: 'Medium' },
            { id: 'c', label: 'High' },
            { id: 'd', label: 'Urgent' },
          ],
          correctOptionIds: ['d'],
        },
      ]),
      ...salesforceQuestions([
        {
          id: 'q-sf-4',
          prompt: 'บันทึกเคสให้มีหัวข้อและรายละเอียดที่ชัดเจนก่อนหมดเวลา',
          scenario:
            'ร้าน "ร้านซูชิริมคลอง" แจ้งว่าออเดอร์ #9021 ระบบขึ้นว่าส่งสำเร็จ แต่ลูกค้าได้รับอาหารผิดรายการทั้งหมด ร้านต้องการให้ช่วยตรวจสอบและแจ้งลูกค้าใหม่',
          timeLimitSeconds: 150,
          priorityOptions: ['Low', 'Medium', 'High', 'Urgent'],
          caseTypeOptions: ['Order Issue', 'Payout Discrepancy', 'Advertising Billing', 'Account Access'],
          mockAccounts: [
            { id: 'acc-1', merchantName: 'ร้านซูชิริมคลอง', businessType: 'ร้านอาหารญี่ปุ่น' },
            { id: 'acc-2', merchantName: 'ร้านบ้านสวนไทย', businessType: 'ร้านอาหาร' },
          ],
          idealCase: {
            subject: 'ออเดอร์ #9021 ส่งผิดรายการทั้งหมด — ร้านซูชิริมคลอง',
            description:
              'ออเดอร์ #9021 ระบบขึ้นว่าส่งสำเร็จ แต่ลูกค้าได้รับอาหารผิดรายการทั้งหมด ต้องตรวจสอบกับร้านและแจ้งลูกค้าใหม่โดยเร็ว',
            priority: 'High',
            caseType: 'Order Issue',
            accountId: 'acc-1',
          },
        },
      ]),
      ...choiceQuestions([
        {
          id: 'q-sf-5',
          prompt: 'ทำไมการบันทึกรายละเอียดเคสจึงสำคัญเมื่อต้องส่งต่อให้ทีมอื่น?',
          type: 'single-choice',
          options: [
            { id: 'a', label: 'เพื่อให้เจ้าหน้าที่คนถัดไปดำเนินการต่อได้โดยไม่ต้องถามร้านค้าซ้ำ' },
            { id: 'b', label: 'ไม่สำคัญ — มีแค่ Priority เท่านั้นที่สำคัญ' },
            { id: 'c', label: 'เพื่อให้เคสดูยาวขึ้น' },
            { id: 'd', label: 'เพื่อการเก็บบันทึกทางกฎหมายเท่านั้น' },
          ],
          correctOptionIds: ['a'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-order-sf-cross',
    title: 'ทบทวนรวม: เคสร้องเรียนออเดอร์ + Salesforce',
    tags: ['order-complaint', 'salesforce-case'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder(
      salesforceQuestions([
        {
          id: 'q-order-sf-cross',
          prompt: 'บันทึกเคสร้านค้าที่คืนเงินลูกค้าเองและขอชดเชยยอดโอน',
          scenario:
            'ร้าน "ร้านผัดไทยประตูผี" คืนเงินลูกค้าเองสำหรับของที่ขาดหาย และต้องการให้ชดเชยผ่านยอดโอนเงินของรอบถัดไป',
          priorityOptions: ['Low', 'Medium', 'High', 'Urgent'],
          caseTypeOptions: ['Payout Discrepancy', 'Order Issue', 'Advertising Billing', 'Account Access'],
          mockAccounts: [{ id: 'acc-1', merchantName: 'ร้านผัดไทยประตูผี', businessType: 'ร้านอาหาร' }],
          idealCase: {
            subject: 'ขอชดเชยยอดโอนจากการคืนเงินลูกค้าเอง — ร้านผัดไทยประตูผี',
            description:
              'ร้านผัดไทยประตูผีคืนเงินลูกค้าเองสำหรับของที่ขาดหาย และขอให้ชดเชยผ่านยอดโอนเงินของรอบถัดไป',
            priority: 'High',
            caseType: 'Payout Discrepancy',
            accountId: 'acc-1',
          },
        },
      ]),
    ),
  },
  {
    id: 'quiz-ads-sf-cross',
    title: 'ทบทวนรวม: โฆษณา + Salesforce',
    tags: ['ads-payout', 'salesforce-case'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder(
      liveChatQuestions([
        {
          id: 'q-ads-sf-cross',
          prompt: 'ตอบแชทร้านค้าที่พูดถึงแคมเปญโฆษณาไม่เกี่ยวข้องขณะแจ้งปัญหายอดโอนขาด',
          openingMessages: [
            {
              id: 'm1',
              sender: 'customer',
              text: 'ยอดโอนสัปดาห์นี้ขาดไปพอดีเท่ายอดคืนเงินลูกค้าเลยค่ะ อ้อ แล้วก็เพิ่งเปิดแคมเปญโฆษณาเล็ก ๆ ไปด้วยไม่รู้เกี่ยวกันไหม',
            },
          ],
          modelReply:
            'เข้าใจค่ะ เรื่องยอดโอนขาดที่ตรงกับยอดคืนเงิน ดิฉันจะบันทึกเป็นเคส Payout Discrepancy และตรวจสอบให้เลยนะคะ ส่วนแคมเปญโฆษณาที่เพิ่งเปิดเป็นคนละเรื่องกัน จะระบุไว้เป็นข้อมูลประกอบเท่านั้นค่ะ',
          sampleReplyKeywords: ['บันทึกเคส', 'ตรวจสอบ', 'แยกประเด็น'],
        },
      ]),
    ),
  },
  {
    id: 'quiz-live-chat-basics',
    title: 'แบบทดสอบพื้นฐาน: ตอบ Live Chat กับร้านค้า',
    tags: ['live-chat'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...liveChatQuestions([
        {
          id: 'q-chat-1',
          prompt: 'ตอบแชทร้านค้าที่รอคำตอบสุดท้ายอยู่',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'ตอนนี้มีความคืบหน้าเรื่องที่แจ้งไปหรือยังคะ รอมาสักพักแล้ว' },
          ],
          modelReply:
            'ขอโทษที่รอนานนะคะ ตอนนี้ดิฉันกำลังตรวจสอบอยู่ ยังไม่มีคำตอบสุดท้าย แต่จะรีบแจ้งความคืบหน้าให้ทราบโดยเร็วที่สุดค่ะ',
          sampleReplyKeywords: ['กำลังตรวจสอบ', 'ความคืบหน้า', 'แจ้ง'],
        },
      ]),
      ...choiceQuestions([
        {
          id: 'q-chat-2',
          prompt: 'ข้อใดคือการจัดรูปแบบข้อความแชทที่ดี?',
          type: 'single-choice',
          options: [
            { id: 'a', label: 'ส่งข้อความยาวรวมทุกอย่างในบับเบิลเดียว' },
            { id: 'b', label: 'แบ่งเป็นประโยคสั้น ๆ หลายบับเบิล' },
            { id: 'c', label: 'ใช้ตัวพิมพ์ใหญ่ทั้งหมดเพื่อเน้นย้ำ' },
            { id: 'd', label: 'ไม่ต้องทักทายก่อนตอบคำถาม' },
          ],
          correctOptionIds: ['b'],
        },
      ]),
      ...liveChatQuestions([
        {
          id: 'q-chat-3',
          prompt: 'ตอบแชทร้านค้าที่ร้องเรียนปัญหาเดิมซ้ำเป็นครั้งที่สอง',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'นี่เป็นครั้งที่สองแล้วนะคะที่เจอปัญหาเดิม เมื่อไหร่จะแก้ได้จริงสักที' },
          ],
          modelReply:
            'เข้าใจเลยค่ะที่เจอปัญหาเดิมซ้ำ ดิฉันขอโทษด้วยนะคะ จะบันทึกเป็นกรณีร้องเรียนซ้ำและส่งต่อให้ทีมตรวจสอบเชิงลึกเพื่อแก้ไขอย่างถาวรค่ะ',
          sampleReplyKeywords: ['ขอโทษ', 'บันทึกเคส', 'ส่งต่อ', 'ตรวจสอบเชิงลึก'],
        },
      ]),
      ...choiceQuestions([
        {
          id: 'q-chat-4',
          prompt: 'ข้อใดคือหลักการตอบ Live Chat ที่ดี? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: [
            { id: 'a', label: 'ตอบให้เร็วที่สุดเท่าที่ทำได้' },
            { id: 'b', label: 'แจ้งความคืบหน้าเป็นระยะ' },
            { id: 'c', label: 'รอจนกว่าจะมั่นใจ 100% ก่อนพิมพ์อะไรเลย' },
            { id: 'd', label: 'ใช้ประโยคสั้นกระชับ' },
          ],
          correctOptionIds: ['a', 'b', 'd'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-welcome-chat-cross',
    title: 'ทบทวนรวม: น้ำเสียง + Live Chat',
    tags: ['welcome', 'live-chat'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder(
      liveChatQuestions([
        {
          id: 'q-welcome-chat-cross',
          prompt: 'ตอบแชทร้านค้าที่เริ่มมีน้ำเสียงหงุดหงิดจากปัญหาที่ยังไม่ได้รับการแก้ไข',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'ทักมาตั้งนานแล้วยังไม่มีใครตอบเลยค่ะ หงุดหงิดมากแล้วนะ' },
          ],
          modelReply:
            'ขอโทษด้วยจริง ๆ ค่ะที่ทำให้รอนาน เข้าใจเลยว่าน่าหงุดหงิด เดี๋ยวดิฉันรีบดูแลเรื่องนี้ให้ทันทีค่ะ ขอเวลาสักครู่นะคะ',
          sampleReplyKeywords: ['ขอโทษ', 'เข้าใจ', 'รีบดูแล'],
        },
      ]),
    ),
  },
  {
    id: 'quiz-order-chat-cross',
    title: 'ทบทวนรวม: เคสร้องเรียนออเดอร์ + Live Chat',
    tags: ['order-complaint', 'live-chat'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder(
      phoneCallQuestions([
        {
          id: 'q-order-chat-cross',
          prompt: 'รับสายจากร้านค้าที่ทักแชทแจ้งออเดอร์ล่าช้าแล้วโทรตามซ้ำ',
          scenario:
            'ร้านค้าเพิ่งทักแชทแจ้งว่าออเดอร์ล่าช้าและลูกค้าเริ่มโทรมาต่อว่า ตอนนี้โทรตามซ้ำทางโทรศัพท์อีกครั้ง',
          callerLines: [
            'สวัสดีค่ะ เมื่อกี้แชทไปแล้วเรื่องออเดอร์ล่าช้า ตอนนี้ลูกค้าโทรมาต่อว่าอีกแล้วค่ะ',
            'ช่วยดูให้หน่อยได้ไหมคะว่าไรเดอร์อยู่ไหนแล้ว',
          ],
          modelReplyDescription:
            'คำตอบที่ดีควรตอบทันทีว่ากำลังตรวจสอบตำแหน่งไรเดอร์ให้ พร้อมอัปเดตความคืบหน้าอย่างต่อเนื่อง ไม่ปล่อยให้ร้านค้ารอเงียบ ๆ',
          sampleReplyKeywords: ['ตรวจสอบ', 'ไรเดอร์', 'อัปเดต'],
        },
      ]),
    ),
  },
  {
    id: 'quiz-wmaadv-basics',
    title: 'แบบทดสอบพื้นฐาน: แก้ปัญหาระดับสูงใน WMA',
    tags: ['wma-advanced'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...liveChatQuestions([
        {
          id: 'q-wmaadv-1',
          prompt: 'ตอบแชทร้านค้าที่แจ้งหลายปัญหาพร้อมกันในข้อความเดียว',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'เมนูหายจากการค้นหาด้วย แล้วค่าโฆษณาก็แพงขึ้นด้วยค่ะ งงมากเลย' },
          ],
          modelReply:
            'ขอบคุณที่แจ้งทั้งสองเรื่องนะคะ ดิฉันขอแยกตรวจสอบทีละเรื่องเลยค่ะ เริ่มจากเมนูที่หายจากการค้นหาก่อน แล้วจะดูเรื่องค่าโฆษณาต่อให้ค่ะ',
          sampleReplyKeywords: ['แยกทีละเรื่อง', 'ตรวจสอบ', 'เมนู', 'โฆษณา'],
        },
      ]),
      ...choiceQuestions([
        {
          id: 'q-wmaadv-2',
          prompt: 'สาเหตุขั้นสูงของ "เมนูไม่แสดงในการค้นหา" ทั้งที่กดบันทึกแล้วคืออะไร?',
          type: 'single-choice',
          options: [
            { id: 'a', label: 'ขาดรูปภาพบังคับหรือข้อมูลจำเป็นบางอย่าง ทำให้ไม่ผ่านการเผยแพร่อัตโนมัติ' },
            { id: 'b', label: 'ร้านค้าใช้ Wongnai POS' },
            { id: 'c', label: 'ค่าโฆษณาหมด' },
            { id: 'd', label: 'เมนูนั้นมีราคาแพงเกินไป' },
          ],
          correctOptionIds: ['a'],
        },
        {
          id: 'q-wmaadv-3',
          prompt: 'ก่อนสรุปว่าค่าโฆษณาผิดปกติ ควรตรวจสอบอะไรก่อน?',
          type: 'single-choice',
          options: [
            { id: 'a', label: 'ร้านค้าเพิ่งปรับงบแคมเปญเองหรือไม่' },
            { id: 'b', label: 'ร้านค้าใช้เมนูกี่รายการ' },
            { id: 'c', label: 'จำนวนพนักงานของร้าน' },
            { id: 'd', label: 'สีของโลโก้ร้าน' },
          ],
          correctOptionIds: ['a'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-menu-wmaadv-cross',
    title: 'ทบทวนรวม: ตั้งค่าเมนู + แก้ปัญหาระดับสูง WMA',
    tags: ['menu-setup', 'wma-advanced'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder(
      salesforceQuestions([
        {
          id: 'q-menu-wmaadv-cross',
          prompt: 'บันทึกเคสเมนูที่ไม่แสดงในการค้นหาทั้งที่กรอกข้อมูลครบ',
          scenario:
            'ร้าน "ร้านของหวานทิพย์" แจ้งว่าเมนูที่เพิ่งเพิ่มไม่แสดงในการค้นหา ทั้งที่กรอกชื่อ ราคา และหมวดหมู่ครบแล้ว ตรวจสอบพบว่าขาดรูปภาพบังคับที่จำเป็นต่อการเผยแพร่อัตโนมัติ',
          priorityOptions: ['Low', 'Medium', 'High', 'Urgent'],
          caseTypeOptions: ['Menu & Listing Support', 'Advertising Billing', 'Payout Discrepancy', 'Account Access'],
          mockAccounts: [{ id: 'acc-1', merchantName: 'ร้านของหวานทิพย์', businessType: 'ร้านของหวาน' }],
          idealCase: {
            subject: 'เมนูไม่แสดงในการค้นหาเนื่องจากขาดรูปภาพบังคับ — ร้านของหวานทิพย์',
            description:
              'เมนูที่เพิ่งเพิ่มของร้านของหวานทิพย์ไม่แสดงในการค้นหา ทั้งที่กรอกชื่อ ราคา และหมวดหมู่ครบแล้ว ตรวจสอบพบว่าขาดรูปภาพบังคับที่จำเป็นต่อการเผยแพร่อัตโนมัติ',
            priority: 'Medium',
            caseType: 'Menu & Listing Support',
            accountId: 'acc-1',
          },
        },
      ]),
    ),
  },
  {
    id: 'quiz-ads-wmaadv-cross',
    title: 'ทบทวนรวม: โฆษณา + แก้ปัญหาระดับสูง WMA',
    tags: ['ads-payout', 'wma-advanced'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder(
      phoneCallQuestions([
        {
          id: 'q-ads-wmaadv-cross',
          prompt: 'รับสายจากร้านค้าที่สงสัยว่าทำไมค่าโฆษณาสัปดาห์นี้สูงขึ้นมาก',
          scenario:
            'ร้านค้าโทรเข้ามาถามว่าทำไมค่าโฆษณาสัปดาห์นี้สูงขึ้นมากผิดปกติ อยากรู้สาเหตุก่อนจะตัดสินใจอะไรต่อ',
          callerLines: ['สวัสดีค่ะ ทำไมค่าโฆษณาสัปดาห์นี้สูงขึ้นมากเลยคะ ไม่เข้าใจว่าเกิดจากอะไร'],
          modelReplyDescription:
            'คำตอบที่ดีควรแนะนำให้ตรวจสอบประวัติการปรับงบแคมเปญของร้านเองในช่วงที่ผ่านมาก่อน เพราะมักเป็นสาเหตุที่พบบ่อยที่สุด ก่อนจะสรุปว่าเป็นปัญหาจากระบบ',
          sampleReplyKeywords: ['ตรวจสอบ', 'งบแคมเปญ', 'สาเหตุ'],
        },
      ]),
    ),
  },
  {
    id: 'quiz-wmaadv-sf-cross',
    title: 'ทบทวนข้ามคอร์ส: แก้ปัญหาระดับสูง WMA + Salesforce',
    tags: ['wma-advanced', 'salesforce-case'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder(
      salesforceQuestions([
        {
          id: 'q-wmaadv-sf-cross',
          prompt: 'บันทึกเคสหลักให้ถูกต้องเมื่อร้านค้าแจ้งหลายปัญหาพร้อมกัน',
          scenario:
            'ร้าน "ร้านหมูกระทะทองแดง" แจ้งว่าเมนูหายจากการค้นหา และยังถามเรื่องค่าโฆษณาที่ปรับเอง ปัญหาเมนูกระทบรายได้โดยตรงมากกว่า',
          priorityOptions: ['Low', 'Medium', 'High', 'Urgent'],
          caseTypeOptions: ['Menu & Listing Support', 'Advertising Billing', 'Payout Discrepancy', 'Account Access'],
          mockAccounts: [{ id: 'acc-1', merchantName: 'ร้านหมูกระทะทองแดง', businessType: 'ร้านอาหาร' }],
          idealCase: {
            subject: 'เมนูหายจากการค้นหา (ประเด็นหลัก) พร้อมสอบถามค่าโฆษณา — ร้านหมูกระทะทองแดง',
            description:
              'ร้านหมูกระทะทองแดงแจ้ง 2 ประเด็น: เมนูหายจากการค้นหา (กระทบรายได้โดยตรง เป็นประเด็นหลัก) และค่าโฆษณาที่ปรับเอง (ประเด็นรอง)',
            priority: 'High',
            caseType: 'Menu & Listing Support',
            accountId: 'acc-1',
          },
        },
      ]),
    ),
  },
  {
    id: 'quiz-chat-sf-cross',
    title: 'ทบทวนรวม: Live Chat + Salesforce',
    tags: ['live-chat', 'salesforce-case'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder(
      liveChatQuestions([
        {
          id: 'q-chat-sf-cross',
          prompt: 'ตอบแชทร้านค้าก่อนสรุปเปิดเคสใน Salesforce',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'เรื่องที่คุยกันไปเมื่อกี้ ทางร้านต้องรออีกนานไหมคะกว่าจะมีคนติดต่อกลับ' },
          ],
          modelReply:
            'เดี๋ยวดิฉันสรุปรายละเอียดที่คุยกันเป็นข้อความสั้น ๆ แล้วเปิดเคสให้ทันทีเลยนะคะ จะมีทีมติดต่อกลับไปตามที่แจ้งไว้ในเคสค่ะ',
          sampleReplyKeywords: ['สรุป', 'เปิดเคส', 'ติดต่อกลับ'],
        },
      ]),
    ),
  },
  {
    id: 'quiz-chat-order-sf-triple-cross',
    title: 'ทบทวนใหญ่: Live Chat + เคสร้องเรียนออเดอร์ + Salesforce',
    tags: ['order-complaint', 'live-chat', 'salesforce-case'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder(
      salesforceQuestions([
        {
          id: 'q-chat-order-sf-triple-cross',
          prompt: 'บันทึกเคสหลังตอบแชทและสรุปเคสร้านที่คืนเงินลูกค้าเอง',
          scenario:
            'ร้าน "ร้านยำแซ่บอีสาน" ทักแชทว่าของขาดหายและได้คืนเงินลูกค้าเองไปแล้ว อยากให้ชดเชยยอดโอน หลังตอบแชทและสรุปเคสแล้ว ให้เปิดเคสด้วยรายละเอียดที่ครบถ้วน',
          timeLimitSeconds: 150,
          priorityOptions: ['Low', 'Medium', 'High', 'Urgent'],
          caseTypeOptions: ['Payout Discrepancy', 'Order Issue', 'Advertising Billing', 'Account Access'],
          mockAccounts: [{ id: 'acc-1', merchantName: 'ร้านยำแซ่บอีสาน', businessType: 'ร้านอาหาร' }],
          idealCase: {
            subject: 'ขอชดเชยยอดโอนจากการคืนเงินลูกค้าเอง — ร้านยำแซ่บอีสาน',
            description:
              'ร้านยำแซ่บอีสานทักแชทแจ้งของขาดหายและคืนเงินลูกค้าเองไปแล้ว ต้องการให้ชดเชยยอดโอน สรุปและเปิดเคส Payout Discrepancy พร้อมรายละเอียดครบถ้วน',
            priority: 'High',
            caseType: 'Payout Discrepancy',
            accountId: 'acc-1',
          },
        },
      ]),
    ),
  },
  {
    id: 'quiz-menu-ads-wmaadv-triple-cross',
    title: 'ทบทวนใหญ่: เมนู + โฆษณา + แก้ปัญหาระดับสูง WMA',
    tags: ['menu-setup', 'ads-payout', 'wma-advanced'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder(
      phoneCallQuestions([
        {
          id: 'q-menu-ads-wmaadv-triple-cross',
          prompt: 'รับสายจากร้านค้าใหม่ที่โปรไฟล์ไม่ครบและอยากลองเปิดโฆษณาแก้ปัญหา',
          scenario:
            'ร้านค้าใหม่โทรเข้ามาบอกว่าทั้งเมนูไม่ขึ้นค้นหาและอยากลองเปิดโฆษณาเพื่อแก้ปัญหาการมองเห็น',
          callerLines: ['สวัสดีค่ะ เมนูร้านไม่ค่อยขึ้นตอนลูกค้าค้นหาเลย อยากลองเปิดโฆษณาดูว่าจะช่วยไหมคะ'],
          modelReplyDescription:
            'คำตอบที่ดีควรแนะนำให้แก้ไขความครบถ้วนของโปรไฟล์/เมนูก่อน เพราะเป็นสาเหตุหลักและให้ผลลัพธ์ที่ยั่งยืนกว่าการพึ่งโฆษณาเพียงอย่างเดียว',
          sampleReplyKeywords: ['โปรไฟล์ครบถ้วน', 'เมนู', 'ยั่งยืน', 'แนะนำ'],
        },
      ]),
    ),
  },
  {
    id: 'quiz-pos-basics',
    title: 'แบบทดสอบพื้นฐาน: Wongnai POS',
    tags: ['pos-basics'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...liveChatQuestions([
        {
          id: 'q-pos-1',
          prompt: 'ตอบแชทร้านค้าที่สต๊อกในระบบไม่ตรงกับของจริงในครัว',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'สต๊อกวัตถุดิบในระบบไม่ตรงกับของจริงในครัวเลยค่ะ ทำไงดี' },
          ],
          modelReply:
            'ปัญหานี้ส่วนใหญ่เกิดจากยังไม่ได้ตั้งค่าสูตร BOM ให้ครบทุกเมนูค่ะ เดี๋ยวดิฉันแนะนำวิธีตรวจสอบและตั้งค่าให้ถูกต้องนะคะ',
          sampleReplyKeywords: ['BOM', 'ตัดสต๊อก', 'ตรวจสอบ'],
        },
      ]),
      ...phoneCallQuestions([
        {
          id: 'q-pos-2',
          prompt: 'รับสายจากร้านค้าที่อยากให้อธิบายว่า BOM คืออะไร',
          scenario:
            'ร้านค้าโทรเข้ามาถามว่า BOM ในระบบ POS คืออะไร เพราะเพิ่งเริ่มใช้งานและไม่เข้าใจศัพท์นี้',
          callerLines: ['สวัสดีค่ะ ในระบบมันมีคำว่า BOM อยู่ อันนี้คืออะไรคะ'],
          modelReplyDescription:
            'คำตอบที่ดีควรอธิบายง่าย ๆ ว่า BOM คือสูตรที่บอกระบบว่าเมนูแต่ละจานใช้วัตถุดิบอะไรบ้างและปริมาณเท่าไร เพื่อให้ระบบตัดสต๊อกอัตโนมัติเมื่อขายเมนูนั้น โดยไม่ใช้ศัพท์เทคนิคเพิ่มเติม',
          sampleReplyKeywords: ['สูตร', 'วัตถุดิบ', 'ตัดสต๊อกอัตโนมัติ'],
        },
      ]),
      ...choiceQuestions([
        {
          id: 'q-pos-3',
          prompt: 'ข้อใดคือประโยชน์ของ Wongnai POS? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: [
            { id: 'a', label: 'เห็นยอดขายแบบเรียลไทม์' },
            { id: 'b', label: 'ลดความผิดพลาดในการรับออเดอร์หลายช่องทาง' },
            { id: 'c', label: 'รับประกันวัตถุดิบไม่มีวันหมด' },
            { id: 'd', label: 'ติดตามต้นทุนผ่านการตัดสต๊อกอัตโนมัติ' },
          ],
          correctOptionIds: ['a', 'b', 'd'],
        },
        {
          id: 'q-pos-4',
          prompt: 'POS รองรับการรับออเดอร์จากช่องทางใดบ้าง?',
          type: 'single-choice',
          options: [
            { id: 'a', label: 'ทั้งออเดอร์หน้าร้าน (dine-in) และออเดอร์ออนไลน์ในระบบเดียวกัน' },
            { id: 'b', label: 'เฉพาะออเดอร์หน้าร้านเท่านั้น' },
            { id: 'c', label: 'เฉพาะออเดอร์ออนไลน์เท่านั้น' },
            { id: 'd', label: 'ไม่รองรับออเดอร์ใด ๆ' },
          ],
          correctOptionIds: ['a'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-hardware-basics',
    title: 'แบบทดสอบพื้นฐาน: อุปกรณ์ฮาร์ดแวร์หน้าร้าน',
    tags: ['hardware-basics'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...phoneCallQuestions([
        {
          id: 'q-hw-1',
          prompt: 'รับสายจากร้านค้าที่เครื่อง EDC รับชำระไม่ได้เลย',
          scenario:
            'ร้านค้าโทรเข้ามาแจ้งว่าเครื่อง EDC รับชำระไม่ได้เลยตั้งแต่เปิดร้าน ลูกค้าเริ่มบ่นแล้ว',
          callerLines: ['สวัสดีค่ะ เครื่อง EDC รับชำระไม่ได้เลยค่ะ ลูกค้ารอจ่ายเงินอยู่'],
          modelReplyDescription:
            'คำตอบที่ดีควรแนะนำให้ตรวจสอบก่อนว่าเครื่อง EDC เชื่อมต่อกับ POS อยู่หรือไม่ และแบตเตอรี่/สัญญาณปกติดีหรือไม่ ก่อนจะส่งต่อทีมช่าง',
          sampleReplyKeywords: ['เชื่อมต่อ', 'แบตเตอรี่', 'สัญญาณ', 'ตรวจสอบ'],
        },
      ]),
      ...choiceQuestions([
        {
          id: 'q-hw-2',
          prompt: 'ก่อนส่งต่อเคสเครื่องพิมพ์ใบเสร็จไม่ทำงาน ควรตรวจสอบอะไรบ้าง? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: [
            { id: 'a', label: 'กระดาษหมดหรือใส่ผิดด้าน' },
            { id: 'b', label: 'สายเชื่อมต่อ/Bluetooth' },
            { id: 'c', label: 'สีโลโก้บนใบเสร็จ' },
            { id: 'd', label: 'เครื่องเปิดอยู่หรือไม่' },
          ],
          correctOptionIds: ['a', 'b', 'd'],
        },
      ]),
      ...liveChatQuestions([
        {
          id: 'q-hw-3',
          prompt: 'ตอบแชทร้านค้าที่แท็บเล็ตรัน POS ค้างบ่อย',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'แท็บเล็ตที่รัน POS ค้างบ่อยมากเลยค่ะ ทำไงดี' },
          ],
          modelReply:
            'ลองรีสตาร์ทเครื่องก่อนเป็นอันดับแรกนะคะ ปิดแอปอื่นที่เปิดค้างอยู่เบื้องหลัง และตรวจสอบพื้นที่เก็บข้อมูลด้วยค่ะ ถ้ายังค้างอยู่ดิฉันจะส่งต่อให้ทีมช่างดูแลต่อค่ะ',
          sampleReplyKeywords: ['รีสตาร์ท', 'พื้นที่ว่าง', 'ทีมช่าง'],
        },
      ]),
      ...choiceQuestions([
        {
          id: 'q-hw-4',
          prompt: 'อุปกรณ์หลัก 3 อย่างที่ร้านค้าใช้งานคู่กับ POS คืออะไร?',
          type: 'multi-choice',
          options: [
            { id: 'a', label: 'เครื่อง EDC' },
            { id: 'b', label: 'เครื่องพิมพ์ใบเสร็จ' },
            { id: 'c', label: 'แท็บเล็ต/iPad' },
            { id: 'd', label: 'เครื่องถ่ายเอกสาร' },
          ],
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-rider-basics',
    title: 'แบบทดสอบพื้นฐาน: ไรเดอร์และการจัดส่ง',
    tags: ['rider-basics'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...phoneCallQuestions([
        {
          id: 'q-rider-1',
          prompt: 'รับสายจากร้านค้าที่สงสัยว่าทำไมไรเดอร์มารับช้าผิดปกติ',
          scenario: 'ร้านค้าโทรเข้ามาถามว่าทำไมบางช่วงไรเดอร์มารับออเดอร์ช้าผิดปกติ',
          callerLines: ['สวัสดีค่ะ ทำไมบางช่วงไรเดอร์มารับออเดอร์นานผิดปกติเลยคะ'],
          modelReplyDescription:
            'คำตอบที่ดีควรอธิบายว่าความล่าช้ามักมาจากไรเดอร์ว่างในพื้นที่น้อยกว่าปกติเมื่อเทียบกับจำนวนออเดอร์ในช่วงเวลานั้น ไม่ใช่ความผิดของร้านหรือระบบจงใจหน่วงเวลา',
          sampleReplyKeywords: ['ไรเดอร์ว่าง', 'ช่วงเวลา', 'ปริมาณออเดอร์'],
        },
      ]),
      ...choiceQuestions([
        {
          id: 'q-rider-2',
          prompt: 'คุณสมบัติที่ผู้สมัครเป็นไรเดอร์ต้องมีคือข้อใด? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: [
            { id: 'a', label: 'มีรถจักรยานยนต์' },
            { id: 'b', label: 'มีใบขับขี่ที่ถูกต้อง' },
            { id: 'c', label: 'อายุ 18 ปีขึ้นไป' },
            { id: 'd', label: 'เคยเป็นพนักงานร้านอาหารมาก่อน' },
          ],
          correctOptionIds: ['a', 'b', 'c'],
        },
        {
          id: 'q-rider-3',
          prompt: 'ไรเดอร์สมัครงานผ่านช่องทางใด?',
          type: 'single-choice',
          options: [
            { id: 'a', label: 'แอป LINE MAN RIDER' },
            { id: 'b', label: 'Wongnai POS' },
            { id: 'c', label: 'Wongnai Merchant App' },
            { id: 'd', label: 'อีเมล' },
          ],
          correctOptionIds: ['a'],
        },
      ]),
      ...liveChatQuestions([
        {
          id: 'q-rider-4',
          prompt: 'ตอบแชทร้านค้าที่สงสัยว่าทำไมค่าส่งที่ลูกค้าจ่ายไม่เท่ากับที่ไรเดอร์ได้รับ',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'ทำไมค่าส่งที่ลูกค้าจ่ายถึงไม่เท่ากับที่ไรเดอร์ได้รับเป๊ะ ๆ คะ' },
          ],
          modelReply:
            'ค่าส่งที่ลูกค้าเห็นอาจรวมส่วนลดโปรโมชันหรือค่าสนับสนุนจากระบบด้วยค่ะ ในขณะที่ไรเดอร์ได้รับค่าตอบแทนตามโครงสร้างที่ระบบกำหนดไว้ ซึ่งอาจไม่เท่ากับยอดที่ลูกค้าจ่ายเป๊ะ ๆ เสมอไปนะคะ',
          sampleReplyKeywords: ['ส่วนลดโปรโมชัน', 'ค่าสนับสนุน', 'โครงสร้าง'],
        },
      ]),
    ]),
  },
];
