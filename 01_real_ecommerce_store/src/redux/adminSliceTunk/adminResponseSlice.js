import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const respondAdminRequest = createAsyncThunk(
  "adminRespond/respond",
  async ({ requestId, accept }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "/api/admin/respond",
        { requestId, accept },
        { withCredentials: true }
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Error" });
    }
  }
);

const adminRespondSlice = createSlice({
  name: "adminRespond",
  initialState: {
    loading: false,
    error: null,
    result: null,
  },
  reducers: {
    clearAdminRespondState(state) {
      state.loading = false;
      state.error = null;
      state.result = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(respondAdminRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(respondAdminRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(respondAdminRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { clearAdminRespondState } = adminRespondSlice.actions;
export default adminRespondSlice.reducer;
