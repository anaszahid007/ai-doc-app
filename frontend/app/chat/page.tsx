"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatBox from "@/components/ChatBox";
import Sidebar from "@/components/Sidebar";
import { useChat } from "@/hooks/useChat";
import { convApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function ChatPage() {
  const [activeConv, setActiveConv] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchConvs = async () => {
        try {
            const data = await convApi.list();
            setConversations(data);
            if (data.length > 0 && !activeConv) {
                setActiveConv(data[0]);
            }
        } catch (err) {
            console.error("Failed to fetch conversations", err);
        }
    };

    fetchConvs();
  }, [isAuthenticated, router]);

  const { messages, isLoading: chatLoading, error, sendMessage } = useChat(
    activeConv?.document_id,
    activeConv?.id
  );

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  const handleSelectConv = (id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (conv) setActiveConv(conv);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      <Sidebar 
        documents={conversations.map(c => ({ id: c.id, name: c.title }))} 
        currentDocId={activeConv?.id} 
        onSelectDoc={handleSelectConv}
        className="hidden md:flex" 
      />
      
      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        <div className="flex-1 flex flex-col min-h-0">
          <ChatBox 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
            error={error}
          />
        </div>
      </main>
    </div>
  );
}
