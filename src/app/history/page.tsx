"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/shared/Header";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Star,
  Trash2,
  Terminal,
  Clock,
  Play,
  AlertCircle,
  FileCode,
  Calendar
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const programmingLanguages = [
  { value: "all", label: "All Languages" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "cpp", label: "C++" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
];

const toneOptions = [
  { value: "all", label: "All Tones" },
  { value: "Clean", label: "Clean & Simple" },
  { value: "Documented", label: "Highly Documented" },
  { value: "Explanatory", label: "Explanatory Comments" },
  { value: "Minimalist", label: "Minimalist / Short" },
  { value: "Verbose", label: "Verbose / Complete" },
];

const ITEMS_PER_PAGE = 9;

export default function HistoryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState("all");
  const [tone, setTone] = useState("all");
  const [starredOnly, setStarredOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Fetch generations based on query state
  const userId = session?.user?.id || "";
  const list = useQuery(api.generations.getGenerations, {
    userId,
    searchTerm: searchTerm ? searchTerm : undefined,
    language: language !== "all" ? language : undefined,
    tone: tone !== "all" ? tone : undefined,
    favoritesOnly: starredOnly ? true : undefined,
  });

  // 2. Mutations
  const toggleFavoriteMutation = useMutation(api.generations.toggleFavorite);
  const deleteGenerationMutation = useMutation(api.generations.deleteGeneration);

  const handleToggleFavorite = async (id: any) => {
    try {
      const nextState = await toggleFavoriteMutation({ id, userId });
      toast.success(nextState ? "Starred snippet!" : "Unstarred snippet!");
    } catch (err) {
      toast.error("Failed to update star preference.");
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await deleteGenerationMutation({ id, userId });
      toast.success("Deleted snippet from history.");
    } catch (err) {
      toast.error("Failed to delete generation.");
    }
  };

  const handleReRun = (gen: any) => {
    // We redirect to dashboard and load parameters
    // In production React, we could pass state inside sessionStorage or a global context!
    // Storing in localStorage is extremely clean and reliable for simple redirects!
    try {
      localStorage.setItem("rerun_prompt", gen.prompt);
      localStorage.setItem("rerun_language", gen.language.toLowerCase());
      localStorage.setItem("rerun_tone", gen.tone);
      localStorage.setItem("rerun_code", gen.outputCode);
      
      router.push("/dashboard");
      toast.success("Loaded snippet parameters into workspace!");
    } catch (err) {
      toast.error("Failed to re-run snippet.");
    }
  };

  // Add a listener to dashboard/page to load the parameters immediately upon loading!
  // That will make re-running incredibly coherent and functional!

  // Pagination calculations
  const totalItems = list ? list.length : 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const paginatedList = list
    ? list.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : [];

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-1 py-8 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Generation History</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            View, search, and manage your past AI code generations.
          </p>
        </div>

        {/* Filter Toolbar Dashboard Console */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-card/30 backdrop-blur-md border border-border p-4 rounded-2xl shadow-md">
          
          {/* Search */}
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search prompts or output code..."
              className="pl-10 border-border bg-background/50 rounded-xl"
            />
          </div>

          {/* Language selector */}
          <div className="md:col-span-3">
            <Select value={language} onValueChange={(val) => { if (val) { setLanguage(val); setCurrentPage(1); } }}>
              <SelectTrigger className="border-border bg-background/50 rounded-xl">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {programmingLanguages.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tone selector */}
          <div className="md:col-span-3">
            <Select value={tone} onValueChange={(val) => { if (val) { setTone(val); setCurrentPage(1); } }}>
              <SelectTrigger className="border-border bg-background/50 rounded-xl">
                <SelectValue placeholder="Tone" />
              </SelectTrigger>
              <SelectContent>
                {toneOptions.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Star filter toggle */}
          <div className="md:col-span-2 flex justify-end">
            <Button
              variant={starredOnly ? "secondary" : "ghost"}
              onClick={() => {
                setStarredOnly(!starredOnly);
                setCurrentPage(1);
              }}
              className="w-full md:w-auto rounded-xl border border-border bg-background/50 hover:bg-muted font-medium flex items-center justify-center space-x-2"
            >
              <Star className={`h-4 w-4 ${starredOnly ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
              <span>Starred Only</span>
            </Button>
          </div>

        </div>

        {/* Results grid */}
        {list === undefined ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground font-mono text-sm">
            <span className="animate-spin h-8 w-8 rounded-full border-4 border-cyan-400 border-t-transparent mb-4" />
            <span>Loading generation history...</span>
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border bg-card/25 rounded-2xl p-8 max-w-md mx-auto">
            <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground/60 mb-3" />
            <h3 className="font-semibold text-lg">No snippets found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search criteria or create a new snippet in the workspace.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedList.map((gen: any) => (
                <Card key={gen._id} className="border-border bg-card/40 hover:bg-card/60 backdrop-blur-md rounded-2xl shadow-md transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between overflow-hidden relative">
                  
                  {/* Card Glowing Line */}
                  {gen.isFavorited && (
                    <div className="absolute top-0 left-0 w-full h-[2.5px] bg-amber-400" />
                  )}

                  <CardHeader className="pb-3 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Terminal className="h-4 w-4 text-cyan-400" />
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full">
                          {gen.language}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground px-1">
                          {gen.tone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        
                        {/* Star */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          onClick={() => handleToggleFavorite(gen._id)}
                          aria-label="Star"
                        >
                          <Star className={`h-4 w-4 ${gen.isFavorited ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                        </Button>

                        {/* Re-run Workspace */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-cyan-400 hover:text-cyan-500 hover:bg-cyan-500/10"
                          onClick={() => handleReRun(gen)}
                          title="Restore in Workspace"
                        >
                          <Play className="h-4 w-4 fill-cyan-400" />
                        </Button>

                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          onClick={() => handleDelete(gen._id)}
                          title="Delete snippet"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                      </div>
                    </div>
                    <CardTitle className="text-sm font-semibold text-foreground line-clamp-2 mt-4 hover:line-clamp-none transition-all duration-300">
                      &quot;{gen.prompt}&quot;
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pb-4">
                    {/* Small code window snippet mockup */}
                    <div className="rounded-xl border border-border bg-[#151515] p-3 text-[10px] font-mono text-cyan-400 max-h-[140px] overflow-hidden select-none">
                      <pre className="line-clamp-6 text-left">{gen.outputCode}</pre>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2 pb-4 border-t border-border bg-muted/20 px-6 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(gen.createdAt).toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(gen.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                  </CardFooter>

                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-xl px-4"
                >
                  Previous
                </Button>
                <div className="text-xs font-mono text-muted-foreground">
                  Page <span className="text-foreground font-semibold">{currentPage}</span> of <span className="text-foreground font-semibold">{totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-xl px-4"
                >
                  Next
                </Button>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
