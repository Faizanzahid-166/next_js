"use client";

import { useSelector } from "react-redux";

export default function AdminDashboardPage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">
        Welcome, {user.name} 👋
      </h1>

      <p className="text-gray-700">Email: {user.email}</p>
      <p className="text-gray-700">Role: {user.role}</p>
    </div>
  );
}
