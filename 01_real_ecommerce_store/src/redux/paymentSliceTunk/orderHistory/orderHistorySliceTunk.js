import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* =======================
   Fetch My Orders (order + product history)
======================= */
export const fetchMyOrders = createAsyncThunk(
  "orderHistory/fetchMyOrders",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/api/products/order/fetch-orders", {
        withCredentials: true,
      });

      if (res.data.status !== "success") {
        throw new Error(res.data.message);
      }

      return res.data.data.orders;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch orders"
      );
    }
  }
);

const orderHistorySlice = createSlice({
  name: "orderHistory",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetOrderHistory: (state) => {
      state.orders = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderHistory } = orderHistorySlice.actions;
export default orderHistorySlice.reducer;
