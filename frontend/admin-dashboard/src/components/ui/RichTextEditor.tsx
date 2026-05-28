"use client";

import { useEffect, useRef, useState } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Code } from "lucide-react";

type RichTextEditorProps = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
};

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlValue, setHtmlValue] = useState(value || "");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update editor HTML only if value changes externally and is different
  useEffect(() => {
    setHtmlValue(value || "");
    if (!isHtmlMode && editorRef.current && editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value, isHtmlMode]);

  const handleInput = () => {
    if (editorRef.current) {
      const val = editorRef.current.innerHTML;
      setHtmlValue(val);
      onChange(val);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setHtmlValue(val);
    onChange(val);
  };

  const executeCommand = (command: string) => {
    if (!isMounted || isHtmlMode) return;
    document.execCommand(command, false, "");
    handleInput();
  };

  const toggleHtmlMode = () => {
    if (isHtmlMode) {
      setIsHtmlMode(false);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = htmlValue;
        }
      }, 0);
    } else {
      if (editorRef.current) {
        setHtmlValue(editorRef.current.innerHTML);
      }
      setIsHtmlMode(true);
    }
  };

  return (
    <div className="rounded-lg border border-[#e7dfd3] bg-white overflow-hidden focus-within:border-zar-gold focus-within:ring-2 focus-within:ring-zar-gold/25 transition-all">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-[#e7dfd3] bg-[#fdfcfa] p-2">
        <button
          type="button"
          disabled={isHtmlMode}
          onClick={() => executeCommand("bold")}
          className={`p-1.5 rounded hover:bg-[#eee7dd] text-zar-muted hover:text-black transition-colors ${
            isHtmlMode ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          disabled={isHtmlMode}
          onClick={() => executeCommand("italic")}
          className={`p-1.5 rounded hover:bg-[#eee7dd] text-zar-muted hover:text-black transition-colors ${
            isHtmlMode ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          disabled={isHtmlMode}
          onClick={() => executeCommand("underline")}
          className={`p-1.5 rounded hover:bg-[#eee7dd] text-zar-muted hover:text-black transition-colors ${
            isHtmlMode ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Underline"
        >
          <Underline size={16} />
        </button>
        <div className="w-[1px] h-4 bg-[#e7dfd3] mx-1" />
        <button
          type="button"
          disabled={isHtmlMode}
          onClick={() => executeCommand("insertUnorderedList")}
          className={`p-1.5 rounded hover:bg-[#eee7dd] text-zar-muted hover:text-black transition-colors ${
            isHtmlMode ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          disabled={isHtmlMode}
          onClick={() => executeCommand("insertOrderedList")}
          className={`p-1.5 rounded hover:bg-[#eee7dd] text-zar-muted hover:text-black transition-colors ${
            isHtmlMode ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        <div className="w-[1px] h-4 bg-[#e7dfd3] mx-1" />
        <button
          type="button"
          onClick={toggleHtmlMode}
          className={`p-1.5 rounded hover:bg-[#eee7dd] text-zar-muted hover:text-black transition-colors ${
            isHtmlMode ? "bg-[#eee7dd] text-black font-bold" : ""
          }`}
          title="Toggle HTML Source"
        >
          <Code size={16} />
        </button>
      </div>

      {/* Editor Content Area */}
      {isHtmlMode ? (
        <textarea
          value={htmlValue}
          onChange={handleTextareaChange}
          placeholder="Edit HTML Source..."
          className="w-full min-h-[150px] p-3 outline-none text-black bg-white font-mono text-sm border-0 focus:ring-0 resize-y"
          style={{ minHeight: "150px" }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          className="min-h-[150px] p-3 outline-none text-black bg-white rich-editor-content prose prose-sm max-w-none"
          data-placeholder={placeholder}
          style={{ minHeight: "150px" }}
        />
      )}
    </div>
  );
}
