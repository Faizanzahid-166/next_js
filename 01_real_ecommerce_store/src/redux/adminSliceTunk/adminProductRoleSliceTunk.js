import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL for admin product endpoints
const BASE_URL = "/api/admin/product";

// ------------------ Async Thunks ------------------

// 1️⃣ Delete product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${BASE_URL}/deleteProduct/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 2️⃣ Add / Insert product
export const insertProduct = createAsyncThunk(
  "products/insertProduct",
  async ({ productData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/insertProduct`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 3️⃣ Edit / Update product
export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, productData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/editProduct/${id}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ------------------ Slice ------------------
const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearMessage(state) {
      state.message = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (p) => p.id !== action.meta.arg.id
        );
        state.message = action.payload?.message || "Product deleted";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Insert product
      .addCase(insertProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(insertProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        state.message = "Product added successfully";
      })
      .addCase(insertProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit product
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (p) => p.id === action.meta.arg.id
        );
        if (index !== -1) state.products[index] = action.payload;
        state.message = "Product updated successfully";
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMessage } = productSlice.actions;
export default productSlice.reducer;
