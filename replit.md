# MindfulSpace - Digital Psychological Intervention System

## Overview

MindfulSpace is a comprehensive mental health support platform designed specifically for college students. The application provides a stigma-free, scalable psychological intervention system that combines AI-powered chat support, appointment scheduling with counselors, psychoeducational resources, peer support forums, and mood tracking capabilities.

The platform addresses critical gaps in campus mental health services by offering:
- AI-guided first-aid support with coping strategies
- Confidential booking system for counselor appointments
- Curated wellness resource library
- Moderated peer-to-peer support forum
- Personal mood tracking with visualization

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Charts**: Recharts for mood tracking visualizations
- **Build Tool**: Vite with HMR support

The frontend follows a page-based architecture with protected routes. All authenticated pages are wrapped in a Layout component providing consistent navigation. Custom hooks abstract data fetching logic (use-appointments, use-mood, use-posts, use-resources, use-chat-stream).

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints defined in shared/routes.ts with Zod validation
- **Build**: esbuild for production bundling with optimized cold starts

The server implements a clean separation between route handlers (server/routes.ts) and data access (server/storage.ts). Replit integrations are modularized under server/replit_integrations/ for auth, chat, and image generation.

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: shared/schema.ts (shared between client and server)
- **Migrations**: Drizzle Kit with `db:push` command
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple

Core data models include:
- Users (with Replit Auth integration)
- Appointments (student-counselor scheduling)
- Resources (educational content)
- Posts/Replies (peer support forum)
- MoodEntries (daily mood tracking)
- Conversations/Messages (AI chat history)

### Authentication
- **Provider**: Replit OpenID Connect (OIDC)
- **Session Management**: Express sessions stored in PostgreSQL
- **User Sync**: Automatic upsert on login via authStorage

Authentication flow redirects to Replit's OIDC provider, then syncs user data to the local database. Protected routes check `req.isAuthenticated()` before processing.

### AI Integration
- **Chat**: OpenAI-compatible API via Replit AI Integrations
- **Streaming**: Server-sent events for real-time chat responses
- **Image Generation**: gpt-image-1 model for optional image features
- **Batch Processing**: Utility module for rate-limited bulk AI operations

## External Dependencies

### Database
- **PostgreSQL**: Primary data store (provisioned via Replit)
- **Environment**: DATABASE_URL must be set

### Authentication
- **Replit OIDC**: OAuth provider for user authentication
- **Environment**: ISSUER_URL, REPL_ID, SESSION_SECRET

### AI Services
- **OpenAI-compatible API**: Chat completions and image generation
- **Environment**: AI_INTEGRATIONS_OPENAI_API_KEY, AI_INTEGRATIONS_OPENAI_BASE_URL

### Key NPM Packages
- drizzle-orm / drizzle-kit: Database ORM and migrations
- @tanstack/react-query: Server state management
- framer-motion: Animation library
- recharts: Chart visualizations
- shadcn/ui components: Pre-built accessible UI components
- passport / openid-client: Authentication middleware
- date-fns: Date formatting utilities