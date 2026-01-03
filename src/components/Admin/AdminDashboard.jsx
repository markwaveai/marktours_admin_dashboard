import React, { useState, useEffect, useRef } from "react";

import {
  LayoutDashboard,
  Users,
  CreditCard,
  AlertTriangle,
  Plane,
  Settings,
  FileText,
  Gift,
  LogOut,
  Menu,
  X,
  CalendarCheck,

} from "lucide-react";

/* -------------------- Views -------------------- */
import DashboardHome from "./Views/DashboardHome";
import EMIPayments from "./Views/EMIPayments";
import RiskDefaulters from "./Views/RiskDefaulters";
import TourManagement from "./Views/TourManagement";
import EligibilityEngine from "./Views/EligibilityEngine";
import ReportsLogs from "./Views/ReportsLogs";
import CompanyPaid from "./Views/CompanyPaid";
import TourAssignment from "./Views/TourAssignment";


import CustomerInterested from "./Views/CustomerInterested";
import DetailsTab from "./Views/DetailsTab";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only for mobile/tablet where sidebar is fixed/overlay
      // Tailwind md is 768px.
      if (window.innerWidth >= 768) return;
      
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
         setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, component: <DashboardHome /> },
    { name: "Details", icon: Users, component: <DetailsTab /> },
    { name: "Tour Management", icon: Plane, component: <TourManagement /> },
    { name: "Customer Interested", icon: Users, component: <CustomerInterested /> },

    // Disabled items (visible but inactive)
    { name: "Tour Assignment", icon: CalendarCheck, component: <TourAssignment />, disabled: true },
    { name: "EMI & Payments", icon: CreditCard, component: <EMIPayments />, disabled: true },
    { name: "Risk & Defaulters", icon: AlertTriangle, component: <RiskDefaulters />, disabled: true },
    { name: "Eligibility Engine", icon: Settings, component: <EligibilityEngine />, disabled: true },
    { name: "Reports & Audit Logs", icon: FileText, component: <ReportsLogs />, disabled: true },
    { name: "Company-Paid (12th Month)", icon: Gift, component: <CompanyPaid />, disabled: true },
  ];

  const ActiveComponent =
    menuItems.find((item) => item.name === activeTab)?.component ||
    <DashboardHome />;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* -------------------- SIDEBAR -------------------- */}
      {/* -------------------- OVERLAY (Mobile/Tablet) -------------------- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* -------------------- SIDEBAR -------------------- */}
      <aside
        ref={sidebarRef}
        className={`bg-white border-r border-gray-200 flex-col shadow-lg duration-500 ease-in-out 
        ${isSidebarOpen
          ? "w-64 translate-x-0 mr-4"
          : "w-64 -translate-x-full md:w-0 md:translate-x-0 overflow-hidden"}
        fixed md:relative z-50 flex h-full`}
      >
        {/* HEADER */}
        <div className="h-20 flex items-center gap-3 px-4 border-b">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? <X /> :''}
          </button>

          <img
            src="/images/Layer 2.png"
            alt="Mark Tours"
            className="w-[90px]"
          />
        </div>

        {/* NAV */}
        <nav className="flex-1 overflow-y-auto py-5 px-4 scrollbar-hide">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.name && !item.disabled;

              return (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      if (!item.disabled) {
                        setActiveTab(item.name);
                        setIsSidebarOpen(false);
                      }
                    }}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all whitespace-nowrap
                      ${isActive
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
                      }
                      ${item.disabled ? "cursor-not-allowed opacity-70" : ""}
                    `}
                  >
                    <item.icon
                      className={`w-5 h-5 mr-3 ${isActive ? "text-white" : "text-gray-400"
                        }`}
                    />
                    {item.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
              A
            </div>
            <div>
              <p className="text-sm font-bold">Admin User</p>
              <p className="text-xs text-gray-500">admin@marktours.com</p>
            </div>
          </div>

          <button
            className="mt-3 ml-8 p-3 flex items-center justify-center text-xs text-red-600 hover:bg-red-50 py-2 rounded-lg"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout Securely
          </button>
        </div>
      </aside>

      {/* -------------------- MAIN CONTENT -------------------- */}
      <div className="flex-1 flex flex-col">

        {/* TOP HEADER */}
        <header className="h-16 w-full bg-white border-b flex items-center justify-between px-6 fixed top-0 z-20 py-5">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu />
              </button>
            )}
            <h1 className="text-xl font-bold">{activeTab}</h1>
          </div>

          <div className="text-right hidden md:block">
            <p className="text-xs text-gray-500">Today</p>
            <p className="text-sm font-bold">
              {new Date().toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex justify-center pt-5 overflow-scroll scrollbar-hide mt-16">
          <div className="w-[95vw] overflow-scroll scrollbar-hide">
            {ActiveComponent}
          </div>
        </main>
      </div>
    </div>
  );
}
