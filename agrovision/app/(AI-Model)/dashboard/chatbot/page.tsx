"use client";

import { useState, useRef, useEffect } from "react";
import { getChatResponse } from "@/actions/chat";


export default function Chatbot() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<null | (typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition)>(null);

  useEffect(() => {
    const SpeechRecognition: typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition | undefined =
      (window as typeof window & { SpeechRecognition: typeof SpeechRecognition; webkitSpeechRecognition: typeof SpeechRecognition }).SpeechRecognition ||
      (window as typeof window & { SpeechRecognition: typeof SpeechRecognition; webkitSpeechRecognition: typeof SpeechRecognition }).webkitSpeechRecognition;
  
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = "en-US";
        recognitionRef.current.interimResults = false;
  
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
        };
  
        recognitionRef.current.onerror = (event: Event) => {
          console.error("Speech recognition error", event);
        };
      }
    }
  }, []);
  

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage = { text, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    let botResponse = await getChatResponse(text);
    setIsLoading(false);

    botResponse = botResponse.replace(/[*•✔️]/g, "").trim();
    const formattedResponse = formatResponse(botResponse);

    const botMessage = { text: formattedResponse, isUser: false };
    setMessages((prev) => [...prev, botMessage]);

    speakText(botResponse);
  };

  const formatResponse = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/- (.*?)/g, "<li>$1</li>").replace(/\n/g, "<br />");
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const speakText = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  return (
    <div className="h-[87vh] flex flex-col bg-gray-100 text-black overflow-hidden">
      <div className="flex-1 p-6 max-h-[80vh] overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
            <span className={`px-5 py-3 text-lg rounded-xl max-w-3xl break-words shadow-md ${msg.isUser ? "bg-green-500 text-white" : "bg-gray-200 text-black"}`}
              dangerouslySetInnerHTML={{ __html: msg.text }} />
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <span className="px-5 py-3 bg-gray-300 text-black rounded-xl shadow-md">...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input Box with Voice Controls */}
      <div className="p-4 bg-white flex shadow-md sticky bottom-0 w-full">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`px-4 text-white text-lg rounded-l-lg ${isListening ? "bg-red-600" : "bg-blue-600"}`}
        >
          🎤
        </button>
        <input
          type="text"
          className="flex-1 p-4 text-lg bg-gray-200 text-black border border-gray-300 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={() => handleSendMessage(input)}
          className="px-6 bg-green-600 hover:bg-green-700 text-white text-lg rounded-r-lg"
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
