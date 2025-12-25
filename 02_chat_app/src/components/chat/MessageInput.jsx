"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageApi } from "@/redux/uiSliceTunk/messageSlice";

export default function MessageInput() {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const conversation = useSelector(
    (state) => state.conversation.active
  );

  const send = async () => {
    if (!text.trim()) return;

    await dispatch(
      sendMessageApi({
        conversationId: conversation._id,
        text,
      })
    );

    setText("");
  };

  return (
    <div className="border-t p-4 flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border rounded px-3 py-2"
        placeholder="Type a message..."
      />
      <button
        onClick={send}
        className="bg-blue-500 text-white px-4 rounded"
      >
        Send
      </button>
    </div>
  );
}
