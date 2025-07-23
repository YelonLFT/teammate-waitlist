import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { input, conversationHistory } = await req.json();
  
  if (!input) {
    return NextResponse.json({ error: "No input provided" }, { status: 400 });
  }

  const systemPrompt = `You are a medical professional with years of experience dealing with people who have passed out. 

  INITIAL ANALYSIS: When you first receive body condition data in JSON format, evaluate the condition and provide:
  1. Three most likely causes for unconsciousness given the current condition
  2. Detailed but concise step-by-step first aid instructions for inexperienced individuals

  FOLLOW-UP CONVERSATION: After the initial analysis, engage in helpful medical conversation by:
  - Answering questions about the condition or first aid steps
  - Providing clarifications when asked
  - Offering additional guidance based on new information
  - Maintaining a professional but accessible tone

  Always respond in JSON format.`;

  try {
    // 构建消息历史
    const messages = [
      { role: "system", content: systemPrompt }
    ];

    // 如果有对话历史，添加到消息中
    if (conversationHistory && Array.isArray(conversationHistory)) {
      messages.push(...conversationHistory);
    }

    // 添加当前用户消息
    messages.push({ role: "user", content: input });

    console.log("Messages to send:", messages);

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: messages,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    let json;
    try {
      json = JSON.parse(content);
    } catch {
      json = { raw: content };
    }

    // 返回响应和更新的对话历史
    return NextResponse.json({
      response: json,
      conversationHistory: [
        ...(conversationHistory || []),
        { role: "user", content: input },
        { role: "assistant", content: content }
      ]
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
} 