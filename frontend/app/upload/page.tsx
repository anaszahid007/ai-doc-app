"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";
import { useAuth } from "@/hooks/useAuth";

export default function UploadPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, isLoading, router]);

  const handleUploadSuccess = (data: any) => {
    if (data.data?.document_id) {
      localStorage.setItem("current_doc_id", data.data.document_id);
    }
    router.push("/chat");
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 mx-auto mb-4"></div>
          <p className="text-zinc-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-24">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Upload Document</h1>
        <p className="text-zinc-500 max-w-md mx-auto">
          Start by uploading a PDF file. Our AI will process it so you can start asking questions.
        </p>
      </div>

      <FileUpload onUploadSuccess={handleUploadSuccess} />

      <div className="mt-12 text-center text-sm text-zinc-400">
        <p>Maximum file size: 10MB</p>
        <p>Supports only PDF format currently.</p>
      </div>
    </div>
  );
}
