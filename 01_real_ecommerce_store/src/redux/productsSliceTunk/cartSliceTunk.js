import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL for API
const API_BASE = "/api/products/cart";

// ======================
// Async thunks
// ======================

// Fetch cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/fetchcart`, {
        withCredentials: true, // send cookies for auth
      });
      console.log("fetchCart API response:", res.data); // ✅ log API response
      return res.data.data; // cart data
    } catch (err) {
      console.log("fetchCart error:", err.response?.data || err.message); // ✅ log error
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Add or update cart item
export const addCartItem = createAsyncThunk(
  "cart/addCartItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_BASE}/addcart`,
        { productId, quantity },
        { withCredentials: true }
      );
      console.log("addCartItem API response:", res.data); // ✅ log API response
      return res.data.data; // updated cart
    } catch (err) {
      console.log("addCartItem error:", err.response?.data || err.message); // ✅ log error
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete entire cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_BASE}/deletecart`, {
        withCredentials: true,
      });
      console.log("clearCart API response:", res.data); // ✅ log API response
      return res.data;
    } catch (err) {
      console.log("clearCart error:", err.response?.data || err.message); // ✅ log error
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ======================
// Slice
// ======================
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartId: null,
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Cart
    builder.addCase(fetchCart.pending, (state) => {
      console.log("fetchCart pending"); // ✅ log
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      console.log("fetchCart fulfilled:", action.payload); // ✅ log payload
      state.loading = false;
      state.cartId = action.payload.cartId || null;
      state.items = action.payload.items || [];
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      console.log("fetchCart rejected:", action.payload); // ✅ log error
      state.loading = false;
      state.error = action.payload;
    });

    // Add/Update Cart Item
    builder.addCase(addCartItem.pending, (state) => {
      console.log("addCartItem pending"); // ✅ log
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addCartItem.fulfilled, (state, action) => {
      console.log("addCartItem fulfilled:", action.payload); // ✅ log payload
      state.loading = false;
      state.cartId = action.payload.cartId;
      state.items = action.payload.items;
    });
    builder.addCase(addCartItem.rejected, (state, action) => {
      console.log("addCartItem rejected:", action.payload); // ✅ log error
      state.loading = false;
      state.error = action.payload;
    });

    // Clear Cart
    builder.addCase(clearCart.pending, (state) => {
      console.log("clearCart pending"); // ✅ log
      state.loading = true;
      state.error = null;
    });
    builder.addCase(clearCart.fulfilled, (state) => {
      console.log("clearCart fulfilled"); // ✅ log
      state.loading = false;
      state.cartId = null;
      state.items = [];
    });
    builder.addCase(clearCart.rejected, (state, action) => {
      console.log("clearCart rejected:", action.payload); // ✅ log error
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default cartSlice.reducer;
