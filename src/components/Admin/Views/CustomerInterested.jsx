import React, { useEffect, useState } from "react";
import Pagination from "../Pagination";

const API_URL =
  "https://marktours-services-jn6cma3vvq-el.a.run.app/customer-interested";

const InterestedCandidates = ({ refreshKey }) => {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);

        // Fetch with page parameter
        const res = await fetch(`${API_URL}?page=${currentPage}`);
        if (!res.ok) throw new Error("API failed");

        const data = await res.json();

        setCustomers(
          data?.customers ||
          data?.data?.customers ||
          data?.data ||
          []
        );
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error("FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [refreshKey, currentPage]);

  const filteredCustomers = customers.filter((c) =>
    `${c.name} ${c.mobile} ${c.email} ${c.destination}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  // Client-side slicing removed (Server-side pagination)


  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">Interested Candidates</h2>
            <p className="text-sm text-gray-500">
              Manage interested candidates details
            </p>
          </div>

          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 rounded-lg border px-4 py-2 text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">S.NO</th>
                <th className="px-6 py-4 text-left">NAME</th>
                <th className="px-6 py-4 text-left">PHONE</th>
                <th className="px-6 py-4 text-left">EMAIL</th>
                <th className="px-6 py-4 text-left">DESTINATION</th>
                <th className="px-6 py-4 text-left">PINCODE</th>
                <th className="px-6 py-4 text-left">CREATED</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan="7" className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading &&
                filteredCustomers.map((c, i) => (
                  <tr key={c.id || i} className="border-t">
                    <td className="px-6 py-4">{(currentPage - 1) * 10 + i + 1}</td>
                    <td className="px-6 py-4">{c.name}</td>
                    <td className="px-6 py-4">{c.mobile}</td>
                    <td className="px-6 py-4">{c.email}</td>
                    <td className="px-6 py-4">{c.destination}</td>
                    <td className="px-6 py-4">{c.pincode}</td>
                    <td className="px-6 py-4">
                      {formatDate(c.created_at)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>

      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default InterestedCandidates;
