"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function useChat(documentId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!documentId) return;

    const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";
    const socket = new WebSocket(`${WS_BASE_URL}/ws/chat/${documentId}`);

    socket.onopen = () => {
      console.log("WebSocket connected");
      setError(null);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.error) {
        setError(data.error);
        setIsLoading(false);
        return;
      }

      // Handle streaming chunks
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        
        // If the last message is from assistant, update it with new content
        if (lastMessage && lastMessage.role === "assistant") {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            ...lastMessage,
            content: data.answer, // Use the full answer accumulated so far
          };
          return updatedMessages;
        } else {
          // If no assistant message exists yet, create one
          return [...prev, {
            role: "assistant",
            content: data.answer,
            timestamp: new Date(),
          }];
        }
      });

      if (data.is_complete) {
        setIsLoading(false);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      setError("Failed to connect to chat server.");
      setIsLoading(false);
    };

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, [documentId]);

  const sendMessage = useCallback((question: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setError("Not connected to server.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: question,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send via WebSocket
    socketRef.current.send(JSON.stringify({ question }));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
