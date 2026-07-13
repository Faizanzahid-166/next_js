import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSliceTunk/authSlice";

import adminUserRoleReducer from './adminSliceTunk/adminUsersRoleSliceTunk'
import adminproductRoleReducer from './adminSliceTunk/adminProductRoleSliceTunk'
import adminOrdersReducer from './adminSliceTunk/adminOrdersSliceTunk'

import productReducer from "./productsSliceTunk/productfetchSliceTunk";
import cartReducer from "./productsSliceTunk/cartSliceTunk";

import paymentReducer from "./paymentSliceTunk/orderPlace/orderPlaceSliceTunk";
import orderConfirmationReducer from "./paymentSliceTunk/orderConfirmation/orderConfirmationSliceTunk";
import orderHistoryReducer from "./paymentSliceTunk/orderHistory/orderHistorySliceTunk";

export const store = configureStore({
  reducer: {
    // auth tunk
    auth: authReducer,

    //  admin tunk
    adminUsers: adminUserRoleReducer,
    adminproduct:adminproductRoleReducer,
    adminOrders: adminOrdersReducer,

    // product tunk
     products: productReducer,
     cart: cartReducer,

     // payment tunk
      payment: paymentReducer,
      orderConfirmation: orderConfirmationReducer,
      orderHistory: orderHistoryReducer,



  },
});
