"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]); // [{role, content}]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      // 更新历史
      setConversationHistory(data.conversationHistory || []);
      // 展示内容
      setMessages(prev => [
        ...prev,
        { role: "user", content: input },
        { role: "assistant", content: data.response }
      ]);
      setInput("");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-8">
      <h1 className="text-2xl font-bold mb-2">Health Evaluation Platform</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-6xl flex flex-col gap-4">
        <textarea
          className="border rounded p-2 w-full min-h-[600px] font-mono"
          placeholder="Enter your body condition in JSON format..."
          value={input}
          onChange={e => setInput(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Evaluating..." : "Evaluate"}
        </button>
      </form>
      {error && <div className="text-red-500">{error}</div>}
      {/* 对话历史展示区 */}
      <div className="w-full max-w-6xl bg-gray-100 rounded p-4 mt-4 text-sm min-h-[600px] flex flex-col gap-4" style={{ color: '#000' }}>
        {messages.length === 0 && <div className="text-gray-400">暂无对话</div>}
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <b>{msg.role === 'user' ? '你' : 'AI'}：</b>
            <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content, null, 2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
