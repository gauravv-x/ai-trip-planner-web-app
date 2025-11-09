"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { Plane, Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface TripDetail {
  _id: Id<"TripDetailTable">;
  _creationTime: number;
  tripId: string;
  uid: Id<"UserTable">;
  tripDetail: any; // Adjust type as needed based on your tripDetail structure
}

export default function TripManagementPage() {
  const [trips, setTrips] = useState<TripDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [limit, setLimit] = useState(10);
  const deleteTrip = useMutation(api.tripDetail.deleteTrip);
  const tripList = useQuery(api.tripDetail.getTrips, { limit });

  useEffect(() => {
    if (tripList) {
      setTrips(tripList.page);
      setLoading(false);
    } else if (tripList === undefined) {
      setLoading(true);
    }
  }, [tripList, limit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }
  if (success) {
    return <div className="text-green-500">{success}</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-2 sm:gap-3 mb-6">
        <Plane className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Trip Management</h1>
      </div>

      {trips && trips.length > 0 ? (
        <div className="space-y-4">
          {trips.map((trip) => (
            <div key={trip._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <p>Trip ID: {trip.tripId}</p>
              <p>User ID: {trip.uid}</p>
              <button onClick={() => {
                  if (trip._id) {
                      if (window.confirm("Are you sure you want to delete this trip?")) {
                          try {
                              deleteTrip( { id: trip._id });
                              // Refetch trips after deletion
                              // Assuming tripList is a state variable or a ref
                              // You might need to adjust this based on how you're fetching the trips
                              // For example, if using useQuery, you might need to refetch the query
                              // For now, I'll just set the trips to an empty array to refresh the list
                              setTrips(prevTrips => prevTrips.filter(t => t._id !== trip._id));
                          } catch (error) {
                              console.error("Error deleting trip:", error);
                              // Optionally, set an error state to display an error message to the user
                              setError("Failed to delete trip.");
                          }
                      }
                  }
                }} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Delete
              </button>
              <button onClick={() => {
                  if (trip._id) {
                      if (window.confirm("Are you sure you want to discard this trip?")) {
                          try {
                              deleteTrip( { id: trip._id });
                              // Refetch trips after deletion
                              // Assuming tripList is a state variable or a ref
                              // You might need to adjust this based on how you're fetching the trips
                              // For example, if using useQuery, you might need to refetch the query
                              // For now, I'll just set the trips to an empty array to refresh the list
                              setTrips(prevTrips => prevTrips.filter(t => t._id !== trip._id));
                          } catch (error) {
                              console.error("Error deleting trip:", error);
                              // Optionally, set an error state to display an error message to the user
                              setError("Failed to delete trip.");
                          }
                      }
                  }
                }} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
                Discard
              </button>
              {/* Display a snippet of the tripDetail or a link to view the full details */}
            </div>
          ))}
        </div>
      ) : (
        <p>No trips found.</p>
      )}
    </div>
  );
}