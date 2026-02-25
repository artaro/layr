# ออมเก่ง 💚

**ออมเก่ง — ฝึกออมทุกวัน จนออมเก่ง**

ออมเก่ง (Aomkeng) คือแอปติดตามการเงินส่วนตัวสำหรับ Gen-Z — บันทึกง่าย AI อ่านสลิปธนาคารให้อัตโนมัติ ออมได้ทุกวันแม้จะขี้เกียจ

---

## ✨ ฟีเจอร์

**📊 Dashboard ภาพรวมการเงิน**
- สรุปรายรับ-รายจ่าย-คงเหลือแบบ real-time
- กราฟรายรับ-รายจ่าย 6 เดือนย้อนหลัง
- Pie chart แยกตามหมวดหมู่
- Calendar view รายรับ-รายจ่ายรายวัน

**💸 จัดการรายการ**
- บันทึก แก้ไข ลบ รายรับ-รายจ่าย
- หมวดหมู่ custom พร้อม icon และสีที่เลือกได้
- เชื่อมกับหลายบัญชี (ธนาคาร, เงินสด, กระเป๋าเงิน)
- Filter และค้นหาขั้นสูง

**🤖 AI อ่านสลิปให้**
- อัปโหลดสลิปธนาคาร (PNG/JPG/HEIC) หรือ PDF ใบแจ้งยอด
- Google Gemini 2.5 Flash ดึงรายการทั้งหมดออกมาให้
- รองรับ PDF ที่มีรหัสผ่าน (เช่น ใบแจ้งยอด SCB, KBank)
- ตรวจสอบและแก้ไขก่อน import ได้

**📂 Import CSV**
- รองรับไฟล์ CSV จากธนาคาร
- Map columns แบบ manual หรือ auto-detect
- Preview ก่อน import

**🌏 สองภาษา (TH / EN)**
- Thai-first design พร้อม Chakra Petch + IBM Plex Sans Thai
- สลับภาษาได้ทันทีผ่าน header

---

## 🛠️ Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + Neo-Brutalism Design System |
| Fonts | Chakra Petch (headers) + IBM Plex Sans Thai (body) |
| State | [Zustand](https://github.com/pmndrs/zustand) |
| Server State | [TanStack Query](https://tanstack.com/query/latest) |
| Charts | [Recharts](https://recharts.org/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Backend / Auth | [Supabase](https://supabase.com/) |
| AI | [Google Gemini 2.5 Flash](https://ai.google.dev/) |
| PDF | `pdf-lib` (decrypt) + `pdfjs-dist` (client parse) |
| Icons | [Lucide React](https://lucide.dev/) |

---

## 🎨 Design System

ออมเก่งใช้ **Neo-Brutalism Dark Theme**

| Token | Value | ใช้สำหรับ |
|-------|-------|----------|
| `--color-primary` | `#00FFAB` Money Mint | CTA, active states, income |
| `--color-secondary` | `#FFF01F` Risky Yellow | Bold accents |
| `--color-background` | `#0D0D0D` Deep Charcoal | Page background |
| `--color-surface` | `#1A1A1A` | Cards, modals |
| `--color-expense` | `#FF6B6B` | Expense indicators |

Shadow pattern: `shadow-[4px_4px_0px_0px_#00FFAB]` — hard drop shadow, no blur

---

## 🚀 เริ่มใช้งาน

### ต้องมี

- Node.js v18+
- Supabase project (free tier ก็ได้)
- Google Gemini API key (free tier ก็ได้)

### Setup

```bash
# ติดตั้ง dependencies
npm install

# ตั้งค่า environment variables
cp .env.example .env.local
```

แก้ไข `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
LLM_API_KEY=your_gemini_api_key
```

```bash
# รัน dev server
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

### ทดสอบ

```bash
npm run test          # unit tests
npm run test:coverage # พร้อม coverage report
npm run lint          # lint check
npm run build         # production build
```

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/
│   │   └── parse-statement/   # AI import endpoint
│   ├── expenses/              # Main app (dashboard, transactions, accounts, categories)
│   ├── login/
│   ├── portal/                # Welcome screen
│   └── globals.css            # Design tokens + Neo-brutalism utilities
├── features/
│   ├── auth/                  # Supabase auth hooks + store
│   ├── expenses/              # Transactions, accounts, categories (CRUD + hooks + types)
│   ├── import/                # AI slip import (hook + parsers + mock)
│   └── landing/               # Landing page sections
└── shared/
    ├── components/
    │   └── layout/            # AppHeader, AppSidebar, BottomNav, LangSwitcher
    ├── lib/
    │   ├── i18n.ts            # TH/EN translations (~200 keys, brand voice)
    │   ├── formatters.ts      # Currency, date formatters
    │   └── imageUtils.ts      # Image compression util
    └── stores/                # Zustand stores (auth, UI, language)
```

---

## 🗺️ Roadmap

- [x] Transaction CRUD + categories + accounts
- [x] AI slip / statement import (Gemini)
- [x] CSV import
- [x] Dashboard + charts + calendar
- [x] TH/EN i18n
- [x] Mobile bottom nav
- [ ] Budget goals (UI + alerts)
- [ ] Transfer transactions (between accounts)
- [ ] Sub-categories
- [ ] PWA (installable on phone)
- [ ] Freemium + Omise payment (PromptPay)

---

## 📝 License

MIT
