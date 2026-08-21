"use client";

import { useId, useRef, useState } from "react";
import { ImagePlus, Loader2, Link2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"upload" | "url">("upload");

  const handleFile = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error ||
            (res.status === 401 ? "Please sign in again" : "Upload failed")
        );
      }
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="relative z-0">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-coffee-muted">{label}</span>
        <div className="flex rounded-lg border border-linen bg-cream/50 p-0.5 text-[10px]">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`rounded-md px-2 py-0.5 ${mode === "upload" ? "bg-sage-deep text-cream" : "text-coffee-muted"}`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`rounded-md px-2 py-0.5 ${mode === "url" ? "bg-sage-deep text-cream" : "text-coffee-muted"}`}
          >
            URL
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <>
          <input
            id={inputId}
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
          <label
            htmlFor={inputId}
            className={`flex cursor-pointer gap-4 rounded-xl border border-dashed border-linen bg-cream/40 p-3 transition hover:border-sage-medium hover:bg-cream/70 ${
              uploading ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-linen bg-cream/60">
              {value ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={value}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImagePlus className="h-8 w-8 text-coffee-muted/40" />
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-cream/80">
                  <Loader2 className="h-6 w-6 animate-spin text-sage-deep" />
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <span className="flex items-center gap-2 text-sm font-medium text-coffee">
                <ImagePlus className="h-4 w-4" />
                {uploading ? "Uploading…" : "Click to choose image"}
              </span>
              <p className="mt-1 text-[10px] text-coffee-muted">
                JPEG, PNG, WebP or GIF · max 5MB
              </p>
            </div>
          </label>
        </>
      ) : (
        <div className="relative">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-coffee-muted" />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... or /uploads/..."
            className="admin-input pl-9"
          />
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
