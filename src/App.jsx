import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// import Home from "./components/Home";
import LoginPage from "./components/Login/LoginPage";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Splash from "./components/Splash";

export default function App() {
   const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash ? (
        <Splash onFinish={() => setShowSplash(false)} />
      ) : (
        <AdminDashboard/>

      )}
    </>
  );
}
