export async function getChatResponse(question: string) {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
  
    const data = await response.json();
    return data.answer || "No response received.";
  }
  