import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,     // 📄
  faChartSimple,   // 📊
  faNoteSticky,    // 📝
} from "@fortawesome/free-solid-svg-icons";

export default function ReportsLogs() {
  const reports = [
    { id: 1, name: "Monthly Financial Report - Nov 2023", date: "2023-12-01", type: "PDF", size: "2.4 MB" },
    { id: 2, name: "User Acquisition Audit", date: "2023-11-28", type: "CSV", size: "1.1 MB" },
    { id: 3, name: "Tour Occupancy Analysis", date: "2023-11-25", type: "PDF", size: "3.8 MB" },
    { id: 4, name: "Defaulter Risk Log", date: "2023-11-20", type: "XLSX", size: "0.5 MB" },
    { id: 5, name: "System Access Logs", date: "2023-11-15", type: "TXT", size: "12 MB" },
  ];

  const getIcon = (type) => {
    if (type === "CSV" || type === "XLSX") return faChartSimple; // 📊
    if (type === "TXT") return faNoteSticky; // 📝
    return faFileLines; // 📄
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Reports & Audit Logs
        </h2>
        <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900">
          Generate New Report
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 uppercase text-xs font-semibold text-gray-500">
            <tr>
              <th className="px-6 py-4">Report Name</th>
              <th className="px-6 py-4">Date Generated</th>
              <th className="px-6 py-4">Format</th>
              <th className="px-6 py-4">Size</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {reports.map((report) => (
              <tr
                key={report.id}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                  <FontAwesomeIcon
                    icon={getIcon(report.type)}
                    className="text-lg text-black"
                  />
                  {report.name}
                </td>

                <td className="px-6 py-4">{report.date}</td>

                <td className="px-6 py-4">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                    {report.type}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {report.size}
                </td>

                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:underline font-medium">
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
