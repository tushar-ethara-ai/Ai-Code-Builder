AI Code Builder

Prompt

Context and Role

As a Full-Stack Engineer specializing in AI-integrated web applications, you are responsible
for designing and implementing a production-grade AI-Powered Code Generator. The platform
must allow authenticated users to describe a coding task in natural language and instantly
receive well-structured, syntax-highlighted, runnable code powered by a large language
model while all user data, generation history, and session state are persisted in real time
using Convex as the backend database.

The platform should present a clean, intuitive interface that guides users through prompt
input, code generation, and history management in a seamless workflow. Additionally, the
system must enforce secure access via Google OAuth and support multiple programming
languages with real-time AI response streaming.


Objective

Develop a complete full-stack AI Code Generator that:

● Authenticates users securely via Google OAuth using NextAuth.js.
● Accepts natural language prompts and returns AI-generated code in real time.
● Displays generated code in a Monaco Editor with syntax highlighting and copy support.
● Persists every generation, prompt history, and user profile in Convex DB.
● Provides a responsive, accessible UI built with Tailwind CSS and Shadcn/UI.
● Supports multiple programming languages and framework-specific code generation.
● Implements real-time streaming of AI responses to the frontend.
● Includes a generation history dashboard per authenticated user.


UI and Frontend Requirements

Page and Layout Structure

● Implement the following pages and routes:
   ○ Landing Page (/) — Hero section, feature highlights, call-to-action to sign in.
   ○ Auth Page (/auth) — Google OAuth sign-in card with branding.
   ○ Dashboard (/dashboard) — Prompt input, code output panel, language selector.
   ○ History Page (/history) — Paginated list of past generations with re-run support.
   ○ Settings Page (/settings) — User profile, preferences, API usage stats.

Dashboard UI Components

● Prompt Input Area — Multiline textarea with character counter and submit button.
   ○ Include a language/framework dropdown (e.g. Python, TypeScript, React, SQL).
   ○ Include a tone selector: Beginner-friendly / Production-ready / Concise.
● Code Output Panel — Monaco Editor (read-only after generation, editable on demand).
   ○ Syntax highlighting based on selected language.
   ○ One-click Copy to Clipboard button.
   ○ Download as file button (.py, .ts, .jsx, etc.).
● Streaming Indicator — Animated token-by-token rendering as AI responds.
● Sidebar — Quick access to recent generations pulled from Convex in real time.

Layout Requirements

The layout must include:

● Landing page with animated hero introduction
● Auth page with Google sign-in card
● Dashboard with prompt input and code output panel
● History page with paginated generation records
● Settings page with user profile and preferences

The layout must be:

● Fully responsive (mobile, tablet, desktop)
● Accessible (ARIA labels, semantic HTML)
● Optimized for performance
● Dark mode / light mode toggle persisted to user preferences in Convex


Authentication Requirements

Google OAuth via NextAuth.js

● Clicking "Sign in with Google" must:
   ○ Trigger Google OAuth consent screen
   ○ Create a user document in Convex on first login
   ○ Redirect to the dashboard on success

● Integrate NextAuth.js v5 (Auth.js) with the Google provider inside Next.js App Router.
● Protect all routes under /dashboard, /history, and /settings via middleware.
● On first login, create a user document in Convex with:
   ○ userId
   ○ email
   ○ name
   ○ avatarUrl
   ○ createdAt
● Store and refresh session tokens securely; never expose tokens on the client.
● Implement sign-out that clears the session and redirects to the landing page.
● Display user avatar and name in the top navigation when authenticated.

Route Protection

● Use Next.js middleware.ts to redirect unauthenticated users to /auth.
● Server Components access session via auth(); Client Components use useSession().
● Convex mutations must validate the authenticated user identity server-side before writes.


AI Code Generation Requirements

Model Integration

● Use the Vercel AI SDK (ai package) to call the LLM provider (OpenAI GPT-4o or equivalent).
● Implement streaming via streamText() and return a StreamingTextResponse from the API route.
● Define a structured system prompt that enforces:
   ○ Clean code output only
   ○ No markdown fences unless explicitly requested
   ○ Inline comments for complex logic

Generation API Route

● Endpoint: POST /api/generate — accepts { prompt, language, tone, userId }.
● Validate all inputs server-side; reject empty or excessively long prompts (>2000 chars).
● Sanitize user prompt to strip potential prompt-injection attempts before forwarding to LLM.
● On completion, save the full generation record to Convex via a server-side mutation.
● Return structured JSON on error: { success: false, error: string, code: number }.

Supported Languages and Frameworks

● Python
● TypeScript
● JavaScript
● React / JSX
● Next.js
● SQL
● Bash / Shell
● Java
● Go
● Rust
● C++
● HTML + CSS


Convex Backend Requirements

Database Schema

Define the following Convex tables in convex/schema.ts:

● users — userId, email, name, avatarUrl, theme, createdAt
● generations — userId, prompt, language, tone, outputCode, createdAt, isFavorited
● usageStats — userId, totalGenerations, tokensUsed, lastGeneratedAt

Convex Functions

● Queries:
   ○ getGenerationsByUser(userId)
   ○ getUserProfile(userId)
   ○ getUsageStats(userId)
● Mutations:
   ○ createUser()
   ○ saveGeneration()
   ○ toggleFavorite()
   ○ updateThemePreference()
● Real-time — Use Convex live query subscriptions so the sidebar updates instantly on
  new generations without a page refresh.
● Indexes — Index generations by userId and createdAt for fast paginated queries.
● Security — All mutations must check that ctx.auth.getUserIdentity() matches the
  document owner before reading or writing.


Backend Requirements

● Implement API route handlers inside the Next.js App Router to handle:
   ○ POST /api/generate — Stream AI code generation response
   ○ GET /api/history — Fetch paginated generation history from Convex
   ○ DELETE /api/history/[id] — Delete a specific generation record
   ○ PATCH /api/favorite/[id] — Toggle favorite flag on a generation
   ○ GET /api/stats — Return usage stats for the authenticated user
● All API routes must verify the NextAuth session via auth() before processing.
● Validate and sanitize every incoming field using Zod schemas.
● Implement rate limiting — max 20 generations per user per hour.
● Use HTTPS-only cookies for session tokens; set httpOnly, secure, and sameSite=strict.
● Return structured error responses: { success, message, errors?, code }.


Data Processing Requirements

● Sanitize all inputs to prevent:
   ○ XSS attacks
   ○ Injection attacks
● Validate email format on user profile creation.
● Truncate stored code outputs longer than 50,000 characters and flag as truncated.
● Debounce prompt input on the frontend (300 ms) to avoid redundant API calls.
● Stream token chunks from the AI SDK to the client using ReadableStream; handle
  backpressure gracefully.
● Ensure API returns structured JSON responses:
   ○ Success message
   ○ Error message (if applicable)


Output Requirements

● Real-time streaming of AI-generated code token by token in the Monaco Editor.
● Fully functional Google OAuth login with automatic Convex user creation on first sign-in.
● Persistent generation history accessible across sessions via Convex live queries.
● Confirmation toast notification after a generation is saved successfully.
● Graceful degradation UI when the AI API is unavailable or rate-limited.
● Dark/light mode preference persisted per user in Convex.
● Download button that exports generated code as the correct file extension.


Error Handling and Documentation

● Handle frontend generation errors gracefully with inline error banners.
● Handle backend validation errors with structured HTTP responses.
● Provide structured error responses for all API routes.
● Log backend failures with timestamp and error type — no prompt content in logs.
● Document:
   ○ Folder structure
   ○ Setup instructions
   ○ Environment variable configuration
   ○ Deployment steps

Folder Structure

/ai-code-generator
├── app/                    # Next.js App Router pages and layouts
│   ├── (auth)/             # Auth routes (sign-in)
│   ├── (dashboard)/        # Protected routes
│   └── api/                # Route Handlers (generate, history, stats)
├── components/             # Shared UI components (Shadcn + custom)
├── convex/                 # Convex schema, queries, mutations
├── lib/                    # Utilities, AI SDK config, auth config
├── hooks/                  # Custom React hooks
├── styles/                 # Global CSS / Tailwind config
└── docs/                   # SETUP, ENV, DEPLOYMENT, ARCHITECTURE


Performance and Scalability

● Lazy-load the Monaco Editor using next/dynamic with ssr: false to reduce initial bundle.
● Use Next.js Server Components for static-heavy pages; reserve Client Components for
  interactive elements.
● Implement pagination on the history page (20 items per page) using Convex
  cursor-based pagination.
● Optimize Convex queries with proper indexes — avoid full-table scans.
● Apply React.memo and useCallback to prevent unnecessary re-renders in the dashboard.
● Set appropriate Cache-Control headers on static assets; use ISR for the landing page.
● Ensure streaming responses do not block the Node.js event loop.
● SEO: add metadata exports in App Router layouts; include og:image and twitter:card tags.


Technology Stack

Frontend:
● Next.js 14 (App Router)
● TypeScript
● Tailwind CSS + Shadcn/UI
● Monaco Editor
● Vercel AI SDK

Backend:
● Next.js API Route Handlers
● Convex (real-time database)
● NextAuth.js v5 (Google OAuth)
● Zod (validation)
● OpenAI GPT-4o (LLM provider)

Optional:
● Upstash Redis for rate limiting
● Vercel Analytics for usage tracking


Environment Variable Configuration

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

# Rate Limiting (optional Redis)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

