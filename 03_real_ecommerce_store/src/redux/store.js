import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSliceTunk/authSlice";
import adminReducer from './adminSliceTunk/adminSlice'
import adminRequestReducer from './adminSliceTunk/adminRequestSlice'
import adminResponseReducer from './adminSliceTunk/adminResponseSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    adminRequest: adminRequestReducer,
    adminResponse: adminResponseReducer,
  },
});
