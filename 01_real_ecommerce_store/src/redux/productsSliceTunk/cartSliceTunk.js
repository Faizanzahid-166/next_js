import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "/api/products/cart";

const cloneItems = (items = []) =>
  (Array.isArray(items) ? items.map((item) => ({ ...item })) : []).map((item) => ({
    ...item,
    productId: item.productId ?? item.product_id,
    quantity: Number(item.quantity || 0),
    price: Number(item.price || 0),
    stock: Number(item.stock || 0),
  }));

const applyOptimisticMutation = (items, { productId, quantity, item }) => {
  const nextItems = cloneItems(items);
  const normalizedProductId = String(productId);
  const normalizedQuantity = Number(quantity || 0);

  if (!normalizedProductId) return nextItems;

  const itemIndex = nextItems.findIndex((entry) => String(entry.productId) === normalizedProductId);

  if (itemIndex === -1) {
    if (normalizedQuantity <= 0) return nextItems;
    nextItems.push({
      productId: normalizedProductId,
      quantity: Math.max(1, normalizedQuantity),
      name: item?.name || "Product",
      price: Number(item?.price || 0),
      stock: Number(item?.stock || 0),
      image_url: item?.image_url || item?.image_url || "",
    });
    return nextItems;
  }

  const existingItem = nextItems[itemIndex];
  const updatedQuantity = (Number(existingItem.quantity || 0) + normalizedQuantity);

  if (updatedQuantity <= 0) {
    nextItems.splice(itemIndex, 1);
    return nextItems;
  }

  nextItems[itemIndex] = {
    ...existingItem,
    quantity: Math.min(updatedQuantity, Number(existingItem.stock || updatedQuantity)),
  };

  return nextItems;
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/fetchcart`, {
        withCredentials: true,
      });
      return res.data.data ?? { cartId: null, items: [] };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addCartItem = createAsyncThunk(
  "cart/addCartItem",
  async ({ productId, quantity, item }, { getState, dispatch, rejectWithValue }) => {
    const previousItems = cloneItems(getState().cart.items || []);
    const delta = Number(quantity || 0);

    if (!productId || !Number.isFinite(delta) || delta === 0) {
      return rejectWithValue("Quantity must be a valid non-zero number.");
    }

    dispatch(
      optimisticCartUpdate({
        productId,
        quantity: delta,
        item,
        previousItems,
      })
    );

    try {
      const res = await axios.post(
        `${API_BASE}/addcart`,
        { productId, quantity: delta },
        { withCredentials: true }
      );
      return res.data.data ?? { cartId: null, items: [] };
    } catch (err) {
      dispatch(revertOptimisticCartUpdate(previousItems));
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_BASE}/deletecart`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartId: null,
    items: [],
    loading: false,
    error: null,
    pendingMutations: {},
  },
  reducers: {
    optimisticCartUpdate(state, action) {
      const { productId, quantity, item, previousItems } = action.payload;
      state.pendingMutations = {
        ...state.pendingMutations,
        [String(productId)]: true,
      };
      state.items = applyOptimisticMutation(previousItems?.length ? previousItems : state.items, {
        productId,
        quantity,
        item,
      });
      state.error = null;
    },
    revertOptimisticCartUpdate(state, action) {
      const previousItems = cloneItems(action.payload || []);
      state.items = previousItems;
      state.error = "Your last cart change could not be saved. Please try again.";
      if (action.payload && action.payload.length) {
        const lastProductId = String(action.payload[0]?.productId || "");
        if (lastProductId) {
          state.pendingMutations = { ...state.pendingMutations, [lastProductId]: false };
        }
      }
    },
    clearCartError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartId = action.payload?.cartId || null;
        state.items = cloneItems(action.payload?.items || []);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCartItem.pending, (state, action) => {
        state.pendingMutations = {
          ...state.pendingMutations,
          [String(action.meta.arg.productId)]: true,
        };
        state.error = null;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.cartId = action.payload?.cartId || state.cartId;
        state.items = cloneItems(action.payload?.items || state.items);
        const productId = String(action.meta.arg.productId);
        state.pendingMutations = {
          ...state.pendingMutations,
          [productId]: false,
        };
      })
      .addCase(addCartItem.rejected, (state, action) => {
        const productId = String(action.meta.arg.productId);
        state.pendingMutations = {
          ...state.pendingMutations,
          [productId]: false,
        };
        state.error = action.payload;
      })
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.cartId = null;
        state.items = [];
        state.pendingMutations = {};
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { optimisticCartUpdate, revertOptimisticCartUpdate, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
