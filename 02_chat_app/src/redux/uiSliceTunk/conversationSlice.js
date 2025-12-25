import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getOrCreateConversation = createAsyncThunk(
  "conversation/getOrCreate",
  async (participantId) => {
    const res = await axios.post("/api/chat/conversation", { participantId });
    return res.data.data;
  }
);

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    active: null,
  },
  reducers: {
    setActiveConversation: (state, action) => {
      state.active = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOrCreateConversation.fulfilled, (state, action) => {
      state.active = action.payload;
    });
  },
});

export const { setActiveConversation } = conversationSlice.actions;
export default conversationSlice.reducer;
