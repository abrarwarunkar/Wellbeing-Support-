import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function useChatStream(conversationId: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial messages if needed
  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/conversations/${conversationId}`);
        if (!res.ok) return;
        const data = await res.json();
        // Assuming data.messages has the structure
        setMessages(data.messages.map((m: any) => ({ role: m.role, content: m.content })));
      } catch (err) {
        console.error("Failed to load history", err);
      }
    }
    if (conversationId) fetchMessages();
  }, [conversationId]);


  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Optimistic update for user message
    setMessages((prev) => [...prev, { role: "user", content }]);
    setIsStreaming(true);
    setError(null);

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      if (!reader) throw new Error("No reader available");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "");
            if (dataStr === "[DONE]" || dataStr.includes('"done":true')) break;

            try {
              const data = JSON.parse(dataStr);
              if (data.content) {
                assistantMessage += data.content;
                setStreamingContent((prev) => prev + data.content);
              }
            } catch (e) {
              // Ignore partial JSON
            }
          }
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: assistantMessage }]);
      setStreamingContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsStreaming(false);
    }
  };

  return { messages, streamingContent, isStreaming, error, sendMessage };
}
