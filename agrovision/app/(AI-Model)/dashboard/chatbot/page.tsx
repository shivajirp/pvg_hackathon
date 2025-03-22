"use client";

import { useState, useRef, useEffect } from "react";
import { getChatResponse } from "@/actions/chat";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let botResponse = await getChatResponse(input);
    setIsLoading(false);

    // Remove unwanted stars and symbols
    botResponse = botResponse.replace(/[*•✔️]/g, "").trim();

    // Format response with bold headings and bullet points
    const formattedResponse = formatResponse(botResponse);

    const botMessage = { text: formattedResponse, isUser: false };
    setMessages((prev) => [...prev, botMessage]);
  };

  // Function to format bot responses into bullet points and bold text
  const formatResponse = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Convert **bold** text
      .replace(/- (.*?)/g, "<li>$1</li>") // Convert "- " into bullet points
      .replace(/\n/g, "<br />"); // Convert new lines to line breaks
  };

  // Auto-scroll to latest message within chat box
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages]);

  return (
    <div className="h-[87vh] flex flex-col bg-gray-100 text-black overflow-hidden">
      {/* Scrollable Chat Messages without page scrolling */}
      <div className="flex-1 p-6 max-h-[80vh] overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              msg.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`px-5 py-3 text-lg rounded-xl max-w-3xl break-words shadow-md ${
                msg.isUser
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
              dangerouslySetInnerHTML={{ __html: msg.text }} // Render formatted text
            />
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <span className="px-5 py-3 bg-gray-300 text-black rounded-xl shadow-md">
              ...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input Box */}
      <div className="p-4 bg-white flex shadow-md sticky bottom-0 w-full">
        <input
          type="text"
          className="flex-1 p-4 text-lg bg-gray-200 text-black border border-gray-300 rounded-l-lg outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="px-6 bg-green-600 hover:bg-green-700 text-white text-lg rounded-r-lg"
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
