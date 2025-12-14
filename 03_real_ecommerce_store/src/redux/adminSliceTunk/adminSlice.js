import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// -----------------------
//  GET ALL ADMINS
// -----------------------
export const fetchAdmins = createAsyncThunk(
  "admin/fetchAdmins",
  async (_, thunkAPI) => {
    try {
      const res = await fetch("/api/admin/list-admins", {
        method: "GET",
        credentials: "include", // <-- required for cookies
      });

      const data = await res.json();
      if (!res.ok) return thunkAPI.rejectWithValue(data.message);

      return data.admins;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// -----------------------
//  DELETE ADMIN
// -----------------------
export const deleteAdmin = createAsyncThunk(
  "admin/deleteAdmin",
  async (adminId, thunkAPI) => {
    try {
      const res = await fetch("/api/admin/delete-admin", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminId }),
      });

      const data = await res.json();
      if (!res.ok) return thunkAPI.rejectWithValue(data.message);

      return adminId; // return deleted ID to remove from store
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// -----------------------
//  SLICE
// -----------------------
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admins: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    // FETCH ADMINS
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // DELETE ADMIN
    builder
      .addCase(deleteAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = state.admins.filter((a) => a._id !== action.payload);
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
