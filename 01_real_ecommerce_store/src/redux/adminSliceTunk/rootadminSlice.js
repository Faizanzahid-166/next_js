// redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch root admin info
export const fetchRootAdmin = createAsyncThunk(
  "auth/fetchRootAdmin",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/api/admin/root-admin");
      return res.data.admin;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  rootAdmin: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRootAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRootAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.rootAdmin = action.payload;
      })
      .addCase(fetchRootAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
