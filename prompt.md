# AI POWERED CODE GENERATOR - GOLDEN PROMPT

## Context and Role

You are a Full-Stack Engineer responsible for building AI-integrated web applications, your task is to design and implement a production-grade AI-Powered Code Generator. The platform
must let authenticated users describe a coding task in plain language and receive clean, runnable code instantly which is powered by a large language model while all user data, generation history, and session state are stored and synced in real time using Convex as the backend database.

The system must enforce secure access through Google OAuth, stream AI responses directly
into a Monaco code editor, and maintain a complete generation history per user. Every part of the stack from route protection to database writes must be validated, sanitized, and production-safe.


## Objective

Build a complete full-stack AI Code Generator that:

● Authenticates users via Google OAuth using NextAuth.js.
● Accepts natural language prompts and returns AI-generated code in real time.
● Streams code token by token into a Monaco Editor with syntax highlighting.
● Persists every generation, prompt, and user profile in Convex DB.
● Displays a responsive, accessible UI built with Tailwind CSS and Shadcn/UI.
● Supports multiple programming languages and framework-specific outputs.
● Maintains a per-user generation history accessible across sessions.
● Enforces server-side validation, input sanitization, and rate limiting throughout.


### Input Data and Requirements

#### Pages and Routes

● Implement the following pages:
   ○ Landing Page (/) - Hero section, feature list, sign-in call to action.
   ○ Auth Page (/auth) - Google OAuth sign-in card.
   ○ Dashboard (/dashboard) - Prompt input, language selector, code output panel.
   ○ History Page (/history) - Paginated list of past generations with re-run support.
   ○ Settings Page (/settings) - User profile, theme toggle, usage statistics.

#### Dashboard Input Fields

● Prompt Input - Multiline textarea with character counter and submit button.
   ○ Language selector dropdown (Python, TypeScript, React, SQL, and others).
   ○ Tone selector: Beginner-friendly / Production-ready / Concise.
● Generation inputs must accept:
   ○ prompt - string, required, 1 to 2000 characters.
   ○ language - string, required.
   ○ tone - string, required.
   ○ userId - string, derived from authenticated session.

Authentication Inputs

● Google OAuth sign-in triggers the following on first login:
   ○ userId
   ○ email
   ○ name
   ○ avatarUrl (optional)
   ○ createdAt (timestamp)


### Data Processing Requirements

Validation

● Validate all inputs server-side using Zod schemas before any processing begins.
● Reject prompts that are empty or exceed 2000 characters.
● Validate email format on user profile creation.
● Return structured errors for all invalid inputs: { success: false, error: string, code: number }.

Sanitization

● Strip prompt injection patterns from user input before forwarding to the LLM.
● Sanitize all fields against XSS and injection attacks before storing in Convex.
● Truncate stored code outputs exceeding 50,000 characters and flag them as truncated.

Streaming and Storage

● Stream AI responses token by token to the client using the Vercel AI SDK streamText().
● Handle ReadableStream backpressure gracefully without blocking the event loop.
● On stream completion, save the full generation record to Convex via a server-side mutation.
● Debounce prompt input on the frontend at 300 ms to prevent redundant API calls.

### Convex Database Functions

● Queries:
   ○ getGenerationsByUser(userId)
   ○ getUserProfile(userId)
   ○ getUsageStats(userId)
● Mutations:
   ○ createUser() - runs on the first login to create the user document.
   ○ saveGeneration() - persists prompt, language, tone, output, and timestamp.
   ○ toggleFavorite() - flips the isFavorited flag on a generation record.
   ○ updateThemePreference() - persists dark or light mode choice per user.
● All mutations must call ctx.auth.getUserIdentity() and verify ownership before writing.
● Use Convex live query subscriptions so the sidebar reflects new generations instantly.
● Index the generations table by userId and by userId + createdAt for paginated queries.

Rate Limiting

● Allow a maximum of 20 generations per user per hour.
● Implement using Upstash Redis with a sliding window strategy.
● Return HTTP 429 with a structured error message when the limit is exceeded.


### Output Requirements

● Real-time AI-generated code rendered token by token inside the Monaco Editor.
● Monaco Editor displays code in read-only mode by default with an editable toggle.
● Syntax highlighting matches the selected language automatically.
● One-click Copy to Clipboard button available after generation.
● Download button exports the generated file with the correct extension (.py, .ts, .jsx, etc.).
● Confirmation toast notification appears after a generation is saved to Convex.
● Sidebar updates in real time with the latest generations without a page refresh.
● Dark and light mode preference is stored per user in Convex and applied on load.
● Graceful degradation UI is shown when the AI API is unavailable or rate-limited.
● All API routes return structured JSON:
   ○ On success: { success: true, message: string }
   ○ On failure: { success: false, message: string, errors?: [], code: number }


### Error Handling and Documentation

● Display inline error banners on the frontend for failed generations without raw stack traces.
● Return HTTP 400 for validation errors, 401 for unauthenticated requests, 429 for rate
  limit breaches, and 500 for server faults.
● Log all backend failures with a timestamp and error type — never log prompt content.
● Handle mid-stream AI failures gracefully and render a partial-result warning in the editor.
● Document the following:
   ○ Folder structure
   ○ Setup instructions
   ○ Environment variable configuration
   ○ Deployment steps

### Folder Structure

/ai-code-generator
├── app/                    # Next.js App Router pages and layouts
│   ├── (auth)/             # Auth routes (sign-in)
│   ├── (dashboard)/        # Protected routes
│   └── api/                # Route Handlers (generate, history, stats)
├── components/             # Shared UI components (Shadcn + custom)
├── convex/                 # Convex schema, queries, mutations
├── lib/                    # Utilities, AI SDK config, auth config
├── hooks/                  # Custom React hooks
├── styles/                 # Global CSS and Tailwind config
└── docs/                   # put setup, env, deployment, architecture here


### Performance and Scalability

● Lazy-load the Monaco Editor using next/dynamic with ssr like return false to reduce bundle size.
● Use Next.js Server Components for static pages and limit Client Components to interactive
  elements only.
● Paginate the history page at 20 records per page using Convex cursor-based pagination.
● Apply proper indexes to Convex tables to avoid full-table scans on large datasets.
● Use React.memo and useCallback to prevent unnecessary re-renders on the dashboard.
● Apply Cache-Control headers to static assets and use ISR on the landing page.
● Ensure AI streaming does not block the Node.js event loop.
● Add metadata exports in App Router layouts for SEO; include og:image and twitter:card.
● Use HTTPS-only session cookies with httpOnly, secure, and sameSite=strict flags set.
● Never expose API keys or session tokens to the client under any condition.


### Technology Stack

Use the following stack. Each tool is chosen for a specific reason tied to the requirements
of this system and do not substitute without understanding the tradeoff.

 
#### Frontend:
 
● Next.js 14 (App Router)
   Used for SSR, SEO, and routing. The landing page is server-rendered for fast initial
   load and search engine indexing. The dashboard and history pages use Client Components
   for real-time interactivity. API Route Handlers inside the same project serve all backend
   endpoints without a separate server.
 
● TypeScript
   Used across the entire codebase to type API request and response shapes, Convex schema
   fields, Zod validation outputs, and component props. Shared types keep the frontend and
   backend in sync at compile time.
 
● Tailwind CSS + Shadcn/UI
   Tailwind is used for all layout, spacing, typography, and responsive design. Shadcn/UI
   provides the component primitives — buttons, dropdowns, dialogs, toasts, and inputs —
   which are installed directly into the codebase and styled with Tailwind.
 
● Monaco Editor
   Used to display AI-generated code in the output panel. Loaded dynamically on the client
   with ssr: false to keep the initial page bundle light. Configured per generation with the
   correct language mode for syntax highlighting and set to read-only by default.
 
● Vercel AI SDK
   Used to stream AI responses from the generate API route to the client. streamText()
   calls the OpenAI model and toDataStreamResponse() sends the output chunk by chunk.
   The client reads the stream and renders each token into the Monaco Editor as it arrives.
 
#### Backend:
 
● Next.js API Route Handlers
   Used to handle all server-side logic and code generation, history retrieval, favorite
   toggling, record deletion, and usage stats. Each route verifies the session, validates
   the request with Zod, and communicates with Convex before returning a response.
 
● Convex (real-time database)
   Used to store users, generation records, and usage stats. Live query subscriptions keep
   the sidebar updated instantly when a new generation is saved. All mutations verify the
   authenticated user identity before reading or writing any record.
 
● NextAuth.js v5 with Google OAuth
   Used to handle the full Google sign-in flow, issue JWT session tokens, and set secure
   HTTPS-only cookies. Middleware reads the session to block unauthenticated access to
   all dashboard, history, and settings routes.
 
● Zod (validation)
   Used in every API route to validate incoming request fields before any processing begins.
   The same schema is shared between the client form and the server route to enforce
   identical rules on both sides.
 
● OpenAI GPT-4o (LLM provider)
   Used as the model behind the generate route. Receives the sanitized user prompt and a
   system instruction that enforces clean code output, no markdown fences, and inline
   comments for complex logic. Returns a streamed response to the Vercel AI SDK.
 
#### Optional:
 
● Upstash Redis for rate limiting
   Used to enforce a maximum of 20 generations per user per hour via a sliding window
   counter. The check runs at the start of the generate route before the model is called.
 
● Vercel Analytics for usage tracking
   Used to monitor real user performance metrics — page load times, Core Web Vitals, and
   interaction latency — across the dashboard and generation flow after each deployment.


### Environment Variable Configuration

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

