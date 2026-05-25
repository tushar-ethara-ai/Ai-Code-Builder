import { Header } from "@/components/shared/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Terminal,
  Zap,
  History,
  Lock,
  Moon,
  Sparkles,
  Layout,
  Code2
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1">
        
        {/* Glowing Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/20 via-background to-background">
          
          {/* Neon mesh backdrop */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-cyan-400 to-violet-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            
            {/* Sparkle badge */}
            <div className="mx-auto mb-6 flex max-w-fit items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-4 py-1.5 backdrop-blur-md animate-bounce">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-300">
                Supercharged by GPT-4o & Monaco
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
              Generate Production-Grade Code <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 bg-clip-text text-transparent">
                From Natural Language In Seconds
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Stop writing boilerplate. Describe your logic, choose your language, and watch the AI stream high-quality, formatted code straight into an interactive Monaco editor.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard" id="cta-get-started">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white rounded-xl shadow-lg shadow-cyan-500/20 px-8 font-semibold">
                  Start Building Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="rounded-xl px-8 border-border hover:bg-muted/40 font-medium">
                  Explore Features
                </Button>
              </Link>
            </div>

            {/* Simulated Live Editor Preview Mock */}
            <div className="mx-auto mt-20 max-w-4xl rounded-2xl border border-border bg-[#1e1e1e]/90 shadow-2xl p-2 backdrop-blur-md">
              <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/60 rounded-t-xl">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-xs font-mono text-zinc-400">auth_provider.ts — TypeScript</span>
                </div>
                <div className="h-4 w-4 rounded bg-zinc-800" />
              </div>
              <div className="p-6 text-left font-mono text-xs sm:text-sm text-cyan-300 leading-relaxed overflow-x-auto min-h-[220px]">
                <span className="text-zinc-500">// AI generates robust auth handlers on the fly...</span> <br />
                <span className="text-pink-400">import</span> NextAuth <span className="text-pink-400">from</span> <span className="text-amber-300">&quot;next-auth&quot;</span>; <br />
                <span className="text-pink-400">import</span> Google <span className="text-pink-400">from</span> <span className="text-amber-300">&quot;next-auth/providers/google&quot;</span>; <br /> <br />
                
                <span className="text-pink-400">export const</span> &#123; handlers, auth &#125; = NextAuth(&#123; <br />
                &nbsp;&nbsp;providers: [ <br />
                &nbsp;&nbsp;&nbsp;&nbsp;Google(&#123; <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;clientId: process.env.GOOGLE_CLIENT_ID, <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;clientSecret: process.env.GOOGLE_CLIENT_SECRET, <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&#125;), <br />
                &nbsp;&nbsp;], <br />
                &nbsp;&nbsp;session: &#123; strategy: <span className="text-amber-300">&quot;jwt&quot;</span> &#125;, <br />
                &#125;);
              </div>
            </div>

          </div>
        </section>

        {/* Features Console Grid */}
        <section id="features" className="py-20 md:py-28 border-t border-border bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                A Unified Workspace for Advanced Code Creation
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Engineered with modern tools to simplify coding pipelines, maintain security, and optimize performance.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              
              {/* Feature 1 */}
              <div className="relative group rounded-2xl border border-border bg-card p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white mb-6 shadow-md shadow-cyan-500/10">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-cyan-400 transition-colors">
                  Real-Time AI Streaming
                </h3>
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                  Powered by OpenAI GPT-4o and Vercel AI SDK. Outputs steam token-by-token instantly, minimizing wait times.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative group rounded-2xl border border-border bg-card p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-white mb-6 shadow-md shadow-sky-400/10">
                  <Code2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-sky-400 transition-colors">
                  Monaco Code Editor
                </h3>
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                  Full VS Code environment inside the browser. Loaded dynamically with syntax coloring, code locks, and copy/download toolbars.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative group rounded-2xl border border-border bg-card p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 to-violet-600 text-white mb-6 shadow-md shadow-purple-500/10">
                  <History className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-purple-400 transition-colors">
                  Persistent DB History
                </h3>
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                  Automatic history tracking in Convex DB. Star your favorite snippets, filter by language/tone, and delete old snippets instantly.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="relative group rounded-2xl border border-border bg-card p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white mb-6 shadow-md shadow-amber-400/10">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-amber-400 transition-colors">
                  Secure Validation
                </h3>
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                  Zod schemas validate inputs, prompt sanitizers neutralize injection attempts, and Auth.js guards endpoint tokens on the backend.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="relative group rounded-2xl border border-border bg-card p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white mb-6 shadow-md shadow-pink-500/10">
                  <Moon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-pink-400 transition-colors">
                  Theme Adaptability
                </h3>
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                  Beautiful custom responsive layout adapting flawlessly to Light/Dark modes, persisting your preference across visits.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="relative group rounded-2xl border border-border bg-card p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-600 text-white mb-6 shadow-md shadow-emerald-400/10">
                  <Layout className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-emerald-400 transition-colors">
                  Responsive UI Panels
                </h3>
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                  Optimized for mobile, tablets, and high-DPI displays. Slide-out sheets and adaptive grid columns yield elegant workbenches anywhere.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Simple CTA Section */}
        <section className="py-20 text-center relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Ready to Accelerate Your Workflow?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Sign in with Google, choose your preferred language, and generate highly optimized code in seconds.
            </p>
            <div className="mt-8">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white rounded-xl shadow-lg px-10 py-6 font-semibold">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-border bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} AI Code Builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
