# Jolly Pet Website

เว็บไซต์องค์กรและ E-Commerce สำหรับ **บริษัท จอลลี่ เพ็ท จำกัด**

## Tech Stack
- **Framework:** Next.js 14 (App Router + TypeScript)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** NextAuth.js v5
- **PDF:** React-PDF
- **Email:** Nodemailer + Gmail SMTP

## Setup

### 1. ติดตั้ง dependencies
```bash
npm install
```

### 2. ตั้งค่า Environment Variables
```bash
cp .env.example .env.local
# แก้ไข .env.local ใส่ค่าจริง
```

Environment ที่ต้องใส่:
- `NEXT_PUBLIC_SUPABASE_URL` — URL จาก Supabase dashboard
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Anon key จาก Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (server-side only)
- `NEXTAUTH_SECRET` — สร้างด้วย `openssl rand -base64 32`
- `GMAIL_USER` — Gmail address
- `GMAIL_APP_PASSWORD` — Gmail App Password (ไม่ใช่ password ปกติ)
- `PROMPTPAY_ID` — เบอร์โทรหรือเลขทะเบียน 13 หลัก

### 3. Setup Supabase Database
```bash
# ใช้ Supabase dashboard หรือ CLI
# รัน migration จาก supabase/migrations/
```

### 4. รัน Development Server
```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── (public)/         # หน้า public
├── (shop)/           # E-commerce flow
├── (auth)/           # Login, Register
├── admin/            # Admin panel
└── api/              # API routes

components/
├── ui/               # Base components
├── product/          # Product components
├── layout/           # Header, Footer
├── admin/            # Admin components
└── documents/        # PDF templates

lib/
├── supabase/         # DB clients
├── auth/             # NextAuth config
├── email/            # Nodemailer
├── payment/          # PromptPay QR
└── pdf/              # PDF generation

types/                # TypeScript types
```

## Git Workflow

```
main        ← production (jollypet.co.th)
develop     ← staging
feature/*   ← งานแต่ละ feature
```

## Links
- GitHub: https://github.com/jollypetdevth-spec/jollypet-website
- Supabase: https://supabase.com
- Vercel: https://vercel.com
