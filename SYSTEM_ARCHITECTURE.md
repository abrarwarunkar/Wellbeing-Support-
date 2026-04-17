# MindfulSpace: System Architecture & Technical Deep Dive

This document provides a comprehensive, detailed explanation of the system architecture for **MindfulSpace**, an AI-powered proactive mental health platform. It covers everything from high-level infrastructure to minor implementation details, ensuring a thorough understanding of how the project operates under the hood.

---

## 1. High-Level Overview

MindfulSpace is designed as a monolithic full-stack web application with real-time capabilities. It acts proactively rather than reactively, utilizing Natural Language Processing (NLP) to perform real-time sentiment analysis, crisis detection, and tailored self-help generation based on user inputs. 

### Core Tech Stack
- **Frontend**: React 18, Vite, Wouter (Routing), TanStack React Query (State/Fetching), Tailwind CSS 4, Radix UI (Primitives), Shadcn UI (Components).
- **Backend**: Node.js 20.x, Express.js 4.21, TypeScript, Socket.IO.
- **Database**: PostgreSQL 15, Drizzle ORM.
- **AI/ML Layer**: Groq SDK heavily leveraging the `llama-3.3-70b-versatile` model.
- **Infrastructure**: Docker multi-stage builds.

---

## 2. Frontend Architecture

The client side is built for speed and responsiveness, located under `/client/src/`.

### 2.1 File & Component Structure
- **Global Settings & Styles**: `index.html` and `index.css` setup the Tailwind rules and base layout.
- **Entry Point**: `main.tsx` mounts the React tree, while `App.tsx` handles top-level routing (using `wouter`).
- **State Management**: Data fetching and caching are handled by `@tanstack/react-query` configured in `lib/queryClient.ts`.
- **UI Components**: The UI relies on accessible primitives from Radix UI mapped into highly reusable components (Shadcn UI approach) within `<appRoot>/components/ui/`.
- **Styling**: Utility-first CSS using Tailwind CSS v4 alongside `tailwindcss-animate` and `tw-animate-css` for micro-animations and smooth layout transitions (glassmorphism aesthetics, responsive mobile-first).

### 2.2 Routing Structure & Protection
Uses `wouter` for lightweight client-side routing. Routes are divided into:
- **Public Routes**: `/` (Landing Page) and `/login`.
- **Onboarding Routes**: Wrapped in `<OnboardingRoute>`, these check the `onboardingStatus` of a user to ensure they complete profile setups before hitting the dashboard.
- **Protected Routes**: Wrapped in `<ProtectedRoute>`, these ensure strict authentication. The system handles redirection of unauthorized users and incomplete profiles seamlessly. 
  - Main Pages: `/dashboard`, `/chat` (AI Chat), `/appointments`, `/resources`, `/counselor`, `/forum`, `/mood`.

> **Performance Optimization**
> React Query plays a major role in optimizing data flow, automatically invalidating stale queries and background-fetching to create a fast, offline-tolerant experience.

---

## 3. Backend Architecture

The backend operates on a Node.js/Express environment written in TypeScript, located in the `/server` directory.

### 3.1 Server Initialization & Middleware
The entry file is `server/index.ts`. Key initializations include:
- A custom raw-body capturing middleware to preserve payload integrity.
- Custom logging middleware that records performance benchmarks `[METHOD PATH STATUS in ms]` and securely redacts passwords in request bodies.
- Seamless unification of API HTTP endpoints and an inline Vite DEV server implementation if running in non-production mode (`process.env.NODE_ENV = "development"`).

### 3.2 Authentication Handling
- Authentication uses **Passport.js** with `LocalStrategy`.
- Credentials are obfuscated securely employing **bcrypt.js**.
- **express-session** maintains state across the application, linked tightly to a PostgreSQL adapter (`connect-pg-simple`). This provides robust session persistence against server restarts.

### 3.3 Routing Interface (`server/routes.ts`)
The unified routing contract defines strict behaviors:
- **Appointments API**: Fetches relevant arrays based on session-bound `req.user.id`, blocking ID-spoofing across users.
- **Posts & Forum API**: Handles user peer support and incorporates real-time server-side API call verification to Groq AI (Crisis detection is triggered passively here).
- **Zod Validations**: All POST/PATCH endpoints filter payload traffic via Zod schemas defined in `/shared/schema.ts`. Any violations bubble up nicely formatted 400 Bad Request responses.

---

## 4. AI & Machine Learning Integration

The core differentiator of MindfulSpace is its deeply integrated AI features. All of these live in `server/services/ai.ts` utilizing the `groq-sdk` targeting the `llama-3.3-70b-versatile` language model. 

> **AI Fallback Mechanisms**
> To avoid application breakage when the `GROQ_API_KEY` is undefined or the Groq service goes down, the AI layer implements an intricate set of mock behaviors. For example, keyword matching (e.g., "suicide", "die") steps in dynamically if pure NLP inference is offline.

### 4.1 Sub-services
1. **Crisis Detection (`detectCrisis`)**: Triggered in the background whenever a user writes a forum post, logs a mood note, or sends an AI text message. It analyzes text for immediate danger or self-harm capabilities, returning an automated low/moderate/severe score payload. 
2. **Assessment Analysis (`analyzeAssessmentAI`)**: Takes numeric raw scores from PHQ-9 or GAD-7 mock tests submitted by users and generates an empathetic text synopsis of their state.
3. **AI Chat Completion (`chatCompletionAI`)**: Connects direct, low-latency Socket.IO endpoints to a purely conversational LLM prompt explicitly designed to practice active listening. 
4. **Personalized Wellness Actions**: Scans the user's latest mood string and responds with exactly three context-sensitive micro-habits formatted as strict JSON payloads for the frontend dashboard to display.
5. **Institutional Insights**: An administrator-only endpoint. It ingests an anonymous block of the most recent 50 platform forum posts and mood note strings. The AI evaluates the campus/institution-wide stress indicators and recommends high-level strategic interventions.

---

## 5. Database Schema & Data Modeling

Using **Drizzle ORM** communicating natively with a **PostgreSQL 15** server. Database definitions sit within `/shared/schema.ts` to allow type sharing completely end-to-end (Client -> Server -> Database).

10 interdependent tables map the mental health universe:
* `users`: The bedrock of the app containing students, counselors, admins. Includes `role`, `onboardingStatus`, and `latestRiskLevel`.
* `appointments`: Links a Student ID and a Counselor ID alongside dates, notes, and polymorphic status enums (`pending`, `confirmed`, `completed`).
* `mood_entries`: Small transactional records linking `userId` to a 1-10 `score` integer and an optional text `note`.
* `screening_assessments`: Long-form JSON dumps of questionnaire answers, scores, and cached Groq AI text analyses.
* `posts` & `replies`: Drives the peer support forum, inherently recording anonymous state toggles, flag statuses for moderation, and foreign key relations.
* `resources`: Global static data for self-help videos/articles. 
* `daily_insights` & `institutional_trends`: Caches the results of expensive LLM analytics calls by admins to save on API limits and token expenditures.

---

## 6. Real-time Infrastructure (WebSockets)

Standard HTTP lacks the speed required for immediate crisis alerts and smooth chat experiences. For this, MindfulSpace utilizes **Socket.IO** mounted on the standard Express `httpServer` in `server/socket.ts`.

**Key Workflows:**
- `ai_counselor_message`: Real-time chat buffering to pass text rapidly to Groq and push responses directly back to the user without polling.
- `crisis_alert`: If `detectCrisis()` identifies a `severe` event, the backend fires a broadcast emit instantly to an 'admin' or 'counselor' socket room pushing the contextual alert notification without requiring a browser refresh.

---

## 7. Security Implementation

- **Data Minimization:** Handlers explicitly sanitize structures before wire-transmission via `sanitizeUser()`, ensuring `password` hashes and system data never leak into the browser console or React Query caches.
- **SQL Injection Prevention:** Pure parameterization facilitated implicitly by Drizzle ORM methods.
- **Strict User Hydration:** Backend endpoints strictly evaluate `req.user.id` from the secure Passport session cookie rather than trusting standard JSON payload payloads, blocking lateral attacks.

---

## 8. User Roles & Workflows

An integral part of the architecture is RBAC (Role-Based Access Control).

- **Student / General User:** The primary consumer. They experience the onboarding flow, fill in an initial assessment, and access mood logging, AI chat, forum, and appointment booking mechanisms.
- **Counselor:** Designed to be the intervention layer. Their dashboard hooks into aggregated patient lists, appointment verification endpoints, and most critically, listens on the Socket for severe `crisis_alert` events.
- **Admin:** System maintainers. They don't engage users directly but utilize `/api/admin/insights` to fire LLM calls against the collective anonymized corpus of the entire campus to spot institutional failure points.

---

## 9. DevOps & Deployment strategy

MindfulSpace employs a robust, modular setup designed for modern container environments.

* **Development:** Vite compiles React components simultaneously while `tsx` hot-reloads the Express application on port 5000.
* **Production Build:** `npm run build` runs a dual process. Vite produces static files into `/dist/public`, and `esbuild` violently bundles the entire Express server resolving external Node imports down to a highly optimized tree-shaken index file (`/dist/index.js`).
* **Containerization:** A multi-stage `Dockerfile` handles installation -> compilation -> deployment on a minimal `node:20-alpine` footprint. `docker-compose.yml` links the application container dynamically to a standalone PostgreSQL 15 container exposing port 5433 mapping database schemas via `drizzle-kit push` automatically on startup.
