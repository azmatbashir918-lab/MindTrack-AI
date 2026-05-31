# MindTrack AI - System Architecture

**Project:** Production-ready Habit & Mood Tracking SaaS  
**Stack:** FastAPI + PostgreSQL + React + OpenAI  
**Status:** Planning Phase

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        MindTrack AI                             │
└─────────────────────────────────────────────────────────────────┘
         ↑                              ↑                      ↑
    [React SPA]               [Mobile App]           [Admin Portal]
    Vercel                    Expo/React Native      Internal Dashboard
         │                              │                      │
         └──────────────────────────────┴──────────────────────┘
                              ↓
         ┌───────────────────────────────────────────────┐
         │          API Gateway / FastAPI Server         │
         │         (Render.com / AWS Lambda)            │
         └───────────────────────────────────────────────┘
                    ↓                  ↓                ↓
           ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
           │   Auth       │  │  Core API    │  │   AI Engine  │
           │  (JWT/OAuth) │  │  (CRUD OPs)  │  │  (OpenAI)    │
           └──────────────┘  └──────────────┘  └──────────────┘
                    │              │                  │
                    └──────────────┴──────────────────┘
                              ↓
                    ┌──────────────────────┐
                    │   PostgreSQL DB      │
                    │  (Supabase / AWS RDS)│
                    └──────────────────────┘
                              ↓
                    ┌──────────────────────┐
                    │   Redis Cache        │
                    │ (Optional - for chat)|
                    └──────────────────────┘
```

---

## 2. Database Schema

### Core Tables

#### `users`
```sql
- id (UUID, PK)
- email (String, UNIQUE)
- username (String, UNIQUE)
- password_hash (String)
- first_name (String)
- last_name (String)
- avatar_url (String)
- bio (Text)
- timezone (String)
- theme (String: 'dark' | 'light')
- is_email_verified (Boolean)
- is_active (Boolean)
- created_at (DateTime)
- updated_at (DateTime)
- deleted_at (DateTime, nullable)
```

#### `habits`
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- name (String)
- description (Text)
- category (String: 'fitness' | 'study' | 'work' | 'health' | 'personal')
- frequency (String: 'daily' | 'weekly' | 'monthly')
- target_days (Integer: 1-7)
- color (String: hex)
- icon (String)
- reminder_time (Time, nullable)
- reminder_enabled (Boolean)
- is_active (Boolean)
- start_date (DateTime)
- end_date (DateTime, nullable)
- created_at (DateTime)
- updated_at (DateTime)
- UNIQUE(user_id, name)
```

#### `habit_completions`
```sql
- id (UUID, PK)
- habit_id (UUID, FK)
- user_id (UUID, FK)
- completed_at (DateTime)
- notes (Text)
- created_at (DateTime)
```

#### `mood_entries`
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- mood_level (String: 'excellent' | 'good' | 'neutral' | 'bad' | 'very_bad')
- mood_score (Integer: 1-5)
- notes (Text)
- energy_level (Integer: 1-10)
- stress_level (Integer: 1-10)
- tags (JSON Array)
- created_at (DateTime)
```

#### `chat_messages`
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- role (String: 'user' | 'assistant')
- content (Text)
- tokens_used (Integer)
- created_at (DateTime)
```

#### `ai_reports`
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- report_type (String: 'daily' | 'weekly' | 'monthly')
- title (String)
- content (JSON)
- insights (JSON Array)
- recommendations (JSON Array)
- generated_at (DateTime)
- created_at (DateTime)
```

#### `notifications`
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- type (String: 'reminder' | 'achievement' | 'insight' | 'report')
- title (String)
- message (Text)
- is_read (Boolean)
- is_sent (Boolean)
- created_at (DateTime)
```

#### `achievements`
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- achievement_type (String)
- title (String)
- description (Text)
- badge_icon (String)
- unlocked_at (DateTime)
- created_at (DateTime)
```

#### `settings`
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- notifications_enabled (Boolean)
- ai_suggestions_enabled (Boolean)
- daily_digest_enabled (Boolean)
- digest_time (Time)
- language (String)
- created_at (DateTime)
- updated_at (DateTime)
```

---

## 3. API Endpoints Structure

### Authentication Routes
```
POST   /api/auth/register              - Register new user
POST   /api/auth/login                 - Login with email & password
POST   /api/auth/logout                - Logout (invalidate token)
POST   /api/auth/refresh               - Refresh JWT token
POST   /api/auth/forgot-password       - Request password reset
POST   /api/auth/reset-password        - Reset password with token
POST   /api/auth/verify-email          - Verify email address
GET    /api/auth/me                    - Get current user profile
```

### User Routes
```
GET    /api/users/{id}                 - Get user profile
PUT    /api/users/{id}                 - Update user profile
DELETE /api/users/{id}                 - Delete account
PUT    /api/users/{id}/password        - Change password
GET    /api/users/{id}/settings        - Get user settings
PUT    /api/users/{id}/settings        - Update user settings
```

### Habits Routes
```
GET    /api/habits                     - List all user habits
POST   /api/habits                     - Create new habit
GET    /api/habits/{id}                - Get habit details
PUT    /api/habits/{id}                - Update habit
DELETE /api/habits/{id}                - Delete habit
POST   /api/habits/{id}/complete       - Mark habit complete
GET    /api/habits/{id}/history        - Get completion history
GET    /api/habits/stats               - Get habit statistics
```

### Mood Routes
```
GET    /api/mood                       - List mood entries
POST   /api/mood                       - Create mood entry
GET    /api/mood/{id}                  - Get mood entry
PUT    /api/mood/{id}                  - Update mood entry
DELETE /api/mood/{id}                  - Delete mood entry
GET    /api/mood/history               - Get mood history with filters
GET    /api/mood/analytics             - Get mood analytics
GET    /api/mood/trends                - Get mood trends
```

### AI Routes
```
POST   /api/ai/chat                    - Chat with AI assistant
GET    /api/ai/chat-history            - Get chat history
DELETE /api/ai/chat/{id}               - Delete chat message
POST   /api/ai/analyze                 - Analyze habits & mood
GET    /api/ai/report                  - Generate AI report
POST   /api/ai/insights                - Get personalized insights
```

### Notifications Routes
```
GET    /api/notifications              - List notifications
PUT    /api/notifications/{id}/read    - Mark as read
DELETE /api/notifications/{id}         - Delete notification
```

### Analytics Routes
```
GET    /api/analytics/dashboard        - Get dashboard data
GET    /api/analytics/habits           - Habit analytics
GET    /api/analytics/mood             - Mood analytics
GET    /api/analytics/productivity     - Productivity metrics
GET    /api/analytics/reports          - Generate reports (PDF/CSV)
```

---

## 4. Authentication Flow

```
1. User Registers
   POST /auth/register (email, password, name)
   → User created in DB with hashed password
   → Verification email sent
   → Return temporary token

2. Email Verification
   GET /auth/verify-email?token=xxx
   → Token validated
   → User account activated

3. User Logs In
   POST /auth/login (email, password)
   → Credentials verified
   → JWT token generated (access_token + refresh_token)
   → Tokens returned to client

4. API Requests
   GET /api/habits
   Header: Authorization: Bearer {access_token}
   → Token validated via middleware
   → Request processed if valid

5. Token Refresh
   POST /auth/refresh (refresh_token)
   → Refresh token validated
   → New access_token generated
   → New refresh_token returned

6. Logout
   POST /auth/logout (refresh_token)
   → Refresh token invalidated
   → User session ended
```

---

## 5. Project Structure

```
mindtrack-ai/
├── backend/                          # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                   # FastAPI app
│   │   ├── config.py                 # Config & env vars
│   │   ├── core/
│   │   │   ├── security.py           # JWT & password utils
│   │   │   ├── constants.py          # App constants
│   │   │   └── exceptions.py         # Custom exceptions
│   │   ├── db/
│   │   │   ├── base.py               # SQLAlchemy base
│   │   │   ├── session.py            # DB session manager
│   │   │   └── models/
│   │   │       ├── __init__.py
│   │   │       ├── user.py           # User model
│   │   │       ├── habit.py          # Habit models
│   │   │       ├── mood.py           # Mood models
│   │   │       ├── chat.py           # Chat models
│   │   │       └── notification.py   # Notification models
│   │   ├── schemas/                  # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── habit.py
│   │   │   ├── mood.py
│   │   │   ├── chat.py
│   │   │   └── common.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py           # Auth endpoints
│   │   │   │   ├── users.py          # User endpoints
│   │   │   │   ├── habits.py         # Habit endpoints
│   │   │   │   ├── mood.py           # Mood endpoints
│   │   │   │   ├── ai.py             # AI endpoints
│   │   │   │   ├── notifications.py  # Notification endpoints
│   │   │   │   └── analytics.py      # Analytics endpoints
│   │   │   └── dependencies.py       # Shared dependencies
│   │   ├── services/                 # Business logic
│   │   │   ├── auth_service.py
│   │   │   ├── habit_service.py
│   │   │   ├── mood_service.py
│   │   │   ├── ai_service.py
│   │   │   ├── analytics_service.py
│   │   │   └── email_service.py
│   │   ├── utils/
│   │   │   ├── email.py              # Email helpers
│   │   │   ├── time.py               # Time utilities
│   │   │   └── validators.py         # Custom validators
│   │   └── middleware/
│   │       ├── __init__.py
│   │       ├── cors.py               # CORS middleware
│   │       ├── auth.py               # Auth middleware
│   │       └── error_handler.py      # Error handling
│   ├── migrations/                   # Alembic migrations
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions/
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_auth.py
│   │   ├── test_habits.py
│   │   ├── test_mood.py
│   │   └── test_ai.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── docker-compose.yml
│   └── README.md
│
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── LoadingSpinner.tsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── SignupForm.tsx
│   │   │   │   └── PasswordReset.tsx
│   │   │   ├── habits/
│   │   │   │   ├── HabitCard.tsx
│   │   │   │   ├── HabitForm.tsx
│   │   │   │   └── HabitList.tsx
│   │   │   ├── mood/
│   │   │   │   ├── MoodEntry.tsx
│   │   │   │   ├── MoodHistory.tsx
│   │   │   │   └── MoodChart.tsx
│   │   │   ├── charts/
│   │   │   │   ├── LineChart.tsx
│   │   │   │   ├── BarChart.tsx
│   │   │   │   └── PieChart.tsx
│   │   │   └── ai/
│   │   │       ├── ChatBox.tsx
│   │   │       └── Message.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── HabitsPage.tsx
│   │   │   ├── MoodPage.tsx
│   │   │   ├── AIChatPage.tsx
│   │   │   ├── ReportsPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useHabits.ts
│   │   │   ├── useMood.ts
│   │   │   └── useApi.ts
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── habits.ts
│   │   │   └── mood.ts
│   │   ├── stores/
│   │   │   ├── authStore.ts          # Zustand/Context
│   │   │   ├── habitStore.ts
│   │   │   └── moodStore.ts
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── theme.css
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── types/
│   │       ├── index.ts
│   │       ├── api.ts
│   │       └── models.ts
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── docs/
│   ├── API.md                        # API documentation
│   ├── DATABASE.md                   # Database design
│   ├── DEPLOYMENT.md                 # Deployment guide
│   ├── SETUP.md                      # Setup instructions
│   └── ARCHITECTURE.md               # This file
│
├── docker-compose.yml                # Local dev environment
├── .gitignore
└── README.md                         # Project README

```

---

## 6. Technology Decisions

| Component | Choice | Reason |
|-----------|--------|--------|
| **Backend Framework** | FastAPI | Fast, async, built-in OpenAPI docs |
| **Database** | PostgreSQL | Robust, scalable, great JSON support |
| **ORM** | SQLAlchemy | Flexible, powerful, great with async |
| **Authentication** | JWT (Pydantic) | Stateless, scalable, industry standard |
| **Password Hashing** | Argon2 via passlib | Secure, resistant to GPU attacks |
| **Email** | Sendgrid/AWS SES | Reliable transactional email |
| **File Storage** | AWS S3 / Supabase | Scalable image/document storage |
| **Frontend Framework** | React 18 + Vite | Fast builds, modern tooling |
| **Language** | TypeScript | Type safety, better DX |
| **Styling** | Tailwind CSS | Utility-first, consistent design |
| **State Management** | Zustand/Context | Lightweight, easy to learn |
| **HTTP Client** | Axios | Promise-based, interceptors |
| **Routing** | React Router v6 | Industry standard, feature-rich |
| **Charts** | Recharts | React-native, responsive, accessible |
| **Animations** | Framer Motion | Declarative, performant |
| **AI Integration** | OpenAI API | State-of-the-art LLMs, easy to use |
| **Caching** | Redis | Fast session/chat history caching |
| **Deployment** | Vercel (FE) + Render (BE) | Easy CI/CD, auto-scaling |

---

## 7. Security Considerations

- ✅ **Password Hashing:** Argon2 with passlib
- ✅ **JWT Tokens:** 15min access + 7day refresh tokens
- ✅ **HTTPS Only:** Enforce SSL/TLS
- ✅ **CORS:** Whitelist frontend origin
- ✅ **Rate Limiting:** 100 req/min per user
- ✅ **Input Validation:** Pydantic models for all inputs
- ✅ **SQL Injection:** SQLAlchemy ORM prevents SQL injection
- ✅ **CSRF:** SameSite cookies + token validation
- ✅ **Email Verification:** Confirm user email before activation
- ✅ **API Keys:** Store OpenAI key in environment variables
- ✅ **Secrets Management:** Use `.env` files (never commit)

---

## 8. Performance Optimizations

- **Database Indexing:** Indexes on frequently queried columns (user_id, created_at)
- **Query Optimization:** Use SQLAlchemy relationships efficiently
- **Caching Layer:** Redis for chat history & frequent queries
- **Pagination:** All list endpoints paginated (limit: 50)
- **Async Operations:** FastAPI async endpoints for I/O
- **Compression:** GZIP middleware for responses
- **CDN:** Vercel for static assets, CloudFront for media

---

## 9. Deployment Strategy

### Development
- Docker Compose (PostgreSQL + Backend + Redis)
- Local frontend dev server with Vite

### Staging
- Render for backend (free tier)
- Vercel for frontend
- Supabase for PostgreSQL

### Production
- Render (paid) for backend
- Vercel Pro for frontend
- AWS RDS for PostgreSQL
- CloudFront for CDN

---

## 10. Next Steps

1. ✅ Architecture finalized
2. ⏳ Create database schema (SQL)
3. ⏳ Set up FastAPI project structure
4. ⏳ Implement database models
5. ⏳ Build authentication system
6. ⏳ Create API endpoints
7. ⏳ Implement AI integration
8. ⏳ Build React frontend
9. ⏳ Integration testing
10. ⏳ Deploy to production

---

**Created:** 2026-05-31  
**Last Updated:** 2026-05-31  
**Architect:** Senior Tech Lead  
