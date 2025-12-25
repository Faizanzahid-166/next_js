import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMessages = createAsyncThunk(
  "messages/fetch",
  async (conversationId) => {
    const res = await axios.get(`/api/chat/message?conversationId=${conversationId}`);
    return res.data.data;
  }
);

export const sendMessageApi = createAsyncThunk(
  "messages/send",
  async ({ conversationId, text }) => {
    const res = await axios.post("/api/chat/message", { conversationId, text });
    return res.data.data;
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState: { list: [] },
  reducers: {
    addSocketMessage: (state, action) => {
      const exists = state.list.find((m) => m._id === action.payload._id);
      if (!exists) state.list.push(action.payload);
    },
    clearMessages: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.list = action.payload.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      })
      .addCase(sendMessageApi.fulfilled, (state, action) => {
        const exists = state.list.find((m) => m._id === action.payload._id);
        if (!exists) state.list.push(action.payload);
      });
  },
});

export const { addSocketMessage, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
