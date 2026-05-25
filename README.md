# AI Code Builder — Evaluation & Spec Benchmarking

This directory contains the specifications, codebase, and comparative analysis for **AI Code Builder**, a premium, full-stack AI-powered code generation workbench. This evaluation focuses on comparative benchmarking between two implementation blueprints (**Response A** vs **Response B**) to determine which solution meets production-grade guidelines for robustness, integration, security, and developer experience.

---

## 1. Project Overview

**AI Code Builder** is a development workspace that allows engineers to describe coding goals in plain English and stream clean, syntax-highlighted, runnable code in real time. 

### Key Features:
* **Interactive Monaco Editor**: A read-only/edit-on-demand code editing canvas with theme persistence, syntax highlighting, and download/copy-to-clipboard actions.
* **Real-time AI Stream**: Real-time token streaming powered by Vercel AI SDK and OpenAI GPT-4o.
* **State & Log Persistence**: Convex database handles real-time user profiles, snippet storage, favorite statuses, and usage meters.
* **Authentication Sandbox**: NextAuth.js (Auth.js v5) Google OAuth integration paired with an instant developer sandbox bypass.
* **Performance & Safety**: Zod schema validation, sliding-window rate limiting, and inputs sanitization to prevent injection vectors.

---

## 2. Repository Structure

Below is the directory map of the project, including the Next.js application, the Convex serverless codebase, and the evaluation files:

```text
/ethara-prompt
├── .node/                  # Pre-packaged portable Node.js LTS (v20.12.2) engine
├── docs/                   # Setup guides, architecture notes, and developer guides
├── convex/                 # Convex DB schema, indices, queries, and mutations
│   ├── _generated/         # Compiled types, API path maps, and mock query providers
│   ├── schema.ts           # Convex schema (users, generations, usageStats tables)
│   ├── generations.ts      # Real-time generation mutations and queries
│   ├── users.ts            # User profile creation and preference mutations
│   └── usageStats.ts       # AI token usage tracking and statistics
├── src/                    # Next.js 14 App Router application source
│   ├── app/                # Application routes, pages, and API handlers
│   │   ├── api/            # API Route handlers (generate stream, favorite, history)
│   │   └── auth/           # OAuth and Developer Bypass sign-in screen
│   ├── components/         # Shared visual elements and Monaco workspace wrapper
│   ├── hooks/              # Custom streaming hooks, themes, and debounce wrappers
│   └── lib/                # Middleware helpers, rate limiters, and Zod validators
├── ethara sent/            # Benchmark files and comparative logs
│   ├── prompt.md           # Master prompt specifying requirements for developers
│   ├── justification.md    # Side-by-side dimensions evaluation (Response A vs B)
│   └── README.md           # This project guide and evaluation handbook
├── tsconfig.json           # Root compiler rules mapping project scopes
└── tailwind.config.ts      # Visual tokens and utility mapping configs
```

---

## 3. Instructions for Running & Testing

To simplify local execution on Windows, we have bundled a portable Node.js runtime environment. You do not need to install any global dependencies.

### Local Installation & Scaffolding
1. Navigate to the project root directory in PowerShell:
   ```powershell
   cd "c:\Ethara prompt"
   ```
2. Activate the portable Node.js path:
   ```powershell
   $env:Path = "c:\Ethara prompt\.node\node-v20.12.2-win-x64;" + $env:Path
   ```
3. Install package dependencies:
   ```powershell
   npm install
   ```

### Execution & Server Startup
The workspace can be tested either locally using mock variables or connected directly to a live cloud database.

#### Option A: Run the UI only (Developer Testing Sandbox)
The application has been pre-configured with a custom, recursive Convex API proxy and an inline mock stream. You can run and test the full user flow offline immediately:
1. Start the Next.js dev server:
   ```powershell
   $env:Path = "c:\Ethara prompt\.node\node-v20.12.2-win-x64;" + $env:Path
   npm run dev
   ```
2. Navigate to **[http://localhost:3000](http://localhost:3000)** in your browser.
3. Click **"Bypass & Login with Mock Account"** to immediately sign in as `Developer Admin`.
4. Submit a prompt (e.g. *"Python binary search"*). The backend will stream simulated mock code token-by-token directly into the Monaco Editor.

#### Option B: Live Convex Deployment (Cloud Database)
To sync state with a live cloud instance:
1. Initialize your Convex deployment:
   ```powershell
   $env:Path = "c:\Ethara prompt\.node\node-v20.12.2-win-x64;" + $env:Path
   npx convex dev
   ```
2. Follow the browser prompt to create a free account. This will automatically sync schema tables, indexes, and write your live endpoint keys into `.env.local`.

---

## 4. Evaluation Methodology

The comparative analysis evaluates the quality of code generator specifications against 7 core engineering metrics on a **1–5 Likert scale**:

1. **Correctness**: Checks for compilation success, proper schema optional field typing, correct SDK API calls (such as Vercel AI streamText), and correct syntax.
2. **Relevance**: Evaluates whether the solution implements all prompt requirements (e.g. rate-limiting, dark/light theme, accessibility tags, and SEO tags).
3. **Completeness**: Confirms if all pages, endpoints, mutations, and documentation setup steps are fully coded rather than stubbed with placeholders.
4. **Style & Presentation**: Analyzes clean coding standards, proper directory configurations, semantic code conventions, and general professional spec formatting.
5. **Coherence**: Audits internal logic consistency—specifically that folder maps match import directives and route parameters pass cleanly to database layers.
6. **Helpfulness**: Rates setup scripts, environment configurations, and external integrations (Google Cloud console, Vercel deployments).
7. **Creativity**: Highlights innovative architectural wrappers, optimization structures, and proposed application enhancements.

