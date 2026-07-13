import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* =======================
   Fetch All Orders (transaction history)
   Optionally pass { userId, status, paymentStatus, paymentMethod }
======================= */
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (filters = {}, thunkAPI) => {
    try {
      const query = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) query.set(key, value);
      });

      const res = await fetch(`/api/admin/orders/list?${query.toString()}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (data.status !== "success") {
        throw new Error(data.message);
      }

      return data.data.orders;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* =======================
   Update Order / Payment Status (verify COD / EasyPaisa)
======================= */
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ orderId, paymentStatus, orderStatus }, thunkAPI) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus, orderStatus }),
      });

      const data = await res.json();

      if (data.status !== "success") {
        throw new Error(data.message);
      }

      return data.data.order;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const adminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
    userFilter: null,
  },
  reducers: {
    setUserFilter: (state, action) => {
      state.userFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.orders.findIndex((o) => o._id === updated._id || o.id === updated.id);
        if (index !== -1) {
          // Preserve items/shippingAddress from existing order (status update doesn't return them)
          state.orders[index] = { ...state.orders[index], ...updated };
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setUserFilter } = adminOrdersSlice.actions;
export default adminOrdersSlice.reducer;
