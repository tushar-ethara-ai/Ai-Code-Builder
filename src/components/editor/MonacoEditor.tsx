"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download, Lock, Edit2, Terminal } from "lucide-react";
import { toast } from "sonner";

// Dynamic import to prevent hydration issues with Monaco Editor
const Monaco = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface MonacoEditorProps {
  code: string;
  language: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
}

const languageExtensions: Record<string, string> = {
  typescript: "ts",
  javascript: "js",
  python: "py",
  go: "go",
  rust: "rs",
  cpp: "cpp",
  html: "html",
  css: "css",
  json: "json",
};

export function MonacoEditor({
  code,
  language,
  onChange,
  readOnly = true,
}: MonacoEditorProps) {
  const [copied, setCopied] = useState(false);
  const [isEditable, setIsEditable] = useState(!readOnly);
  const [editorVal, setEditorVal] = useState(code);

  useEffect(() => {
    setEditorVal(code);
  }, [code]);

  useEffect(() => {
    setIsEditable(!readOnly);
  }, [readOnly]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editorVal);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy code.");
    }
  };

  const handleDownload = () => {
    try {
      const ext = languageExtensions[language.toLowerCase()] || "txt";
      const blob = new Blob([editorVal], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `generated_code.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded generated_code.${ext}`);
    } catch (err) {
      toast.error("Failed to download file.");
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    const val = value ?? "";
    setEditorVal(val);
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
      
      {/* Editor Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {language}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground font-mono">
            {isEditable ? "Editable" : "Read-Only"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Toggle Editable Lock */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditable(!isEditable)}
            className="h-8 rounded-lg text-xs"
            title={isEditable ? "Lock Editor" : "Make Editable"}
          >
            {isEditable ? (
              <>
                <Lock className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
                Lock
              </>
            ) : (
              <>
                <Edit2 className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                Edit
              </>
            )}
          </Button>

          {/* Copy Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 rounded-lg text-xs"
            title="Copy Code"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                Copy
              </>
            )}
          </Button>

          {/* Download Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-8 rounded-lg text-xs"
            title="Download Code"
          >
            <Download className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
            Download
          </Button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 min-h-[400px] w-full bg-[#1e1e1e] relative">
        <Monaco
          height="100%"
          language={language.toLowerCase()}
          value={editorVal}
          theme="vs-dark"
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            readOnly: !isEditable,
            fontSize: 14,
            fontFamily: "var(--font-geist-mono), Courier New, monospace",
            lineHeight: 22,
            padding: { top: 16, bottom: 16 },
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            wordWrap: "on",
            automaticLayout: true,
          }}
          loading={
            <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e] text-muted-foreground font-mono text-sm">
              <span className="flex items-center space-x-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                <span>Loading Monaco Editor...</span>
              </span>
            </div>
          }
        />
      </div>
    </div>
  );
}
