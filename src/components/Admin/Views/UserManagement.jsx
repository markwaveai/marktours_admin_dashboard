import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiSearch, FiX } from "react-icons/fi";

const BASE_URL = "https://marktours-services-jn6cma3vvq-el.a.run.app";
const AGENT_ID = 10001;

export default function UserManagement() {
  const [usersData, setUsersData] = useState([]);
  const [search, setSearch] = useState("");

  const [expandedUserId, setExpandedUserId] = useState(null);
  const [extraDetails, setExtraDetails] = useState([]);
  const [extraLoading, setExtraLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [originalUser, setOriginalUser] = useState(null);

  const emptyForm = {
    user_id: null,
    name: "",
    email: "",
    mobile: "",
    branch: "",
    address: "",
    is_active: true,
  };

  const [form, setForm] = useState(emptyForm);
  const [viewImg, setViewImg] = useState(null);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    const res = await fetch(`${BASE_URL}/user-details`);
    const data = await res.json();
    setUsersData(data.user_details || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= SEARCH ================= */
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
    setShowForm(true);
  };

  /* ================= EDIT USER ================= */
  const handleEdit = (u) => {
    setOriginalUser(u);
    setForm({ ...u });
    setShowForm(true);
  };

  /* ================= SAVE USER ================= */
  const handleSave = async () => {
    const isEdit = Boolean(originalUser);
    const url = isEdit
      ? `${BASE_URL}/user-details/${originalUser.user_id}`
      : `${BASE_URL}/user-details`;

    const payload = { agent_id: AGENT_ID, ...form };

    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Save failed");
      return;
    }

    await fetchUsers();
    setShowForm(false);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;
    await fetch(`${BASE_URL}/user-details/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  return (
    <div className="bg-white rounded-xl shadow border">

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
          <div className="relative bg-white p-2 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setViewImg(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
            >
              <FiX size={20} className="text-gray-600" />
            </button>
            <img
              src={viewImg}
              alt="Document Preview"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div className="p-4 md:p-6 flex flex-col sm:flex-row justify-between gap-4 border-b">
        <div>
          <h2 className="text-xl font-bold">Traveller Assessment</h2>
          <p className="text-sm text-gray-500">
            Manage users and traveller details
          </p>
        </div>
        

        <div className="flex flex-col sm:flex-row gap-3">
          {/* <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              className="w-full sm:w-auto pl-10 pr-4 py-2 border rounded"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div> */}
<div className="relative w-full sm:w-[400px] md:w-[480px]">
  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
  <input
    className="w-full pl-10 px-6 pr-4 py-2.5 border rounded-lg text-sm
               focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="Search..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>



          <button
  onClick={handleAddUser}
  className="border border-blue-400 bg-blue-800 text-white rounded-lg px-2 h-[40px]"

 
>
  + Add User
</button>
  
        </div>
      </div>

      {/* ================= TABLE WRAPPER ================= */}
      <div className="overflow-x-auto">
        {/* ================= TABLE HEADER ================= */}
        <div className="grid px-6 py-3 text-xs font-semibold bg-gray-50 min-w-[800px]" style={{ gridTemplateColumns: '60px 1fr 1.2fr 120px 120px 100px 100px' }}>
          <div>S.No</div>
          <div>Name</div>
          <div>Email</div>
          <div>Mobile</div>
          <div>Branch</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* ================= USERS ================= */}
        {filteredUsers.map((u, i) => (
          <div key={u.user_id} className="border-b">


            <div
              onClick={() => toggleRow(u)}
              className={`grid px-6 py-4 text-sm cursor-pointer min-w-[800px] transition-colors
    ${expandedUserId === u.user_id
                  ? "bg-blue-100 border-l-4 border-blue-500"
                  : "bg-white hover:bg-blue-50"}
  `}style={{gridTemplateColumns: "60px 1fr 1.2fr 120px 120px 100px 100px", }}
            >

              <div>{i + 1}</div>
              <div className="font-medium">{u.name}</div>
              <div>{u.email}</div>
              <div>{u.mobile}</div>
              <div>{u.branch}</div>
              <div>{u.is_active ? "Active" : "Inactive"}</div>
              <div className="flex gap-3">
                <FiEdit
                  className="text-indigo-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(u);
                  }}
                />
                <FiTrash2
                  className="text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(u.user_id);
                  }}
                />
              </div>
            </div>

            {/* ================= EXTRA DETAILS ================= */}
            {expandedUserId === u.user_id && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-6">
                {extraLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="ml-3 text-gray-600">Loading traveler details...</p>
                  </div>
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
                          {/* <span className={`px-3 py-1 rounded-full text-xs font-medium ${d.isagreed ? 'bg-green-400 text-green-900' : 'bg-yellow-400 text-yellow-900'
                            }`}>
                            {d.isagreed ? '✓ Agreed' : 'Pending'}
                          </span> */}
                        </div>

                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Personal Information */}
                            <div className="space-y-3">
                              <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Personal Info</h5>
                              <div className="space-y-2">
                                <div>
                                  <label className="text-xs text-gray-500">Full Name</label>
                                  <p className="text-sm font-medium text-gray-900">{d.name} {d.surname}</p>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500">Mobile</label>
                                  <p className="text-sm font-medium text-gray-900">{d.mobile || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500">Date of Birth</label>
                                  <p className="text-sm font-medium text-gray-900">{d.dob || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500">Gender</label>
                                  <p className="text-sm font-medium text-gray-900">{d.gender || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500">Nationality</label>
                                  <p className="text-sm font-medium text-gray-900">{d.nationality || 'N/A'}</p>
                                </div>
                              </div>
                            </div>

                            {/* Passport Information */}
                            <div className="space-y-3">
                              <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Passport Details</h5>
                              <div className="space-y-2">
                                <div>
                                  <label className="text-xs text-gray-500">Passport Number</label>
                                  <p className="text-sm font-medium text-gray-900">{d.passportno || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500">Issued By</label>
                                  <p className="text-sm font-medium text-gray-900">{d.issuedby || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500">Date of Issue</label>
                                  <p className="text-sm font-medium text-gray-900">{d.dateofissued || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500">Date of Expiry</label>
                                  <p className="text-sm font-medium text-gray-900">{d.dateofexpired || 'N/A'}</p>
                                </div>
                              </div>
                            </div>

                            {/* Tour & Documents */}
                            <div className="space-y-3">
                              <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Tour & Documents</h5>
                              <div className="space-y-2">
                                <div>
                                  <label className="text-xs text-gray-500">Tour Code</label>
                                  <p className="text-sm font-medium text-indigo-600">{d.tour_code || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500">Created At</label>
                                  <p className="text-sm font-medium text-gray-900">
                                    {new Date(d.created_at).toLocaleDateString('en-IN', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric'
                                    })}
                                  </p>
                                </div>
                              </div>

                              {/* Document Links */}
                              <div className="pt-3 space-y-2">
                                <label className="text-xs text-gray-500 block">Documents</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {d.passport_image_url && (
                                    <button
                                      onClick={() => setViewImg(d.passport_image_url)}
                                      className="flex items-center justify-center gap-1 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-xs font-medium"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                      Passport
                                    </button>
                                  )}
                                  {d.aadhar_front_url && (
                                    <button
                                      onClick={() => setViewImg(d.aadhar_front_url)}
                                      className="flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs font-medium"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                      Aadhar Front
                                    </button>
                                  )}
                                  {d.aadhar_back_url && (
                                    <button
                                      onClick={() => setViewImg(d.aadhar_back_url)}
                                      className="flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs font-medium"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                      Aadhar Back
                                    </button>
                                  )}
                                  {d.pancard_url && (
                                    <button
                                      onClick={() => setViewImg(d.pancard_url)}
                                      className="flex items-center justify-center gap-1 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-xs font-medium"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                      PAN
                                    </button>
                                  )}
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
