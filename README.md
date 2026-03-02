<p align="center">
  <img src="https://img.shields.io/badge/MindGuardAI-Proactive%20Mental%20Health-6C63FF?style=for-the-badge&logo=brain&logoColor=white" alt="MindGuardAI Banner" />
</p>

<h1 align="center">🧠 MindGuardAI</h1>
<p align="center"><b>An AI-Powered Proactive Mental Health Platform</b></p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Groq_AI-Llama_3.3-FF6B35?style=flat-square" alt="Groq AI" />
  <img src="https://img.shields.io/badge/Socket.IO-4.8-010101?style=flat-square&logo=socketdotio" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

---

## 📌 Table of Contents

- [Problem Statement](#-problem-statement)
- [Proposed Solution](#-proposed-solution)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [AI Services](#-ai-services)
- [API Endpoints](#-api-endpoints)
- [User Roles & Flows](#-user-roles--flows)
- [Deployment](#-deployment)
- [Impact & Significance](#-impact--significance)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔴 Problem Statement

Mental health disorders — including **depression**, **anxiety**, and **suicidal ideation** — are rising at an alarming rate globally, particularly among **youth** and **working professionals**.

### The Crisis in Numbers
- **1 in 4** people worldwide will be affected by a mental health disorder at some point in their lives *(WHO)*
- **75%** of mental health conditions begin before age 24
- Less than **50%** of those affected receive any form of treatment
- Suicide is the **4th leading cause** of death among 15–29 year-olds globally

### Why Current Solutions Fall Short

| Problem | Description |
|---------|-------------|
| **Reactive, Not Proactive** | Traditional mental health apps provide generic advice or connect users to therapists *only after a crisis has emerged* |
| **Lack of Personalization** | One-size-fits-all approaches fail to address individual emotional patterns and triggers |
| **No Real-Time Analysis** | Most platforms lack the ability to detect emotional shifts or sentiment changes in real time |
| **No Early Detection** | Without NLP-driven analysis, early signs of deterioration go unnoticed |
| **Fragmented Experience** | Users must juggle between separate apps for journaling, mood tracking, therapy booking, and community support |
| **Delayed Intervention** | Many individuals suffer in silence until their conditions worsen, missing the critical window for early intervention |

> **The fundamental gap:** There is no unified platform that proactively monitors user well-being through AI-driven text analysis, provides real-time emotional feedback, and connects users with timely professional support — all in one place.

---

## 💡 Proposed Solution

**MindGuardAI** is an AI-powered mental health platform designed to **detect early signs of mental health deterioration** using **Natural Language Processing (NLP)** on user-generated text from chat and journaling modules. It proactively identifies emotional shifts, stress levels, depressive patterns, and crisis indicators to provide:

### Core Value Proposition

```
┌─────────────────────────────────────────────────────────────┐
│                     MindGuardAI Pipeline                    │
│                                                             │
│   User Input          AI Analysis           Intervention    │
│   ─────────          ───────────           ────────────     │
│   📝 Journals    →   🧠 NLP Sentiment  →   ⚡ Self-Help    │
│   💬 Chat Logs   →   📊 Pattern Detect  →   🚨 Alerts      │
│   📋 Screening   →   🎯 Risk Scoring   →   👨‍⚕️ Therapist   │
│   😊 Mood Logs   →   📈 Trend Analysis  →   📱 Dashboard   │
└─────────────────────────────────────────────────────────────┘
```

1. **Immediate in-app emotional feedback** and self-help resources tailored to the user's current state
2. **Early warning alerts** to users, therapists, or trusted contacts when risk is detected
3. **A therapist/counselor dashboard** to monitor patient mental health trends over time
4. **Institutional insights** for administrators to understand campus-wide mental health trends

> By combining **real-time AI analysis** with **secure communication channels**, the platform empowers users and caregivers to intervene **before a crisis occurs**.

---

## ✨ Key Features

### 🎯 For Students / Users

| Feature | Description |
|---------|-------------|
| **AI Counselor Chat** | Real-time conversational AI powered by Llama 3.3 70B via Groq, providing empathetic, supportive responses through Socket.IO WebSocket connections |
| **Mental Health Screening** | Clinically-inspired assessments (GAD-7 / PHQ-9 style) with AI-generated analysis reports categorizing risk as low, moderate, or severe |
| **Mood Tracking** | Daily mood logging with scores and optional notes, enabling longitudinal trend visualization |
| **Personalized Wellness Actions** | AI-generated micro-habits and actionable wellness recommendations based on current mood context |
| **Resource Library** | Curated self-help resources including articles, videos, audio guides, and guides categorized by concern (anxiety, depression, stress, etc.) |
| **Peer Support Forum** | Anonymous or named community posts with reply threads, supporting peer connection and shared experiences |
| **Appointment Booking** | Schedule online or in-person sessions with counselors, with status tracking (pending, confirmed, cancelled, completed) |
| **Secure Messaging** | Direct messaging to counselors with real-time delivery via Socket.IO |

### 👨‍⚕️ For Counselors

| Feature | Description |
|---------|-------------|
| **Counselor Dashboard** | Monitor assigned patients, view mood trends, screening results, and appointment schedules |
| **Crisis Alerts** | Real-time broadcast alerts when AI detects severe risk in user-generated text |
| **Appointment Management** | View, confirm, and manage student appointment requests |

### 🏛️ For Administrators

| Feature | Description |
|---------|-------------|
| **Admin Dashboard** | Institutional-level analytics with aggregate mood data, user statistics, and engagement metrics |
| **AI Institutional Insights** | Groq-powered analysis of aggregate anonymous student data identifying top concerns, collective mood, and strategic intervention recommendations |
| **Daily Insight Snapshots** | Auto-generated daily summaries of platform-wide mental health trends |
| **Content Moderation** | Flagged post management in the peer support forum |

### 🛡️ Platform-Wide

| Feature | Description |
|---------|-------------|
| **Role-Based Access Control** | Three distinct roles — Student, Counselor, Admin — each with tailored dashboards and permissions |
| **Structured Onboarding** | Multi-step onboarding flow with role selection, profile setup, and initial screening |
| **Real-Time Crisis Detection** | Every user text input is analyzed for crisis indicators (suicidal ideation, self-harm, extreme distress) with immediate alert escalation |
| **Secure Authentication** | Passport.js local strategy with bcrypt password hashing and session-based auth |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                            │
│  ┌────────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │  React 18  │  │  Wouter  │  │ Radix UI │  │ TanStack React     │ │
│  │  + Vite    │  │ (Router) │  │ + Shadcn │  │ Query (Data Fetch) │ │
│  └──────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬───────────┘ │
│         └──────────────┴─────────────┴─────────────────┘             │
│                              │                                       │
│              HTTP REST API   │   WebSocket (Socket.IO)               │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────────┐
│                          SERVER                                      │
│  ┌──────────────────────┐    │    ┌────────────────────────────────┐ │
│  │   Express.js 4.21    │◄───┘    │     Socket.IO Server           │ │
│  │   + TypeScript       │         │  (Real-time AI Chat & Alerts)  │ │
│  └──────────┬───────────┘         └──────────────┬─────────────────┘ │
│             │                                    │                   │
│  ┌──────────┴──────────────────────────┐         │                   │
│  │         Route Handlers              │         │                   │
│  │  • Auth (Passport.js + bcrypt)      │         │                   │
│  │  • Onboarding                       │         │                   │
│  │  • Screening + AI Analysis          │         │                   │
│  │  • Mood Tracking                    │         │                   │
│  │  • Appointments                     │         │                   │
│  │  • Forum (Posts + Replies)          │         │                   │
│  │  • Resources                        │         │                   │
│  │  • Admin Analytics                  │         │                   │
│  └──────────┬──────────────────────────┘         │                   │
│             │                                    │                   │
│  ┌──────────┴────────────────────────────────────┴─────────────────┐ │
│  │                    AI Service Layer (Groq SDK)                   │ │
│  │  ┌────────────────┐  ┌───────────────┐  ┌────────────────────┐  │ │
│  │  │ Crisis Detect  │  │ Assessment    │  │ Wellness Actions   │  │ │
│  │  │ (Real-time NLP)│  │ Analysis      │  │ (Micro-Habits)     │  │ │
│  │  └────────────────┘  └───────────────┘  └────────────────────┘  │ │
│  │  ┌────────────────┐  ┌───────────────────────────────────────┐  │ │
│  │  │ AI Chat        │  │ Institutional Insights (Admin)        │  │ │
│  │  │ Completion     │  │ (Aggregate Analysis)                  │  │ │
│  │  └────────────────┘  └───────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│             │                                                        │
│  ┌──────────┴──────────────────────────────────────────────────────┐ │
│  │              Drizzle ORM (Type-safe Query Builder)              │ │
│  └──────────┬──────────────────────────────────────────────────────┘ │
└─────────────┼────────────────────────────────────────────────────────┘
              │
┌─────────────┴────────────────────────────────────────────────────────┐
│                     PostgreSQL 15 (Database)                         │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌──────────┐ │
│  │  users   │ │ sessions │ │ mood      │ │ screen.  │ │ posts    │ │
│  │          │ │          │ │ _entries  │ │ assess.  │ │ + replies│ │
│  ├──────────┤ ├──────────┤ ├───────────┤ ├──────────┤ ├──────────┤ │
│  │ appoint. │ │resources │ │ conversa. │ │ messages │ │ daily    │ │
│  │          │ │          │ │           │ │          │ │ insights │ │
│  └──────────┘ └──────────┘ └───────────┘ └──────────┘ └──────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | Component-based UI framework |
| **TypeScript** | Type-safe development |
| **Vite 7** | Lightning-fast build tool and dev server |
| **Wouter** | Lightweight client-side routing |
| **TanStack React Query** | Server state management and data fetching |
| **Radix UI + Shadcn** | Accessible, composable UI component library |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **Recharts** | Data visualization for mood trends and analytics |
| **Framer Motion** | Smooth animations and transitions |
| **Socket.IO Client** | Real-time bidirectional communication |
| **React Hook Form + Zod** | Form management with schema validation |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Express.js 4.21** | HTTP server and REST API framework |
| **TypeScript** | End-to-end type safety |
| **Passport.js** | Authentication middleware (Local Strategy) |
| **bcrypt.js** | Secure password hashing |
| **Socket.IO** | WebSocket server for real-time chat and alerts |
| **Multer** | File upload handling |
| **express-session** | Session management with PostgreSQL store |

### AI / ML
| Technology | Purpose |
|-----------|---------|
| **Groq SDK** | Ultra-fast LLM API inference |
| **Llama 3.3 70B Versatile** | Primary LLM for all AI features — crisis detection, chat, assessment analysis, wellness actions, institutional insights |
| **NLP Sentiment Analysis** | Real-time text analysis for risk scoring |

### Database & ORM
| Technology | Purpose |
|-----------|---------|
| **PostgreSQL 15** | Relational database for all persistent data |
| **Drizzle ORM** | Type-safe SQL query builder and schema management |
| **Drizzle Kit** | Database migration and studio tools |
| **connect-pg-simple** | PostgreSQL session store |

### DevOps & Deployment
| Technology | Purpose |
|-----------|---------|
| **Docker** | Containerized deployment with multi-stage builds |
| **Docker Compose** | Multi-container orchestration (app + database) |
| **Node 20 Alpine** | Lightweight production container image |
| **esbuild** | Server-side bundling for production |

---

## 📁 Project Structure

```
MindGuardAI/
│
├── client/                          # Frontend React Application
│   └── src/
│       ├── App.tsx                  # Root component with routing
│       ├── main.tsx                 # Application entry point
│       ├── index.css                # Global styles (Tailwind)
│       ├── components/              # Reusable UI components (49 files)
│       │   ├── ui/                  # Shadcn/Radix UI primitives
│       │   ├── Layout.tsx           # App shell with sidebar navigation
│       │   └── Loader.tsx           # Loading spinner component
│       ├── hooks/                   # Custom React hooks (8 files)
│       │   └── use-auth.ts          # Authentication hook
│       ├── lib/                     # Utility functions
│       │   └── queryClient.ts       # TanStack Query configuration
│       └── pages/                   # Page-level components
│           ├── Dashboard.tsx        # Student/User main dashboard
│           ├── Login.tsx            # Authentication page
│           ├── Mood.tsx             # Mood tracking interface
│           ├── Chat.tsx             # Peer messaging
│           ├── Forum.tsx            # Peer support forum
│           ├── Resources.tsx        # Self-help resource library
│           ├── Appointments.tsx     # Appointment scheduling
│           ├── ai-chat/Chat.tsx     # AI Counselor chat interface
│           ├── screening/           # Mental health assessment
│           │   └── Assessment.tsx   # GAD-7/PHQ-9 style questionnaire
│           ├── onboarding/          # User onboarding flow
│           │   ├── Role.tsx         # Role selection (student/counselor)
│           │   └── Profile.tsx      # Profile setup
│           ├── counselor/           # Counselor-specific views
│           │   └── CounselorDashboard.tsx
│           └── admin/               # Admin-specific views
│               └── AdminDashboard.tsx
│
├── server/                          # Backend Express Application
│   ├── index.ts                     # Server entry point
│   ├── routes.ts                    # Main API route definitions
│   ├── auth.ts                      # Passport.js authentication setup
│   ├── storage.ts                   # Database access layer (DAL)
│   ├── socket.ts                    # Socket.IO configuration
│   ├── db.ts                        # PostgreSQL connection (Drizzle)
│   ├── static.ts                    # Static file serving
│   ├── vite.ts                      # Vite dev server integration
│   ├── services/
│   │   ├── ai.ts                    # AI service layer (Groq integration)
│   │   ├── openai.ts                # OpenAI client configuration
│   │   └── upload.ts                # File upload service
│   ├── routes/
│   │   ├── onboarding.ts            # Onboarding API routes
│   │   └── screening.ts             # Screening assessment routes
│   └── lib/
│       └── ipv4-fix.ts              # Node.js DNS resolution fix
│
├── shared/                          # Shared types & schemas
│   ├── schema.ts                    # Database schema definitions
│   ├── routes.ts                    # API route contract types
│   └── models/
│       ├── auth.ts                  # User & session schemas
│       └── chat.ts                  # Conversation & message schemas
│
├── Dockerfile                       # Multi-stage production build
├── docker-compose.yml               # Full-stack deployment config
├── drizzle.config.ts                # Drizzle ORM configuration
├── vite.config.ts                   # Vite build configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies and scripts
└── .env.example                     # Environment variable template
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20.x
- **npm** >= 9.x
- **PostgreSQL** 15+ (or use Docker)
- **Groq API Key** ([Get one free at console.groq.com](https://console.groq.com))

### Option 1: Local Development

```bash
# 1. Clone the repository
git clone https://github.com/your-username/MindGuardAI.git
cd MindGuardAI

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables section)

# 4. Set up the database
# Ensure PostgreSQL is running, then:
npm run db:push

# 5. Start the development server
npm run dev
```

The application will be available at `http://localhost:5000`.

### Option 2: Docker Deployment

```bash
# 1. Clone the repository
git clone https://github.com/your-username/MindGuardAI.git
cd MindGuardAI

# 2. Start the full stack with Docker Compose
docker-compose up --build
```

This launches:
- **App container** on port `5000`
- **PostgreSQL** on port `5433` (mapped from internal 5432)

---

## 🔑 Environment Variables

Create a `.env` file in the project root based on `.env.example`:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes | `postgres://postgres:postgres@localhost:5432/mindfulspace` |
| `SESSION_SECRET` | Secret key for session encryption | ✅ Yes | — |
| `GROQ_API_KEY` | Groq API key for AI features | ⚠️ Recommended | Falls back to mock responses |
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `5000` |

> **Note:** If `GROQ_API_KEY` is not provided, all AI features gracefully degrade to intelligent mock responses — the platform remains fully functional.

---

## 🗄️ Database Schema

MindGuardAI uses **10 interconnected tables** managed by Drizzle ORM:

```
┌───────────────┐     ┌────────────────────┐     ┌──────────────────┐
│    users       │────▶│   appointments     │◀────│    counselors     │
│  (all roles)   │     │  (student ↔ couns.)│     │  (from users)    │
└───────┬────────┘     └────────────────────┘     └──────────────────┘
        │
        ├──────────────────┬──────────────────┬──────────────────┐
        │                  │                  │                  │
        ▼                  ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ mood_entries  │  │  screening   │  │    posts      │  │conversations │
│ (daily mood)  │  │ _assessments │  │  (forum)      │  │ (AI chat)    │
└──────────────┘  └──────────────┘  └──────┬───────┘  └──────┬───────┘
                                           │                  │
                                           ▼                  ▼
                                    ┌──────────────┐  ┌──────────────┐
                                    │   replies     │  │   messages   │
                                    │ (forum)       │  │  (AI chat)   │
                                    └──────────────┘  └──────────────┘

          ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
          │  resources    │  │daily_insights│  │   documents  │
          │ (self-help)   │  │(admin stats) │  │ (user docs)  │
          └──────────────┘  └──────────────┘  └──────────────┘
```

### Table Details

| Table | Description | Key Fields |
|-------|-------------|------------|
| `users` | All platform users (students, counselors, admins) | id, email, username, password, role, onboardingStatus, latestRiskLevel |
| `sessions` | Server-side session storage | sid, sess (JSON), expire |
| `appointments` | Counseling session bookings | studentId, counselorId, date, status, type |
| `mood_entries` | Daily mood scores and notes | userId, score (1-10), note, createdAt |
| `screening_assessments` | PHQ-9/GAD-7 results with AI reports | userId, score, riskLevel, answers (JSON), aiAnalysis |
| `posts` | Peer support forum threads | authorId, title, content, isAnonymous, isFlagged |
| `replies` | Forum thread responses | postId, authorId, content, isAnonymous |
| `conversations` | AI chat conversation metadata | title, createdAt |
| `messages` | Individual chat messages | conversationId, role, content |
| `resources` | Self-help content library | title, description, type, category, language |
| `daily_insights` | AI-generated platform analytics | summary, topConcerns (JSON), recommendation |
| `documents` | Uploaded user documents | userId, type, path, status |
| `institutional_trends` | Cached analytics data | category, value, period |

---

## 🤖 AI Services

MindGuardAI integrates **5 distinct AI capabilities**, all powered by **Groq's Llama 3.3 70B Versatile** model:

### 1. 🚨 Crisis Detection (`detectCrisis`)
- **Trigger:** Runs on user-generated text (forum posts, chat messages, mood notes)
- **Output:** Risk classification — `low` | `moderate` | `severe` with reasoning
- **Action:** Severe risk triggers real-time Socket.IO broadcast alerts to counselors
- **Fallback:** Keyword-based detection when API is unavailable

### 2. 📋 Assessment Analysis (`analyzeAssessmentAI`)
- **Trigger:** After completing a GAD-7/PHQ-9 style screening questionnaire
- **Output:** Empathetic, non-clinical summary with actionable self-care recommendations
- **Guardrails:** Never provides clinical diagnoses; stays supportive and advisory

### 3. 💬 AI Counselor Chat (`chatCompletionAI`)
- **Trigger:** Real-time via Socket.IO WebSocket connection
- **Output:** Supportive, empathetic conversational responses
- **Behavior:** Active listening, brief comforting responses, non-judgmental tone

### 4. ⚡ Personalized Wellness Actions (`getWellnessActions`)
- **Trigger:** Based on user's current mood score and note
- **Output:** 3 creative, specific micro-habits (not generic advice)
- **Examples:** "The Coffee Mindfulness Ritual", "5-Minute Sketch Break"

### 5. 🏛️ Institutional Insights (`getInstitutionalInsights`)
- **Trigger:** Admin requests aggregate analysis
- **Input:** Anonymous student forum posts and mood notes (up to 50 entries)
- **Output:** Collective mood summary, top 3 concerns, strategic intervention recommendation

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login with credentials |
| `POST` | `/api/auth/logout` | End session |
| `GET` | `/api/auth/me` | Get current user |

### Mood Tracking
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/mood` | Get user's mood history |
| `POST` | `/api/mood` | Log a new mood entry |
| `GET` | `/api/mood/wellness-actions` | Get AI-generated wellness recommendations |

### Screening
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/screening/submit` | Submit screening assessment |
| `GET` | `/api/screening/history` | Get assessment history |

### Forum
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/posts` | List all forum posts |
| `POST` | `/api/posts` | Create a new post |
| `GET` | `/api/posts/:id/replies` | Get replies for a post |
| `POST` | `/api/posts/:id/replies` | Reply to a post |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/appointments` | List user's appointments |
| `POST` | `/api/appointments` | Book a new appointment |
| `PUT` | `/api/appointments/:id` | Update appointment status |

### Resources
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/resources` | List all resources |
| `POST` | `/api/resources` | Add a new resource (admin) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/stats` | Platform-wide statistics |
| `GET` | `/api/admin/insights` | AI-generated institutional insights |

### WebSocket Events (Socket.IO)
| Event | Direction | Description |
|-------|-----------|-------------|
| `ai_counselor_message` | Client → Server | Send message to AI counselor |
| `ai_counselor_response` | Server → Client | Receive AI counselor reply |
| `join_chat` | Client → Server | Join a chat room |
| `crisis_alert` | Server → Client (broadcast) | Real-time crisis alert |

---

## 👥 User Roles & Flows

### 🎓 Student Flow
```
Register → Role Selection → Profile Setup → Initial Screening
    ↓
Dashboard (Mood Summary, Wellness Actions, Upcoming Appointments)
    ↓
┌──────────┬──────────┬───────────┬───────────┬──────────┐
│ AI Chat  │ Mood Log │ Forum     │ Resources │ Booking  │
│ (24/7)   │ (Daily)  │ (Peer)    │ (Self-    │ (Appt.)  │
│          │          │ Support)  │  Help)    │          │
└──────────┴──────────┴───────────┴───────────┴──────────┘
```

### 👨‍⚕️ Counselor Flow
```
Register → Role Selection (Counselor) → Profile Setup
    ↓
Counselor Dashboard
    ├── View assigned students' mood trends
    ├── Receive real-time crisis alerts
    ├── Manage appointments (confirm/cancel/complete)
    └── Message students directly
```

### 🏛️ Admin Flow
```
Login (Admin credentials)
    ↓
Admin Dashboard
    ├── View platform-wide statistics
    ├── Review AI-generated institutional insights
    ├── Monitor flagged forum posts
    └── Manage resources & content
```

---

## 🐳 Deployment

### Docker (Recommended for Production)

The project includes a **multi-stage Dockerfile** optimized for production:

```dockerfile
# Stage 1: Install dependencies
# Stage 2: Build application (Vite + esbuild)
# Stage 3: Production runner (Node 20 Alpine — minimal image)
```

```bash
# Build and run with Docker Compose
docker-compose up --build -d

# View logs
docker-compose logs -f app

# Stop
docker-compose down
```

### Manual Production Build

```bash
# Build frontend (Vite) + backend (esbuild)
npm run build

# Start production server
npm run start
```

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `tsx server/index.ts` | Start development server with hot reload |
| `npm run build` | `vite build && esbuild ...` | Build frontend and backend for production |
| `npm run start` | `node dist/index.js` | Run production server |
| `npm run check` | `tsc` | TypeScript type checking |
| `npm run db:push` | `drizzle-kit push` | Push schema changes to database |
| `npm run db:studio` | `drizzle-kit studio` | Open Drizzle Studio (visual DB explorer) |

---

## 🌍 Impact & Significance

### Direct Impact

| Impact Area | Description |
|-------------|-------------|
| **Early Intervention** | AI-driven crisis detection enables intervention *before* a mental health crisis escalates, potentially saving lives |
| **24/7 Accessibility** | AI counselor is available round-the-clock, removing barriers of time zones, scheduling, and stigma |
| **Democratized Mental Health** | Provides quality mental health screening and support to users who cannot afford traditional therapy |
| **Reduced Stigma** | Anonymous forum posting and private AI chat lower the barrier for help-seeking behavior |
| **Data-Driven Institutional Response** | Administrators can allocate mental health resources based on AI-identified trends rather than assumptions |

### Alignment with Global Goals

| SDG | Alignment |
|-----|-----------|
| **SDG 3: Good Health & Well-being** | Directly targets mental health awareness, prevention, and early intervention |
| **SDG 4: Quality Education** | Supports student well-being, reducing academic attrition due to untreated mental health conditions |
| **SDG 10: Reduced Inequalities** | Provides free, accessible mental health support regardless of socioeconomic status |

### Innovation Highlights

- **Proactive vs. Reactive:** Unlike traditional apps that wait for users to seek help, MindGuardAI actively monitors and alerts
- **NLP-Powered Risk Scoring:** Goes beyond simple keyword matching — uses a 70B-parameter LLM for nuanced understanding of emotional context
- **Institutional Intelligence:** Unique feature enabling campus-wide mental health trend analysis for strategic planning
- **Graceful Degradation:** All AI features include intelligent fallback mechanisms ensuring the platform remains functional even without API connectivity

---

## 🗺️ Future Roadmap

- [ ] **Multilingual Support** — Extend NLP analysis and UI to support Hindi, Spanish, French, and more
- [ ] **Wearable Integration** — Connect with smartwatches/fitness bands for biometric stress indicators (heart rate, sleep patterns)
- [ ] **Voice Analysis** — Detect emotional states from voice tone and speech patterns during audio journaling
- [ ] **Therapist Matching Algorithm** — AI-powered matching of students to counselors based on specialization and compatibility
- [ ] **Mobile App (React Native)** — Native iOS/Android app with push notifications for crisis alerts
- [ ] **Predictive Analytics** — Forecast potential mental health deterioration weeks in advance using longitudinal data
- [ ] **Group Therapy Sessions** — Virtual group support rooms with AI moderation
- [ ] **Integration with University LMS** — Correlate academic performance data with well-being indicators
- [ ] **HIPAA Compliance** — Full compliance for US healthcare data regulations
- [ ] **End-to-End Encryption** — Encrypt all chat messages and sensitive data at rest and in transit

---

## 🤝 Contributing

We welcome contributions from the community! Here's how to get started:

1. **Fork** the repository
2. Create a **feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. Open a **Pull Request**

### Development Guidelines
- Follow the existing TypeScript coding style
- Write descriptive commit messages
- Ensure all existing tests pass before submitting PRs
- Add documentation for new features

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <b>Built with ❤️ for mental health awareness and early intervention</b><br/>
  <i>Because everyone deserves support before the breaking point.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Mental%20Health-Matters-6C63FF?style=for-the-badge" alt="Mental Health Matters" />
</p>