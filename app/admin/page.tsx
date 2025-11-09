"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { AlertCircle, LayoutDashboard, Loader2, Users, Plane, DollarSign } from "lucide-react";

// Placeholder for fetching stats (will be implemented in a later step)
interface AdminStats {
  totalUsers: number;
  totalTrips: number;
  // Add more stats as needed
}

// StatCard Component
const StatCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
  </div>
);


// This component will handle the admin check and display the dashboard content
export default function DashboardPage() {
  const { isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);

  // Check admin access using the existing API route
  useEffect(() => {
    if (!isLoaded) return;

    const checkAdmin = async () => {
      try {
        // We use the GET /api/admin/config route which performs the admin check
        const response = await fetch("/api/admin/config");

        if (response.status === 403) {
          setIsAdmin(false);
          const errorData = await response.json().catch(() => ({}));
          setMessage(errorData.message || errorData.error || "Access denied. Please check your admin email configuration.");
        } else if (response.ok) {
          setIsAdmin(true);
          // TODO: Fetch actual stats here once Convex queries are implemented
          setStats({ totalUsers: 120, totalTrips: 450 }); // Placeholder data
        } else {
          throw new Error("Failed to verify admin status.");
        }
      } catch (error: any) {
        console.error("Error checking admin access:", error);
        setMessage("An error occurred while verifying admin access.");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            {message || "You don't have permission to access the admin panel."}
          </p>
          <p className="text-sm text-gray-500">
            Contact your administrator to get access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 sm:gap-3 mb-6">
        <LayoutDashboard className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <p className="text-sm sm:text-base text-gray-600 mb-8">
        Welcome to the Admin Dashboard. Select a module from the sidebar to manage the application.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={stats?.totalUsers ?? "..."} icon={Users} />
        <StatCard title="Total Trips" value={stats?.totalTrips ?? "..."} icon={Plane} />
        <StatCard title="Revenue (Placeholder)" value="$0.00" icon={DollarSign} />
      </div>
    </div>
  );
}
