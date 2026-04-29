"use client";

import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import Loader from "./Loader";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatBoxProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatBox({ messages, onSendMessage, isLoading }: ChatBoxProps) {
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-8 scrollbar-hide"
      >
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 rounded-3xl bg-zinc-50 p-8 text-primary shadow-inner">
                <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-zinc-900">How can I help you today?</h3>
              <p className="mt-2 text-zinc-500">Ask anything about your document. I'm ready to analyze and assist.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}

          {isLoading && (
            <div className="flex items-start gap-4 px-4 py-2">
              <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0 animate-pulse">
                <div className="h-4 w-4 rounded-full bg-primary/20"></div>
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <div className="h-4 w-24 bg-zinc-100 rounded animate-pulse"></div>
                <div className="h-4 w-48 bg-zinc-50 rounded animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-white border-t border-zinc-100/50">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl relative"
        >
          <div className="relative flex items-end gap-2 rounded-[28px] border border-zinc-200 bg-white p-2 shadow-sm focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all">
            <textarea
              rows={1}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Message your document..."
              disabled={isLoading}
              className="flex-1 max-h-60 resize-none rounded-2xl bg-transparent px-4 py-3 text-base outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="mt-3 text-center text-[10px] font-medium text-zinc-400 uppercase tracking-widest">
            AI can make mistakes. Check important info.
          </p>
        </form>
      </div>
    </div>
  );
}
