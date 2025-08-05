"use client";
import React, { createContext, useContext, useState } from "react";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signUp: (email: string, username: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const signUp = async (email: string, username: string) => {
    setLoading(true);
    try {
      // Generate a random password for Supabase auth
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password: randomPassword,
        options: {
          data: {
            username: username,
          },
        },
      });
      
      if (error) {
        console.error('Auth signup error:', error);
        return { error };
      }
      
      // For now, we'll just use the auth.users table
      // The waitlist_users table can be added later when needed
      console.log('User successfully created:', data.user?.id);
      
      return { error: null };
    } catch (error: any) {
      console.error('General signup error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signUp,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 