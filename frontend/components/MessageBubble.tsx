import React from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-3 sm:gap-4 px-2 sm:px-4 py-4 sm:py-6 transition-colors hover:bg-zinc-50/50 rounded-2xl",
        isUser ? "" : ""
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg text-[10px] font-bold shadow-sm",
        isUser 
          ? "bg-zinc-900 text-white" 
          : "bg-primary text-white"
      )}>
        {isUser ? "U" : "AI"}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 sm:gap-2 min-w-0">
        <div className="flex items-center gap-2">
           <span className="text-sm font-bold text-zinc-900">
             {isUser ? "You" : "Assistant"}
           </span>
           <span className="text-[10px] font-medium text-zinc-400">
             {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
           </span>
        </div>

        <div className={cn(
          "prose prose-sm max-w-none break-words leading-relaxed text-zinc-700",
          isUser ? "font-medium" : "prose-zinc"
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}
