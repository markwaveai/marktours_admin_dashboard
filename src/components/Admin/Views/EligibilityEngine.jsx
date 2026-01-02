import { useState } from "react";
import usersData from "../../../data/users.json";

export default function EligibilityEngine() {
    const [filterCriteria, setFilterCriteria] = useState("all");

    const eligibleUsers = usersData.filter(u =>
        filterCriteria === "all" ? true :
            filterCriteria === "eligible" ? u.eligibility === "Eligible" :
                filterCriteria === "review" ? u.eligibility === "Review Needed" :
                    u.eligibility === "Ineligible"
    );

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Automated Eligibility Engine</h2>
                <p className="text-indigo-100 max-w-2xl">
                    Our AI-powered engine analyzes payment history, credit score, and travel preferences to determine user eligibility for upcoming premium tours.
                </p>
                <div className="mt-6 flex gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex-1">
                        <p className="text-sm font-medium opacity-80">Total Scanned</p>
                        <p className="text-3xl font-bold mt-1">{usersData.length}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex-1">
                        <p className="text-sm font-medium opacity-80">Eligible Users</p>
                        <p className="text-3xl font-bold mt-1">{usersData.filter(u => u.eligibility === "Eligible").length}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex-1">
                        <p className="text-sm font-medium opacity-80">Review Needed</p>
                        <p className="text-3xl font-bold mt-1">{usersData.filter(u => u.eligibility === "Review Needed").length}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">Eligibility Results</h3>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['all', 'eligible', 'review'].map(criteria => (
                            <button
                                key={criteria}
                                onClick={() => setFilterCriteria(criteria)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${filterCriteria === criteria ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {criteria.charAt(0).toUpperCase() + criteria.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Credit Score (Mock)</th>
                                <th className="px-6 py-3">Payment History</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {eligibleUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 text-gray-500">7{10 + (typeof user.id === 'number' ? user.id % 90 : user.name.length % 90)}</td>
                                    <td className="px-6 py-4">
                                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${user.status === 'Active' || user.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'}`}
                                                style={{ width: user.status === 'Active' ? '80%' : user.status === 'Late' ? '40%' : '100%' }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-400 mt-1 block">
                                            {user.status === 'Active' ? 'Good' : user.status === 'Late' ? 'Needs Improvement' : 'Excellent'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.eligibility === 'Eligible' ? 'bg-green-100 text-green-700' :
                                                user.eligibility === 'Review Needed' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {user.eligibility}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            ℹ️ Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
