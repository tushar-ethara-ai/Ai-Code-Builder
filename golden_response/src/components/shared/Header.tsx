"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sun, Moon, Terminal, Cpu, Clock, Settings2, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Cpu, protected: true },
    { href: "/history", label: "History", icon: Clock, protected: true },
    { href: "/settings", label: "Settings", icon: Settings2, protected: true },
  ];

  const handleAuth = () => {
    if (session) {
      signOut({ callbackUrl: "/" });
    } else {
      signIn("google", { callbackUrl: "/dashboard" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Branding Brand */}
        <Link href="/" className="flex items-center space-x-2 text-foreground group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
            <Terminal className="h-5 w-5 text-white" />
          </div>
          <span className="hidden font-sans text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent sm:block">
            AI Code<span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">Builder</span>
          </span>
        </Link>

        {/* Desktop Navigation Linkages */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            if (link.protected && !session) return null;
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                >
                  <Icon className="mr-1.5 h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Actions Menu */}
        <div className="flex items-center space-x-3">
          
          {/* Light/Dark Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem] text-amber-400 animate-pulse" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem] text-indigo-500" />
            )}
          </Button>

          {/* Account Sessions */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full" aria-label="Account details">
                    <Avatar className="h-10 w-10 border border-muted ring-offset-background transition-all hover:ring-2 hover:ring-cyan-500">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User Avatar"} />
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-violet-600 text-white">
                        {session.user?.name ? session.user.name[0].toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                }
              />
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/dashboard">
                  <DropdownMenuItem className="cursor-pointer">
                    <Cpu className="mr-2 h-4 w-4" />
                    <span>Workspace</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/history">
                  <DropdownMenuItem className="cursor-pointer">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>History</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/settings">
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings2 className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" onClick={handleAuth}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/20 font-medium rounded-lg"
            >
              Sign In
            </Button>
          )}

          {/* Mobile Sheet Trigger Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="rounded-lg md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col space-y-6 pt-6">
                <div className="flex items-center space-x-2 text-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-600 text-white">
                    <Terminal className="h-4 w-4" />
                  </div>
                  <span className="font-bold tracking-tight">AI CodeBuilder</span>
                </div>
                <DropdownMenuSeparator />
                <div className="flex flex-col space-y-2">
                  {navLinks.map((link) => {
                    if (link.protected && !session) return null;
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className="w-full justify-start rounded-lg px-3 py-2 text-sm font-medium"
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          {link.label}
                        </Button>
                      </Link>
                    );
                  })}
                  {!session && (
                    <Button
                      onClick={() => {
                        setMobileOpen(false);
                        signIn("google", { callbackUrl: "/dashboard" });
                      }}
                      className="w-full bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white"
                    >
                      Sign In with Google
                    </Button>
                  )}
                  {session && (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setMobileOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full justify-start mt-4"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
