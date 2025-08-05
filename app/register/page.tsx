"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Generate a random username from email
      const username = email.split('@')[0] || 'user';
      const { error } = await signUp(email, username);
      if (error) {
        setError(error.message);
      } else {
        // Show success message
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 relative flex flex-col items-center justify-center p-4 overflow-hidden">
        {/* Abstract reflective elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-slate-700 via-blue-900 to-purple-900 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-slate-700 via-blue-900 to-purple-900 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>
        
        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">Join Our Waitlist</h1>
          <p className="text-white/80 text-lg">Receive priority access to potentially life-saving technology.</p>
        </div>

        {/* Success Message Box */}
        <div className="w-full max-w-md relative z-10">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-600/50 text-center shadow-2xl shadow-black/50">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-slate-600 via-blue-800 to-purple-800 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-200 mb-4">
              You're on the list!
            </h2>
            <p className="text-white/80 text-lg">
              Thank you for joining our waitlist. We'll notify you as soon as OverdoseGuardian launches.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 relative flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Abstract reflective elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-slate-700 via-blue-900 to-purple-900 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-slate-700 via-blue-900 to-purple-900 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>
      
      {/* Header */}
      <div className="text-center mb-8 relative z-10">
        <h1 className="text-4xl font-bold text-white mb-2">Join Our Waitlist</h1>
        <p className="text-white/80 text-lg">Receive priority access to potentially life-saving technology.</p>
      </div>

      {/* Registration Form */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-600/50 shadow-2xl shadow-black/50">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-slate-600 to-blue-800 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Join Waitlist</h2>
            <p className="text-white/80">Be the first to know when we launch</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-700/50 border-slate-500/50 text-white placeholder:text-white/50 focus:border-blue-500 focus:ring-blue-500 backdrop-blur-sm"
              />
            </div>

            {error && (
              <div className="text-red-300 text-sm bg-red-900/30 backdrop-blur-sm p-4 rounded-xl border border-red-600/50">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-800 to-purple-800 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
              disabled={loading}
            >
              {loading ? "Joining waitlist..." : "Join Waitlist"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 