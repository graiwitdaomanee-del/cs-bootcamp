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
  // POS / merchant domain
  'mds lead': ['ทีม mds lead', 'mds', 'ทีมขาย', '48 ชั่วโมง', '48 ชม'],
  'upsell renew': ['ทีม upsell renew', 'upsell', 'อัปเซล', '1-3 วันทำการ'],
  'os merchant': ['ทีม os merchant', 'os', '1 วันทำการ', '1 วัน'],
  'แพ็กเกจ': ['package', 'แพ็คเกจ', 'เเพ็กเกจ', 'เปลี่ยนแพ็กเกจ', 'อัปเกรด'],
  'fsr': ['full service', 'ฟูลเซอร์วิส', 'แพ็กเกจ fsr'],
  'bfr': ['buffet service', 'บุฟเฟต์', 'บุฟเฟ่ต์', 'แพ็กเกจ bfr'],
  'จัดการโต๊ะ': ['ฟีเจอร์โต๊ะ', 'ผังโต๊ะ', 'แก้ไขรูปแบบโต๊ะ', 'รูปแบบโต๊ะ'],
  'flex': ['รุ่น flex', 'เครื่อง flex'],
  'แบตเตอรี่': ['แบต', 'battery', 'มีแบตในตัว', 'ชาร์จ'],
  'ซิมการ์ด': ['ซิม', 'sim', 'sim card', '4g'],
  'เครื่องสำรอง': ['เครื่องยืม', 'ยืมเครื่อง', 'เครื่องทดแทน'],
  'care': ['wongnai care', 'บริการเสริม', 'ประกันเครื่อง', 'pos ipad care'],
  'pin 4 หลัก': ['รหัส pin', 'pin', 'รหัสเข้าเครื่อง', 'pin สี่หลัก'],
  'เว็บไซต์ owner': ['owner', 'เว็บ owner', 'owner site', 'หน้าเว็บ owner'],
  'wi-fi': ['wifi', 'ไวไฟ', 'เชื่อมเน็ต', 'เชื่อมต่ออินเทอร์เน็ต'],
  'pos pay': ['สมัคร pos pay', 'qr pos'],
  'qr kbank': ['qr กสิกร', 'dynamic qr', 'qr ธนาคาร'],
  'qr promptpay': ['พร้อมเพย์', 'promptpay', 'qr พร้อมเพย์'],
  'line pay': ['ไลน์เพย์', 'linepay'],
  'void': ['ทำลายบิล', 'ยกเลิกบิล', 'void bill'],
  'void item': ['void รายการ', 'ทำลายรายเมนู', 'ยกเลิกรายการ'],
  'ใบกำกับภาษี': ['tax invoice', 'ใบกำกับ', 'full tax', 'ใบเสร็จภาษี'],
  'pos id': ['หมายเลขประจำเครื่อง', 'รหัสเครื่อง pos'],
  'service charge': ['svc', 'ค่าบริการ', 'เซอร์วิสชาร์จ'],
  'vat': ['ภาษีมูลค่าเพิ่ม', 'ภาษี 7%', 'แวต'],
  'สินค้าคงคลัง': ['inventory', 'สต๊อก', 'สต็อก', 'คลังสินค้า', 'วัตถุดิบคงคลัง'],
  'หน่วยหลัก': ['unit หลัก', 'หน่วยหลักของสินค้า'],
  'pr': ['ใบร้องขอสินค้า', 'purchase request', 'ใบ pr'],
  'po': ['ใบสั่งซื้อสินค้า', 'purchase order', 'ใบ po'],
  'gr': ['ใบรับสินค้า', 'goods receive', 'ใบ gr'],
  'โอนสินค้า': ['transfer', 'tr', 'to', 'โอนระหว่างสาขา', 'ใบโอนสินค้า'],
  'แยกบิล': ['split bill', 'split pay', 'split amount', 'แบ่งจ่าย', 'หารบิล'],
  'ตรวจสอบบิล': ['refresh บิล', 'รีเฟรชโต๊ะ', 'กดตรวจสอบบิล'],
  'ย้ายบิล': ['ย้ายรอบบิล', 'ย้ายบิลผิดรอบ', 'ย้ายรอบการขาย'],
  'ปิดรอบ': ['ปิดรอบการขาย', 'ปิดกะ', 'close shift', 'z report', 'รายงาน z'],
  'ต่ออายุ': ['ต่ออายุแพ็กเกจ', 'renew', 'ต่อแพ็กเกจ'],
  'manager app': ['แมเนเจอร์แอป', 'wongnai manager', 'pos manager'],
  'auto accept': ['รับออเดอร์อัตโนมัติ', 'รับออโต้', 'auto'],
  '5 นาที': ['ภายใน 5 นาที', 'กดรับใน 5 นาที'],
  'switch flow': ['สวิตช์โฟลว์', 'รับก่อนคนขับ'],
  'เคลม': ['claim', 'ขอชดเชย', 'ขอเคลม', 'เคลมค่าอาหาร'],
  'ลงทะเบียน': ['สมัครร้าน', 'register', 'ลงทะเบียนร้าน', 'เปิดร้าน'],
  'เปิดเดลิเวอรี': ['เปิดใช้บริการเดลิเวอรี', 'เปิดรับออเดอร์'],
  'otp': ['รหัส otp', 'รหัสยืนยัน', 'รหัส 6 หลัก'],
  'ช่องทางการขาย': ['multi-channel', 'มัลติแชนแนล', 'ราคาแยกช่องทาง', 'ราคาแยก'],
  'ของแถม': ['สินค้าแถม', 'เมนูแถม', 'ฟรี'],
};

interface Category {
  match: string[];
  label: string;
  probe: string;
  /** A natural CS sentence that embeds this category's keywords — shown as a demo-walkthrough hint. */
  example: string;
}

const CATEGORIES: Category[] = [
  {
    match: ['เข้าใจ', 'ขอโทษ', 'เห็นใจ', 'ขออภัย', 'เสียใจ', 'น้ำเสียง'],
    label: 'การเปิดด้วยความเข้าใจต่อความรู้สึกของร้านค้า',
    probe:
      'ตอนนี้ร้านค้ากำลังรู้สึกยังไง แล้วประโยคแรกของคุณรับความรู้สึกนั้นก่อนจะเข้าเรื่องข้อมูลไหม?',
    example: 'เข้าใจเลยค่ะว่าเรื่องนี้ทำให้กังวล ต้องขอโทษในความไม่สะดวกที่เกิดขึ้นด้วยนะคะ',
  },
  {
    match: ['mds lead', 'upsell renew', 'os merchant', 'ส่งต่อ', 'ส่งเรื่อง', 'ทีม', 'บันทึกเคส', 'เปิดเคส', 'escalate', '48 ชั่วโมง', '48 ชม', '1-3 วันทำการ'],
    label: 'การส่งเรื่องให้ทีมที่ถูกต้องพร้อม SLA',
    probe:
      'เรื่องนี้จบที่ CS ได้เอง หรือต้องส่งต่อทีมไหน — ลูกค้าใหม่ซื้อเครื่อง (MDS Lead 48 ชม.), ซื้อฟีเจอร์/อุปกรณ์เพิ่ม (Upsell Renew 1-3 วัน), หรือเปลี่ยนอีเมล (OS Merchant 1 วัน)?',
    example: 'เดี๋ยวบันทึกเป็นเคสและส่งต่อให้ทีม Upsell Renew ติดต่อกลับภายใน 1-3 วันทำการนะคะ',
  },
  {
    match: ['care', 'wongnai care', 'เครื่องสำรอง', 'ยืมเครื่อง', 'ส่งซ่อม', 'ประกัน', '1,500 บาท', '3,852 บาท', '30 วัน'],
    label: 'บริการเสริม Care และเงื่อนไขการยืมเครื่องสำรอง',
    probe:
      'ถ้าเครื่องเสียระหว่างใช้งาน ร้านมีบริการ Care ไหม — Wongnai Care 1,500 บาท/ปี (Android) หรือ POS IPAD Care 3,852 บาท/ปี ยืมเครื่องสำรองได้ครั้งละไม่เกิน 30 วัน?',
    example: 'ร้านสามารถซื้อ Wongnai Care 1,500 บาท/ปี เพื่อยืมเครื่องสำรองไปใช้ระหว่างส่งซ่อมได้ค่ะ',
  },
  {
    match: ['แพ็กเกจ', 'qsr', 'fsr', 'bfr', 'full service', 'buffet', 'standard', 'premium', 'plus', 'basic', 'pro', 'max', 'จัดการโต๊ะ'],
    label: 'ความแตกต่างของแพ็กเกจ Software และฟีเจอร์ตามแพ็กเกจ',
    probe:
      'ฟีเจอร์ที่ร้านอยากได้อยู่ในแพ็กเกจปัจจุบันไหม? เช่น ฟีเจอร์จัดการโต๊ะรองรับเฉพาะ Full Service ขึ้นไป และฟีเจอร์บุฟเฟต์เฉพาะ BFR',
    example: 'ฟีเจอร์จัดการโต๊ะรองรับเฉพาะแพ็กเกจ Full Service ค่ะ ถ้าต้องการใช้งานต้องเปลี่ยนแพ็กเกจ',
  },
  {
    match: ['lite', 'flex', 'single', 'dual', 'mini', 'ipad', 'gen 11', 'แบตเตอรี่', 'แบต', 'ซิมการ์ด', 'ซิม', 'เครื่องพิมพ์', 'sunmi', 'hardware'],
    label: 'การเลือกรุ่น Hardware ให้ตรงกับการใช้งานของร้าน',
    probe:
      'ร้านต้องการเครื่องแบบไหน — พกพา (Flex รุ่นเดียวที่มีแบต), มีเครื่องพิมพ์ในตัว (Single/Dual), หรือ 2 หน้าจอให้ลูกค้าสแกน QR (Dual)?',
    example: 'รุ่น Flex เป็นรุ่นเดียวที่มีแบตเตอรี่ในตัว ใช้ต่อเนื่องได้ 6 ชั่วโมง และใส่ซิมการ์ดได้ เหมาะกับการพกพาค่ะ',
  },
  {
    match: ['สินค้าคงคลัง', 'inventory', 'วัตถุดิบ', 'สูตร', 'bom', 'หน่วยหลัก', 'หน่วยรีสต๊อก', 'ตัดสต๊อก', 'ตัดวัตถุดิบ', 'safety stock', 'ต้นทุน', 'pr', 'po', 'gr', 'โอนสินค้า', 'น้ำจิ้ม'],
    label: 'ระบบสินค้าคงคลัง สูตร BOM และเอกสารจัดซื้อ',
    probe:
      'เรื่องนี้เกี่ยวกับการตั้งค่าหน่วย/สูตร BOM หรือการทำเอกสาร (ซื้อเข้า: PR → PO → GR / โอนระหว่างสาขา: TR → TO → GR)? และจำไว้ว่าหน่วยหลักแก้ไม่ได้หลังตั้งค่า',
    example: 'สูตร BOM คือการรวมวัตถุดิบหลายตัวเป็นสินค้าใหม่ เช่น สูตรน้ำจิ้ม เมื่อขายระบบจะตัดต้นทุนตามอัตราส่วนที่ผูกไว้',
  },
  {
    match: ['โต๊ะ', 'โซน', 'ย้ายโต๊ะ', 'รวมโต๊ะ', 'แยกบิล', 'split bill', 'split pay', 'split amount', 'แบ่งจ่าย', 'จองโต๊ะ', 'ครัว', 'ย้ายบิล', 'null', 'ตรวจสอบบิล'],
    label: 'การจัดการโต๊ะและการแยก/แบ่งบิล',
    probe:
      'ลูกค้าต้องการแบบไหน — จ่ายหลายช่องทางในบิลเดียว (Split Amount), แยกจ่ายตามรายการโดยปิดโต๊ะ (Split Bill), หรือแยกแล้วโต๊ะยังเปิดสั่งเพิ่มได้ (Split Pay)?',
    example: 'ถ้าลูกค้าหารกันตามรายการที่สั่ง ให้ใช้ Split Bill (แยกบิล) ระบบจะใส่เลขกำกับแต่ละบิลให้ค่ะ',
  },
  {
    match: ['vat', 'service charge', 'svc', 'pos id', 'ใบกำกับภาษี', 'ปัดเศษ', 'qr kbank', 'qr promptpay', 'line pay', 'pos pay', 'void', 'void item', '23:00', 'invoice'],
    label: 'การตั้งค่าการชำระเงิน ภาษี และใบกำกับภาษี',
    probe:
      'เรื่องนี้เกี่ยวกับ VAT/Service Charge (ระบบคิด SVC ก่อน VAT เสมอ, LINE MAN ไม่คิด SVC), POS ID สำหรับใบกำกับภาษี, หรือเงื่อนไข Dynamic QR KBank (จ่ายก่อน 23:00 น. เงินคืนอัตโนมัติ)?',
    example: 'กรณี void ทั้งบิลที่จ่ายด้วย QR KBank ก่อน 23:00 น. ระบบจะคืนเงินอัตโนมัติ แต่ void รายรายการร้านต้องโอนคืนลูกค้าเอง',
  },
  {
    match: ['pin 4 หลัก', 'pin', 'wi-fi', 'wifi', 'เว็บไซต์ owner', 'owner', 'รีเซ็ต', 'ยอมรับ', 'ภาษา', 'เข้าสู่ระบบ', 'login', 'power', 'จอค้าง', 'เปิดเครื่อง', 'รีสตาร์ท'],
    label: 'การเปิดเครื่องครั้งแรกและการเข้าสู่ระบบ',
    probe:
      'เรื่องนี้เกี่ยวกับขั้นตอนเปิดเครื่องครั้งแรก (Agree → English → Bangkok → Wi-Fi) หรือการเข้าสู่ระบบ (ผ่าน WMA ได้ PIN 4 หลัก / รหัส PIN กำหนดเองไม่ได้ รีเซ็ตที่เว็บไซต์ owner)?',
    example: 'รหัส PIN 4 หลักกำหนดเองไม่ได้ค่ะ ระบบสร้างให้ใหม่อัตโนมัติเท่านั้น รีเซ็ตได้ที่เว็บไซต์ owner',
  },
  {
    match: ['manager app', 'ต่ออายุ', 'เรียลไทม์', 'รายงาน', 'ปิดรอบ', 'รอบการขาย', 'นับเงิน', 'เงินเข้า', 'เงินออก', 'z report', 'กะ', 'multi-cashier', 'ถาดเก็บเงิน'],
    label: 'Manager App รอบการขาย และ Multi-Cashier',
    probe:
      'เรื่องนี้ทำผ่าน Manager App ได้ไหม (ต่ออายุแพ็กเกจ / เปิด-ปิดเมนู / ดูยอดเรียลไทม์)? หรือเป็นเรื่องปิดรอบการขาย (พิมพ์ข้อมูลรอบ → บันทึกเงินเข้า/ออก → นับเงิน → ปิดรอบ)?',
    example: 'เจ้าของร้านต่ออายุแพ็กเกจเองได้ผ่าน Manager App เลือกสาขา > กดต่ออายุ > ชำระ QR PromptPay หรือ LINE Pay',
  },
  {
    match: ['gp', '32.1%', '30%', 'vat', 'ยอดโอน', 'payout', '500 บาท', 'cash collection', 'e-payment', 'การเงิน', 'ค่าบริการ', 'ค่า gp'],
    label: 'การคิดค่า GP และการโอนเงินให้ร้าน',
    probe:
      'ยอดที่ร้านสงสัยตรงกับค่า GP 32.1% ของยอดขาย (30% + VAT 7%) ไหม? และร้านได้รับเงินวันถัดไปเมื่อยอดสะสมหลังหัก GP ครบ 500 บาท',
    example: 'ยอดที่หักคือค่าบริการ GP 32.1% ของยอดขายค่ะ ดูรายละเอียดได้ที่ WMA > การเงิน',
  },
  {
    match: ['เคลม', 'claim', 'หลักฐาน', 'รูปถ่าย', 'รูปภาพ', 'บรรจุภัณฑ์', 'auto claim', 'cancel_timeout', '24 ชั่วโมง', '3 วันทำการ'],
    label: 'เงื่อนไขและขั้นตอนการเคลมค่าอาหาร/สินค้า',
    probe:
      'เคสนี้เข้าเงื่อนไขเคลมไหม (สาเหตุยกเลิกมาจากลูกค้าหรือคนขับ + ร้านทำอาหารเสร็จ)? ส่งฟอร์มภายใน 24 ชม. + รูปอาหารในบรรจุภัณฑ์ ทราบผลใน 3 วันทำการ',
    example: 'ให้ร้านส่งฟอร์มขอเคลมในออเดอร์ภายใน 24 ชั่วโมง พร้อมรูปอาหารในบรรจุภัณฑ์ ทราบผลภายใน 3 วันทำการค่ะ',
  },
  {
    match: ['รับออเดอร์', '5 นาที', 'auto accept', 'ยกเลิก', 'ของหมด', 'switch flow', 'deferred flow', 'สั่งใหม่', 'ช่วงพีค', '60 นาที', '30 ครั้ง'],
    label: 'การรับ/ยกเลิกออเดอร์และ Delivery Flow',
    probe:
      'เรื่องนี้เกี่ยวกับกรอบเวลารับออเดอร์ (5 นาที ไม่งั้น cancel_timeout), การยกเลิกเอง (60 นาที / 30 ครั้งต่อสัปดาห์), หรือรูปแบบ Flow (Normal / Switch / Deferred)?',
    example: 'ออเดอร์ที่ถูกยกเลิกจากการกดรับไม่ทัน (cancel_timeout) ดึงกลับมาไม่ได้ ต้องให้ลูกค้าสั่งใหม่ค่ะ',
  },
  {
    match: ['ลงทะเบียน', 'สมัคร', 'เปิดเดลิเวอรี', 'otp', 'เอกสาร', 'ยืนยันตัวตน', '3 วันทำการ', 'สัญญา'],
    label: 'การลงทะเบียนร้าน เปิดเดลิเวอรี และสมัคร GP',
    probe:
      'ขั้นตอนไหนที่ร้านติดอยู่ — ลงทะเบียน (รอตรวจสอบ 3 วันทำการก่อน Login), เปิดเดลิเวอรี, หรือสมัคร GP (ต้องมีเมนูก่อน อนุมัติ ~3 วัน)?',
    example: 'หลังลงทะเบียนร้าน ทีมต้องตรวจสอบ 3 วันทำการก่อนจึงจะ Login เข้าระบบได้ค่ะ',
  },
  {
    match: ['หมวดหมู่', 'กลุ่มตัวเลือก', 'เมนู', 'กลุ่มเมนู', 'ช่องทางการขาย', 'multi-channel', 'ราคาแยก', 'ของแถม', 'โปรโมชัน'],
    label: 'โครงสร้างการสร้างเมนูและโปรโมชัน',
    probe:
      'เรื่องนี้เกี่ยวกับลำดับการสร้างเมนู (หมวดหมู่ → กลุ่มตัวเลือก → เมนู; iPad มี "กลุ่มเมนู" เพิ่ม), การตั้งราคาแยกช่องทาง, หรือเงื่อนไขโปรโมชัน (ของแถมต้องคีย์เข้าบิล)?',
    example: 'สร้างหมวดหมู่ก่อน แล้วสร้างกลุ่มตัวเลือก จากนั้นสร้างเมนูโดยผูกกับหมวดหมู่และกลุ่มตัวเลือก และตั้งราคาแยกช่องทางได้',
  },
  {
    match: ['ระยะเวลา', 'กรอบเวลา', 'sla', 'เมื่อไหร่', 'ภายใน', 'กำหนดเวลา', '7 วัน', '45 วัน'],
    label: 'การบอกกรอบเวลา/SLA ที่ชัดเจน',
    probe: 'ถ้าคุณเป็นร้านค้า คุณอยากรู้ "ภายในเมื่อไหร่" แค่ไหน — คำตอบตอนนี้ระบุกรอบเวลาหรือ SLA ให้ร้านหรือยัง?',
    example: 'ปกติเรื่องนี้ใช้เวลาไม่เกินตาม SLA เดี๋ยวแจ้งกรอบเวลาที่ชัดเจนให้ทางร้านนะคะ',
  },
  {
    match: ['ตรวจสอบ', 'เช็ก', 'ตรวจดู', 'พิจารณา', 'ประเมิน'],
    label: 'การตรวจสอบข้อมูลก่อนสรุปหรือให้คำตอบ',
    probe: 'ก่อนจะสรุปหรือให้คำตอบ คุณต้องเช็กข้อมูลอะไรบ้าง (เช่น ใน Salesforce หรือหน้า WMA) และจะบอกร้านไหมว่ากำลังตรวจสอบอยู่?',
    example: 'ขอตรวจสอบข้อมูลร้านและสถานะในระบบก่อนนะคะ แล้วจะแจ้งผลกลับให้ทราบ',
  },
  {
    match: ['ติดตาม', 'อัปเดต', 'อัพเดท', 'แจ้งผล', 'แจ้งกลับ', 'ความคืบหน้า', 'ติดต่อกลับ'],
    label: 'การรับปากว่าจะติดตามและแจ้งผลกลับ',
    probe: 'หลังจบบทสนทนานี้ ใครเป็นคนตามเรื่องต่อ และร้านจะได้รู้ผลตอนไหน ผ่านช่องทางไหน?',
    example: 'เดี๋ยวแอดมินติดตามเรื่องนี้ให้ แล้วจะแจ้งผลกลับไปทางเบอร์/อีเมลที่ลงทะเบียนไว้',
  },
];

const FALLBACK_CATEGORY: Category = {
  label: 'อีกประเด็นสำคัญที่คำตอบที่ดีมักครอบคลุม',
  match: [],
  probe:
    'ลองนึกถึงสิ่งที่อีกฝ่ายต้องเจอ "หลังจาก" บทสนทนานี้จบ มีขั้นตอนไหนที่คำตอบยังไม่ได้พูดถึงไหม?',
  example: 'เดี๋ยวตรวจสอบให้ก่อนนะคะ แล้วจะแจ้งผลและติดตามเรื่องต่อให้จนจบ',
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

/**
 * Up to two natural CS sentences a demo presenter can type to make the tutor respond well.
 * For keyword steps: one example per distinct key-point category. For choice / info steps:
 * a single generic prompt matching that coaching mode.
 */
export function demoExamples(step: LessonStep): string[] {
  const keyPoints = extractKeyPoints(step);
  if (keyPoints.length > 0) {
    const out: string[] = [];
    const seen = new Set<string>();
    for (const kp of keyPoints) {
      const cat = categoryOf(kp.term);
      if (seen.has(cat.label)) continue;
      seen.add(cat.label);
      out.push(cat.example);
      if (out.length === 2) break;
    }
    return out;
  }
  switch (coachModeFor(step)) {
    case 'reasoning':
      return ['อธิบายว่าจะเลือกข้อไหนเพราะอะไร แล้วลองตัดข้อที่ไม่ตอบโจทย์หลักออกทีละข้อ'];
    case 'takeaway':
      return ['สรุปสิ่งที่ได้จากบทนี้เป็นประโยคเดียว แล้วบอกว่าจะเอาไปใช้กับงานจริงยังไง'];
    default:
      return [];
  }
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
