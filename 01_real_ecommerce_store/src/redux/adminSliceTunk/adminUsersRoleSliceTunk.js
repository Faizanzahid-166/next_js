import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* =======================
   Fetch All Users
======================= */
export const fetchUsers = createAsyncThunk(
  "adminUsers/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const res = await fetch("/api/admin/auth/list-users", {
        credentials: "include",
      });

      const data = await res.json();

      console.log("ALL USERS RESPONSE:", data); // 👈 debug

      if (data.status !== "success") {
        throw new Error(data.message);
      }

      // ✅ THIS IS THE KEY LINE
      return data.data.users;

    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


/* =======================
   Edit User Role
======================= */
export const editUserRole = createAsyncThunk(
  "adminUsers/editUserRole",
  async ({ userId, role, isRoot }, thunkAPI) => {
    try {
      const res = await fetch("/api/admin/auth/edit-role", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role, isRoot }),
      });

      const data = await res.json();

      if (data.status !== "success") throw new Error(data.message);

      return data.data; // <-- must return the updated user object
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // edit role
     .addCase(editUserRole.fulfilled, (state, action) => {
  const updatedUser = action.payload; 
  const index = state.users.findIndex(u => u._id === updatedUser._id);
  if (index !== -1) {
    state.users[index] = updatedUser;
  }
});

  },
});

export default adminUsersSlice.reducer;
