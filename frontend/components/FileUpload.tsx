"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import Loader from "./Loader";

interface FileUploadProps {
  onUploadSuccess: (data: any) => void;
  className?: string;
}

export default function FileUpload({ onUploadSuccess, className }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      onUploadSuccess(data);
    } catch (err) {
      setError("Failed to upload document. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div className={cn("w-full max-w-2xl", className)}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed p-16 transition-all duration-500",
          dragActive
            ? "border-primary bg-primary/5 scale-[1.01] shadow-2xl shadow-primary/10"
            : "border-zinc-200 bg-white hover:border-primary/50 hover:bg-zinc-50/50 hover:shadow-xl hover:shadow-zinc-200/50",
          isUploading && "opacity-50 pointer-events-none"
        )}
      >
        <input
          type="file"
          className="absolute inset-0 cursor-pointer opacity-0"
          accept=".pdf"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          disabled={isUploading}
        />

        <div className="flex flex-col items-center text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-50 text-primary shadow-inner">
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <h3 className="mb-3 text-3xl font-bold text-zinc-900 tracking-tight">Drop your PDF here</h3>
          <p className="max-w-xs text-lg font-medium text-zinc-500">
            or <span className="text-primary underline decoration-primary/30 underline-offset-4">browse files</span> from your computer
          </p>
        </div>

        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-[2rem] backdrop-blur-sm">
            <Loader size="lg" />
            <p className="mt-4 font-bold text-primary animate-pulse">Processing document...</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-red-50 p-4 text-red-600 border border-red-100">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}
    </div>
  );
}
