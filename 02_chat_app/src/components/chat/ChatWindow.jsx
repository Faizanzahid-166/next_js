"use client";

import { useSelector } from "react-redux";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatWindow() {
  const conversation = useSelector(
    (state) => state.conversation.active
  );

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 font-medium">
        Chat
      </div>

      <MessageList />
      <MessageInput />
    </div>
  );
}
