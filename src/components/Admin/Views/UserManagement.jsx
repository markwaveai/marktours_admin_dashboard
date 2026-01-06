import React, { useEffect, useState, useRef } from "react";
import { FiEdit, FiTrash2, FiSearch, FiX, FiEye, FiEyeOff, FiCopy, FiCheck, FiLoader } from "react-icons/fi";
import Pagination from "../Pagination";
import SkeletonLoader from "../../Common/SkeletonLoader";
import { useToast } from "../../../context/ToastContext";
import { useConfirm } from "../../../context/ConfirmContext";

const BASE_URL = "https://marktours-services-jn6cma3vvq-el.a.run.app";
const AGENT_ID = 10001;

const maskMobile = (mobile) => {
  if (!mobile) return "N/A";
  const str = String(mobile);
  if (str.length <= 4) return str;
  return "*".repeat(Math.max(0, str.length - 4)) + str.slice(-4);
};

// export default function UserManagement() {
export default function UserManagement({ setIsModalOpen }) {
  const { addToast } = useToast();
  const confirm = useConfirm();
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

  const [copiedId, setCopiedId] = useState(null); // 'ID-FIELD_NAME'

  const copyToClipboard = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    // addToast("Copied to clipboard!", "success"); // Optional if we have the tick
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Local state for pagination input
  const [pageInput, setPageInput] = useState(1);
  useEffect(() => {
    setPageInput(currentPage);
  }, [currentPage]);

  const [usersData, setUsersData] = useState([]);
  const [search, setSearch] = useState("");

  const [expandedUserId, setExpandedUserId] = useState(null);
  const [extraDetails, setExtraDetails] = useState([]);
  const [extraLoading, setExtraLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [originalUser, setOriginalUser] = useState(null);

  // Tab State
  const [activeTab] = useState("User Management");
  useEffect(() => {
    if (setIsModalOpen) setIsModalOpen(showForm);
  }, [showForm, setIsModalOpen]);

  // Agent Search State
  const [agentsList, setAgentsList] = useState([]);
  const [showAgentSuggestions, setShowAgentSuggestions] = useState(false);

  // Extra Details Management State
  const [showExtraForm, setShowExtraForm] = useState(false);
  const [originalExtraDetail, setOriginalExtraDetail] = useState(null);
  const [visibleTravellerMobiles, setVisibleTravellerMobiles] = useState({}); // { [id]: boolean }

  const toggleTravellerMobile = (id) => {
    setVisibleTravellerMobiles(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const emptyExtraForm = {
    user_id: null,
    mobile: "",
    is_passport_available: false,
    name: "",
    surname: "", // Used in JSX, potentially part of Name or separate
    dob: "",
    nationality: "",
    gender: "",
    passportno: "",
    dateofissued: "",
    dateofexpired: "",
    tour_code: "",
    issuedby: "",
    passport_image_url: "",
    aadhar_front_url: "",
    aadhar_back_url: "",
    pancard_url: "",
    relationship: "",
    is_primary: false,
    isagreed: false
  };
  const [extraForm, setExtraForm] = useState(emptyExtraForm);

  useEffect(() => {
    const fetchAgents = async () => {
      // Check session storage first
      const cachedAgents = sessionStorage.getItem("agentsList");
      if (cachedAgents) {
        setAgentsList(JSON.parse(cachedAgents));
      }

      try {
        const res = await fetch(`${BASE_URL}/agents`);
        const data = await res.json();
        if (data.agents) {
          sessionStorage.setItem("agentsList", JSON.stringify(data.agents));
          setAgentsList(data.agents);
        }
      } catch (e) { console.error("Failed to fetch agents", e); }
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
    dob: new Date().toISOString().split("T")[0],
    pincode: "",
    express_needs: "",
    first_name: "",
    last_name: ""
  };

  const [form, setForm] = useState(emptyForm);
  const [viewImg, setViewImg] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);

  // Branch Suggestions
  const [showBranchSuggestions, setShowBranchSuggestions] = useState(false);
  const uniqueBranches = ["Mumbai Branch", "Delhi Branch", "Chennai Branch", "Hyderabad Branch"];

  useEffect(() => {
    if (viewImg) {
      // Image viewing logic if needed
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
      const res = await fetch(`${BASE_URL}/user-details/user-tour-summary?is_active=true&page=${page}&size=15`);
      const data = await res.json();

      if (data.data) {
        setUsersData(data.data || []);
        setPagination({
          total_records: data.total_records || data.pagination?.total_records || 0,
          total_pages: data.total_pages || data.pagination?.total_pages || 1,
          page_size: 15
        });

        // Update cache
        setUsersCache(prev => ({
          ...prev,
          [page]: data.data || []
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
      const res = await fetch(`${BASE_URL}/user-details/user-tour-summary?is_active=true&page=${page}&size=15`);
      const data = await res.json();
      if (data.data) {
        setUsersData(data.data || []);
        setPagination({
          total_records: data.total_records || data.pagination?.total_records || 0,
          total_pages: data.total_pages || data.pagination?.total_pages || 1,
          page_size: 15
        });
        setUsersCache(prev => ({
          ...prev,
          [page]: data.data || []
        }));
      }
    } catch (error) {
      console.error("Failed to refresh users", error);
    }
  };

  /* ================= FILTER LOGIC ================= */
  const filteredUsers = usersData.filter((u) => {
    const s = search.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(s)) ||
      (u.email && u.email.toLowerCase().includes(s)) ||
      (u.mobile && String(u.mobile).includes(s))
    );
  });

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
    setShowForm(true);
  };

  /* ================= EDIT USER ================= */
  const handleEdit = (u) => {
    setOriginalUser(u);
    const names = (u.name || "").split(" ");
    const fName = names[0] || "";
    const lName = names.slice(1).join(" ") || "";

    setForm({
      ...u,
      first_name: fName,
      last_name: lName,
      agent_id: u.agent_id || "",
      dob: u.dob || "",
      pincode: u.pincode || "",
      express_needs: u.express_needs || ""
    });
    setShowForm(true);
  };

  /* ================= SAVE USER ================= */
  const handleSave = async () => {
    const isEdit = Boolean(originalUser);
    const url = isEdit
      ? `${BASE_URL}/user-details/${originalUser.user_id}`
      : `${BASE_URL}/user-details`;

    // Validate
    if (!form.email || !form.email.includes("@")) {
      addToast("Please enter a valid email address.", "error");
      return;
    }
    if (!form.mobile || String(form.mobile).length !== 10) {
      addToast("Mobile number must be exactly 10 digits.", "error");
      return;
    }

    // Ensure agent_id is used from form if set, cast to Number
    // Combine names
    const fullName = `${form.first_name || ""} ${form.last_name || ""}`.trim() || form.name;

    const payload = {
      ...form,
      name: fullName,
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
        addToast(`Save failed: ${res.status} - ${errText || res.statusText}`, "error");
        return;
      }

      await refreshCurrentPage();
      setShowForm(false);
      addToast(isEdit ? "User updated successfully" : "User created successfully", "success");
    } catch (error) {
      console.error("Save operation failed", error);
      addToast("An error occurred while saving user data.", "error");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: "Delete User?",
      message: "Are you sure you want to delete this user? All associated data will be removed.",
      confirmText: "Delete",
      type: "danger"
    });

    if (!isConfirmed) return;
    try {
      await fetch(`${BASE_URL}/user-details/${id}`, { method: "DELETE" });
      addToast("User deleted successfully", "success");
      refreshCurrentPage();
    } catch (error) {
      addToast("Delete failed", "error");
    }
  };

  /* ================= EXTRA DETAILS HELPERS ================= */
  const fetchExtraDetails = async (userId) => {
    setExtraLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/user-extra-details/${userId}`);
      const data = await res.json();
      setExtraDetails(data.user_extra_details || []);
    } catch (e) {
      console.error("Failed to fetch extra details", e);
    } finally {
      setExtraLoading(false);
    }
  };

  const handleExtraEdit = (d) => {
    setOriginalExtraDetail(d);
    setExtraForm({ ...emptyExtraForm, ...d });
    setShowExtraForm(true);
  };

  const handleExtraDelete = async (detailId, userId) => {
    const isConfirmed = await confirm({
      title: "Delete Traveller?",
      message: "Are you sure you want to delete this traveller entry?",
      confirmText: "Delete",
      type: "danger"
    });

    if (!isConfirmed) return;
    try {
      const res = await fetch(`${BASE_URL}/user-extra-details/${detailId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        addToast("Traveller entry deleted", "success");
        fetchExtraDetails(userId);
      } else {
        addToast("Delete failed", "error");
      }
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const handleExtraSave = async () => {
    if (!originalExtraDetail) return;
    if (extraForm.mobile && extraForm.mobile.length !== 10) {
      addToast("Mobile number must be exactly 10 digits.", "error");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/user-extra-details/detail/${originalExtraDetail.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extraForm)
      });
      if (res.ok) {
        setShowExtraForm(false);
        addToast("Traveller details updated", "success");
        fetchExtraDetails(originalExtraDetail.user_id);
      } else {
        const err = await res.text();
        addToast(`Update failed: ${err}`, "error");
      }
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  // ...

  if (loading) {
    return <SkeletonLoader type="table" count={8} />;
  }

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200">

      {/* ================= ADD / EDIT MODAL ================= */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white w-full max-w-[420px] rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">
                {originalUser ? "Edit User" : "Add User"}
              </h3>
              <button onClick={() => setShowForm(false)}>
                <FiX />
              </button>
            </div>

            {/* Agent ID with Suggestions */}
            <div className="mb-3 relative">
              <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wide font-semibold">Agent ID</label>
              <input
                type="text"
                placeholder="Enter or Select Agent ID"
                value={form.agent_id}
                onChange={(e) => {
                  setForm({ ...form, agent_id: e.target.value });
                  setShowAgentSuggestions(true);
                }}
                onFocus={() => setShowAgentSuggestions(true)}
                onBlur={() => setTimeout(() => setShowAgentSuggestions(false), 200)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              />
              {showAgentSuggestions && (
                <ul className="absolute z-50 bg-white border border-gray-200 w-full max-h-48 overflow-y-auto rounded-md shadow-lg mt-1">
                  {agentsList
                    .filter((agent) =>
                      String(agent.agent_id).includes(form.agent_id) ||
                      agent.name.toLowerCase().includes(String(form.agent_id).toLowerCase())
                    )
                    .map((agent) => (
                      <li
                        key={agent.agent_id}
                        className="px-3 py-2 text-sm hover:bg-indigo-50 cursor-pointer text-gray-700"
                        onClick={() => setForm({ ...form, agent_id: agent.agent_id })}
                      >
                        <span className="font-semibold text-indigo-600">{agent.agent_id}</span> - {agent.name}
                      </li>
                    ))}
                  {agentsList.length === 0 && (
                    <li className="px-3 py-2 text-sm text-gray-400">No agents found</li>
                  )}
                </ul>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wide font-semibold">First Name</label>
                <input
                  placeholder="First Name"
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wide font-semibold">Last Name</label>
                <input
                  placeholder="Last Name"
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wide font-semibold">Email</label>
              <input
                type="email"
                placeholder="example@mail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Mobile & Branch */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wide font-semibold">Mobile</label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="10 digits only"
                  value={form.mobile}
                  readOnly={!!originalUser}
                  onChange={(e) => {
                    if (originalUser) return;
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setForm({ ...form, mobile: val });
                  }}
                  className={`w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all ${originalUser ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""}`}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wide font-semibold">Branch</label>
                <div className="relative">
                  <input
                    placeholder="Branch Name"
                    value={form.branch}
                    onChange={(e) => {
                      setForm({ ...form, branch: e.target.value });
                      setShowBranchSuggestions(true);
                    }}
                    onFocus={() => setShowBranchSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowBranchSuggestions(false), 200)}
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                  />
                  {showBranchSuggestions && (
                    <ul className="absolute z-50 bg-white border border-gray-200 w-full max-h-48 overflow-y-auto rounded-md shadow-lg mt-1">
                      {uniqueBranches
                        .filter((b) => b.toLowerCase().includes((form.branch || "").toLowerCase()))
                        .map((b, i) => (
                          <li
                            key={i}
                            className="px-3 py-2 text-sm hover:bg-indigo-50 cursor-pointer text-gray-700"
                            onClick={() => setForm({ ...form, branch: b })}
                          >
                            {b}
                          </li>
                        ))}
                      {uniqueBranches.filter((b) => b.toLowerCase().includes((form.branch || "").toLowerCase())).length === 0 && (
                        <li className="px-3 py-2 text-sm text-gray-400">No branches found</li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wide font-semibold">Address</label>
              <input
                placeholder="Full Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wide font-semibold">Date of Birth</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Date of Birth"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wide font-semibold">Pincode</label>
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d{0,6}$/.test(val)) {
                      setForm({ ...form, pincode: val });
                    }
                  }}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
              >
                Save User
              </button>
            </div>
          </div>
        </div>
      )}
      {showExtraForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-24 pb-12 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-8 border border-gray-100 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-gray-900">
                Edit Traveller Details
              </h3>
              <button onClick={() => setShowExtraForm(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FiX size={24} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
              {/* Personal Info Grid */}
              <div className="grid grid-cols-2 gap-6">
                {["name", "surname", "mobile", "dob", "nationality", "gender", "relationship"].map((f) => (
                  <div key={f} className={f === 'relationship' ? 'md:col-span-2' : ''}>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">{f.replace('_', ' ')}</label>
                    <input
                      type={f === 'dob' ? 'date' : 'text'}
                      placeholder={`Enter ${f}...`}
                      value={extraForm[f]}
                      readOnly={f === 'mobile'}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (f === "mobile") return;
                        setExtraForm({ ...extraForm, [f]: val });
                      }}
                      className={`w-full border-gray-200 border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-sm ${f === 'mobile' ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""}`}
                    />
                  </div>
                ))}
              </div>

              {/* Passport Details Grid */}
              <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
                <h5 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Passport Details</h5>
                <div className="grid grid-cols-2 gap-6">
                  {["passportno", "issuedby", "dateofissued", "dateofexpired", "tour_code"].map((f) => (
                    <div key={f} className={f === 'tour_code' ? 'md:col-span-2' : ''}>
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">{f.replace('dateof', 'date of ')}</label>
                      <input
                        type={f.includes('date') ? 'date' : 'text'}
                        placeholder={`Enter ${f}...`}
                        value={extraForm[f]}
                        onChange={(e) => setExtraForm({ ...extraForm, [f]: e.target.value })}
                        className="w-full bg-white border-gray-200 border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Document URLs */}
              <div className="space-y-6 pb-4">
                <h5 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Document Links</h5>
                <div className="grid grid-cols-1 gap-6">
                  {["passport_image_url", "aadhar_front_url", "aadhar_back_url", "pancard_url"].map((f) => (
                    <div key={f}>
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">{f.replace(/_/g, ' ')}</label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={extraForm[f]}
                        onChange={(e) => setExtraForm({ ...extraForm, [f]: e.target.value })}
                        className="w-full border-gray-200 border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-sm placeholder:text-gray-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-4">
              <button
                onClick={() => setShowExtraForm(false)}
                className="px-8 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleExtraSave}
                className="px-12 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "User Management" ? (
        <div className="flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-white p-6 py-3 flex flex-col sm:flex-row justify-between items-center border-b bg-gradient-to-r from-gray-50 to-white gap-4">
            <h2 className="text-lg font-bold text-gray-900">Traveller Assessment</h2>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <FiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
                  size={16}
                />
                <input
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-gray-50 focus:bg-white border border-transparent focus:border-indigo-300 outline-none transition-all"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={handleAddUser}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow transition-all whitespace-nowrap flex items-center gap-2"
              >
                + Add User
              </button>
            </div>
          </div>

          {/* ================= TABLE WRAPPER ================= */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100/50 border-b">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">S.No</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Agent ID</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Name</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Email</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Mobile</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Branch</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase min-w-[200px]">Tour Name</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase min-w-[100px]">Tour Code</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase min-w-[100px]">EMI / Month</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase min-w-[100px]">Paid</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase min-w-[100px]">Remaining</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase min-w-[100px]">Booking Status</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase min-w-[100px]">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase min-w-[100px]">Actions</th>
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
                      <td className="px-4 py-3 text-center font-mono text-gray-600">{u.agent_id || "N/A"}</td>
                      <td className="px-4 py-3 text-center">{u.name}</td>
                      <td className="px-4 py-3 text-center">{u.email}</td>
                      <td className="px-4 py-3 text-center">{u.mobile}</td>
                      <td className="px-4 py-3 text-center">{u.branch}</td>
                      <td className="px-4 py-3 text-center">{u.tour_name || "-"}</td>
                      <td className="px-4 py-3 text-center">{u.tour_code || "-"}</td>
                      <td className="px-4 py-3 text-center">{u.emi_per_month || 0}</td>
                      <td className="px-4 py-3 text-center text-green-600 font-medium">{u.amount_paid || 0}</td>
                      <td className="px-4 py-3 text-center text-red-500 font-medium">{u.amount_remaining || 0}</td>
                      <td className="px-4 py-3 text-center">
                         <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${u.booking_status === 'Confirmed' ? 'text-green-800 bg-green-100' : 'text-yellow-800 bg-yellow-100'}`}>
                            {u.booking_status || "Pending"}
                         </span>
                      </td>
                      <td className="px-4 py-3 text-center bg-gray-50">
                        <span className={`inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full
                      ${!u.is_active && "text-red-800 bg-red-100"}`}>
                          {u.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(u);
                            }}
                            className="p-1.5 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit User"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(u.user_id);
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 transition-colors"
                            title="Delete User"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* ================= EXTRA DETAILS ================= */}
                    {expandedUserId === u.user_id && (
                      <tr>
                        <td colSpan="14" className="p-0 border-b">
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
                                    {/* Traveller Card Header */}
                                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 flex justify-between items-center">
                                      <h4 className="text-white font-semibold text-sm">
                                        Traveler #{idx + 1}: {d.name} {d.surname}
                                      </h4>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => handleExtraEdit(d)}
                                          className="p-1.5 bg-blue-100 text-blue-700 hover:bg-white transition-colors rounded-lg shadow-sm"
                                          title="Edit Traveller"
                                        >
                                          <FiEdit size={14} />
                                        </button>
                                        <button
                                          onClick={() => handleExtraDelete(d.id, u.user_id)}
                                          className="p-1.5 bg-red-100 text-red-700 hover:bg-white transition-colors rounded-lg shadow-sm"
                                          title="Delete Traveller"
                                        >
                                          <FiTrash2 size={14} />
                                        </button>
                                      </div>
                                    </div>

                                    <div className="p-6">
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* Personal Information */}
                                        <div className="space-y-3">
                                          <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Personal Info</h5>
                                          <div className="space-y-2">
                                            <div><label className="text-xs text-gray-500">Full Name</label><p className="text-sm font-medium text-gray-900">{d.name} {d.surname}</p></div>
                                            <div>
                                              <label className="text-xs text-gray-500">Mobile</label>
                                              <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-gray-900">
                                                  {visibleTravellerMobiles[d.id] ? d.mobile : maskMobile(d.mobile)}
                                                </p>
                                                <button
                                                  onClick={() => toggleTravellerMobile(d.id)}
                                                  className="text-gray-400 hover:text-indigo-600 transition-colors"
                                                  title={visibleTravellerMobiles[d.id] ? "Hide Number" : "Show Number"}
                                                >
                                                  {visibleTravellerMobiles[d.id] ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                                                </button>
                                              </div>
                                            </div>
                                            <div><label className="text-xs text-gray-500">Date of Birth</label><p className="text-sm font-medium text-gray-900">{d.dob || 'N/A'}</p></div>
                                            <div><label className="text-xs text-gray-500">Gender</label><p className="text-sm font-medium text-gray-900">{d.gender || 'N/A'}</p></div>
                                            <div><label className="text-xs text-gray-500">Nationality</label><p className="text-sm font-medium text-gray-900">{d.nationality || 'N/A'}</p></div>
                                          </div>
                                        </div>
                                        {/* Passport Information */}
                                        <div className="space-y-3">
                                          <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Passport Details</h5>
                                          <div className="space-y-2">
                                            <div><label className="text-xs text-gray-500">Passport Number</label>
                                              <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-gray-900">{d.passportno || 'N/A'}</p>
                                                {d.passportno && (
                                                  <button
                                                    onClick={() => copyToClipboard(d.passportno, `${d.id}-passport`)}
                                                    className={`transition-colors ${copiedId === `${d.id}-passport` ? "text-green-600" : "text-gray-400 hover:text-indigo-600"}`}
                                                    title="Copy Passport Number"
                                                  >
                                                    {copiedId === `${d.id}-passport` ? <FiCheck size={14} /> : <FiCopy size={12} />}
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                            <div><label className="text-xs text-gray-500">Issued By</label><p className="text-sm font-medium text-gray-900">{d.issuedby || 'N/A'}</p></div>
                                            <div><label className="text-xs text-gray-500">Date of Issue</label><p className="text-sm font-medium text-gray-900">{d.dateofissued || 'N/A'}</p></div>
                                            <div><label className="text-xs text-gray-500">Date of Expiry</label><p className="text-sm font-medium text-gray-900">{d.dateofexpired || 'N/A'}</p></div>
                                          </div>
                                        </div>
                                        {/* Tour & Documents */}
                                        <div className="space-y-3">
                                          <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Tour & Documents</h5>
                                          <div className="space-y-2">
                                            <div><label className="text-xs text-gray-500">Tour Code</label>
                                              <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-indigo-600">{d.tour_code || 'N/A'}</p>
                                                {d.tour_code && (
                                                  <button
                                                    onClick={() => copyToClipboard(d.tour_code, `${d.id}-tour`)}
                                                    className={`transition-colors ${copiedId === `${d.id}-tour` ? "text-green-600" : "text-gray-400 hover:text-indigo-600"}`}
                                                    title="Copy Tour Code"
                                                  >
                                                    {copiedId === `${d.id}-tour` ? <FiCheck size={14} /> : <FiCopy size={12} />}
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                            <div><label className="text-xs text-gray-500">Created At</label><p className="text-sm font-medium text-gray-900">{new Date(d.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p></div>
                                          </div>
                                          {/* Document Links */}
                                          <div className="pt-3 space-y-2">
                                            <label className="text-xs text-gray-500 block">Documents</label>
                                            <div className="grid grid-cols-2 gap-2">
                                              {d.passport_image_url && (<button onClick={() => { setViewImg(d.passport_image_url); setImgLoading(true); }} className="flex items-center justify-center gap-1 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-xs font-medium"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>Passport</button>)}
                                              {d.aadhar_front_url && (<button onClick={() => { setViewImg(d.aadhar_front_url); setImgLoading(true); }} className="flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs font-medium"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>Aadhar Front</button>)}
                                              {d.aadhar_back_url && (<button onClick={() => { setViewImg(d.aadhar_back_url); setImgLoading(true); }} className="flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs font-medium"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>Aadhar Back</button>)}
                                              {d.pancard_url && (<button onClick={() => { setViewImg(d.pancard_url); setImgLoading(true); }} className="flex items-center justify-center gap-1 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-xs font-medium"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>PAN</button>)}
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
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onBlur={() => {
                    const val = parseInt(pageInput);
                    if (!isNaN(val) && val >= 1 && val <= pagination.total_pages) {
                      setCurrentPage(val);
                    } else {
                      setPageInput(currentPage);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = parseInt(pageInput);
                      if (!isNaN(val) && val >= 1 && val <= pagination.total_pages) {
                        setCurrentPage(val);
                      } else {
                        setPageInput(currentPage);
                      }
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
      ) : (
        /* ================= EMPLOYEE MANAGEMENT TAB ================= */
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">

          {/* ================= EXTRA DETAILS MODAL ================= */}
        </div>
      )}

      {/* Image Preview Modal */}
      {viewImg && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setViewImg(null)}>
          <div className="relative w-[40%] h-1/2 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all" onClick={e => e.stopPropagation()}>
            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={() => setViewImg(null)}
                className="bg-black/50 text-white hover:bg-black/70 rounded-full p-2 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="flex-1 w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
              {imgLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-0">
                  <FiLoader className="animate-spin text-indigo-600 mb-2" size={32} />
                  <p className="text-xs font-medium text-gray-400">Loading Image...</p>
                </div>
              )}
              <img
                src={viewImg}
                alt="Preview"
                onLoad={() => setImgLoading(false)}
                className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                onError={(e) => {
                  setImgLoading(false);
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="text-center p-4"> <p class="font-bold text-gray-500 mb-2">Preview Failed</p> <a href="' + viewImg + '" target="_blank" class="text-indigo-600 underline text-sm">Open in New Tab</a> </div>';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
