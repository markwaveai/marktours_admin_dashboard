import React, { createContext, useContext, useState, useCallback } from "react";
import ConfirmationModal from "../components/Common/ConfirmationModal";

const ConfirmContext = createContext();

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error("useConfirm must be used within a ConfirmProvider");
    }
    return context;
};

export const ConfirmProvider = ({ children }) => {
    const [config, setConfig] = useState(null);

    const confirm = useCallback((options) => {
        return new Promise((resolve) => {
            setConfig({
                ...options,
                onConfirm: () => {
                    setConfig(null);
                    resolve(true);
                },
                onCancel: () => {
                    setConfig(null);
                    resolve(false);
                },
            });
        });
    }, []);

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            {config && (
                <ConfirmationModal
                    isOpen={!!config}
                    title={config.title}
                    message={config.message}
                    confirmText={config.confirmText}
                    cancelText={config.cancelText}
                    onConfirm={config.onConfirm}
                    onCancel={config.onCancel}
                    type={config.type}
                />
            )}
        </ConfirmContext.Provider>
    );
};
