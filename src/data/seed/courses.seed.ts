import type { Course } from '../../types/course';

export const COURSE_IDS = {
  merchantOverview: 'course-merchant-overview',
  wongnaiPos: 'course-wongnai-pos',
  foodstoryPos: 'course-foodstory-pos',
} as const;

export const seedCourses: Course[] = [
  {
    id: COURSE_IDS.merchantOverview,
    slug: 'merchant-overview',
    title: 'ภาพรวมร้านค้า & Wongnai Merchant App (WMA)',
    shortName: 'Merchant & WMA',
    description:
      'โมเดลธุรกิจ LMWN, ทีม CS, ประเภทร้าน, Tier/Ranking, ค่า GP และการใช้งาน Wongnai Merchant App ครบวงจร ตั้งแต่ลงทะเบียนร้าน สร้างเมนู รับออเดอร์ ไปจนถึง Delivery Flow, การเคลม และแคมเปญ',
    icon: '🏪',
    status: 'active',
    order: 1,
  },
  {
    id: COURSE_IDS.wongnaiPos,
    slug: 'wongnai-pos',
    title: 'Wongnai POS (Android)',
    shortName: 'Wongnai POS',
    description:
      'ระบบ POS บน Android: ประเภทร้านอาหาร, Hardware 7 รุ่น, Software 6 แพ็กเกจ, Wongnai Care, เงื่อนไขการซื้อและ SOP การส่งเรื่อง, การตั้งค่าเครื่อง, สร้างเมนู, การขาย รอบการขาย และ Manager App',
    icon: '🖥️',
    status: 'active',
    order: 2,
  },
  {
    id: COURSE_IDS.foodstoryPos,
    slug: 'foodstory-pos',
    title: 'Wongnai POS IPAD & สินค้าคงคลัง',
    shortName: 'iPad POS & Inventory',
    description:
      'ระบบ POS บน iPad สำหรับร้านหลายสาขา: Software 9 แพ็กเกจ, การตั้งค่า VAT/Service Charge, POS ID, การจัดการโต๊ะและออเดอร์, Multi-Cashier และระบบสินค้าคงคลังเต็มรูปแบบ (สูตร BOM, PR/PO/GR, TR/TO)',
    icon: '📲',
    status: 'active',
    order: 3,
  },
];
