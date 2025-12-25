import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch product list
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}) => {
    try {
      const response = await axios.get("/api/products", { params });
      console.log("All products:", response.data); // ✅ log API data
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
      console.log("API error:", err.response?.data?.message || err.message); // ✅ log error
      throw err.response?.data?.message || err.message;
    }
  }
);

// Async thunk to fetch single product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id) => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      console.log("product-ID:", response.data); // ✅ log API data
      return response.data.data; // API returns { status, message, data }
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
    product_no: "", // ✅ add this
    category: "",
    price: "",
    sort: "",
    analytics: "",
    filters: {},
    loading: false,
    error: null,
    selectedProduct: null,
    productLoading: false,
    productError: null,
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
    setProductNo(state, action) {   // ✅ add this
      state.product_no = action.payload;
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
    clearSelectedProduct(state) {
      state.selectedProduct = null;
      state.productLoading = false;
      state.productError = null;
    },
  },
 extraReducers: (builder) => {
  // FETCH PRODUCTS
  builder
    .addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchProducts.fulfilled, (state, action) => {
      console.log("Redux fulfilled payload:", action.payload);

      state.loading = false;
      state.items = action.payload.items;      // ✅ THIS WAS MISSING
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalPages = action.payload.totalPages;
    })
    .addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

  // FETCH SINGLE PRODUCT
  builder
    .addCase(fetchProductById.pending, (state) => {
      state.productLoading = true;
      state.productError = null;
    })
    .addCase(fetchProductById.fulfilled, (state, action) => {
      state.productLoading = false;
      state.selectedProduct = action.payload;
    })
    .addCase(fetchProductById.rejected, (state, action) => {
      state.productLoading = false;
      state.productError = action.error.message;
    });
},
});

export const {
  setPage,
  setLimit,
  setSearch,
  setProductNo,   // ✅ export it
  setCategory,
  setPrice,
  setSort,
  setAnalytics,
  setFilters,
  clearSelectedProduct,
} = productsSlice.actions;

export default productsSlice.reducer;