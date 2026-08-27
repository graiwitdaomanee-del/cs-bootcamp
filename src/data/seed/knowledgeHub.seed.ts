import type { KnowledgeHubEntry } from '../../types/knowledgeHub';
import { LESSON_IDS } from './lessons.seed';

export const seedKnowledgeHubEntries: KnowledgeHubEntry[] = [
  // บทเรียนที่ 1 — ปฐมนิเทศ / น้ำเสียงและความเข้าใจลูกค้า
  {
    id: 'kh-tone-guide',
    title: 'คู่มือน้ำเสียง (Tone Guide)',
    body:
      'เริ่มด้วยการแสดงความเข้าใจ ตามด้วยข้อมูล แล้วจึงบอกขั้นตอนถัดไป หลีกเลี่ยงคำเด็ดขาดอย่าง "ไม่ได้เลย" หรือ "เป็นไปไม่ได้" — เสนอสิ่งที่ทำได้แทน',
    tags: ['tone', 'empathy', 'basics', 'communication'],
    unlockedByLessonId: LESSON_IDS.welcome,
  },
  {
    id: 'kh-dos-donts',
    title: 'ควรทำ / ไม่ควรทำ',
    body:
      'ควรทำ: ปรับน้ำเสียงให้สอดคล้องกับความเร่งด่วนของร้านค้า ควรทำ: ขอโทษในประสบการณ์ที่เกิดขึ้นแม้ไม่ใช่ความผิดของเรา ไม่ควรทำ: ใช้ชื่อทีมภายในหรือรหัสระบบ ไม่ควรทำ: สัญญาระยะเวลาที่ยืนยันไม่ได้',
    tags: ['tone', 'etiquette', 'basics'],
    unlockedByLessonId: LESSON_IDS.welcome,
  },
  {
    id: 'kh-phrase-bank',
    title: 'คลังประโยคแสดงความเข้าใจ',
    body:
      '"เข้าใจเลยค่ะ/ครับว่าเรื่องนี้น่าหงุดหงิดแค่ไหน" / "ขอบคุณที่รอนะคะ/ครับ ระหว่างที่เรากำลังตรวจสอบ" / "มาช่วยกันแก้ไขเรื่องนี้ไปด้วยกันนะคะ/ครับ" / "แอดมินจะติดตามเรื่องนี้ให้ด้วยตัวเองค่ะ/ครับ"',
    tags: ['tone', 'phrases', 'empathy'],
    unlockedByLessonId: LESSON_IDS.welcome,
  },
  {
    id: 'kh-company-overview',
    title: 'ภาพรวมบริษัท',
    body:
      'LMWN เชื่อมสองฝั่งเข้าด้วยกัน คือ LINE MAN (การสั่ง/จัดส่งสำหรับลูกค้า) และ Wongnai (การค้นหาร้าน + เครื่องมือสำหรับร้านค้า เช่น POS ระบบคิว โปรไฟล์ร้าน โฆษณา) ทีมซัพพอร์ตอยู่ตรงจุดเชื่อมของทั้งสองฝั่งนี้',
    tags: ['company', 'overview', 'basics'],
    unlockedByLessonId: LESSON_IDS.welcome,
  },
  // บทเรียนที่ 2 — เคสร้องเรียนออเดอร์
  {
    id: 'kh-order-lifecycle',
    title: 'วงจรสถานะออเดอร์',
    body:
      'รับออเดอร์ → ร้านค้ากดรับ → กำลังเตรียม → จ่ายงานไรเดอร์ → ไรเดอร์รับของ → ส่งสำเร็จ ปัญหาที่ร้องเรียนมักเกิดจากจุดใดจุดหนึ่งในห่วงโซ่นี้ขาดตอน — ต้องหาให้เจอก่อนตอบกลับ',
    tags: ['orders', 'lifecycle', 'delivery'],
    unlockedByLessonId: LESSON_IDS.orderComplaint,
  },
  {
    id: 'kh-busy-mode',
    title: 'อธิบายโหมด "ร้านยุ่ง" (Busy Mode)',
    body:
      'ในช่วงที่มีออเดอร์เข้ามาจำนวนมาก ร้านค้าหรือระบบสามารถเปิดโหมด "ร้านยุ่ง" ซึ่งจะชะลอการรับออเดอร์ใหม่และขยายเวลาประเมินการเตรียมอาหาร เพื่อรักษาคุณภาพ นี่เป็นสาเหตุความล่าช้าที่เกิดขึ้นได้ปกติ — ควรอธิบายให้เข้าใจ ไม่ใช่ขอโทษราวกับเป็นความผิดพลาดของระบบ',
    tags: ['orders', 'delivery', 'late-delivery'],
    unlockedByLessonId: LESSON_IDS.orderComplaint,
  },
  {
    id: 'kh-sla-reference',
    title: 'ระยะเวลาให้บริการมาตรฐาน (SLA)',
    body:
      'รับทราบเคสร้องเรียนทั่วไป: ภายใน 1 ชั่วโมง ตรวจสอบของขาด/ออเดอร์ผิด: ภายใน 24 ชั่วโมง ข้อพิพาทที่เกี่ยวข้องกับยอดโอนเงิน: สูงสุด 3 วันทำการ เนื่องจากต้องตรวจสอบด้านการเงิน',
    tags: ['orders', 'sla', 'timelines'],
    unlockedByLessonId: LESSON_IDS.orderComplaint,
  },
  {
    id: 'kh-escalation-matrix',
    title: 'เกณฑ์การส่งต่อเคส (Escalation Matrix)',
    body:
      'ควรส่งต่อให้เจ้าหน้าที่ระดับสูงเมื่อ: ร้านค้าเดียวกันร้องเรียน 3 ครั้งขึ้นไปใน 7 วัน ยอดคืนเงินเกินเกณฑ์มาตรฐาน หรือร้านค้าขอคุยกับหัวหน้างานโดยตรง',
    tags: ['orders', 'escalation'],
    unlockedByLessonId: LESSON_IDS.orderComplaint,
  },
  // บทเรียนที่ 3 — ตอบ Live Chat กับร้านค้า
  {
    id: 'kh-chat-response-time',
    title: 'ความเร็วในการตอบแชท',
    body:
      'ตอบให้เร็วที่สุด แม้จะยังไม่มีคำตอบสุดท้าย แจ้งว่า "กำลังตรวจสอบให้อยู่นะคะ/ครับ" เพื่อให้ร้านค้ารู้ว่ามีคนดูแลอยู่ ความเงียบทำให้ร้านค้ารู้สึกถูกทิ้ง',
    tags: ['chat', 'response-time', 'basics'],
    unlockedByLessonId: LESSON_IDS.liveChat,
  },
  {
    id: 'kh-chat-formatting',
    title: 'การจัดรูปแบบข้อความแชท',
    body: 'แบ่งข้อความยาวเป็นประโยคสั้น ๆ หลายบับเบิลแทนที่จะส่งข้อความยาวเดียว อ่านง่ายกว่าและรู้สึกเป็นธรรมชาติกว่าในบทสนทนาสด',
    tags: ['chat', 'formatting'],
    unlockedByLessonId: LESSON_IDS.liveChat,
  },
  {
    id: 'kh-chat-repeat-complaint',
    title: 'รับมือร้านค้าที่ร้องเรียนซ้ำผ่านแชท',
    body:
      'เมื่อร้านค้าแจ้งปัญหาเดิมซ้ำและเริ่มหงุดหงิด ให้ยอมรับตรง ๆ ว่าเป็นปัญหาเกิดซ้ำ เสนอการส่งต่อเคสให้ทีมตรวจสอบเชิงลึก แทนที่จะขอโทษเฉย ๆ โดยไม่มีแผนต่อ',
    tags: ['chat', 'escalation'],
    unlockedByLessonId: LESSON_IDS.liveChat,
  },
  // บทเรียนที่ 4 — ตั้งค่าโปรไฟล์/เมนู (WMA)
  {
    id: 'kh-menu-builder-walkthrough',
    title: 'ขั้นตอนการใช้ Menu Builder',
    body:
      'สร้างหมวดหมู่ก่อน แล้วจึงเพิ่มเมนูภายในแต่ละหมวดหมู่ ทุกเมนูต้องมี: ชื่อ ราคา และหมวดหมู่ จึงจะเผยแพร่ได้ รูปภาพและคำอธิบายเป็นตัวเลือกเสริมแต่ช่วยเพิ่มการมองเห็นได้มาก',
    tags: ['menu', 'onboarding', 'setup'],
    unlockedByLessonId: LESSON_IDS.menuSetup,
  },
  {
    id: 'kh-profile-checklist',
    title: 'เช็กลิสต์โปรไฟล์ร้านค้า',
    body:
      'โปรไฟล์ที่ครบถ้วน = ชื่อร้าน ที่อยู่/ปักหมุดแผนที่ เวลาเปิด-ปิด รูปหน้าปก และมีเมนูอย่างน้อย 1 หมวดหมู่ที่เผยแพร่แล้ว การขาดข้อมูลเหล่านี้ส่งผลต่ออันดับการค้นหาอย่างชัดเจน',
    tags: ['profile', 'onboarding', 'checklist'],
    unlockedByLessonId: LESSON_IDS.menuSetup,
  },
  {
    id: 'kh-search-visibility',
    title: 'ปัจจัยที่มีผลต่อการค้นหา',
    body:
      'อันดับการค้นหาขึ้นอยู่กับ: ความครบถ้วนของโปรไฟล์ ปริมาณรูปภาพเมนู จำนวน/คะแนนรีวิวสะสม และการเปิดใช้ Sponsored Placement (ถ้ามี) ร้านค้าใหม่ควรเน้นสองข้อแรกก่อน เพราะเป็นสิ่งที่ควบคุมได้ทันที',
    tags: ['menu', 'search', 'visibility'],
    unlockedByLessonId: LESSON_IDS.menuSetup,
  },
  {
    id: 'kh-onboarding-blockers',
    title: 'ปัญหาที่พบบ่อยช่วงเริ่มต้นใช้งาน',
    body:
      'เคสในสัปดาห์แรกส่วนใหญ่คือ "claim โปรไฟล์ไม่ได้" (มักเป็นปัญหาเอกสารยืนยันตัวตน), "เมนูบันทึกไม่ได้" (กรอกข้อมูลที่จำเป็นไม่ครบ), หรือ "ค้นหาไม่เจอ" (โปรไฟล์ยังไม่ครบถ้วน)',
    tags: ['onboarding', 'troubleshooting'],
    unlockedByLessonId: LESSON_IDS.menuSetup,
  },
  // บทเรียนที่ 5 — โฆษณา/ยอดโอนเงิน (WMA)
  {
    id: 'kh-ads-billing-faq',
    title: 'คำถามที่พบบ่อยเรื่องบิลโฆษณา',
    body:
      'ค่าโฆษณาคิดแยกจากค่าคอมมิชชันออเดอร์ โดยอิงจากการมองเห็น/การมีส่วนร่วมที่เกิดจากแคมเปญนั้น ไม่เคยเป็นการการันตีว่าจะมีออเดอร์เพิ่ม',
    tags: ['ads', 'billing', 'faq'],
    unlockedByLessonId: LESSON_IDS.adsPayout,
  },
  {
    id: 'kh-payout-cycle-guide',
    title: 'คู่มือรอบการโอนเงิน',
    body:
      'ยอดโอนเงินจะเข้าตามรอบรายสัปดาห์ที่กำหนดไว้ คำนวณจากมูลค่าออเดอร์ที่เสร็จสมบูรณ์ หักค่าคอมมิชชันแพลตฟอร์มและค่าโฆษณาที่ใช้ในรอบนั้น แล้วโอนเข้าบัญชีธนาคารที่ร้านลงทะเบียนไว้',
    tags: ['payout', 'billing', 'cycle'],
    unlockedByLessonId: LESSON_IDS.adsPayout,
  },
  {
    id: 'kh-payout-delay-reasons',
    title: 'สาเหตุที่ทำให้ยอดโอนล่าช้าได้จริง',
    body:
      'ระยะเวลาดำเนินการของธนาคาร ข้อพิพาท/การคืนเงินที่ยังไม่จบในรอบนั้น หรือข้อมูลบัญชีธนาคารที่ไม่ครบถ้วน/ไม่เป็นปัจจุบัน หากเป็นสาเหตุอื่นนอกเหนือจากนี้ควรตรวจสอบเพิ่มเติม ไม่ใช่แค่อธิบายผ่าน ๆ',
    tags: ['payout', 'delay', 'troubleshooting'],
    unlockedByLessonId: LESSON_IDS.adsPayout,
  },
  {
    id: 'kh-sponsored-ranking',
    title: 'อธิบาย Sponsored Placement',
    body:
      'Sponsored Placement ช่วยยกอันดับร้านให้สูงขึ้นสำหรับการค้นหาที่เกี่ยวข้องในบริเวณใกล้เคียง ตลอดระยะเวลาแคมเปญ — เป็นการเพิ่มการมองเห็น ไม่ได้เปลี่ยนปัจจัยการจัดอันดับตามธรรมชาติ',
    tags: ['ads', 'ranking', 'sponsored'],
    unlockedByLessonId: LESSON_IDS.adsPayout,
  },
  // บทเรียนที่ 6 — แก้ปัญหาระดับสูงใน WMA
  {
    id: 'kh-multi-issue-triage',
    title: 'การแยกแยะปัญหาหลายเรื่องพร้อมกัน',
    body:
      'เมื่อร้านค้าแจ้งหลายปัญหาในบทสนทนาเดียว ให้แยกเป็นข้อ ๆ ก่อน จัดลำดับตามผลกระทบต่อรายได้ร้าน แล้วตอบทีละประเด็นอย่างชัดเจน อย่ารวบตอบทุกอย่างในประโยคเดียว',
    tags: ['wma', 'triage', 'advanced'],
    unlockedByLessonId: LESSON_IDS.wmaAdvanced,
  },
  {
    id: 'kh-menu-not-showing',
    title: 'เมนูไม่แสดงในการค้นหา (สาเหตุขั้นสูง)',
    body:
      'นอกจากโปรไฟล์ไม่ครบถ้วน อีกสาเหตุที่พบบ่อยคือเมนูขาดรูปภาพบังคับหรือข้อมูลจำเป็นบางอย่าง ทำให้ไม่ผ่านการเผยแพร่อัตโนมัติแม้จะกดบันทึกแล้ว',
    tags: ['wma', 'menu', 'advanced'],
    unlockedByLessonId: LESSON_IDS.wmaAdvanced,
  },
  {
    id: 'kh-ads-self-adjusted',
    title: 'ค่าโฆษณาที่ร้านปรับเอง',
    body: 'ก่อนสรุปว่าค่าโฆษณาผิดปกติ ให้ตรวจสอบก่อนว่าร้านค้าเพิ่งปรับงบแคมเปญเองหรือไม่ เพราะเป็นสาเหตุที่พบบ่อยกว่าปัญหาระบบ',
    tags: ['wma', 'ads', 'advanced'],
    unlockedByLessonId: LESSON_IDS.wmaAdvanced,
  },
  // บทเรียนที่ 7 — Salesforce
  {
    id: 'kh-case-field-glossary',
    title: 'คำศัพท์ในฟอร์มเคส',
    body:
      'Subject: สรุปสั้น ๆ พร้อมเลขอ้างอิง Description: บริบทครบถ้วนที่คนอื่นสานต่อได้ Priority: ระดับความเร่งด่วน (Low/Medium/High/Urgent) Case Type: หมวดหมู่ที่ใช้ในการส่งต่อเคส',
    tags: ['salesforce', 'case', 'glossary'],
    unlockedByLessonId: LESSON_IDS.salesforceCase,
  },
  {
    id: 'kh-good-case-examples',
    title: 'ตัวอย่างการเขียนเคสที่ดี',
    body:
      'หัวข้อที่ดี: "ยอดโอนขาดเท่ายอดคืนเงิน — ออเดอร์ #7734 ของขาดหาย" หัวข้อที่ไม่ดี: "ปัญหาการจ่ายเงินร้านค้า" — คลุมเครือเกินไปจนคนอื่นจัดลำดับความสำคัญไม่ได้',
    tags: ['salesforce', 'case', 'examples'],
    unlockedByLessonId: LESSON_IDS.salesforceCase,
  },
  {
    id: 'kh-priority-definitions',
    title: 'คำจำกัดความของแต่ละ Priority',
    body:
      'Urgent: มีผลกระทบทางการเงินหรือความปลอดภัยที่กำลังเกิดขึ้น High: มีเงินที่ต้องคืน หรือร้องเรียนซ้ำ Medium: เหตุการณ์ทั่วไปครั้งเดียว Low: ข้อมูลทั่วไป ไม่มีผลกระทบเร่งด่วน',
    tags: ['salesforce', 'priority'],
    unlockedByLessonId: LESSON_IDS.salesforceCase,
  },
  {
    id: 'kh-case-type-decision-tree',
    title: 'แผนผังการเลือกประเภทเคส',
    body:
      'เงินขาดจากยอดโอนที่เชื่อมกับออเดอร์เฉพาะ → Payout Discrepancy ปัญหาตัวสินค้า/การจัดส่งเอง → Order Issue คำถามเรื่องค่าโฆษณา → Advertising Billing เมนู/โปรไฟล์/การค้นหา → Menu & Listing Support การเข้าสู่ระบบ/สิทธิ์การใช้งาน → Account Access',
    tags: ['salesforce', 'case', 'decision-tree'],
    unlockedByLessonId: LESSON_IDS.salesforceCase,
  },
  {
    id: 'kh-case-summary-checklist',
    title: 'เช็กลิสต์การสรุปเคสก่อนบันทึก',
    body:
      'ก่อนเปิดเคสใน Salesforce ให้ลองสรุปเป็นข้อความสั้น ๆ ก่อนว่า: เกิดอะไรขึ้น (what) เกี่ยวกับออเดอร์/เมนู/บัญชีไหน (reference) และร้านค้าต้องการอะไร (ask) ถ้าสรุป 3 อย่างนี้ไม่ได้ แปลว่ายังต้องถามข้อมูลเพิ่มก่อนปิดแชท',
    tags: ['salesforce', 'case', 'summary'],
    unlockedByLessonId: LESSON_IDS.salesforceCase,
  },
  // บทเรียนที่ 8 — พื้นฐาน Wongnai POS
  {
    id: 'kh-bom-explainer',
    title: 'BOM (Bill of Materials) คืออะไร',
    body: 'สูตรที่ผูกวัตถุดิบกับแต่ละเมนู เมื่อขายเมนูนั้นระบบจะตัดสต๊อกวัตถุดิบให้อัตโนมัติตามสูตร ถ้าตั้งค่าไม่ครบ สต๊อกในระบบจะไม่ตรงกับของจริง',
    tags: ['pos', 'bom', 'stock'],
    unlockedByLessonId: LESSON_IDS.posBasics,
  },
  {
    id: 'kh-pos-order-channels',
    title: 'ช่องทางออเดอร์ใน POS',
    body: 'Wongnai POS รวมออเดอร์หน้าร้าน (dine-in) และออเดอร์ออนไลน์ไว้ในระบบเดียวกัน ช่วยลดความผิดพลาดจากการรับออเดอร์หลายช่องทางแยกกัน',
    tags: ['pos', 'orders'],
    unlockedByLessonId: LESSON_IDS.posBasics,
  },
  // บทเรียนที่ 9 — อุปกรณ์ฮาร์ดแวร์
  {
    id: 'kh-edc-troubleshooting',
    title: 'ตรวจสอบเครื่อง EDC เบื้องต้น',
    body: 'ก่อนส่งต่อทีมช่าง ให้ตรวจสอบการเชื่อมต่อกับ POS (Bluetooth/สาย) และสถานะแบตเตอรี่/สัญญาณก่อนเสมอ ปัญหาส่วนใหญ่แก้ได้จากจุดนี้',
    tags: ['hardware', 'edc', 'troubleshooting'],
    unlockedByLessonId: LESSON_IDS.hardwareBasics,
  },
  {
    id: 'kh-printer-troubleshooting',
    title: 'ตรวจสอบเครื่องพิมพ์ใบเสร็จเบื้องต้น',
    body: 'ตรวจสอบกระดาษ (หมดหรือใส่ผิดด้าน) การเชื่อมต่อกับ POS และสถานะเปิด-ปิดเครื่อง ก่อนสรุปว่าเครื่องพิมพ์เสีย',
    tags: ['hardware', 'printer', 'troubleshooting'],
    unlockedByLessonId: LESSON_IDS.hardwareBasics,
  },
  // บทเรียนที่ 10 — ไรเดอร์และการจัดส่ง
  {
    id: 'kh-rider-signup',
    title: 'การสมัครเป็นไรเดอร์',
    body: 'สมัครผ่านแอป LINE MAN RIDER ต้องมีรถจักรยานยนต์ ใบขับขี่ที่ถูกต้อง และอายุ 18 ปีขึ้นไป ผ่านการตรวจสอบก่อนเริ่มรับงานได้',
    tags: ['rider', 'onboarding'],
    unlockedByLessonId: LESSON_IDS.riderBasics,
  },
  {
    id: 'kh-rider-matching',
    title: 'การจับคู่งานให้ไรเดอร์',
    body: 'ระบบจับคู่ไรเดอร์ที่อยู่ใกล้ร้านค้าที่สุดก่อน หากช่วงเวลานั้นมีไรเดอร์ว่างน้อยกว่าจำนวนออเดอร์ อาจทำให้รอนานกว่าปกติ',
    tags: ['rider', 'delivery'],
    unlockedByLessonId: LESSON_IDS.riderBasics,
  },
];
