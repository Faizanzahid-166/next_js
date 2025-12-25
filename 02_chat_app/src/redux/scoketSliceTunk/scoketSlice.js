import { createSlice } from "@reduxjs/toolkit";
import { getSocket } from "@/lib/socket";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    connected: false,
  },
  reducers: {
    connectSocket: (state, action) => {
      const socket = getSocket();
      socket.emit("registerUser", action.payload);
      state.connected = true;
    },
    joinConversation: (_, action) => {
      const socket = getSocket();
      socket.emit("joinConversation", action.payload);
    },
    sendMessageSocket: (_, action) => {
      const socket = getSocket();
      socket.emit("sendMessage", action.payload);
    },
  },
});

export const {
  connectSocket,
  joinConversation,
  sendMessageSocket,
} = socketSlice.actions;

export default socketSlice.reducer;
