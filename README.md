# TAPAS21 — 21-Day Transformation Tracker

A full-stack webapp + Telegram bot for tracking a 21-day personal transformation challenge (weight loss, study, sleep, exercise, diet) with AI coaching and reminders.

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Database** | Turso (SQLite edge DB, libsql) |
| **ORM** | Drizzle ORM |
| **Auth** | JWT (jose) + bcryptjs, Server Actions |
| **AI** | Groq (Llama 3.1 8B Instant, free tier) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Bot** | Telegram Bot API (webhook) |
| **Hosting** | Vercel (free tier) |
| **Cron** | GitHub Actions (every 5 min) |
| **Dates** | date-fns |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Phone/Desktop)                  │
│                  https://tapas21.vercel.app                  │
├─────────────────────────────────────────────────────────────┤
│                     Next.js 16 (Vercel)                      │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Pages (13)  │  │ API Routes   │  │ Server Actions   │  │
│  │ Dashboard,  │  │ /api/ai/*    │  │ Login, Signup,   │  │
│  │ Study,      │  │ /api/telegram│  │ Daily Entry,     │  │
│  │ Coach, etc  │  │ /api/reminders│  │ Weight Log       │  │
│  └─────────────┘  └──────────────┘  └───────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌──────────────┐ ┌──────────┐ ┌──────────────┐
│   Turso DB   │ │  Groq AI │ │  Telegram    │
│  (SQLite)    │ │ (Llama)  │ │  Bot API     │
│  aws-ap-south │ │ chat/    │ │  webhook     │
│  -1.turso.io │ │ reflect  │ │  push/pull   │
└──────────────┘ │ insights │ └──────────────┘
                 └──────────┘
```

## How It Works

### 1. User Journey
1. User signs up / logs in at `https://tapas21.vercel.app`
2. Dashboard shows: challenge progress, stats (weight, study, streak, score), AI insights
3. User tracks daily through:
   - **Mission page** — 6 habit checkboxes + study/nutrition inputs
   - **Weight tracker** — log weight, see trend chart
   - **Study tracker** — 7 subjects (DSA, LeetCode, ML, DL, LLMs, System Design, MLOps) with hour counters + LeetCode stats
   - **Reflection** — journaling with AI summary
   - **AI Coach** — real-time chat with Groq Llama

### 2. Telegram Bot (@tapas21_bot)
The bot acts like a mom checking in throughout the day:

| Time IST | Bot Message |
|---|---|
| 5:00 AM | "Beta uth gaye? Aaj ka din banana hai ab!" |
| 6:30 AM | "Yoga ho gaya? Main track kar leti hoon!" |
| 8:00 AM | "Phone rakh do beta! Jaake naha lo!" |
| 9:00 AM | "Padhai ka time! Kitna doge aaj?" |
| 12:30 PM | "Khana kha liya? Junk food toh nahi na?" |
| 2:00 PM | "Kya kar rahe ho? Power nap liya?" |
| 5:00 PM | "Walk par jaao beta! 45 minute zaroor!" |
| 6:30 PM | "Nashta kya kiya? Healthy khao!" |
| 8:00 PM | "Aaj ka din kaisa raha? Dhyan kiya?" |
| 10:00 PM | "Sone ka time! Good night beta! 💤" |

**User replies are understood by AI (Groq)** — the bot parses natural language like "2 hours DSA kiya", "haan walk hua", "nahi aaj nahi soya" and updates the database automatically.

### 3. Reminder Pipeline
```
GitHub Actions (every 5 min)
        │
        ▼
  GET /api/reminders
        │
        ├── Checks IST time
        ├── Matches against schedule (10 slots)
        ├── Finds users with Telegram connected + toggle ON
        └── Sends reminder via Telegram Bot API
```

### 4. AI Integration
- **AI Coach** (`/api/ai/chat`) — full chat with system prompt about 21-day habits
- **Reflection Summary** (`/api/ai/reflect`) — summarizes journal entries
- **Dashboard Insights** (`/api/ai/insights`) — weekly pattern analysis
- **Telegram Chat** (`/api/telegram`) — understands user replies, updates daily_entries via AI

### 5. Auth Flow
```
Login/Signup (Server Action)
  → bcrypt password verify
  → JWT signed with jose (7-day expiry)
  → httpOnly cookie "session"
  → Middleware (proxy.ts) protects /dashboard/*
  → Server Components verify session via verifySession()
```

## Database Schema (Turso SQLite)

### Users
| Column | Type | Purpose |
|---|---|---|
| id | TEXT (PK) | UUID |
| name, email | TEXT | User profile |
| password_hash | TEXT | bcrypt hash |
| telegram_chat_id | TEXT | Linked Telegram chat |
| telegram_code | TEXT | One-time connect code |
| notify_morning..yogic_life | INTEGER (0/1) | Reminder toggles |
| bot_history | TEXT (JSON) | Conversation memory |

### daily_entries
| Column | Type | Purpose |
|---|---|---|
| id, user_id, date | TEXT | PK, FK, date |
| wake_up_5am, yoga_pranayama | INTEGER | Boolean habits |
| study_hours | REAL | Hours studied |
| walk_swim | INTEGER | Walk/swim done |
| calories_under_target, protein_goal_hit | INTEGER | Diet tracking |
| sleep_before_1030pm | INTEGER | Sleep tracking |
| actual_calories, actual_protein, actual_water_l | REAL | Actual logged values |
| notes | TEXT | Journal text |

### weight_records
| Column | Type | Purpose |
|---|---|---|
| id, user_id, date | TEXT | PK, FK, date |
| weight_kg | REAL | Weight log |

## Routes

### Pages (13)
| Route | Feature |
|---|---|
| `/` | Welcome / landing |
| `/login` | Login |
| `/signup` | Signup |
| `/dashboard` | Home — stats, AI insights, quick actions |
| `/dashboard/entries` | Mission — 6 habits + nutrition |
| `/dashboard/calendar` | 55-day consistency heatmap |
| `/dashboard/progress` | Transformation score + weight chart |
| `/dashboard/weight` | Weight tracker + trend |
| `/dashboard/study` | 7-subject tracker + LeetCode stats |
| `/dashboard/coach` | AI Coach chat |
| `/dashboard/reflection` | Journal + AI summary |
| `/dashboard/achievements` | 6 badges + levels |
| `/dashboard/notifications` | Telegram connect + toggles |

### API Routes (8)
| Route | Method | Purpose |
|---|---|---|
| `/api/telegram` | POST | Telegram webhook (commands + chat) |
| `/api/telegram/connect` | GET | Generate one-time connect code |
| `/api/telegram/status` | GET | Check if Telegram is connected |
| `/api/reminders` | GET | Cron job endpoint, sends scheduled reminders |
| `/api/notifications` | GET/POST | Read/save notification toggles |
| `/api/ai/chat` | POST | AI Coach conversation |
| `/api/ai/reflect` | POST | Reflection summary |
| `/api/ai/insights` | GET | Dashboard insights |
| `/api/leetcode` | POST | Proxy LeetCode GraphQL stats |

## Deployment

### Vercel
Automatic deploy from GitHub. Env vars set in Vercel dashboard:
- `TURSO_DB_URL`, `TURSO_AUTH_TOKEN` — Turso database
- `AUTH_SECRET` — random 32-byte base64 (for JWT)
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME` — Telegram bot
- `GROQ_API_KEY` — Groq AI inference

### Telegram Webhook
Set after deployment:
```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://tapas21.vercel.app/api/telegram"
```

### Cron (GitHub Actions)
File: `.github/workflows/reminders.yml`
Pings `/api/reminders` every 5 minutes. Runs on GitHub's free infrastructure.

## Design System
- **Font**: Inter (sans-serif)
- **Background**: `#FAFAFA`
- **Accent**: `#FF6B35` (saffron orange)
- **Cards**: `.card` (rounded-2xl, shadow-sm, bg-white)
- **Buttons**: `.btn-primary` (bg-[#FF6B35], rounded-xl)
- **Inputs**: `.input-field` (rounded-xl, border)
- **Mobile-first**: Bottom nav on mobile, sidebar on desktop
