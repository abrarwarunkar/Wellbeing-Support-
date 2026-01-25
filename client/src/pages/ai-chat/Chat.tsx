
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/hooks/use-auth";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export default function AIChat() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! I am your AI Counselor. I'm here to listen and support you. How are you feeling today?", timestamp: new Date() }
    ]);
    const [input, setInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Connect to Socket
        const socket = io({
            path: "/api/socket",
        });
        socketRef.current = socket;

        socket.on("connect", () => {
            setIsConnected(true);
            console.log("Connected to AI Chat");
        });

        socket.on("ai_counselor_response", (msg: Message) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim() || !socketRef.current) return;

        const userMsg: Message = { role: "user", content: input, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);

        socketRef.current.emit("ai_counselor_message", {
            message: input,
            userId: user?.id
        });

        setInput("");
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] p-4 max-w-4xl mx-auto w-full">
            <Card className="flex-1 flex flex-col overflow-hidden border-2 shadow-lg">
                <CardHeader className="bg-primary/5 border-b py-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Bot className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">AI Counselor</CardTitle>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-yellow-500"}`} />
                                {isConnected ? "Online" : "Connecting..."}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    <Avatar className="h-8 w-8">
                                        {msg.role === "assistant" ? (
                                            <>
                                                <AvatarImage src="/bot-avatar.png" />
                                                <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                                            </>
                                        ) : (
                                            <>
                                                <AvatarImage src={user?.profileImageUrl || undefined} />
                                                <AvatarFallback className="bg-slate-200">ME</AvatarFallback>
                                            </>
                                        )}
                                    </Avatar>
                                    <div
                                        className={`rounded-lg p-3 max-w-[80%] text-sm ${msg.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t bg-background">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                sendMessage();
                            }}
                            className="flex gap-2"
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1"
                                disabled={!isConnected}
                            />
                            <Button type="submit" size="icon" disabled={!isConnected || !input.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
