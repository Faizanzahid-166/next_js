import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// orders/place endpoint expects payload to be { orderItems: [...], shippingAddress: {...}, paymentMethod: '...' }
// PLACE ORDER THUNK
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "/api/products/order/place",
        orderData,
        {
          withCredentials: true,
        }
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to place order"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    success: false,
    order: null,
    error: null,
  },

  reducers: {
    resetOrderState: (state) => {
      state.loading = false;
      state.success = false;
      state.order = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // REQUEST
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // SUCCESS
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload.data;
      })

      // ERROR
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;

export default orderSlice.reducer;