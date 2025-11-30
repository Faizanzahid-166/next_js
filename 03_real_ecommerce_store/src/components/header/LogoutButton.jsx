"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    router.refresh();      // refresh server + client state
    router.push("/");      // redirect to home
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
}
