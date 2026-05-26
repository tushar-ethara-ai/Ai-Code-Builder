# AI POWERED CODE GENERATOR - GOLDEN PROMPT

## Context and Role

You are a Full-Stack Engineer responsible for building AI-integrated web applications, your task
is to design and implement a production-grade AI-Powered Code Generator. The platform
must let authenticated users describe a coding task in plain language and receive clean, runnable code instantly which is powered by a large language model while all user data, generation history, and session state are stored and synced in real time using Convex as the backend database.

The system must enforce secure access through Google OAuth, stream AI responses directly
into a Monaco code editor, and maintain a complete generation history per user. Every part of the stack from route protection to database writes must be validated, sanitized, and production-safe.

---

# Objective

Build a complete full-stack AI Code Generator that:

- Authenticates users via Google OAuth using NextAuth.js.
- Accepts natural language prompts and returns AI-generated code in real time.
- Streams code token by token into a Monaco Editor with syntax highlighting.
- Persists every generation, prompt, and user profile in Convex DB.
- Displays a responsive, accessible UI built with Tailwind CSS and Shadcn/UI.
- Supports multiple programming languages and framework-specific outputs.
- Maintains a per-user generation history accessible across sessions.
- Enforces server-side validation, input sanitization, and rate limiting throughout.

---

# Input Data and Requirements

## Pages and Routes

Implement the following pages:

- `/`
  - Landing Page
  - Hero section
  - Feature list
  - Sign-in CTA

- `/auth`
  - Google OAuth sign-in card

- `/dashboard`
  - Prompt input
  - Language selector
  - Code output panel

- `/history`
  - Paginated list of past generations
  - Re-run support

- `/settings`
  - User profile
  - Theme toggle
  - Usage statistics

---

## Dashboard Input Fields

### Prompt Form

- Multiline textarea with character counter
- Submit button
- Language selector dropdown:
  - Python
  - TypeScript
  - React
  - SQL
  - Others
- Tone selector:
  - Beginner-friendly
  - Production-ready
  - Concise

### Generation Input Requirements

| Field      | Type   | Required | Rules                     |
| ----------- | ------ | -------- | ------------------------- |
| prompt      | string | Yes      | 1–2000 characters         |
| language    | string | Yes      | Selected programming lang |
| tone        | string | Yes      | Selected output style     |
| userId      | string | Derived   | From authenticated session |

---

## Authentication Inputs

Google OAuth sign-in triggers the following on first login:

| Field       | Type      |
| ------------ | --------- |
| userId       | string    |
| email        | string    |
| name         | string    |
| avatarUrl    | string?   |
| createdAt    | timestamp |

---

# Data Processing Requirements

## Validation

- Validate all inputs server-side using Zod schemas before processing.
- Reject prompts that are:
  - Empty
  - Greater than 2000 characters
- Validate email format on profile creation.
- Return structured validation errors:

```json
{
  "success": false,
  "error": "string",
  "code": 400
}
```

---

## Sanitization

- Strip prompt injection patterns before forwarding prompts to the LLM.
- Sanitize all fields against:
  - XSS
  - SQL injection
  - Script injection
- Truncate generated outputs exceeding 50,000 characters.
- Flag truncated outputs before persistence.

---

## Streaming and Storage

- Stream AI responses token-by-token using Vercel AI SDK `streamText()`.
- Handle `ReadableStream` backpressure gracefully.
- Save completed generations to Convex via server-side mutation.
- Debounce prompt input on the frontend at `300ms`.

---

# Convex Database Functions

## Queries

- `getGenerationsByUser(userId)`
- `getUserProfile(userId)`
- `getUsageStats(userId)`

## Mutations

- `createUser()`
  - Runs on first login
  - Creates user document

- `saveGeneration()`
  - Stores:
    - Prompt
    - Language
    - Tone
    - Output
    - Timestamp

- `toggleFavorite()`
  - Toggles `isFavorited`

- `updateThemePreference()`
  - Stores:
    - Dark mode
    - Light mode

---

## Security Requirements

All mutations must:

- Call `ctx.auth.getUserIdentity()`
- Verify ownership before reading or writing

---

## Realtime Requirements

- Use Convex live query subscriptions.
- Sidebar updates instantly with new generations.

---

## Database Indexing

Index the `generations` table by:

- `userId`
- `userId + createdAt`

---

# Rate Limiting

- Maximum:
  - `20 generations`
  - `Per user`
  - `Per hour`

- Use:
  - Upstash Redis
  - Sliding window strategy

- Return HTTP `429` on breach:

```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "code": 429
}
```

---

# Output Requirements

## AI Output Experience

- Stream generated code in real time into Monaco Editor.
- Monaco Editor must:
  - Be read-only by default
  - Support editable toggle
  - Auto-match syntax highlighting to selected language

---

## Actions

- Copy to Clipboard button
- Download button with proper file extension:
  - `.py`
  - `.ts`
  - `.jsx`
  - etc.

---

## UX Requirements

- Toast notification after successful Convex save
- Sidebar updates in real time
- Theme preference loads automatically
- Graceful fallback UI for:
  - AI downtime
  - Rate limits
  - Partial failures

---

## API Response Shape

### Success

```json
{
  "success": true,
  "message": "string"
}
```

### Failure

```json
{
  "success": false,
  "message": "string",
  "errors": [],
  "code": 400
}
```

---

# Error Handling and Documentation

## Frontend Error Handling

- Show inline error banners
- Never expose raw stack traces

---

## HTTP Status Codes

| Code | Meaning |
| ---- | ------- |
| 400  | Validation Error |
| 401  | Unauthorized |
| 429  | Rate Limited |
| 500  | Internal Server Error |

---

## Logging Rules

- Log:
  - Timestamp
  - Error type
- Never log:
  - User prompts
  - Generated code
  - Session tokens

---

## Streaming Failure Handling

- Gracefully handle mid-stream failures
- Show partial-result warning inside editor

---

# Documentation Requirements

Include documentation for:

- Folder structure
- Setup instructions
- Environment variables
- Deployment steps
- System architecture

---

# Folder Structure

```bash
/ai-code-generator
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   └── api/
│
├── components/
├── convex/
├── lib/
├── hooks/
├── styles/
└── docs/
```

### Directory Purpose

| Folder | Purpose |
| ------ | ------- |
| `app/` | Next.js App Router pages/layouts |
| `components/` | Shared UI components |
| `convex/` | Schema, queries, mutations |
| `lib/` | Utilities and configs |
| `hooks/` | Custom React hooks |
| `styles/` | Global styling |
| `docs/` | Documentation |

---

# Performance and Scalability

- Lazy-load Monaco Editor using:
  - `next/dynamic`
  - `ssr: false`

- Use:
  - Server Components for static pages
  - Client Components only when necessary

- Paginate history:
  - 20 records per page
  - Convex cursor pagination

- Prevent unnecessary re-renders using:
  - `React.memo`
  - `useCallback`

- Add:
  - Cache-Control headers
  - ISR for landing page

- Ensure AI streaming:
  - Does not block Node.js event loop

- Add metadata:
  - `og:image`
  - `twitter:card`
  - SEO metadata exports

---

## Cookie Security

Session cookies must use:

- `httpOnly`
- `secure`
- `sameSite: "strict"`

Never expose:

- API keys
- Session tokens
- OAuth secrets

---

# Technology Stack

## Frontend

### Next.js 14 (App Router)

Used for:

- SSR
- SEO
- Routing
- API route handlers

---

### TypeScript

Used for:

- Shared types
- API validation
- Convex schemas
- Component props

---

### Tailwind CSS + Shadcn/UI

Used for:

- Responsive layouts
- Styling
- UI primitives
- Toasts
- Dialogs
- Dropdowns

---

### Monaco Editor

Used for:

- AI code rendering
- Syntax highlighting
- Read-only editing mode

Loaded dynamically using:

```tsx
dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});
```

---

### Vercel AI SDK

Used for:

- Streaming LLM responses
- `streamText()`
- `toDataStreamResponse()`

---

## Backend

### Next.js Route Handlers

Responsible for:

- Validation
- Authentication
- Generation
- History retrieval
- Stats
- Favorites

---

### Convex

Used for:

- User storage
- Generation storage
- Realtime subscriptions

---

### NextAuth.js v5 + Google OAuth

Used for:

- Google sign-in
- JWT sessions
- Secure cookies
- Protected routes

---

### Zod

Used for:

- Shared validation schemas
- Request validation
- Type-safe parsing

---

### OpenAI GPT-4o

Used for:

- AI code generation
- Streamed completions
- Production-quality outputs

System instructions enforce:

- No markdown fences
- Clean code
- Inline comments

---

# Optional Integrations

## Upstash Redis

Used for:

- Sliding window rate limiting
- 20 requests/hour enforcement

---

## Vercel Analytics

Used for:

- Core Web Vitals
- Interaction latency
- Usage tracking

---

# Environment Variable Configuration

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOY_KEY=your_convex_deploy_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```