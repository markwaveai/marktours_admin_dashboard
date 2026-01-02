import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import usersData from "../../../data/users.json";

export default function EMIPayments() {
  /* ================= OVERDUE CALCULATION ================= */
  const overdueUsers = usersData.filter(
    (u) => u.status === "Late" || u.status === "Defaulted"
  );

  const totalOverdue = overdueUsers
    .reduce((acc, user) => {
      const amount = parseInt(user.emiAmount?.replace(/[^0-9]/g, "")) || 0;
      return acc + amount;
    }, 0)
    .toLocaleString("en-IN", { style: "currency", currency: "INR" });

  /* ================= PAYMENT HISTORY ================= */
  const paymentHistory = [
    { date: "2023-12-01", username: "Arjun Sharma", trip: "Dubai", type: "Online", amount: 45000 },
    { date: "2023-12-02", username: "Priya Patel", trip: "Singapore", type: "Bank Transfer", amount: 32000 },
    { date: "2023-12-03", username: "Rahul Verma", trip: "Thailand", type: "Online", amount: 58000 },
    { date: "2023-12-04", username: "Sneha Reddy", trip: "Bali", type: "Cash", amount: 21000 },
    { date: "2023-12-05", username: "Kiran Kumar", trip: "Dubai", type: "Online", amount: 67000 },
    { date: "2023-12-06", username: "Anjali Mehta", trip: "Malaysia", type: "Cheque", amount: 43000 },
    { date: "2023-12-07", username: "Vikram Singh", trip: "Europe", type: "Online", amount: 89000 },
    { date: "2023-12-08", username: "Rohit Kumar", trip: "Thailand", type: "Cash", amount: 31000 },
    { date: "2023-12-09", username: "Neha Jain", trip: "Dubai", type: "Online", amount: 52000 },
  ];

  /* ================= CHART DATA (ONLY 7 DAYS) ================= */
  const chartData = paymentHistory.filter(
    (item) => item.date >= "2023-12-01" && item.date <= "2023-12-07"
  );

  return (
    <div className="space-y-6">

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border">
          <p className="text-sm text-gray-500">Total Collected</p>
          <h3 className="text-2xl font-bold mt-1">₹5,43,000</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <p className="text-sm text-gray-500">Total Overdue</p>
          <h3 className="text-2xl font-bold text-red-600 mt-1">
            {totalOverdue}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <p className="text-sm text-gray-500">Upcoming (7 Days)</p>
          <h3 className="text-2xl font-bold text-blue-600 mt-1">
            ₹1,25,000
          </h3>
        </div>
      </div>

      {/* ================= GRAPH & TRANSACTIONS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ===== DAILY COLLECTIONS GRAPH ===== */}
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="text-lg font-semibold mb-4">Daily Collections</h3>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis />

                {/* ✅ ONLY TOOLTIP BOX – NO BAR HIGHLIGHT */}
                <Tooltip
                  cursor={false} // ❌ bar ki background raadhu
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    padding: "6px 10px",
                  }}
                  labelStyle={{
                    color: "#111827",
                    fontWeight: "600",
                    marginBottom: "4px",
                  }}
                  itemStyle={{
                    color: "#4f46e5",
                    fontWeight: "600",
                  }}
                  formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Amount"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />

                <Bar
                  dataKey="amount"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===== RECENT TRANSACTIONS ===== */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="p-4 border-b font-semibold">
            Recent Transactions
          </div>

          <div className="max-h-[320px] overflow-y-auto">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">User Name</th>
                  <th className="px-4 py-2 text-left">Trip</th>
                  <th className="px-4 py-2 text-left">Mode</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>

              <tbody>
                {paymentHistory.map((txn, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{txn.date}</td>
                    <td className="px-4 py-2 font-medium">{txn.username}</td>
                    <td className="px-4 py-2">
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-semibold">
                        {txn.trip}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right font-semibold">
                      ₹{txn.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
