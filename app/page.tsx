"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useAppData } from "./context/AppDataContext";

export default function Home() {
  const [input, setInput] = useState("");
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, conversationHistory }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setConversationHistory(data.conversationHistory || []);
      setMessages((prev: any[]) => [
        ...prev,
        { role: "user", content: input },
        { role: "assistant", content: data.response }
      ]);
      setCurrentSummary(data.response.summary || "");
      setCurrentSteps(data.response.steps || []);
      setInput("");
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
      <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col gap-4 rounded-2xl p-8 shadow-2xl bg-white/80 backdrop-blur-md mt-auto">
        <label htmlFor="input" className="font-semibold">Enter body condition or question (JSON or text)</label>
        <textarea
          id="input"
          className="border rounded p-2 w-full min-h-[100px] font-mono"
          placeholder={`{"heartRate": 80, "respiratoryRate": 18, ...}`}
          value={input}
          onChange={e => setInput(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800 disabled:opacity-50 shadow-lg"
          disabled={loading}
        >
          {loading ? "Evaluating..." : "Send"}
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
