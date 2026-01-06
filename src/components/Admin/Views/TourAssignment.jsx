import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Search, Filter, Calendar, UserPlus, ArrowRight } from "lucide-react";
import SkeletonLoader from "../../Common/SkeletonLoader";
import { useToast } from "../../../context/ToastContext";

const usersDataRaw = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", tour: "Europe Escape", batch: "Oct 2023" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", tour: "Bali Bliss", batch: "Nov 2023" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", tour: "Europe Escape", batch: "Oct 2023" },
];

export default function TourAssignment() {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const [users, setUsers] = useState([]); // Initialized as empty
    const [selectedTour, setSelectedTour] = useState("All");

    // Initialize batches from raw data so they persist even if users are moved out
    const [batches, setBatches] = useState(() => {
        const unique = [];
        const seen = new Set();
        usersDataRaw.forEach(u => {
            const key = `${u.tour}-${u.batch}`;
            if (!seen.has(key)) {
                seen.add(key);
                unique.push({ tour: u.tour, name: u.batch });
            }
        });
        return unique;
    });

    const BATCH_LIMIT = 100;

    // Extract unique tours from batches (so they persist too)
    const tours = ["All", ...new Set(batches.map(b => b.tour))].sort();

    // Helper to get users by tour and batch
    const getUsersByBatch = (tour, batch) => {
        return users.filter(u => u.tour === tour && u.batch === batch);
    };

    // Move User State
    const [moveUserModal, setMoveUserModal] = useState({ show: false, user: null, tourName: null, currentBatch: null });
    const [targetBatch, setTargetBatch] = useState("");

    const openMoveUserModal = (user, tourName, currentBatch) => {
        setMoveUserModal({ show: true, user, tourName, currentBatch });
        setTargetBatch(""); // Reset selection
    };

    const handleMoveUser = () => {
        if (!targetBatch) {
            addToast("Please select a batch to move the user to.", "error");
            return;
        }

        setUsers(prevUsers => prevUsers.map(u => {
            if (u.id === moveUserModal.user.id) {
                return { ...u, batch: targetBatch };
            }
            return u;
        }));

        setMoveUserModal({ show: false, user: null, tourName: null, currentBatch: null });
        addToast(`User moved to ${targetBatch} successfully!`, "success");
    };

    // Derived batches for the dropdown (from explicit batches state)
    const availableBatchesForMove = moveUserModal.tourName
        ? batches.filter(b => b.tour === moveUserModal.tourName && b.name !== moveUserModal.currentBatch).map(b => b.name).sort()
        : [];


    // Group data for display (driven by batches state)
    const tourBatches = tours.filter(t => t !== "All").map(tourName => {
        const tourSpecificBatches = batches.filter(b => b.tour === tourName).sort((a, b) => a.name.localeCompare(b.name));

        return {
            tourName,
            batches: tourSpecificBatches.map(batch => ({
                batchName: batch.name,
                users: getUsersByBatch(tourName, batch.name)
            }))
        };
    }).filter(t => selectedTour === "All" || t.tourName === selectedTour);


    const [showCreateBatchModal, setShowCreateBatchModal] = useState(false);
    const [targetTour, setTargetTour] = useState(null); // New state to track which tour we are creating a batch for
    const [createBatchSearch, setCreateBatchSearch] = useState("");
    const [newBatchData, setNewBatchData] = useState({
        startDate: "",
        capacity: "",
        selectedUserIds: []
    });

    const openCreateBatchModal = (tourName) => {
        setTargetTour(tourName);
        setShowCreateBatchModal(true);
        setCreateBatchSearch("");
        setNewBatchData({ startDate: "", capacity: "", selectedUserIds: [] });
    };

    const handleSelectAllInCreate = () => {
        const filtered = users.filter(u =>
            u.name.toLowerCase().includes(createBatchSearch.toLowerCase()) ||
            u.email.toLowerCase().includes(createBatchSearch.toLowerCase())
        );
        const filteredIds = filtered.map(u => u.id.toString());
        const allSelected = filteredIds.length > 0 && filteredIds.every(id => newBatchData.selectedUserIds.includes(id));

        if (allSelected) {
            setNewBatchData(prev => ({
                ...prev,
                selectedUserIds: prev.selectedUserIds.filter(id => !filteredIds.includes(id))
            }));
        } else {
            setNewBatchData(prev => ({
                ...prev,
                selectedUserIds: [...new Set([...prev.selectedUserIds, ...filteredIds])]
            }));
        }
    };

    const handleCreateBatch = (e) => {
        e.preventDefault();

        if (!newBatchData.startDate || !newBatchData.capacity || newBatchData.selectedUserIds.length === 0) {
            addToast("Please fill all fields and select at least one user.", "error");
            return;
        }

        const selectedDate = new Date(newBatchData.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            addToast("Please select a present or future date for the batch.", "error");
            return;
        }

        const batchName = format(selectedDate, "MMM yyyy");

        // Add new batch to state if it doesn't exist
        setBatches(prev => {
            const exists = prev.some(b => b.tour === targetTour && b.name === batchName);
            if (!exists) {
                return [...prev, { tour: targetTour, name: batchName }];
            }
            return prev;
        });

        setUsers(prevUsers => prevUsers.map(u => {
            if (newBatchData.selectedUserIds.includes(u.id.toString())) {
                // Assign to the TARGET tour
                return { ...u, batch: batchName, tour: targetTour };
            }
            return u;
        }));

        setShowCreateBatchModal(false);
        setNewBatchData({ startDate: "", capacity: "", selectedUserIds: [] });
        setTargetTour(null);
        addToast(`Batch ${batchName} created successfully!`, "success");
    };

    const toggleUserSelection = (userId) => {
        const idStr = String(userId);
        setNewBatchData(prev => {
            const currentSelected = prev.selectedUserIds;
            if (currentSelected.includes(idStr)) {
                return { ...prev, selectedUserIds: currentSelected.filter(id => id !== idStr) };
            } else {
                return { ...prev, selectedUserIds: [...currentSelected, idStr] };
            }
        });
    };

    // Add Traveler State
    const [addTravelerModal, setAddTravelerModal] = useState({ show: false, tourName: null, batchName: null });
    const [addTravelerSearch, setAddTravelerSearch] = useState("");
    const [selectedUsersToAdd, setSelectedUsersToAdd] = useState([]);

    const openAddTravelerModal = (tourName, batchName) => {
        setAddTravelerModal({ show: true, tourName, batchName });
        setAddTravelerSearch("");
        setSelectedUsersToAdd([]);
    };

    const handleSelectAllInAdd = () => {
        const filtered = users.filter(u =>
            u.batch !== addTravelerModal.batchName &&
            (u.name.toLowerCase().includes(addTravelerSearch.toLowerCase()) ||
                u.email.toLowerCase().includes(addTravelerSearch.toLowerCase()))
        );
        const filteredIds = filtered.map(u => String(u.id));
        const allSelected = filteredIds.length > 0 && filteredIds.every(id => selectedUsersToAdd.includes(id));

        if (allSelected) {
            setSelectedUsersToAdd(prev => prev.filter(id => !filteredIds.includes(id)));
        } else {
            setSelectedUsersToAdd(prev => [...new Set([...prev, ...filteredIds])]);
        }
    };

    const handleAddTraveler = (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (selectedUsersToAdd.length === 0) {
            addToast("Please select at least one traveler.", "error");
            return;
        }

        const count = selectedUsersToAdd.length;
        setUsers(prevUsers => prevUsers.map(u => {
            const idStr = String(u.id);
            if (selectedUsersToAdd.includes(idStr)) {
                return { ...u, batch: addTravelerModal.batchName, tour: addTravelerModal.tourName };
            }
            return u;
        }));

        setAddTravelerModal({ show: false, tourName: null, batchName: null });
        setSelectedUsersToAdd([]);
        addToast(`${count} traveler(s) added successfully!`, "success");
    };

    const toggleAddUserSelection = (userId) => {
        const idStr = String(userId);
        setSelectedUsersToAdd(prev => {
            if (prev.includes(idStr)) return prev.filter(id => id !== idStr);
            return [...prev, idStr];
        });
    };

    if (loading) {
        return <SkeletonLoader type="dashboard" count={1} />; // Using dashboard/custom type or just return earlier
    }

    return (
        <div className="space-y-8 relative">
            {/* Move User Modal */}
            {moveUserModal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">Move Traveler</h3>
                            <button onClick={() => setMoveUserModal({ show: false, user: null })} className="text-gray-400 hover:text-gray-600">
                                ✕
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-2">
                                    Move <strong>{moveUserModal.user.name}</strong> from <strong>{moveUserModal.currentBatch}</strong> to:
                                </p>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={targetBatch}
                                    onChange={(e) => setTargetBatch(e.target.value)}
                                >
                                    <option value="">Select Target Batch</option>
                                    {availableBatchesForMove.map(b => (
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                                {availableBatchesForMove.length === 0 && (
                                    <p className="text-xs text-red-500 mt-1">No other batches available for this tour. Create a new batch first.</p>
                                )}
                            </div>
                            <div className="pt-2 flex gap-3">
                                <button
                                    onClick={() => setMoveUserModal({ show: false, user: null })}
                                    className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleMoveUser}
                                    disabled={!targetBatch}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium text-white shadow-sm ${!targetBatch ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                >
                                    Move
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showCreateBatchModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">Create Next Batch for {targetTour}</h3>
                            <button onClick={() => setShowCreateBatchModal(false)} className="text-gray-400 hover:text-gray-600">
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleCreateBatch} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Batch Starting Date</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newBatchData.startDate}
                                    onChange={(e) => setNewBatchData({ ...newBatchData, startDate: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newBatchData.capacity}
                                    onChange={(e) => setNewBatchData({ ...newBatchData, capacity: e.target.value })}
                                    placeholder="e.g 50"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Users</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        className="flex-grow border border-gray-300 rounded-lg px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                                        value={createBatchSearch}
                                        onChange={(e) => setCreateBatchSearch(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSelectAllInCreate}
                                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg font-medium transition"
                                    >
                                        {users.filter(u =>
                                            u.name.toLowerCase().includes(createBatchSearch.toLowerCase()) ||
                                            u.email.toLowerCase().includes(createBatchSearch.toLowerCase())
                                        ).every(u => newBatchData.selectedUserIds.includes(u.id.toString())) ? "Deselect All" : "Select All"}
                                    </button>
                                </div>
                                <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                    {users.filter(u =>
                                        u.name.toLowerCase().includes(createBatchSearch.toLowerCase()) ||
                                        u.email.toLowerCase().includes(createBatchSearch.toLowerCase())
                                    ).length === 0 ? (
                                        <div className="text-center py-6 text-gray-500 italic">No users found.</div>
                                    ) : (
                                        users.filter(u =>
                                            u.name.toLowerCase().includes(createBatchSearch.toLowerCase()) ||
                                            u.email.toLowerCase().includes(createBatchSearch.toLowerCase())
                                        ).map(u => (
                                            <div
                                                key={u.id}
                                                onClick={() => toggleUserSelection(u.id)}
                                                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer group border border-transparent hover:border-indigo-100 transition shadow-sm"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={newBatchData.selectedUserIds.includes(String(u.id))}
                                                    readOnly
                                                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                                />
                                                <div className="text-sm flex-grow">
                                                    <div className="font-medium text-gray-800 group-hover:text-indigo-600 transition truncate">{u.name}</div>
                                                    <div className="text-xs text-gray-500 flex justify-between">
                                                        <span>{u.email}</span>
                                                        <span className="text-indigo-400 font-medium">{u.batch || "Available"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="text-xs text-gray-500 mt-2 flex justify-between items-center bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                                    <span className="font-bold text-indigo-700">{newBatchData.selectedUserIds.length} users selected</span>
                                    <span>Available for batch: {users.length}</span>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateBatchModal(false)}
                                    className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={newBatchData.selectedUserIds.length === 0}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium text-white shadow-sm transition ${newBatchData.selectedUserIds.length > 0 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                >
                                    {newBatchData.selectedUserIds.length > 0 ? `Create Batch with ${newBatchData.selectedUserIds.length} User(s)` : 'Select users...'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Traveler Modal */}
            {addTravelerModal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">Add Traveler to {addTravelerModal.batchName}</h3>
                            <button onClick={() => setAddTravelerModal({ show: false, tourName: null, batchName: null })} className="text-gray-400 hover:text-gray-600">
                                ✕
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Travelers to Add (from users.json)</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Search travelers..."
                                        className="flex-grow border border-gray-300 rounded-lg px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                                        value={addTravelerSearch}
                                        onChange={(e) => setAddTravelerSearch(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSelectAllInAdd}
                                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg font-medium transition"
                                    >
                                        {users.filter(u =>
                                            u.batch !== addTravelerModal.batchName &&
                                            (u.name.toLowerCase().includes(addTravelerSearch.toLowerCase()) ||
                                                u.email.toLowerCase().includes(addTravelerSearch.toLowerCase()))
                                        ).every(u => selectedUsersToAdd.includes(u.id.toString())) ? "Deselect All" : "Select All"}
                                    </button>
                                </div>
                                <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                    {users.filter(u =>
                                        u.batch !== addTravelerModal.batchName &&
                                        (u.name.toLowerCase().includes(addTravelerSearch.toLowerCase()) ||
                                            u.email.toLowerCase().includes(addTravelerSearch.toLowerCase()))
                                    ).length === 0 ? (
                                        <div className="text-center py-8 text-gray-500 italic">No travelers found matching your search.</div>
                                    ) : (
                                        users.filter(u =>
                                            u.batch !== addTravelerModal.batchName &&
                                            (u.name.toLowerCase().includes(addTravelerSearch.toLowerCase()) ||
                                                u.email.toLowerCase().includes(addTravelerSearch.toLowerCase()))
                                        ).map(u => (
                                            <div
                                                key={u.id}
                                                onClick={() => toggleAddUserSelection(u.id)}
                                                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer group border border-transparent hover:border-indigo-100 transition shadow-sm"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsersToAdd.includes(String(u.id))}
                                                    readOnly
                                                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                                />
                                                <div className="text-sm flex-grow">
                                                    <div className="font-medium text-gray-800 group-hover:text-indigo-600 transition truncate">{u.name}</div>
                                                    <div className="text-xs text-gray-500 flex justify-between">
                                                        <span>{u.email}</span>
                                                        <span className="text-indigo-400 font-medium">{u.batch || "Available"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="text-xs text-gray-500 mt-2 flex justify-between items-center bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                                    <span className="font-bold text-indigo-700">{selectedUsersToAdd.length} travelers selected</span>
                                    <span>Total database users: {users.length}</span>
                                </div>
                            </div>
                            <div className="pt-2 flex gap-3">
                                <button
                                    onClick={() => setAddTravelerModal({ show: false, tourName: null, batchName: null })}
                                    className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddTraveler}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium text-white shadow-sm transition ${selectedUsersToAdd.length > 0 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                >
                                    {selectedUsersToAdd.length > 0 ? `Add ${selectedUsersToAdd.length} Traveler(s)` : 'Select travelers...'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Tour Assignment & Batching</h2>
                    <p className="text-sm text-gray-500">Manage traveler batches, capped at 100 per group.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Filter by Tour:</span>
                    <select
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={selectedTour}
                        onChange={(e) => setSelectedTour(e.target.value)}
                    >
                        {tours.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>

            {/* Tour Batches List */}
            <div className="grid grid-cols-1 gap-8">
                {tourBatches.map((tour) => (
                    <div key={tour.tourName} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <PlaneIcon /> {tour.tourName}
                            </h3>
                            <button className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
                                View All Batches <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tour.batches.map((batch) => {
                                const count = batch.users.length;
                                const progress = (count / BATCH_LIMIT) * 100;
                                const isFull = count >= BATCH_LIMIT;

                                return (
                                    <div key={batch.batchName} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition bg-white relative overflow-hidden group h-full flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Batch Date</p>
                                                <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-indigo-500" /> {batch.batchName}
                                                </h4>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${isFull ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                {isFull ? 'FULL' : 'OPEN'}
                                            </span>
                                        </div>

                                        {/* Capacity Bar */}
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-medium text-gray-600">Capacity</span>
                                                <span className={`${isFull ? 'text-red-500' : 'text-gray-500'}`}>{count} / {BATCH_LIMIT}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-indigo-500'}`}
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Users Preview */}
                                        <div className="space-y-3 max-h-40 overflow-y-auto pr-1 custom-scrollbar flex-grow">
                                            {batch.users.length === 0 ? (
                                                <div className="text-center py-4 text-gray-400 text-sm italic">
                                                    No travelers assigned yet.
                                                </div>
                                            ) : (
                                                batch.users.map(u => (
                                                    <div key={u.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded border border-gray-100">
                                                        <div className="flex items-center gap-2 truncate">
                                                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
                                                                {u.name.charAt(0)}
                                                            </div>
                                                            <span className="truncate max-w-[100px]" title={u.name}>{u.name}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => openMoveUserModal(u, tour.tourName, batch.batchName)}
                                                            className="text-xs text-orange-600 hover:text-orange-800 font-medium hover:bg-orange-50 px-2 py-1 rounded transition"
                                                            title="Move to another batch"
                                                        >
                                                            Move ➔
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {/* Footer Action */}
                                        <div className="mt-4 pt-4 border-t border-gray-100 text-center mt-auto">
                                            <button
                                                onClick={() => openAddTravelerModal(tour.tourName, batch.batchName)}
                                                className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-indigo-500 hover:text-indigo-600 font-medium transition flex items-center justify-center gap-2"
                                            >
                                                <UserPlus className="w-4 h-4" /> Add Traveler
                                            </button>
                                        </div>

                                    </div>
                                );
                            })}

                            {/* New Batch Card Placeholder */}
                            <div
                                onClick={() => openCreateBatchModal(tour.tourName)}
                                className="border border-dashed border-gray-300 rounded-lg p-5 flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:bg-gray-50 transition cursor-pointer min-h-[250px]"
                            >
                                <Calendar className="w-8 h-8 mb-2 opacity-50" />
                                <span className="font-medium text-sm">Create Next Batch</span>
                            </div>
                        </div>
                    </div>
                ))}

                {tourBatches.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-500">No tours matching the filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Simple Plane Icon Component since lucide Plane might be different or for custom styling
function PlaneIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-indigo-600"
        >
            <path d="M2 12h20" />
            <path d="M13 2l9 10-9 10" />
        </svg>

    );
}