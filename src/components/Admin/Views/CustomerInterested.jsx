import React, { useEffect, useState } from "react";
import { FiSearch, FiDownload, FiInbox } from "react-icons/fi";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import DownloadModal from "../../Common/DownloadModal";


export default function CustomerInterested() {
  const [search, setSearch] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
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

  const handleDownload = () => {
    setShowDownloadModal(true);
  };
  
  const processDownload = async (options) => {
      try {
        const pagesToFetch = options.pageOption === 'all' ? pagination.total_pages : options.customPages;
        const allData = [];
        const API_URL = "https://marktours-services-jn6cma3vvq-el.a.run.app/customer-interested";

        // Show some loading indication? For now assume fast enough or user will see download started eventually.
        // Ideally we should use a toast or loading state.
        
        for (let i = 1; i <= pagesToFetch; i++) {
            // Check cache first if we want, but for full download fresh data might be better. 
            // Lets fetch fresh to be safe and simple loop.
            try {
                const res = await fetch(`${API_URL}?page=${i}&page_size=15`);
                const data = await res.json();
                const pageCustomers = data?.customers || data?.data?.customers || data?.data || [];
                allData.push(...pageCustomers);
            } catch (err) {
                console.error(`Error fetching page ${i}:`, err);
            }
        }

        if (options.format === 'excel') {
            const worksheet = XLSX.utils.json_to_sheet(allData.map((c, index) => ({
                "S.No": index + 1,
                "Name": c.name,
                "Phone": c.mobile,
                "Email": c.email,
                "Destination": c.destination,
                "Pincode": c.pincode,
                "Created At": formatDate(c.created_at)
            })));
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Interested Candidates");
            XLSX.writeFile(workbook, "Interested_Candidates.xlsx");
        } else if (options.format === 'pdf') {
            const doc = new jsPDF();
            
            doc.setFontSize(18);
            doc.text("Interested Candidates Report", 14, 22);
            doc.setFontSize(11);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

            const tableColumn = ["S.No", "Name", "Phone", "Email", "Destination", "Pincode", "Created"];
            const tableRows = [];

            allData.forEach((c, index) => {
                const data = [
                    index + 1,
                    c.name,
                    c.mobile,
                    c.email,
                    c.destination,
                    c.pincode,
                    formatDate(c.created_at)
                ];
                tableRows.push(data);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 35,
                theme: 'grid',
                styles: { 
                    fontSize: 8,
                    cellPadding: 3,
                    overflow: 'linebreak'
                },
                headStyles: { 
                    fillColor: [79, 70, 229],
                    halign: 'center',
                    valign: 'middle'
                },
                columnStyles: {
                    0: { cellWidth: 15, halign: 'center' }, // S.No
                    1: { cellWidth: 40 }, // Name
                    2: { cellWidth: 25, halign: 'center' }, // Phone
                    3: { cellWidth: 45 }, // Email
                    4: { cellWidth: 25 }, // Destination
                    5: { cellWidth: 20, halign: 'center' }, // Pincode
                    6: { cellWidth: 25, halign: 'center' }  // Created
                }
            });

            doc.save("Interested_Candidates.pdf");
        }

      } catch (error) {
          console.error("Download failed:", error);
      }
  };

  return (
    <div className="h-[calc(100vh-75px)] flex flex-col">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm relative flex-1 flex flex-col min-h-0">
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

            
            <button 
              onClick={handleDownload}
              className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200"
              title="Download Data"
            >
              <FiDownload size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0 scrollbar-hide">
          {loading ? (
            <div className="text-center py-6">Loading...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <div className="bg-gray-50 p-6 rounded-full mb-4">
                    <FiInbox className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No records found</h3>
            </div>
          ) : (
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
              {filteredCustomers.map((c, i) => (
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
          )}
        </div>



      {/* ================= PAGINATION CONTROLS ================= */}
      {filteredCustomers.length > 0 && !loading && (
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
      )}
      </div>
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onDownload={processDownload}
        totalRecords={pagination.total_records}
        totalPages={pagination.total_pages}
      />
    </div>
  );
}


