"use client";

import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
 // const [user, setUser] = useState(null);

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">
        Welcome, admin 👋
      </h1>

      <p className="text-gray-700">Email no</p>
      <p className="text-gray-700">Role: admin</p>
    </div>
  );
}
