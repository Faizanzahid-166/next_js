import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/*
  THUNK
  confirm payment
*/
export const confirmPayment = createAsyncThunk(
  "payment/confirmPayment",
  async ({ orderId, paymentData }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `/api/products/order/confirmation/${orderId}`,
        paymentData
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Payment submission failed"
      );
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    success: false,
    payment: null,
    error: null,
  },

  reducers: {
    resetPaymentState: (state) => {
      state.loading = false;
      state.success = false;
      state.payment = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // pending
      .addCase(confirmPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // success
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.payment = action.payload.data.payment;
      })

      // error
      .addCase(confirmPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;

export default paymentSlice.reducer;