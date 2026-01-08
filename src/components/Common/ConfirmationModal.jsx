import React from "react";
import { FiX, FiAlertTriangle, FiCheckCircle, FiInfo } from "react-icons/fi";

export default function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    type = "danger",
    showInput = false,
    inputPlaceholder = "Enter remark..."
}) {
    if (!isOpen) return null;
    
    const [inputValue, setInputValue] = React.useState("");

    const themes = {
        danger: {
            bg: "bg-rose-100",
            iconColor: "text-rose-600",
            icon: <FiAlertTriangle className="w-6 h-6 text-rose-600" />,
            button: "bg-rose-500 hover:bg-rose-600 shadow-rose-200"
        },
        success: {
            bg: "bg-green-100",
            iconColor: "text-green-600",
            icon: <FiCheckCircle className="w-6 h-6 text-green-600" />,
            button: "bg-green-600 hover:bg-green-700 shadow-green-200"
        },
        warning: {
            bg: "bg-amber-100",
            iconColor: "text-amber-600",
            icon: <FiAlertTriangle className="w-6 h-6 text-amber-600" />,
            button: "bg-amber-500 hover:bg-amber-600 shadow-amber-200"
        },
        info: {
            bg: "bg-blue-100",
            iconColor: "text-blue-600",
            icon: <FiInfo className="w-6 h-6 text-blue-600" />,
            button: "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
        }
    };

    const theme = themes[type] || themes.danger;

    const isConfirmDisabled = showInput && !inputValue.trim();

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
                role="dialog"
            >
                <div className="p-6">
                    <div className={`flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full ${theme.bg}`}>
                        {theme.icon}
                    </div>

                    <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {message}
                        </p>
                        {showInput && (
                            <textarea
                                className="w-full mt-4 p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none resize-none transition-all"
                                rows="3"
                                placeholder={inputPlaceholder}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        )}
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
                        onClick={() => onConfirm(inputValue)}
                        disabled={isConfirmDisabled}
                        className={`flex-1 py-2.5 px-4 font-semibold rounded-xl text-white shadow-lg transition-colors ${theme.button} ${isConfirmDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
