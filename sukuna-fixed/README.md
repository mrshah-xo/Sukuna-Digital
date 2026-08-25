# Sukuna App — School Platform for Class 11 & 12

A modern, Apple-style school platform for students, teachers, and admins.
Built with Next.js, MongoDB, TypeScript, and Tailwind CSS.

---

## Bug Fixes Applied to This Version

| # | Bug | Fix Applied |
|---|-----|-------------|
| 1 | `.env.local` had `<password>` with angle brackets causing MongoDB auth failure | Replaced with clean placeholder format |
| 2 | `package.json` had `"moongoose"` (typo) — a fake npm package | Removed, kept real `mongoose` |
| 3 | `lib/db.js` — empty duplicate file | Deleted |
| 4 | `tsconfig.json` missing `paths` for `@/` alias | Added `"@/*": ["./src/*"]` |
| 5 | No component structure for Figma imports | Added full `src/components/` folder |

---

## Project Structure

```
sukuna-app/
├── apps/
│   └── web/                          ← Main Next.js application
│       ├── app/                      ← Next.js App Router (pages & API)
│       │   ├── api/
│       │   │   ├── test/             ← Test MongoDB connection
│       │   │   ├── auth/
│       │   │   │   ├── login/        ← POST: Login with phone + password
│       │   │   │   ├── register/     ← POST: Create new account
│       │   │   │   └── otp/
│       │   │   │       ├── send/     ← POST: Send OTP via Sparrow SMS
│       │   │   │       └── verify/   ← POST: Verify OTP code
│       │   │   ├── students/         ← Student data APIs
│       │   │   └── admin/            ← Admin APIs
│       │   ├── layout.tsx            ← Root layout
│       │   └── page.tsx              ← Home page
│       ├── src/
│       │   ├── lib/
│       │   │   └── mongodb.ts        ← Database connection (DO NOT EDIT)
│       │   ├── models/               ← MongoDB schemas
│       │   │   ├── user.model.ts     ← All users (students, teachers, etc.)
│       │   │   ├── otp.model.ts      ← OTP verification codes
│       │   │   └── school.model.ts   ← School profiles
│       │   └── components/           ← ⭐ IMPORT FIGMA DESIGNS HERE
│       │       ├── auth/             ← Login, OTP, Register, Splash screens
│       │       ├── student/          ← Student dashboard, Memory Wall, etc.
│       │       ├── teacher/          ← Teacher dashboard
│       │       ├── admin/            ← Admin panel
│       │       ├── shared/           ← Reusable UI components (Button, Card)
│       │       └── layouts/          ← Page wrapper layouts
│       ├── .env.local                ← ⭐ YOUR SECRET KEYS (never commit this)
│       └── tsconfig.json
├── packages/
│   ├── ui/                           ← Shared UI components
│   ├── typescript-config/            ← TypeScript settings
│   └── eslint-config/                ← Linting rules
└── turbo.json                        ← Monorepo build config
```

---

## How the `@/` Import Alias Works

The `@/` symbol is a shortcut that points to the `src/` folder.

```typescript
// Instead of this (messy):
import connectDB from '../../../lib/mongodb';

// You write this (clean):
import connectDB from '@/lib/mongodb';
import { User } from '@/models/user.model';
import { LoginScreen } from '@/components/auth/LoginScreen';
```

This works because `tsconfig.json` has:
```json
"paths": { "@/*": ["./src/*"] }
```

---

## Step 1 — Install Dependencies

Open terminal in VS Code and run:

```bash
cd apps/web
npm install
```

If you get errors, run:
```bash
npm install --legacy-peer-deps
```

Install shadcn/ui for Apple-style components:
```bash
npx shadcn@latest init
npx shadcn@latest add button input card label textarea badge avatar separator
```

---

## Step 2 — Configure Your Environment Variables

Open `apps/web/.env.local` and fill in your real values.

### MongoDB URI (Most Important)
1. Go to cloud.mongodb.com → your cluster → Connect → Drivers
2. Copy the connection string
3. **REMOVE the `< >` angle brackets from the password**
4. Add `sukuna` as the database name at the end

```
# WRONG — has angle brackets:
MONGODB_URI=mongodb+srv://user:<mypassword>@cluster.mongodb.net/

# CORRECT — no angle brackets, has database name:
MONGODB_URI=mongodb+srv://user:mypassword@cluster.mongodb.net/sukuna?retryWrites=true&w=majority
```

### Test the connection
After filling in `.env.local`, run `npm run dev` and visit:
```
http://localhost:3000/api/test
```
You should see: `{"status":"success","message":"MongoDB connected!"}`

---

## Step 3 — Import Your Figma Designs

Each component file has a comment showing which Figma frame goes there.

### Method (Cursor Agent mode):
1. Open Cursor IDE → switch to **Agent mode**
2. Open the component file, e.g. `src/components/auth/LoginScreen.tsx`
3. In Cursor chat, paste your Figma frame URL and type:
   > "Replace the placeholder in LoginScreen.tsx with this Figma design.
   > Use TypeScript, Tailwind CSS, and shadcn/ui. Keep the API logic."
4. Cursor will replace the placeholder with your real design

### Component → Figma Frame mapping:
| Component File | Figma Page | Frame Name |
|---|---|---|
| `auth/SplashScreen.tsx` | Page 1 | Splash Screen |
| `auth/LoginScreen.tsx` | Page 1 | Login |
| `auth/OTPVerificationScreen.tsx` | Page 1 | OTP Verification |
| `auth/RegisterScreen.tsx` | Page 1 | Register |
| `student/StudentDashboard.tsx` | Page 2 | Student Dashboard |
| `teacher/TeacherDashboard.tsx` | Page 3 | Teacher Dashboard |
| `admin/AdminPanel.tsx` | Page 5 | Admin Panel |
| `student/MemoryWall.tsx` | From zip | Add Memory Section |

---

## Step 4 — Things YOU Must Do (Cannot be automated)

### ① MongoDB Atlas
- [ ] Create database named `sukuna`
- [ ] Create 10 collections: `users`, `schools`, `otps`, `attendance`, `assignments`, `results`, `notices`, `memories`, `timetables`, `notifications`
- [ ] Set Network Access to `0.0.0.0/0` for development
- [ ] Copy connection string to `.env.local` (NO angle brackets around password)

### ② Sparrow SMS (Nepal OTP)
- [ ] Register free at sparrowsms.com
- [ ] Go to Dashboard → get your API Token
- [ ] Add to `.env.local`: `SPARROW_SMS_TOKEN=your-token`
- [ ] Add credit to your account (minimum NPR 100)

### ③ Cloudinary (File uploads)
- [ ] Create free account at cloudinary.com
- [ ] Dashboard → copy Cloud Name, API Key, API Secret
- [ ] Add all three to `.env.local`

### ④ Firebase (Push notifications)
- [ ] Create project at console.firebase.google.com
- [ ] Project Settings → Service Accounts → Generate new private key
- [ ] Add credentials to `.env.local`

### ⑤ Google OAuth (Social login)
- [ ] Go to console.cloud.google.com
- [ ] Create project → APIs & Services → Credentials → OAuth 2.0
- [ ] Add `http://localhost:3000` to authorized origins
- [ ] Add credentials to `.env.local`

### ⑥ Figma Designs
- [ ] Design Page 1: Auth screens (Splash, Login, Register, OTP)
- [ ] Design Page 7: Design System (colors, fonts, buttons) — do this FIRST
- [ ] Export each frame and import into component files using Cursor Agent

### ⑦ Before Launch (production)
- [ ] Change `NEXTAUTH_SECRET` to a real random 32-character string
- [ ] Change MongoDB Network Access from `0.0.0.0/0` to specific IPs
- [ ] Set `NEXTAUTH_URL` to your real domain
- [ ] Switch Stripe from test keys to live keys

---

## Running the App

```bash
# From project root — starts everything
npm run dev

# OR from apps/web — starts only the web app
cd apps/web
npm run dev
```

Open: http://localhost:3000
Test DB: http://localhost:3000/api/test

---

## API Endpoints Built

| Method | Endpoint | What it does |
|--------|----------|-------------|
| GET | `/api/test` | Test MongoDB connection |
| POST | `/api/auth/register` | Create new user account |
| POST | `/api/auth/login` | Login with phone + password |
| POST | `/api/auth/otp/send` | Send OTP via Sparrow SMS |
| POST | `/api/auth/otp/verify` | Verify OTP code |

---

## Nepal DNS Issue (If MongoDB won't connect)

If you see `querySrv ECONNREFUSED`, your ISP is blocking DNS.

**Fix:** Install ProtonVPN (free) → connect to any server → try again.
Or use Google DNS: Settings → Network → DNS → `8.8.8.8` / `8.8.4.4`

