"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "@/redux/user-listSliceTunk/user-listSlice";
import { getOrCreateConversation } from "@/redux/uiSliceTunk/conversationSlice";
import socketService from "@/services/socketService";
import { fetchMessages } from "@/redux/uiSliceTunk/messageSlice";

export default function UserList() {
  const dispatch = useDispatch();

  // ✅ Select users, loading, and error from the slice
  const users = useSelector((state) => state.userList.users);
  const loading = useSelector((state) => state.userList.loading);
  const error = useSelector((state) => state.userList.error);

  // Fetch users on mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Open or create conversation and join socket room
  const openChat = async (userId) => {
    try {
      const res = await dispatch(getOrCreateConversation(userId)).unwrap();
      socketService.joinConversation(res._id);
      dispatch(fetchMessages(res._id));
    } catch (err) {
      console.error("Failed to open chat:", err);
    }
  };

  if (loading) {
    return <div className="p-4 text-gray-500">Loading users...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 space-y-2">
      {users.length === 0 ? (
        <div className="text-gray-400">No users found</div>
      ) : (
        users.map((u) => (
          <div
            key={u._id}
            onClick={() => openChat(u._id)}
            className="cursor-pointer p-2 rounded hover:bg-gray-100"
          >
            <div className="font-medium">{u.name}</div>
            <div className="text-sm text-gray-500">{u.email}</div>
          </div>
        ))
      )}
    </div>
  );
}
