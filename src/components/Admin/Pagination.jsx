import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({ currentPage, totalPages, onPageChange, className = "" }) {
    if (totalPages <= 0) return null;

    // Generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "...", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }
        return pages;
    };

    return (
        <div className={`flex items-center justify-center py-4 ${className}`}>
            <div className="bg-white px-2 py-2 rounded-2xl shadow-sm border border-gray-100 inline-flex items-center gap-2">
                
                {/* Back Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
                >
                    <FiChevronLeft size={14} />
                    Back
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2 mx-2">
                    {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === "..." ? (
                                <span className="text-gray-300 text-xs pb-2 select-none tracking-widest">...</span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(page)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all
                                        ${currentPage === page
                                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                            : "bg-indigo-50 text-indigo-400 hover:bg-indigo-100"
                                        }`}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
                >
                    Next
                    <FiChevronRight size={14} />
                </button>
            </div>
        </div>
    );
}
