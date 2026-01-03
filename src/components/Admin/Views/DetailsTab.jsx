import React, { useState } from "react";
import UserManagement from "./UserManagement";
import EmployeeManagement from "./EmployeeManagement";

export default function DetailsTab() {
    const [activeSubTab, setActiveSubTab] = useState("User Management");

    return (
        <div className="space-y-6">
            {/* Sub-tab Navigation */}
            <div className="flex space-x-4 border-b">
                <button
                    className={`pb-2 px-4 text-sm font-medium transition-colors ${activeSubTab === "User Management"
                            ? "border-b-2 border-indigo-600 text-indigo-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveSubTab("User Management")}
                >
                    User Management
                </button>
                <button
                    className={`pb-2 px-4 text-sm font-medium transition-colors ${activeSubTab === "Employee Management"
                            ? "border-b-2 border-indigo-600 text-indigo-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveSubTab("Employee Management")}
                >
                    Employee Management
                </button>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
                {activeSubTab === "User Management" && <UserManagement />}
                {activeSubTab === "Employee Management" && <EmployeeManagement />}
            </div>
        </div>
    );
}
