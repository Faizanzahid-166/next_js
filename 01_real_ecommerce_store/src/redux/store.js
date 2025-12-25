import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSliceTunk/authSlice";

import adminUserRoleReducer from './adminSliceTunk/adminUsersRoleSliceTunk'
import adminproductRoleReducer from './adminSliceTunk/adminProductRoleSliceTunk'

import productReducer from "./productsSliceTunk/productfetchSliceTunk";
import cartReducer from "./productsSliceTunk/cartSliceTunk";

export const store = configureStore({
  reducer: {
    // auth tunk
    auth: authReducer,

    //  admin tunk
    adminUsers: adminUserRoleReducer,
    adminproduct:adminproductRoleReducer,

    // product tunk
     products: productReducer,
     cart: cartReducer,


  },
});
