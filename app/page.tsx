"use client";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        // If user is logged in, redirect to login page (since we're keeping only login/signup)
        router.push("/login");
      } else {
        // If user is not logged in, redirect to login page
        router.push("/login");
      }
    }
  }, [user, authLoading, router]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}
