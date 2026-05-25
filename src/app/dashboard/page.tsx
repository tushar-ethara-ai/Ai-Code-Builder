"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/shared/Header";
import { useStreaming } from "@/hooks/useStreaming";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Play,
  Sparkles,
  Star,
  Trash2,
  Undo2,
  FolderCode,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";

const programmingLanguages = [
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
  { value: "Clean", label: "Clean & Simple" },
  { value: "Documented", label: "Highly Documented" },
  { value: "Explanatory", label: "Explanatory Comments" },
  { value: "Minimalist", label: "Minimalist / Short" },
  { value: "Verbose", label: "Verbose / Complete" },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [tone, setTone] = useState("Clean");
  const [generatedCode, setGeneratedCode] = useState("");

  const { outputCode, isLoading, error, startStream } = useStreaming();

  // Restore parameters from rerun redirections
  useEffect(() => {
    try {
      const storedPrompt = localStorage.getItem("rerun_prompt");
      const storedLanguage = localStorage.getItem("rerun_language");
      const storedTone = localStorage.getItem("rerun_tone");
      const storedCode = localStorage.getItem("rerun_code");

      if (storedPrompt) setPrompt(storedPrompt);
      if (storedLanguage) setLanguage(storedLanguage);
      if (storedTone) setTone(storedTone);
      if (storedCode) setGeneratedCode(storedCode);

      // Instantly clear storage
      localStorage.removeItem("rerun_prompt");
      localStorage.removeItem("rerun_language");
      localStorage.removeItem("rerun_tone");
      localStorage.removeItem("rerun_code");
    } catch (err) {
      console.warn("Storage check failed:", err);
    }
  }, []);

  // 1. Fetch Real-time Generations
  const userId = session?.user?.id || "";
  const recentGenerations = useQuery(api.generations.getRecentGenerations, {
    userId,
    limit: 12,
  });

  // 2. Convex Mutations
  const toggleFavoriteMutation = useMutation(api.generations.toggleFavorite);
  const deleteGenerationMutation = useMutation(api.generations.deleteGeneration);

  // Sync accumulated streaming code to Monaco
  useEffect(() => {
    if (outputCode) {
      setGeneratedCode(outputCode);
    }
  }, [outputCode]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first.");
      return;
    }
    if (prompt.length > 2000) {
      toast.error("Prompt cannot exceed 2000 characters.");
      return;
    }

    try {
      await startStream(prompt, language, tone, userId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickRestore = (gen: any) => {
    setPrompt(gen.prompt);
    setLanguage(gen.language.toLowerCase());
    setTone(gen.tone);
    setGeneratedCode(gen.outputCode);
    toast.success("Restored generation details!");
  };

  const handleToggleFavorite = async (e: React.MouseEvent, id: any) => {
    e.stopPropagation();
    try {
      const nextState = await toggleFavoriteMutation({ id, userId });
      toast.success(nextState ? "Starred generation!" : "Unstarred generation!");
    } catch (err) {
      toast.error("Failed to update star preference.");
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: any) => {
    e.stopPropagation();
    try {
      await deleteGenerationMutation({ id, userId });
      toast.success("Deleted generation entry.");
    } catch (err) {
      toast.error("Failed to delete generation entry.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-1 py-6 sm:py-8 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT side panel: control panel input */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            
            <Card className="border-border bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                  <span>Build Options</span>
                </CardTitle>
                <CardDescription>
                  Configure and generate code snippets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Prompt box */}
                <div className="space-y-2">
                  <label htmlFor="prompt-input" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Prompt
                  </label>
                  <div className="relative">
                    <Textarea
                      id="prompt-input"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe what you want to build (e.g. 'Debounce input hook in React with clean cleanups')..."
                      className="min-h-[140px] max-h-[300px] border-border bg-background/50 rounded-xl resize-y pr-2 pb-6 text-sm"
                      maxLength={2000}
                    />
                    <div className="absolute bottom-2 right-3 text-[10px] font-mono text-muted-foreground">
                      {prompt.length}/2000
                    </div>
                  </div>
                </div>

                {/* Dropdowns */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="language-select" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Language
                    </label>
                    <Select value={language} onValueChange={(val) => val && setLanguage(val)}>
                      <SelectTrigger id="language-select" className="border-border bg-background/50 rounded-xl h-10">
                        <SelectValue placeholder="Select" />
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

                  <div className="space-y-2">
                    <label htmlFor="tone-select" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Tone
                    </label>
                    <Select value={tone} onValueChange={(val) => val && setTone(val)}>
                      <SelectTrigger id="tone-select" className="border-border bg-background/50 rounded-xl h-10">
                        <SelectValue placeholder="Select" />
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
                </div>

                {/* Submit button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white rounded-xl shadow-md font-semibold transition-all"
                >
                  {isLoading ? (
                    <span className="flex items-center space-x-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Streaming Code...</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <Play className="h-4 w-4 fill-white" />
                      <span>Generate Snippet</span>
                    </span>
                  )}
                </Button>

              </CardContent>
            </Card>

            {/* Sidebar recent generations */}
            <Card className="border-border bg-card/40 backdrop-blur-md rounded-2xl shadow-lg flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  <FolderCode className="h-4 w-4 text-cyan-400" />
                  <span>Recent Generations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 pb-4">
                {recentGenerations === undefined ? (
                  <div className="flex justify-center py-10 text-xs font-mono text-muted-foreground">
                    <span className="animate-spin h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent mr-2" />
                    <span>Loading recent logs...</span>
                  </div>
                ) : recentGenerations.length === 0 ? (
                  <div className="text-center py-10 px-4 text-xs text-muted-foreground leading-relaxed">
                    <AlertCircle className="mx-auto h-5 w-5 text-muted-foreground/60 mb-2" />
                    No recent snippets found. Try generating one above!
                  </div>
                ) : (
                  <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
                    {recentGenerations.map((gen: any) => (
                      <div
                        key={gen._id}
                        onClick={() => handleQuickRestore(gen)}
                        className="group flex items-center justify-between p-2 rounded-xl hover:bg-muted/40 cursor-pointer transition-colors border border-transparent hover:border-border"
                      >
                        <div className="flex flex-col space-y-0.5 max-w-[70%]">
                          <span className="text-xs font-medium truncate text-foreground">
                            {gen.prompt}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">
                            {gen.language} &bull; {gen.tone}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          {/* Star toggle */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg"
                            onClick={(e) => handleToggleFavorite(e, gen._id)}
                            aria-label="Toggle Star"
                          >
                            <Star
                              className={`h-3.5 w-3.5 ${
                                gen.isFavorited ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                              }`}
                            />
                          </Button>
                          {/* Delete item */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={(e) => handleDelete(e, gen._id)}
                            aria-label="Delete entry"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* RIGHT side panel: code output editor */}
          <div className="lg:col-span-8 flex flex-col h-full">
            {error && (
              <div className="mb-4 p-4 rounded-xl border border-destructive bg-destructive/10 text-destructive text-sm flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold">Generation Error</p>
                  <p className="text-xs mt-1 text-destructive/90">{error}</p>
                </div>
              </div>
            )}

            <div className="flex-1 min-h-[500px]">
              <MonacoEditor
                code={generatedCode}
                language={language}
                onChange={setGeneratedCode}
                readOnly={isLoading}
              />
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
