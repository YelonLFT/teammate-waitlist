"use client";
import React, { createContext, useContext, useState } from "react";

const AppDataContext = createContext<any>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [currentSummary, setCurrentSummary] = useState<string>("");
  const [currentSteps, setCurrentSteps] = useState<string[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);

  return (
    <AppDataContext.Provider
      value={{
        currentSummary, setCurrentSummary,
        currentSteps, setCurrentSteps,
        messages, setMessages,
        conversationHistory, setConversationHistory,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
} 