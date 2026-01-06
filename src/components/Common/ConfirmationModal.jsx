import React from "react";
import { FiX, FiAlertTriangle } from "react-icons/fi";

export default function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    type = "danger"
}) {
    if (!isOpen) return null;

    const isDanger = type === "danger";

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
                role="dialog"
            >
                <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-rose-100">
                        <FiAlertTriangle className="w-6 h-6 text-rose-600" />
                    </div>

                    <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 p-4 bg-gray-50 mt-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-2.5 px-4 font-semibold rounded-xl text-white shadow-lg transition-colors
              ${isDanger
                                ? "bg-rose-500 hover:bg-rose-600 shadow-rose-200"
                                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"}
            `}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
