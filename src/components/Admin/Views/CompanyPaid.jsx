import usersData from "../../../data/users.json";

export default function CompanyPaid() {
    const eligibleForBenefit = usersData.filter(u => u.status === "Active" && u.riskLevel === "Low");

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">12th Month Company-Paid Benefit</h2>
                    <p className="text-yellow-50 max-w-xl text-lg">
                        Reward your loyal customers! The company pays the 12th month EMI for users who have consistently paid on time for 11 months.
                    </p>
                    <button className="mt-6 bg-white text-orange-600 px-6 py-2 rounded-lg font-bold shadow-md hover:bg-gray-50 transition">
                        Auto-Process Eligible Users
                    </button>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white opacity-10 rounded-full"></div>
                <div className="absolute bottom-[-30px] left-[20%] w-32 h-32 bg-white opacity-10 rounded-full"></div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Eligible Beneficiaries</h3>
                    <p className="text-sm text-gray-500">Users eligible for the 12th month waiver based on payment history.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Tour Package</th>
                                <th className="px-6 py-4">Total Paid (11 Months)</th>
                                <th className="px-6 py-4">Waiver Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {eligibleForBenefit.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4">{user.tour}</td>
                                    <td className="px-6 py-4">{user.totalPaid}</td>
                                    <td className="px-6 py-4 font-bold text-green-600">{user.emiAmount}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                                            Qualified
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="bg-indigo-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-indigo-700">
                                            Approve Benefit
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
