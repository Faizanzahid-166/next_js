"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMe } from "@/redux/authSliceTunk/authSlice";

export default function HomePage() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(fetchMe());
    }
  }, [dispatch, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <p className="text-white text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-pink-100 to-yellow-200 flex flex-col items-center justify-center px-6">

      <div className="max-w-3xl w-full text-center p-10 bg-white/70 backdrop-blur-md rounded-3xl shadow-xl animate-fadeIn">

        {user ? (
          <>
            <h1 className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
              Welcome back, {user.name}! 👋
            </h1>

            <p className="text-lg text-gray-700 mb-8">
              Explore new arrivals, exclusive deals, and personalized recommendations.
            </p>

            <div className="flex gap-4 justify-center">
              <Link
                href="/products"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition transform"
              >
                Start Chat
              </Link>

              <Link
                href={user?.role === "customer" ? "/customer/dashboard" : "/admin/dashboard"}
                className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition transform"
              >
                My Profile
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-pink-500">
              Welcome to Blitz Chat-App 
            </h1>

            <p className="text-lg text-gray-700 mb-8">
              The best place for Chats
            </p>

            <div className="flex gap-4 justify-center">
              <Link
                href="/login"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition transform"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-400 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition transform"
              >
                Create Account
              </Link>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
