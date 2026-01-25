
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { chatCompletionAI } from "./services/ai";

let io: Server;

export function broadcastAlert(type: string, data: any) {
    if (io) {
        io.emit(type, data);
        console.log(`📡 Broadcast Alert: ${type}`, data);
    }
}

export function setupSocket(httpServer: HttpServer) {
    io = new Server(httpServer, {
        path: "/api/socket",
        addTrailingSlash: false,
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("New client connected", socket.id);

        // Join room based on user ID if authenticated (client sends userId in query or auth logic)
        // For now, simpler implementation:

        socket.on("join_chat", (room) => {
            socket.join(room);
            console.log(`Socket ${socket.id} joined room ${room}`);
        });

        // AI Counselor Chat Event
        socket.on("ai_counselor_message", async (data) => {
            const { message, userId } = data;

            // Echo user message back to them (optional, usually handled by optimism on client)
            // socket.emit("message_received", { role: "user", content: message, timestamp: new Date() });

            // Generate AI Response
            const aiResponse = await chatCompletionAI(message);

            // Emit back to user
            socket.emit("ai_counselor_response", {
                role: "assistant",
                content: aiResponse,
                timestamp: new Date()
            });
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected", socket.id);
        });
    });

    return io;
}
