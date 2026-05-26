"use client";

import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";

type ImageUploadProps = {
  onChange: (files: FileList | null) => void;
  multiple?: boolean;
  error?: string;
  required?: boolean;
};

export function ImageUpload({
  onChange,
  multiple = false,
  error,
}: ImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [validationError, setValidationError] = useState("");

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  const maxSizeBytes = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError("");
    const files = e.target.files;
    if (!files) return;

    const filesArray = Array.from(files);

    // Validate size and file type
    for (const file of filesArray) {
      if (!allowedTypes.includes(file.type)) {
        setValidationError("Only JPG, PNG, WebP, GIF and SVG image files are allowed.");
        return;
      }
      if (file.size > maxSizeBytes) {
        setValidationError("Each image file must be less than 5MB.");
        return;
      }
    }

    let newFiles: File[] = [];
    if (multiple) {
      newFiles = [...selectedFiles, ...filesArray];
    } else {
      newFiles = filesArray.slice(0, 1);
    }

    setSelectedFiles(newFiles);

    // Forward to react-hook-form
    if (typeof DataTransfer !== "undefined") {
      const dt = new DataTransfer();
      newFiles.forEach((file) => dt.items.add(file));
      onChange(dt.files);
    } else {
      onChange(newFiles as any);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);

    if (typeof DataTransfer !== "undefined") {
      const dt = new DataTransfer();
      updated.forEach((file) => dt.items.add(file));
      onChange(dt.files.length > 0 ? dt.files : null);
    } else {
      onChange(updated.length > 0 ? (updated as any) : null);
    }
  };

  useEffect(() => {
    // Generate object URLs for previewing images
    const objectUrls = selectedFiles.map((file) => {
      if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
        try {
          return URL.createObjectURL(file);
        } catch (_err) {
          return "";
        }
      }
      return "";
    }).filter(Boolean);
    setPreviews(objectUrls);

    // Clean up URLs
    return () => {
      objectUrls.forEach((url) => {
        if (url && typeof URL !== "undefined" && typeof URL.revokeObjectURL === "function") {
          try {
            URL.revokeObjectURL(url);
          } catch (_err) {
            // ignore
          }
        }
      });
    };
  }, [selectedFiles]);

  return (
    <div className="space-y-3">
      <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#e7dfd3] hover:border-zar-gold bg-white p-6 transition-colors cursor-pointer text-center group">
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
        />
        <div className="space-y-2 pointer-events-none flex flex-col items-center">
          <Upload className="h-10 w-10 text-zar-muted group-hover:text-zar-gold transition-colors" />
          <div className="flex text-sm text-zar-muted">
            <span className="font-semibold text-zar-gold group-hover:text-[#b09664] transition-colors">
              Upload {multiple ? "images" : "an image"}
            </span>
            <p className="pl-1">or drag and drop here</p>
          </div>
          <p className="text-xs text-zar-muted font-medium">JPG, PNG, WebP, GIF, SVG up to 5MB</p>
        </div>
      </div>

      {(validationError || error) && (
        <span className="text-xs text-red-600 block font-semibold">
          {validationError || error}
        </span>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <span className="block text-xs font-bold text-zar-title">
            Selected File{selectedFiles.length > 1 ? "s" : ""}:
          </span>
          <div className="flex flex-wrap gap-3">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden border border-[#eee7dd] h-20 w-20 shadow-sm bg-white">
                <img src={previews[idx]} alt="Selected preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(idx)}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-150 text-xs font-bold"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
