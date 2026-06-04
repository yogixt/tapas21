# TAPAS21 — 21 Day Transformation App

> **Tagline:** 21 Days. One New You.
> An AI-powered personal transformation platform for weight loss, discipline, study consistency, and health.

---

## Table of Contents

1. [Product Requirements Document](#1-product-requirements-document)
2. [Tech Stack & Architecture](#2-tech-stack--architecture)
3. [Design System](#3-design-system)
4. [AI Integration](#4-ai-integration)
5. [Telegram Integration](#5-telegram-integration)
6. [Database Schema](#6-database-schema)
7. [Routes & API Endpoints](#7-routes--api-endpoints)
8. [Development Workflow](#8-development-workflow)
9. [Deployment](#9-deployment)
10. [Prompts](#10-prompts)

---

## 1. Product Requirements Document

### 1.1 Mission

Build a superfast, mobile-first full-stack webapp that helps users transform themselves in 21 days through structured habits: weight loss, diet, study, sleep, and exercise.

### 1.2 Target User

- Primary: Individuals wanting a structured 21-day transformation
- Handles from phone (mobile-first)
- Needs daily habit tracking, AI coaching, progress visualization

### 1.3 User Stories

| ID | Story | Status |
|---|---|---|
| US-01 | As a user, I can sign up and log in securely | ✅ |
| US-02 | As a user, I can see a welcome/landing page | ✅ |
| US-03 | As a user, I can view my dashboard with key stats (weight, study, streak, score) | ✅ |
| US-04 | As a user, I can complete 6 daily habits (wake 5am, yoga, walk, calories, protein, sleep) | ✅ |
| US-05 | As a user, I can log my weight and see a trend chart | ✅ |
| US-06 | As a user, I can log study hours across subjects | ✅ |
| US-07 | As a user, I can see a 55-day consistency heatmap | ✅ |
| US-08 | As a user, I can chat with an AI coach for motivation | ✅ |
| US-09 | As a user, I can write daily reflections with AI summaries | ✅ |
| US-10 | As a user, I can view achievements and level progression | ✅ |
| US-11 | As a user, I can connect Telegram for reminders | ✅ |
| US-12 | As a user, I can toggle notification settings | ✅ |
| US-13 | As a user, I can see AI-generated daily insights on the dashboard | ✅ |
| US-14 | As a user, I can track my 21-day challenge progress | ✅ |

### 1.4 Screens & Routes

| Route | Screen | Description |
|---|---|---|
| `/` | Welcome | Landing page with hero, CTA |
| `/login` | Login | Sign in with email/password |
| `/signup` | Signup | Create account |
| `/dashboard` | Home | Stats, insights, quick actions |
| `/dashboard/entries` | Today's Mission | 6-habit checklist, study, nutrition |
| `/dashboard/calendar` | Calendar | 55-day heatmap |
| `/dashboard/progress` | Progress | Score, weight chart, study bar |
| `/dashboard/weight` | Weight Tracker | Log weight, trend chart, goal tracking |
| `/dashboard/study` | Study Tracker | 6 subjects with +/-, weekly target |
| `/dashboard/coach` | AI Coach | Chat with LLM-powered coach |
| `/dashboard/reflection` | Daily Reflection | Journal with AI summary |
| `/dashboard/achievements` | Achievements | 6 badges, level progression |
| `/dashboard/notifications` | Notifications | Telegram connect, reminder toggles |

### 1.5 Data Model

**Entities:**
- **User** — id, name, email, passwordHash, telegramChatId, telegramCode, createdAt
- **DailyEntry** — id, userId, date, 6 booleans (habits), studyHours, actualCalories, actualProtein, actualWaterL, notes, createdAt
- **WeightRecord** — id, userId, date, weightKg, createdAt

### 1.6 Key Metrics

| Metric | Definition |
|---|---|
| Streak | Consecutive days with `wakeUp5am = true` |
| Score | (% of all habit checks completed across all days) |
| Challenge Day | Number of unique days with entries (max 21) |
| Study Total | Sum of all studyHours across entries (target: 63h) |
| Weight Loss | Start weight (85kg) minus latest weight |

---

## 2. Tech Stack & Architecture

### 2.1 Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Database | Turso (libSQL) — edge-ready SQLite |
| ORM | Drizzle ORM |
| Auth | Custom JWT (jose) + bcryptjs |
| AI | Groq API (Llama 3.1 8B) — free tier |
| Charts | Recharts |
| Telegram | Bot API via webhook |
| Icons | Lucide React |
| Dates | date-fns |
| Font | Inter (Google Fonts) |

### 2.2 Architecture

```
┌─────────────────────────────────────┐
│           Next.js 16 App             │
│  ┌───────────────────────────────┐  │
│  │   Server Components (RSC)     │  │
│  │  (data fetching, auth)        │  │
│  ├───────────────────────────────┤  │
│  │   Client Components           │  │
│  │  (interactivity, charts, AI)  │  │
│  ├───────────────────────────────┤  │
│  │   Server Actions              │  │
│  │  (save entries, weight, auth) │  │
│  ├───────────────────────────────┤  │
│  │   API Routes                  │  │
│  │  (AI chat, Telegram webhook)  │  │
│  └───────────────────────────────┘  │
│              │                      │
│              ▼                      │
│  ┌───────────────────────────────┐  │
│  │     Turso (libSQL) DB         │  │
│  │     (Edge-hosted SQLite)      │  │
│  └───────────────────────────────┘  │
│              │                      │
│              ▼                      │
│  ┌───────────────────────────────┐  │
│  │  External Services            │  │
│  │  • Groq (AI inference)        │  │
│  │  • Telegram Bot API           │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### 2.3 Auth Flow

```
Signup: Server Action → createUser (bcrypt) → createSession (JWT cookie) → redirect /dashboard
Login:  Server Action → verifyPassword → createSession → redirect /dashboard
Logout: Server Action → destroySession → redirect /
Protect: proxy.ts middleware + requireAuth() in layouts
```

---

## 3. Design System

### 3.1 Colors

```
Primary:    #FF6B35 (Saffron Orange)
Secondary:  #1F2937 (Deep Charcoal)
Success:    #22C55E (Green)
Surface:    #FAFAFA (Light Gray)
White:      #FFFFFF
Muted:      #6B7280
Border:     #E5E7EB
Text:       #111827
```

### 3.2 Typography

```
Font: Inter (sans-serif)
Weights: 400, 500, 600, 700
Scale: text-xs (12px) → text-lg (18px) → text-2xl (24px) → text-5xl (48px)
```

### 3.3 Components

- **Card** — white bg, 1px border, 16px radius, hover shadow
- **Card-sm** — same but 12px radius, 1rem padding
- **Btn-primary** — pill shape, orange bg, white text, hover lift
- **Btn-secondary** — pill shape, white bg, border, muted text
- **Input-field** — 12px radius, 1px border, focus orange ring
- **Toggle** — pill switch with smooth translate animation

---

## 4. AI Integration

### 4.1 Provider: Groq (Free Tier)

- Endpoint: `https://api.groq.com/openai/v1/chat/completions`
- Model: `llama-3.1-8b-instant`
- Auth: Bearer token via `GROQ_API_KEY` env var

### 4.2 Features

| Feature | API Route | Input | Output |
|---|---|---|---|
| AI Coach | `POST /api/ai/chat` | `{message, history}` | AI reply text |
| Reflection Summary | `POST /api/ai/reflect` | `{wentWell, improve, grateful}` | 2-3 sentence insight |
| Dashboard Insights | `GET /api/ai/insights` | (last 7 days habit data) | 2-3 actionable tips |

### 4.3 System Prompts

**Coach:**
```
You are a warm, encouraging AI health & transformation coach for the TAPAS21 app. Motivate users to stick to their 21-day challenge habits. Give specific, actionable advice. Be concise (2-4 sentences). Use a supportive, friendly tone. Reference their habits: wake up 5am, yoga/pranayama, study 3h, walk 45min, 1500 cal, protein 90g, sleep 10:30pm. Never be negative or critical.
```

**Reflection:**
```
Analyze this daily reflection and provide a brief, encouraging summary (2-3 sentences) that highlights patterns and growth.
```

**Insights:**
```
Based on the user's recent habit data, provide 2-3 brief, actionable insights for today. Be specific and encouraging.
```

---

## 5. Telegram Integration

### 5.1 Bot Setup

- Bot username: `@tapas21_bot`
- Webhook: `POST /api/telegram`
- Commands: `/start CODE`, `/start`, `/status`

### 5.2 Connection Flow

```
User clicks "Connect with Telegram"
  → GET /api/telegram/connect generates 8-char code, stores in DB
  → Page shows code and link to t.me/tapas21_bot
  → User sends "/start CODE" to bot
  → Telegram POSTs to webhook URL
  → Webhook finds user by code, stores chat_id, sends confirmation
  → Page polls /api/telegram/status every 2s → shows "Connected"
```

### 5.3 Reminder Types

| Type | Trigger | Message |
|---|---|---|
| Morning | 5 AM | Wake up, yoga, set intention |
| Study | Custom | Time to study |
| Walk | Custom | 45 min walk |
| Reflection | 10 PM | Reflect on your day |

---

## 6. Database Schema

```sql
-- Users
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  telegram_chat_id TEXT DEFAULT NULL,
  telegram_code TEXT DEFAULT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Daily habit entries
CREATE TABLE daily_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  date TEXT NOT NULL,
  wake_up_5am INTEGER DEFAULT 0,
  yoga_pranayama INTEGER DEFAULT 0,
  study_hours REAL DEFAULT 0,
  walk_swim INTEGER DEFAULT 0,
  calories_under_target INTEGER DEFAULT 0,
  protein_goal_hit INTEGER DEFAULT 0,
  sleep_before_1030pm INTEGER DEFAULT 0,
  actual_calories INTEGER DEFAULT 0,
  actual_protein REAL DEFAULT 0,
  actual_water_l REAL DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Weight records
CREATE TABLE weight_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  date TEXT NOT NULL,
  weight_kg REAL NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

---

## 7. Routes & API Endpoints

### 7.1 Pages (22 routes)

| Route | Type | Description |
|---|---|---|
| `/` | Static | Welcome page |
| `/login` | Static | Login page |
| `/signup` | Static | Signup page |
| `/dashboard` | Dynamic | Home dashboard |
| `/dashboard/entries` | Dynamic | Today's mission |
| `/dashboard/calendar` | Dynamic | Calendar heatmap |
| `/dashboard/progress` | Dynamic | Progress & charts |
| `/dashboard/weight` | Dynamic | Weight tracker |
| `/dashboard/study` | Dynamic | Study tracker |
| `/dashboard/coach` | Dynamic | AI Coach chat |
| `/dashboard/reflection` | Dynamic | Daily journal |
| `/dashboard/achievements` | Dynamic | Badges & levels |
| `/dashboard/notifications` | Dynamic | Settings |

### 7.2 API Routes (6 routes)

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/api/ai/chat` | POST | Session | AI Coach chat |
| `/api/ai/reflect` | POST | Session | Reflection summary |
| `/api/ai/insights` | GET | Session | Dashboard insights |
| `/api/telegram` | POST | None | Telegram bot webhook |
| `/api/telegram/connect` | GET | Session | Generate connect code |
| `/api/telegram/status` | GET | Session | Check connection status |

### 7.3 Server Actions

| Path | Purpose |
|---|---|
| `src/app/login/actions.ts` | Login auth |
| `src/app/signup/actions.ts` | Signup auth |
| `src/app/dashboard/actions.ts` | Logout |
| `src/app/dashboard/entries/actions.ts` | Save daily entry |
| `src/app/dashboard/weight/actions.ts` | Save weight record |

---

## 8. Development Workflow

### 8.1 Setup

```bash
git clone <repo>
cd tapas21
npm install
```

### 8.2 Environment Variables (`.env.local`)

```env
TURSO_DB_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_turso_token
AUTH_SECRET=your_random_secret
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_BOT_USERNAME=your_bot_username
GROQ_API_KEY=gsk_your_groq_key
```

### 8.3 Database

```bash
# Run migration (creates tables in Turso or local SQLite)
npm run db:migrate
```

### 8.4 Dev Server

```bash
npm run dev        # http://localhost:3000
npm run build      # Production build
npm run lint       # ESLint
```

### 8.5 File Structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout (Inter font)
│   ├── globals.css           # Tailwind + design tokens
│   ├── page.tsx              # Welcome page
│   ├── login/                # Login (page, form, action)
│   ├── signup/               # Signup (page, form, action)
│   ├── dashboard/
│   │   ├── layout.tsx        # Dashboard layout (sidebar, bottom nav)
│   │   ├── page.tsx          # Home dashboard
│   │   ├── actions.ts        # Logout action
│   │   ├── entries/          # Mission (page, form, action)
│   │   ├── calendar/         # Calendar + heatmap
│   │   ├── progress/         # Progress + weight-chart
│   │   ├── weight/           # Weight (page, tracker, action)
│   │   ├── study/            # Study tracker
│   │   ├── coach/            # AI Coach chat
│   │   ├── reflection/       # Daily reflection
│   │   ├── achievements/     # Achievements
│   │   └── notifications/    # Telegram settings
│   └── api/
│       ├── ai/               # Chat, reflect, insights
│       └── telegram/          # Webhook, connect, status
├── components/
│   ├── sidebar.tsx           # Desktop sidebar
│   ├── bottom-nav.tsx        # Mobile bottom nav
│   └── ai-insights.tsx       # Dashboard AI widget
├── lib/
│   ├── auth.ts               # JWT sessions, password hashing
│   ├── telegram.ts           # Send reminders
│   └── gemini.ts             # AI client (Groq)
└── db/
    ├── index.ts              # Turso client
    ├── schema.ts             # Drizzle schema
    └── migrate.ts            # Table creation script
proxy.ts                      # Auth middleware
```

### 8.6 Code Conventions

- **Server Components** — fetch data, pass props to client components
- **Client Components** — marked with `"use client"`, handle interactivity
- **Server Actions** — form mutations, `"use server"`
- **API Routes** — JSON APIs, Next.js `route.ts` handlers
- **Imports** — `@/` alias for `src/`
- **Formatting** — Tailwind utility classes inline, no CSS modules
- **No comments** in code (self-documenting)

---

## 9. Deployment

### 9.1 Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set env vars in Vercel dashboard:
# TURSO_DB_URL, TURSO_AUTH_TOKEN, AUTH_SECRET,
# TELEGRAM_BOT_TOKEN, TELEGRAM_BOT_USERNAME, GROQ_API_KEY
```

### 9.2 Post-Deploy Steps

1. Set Telegram webhook:
   ```bash
   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-app.vercel.app/api/telegram"
   ```

2. Verify webhook:
   ```bash
   curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
   ```

3. Generate strong AUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

---

## 10. Prompts

### 10.1 Initial Product Prompt

```
Design a modern, premium, mobile-first web application called Tapas21.

Product Name: TAPAS21
Tagline: 21 Days. One New You.

Mission: An AI-powered personal transformation platform that helps users lose weight, build discipline, study consistently, improve health, and transform their lives through structured 21-day challenges.

Design Style: Clean, elegant, modern, premium. Inspiration: Headspace, Notion, Habitify, Duolingo, Apple Fitness, Calm.

Color Palette:
- Primary: #FF6B35 (Saffron Orange)
- Secondary: #1F2937 (Deep Charcoal)
- Success: #22C55E
- Background: #FAFAFA
- Surface: #FFFFFF

Typography: Inter font. Clean spacing, excellent readability.

UX Philosophy: Should feel like a personal transformation operating system, not a habit tracker. Every screen should answer "Am I becoming better?"
```

### 10.2 Feature Prompts

Each feature was built with specific prompts:

- **Auth**: JWT-based sessions with bcrypt password hashing, Server Actions for signup/login/logout, proxy.ts middleware for route protection
- **Dashboard**: Single view aggregating all metrics — streak, score, day count, weight, study hours
- **AI Coach**: Chat interface with system prompt, suggestion chips, typing indicators
- **Telegram**: Webhook-based bot with one-time code linking, 4 reminder types
- **Design**: Premium light theme with card-based layout, rounded elements, subtle shadows

### 10.3 Refinement Prompts

- "Make it mobile-first" → responsive grid, bottom nav on mobile, sidebar on desktop
- "Show real data, not hardcoded" → wired sidebar day count to DB, added loading states
- "What did we do so far?" → maintained detailed session tracking
- Theme change: premium → doodle → back to premium
- AI provider switches: Gemini → NVIDIA → Groq (free)

---

*Generated: June 2026*
