"use client";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { fetchMe } from "@/redux/authSliceTunk/authSlice";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(fetchMe());
    }
  }, [dispatch, user]);

  return children;
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
