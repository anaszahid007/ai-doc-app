"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarProps {
  documents: { id: string; name: string }[];
  currentDocId?: string;
  onSelectDoc: (id: string) => void;
  className?: string;
}

export default function Sidebar({ documents, currentDocId, onSelectDoc, className }: SidebarProps) {
  return (
    <div className={cn("flex flex-col h-full w-[280px] border-r border-zinc-100 bg-zinc-50/30 backdrop-blur-sm transition-all duration-300", className)}>
      {/* New Chat Button */}
      <div className="p-4 flex-shrink-0">
        <Link
          href="/upload"
          className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md active:scale-95 text-zinc-900"
        >
          <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Document
        </Link>
      </div>

      {/* Document List - Scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
        <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          Recent Documents
        </div>
        <div className="space-y-0.5">
          {documents.length === 0 ? (
            <div className="px-3 py-10 text-center">
              <p className="text-[11px] text-zinc-400 font-medium italic">No documents yet</p>
            </div>
          ) : (
            documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => onSelectDoc(doc.id)}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm transition-all text-left group",
                  currentDocId === doc.id
                    ? "bg-white text-primary font-bold shadow-sm border border-zinc-100/50"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                  currentDocId === doc.id ? "bg-primary/5 text-primary" : "bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200"
                )}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-zinc-600 transition-all hover:bg-zinc-100 group">
          <div className="h-9 w-9 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-zinc-200 ring-2 ring-white">
            N
          </div>
          <div className="flex flex-col items-start min-w-0">
            <span className="font-bold text-zinc-900 group-hover:text-primary transition-colors">Guest User</span>
            <span className="text-[10px] text-zinc-400 font-medium">Free Plan</span>
          </div>
          <svg className="h-4 w-4 ml-auto text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
