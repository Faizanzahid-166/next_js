"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

interface Message {
  content: string;
  createdAt: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAcceptingMessages, setIsAcceptingMessages] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  // Fetch user session status and messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      // 1️⃣ Accept messages status
      const statusRes = await fetch("/api/user/accept-messages-status", {
        method: "GET",
        credentials: "include", // ✅ include NextAuth cookie
      });
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setIsAcceptingMessages(statusData.isAcceptingMessage);
      }

      // 2️⃣ Fetch messages (same endpoint, or create a /messages endpoint)
      const messagesRes = await fetch("/api/user/accept-messages-status", {
        method: "GET",
        credentials: "include",
      });
      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setMessages(messagesData.messages || []);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  // Send mystery messages on page load
  const sendMysteryMessages = async () => {
    try {
      const res = await fetch("/api/mystery-message", {
        method: "POST",
        credentials: "include", // ✅ send session cookie
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Mystery messages sent:", data.sentMessages);
        fetchMessages(); // refresh messages
      }
    } catch (err) {
      console.error("Failed to send mystery messages:", err);
    }
  };

  // Toggle accepting messages
  const toggleAcceptMessages = async () => {
    try {
      const res = await fetch("/api/user/accept-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ send session cookie
        body: JSON.stringify({ acceptMessages: !isAcceptingMessages }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsAcceptingMessages(data.isAcceptingMessage);
      } else {
        console.error("Failed to toggle accept messages");
      }
    } catch (err) {
      console.error("Error toggling accept messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    sendMysteryMessages();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome Home</h1>

      {/* Logout Button */}
      <button
        onClick={() => signOut({ callbackUrl: "/sign-in" })}
        className="mb-4 px-4 py-2 bg-red-600 text-white rounded"
      >
        Logout
      </button>

      {/* Accept Messages Toggle */}
      <button
        onClick={toggleAcceptMessages}
        className={`mb-4 px-4 py-2 rounded text-white ${
          isAcceptingMessages ? "bg-blue-600" : "bg-gray-600"
        }`}
      >
        {isAcceptingMessages ? "Stop Accepting Messages" : "Start Accepting Messages"}
      </button>

      {/* Messages List */}
      <h2 className="text-xl font-semibold mb-2">Your Messages:</h2>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul className="space-y-2">
          {messages.map((msg, idx) => (
            <li key={idx} className="border p-2 rounded">
              <p>{msg.content}</p>
              <small className="text-gray-500">
                {new Date(msg.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
