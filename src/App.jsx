import React, { useState, Suspense, lazy } from "react";

import Splash from "./components/Splash";

// Lazy load components
const LoginPage = lazy(() => import("./components/Login/LoginPage"));
const AdminDashboard = lazy(() => import("./components/Admin/AdminDashboard"));

export default function App() {
   const [showSplash, setShowSplash] = useState(true);
   const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showSplash ? (
        <Splash onFinish={() => setShowSplash(false)} />
      ) : (
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        }>
          {showLogin ? <LoginPage setShowLogin={setShowLogin}/> : <AdminDashboard/>}
        </Suspense>
      )}
    </>
  );
}
