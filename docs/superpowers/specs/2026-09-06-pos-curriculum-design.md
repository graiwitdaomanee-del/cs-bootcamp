# Design — Replace the mock curriculum with a POS/Merchant curriculum from 3 training decks

| | |
|---|---|
| **Status** | Draft for review — not yet approved, nothing committed |
| **Date** | 2026-09-06 |
| **Scope** | Full replace of seed content (courses, lessons, quizzes, Knowledge Hub, seeded progress) + retune the mock AI tutor. No app-code/architecture changes. |

## 1. Decision summary (from clarifying questions)

- **Full replace** — delete all 5 current courses / 12 lessons; build 3 new courses, one per source deck.
- **Thorough** — ~7 lessons per course, ~21 lessons total, following each deck's agenda.
- **All 7 step types, evenly spread** — `live-chat-mock` / `phone-call-mock` / `salesforce-mock-timed` are reframed as realistic merchant-support scenarios drawn from the decks' SOP/routing content.
- **Retune the tutor** — new `tutorEngine.ts` category / synonym / example maps for the POS/merchant domain.
- All content **Thai** (NFR-3). No new step types, no schema changes, no persistence. Gamification (XP, streak, quiz gate ≥70%, prerequisites) unchanged.

## 2. Sources

| Deck | Pages | File |
|---|---|---|
| `[MDS-Overview] Merchant Overview (2).pdf` | 238 | Merchant Overview & WMA |
| `[CX Training Slide] Basic POS & Wongnai POS - May 2026.pdf` | 124 | Wongnai POS (Android) |
| `[CX Training Slide] FoodStory POS & Inventory - May 2026.pdf` | 187 | Wongnai POS IPAD & Inventory |

Text extracted with `pypdf` (slides carry real text). Screens are represented as `image` content blocks with descriptive Thai captions per PRD N4 — nothing embedded.

## 3. Course & lesson map

### Course 1 — `course-merchant-overview` · "ภาพรวมร้านค้า & Wongnai Merchant App (WMA)" · icon 🏪

| # | Lesson | Key content | Step types |
|---|---|---|---|
| 1 | ภาพรวมธุรกิจ LMWN & ทีม CS | Business model (Convenience/Orders/Growth); ecosystem apps (WMA, POS, Wongnai, LINE MAN, Manager, RIDER); CS contact channels (Telephony 54.7% / Live Chat 35.8% / Slack 8.7% / LINE / E-mail / Ticket) | info, single, multi, free-text |
| 2 | ประเภทร้าน: Food & Mart, Official vs E-Menu | Official (self-manage via WMA, direct orders) vs E-Menu/Standard (LMWN staff enters data, driver confirms price); Mart ทั่วไป vs Mart SP (BigC, Tops, Boots…); prohibited Mart items; ≤15kg / 40³cm | info, single, multi, live-chat |
| 3 | Merchant Tier, Ranking & GP | Tier (Long Tail / Top Standalone / Top Chain / Strategic Partner — checked in Salesforce; SP hotline 02-0385788); Ranking (None/Basic, Hidden Gem >5,000฿/mo, รานแนะนำ Top10%, User's Choice Top2% ≥4.8); **GP 30% + VAT 7% = 32.1%**; payout next day when cumulative ≥ 500฿; invoice 1st, due 21st | info, single, multi, free-text, salesforce |
| 4 | WMA: ลงทะเบียนร้าน · เปิดเดลิเวอรี · สมัคร GP | Download WMA (Android 7+); register (Food/Mart, ID verification, OTP, 3-day review); activate delivery (hours, Auto Call ≤3 numbers, notifications + ringer); GP signup (must open shop + add menu first; บุคคล/นิติบุคคล docs; 1 Tax ID ≤ 3 shops; 3-day approval, use next day) | info, single, multi, phone-call |
| 5 | WMA: ตั้งค่าร้าน · สร้างเมนู · ฟีเจอร์ | Settings map; menu = ประเภทอาหาร → ตัวเลือก → เมนู; ปิดของหมด (วันนี้/ชั่วคราว); promotions 4 types — ส่วนลดราคาพิเศษ / ส่วนลดท้ายบิล / โคดส่วนลด / เซตสุดคุ้ม (all need GP); Ad Manager (เพิ่มการเข้าชม vs เพิ่มออเดอร์; pay-per-click; deduct daily like GP; GP-only; manual daily close); Finance; คุณภาพร้าน; forgot password / lost account (1-3 days) | info, single, multi, free-text, live-chat |
| 6 | WMA: รับ & ยกเลิกออเดอร์ | Auto Accept; manual — accept within 5 min or auto-cancel; ของหมด flow (call customer first, then แก้ไขรายการ); self-cancel ≤ 60 min after accept, 30×/week; CS cancel via Live Chat with order ID + reason; Pickup orders; หาคนขับใหม่ conditions; order history / send by email | info, single, multi, phone-call, salesforce |
| 7 | Delivery Flows · Merchant Claim · Campaigns · Sunmi V.2 | Official 3 flows (Normal / Switch — accept before driver, qualify only / Deferred — find driver before food ready); E-Menu & Mart flows; **Food Claim** — cause = customer or driver only; submit form ≤ 24 hr; photo of packed food; result in 3 days via email/SMS; not-claimable cases (ออเดอร์ซ้ำ <20min, cancel_timeout, Switch Flow ไม่กดพร้อมส่ง, Auto Claim already done); **Mart Claim** via Live Chat, ≥500฿, route to CustomerSupport_Merchant / OS_Merchant Claim; campaign types (โคดเดือด, ดีลเดือด, สงฟรี 0฿, LINE MAN Bonus, รานที่ไมเคยลอง); apply self-serve, cancel via form SLA 7 วันทำการ (โคดเดือด 1 วัน); Sunmi V.2 runs WMA | info, single, multi, free-text, live-chat, salesforce |

### Course 2 — `course-wongnai-pos` · "Wongnai POS (Android)" · icon 🖥️

| # | Lesson | Key content | Step types |
|---|---|---|---|
| 1 | POS เบื้องต้น & ประเภทร้านอาหาร | Quick Service (จ่ายก่อนกิน) / Full Service (กินก่อนจ่าย) / Buffet Service; POS = หน้าร้าน + หลังร้าน + เชื่อมเดลิเวอรี; Software (สมอง) vs Hardware (อุปกรณ์); Android vs iOS | info, single, multi, free-text |
| 2 | Hardware 2 ประเภท 7 รุ่น | New Model (Lite — no battery/printer; Flex — only one with battery, 6 hr, SIM; Single — built-in printer, no SIM; Dual — 2 screens); Old Model (Mini — 2nd-hand, subscription-only, 58mm; Single; Dual — subscription-only); all company hardware only; 1 device/branch; New Model = ซื้อขาด only except Lite/Dual ซื้อขาด/เช่าใช้ | info, single, multi, phone-call |
| 3 | Software 6 แพ็กเกจ & Wongnai Care | QSR Basic/Plus/Premium, FSR Basic/Plus/Premium (Day/Month/Year pricing); **feature matrix — ฟีเจอร์จัดการโต๊ะ = FSR only**; add-ons Order & Pay / Queue Display / Wongnai CRM / MBO Static·Dynamic; **Wongnai Care 1,500฿/yr — covers company hardware only (incl. built-in printer); loaner ≤ 30 days, return within 7 days of repair** | info, single, multi, multi, free-text |
| 4 | เงื่อนไขการซื้อ & SOP การส่งเรื่อง | Purchase (ซื้อขาด HW + SW รายปี/วัน) vs Subscription (HW+SW รายวัน via WMA E-Payment); eligibility: opened LINE MAN + GP > 3 months + ≥ 3 bills + > 5,000฿/mo × 3; 1,000฿ deposit refunded 30–45 days after cancel; **routing: ลูกค้าใหม่ซื้อเครื่อง → MDS Lead (48 ชม.); ลูกค้าเก่าซื้อฟีเจอร์/อุปกรณ์เสริม → Upsell Renew (1–3 วันทำการ); เปลี่ยนอีเมล login → OS Merchant (1 วัน)** | info, single, multi, salesforce, salesforce |
| 5 | ตั้งค่าเครื่องครั้งแรก & เข้าสู่ระบบ | First boot (Agree → English → Bangkok → Wi-Fi required); Power button (short = on; hold 2–3 s = restart/off menu; hold 11 s = force off); login 2 ways — via WMA (existing LINE MAN merchant → pick shop → 4-digit PIN) or Email & Password (new, from team); Owner App password self-set on owner site; 4-digit PIN system-generated only | info, single, multi, phone-call, live-chat |
| 6 | ตั้งค่าพื้นฐาน & สร้างเมนู | Payment (Service Charge — not on delivery bills; VAT include/add; ปัดเศษ; QR needs POS Pay first); cash-drawer opening float; staff 3 roles (PIN emailed); printer (built-in always counts as 1); receipt format (logo 500²–1000² px, POS ID, Tax ID); menu = หมวดหมู่ → กลุ่มตัวเลือก → เมนู; Multi-Channel pricing; promotions 3 types on POS (ทั่วไป / LINE MAN / Wongnai CRM) | info, single, multi, free-text, live-chat |
| 7 | การขาย · รอบการขาย · เดลิเวอรี & Manager App | Order + payment + พักบิล (ส่งค้างไว้ → ออเดอร์ที่เปิดอยู่); void bill; sales round (พิมพ์ข้อมูลรอบปัจจุบัน, บันทึกเงินเข้า/ออก, ปิดรอบ + count cash, cut-off time if closing after 24:00); delivery connect + Auto Call ≤ 3 numbers; Manager App — real-time sales, เปิด-ปิดเมนู remotely, self-renew package (QR PromptPay / LINE Pay; upgrade routes to ศูนย์ช่วยเหลือ) | info, single, multi, phone-call, free-text |

### Course 3 — `course-foodstory-pos` · "Wongnai POS IPAD & สินค้าคงคลัง" · icon 📲

| # | Lesson | Key content | Step types |
|---|---|---|---|
| 1 | Wongnai POS IPAD: ภาพรวม & ฟีเจอร์เด่น | iOS via "Wongnai POS IPAD Owner"; for multi-branch / plans to expand / นิติบุคคล / systematic VAT+SVC / complex kitchens; advanced vs Android: **inventory, table-layout editing, reservations, kitchen, buffet, Multi-Cashier, web inventory**; iPad Gen 11 only (12,900฿); **no built-in printer** (connect separate); **no daily-subscription hardware** (buy iPad outright; SW yearly or daily if eligible) | info, single, multi, free-text |
| 2 | Software 9 แพ็กเกจ & Care | QSR / FSR / BFR × Standard / Pro / Max (Day/Month/Year); **table + reservation + kitchen = Full & Buffet only; buffet timer + package menu = BFR only**; add-ons Order & Pay / Display & Checker / Mobile Order Static·Dynamic / Reservation / CRM; **POS IPAD Care 3,852฿/yr** | info, single, multi, multi, free-text |
| 3 | ตั้งค่า iPad POS: ทั่วไป · บิล · การชำระเงิน | VAT vs Service Charge (**SVC computed before VAT always; discounts applied before SVC/VAT except Voucher; LINE MAN & Online orders never charged SVC**); บิล — logo (forced B&W), branch info, **POS ID from Revenue Dept for Full TAX**, Invoice Number (+1, start at 0), POS ID/Invoice saved per iPad only; **Dynamic QR KBank — payout as one lump at 23:00 daily, no fee; void must be before 23:00, void-item does not auto-refund**; รอบKBank void support banks; ปัดเศษ 0.05–1.00 | info, single, multi, salesforce, live-chat |
| 4 | สร้างเมนู & โปรโมชัน | กลุ่มเมนู → หมวดหมู่ → กลุ่มตัวเลือก → เมนู; menu fields (ชื่อ 2, Non-VAT, รหัส, บาร์โค้ด, พร้อมขาย, ลักษณะเมนู tag, ช่องทางการขาย); ผูกสินค้าคงคลังกับตัวเลือก; promotions หน้าร้าน 5 types (ลดราคาสินค้า / ลด·ฟรีเมื่อซื้อครบจำนวน / …ครบยอด / ลดท้ายบิลครบจำนวน / …ครบยอด), ออนไลน์, ใช้คะแนนแลก (CRM); via app or owner site; promo code control on owner site | info, single, multi, free-text, live-chat |
| 5 | จัดการโต๊ะ & ออเดอร์ | Zone/table layout (สร้าง/ลบ/คัดลอก/แก้ไข); เปิด/ยกเลิก (empty only)/ย้าย/ย้ายเมนู/รวมโต๊ะ; table status colours; **Split Amount (multi-payment one bill) vs Split Bill (split by item, numbered) vs Split Pay (split by item, table stays open)**; discount %/piece vs price/piece vs %/bill vs price/bill; Voucher; delivery on iPad — **no duplicate หมวดหมู่/เมนู/ตัวเลือก names; after connect, edit only via iPad system (not WMA)**; null table → ตรวจสอบบิล + refresh; ย้ายบิล via owner site ≤ 45 days | info, single, multi, phone-call, free-text |
| 6 | Multi-Cashier · พนักงาน & Manager App | **Multi-cashier แบบธรรมดา (self-enable: ตั้งค่า > ถาดเก็บเงิน; one round, ≥1 pay point) vs แบบแยกกะ (CS enables via web internal tool int.…; close กะ before รอบใหญ่)**; caution: multi-device pay can drop Tax-invoice/INV NO. — set different tax data per device; Employee accounts via app, Manager accounts via owner web; Manager App reports/channels/renew; ช่วยเหลือ — chat QR no expiry, call QR 10-min expiry, branch code FS_xx | info, single, multi, salesforce, live-chat |
| 7 | สินค้าคงคลัง (Inventory) · สูตร BOM · เอกสารจัดซื้อ | Inventory feeds **cost per menu**; หน่วยหลัก (cannot change after set — must ทำซ้ำ), แปลงหน่วย, หน่วยรีสต๊อก (adjust only, can't bind to menu) / หน่วยย่อย, หน่วยพิเศษ (kg↔g, L↔ml); Safety stock → email alert; ผูกสูตรวัตถุดิบกับเมนู; ตัดวัตถุดิบ (decrease) / ตรวจสอบสินค้า (replace count, shows ส่วนต่าง vs ผลต่างที่รับได้) / เพิ่มวัตถุดิบ (increase, can go negative); **BOM = combine inventory items into a new item (สูตรน้ำจิ้ม); stock only via เพิ่มวัตถุดิบรวดเร็ว, cost = sum of components**; **5 documents: PR → PO → GR (purchasing, PO may skip PR); TR → TO → GR (transfer, needs ≥ 2 branches, matching รหัสสินค้า + หน่วยหลัก, name need not match); GR is final — cannot cancel/delete/edit** | info, single, multi, free-text, salesforce |

## 4. Step-type distribution (target)

~6 steps/lesson × 21 + one quiz/lesson. Approximate spread across the 21 lessons:

| type | count | notes |
|---|---|---|
| `info` | ~24 | every lesson opens with one; content-heavy lessons get two |
| `single-choice` | ~26 | |
| `multi-choice` | ~15 | "which features need Full Service?", "which are not claimable?" |
| `free-text` | ~13 | "explain buy-vs-subscribe to a merchant in 2 sentences" |
| `live-chat-mock` | ~13 | merchant chats: "เมนูไม่ขึ้นบน LINE MAN", "แยกบิลไม่ได้" |
| `phone-call-mock` | ~10 | "ลิ้นชักไม่เด้ง", "เครื่องขึ้นจอค้าง", "OTP ไม่เข้า" |
| `salesforce-mock-timed` | ~9 | route request to correct team + priority + SLA, using the decks' routing table (MDS Lead / Upsell Renew / OS Merchant / CustomerSupport_Merchant). `priorityOptions` and `caseTypeOptions` reworded to the merchant-support context. |

## 5. Knowledge Hub — ~36 entries

One-to-few per lesson, `unlockedByLessonId` set accordingly. Reference facts that double as the tutor's L3 hand-off targets, e.g.: GP formula & payout thresholds; Tier/Ranking table; **SLA routing table** (new-device→MDS Lead 48h, add-on→Upsell Renew 1–3d, email→OS Merchant 1d); Android hardware comparison; Android 6-package / iPad 9-package feature matrix; Wongnai Care vs POS IPAD Care; first-boot & login/PIN rules; Service Charge/VAT rules; POS ID & Full TAX; Dynamic QR KBank payout & void; Split Amount/Bill/Pay; Delivery flows (Normal/Switch/Deferred); Food Claim conditions & non-claimable list; Mart Claim routing; campaign cancel SLAs; Inventory units & หน่วยพิเศษ; BOM; PR→PO→GR & TR→TO→GR.

## 6. Quiz pool — ~24 quizzes

Tag-driven (unchanged mechanism). One single-lesson quiz per lesson + ~6 cross-lesson quizzes sharing tags with several lessons so `buildQuizForLesson`'s "รวมความรู้หลายบทเรียน" bias fires:
`GP & การเงิน`, `SOP & การส่งเรื่อง`, `แพ็กเกจ & Hardware`, `Delivery Flow & Claim`, `Inventory`, `ภาพรวม POS สองระบบ`.

## 7. Files touched (no app-code / no schema)

| File | Change |
|---|---|
| `src/data/seed/courses.seed.ts` | rewrite — 3 courses, new `COURSE_IDS` |
| `src/data/seed/lessons.seed.ts` | rewrite — ~21 lessons, new `LESSON_IDS` (~1,700 lines) |
| `src/data/seed/quizzes.seed.ts` | rewrite — ~24 quizzes (~800 lines) |
| `src/data/seed/knowledgeHub.seed.ts` | rewrite — ~36 entries |
| `src/data/seed/buildSeed.ts` | rewrite the 6 trainees' seeded progress against new lesson IDs, same cohort spread (Ploy 2 done C1 · Nan 4 done C1–C2 · Gap mid-C2/C3, 12-day streak · Ohm just started · Fah 1 done · Beam empty · Phin admin empty) |
| `src/utils/tutorEngine.ts` | replace `CATEGORIES` + extend `SYNONYMS` + rewrite per-category `example` for the POS/merchant domain (~14 categories: `package-tier`, `hardware-model`, `sop-routing`, `gp-finance`, `tier-ranking`, `inventory-bom`, `purchase-docs`, `table-mgmt`, `menu-setup`, `payment-tax`, `order-flow`, `claim`, `wma-setup`, keep `empathy`/`follow-up`/`verify`). Engine logic, demo hint, and hint ladder unchanged. |
| `docs/PRD.md` | rewrite §1–2 framing, §4 personas, §5 journey examples, §7 course list, §12; update course descriptions |

No changes to: types, store, components, router, gamification, build config.

## 8. Assumptions / judgment calls (flag if wrong)

1. Each course is internally linear (lesson N prereq for N+1); courses are independent of each other (matches current parallel-course model).
2. XP rewards ~100–180 per lesson, pass threshold stays 70%, quiz question count 5–6 per lesson.
3. `salesforce-mock-timed` keeps its Salesforce framing (it *is* the tool CS uses per the decks) but scenarios become merchant requests to triage/route; account list becomes example merchant shops.
4. Screens shown as captioned `image` placeholders, not embedded images.
5. English product terms (QSR, FSR, BOM, PR/PO/GR, Switch Flow, GP) kept as-is inside Thai copy — matches the decks and current seed style.
6. `phin@lmwn.com` / `@ext-lmwn.com` account changes (already shipped) are retained.

## 9. Build / verify plan (at implementation time)

`npm run build` (strict `tsc`) + `npm run lint` clean on touched files → dev server → browser walk: login as Nan, open one lesson per course, run a step of each type, take the quiz, confirm the tutor + demo hint work on the new domain → then commit (as separate commits: content, tutor, PRD) and push.

## 10. Effort

Large. ~3,000+ lines of new Thai seed content across 7 files, authored in one pass, then verified. Not a quick change.
