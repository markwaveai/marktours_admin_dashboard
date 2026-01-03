import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  Briefcase,
} from "lucide-react";

/* -------------------- Views -------------------- */
import DashboardHome from "./Views/DashboardHome";
import UserManagement from "./Views/UserManagement";
import EMIPayments from "./Views/EMIPayments";
import RiskDefaulters from "./Views/RiskDefaulters";
import TourManagement from "./Views/TourManagement";
import EligibilityEngine from "./Views/EligibilityEngine";
import ReportsLogs from "./Views/ReportsLogs";
import CompanyPaid from "./Views/CompanyPaid";
import TourAssignment from "./Views/TourAssignment";
import EmployeeManagement from "./Views/EmployeeManagement";

import CustomerInterested from "./Views/CustomerInterested";
import DetailsTab from "./Views/DetailsTab";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <aside
        className={`bg-white border-r border-gray-200 flex-col shadow-lg transition-all duration-300
        ${isSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:translate-x-0 overflow-hidden"}
        fixed md:relative z-50 flex h-full`}
      >
        {/* HEADER */}
        <div className="h-20 flex items-center gap-3 px-4 border-b">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </button>

          <img
            src="/images/Layer 2.png"
            alt="Mark Tours"
            className="w-[90px]"
          />
        </div>

        {/* NAV */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 scrollbar-hide">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.name && !item.disabled;

              return (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      if (!item.disabled) {
                        setActiveTab(item.name);
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
            className="mt-3 flex items-center justify-center text-xs text-red-600 hover:bg-red-50 py-2 rounded-lg"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout Securely
          </button>
        </div>
      </aside>

      {/* -------------------- MAIN CONTENT -------------------- */}
      <div className="flex-1 flex flex-col">

        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-20">
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
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {ActiveComponent}
          </div>
        </main>
      </div>
    </div>
  );
}
