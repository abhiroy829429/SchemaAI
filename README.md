# GovAssist AI

**AI-powered Government Scheme Eligibility Platform for Indian Citizens**

Built for the **Agents for Good** hackathon track. GovAssist AI helps citizens discover government schemes they qualify for using a transparent, rule-based multi-agent AI system.

![GovAssist AI](./docs/screenshots/dashboard.png)

## Project Overview

GovAssist AI is a production-quality web application that combines:

- **Deterministic Rule Engine** — eligibility is calculated from structured JSON rules, never by GPT
- **Multi-Agent AI System** — 8 LangGraph agents handle intake, evaluation, explanation, documents, checklists, roadmaps, tracking, and recommendations
- **Modern UX** — polished dashboard inspired by Linear, Stripe, and Vercel

## Architecture

```
User Profile → Intake Agent → Eligibility Agent (Rule Engine)
                                    ↓
              Explanation Agent ← Document Agent ← Recommendation Agent
                                    ↓
                              Chat Agent (Follow-up Q&A)
```

### Hybrid AI Design

1. Government schemes stored in **MongoDB** with structured eligibility rules
2. **Rule Engine** evaluates age, income, occupation, state, category, etc.
3. Results: Eligible / Possibly Eligible / Not Eligible + Confidence Score
4. **OpenAI** generates natural language explanations only — never decides eligibility

### Multi-Agent System (LangGraph)

| Agent | Role |
|-------|------|
| Intake Agent | Extract structured profile from user data |
| Eligibility Agent | Evaluate all schemes via rule engine |
| Explanation Agent | Generate human-readable eligibility reasons |
| Document Agent | Map required documents per scheme |
| Checklist Agent | Compare uploaded vs required documents |
| Roadmap Agent | Generate application step-by-step roadmap |
| Tracker Agent | Track application status timeline |
| Recommendation Agent | Suggest future-eligible schemes |

## Features

- Clerk authentication with auto user sync
- Profile completion with 10+ fields
- 30+ Central & State government schemes
- AI eligibility analysis with confidence scores
- Document upload with mock OCR (Cloudinary)
- Document checklist with completion percentage
- Application tracker with timeline
- Bilingual AI chat (English / Hindi)
- Dark / Light mode
- Responsive design + PWA ready
- Admin dashboard
- PDF eligibility report export

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15+, React, TypeScript, Tailwind CSS |
| UI | shadcn/ui, Framer Motion, Lucide Icons |
| State | TanStack Query, React Hook Form, Zod |
| Backend | Next.js API Routes |
| Database | MongoDB Atlas, Mongoose |
| Auth | Clerk |
| AI | OpenAI GPT-4o-mini, LangGraph |
| Storage | Cloudinary |
| Deploy | Vercel |

## Folder Structure

```
app/                  # Next.js App Router pages & API routes
components/           # React components
  ui/                 # shadcn-style UI primitives
  layout/             # Navbar, footer, dashboard layout
  shared/             # Scheme cards, chat widget, etc.
  providers/          # Theme, query, Clerk providers
agents/               # LangGraph multi-agent system
models/               # Mongoose schemas
services/             # Rule engine, auth, cloudinary
seed/                 # Database seed data
lib/                  # Utilities, constants, validations
types/                # TypeScript interfaces
middleware.ts         # Clerk auth middleware
```

## Installation

```bash
git clone <repo-url>
cd SchemeAI
npm install
cp .env.example .env.local
# Fill in environment variables
npm run seed:json   # Generate schemes.json
npm run seed        # Seed MongoDB (requires MONGODB_URI)
npm run dev
```

## Environment Variables

See `.env.example` for all required variables:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `OPENAI_API_KEY` | OpenAI API key for explanations & chat |
| `CLOUDINARY_*` | Cloudinary credentials for document upload |
| `NEXT_PUBLIC_APP_URL` | App URL for production |
| `JWT_SECRET` | JWT secret for additional auth |

## MongoDB Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user and whitelist your IP
3. Copy the connection string to `MONGODB_URI`
4. Run `npm run seed` to populate 30 schemes, 100 demo users, 250 applications

## Clerk Setup

1. Create an application at [clerk.com](https://clerk.com)
2. Copy publishable and secret keys to `.env.local`
3. Configure redirect URLs: `/sign-in`, `/sign-up`, `/dashboard`

## OpenAI Setup

1. Get an API key from [platform.openai.com](https://platform.openai.com)
2. Add to `OPENAI_API_KEY`
3. Without this key, the app uses fallback responses (rule engine still works)

## Cloudinary Setup

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Add cloud name, API key, and secret
3. Without Cloudinary, documents use mock local URLs

## Running Locally

```bash
npm run dev
# Open http://localhost:3000
```

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy

```bash
vercel --prod
```

## Screenshots

> Place screenshots in `/docs/screenshots/`

- Landing Page
- Dashboard
- Eligibility Results
- Scheme Details
- Document Center
- AI Chat

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET/POST | `/api/profile` | User profile |
| POST | `/api/eligibility` | Run AI eligibility analysis |
| GET | `/api/schemes` | List/search schemes |
| GET/POST | `/api/applications` | Application management |
| GET/POST | `/api/documents` | Document upload |
| POST | `/api/checklist` | Generate document checklist |
| POST | `/api/chat` | AI chat assistant |
| GET | `/api/dashboard` | Dashboard stats |

## Future Improvements

- Real Aadhaar/eSign integration via DigiLocker API
- SMS/email notifications for application updates
- Multi-language UI (Hindi, Tamil, Bengali)
- Real OCR via Google Vision or AWS Textract
- WhatsApp bot integration
- State-specific scheme auto-detection by pincode
- Offline PWA with service worker caching

## License

MIT — Built for Agents for Good Hackathon 2026
