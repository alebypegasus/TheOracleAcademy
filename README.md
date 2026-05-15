# Oracle Learning Platform

Welcome to the Oracle Learning Platform monorepo! This is an educational platform focused on oracles and divination systems, featuring AI-generated curriculums, gamification, and personalized study plans.

## Stack Overview
- **Mobile App:** React Native (Expo), React Query, Zustand
- **Admin Dashboard:** Next.js, Tailwind CSS
- **API Gateway:** NestJS, Google Gemini API
- **Database:** PostgreSQL (managed via Prisma)

## Folder Structure
```
/apps
  /mobile    # React Native App (Expo)
  /admin     # Next.js Admin Panel
  /api       # NestJS Backend API
/packages
  /database  # Prisma schema and ORM client
/docker-compose.yml # PostgreSQL and Redis setup
```

## Getting Started

### Prerequisites
- Node.js >= 18
- `pnpm` >= 8
- Docker Desktop (for Postgres/Redis)

### Setup Instructions

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Start Infrastructure (Database & Cache)**
   ```bash
   docker-compose up -d
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root and configure it (see `.env.example` if available, otherwise set `DATABASE_URL` and `GEMINI_API_KEY`).
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/oracle_platform?schema=public"
   GEMINI_API_KEY="your_google_gemini_api_key"
   ```

4. **Initialize Database**
   ```bash
   cd packages/database
   npx prisma generate
   npx prisma db push
   cd ../../
   ```

5. **Start Development Servers (Turbo)**
   ```bash
   pnpm dev
   ```
   *This command will simultaneously start up the NestJS API, Next.js Admin, and Expo Dev Server.*

### Mobile App Notes (Expo)
You may need to run the mobile app directly if you want to select between iOS/Android/Web specifically:
```bash
cd apps/mobile
pnpm ios # Or pnpm android
```

## Architecture Details

- **Microservices & Modules**: The NestJS api uses separate modules (`gamification`, `study-plan`, `courses`, `ai`) to separate concerns and easily pivot to microservices if needed later.
- **Data Model**: The relational Postgres model captures the complex nature of hierarchical courses (Course -> Module -> Lesson/Quiz) alongside gamification (Badges, Streak, Progress) and offline Sync.
- **AI Core**: The system is designed to interface with the Gemini API to dynamically generate courses (`AiService`) and adaptive 7-day study plans (`StudyPlanService`).
