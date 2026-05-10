"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { convApi } from "@/lib/api";

export interface Message {
  role: "user" | "assistant";
  content: string;
  created_at?: string;
  timestamp?: Date;
}

export function useChat(documentId?: string, conversationId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // Load message history when conversation changes
  useEffect(() => {
    if (!conversationId) {
        setMessages([]);
        return;
    }

    const fetchHistory = async () => {
        try {
            setIsLoading(true);
            const history = await convApi.getMessages(conversationId);
            setMessages(history.map((m: any) => ({
                role: m.role,
                content: m.content,
                timestamp: m.created_at ? new Date(m.created_at) : new Date()
            })));
        } catch (err: any) {
            console.error("Failed to fetch history:", err);
            setError("Failed to load message history.");
        } finally {
            setIsLoading(false);
        }
    };

    fetchHistory();
  }, [conversationId]);

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
        
        if (lastMessage && lastMessage.role === "assistant" && !data.is_complete) {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            ...lastMessage,
            content: data.answer,
          };
          return updatedMessages;
        } else if (data.is_complete) {
            // Final update
            const updatedMessages = [...prev];
            if (lastMessage && lastMessage.role === "assistant") {
                updatedMessages[updatedMessages.length - 1] = {
                    ...lastMessage,
                    content: data.answer,
                };
                return updatedMessages;
            }
            return prev;
        } else {
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

    const userMessage: Message = {
      role: "user",
      content: question,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    socketRef.current.send(JSON.stringify({ 
        question,
        conversation_id: conversationId 
    }));
  }, [conversationId]);

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
