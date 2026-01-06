import React, { useState, Suspense, lazy } from "react";

import Splash from "./components/Splash";

// Lazy load components
const LoginPage = lazy(() => import("./components/Login/LoginPage"));
const AdminDashboard = lazy(() => import("./components/Admin/AdminDashboard"));

import { ToastProvider } from "./context/ToastContext";
import { ConfirmProvider } from "./context/ConfirmContext";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  // Check local storage for session
  const [showLogin, setShowLogin] = useState(() => {
    return !localStorage.getItem("admin_session");
  });

  const handleLoginSuccess = () => {
    localStorage.setItem("admin_session", "true");
    setShowLogin(false);
  }

  const handleLogout = () => { // We'll need to pass this down eventually, currently logout is mainly in Dashboard
    localStorage.removeItem("admin_session");
    setShowLogin(true);
  }

  return (
    <ToastProvider>
      <ConfirmProvider>
        {showSplash ? (
          <Splash onFinish={() => setShowSplash(false)} />
        ) : (
          <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-gray-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          }>
            {showLogin ? (
              <LoginPage setShowLogin={handleLoginSuccess} />
            ) : (
              // We can pass handleLogout if AdminDashboard needs it, or AdminDashboard can manage it via localStorage and just reload
              <AdminDashboard onLogout={handleLogout} />
            )}
          </Suspense>
        )}
      </ConfirmProvider>
    </ToastProvider>
  );
}
