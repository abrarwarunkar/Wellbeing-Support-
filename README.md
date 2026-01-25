# Wellbeing Support App - De-Replitized

This project has been migrated from Replit to a standard Node.js/React environment. It uses Docker for easy deployment and standard `npm` scripts for local development.

## Prerequisites

- Node.js (v20 or later recommended)
- PostgreSQL
- Docker & Docker Compose (optional, for containerized run)

## Setup Instructions

### 1. Install Dependencies

**CRITICAL:** You must run this command first to resolve all TypeScript errors and missing module issues.

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and update the values:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `OPENAI_API_KEY`: Your OpenAI API key.

### 3. Database Setup

Push the schema to your database:

```bash
npm run db:push
```

### 4. Running the Application

#### Option A: Local Development

```bash
npm run dev
```
The app will be available at `http://localhost:5000`.

#### Option B: Docker (Production)

To build and start the application using Docker Compose:

```bash
docker-compose up --build
```

## Project Structure Changes

- **Authentication:** Now uses `passport-local` with Email/Password instead of Replit Auth.
- **AI Integration:** Uses legitimate `openai` client instead of Replit AI proxies.
- **Build System:** Uses standard `vite build` and `esbuild` for the server.

## Troubleshooting

- **TypeScript Errors:** If you see "Cannot find module..." errors, it usually means `npm install` hasn't been run or completed successfully.
- **Database Connection:** Ensure your PostgreSQL server is running and the credentials in `.env` are correct.