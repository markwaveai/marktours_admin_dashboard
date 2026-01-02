import usersData from "../../../data/users.json";

export default function RiskDefaulters() {
    const riskyUsers = usersData.filter(u => u.riskLevel === "High" || u.riskLevel === "Critical" || u.status === "Defaulted");

    return (
        <div className="space-y-6">

            <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <h3 className="font-bold text-red-800">High Risk Alerts</h3>
                        <p className="text-sm text-red-600">Action needed for {riskyUsers.length} accounts.</p>
                    </div>
                </div>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">Send Bulk Reminders</button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Risk & Defaulters List</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Risk Level</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Overdue Amount</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {riskyUsers.map(user => (
                                <tr key={user.id} className="hover:bg-red-50/10 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.riskLevel === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {user.riskLevel}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{user.status}</td>
                                    <td className="px-6 py-4 font-bold text-red-600">{user.emiAmount}</td>
                                    <td className="px-6 py-4">{user.phone}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-indigo-600 hover:text-indigo-800 font-medium mr-3">Call</button>
                                        <button className="text-red-600 hover:text-red-800 font-medium">Issue Notice</button>
                                    </td>
                                </tr>
                            ))}
                            {riskyUsers.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No high-risk accounts found. Great job! 🎉
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
