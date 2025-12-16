import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// =======================
// 🔵 ASYNC THUNKS
// =======================

// Add / Update cart item
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, userId }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/products/cart/addcart", { productId, quantity, userId });
      console.log("Add to cart response:", res.data);

      return {
        productId: res.data.data.productId,
        quantity: res.data.data.quantity,
        userId: res.data.data.userId,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add to cart");
    }
  }
);

// Fetch cart items for a user
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/products/cart/fetchcart", { params: { userId } });
      console.log("Fetch cart response:", res.data);
      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch cart");
    }
  }
);

// Clear entire cart
export const clearCartAPI = createAsyncThunk(
  "cart/clearCart",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/products/cart/deletecart", { userId });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to clear cart");
    }
  }
);

// =======================
// 🔵 SLICE
// =======================

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Local clear without API
    clearCartLocal: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.items.findIndex(
          (item) => String(item.productId) === String(action.payload.productId)
        );

        if (index >= 0) {
          state.items[index].quantity = action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clear Cart via API
      .addCase(clearCartAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartAPI.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(clearCartAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
