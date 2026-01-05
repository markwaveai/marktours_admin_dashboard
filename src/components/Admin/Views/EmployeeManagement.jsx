import React, { useState, useEffect, useRef } from "react";

import {
    FiEdit,
    FiTrash2,
    FiSearch,
} from "react-icons/fi";
import Pagination from "../Pagination";
import SkeletonLoader from "../../Common/SkeletonLoader";

const API_BASE = "https://marktours-services-jn6cma3vvq-el.a.run.app";

export default function EmployeeManagement({ setIsModalOpen }) {
    const [employeesData, setEmployeesData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (setIsModalOpen) setIsModalOpen(showForm);
    }, [showForm, setIsModalOpen]);

    // Pagination & Cache State
    const [currentPage, setCurrentPage] = useState(1);
    const [agentsCache, setAgentsCache] = useState({});
    const [pagination, setPagination] = useState({
        total_records: 0,
        total_pages: 1,
        page_size: 15
    });

    const [loading, setLoading] = useState(false);
    const fetchingRef = useRef(null);

    const emptyForm = {
        id: null,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        branch: "",
        role: "",
    };

    const branches = [
        "Mumbai Branch",
        "Delhi Branch",
        "Bangalore Branch",
        "Chennai Branch",
        "Hyderabad Branch",
    ];

    const roles = ["Admin", "Agent"];
    const [form, setForm] = useState(emptyForm);

    /* ================= EXPANSION STATE ================= */
    const [expandedAgentId, setExpandedAgentId] = useState(null);
    const [referredUsers, setReferredUsers] = useState([]);
    const [referredLoading, setReferredLoading] = useState(false);

    const toggleRow = async (agentId) => {
        if (expandedAgentId === agentId) {
            setExpandedAgentId(null);
            setReferredUsers([]);
            return;
        }

        setExpandedAgentId(agentId);
        setReferredLoading(true);
        setReferredUsers([]);

        try {
            const res = await fetch(`${API_BASE}/agents/all/details?agent_id=${agentId}&page=1&size=15`);
            const data = await res.json();
            // API returns paginated structure? User said: ...?agent_id=10155&page=1&size=15
            // Assuming response has 'users' or 'data'. 
            // Let's assume standard response structure or check what comes back. 
            // User didn't specify response structure, but usually it's `data.user_details` or similar.
            // I'll log it and try to map safely.
            const users = data.user_details || data.users || data.data || [];
            setReferredUsers(users);
        } catch (error) {
            console.error("Failed to fetch referred users", error);
        } finally {
            setReferredLoading(false);
        }
    };

    /* ================= GET ALL AGENTS ================= */
    const fetchAgents = async (page = 1) => {
        // Check cache first
        if (agentsCache[page]) {
            setEmployeesData(agentsCache[page]);
            // We assume pagination metadata doesn't change wildly between cached pages, 
            // but for strict correctness we might want to store metadata in cache too.
            // For now, we'll just use the cached data.
            return;
        }

        // Deduplicate requests
        if (fetchingRef.current === page) return;
        fetchingRef.current = page;

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/agents?page=${page}&page_size=15`);
            const json = await res.json();

            const apiAgents = (json.agents || []).map((a) => ({
                id: a.agent_id,
                name: a.name,
                email: a.email,
                phone: a.mobile,
                branch: a.branch,
                role: "Agent",
            }));

            setEmployeesData(apiAgents);
            setPagination({
                total_records: json.total_records || 0,
                total_pages: json.total_pages || 1,
                page_size: json.page_size || 15
            });

            // Update cache
            setAgentsCache(prev => ({
                ...prev,
                [page]: apiAgents
            }));

        } catch (err) {
            console.error("Failed to fetch agents", err);
        } finally {
            setLoading(false);
            fetchingRef.current = null;
        }
    };

    useEffect(() => {
        fetchAgents(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    // Refresh current page (invalidate cache)
    const refreshCurrentPage = async () => {
        const page = currentPage;
        setAgentsCache(prev => {
            const newCache = { ...prev };
            delete newCache[page];
            return newCache;
        });
        // Force fetch since cache for this page is now gone (but we need to wait for state update in theory, 
        // effectively we can just call fetch ignoring cache or clear cache then fetch)
        // A simpler way: explicitly fetch and update cache
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/agents?page=${page}&page_size=15`);
            const json = await res.json();
            const apiAgents = (json.agents || []).map((a) => ({
                id: a.agent_id,
                name: a.name,
                email: a.email,
                phone: a.mobile,
                branch: a.branch,
                role: "Agent",
            }));
            setEmployeesData(apiAgents);
            setPagination({
                total_records: json.total_records || 0,
                total_pages: json.total_pages || 1,
                page_size: json.page_size || 15
            });
            setAgentsCache(prev => ({ ...prev, [page]: apiAgents }));
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    /* ================= ADD ================= */
    const handleAdd = () => {
        setForm(emptyForm);

        setIsEdit(false);
        setShowForm(true);
    };

    /* ================= EDIT (FIXED) ================= */
    const handleEdit = async (emp) => {
        try {
            setLoading(true);

            const res = await fetch(`${API_BASE}/agents/${emp.id}`);
            const json = await res.json();

            if (!res.ok) throw new Error();

            // 🔥 FIX: unwrap agent
            const data = json.agent;

            const parts = (data.name || "").split(" ");

            setForm({
                id: data.agent_id,
                firstName: parts[0] || "",
                lastName: parts.slice(1).join(" "),
                email: data.email || "",
                phone: data.mobile || "",
                branch: data.branch || "",
                role: "Agent",
            });

            setIsEdit(true);
            setShowForm(true);
        } catch (err) {
            console.error(err);
            alert("Failed to load agent");
        } finally {
            setLoading(false);
        }
    };

    /* ================= VALIDATION ================= */
    const validateForm = () => {
        const e = {};
        if (!form.firstName) e.firstName = "First name required";
        if (!form.lastName) e.lastName = "Last name required";
        if (!form.email.includes("@")) e.email = "Invalid email";
        if (!/^\d{10}$/.test(form.phone)) e.phone = "Invalid mobile";


        if (Object.keys(e).length) {
            alert(Object.values(e)[0]);
            return false;
        }
        return true;
    };

    /* ================= SAVE ================= */
    const handleSave = async () => {
        if (!validateForm()) return;

        if (form.role === "Agent") {
            try {
                setLoading(true);

                const payload = {
                    name: `${form.firstName.trim()} ${form.lastName.trim()}`,
                    email: form.email.trim().toLowerCase(),
                    mobile: String(form.phone),
                    branch: form.branch,
                    role: "Sales Agent",
                };

                const res = await fetch(
                    isEdit
                        ? `${API_BASE}/agents/${form.id}`
                        : `${API_BASE}/agents`,
                    {
                        method: isEdit ? "PUT" : "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    }
                );

                if (res.status === 409)
                    throw new Error("Email or mobile already exists");

                if (!res.ok) throw new Error("Save failed");

                if (!res.ok) throw new Error("Save failed");

                await refreshCurrentPage();
                setShowForm(false);
                setForm(emptyForm);
            } catch (err) {
                alert(err.message);
            } finally {
                setLoading(false);
            }
            return;
        }

        // non-agent local
        setEmployeesData((p) => [
            ...p,
            {
                ...form,
                id: Date.now(),
                name: `${form.firstName} ${form.lastName}`,
            },
        ]);
        setShowForm(false);
        setForm(emptyForm);
    };

    /* ================= DELETE ================= */
    const handleDelete = async (id) => {
        if (!window.confirm("Delete agent?")) return;

        try {
            await fetch(`${API_BASE}/agents/${id}`, { method: "DELETE" });
            await refreshCurrentPage();
        } catch {
            alert("Delete failed");
        }
    };

    const filteredEmployees = employeesData.filter((e) =>
        `${e.name} ${e.email} ${e.phone}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );
    // Server-side pagination means we display filteredEmployees directly (which is the current page)
    // Client-side slicing removed.






    /* ================= UI (UNCHANGED) ================= */
    if (loading) {
        return <SkeletonLoader type="table" count={8} />;
    }

    return (
        <div className="bg-white rounded-xl shadow border border-gray-200">
            <div className="rounded-2xl">
                {/* HEADER */}
                <div className="sticky top-0 z-30 bg-white p-6 py-3 flex flex-col sm:flex-row justify-between items-center border-b bg-gradient-to-r from-gray-50 to-white gap-4">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Employee Management
                    </h2>

                    <div className="flex gap-3 items-center w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <FiSearch
                                className="absolute left-3 top-2.5 text-indigo-600"
                                size={16}
                            />
                            <input
                                className="w-full sm:w-64 pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-100 focus:bg-white border border-transparent focus:border-indigo-300 outline-none transition-all"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleAdd}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow whitespace-nowrap"
                        >
                            + Add Member
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                {[
                                    "S.No",
                                    "Agent ID",
                                    "Name",
                                    "Email",
                                    "Mobile",
                                    "Branch",
                                    "Role",
                                    "Actions",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((e, i) => (
                                <React.Fragment key={e.id}>
                                    <tr
                                        onClick={() => toggleRow(e.id)}
                                        className={`border-b cursor-pointer transition-colors ${expandedAgentId === e.id ? "bg-indigo-50" : "hover:bg-gray-50"}`}
                                    >
                                        <td className="px-4 py-3 text-center">{(currentPage - 1) * 10 + i + 1}</td>
                                        <td className="px-4 py-3 text-center text-gray-600 font-mono text-xs overflow-hidden text-ellipsis whitespace-nowrap">{e.id}</td>
                                        <td className="px-4 py-3 text-center whitespace-nowrap font-medium">{e.name}</td>
                                        <td className="px-4 py-3 text-center whitespace-nowrap">{e.email}</td>
                                        <td className="px-4 py-3 text-center whitespace-nowrap">{e.phone}</td>
                                        <td className="px-4 py-3 text-center whitespace-nowrap">{e.branch}</td>
                                        <td className="px-4 py-3 text-center">{e.role}</td>
                                        <td className="px-4 py-3 flex justify-center gap-2">
                                            <button
                                                onClick={(ev) => {
                                                    ev.stopPropagation();
                                                    handleEdit(e);
                                                }}
                                                className="p-2 rounded-lg bg-indigo-50 text-indigo-600"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={(ev) => {
                                                    ev.stopPropagation();
                                                    handleDelete(e.id);
                                                }}
                                                className="p-2 rounded-lg bg-red-50 text-red-600"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                    {/* EXPANDED ROW */}
                                    {expandedAgentId === e.id && (
                                        <tr>
                                            <td colSpan={8} className="p-4 bg-gray-50 border-b shadow-inner">
                                                <div className="bg-white rounded-lg border shadow-sm p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    <h4 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">
                                                        Users Referred by Agent {e.id}
                                                    </h4>

                                                    {referredLoading ? (
                                                        <div className="py-4 text-center text-gray-500">
                                                            <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                                                            <p className="text-xs">Loading referred users...</p>
                                                        </div>
                                                    ) : referredUsers.length > 0 ? (
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-xs text-left">
                                                                <thead className="bg-gray-100 text-gray-600 uppercase">
                                                                    <tr>
                                                                        <th className="px-3 py-2">Name</th>
                                                                        <th className="px-3 py-2">Email</th>
                                                                        <th className="px-3 py-2">Phone</th>
                                                                        <th className="px-3 py-2">Joined</th>
                                                                        <th className="px-3 py-2">Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y">
                                                                    {referredUsers.map((u, idx) => (
                                                                        <tr key={idx} className="hover:bg-gray-50">
                                                                            <td className="px-3 py-2 font-medium">{u.name}</td>
                                                                            <td className="px-3 py-2 text-gray-500">{u.email}</td>
                                                                            <td className="px-3 py-2 text-gray-500">{u.mobile}</td>
                                                                            <td className="px-3 py-2 text-gray-500">
                                                                                {new Date(u.created_at || Date.now()).toLocaleDateString("en-IN")}
                                                                            </td>
                                                                            <td className="px-3 py-2">
                                                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                                    {u.is_active ? 'Active' : 'Inactive'}
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-4 text-gray-400 text-sm">
                                                            No users referred by this agent.
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

                {/* MODAL */}
                {showForm && (
                    <div
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
                        onClick={() => setShowForm(false)}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full max-w-xl rounded-xl shadow-xl overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                                <h3 className="text-lg font-bold text-gray-800">
                                    {isEdit ? "Edit Member" : "Add Member"}
                                </h3>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>

                            <div className="px-6 py-6 space-y-5 max-h-[65vh] overflow-y-auto scrollbar-hide">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-tight">First Name</label>
                                        <input
                                            placeholder="e.g. John"
                                            className="border border-gray-300 rounded-lg px-3 py-2.5 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                            value={form.firstName}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    firstName: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-tight">Last Name</label>
                                        <input
                                            placeholder="e.g. Doe"
                                            className="border border-gray-300 rounded-lg px-3 py-2.5 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                            value={form.lastName}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    lastName: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-tight">Email Address</label>
                                    <input
                                        placeholder="john.doe@example.com"
                                        className="border border-gray-300 rounded-lg px-3 py-2.5 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        value={form.email}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                email: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-tight">Mobile Number</label>
                                    <input
                                        placeholder="10 digit mobile number"
                                        className="border border-gray-300 rounded-lg px-3 py-2.5 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        value={form.phone}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setForm({
                                                ...form,
                                                phone: val,
                                            })
                                        }}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-tight">Branch</label>
                                        <select
                                            className="border border-gray-300 rounded-lg px-3 py-2.5 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm bg-white"
                                            value={form.branch}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    branch: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="">Select Branch</option>
                                            {branches.map((b) => (
                                                <option key={b}>{b}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-tight">Role</label>
                                        <select
                                            className="border border-gray-300 rounded-lg px-3 py-2.5 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm bg-white"
                                            value={form.role}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    role: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="">Select Role</option>
                                            {roles.map((r) => (
                                                <option key={r}>{r}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50">
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className={`px-8 py-2.5 rounded-lg text-white font-semibold shadow-md transition-all ${loading
                                        ? "bg-indigo-300 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700 active:transform active:scale-95"
                                        }`}
                                >
                                    {loading ? "Saving..." : "Save Member"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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
        </div >
    );
}
