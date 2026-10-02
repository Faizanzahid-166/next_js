/**
 * Guest Cart Slice
 *
 * Manages a local cart for unauthenticated (guest) users.
 * Items are persisted to localStorage so they survive page refreshes.
 * When a guest checks out, cart items are sent directly in the order request body.
 */

import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "blitz_guest_cart";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function loadFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // quota exceeded or private browsing — silently ignore
  }
}

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
const guestCartSlice = createSlice({
  name: "guestCart",
  initialState: {
    items: [], // populated on first client render via hydrateGuestCart
  },
  reducers: {
    /** Called once on client mount to restore items from localStorage. */
    hydrateGuestCart(state) {
      state.items = loadFromStorage();
    },

    /**
     * Add a product to the guest cart.
     * If it already exists the quantity is incremented (up to stock).
     * payload: { productId, name, price, image_url, stock, quantity? }
     */
    addGuestCartItem(state, action) {
      const { productId, name, price, image_url, stock, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.productId === productId);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, stock);
      } else {
        state.items.push({ productId, name, price, image_url, stock, quantity });
      }
      saveToStorage(state.items);
    },

    /**
     * Set an item's quantity explicitly.
     * payload: { productId, quantity }   — set quantity to 0 to remove.
     */
    updateGuestCartItem(state, action) {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.productId !== productId);
      } else {
        const item = state.items.find((i) => i.productId === productId);
        if (item) item.quantity = quantity;
      }
      saveToStorage(state.items);
    },

    /** Remove a single item by productId. */
    removeGuestCartItem(state, action) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      saveToStorage(state.items);
    },

    /** Wipe the entire guest cart (e.g. after successful order). */
    clearGuestCart(state) {
      state.items = [];
      saveToStorage([]);
    },
  },
});

export const {
  hydrateGuestCart,
  addGuestCartItem,
  updateGuestCartItem,
  removeGuestCartItem,
  clearGuestCart,
} = guestCartSlice.actions;

export default guestCartSlice.reducer;
