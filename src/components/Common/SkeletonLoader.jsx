import React from "react";

export default function SkeletonLoader({ type = "table", count = 5 }) {
  if (type === "dashboard") {
    return (
      <div className="space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3 animate-pulse">
                <div className="flex justify-between items-start">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-80 animate-pulse">
             <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
             <div className="h-full bg-gray-100 rounded-lg opacity-50"></div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-80 animate-pulse">
             <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
             <div className="h-full bg-gray-100 rounded-lg opacity-50"></div>
          </div>
        </div>

         {/* Tables/Rows Skeleton */}
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-64 animate-pulse"></div>
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse mt-5">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
            <div className="flex gap-4">
                 <div className="h-20 w-20 bg-gray-200 rounded-lg shrink-0"></div>
                 <div className="flex-1 space-y-2 py-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                 </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
                 <div className="h-10 bg-gray-100 rounded"></div>
                 <div className="h-10 bg-gray-100 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: Table Skeleton
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-full animate-pulse">
      {/* Header Skeleton */}
      <div className="h-16 bg-gray-50 border-b border-gray-200 px-6 flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="flex gap-3">
              <div className="h-9 w-64 bg-gray-200 rounded-lg"></div>
              <div className="h-9 w-32 bg-gray-200 rounded-lg"></div>
          </div>
      </div>

      {/* Rows Skeleton */}
      <div className="p-0 flex-1 overflow-hidden">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-6 py-4 border-b border-gray-100 last:border-0">
             <div className="h-4 w-10 bg-gray-200 rounded"></div> {/* ID/No */}
             <div className="h-8 w-8 bg-gray-200 rounded-full shrink-0"></div> {/* Avatar */}
             <div className="h-4 flex-1 bg-gray-200 rounded max-w-[150px]"></div> {/* Name */}
             <div className="h-4 flex-1 bg-gray-200 rounded max-w-[200px] hidden sm:block"></div> {/* Email */}
             <div className="h-4 w-24 bg-gray-200 rounded hidden md:block"></div> {/* Date */}
             <div className="h-4 w-24 bg-gray-200 rounded hidden lg:block"></div> {/* Phone */}
             <div className="h-6 w-16 bg-gray-200 rounded-full"></div> {/* Badge */}
             <div className="h-8 w-20 bg-gray-200 rounded ml-auto"></div> {/* Action */}
          </div>
        ))}
      </div>
    </div>
  );
}
