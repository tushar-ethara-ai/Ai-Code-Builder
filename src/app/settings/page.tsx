"use client";

import { useSession, signOut } from "next-auth/react";
import { Header } from "@/components/shared/Header";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useTheme } from "@/hooks/useTheme";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User,
  Settings2,
  Moon,
  Sun,
  Laptop,
  Cpu,
  BarChart3,
  Calendar,
  LogOut,
  Sparkles,
  Zap
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  // Fetch usage stats
  const userId = session?.user?.id || "";
  const stats = useQuery(api.usageStats.getUsageStats, { userId });

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    toast.success("Signed out successfully.");
  };

  // Safe defaults if stats are loading or mock
  const totalGenerations = stats?.totalGenerations ?? 0;
  const tokensUsed = stats?.tokensUsed ?? 0;
  const lastGeneratedAt = stats?.lastGeneratedAt ?? 0;

  // Approximate calculations (e.g. limit of 50,000 tokens for free tier dashboard display)
  const tokenLimit = 50000;
  const tokenPercentage = Math.min(Math.round((tokensUsed / tokenLimit) * 100), 100);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-1 py-8 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Settings & Workspace</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Manage your developer profile, theme settings, and inspect AI token analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Profile & Theme Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* User Profile display Card */}
            <Card className="border-border bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg">
              <div className="h-24 bg-gradient-to-r from-cyan-500/20 to-violet-600/20" />
              <CardContent className="relative px-6 pb-6 pt-0 text-center">
                
                {/* Large Avatar */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-violet-600 text-white text-3xl font-bold">
                      {session?.user?.name ? session.user.name[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="mt-16 space-y-1">
                  <h2 className="text-xl font-bold text-foreground">{session?.user?.name || "Developer"}</h2>
                  <p className="text-sm text-muted-foreground">{session?.user?.email || "developer@example.com"}</p>
                </div>

                <div className="mt-6 border-t border-border pt-6 flex justify-center">
                  <Button
                    variant="destructive"
                    onClick={handleSignOut}
                    className="rounded-xl px-6 w-full flex items-center justify-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out Session</span>
                  </Button>
                </div>

              </CardContent>
            </Card>

            {/* Theme Toggle persistency Card */}
            <Card className="border-border bg-card/40 backdrop-blur-md rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-md">
                  <Settings2 className="h-5 w-5 text-cyan-400" />
                  <span>Theme Adaptation</span>
                </CardTitle>
                <CardDescription>
                  Configure your workspace lighting layout
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">Star Persistence</p>
                    <p className="text-xs text-muted-foreground">Preferences are automatically synced in Convex DB</p>
                  </div>
                  <div className="flex h-10 items-center justify-center rounded-xl bg-muted border border-border p-1 space-x-1">
                    
                    {/* Dark */}
                    <Button
                      variant={theme === "dark" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setTheme("dark")}
                      className={`h-8 rounded-lg text-xs ${theme === "dark" ? "bg-background shadow-sm" : ""}`}
                    >
                      <Moon className="mr-1.5 h-3.5 w-3.5" />
                      Dark
                    </Button>

                    {/* Light */}
                    <Button
                      variant={theme === "light" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setTheme("light")}
                      className={`h-8 rounded-lg text-xs ${theme === "light" ? "bg-background shadow-sm" : ""}`}
                    >
                      <Sun className="mr-1.5 h-3.5 w-3.5" />
                      Light
                    </Button>

                  </div>
                </div>

              </CardContent>
            </Card>

          </div>

          {/* RIGHT: Usage Stats & Analytics */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Analytics Header Summary */}
            <Card className="border-border bg-card/40 backdrop-blur-md rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-md">
                  <BarChart3 className="h-5 w-5 text-violet-400" />
                  <span>AI Usage Analytics</span>
                </CardTitle>
                <CardDescription>
                  Monitors prompt volume and estimated token calculations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Stats quick grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Stat 1 */}
                  <div className="border border-border rounded-2xl p-4 bg-background/30 flex flex-col justify-between">
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Generations</span>
                      <Cpu className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="mt-4">
                      <div className="text-3xl font-extrabold font-mono tracking-tight">{totalGenerations}</div>
                      <p className="text-[10px] text-muted-foreground mt-1">Total requests made</p>
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className="border border-border rounded-2xl p-4 bg-background/30 flex flex-col justify-between">
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Tokens Used</span>
                      <Zap className="h-4 w-4 text-violet-400" />
                    </div>
                    <div className="mt-4">
                      <div className="text-3xl font-extrabold font-mono tracking-tight">{tokensUsed.toLocaleString()}</div>
                      <p className="text-[10px] text-muted-foreground mt-1">Estimated token usage</p>
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className="border border-border rounded-2xl p-4 bg-background/30 flex flex-col justify-between">
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Last Build</span>
                      <Calendar className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="mt-4">
                      <div className="text-sm font-semibold font-mono tracking-tight truncate">
                        {lastGeneratedAt > 0 ? new Date(lastGeneratedAt).toLocaleDateString() : "Never"}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-3">
                        {lastGeneratedAt > 0 ? new Date(lastGeneratedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "No logs found"}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Progress bar visualizer */}
                <div className="space-y-2 border-t border-border pt-6">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-muted-foreground font-semibold uppercase tracking-wider">Developer Free Tier Limit</span>
                    <span className="text-foreground font-bold">{tokenPercentage}% ({tokensUsed.toLocaleString()} / {tokenLimit.toLocaleString()} Tokens)</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted border border-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-violet-600 transition-all duration-500 rounded-full"
                      style={{ width: `${tokenPercentage}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground italic leading-normal">
                    * Estimated calculation mapping roughly 4 characters per token. Free tier offers up to 50,000 generated tokens.
                  </p>
                </div>

              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="border-border bg-card/40 backdrop-blur-md rounded-2xl shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-sm text-muted-foreground uppercase tracking-wider font-bold">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span>Developer Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  1. <strong>Quick Restores</strong>: Under the History tab, you can click the blue &quot;Play&quot; arrow on any past generation to instantly load its prompt and workspace settings back into the Dashboard.
                </p>
                <p>
                  2. <strong>Code Lock</strong>: Use the Lock/Edit toggle above the Monaco editor to switch between read-only mode (preventing accidental key presses) and edit mode.
                </p>
              </CardContent>
            </Card>

          </div>

        </div>

      </main>
    </div>
  );
}
