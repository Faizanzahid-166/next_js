"use client";

import ChatLayout from "@/components/chat/ChatLayout";
import useInitSocketListeners from "@/hooks/useInitSocketListeners";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";

export default function ChatPage() {
  const user = useSelector((state) => state.auth.user);

  useInitSocketListeners();

  if (!user) redirect("/login");

  return <ChatLayout />;
}
