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

function opts(...labels: string[]): ChoiceOption[] {
  return labels.map((label, i) => ({ id: String.fromCharCode(97 + i), label }));
}

export const seedQuizzes: Quiz[] = [
  // ── Course 1 per-lesson quizzes ───────────────────────────────────
  {
    id: 'quiz-mo1',
    title: 'แบบทดสอบ: ภาพรวมธุรกิจ LMWN และทีม CS',
    tags: ['mo-overview'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-mo1-1',
          prompt: 'ช่องทางใดที่ร้านค้าติดต่อทีม CS มากที่สุด?',
          type: 'single-choice',
          options: opts('โทรศัพท์ (Telephony)', 'Live Chat', 'Slack', 'อีเมล'),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-mo1-2',
          prompt: 'แอปใดที่ CS ใช้เช็กข้อมูลร้าน Tier และ Ranking?',
          type: 'single-choice',
          options: opts('Salesforce', 'Wongnai Merchant App', 'Wongnai POS', 'LINE MAN ฝั่งลูกค้า'),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-mo1-3',
          prompt: 'ข้อใดเป็นแอปที่เกี่ยวข้องกับร้านค้าโดยตรง? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'Wongnai Merchant App (WMA)',
            'Wongnai POS',
            'Manager App',
            'LINE MAN DRIVER (แอปรับส่งผู้โดยสาร)',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
        {
          id: 'q-mo1-4',
          prompt: 'เป้าหมาย 3 เรื่องที่ LMWN วางไว้ให้ร้านค้ามีอะไรบ้าง?',
          type: 'multi-choice',
          options: opts(
            'เพิ่มความสะดวก (Enhance Convenience)',
            'กระตุ้นการสั่งซื้อ (Increase Orders)',
            'เร่งการเติบโต (Further Growth)',
            'ลดจำนวนพนักงานในร้าน',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...liveChatQuestions([
        {
          id: 'q-mo1-5',
          prompt: 'ตอบแชทร้านที่กดรับออเดอร์ไม่ได้และไม่รู้จะแจ้งใคร',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'กดรับออเดอร์ LINE MAN ไม่ได้เลยค่ะ จอค้าง ไม่รู้ต้องแจ้งตรงไหน' },
          ],
          modelReply:
            'เข้าใจว่าเร่งด่วนมากนะคะ เดี๋ยวแอดมินช่วยดูให้เลยค่ะ รบกวนแจ้งหมายเลขออเดอร์และชื่อร้าน ระหว่างนี้ลองปิดแล้วเปิดแอป WMA ใหม่ก่อน ถ้ายังไม่ได้แอดมินจะรีบตรวจสอบสถานะระบบให้ทันทีค่ะ',
          sampleReplyKeywords: ['เข้าใจ', 'หมายเลขออเดอร์', 'WMA', 'ตรวจสอบ'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-mo2',
    title: 'แบบทดสอบ: ประเภทร้าน Official vs E-Menu',
    tags: ['mo-merchant-types'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-mo2-1',
          prompt: 'ร้านประเภทใดที่คนขับต้องโทรยืนยันราคากับลูกค้าก่อนสั่งทำอาหาร?',
          type: 'single-choice',
          options: opts('ร้าน Official', 'ร้าน E-Menu (Standard)', 'ร้าน Mart SP', 'ทุกร้าน'),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-mo2-2',
          prompt: 'ร้าน Mart แบ่งเป็นประเภทใดบ้าง?',
          type: 'single-choice',
          options: opts(
            'Mart ทั่วไป และ Mart SP',
            'Mart Official และ Mart E-Menu',
            'Mart Food และ Mart Drink',
            'Mart เดี่ยว และ Mart เชน',
          ),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-mo2-3',
          prompt: 'ข้อใดเป็นจริงเกี่ยวกับร้าน Official? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'แก้ไขข้อมูลร้านและเมนูเองได้',
            'รับออเดอร์โดยตรงผ่าน WMA',
            'คนขับไม่ต้องโทรยืนยันราคา',
            'เจ้าหน้าที่ LINE MAN เป็นผู้ลงข้อมูลให้',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
        {
          id: 'q-mo2-4',
          prompt: 'เงื่อนไขการจัดส่งของร้าน Mart ข้อใดถูกต้อง?',
          type: 'multi-choice',
          options: opts(
            'น้ำหนักสินค้าสำหรับจัดส่งไม่เกิน 15 กิโลกรัม',
            'ขนาดแต่ละด้านไม่เกิน 40 เซนติเมตร',
            'ร้าน Mart ทั้งหมดเป็นประเภท Official',
            'ขายเครื่องดื่มแอลกอฮอล์ได้',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...phoneCallQuestions([
        {
          id: 'q-mo2-5',
          prompt: 'รับสายจากเจ้าของร้านที่แก้เมนูเองไม่ได้',
          scenario: 'ร้านอยู่บน LINE MAN แบบ E-Menu โทรมาถามว่าทำไมแก้ราคาเมนูเองไม่ได้ และต้องทำอย่างไร',
          callerLines: ['ร้านผมอยู่บน LINE MAN แต่แก้ราคาเมนูเองไม่ได้เลย ต้องทำยังไง'],
          modelReplyDescription:
            'คำตอบที่ดีควรอธิบายว่าร้านยังเป็นแบบ E-Menu ที่เจ้าหน้าที่ลงข้อมูลให้ จึงแก้เองไม่ได้ หากต้องการจัดการร้านเอง แนะนำให้สมัครเปิดร้านแบบ Official ผ่าน Wongnai Merchant App และเสนอส่งขั้นตอนการสมัครให้',
          sampleReplyKeywords: ['E-Menu', 'Official', 'Wongnai Merchant App', 'สมัคร'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-mo3',
    title: 'แบบทดสอบ: Tier, Ranking และค่า GP',
    tags: ['mo-tier-gp'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-mo3-1',
          prompt: 'เรท GP มาตรฐานรวม VAT คิดเป็นกี่เปอร์เซ็นต์ของยอดขาย?',
          type: 'single-choice',
          options: opts('30%', '32.1%', '35%', '7%'),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-mo3-2',
          prompt: 'ร้านมียอดขาย 10,000 บาท เรท GP 30% + VAT 7% ร้านได้รับเงินสุทธิเท่าไร?',
          type: 'single-choice',
          options: opts('7,000 บาท', '6,790 บาท', '6,700 บาท', '10,000 บาท'),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-mo3-3',
          prompt: 'ร้านจะได้รับเงินโอนเข้าบัญชีเมื่อยอดสะสมหลังหัก GP ครบเท่าไร?',
          type: 'single-choice',
          options: opts('100 บาท', '300 บาท', '500 บาท', '1,000 บาท'),
          correctOptionIds: ['c'],
        },
        {
          id: 'q-mo3-4',
          prompt: 'ข้อใดถูกต้องเกี่ยวกับรอบบิลค่า GP? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'ใบแจ้งหนี้ออกทุกวันที่ 1 ของเดือนถัดไป',
            'กำหนดชำระ (Due date) คือวันที่ 21',
            'ถ้าไม่ชำระตามระยะผ่อนผัน ระบบจะปิด GP และนำร้านลงจาก Delivery',
            'ตรวจสอบ Tier ได้ที่ Wongnai Merchant App',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...phoneCallQuestions([
        {
          id: 'q-mo3-5',
          prompt: 'รับสายจากร้านที่คิดว่าระบบหักเงินผิด',
          scenario: 'ร้านโทรมาบ่นว่ายอดขาย 5,000 บาท แต่ได้เงินแค่ 3,395 บาท คิดว่าระบบหักผิด',
          callerLines: ['ยอดขาย 5,000 แต่ได้แค่สามพันกว่า ระบบหักอะไรเยอะขนาดนี้'],
          modelReplyDescription:
            'คำตอบที่ดีควรอธิบายว่ายอดที่หักคือค่าบริการ GP 32.1% ของยอดขาย (5,000 × 32.1% ≈ 1,605 บาท) เหลือสุทธิ ~3,395 บาท ไม่ใช่ระบบผิด แนะนำให้ดูรายละเอียดที่ WMA > การเงิน ด้วยน้ำเสียงที่เข้าใจความกังวล',
          sampleReplyKeywords: ['GP', '32.1%', 'การเงิน', 'ตรวจสอบ'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-mo4',
    title: 'แบบทดสอบ: ลงทะเบียนร้าน เปิดเดลิเวอรี และสมัคร GP',
    tags: ['mo-wma-register'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-mo4-1',
          prompt: 'ก่อนสมัครเข้าร่วม GP ร้านต้องทำอะไรให้เสร็จก่อน?',
          type: 'single-choice',
          options: opts(
            'เปิดหน้าร้านบน LINE MAN เปิดเดลิเวอรี และเพิ่มเมนูใน WMA',
            'ซื้อเครื่อง POS จากบริษัท',
            'มียอดขายเกิน 5,000 บาท/เดือน',
            'สมัคร Ad Manager',
          ),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-mo4-2',
          prompt: '1 เลขบัตรประชาชน สมัครเปิดร้านบน LINE MAN ได้สูงสุดกี่ร้าน?',
          type: 'single-choice',
          options: opts('1 ร้าน', '3 ร้าน', '5 ร้าน', 'ไม่จำกัด'),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-mo4-3',
          prompt: 'หลังลงทะเบียนร้านใน WMA ต้องรอตรวจสอบกี่วันจึงจะ Login ได้?',
          type: 'single-choice',
          options: opts('ทันที', '1 วันทำการ', '3 วันทำการ', '7 วันทำการ'),
          correctOptionIds: ['c'],
        },
        {
          id: 'q-mo4-4',
          prompt: 'ข้อใดคือระยะเวลาที่ถูกต้อง? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'ตรวจสอบการลงทะเบียนร้าน: 3 วันทำการ',
            'อนุมัติการสมัคร GP: ประมาณ 3 วัน',
            'เริ่มใช้งาน GP: วันถัดไปหลังได้รับ SMS อนุมัติ',
            'เปิดใช้งานเดลิเวอรี: ต้องรอ 7 วันทำการ',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...phoneCallQuestions([
        {
          id: 'q-mo4-5',
          prompt: 'รับสายจากร้านที่ลงทะเบียนแล้วยัง Login ไม่ได้',
          scenario: 'ร้านลงทะเบียนเมื่อวาน วันนี้ Login ไม่ได้ ร้อนใจอยากเปิดขายวันนี้',
          callerLines: ['ลงทะเบียนไปเมื่อวานแล้ว วันนี้ยัง Login ไม่ได้ เมื่อไหร่จะเข้าได้'],
          modelReplyDescription:
            'คำตอบที่ดีควรแสดงความเข้าใจ อธิบายว่าหลังลงทะเบียนทีมต้องตรวจสอบ 3 วันทำการก่อนจึงจะ Login ได้ ไม่ใช่ความผิดพลาด แจ้งกรอบเวลาที่ชัดเจน และเสนอตรวจสอบว่าใช้เบอร์/อีเมลตรงกับที่ลงทะเบียนหรือไม่',
          sampleReplyKeywords: ['เข้าใจ', '3 วันทำการ', 'ตรวจสอบ', 'เบอร์'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-mo5',
    title: 'แบบทดสอบ: ตั้งค่าร้าน สร้างเมนู และฟีเจอร์ WMA',
    tags: ['mo-wma-features'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-mo5-1',
          prompt: 'ฟีเจอร์ใดที่ต้องสมัคร GP ก่อนจึงจะใช้งานได้?',
          type: 'single-choice',
          options: opts('สร้างเมนูอาหาร', 'สร้างโปรโมชันและ Ad Manager', 'แก้ไขข้อมูลร้าน', 'ตั้งเวลาเปิด-ปิดร้าน'),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-mo5-2',
          prompt: 'Ad Manager แบบ "เพิ่มออเดอร์" คิดค่าโฆษณาเมื่อใด?',
          type: 'single-choice',
          options: opts('เมื่อลูกค้าคลิกเข้าชมร้าน', 'เมื่อออเดอร์จัดส่งสำเร็จ', 'ทุกครั้งที่แสดงโฆษณา', 'รายเดือนแบบเหมาจ่าย'),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-mo5-3',
          prompt: 'ลำดับการสร้างเมนูบน WMA ประกอบด้วยอะไรบ้าง? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'เพิ่มประเภทอาหาร (หมวดหมู่)',
            'เพิ่มเมนู (ชื่อ ราคา รูป เลือกประเภท)',
            'เพิ่มตัวเลือกให้เมนู เช่น เส้น น้ำ/แห้ง',
            'ต้องสมัคร Ad Manager ก่อน',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
        {
          id: 'q-mo5-4',
          prompt: 'ข้อใดถูกต้องเกี่ยวกับ Ad Manager?',
          type: 'multi-choice',
          options: opts(
            'ใช้ได้เฉพาะร้านที่เข้าร่วม GP',
            'ร้านต้องเข้าไปปิด Ad เองทุกวัน',
            'ค่าโฆษณาถูกหักรวมกับค่า GP ในแต่ละวัน',
            'ระบบจะปิด Ad ให้อัตโนมัติทุกคืน',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...liveChatQuestions([
        {
          id: 'q-mo5-5',
          prompt: 'ตอบแชทร้านที่บ่นว่าค่าโฆษณาถูกหักต่อเนื่อง',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'ค่าโฆษณาโดนหักทุกวันเลย นึกว่าปิดไปแล้ว ต้องทำยังไง' },
          ],
          modelReply:
            'ขอโทษในความไม่สะดวกนะคะ Ad Manager จะเปิดต่อเนื่องอัตโนมัติจนกว่าร้านจะเข้าไปปิดเอง ค่าโฆษณาหักรวมกับค่า GP รายวันค่ะ แนะนำให้เข้าที่ Ad Manager > เลือกโฆษณาที่เปิดใช้งาน > กดปิด ระบบจะหยุดหักในวันถัดไป เดี๋ยวส่งขั้นตอนแบบมีรูปให้นะคะ',
          sampleReplyKeywords: ['ขอโทษ', 'เปิดต่อเนื่องอัตโนมัติ', 'กดปิด', 'GP'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-mo6',
    title: 'แบบทดสอบ: การรับและยกเลิกออเดอร์',
    tags: ['mo-wma-orders'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-mo6-1',
          prompt: 'ร้านต้องกดรับออเดอร์ภายในกี่นาที ไม่งั้นออเดอร์ถูกยกเลิกอัตโนมัติ?',
          type: 'single-choice',
          options: opts('3 นาที', '5 นาที', '10 นาที', '15 นาที'),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-mo6-2',
          prompt: 'ร้านยกเลิกออเดอร์เองได้ภายในกี่นาทีหลังกดรับ และไม่เกินกี่ครั้ง/สัปดาห์?',
          type: 'single-choice',
          options: opts(
            'ภายใน 30 นาที ไม่เกิน 20 ครั้ง/สัปดาห์',
            'ภายใน 60 นาที ไม่เกิน 30 ครั้ง/สัปดาห์',
            'ภายใน 60 นาที ไม่จำกัดจำนวน',
            'ยกเลิกเองไม่ได้',
          ),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-mo6-3',
          prompt: 'เมื่อพบเมนูของหมดหลังรับออเดอร์ ร้านควรทำอะไรบ้าง? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'โทรติดต่อลูกค้าก่อนแก้ไขออเดอร์',
            'สอบถามว่าลูกค้ายังต้องการรับอาหารอยู่หรือไม่',
            'กด "แก้ไขรายการ" เพื่อลบเมนูที่ของหมด',
            'ลบเมนูออกทันทีโดยไม่ต้องแจ้งลูกค้า',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
        {
          id: 'q-mo6-4',
          prompt: 'กรณีคนขับยกเลิกเพราะสาเหตุจากคนขับ ข้อใดถูกต้อง?',
          type: 'multi-choice',
          options: opts(
            'ระบบหาคนขับใหม่อัตโนมัติภายใน 6 นาที',
            'ถ้าคนขับกด "Driver to Destination" แล้ว จะหาคนขับใหม่ไม่ได้',
            'หากหาคนขับใหม่ไม่ได้ ระบบจะยกเลิกออเดอร์ให้',
            'ร้านต้องหาคนขับใหม่เองทุกครั้ง',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...salesforceQuestions([
        {
          id: 'q-mo6-5',
          prompt: 'ร้านขอให้ CS ยกเลิกออเดอร์ให้เพราะกดยกเลิกเองไม่ทัน จงบันทึกเคส',
          scenario:
            'ร้านกดรับออเดอร์เกิน 60 นาที มีเมนูของหมด โทรลูกค้าแล้วลูกค้าไม่ต้องการสินค้า ร้านยกเลิกเองไม่ได้ ขอให้ CS ยกเลิกให้ผ่าน Live Chat พร้อมรหัสออเดอร์',
          priorityOptions: ['ต่ำ', 'ปานกลาง', 'สูง', 'เร่งด่วน'],
          caseTypeOptions: [
            'CS ยกเลิกออเดอร์ให้ร้าน',
            'ปัญหาการรับออเดอร์',
            'ส่งต่อทีม Merchant',
            'สอบถามการใช้งาน WMA',
          ],
          mockAccounts: [
            { id: 'acc1', merchantName: 'ร้านก๋วยเตี๋ยวเรือป้านิด', businessType: 'ร้านอาหารตามสั่ง' },
            { id: 'acc2', merchantName: 'คาเฟ่บ้านสวน', businessType: 'คาเฟ่' },
          ],
          idealCase: {
            subject: 'CS ยกเลิกออเดอร์ให้ร้าน: เมนูของหมด ลูกค้าไม่ต้องการสินค้า',
            description:
              'ร้านกดรับออเดอร์เกิน 60 นาที จึงยกเลิกเองไม่ได้ มีเมนูของหมด ลูกค้าไม่ต้องการสินค้า ขอให้ CS ยกเลิกให้ แนบรหัสออเดอร์และเหตุผลในเคส',
            priority: 'สูง',
            caseType: 'CS ยกเลิกออเดอร์ให้ร้าน',
            accountId: 'acc1',
          },
        },
      ]),
    ]),
  },
  {
    id: 'quiz-mo7',
    title: 'แบบทดสอบ: Delivery Flows, Claim และแคมเปญ',
    tags: ['mo-flow-claim'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-mo7-1',
          prompt: 'Switch Flow ต่างจาก Normal Operations Flow อย่างไร?',
          type: 'single-choice',
          options: opts(
            'ร้านกดทำอาหารเสร็จก่อน แล้วระบบจึงเริ่มหาคนขับ',
            'ลูกค้าไม่ต้องยืนยันราคา',
            'ร้านไม่ต้องกดรับออเดอร์',
            'ใช้ได้เฉพาะร้าน E-Menu',
          ),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-mo7-2',
          prompt: 'ร้านต้องส่งฟอร์มขอเคลมค่าอาหารภายในกี่ชั่วโมงหลังออเดอร์ถูกยกเลิก?',
          type: 'single-choice',
          options: opts('12 ชั่วโมง', '24 ชั่วโมง', '48 ชั่วโมง', '3 วันทำการ'),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-mo7-3',
          prompt: 'กรณีใดที่ร้าน "เคลมค่าอาหารไม่ได้"? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'กดรับออเดอร์ไม่ทัน (cancel_timeout)',
            'ออเดอร์ซ้ำที่ห่างกันน้อยกว่า 20 นาที',
            'ร้าน Switch Flow ไม่กดพร้อมส่ง จนลูกค้ายกเลิก',
            'คนขับยกเลิกหลังร้านทำอาหารเสร็จแล้ว',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
        {
          id: 'q-mo7-4',
          prompt: 'ข้อใดถูกต้องเกี่ยวกับการยกเลิกแคมเปญ?',
          type: 'multi-choice',
          options: opts(
            'CS ต้องส่งฟอร์มยกเลิกให้ร้านตามประเภทแคมเปญ',
            'ทีมงานนำโปรโมชันลงภายใน 7 วันทำการ',
            'แคมเปญโคดเดือด ยกเลิกภายใน 1 วันทำการ',
            'ร้านยกเลิกแคมเปญได้ทันทีโดยไม่ต้องกรอกฟอร์ม',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...liveChatQuestions([
        {
          id: 'q-mo7-5',
          prompt: 'ตอบแชทร้าน Mart ที่ต้องการเคลมค่าสินค้า',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'ลูกค้าได้ของไม่ครบ มูลค่า 700 บาท ร้าน Mart จะเคลมยังไงคะ' },
          ],
          modelReply:
            'สำหรับร้าน Mart การเคลมต้องแจ้งผ่าน Live Chat ภายใน 24 ชั่วโมงหลังเกิดการยกเลิก เงื่อนไขคือมูลค่าสินค้ารวม ≥ 500 บาท แนะนำให้ถ่ายรูปสินค้าในบรรจุภัณฑ์พร้อมส่งเก็บไว้เป็นหลักฐาน แอดมินจะรับเรื่องประสานทีมที่เกี่ยวข้อง ร้านจะทราบผลภายใน 3 วันทำการทางอีเมลและ SMS ค่ะ',
          sampleReplyKeywords: ['Live Chat', '24 ชั่วโมง', 'รูปถ่าย', '3 วันทำการ'],
        },
      ]),
    ]),
  },

  // ── Course 2 per-lesson quizzes ───────────────────────────────────
  {
    id: 'quiz-wp1',
    title: 'แบบทดสอบ: POS เบื้องต้นและประเภทร้านอาหาร',
    tags: ['wp-basics'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-wp1-1',
          prompt: 'ร้านคาเฟ่ที่ลูกค้าสั่งและจ่ายที่เคาน์เตอร์ก่อนรับเครื่องดื่ม จัดเป็นประเภทใด?',
          type: 'single-choice',
          options: opts('Quick Service', 'Full Service', 'Buffet Service', 'E-Menu'),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-wp1-2',
          prompt: 'ข้อใดอธิบาย "Software" ของ POS ได้ถูกต้อง?',
          type: 'single-choice',
          options: opts(
            'อุปกรณ์ที่ใช้รับออเดอร์และพิมพ์ใบเสร็จ',
            'โปรแกรมที่ประมวลผลข้อมูล คำนวณยอดขาย และบันทึกข้อมูล',
            'ลิ้นชักเก็บเงินและเครื่อง EDC',
            'สาย LAN และ Router',
          ),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-wp1-3',
          prompt: 'LINE MAN POS แบ่งเป็นกี่ระบบปฏิบัติการ อะไรบ้าง?',
          type: 'single-choice',
          options: opts(
            '1 ระบบ คือ Android',
            '2 ระบบ คือ Android และ iOS',
            '3 ระบบ คือ Android, iOS และ Windows',
            '2 ระบบ คือ iOS และ Windows',
          ),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-wp1-4',
          prompt: 'POS ช่วยจัดการเรื่องใดบ้าง นอกจากการคิดเงิน? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'จัดการคิวและโต๊ะหน้าร้าน',
            'ตรวจสอบรายงานและจัดการคลังสินค้า',
            'เชื่อมต่อและจัดการออเดอร์เดลิเวอรี LINE MAN',
            'สมัครสินเชื่อธนาคารแทนร้าน',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...liveChatQuestions([
        {
          id: 'q-wp1-5',
          prompt: 'ตอบแชทร้านเล็กที่สงสัยว่า POS จำเป็นไหม',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'ร้านเล็ก ๆ มีเครื่องคิดเลขก็พอแล้วมั้ง POS จำเป็นด้วยเหรอ' },
          ],
          modelReply:
            'เข้าใจค่ะ POS ไม่ใช่แค่เครื่องคิดเงินนะคะ แต่ช่วยเก็บรายงานยอดขายและเมนูขายดีอัตโนมัติ จัดการสต๊อกวัตถุดิบ สร้างโปรโมชัน และเชื่อมรับออเดอร์เดลิเวอรี LINE MAN ในเครื่องเดียว ช่วยลดงานจดมือและข้อผิดพลาด ทำให้บริหารร้านง่ายขึ้นมากค่ะ',
          sampleReplyKeywords: ['รายงาน', 'สต๊อก', 'โปรโมชัน', 'เดลิเวอรี'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-wp2',
    title: 'แบบทดสอบ: Wongnai POS Hardware',
    tags: ['wp-hardware'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-wp2-1',
          prompt: 'Wongnai POS รุ่นใดเป็นรุ่นเดียวที่มีแบตเตอรี่ในตัวเครื่อง?',
          type: 'single-choice',
          options: opts('Lite', 'Flex', 'Single', 'Dual'),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-wp2-2',
          prompt: 'ร้านที่ใช้ Wongnai POS (Android) ต้องใช้เครื่อง Hardware แบบใด?',
          type: 'single-choice',
          options: opts(
            'Android Tablet รุ่นใดก็ได้ของร้านเอง',
            'เครื่อง Hardware จากบริษัทเท่านั้น',
            'iPad ของร้านเอง',
            'โทรศัพท์มือถือทั่วไป',
          ),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-wp2-3',
          prompt: 'ข้อใดเป็นจริงเกี่ยวกับรุ่น Lite? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'มีหน้าจอขนาดใหญ่ 15.6 นิ้ว',
            'ไม่มีแบตเตอรี่ในตัว ต้องเสียบปลั๊กตลอด',
            'ไม่มีเครื่องพิมพ์ในตัว ต้องต่อเครื่องพิมพ์เสริม',
            'มี 2 หน้าจอสำหรับพนักงานและลูกค้า',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
        {
          id: 'q-wp2-4',
          prompt: 'ข้อใดถูกต้องเกี่ยวกับ Wongnai POS Hardware?',
          type: 'multi-choice',
          options: opts(
            'ใช้ POS 1 เครื่องต่อ 1 สาขา',
            'ดาวน์โหลดโปรแกรมจาก Sunmi Store บนเครื่องบริษัท',
            'รุ่น Dual มี 2 หน้าจอ สำหรับพนักงานและลูกค้าสแกน QR',
            'ติดตั้งโปรแกรมลงมือถือส่วนตัวของร้านได้',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...phoneCallQuestions([
        {
          id: 'q-wp2-5',
          prompt: 'รับสายจากร้านที่อยากได้เครื่อง POS พกพาไปออกบูธ',
          scenario: 'ร้านคาเฟ่ไปออกบูธบ่อย บางที่ไม่มีปลั๊กไฟ อยากได้เครื่องที่มีแบตในตัว',
          callerLines: ['ร้านไปออกบูธบ่อย บางที่ไม่มีปลั๊ก อยากได้เครื่องที่มีแบตในตัว มีรุ่นไหนแนะนำ'],
          modelReplyDescription:
            'คำตอบที่ดีควรแนะนำรุ่น Flex ซึ่งเป็นรุ่นเดียวที่มีแบตเตอรี่ในตัว ใช้ต่อเนื่องได้ ~6 ชั่วโมง เชื่อมเน็ตได้ทั้ง Wi-Fi และซิม เหมาะกับการพกพา และแจ้งว่าหากสนใจซื้อ จะส่งเรื่องให้ทีม MDS Lead ติดต่อกลับภายใน 48 ชั่วโมง',
          sampleReplyKeywords: ['Flex', 'แบตเตอรี่', 'ซิม', 'MDS Lead', '48 ชั่วโมง'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-wp3',
    title: 'แบบทดสอบ: Software 6 แพ็กเกจ และ Wongnai Care',
    tags: ['wp-software'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-wp3-1',
          prompt: 'ฟีเจอร์ "จัดการโต๊ะ" ใช้ได้กับแพ็กเกจ Software ประเภทใด?',
          type: 'single-choice',
          options: opts('Quick Service (QSR) ทุกแพ็กเกจ', 'Full Service (FSR) เท่านั้น', 'เฉพาะ QSR Premium', 'ทุกแพ็กเกจ'),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-wp3-2',
          prompt: 'Wongnai Care ราคาเท่าไร และครอบคลุมอะไร?',
          type: 'single-choice',
          options: opts(
            '1,500 บาท/ปี ยืมเครื่อง Hardware สำรองระหว่างส่งซ่อม',
            '3,852 บาท/ปี อัปเกรด Software ฟรี',
            '1,000 บาท/ครั้ง ส่วนลดค่า GP',
            '500 บาท/เดือน ประกันสินค้าในสต๊อก',
          ),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-wp3-3',
          prompt: 'ข้อใดถูกต้องเกี่ยวกับแพ็กเกจ QSR? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'QSR Basic มีเฉพาะ Basic Features',
            'QSR Plus เพิ่มฟีเจอร์ Order & Pay',
            'QSR Premium เพิ่ม Order & Pay และ Wongnai CRM',
            'QSR ทุกแพ็กเกจมีฟีเจอร์จัดการโต๊ะ',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
        {
          id: 'q-wp3-4',
          prompt: 'ข้อใดถูกต้องเกี่ยวกับ Wongnai Care? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'ครอบคลุมเฉพาะเครื่องที่ซื้อกับบริษัท',
            'ยืมเครื่องสำรองได้ครั้งละไม่เกิน 30 วัน',
            'ต้องคืนเครื่องสำรองภายใน 7 วันหลังได้เครื่องซ่อมกลับ',
            'ครอบคลุมสินค้าในสต๊อกของร้านด้วย',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...liveChatQuestions([
        {
          id: 'q-wp3-5',
          prompt: 'ตอบแชทร้าน QSR Basic ที่อยากได้ฟีเจอร์จัดการโต๊ะ',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'ร้านใช้ QSR Basic อยู่ อยากเปิดฟีเจอร์จัดการโต๊ะ ทำยังไง' },
          ],
          modelReply:
            'ฟีเจอร์จัดการโต๊ะรองรับเฉพาะแพ็กเกจ Full Service (FSR) เท่านั้น ไม่มีในแพ็กเกจ Quick Service ค่ะ หากต้องการใช้งาน แนะนำให้เปลี่ยนไปใช้ FSR เดี๋ยวแอดมินส่งเรื่องให้ทีม Upsell Renew ติดต่อกลับเพื่อแจ้งรายละเอียดและราคา ภายใน 1-3 วันทำการนะคะ',
          sampleReplyKeywords: ['Full Service', 'FSR', 'เปลี่ยนแพ็กเกจ', 'Upsell Renew'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-wp4',
    title: 'แบบทดสอบ: เงื่อนไขการซื้อ POS และ SOP การส่งเรื่อง',
    tags: ['wp-sop'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-wp4-1',
          prompt: 'ลูกค้าใหม่สนใจซื้อเครื่อง POS ต้องส่งเรื่องให้ทีมใด?',
          type: 'single-choice',
          options: opts(
            'ทีม MDS Lead (ภายใน 48 ชม.)',
            'ทีม Upsell Renew (ภายใน 1-3 วันทำการ)',
            'ทีม OS Merchant (ภายใน 1 วัน)',
            'ทีม Finance Operation',
          ),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-wp4-2',
          prompt: 'ลูกค้าเก่าต้องการซื้อเครื่องพิมพ์เพิ่ม ต้องส่งเรื่องให้ทีมใด?',
          type: 'single-choice',
          options: opts('ทีม MDS Lead', 'ทีม Upsell Renew', 'ทีม OS Merchant', 'ทีม Merchant Operations'),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-wp4-3',
          prompt: 'ลูกค้าต้องการเปลี่ยนอีเมลเข้าสู่ระบบ POS ต้องส่งเรื่องให้ทีมใด และใช้เวลาเท่าไร?',
          type: 'single-choice',
          options: opts(
            'ทีม OS Merchant ภายใน 1 วัน',
            'ทีม MDS Lead ภายใน 48 ชม.',
            'ทีม Upsell Renew ภายใน 1-3 วันทำการ',
            'CS แก้ไขให้ทันที',
          ),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-wp4-4',
          prompt: 'คุณสมบัติของลูกค้าที่จะได้รับสิทธิ์ "เช่าใช้รายวัน" มีอะไรบ้าง? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'เปิดร้านบน LINE MAN และเข้าร่วม GP มานานกว่า 3 เดือน',
            'ชำระค่าบริการไม่ต่ำกว่า 3 รอบบิล',
            'มีค่าบริการมากกว่า 5,000 บาท/เดือน ต่อเนื่อง 3 เดือน',
            'เป็นร้านนิติบุคคลเท่านั้น',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...salesforceQuestions([
        {
          id: 'q-wp4-5',
          prompt: 'ลูกค้าใหม่โทรมาสนใจซื้อเครื่อง Wongnai POS พร้อม Software จงบันทึกและส่งต่อเคส',
          scenario:
            'เจ้าของร้านก๋วยเตี๋ยวเปิดใหม่ ยังไม่มีเครื่อง POS สนใจซื้อ Wongnai POS Single พร้อมแพ็กเกจ FSR ต้องการให้มีคนติดต่อกลับไปเสนอราคา',
          priorityOptions: ['ต่ำ', 'ปานกลาง', 'สูง', 'เร่งด่วน'],
          caseTypeOptions: [
            'ส่งต่อทีม MDS Lead (ลูกค้าใหม่ซื้อเครื่อง)',
            'ส่งต่อทีม Upsell Renew (ซื้อฟีเจอร์/อุปกรณ์เพิ่ม)',
            'ส่งต่อทีม OS Merchant (เปลี่ยนอีเมล)',
            'สอบถามการใช้งาน POS',
          ],
          mockAccounts: [
            { id: 'acc1', merchantName: 'ก๋วยเตี๋ยวเรือรุ่งเรือง (เปิดใหม่)', businessType: 'ร้านก๋วยเตี๋ยว' },
            { id: 'acc2', merchantName: 'ชาบูโต๊ะเดียว', businessType: 'ร้านชาบู' },
          ],
          idealCase: {
            subject: 'ส่งต่อ MDS Lead: ลูกค้าใหม่สนใจซื้อ Wongnai POS Single + FSR',
            description:
              'เจ้าของร้านก๋วยเตี๋ยวเปิดใหม่ ยังไม่มีเครื่อง POS สนใจซื้อ Wongnai POS Single พร้อมแพ็กเกจ Full Service ต้องการให้ทีมขายติดต่อกลับเพื่อเสนอราคา ส่งเรื่องให้ MDS Lead ภายใน 48 ชม.',
            priority: 'ปานกลาง',
            caseType: 'ส่งต่อทีม MDS Lead (ลูกค้าใหม่ซื้อเครื่อง)',
            accountId: 'acc1',
          },
        },
      ]),
    ]),
  },
  {
    id: 'quiz-wp5',
    title: 'แบบทดสอบ: ตั้งค่าเครื่องครั้งแรกและการเข้าสู่ระบบ',
    tags: ['wp-setup'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-wp5-1',
          prompt: 'กรณีจอเครื่อง POS ค้าง ต้องกดปุ่ม Power ค้างไว้กี่วินาทีเพื่อปิดเครื่อง?',
          type: 'single-choice',
          options: opts('2-3 วินาที', '5 วินาที', '11 วินาที', '30 วินาที'),
          correctOptionIds: ['c'],
        },
        {
          id: 'q-wp5-2',
          prompt: 'ร้านที่ใช้ WMA อยู่แล้ว เข้าสู่ระบบ Wongnai POS ด้วยวิธีใด?',
          type: 'single-choice',
          options: opts(
            'เข้าด้วยเบอร์/อีเมลที่ใช้กับ WMA แล้วเลือกร้าน ระบบจะแจ้ง PIN 4 หลัก',
            'เข้าด้วยอีเมลและรหัสผ่านที่ได้รับจากทีมงานเท่านั้น',
            'สแกน QR Code จากใบเสร็จ',
            'กรอกรหัสร้าน 6 หลักจาก Salesforce',
          ),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-wp5-3',
          prompt: 'ข้อใดถูกต้องเกี่ยวกับรหัส PIN 4 หลัก และรหัสผ่าน Owner App?',
          type: 'single-choice',
          options: opts(
            'PIN 4 หลักกำหนดเองไม่ได้ ระบบสร้างใหม่ให้อัตโนมัติ ส่วนรหัสผ่าน Owner App เปลี่ยนเองได้',
            'ทั้ง PIN และรหัสผ่าน Owner กำหนดเองได้',
            'ทั้ง PIN และรหัสผ่าน Owner กำหนดเองไม่ได้',
            'PIN 4 หลักกำหนดเองได้ แต่รหัสผ่าน Owner เปลี่ยนไม่ได้',
          ),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-wp5-4',
          prompt: 'ขั้นตอนเปิดโปรแกรม Wongnai POS ครั้งแรกประกอบด้วยอะไรบ้าง? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'กดยอมรับเงื่อนไข (Agree)',
            'เลือกภาษา English และเมือง Bangkok',
            'เลือก Wi-Fi (จำเป็นต้องเชื่อมต่อ)',
            'ใส่หมายเลขบัตรเครดิตเพื่อยืนยันตัวตน',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...phoneCallQuestions([
        {
          id: 'q-wp5-5',
          prompt: 'รับสายจากร้านที่ลืมรหัส PIN 4 หลักเข้าเครื่อง POS',
          scenario: 'พนักงานลืมรหัส PIN 4 หลัก อยากตั้งใหม่เป็นเลขที่จำง่าย',
          callerLines: ['ลืมรหัส PIN เข้าเครื่องเลย ขอตั้งใหม่เป็น 1234 ได้ไหม'],
          modelReplyDescription:
            'คำตอบที่ดีควรอธิบายอย่างสุภาพว่ารหัส PIN 4 หลักกำหนดเองไม่ได้ ระบบสร้างให้ใหม่อัตโนมัติเท่านั้น โดยเข้าไปรีเซ็ตที่เว็บไซต์ owner แล้วระบบจะส่ง PIN ใหม่ให้ ส่วนรหัสผ่าน Owner App สามารถตั้งเองได้ที่เว็บไซต์ owner',
          sampleReplyKeywords: ['PIN 4 หลัก', 'กำหนดเองไม่ได้', 'อัตโนมัติ', 'เว็บไซต์ owner'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-wp6',
    title: 'แบบทดสอบ: ตั้งค่าพื้นฐานและสร้างเมนู',
    tags: ['wp-menu'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-wp6-1',
          prompt: 'ลำดับการสร้างเมนูบนเครื่อง Wongnai POS ที่ถูกต้องคือข้อใด?',
          type: 'single-choice',
          options: opts(
            'หมวดหมู่ > กลุ่มตัวเลือก > เมนูอาหาร',
            'เมนูอาหาร > หมวดหมู่ > กลุ่มตัวเลือก',
            'กลุ่มตัวเลือก > เมนูอาหาร > หมวดหมู่',
            'เมนูอาหาร > กลุ่มตัวเลือก > โปรโมชัน',
          ),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-wp6-2',
          prompt: 'ก่อนใช้งานการชำระเงินแบบ QR Code บนเครื่อง POS ร้านต้องทำอะไรก่อน?',
          type: 'single-choice',
          options: opts(
            'สมัคร POS Pay โดยสแกน QR ในหน้าตั้งค่า',
            'ซื้อเครื่อง EDC เพิ่ม',
            'อัปเกรดเป็นแพ็กเกจ Premium',
            'เปิดบัญชีธนาคารใหม่',
          ),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-wp6-3',
          prompt: 'ข้อใดถูกต้องเกี่ยวกับการตั้งค่าพื้นฐานบน Wongnai POS? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'ระบบไม่คิด Service Charge ในบิลที่เป็นเดลิเวอรี',
            'เครื่องพิมพ์ในตัวเครื่องนับเป็น 1 เครื่องเสมอ',
            'PIN ของพนักงานจะถูกส่งไปที่อีเมลที่ลงทะเบียนไว้',
            'VAT ตั้งได้แบบเดียว คือบวกเพิ่มจากราคา',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
        {
          id: 'q-wp6-4',
          prompt: 'โปรโมชันบน Wongnai POS สร้างได้กี่ประเภท อะไรบ้าง?',
          type: 'single-choice',
          options: opts(
            '3 ประเภท: ทั่วไป, LINE MAN เดลิเวอรี, ใช้คะแนนแลก (CRM)',
            '2 ประเภท: หน้าร้าน และออนไลน์',
            '1 ประเภท: ลดท้ายบิลเท่านั้น',
            '5 ประเภท',
          ),
          correctOptionIds: ['a'],
        },
      ]),
      ...liveChatQuestions([
        {
          id: 'q-wp6-5',
          prompt: 'ตอบแชทร้านที่อยากตั้งราคาต่างกันระหว่างหน้าร้านกับ LINE MAN',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'อยากตั้งราคาเมนูบนหน้าร้านกับบน LINE MAN ให้ต่างกันได้ไหมคะ' },
          ],
          modelReply:
            'ได้ค่ะ Wongnai POS รองรับการตั้งราคาแยกตามช่องทางการขาย (Multi-Channel) ร้านสามารถกำหนดราคาสำหรับหน้าร้าน และราคาสำหรับ LINE MAN ให้ต่างกันได้ เพื่อเผื่อค่า GP หรือค่าใช้จ่ายของแต่ละช่องทางค่ะ',
          sampleReplyKeywords: ['ช่องทางการขาย', 'ราคาแยก', 'Multi-Channel', 'LINE MAN'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-wp7',
    title: 'แบบทดสอบ: การขาย รอบการขาย และ Manager App',
    tags: ['wp-sales'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-wp7-1',
          prompt: 'ลูกค้าสั่งอาหารแล้วเดินไปหยิบของเพิ่มโดยยังไม่ชำระเงิน พนักงานควรทำอย่างไร?',
          type: 'single-choice',
          options: opts(
            'ยกเลิกบิลแล้วเปิดใหม่',
            'กด "ส่งค้างไว้" เพื่อพักบิล บิลจะไปอยู่ในแถบ "ออเดอร์ที่เปิดอยู่"',
            'ปิดรอบการขายทันที',
            'พิมพ์ใบเสร็จเลยโดยไม่ต้องรอชำระ',
          ),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-wp7-2',
          prompt: 'เจ้าของร้านต้องการเปิด-ปิดเมนูบน LINE MAN ตอนของหมด โดยไม่ต้องอยู่หน้าเครื่อง POS ควรใช้อะไร?',
          type: 'single-choice',
          options: opts('Wongnai Manager App', 'Salesforce', 'โทรแจ้ง CS ทุกครั้ง', 'เว็บไซต์ Wongnai ฝั่งลูกค้า'),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-wp7-3',
          prompt: 'ขั้นตอนการปิดรอบการขายประกอบด้วยอะไรบ้าง? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'กด "พิมพ์ข้อมูลรอบการขายปัจจุบัน" เพื่อดูก่อนปิด',
            'บันทึกเงินเข้า/เงินออก',
            'กดปิดรอบพร้อมใส่จำนวนเงินสดที่นับได้จริง',
            'ลบข้อมูลยอดขายทั้งหมดของวัน',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
        {
          id: 'q-wp7-4',
          prompt: 'การต่ออายุแพ็กเกจผ่าน Manager App ชำระเงินได้ทางใดบ้าง?',
          type: 'multi-choice',
          options: opts(
            'QR PromptPay',
            'LINE Pay',
            'กรอกข้อมูลออกใบกำกับภาษีก่อนชำระ',
            'เงินสดที่หน้าเครื่อง POS',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...phoneCallQuestions([
        {
          id: 'q-wp7-5',
          prompt: 'รับสายจากร้านที่แพ็กเกจ Software ใกล้หมดอายุและอยากต่อเอง',
          scenario: 'ร้านได้รับ pop up แจ้งแพ็กเกจใกล้หมดอายุ อยากต่อเองโดยไม่ต้องรอเซล ถามว่าจ่ายทางไหนได้',
          callerLines: ['แพ็กเกจใกล้หมดแล้ว อยากต่อเอง จ่ายเงินยังไงได้บ้าง'],
          modelReplyDescription:
            'คำตอบที่ดีควรแนะนำให้ต่ออายุเองผ่าน Wongnai Manager App: เลือกสาขา > กดต่ออายุ > ระบบแสดงยอดรวม > กรอกข้อมูลออกใบกำกับภาษี > เลือกชำระผ่าน QR PromptPay หรือ LINE Pay และแจ้งว่าการอัปเกรดแพ็กเกจหรือซื้อส่วนเสริม ระบบจะส่งต่อเข้าศูนย์ช่วยเหลือ',
          sampleReplyKeywords: ['Manager App', 'ต่ออายุ', 'QR PromptPay', 'LINE Pay'],
        },
      ]),
    ]),
  },

  // ── Course 3 per-lesson quizzes ───────────────────────────────────
  {
    id: 'quiz-fs1',
    title: 'แบบทดสอบ: Wongnai POS IPAD ภาพรวม',
    tags: ['fs-overview'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-fs1-1',
          prompt: 'ข้อใดคือความแตกต่างสำคัญของ Wongnai POS IPAD เทียบกับ Android?',
          type: 'single-choice',
          options: opts(
            'IPAD ไม่มีเครื่องพิมพ์ในตัว และไม่มีแพ็กเกจเช่าใช้รายวันสำหรับ Hardware',
            'IPAD ใช้ได้เฉพาะร้าน Quick Service',
            'IPAD ไม่รองรับเดลิเวอรี LINE MAN',
            'IPAD ไม่มีระบบสินค้าคงคลัง',
          ),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-fs1-2',
          prompt: 'Hardware ของ Wongnai POS IPAD ในปัจจุบันคือรุ่นใด?',
          type: 'single-choice',
          options: opts('iPad Gen 11', 'iPad Pro 12.9 นิ้ว', 'iPad mini', 'เครื่อง Sunmi V.2'),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-fs1-3',
          prompt: 'ฟีเจอร์ใดที่ iPad POS ทำได้แต่ Android ทำไม่ได้? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'จัดการสินค้าคงคลังผ่านเว็บไซต์ และเอกสาร PR/PO/GR',
            'แก้ไขรูปแบบโต๊ะ จองโต๊ะ และฟีเจอร์ครัว',
            'ระบบบุฟเฟต์ (จับเวลาต่อโต๊ะ)',
            'เชื่อมต่อเดลิเวอรี LINE MAN',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
        {
          id: 'q-fs1-4',
          prompt: 'iPad POS เหมาะกับร้านแบบใด? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'ร้านที่มีมากกว่า 1 สาขาหรือวางแผนขยายสาขา',
            'ร้านที่จดทะเบียนนิติบุคคล',
            'ร้านที่มีครัวแยกหลายจุด รับออเดอร์ที่โต๊ะ หรือบุฟเฟต์',
            'ร้านเล็กงบจำกัดที่ต้องการเช่าเครื่องรายวัน',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...liveChatQuestions([
        {
          id: 'q-fs1-5',
          prompt: 'ตอบแชทร้าน 3 สาขาที่ถามว่าควรใช้ POS ระบบไหน',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'ร้านมี 3 สาขา วางแผนเปิดเพิ่ม ควรใช้ POS ระบบไหนดี Android หรือ iPad' },
          ],
          modelReply:
            'แนะนำ Wongnai POS IPAD ค่ะ เพราะเหมาะกับร้านหลายสาขาหรือวางแผนขยาย รองรับการเชื่อมข้อมูลหลายสาขา ระบบสินค้าคงคลังเต็มรูปแบบ (โอนสินค้าระหว่างสาขา) จัดการผังโต๊ะและครัว ซึ่ง Android ทำไม่ได้ แม้จะต้องซื้อขาด iPad และต่อเครื่องพิมพ์แยกค่ะ',
          sampleReplyKeywords: ['iPad', 'หลายสาขา', 'สินค้าคงคลัง', 'จัดการโต๊ะ'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-fs2',
    title: 'แบบทดสอบ: Software 9 แพ็กเกจ และ POS IPAD Care',
    tags: ['fs-software'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-fs2-1',
          prompt: 'Wongnai POS IPAD รองรับ Software กี่ประเภท กี่แพ็กเกจ?',
          type: 'single-choice',
          options: opts('2 ประเภท 6 แพ็กเกจ', '3 ประเภท 9 แพ็กเกจ', '3 ประเภท 6 แพ็กเกจ', '1 ประเภท 3 แพ็กเกจ'),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-fs2-2',
          prompt: 'ฟีเจอร์บุฟเฟต์ (จับเวลาต่อโต๊ะ) รองรับเฉพาะแพ็กเกจใด?',
          type: 'single-choice',
          options: opts('QSR ทุกระดับ', 'FSR ทุกระดับ', 'BFR (Buffet Service) เท่านั้น', 'ทุกแพ็กเกจ'),
          correctOptionIds: ['c'],
        },
        {
          id: 'q-fs2-3',
          prompt: 'ฟีเจอร์ใดใช้ได้เฉพาะแพ็กเกจ Full & Buffet Service? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'ฟีเจอร์แก้ไขรูปแบบโต๊ะ',
            'ฟีเจอร์การจองโต๊ะ',
            'ฟีเจอร์ครัว (เช็กสถานะออเดอร์)',
            'การเชื่อมต่อเดลิเวอรี LINE MAN',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
        {
          id: 'q-fs2-4',
          prompt: 'ข้อใดถูกต้องเกี่ยวกับ Wongnai POS IPAD Care?',
          type: 'multi-choice',
          options: opts(
            'ราคา 3,852 บาท/ปี',
            'ครอบคลุมเฉพาะ iPad และเครื่องพิมพ์ 1 เครื่องที่ซื้อร่วมกับ iPad',
            'ยืมเครื่องสำรองได้ครั้งละไม่เกิน 30 วัน',
            'อัปเกรดแพ็กเกจ Software ให้ฟรี',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...liveChatQuestions([
        {
          id: 'q-fs2-5',
          prompt: 'ตอบแชทร้านบุฟเฟต์ที่ใช้ FSR แต่อยากได้ระบบจับเวลาโต๊ะ',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'ร้านเปิดบุฟเฟต์ ใช้ FSR Pro อยู่ อยากได้ระบบจับเวลาต่อโต๊ะค่ะ' },
          ],
          modelReply:
            'ระบบจับเวลาต่อโต๊ะและการสร้างเมนูแบบบุฟเฟต์ รองรับเฉพาะแพ็กเกจ Buffet Service (BFR) เท่านั้น ไม่มีในแพ็กเกจ FSR ค่ะ หากต้องการใช้งาน แนะนำให้เปลี่ยนไปใช้ BFR เดี๋ยวแอดมินส่งเรื่องให้ทีม Upsell Renew ติดต่อกลับเพื่อแจ้งรายละเอียดและราคา ภายใน 1-3 วันทำการนะคะ',
          sampleReplyKeywords: ['Buffet Service', 'BFR', 'เปลี่ยนแพ็กเกจ', 'Upsell Renew'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-fs3',
    title: 'แบบทดสอบ: ตั้งค่า VAT/SVC, POS ID, QR KBank',
    tags: ['fs-settings'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-fs3-1',
          prompt: 'ระบบ Wongnai POS IPAD คิด Service Charge (SVC) และ VAT ตามลำดับใด?',
          type: 'single-choice',
          options: opts(
            'คิด VAT ก่อน แล้วจึงคิด SVC',
            'คิด SVC ก่อน VAT เสมอ',
            'คิดพร้อมกันจากราคาเดียวกัน',
            'ขึ้นอยู่กับการตั้งค่าของร้าน',
          ),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-fs3-2',
          prompt: 'ออเดอร์จากช่องทางใดที่ "ไม่ถูกคิด" Service Charge?',
          type: 'single-choice',
          options: opts(
            'ออเดอร์หน้าร้าน (Dine-in)',
            'ออเดอร์กลับบ้าน (Takeaway)',
            'ออเดอร์จาก LINE MAN และ Online Order',
            'ทุกออเดอร์ถูกคิดเหมือนกัน',
          ),
          correctOptionIds: ['c'],
        },
        {
          id: 'q-fs3-3',
          prompt: 'ข้อใดถูกต้องเกี่ยวกับ POS ID และเลข Invoice? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'POS ID เป็นหมายเลขประจำเครื่องที่ได้จากกรมสรรพากร',
            'POS ID และเลข Invoice บันทึกเฉพาะบน iPad เครื่องที่ตั้งค่าไว้',
            'เมื่อใส่ข้อมูลใบกำกับครบ หัวใบเสร็จจะเป็น Receipt/TAX Invoice (ABB)',
            'iPad ทุกเครื่องในร้านจะแสดง POS ID เดียวกันอัตโนมัติ',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
        {
          id: 'q-fs3-4',
          prompt: 'ข้อใดถูกต้องเกี่ยวกับ Dynamic QR KBank? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'ร้านได้รับเงินเป็นยอดเดียวเวลา 23:00 น. ของทุกวัน',
            'Void ทั้งบิลก่อน 23:00 น. เงินคืนเข้าบัญชีลูกค้าอัตโนมัติ',
            'Void รายรายการ (void item) ระบบไม่คืนเงินอัตโนมัติ ร้านต้องโอนคืนเอง',
            'มีการหักค่าบริการทุกครั้งที่ได้รับเงิน',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...liveChatQuestions([
        {
          id: 'q-fs3-5',
          prompt: 'ตอบแชทร้านที่ void รายการ QR KBank แล้วเงินไม่คืนลูกค้า',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'ลูกค้าจ่าย QR กสิกร ร้าน void รายการออก 1 จาน แต่เงินไม่คืนเข้าบัญชีลูกค้าเลย' },
          ],
          modelReply:
            'ขอโทษในความไม่สะดวกนะคะ กรณี void ทั้งบิลที่จ่ายด้วย QR KBank และกดก่อน 23:00 น. ระบบจะคืนเงินอัตโนมัติ แต่ถ้าเป็นการ void รายรายการ (void item) ระบบจะไม่คืนเงินอัตโนมัติค่ะ ทางร้านต้องโอนเงินคืนให้ลูกค้าเองตามยอดรายการที่ยกเลิก แนะนำให้ตรวจสอบยอดและโอนคืนลูกค้าโดยตรงนะคะ',
          sampleReplyKeywords: ['void item', 'ไม่คืนอัตโนมัติ', 'โอนคืน', '23:00'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-fs4',
    title: 'แบบทดสอบ: สร้างเมนูและโปรโมชันบน iPad POS',
    tags: ['fs-menu'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-fs4-1',
          prompt: 'โครงสร้างการสร้างเมนูบน Wongnai POS IPAD มีกี่ชั้น (เรียงจากบนลงล่าง)?',
          type: 'single-choice',
          options: opts(
            'หมวดหมู่ > เมนูอาหาร',
            'กลุ่มเมนู > หมวดหมู่ > กลุ่มตัวเลือก > เมนูอาหาร',
            'เมนูอาหาร > กลุ่มตัวเลือก',
            'กลุ่มตัวเลือก > หมวดหมู่ > เมนูอาหาร',
          ),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-fs4-2',
          prompt: 'โปรโมชันหน้าร้านบน iPad POS ต่างจาก Wongnai POS (Android) อย่างไร?',
          type: 'single-choice',
          options: opts(
            'iPad POS ทำได้แค่ลดท้ายบิลอย่างเดียว',
            'iPad POS มี 5 รูปแบบ รวมถึงลด/รับฟรีเมื่อซื้อครบจำนวนหรือยอดขั้นต่ำ',
            'iPad POS สร้างโปรโมชันไม่ได้',
            'ไม่ต่างกันเลย',
          ),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-fs4-3',
          prompt: 'สร้างเมนูบน Wongnai POS IPAD ได้ผ่านช่องทางใดบ้าง? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'แอป Wongnai POS IPAD Owner (บนเครื่อง iPad)',
            'เว็บไซต์ owner',
            'แอป Wongnai POS IPAD Manager',
            'แอป LINE MAN ฝั่งลูกค้า',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
        {
          id: 'q-fs4-4',
          prompt: 'โปรโมชันประเภทใดที่สร้างได้บน iPad POS? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'หน้าร้าน',
            'ออนไลน์ (LINE MAN เดลิเวอรี)',
            'ใช้คะแนนแลก (Wongnai CRM)',
            'โปรโมชันข้ามร้านกับร้านอื่น',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...liveChatQuestions([
        {
          id: 'q-fs4-5',
          prompt: 'ตอบแชทร้านที่สร้างโปร "ซื้อ 2 แถม 1" แล้วระบบไม่ลดให้',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'ตั้งโปรซื้อ 2 แถม 1 ไว้แล้ว แต่ตอนคีย์บิลระบบไม่ลดให้เลยค่ะ' },
          ],
          modelReply:
            'สำหรับโปรโมชันที่เป็นของแถมหรือส่วนลดแบบมีเงื่อนไข พนักงานต้องคีย์ตัวของแถม (เมนูแถม) เข้าไปในบิลด้วยตอนสั่ง ระบบถึงจะตรวจว่าเข้าเงื่อนไขและกดใช้โปรโมชันได้ค่ะ ถ้าคีย์แค่ 2 จานที่ซื้อโดยไม่ใส่จานแถม ระบบจะถือว่ายังไม่เข้าเงื่อนไข เดี๋ยวแอดมินส่งขั้นตอนแบบมีรูปให้นะคะ',
          sampleReplyKeywords: ['ของแถม', 'คีย์', 'เงื่อนไข', 'บิล'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-fs5',
    title: 'แบบทดสอบ: จัดการโต๊ะและออเดอร์บน iPad POS',
    tags: ['fs-tables'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-fs5-1',
          prompt: 'ลูกค้าโต๊ะเดียวกัน 4 คน ต้องการหารบิลจ่ายคนละส่วนตามรายการที่ตัวเองสั่ง ควรใช้ฟังก์ชันใด?',
          type: 'single-choice',
          options: opts('Split Amount (แบ่งจ่าย)', 'Split Bill (แยกบิล)', 'รวมโต๊ะ', 'ย้ายเมนู'),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-fs5-2',
          prompt: 'Split Pay (แยกบิลจ่ายก่อน) ต่างจาก Split Bill อย่างไร?',
          type: 'single-choice',
          options: opts(
            'หลังแยกบิลแล้วโต๊ะยังไม่ปิด สามารถสั่งออเดอร์เพิ่มได้',
            'ใช้กับ QR KBank เท่านั้น',
            'แยกได้สูงสุด 2 บิล',
            'ต้องปิดโต๊ะทันทีหลังแยก',
          ),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-fs5-3',
          prompt: 'ข้อใดถูกต้องเกี่ยวกับการเชื่อมเดลิเวอรี LINE MAN บน iPad POS? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'ห้ามตั้งชื่อหมวดหมู่ เมนู และตัวเลือกซ้ำกัน',
            'หลังเชื่อมแล้วต้องแก้เมนูผ่านระบบ Wongnai POS IPAD เท่านั้น',
            'ต้องสมัคร GP และสร้างช่องทาง LINE MAN ใน Web Owner ก่อน',
            'หลังเชื่อมแล้วยังแก้เมนูผ่าน WMA ได้ตามปกติ',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
        {
          id: 'q-fs5-4',
          prompt: 'กรณีโต๊ะขึ้นสถานะ null ควรทำอย่างไร?',
          type: 'single-choice',
          options: opts(
            'กด "ตรวจสอบบิล" ที่โต๊ะนั้นแล้ว refresh แอป',
            'ลบโต๊ะทิ้งแล้วสร้างใหม่',
            'ปิดรอบการขายทั้งหมด',
            'โทรแจ้ง CS ให้รีเซ็ตเครื่อง',
          ),
          correctOptionIds: ['a'],
        },
      ]),
      ...phoneCallQuestions([
        {
          id: 'q-fs5-5',
          prompt: 'รับสายจากร้านที่โต๊ะขึ้นสถานะ null และกดอะไรไม่ได้',
          scenario: 'พนักงานแจ้งว่าโต๊ะ 5 ขึ้นสถานะ null กดสั่งอาหารหรือปิดบิลไม่ได้ ช่วงร้านกำลังยุ่ง',
          callerLines: ['โต๊ะ 5 ขึ้น null กดอะไรไม่ได้เลย ลูกค้ารออยู่ ต้องทำยังไง'],
          modelReplyDescription:
            'คำตอบที่ดีควรแสดงความเข้าใจในความเร่งด่วน แนะนำให้กดปุ่ม "ตรวจสอบบิล" ที่โต๊ะที่ขึ้น null แล้ว refresh แอป สถานะโต๊ะจะกลับมาปกติ และถ้ายังไม่หายให้ลองปิดแล้วเปิดแอปใหม่ พร้อมรับปากติดตามหากยังมีปัญหา',
          sampleReplyKeywords: ['ตรวจสอบบิล', 'refresh', 'ปิดเปิดแอป', 'เข้าใจ'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-fs6',
    title: 'แบบทดสอบ: Multi-Cashier, พนักงาน และ Manager App',
    tags: ['fs-cashier'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-fs6-1',
          prompt: 'โหมด Multi-Cashier แบบใดที่ "CS" ต้องเป็นคนเปิดใช้งานให้ผ่าน Web Internal Tool?',
          type: 'single-choice',
          options: opts(
            'แบบธรรมดา (พนักงานรับเงินหลายคน)',
            'แบบแยกกะ',
            'ทั้งสองแบบ CS ต้องเปิดให้',
            'ไม่มีแบบไหนที่ CS ต้องเปิดให้',
          ),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-fs6-2',
          prompt: 'การสร้างบัญชีพนักงานระดับ "Manager" ทำได้ที่ใด?',
          type: 'single-choice',
          options: opts(
            'บนแอป Wongnai POS IPAD (เครื่อง iPad)',
            'บนเว็บไซต์ Owner เท่านั้น',
            'บน Wongnai Merchant App',
            'โทรแจ้ง CS ให้สร้างให้',
          ),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-fs6-3',
          prompt: 'ข้อใดถูกต้องเกี่ยวกับ Multi-Cashier และหน้าติดต่อฝ่ายบริการลูกค้า? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'ยอดขายจากทุกจุดชำระเงินรวมอยู่ในถาดเก็บเงินเดียวกัน',
            'โหมดแยกกะต้องปิดกะย่อยก่อนจึงจะปิดรอบใหญ่ได้',
            'QR ที่เข้า call จะหมดอายุใน 10 นาที ส่วน QR ที่เข้า chat ไม่มีวันหมดอายุ',
            'โหมดธรรมดาต้องให้ CS เปิดให้เท่านั้น',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
        {
          id: 'q-fs6-4',
          prompt: 'ข้อควรระวังเมื่อใช้เครื่อง POS ชำระเงินมากกว่า 1 เครื่อง คืออะไร?',
          type: 'single-choice',
          options: opts(
            'ใบเสร็จอาจไม่มีข้อมูลใบกำกับภาษีหรือ INV NO. ควรตั้งค่าข้อมูลใบกำกับของแต่ละเครื่องให้ต่างกัน',
            'ยอดขายจะถูกนับซ้ำสองเท่า',
            'ต้องปิดรอบพร้อมกันทุกเครื่อง',
            'ไม่มีข้อควรระวัง',
          ),
          correctOptionIds: ['a'],
        },
      ]),
      ...salesforceQuestions([
        {
          id: 'q-fs6-5',
          prompt: 'ร้านหลายสาขาต้องการเปิดใช้ Multi-Cashier แบบแยกกะ จงบันทึกและดำเนินการเคส',
          scenario:
            'ร้านชาบู 2 สาขา มีพนักงานเก็บเงินหลายคนต่อกะ ต้องการเปิดโหมด Multi-Cashier แบบแยกกะ เพื่อดูยอดแยกตามกะ CS ต้องเปิด flag ให้ผ่าน Web Internal Tool',
          priorityOptions: ['ต่ำ', 'ปานกลาง', 'สูง', 'เร่งด่วน'],
          caseTypeOptions: [
            'เปิดใช้งานฟีเจอร์ให้ร้าน (Web Internal Tool)',
            'ส่งต่อทีม Upsell Renew',
            'ส่งต่อทีม MDS Lead',
            'สอบถามการใช้งาน POS',
          ],
          mockAccounts: [
            { id: 'acc1', merchantName: 'ชาบูอินดี้ (2 สาขา)', businessType: 'ร้านชาบู/บุฟเฟต์' },
            { id: 'acc2', merchantName: 'ก๋วยเตี๋ยวเนื้อรุ่งอรุณ', businessType: 'ร้านก๋วยเตี๋ยว' },
          ],
          idealCase: {
            subject: 'เปิดใช้ Multi-Cashier แบบแยกกะให้ร้าน (Web Internal Tool)',
            description:
              'ร้านชาบู 2 สาขาต้องการเปิดโหมด Multi-Cashier แบบแยกกะ เพื่อดูยอดแยกตามกะ CS เปิด flag Multi-cashier (โหมดแยกกะ) ให้ผ่าน Web Internal Tool และแจ้งร้านว่าต้องปิดกะย่อยก่อนปิดรอบใหญ่',
            priority: 'ปานกลาง',
            caseType: 'เปิดใช้งานฟีเจอร์ให้ร้าน (Web Internal Tool)',
            accountId: 'acc1',
          },
        },
      ]),
    ]),
  },
  {
    id: 'quiz-fs7',
    title: 'แบบทดสอบ: สินค้าคงคลัง สูตร BOM และเอกสารจัดซื้อ',
    tags: ['fs-inventory'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-fs7-1',
          prompt: 'ลำดับเอกสารสำหรับการ "ซื้อสินค้าเข้าคลัง" ที่ถูกต้องคือข้อใด?',
          type: 'single-choice',
          options: opts('PR > PO > GR', 'GR > PO > PR', 'TR > TO > GR', 'PO > GR > PR'),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-fs7-2',
          prompt: 'ข้อใดถูกต้องเกี่ยวกับ "หน่วยหลัก" ของสินค้าคงคลัง?',
          type: 'single-choice',
          options: opts(
            'สร้างหน่วยขึ้นเองได้ และแก้ไขภายหลังได้ตลอด',
            'เลือกจากที่ระบบมีให้เท่านั้น และแก้ไขไม่ได้หลังตั้งค่า',
            'ใช้ปรับจำนวนสต๊อกเท่านั้น ผูกกับเมนูไม่ได้',
            'ต้องเป็นกิโลกรัมเสมอ',
          ),
          correctOptionIds: ['b'],
        },
        {
          id: 'q-fs7-3',
          prompt: 'เงื่อนไขการโอนสินค้าระหว่างสาขามีอะไรบ้าง? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'ร้านต้องมีสาขาตั้งแต่ 2 สาขาขึ้นไป',
            'สินค้าต้องมีรหัสสินค้าและหน่วยหลักตรงกัน',
            'ชื่อสินค้าไม่จำเป็นต้องตรงกัน',
            'ต้องโอนผ่านผู้จัดจำหน่าย (Supplier) เท่านั้น',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
        {
          id: 'q-fs7-4',
          prompt: 'ข้อใดถูกต้องเกี่ยวกับสูตร BOM? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'BOM คือการรวมสินค้าคงคลังหลายตัวเป็นสินค้าใหม่ที่ร้านทำเอง เช่น สูตรน้ำจิ้ม',
            'ราคาต่อหน่วยของ BOM คิดตามต้นทุนวัตถุดิบที่ผูกในสูตร',
            'ปรับสต๊อก BOM โดยตรงไม่ได้ ต้องใช้ "เพิ่มวัตถุดิบรวดเร็ว"',
            'ใบ GR สามารถแก้ไขและลบได้ตลอดเวลา',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...salesforceQuestions([
        {
          id: 'q-fs7-5',
          prompt: 'ร้านสอบถามเชิงลึกเรื่องการตั้งค่าสินค้าคงคลังและ BOM ที่ CS POS ตอบไม่ได้ จงบันทึกเคส',
          scenario:
            'ร้านอาหาร 3 สาขา ต้องการตั้งสูตร BOM ที่ซับซ้อน (แปลง 4 หน่วย คิดต้นทุนแยกสาขา) CS POS ตอบเชิงลึกไม่ได้ ต้องส่งต่อทีมที่ดูแลระบบสินค้าคงคลัง',
          priorityOptions: ['ต่ำ', 'ปานกลาง', 'สูง', 'เร่งด่วน'],
          caseTypeOptions: [
            'ส่งต่อทีมผู้เชี่ยวชาญระบบสินค้าคงคลัง',
            'สอบถามการใช้งาน POS ทั่วไป',
            'ส่งต่อทีม Upsell Renew',
            'ปัญหาการรับออเดอร์',
          ],
          mockAccounts: [
            { id: 'acc1', merchantName: 'ครัวไทยแท้ (3 สาขา)', businessType: 'ร้านอาหารไทย' },
            { id: 'acc2', merchantName: 'เบเกอรี่หอมกรุ่น', businessType: 'ร้านเบเกอรี่' },
          ],
          idealCase: {
            subject: 'ส่งต่อผู้เชี่ยวชาญ: ตั้งค่าสินค้าคงคลัง/BOM ซับซ้อน 3 สาขา',
            description:
              'ร้าน 3 สาขาต้องการตั้งสูตร BOM ซับซ้อน (แปลง 4 หน่วย คิดต้นทุนแยกสาขา) เป็นคำถามเชิงลึกที่ CS POS ตอบไม่ได้ ส่งต่อทีมผู้เชี่ยวชาญระบบสินค้าคงคลังเพื่อติดต่อกลับ',
            priority: 'ปานกลาง',
            caseType: 'ส่งต่อทีมผู้เชี่ยวชาญระบบสินค้าคงคลัง',
            accountId: 'acc1',
          },
        },
      ]),
    ]),
  },

  // ── Cross-lesson quizzes (shared thematic tags) ───────────────────
  {
    id: 'quiz-x-delivery-flow',
    title: 'รวมความรู้: Delivery Flow และการรับออเดอร์',
    tags: ['delivery-flow'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-x-df-1',
          prompt: 'Deferred Flow ต่างจาก Normal Operations Flow อย่างไร?',
          type: 'single-choice',
          options: opts(
            'ระบบเริ่มหาคนขับก่อนอาหารเสร็จ โดยใช้ข้อมูลเวลาเตรียมอาหาร',
            'ร้านไม่ต้องกดรับออเดอร์',
            'ลูกค้าต้องยืนยันราคาทุกครั้ง',
            'ใช้ได้เฉพาะร้าน Mart',
          ),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-x-df-2',
          prompt: 'ร้าน E-Menu มีบทบาทอย่างไรใน Delivery Flow?',
          type: 'single-choice',
          options: opts(
            'ร้านไม่มีบทบาทใน Flow คนขับเป็นผู้ยืนยันราคาและสั่งอาหารหน้าร้านเอง',
            'ร้านกดรับออเดอร์ผ่าน WMA เหมือนร้าน Official',
            'ร้านต้องกดพร้อมส่งก่อนระบบหาคนขับ',
            'ร้านเป็นผู้เลือกคนขับเอง',
          ),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-x-df-3',
          prompt: 'ข้อใดถูกต้องเกี่ยวกับการเชื่อมเดลิเวอรี LINE MAN บน Wongnai POS IPAD? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'ต้องสมัคร GP และสร้างช่องทาง LINE MAN ใน Web Owner ก่อน',
            'ห้ามตั้งชื่อหมวดหมู่/เมนู/ตัวเลือกซ้ำกัน',
            'หลังเชื่อมแล้วแก้เมนูผ่านระบบ iPad POS เท่านั้น',
            'หลังเชื่อมแล้วยังแก้ผ่าน WMA ได้',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...phoneCallQuestions([
        {
          id: 'q-x-df-4',
          prompt: 'รับสายจากร้านที่กดรับออเดอร์ไม่ทันและอยากได้ออเดอร์คืน',
          scenario: 'ร้านยุ่งช่วงพีค กดรับออเดอร์ไม่ทันใน 5 นาที ออเดอร์ถูกยกเลิก ร้านขอให้ดึงกลับมา',
          callerLines: ['เมื่อกี้ยุ่งมากกดรับไม่ทัน ออเดอร์หายไปเลย ช่วยเอากลับมาให้หน่อย'],
          modelReplyDescription:
            'คำตอบที่ดีควรแสดงความเข้าใจ อธิบายว่าออเดอร์ที่ถูกยกเลิกจาก cancel_timeout ดึงกลับมาไม่ได้ ต้องให้ลูกค้าสั่งใหม่ และแนะนำให้เปิด Auto Accept เพื่อลดปัญหาช่วงพีค ด้วยน้ำเสียงที่ไม่ตัดสินร้าน',
          sampleReplyKeywords: ['เข้าใจ', 'cancel_timeout', 'สั่งใหม่', 'Auto Accept'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-x-menu-setup',
    title: 'รวมความรู้: การสร้างเมนู (WMA / Android / iPad)',
    tags: ['menu-setup'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-x-ms-1',
          prompt: 'ลำดับการสร้างเมนูบน Wongnai POS (Android) คือข้อใด?',
          type: 'single-choice',
          options: opts(
            'หมวดหมู่ > กลุ่มตัวเลือก > เมนูอาหาร',
            'กลุ่มเมนู > หมวดหมู่ > กลุ่มตัวเลือก > เมนูอาหาร',
            'เมนูอาหาร > หมวดหมู่',
            'กลุ่มตัวเลือก > เมนูอาหาร',
          ),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-x-ms-2',
          prompt: 'โครงสร้างเมนูบน Wongnai POS IPAD ต่างจาก Android อย่างไร?',
          type: 'single-choice',
          options: opts(
            'iPad POS มีชั้น "กลุ่มเมนู" เพิ่มขึ้นมา (รวมเป็น 4 ชั้น)',
            'iPad POS ไม่มีกลุ่มตัวเลือก',
            'iPad POS สร้างเมนูได้ทางเดียวคือบนเครื่อง',
            'ไม่ต่างกันเลย',
          ),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-x-ms-3',
          prompt: 'ข้อใดถูกต้องเกี่ยวกับโปรโมชันบน WMA และ POS? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'โปรโมชันบน WMA ทั้ง 4 แบบ ต้องสมัคร GP ก่อน',
            'Wongnai POS (Android) สร้างโปรโมชันได้ 3 ประเภท',
            'iPad POS มีโปรโมชันหน้าร้าน 5 รูปแบบ',
            'โปรโมชัน CRM ใช้ได้โดยไม่ต้องมีแพ็กเกจ CRM',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...liveChatQuestions([
        {
          id: 'q-x-ms-4',
          prompt: 'ตอบแชทร้านที่เมนูไม่ขึ้นบน LINE MAN หลังเชื่อม iPad POS',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'เชื่อม iPad POS กับ LINE MAN แล้ว แต่บางเมนูไม่ขึ้นบนแอปลูกค้าเลย' },
          ],
          modelReply:
            'ขอบคุณที่แจ้งนะคะ กรณีเชื่อม iPad POS กับ LINE MAN ห้ามตั้งชื่อหมวดหมู่ เมนู หรือตัวเลือกซ้ำกันเด็ดขาด (รวมเมนูที่ไม่ได้ขายบน LINE MAN ด้วย) เพราะจะทำให้เมนูไม่ขึ้น แนะนำให้ตรวจสอบชื่อที่ซ้ำ แก้ไขผ่านระบบ Wongnai POS IPAD (เครื่อง/Web Owner/Manager) แล้ว sync ใหม่ค่ะ',
          sampleReplyKeywords: ['ชื่อซ้ำ', 'ตรวจสอบ', 'Wongnai POS IPAD', 'sync'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-x-package',
    title: 'รวมความรู้: แพ็กเกจ Software (Android & iPad)',
    tags: ['package'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-x-pkg-1',
          prompt: 'Wongnai POS (Android) มี Software กี่แพ็กเกจ และ iPad POS มีกี่แพ็กเกจ?',
          type: 'single-choice',
          options: opts(
            'Android 6 แพ็กเกจ, iPad 9 แพ็กเกจ',
            'Android 9 แพ็กเกจ, iPad 6 แพ็กเกจ',
            'ทั้งคู่ 6 แพ็กเกจ',
            'ทั้งคู่ 9 แพ็กเกจ',
          ),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-x-pkg-2',
          prompt: 'ฟีเจอร์จัดการโต๊ะบน POS ทั้งสองระบบ ใช้ได้กับแพ็กเกจใด?',
          type: 'single-choice',
          options: opts(
            'Full Service (และ Buffet บน iPad) เท่านั้น',
            'Quick Service ทุกแพ็กเกจ',
            'ทุกแพ็กเกจ',
            'เฉพาะแพ็กเกจ Max/Premium',
          ),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-x-pkg-3',
          prompt: 'ข้อใดถูกต้องเกี่ยวกับบริการเสริม Care? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'Wongnai Care (Android) ราคา 1,500 บาท/ปี',
            'Wongnai POS IPAD Care ราคา 3,852 บาท/ปี',
            'ทั้งคู่ให้สิทธิ์ยืมเครื่องสำรองครั้งละไม่เกิน 30 วัน',
            'Care ครอบคลุมสินค้าในสต๊อกของร้านด้วย',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...liveChatQuestions([
        {
          id: 'q-x-pkg-4',
          prompt: 'ตอบแชทร้านที่อยากได้ฟีเจอร์ที่ไม่มีในแพ็กเกจปัจจุบัน',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'แพ็กเกจที่ใช้อยู่ไม่มีฟีเจอร์ที่ต้องการ ต้องทำยังไงคะ' },
          ],
          modelReply:
            'ข้อจำกัดของแต่ละแพ็กเกจสามารถซื้อฟีเจอร์เพิ่มหรือเปลี่ยนแพ็กเกจได้ค่ะ เดี๋ยวแอดมินส่งเรื่องให้ทีม Upsell Renew ติดต่อกลับเพื่อแจ้งรายละเอียดฟีเจอร์ที่ต้องการ ราคา และวิธีอัปเกรด ภายใน 1-3 วันทำการนะคะ',
          sampleReplyKeywords: ['ซื้อเพิ่ม', 'เปลี่ยนแพ็กเกจ', 'Upsell Renew', '1-3 วันทำการ'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-x-pos-fundamentals',
    title: 'รวมความรู้: POS สองระบบ (Android & iPad)',
    tags: ['pos-fundamentals'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-x-pf-1',
          prompt: 'ข้อใดคือความต่างหลักระหว่าง Wongnai POS (Android) กับ Wongnai POS IPAD?',
          type: 'single-choice',
          options: opts(
            'Android เหมาะร้านเริ่มต้น 1 สาขา มีเช่ารายวัน; iPad เหมาะหลายสาขา ฟีเจอร์ครบกว่า ซื้อขาด iPad',
            'Android รองรับ iOS; iPad รองรับ Android',
            'Android มีระบบสินค้าคงคลัง; iPad ไม่มี',
            'ไม่มีความต่าง',
          ),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-x-pf-2',
          prompt: 'ประเภทร้านอาหารที่ Wongnai POS (Android) "ไม่รองรับ" คือข้อใด?',
          type: 'single-choice',
          options: opts('Buffet Service', 'Quick Service', 'Full Service', 'รองรับทุกประเภท'),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-x-pf-3',
          prompt: 'ข้อใดเป็นจริงกับ POS ทั้งสองระบบ? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'เชื่อมต่อรับออเดอร์เดลิเวอรี LINE MAN ได้',
            'เข้าสู่ระบบผ่าน WMA แล้วได้รหัส PIN 4 หลัก',
            'มี Manager App สำหรับเจ้าของร้านดูข้อมูลเรียลไทม์',
            'ติดตั้งบนมือถือส่วนตัวของร้านได้',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...phoneCallQuestions([
        {
          id: 'q-x-pf-4',
          prompt: 'รับสายจากร้านที่ยังไม่แน่ใจว่าจะเลือก POS ระบบไหน',
          scenario: 'ร้านอาหารตามสั่ง 1 สาขา งบไม่มาก แต่คิดว่าอีก 1-2 ปีจะขยาย ถามว่าควรเริ่มด้วยระบบไหน',
          callerLines: ['ตอนนี้มีสาขาเดียว งบไม่เยอะ แต่อยากขยายในอนาคต ควรเริ่มด้วย POS ระบบไหนดี'],
          modelReplyDescription:
            'คำตอบที่ดีควรอธิบายทางเลือก: Wongnai POS (Android) เหมาะเริ่มต้น งบจำกัด 1 สาขา มีเช่ารายวัน; Wongnai POS IPAD เหมาะถ้าจะขยายหลายสาขาและต้องการฟีเจอร์ครบ (สินค้าคงคลัง จัดการโต๊ะ) แต่ต้องซื้อขาด iPad ให้ร้านพิจารณาตามแผนธุรกิจ และเสนอส่งเรื่องให้ทีมขายให้คำแนะนำเพิ่มเติม',
          sampleReplyKeywords: ['Android', 'iPad', 'สาขาเดียว', 'ขยายสาขา', 'ทีมขาย'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-x-payment',
    title: 'รวมความรู้: การชำระเงินและภาษี',
    tags: ['payment'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-x-pay-1',
          prompt: 'ระบบ POS คิด Service Charge (SVC) และ VAT ตามลำดับใด?',
          type: 'single-choice',
          options: opts('คิด SVC ก่อน VAT เสมอ', 'คิด VAT ก่อน SVC', 'คิดพร้อมกัน', 'แล้วแต่ร้านตั้งค่า'),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-x-pay-2',
          prompt: 'ก่อนใช้งานการชำระเงินแบบ QR Code บนเครื่อง Wongnai POS (Android) ต้องทำอะไรก่อน?',
          type: 'single-choice',
          options: opts('สมัคร POS Pay', 'ซื้อเครื่อง EDC', 'อัปเกรดแพ็กเกจ', 'เปิดบัญชีธนาคารใหม่'),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-x-pay-3',
          prompt: 'ข้อใดถูกต้องเกี่ยวกับ Dynamic QR KBank บน iPad POS? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'ร้านได้รับเงินยอดเดียวเวลา 23:00 น. ของทุกวัน ไม่หักค่าบริการ',
            'Void ทั้งบิลก่อน 23:00 น. เงินคืนอัตโนมัติ',
            'Void รายรายการ ระบบไม่คืนเงินอัตโนมัติ',
            'ใช้แบ่งจ่าย (Split Amount) ได้',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...liveChatQuestions([
        {
          id: 'q-x-pay-4',
          prompt: 'ตอบแชทร้านที่ไม่เข้าใจว่าทำไมบิลเดลิเวอรีไม่มี Service Charge',
          openingMessages: [
            { id: 'm1', sender: 'customer', text: 'ตั้ง Service Charge ไว้ 10% แต่บิลที่มาจาก LINE MAN ไม่คิด SVC เลย ทำไมคะ' },
          ],
          modelReply:
            'เป็นการทำงานปกติของระบบค่ะ ออเดอร์ที่รับจากช่องทาง LINE MAN และ Online Order จะไม่ถูกคิด Service Charge โดยอัตโนมัติ Service Charge จะคิดเฉพาะบิลที่เป็นการรับประทานหน้าร้าน (Dine-in) เท่านั้นค่ะ',
          sampleReplyKeywords: ['LINE MAN', 'Online Order', 'ไม่คิด', 'Service Charge', 'หน้าร้าน'],
        },
      ]),
    ]),
  },
  {
    id: 'quiz-x-pos-sales',
    title: 'รวมความรู้: การขาย รอบการขาย และ Manager App',
    tags: ['pos-sales'],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    isHidden: false,
    questions: withOrder([
      ...choiceQuestions([
        {
          id: 'q-x-ps-1',
          prompt: 'ใบรายงานที่พิมพ์ตอนปิดรอบการขายบน iPad POS เรียกว่าอะไร?',
          type: 'single-choice',
          options: opts('รายงาน Z', 'รายงาน X', 'รายงาน A', 'Invoice'),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-x-ps-2',
          prompt: 'Multi-Cashier แบบแยกกะ ต้องทำอะไรก่อนจึงจะปิดรอบใหญ่ได้?',
          type: 'single-choice',
          options: opts('ปิดกะย่อยก่อน', 'ใส่เงินเปิดรอบ', 'พิมพ์ใบกำกับภาษี', 'ล็อกหน้าจอ'),
          correctOptionIds: ['a'],
        },
        {
          id: 'q-x-ps-3',
          prompt: 'ข้อใดถูกต้องเกี่ยวกับ Manager App? (เลือกได้มากกว่า 1 ข้อ)',
          type: 'multi-choice',
          options: opts(
            'เจ้าของร้านดูยอดขายเรียลไทม์และเช็กเมนูขายดีได้',
            'เปิด-ปิดเมนูบน LINE MAN เมื่อของหมดได้จากมือถือ',
            'ต่ออายุแพ็กเกจเองได้ (ชำระ QR PromptPay / LINE Pay)',
            'สร้างบัญชีพนักงานระดับ Manager ได้',
          ),
          correctOptionIds: ['a', 'b', 'c'],
        },
      ]),
      ...phoneCallQuestions([
        {
          id: 'q-x-ps-4',
          prompt: 'รับสายจากพนักงานที่ไม่รู้ว่าปิดรอบการขายต้องทำอะไรบ้าง',
          scenario: 'พนักงานใหม่ปิดร้านคืนแรก ไม่รู้ขั้นตอนการปิดรอบการขายบนเครื่อง POS',
          callerLines: ['คืนแรกที่ปิดร้าน ไม่รู้ว่าปิดรอบการขายต้องกดอะไรบ้าง'],
          modelReplyDescription:
            'คำตอบที่ดีควรอธิบายขั้นตอน: พิมพ์ข้อมูลรอบการขายปัจจุบันเพื่อดูยอด > บันทึกเงินเข้า/เงินออก (ถ้ามี) > กดปิดรอบพร้อมใส่จำนวนเงินสดที่นับได้จริงจากลิ้นชัก > ระบบจะแสดงส่วนต่างระหว่างยอดที่ควรมีกับยอดที่นับได้ ด้วยน้ำเสียงที่ให้กำลังใจพนักงานใหม่',
          sampleReplyKeywords: ['พิมพ์ข้อมูลรอบ', 'เงินเข้า', 'ปิดรอบ', 'นับเงิน', 'ส่วนต่าง'],
        },
      ]),
    ]),
  },
];
