import React from "react";

export default function SkeletonLoader({ type = "table", count = 5 }) {
  if (type === "dashboard") {
    return (
      <div className="animate-pulse space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-xl"></div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-200 h-80 rounded-xl"></div>
          <div className="bg-gray-200 h-80 rounded-xl"></div>
        </div>

        {/* Recent Activity Skeleton */}
        <div className="bg-gray-200 h-64 rounded-xl"></div>
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="flex justify-between">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: Table Skeleton
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="h-16 bg-gray-100 border-b border-gray-200 mb-4"></div>

      {/* Rows Skeleton */}
      <div className="p-6 space-y-4">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 bg-gray-200 rounded w-1/12"></div>
            <div className="h-4 bg-gray-200 rounded w-3/12"></div>
            <div className="h-4 bg-gray-200 rounded w-2/12"></div>
            <div className="h-4 bg-gray-200 rounded w-2/12"></div>
            <div className="h-4 bg-gray-200 rounded w-1/12"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
