import React, { useState, useEffect } from "react";
import { FiX, FiDownload, FiFileText, FiGrid } from "react-icons/fi";

export default function DownloadModal({
    isOpen,
    onClose,
    onDownload,
    totalRecords,
    totalPages
}) {
    if (!isOpen) return null;

    const [format, setFormat] = useState("excel"); // excel | pdf
    const [pageOption, setPageOption] = useState("all"); // all | custom
    const [customPages, setCustomPages] = useState(1);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormat("excel");
            setPageOption("all");
            setCustomPages(1);
        }
    }, [isOpen]);

    const handleDownload = () => {
        onDownload({
            format,
            pageOption,
            customPages: pageOption === 'custom' ? Number(customPages) : null
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
                role="dialog"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <FiDownload size={20} />
                        </div>
                        Download Report
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors bg-white hover:bg-gray-100 p-1.5 rounded-lg border border-transparent hover:border-gray-200"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Stats Summary */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex justify-between items-center text-sm">
                        <div className="text-blue-900">
                            <span className="block text-xs text-blue-600 font-semibold uppercase tracking-wider mb-0.5">Total Records</span>
                            <span className="font-bold text-lg">{totalRecords}</span>
                        </div>
                        <div className="h-8 w-px bg-blue-200 mx-4"></div>
                        <div className="text-blue-900 text-right">
                            <span className="block text-xs text-blue-600 font-semibold uppercase tracking-wider mb-0.5">Total Pages</span>
                            <span className="font-bold text-lg">{totalPages}</span>
                        </div>
                    </div>

                    {/* Format Selection */}
                    <div>
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide block mb-3">
                            Select Format
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${format === 'excel' ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50 border-gray-200'}`}>
                                <input
                                    type="radio"
                                    name="format"
                                    value="excel"
                                    checked={format === "excel"}
                                    onChange={() => setFormat("excel")}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                />
                                <span className="ml-3 flex items-center gap-2 text-sm font-medium text-gray-900">
                                    <FiGrid className={format === 'excel' ? "text-green-600" : "text-gray-400"} size={18} />
                                    Excel
                                </span>
                            </label>

                            <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${format === 'pdf' ? 'bg-red-50 border-red-200' : 'hover:bg-gray-50 border-gray-200'}`}>
                                <input
                                    type="radio"
                                    name="format"
                                    value="pdf"
                                    checked={format === "pdf"}
                                    onChange={() => setFormat("pdf")}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                                />
                                <span className="ml-3 flex items-center gap-2 text-sm font-medium text-gray-900">
                                    <FiFileText className={format === 'pdf' ? "text-red-600" : "text-gray-400"} size={18} />
                                    PDF
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Page Range Selection */}
                    <div>
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide block mb-3">
                            Data Range
                        </label>
                        <div className="space-y-3">
                            <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${pageOption === 'all' ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-gray-50 border-gray-200'}`}>
                                <input
                                    type="radio"
                                    name="pageOption"
                                    value="all"
                                    checked={pageOption === "all"}
                                    onChange={() => setPageOption("all")}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-900">
                                    All Pages <span className="text-gray-500 font-normal">({totalRecords} records)</span>
                                </span>
                            </label>

                            <div className={`border rounded-xl transition-colors ${pageOption === 'custom' ? 'bg-indigo-50 border-indigo-200' : 'border-gray-200'}`}>
                                <label className="flex items-center p-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="pageOption"
                                        value="custom"
                                        checked={pageOption === "custom"}
                                        onChange={() => setPageOption("custom")}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                    />
                                    <span className="ml-3 text-sm font-medium text-gray-900">
                                        Custom Range
                                    </span>
                                </label>

                                {pageOption === "custom" && (
                                    <div className="px-3 pb-3 ml-7 animate-in slide-in-from-top-2 duration-200">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">First</span>
                                            <input
                                                type="number"
                                                min="1"
                                                max={totalPages}
                                                value={customPages}
                                                onChange={(e) => {
                                                    const val = Math.max(1, Math.min(Number(e.target.value), totalPages));
                                                    setCustomPages(val);
                                                }}
                                                className="w-20 px-2 py-1 text-center border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold bg-white"
                                            />
                                            <span className="text-sm text-gray-600">Pages</span>
                                        </div>
                                        <p className="text-xs text-indigo-600 mt-1.5 font-medium">
                                            Estimated ~{customPages * 15} records
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <FiDownload />
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
}
