"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function AuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to dashboard immediately if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      toast.error("Authentication failed. Please try again.");
    }
  };

  const handleBypassSignIn = async () => {
    try {
      await signIn("credentials", { callbackUrl: "/dashboard" });
    } catch (error) {
      toast.error("Authentication bypass failed.");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4 font-mono text-sm text-muted-foreground">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
          <span>Verifying session credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-background overflow-hidden">
      
      {/* Glow backgrounds */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-background to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[400px] w-[600px] rounded-full bg-gradient-to-tr from-cyan-500 to-violet-600 opacity-10 blur-3xl" />

      <Card className="w-full max-w-md border-border bg-card/60 backdrop-blur-lg shadow-2xl relative overflow-hidden rounded-2xl mx-4">
        
        {/* Glowing border card line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-violet-500" />
        
        <CardHeader className="text-center pt-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 shadow-lg shadow-cyan-500/20 mb-4 animate-pulse">
            <Terminal className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome to AI Code Builder</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Create production code snippets from plain English prompts
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-8">
          
          {/* Feature indicators list */}
          <div className="space-y-3.5 bg-muted/20 border border-border rounded-xl p-4">
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>Free instant GPT-4o stream generations</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-violet-400 shrink-0" />
              <span>Secure prompt validation and cookie storage</span>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              onClick={handleGoogleSignIn}
              className="w-full h-11 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 shadow-md transition-all font-medium rounded-xl flex items-center justify-center space-x-3.5"
            >
              {/* Minimalist Google Icon SVG */}
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-zinc-800">Continue with Google</span>
            </Button>

            <div className="relative my-1 flex items-center justify-center">
              <span className="absolute w-full border-t border-border" />
              <span className="relative bg-card px-2.5 text-[9px] uppercase text-muted-foreground tracking-wider font-semibold">
                Or Dev Sandbox
              </span>
            </div>

            <Button
              onClick={handleBypassSignIn}
              className="w-full h-11 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white shadow-md transition-all font-medium rounded-xl flex items-center justify-center space-x-2"
            >
              <Terminal className="h-4 w-4" />
              <span>Bypass & Login with Mock Account</span>
            </Button>
          </div>

        </CardContent>

        <CardFooter className="flex flex-col items-center pb-8 pt-4 px-8 text-center">
          <p className="text-xs text-muted-foreground leading-normal">
            By signing in, you agree to our Terms of Service <br />
            and Privacy Policy.
          </p>
        </CardFooter>

      </Card>
    </div>
  );
}
