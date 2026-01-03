import React, { useEffect, useState, useRef } from "react";
import { FiEdit, FiTrash2, FiSearch, FiX } from "react-icons/fi";
import Pagination from "../Pagination";
import SkeletonLoader from "../../Common/SkeletonLoader";

const BASE_URL = "https://marktours-services-jn6cma3vvq-el.a.run.app";
const AGENT_ID = 10001;

export default function UserManagement() {
    const [loading, setLoading] = useState(true);
    const fetchingRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [usersCache, setUsersCache] = useState({});
    const [pagination, setPagination] = useState({
        total_records: 0,
        total_pages: 0,
        page_size: 15
    });
    
    const [usersData, setUsersData] = useState([]);
    const [search, setSearch] = useState("");

    const [expandedUserId, setExpandedUserId] = useState(null);
    const [extraDetails, setExtraDetails] = useState([]);
    const [extraLoading, setExtraLoading] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [originalUser, setOriginalUser] = useState(null);
    
    // Agent Search State
    const [agentSearch, setAgentSearch] = useState("");
    const [showAgentDropdown, setShowAgentDropdown] = useState(false);
    const [agentsList, setAgentsList] = useState([]);

    useEffect(() => {
        const fetchAgents = async () => {
             // Check session storage first to avoid repetitive API calls
             const cachedAgents = sessionStorage.getItem("agentsList");
             if (cachedAgents) {
                 setAgentsList(JSON.parse(cachedAgents));
             }

             // We can still fetch in background to update, or just rely on cache.
             // To strictly "minimize", we rely on cache and maybe refresh only if empty.
             if (!cachedAgents) {
                try {
                    const res = await fetch(`${BASE_URL}/agents`);
                    const data = await res.json();
                    if(data.agents) {
                        setAgentsList(data.agents);
                        sessionStorage.setItem("agentsList", JSON.stringify(data.agents));
                    }
                } catch(e) { console.error("Failed to fetch agents", e); }
             }
        };
        fetchAgents();
    }, []);

    const emptyForm = {
        user_id: null,
        name: "",
        email: "",
        mobile: "",
        branch: "",
        address: "",
        is_active: true,
        agent_id: "",
        dob: "",
        pincode: "",
        express_needs: ""
    };
    
    const [form, setForm] = useState(emptyForm);
    const [viewImg, setViewImg] = useState(null);
    const [imgLoading, setImgLoading] = useState(true);

    useEffect(() => {
        if (viewImg) {
            setImgLoading(true);
        }
    }, [viewImg]);

    /* ================= FETCH USERS ================= */
    const fetchUsers = async (page = 1) => {
        // Check cache first
        if (usersCache[page]) {
            setUsersData(usersCache[page]);
            setLoading(false);
            return;
        }

        // Deduplicate requests
        if (fetchingRef.current === page) return;
        fetchingRef.current = page;

        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/user-details?page=${page}&page_size=15`);
            const data = await res.json();
            
            if (data.status === "success") {
                setUsersData(data.user_details || []);
                setPagination({
                    total_records: data.total_records,
                    total_pages: data.total_pages,
                    page_size: data.page_size
                });

                // Update cache
                setUsersCache(prev => ({
                    ...prev,
                    [page]: data.user_details || []
                }));
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
            fetchingRef.current = null;
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    // Refresh current page (bypassing cache if needed, e.g., after edit/delete)
    const refreshCurrentPage = async () => {
        const page = currentPage;
        // Invalidate cache for this page to force a refresh
        setUsersCache(prev => {
            const newCache = { ...prev };
            delete newCache[page];
            return newCache;
        });
        // We need to call fetch explicitly after cache invalidation logic is settled 
        // or just force fetch. For simplicity, let's just force fetch logic:
        try {
            const res = await fetch(`${BASE_URL}/user-details?is_active=true&page=${page}&page_size=15`);
            const data = await res.json();
            if (data.status === "success") {
                setUsersData(data.user_details || []);
                setPagination({
                    total_records: data.total_records,
                    total_pages: data.total_pages,
                    page_size: data.page_size
                });
                setUsersCache(prev => ({
                    ...prev,
                    [page]: data.user_details || []
                }));
            }
        } catch (error) {
            console.error("Failed to refresh users", error);
        }
    };

    const filteredUsers = usersData.filter((u) =>
        `${u.name} ${u.email} ${u.mobile} ${u.branch}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

  /* ================= ROW CLICK ================= */
  const toggleRow = async (u) => {
    if (expandedUserId === u.user_id) {
      setExpandedUserId(null);
      return;
    }

    setExpandedUserId(u.user_id);
    setExtraLoading(true);
    setExtraDetails([]);

    const res = await fetch(
      `${BASE_URL}/user-extra-details/${u.user_id}`
    );
    const data = await res.json();
    setExtraDetails(data.user_extra_details || []);
    setExtraLoading(false);
  };

  /* ================= ADD USER ================= */
  const handleAddUser = () => {
    setForm(emptyForm);
    setOriginalUser(null);
    setAgentSearch("");
    setShowForm(true);
  };

  /* ================= EDIT USER ================= */
  const handleEdit = (u) => {
    setOriginalUser(u);
    setForm({ ...u, agent_id: u.agent_id || "", dob: u.dob || "", pincode: u.pincode || "", express_needs: u.express_needs || "" });
    // Show Agent ID in search box
    setAgentSearch(u.agent_id ? String(u.agent_id) : "");
    setShowForm(true);
  };

  /* ================= SAVE USER ================= */
  const handleSave = async () => {
    const isEdit = Boolean(originalUser);
    const url = isEdit
      ? `${BASE_URL}/user-details/${originalUser.user_id}`
      : `${BASE_URL}/user-details`;

    // Ensure agent_id is used from form if set, cast to Number
    const payload = {
      ...form,
      agent_id: form.agent_id ? Number(form.agent_id) : AGENT_ID
    };

    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Save Error:", errText);
        alert(`Save failed: ${res.status} - ${errText || res.statusText}`);
        return;
      }

      await refreshCurrentPage();
      setShowForm(false);
    } catch (error) {
      console.error("Save operation failed", error);
      alert("An error occurred while saving user data.");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;
    await fetch(`${BASE_URL}/user-details/${id}`, { method: "DELETE" });
    refreshCurrentPage();
  };

    // ...

    if (loading) {
        return <SkeletonLoader type="table" count={8} />;
    }

    return (
        <div className="bg-white rounded-xl shadow border border-gray-200">

        {/* ================= ADD / EDIT MODAL ================= */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[420px] rounded-xl p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-bold">
                  {originalUser ? "Edit User" : "Add User"}
                </h3>
                <button onClick={() => setShowForm(false)}>
                  <FiX />
                </button>
              </div>

              {["name", "email", "mobile", "branch", "address"].map((f) => (
                <input
                  key={f}
                  placeholder={f.toUpperCase()}
                  value={form[f]}
                  onChange={(e) =>
                    setForm({ ...form, [f]: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded mb-3"
                />
              ))}

              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Date of Birth"
                />
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Pincode"
                />
              </div>

              {/* Agent Search */}
              <div className="relative mb-3">
                <label className="text-xs text-gray-500 mb-1 block">Agent ID</label>
                <input
                  type="text"
                  placeholder="Search Agent ID or Name..."
                  value={agentSearch}
                  onFocus={() => setShowAgentDropdown(true)}
                  onChange={(e) => {
                    setAgentSearch(e.target.value);
                    setShowAgentDropdown(true);
                  }}
                  className="w-full border px-3 py-2 rounded"
                />
                {showAgentDropdown && agentSearch && (
                  <div className="absolute z-10 w-full bg-white border rounded shadow-lg max-h-40 overflow-y-auto mt-1">
                    {agentsList
                      .filter(a =>
                        a.name.toLowerCase().includes(agentSearch.toLowerCase()) ||
                        String(a.agent_id).includes(agentSearch)
                      )
                      .map(a => (
                        <div
                          key={a.agent_id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => {
                            setForm({ ...form, agent_id: a.agent_id });
                            setAgentSearch(String(a.agent_id));
                            setShowAgentDropdown(false);
                          }}
                        >
                          <span className="font-bold">{a.agent_id}</span> - {a.name} ({a.branch})
                        </div>
                      ))}
                    {agentsList.filter(a =>
                      a.name.toLowerCase().includes(agentSearch.toLowerCase()) ||
                      String(a.agent_id).includes(agentSearch)
                    ).length === 0 && (
                        <div className="px-3 py-2 text-gray-400 text-sm">No agents found</div>
                      )}
                  </div>
                )}
                {/* Hidden input to store selected ID visually just for debug or reference if needed, 
                      but logic uses form.agent_id */}
              </div>

              <textarea
                value={form.express_needs}
                onChange={(e) => setForm({ ...form, express_needs: e.target.value })}
                className="w-full border px-3 py-2 rounded mb-3"
                placeholder="Express your needs..."
                rows={3}
              />

              <button
                onClick={handleSave}
                className="w-full bg-indigo-600 text-white py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* ================= IMAGE PREVIEW MODAL ================= */}
        {viewImg && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] animate-in fade-in duration-200"
            onClick={() => setViewImg(null)}
          >
            <div className="relative bg-white p-2 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden min-h-[200px] flex items-center justify-center" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setViewImg(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
              >
                <FiX size={20} className="text-gray-600" />
              </button>
              
              {imgLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-0">
                  <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-2"></div>
                  <span className="text-sm text-gray-500 font-medium">Loading Image...</span>
                </div>
              )}

              <img
                src={viewImg}
                alt="Document Preview"
                onLoad={() => setImgLoading(false)}
                className={`w-full h-auto max-h-[80vh] object-contain rounded-xl transition-opacity duration-300 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
              />
            </div>
          </div>
        )}

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-6 py-3 border-b border-gray-100 gap-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Traveller Assessment</h2>

          <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-48">
                  <FiSearch 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600" 
                    size={16}
                  />
                  <input
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-100 focus:bg-white border border-transparent focus:border-indigo-300 outline-none transition-all"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                  />
              </div>
              <button
                  onClick={handleAddUser}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition-all whitespace-nowrap"
              >
                  + Add User
              </button>
          </div>
      </div>

      {/* ================= TABLE WRAPPER ================= */}
      <div className="p-5 border w-[100%] overflow-scroll scrollbar-hide">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">S.No</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Name</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Email</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Mobile</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Branch</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Status</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((u, i) => (
              <React.Fragment key={u.user_id}>
                <tr
                  onClick={() => toggleRow(u)}
                  className={`cursor-pointer transition-colors text-sm
                    ${expandedUserId === u.user_id ? "bg-blue-50" : "hover:bg-gray-50"}
                  `}
                >
                  <td className="px-4 py-3 text-center">{(currentPage - 1) * pagination.page_size + i + 1}</td>
                  <td className="px-4 py-3 text-center">{u.name}</td>
                  <td className="px-4 py-3 text-center">{u.email}</td>
                  <td className="px-4 py-3 text-center">{u.mobile}</td>
                  <td className="px-4 py-3 text-center">{u.branch}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full
                      ${!u.is_active && "text-red-800 bg-red-100"}`}>
                      {u.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <FiEdit
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(u);
                        }}
                      />
                      <FiTrash2
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(u.user_id);
                        }}
                      />
                    </div>
                  </td>
                </tr>

                {/* ================= EXTRA DETAILS ================= */}
                {expandedUserId === u.user_id && (
                  <tr>
                    <td colSpan="7" className="p-0 border-b">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-6">
                        {extraLoading ? (
                          <SkeletonLoader type="table" count={5} />
                        ) : extraDetails.length === 0 ? (
                          <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
                            <p className="text-gray-500">No traveler details found</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {extraDetails.map((d, idx) => (
                              <div key={d.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 flex justify-between items-center">
                                  <h4 className="text-white font-semibold text-sm">
                                    Traveler #{idx + 1}: {d.name} {d.surname}
                                  </h4>
                                </div>
                                
                                <div className="p-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Personal Information */}
                                    <div className="space-y-3">
                                      <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Personal Info</h5>
                                      <div className="space-y-2">
                                        <div><label className="text-xs text-gray-500">Full Name</label><p className="text-sm font-medium text-gray-900">{d.name} {d.surname}</p></div>
                                        <div><label className="text-xs text-gray-500">Mobile</label><p className="text-sm font-medium text-gray-900">{d.mobile || 'N/A'}</p></div>
                                        <div><label className="text-xs text-gray-500">Date of Birth</label><p className="text-sm font-medium text-gray-900">{d.dob || 'N/A'}</p></div>
                                        <div><label className="text-xs text-gray-500">Gender</label><p className="text-sm font-medium text-gray-900">{d.gender || 'N/A'}</p></div>
                                        <div><label className="text-xs text-gray-500">Nationality</label><p className="text-sm font-medium text-gray-900">{d.nationality || 'N/A'}</p></div>
                                      </div>
                                    </div>
                                    {/* Passport Information */}
                                    <div className="space-y-3">
                                      <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Passport Details</h5>
                                      <div className="space-y-2">
                                        <div><label className="text-xs text-gray-500">Passport Number</label><p className="text-sm font-medium text-gray-900">{d.passportno || 'N/A'}</p></div>
                                        <div><label className="text-xs text-gray-500">Issued By</label><p className="text-sm font-medium text-gray-900">{d.issuedby || 'N/A'}</p></div>
                                        <div><label className="text-xs text-gray-500">Date of Issue</label><p className="text-sm font-medium text-gray-900">{d.dateofissued || 'N/A'}</p></div>
                                        <div><label className="text-xs text-gray-500">Date of Expiry</label><p className="text-sm font-medium text-gray-900">{d.dateofexpired || 'N/A'}</p></div>
                                      </div>
                                    </div>
                                    {/* Tour & Documents */}
                                    <div className="space-y-3">
                                      <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Tour & Documents</h5>
                                      <div className="space-y-2">
                                        <div><label className="text-xs text-gray-500">Tour Code</label><p className="text-sm font-medium text-indigo-600">{d.tour_code || 'N/A'}</p></div>
                                        <div><label className="text-xs text-gray-500">Created At</label><p className="text-sm font-medium text-gray-900">{new Date(d.created_at).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}</p></div>
                                      </div>
                                      {/* Document Links */}
                                      <div className="pt-3 space-y-2">
                                        <label className="text-xs text-gray-500 block">Documents</label>
                                        <div className="grid grid-cols-2 gap-2">
                                          {d.passport_image_url && (<button onClick={() => setViewImg(d.passport_image_url)} className="flex items-center justify-center gap-1 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-xs font-medium"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>Passport</button>)}
                                          {d.aadhar_front_url && (<button onClick={() => setViewImg(d.aadhar_front_url)} className="flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs font-medium"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>Aadhar Front</button>)}
                                          {d.aadhar_back_url && (<button onClick={() => setViewImg(d.aadhar_back_url)} className="flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs font-medium"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>Aadhar Back</button>)}
                                          {d.pancard_url && (<button onClick={() => setViewImg(d.pancard_url)} className="flex items-center justify-center gap-1 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-xs font-medium"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>PAN</button>)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
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
            {/* <span className="text-sm text-gray-600">Page</span> */}
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
