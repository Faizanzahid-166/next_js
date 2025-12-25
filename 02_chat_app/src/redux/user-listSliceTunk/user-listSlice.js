import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* =========================
   THUNKS
========================= */

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "userList/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/auth/user-lists");
      return res.data.data; // array of users
    } catch (err) {
      // Handle errors properly
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* =========================
   SLICE
========================= */

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const userListSlice = createSlice({
  name: "userList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload || [];
        console.log(action.payload,"fetch-list users");
        
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      });
  },
});

export default userListSlice.reducer;
