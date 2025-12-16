// store/productsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch products from your API using Axios
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}) => {
    try {
      const response = await axios.get("/api/products", { params });
      const data = response.data;

      // Exact-match-first search sorting
      if (params.search && data.data.items) {
        const term = params.search.toLowerCase();
        data.data.items.sort((a, b) => {
          if (a.name.toLowerCase() === term) return -1;
          if (b.name.toLowerCase() === term) return 1;
          return 0;
        });
      }

      return data.data;
    } catch (err) {
      throw err.response?.data?.message || err.message;
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    search: "",
    category: "",
    price: "", // Price filter
    sort: "",
    analytics: "",
    filters: {},
    loading: false,
    error: null,
  },
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setLimit(state, action) {
      state.limit = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
      state.page = 1;
    },
    setCategory(state, action) {
      state.category = action.payload;
      state.page = 1;
    },
    setPrice(state, action) {
      state.price = action.payload;
      state.page = 1;
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
    setAnalytics(state, action) {
      state.analytics = action.payload;
    },
    setFilters(state, action) {
      state.filters = action.payload;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setPage,
  setLimit,
  setSearch,
  setCategory,
  setPrice,
  setSort,
  setAnalytics,
  setFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
