"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { Users, Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface User {
  _id: Id<"UserTable">;
  _creationTime: number;
  name: string;
  email: string;
  imageUrl: string;
  subscription?: string;
}
export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = useMutation(api.user.deleteUser);
  const handleDeleteUser = async (userId: Id<"UserTable">) => {
    try {
      await deleteUser({ userId });
      // Refetch users after deletion
      // const userList = await api.user.getUsers.query({ limit });
      // if (userList) {
      //   setUsers(userList.page);
      // }
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
    } catch (error) {
      setError("Failed to delete user.");
      console.error("Failed to delete user:", error);
    }
  };

  const [limit, setLimit] = useState(10);
  const userList = useQuery(api.user.getUsers, { limit });

  useEffect(() => {
    if (userList) {
      setUsers(userList.page); // Extract the 'page' array from PaginationResult
      setLoading(false);
    } else if (userList === undefined) {
      setLoading(true);
    }
  }, [userList, limit]); // Add limit to dependency array

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-2 sm:gap-3 mb-6">
        <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
      </div>

      {users && users.length > 0 ? (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <button onClick={() => handleDeleteUser(user._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}