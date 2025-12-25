"use client";

import { useSelector } from "react-redux";

export default function MessageList() {
 const messages = useSelector((state) => state.messageList.list || []);
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`max-w-xs p-2 rounded ${
            msg.sender._id === user._id
              ? "ml-auto bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}
