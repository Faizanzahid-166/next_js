import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Conversation from "./src/models/ConversationModel.js";
import Message from "./src/models/MessageModel.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

const onlineUsers = new Map(); // userId -> Set(socketIds)

io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.id);

  // =====================
  // Register user
  // =====================
  socket.on("registerUser", (userId) => {
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    socket.userId = userId;

    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });

  // =====================
  // Join conversation room
  // =====================
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
  });

  // =====================
  // Send message
  // =====================
  socket.on("sendMessage", async ({ conversationId, senderId, text }) => {
    try {
      const message = await Message.create({
        conversationId,
        sender: senderId,
        text,
        seenBy: [senderId],
      });

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
      });

      io.to(conversationId).emit("newMessage", message);
    } catch (err) {
      console.error("sendMessage error:", err);
    }
  });

  // =====================
  // Disconnect
  // =====================
  socket.on("disconnect", () => {
    const userId = socket.userId;
    if (!userId) return;

    const sockets = onlineUsers.get(userId);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        onlineUsers.delete(userId);
      }
    }

    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    console.log("🔴 Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Socket server running on ${PORT}`)
);
