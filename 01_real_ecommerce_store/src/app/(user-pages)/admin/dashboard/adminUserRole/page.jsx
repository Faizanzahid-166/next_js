"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, editUserRole } from "@/redux/adminSliceTunk/adminUsersRoleSliceTunk";

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.adminUsers);

  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const startEdit = (user) => {
    setEditingUserId(user._id);
    setSelectedRole(user.isRoot ? "root" : user.role);
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setSelectedRole("");
  };

 const saveRole = (userId) => {
  dispatch(
    editUserRole({
      userId,
      role: selectedRole === "root" ? "admin" : selectedRole,
      isRoot: selectedRole === "root",
    })
  ).then(() => setEditingUserId(null));
};



  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Admin Panel – User Roles
        </h1>

        {loading && <p className="text-gray-500">Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && users.length === 0 && (
          <p className="text-center text-gray-500">No users found.</p>
        )}

        {!loading && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => {
                  const isEditing = editingUserId === user._id;

                  return (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{user._id}</td>
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>

                      <td className="px-4 py-3">
                        {isEditing ? (
                          <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="border rounded-md px-2 py-1"
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                            <option value="root">Root</option>
                          </select>
                        ) : (
                          <span className="capitalize font-medium">
                            {user.isRoot ? "Root" : user.role}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 space-x-2">
                        {!isEditing ? (
                          <button
                            onClick={() => startEdit(user)}
                            disabled={user.isRoot} // Prevent editing root
                            className={`px-3 py-1 text-sm rounded text-white ${
                              user.isRoot
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                          >
                            Edit
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => saveRole(user._id)}
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
