"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAppData } from "./context/AppDataContext";
import { useAuth } from "./context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, Heart } from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    heartRate: "",
    respiratoryRate: "",
    bloodOxygenContent: "",
    movement: "",
    orientation: "",
    bodyTemp: "",
    bloodPressure: "",
    ecgData: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();

  const {
    currentSummary, setCurrentSummary,
    currentSteps, setCurrentSteps,
    messages, setMessages,
    conversationHistory, setConversationHistory,
  } = useAppData();

<<<<<<< HEAD
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
=======
  const handleFormDataChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatFormDataAsJSON = () => {
    const jsonData: any = {};
    
    // PPG data
    if (formData.heartRate) jsonData.heartRate = parseFloat(formData.heartRate) || formData.heartRate;
    if (formData.respiratoryRate) jsonData.respiratoryRate = parseFloat(formData.respiratoryRate) || formData.respiratoryRate;
    if (formData.bloodOxygenContent) jsonData.bloodOxygenContent = parseFloat(formData.bloodOxygenContent) || formData.bloodOxygenContent;
    
    // IMU data
    if (formData.movement) jsonData.movement = formData.movement;
    if (formData.orientation) jsonData.orientation = formData.orientation;
    
    // Temperature data
    if (formData.bodyTemp) jsonData.bodyTemp = parseFloat(formData.bodyTemp) || formData.bodyTemp;
    
    // Optional data
    if (formData.bloodPressure) jsonData.bloodPressure = formData.bloodPressure;
    if (formData.ecgData) jsonData.ecgData = formData.ecgData;
    
    return JSON.stringify(jsonData, null, 2);
>>>>>>> 552e57601aecb1f0513b896e403be7d6d383e700
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const jsonInput = formatFormDataAsJSON();
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: jsonInput, conversationHistory }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setConversationHistory(data.conversationHistory || []);
      setMessages((prev: any[]) => [
        ...prev,
        { role: "user", content: jsonInput },
        { role: "assistant", content: data.response }
      ]);
      setCurrentSummary(data.response.summary || "");
      setCurrentSteps(data.response.steps || []);
      setFormData({
        heartRate: "",
        respiratoryRate: "",
        bloodOxygenContent: "",
        movement: "",
        orientation: "",
        bodyTemp: "",
        bloodPressure: "",
        ecgData: ""
      });
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
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
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#222' }}>
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
                <User className="w-5 h-5 text-gray-700" />
                <span className="text-gray-800 font-semibold">{user.user_metadata?.username || user.email}</span>
              </div>
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                size="sm"
                className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-300"
              >
                Dashboard
              </Button>
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
<<<<<<< HEAD

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-between p-4 gap-6">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">Health Evaluation Platform</h1>
        {/* 报告区 */}
        <div className="w-full max-w-2xl flex flex-col gap-6 mb-2">
          <div className="w-full rounded-3xl p-8 shadow-2xl bg-white/90 backdrop-blur-xl border border-white/20">
            <div className="mb-3 text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Current Condition</div>
            <div className="text-lg min-h-[2rem] text-gray-800 leading-relaxed font-medium">{currentSummary || "-"}</div>
          </div>
          <div className="w-full rounded-3xl p-8 shadow-2xl bg-white/90 backdrop-blur-xl border border-white/20">
            <div className="mb-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Steps to do</div>
            <ol className="list-decimal ml-6 mt-3 text-lg text-gray-800 space-y-2">
              {(currentSteps || []).map((step: string, idx: number) => (
                <li key={idx} className="leading-relaxed font-medium">{step}</li>
              ))}
            </ol>
          </div>
        </div>
        {/* 对话历史折叠区 */}
        <div className="w-full max-w-2xl flex flex-col items-end">
          <button
            className="mb-3 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            onClick={() => setShowHistory(v => !v)}
          >
            {showHistory ? "Hide Conversation" : "Show Conversation"}
          </button>
          {showHistory && (
            <div className="w-full bg-white/90 backdrop-blur-xl rounded-3xl p-6 text-base shadow-2xl min-h-[120px] max-h-[300px] overflow-y-auto mb-2 border border-white/20">
              {messages.length === 0 && <div className="text-gray-600 text-center py-4 font-medium">No conversation yet.</div>}
              {messages.map((msg: any, idx: number) => (
                <div key={idx} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block px-4 py-2 rounded-2xl max-w-[80%] ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="font-semibold text-sm mb-1">{msg.role === 'user' ? 'You' : 'AI'}</div>
                    <div className="text-sm leading-relaxed font-medium" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content, null, 2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* 输入区在页面底部 */}
        <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col gap-6 rounded-3xl p-8 shadow-2xl bg-white/90 backdrop-blur-xl border border-white/20 mt-auto">
          <label htmlFor="input" className="font-semibold text-lg text-gray-800">Enter body condition or question (JSON or text)</label>
          <textarea
            id="input"
            className="border-2 border-gray-200 rounded-2xl p-4 w-full min-h-[120px] font-mono text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            placeholder={`{"heartRate": 80, "respiratoryRate": 18, "bloodOxygen": 98, "bodyTemp": 37.2, "movement": "normal"}`}
            value={input}
            onChange={e => setInput(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl px-6 py-3 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
            disabled={loading}
          >
            {loading ? "Evaluating..." : "Send"}
          </button>
        </form>
        {error && <div className="text-red-700 bg-red-50/80 backdrop-blur-sm p-4 rounded-xl border border-red-200 font-medium">{error}</div>}
=======
      {/* 输入区在页面底部 */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col gap-6 rounded-2xl p-8 shadow-2xl bg-white/80 backdrop-blur-md mt-auto">
        <h3 className="font-semibold text-lg text-center">Enter Body Condition Data</h3>
        
        {/* PPG Section */}
        <div className="space-y-4">
          <h4 className="font-medium text-pink-700 border-b pb-1">PPG Sensors</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="heartRate" className="block text-sm font-medium mb-1">Heart Rate (BPM)</label>
              <input
                id="heartRate"
                type="number"
                className="border rounded p-2 w-full"
                placeholder="80"
                value={formData.heartRate}
                onChange={e => handleFormDataChange('heartRate', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="respiratoryRate" className="block text-sm font-medium mb-1">Respiratory Rate (breaths/min)</label>
              <input
                id="respiratoryRate"
                type="number"
                className="border rounded p-2 w-full"
                placeholder="18"
                value={formData.respiratoryRate}
                onChange={e => handleFormDataChange('respiratoryRate', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="bloodOxygenContent" className="block text-sm font-medium mb-1">Blood Oxygen (%)</label>
              <input
                id="bloodOxygenContent"
                type="number"
                className="border rounded p-2 w-full"
                placeholder="98"
                value={formData.bloodOxygenContent}
                onChange={e => handleFormDataChange('bloodOxygenContent', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* IMU Section */}
        <div className="space-y-4">
          <h4 className="font-medium text-blue-700 border-b pb-1">IMU Sensors</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="movement" className="block text-sm font-medium mb-1">Movement</label>
              <input
                id="movement"
                type="text"
                className="border rounded p-2 w-full"
                placeholder="Still, Walking, Running"
                value={formData.movement}
                onChange={e => handleFormDataChange('movement', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="orientation" className="block text-sm font-medium mb-1">Orientation</label>
              <input
                id="orientation"
                type="text"
                className="border rounded p-2 w-full"
                placeholder="Upright, Lying down, Sideways"
                value={formData.orientation}
                onChange={e => handleFormDataChange('orientation', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Temperature Section */}
        <div className="space-y-4">
          <h4 className="font-medium text-green-700 border-b pb-1">Temperature Sensor</h4>
          <div>
            <label htmlFor="bodyTemp" className="block text-sm font-medium mb-1">Body Temperature (°C)</label>
            <input
              id="bodyTemp"
              type="number"
              step="0.1"
              className="border rounded p-2 w-full"
              placeholder="37.0"
              value={formData.bodyTemp}
              onChange={e => handleFormDataChange('bodyTemp', e.target.value)}
            />
          </div>
        </div>

        {/* Optional Section */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 border-b pb-1">Optional Data</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="bloodPressure" className="block text-sm font-medium mb-1">Blood Pressure</label>
              <input
                id="bloodPressure"
                type="text"
                className="border rounded p-2 w-full"
                placeholder="120/80"
                value={formData.bloodPressure}
                onChange={e => handleFormDataChange('bloodPressure', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="ecgData" className="block text-sm font-medium mb-1">ECG Data</label>
              <input
                id="ecgData"
                type="text"
                className="border rounded p-2 w-full"
                placeholder="Normal rhythm"
                value={formData.ecgData}
                onChange={e => handleFormDataChange('ecgData', e.target.value)}
              />
            </div>
          </div>
        </div>

>>>>>>> 552e57601aecb1f0513b896e403be7d6d383e700
        <button
          className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-2xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
          onClick={() => router.push('/second')}
        >
<<<<<<< HEAD
          Next Page
=======
          {loading ? "Evaluating..." : "Analyze Condition"}
>>>>>>> 552e57601aecb1f0513b896e403be7d6d383e700
        </button>
      </div>
    </div>
  );
}
