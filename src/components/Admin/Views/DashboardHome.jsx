import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";

import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserCheck,
  faBriefcase,
  faCreditCard,
  faTriangleExclamation,
  faArrowUp,
  faArrowDown,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

/* ------------------ HELPERS ------------------ */
const isUserActive = (u) =>
  u?.status === "Active" ||
  u?.status === "ACTIVE" ||
  u?.status === "active" ||
  u?.is_active === true ||
  u?.active === true;

export default function DashboardHome() {
  /* ------------------ STATE ------------------ */
  const [usersData, setUsersData] = useState([]);
  const [agentsData, setAgentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ------------------ EMI STATIC DATA ------------------ */
  const emiProjectionData = [
    { month: "Jan", collected: 4000, projected: 2400 },
    { month: "Feb", collected: 3000, projected: 1398 },
    { month: "Mar", collected: 2000, projected: 9800 },
    { month: "Apr", collected: 2780, projected: 3908 },
    { month: "May", collected: 1890, projected: 4800 },
    { month: "Jun", collected: 2390, projected: 3800 },
  ];

  /* ------------------ FETCH DATA ------------------ */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const usersRes = await fetch(
          "https://marktours-services-jn6cma3vvq-el.a.run.app/user-details"
        );
        const agentsRes = await fetch(
          "https://marktours-services-jn6cma3vvq-el.a.run.app/agents"
        );

        const usersJson = await usersRes.json();
        const agentsJson = await agentsRes.json();

        const usersArray = Array.isArray(usersJson?.user_details)
          ? usersJson.user_details
          : [];

        const agentsArray = Array.isArray(agentsJson?.agents)
          ? agentsJson.agents
          : [];

        setUsersData(usersArray);
        setAgentsData(agentsArray);
      } catch (error) {
        console.error("Dashboard API error:", error);
        setUsersData([]);
        setAgentsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /* ------------------ STATS ------------------ */
  const totalUsers = usersData.length;
  const activeUsers = usersData.filter(isUserActive).length;
  const totalEmployees = agentsData.length;

  const criticalRisk = usersData.filter(
    (u) => u?.riskLevel === "Critical"
  ).length;

  const totalPendingEMI = usersData
    .reduce((sum, u) => {
      const amt = parseInt(
        String(u?.emiAmount || "").replace(/\D/g, "")
      );
      return sum + (amt || 0);
    }, 0)
    .toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });

  /* ------------------ PIE DATA ------------------ */
  const statusCounts = usersData.reduce((acc, u) => {
    const key = isUserActive(u) ? "Active" : "Inactive";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
  }));

  /* ------------------ RISK BAR DATA ------------------ */
  const riskLevels = ["Low", "Medium", "High", "Critical"];

  const stackedRiskData = riskLevels.map((level) => {
    const list = usersData.filter((u) => u?.riskLevel === level);
    return {
      name: level,
      Active: list.filter(isUserActive).length,
      Inactive: list.filter((u) => !isUserActive(u)).length,
    };
  });

  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* ------------------ STAT CARDS ------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Widget title="Total Users" value={totalUsers} change="+12%" icon={faUsers} badge="bg-blue-600" />
        <Widget title="Active Users" value={activeUsers} change="+5%" icon={faUserCheck} badge="bg-green-600" />
        <Widget title="Employee Management" value={totalEmployees} change="+2" icon={faBriefcase} badge="bg-black" />
        <Widget title="Projected Month EMI" value={totalPendingEMI} change="-2%" icon={faCreditCard} badge="bg-orange-500" />
        <Widget title="Critical Risk" value={criticalRisk} change="0%" icon={faTriangleExclamation} badge="bg-red-600" />
      </div>

      {/* ------------------ CHARTS ------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PIE */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">
            User Status Distribution
          </h3>

          <div className="h-[300px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={75} outerRadius={100}>
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={["#22c55e", "#ef4444"][index % 2]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RISK BAR */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">
            Risk Level Analysis
          </h3>

          <div className="h-[300px]">
            <ResponsiveContainer>
              <BarChart data={stackedRiskData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Active" stackId="a" fill="#22c55e" />
                <Bar dataKey="Inactive" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ------------------ EMI TRENDS ------------------ */}
        <div className="bg-white p-6 rounded-xl shadow-sm border lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">
            EMI Collection Trends
          </h3>

          <div className="h-[300px]">
            <ResponsiveContainer>
              <AreaChart data={emiProjectionData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="collected"
                  stroke="#6366f1"
                  fill="#c7d2fe"
                />

                <Area
                  type="monotone"
                  dataKey="projected"
                  stroke="#22c55e"
                  fill="#bbf7d0"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ------------------ WIDGET ------------------ */
function Widget({ title, value, change, icon, badge }) {
  const isPositive = change.startsWith("+");
  const isNeutral = change.startsWith("0");

  const trend = isPositive
    ? faArrowUp
    : isNeutral
      ? faMinus
      : faArrowDown;

  const trendStyle = isPositive
    ? "bg-green-100 text-green-700"
    : isNeutral
      ? "bg-gray-100 text-gray-700"
      : "bg-red-100 text-red-700";

  const isEMI = title.toLowerCase().includes("emi");

  return (
    <div className="bg-white rounded-xl border border-gray-200 py-5 px-4 shadow-sm hover:shadow-md transition grid grid-rows-[48px_40px_32px]">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 font-medium max-w-[70%]">
          {title}
        </p>

        <div className={`w-7 h-7 rounded-full ${badge} flex items-center justify-center`}>
          <FontAwesomeIcon icon={icon} className="text-white text-xs" />
        </div>
      </div>

      <div className="flex items-center">
        <h3 className={`font-bold text-gray-900 ${isEMI ? "text-xl" : "text-2xl"}`}>
          {value}
        </h3>
      </div>

      <div className="flex items-center">
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-2xl ${trendStyle}`}>
          <FontAwesomeIcon icon={trend} />
          {change} from last month
        </span>
      </div>
    </div>
  );
}
