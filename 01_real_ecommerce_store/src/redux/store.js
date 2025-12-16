import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSliceTunk/authSlice";

import adminReducer from './adminSliceTunk/adminSlice'
import adminRequestReducer from './adminSliceTunk/adminRequestSlice'
import adminResponseReducer from './adminSliceTunk/adminResponseSlice'

import productReducer from "./productsSliceTunk/productfetchSliceTunk";
import cartReducer from "./productsSliceTunk/cartSliceTunk";

export const store = configureStore({
  reducer: {
    // auth tunk
    auth: authReducer,

    //  admin tunk
    admin: adminReducer,
    adminRequest: adminRequestReducer,
    adminResponse: adminResponseReducer,

    // product tunk
     products: productReducer,
     cart: cartReducer,


  },
});
