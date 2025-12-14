import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const sendAdminRequest = createAsyncThunk(
  "adminRequest/send",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/admin/make-admin-request", null, {
        withCredentials: true, // REQUIRED for cookies
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Error" });
    }
  }
);

const adminRequestSlice = createSlice({
  name: "adminRequest",
  initialState: {
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearAdminRequestState(state) {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendAdminRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendAdminRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(sendAdminRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { clearAdminRequestState } = adminRequestSlice.actions;
export default adminRequestSlice.reducer;
