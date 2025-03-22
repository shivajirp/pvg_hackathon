"use client";

import { useState, useRef, useEffect } from "react";
import { getChatResponse } from "@/actions/chat";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const botResponse = await getChatResponse(input);
    setIsLoading(false);

    const botMessage = { text: botResponse, isUser: false };
    setMessages((prev) => [...prev, botMessage]);
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-gray-100 text-black">
      <header className="text-center text-2xl font-bold py-4 bg-white shadow-md">
        Chatbot
      </header>

      {/* Scrollable Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
            <span className={`px-4 py-2 rounded-lg max-w-xs break-words ${msg.isUser ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
              {msg.text}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <span className="px-4 py-2 bg-gray-300 text-black rounded-lg">...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input Box */}
      <div className="p-4 bg-white flex shadow-md sticky bottom-0">
        <input
          type="text"
          className="flex-1 p-3 bg-gray-200 text-black border border-gray-300 rounded-l-lg outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg"
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
