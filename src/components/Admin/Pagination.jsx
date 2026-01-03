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
            // Logic to show ellipsis if needed, for simplicity let's show start, end, and around current
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
        <div className={`flex items-center justify-center gap-2 py-3 ${className}`}>
            <div className="mr-4 text-sm text-gray-500">
                Page {currentPage} of {totalPages}
            </div>

            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-600 shadow-sm"
            >
                <FiChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === "..." ? (
                            <span className="px-2 text-gray-400 text-xs">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page)}
                                className={`min-w-[28px] h-7 px-1.5 rounded-md text-xs font-semibold transition-all
                  ${currentPage === page
                                        ? "bg-indigo-600 text-white shadow-sm"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-600 shadow-sm"
            >
                <FiChevronRight size={16} />
            </button>
        </div>
    );
}
