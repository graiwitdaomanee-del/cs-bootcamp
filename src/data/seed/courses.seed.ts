import type { Course } from '../../types/course';

export const COURSE_IDS = {
  wma: 'course-wma',
  csSop: 'course-cs-sop',
  pos: 'course-pos',
  hardware: 'course-hardware',
  rider: 'course-rider',
} as const;

export const seedCourses: Course[] = [
  {
    id: COURSE_IDS.wma,
    slug: 'wma',
    title: 'Wongnai Merchant App (WMA)',
    shortName: 'WMA',
    description: 'เรียนรู้การใช้งานแอปสำหรับร้านค้า: จัดการโปรไฟล์ร้าน เมนู โฆษณา และยอดโอนเงินให้ร้านค้า',
    icon: '📱',
    status: 'active',
    order: 1,
  },
  {
    id: COURSE_IDS.csSop,
    slug: 'cs-sop',
    title: 'Customer Support SOP',
    shortName: 'CS SOP',
    description: 'ขั้นตอนการทำงานมาตรฐานของทีม CS: น้ำเสียงการตอบแชท การจัดการเคสร้องเรียน และการบันทึกเคสใน Salesforce',
    icon: '📋',
    status: 'active',
    order: 2,
  },
  {
    id: COURSE_IDS.pos,
    slug: 'wongnai-pos',
    title: 'Wongnai POS / FoodStory POS',
    shortName: 'POS',
    description: 'ระบบจัดการร้านอาหารครบวงจร: การขาย โต๊ะ สต๊อกวัตถุดิบ และรายงานยอดขาย',
    icon: '🧾',
    status: 'active',
    order: 3,
  },
  {
    id: COURSE_IDS.hardware,
    slug: 'hardware',
    title: 'Hardware',
    shortName: 'Hardware',
    description: 'อุปกรณ์หน้าร้าน เช่น เครื่องรูดบัตร (EDC) เครื่องพิมพ์ใบเสร็จ และแท็บเล็ต POS',
    icon: '🔌',
    status: 'active',
    order: 4,
  },
  {
    id: COURSE_IDS.rider,
    slug: 'rider-app',
    title: 'Rider App',
    shortName: 'Rider App',
    description: 'แอปสำหรับไรเดอร์ LINE MAN: การสมัคร รับงาน และค่าตอบแทน',
    icon: '🛵',
    status: 'active',
    order: 5,
  },
];
