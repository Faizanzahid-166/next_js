"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "@/redux/authSlice";

export default function AppInit({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser()); // auto fetch user from cookies
  }, [dispatch]);

  return children;
}
