"use client";

import { useEffect, useState } from "react";
import ChatBox from "@/components/ChatBox";
import Sidebar from "@/components/Sidebar";
import { useChat } from "@/hooks/useChat";

export default function ChatPage() {
  const [docId, setDocId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<{ id: string; name: string }[]>([]);
  
  useEffect(() => {
    // In a real app, we'd fetch this from the API
    const storedDocId = localStorage.getItem("current_doc_id");
    const storedDocName = localStorage.getItem("current_doc_name") || "Document.pdf";
    
    setDocId(storedDocId);
    
    if (storedDocId) {
      setDocuments([{ id: storedDocId, name: storedDocName }]);
    }
  }, []);

  const { messages, isLoading, error, sendMessage } = useChat(docId || undefined);

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  const handleSelectDoc = (id: string) => {
    setDocId(id);
    localStorage.setItem("current_doc_id", id);
    window.location.reload(); 
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar 
        documents={documents} 
        currentDocId={docId || undefined} 
        onSelectDoc={handleSelectDoc}
        className="hidden md:flex" 
      />
      
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Mobile Header */}
        <div className="md:hidden border-b border-zinc-100 p-4 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <h1 className="font-bold">Chat</h1>
          <button className="p-2 rounded-lg bg-zinc-50 text-zinc-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="m-4 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
            {error}
          </div>
        )}
        
        <div className="flex-1 flex flex-col min-h-0">
          <ChatBox 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
          />
        </div>
      </main>
    </div>
  );
}
