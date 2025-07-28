"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, Heart, Activity, Thermometer } from "lucide-react";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-red-500 mr-3" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Health Evaluation Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">{user.user_metadata?.username || user.email}</span>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Welcome back, {user.user_metadata?.username || user.email?.split('@')[0]}!
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Ready to evaluate your health condition? Enter your body condition data below to get personalized recommendations.
              </p>
              <Button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Health Evaluation
              </Button>
            </div>
          </div>

          {/* Health Metrics Cards */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Heart Rate</h3>
            </div>
            <p className="text-gray-600 text-base leading-relaxed">
              Monitor your heart rate and get insights about your cardiovascular health.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Movement</h3>
            </div>
            <p className="text-gray-600 text-base leading-relaxed">
              Track your movement patterns and activity levels for better health insights.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <Thermometer className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Body Temperature</h3>
            </div>
            <p className="text-gray-600 text-base leading-relaxed">
              Monitor your body temperature and detect any potential health issues.
            </p>
          </div>

          {/* User Profile Card */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">Your Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Username
                  </label>
                  <p className="text-gray-800 bg-gray-50/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 font-medium">
                    {user.user_metadata?.username || "Not set"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email
                  </label>
                  <p className="text-gray-800 bg-gray-50/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 font-medium">
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Account Created
                  </label>
                  <p className="text-gray-800 bg-gray-50/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 font-medium">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Last Sign In
                  </label>
                  <p className="text-gray-800 bg-gray-50/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 font-medium">
                    {new Date(user.last_sign_in_at || user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 