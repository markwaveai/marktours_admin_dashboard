import React, { useEffect, useState } from "react";
import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";

export default function Toast({ message, type, duration, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay to allow enter animation
    const timer = setTimeout(() => setVisible(true), 10);
    
    // Auto close
    const closeTimer = setTimeout(() => {
        setVisible(false);
        // Wait for exit animation to finish before removing from DOM
        setTimeout(onClose, 300); 
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const isSuccess = type === "success";

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm transition-all duration-300 transform 
        ${visible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-4 opacity-0 scale-95"}
        ${isSuccess 
            ? "bg-emerald-500/95 border-emerald-400 text-white" 
            : "bg-rose-500/95 border-rose-400 text-white"
        }
        max-w-xs sm:max-w-sm w-full pointer-events-auto
      `}
      role="alert"
    >
      <div className="mt-0.5 shrink-0">
        {isSuccess ? <FiCheckCircle size={20} className="text-emerald-100" /> : <FiAlertCircle size={20} className="text-rose-100" />}
      </div>
      
      <div className="flex-1 mr-2">
        <h4 className="font-bold text-sm leading-tight mb-1">
          {isSuccess ? "Success!" : "Error"}
        </h4>
        <p className="text-xs font-medium leading-relaxed opacity-90">
          {message}
        </p>
      </div>

      <button
        onClick={handleClose}
        className={`
          shrink-0 p-1 rounded-lg transition-colors
          ${isSuccess ? "hover:bg-emerald-600/50 text-emerald-100" : "hover:bg-rose-600/50 text-rose-100"}
        `}
      >
        <FiX size={16} />
      </button>
    </div>
  );
}
