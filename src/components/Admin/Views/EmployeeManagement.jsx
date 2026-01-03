import { useState, useEffect } from "react";

import {
    FiEdit,
    FiTrash2,
    FiSearch,
    FiChevronDown,
    FiChevronUp,
} from "react-icons/fi";
import Pagination from "../Pagination";

const API_BASE = "https://marktours-services-jn6cma3vvq-el.a.run.app";

export default function EmployeeManagement() {
    const [employeesData, setEmployeesData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    const [loading, setLoading] = useState(false);

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

    /* ================= GET ALL AGENTS ================= */
    const fetchAgents = async (page = 1) => {
        try {
            const res = await fetch(`${API_BASE}/agents?page=${page}`);
            const json = await res.json();

            const apiAgents = json.agents.map((a) => ({
                id: a.agent_id,
                name: a.name,
                email: a.email,
                phone: a.mobile,
                branch: a.branch,
                role: "Agent",
            }));

            setEmployeesData(apiAgents);
            setTotalPages(json.total_pages || 1);
        } catch (err) {
            console.error("Failed to fetch agents", err);
        }
    };

    useEffect(() => {
        fetchAgents(currentPage);
    }, [currentPage]);

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

                await fetchAgents(currentPage);
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
            await fetchAgents(currentPage);
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
    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* HEADER */}
                <div className="p-6 py-3 flex justify-between items-center border-b bg-gradient-to-r from-gray-50 to-white">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Employee Management
                        </h2>
                        <p className="text-sm text-gray-500">
                            Manage employee records & roles
                        </p>
                    </div>

                    <div className="flex gap-3 items-center">
                        <div className="relative">
                            <FiSearch
                                className="absolute left-3 top-2.5 text-indigo-600"
                                size={16}
                            />
                            <input
                                className="pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-100 focus:bg-white border border-transparent focus:border-indigo-300 outline-none"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleAdd}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow"
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
                                <tr key={e.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 text-center">{(currentPage - 1) * 10 + i + 1}</td>
                                    <td className="px-4 py-3 text-center text-gray-600 font-mono text-xs">{e.id}</td>
                                    <td className="px-4 py-3 text-center">{e.name}</td>
                                    <td className="px-4 py-3 text-center">{e.email}</td>
                                    <td className="px-4 py-3 text-center">{e.phone}</td>
                                    <td className="px-4 py-3 text-center">{e.branch}</td>
                                    <td className="px-4 py-3 text-center">{e.role}</td>
                                    <td className="px-4 py-3 flex justify-center gap-2">
                                        <button
                                            onClick={() => handleEdit(e)}
                                            className="p-2 rounded-lg bg-indigo-50 text-indigo-600"
                                        >
                                            <FiEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(e.id)}
                                            className="p-2 rounded-lg bg-red-50 text-red-600"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
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

            <div className="flex justify-center">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div >
    );
}
