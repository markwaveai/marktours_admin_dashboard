import React, { useState, useEffect, useRef } from "react";

import {
    FiEdit,
    FiTrash2,
    FiSearch,
} from "react-icons/fi";
import Pagination from "../Pagination";
import SkeletonLoader from "../../Common/SkeletonLoader";

const API_BASE = "https://marktours-services-jn6cma3vvq-el.a.run.app";

export default function EmployeeManagement() {
    const [employeesData, setEmployeesData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [search, setSearch] = useState("");
    
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
        role: "Employee",
    };

    const branches = [
        "Mumbai Branch",
        "Delhi Branch",
        "Bangalore Branch",
        "Chennai Branch",
        "Hyderabad Branch",
    ];

    const roles = ["Admin", "Employee", "Agent", "User"];
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
        } catch(e) { console.error(e); } finally { setLoading(false); }
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
            <div className="rounded-2xl overflow-hidden">
                {/* HEADER */}
                <div className="p-6 py-3 flex flex-col sm:flex-row justify-between items-center border-b bg-gradient-to-r from-gray-50 to-white gap-4">
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
                <div className="overflow-x-auto">
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
                                        <td className="px-4 py-3 text-center text-gray-600 font-mono text-xs">{e.id}</td>
                                        <td className="px-4 py-3 text-center">{e.name}</td>
                                        <td className="px-4 py-3 text-center">{e.email}</td>
                                        <td className="px-4 py-3 text-center">{e.phone}</td>
                                        <td className="px-4 py-3 text-center">{e.branch}</td>
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
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                        onClick={() => setShowForm(false)}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full max-w-xl rounded-xl shadow-xl"
                        >
                            <div className="px-5 py-4 border-b flex justify-between">
                                <h3 className="text-lg font-bold">
                                    {isEdit ? "Edit Employee" : "Add Employee"}
                                </h3>
                                <button onClick={() => setShowForm(false)}>✕</button>
                            </div>

                            <div className="px-5 py-4 space-y-4">
                                <input
                                    placeholder="First Name"
                                    className="border rounded-lg px-3 py-2 w-full"
                                    value={form.firstName}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            firstName: e.target.value,
                                        })
                                    }
                                />
                                <input
                                    placeholder="Last Name"
                                    className="border rounded-lg px-3 py-2 w-full"
                                    value={form.lastName}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            lastName: e.target.value,
                                        })
                                    }
                                />
                                <input
                                    placeholder="Email"
                                    className="border rounded-lg px-3 py-2 w-full"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value,
                                        })
                                    }
                                />
                                <input
                                    placeholder="Mobile Number"
                                    className="border rounded-lg px-3 py-2 w-full"
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            phone: e.target.value,
                                        })
                                    }
                                />
                                <select
                                    className="border rounded-lg px-3 py-2 w-full"
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
                                <select
                                    className="border rounded-lg px-3 py-2 w-full"
                                    value={form.role}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            role: e.target.value,
                                        })
                                    }
                                >
                                    {roles.map((r) => (
                                        <option key={r}>{r}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="px-5 py-4 border-t flex justify-end gap-3">
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 bg-gray-200 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className={`px-6 py-2 rounded-lg text-white ${loading
                                        ? "bg-indigo-300"
                                        : "bg-indigo-600"
                                        }`}
                                >
                                    {loading ? "Saving..." : "Save"}
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
