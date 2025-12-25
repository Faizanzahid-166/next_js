import { io } from "socket.io-client";

class SocketService {
  socket = null;

  connect(userId) {
    if (this.socket) return;

    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    this.socket.on("connect", () => {
      this.socket.emit("registerUser", userId);
      console.log("🟢 Socket connected");
    });
  }

  disconnect() {
    if (!this.socket) return;

    this.socket.disconnect();
    this.socket = null;
    console.log("🔴 Socket disconnected");
  }

  joinConversation(conversationId) {
    this.socket?.emit("joinConversation", conversationId);
  }

  emitMessage(payload) {
    this.socket?.emit("sendMessage", payload);
  }

  on(event, cb) {
    this.socket?.on(event, cb);
  }

  off(event) {
    this.socket?.off(event);
  }
}

export default new SocketService();
