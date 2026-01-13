import { useAuth } from "@/hooks/use-auth";
import { useChatStream } from "@/hooks/use-chat-stream";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "@/components/Loader";

export default function Chat() {
  const { user } = useAuth();
  
  // Fetch existing conversation or create one
  const { data: conversations, isLoading: loadingConvos } = useQuery({
    queryKey: ['/api/conversations'],
    queryFn: async () => {
      const res = await fetch('/api/conversations');
      return res.json();
    }
  });

  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  
  useEffect(() => {
    if (conversations && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    } else if (conversations && conversations.length === 0) {
      // Create a default conversation
      fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Support Chat' })
      }).then(res => res.json()).then(conv => setActiveConversationId(conv.id));
    }
  }, [conversations]);

  const { messages, streamingContent, isStreaming, sendMessage } = useChatStream(activeConversationId || 0);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  if (loadingConvos || !activeConversationId) return <Loader />;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-white/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Mindful Assistant</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Always here for you</span>
            </div>
          </div>
        </div>
        <div className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 font-medium">
          Note: This is an AI. For emergencies, please call professional help.
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
            <Sparkles size={48} className="text-primary mb-4" />
            <h3 className="text-xl font-bold text-slate-700">How can I support you today?</h3>
            <p className="text-slate-500 max-w-md mt-2">I'm here to listen, offer coping strategies, or just chat. Everything you share is private.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm
              ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white text-primary border border-slate-100'}
            `}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`
              p-4 rounded-2xl max-w-[80%] shadow-sm text-sm leading-relaxed
              ${msg.role === 'user' 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}
            `}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isStreaming && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-white text-primary border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
              <Bot size={16} />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-white border border-slate-100 text-slate-700 max-w-[80%] shadow-sm text-sm leading-relaxed">
              {streamingContent}
              <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-primary animate-pulse" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-slate-700 placeholder:text-slate-400"
            disabled={isStreaming}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isStreaming}
            className="p-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-primary/20"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
