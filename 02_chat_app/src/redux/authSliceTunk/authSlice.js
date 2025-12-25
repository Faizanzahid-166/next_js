import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";

/* =========================
   Async Thunks
========================= */

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/auth/login", credentials, { withCredentials: true });
      return data.data; // { id, name, email, role }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// SIGNUP
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/auth/signup", payload, { withCredentials: true });
      return data.data; // usually signup does not auto-login
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

// FETCH LOGGED IN USER
export const fetchMe = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/auth/me", { withCredentials: true });
      return data.data; // user object: { _id, name, email, role, ... }
    } catch (err) {
      return rejectWithValue("Unauthorized");
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    await api.post("/api/auth/logout", {}, { withCredentials: true });
    return null;
  }
);

/* =========================
   Slice
========================= */

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* SIGNUP */
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Do NOT set user here; user must login after signup
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FETCH ME */
     // ME (fetch user)
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.loading = false;
      })

      /* LOGOUT */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
