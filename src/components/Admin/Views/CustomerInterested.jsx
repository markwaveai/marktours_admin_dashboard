import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";


export default function CustomerInterested() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerCache, setCustomerCache] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total_records: 0,
    total_pages: 1,
    page_size: 15
  });


  useEffect(() => {
    const API_URL = "https://marktours-services-jn6cma3vvq-el.a.run.app/customer-interested";

    const fetchCustomers = async () => {
      // Check cache first
      if (customerCache[currentPage]) {
        console.log(`Loading page ${currentPage} from cache`);
        setCustomers(customerCache[currentPage]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(`${API_URL}?page=${currentPage}&page_size=15`);
        if (!res.ok) throw new Error("API failed");

        const data = await res.json();
        const fetchedCustomers = data?.customers || data?.data?.customers || data?.data || [];
        
        setCustomers(fetchedCustomers);
        setPagination({
          total_records: data.total_records || 0,
          total_pages: data.total_pages || 1,
          page_size: 15
        });

        // Update cache
        setCustomerCache(prev => ({
          ...prev,
          [currentPage]: fetchedCustomers
        }));

      } catch (err) {
        console.error("FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

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
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm relative">
        <div className="sticky top-0 z-30 bg-white flex flex-col sm:flex-row justify-between items-center p-6 py-3 border-b bg-gradient-to-r from-gray-50 to-white gap-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Interested Candidates</h2>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-48">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600"
                size={16}
              />
              <input
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-100 focus:bg-white border border-transparent focus:border-indigo-300 outline-none transition-all"
                placeholder="Search candidates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-800 uppercase">S.No</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-800 uppercase ">Name</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-800 uppercase">Phone</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-800 uppercase">Email</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-800 uppercase">Destination</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-800 uppercase">Pincode</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-800 uppercase min-w-[200px]">Created</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan="7" className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading &&
                filteredCustomers.map((c, i) => (
                  <tr key={c.id || i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-center">{(currentPage - 1) * pagination.page_size + i + 1}</td>
                    <td className="px-4 py-3 text-center font-medium text-gray-900 max-w-[200px] overflow-hidden text-ellipsis">{c.name}</td>
                    <td className="px-4 py-3 text-center text-gray-500">{c.mobile}</td>
                    <td className="px-4 py-3 text-center text-gray-500 ">{c.email}</td>
                    <td className="px-4 py-3 text-center text-gray-500  ">{c.destination}</td>
                    <td className="px-4 py-3 text-center text-gray-500 max-w-[100px] overflow-hidden text-ellipsis">{c.pincode}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex px-2 text-xs font-semibold leading-5 text-gray-800 bg-gray-100 rounded-full">
                        {formatDate(c.created_at)}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* ================= PAGINATION CONTROLS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 items-center px-6 py-4 border-t gap-4">
        <div className="text-sm text-gray-500 text-center sm:text-left order-2 sm:order-1">
          Showing {((currentPage - 1) * pagination.page_size) + 1} to {Math.min(currentPage * pagination.page_size, pagination.total_records)} of {pagination.total_records} entries
        </div>
        
        <div className="flex justify-center gap-2 order-1 sm:order-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded text-sm font-medium transition-colors
              ${currentPage === 1 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-white text-gray-700 hover:bg-gray-50 hover:text-indigo-600"}`}
          >
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max={pagination.total_pages}
              value={currentPage}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 1 && val <= pagination.total_pages) {
                  setCurrentPage(val);
                }
              }}
              className="w-16 px-2 py-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50 text-indigo-700 font-medium"
            />
            <span className="text-sm text-gray-600">of {pagination.total_pages}</span>
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.total_pages))}
            disabled={currentPage === pagination.total_pages}
            className={`px-3 py-1 border rounded text-sm font-medium transition-colors
              ${currentPage === pagination.total_pages 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-white text-gray-700 hover:bg-gray-50 hover:text-indigo-600"}`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:block order-3"></div>
      </div>
    </div>
  );
}


