import type { Lesson } from '../../types/lesson';
import type { ContentBlock } from '../../types/contentBlock';
import { COURSE_IDS } from './courses.seed';
import { id as makeId } from '../../utils/id';

export const LESSON_IDS = {
  mo1: 'lesson-mo-1',
  mo2: 'lesson-mo-2',
  mo3: 'lesson-mo-3',
  mo4: 'lesson-mo-4',
  mo5: 'lesson-mo-5',
  mo6: 'lesson-mo-6',
  mo7: 'lesson-mo-7',
  wp1: 'lesson-wp-1',
  wp2: 'lesson-wp-2',
  wp3: 'lesson-wp-3',
  wp4: 'lesson-wp-4',
  wp5: 'lesson-wp-5',
  wp6: 'lesson-wp-6',
  wp7: 'lesson-wp-7',
  fs1: 'lesson-fs-1',
  fs2: 'lesson-fs-2',
  fs3: 'lesson-fs-3',
  fs4: 'lesson-fs-4',
  fs5: 'lesson-fs-5',
  fs6: 'lesson-fs-6',
  fs7: 'lesson-fs-7',
} as const;

const SEED_TIMESTAMP = '2026-06-01T00:00:00.000Z';

function text(t: string): ContentBlock {
  return { id: makeId('block'), type: 'text', text: t };
}

function image(caption: string): ContentBlock {
  return { id: makeId('block'), type: 'image', caption };
}

export const seedLessons: Lesson[] = [
  // ────────────────────────────────────────────────────────────────────
  // COURSE 1 — ภาพรวมร้านค้า & Wongnai Merchant App (WMA)
  // ────────────────────────────────────────────────────────────────────
  {
    id: LESSON_IDS.mo1,
    courseId: COURSE_IDS.merchantOverview,
    order: 1,
    title: 'ภาพรวมธุรกิจ LMWN และทีม Customer Support',
    slug: 'lmwn-business-cs-team',
    summary: 'รู้จักโมเดลธุรกิจ แอปในระบบนิเวศ และช่องทางที่ร้านค้าติดต่อทีม CS',
    difficulty: 'easy',
    descriptionBlocks: [
      text(
        'LINE MAN Wongnai (LMWN) วางเป้าหมายให้ร้านค้า 3 เรื่อง คือ เพิ่มความสะดวก (Enhance Convenience) กระตุ้นการสั่งซื้อ (Increase Orders) และเร่งการเติบโต (Further Growth) โดยมีแอปในระบบนิเวศที่ทำงานร่วมกัน',
      ),
      text(
        'แอปหลักที่ CS ต้องรู้: Wongnai Merchant App (WMA) จัดการหน้าร้านและรับออเดอร์เดลิเวอรี, Wongnai POS บริหารร้านครบวงจรทั้งออนไลน์และออฟไลน์, Wongnai (แอปผู้บริโภค) เข้าถึงลูกค้าจำนวนมาก, LINE MAN เพิ่มยอดขายเดลิเวอรี และ Manager App สำหรับเจ้าของร้านดูข้อมูลแบบเรียลไทม์',
      ),
      image('ผังระบบนิเวศ LMWN แสดงความเชื่อมโยงระหว่าง Wongnai, LINE MAN, WMA และ POS'),
    ],
    tags: ['mo-overview', 'ecosystem'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: null,
    xpReward: 100,
    estimatedMinutes: 10,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 5 },
    steps: [
      {
        id: 'mo1-s1',
        order: 1,
        type: 'info',
        prompt: 'ระบบนิเวศ LMWN และหน้าที่ของแต่ละแอป',
        bodyBlocks: [
          text(
            'WMA = เครื่องมือหลักของร้านสำหรับจัดการหน้าร้านและรับออเดอร์ LINE MAN Food & Mart ใช้งานได้ทั้งบนโทรศัพท์ เครื่อง Sunmi V.2 และเครื่อง POS',
          ),
          text(
            'Wongnai POS = ระบบบริหารร้านอาหารครบวงจร (หน้าร้าน + หลังร้าน + เชื่อมเดลิเวอรี) ส่วน Salesforce คือระบบที่ CS ใช้เช็กข้อมูลร้าน Tier และ Ranking',
          ),
        ],
        helperText: 'อ่านให้เข้าใจภาพรวม แล้วกดถัดไป',
      },
      {
        id: 'mo1-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'ร้านค้าติดต่อทีม CS (MDS Team) ผ่านช่องทางใดมากที่สุด?',
        options: [
          { id: 'a', label: 'โทรศัพท์ (Telephony)' },
          { id: 'b', label: 'Live Chat' },
          { id: 'c', label: 'Slack' },
          { id: 'd', label: 'อีเมล' },
        ],
        correctOptionId: 'a',
        explanation:
          'ช่องทางโทรศัพท์ (Telephony) มีสัดส่วนมากที่สุด (~54.7%) รองลงมาคือ Live Chat (~35.8%) และ Slack (~8.7%)',
      },
      {
        id: 'mo1-s3',
        order: 3,
        type: 'multi-choice',
        prompt: 'ข้อใดคือแอปในระบบนิเวศ LMWN ที่เกี่ยวข้องกับร้านค้าโดยตรง? (เลือกได้มากกว่า 1 ข้อ)',
        options: [
          { id: 'a', label: 'Wongnai Merchant App (WMA)' },
          { id: 'b', label: 'Wongnai POS' },
          { id: 'c', label: 'Manager App' },
          { id: 'd', label: 'LINE MAN DRIVER (แอปรับส่งผู้โดยสาร)' },
        ],
        correctOptionIds: ['a', 'b', 'c'],
        explanation:
          'WMA, Wongnai POS และ Manager App ใช้จัดการร้าน ส่วน LINE MAN DRIVER เป็นแอปสำหรับคนขับรับงานรับส่งผู้โดยสาร ไม่เกี่ยวกับร้านค้า',
      },
      {
        id: 'mo1-s4',
        order: 4,
        type: 'free-text',
        prompt:
          'ร้านค้าใหม่ถามว่า "WMA กับ Wongnai POS ต่างกันยังไง ต้องใช้ทั้งคู่ไหม" จงอธิบายสั้น ๆ',
        helperText: 'ตอบ 1-3 ประโยค เน้นบทบาทของแต่ละแอป',
        minLength: 20,
        sampleAnswerKeywords: ['WMA', 'รับออเดอร์', 'POS', 'บริหารร้าน', 'เดลิเวอรี'],
        modelAnswer:
          'WMA เป็นแอปฟรีสำหรับรับออเดอร์เดลิเวอรี LINE MAN และจัดการหน้าร้านบน LINE MAN/Wongnai ส่วน Wongnai POS เป็นระบบบริหารร้านครบวงจรที่คิดเงินหน้าร้าน จัดการโต๊ะ สต๊อก และรายงาน ร้านที่ขายแค่เดลิเวอรีใช้ WMA อย่างเดียวได้ แต่ถ้าต้องการระบบหน้าร้านด้วยจึงจะใช้ POS',
      },
      {
        id: 'mo1-s5',
        order: 5,
        type: 'live-chat-mock',
        prompt: 'ตอบแชทจากร้านค้าที่สับสนว่าจะติดต่อใครเรื่องปัญหาการรับออเดอร์',
        openingMessages: [
          { id: 'm1', sender: 'customer', text: 'ตอนนี้ร้านกดรับออเดอร์ LINE MAN ไม่ได้เลยค่ะ จอค้าง' },
          { id: 'm2', sender: 'customer', text: 'ไม่รู้ว่าต้องโทรหาใคร หรือแจ้งตรงไหน' },
        ],
        modelReply:
          'เข้าใจเลยค่ะว่าตอนนี้เร่งด่วนมาก เดี๋ยวแอดมินช่วยดูให้เลยนะคะ รบกวนแจ้งหมายเลขออเดอร์และชื่อร้านให้หน่อยค่ะ ระหว่างนี้ลองปิดแล้วเปิดแอป WMA ใหม่ดูก่อน ถ้ายังไม่ได้แอดมินจะรีบตรวจสอบสถานะระบบให้ทันทีค่ะ',
        sampleReplyKeywords: ['เข้าใจ', 'หมายเลขออเดอร์', 'ตรวจสอบ', 'WMA'],
      },
    ],
  },
  {
    id: LESSON_IDS.mo2,
    courseId: COURSE_IDS.merchantOverview,
    order: 2,
    title: 'ประเภทร้าน LINE MAN: Food & Mart, Official vs E-Menu',
    slug: 'restaurant-types-official-emenu',
    summary: 'แยกความแตกต่างระหว่างร้าน Official กับ E-Menu และประเภทร้าน Mart',
    difficulty: 'easy',
    descriptionBlocks: [
      text(
        'ร้านบน LINE MAN แบ่งเป็น 2 ประเภทหลัก: Official คือร้านที่แจ้งเป็นเจ้าของหรือสมัครผ่าน WMA เพื่อแก้ข้อมูล เมนู และรับออเดอร์ด้วยตนเอง ส่วน E-Menu (Standard) คือร้านที่เจ้าหน้าที่ LINE MAN ลงข้อมูลให้ ราคาอาจไม่ตรงกับหน้าร้านจริง และคนขับต้องโทรยืนยันราคากับลูกค้าก่อน',
      ),
      text(
        'ร้าน Mart แบ่งเป็น Mart ทั่วไป (ขายของสด ของแห้ง ของใช้) และ Mart SP (แบรนด์ที่มีชื่อเสียงหรือหลายสาขา เช่น BigC, Tops, Boots) โดยร้าน Mart ทั้งหมดเป็นประเภท Official',
      ),
    ],
    tags: ['mo-merchant-types', 'delivery-flow'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: LESSON_IDS.mo1,
    xpReward: 110,
    estimatedMinutes: 11,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 5 },
    steps: [
      {
        id: 'mo2-s1',
        order: 1,
        type: 'info',
        prompt: 'Official vs E-Menu (Standard) ต่างกันตรงไหน',
        bodyBlocks: [
          text(
            'ร้าน Official: มีสัญลักษณ์ official, แก้ข้อมูลร้านเองได้, รับออเดอร์โดยตรงผ่าน WMA, คนขับไม่ต้องโทรยืนยันราคา',
          ),
          text(
            'ร้าน E-Menu/Standard: ไม่มีสัญลักษณ์ official, เมนูและราคาอาจไม่ตรงกับหน้าร้าน, คนขับต้องโทรยืนยันราคากับลูกค้าและสั่งอาหารหน้าร้านเอง, ตรวจสอบข้อมูลย้อนหลังไม่ได้หากได้รับสินค้าผิดหรือไม่ครบ',
          ),
          text('สัดส่วนโดยประมาณ: Official ~90%, E-Menu ~10%'),
        ],
      },
      {
        id: 'mo2-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'ร้านประเภทใดที่คนขับต้องโทรยืนยันราคากับลูกค้าก่อนสั่งทำอาหาร?',
        options: [
          { id: 'a', label: 'ร้าน Official' },
          { id: 'b', label: 'ร้าน E-Menu (Standard)' },
          { id: 'c', label: 'ร้าน Mart SP' },
          { id: 'd', label: 'ทุกร้านต้องโทรยืนยัน' },
        ],
        correctOptionId: 'b',
        explanation:
          'ร้าน E-Menu ไม่ได้ลงข้อมูลราคาเอง ราคาอาจไม่ตรง คนขับจึงต้องโทรยืนยันราคากับลูกค้าก่อนเสมอ',
      },
      {
        id: 'mo2-s3',
        order: 3,
        type: 'multi-choice',
        prompt: 'ข้อใดเป็นจริงเกี่ยวกับร้าน Mart? (เลือกได้มากกว่า 1 ข้อ)',
        options: [
          { id: 'a', label: 'ร้าน Mart ทั้งหมดเป็นประเภท Official' },
          { id: 'b', label: 'Mart SP คือแบรนด์ที่มีชื่อเสียงหรือหลายสาขา' },
          { id: 'c', label: 'น้ำหนักสินค้าสำหรับจัดส่งต้องไม่เกิน 15 กิโลกรัม' },
          { id: 'd', label: 'ร้าน Mart ขายเครื่องดื่มแอลกอฮอล์ได้' },
        ],
        correctOptionIds: ['a', 'b', 'c'],
        explanation:
          'ร้าน Mart เป็น Official ทั้งหมด, Mart SP เป็นแบรนด์ดัง/หลายสาขา, น้ำหนักจัดส่ง ≤ 15 กก. ส่วนเครื่องดื่มแอลกอฮอล์เป็นสินค้าห้ามจำหน่าย',
      },
      {
        id: 'mo2-s4',
        order: 4,
        type: 'live-chat-mock',
        prompt: 'ตอบแชทจากลูกค้าเจ้าของร้านที่ยังไม่เข้าใจว่าทำไมตัวเองแก้เมนูไม่ได้',
        openingMessages: [
          { id: 'm1', sender: 'customer', text: 'ร้านผมอยู่บน LINE MAN แต่ทำไมผมแก้ราคาเมนูเองไม่ได้เลยครับ' },
          { id: 'm2', sender: 'customer', text: 'ต้องทำยังไงถึงจะจัดการร้านเองได้' },
        ],
        modelReply:
          'ขอบคุณที่แจ้งเข้ามานะคะ จากที่ตรวจสอบ ร้านของคุณลูกค้ายังเป็นแบบ E-Menu ที่เจ้าหน้าที่ลงข้อมูลให้ ทำให้ยังแก้เมนูเองไม่ได้ค่ะ ถ้าต้องการจัดการร้านเอง แก้เมนู ราคา และรับออเดอร์โดยตรง แนะนำให้สมัครเปิดร้านแบบ Official ผ่านแอป Wongnai Merchant App เดี๋ยวแอดมินส่งขั้นตอนการสมัครให้นะคะ',
        sampleReplyKeywords: ['ตรวจสอบ', 'E-Menu', 'Official', 'Wongnai Merchant App', 'สมัคร'],
      },
      {
        id: 'mo2-s5',
        order: 5,
        type: 'free-text',
        prompt:
          'ร้าน Mart SP แจ้งว่าลูกค้าได้รับของไม่ครบ 1 รายการ มูลค่า 700 บาท อยากเคลม จงร่างแนวทางตอบเบื้องต้น',
        helperText: 'ระบุช่องทางแจ้ง กรอบเวลา และหลักฐานที่ต้องเตรียม',
        minLength: 20,
        sampleAnswerKeywords: ['Live Chat', '24 ชั่วโมง', 'รูปถ่าย', 'บรรจุภัณฑ์', '3 วันทำการ'],
        modelAnswer:
          'สำหรับร้าน Mart การเคลมค่าสินค้าต้องแจ้งผ่าน Live Chat ภายใน 24 ชั่วโมงหลังเกิดการยกเลิก โดยเงื่อนไขคือมูลค่าสินค้ารวม ≥ 500 บาท แนะนำให้ร้านถ่ายรูปสินค้าที่อยู่ในบรรจุภัณฑ์พร้อมส่งเก็บไว้เป็นหลักฐาน แอดมินจะรับเรื่องประสานทีมที่เกี่ยวข้อง และร้านจะทราบผลภายใน 3 วันทำการผ่านอีเมลและ SMS',
      },
    ],
  },
  {
    id: LESSON_IDS.mo3,
    courseId: COURSE_IDS.merchantOverview,
    order: 3,
    title: 'Merchant Tier, Ranking และค่า GP',
    slug: 'tier-ranking-gp',
    summary: 'รู้จักการแบ่ง Tier/Ranking ของร้าน และวิธีคิดค่าบริการ GP 32.1%',
    difficulty: 'medium',
    descriptionBlocks: [
      text(
        'Tier แบ่งตามศักยภาพร้าน (รายได้ จำนวนสาขา) เพื่อจัดทีม Support ให้เหมาะสม เช่น Long Tail (ร้านทั่วไป), Top Standalone (1-5 สาขา ยอดขายสูง), Top Chain (>5 สาขา), Strategic Partner (แบรนด์ใหญ่ มีเบอร์ติดต่อแยก 02-0385788) — ตรวจสอบได้ที่ Salesforce',
      ),
      text(
        'Ranking แบ่งตามระดับการให้บริการและยอดขายเดลิเวอรี: None/Basic, Hidden Gem (ยอดขาย Delivery > 5,000 บาท/เดือน), ร้านแนะนำ (Top 10% ของจังหวัด, เรตติ้ง ≥ 4.4), User’s Choice (Top 2%, เรตติ้ง ≥ 4.8)',
      ),
      text(
        'GP (Gross Profit) คือค่าบริการระบบที่ร้านจ่ายให้แพลตฟอร์ม ระบบหักอัตโนมัติจากยอดขาย เรทมาตรฐาน = 30% + VAT 7% = 32.1%',
      ),
    ],
    tags: ['mo-tier-gp', 'gp'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: LESSON_IDS.mo2,
    xpReward: 130,
    estimatedMinutes: 13,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 6 },
    steps: [
      {
        id: 'mo3-s1',
        order: 1,
        type: 'info',
        prompt: 'วิธีคิดค่า GP และการโอนเงินให้ร้าน',
        bodyBlocks: [
          text(
            'ตัวอย่าง: ร้านมียอดขายวันจันทร์ 1,000 บาท ค่าบริการ GP = 30% = 300 บาท รวม VAT 7% ของค่า GP = 300 + 21 = 321 บาท ดังนั้นร้านจ่ายค่าบริการ 321 บาท และได้รับยอดขายสุทธิ 1,000 − 321 = 679 บาท',
          ),
          text(
            'ร้านจะได้รับเงินในวันถัดไป (ไม่เกิน 24:00 น.) เมื่อมียอดสะสมใน E-Payment หลังหัก GP ครบ 500 บาท หากสิ้นเดือนยอดยังไม่ถึง 500 บาท บริษัทจะโอนออกให้ในวันที่ 1 ของเดือนถัดไป',
          ),
          text(
            'ใบแจ้งค่าบริการออกทุกวันที่ 1 ของเดือนถัดไป กำหนดชำระ (Due date) ทุกวันที่ 21 หากไม่ชำระตามระยะผ่อนผัน (วันที่ 21-30) ระบบจะปิด GP และนำร้านลงจาก Delivery',
          ),
        ],
      },
      {
        id: 'mo3-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'ร้านมียอดขาย 10,000 บาท เรท GP 30% + VAT 7% ร้านจะได้รับเงินสุทธิเท่าไร?',
        options: [
          { id: 'a', label: '7,000 บาท' },
          { id: 'b', label: '6,790 บาท' },
          { id: 'c', label: '6,700 บาท' },
          { id: 'd', label: '10,000 บาท เต็มจำนวน' },
        ],
        correctOptionId: 'b',
        explanation:
          'ค่า GP = 10,000 × 30% × 1.07 = 3,210 บาท ร้านได้รับ 10,000 − 3,210 = 6,790 บาท โอนเข้าบัญชีในวันทำการถัดไป',
      },
      {
        id: 'mo3-s3',
        order: 3,
        type: 'single-choice',
        prompt: 'CS ตรวจสอบ Tier และ Ranking ของร้านได้จากที่ใด?',
        options: [
          { id: 'a', label: 'Wongnai Merchant App' },
          { id: 'b', label: 'Salesforce' },
          { id: 'c', label: 'Wongnai POS Manager' },
          { id: 'd', label: 'แอป LINE MAN ฝั่งลูกค้า' },
        ],
        correctOptionId: 'b',
        explanation: 'ข้อมูล Tier และ Ranking ของร้านตรวจสอบได้ที่ Salesforce หน้าข้อมูลร้านค้า',
      },
      {
        id: 'mo3-s4',
        order: 4,
        type: 'multi-choice',
        prompt: 'ข้อใดถูกต้องเกี่ยวกับการโอนเงินและใบแจ้งค่าบริการ GP? (เลือกได้มากกว่า 1 ข้อ)',
        options: [
          { id: 'a', label: 'ร้านได้รับเงินวันถัดไปเมื่อยอดสะสมหลังหัก GP ครบ 500 บาท' },
          { id: 'b', label: 'ใบแจ้งค่าบริการออกทุกวันที่ 1 ของเดือนถัดไป' },
          { id: 'c', label: 'กำหนดชำระ (Due date) คือวันที่ 21 ของเดือน' },
          { id: 'd', label: 'ถ้าไม่ชำระ ระบบจะไม่มีผลกระทบใด ๆ กับร้าน' },
        ],
        correctOptionIds: ['a', 'b', 'c'],
        explanation:
          'ยอดสะสม 500 บาท, ใบแจ้งวันที่ 1, Due date วันที่ 21 — ถูกต้อง หากไม่ชำระตามระยะผ่อนผัน ระบบจะปิด GP และนำร้านลงจาก Delivery',
      },
      {
        id: 'mo3-s5',
        order: 5,
        type: 'phone-call-mock',
        prompt: 'รับสายจากร้านที่ไม่เข้าใจว่าทำไมยอดที่ได้รับน้อยกว่ายอดขาย',
        scenario:
          'ร้านโทรเข้ามาบ่นว่ายอดขายวันเสาร์ 5,000 บาท แต่เงินเข้าบัญชีแค่ 3,395 บาท คิดว่าระบบหักเงินผิด',
        callerLines: [
          'ยอดขาย 5,000 แต่ได้เงินแค่สามพันกว่า ระบบหักอะไรของร้านเยอะขนาดนี้',
          'ช่วยอธิบายหน่อยว่าหักไปเท่าไหร่ ทำไมถึงหักได้ขนาดนี้',
        ],
        modelReplyDescription:
          'คำตอบที่ดีควรอธิบายว่ายอดที่หักคือค่าบริการ GP 30% + VAT 7% ของค่า GP = 32.1% ของยอดขาย (5,000 × 32.1% ≈ 1,605 บาท) เหลือสุทธิ ~3,395 บาท ไม่ใช่ระบบผิด และแนะนำให้ร้านดูรายละเอียดได้ที่ WMA > การเงิน พร้อมน้ำเสียงที่เข้าใจความกังวลของร้าน',
        sampleReplyKeywords: ['GP', '32.1%', 'VAT', 'การเงิน', 'ตรวจสอบ'],
      },
      {
        id: 'mo3-s6',
        order: 6,
        type: 'salesforce-mock-timed',
        prompt: 'ร้าน Strategic Partner ติดต่อเข้ามาเรื่องข้อสงสัยการหัก % ของแคมเปญ จงบันทึกและส่งต่อเคส',
        scenario:
          'ร้านเชนใหญ่ (Strategic Partner) โทรเข้ามาถามว่าแคมเปญที่เข้าร่วมเดือนที่แล้วหัก % อย่างไร CS POS ตอบเชิงลึกเรื่องการคิด % แคมเปญไม่ได้ ต้องส่งต่อทีม Merchant',
        timeLimitSeconds: 150,
        priorityOptions: ['ต่ำ', 'ปานกลาง', 'สูง', 'เร่งด่วน'],
        caseTypeOptions: [
          'สอบถามการใช้งาน WMA',
          'ส่งต่อทีม Merchant (Need - Merchant)',
          'ปัญหาการรับออเดอร์',
          'ขอเอกสารย้อนหลัง',
        ],
        mockAccounts: [
          { id: 'acc1', merchantName: 'ครัวคุณย่า เชนใหญ่ (Strategic Partner)', businessType: 'เชนร้านอาหาร' },
          { id: 'acc2', merchantName: 'ร้านลุงหมูทอด', businessType: 'ร้านอาหารตามสั่ง' },
        ],
        idealCase: {
          subject: 'ส่งต่อทีม Merchant: ร้าน Strategic Partner สอบถามการหัก % แคมเปญ',
          description:
            'ร้าน Strategic Partner สอบถามรายละเอียดการคิด % ของแคมเปญที่เข้าร่วมเดือนก่อน เป็นคำถามเชิงลึกที่ CS POS ตอบไม่ได้ ส่งต่อ Need - Merchant เพื่อให้ทีม Merchant ติดต่อกลับ',
          priority: 'ปานกลาง',
          caseType: 'ส่งต่อทีม Merchant (Need - Merchant)',
          accountId: 'acc1',
        },
      },
    ],
  },
  {
    id: LESSON_IDS.mo4,
    courseId: COURSE_IDS.merchantOverview,
    order: 4,
    title: 'WMA: ลงทะเบียนร้าน เปิดเดลิเวอรี และสมัคร GP',
    slug: 'wma-register-delivery-gp',
    summary: 'ขั้นตอนพาร้านเปิดใช้งาน LINE MAN ตั้งแต่สมัครจนพร้อมรับออเดอร์',
    difficulty: 'medium',
    descriptionBlocks: [
      text(
        'เส้นทางของร้านใหม่: ดาวน์โหลด WMA (ใช้ได้เฉพาะ Android 7.0 ขึ้นไป) > ลงทะเบียนร้าน > เปิดใช้งานเดลิเวอรี > สมัครเข้าร่วม GP > ตั้งค่าร้าน > เริ่มรับออเดอร์',
      ),
      text(
        'การลงทะเบียนต้องยืนยันตัวตนด้วยบัตรประชาชนและ OTP ทีมจะใช้เวลาตรวจสอบ 3 วันทำการก่อนจึงจะ Login เข้าระบบได้ ส่วนการสมัคร GP ต้องเปิดเดลิเวอรีและเพิ่มเมนูใน WMA ก่อน และใช้เวลาอนุมัติประมาณ 3 วัน',
      ),
    ],
    tags: ['mo-wma-register', 'wma'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: LESSON_IDS.mo3,
    xpReward: 120,
    estimatedMinutes: 12,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 5 },
    steps: [
      {
        id: 'mo4-s1',
        order: 1,
        type: 'info',
        prompt: 'ลำดับขั้นตอนการเปิดร้านบน LINE MAN',
        bodyBlocks: [
          text(
            '1) ลงทะเบียนร้านใน WMA (ชื่อร้าน จังหวัด ประเภท Food/Mart, ช่องทางการขาย, POS ที่ใช้, ผู้ติดต่อ, รูปบัตรประชาชน) > รอตรวจสอบ 3 วันทำการ',
          ),
          text(
            '2) เปิดใช้บริการเดลิเวอรี: ใส่ข้อมูลพื้นฐาน วัน-เวลาเปิดปิด ระบุเบอร์ Autocall (สูงสุด 3 เบอร์) เปิดการแจ้งเตือนและเสียงตลอดเวลา สร้างเมนูอย่างน้อย 1 ประเภทและ 1 เมนู',
          ),
          text(
            '3) สมัคร GP: ต้องเปิดเดลิเวอรีและมีเมนูก่อน เลือกประเภทบุคคลธรรมดา/นิติบุคคล อัปโหลดเอกสาร เซ็นสัญญา รออนุมัติ 3 วัน (เริ่มใช้งาน GP ได้วันถัดไปหลังได้ SMS อนุมัติ)',
          ),
          text('หมายเหตุ: 1 เลขบัตรประชาชนสมัครเปิดร้านได้ไม่เกิน 3 ร้าน (นิติบุคคลไม่จำกัด)'),
        ],
      },
      {
        id: 'mo4-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'ก่อนสมัครเข้าร่วม GP Partnership ร้านต้องทำอะไรให้เสร็จก่อน?',
        options: [
          { id: 'a', label: 'เปิดหน้าร้านบน LINE MAN, เปิดเดลิเวอรี และเพิ่มเมนูใน WMA' },
          { id: 'b', label: 'ซื้อเครื่อง POS จากบริษัท' },
          { id: 'c', label: 'มียอดขายเกิน 5,000 บาท/เดือน' },
          { id: 'd', label: 'สมัครโฆษณา Ad Manager' },
        ],
        correctOptionId: 'a',
        explanation:
          'ร้านต้องเปิดร้านบน LINE MAN เปิดเดลิเวอรี และเพิ่มเมนูใน WMA ก่อน จึงจะกดสมัคร GP ได้',
      },
      {
        id: 'mo4-s3',
        order: 3,
        type: 'single-choice',
        prompt: '1 เลขบัตรประชาชน สมัครเปิดร้านบน LINE MAN ได้สูงสุดกี่ร้าน?',
        options: [
          { id: 'a', label: '1 ร้าน' },
          { id: 'b', label: '3 ร้าน' },
          { id: 'c', label: '5 ร้าน' },
          { id: 'd', label: 'ไม่จำกัด' },
        ],
        correctOptionId: 'b',
        explanation:
          '1 เลขบัตรประชาชน (บุคคลธรรมดา) สมัครได้ไม่เกิน 3 ร้าน ส่วนนิติบุคคลไม่จำกัดจำนวน',
      },
      {
        id: 'mo4-s4',
        order: 4,
        type: 'multi-choice',
        prompt: 'ข้อใดคือระยะเวลาที่ถูกต้องในกระบวนการเปิดร้าน? (เลือกได้มากกว่า 1 ข้อ)',
        options: [
          { id: 'a', label: 'ตรวจสอบการลงทะเบียนร้าน: 3 วันทำการ' },
          { id: 'b', label: 'อนุมัติการสมัคร GP: ประมาณ 3 วัน' },
          { id: 'c', label: 'เริ่มใช้งาน GP ได้: วันถัดไปหลังได้รับ SMS อนุมัติ' },
          { id: 'd', label: 'เปิดใช้งานเดลิเวอรี: ต้องรอ 7 วันทำการ' },
        ],
        correctOptionIds: ['a', 'b', 'c'],
        explanation:
          'ลงทะเบียน 3 วันทำการ, GP อนุมัติ ~3 วัน, เริ่มใช้ GP วันถัดไปหลัง SMS — การเปิดเดลิเวอรีทำได้ทันทีหลังลงทะเบียนสำเร็จ ไม่ต้องรอ 7 วัน',
      },
      {
        id: 'mo4-s5',
        order: 5,
        type: 'phone-call-mock',
        prompt: 'รับสายจากร้านที่ลงทะเบียนแล้วแต่ยัง Login ไม่ได้',
        scenario:
          'ร้านลงทะเบียนใน WMA เมื่อวานนี้ วันนี้พยายาม Login แต่ระบบแจ้งว่ายังเข้าไม่ได้ ร้านร้อนใจอยากเปิดขายให้ทัน',
        callerLines: [
          'ลงทะเบียนไปเมื่อวานแล้วนะ แต่วันนี้ Login ไม่ได้เลย ขึ้นว่ายังใช้งานไม่ได้',
          'เมื่อไหร่ถึงจะเข้าได้ อยากเปิดขายวันนี้',
        ],
        modelReplyDescription:
          'คำตอบที่ดีควรแสดงความเข้าใจ อธิบายว่าหลังลงทะเบียนทีมต้องใช้เวลาตรวจสอบ 3 วันทำการก่อนจึงจะ Login ได้ ไม่ใช่ความผิดพลาด และแจ้งกรอบเวลาที่ชัดเจน พร้อมเสนอให้ตรวจสอบว่าใช้เบอร์/อีเมลตรงกับที่ลงทะเบียนไว้หรือไม่ และรับปากติดตามให้หากเกินกำหนด',
        sampleReplyKeywords: ['เข้าใจ', '3 วันทำการ', 'ตรวจสอบ', 'เบอร์', 'ติดตาม'],
      },
    ],
  },
  {
    id: LESSON_IDS.mo5,
    courseId: COURSE_IDS.merchantOverview,
    order: 5,
    title: 'WMA: ตั้งค่าร้าน สร้างเมนู และฟีเจอร์',
    slug: 'wma-settings-menu-features',
    summary: 'การตั้งค่าร้าน สร้างเมนู โปรโมชัน โฆษณา และเมนูการเงิน',
    difficulty: 'medium',
    descriptionBlocks: [
      text(
        'หน้าตั้งค่า WMA ครอบคลุมข้อมูลร้าน เวลาเปิดปิด เบอร์ Auto call การเพิ่มสาขา เอกสารสัญญา เสียงแจ้งเตือน โหมดทดลองออเดอร์ และการตรวจสอบปัญหาระบบ (Troubleshoot)',
      ),
      text(
        'การสร้างเมนู = เพิ่มประเภทอาหาร > เพิ่มเมนู (ชื่อ ราคา รูป เลือกประเภท) > เพิ่มตัวเลือก (เช่น เส้น น้ำ/แห้ง Topping) ฟีเจอร์อื่น ๆ เช่น โปรโมชัน 4 แบบ (ต้องสมัคร GP), Ad Manager, การเงิน และรายงานคุณภาพร้าน',
      ),
    ],
    tags: ['mo-wma-features', 'menu-setup'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: LESSON_IDS.mo4,
    xpReward: 130,
    estimatedMinutes: 13,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 6 },
    steps: [
      {
        id: 'mo5-s1',
        order: 1,
        type: 'info',
        prompt: 'เมนู โปรโมชัน และ Ad Manager บน WMA',
        bodyBlocks: [
          text(
            'โปรโมชัน 4 แบบ (ต้องสมัคร GP): ส่วนลดราคาพิเศษ, ส่วนลดท้ายบิล, โคดส่วนลด, เซตสุดคุ้ม — ตั้งช่วงเวลาและจำนวนสิทธิ์ได้',
          ),
          text(
            'Ad Manager (เฉพาะร้าน GP): มี 2 แบบคือ "เพิ่มการเข้าชมร้าน" (จ่ายเมื่อลูกค้าคลิก) และ "เพิ่มออเดอร์" (จ่ายเมื่อออเดอร์จัดส่งสำเร็จ) ระบบหักค่าโฆษณาเมื่อสิ้นวันเหมือนค่า GP และร้านต้องเข้าไปปิด Ad เองทุกวัน ไม่งั้นระบบจะเปิดต่อเนื่องอัตโนมัติ',
          ),
          text(
            'เมนูการเงิน (Finance): แสดงยอดค่าบริการ ยอดค้างชำระ ใบแจ้งค่าบริการ ขอเอกสารย้อนหลัง (1/3/6/12 เดือน) และฟีเจอร์ "LINE MAN ให้ถอน" (กำหนดขั้นต่ำ 10/50/100/200 บาท ค่าธรรมเนียม 5 บาท/ครั้ง ยกเว้นยอด ≥ 500 บาท)',
          ),
        ],
      },
      {
        id: 'mo5-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'ฟีเจอร์ใดใน WMA ที่ "ต้องสมัคร GP" ก่อนจึงจะใช้งานได้?',
        options: [
          { id: 'a', label: 'การสร้างเมนูอาหาร' },
          { id: 'b', label: 'การสร้างโปรโมชันและ Ad Manager' },
          { id: 'c', label: 'การแก้ไขข้อมูลร้าน' },
          { id: 'd', label: 'การตั้งเวลาเปิด-ปิดร้าน' },
        ],
        correctOptionId: 'b',
        explanation:
          'โปรโมชันทั้ง 4 แบบและ Ad Manager ใช้ได้เฉพาะร้านที่เข้าร่วมโครงการ GP ส่วนการสร้างเมนูและตั้งค่าร้านทำได้ทุกร้าน',
      },
      {
        id: 'mo5-s3',
        order: 3,
        type: 'single-choice',
        prompt: 'Ad Manager แบบ "เพิ่มออเดอร์" คิดค่าโฆษณาเมื่อใด?',
        options: [
          { id: 'a', label: 'เมื่อลูกค้าคลิกเข้าชมร้าน' },
          { id: 'b', label: 'เมื่อออเดอร์จัดส่งสำเร็จ' },
          { id: 'c', label: 'ทุกครั้งที่แสดงโฆษณา' },
          { id: 'd', label: 'รายเดือนแบบเหมาจ่าย' },
        ],
        correctOptionId: 'b',
        explanation:
          '"เพิ่มการเข้าชมร้าน" จ่ายเมื่อลูกค้าคลิก ส่วน "เพิ่มออเดอร์" จ่ายเมื่อออเดอร์จัดส่งสำเร็จ',
      },
      {
        id: 'mo5-s4',
        order: 4,
        type: 'multi-choice',
        prompt: 'ลำดับการสร้างเมนูบน WMA ที่ถูกต้องประกอบด้วยอะไรบ้าง? (เลือกได้มากกว่า 1 ข้อ)',
        options: [
          { id: 'a', label: 'เพิ่มประเภทอาหาร (หมวดหมู่)' },
          { id: 'b', label: 'เพิ่มเมนู (ชื่อ ราคา รูป เลือกประเภท)' },
          { id: 'c', label: 'เพิ่มตัวเลือกให้เมนู เช่น เส้น น้ำ/แห้ง Topping' },
          { id: 'd', label: 'ต้องสมัคร Ad Manager ก่อนจึงเพิ่มเมนูได้' },
        ],
        correctOptionIds: ['a', 'b', 'c'],
        explanation:
          'เพิ่มหมวดหมู่ > เพิ่มเมนู > เพิ่มตัวเลือก เป็นลำดับที่ถูกต้อง การเพิ่มเมนูไม่เกี่ยวข้องกับ Ad Manager',
      },
      {
        id: 'mo5-s5',
        order: 5,
        type: 'live-chat-mock',
        prompt: 'ตอบแชทร้านที่บ่นว่าค่าโฆษณาถูกหักต่อเนื่องทั้งที่คิดว่าปิดไปแล้ว',
        openingMessages: [
          { id: 'm1', sender: 'customer', text: 'ทำไมค่าโฆษณาโดนหักทุกวันเลยคะ ร้านนึกว่าปิดไปแล้ว' },
          { id: 'm2', sender: 'customer', text: 'ต้องทำยังไงถึงจะหยุด' },
        ],
        modelReply:
          'ขอโทษในความไม่สะดวกนะคะ สำหรับ Ad Manager ระบบจะเปิดต่อเนื่องอัตโนมัติทุกวันจนกว่าร้านจะเข้าไปปิดเอง ค่าโฆษณาจะถูกหักรวมกับค่า GP ในแต่ละวันค่ะ แนะนำให้เข้าที่ Ad Manager > เลือกโฆษณาที่เปิดใช้งาน > กดปิด แล้วระบบจะหยุดหักในวันถัดไป เดี๋ยวแอดมินส่งขั้นตอนแบบมีรูปให้นะคะ',
        sampleReplyKeywords: ['ขอโทษ', 'เปิดต่อเนื่องอัตโนมัติ', 'กดปิด', 'GP', 'ขั้นตอน'],
      },
      {
        id: 'mo5-s6',
        order: 6,
        type: 'free-text',
        prompt:
          'ร้านลืมรหัสผ่านเข้า WMA และหลุดออกจากบัญชี จงร่างแนวทางช่วยเหลือ',
        helperText: 'ระบุขั้นตอนรีเซ็ตรหัสผ่านและกรอบเวลาการสร้างบัญชีใหม่',
        minLength: 20,
        sampleAnswerKeywords: ['ลืมรหัสผ่าน', 'อีเมล', 'รีเซ็ตรหัสผ่าน', 'ลงทะเบียนร้าน', '1-3 วันทำการ'],
        modelAnswer:
          'แนะนำให้ร้านกด "ลืมรหัสผ่าน?" จากหน้าเข้าสู่ระบบ กรอกอีเมลที่ลงทะเบียนไว้ ระบบจะส่งลิงก์ตั้งรหัสผ่านใหม่ทางอีเมล กรณีหลุดบัญชี ให้กดฟันเฟืองมุมขวาบน > ออกจากระบบ > ลงทะเบียนร้าน > เลือกร้านเดิมและกรอกข้อมูลเพื่อเชื่อมกับร้านเดิม โดยบัญชีจะถูกสร้างภายใน 1-3 วันทำการ',
      },
    ],
  },
  {
    id: LESSON_IDS.mo6,
    courseId: COURSE_IDS.merchantOverview,
    order: 6,
    title: 'WMA: การรับและยกเลิกออเดอร์',
    slug: 'wma-accept-cancel-orders',
    summary: 'รับออเดอร์อัตโนมัติ/ด้วยตนเอง จัดการของหมด และการยกเลิกออเดอร์',
    difficulty: 'medium',
    descriptionBlocks: [
      text(
        'รับออเดอร์ได้ 2 แบบ: Auto Accept (ระบบรับให้อัตโนมัติเมื่อเปิดร้าน) หรือกดรับเอง — ต้องรับภายใน 5 นาที ไม่งั้นออเดอร์ถูกยกเลิกอัตโนมัติ ออเดอร์ที่ยังไม่ดูขึ้นแถบสีส้ม พอเข้าไปดูจะเปลี่ยนเป็นแถบสีขาวและเสียงหยุด',
      ),
      text(
        'กรณีของหมดบางรายการ: ร้านต้องโทรติดต่อลูกค้าก่อนแก้ไขออเดอร์ การยกเลิก: ร้านยกเลิกเองได้ภายใน 60 นาทีหลังกดรับ และไม่เกิน 30 ครั้ง/สัปดาห์ หากยกเลิกเองไม่ทันให้ติดต่อฝ่ายบริการลูกค้าใน WMA พร้อมแจ้งหมายเลขออเดอร์และเหตุผล',
      ),
    ],
    tags: ['mo-wma-orders', 'order-flow'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: LESSON_IDS.mo5,
    xpReward: 130,
    estimatedMinutes: 12,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 6 },
    steps: [
      {
        id: 'mo6-s1',
        order: 1,
        type: 'info',
        prompt: 'ขั้นตอนการรับออเดอร์และการหาคนขับใหม่',
        bodyBlocks: [
          text(
            'กดรับออเดอร์: แถบ "ใหม่" > เลือกออเดอร์ > กด "รับออเดอร์" ภายใน 5 นาที เมื่อทำเสร็จกด "อาหารพร้อมส่ง" ออเดอร์จะย้ายไปแถบ "กำลังส่ง" เมื่อคนขับมารับและชำระเงินเรียบร้อย',
          ),
          text(
            'ถ้าคนขับยกเลิกเพราะสาเหตุจากคนขับ (อุบัติเหตุ รถเสีย ไม่ไปรับอาหาร) ระบบจะหาคนขับใหม่อัตโนมัติภายใน 6 นาที แต่ถ้าคนขับกด "Driver to Destination" แล้ว จะหาคนขับใหม่ไม่ได้อีก',
          ),
          text(
            'ออเดอร์ Pickup: ร้านกดรับ ระบุเวลาทำอาหาร เมื่อเสร็จกด "เสร็จ" ลูกค้ามารับที่ร้านโดยโชว์เลขออเดอร์ ร้านมอบอาหารแล้วกด "ลูกค้ารับอาหารแล้ว"',
          ),
        ],
      },
      {
        id: 'mo6-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'ร้านต้องกดรับออเดอร์ LINE MAN ภายในกี่นาที ไม่งั้นออเดอร์จะถูกยกเลิกอัตโนมัติ?',
        options: [
          { id: 'a', label: '3 นาที' },
          { id: 'b', label: '5 นาที' },
          { id: 'c', label: '10 นาที' },
          { id: 'd', label: '15 นาที' },
        ],
        correctOptionId: 'b',
        explanation: 'ร้านต้องกดรับออเดอร์ภายใน 5 นาที หากไม่ทัน ออเดอร์จะถูกยกเลิกและลูกค้าต้องสั่งใหม่',
      },
      {
        id: 'mo6-s3',
        order: 3,
        type: 'single-choice',
        prompt: 'ร้านยกเลิกออเดอร์เองได้ภายในกี่นาทีหลังกดรับ และไม่เกินกี่ครั้งต่อสัปดาห์?',
        options: [
          { id: 'a', label: 'ภายใน 30 นาที ไม่เกิน 20 ครั้ง/สัปดาห์' },
          { id: 'b', label: 'ภายใน 60 นาที ไม่เกิน 30 ครั้ง/สัปดาห์' },
          { id: 'c', label: 'ภายใน 60 นาที ไม่จำกัดจำนวนครั้ง' },
          { id: 'd', label: 'ยกเลิกเองไม่ได้ ต้องแจ้ง CS ทุกครั้ง' },
        ],
        correctOptionId: 'b',
        explanation: 'ร้านกดยกเลิกเองได้ภายใน 60 นาทีหลังกดรับออเดอร์ และไม่เกิน 30 ครั้งต่อสัปดาห์ (จันทร์-อาทิตย์)',
      },
      {
        id: 'mo6-s4',
        order: 4,
        type: 'multi-choice',
        prompt: 'เมื่อพบว่ามีเมนูของหมดหลังรับออเดอร์แล้ว ร้านควรทำอะไรบ้าง? (เลือกได้มากกว่า 1 ข้อ)',
        options: [
          { id: 'a', label: 'โทรติดต่อลูกค้าก่อนแก้ไขออเดอร์' },
          { id: 'b', label: 'กด "แก้ไขรายการ" เพื่อลบเมนูที่ของหมด' },
          { id: 'c', label: 'สอบถามลูกค้าว่ายังต้องการรับอาหารอยู่หรือไม่' },
          { id: 'd', label: 'ลบเมนูออกทันทีโดยไม่ต้องแจ้งลูกค้า' },
        ],
        correctOptionIds: ['a', 'b', 'c'],
        explanation:
          'ระบบบังคับให้ร้านโทรติดต่อลูกค้าก่อนแก้ไขออเดอร์ สอบถามความต้องการ แล้วจึงกดแก้ไขรายการ ห้ามลบเมนูโดยไม่แจ้งลูกค้า',
      },
      {
        id: 'mo6-s5',
        order: 5,
        type: 'phone-call-mock',
        prompt: 'รับสายจากร้านที่กดรับออเดอร์ไม่ทันและอยากให้ช่วยกู้ออเดอร์คืน',
        scenario:
          'ร้านยุ่งช่วงพีค กดรับออเดอร์ไม่ทันใน 5 นาที ออเดอร์ถูกยกเลิกไปแล้ว ร้านโทรมาขอให้ CS ดึงออเดอร์กลับมา',
        callerLines: [
          'เมื่อกี้ยุ่งมากกดรับไม่ทัน ออเดอร์หายไปเลย ช่วยเอากลับมาให้หน่อยได้ไหม',
          'ลูกค้าโทรมาถามแล้วว่าอาหารอยู่ไหน',
        ],
        modelReplyDescription:
          'คำตอบที่ดีควรแสดงความเข้าใจ อธิบายว่าเมื่อออเดอร์ถูกยกเลิกจากการกดรับไม่ทัน (cancel_timeout) จะดึงกลับมาไม่ได้ ต้องให้ลูกค้าทำรายการสั่งใหม่ และแนะนำให้ร้านพิจารณาเปิดระบบรับออเดอร์อัตโนมัติ (Auto Accept) เพื่อลดปัญหาช่วงพีค พร้อมน้ำเสียงที่ไม่ตัดสินร้าน',
        sampleReplyKeywords: ['เข้าใจ', 'cancel_timeout', 'สั่งใหม่', 'Auto Accept', 'ช่วงพีค'],
      },
      {
        id: 'mo6-s6',
        order: 6,
        type: 'salesforce-mock-timed',
        prompt: 'ร้านติดต่อขอให้ CS ยกเลิกออเดอร์ให้เพราะกดยกเลิกเองไม่ทัน จงบันทึกเคส',
        scenario:
          'ร้านกดรับออเดอร์ไปแล้วเกิน 60 นาที มีเมนูของหมด โทรลูกค้าแล้วลูกค้าไม่ต้องการสินค้า ร้านกดยกเลิกเองไม่ได้แล้ว ขอให้ CS ยกเลิกให้ผ่าน Live Chat พร้อมแจ้งรหัสออเดอร์',
        timeLimitSeconds: 150,
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
            'ร้านกดรับออเดอร์เกิน 60 นาทีจึงยกเลิกเองไม่ได้ มีเมนูของหมด โทรลูกค้าแล้วลูกค้าไม่ต้องการสินค้า ขอให้ CS ยกเลิกออเดอร์ให้ แนบรหัสออเดอร์และเหตุผลการยกเลิกในเคส',
          priority: 'สูง',
          caseType: 'CS ยกเลิกออเดอร์ให้ร้าน',
          accountId: 'acc1',
        },
      },
    ],
  },
  {
    id: LESSON_IDS.mo7,
    courseId: COURSE_IDS.merchantOverview,
    order: 7,
    title: 'Delivery Flows, Merchant Claim, แคมเปญ และ Sunmi V.2',
    slug: 'delivery-flows-claim-campaigns',
    summary: 'รูปแบบการรับออเดอร์ เงื่อนไขการเคลม การสมัคร/ยกเลิกแคมเปญ',
    difficulty: 'hard',
    descriptionBlocks: [
      text(
        'ร้าน Official มี 3 flow: Normal Operations Flow (default — คนขับรับงานก่อน ร้านกดรับใน 5 นาที), Switch Flow (ร้านกดทำอาหารเสร็จก่อน แล้วระบบหาคนขับ — เฉพาะร้านที่ผ่านคุณสมบัติ), Deferred Flow (ระบบหาคนขับก่อนอาหารเสร็จ โดยใช้ข้อมูลเวลาเตรียมอาหาร)',
      ),
      text(
        'Merchant Claim: ร้านขอชดเชยค่าอาหารได้เมื่อออเดอร์ถูกยกเลิกโดยลูกค้าหรือคนขับ และร้านทำอาหารเสร็จแล้ว โดยส่งฟอร์มภายใน 24 ชั่วโมง พร้อมรูปอาหารในบรรจุภัณฑ์ ร้านทราบผลภายใน 3 วันทำการ',
      ),
    ],
    tags: ['mo-flow-claim', 'delivery-flow', 'claim'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: LESSON_IDS.mo6,
    xpReward: 160,
    estimatedMinutes: 15,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 6 },
    steps: [
      {
        id: 'mo7-s1',
        order: 1,
        type: 'info',
        prompt: 'เงื่อนไขการเคลมค่าอาหาร (Food Claim)',
        bodyBlocks: [
          text(
            'เคลมได้เฉพาะเมื่อสาเหตุการยกเลิกมาจากลูกค้าหรือคนขับเท่านั้น และร้านทำอาหารเสร็จแล้ว',
          ),
          text(
            'กรณีที่เคลมไม่ได้: ออเดอร์ซ้ำ (ลูกค้าคนเดียวกัน เมนูเหมือนกัน ห่างกัน < 20 นาที), กดรับออเดอร์ไม่ทัน (cancel_timeout), ร้าน Switch Flow ไม่กดพร้อมส่ง, ลูกค้าไม่ได้สั่งผ่าน LINE MAN, ร้านรับอาหารคืนจากคนขับ, ระบบทำ Auto Claim ให้แล้ว',
          ),
          text(
            'ขั้นตอน: ส่งฟอร์มในออเดอร์ภายใน 24 ชม. หลังยกเลิก + ถ่ายรูปอาหารทุกรายการในบรรจุภัณฑ์พร้อมส่ง + แนบใบเสร็จ (หมายเลขออเดอร์ขึ้นต้น LMF-) ร้านทราบผลภายใน 3 วันทำการผ่านอีเมลและ SMS',
          ),
          text(
            'ร้าน Mart: แจ้งเคลมผ่าน Live Chat ภายใน 24 ชม. เงื่อนไขมูลค่าสินค้ารวม ≥ 500 บาท Agent ประสานทีม CustomerSupport_Merchant หรือ OS_Merchant Claim',
          ),
        ],
      },
      {
        id: 'mo7-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'Switch Flow ต่างจาก Normal Operations Flow อย่างไร?',
        options: [
          { id: 'a', label: 'ร้านกดทำอาหารเสร็จก่อน แล้วระบบจึงเริ่มหาคนขับ' },
          { id: 'b', label: 'ลูกค้าไม่ต้องยืนยันราคา' },
          { id: 'c', label: 'ร้านไม่ต้องกดรับออเดอร์' },
          { id: 'd', label: 'ใช้ได้เฉพาะร้าน E-Menu' },
        ],
        correctOptionId: 'a',
        explanation:
          'Switch Flow: ร้านรับและทำอาหารเสร็จก่อน ระบบจึงหาคนขับ (ค้นหา 6 นาที x 7 ครั้ง) เหมาะกับร้านที่อาหารเสียง่ายหรือใช้เวลานาน เฉพาะร้านที่ผ่านคุณสมบัติ',
      },
      {
        id: 'mo7-s3',
        order: 3,
        type: 'single-choice',
        prompt: 'ร้านต้องส่งฟอร์มขอเคลมค่าอาหารภายในกี่ชั่วโมงหลังออเดอร์ถูกยกเลิก?',
        options: [
          { id: 'a', label: '12 ชั่วโมง' },
          { id: 'b', label: '24 ชั่วโมง' },
          { id: 'c', label: '48 ชั่วโมง' },
          { id: 'd', label: '3 วันทำการ' },
        ],
        correctOptionId: 'b',
        explanation: 'ต้องส่งฟอร์มภายใน 24 ชั่วโมงหลังเกิดการยกเลิก และทราบผลภายใน 3 วันทำการ',
      },
      {
        id: 'mo7-s4',
        order: 4,
        type: 'multi-choice',
        prompt: 'กรณีใดที่ร้าน "เคลมค่าอาหารไม่ได้"? (เลือกได้มากกว่า 1 ข้อ)',
        options: [
          { id: 'a', label: 'กดรับออเดอร์ไม่ทัน (cancel_timeout)' },
          { id: 'b', label: 'ออเดอร์ซ้ำที่ห่างกันน้อยกว่า 20 นาที' },
          { id: 'c', label: 'ร้าน Switch Flow ไม่กดพร้อมส่ง จนลูกค้ายกเลิก' },
          { id: 'd', label: 'คนขับยกเลิกออเดอร์หลังร้านทำอาหารเสร็จแล้ว' },
        ],
        correctOptionIds: ['a', 'b', 'c'],
        explanation:
          'cancel_timeout, ออเดอร์ซ้ำ < 20 นาที และ Switch Flow ไม่กดพร้อมส่ง เคลมไม่ได้ ส่วนคนขับยกเลิกหลังร้านทำเสร็จ = เคลมได้',
      },
      {
        id: 'mo7-s5',
        order: 5,
        type: 'live-chat-mock',
        prompt: 'ตอบแชทร้านที่อยากยกเลิกแคมเปญที่เข้าร่วมแบบต่ออายุอัตโนมัติ',
        openingMessages: [
          { id: 'm1', sender: 'customer', text: 'ร้านอยากออกจากแคมเปญดีลเดือด ไม่อยากเข้าร่วมต่อแล้วค่ะ' },
          { id: 'm2', sender: 'customer', text: 'ต้องทำยังไง ใช้เวลานานไหม' },
        ],
        modelReply:
          'รับทราบค่ะ ขอสอบถามสาเหตุที่ต้องการยกเลิกเพื่อบันทึกไว้นะคะ จากนั้นแอดมินจะส่งฟอร์มยกเลิกแคมเปญดีลเดือดให้กรอก โดยทีมงานจะนำโปรโมชันลงภายใน 7 วันทำการ (ไม่นับเสาร์-อาทิตย์และวันหยุดนักขัตฤกษ์) หากเป็นแคมเปญโคดเดือดจะยกเลิกภายใน 1 วันทำการค่ะ',
        sampleReplyKeywords: ['สาเหตุ', 'ฟอร์มยกเลิก', '7 วันทำการ', 'โคดเดือด'],
      },
      {
        id: 'mo7-s6',
        order: 6,
        type: 'salesforce-mock-timed',
        prompt: 'ร้านขอเปลี่ยนรูปแบบเป็น Switch Flow แต่ยังไม่ผ่านคุณสมบัติ จงบันทึกเคส',
        scenario:
          'ร้าน Official ติดต่อขอใช้ Switch Flow (รับออเดอร์ก่อนคนขับ) CS แจ้งว่าต้องผ่านคุณสมบัติก่อน และจะมีทีมติดต่อกลับสำหรับร้านที่ตรงเงื่อนไข',
        timeLimitSeconds: 150,
        priorityOptions: ['ต่ำ', 'ปานกลาง', 'สูง', 'เร่งด่วน'],
        caseTypeOptions: [
          'ส่งต่อทีม Merchant (คำขอ Switch Flow)',
          'CS ยกเลิกออเดอร์ให้ร้าน',
          'ปัญหาการรับออเดอร์',
          'ขอเอกสารย้อนหลัง',
        ],
        mockAccounts: [
          { id: 'acc1', merchantName: 'ภัตตาคารเฉาเซียง', businessType: 'ภัตตาคาร' },
          { id: 'acc2', merchantName: 'ร้านส้มตำแซ่บนัว', businessType: 'ร้านอาหารอีสาน' },
        ],
        idealCase: {
          subject: 'ส่งต่อทีม Merchant: ร้านขอใช้ Switch Flow (รอตรวจสอบคุณสมบัติ)',
          description:
            'ร้าน Official ต้องการเปลี่ยนเป็น Switch Flow แจ้งร้านว่าต้องผ่านคุณสมบัติก่อน ทีมจะติดต่อกลับสำหรับร้านที่ตรงเงื่อนไข บันทึกคำขอและส่งต่อทีม Merchant',
          priority: 'ปานกลาง',
          caseType: 'ส่งต่อทีม Merchant (คำขอ Switch Flow)',
          accountId: 'acc1',
        },
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // COURSE 2 — Wongnai POS (Android)
  // ────────────────────────────────────────────────────────────────────
  {
    id: LESSON_IDS.wp1,
    courseId: COURSE_IDS.wongnaiPos,
    order: 1,
    title: 'POS เบื้องต้นและประเภทร้านอาหาร',
    slug: 'pos-basics-restaurant-types',
    summary: 'รู้จัก POS ว่าไม่ใช่แค่เครื่องคิดเงิน และประเภทร้าน Quick/Full/Buffet',
    difficulty: 'easy',
    descriptionBlocks: [
      text(
        'POS (Point of Sales) คือระบบบริหารจัดการร้านอาหารครบวงจร ไม่ใช่แค่แคชเชียร์: จัดการหน้าร้าน (คิว โต๊ะ รับออเดอร์หน้าร้านและเดลิเวอรี), จัดการหลังร้าน (รายงาน คลังสินค้า โปรโมชัน พนักงาน) และเชื่อมต่อเดลิเวอรี LINE MAN',
      ),
      text(
        'ประเภทร้านอาหารที่ใช้ POS แบ่งเป็น 3 แบบ: Quick Service (จ่ายก่อนกิน เช่น คาเฟ่), Full Service (กินก่อนจ่าย มีโต๊ะและพนักงานเสิร์ฟ), Buffet Service (จำกัด/ไม่จำกัดเวลาตามแพ็กเกจ)',
      ),
      text(
        'POS ประกอบด้วย Software ("สมองของระบบ" ประมวลผล คำนวณ บันทึกข้อมูล) และ Hardware ("อุปกรณ์ที่ทำให้ระบบทำงานได้จริง" เช่น เครื่อง POS เครื่องพิมพ์ ลิ้นชักเก็บเงิน เครื่อง EDC)',
      ),
    ],
    tags: ['wp-basics', 'pos-fundamentals'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: null,
    xpReward: 100,
    estimatedMinutes: 10,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 5 },
    steps: [
      {
        id: 'wp1-s1',
        order: 1,
        type: 'info',
        prompt: 'POS = Software + Hardware และ LINE MAN POS มี 2 ระบบ',
        bodyBlocks: [
          text(
            'LINE MAN POS แบ่งเป็น 2 ระบบปฏิบัติการ: Wongnai POS (Android — ใช้งานผ่านโปรแกรม Wongnai POS) และ Wongnai POS IPAD (iOS — ใช้งานผ่านแอป Wongnai POS IPAD Owner)',
          ),
          text(
            'ทั้งร้าน Quick, Full และ Buffet Service สามารถเลือกใช้ระบบใดก็ได้ตามความต้องการ',
          ),
        ],
      },
      {
        id: 'wp1-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'ร้านคาเฟ่ที่ลูกค้าสั่งและจ่ายเงินที่เคาน์เตอร์ก่อนรับเครื่องดื่ม จัดเป็นร้านประเภทใด?',
        options: [
          { id: 'a', label: 'Quick Service (จ่ายก่อนกิน)' },
          { id: 'b', label: 'Full Service (กินก่อนจ่าย)' },
          { id: 'c', label: 'Buffet Service' },
          { id: 'd', label: 'E-Menu' },
        ],
        correctOptionId: 'a',
        explanation:
          'Quick Service คือร้านที่ลูกค้าสั่งและชำระเงินก่อนรับอาหาร เช่น คาเฟ่ หรือร้านที่ไม่มีโต๊ะให้ทานในร้าน',
      },
      {
        id: 'wp1-s3',
        order: 3,
        type: 'single-choice',
        prompt: 'ข้อใดอธิบาย "Software" ของระบบ POS ได้ถูกต้อง?',
        options: [
          { id: 'a', label: 'อุปกรณ์ที่ใช้รับออเดอร์และพิมพ์ใบเสร็จ' },
          { id: 'b', label: 'โปรแกรมที่ประมวลผลข้อมูล คำนวณยอดขาย และบันทึกข้อมูล' },
          { id: 'c', label: 'ลิ้นชักเก็บเงินและเครื่อง EDC' },
          { id: 'd', label: 'สาย LAN และ Router' },
        ],
        correctOptionId: 'b',
        explanation:
          'Software คือ "สมองของระบบ" ที่ประมวลผลและบันทึกข้อมูล ส่วน Hardware คืออุปกรณ์ที่ทำให้ระบบทำงานได้จริง',
      },
      {
        id: 'wp1-s4',
        order: 4,
        type: 'multi-choice',
        prompt: 'POS ช่วยจัดการเรื่องใดบ้าง นอกเหนือจากการคิดเงิน? (เลือกได้มากกว่า 1 ข้อ)',
        options: [
          { id: 'a', label: 'จัดการคิวและโต๊ะหน้าร้าน' },
          { id: 'b', label: 'ตรวจสอบรายงานและจัดการคลังสินค้า' },
          { id: 'c', label: 'เชื่อมต่อและจัดการออเดอร์เดลิเวอรี LINE MAN' },
          { id: 'd', label: 'สมัครสินเชื่อธนาคารแทนร้าน' },
        ],
        correctOptionIds: ['a', 'b', 'c'],
        explanation:
          'POS จัดการหน้าร้าน หลังร้าน และเชื่อมเดลิเวอรี ส่วนการสมัครสินเชื่อไม่ใช่หน้าที่ของ POS',
      },
      {
        id: 'wp1-s5',
        order: 5,
        type: 'free-text',
        prompt:
          'ร้านอาหารตามสั่งขนาดเล็กถามว่า "POS จำเป็นไหม ในเมื่อร้านมีเครื่องคิดเลขอยู่แล้ว" จงอธิบายคุณค่าของ POS',
        helperText: 'ตอบ 2-3 ประโยค เน้นสิ่งที่ POS ทำได้มากกว่าการคิดเงิน',
        minLength: 20,
        sampleAnswerKeywords: ['จัดการร้าน', 'รายงาน', 'สต๊อก', 'เดลิเวอรี', 'โปรโมชัน'],
        modelAnswer:
          'POS ไม่ใช่แค่เครื่องคิดเงิน แต่ช่วยจัดการร้านครบวงจร: เก็บรายงานยอดขายและเมนูขายดีอัตโนมัติ จัดการสต๊อกวัตถุดิบ สร้างโปรโมชัน จัดการพนักงาน และเชื่อมต่อรับออเดอร์เดลิเวอรี LINE MAN ในเครื่องเดียว ช่วยลดงานจดมือและข้อผิดพลาด',
      },
    ],
  },
  {
    id: LESSON_IDS.wp2,
    courseId: COURSE_IDS.wongnaiPos,
    order: 2,
    title: 'Wongnai POS: Hardware 2 ประเภท 7 รุ่น',
    slug: 'wongnai-pos-hardware',
    summary: 'แยกความแตกต่างของเครื่อง New Model และ Old Model แต่ละรุ่น',
    difficulty: 'medium',
    descriptionBlocks: [
      text(
        'Wongnai POS มี Hardware 2 ประเภท 7 รุ่น: New Model (Lite, Flex, Single, Dual) และ Old Model (Mini, Single, Dual) ทุกรุ่นใช้ฟังก์ชันพื้นฐานของ POS ได้เหมือนกัน',
      ),
      text(
        'ข้อจำกัดสำคัญ: ร้านที่ใช้ Wongnai POS ต้องใช้เครื่อง Hardware จากบริษัทเท่านั้น ดาวน์โหลดโปรแกรมลงเครื่องอื่นไม่ได้ และใช้ POS 1 เครื่องต่อ 1 สาขา เหมาะกับร้านที่เพิ่งเริ่มธุรกิจ งบจำกัด มีสาขาเดียว',
      ),
    ],
    tags: ['wp-hardware', 'hardware'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: LESSON_IDS.wp1,
    xpReward: 120,
    estimatedMinutes: 12,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 5 },
    steps: [
      {
        id: 'wp2-s1',
        order: 1,
        type: 'info',
        prompt: 'จุดเด่นและข้อจำกัดของแต่ละรุ่น (New Model)',
        bodyBlocks: [
          text(
            'Lite: จอใหญ่ 15.6 นิ้ว แต่ไม่มีแบตเตอรี่ในตัวและไม่มีเครื่องพิมพ์ในตัว ต้องต่อเครื่องพิมพ์เสริม',
          ),
          text(
            'Flex: รุ่นเดียวที่มีแบตเตอรี่ในตัว (ใช้ต่อเนื่อง 6 ชม.) จอ 10.1 นิ้ว มีฐานหมุน 180 องศา เชื่อมเน็ตได้ทั้ง Wi-Fi และซิมการ์ด',
          ),
          text(
            'Single: จอ 15.6 นิ้ว มีเครื่องพิมพ์ในตัว (ตัดกระดาษด้วยมือ กระดาษ 80 มม.) ไม่มีแบตเตอรี่ ไม่รองรับซิม',
          ),
          text(
            'Dual: 2 หน้าจอ (พนักงาน 15.6 นิ้ว + ลูกค้า 10.1 นิ้ว สำหรับสแกน QR จ่ายเงิน) มีเครื่องพิมพ์ในตัว ไม่มีแบตเตอรี่',
          ),
        ],
      },
      {
        id: 'wp2-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'Wongnai POS รุ่นใดเป็นรุ่นเดียวที่มีแบตเตอรี่ในตัวเครื่อง?',
        options: [
          { id: 'a', label: 'Lite' },
          { id: 'b', label: 'Flex' },
          { id: 'c', label: 'Single' },
          { id: 'd', label: 'Dual' },
        ],
        correctOptionId: 'b',
        explanation:
          'Flex เป็นรุ่นเดียวที่มีแบตเตอรี่ในตัว ใช้งานต่อเนื่องได้ 6 ชั่วโมง และมีฐานหมุนได้ 180 องศา',
      },
      {
        id: 'wp2-s3',
        order: 3,
        type: 'single-choice',
        prompt: 'ร้านที่ใช้ Wongnai POS (Android) ต้องใช้เครื่อง Hardware แบบใด?',
        options: [
          { id: 'a', label: 'เครื่อง Android Tablet รุ่นใดก็ได้ของร้านเอง' },
          { id: 'b', label: 'เครื่อง Hardware จากบริษัทเท่านั้น' },
          { id: 'c', label: 'iPad ของร้านเอง' },
          { id: 'd', label: 'โทรศัพท์มือถือทั่วไป' },
        ],
        correctOptionId: 'b',
        explanation:
          'ต้องใช้เครื่อง Wongnai POS ที่จำหน่ายโดยบริษัทเท่านั้น เพราะต้องดาวน์โหลดโปรแกรมจาก Sunmi Store บนเครื่องบริษัท และใช้ 1 เครื่องต่อ 1 สาขา',
      },
      {
        id: 'wp2-s4',
        order: 4,
        type: 'multi-choice',
        prompt: 'ข้อใดเป็นจริงเกี่ยวกับรุ่น Lite? (เลือกได้มากกว่า 1 ข้อ)',
        options: [
          { id: 'a', label: 'มีหน้าจอขนาดใหญ่ 15.6 นิ้ว' },
          { id: 'b', label: 'ไม่มีแบตเตอรี่ในตัว ต้องเสียบปลั๊กตลอดการใช้งาน' },
          { id: 'c', label: 'ไม่มีเครื่องพิมพ์ในตัว ต้องต่อเครื่องพิมพ์เสริม' },
          { id: 'd', label: 'มี 2 หน้าจอสำหรับพนักงานและลูกค้า' },
        ],
        correctOptionIds: ['a', 'b', 'c'],
        explanation:
          'Lite จอใหญ่ 15.6 นิ้ว แต่ไม่มีทั้งแบตเตอรี่และเครื่องพิมพ์ในตัว ส่วนรุ่น 2 หน้าจอคือ Dual',
      },
      {
        id: 'wp2-s5',
        order: 5,
        type: 'phone-call-mock',
        prompt: 'รับสายจากร้านที่อยากได้เครื่อง POS ที่พกพาไปออกบูธได้',
        scenario:
          'ร้านคาเฟ่โทรมาถามว่ามีเครื่อง POS รุ่นไหนที่เอาไปออกบูธนอกสถานที่ได้ เพราะบางวันไปขายตามงานอีเวนต์ที่ไม่มีปลั๊กไฟ',
        callerLines: [
          'ร้านไปออกบูธบ่อย บางที่ไม่มีปลั๊ก อยากได้เครื่องที่มีแบตในตัว',
          'มีรุ่นไหนแนะนำบ้าง',
        ],
        modelReplyDescription:
          'คำตอบที่ดีควรแนะนำรุ่น Flex ซึ่งเป็นรุ่นเดียวที่มีแบตเตอรี่ในตัว ใช้งานต่อเนื่องได้ประมาณ 6 ชั่วโมง เชื่อมเน็ตได้ทั้ง Wi-Fi และซิมการ์ด เหมาะกับการพกพา และแจ้งว่าหากสนใจซื้อเครื่อง จะส่งเรื่องให้ทีม MDS Lead ติดต่อกลับภายใน 48 ชั่วโมง',
        sampleReplyKeywords: ['Flex', 'แบตเตอรี่', 'ซิมการ์ด', 'MDS Lead', '48 ชั่วโมง'],
      },
    ],
  },
  {
    id: LESSON_IDS.wp3,
    courseId: COURSE_IDS.wongnaiPos,
    order: 3,
    title: 'Wongnai POS: Software 6 แพ็กเกจ และ Wongnai Care',
    slug: 'wongnai-pos-software-care',
    summary: 'แพ็กเกจ QSR/FSR แต่ละระดับ ฟีเจอร์ที่ต่างกัน และบริการเสริม',
    difficulty: 'medium',
    descriptionBlocks: [
      text(
        'Software รองรับ 2 ประเภท 6 แพ็กเกจ: Quick Service (QSR Basic/Plus/Premium) และ Full Service (FSR Basic/Plus/Premium) ทุก Hardware ใช้ฟังก์ชันพื้นฐานได้เหมือนกัน ต่างกันที่ฟังก์ชันขั้นสูงตามแพ็กเกจ',
      ),
      text(
        'ฟีเจอร์จัดการโต๊ะใช้ได้เฉพาะแพ็กเกจ Full Service เท่านั้น ส่วนข้อจำกัดของแต่ละแพ็กเกจ (เช่น Order & Pay, CRM, Mobile Order, จำนวนเครื่องพิมพ์) สามารถซื้อเพิ่มหรือเปลี่ยนแพ็กเกจได้ โดยส่งเรื่องให้ทีม Upsell Renew',
      ),
    ],
    tags: ['wp-software', 'package'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: LESSON_IDS.wp2,
    xpReward: 130,
    estimatedMinutes: 13,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 6 },
    steps: [
      {
        id: 'wp3-s1',
        order: 1,
        type: 'info',
        prompt: 'ความแตกต่างของแพ็กเกจและบริการเสริม Wongnai Care',
        bodyBlocks: [
          text(
            'QSR Basic = Basic Features เท่านั้น, QSR Plus = + Order & Pay, QSR Premium = + Order & Pay + Wongnai CRM',
          ),
          text(
            'FSR Basic = Basic Features, FSR Plus = + Static Mobile Order, FSR Premium = + Dynamic Mobile Order + Wongnai CRM (ฟีเจอร์จัดการโต๊ะมีทุกแพ็กเกจ FSR)',
          ),
          text(
            'Wongnai Care (1,500 บาท/ปี): สำหรับผู้ที่ซื้อเครื่อง POS จากบริษัท ได้สิทธิ์ยืมเครื่องสำรองระหว่างส่งซ่อม ครอบคลุมเฉพาะเครื่อง Hardware ที่ซื้อกับบริษัท (รวมเครื่องพิมพ์ในตัว) ยืมได้ครั้งละไม่เกิน 30 วัน และต้องคืนภายใน 7 วันหลังได้เครื่องซ่อมกลับ',
          ),
        ],
      },
      {
        id: 'wp3-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'ฟีเจอร์ "จัดการโต๊ะ" ใช้ได้กับแพ็กเกจ Software ประเภทใด?',
        options: [
          { id: 'a', label: 'Quick Service (QSR) ทุกแพ็กเกจ' },
          { id: 'b', label: 'Full Service (FSR) เท่านั้น' },
          { id: 'c', label: 'เฉพาะ QSR Premium' },
          { id: 'd', label: 'ทุกแพ็กเกจใช้ได้เหมือนกัน' },
        ],
        correctOptionId: 'b',
        explanation:
          'ฟีเจอร์จัดการโต๊ะเป็นฟังก์ชันขั้นสูงที่ใช้ได้เฉพาะแพ็กเกจ Full Service เท่านั้น',
      },
      {
        id: 'wp3-s3',
        order: 3,
        type: 'single-choice',
        prompt: 'บริการเสริม Wongnai Care ครอบคลุมอะไร?',
        options: [
          { id: 'a', label: 'สิทธิ์ยืมเครื่อง Hardware สำรองระหว่างส่งซ่อม' },
          { id: 'b', label: 'อัปเกรดแพ็กเกจ Software ฟรี' },
          { id: 'c', label: 'ส่วนลดค่า GP' },
          { id: 'd', label: 'ประกันสินค้าในสต๊อกของร้าน' },
        ],
        correctOptionId: 'a',
        explanation:
          'Wongnai Care (1,500 บาท/ปี) ให้สิทธิ์ยืมเครื่อง Hardware สำรองระหว่างส่งซ่อม ครอบคลุมเฉพาะเครื่องที่ซื้อกับบริษัท ยืมได้ครั้งละไม่เกิน 30 วัน',
      },
      {
        id: 'wp3-s4',
        order: 4,
        type: 'multi-choice',
        prompt: 'ข้อใดถูกต้องเกี่ยวกับแพ็กเกจ QSR? (เลือกได้มากกว่า 1 ข้อ)',
        options: [
          { id: 'a', label: 'QSR Basic มีเฉพาะ Basic Features' },
          { id: 'b', label: 'QSR Plus เพิ่มฟีเจอร์ Order & Pay' },
          { id: 'c', label: 'QSR Premium เพิ่ม Order & Pay และ Wongnai CRM' },
          { id: 'd', label: 'QSR ทุกแพ็กเกจมีฟีเจอร์จัดการโต๊ะ' },
        ],
        correctOptionIds: ['a', 'b', 'c'],
        explanation:
          'QSR ไล่ระดับ Basic < Plus (+Order & Pay) < Premium (+CRM) ส่วนฟีเจอร์จัดการโต๊ะไม่มีใน QSR ทุกแพ็กเกจ',
      },
      {
        id: 'wp3-s5',
        order: 5,
        type: 'live-chat-mock',
        prompt: 'ตอบแชทร้านที่ใช้ QSR Basic แต่อยากได้ฟีเจอร์จัดการโต๊ะ',
        openingMessages: [
          { id: 'm1', sender: 'customer', text: 'ร้านใช้แพ็กเกจ QSR Basic อยู่ อยากเปิดฟีเจอร์จัดการโต๊ะ ทำยังไงคะ' },
        ],
        modelReply:
          'ขอบคุณที่สอบถามค่ะ ฟีเจอร์จัดการโต๊ะรองรับเฉพาะแพ็กเกจ Full Service (FSR) เท่านั้น ไม่มีในแพ็กเกจ Quick Service ค่ะ หากร้านต้องการใช้งาน แนะนำให้เปลี่ยนไปใช้แพ็กเกจ FSR เดี๋ยวแอดมินส่งเรื่องให้ทีม Upsell Renew ติดต่อกลับเพื่อแจ้งรายละเอียดและราคา ภายใน 1-3 วันทำการนะคะ',
        sampleReplyKeywords: ['Full Service', 'FSR', 'เปลี่ยนแพ็กเกจ', 'Upsell Renew', '1-3 วันทำการ'],
      },
      {
        id: 'wp3-s6',
        order: 6,
        type: 'free-text',
        prompt:
          'ร้านถามว่า "ซื้อเครื่อง POS กับบริษัทแล้ว ถ้าเครื่องเสียระหว่างใช้งานจะทำยังไง" จงอธิบายบทบาทของ Wongnai Care',
        helperText: 'อธิบายว่า Care คืออะไร ราคาเท่าไร และเงื่อนไขการยืมเครื่องสำรอง',
        minLength: 20,
        sampleAnswerKeywords: ['Wongnai Care', '1,500 บาท', 'เครื่องสำรอง', '30 วัน', '7 วัน'],
        modelAnswer:
          'ร้านสามารถซื้อบริการเสริม Wongnai Care ราคา 1,500 บาท/ปี ซึ่งให้สิทธิ์ยืมเครื่อง POS สำรองไปใช้ระหว่างส่งซ่อมเครื่องหลัก ครอบคลุมเฉพาะเครื่องที่ซื้อกับบริษัท (รวมเครื่องพิมพ์ในตัว) ยืมได้ครั้งละไม่เกิน 30 วัน และต้องส่งคืนภายใน 7 วันหลังได้รับเครื่องซ่อมกลับ',
      },
    ],
  },
  {
    id: LESSON_IDS.wp4,
    courseId: COURSE_IDS.wongnaiPos,
    order: 4,
    title: 'เงื่อนไขการซื้อ POS และ SOP การส่งเรื่อง',
    slug: 'pos-purchase-sop-routing',
    summary: 'ซื้อขาด vs เช่าใช้รายวัน และการส่งเรื่องให้ทีมที่ถูกต้อง',
    difficulty: 'medium',
    descriptionBlocks: [
      text(
        'เงื่อนไขการซื้อ POS มี 2 ประเภท: (1) ซื้อขาด Hardware + ชำระ Software รายปี/รายวัน (2) เช่าใช้ Hardware & Software รายวัน (Subscription) หักเงินรายวันผ่าน E-Payment บน WMA — เฉพาะลูกค้าที่ได้รับสิทธิ์',
      ),
      text(
        'คุณสมบัติผู้ได้รับสิทธิ์เช่าใช้รายวัน: เปิดหน้าร้านบน LINE MAN เข้าร่วม GP มานานกว่า 3 เดือน ชำระค่าบริการไม่ต่ำกว่า 3 รอบบิล และมีค่าบริการมากกว่า 5,000 บาท/เดือน ต่อเนื่อง 3 เดือน (ค่ามัดจำเครื่อง 1,000 บาท คืนภายใน 30-45 วันทำการหลังแจ้งยกเลิก)',
      ),
    ],
    tags: ['wp-sop', 'sop-routing'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: LESSON_IDS.wp3,
    xpReward: 140,
    estimatedMinutes: 13,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 6 },
    steps: [
      {
        id: 'wp4-s1',
        order: 1,
        type: 'info',
        prompt: 'ตารางการส่งเรื่อง (SOP Routing)',
        bodyBlocks: [
          text('ลูกค้าใหม่ต้องการซื้อเครื่อง POS → ส่งเรื่องให้ทีม MDS Lead ติดต่อกลับ ภายใน 48 ชั่วโมง'),
          text(
            'ลูกค้าเก่าต้องการซื้อฟีเจอร์เพิ่ม (เช่น Order & Pay ที่ไม่อยู่ในแพ็กเกจ) หรืออุปกรณ์เสริม (เครื่องพิมพ์ เครื่อง EDC) → ส่งเรื่องให้ทีม Upsell Renew ติดต่อกลับ ภายใน 1-3 วันทำการ',
          ),
          text(
            'ลูกค้าต้องการเปลี่ยนอีเมลเข้าสู่ระบบ → ส่งฟอร์มให้ลูกค้าแจ้งความประสงค์ จากนั้นทีม OS Merchant ดำเนินการแก้ไขให้ ภายใน 1 วัน',
          ),
        ],
      },
      {
        id: 'wp4-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'ลูกค้าใหม่ที่ยังไม่มีเครื่อง POS สนใจจะซื้อ ต้องส่งเรื่องให้ทีมใด?',
        options: [
          { id: 'a', label: 'ทีม MDS Lead (ติดต่อกลับภายใน 48 ชม.)' },
          { id: 'b', label: 'ทีม Upsell Renew (ติดต่อกลับภายใน 1-3 วันทำการ)' },
          { id: 'c', label: 'ทีม OS Merchant (ภายใน 1 วัน)' },
          { id: 'd', label: 'ทีม Finance Operation' },
        ],
        correctOptionId: 'a',
        explanation:
          'ลูกค้าใหม่ที่สนใจซื้อเครื่อง POS ส่งเรื่องให้ทีม MDS Lead จะติดต่อกลับไปนำเสนอขายภายใน 48 ชั่วโมง',
      },
      {
        id: 'wp4-s3',
        order: 3,
        type: 'single-choice',
        prompt: 'ลูกค้าเก่าต้องการซื้ออุปกรณ์เสริม เช่น เครื่องพิมพ์เพิ่ม ต้องส่งเรื่องให้ทีมใด?',
        options: [
          { id: 'a', label: 'ทีม MDS Lead' },
          { id: 'b', label: 'ทีม Upsell Renew' },
          { id: 'c', label: 'ทีม OS Merchant' },
          { id: 'd', label: 'ทีม Merchant Operations' },
        ],
        correctOptionId: 'b',
        explanation:
          'ลูกค้าเก่าที่ต้องการซื้อฟีเจอร์เพิ่มหรืออุปกรณ์เสริม ส่งเรื่องให้ทีม Upsell Renew ติดต่อกลับภายใน 1-3 วันทำการ',
      },
      {
        id: 'wp4-s4',
        order: 4,
        type: 'multi-choice',
        prompt: 'คุณสมบัติของลูกค้าที่จะได้รับสิทธิ์ "เช่าใช้ Hardware & Software รายวัน" มีอะไรบ้าง? (เลือกได้มากกว่า 1 ข้อ)',
        options: [
          { id: 'a', label: 'เปิดหน้าร้านบน LINE MAN และเข้าร่วม GP มานานกว่า 3 เดือน' },
          { id: 'b', label: 'ชำระค่าบริการไม่ต่ำกว่า 3 รอบบิล' },
          { id: 'c', label: 'มีค่าบริการมากกว่า 5,000 บาท/เดือน ต่อเนื่อง 3 เดือน' },
          { id: 'd', label: 'เป็นร้านนิติบุคคลเท่านั้น' },
        ],
        correctOptionIds: ['a', 'b', 'c'],
        explanation:
          'สิทธิ์เช่าใช้รายวันดูจาก: เข้าร่วม GP > 3 เดือน, ชำระ ≥ 3 รอบบิล, ค่าบริการ > 5,000 บาท/เดือน ต่อเนื่อง 3 เดือน — ไม่จำกัดว่าต้องเป็นนิติบุคคล',
      },
      {
        id: 'wp4-s5',
        order: 5,
        type: 'salesforce-mock-timed',
        prompt: 'ลูกค้าใหม่โทรมาสนใจซื้อเครื่อง Wongnai POS พร้อม Software จงบันทึกและส่งต่อเคส',
        scenario:
          'เจ้าของร้านก๋วยเตี๋ยวเปิดใหม่ ยังไม่มีเครื่อง POS สนใจซื้อเครื่อง Wongnai POS Single พร้อมแพ็กเกจ FSR ต้องการให้มีคนติดต่อกลับไปแนะนำและเสนอราคา',
        timeLimitSeconds: 150,
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
            'เจ้าของร้านก๋วยเตี๋ยวเปิดใหม่ ยังไม่มีเครื่อง POS สนใจซื้อ Wongnai POS Single พร้อมแพ็กเกจ Full Service ต้องการให้ทีมขายติดต่อกลับเพื่อแนะนำและเสนอราคา ส่งเรื่องให้ MDS Lead ติดต่อกลับภายใน 48 ชม.',
          priority: 'ปานกลาง',
          caseType: 'ส่งต่อทีม MDS Lead (ลูกค้าใหม่ซื้อเครื่อง)',
          accountId: 'acc1',
        },
      },
      {
        id: 'wp4-s6',
        order: 6,
        type: 'salesforce-mock-timed',
        prompt: 'ลูกค้าเก่าต้องการเปลี่ยนอีเมลที่ใช้เข้าสู่ระบบ POS จงบันทึกและส่งต่อเคส',
        scenario:
          'ร้านที่ใช้ Wongnai POS อยู่แล้ว ต้องการเปลี่ยนอีเมลที่ใช้เข้าสู่ระบบ เพราะพนักงานเดิมที่ถืออีเมลลาออก CS ต้องส่งฟอร์มให้ลูกค้าแจ้งความประสงค์',
        timeLimitSeconds: 120,
        priorityOptions: ['ต่ำ', 'ปานกลาง', 'สูง', 'เร่งด่วน'],
        caseTypeOptions: [
          'ส่งต่อทีม MDS Lead (ลูกค้าใหม่ซื้อเครื่อง)',
          'ส่งต่อทีม Upsell Renew (ซื้อฟีเจอร์/อุปกรณ์เพิ่ม)',
          'ส่งต่อทีม OS Merchant (เปลี่ยนอีเมล login)',
          'สอบถามการใช้งาน POS',
        ],
        mockAccounts: [
          { id: 'acc1', merchantName: 'ร้านข้าวมันไก่เจ๊แดง', businessType: 'ร้านข้าวมันไก่' },
          { id: 'acc2', merchantName: 'ร้านกาแฟมุมตึก', businessType: 'คาเฟ่' },
        ],
        idealCase: {
          subject: 'ส่งต่อ OS Merchant: ร้านขอเปลี่ยนอีเมลเข้าสู่ระบบ POS',
          description:
            'ร้านที่ใช้ Wongnai POS ต้องการเปลี่ยนอีเมลเข้าสู่ระบบเนื่องจากพนักงานเดิมลาออก ส่งฟอร์มให้ลูกค้าแจ้งความประสงค์ จากนั้นทีม OS Merchant ดำเนินการแก้ไขให้ภายใน 1 วัน',
          priority: 'ปานกลาง',
          caseType: 'ส่งต่อทีม OS Merchant (เปลี่ยนอีเมล login)',
          accountId: 'acc1',
        },
      },
    ],
  },
  {
    id: LESSON_IDS.wp5,
    courseId: COURSE_IDS.wongnaiPos,
    order: 5,
    title: 'การตั้งค่าเครื่องครั้งแรกและการเข้าสู่ระบบ',
    slug: 'pos-first-setup-login',
    summary: 'ขั้นตอนเปิดเครื่องครั้งแรก ปุ่ม Power และ 2 วิธีเข้าสู่ระบบ',
    difficulty: 'medium',
    descriptionBlocks: [
      text(
        'เมื่อเปิดโปรแกรม Wongnai POS ครั้งแรก: กดยอมรับ (Agree) > เลือกภาษา (English) > เลือกเมือง (Bangkok) > เลือก Wi-Fi (จำเป็นต้องเลือก)',
      ),
      text(
        'ปุ่ม Power: กดสั้น ๆ = เปิดเครื่อง, กดค้าง 2-3 วินาที = เลือกระหว่างรีสตาร์ทกับปิดเครื่อง, กดค้าง 11 วินาที = ปิดเครื่อง (กรณีจอค้าง)',
      ),
    ],
    tags: ['wp-setup', 'pos-setup'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: LESSON_IDS.wp4,
    xpReward: 120,
    estimatedMinutes: 11,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 5 },
    steps: [
      {
        id: 'wp5-s1',
        order: 1,
        type: 'info',
        prompt: '2 วิธีเข้าสู่ระบบ Wongnai POS',
        bodyBlocks: [
          text(
            'วิธีที่ 1 (ผ่าน WMA) — สำหรับลูกค้าที่เปิดร้านบน LINE MAN และใช้ WMA อยู่แล้ว: เข้าสู่ระบบด้วยเบอร์โทรหรืออีเมลที่ใช้กับ WMA > เลือกร้านที่ต้องการเชื่อมกับ POS > ระบบแจ้งรหัส PIN 4 หลักสำหรับเข้าเครื่อง POS',
          ),
          text(
            'วิธีที่ 2 (Email & Password) — สำหรับลูกค้าที่ยังไม่เปิดร้านบน LINE MAN และไม่ได้ใช้ WMA: เข้าสู่ระบบด้วยอีเมลและรหัสผ่านที่ได้รับจากทีมงาน > เลือกสาขา',
          ),
          text(
            'รหัสผ่าน Owner App เปลี่ยนเองได้ที่เว็บไซต์ owner แต่รหัส PIN 4 หลักไม่สามารถกำหนดเองได้ ระบบจะกำหนดใหม่ให้อัตโนมัติเท่านั้น',
          ),
        ],
      },
      {
        id: 'wp5-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'กรณีจอเครื่อง POS ค้าง ต้องกดปุ่ม Power ค้างไว้กี่วินาทีเพื่อปิดเครื่อง?',
        options: [
          { id: 'a', label: '2-3 วินาที' },
          { id: 'b', label: '5 วินาที' },
          { id: 'c', label: '11 วินาที' },
          { id: 'd', label: '30 วินาที' },
        ],
        correctOptionId: 'c',
        explanation:
          'กดค้าง 2-3 วินาที = เมนูรีสตาร์ท/ปิดเครื่อง, กดค้าง 11 วินาที = ปิดเครื่องแบบบังคับ (กรณีจอค้าง)',
      },
      {
        id: 'wp5-s3',
        order: 3,
        type: 'single-choice',
        prompt: 'ร้านที่ใช้ WMA อยู่แล้ว เข้าสู่ระบบ Wongnai POS ด้วยวิธีใด?',
        options: [
          { id: 'a', label: 'เข้าด้วยเบอร์/อีเมลที่ใช้กับ WMA แล้วเลือกร้าน ระบบจะแจ้ง PIN 4 หลัก' },
          { id: 'b', label: 'เข้าด้วยอีเมลและรหัสผ่านที่ได้รับจากทีมงานเท่านั้น' },
          { id: 'c', label: 'สแกน QR Code จากใบเสร็จ' },
          { id: 'd', label: 'กรอกรหัสร้าน 6 หลักที่ได้จาก Salesforce' },
        ],
        correctOptionId: 'a',
        explanation:
          'ลูกค้าที่มี WMA อยู่แล้วเข้าสู่ระบบด้วยเบอร์/อีเมลเดียวกับ WMA เลือกร้านที่จะเชื่อมกับ POS จากนั้นระบบแจ้งรหัส PIN 4 หลัก',
      },
      {
        id: 'wp5-s4',
        order: 4,
        type: 'phone-call-mock',
        prompt: 'รับสายจากร้านที่ลืมรหัส PIN 4 หลักเข้าเครื่อง POS',
        scenario:
          'พนักงานร้านลืมรหัส PIN 4 หลักที่ใช้เข้าเครื่อง POS อยากตั้งรหัสใหม่เป็นเลขที่จำง่าย ๆ',
        callerLines: [
          'ลืมรหัส PIN เข้าเครื่องเลย ขอตั้งใหม่เป็น 1234 ได้ไหม',
          'จะได้จำง่าย ๆ',
        ],
        modelReplyDescription:
          'คำตอบที่ดีควรอธิบายอย่างสุภาพว่ารหัส PIN 4 หลักไม่สามารถกำหนดเองได้ ระบบจะสร้างให้ใหม่อัตโนมัติเท่านั้น โดยเข้าไปที่เว็บไซต์ owner เพื่อรีเซ็ต แล้วระบบจะส่ง PIN ใหม่ให้ ส่วนรหัสผ่าน Owner App สามารถตั้งเองได้ที่เว็บไซต์ owner',
        sampleReplyKeywords: ['PIN 4 หลัก', 'กำหนดเองไม่ได้', 'อัตโนมัติ', 'เว็บไซต์ owner', 'รีเซ็ต'],
      },
      {
        id: 'wp5-s5',
        order: 5,
        type: 'live-chat-mock',
        prompt: 'ตอบแชทร้านที่เปิดเครื่อง POS ครั้งแรกและไม่รู้ว่าต้องตั้งค่าอะไรบ้าง',
        openingMessages: [
          { id: 'm1', sender: 'customer', text: 'เพิ่งได้เครื่อง POS มา เปิดเครื่องแล้วไม่รู้จะเริ่มตรงไหนเลยค่ะ' },
        ],
        modelReply:
          'ยินดีด้วยกับเครื่องใหม่นะคะ เมื่อเปิดโปรแกรม Wongnai POS ครั้งแรก ให้กดยอมรับเงื่อนไข > เลือกภาษา English > เลือกเมือง Bangkok > เลือก Wi-Fi (จำเป็นต้องเชื่อมต่อ) จากนั้นเข้าสู่ระบบด้วยเบอร์หรืออีเมลที่ใช้กับ WMA แล้วเลือกร้านที่ต้องการเชื่อม ระบบจะแจ้งรหัส PIN 4 หลักให้เข้าเครื่องค่ะ เดี๋ยวแอดมินส่งคู่มือแบบมีรูปให้นะคะ',
        sampleReplyKeywords: ['ยอมรับ', 'ภาษา', 'Wi-Fi', 'WMA', 'PIN 4 หลัก'],
      },
    ],
  },
  {
    id: LESSON_IDS.wp6,
    courseId: COURSE_IDS.wongnaiPos,
    order: 6,
    title: 'ตั้งค่าพื้นฐานและสร้างเมนูบน Wongnai POS',
    slug: 'pos-settings-menu',
    summary: 'ตั้งค่าการชำระเงิน ภาษี พนักงาน เครื่องพิมพ์ และสร้างเมนู',
    difficulty: 'medium',
    descriptionBlocks: [
      text(
        'ตั้งค่าพื้นฐาน: การชำระเงิน (ค่าบริการ/Service Charge — ไม่คิดในบิลเดลิเวอรี, ภาษี/VAT, การปัดเศษ, QR ต้องสมัคร POS Pay ก่อน), รอบการขาย (จำนวนเงินสดเริ่มต้น), พนักงาน (3 ตำแหน่ง, PIN ส่งทางอีเมล), เครื่องพิมพ์ (เครื่องพิมพ์ในตัวนับเป็น 1 เสมอ), รูปแบบใบเสร็จ',
      ),
      text(
        'สร้างเมนู: หมวดหมู่ (เช่น เครื่องดื่ม ก๋วยเตี๋ยว) > กลุ่มตัวเลือก (เช่น ระดับความหวาน ประเภทเส้น) > เมนูอาหาร (ผูกกับหมวดหมู่และกลุ่มตัวเลือก) กำหนดราคาแยกตามช่องทาง (หน้าร้าน / LINE MAN) ได้',
      ),
    ],
    tags: ['wp-menu', 'menu-setup'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: LESSON_IDS.wp5,
    xpReward: 130,
    estimatedMinutes: 13,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 5 },
    steps: [
      {
        id: 'wp6-s1',
        order: 1,
        type: 'info',
        prompt: 'หลักการตั้งค่าและการสร้างโปรโมชันบน POS',
        bodyBlocks: [
          text(
            'ระบบจะไม่คิด Service Charge ในบิลที่เป็นเดลิเวอรี ส่วน VAT ตั้งได้ทั้งแบบบวกเพิ่มจากราคาหรือรวมในราคาแล้ว',
          ),
          text(
            'การชำระเงินแบบ QR: ต้องให้ร้านสมัคร POS Pay ก่อน โดยเข้าที่ตั้งค่า > การชำระเงินแบบ QR แล้วสแกน QR เพื่อสมัคร',
          ),
          text(
            'โปรโมชันบน Wongnai POS สร้างได้ 3 ประเภท: ทั่วไป (เฉพาะบนเครื่อง POS ลดท้ายบิลหรือรายเมนู เป็นบาทหรือ %), LINE MAN เดลิเวอรี (ต้องเปิดหน้าร้านบน LINE MAN), และใช้คะแนนแลก (ต้องมีแพ็กเกจ Wongnai CRM)',
          ),
        ],
      },
      {
        id: 'wp6-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'ลำดับการสร้างเมนูบนเครื่อง Wongnai POS ที่ถูกต้องคือข้อใด?',
        options: [
          { id: 'a', label: 'หมวดหมู่ > กลุ่มตัวเลือก > เมนูอาหาร' },
          { id: 'b', label: 'เมนูอาหาร > หมวดหมู่ > กลุ่มตัวเลือก' },
          { id: 'c', label: 'กลุ่มตัวเลือก > เมนูอาหาร > หมวดหมู่' },
          { id: 'd', label: 'เมนูอาหาร > กลุ่มตัวเลือก > โปรโมชัน' },
        ],
        correctOptionId: 'a',
        explanation:
          'สร้างหมวดหมู่ (เช่น เครื่องดื่ม) ก่อน แล้วสร้างกลุ่มตัวเลือก (เช่น ระดับความหวาน) จากนั้นสร้างเมนูโดยผูกกับหมวดหมู่และกลุ่มตัวเลือกที่สร้างไว้',
      },
      {
        id: 'wp6-s3',
        order: 3,
        type: 'single-choice',
        prompt: 'ก่อนใช้งานการชำระเงินแบบ QR Code บนเครื่อง POS ร้านต้องทำอะไรก่อน?',
        options: [
          { id: 'a', label: 'สมัคร POS Pay โดยสแกน QR ในหน้าตั้งค่า' },
          { id: 'b', label: 'ซื้อเครื่อง EDC เพิ่ม' },
          { id: 'c', label: 'อัปเกรดเป็นแพ็กเกจ Premium' },
          { id: 'd', label: 'ติดต่อธนาคารเพื่อเปิดบัญชีใหม่' },
        ],
        correctOptionId: 'a',
        explanation:
          'ร้านต้องสมัคร POS Pay ก่อน โดยเข้าที่ตั้งค่า > การชำระเงินแบบ QR แล้วสแกน QR เพื่อสมัครใช้งาน',
      },
      {
        id: 'wp6-s4',
        order: 4,
        type: 'multi-choice',
        prompt: 'ข้อใดถูกต้องเกี่ยวกับการตั้งค่าพื้นฐานบน Wongnai POS? (เลือกได้มากกว่า 1 ข้อ)',
        options: [
          { id: 'a', label: 'ระบบไม่คิด Service Charge ในบิลที่เป็นเดลิเวอรี' },
          { id: 'b', label: 'เครื่องพิมพ์ในตัวเครื่องนับเป็น 1 เครื่องเสมอ' },
          { id: 'c', label: 'PIN ของพนักงานจะถูกส่งไปที่อีเมลที่ลงทะเบียนไว้' },
          { id: 'd', label: 'VAT ตั้งค่าได้แบบเดียวเท่านั้น คือบวกเพิ่มจากราคา' },
        ],
        correctOptionIds: ['a', 'b', 'c'],
        explanation:
          'Service Charge ไม่คิดในบิลเดลิเวอรี, เครื่องพิมพ์ในตัวนับเป็น 1, PIN พนักงานส่งทางอีเมล — ส่วน VAT ตั้งได้ทั้งแบบบวกเพิ่มและแบบรวมในราคา',
      },
      {
        id: 'wp6-s5',
        order: 5,
        type: 'free-text',
        prompt:
          'ร้านถามว่า "อยากตั้งราคาเมนูบนหน้าร้านกับบน LINE MAN ให้ต่างกันได้ไหม" จงอธิบาย',
        helperText: 'อธิบายเรื่องราคาแยกตามช่องทางการขาย (Multi-Channel)',
        minLength: 15,
        sampleAnswerKeywords: ['ช่องทางการขาย', 'ราคาแยก', 'หน้าร้าน', 'LINE MAN', 'Multi-Channel'],
        modelAnswer:
          'ได้ค่ะ Wongnai POS รองรับการตั้งราคาแยกตามช่องทางการขาย (Multi-Channel) ร้านสามารถกำหนดราคาเมนูสำหรับหน้าร้าน และราคาสำหรับ LINE MAN ให้ต่างกันได้ เพื่อเผื่อค่า GP หรือค่าใช้จ่ายของแต่ละช่องทาง',
      },
    ],
  },
  {
    id: LESSON_IDS.wp7,
    courseId: COURSE_IDS.wongnaiPos,
    order: 7,
    title: 'การขาย รอบการขาย เดลิเวอรี และ Manager App',
    slug: 'pos-sales-round-manager',
    summary: 'สั่งอาหาร พักบิล ปิดรอบการขาย และใช้ Manager App ต่ออายุแพ็กเกจ',
    difficulty: 'medium',
    descriptionBlocks: [
      text(
        'การขาย: เลือกเมนู > เลือกตัวเลือก > เพิ่ม > ชำระเงิน หากลูกค้ายังไม่จ่ายและเดินไปหยิบของเพิ่ม กด "ส่งค้างไว้" เพื่อพักบิล บิลที่พักจะไปอยู่ในแถบ "ออเดอร์ที่เปิดอยู่"',
      ),
      text(
        'รอบการขาย: กด "พิมพ์ข้อมูลรอบการขายปัจจุบัน" เพื่อดูก่อนปิด, บันทึกเงินเข้า/เงินออก, กดปิดรอบและใส่จำนวนเงินที่นับได้จากลิ้นชัก เลือกเวลาตัดรอบได้กรณีร้านปิดหลัง 24:00 น.',
      ),
    ],
    tags: ['wp-sales', 'pos-sales'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: LESSON_IDS.wp6,
    xpReward: 140,
    estimatedMinutes: 13,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 5 },
    steps: [
      {
        id: 'wp7-s1',
        order: 1,
        type: 'info',
        prompt: 'Wongnai Manager App ทำอะไรได้บ้าง',
        bodyBlocks: [
          text(
            'Manager App เป็นแอปสำหรับเจ้าของร้าน ใช้แก้ไขข้อมูล เพิ่มเมนู/รูป อัปเดตราคาทุกช่องทาง ตรวจสอบยอดขายเรียลไทม์ เช็กเมนูขายดี และเปิด-ปิดเมนูบน LINE MAN เมื่อของหมด โดยไม่ต้องไปที่หน้าเครื่อง POS',
          ),
          text(
            'ต่ออายุแพ็กเกจด้วยตนเองผ่าน Manager App: เลือกสาขา > กดต่ออายุ > ระบบแสดงยอดรวม > กรอกข้อมูลออกใบกำกับภาษี > เลือกชำระ QR PromptPay หรือ LINE Pay กรณีต้องการอัปเกรดแพ็กเกจ/ส่วนเสริม ระบบจะส่งต่อเข้าศูนย์ช่วยเหลือ',
          ),
        ],
      },
      {
        id: 'wp7-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'ลูกค้าสั่งอาหารแล้วเดินไปหยิบของเพิ่มโดยยังไม่ชำระเงิน พนักงานควรทำอย่างไร?',
        options: [
          { id: 'a', label: 'ยกเลิกบิลแล้วเปิดใหม่' },
          { id: 'b', label: 'กด "ส่งค้างไว้" เพื่อพักบิล บิลจะไปอยู่ในแถบ "ออเดอร์ที่เปิดอยู่"' },
          { id: 'c', label: 'ปิดรอบการขายทันที' },
          { id: 'd', label: 'พิมพ์ใบเสร็จเลยโดยไม่ต้องรอชำระ' },
        ],
        correctOptionId: 'b',
        explanation:
          'กด "ส่งค้างไว้" เพื่อพักบิล บิลที่พักจะไปอยู่ในแถบ "ออเดอร์ที่เปิดอยู่" ให้กลับมาเปิดต่อได้',
      },
      {
        id: 'wp7-s3',
        order: 3,
        type: 'single-choice',
        prompt: 'เจ้าของร้านต้องการเปิด-ปิดเมนูบน LINE MAN ตอนของหมด โดยไม่ต้องอยู่หน้าเครื่อง POS ควรใช้อะไร?',
        options: [
          { id: 'a', label: 'Wongnai Manager App' },
          { id: 'b', label: 'Salesforce' },
          { id: 'c', label: 'โทรแจ้ง CS ทุกครั้ง' },
          { id: 'd', label: 'เว็บไซต์ Wongnai ฝั่งลูกค้า' },
        ],
        correctOptionId: 'a',
        explanation:
          'Wongnai Manager App ให้เจ้าของร้านเปิด-ปิดเมนูบน LINE MAN และตรวจสอบยอดขายเรียลไทม์ได้จากมือถือ ไม่ต้องอยู่หน้าเครื่อง POS',
      },
      {
        id: 'wp7-s4',
        order: 4,
        type: 'phone-call-mock',
        prompt: 'รับสายจากร้านที่แพ็กเกจ Software ใกล้หมดอายุและอยากต่อเอง',
        scenario:
          'ร้านได้รับ pop up แจ้งว่าแพ็กเกจ Software ใกล้หมดอายุ อยากต่ออายุเองโดยไม่ต้องรอเซล ถามว่าทำยังไง จ่ายทางไหนได้บ้าง',
        callerLines: [
          'แพ็กเกจใกล้หมดแล้ว อยากต่อเองเลย ไม่อยากรอเซลติดต่อมา',
          'จ่ายเงินยังไงได้บ้าง',
        ],
        modelReplyDescription:
          'คำตอบที่ดีควรแนะนำให้ต่ออายุเองผ่าน Wongnai Manager App: เลือกสาขา > กดต่ออายุ > ระบบแสดงยอดรวมแพ็กเกจ > กรอกข้อมูลออกใบกำกับภาษี > เลือกชำระผ่าน QR PromptPay หรือ LINE Pay และแจ้งว่าหากต้องการอัปเกรดแพ็กเกจหรือซื้อส่วนเสริม ระบบจะส่งต่อเข้าศูนย์ช่วยเหลือให้',
        sampleReplyKeywords: ['Manager App', 'ต่ออายุ', 'QR PromptPay', 'LINE Pay', 'ใบกำกับภาษี'],
      },
      {
        id: 'wp7-s5',
        order: 5,
        type: 'free-text',
        prompt:
          'พนักงานถามว่า "ปิดรอบการขายแต่ละวันต้องทำอะไรบ้าง" จงอธิบายขั้นตอน',
        helperText: 'ระบุการดูยอดก่อนปิด บันทึกเงินเข้า/ออก และการนับเงินในลิ้นชัก',
        minLength: 20,
        sampleAnswerKeywords: ['พิมพ์ข้อมูลรอบ', 'เงินเข้า', 'เงินออก', 'ปิดรอบ', 'นับเงิน'],
        modelAnswer:
          'ก่อนปิดรอบ กด "พิมพ์ข้อมูลรอบการขายปัจจุบัน" เพื่อดูยอดขายของรอบ จากนั้นบันทึกเงินเข้า/เงินออก (ถ้ามี) แล้วกด "ปิดรอบการขาย" พร้อมใส่จำนวนเงินสดที่นับได้จริงทั้งหมดจากลิ้นชัก ระบบจะแสดงส่วนต่างระหว่างยอดที่ควรมีกับยอดที่นับได้ กรณีร้านปิดหลังเที่ยงคืนสามารถเลือกเวลาตัดรอบรายงานได้',
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // COURSE 3 — Wongnai POS IPAD & สินค้าคงคลัง
  // ────────────────────────────────────────────────────────────────────
  {
    id: LESSON_IDS.fs1,
    courseId: COURSE_IDS.foodstoryPos,
    order: 1,
    title: 'Wongnai POS IPAD: ภาพรวมและฟีเจอร์เด่น',
    slug: 'ipad-pos-overview',
    summary: 'ระบบ iOS สำหรับร้านหลายสาขา และฟีเจอร์ที่เหนือกว่า Android',
    difficulty: 'easy',
    descriptionBlocks: [
      text(
        'Wongnai POS IPAD ทำงานบน iOS ผ่านแอป "Wongnai POS IPAD Owner" (ดาวน์โหลดจาก App Store) เหมาะกับร้านที่วางแผนขยายสาขาหรือมีมากกว่า 1 สาขา จดทะเบียนนิติบุคคล หรือมีการคิด Service Charge และ VAT อย่างเป็นระบบ',
      ),
      text(
        'ฟีเจอร์ที่เหนือกว่า Wongnai POS (Android): จัดการสินค้าคงคลังผ่านเว็บไซต์, แก้ไขรูปแบบโต๊ะ, จองโต๊ะ, ฟีเจอร์ครัว, ระบบบุฟเฟต์, Multi-Cashier, แยกบิล/แบ่งจ่าย และเอกสารจัดซื้อ (PR/PO/GR)',
      ),
      text(
        'Hardware มี 1 ประเภทคือ iPad Gen 11 (ราคา 12,900 บาท) ใช้ของร้านเองหรือซื้อกับบริษัทก็ได้ ไม่มีเครื่องพิมพ์ในตัว (ต้องต่อแยก) และไม่มีแพ็กเกจเช่าใช้รายวันสำหรับ Hardware — ต้องซื้อขาด iPad อย่างเดียว',
      ),
    ],
    tags: ['fs-overview', 'pos-fundamentals'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: null,
    xpReward: 100,
    estimatedMinutes: 10,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 5 },
    steps: [
      {
        id: 'fs1-s1',
        order: 1,
        type: 'info',
        prompt: 'Android POS vs iPad POS ต่างกันอย่างไร',
        bodyBlocks: [
          text(
            'Wongnai POS (Android): ราคาเข้าถึงง่าย เหมาะร้านเริ่มต้น 1 สาขา รองรับ Quick & Full Service มีแพ็กเกจเช่าใช้รายวัน',
          ),
          text(
            'Wongnai POS IPAD (iOS): ฟีเจอร์ครบกว่า รองรับ Quick, Full, Buffet Service เหมาะร้านหลายสาขาหรือซับซ้อน (ครัวแยกหลายจุด รับออเดอร์ที่โต๊ะ บุฟเฟต์) ซื้อขาด iPad อย่างเดียว ไม่มีเครื่องพิมพ์ในตัว',
          ),
        ],
      },
      {
        id: 'fs1-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'ข้อใดคือความแตกต่างสำคัญของ Wongnai POS IPAD เทียบกับ Wongnai POS (Android)?',
        options: [
          { id: 'a', label: 'IPAD ไม่มีเครื่องพิมพ์ในตัว และไม่มีแพ็กเกจเช่าใช้รายวันสำหรับ Hardware' },
          { id: 'b', label: 'IPAD ใช้ได้เฉพาะร้าน Quick Service' },
          { id: 'c', label: 'IPAD ไม่รองรับการเชื่อมต่อเดลิเวอรี LINE MAN' },
          { id: 'd', label: 'IPAD ไม่มีระบบสินค้าคงคลัง' },
        ],
        correctOptionId: 'a',
        explanation:
          'iPad POS ไม่มีเครื่องพิมพ์ในตัว (ต้องต่อแยก) และซื้อขาด iPad อย่างเดียว ไม่มี Subscription รายวันสำหรับ Hardware แต่ฟีเจอร์ครบกว่า Android รวมถึงระบบสินค้าคงคลัง',
      },
      {
        id: 'fs1-s3',
        order: 3,
        type: 'multi-choice',
        prompt: 'ฟีเจอร์ใดที่ Wongnai POS IPAD ทำได้แต่ Wongnai POS (Android) ทำไม่ได้? (เลือกได้มากกว่า 1 ข้อ)',
        options: [
          { id: 'a', label: 'จัดการสินค้าคงคลังผ่านเว็บไซต์ และเอกสารจัดซื้อ PR/PO/GR' },
          { id: 'b', label: 'แก้ไขรูปแบบโต๊ะ จองโต๊ะ และฟีเจอร์ครัว' },
          { id: 'c', label: 'ระบบบุฟเฟต์ (จับเวลาต่อโต๊ะ)' },
          { id: 'd', label: 'เชื่อมต่อเดลิเวอรี LINE MAN' },
        ],
        correctOptionIds: ['a', 'b', 'c'],
        explanation:
          'สินค้าคงคลังผ่านเว็บ, แก้ไขผังโต๊ะ/จองโต๊ะ/ครัว, และบุฟเฟต์ เป็นฟีเจอร์ขั้นสูงของ iPad POS ส่วนการเชื่อมเดลิเวอรี LINE MAN ทำได้ทั้งสองระบบ',
      },
      {
        id: 'fs1-s4',
        order: 4,
        type: 'single-choice',
        prompt: 'Hardware ของ Wongnai POS IPAD ในปัจจุบันคือรุ่นใด?',
        options: [
          { id: 'a', label: 'iPad Gen 11' },
          { id: 'b', label: 'iPad Pro 12.9 นิ้ว' },
          { id: 'c', label: 'iPad mini' },
          { id: 'd', label: 'เครื่อง Sunmi V.2' },
        ],
        correctOptionId: 'a',
        explanation:
          'Hardware มี 1 ประเภทคือ iPad Gen 11 (Silver) 128 GB ราคา 12,900 บาท ใช้ของร้านเองหรือซื้อกับบริษัทก็ได้',
      },
      {
        id: 'fs1-s5',
        order: 5,
        type: 'free-text',
        prompt:
          'ร้านที่มี 3 สาขาและวางแผนเปิดเพิ่มถามว่า "ควรใช้ POS ระบบไหนดี ระหว่าง Android กับ iPad" จงแนะนำพร้อมเหตุผล',
        helperText: 'ตอบ 2-3 ประโยค อ้างอิงจำนวนสาขาและความต้องการฟีเจอร์',
        minLength: 20,
        sampleAnswerKeywords: ['iPad', 'หลายสาขา', 'สินค้าคงคลัง', 'จัดการโต๊ะ', 'ขยายสาขา'],
        modelAnswer:
          'แนะนำ Wongnai POS IPAD ค่ะ เพราะเหมาะกับร้านที่มีมากกว่า 1 สาขาหรือวางแผนขยาย รองรับการเชื่อมข้อมูลหลายสาขา ระบบสินค้าคงคลังเต็มรูปแบบ (โอนสินค้าระหว่างสาขา) การจัดการผังโต๊ะและครัว ซึ่ง Wongnai POS (Android) ทำไม่ได้ แม้จะต้องซื้อขาด iPad และต่อเครื่องพิมพ์แยก',
      },
    ],
  },
  {
    id: LESSON_IDS.fs2,
    courseId: COURSE_IDS.foodstoryPos,
    order: 2,
    title: 'Software 9 แพ็กเกจ และ POS IPAD Care',
    slug: 'ipad-pos-software-care',
    summary: 'QSR/FSR/BFR แต่ละระดับ ฟีเจอร์ที่ต่างกัน และบริการเสริม',
    difficulty: 'medium',
    descriptionBlocks: [
      text(
        'Software รองรับ 3 ประเภท 9 แพ็กเกจ: Quick Service (QSR Standard/Pro/Max), Full Service (FSR Standard/Pro/Max), Buffet Service (BFR Standard/Pro/Max)',
      ),
      text(
        'ฟีเจอร์แก้ไขรูปแบบโต๊ะ จองโต๊ะ และครัว รองรับเฉพาะแพ็กเกจ Full & Buffet Service เท่านั้น ส่วนฟีเจอร์บุฟเฟต์ (จับเวลาต่อโต๊ะ สร้างเมนูแพ็กเกจ) รองรับเฉพาะ BFR หากแพ็กเกจไม่มีฟีเจอร์ที่ต้องการ ซื้อเพิ่มหรือเปลี่ยนแพ็กเกจได้ (ส่งเรื่อง Upsell Renew)',
      ),
    ],
    tags: ['fs-software', 'package'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: LESSON_IDS.fs1,
    xpReward: 130,
    estimatedMinutes: 12,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 6 },
    steps: [
      {
        id: 'fs2-s1',
        order: 1,
        type: 'info',
        prompt: 'ฟีเจอร์ตามแพ็กเกจและ POS IPAD Care',
        bodyBlocks: [
          text(
            'ฟังก์ชันพื้นฐาน (ทุกแพ็กเกจ): เชื่อมเดลิเวอรี LINE MAN, สร้างเมนู/โปรโมชัน, รองรับ QR Code, POS Pay, EDC, Mini EDC',
          ),
          text(
            'ฟังก์ชันขั้นสูง: ฟีเจอร์จัดการโต๊ะ จองโต๊ะ ครัว = เฉพาะ Full & Buffet Service; ฟีเจอร์บุฟเฟต์ (จับเวลาต่อโต๊ะ เมนูแบบ A la Carte + บุฟเฟต์) = เฉพาะ BFR',
          ),
          text(
            'บริการเสริม Wongnai POS IPAD Care (3,852 บาท/ปี): สิทธิ์ยืมเครื่อง iPad สำรองระหว่างส่งซ่อม ครอบคลุมเฉพาะ iPad และเครื่องพิมพ์ 1 เครื่องที่ซื้อร่วมกับ iPad ยืมได้ครั้งละไม่เกิน 30 วัน คืนภายใน 7 วันหลังได้เครื่องซ่อมกลับ',
          ),
        ],
      },
      {
        id: 'fs2-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'Wongnai POS IPAD รองรับ Software กี่ประเภท กี่แพ็กเกจ?',
        options: [
          { id: 'a', label: '2 ประเภท 6 แพ็กเกจ' },
          { id: 'b', label: '3 ประเภท 9 แพ็กเกจ' },
          { id: 'c', label: '3 ประเภท 6 แพ็กเกจ' },
          { id: 'd', label: '1 ประเภท 3 แพ็กเกจ' },
        ],
        correctOptionId: 'b',
        explanation:
          'iPad POS รองรับ 3 ประเภท (Quick/Full/Buffet Service) แพ็กเกจละ 3 ระดับ (Standard/Pro/Max) รวม 9 แพ็กเกจ ต่างจาก Android ที่มี 2 ประเภท 6 แพ็กเกจ',
      },
      {
        id: 'fs2-s3',
        order: 3,
        type: 'single-choice',
        prompt: 'ฟีเจอร์บุฟเฟต์ (จับเวลาต่อโต๊ะ) รองรับเฉพาะแพ็กเกจใด?',
        options: [
          { id: 'a', label: 'QSR ทุกระดับ' },
          { id: 'b', label: 'FSR ทุกระดับ' },
          { id: 'c', label: 'BFR (Buffet Service) เท่านั้น' },
          { id: 'd', label: 'ทุกแพ็กเกจใช้ได้' },
        ],
        correctOptionId: 'c',
        explanation:
          'ฟีเจอร์บุฟเฟต์ เช่น จับเวลาต่อโต๊ะ และสร้างเมนูแพ็กเกจ รองรับเฉพาะแพ็กเกจ Buffet Service (BFR)',
      },
      {
        id: 'fs2-s4',
        order: 4,
        type: 'multi-choice',
        prompt: 'ฟีเจอร์ใดใช้ได้เฉพาะแพ็กเกจ Full & Buffet Service? (เลือกได้มากกว่า 1 ข้อ)',
        options: [
          { id: 'a', label: 'ฟีเจอร์แก้ไขรูปแบบโต๊ะ' },
          { id: 'b', label: 'ฟีเจอร์การจองโต๊ะ' },
          { id: 'c', label: 'ฟีเจอร์ครัว (เช็กสถานะออเดอร์)' },
          { id: 'd', label: 'การเชื่อมต่อเดลิเวอรี LINE MAN' },
        ],
        correctOptionIds: ['a', 'b', 'c'],
        explanation:
          'แก้ไขผังโต๊ะ จองโต๊ะ และฟีเจอร์ครัว รองรับเฉพาะ Full & Buffet Service ส่วนการเชื่อมเดลิเวอรีเป็นฟังก์ชันพื้นฐานที่ทุกแพ็กเกจใช้ได้',
      },
      {
        id: 'fs2-s5',
        order: 5,
        type: 'live-chat-mock',
        prompt: 'ตอบแชทร้านบุฟเฟต์ที่ใช้ FSR แต่อยากได้ระบบจับเวลาโต๊ะ',
        openingMessages: [
          { id: 'm1', sender: 'customer', text: 'ร้านเปิดบุฟเฟต์ ใช้แพ็กเกจ FSR Pro อยู่ อยากได้ระบบจับเวลาต่อโต๊ะค่ะ' },
        ],
        modelReply:
          'ขอบคุณที่สอบถามค่ะ ระบบจับเวลาต่อโต๊ะและการสร้างเมนูแบบบุฟเฟต์ รองรับเฉพาะแพ็กเกจ Buffet Service (BFR) เท่านั้น ไม่มีในแพ็กเกจ FSR ค่ะ หากร้านต้องการใช้งาน แนะนำให้เปลี่ยนไปใช้แพ็กเกจ BFR เดี๋ยวแอดมินส่งเรื่องให้ทีม Upsell Renew ติดต่อกลับเพื่อแจ้งรายละเอียดและราคาภายใน 1-3 วันทำการนะคะ',
        sampleReplyKeywords: ['Buffet Service', 'BFR', 'เปลี่ยนแพ็กเกจ', 'Upsell Renew', '1-3 วันทำการ'],
      },
      {
        id: 'fs2-s6',
        order: 6,
        type: 'free-text',
        prompt:
          'ร้านถามว่า "POS IPAD Care ราคาเท่าไร ครอบคลุมอะไรบ้าง ต่างจาก Wongnai Care ของ Android ยังไง" จงอธิบาย',
        helperText: 'ระบุราคา ขอบเขต และเงื่อนไขการยืมเครื่องสำรอง',
        minLength: 20,
        sampleAnswerKeywords: ['3,852 บาท', 'iPad สำรอง', 'เครื่องพิมพ์', '30 วัน', '7 วัน'],
        modelAnswer:
          'Wongnai POS IPAD Care ราคา 3,852 บาท/ปี ให้สิทธิ์ยืมเครื่อง iPad สำรองระหว่างส่งซ่อม ครอบคลุมเฉพาะ iPad และเครื่องพิมพ์ 1 เครื่องที่ซื้อร่วมกับ iPad จากบริษัท ยืมได้ครั้งละไม่เกิน 30 วัน และต้องส่งคืนภายใน 7 วันหลังได้รับเครื่องซ่อมกลับ เงื่อนไขคล้ายกับ Wongnai Care ของ Android แต่ราคาต่างกันเพราะอุปกรณ์ที่ครอบคลุมต่างกัน',
      },
    ],
  },
  {
    id: LESSON_IDS.fs3,
    courseId: COURSE_IDS.foodstoryPos,
    order: 3,
    title: 'ตั้งค่า iPad POS: VAT/Service Charge, POS ID, QR KBank',
    slug: 'ipad-settings-tax-posid',
    summary: 'การคิดภาษีและค่าบริการ ใบกำกับภาษี และเงื่อนไข Dynamic QR KBank',
    difficulty: 'hard',
    descriptionBlocks: [
      text(
        'VAT = ภาษีมูลค่าเพิ่ม (ปกติ 7%) ส่วน Service Charge (SVC) = ค่าบริการที่ร้านเรียกเก็บเพิ่ม (ตั้งกี่ % ก็ได้ ไม่มีข้อบังคับ) ทั้งสองตั้งเป็นแบบ "รวมอยู่ในเมนู" หรือ "บวกเพิ่มจากเมนู" ได้',
      ),
      text(
        'เงื่อนไขการคำนวณ: ระบบคิด SVC ก่อน VAT เสมอ, หากมีส่วนลด SVC และ VAT จะคิดหลังหักส่วนลดแล้ว (ยกเว้นส่วนลดแบบ Voucher), ออเดอร์จากช่องทาง LINE MAN และ Online Order จะไม่ถูกคิด SVC',
      ),
    ],
    tags: ['fs-settings', 'payment'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: LESSON_IDS.fs2,
    xpReward: 150,
    estimatedMinutes: 14,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 6 },
    steps: [
      {
        id: 'fs3-s1',
        order: 1,
        type: 'info',
        prompt: 'POS ID, ใบกำกับภาษี และ Dynamic QR KBank',
        bodyBlocks: [
          text(
            'POS ID คือหมายเลขประจำเครื่องที่ได้จากกรมสรรพากร ใช้สำหรับออกใบกำกับภาษีให้ถูกต้องตามกฎหมาย เมื่อใส่ข้อมูลใบกำกับภาษีครบ หัวใบเสร็จจะเปลี่ยนเป็น "Receipt/TAX Invoice (ABB)" มีค่าเทียบเท่าใบกำกับภาษีอย่างย่อ',
          ),
          text(
            'หมายเลข POS ID และเลข Invoice จะถูกบันทึกเฉพาะบนเครื่อง iPad ที่ตั้งค่าไว้เท่านั้น หากใช้ iPad เครื่องอื่น login แม้เป็นร้านและสาขาเดียวกัน จะไม่แสดง POS ID และเลข Invoice',
          ),
          text(
            'Dynamic QR KBank: ร้านได้รับเงินเป็นยอดเดียวเวลา 23:00 น. ของทุกวัน โดยไม่หักค่าบริการ (นับออเดอร์ตั้งแต่ 23:01 น. ของวันก่อนหน้า ถึง 22:59 น.) กรณี Void บิลที่จ่ายด้วย QR KBank ต้องกด void ก่อน 23:00 น. เงินจะคืนเข้าบัญชีอัตโนมัติ แต่ void รายรายการ (void item) เงินไม่คืนอัตโนมัติ ร้านต้องโอนคืนลูกค้าเอง',
          ),
        ],
      },
      {
        id: 'fs3-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'ระบบ Wongnai POS IPAD คิด Service Charge (SVC) และ VAT ตามลำดับใด?',
        options: [
          { id: 'a', label: 'คิด VAT ก่อน แล้วจึงคิด SVC' },
          { id: 'b', label: 'คิด SVC ก่อน VAT เสมอ' },
          { id: 'c', label: 'คิดพร้อมกันจากราคาเดียวกัน' },
          { id: 'd', label: 'ขึ้นอยู่กับการตั้งค่าของร้าน' },
        ],
        correctOptionId: 'b',
        explanation:
          'ระบบคิด SVC ก่อน VAT เสมอ และถ้ามีส่วนลด SVC/VAT จะคิดหลังหักส่วนลดแล้ว (ยกเว้นส่วนลดแบบ Voucher)',
      },
      {
        id: 'fs3-s3',
        order: 3,
        type: 'single-choice',
        prompt: 'ออเดอร์จากช่องทางใดที่ "ไม่ถูกคิด" Service Charge?',
        options: [
          { id: 'a', label: 'ออเดอร์หน้าร้าน (Dine-in)' },
          { id: 'b', label: 'ออเดอร์กลับบ้าน (Takeaway)' },
          { id: 'c', label: 'ออเดอร์จาก LINE MAN และ Online Order' },
          { id: 'd', label: 'ทุกออเดอร์ถูกคิด SVC เหมือนกัน' },
        ],
        correctOptionId: 'c',
        explanation:
          'ออเดอร์ที่รับจากช่องทาง LINE MAN และ Online Order จะไม่ถูกคิด Service Charge',
      },
      {
        id: 'fs3-s4',
        order: 4,
        type: 'multi-choice',
        prompt: 'ข้อใดถูกต้องเกี่ยวกับ POS ID และเลข Invoice? (เลือกได้มากกว่า 1 ข้อ)',
        options: [
          { id: 'a', label: 'POS ID เป็นหมายเลขประจำเครื่องที่ได้จากกรมสรรพากร' },
          { id: 'b', label: 'POS ID และเลข Invoice บันทึกเฉพาะบน iPad เครื่องที่ตั้งค่าไว้' },
          { id: 'c', label: 'เมื่อใส่ข้อมูลใบกำกับครบ หัวใบเสร็จจะเป็น Receipt/TAX Invoice (ABB)' },
          { id: 'd', label: 'iPad ทุกเครื่องในร้านจะแสดง POS ID เดียวกันอัตโนมัติ' },
        ],
        correctOptionIds: ['a', 'b', 'c'],
        explanation:
          'POS ID มาจากกรมสรรพากร บันทึกเฉพาะเครื่องที่ตั้งค่า และทำให้ใบเสร็จมีค่าเทียบเท่าใบกำกับภาษีอย่างย่อ — iPad เครื่องอื่นจะไม่แสดง POS ID แม้เป็นสาขาเดียวกัน',
      },
      {
        id: 'fs3-s5',
        order: 5,
        type: 'salesforce-mock-timed',
        prompt: 'ร้านสอบถามวิธีสมัคร Dynamic QR API และเครื่อง EDC ของธนาคารกสิกร จงบันทึกเคส',
        scenario:
          'ร้าน iPad POS ต้องการสมัครใช้ Dynamic QR KBank และเครื่อง EDC ถามว่าต้องทำอย่างไร CS ส่งข้อมูลลิงก์สมัครผ่านเว็บธนาคารกสิกรและบันทึกเป็นเคสให้ทีมที่เกี่ยวข้องติดตาม',
        timeLimitSeconds: 150,
        priorityOptions: ['ต่ำ', 'ปานกลาง', 'สูง', 'เร่งด่วน'],
        caseTypeOptions: [
          'สอบถามการใช้งาน POS / การชำระเงิน',
          'ส่งต่อทีม MDS Lead (ลูกค้าใหม่ซื้อเครื่อง)',
          'ส่งต่อทีม Upsell Renew (ซื้ออุปกรณ์เพิ่ม)',
          'ปัญหาการรับออเดอร์',
        ],
        mockAccounts: [
          { id: 'acc1', merchantName: 'ครัวคุณแม่ (2 สาขา)', businessType: 'ร้านอาหารตามสั่ง' },
          { id: 'acc2', merchantName: 'ชานมไข่มุกหวานน้อย', businessType: 'ร้านเครื่องดื่ม' },
        ],
        idealCase: {
          subject: 'สอบถามการชำระเงิน: สมัคร Dynamic QR KBank และเครื่อง EDC',
          description:
            'ร้านสอบถามวิธีสมัคร Dynamic QR API และเครื่อง EDC ของธนาคารกสิกร CS ส่งลิงก์สมัครผ่านเว็บกสิกร (เลือก POS Partner: Wongnai POS IPAD) บันทึกเป็นเคสสอบถามการใช้งาน/การชำระเงิน สำหรับเครื่อง EDC เพิ่มเติมส่งต่อ Upsell Renew',
          priority: 'ปานกลาง',
          caseType: 'สอบถามการใช้งาน POS / การชำระเงิน',
          accountId: 'acc1',
        },
      },
      {
        id: 'fs3-s6',
        order: 6,
        type: 'live-chat-mock',
        prompt: 'ตอบแชทร้านที่ Void บิล QR KBank แล้วเงินไม่คืนลูกค้า',
        openingMessages: [
          { id: 'm1', sender: 'customer', text: 'ลูกค้าจ่าย QR กสิกรมา ร้าน void รายการอาหารออก 1 จาน แต่เงินไม่คืนเข้าบัญชีลูกค้าเลย' },
        ],
        modelReply:
          'ขอโทษในความไม่สะดวกนะคะ กรณี void ทั้งบิลที่จ่ายด้วย QR KBank และกดก่อน 23:00 น. ระบบจะคืนเงินเข้าบัญชีลูกค้าอัตโนมัติ แต่ถ้าเป็นการ void รายรายการ (void item) ระบบจะไม่คืนเงินอัตโนมัติค่ะ ทางร้านต้องโอนเงินคืนให้ลูกค้าเองตามยอดรายการที่ยกเลิก แนะนำให้ตรวจสอบยอดและโอนคืนลูกค้าโดยตรงนะคะ',
        sampleReplyKeywords: ['void item', 'ไม่คืนอัตโนมัติ', 'โอนคืน', '23:00', 'ตรวจสอบ'],
      },
    ],
  },
  {
    id: LESSON_IDS.fs4,
    courseId: COURSE_IDS.foodstoryPos,
    order: 4,
    title: 'สร้างเมนูและโปรโมชันบน iPad POS',
    slug: 'ipad-menu-promotions',
    summary: 'โครงสร้างเมนู 4 ชั้น และโปรโมชันหน้าร้าน 5 รูปแบบ',
    difficulty: 'medium',
    descriptionBlocks: [
      text(
        'องค์ประกอบการสร้างเมนูบน iPad POS มี 4 ชั้น: กลุ่มเมนู (เช่น อาหารเรียกน้ำย่อย อาหารหลัก) > หมวดหมู่ (เช่น เครื่องดื่ม ก๋วยเตี๋ยว) > กลุ่มตัวเลือก (เช่น ระดับความหวาน) > เมนูอาหาร (ผูกกับหมวดหมู่และกลุ่มตัวเลือก)',
      ),
      text(
        'สร้างเมนูได้ 3 ทาง: บนแอป Wongnai POS IPAD Owner (หรือบนเครื่อง iPad), บนเว็บไซต์ owner, หรือบนแอป Wongnai POS IPAD Manager ตัวเลือกสามารถผูกกับสินค้าคงคลังได้',
      ),
    ],
    tags: ['fs-menu', 'menu-setup'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: LESSON_IDS.fs3,
    xpReward: 130,
    estimatedMinutes: 12,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 5 },
    steps: [
      {
        id: 'fs4-s1',
        order: 1,
        type: 'info',
        prompt: 'โปรโมชันหน้าร้าน 5 รูปแบบ',
        bodyBlocks: [
          text(
            'โปรโมชันบน iPad POS สร้างได้ 3 ประเภท: หน้าร้าน, ออนไลน์ (LINE MAN เดลิเวอรี), ใช้คะแนนแลก (Wongnai CRM)',
          ),
          text(
            'โปรโมชันหน้าร้าน 5 รูปแบบ: (1) ลดราคาสินค้า (ไม่มีเงื่อนไข) (2) ลดราคา/รับฟรี เมื่อซื้อถึงจำนวนขั้นต่ำ (3) ลดราคา/รับฟรี เมื่อซื้อถึงยอดขั้นต่ำ (4) ลดท้ายบิล เมื่อซื้อถึงจำนวนขั้นต่ำ (5) ลดท้ายบิล เมื่อซื้อถึงยอดขั้นต่ำ — ขั้นสูงกว่า Wongnai POS (Android) ที่ทำได้แค่ลดท้ายบิลและรายเมนู',
          ),
          text(
            'หมายเหตุ: โปรโมชันที่เป็นของแถมหรือส่วนลดแบบมีเงื่อนไข ต้องคีย์ตัวของแถม/สินค้าที่ต้องการลดเข้าไปในบิลด้วย ไม่งั้นระบบจะถือว่าไม่เข้าเงื่อนไข',
          ),
        ],
      },
      {
        id: 'fs4-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'โครงสร้างการสร้างเมนูบน Wongnai POS IPAD มีกี่ชั้น อะไรบ้าง (เรียงจากบนลงล่าง)?',
        options: [
          { id: 'a', label: 'หมวดหมู่ > เมนูอาหาร' },
          { id: 'b', label: 'กลุ่มเมนู > หมวดหมู่ > กลุ่มตัวเลือก > เมนูอาหาร' },
          { id: 'c', label: 'เมนูอาหาร > กลุ่มตัวเลือก' },
          { id: 'd', label: 'กลุ่มตัวเลือก > หมวดหมู่ > เมนูอาหาร' },
        ],
        correctOptionId: 'b',
        explanation:
          'iPad POS มี 4 ชั้น: กลุ่มเมนู > หมวดหมู่ > กลุ่มตัวเลือก > เมนูอาหาร (ต่างจาก Android ที่มี 3 ชั้น ไม่มี "กลุ่มเมนู")',
      },
      {
        id: 'fs4-s3',
        order: 3,
        type: 'single-choice',
        prompt: 'โปรโมชันหน้าร้านบน iPad POS ต่างจาก Wongnai POS (Android) อย่างไร?',
        options: [
          { id: 'a', label: 'iPad POS ทำได้แค่ลดท้ายบิลอย่างเดียว' },
          { id: 'b', label: 'iPad POS มี 5 รูปแบบ รวมถึงลด/รับฟรีเมื่อซื้อครบจำนวนหรือยอดขั้นต่ำ' },
          { id: 'c', label: 'iPad POS สร้างโปรโมชันไม่ได้' },
          { id: 'd', label: 'ไม่ต่างกันเลย' },
        ],
        correctOptionId: 'b',
        explanation:
          'iPad POS มีโปรโมชันหน้าร้าน 5 รูปแบบ ขั้นสูงกว่า Android ที่ทำได้แค่ลดท้ายบิลและรายเมนู',
      },
      {
        id: 'fs4-s4',
        order: 4,
        type: 'multi-choice',
        prompt: 'สร้างเมนูบน Wongnai POS IPAD ได้ผ่านช่องทางใดบ้าง? (เลือกได้มากกว่า 1 ข้อ)',
        options: [
          { id: 'a', label: 'แอป Wongnai POS IPAD Owner (บนเครื่อง iPad)' },
          { id: 'b', label: 'เว็บไซต์ owner' },
          { id: 'c', label: 'แอป Wongnai POS IPAD Manager' },
          { id: 'd', label: 'แอป LINE MAN ฝั่งลูกค้า' },
        ],
        correctOptionIds: ['a', 'b', 'c'],
        explanation:
          'สร้างเมนูได้ 3 ทาง: Owner App, เว็บไซต์ owner และ Manager App — ไม่สามารถสร้างผ่านแอป LINE MAN ฝั่งลูกค้า',
      },
      {
        id: 'fs4-s5',
        order: 5,
        type: 'live-chat-mock',
        prompt: 'ตอบแชทร้านที่สร้างโปรโมชัน "ซื้อ 2 แถม 1" แล้วระบบไม่ลดให้',
        openingMessages: [
          { id: 'm1', sender: 'customer', text: 'ตั้งโปรซื้อ 2 แถม 1 ไว้แล้ว แต่ตอนคีย์บิลระบบไม่ลดให้เลยค่ะ' },
        ],
        modelReply:
          'ขอบคุณที่แจ้งนะคะ สำหรับโปรโมชันที่เป็นของแถมหรือส่วนลดแบบมีเงื่อนไข พนักงานต้องคีย์ตัวของแถม (เมนูแถม) เข้าไปในบิลด้วยตอนสั่ง ระบบถึงจะตรวจว่าเข้าเงื่อนไขและกดใช้โปรโมชันได้ค่ะ ถ้าคีย์แค่ 2 จานที่ซื้อโดยไม่ใส่จานแถม ระบบจะถือว่ายังไม่เข้าเงื่อนไข เดี๋ยวแอดมินส่งขั้นตอนแบบมีรูปให้นะคะ',
        sampleReplyKeywords: ['ของแถม', 'คีย์', 'เงื่อนไข', 'บิล', 'ขั้นตอน'],
      },
    ],
  },
  {
    id: LESSON_IDS.fs5,
    courseId: COURSE_IDS.foodstoryPos,
    order: 5,
    title: 'จัดการโต๊ะและออเดอร์บน iPad POS',
    slug: 'ipad-tables-orders',
    summary: 'เปิด/ย้าย/รวมโต๊ะ และความต่างของ Split Amount / Bill / Pay',
    difficulty: 'hard',
    descriptionBlocks: [
      text(
        'ฟังก์ชันจัดการโต๊ะ: เปิดโต๊ะ, ยกเลิกโต๊ะ (ยกเลิกได้เมื่อไม่มีรายการอาหารในโต๊ะแล้ว), ย้ายโต๊ะ, ย้ายเมนู, รวมโต๊ะ (เมนูที่สั่งจะรวมเป็นบิลเดียว) สร้าง Zone และตกแต่งผังโต๊ะให้เสมือนจริงได้',
      ),
      text(
        'กรณีโต๊ะขึ้นสถานะ null ให้กด "ตรวจสอบบิล" ที่โต๊ะนั้นแล้ว refresh แอป กรณีคีย์บิลผิดรอบต้องการย้ายบิลไปรอบอื่น ทำได้เองผ่านเว็บไซต์ owner ย้อนหลังได้ไม่เกิน 45 วัน',
      ),
    ],
    tags: ['fs-tables', 'table-mgmt'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: LESSON_IDS.fs4,
    xpReward: 150,
    estimatedMinutes: 14,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 6 },
    steps: [
      {
        id: 'fs5-s1',
        order: 1,
        type: 'info',
        prompt: 'Split Amount vs Split Bill vs Split Pay',
        bodyBlocks: [
          text(
            'Split Amount (แบ่งจ่าย): ลูกค้าโต๊ะเดียวกันต้องการชำระมากกว่า 1 ช่องทางในบิลเดียว (แบ่งได้จนยอดเป็น 0 เงินสดต้องเป็นตัวสุดท้ายเสมอ ใช้ QR KBank หรือ EDC แบ่งจ่ายไม่ได้)',
          ),
          text(
            'Split Bill (แยกบิล): แยกบิลจ่ายตามรายการอาหาร ระบบใส่เลขกำกับลำดับแต่ละบิล ปิดบิลใดก่อนก็ได้',
          ),
          text(
            'Split Pay (แยกบิลจ่ายก่อน): คล้ายแยกบิล แต่หลังแยกแล้วโต๊ะยังไม่ปิด สั่งออเดอร์เพิ่มได้ และมุมซ้ายล่างจะไม่มีเลขลำดับบิลกำกับ',
          ),
          text(
            'เชื่อมเดลิเวอรี LINE MAN บน iPad POS: ห้ามตั้งชื่อหมวดหมู่ เมนู และตัวเลือกซ้ำกันเด็ดขาด หลังเชื่อมแล้วต้องแก้เมนูผ่านระบบ Wongnai POS IPAD เท่านั้น (แก้ผ่าน WMA ไม่ได้อีก)',
          ),
        ],
      },
      {
        id: 'fs5-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'ลูกค้าโต๊ะเดียวกัน 4 คน ต้องการหารบิลจ่ายคนละส่วนตามรายการที่ตัวเองสั่ง ควรใช้ฟังก์ชันใด?',
        options: [
          { id: 'a', label: 'Split Amount (แบ่งจ่าย)' },
          { id: 'b', label: 'Split Bill (แยกบิล)' },
          { id: 'c', label: 'รวมโต๊ะ' },
          { id: 'd', label: 'ย้ายเมนู' },
        ],
        correctOptionId: 'b',
        explanation:
          'Split Bill แยกบิลจ่ายตามรายการอาหาร ระบบใส่เลขกำกับแต่ละบิล ส่วน Split Amount ใช้เมื่อต้องการจ่ายหลายช่องทางในบิลเดียว',
      },
      {
        id: 'fs5-s3',
        order: 3,
        type: 'single-choice',
        prompt: 'Split Pay (แยกบิลจ่ายก่อน) ต่างจาก Split Bill อย่างไร?',
        options: [
          { id: 'a', label: 'หลังแยกบิลแล้วโต๊ะยังไม่ปิด สามารถสั่งออเดอร์เพิ่มได้' },
          { id: 'b', label: 'ใช้กับ QR KBank เท่านั้น' },
          { id: 'c', label: 'แยกได้สูงสุด 2 บิล' },
          { id: 'd', label: 'ต้องปิดโต๊ะทันทีหลังแยก' },
        ],
        correctOptionId: 'a',
        explanation:
          'Split Pay ทำงานคล้าย Split Bill แต่หลังแยกแล้วโต๊ะยังเปิดอยู่ สั่งเพิ่มได้ และไม่มีเลขลำดับบิลกำกับที่มุมซ้ายล่าง',
      },
      {
        id: 'fs5-s4',
        order: 4,
        type: 'multi-choice',
        prompt: 'ข้อใดถูกต้องเกี่ยวกับการเชื่อมเดลิเวอรี LINE MAN บน iPad POS? (เลือกได้มากกว่า 1 ข้อ)',
        options: [
          { id: 'a', label: 'ห้ามตั้งชื่อหมวดหมู่ เมนู และตัวเลือกซ้ำกัน' },
          { id: 'b', label: 'หลังเชื่อมแล้วต้องแก้เมนูผ่านระบบ Wongnai POS IPAD เท่านั้น' },
          { id: 'c', label: 'ต้องสมัคร GP และสร้างช่องทาง LINE MAN ใน Web Owner ก่อน' },
          { id: 'd', label: 'หลังเชื่อมแล้วยังแก้เมนูผ่าน WMA ได้ตามปกติ' },
        ],
        correctOptionIds: ['a', 'b', 'c'],
        explanation:
          'ห้ามชื่อซ้ำ, หลังเชื่อมต้องแก้ผ่านระบบ iPad POS เท่านั้น, และต้องสมัคร GP + สร้างช่องทาง LINE MAN ก่อน — แก้ผ่าน WMA ไม่ได้อีก',
      },
      {
        id: 'fs5-s5',
        order: 5,
        type: 'phone-call-mock',
        prompt: 'รับสายจากร้านที่โต๊ะขึ้นสถานะ null และกดอะไรไม่ได้',
        scenario:
          'พนักงานร้านแจ้งว่าโต๊ะที่ 5 ขึ้นสถานะ null บนหน้าจอ กดสั่งอาหารหรือปิดบิลไม่ได้เลย ช่วงร้านกำลังยุ่ง',
        callerLines: [
          'โต๊ะ 5 ขึ้น null กดอะไรไม่ได้เลย ลูกค้ารออยู่',
          'ต้องทำยังไงดี',
        ],
        modelReplyDescription:
          'คำตอบที่ดีควรแสดงความเข้าใจในความเร่งด่วน แนะนำขั้นตอนแก้ไข: ให้กดปุ่ม "ตรวจสอบบิล" ที่โต๊ะที่ขึ้น null แล้ว refresh แอป สถานะโต๊ะจะกลับมาปกติ และถ้ายังไม่หายให้ลองปิดแล้วเปิดแอปใหม่ พร้อมรับปากติดตามหากยังมีปัญหา',
        sampleReplyKeywords: ['ตรวจสอบบิล', 'refresh', 'null', 'ปิดเปิดแอป', 'เข้าใจ'],
      },
      {
        id: 'fs5-s6',
        order: 6,
        type: 'free-text',
        prompt:
          'ร้านคีย์บิลผิดรอบการขาย ต้องการย้ายบิลไปรอบที่ถูกต้อง จงอธิบายว่าทำได้อย่างไร',
        helperText: 'ระบุช่องทาง เงื่อนไขวัน และข้อจำกัด',
        minLength: 20,
        sampleAnswerKeywords: ['เว็บไซต์ owner', 'ย้ายบิล', 'รอบการขาย', '45 วัน', 'ปิดรอบแล้ว'],
        modelAnswer:
          'ร้านสามารถย้ายบิลไปรอบการขายอื่นได้เองผ่านเว็บไซต์ owner โดยเข้าที่ จัดการข้อมูล > รอบการขาย > ย้ายบิลในรอบการขาย เลือกบิลที่ต้องการย้าย เลือกรอบปลายทาง (ต้องเป็นรอบที่ปิดแล้วและย้อนหลังไม่เกิน 45 วัน) ระบุเหตุผล แล้วกดยืนยัน ตรวจสอบประวัติการย้ายได้ที่หน้าเดียวกัน',
      },
    ],
  },
  {
    id: LESSON_IDS.fs6,
    courseId: COURSE_IDS.foodstoryPos,
    order: 6,
    title: 'Multi-Cashier, พนักงาน และ Manager App',
    slug: 'ipad-multicashier-staff-manager',
    summary: 'โหมด Multi-Cashier 2 แบบ การสร้างบัญชีพนักงาน และ Manager App',
    difficulty: 'medium',
    descriptionBlocks: [
      text(
        'Multi-Cashier ช่วยให้ร้านใช้หลายจุดชำระเงินพร้อมกัน โดยยอดขายทั้งหมดรวมอยู่ในถาดเก็บเงินเดียวกัน มี 2 โหมด: แบบธรรมดา (พนักงานรับเงินหลายคน) และแบบแยกกะ',
      ),
      text(
        'บัญชีพนักงาน: สร้างระดับ Employee ได้บนแอป Wongnai POS IPAD ส่วนระดับ Manager ต้องสร้างบนเว็บไซต์ Owner หน้าติดต่อฝ่ายบริการลูกค้า: QR ที่เข้า chat ไม่มีวันหมดอายุ แต่ QR ที่เข้า call จะหมดอายุใน 10 นาที',
      ),
    ],
    tags: ['fs-cashier', 'pos-sales'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: LESSON_IDS.fs5,
    xpReward: 140,
    estimatedMinutes: 12,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 5 },
    steps: [
      {
        id: 'fs6-s1',
        order: 1,
        type: 'info',
        prompt: 'Multi-Cashier แบบธรรมดา vs แบบแยกกะ',
        bodyBlocks: [
          text(
            'แบบธรรมดา (พนักงานรับเงินหลายคน): ร้านเปิดใช้งานเองได้ในแอป Owner หน้าตั้งค่า > ถาดเก็บเงิน ระบบบันทึกชื่อพนักงานตาม PIN ที่ล็อกอิน เปิดรอบต้องใส่เงินเปิดรอบ ปิดรอบกรอกแค่ยอดเงินสด',
          ),
          text(
            'แบบแยกกะ: CS เป็นคนเปิดใช้งานให้ผ่าน Web Internal Tool แสดงยอดตามกะ เปิดรอบไม่ต้องใส่เงินเปิดรอบ ปิดรอบต้องปิดกะย่อยก่อนจึงปิดรอบใหญ่ได้ และต้องกรอกยอดเงินสด ยอดเครดิต และยอด custom payment',
          ),
          text(
            'ข้อควรระวัง: ถ้าใช้เครื่อง POS ชำระเงินมากกว่า 1 เครื่อง อาจทำให้ใบเสร็จไม่มีข้อมูลใบกำกับภาษีหรือ INV NO. ควรตั้งค่าข้อมูลใบกำกับภาษีของแต่ละเครื่องให้ต่างกันตามที่จดทะเบียน',
          ),
        ],
      },
      {
        id: 'fs6-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'โหมด Multi-Cashier แบบใดที่ "CS" ต้องเป็นคนเปิดใช้งานให้ผ่าน Web Internal Tool?',
        options: [
          { id: 'a', label: 'แบบธรรมดา (พนักงานรับเงินหลายคน)' },
          { id: 'b', label: 'แบบแยกกะ' },
          { id: 'c', label: 'ทั้งสองแบบ CS ต้องเปิดให้' },
          { id: 'd', label: 'ไม่มีแบบไหนที่ CS ต้องเปิดให้' },
        ],
        correctOptionId: 'b',
        explanation:
          'โหมดแบบแยกกะ CS เป็นคนเปิด flag ให้ผ่าน Web Internal Tool ส่วนแบบธรรมดา ร้านเปิดเองได้ในแอป Owner หน้าตั้งค่า > ถาดเก็บเงิน',
      },
      {
        id: 'fs6-s3',
        order: 3,
        type: 'single-choice',
        prompt: 'การสร้างบัญชีพนักงานระดับ "Manager" ทำได้ที่ใด?',
        options: [
          { id: 'a', label: 'บนแอป Wongnai POS IPAD (เครื่อง iPad)' },
          { id: 'b', label: 'บนเว็บไซต์ Owner เท่านั้น' },
          { id: 'c', label: 'บน Wongnai Merchant App' },
          { id: 'd', label: 'โทรแจ้ง CS ให้สร้างให้' },
        ],
        correctOptionId: 'b',
        explanation:
          'บนแอป iPad สร้างได้เฉพาะระดับ Employee ส่วนระดับ Manager ต้องสร้างบนเว็บไซต์ Wongnai POS IPAD Owner',
      },
      {
        id: 'fs6-s4',
        order: 4,
        type: 'multi-choice',
        prompt: 'ข้อใดถูกต้องเกี่ยวกับ Multi-Cashier และหน้าติดต่อฝ่ายบริการลูกค้าบน iPad POS? (เลือกได้มากกว่า 1 ข้อ)',
        options: [
          { id: 'a', label: 'ยอดขายจากทุกจุดชำระเงินรวมอยู่ในถาดเก็บเงินเดียวกัน' },
          { id: 'b', label: 'โหมดแยกกะต้องปิดกะย่อยก่อนจึงจะปิดรอบใหญ่ได้' },
          { id: 'c', label: 'QR ที่เข้า call จะหมดอายุใน 10 นาที ส่วน QR ที่เข้า chat ไม่มีวันหมดอายุ' },
          { id: 'd', label: 'โหมดธรรมดาต้องให้ CS เปิดให้เท่านั้น' },
        ],
        correctOptionIds: ['a', 'b', 'c'],
        explanation:
          'ยอดรวมถาดเดียว, แยกกะปิดกะก่อนปิดรอบ, QR call หมดอายุ 10 นาที — ส่วนโหมดธรรมดาร้านเปิดเองได้ในแอป Owner',
      },
      {
        id: 'fs6-s5',
        order: 5,
        type: 'salesforce-mock-timed',
        prompt: 'ร้านหลายสาขาต้องการเปิดใช้ Multi-Cashier แบบแยกกะ จงบันทึกและดำเนินการเคส',
        scenario:
          'ร้านชาบู 2 สาขา มีพนักงานเก็บเงินหลายคนต่อกะ ต้องการเปิดโหมด Multi-Cashier แบบแยกกะ เพื่อดูยอดแยกตามกะ CS ต้องเปิด flag ให้ผ่าน Web Internal Tool',
        timeLimitSeconds: 140,
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
    ],
  },
  {
    id: LESSON_IDS.fs7,
    courseId: COURSE_IDS.foodstoryPos,
    order: 7,
    title: 'สินค้าคงคลัง (Inventory): สูตร BOM และเอกสารจัดซื้อ',
    slug: 'inventory-bom-purchase-docs',
    summary: 'หน่วยและการแปลงหน่วย สูตร BOM และเอกสาร PR/PO/GR, TR/TO',
    difficulty: 'hard',
    descriptionBlocks: [
      text(
        'สินค้าคงคลัง (Inventory) คือการสร้างวัตถุดิบแล้วนำไปผูกกับเมนูตามปริมาตรที่ร้านกำหนด เมื่อเมนูมีการขาย ระบบจะตัดสต๊อกและใช้คิดต้นทุนต่อเมนู',
      ),
      text(
        'หน่วยหลักเลือกจากที่ระบบมีให้เท่านั้น และแก้ไขไม่ได้หลังตั้งค่า (ต้องสร้างใหม่/ทำซ้ำ) หน่วยรีสต๊อกใช้ปรับจำนวนเท่านั้น ผูกกับเมนูไม่ได้ หน่วยพิเศษ (กิโลกรัม↔กรัม, ลิตร↔มิลลิลิตร) แปลงหน่วยได้เองโดยไม่ต้องตั้งค่า เมื่อสต๊อกต่ำกว่า Safety stock ระบบส่งอีเมลแจ้งเตือน',
      ),
    ],
    tags: ['fs-inventory', 'inventory'],
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: LESSON_IDS.fs6,
    xpReward: 170,
    estimatedMinutes: 16,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    quizConfig: { questionCount: 6 },
    steps: [
      {
        id: 'fs7-s1',
        order: 1,
        type: 'info',
        prompt: 'สูตร BOM และเอกสารจัดซื้อ 5 ตัว',
        bodyBlocks: [
          text(
            'สูตร BOM (Bill Of Materials) = การนำสินค้าคงคลังที่มีอยู่มารวมกันเป็นสินค้าคงคลังตัวใหม่ที่ร้านทำขึ้นเอง เช่น สูตรน้ำจิ้ม สูตรเครื่องปรุง ปรับจำนวนสต๊อกโดยตรงไม่ได้ ต้องใช้ "เพิ่มวัตถุดิบรวดเร็ว" เท่านั้น ราคาต่อหน่วยคิดตามต้นทุนของวัตถุดิบที่ผูกในสูตร',
          ),
          text(
            'เอกสารจัดซื้อ 5 ตัว: PR (ใบร้องขอสินค้า) > PO (ใบสั่งซื้อสินค้า) > GR (ใบรับสินค้า) สำหรับการซื้อเข้าคลัง; TR (ใบร้องขอการโอน) > TO (ใบสั่งโอนสินค้า) > GR สำหรับการโอนระหว่างสาขา',
          ),
          text(
            'การโอนสินค้าระหว่างสาขา: ทำได้เมื่อร้านมี ≥ 2 สาขา และสินค้าต้องมี "รหัสสินค้า" และ "หน่วยหลัก" ตรงกัน (ชื่อสินค้าไม่จำเป็นต้องตรง) การทำใบ GR เมื่อเสร็จแล้วจะยกเลิก ลบ หรือแก้ไขไม่ได้',
          ),
        ],
      },
      {
        id: 'fs7-s2',
        order: 2,
        type: 'single-choice',
        prompt: 'ลำดับเอกสารสำหรับการ "ซื้อสินค้าเข้าคลัง" ที่ถูกต้องคือข้อใด?',
        options: [
          { id: 'a', label: 'PR > PO > GR' },
          { id: 'b', label: 'GR > PO > PR' },
          { id: 'c', label: 'TR > TO > GR' },
          { id: 'd', label: 'PO > GR > PR' },
        ],
        correctOptionId: 'a',
        explanation:
          'การซื้อเข้าคลัง: PR (ใบร้องขอ) > PO (ใบสั่งซื้อ) > GR (ใบรับสินค้า) — ส่วน TR > TO > GR ใช้สำหรับการโอนระหว่างสาขา (PO ทำโดยมี PR หรือไม่ก็ได้)',
      },
      {
        id: 'fs7-s3',
        order: 3,
        type: 'single-choice',
        prompt: 'ข้อใดถูกต้องเกี่ยวกับ "หน่วยหลัก" ของสินค้าคงคลัง?',
        options: [
          { id: 'a', label: 'สร้างหน่วยขึ้นเองได้ และแก้ไขภายหลังได้ตลอด' },
          { id: 'b', label: 'เลือกจากที่ระบบมีให้เท่านั้น และแก้ไขไม่ได้หลังตั้งค่า' },
          { id: 'c', label: 'ใช้ปรับจำนวนสต๊อกเท่านั้น ผูกกับเมนูไม่ได้' },
          { id: 'd', label: 'ต้องเป็นกิโลกรัมเสมอ' },
        ],
        correctOptionId: 'b',
        explanation:
          'หน่วยหลักเลือกจากที่ระบบมีให้เท่านั้น และเมื่อตั้งแล้วแก้ไขไม่ได้ ต้องสร้างสินค้าใหม่/ทำซ้ำ ส่วนหน่วยที่ใช้ปรับจำนวนอย่างเดียวคือ "หน่วยรีสต๊อก"',
      },
      {
        id: 'fs7-s4',
        order: 4,
        type: 'multi-choice',
        prompt: 'เงื่อนไขการโอนสินค้าระหว่างสาขามีอะไรบ้าง? (เลือกได้มากกว่า 1 ข้อ)',
        options: [
          { id: 'a', label: 'ร้านต้องมีสาขาตั้งแต่ 2 สาขาขึ้นไป' },
          { id: 'b', label: 'สินค้าต้องมีรหัสสินค้าและหน่วยหลักตรงกัน' },
          { id: 'c', label: 'ชื่อสินค้าไม่จำเป็นต้องตรงกัน' },
          { id: 'd', label: 'ต้องโอนผ่านผู้จัดจำหน่าย (Supplier) เท่านั้น' },
        ],
        correctOptionIds: ['a', 'b', 'c'],
        explanation:
          'ต้องมี ≥ 2 สาขา, รหัสสินค้า + หน่วยหลักตรงกัน, ชื่อไม่ต้องตรง — การโอนเป็นระหว่างสาขา ไม่ใช่ระหว่างร้านกับผู้จัดจำหน่าย',
      },
      {
        id: 'fs7-s5',
        order: 5,
        type: 'free-text',
        prompt:
          'ร้านถามว่า "สูตร BOM คืออะไร ใช้ตอนไหน" จงอธิบายพร้อมยกตัวอย่าง',
        helperText: 'อธิบายว่า BOM รวมวัตถุดิบเป็นสินค้าใหม่ และการคิดต้นทุน',
        minLength: 20,
        sampleAnswerKeywords: ['BOM', 'รวมวัตถุดิบ', 'สินค้าใหม่', 'ต้นทุน', 'น้ำจิ้ม'],
        modelAnswer:
          'สูตร BOM (Bill Of Materials) คือการนำสินค้าคงคลังหลายตัวมารวมกันเป็นสินค้าคงคลังตัวใหม่ที่ร้านทำขึ้นเอง เช่น สูตรน้ำจิ้มแจ่วที่ประกอบด้วยพริกป่น น้ำปลา มะนาว ข้าวคั่ว เมื่อผูกสูตรแล้ว ราคาต่อหน่วยของ BOM จะคิดตามต้นทุนวัตถุดิบที่ผูกไว้ และเมื่อเติมสต๊อก BOM วัตถุดิบที่เป็นส่วนผสมจะถูกตัดตามอัตราส่วนที่ตั้งไว้',
      },
      {
        id: 'fs7-s6',
        order: 6,
        type: 'salesforce-mock-timed',
        prompt: 'ร้านสอบถามเชิงลึกเรื่องการตั้งค่าสินค้าคงคลังและ BOM ที่ CS POS ตอบไม่ได้ จงบันทึกเคส',
        scenario:
          'ร้านอาหาร 3 สาขา ใช้ระบบสินค้าคงคลังและต้องการตั้งสูตร BOM ที่ซับซ้อน (แปลง 4 หน่วย คิดต้นทุนแยกสาขา) CS POS ตอบเชิงลึกไม่ได้ ต้องส่งต่อทีมที่ดูแลระบบสินค้าคงคลัง',
        timeLimitSeconds: 150,
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
    ],
  },
];
