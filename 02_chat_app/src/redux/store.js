import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "@/redux/redux-persist/storage";

import authReducer from "./authSliceTunk/authSlice";
import userListReducer from "./user-listSliceTunk/user-listSlice";
import conversationReducer from './uiSliceTunk/conversationSlice'
import messageReducer from './uiSliceTunk/messageSlice'
import scoketReducer from './scoketSliceTunk/scoketSlice'

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["chat"], // persist only chat slice
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  userList: userListReducer,
  messageList: messageReducer,
  conversation:conversationReducer,
  scoket: scoketReducer
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
