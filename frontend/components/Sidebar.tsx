"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  documents: { id: string; name: string }[];
  currentDocId?: string;
  onSelectDoc: (id: string) => void;
  className?: string;
}

export default function Sidebar({ documents, currentDocId, onSelectDoc, className }: SidebarProps) {
  const [user, setUser] = React.useState<any>(null);
  const router = useRouter();

  React.useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className={cn("flex flex-col h-full w-[280px] border-r border-zinc-100 bg-zinc-50/30 backdrop-blur-sm transition-all duration-300", className)}>
      {/* New Chat Button */}
      <div className="p-4 flex-shrink-0">
        <Link
          href="/upload"
          className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md active:scale-95 text-zinc-900"
        >
          <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Document
        </Link>
      </div>

      {/* Document List - Scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
        <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          Recent Chats
        </div>
        <div className="space-y-0.5">
          {documents.length === 0 ? (
            <div className="px-3 py-10 text-center">
              <p className="text-[11px] text-zinc-400 font-medium italic">No chats yet</p>
            </div>
          ) : (
            documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => onSelectDoc(doc.id)}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm transition-all text-left group",
                  currentDocId === doc.id
                    ? "bg-white text-blue-600 font-bold shadow-sm border border-zinc-100/50"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                  currentDocId === doc.id ? "bg-blue-50 text-blue-600" : "bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200"
                )}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <span className="truncate flex-1">{doc.name}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* User / Settings Footer */}
      <div className="p-4 border-t border-zinc-100 bg-white/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-zinc-600">
          <div className="h-9 w-9 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-zinc-200 ring-2 ring-white">
            {user?.name?.[0] || "U"}
          </div>
          <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="font-bold text-zinc-900 truncate w-full">{user?.name || "User"}</span>
            <button 
                onClick={handleLogout}
                className="text-[10px] text-zinc-400 font-bold hover:text-red-500 transition-colors uppercase tracking-widest"
            >
                Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
