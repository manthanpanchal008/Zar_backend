"use client";

import { useEffect, useRef, useState } from "react";
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";

type RichTextEditorProps = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
};

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update editor HTML only if value changes externally and is different
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string) => {
    if (!isMounted) return;
    document.execCommand(command, false, "");
    handleInput();
  };

  return (
    <div className="rounded-lg border border-[#e7dfd3] bg-white overflow-hidden focus-within:border-zar-gold focus-within:ring-2 focus-within:ring-zar-gold/25 transition-all">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-[#e7dfd3] bg-[#fdfcfa] p-2">
        <button
          type="button"
          onClick={() => executeCommand("bold")}
          className="p-1.5 rounded hover:bg-[#eee7dd] text-zar-muted hover:text-black transition-colors"
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("italic")}
          className="p-1.5 rounded hover:bg-[#eee7dd] text-zar-muted hover:text-black transition-colors"
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("underline")}
          className="p-1.5 rounded hover:bg-[#eee7dd] text-zar-muted hover:text-black transition-colors"
          title="Underline"
        >
          <Underline size={16} />
        </button>
        <div className="w-[1px] h-4 bg-[#e7dfd3] mx-1" />
        <button
          type="button"
          onClick={() => executeCommand("insertUnorderedList")}
          className="p-1.5 rounded hover:bg-[#eee7dd] text-zar-muted hover:text-black transition-colors"
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("insertOrderedList")}
          className="p-1.5 rounded hover:bg-[#eee7dd] text-zar-muted hover:text-black transition-colors"
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
      </div>

      {/* Editor Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        className="min-h-[150px] p-3 outline-none text-black bg-white rich-editor-content prose prose-sm max-w-none"
        data-placeholder={placeholder}
        style={{ minHeight: "150px" }}
      />
    </div>
  );
}
