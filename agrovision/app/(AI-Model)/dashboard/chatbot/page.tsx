"use client";

import { useState } from "react";
import { getChatResponse } from "@/actions/chat";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    []
  );
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const botResponse = await getChatResponse(input);
    const botMessage = { text: botResponse, isUser: false };

    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Chatbot</h2>

      <div className="h-64 overflow-y-auto border p-3 rounded">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.isUser ? "text-right" : "text-left"}`}
          >
            <span
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded-l-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className="px-4 bg-blue-600 text-white rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
