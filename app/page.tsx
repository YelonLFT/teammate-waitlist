"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useAppData } from "./context/AppDataContext";

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

  const {
    currentSummary, setCurrentSummary,
    currentSteps, setCurrentSteps,
    messages, setMessages,
    conversationHistory, setConversationHistory,
  } = useAppData();

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 gap-4" style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#222' }}>
      <h1 className="text-3xl font-bold mb-4 drop-shadow-lg">Health Evaluation Platform</h1>
      {/* 报告区 */}
      <div className="w-full max-w-2xl flex flex-col gap-6 mb-2">
        <div className="w-full rounded-2xl p-8 shadow-2xl bg-white/80 backdrop-blur-md">
          <div className="mb-2 text-xl font-bold text-pink-700">Current Condition</div>
          <div className="text-lg min-h-[2rem]">{currentSummary || "-"}</div>
        </div>
        <div className="w-full rounded-2xl p-8 shadow-2xl bg-white/80 backdrop-blur-md">
          <div className="mb-2 text-xl font-bold text-blue-700">Steps to do</div>
          <ol className="list-decimal ml-6 mt-2 text-lg">
            {(currentSteps || []).map((step: string, idx: number) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
      {/* 对话历史折叠区 */}
      <div className="w-full max-w-2xl flex flex-col items-end">
        <button
          className="mb-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-lg"
          onClick={() => setShowHistory(v => !v)}
        >
          {showHistory ? "Hide Conversation" : "Show Conversation"}
        </button>
        {showHistory && (
          <div className="w-full bg-white/80 rounded-2xl p-6 text-base shadow-2xl min-h-[120px] max-h-[300px] overflow-y-auto mb-2 backdrop-blur-md">
            {messages.length === 0 && <div className="text-gray-400">No conversation yet.</div>}
            {messages.map((msg: any, idx: number) => (
              <div key={idx} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                <b>{msg.role === 'user' ? 'You' : 'AI'}:</b>
                <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', marginLeft: 8 }}>
                  {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content, null, 2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
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

        <button
          type="submit"
          className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800 disabled:opacity-50 shadow-lg"
          disabled={loading}
        >
          {loading ? "Evaluating..." : "Analyze Condition"}
        </button>
      </form>
      {error && <div className="text-red-500">{error}</div>}
      <button
        className="mt-8 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 shadow-lg"
        onClick={() => router.push('/second')}
      >
        Next Page
      </button>
    </div>
  );
}
