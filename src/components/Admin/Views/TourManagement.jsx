import { useEffect, useState, useRef } from "react";
import SkeletonLoader from "../../Common/SkeletonLoader";
import { useToast } from "../../../context/ToastContext";
import { useConfirm } from "../../../context/ConfirmContext";

const tourImages = {
  dubai: "/assets/tours/dubai.jpg",
  thailand: "/assets/tours/thailand.jpg",
  singapore: "/assets/tours/singapore.jpg",
  malaysia: "/assets/tours/malaysia.jpg",
  bali: "/assets/tours/bali.jpg",
  default: "/assets/tours/default.jpg",
};

function TourImage({ src, tourName, className }) {
  const getFallback = (name = "") => {
    const lower = name.toLowerCase();
    if (lower.includes("dubai")) return tourImages.dubai;
    if (lower.includes("thailand")) return tourImages.thailand;
    if (lower.includes("singapore")) return tourImages.singapore;
    if (lower.includes("malaysia")) return tourImages.malaysia;
    if (lower.includes("bali")) return tourImages.bali;
    return tourImages.default;
  };

  const fallback = getFallback(tourName);
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [hasFailed, setHasFailed] = useState(false);



  return (
    <img
      src={imgSrc}
      alt={tourName}
      className={className}
      onError={() => {
        if (!hasFailed) {
          setImgSrc(fallback);
          setHasFailed(true);
        }
      }}
    />
  );
}

export default function TourManagement() {
  const { addToast } = useToast();
  const confirm = useConfirm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const [tours, setTours] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [toursCache, setToursCache] = useState({});
  const [pagination, setPagination] = useState({
    total_records: 0,
    total_pages: 0,
    page_size: 9
  });
  const fetchingRef = useRef(null);

  const [formData, setFormData] = useState({
    id: null,
    tour_name: "",
    tour_code: "",
    start_date: "",
    end_date: "",
    slots: "",
    tour_description: "",
    package_price: "",
    available_slots: "",
    booked_slots: "",
    arrival_at: "",
    depature_at: "",
    arrivals_place: "",
    depature_place: "",
    days_count: "",
    nights_count: "",
    emi_per_month: "",
    tour_image_url: "",
  });

  const [isEdit, setIsEdit] = useState(false);

  const fetchTours = async (page = 1) => {
    // Check cache first
    if (toursCache[page]) {
      setTours(toursCache[page]);
      setLoading(false);
      return;
    }

    // Deduplicate requests
    if (fetchingRef.current === page) return;
    fetchingRef.current = page;

    setLoading(true);
    try {
      const res = await fetch(`https://marktours-services-jn6cma3vvq-el.a.run.app/tours-config?page=${page}&page_size=9`);
      const data = await res.json();

      // The API might return data in different structures, handling both based on user input
      // adjusting based on assumed structure similar to UserManagement but for tours
      // If data.tours is the array

      setTours(data.tours || []);
      setPagination({
        total_records: data.total_records || 0,
        total_pages: data.total_pages || 1,
        page_size: data.page_size || 9
      });

      // Update cache
      setToursCache(prev => ({
        ...prev,
        [page]: data.tours || []
      }));

    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
      fetchingRef.current = null;
    }
  };

  const refreshCurrentPage = async () => {
    const page = currentPage;
    setToursCache(prev => {
      const newCache = { ...prev };
      delete newCache[page];
      return newCache;
    });
    try {
      const res = await fetch(`https://marktours-services-jn6cma3vvq-el.a.run.app/tours-config?page=${page}&page_size=9`);
      const data = await res.json();
      setTours(data.tours || []);
      setPagination({
        total_records: data.total_records || 0,
        total_pages: data.total_pages || 1,
        page_size: data.page_size || 9
      });
      setToursCache(prev => ({
        ...prev,
        [page]: data.tours || []
      }));
    } catch (error) {
      console.error("Failed to refresh tours", error);
    }
  };

  useEffect(() => {
    fetchTours(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveTour = (e) => {
    e.preventDefault();

    const url = isEdit
      ? `https://marktours-services-jn6cma3vvq-el.a.run.app/tours-config/${formData.tour_code}`
      : "https://marktours-services-jn6cma3vvq-el.a.run.app/tours-config";
    const method = isEdit ? "PUT" : "POST";

    // Helper to format date for API (adding time if missing)
    const formatDateTime = (dateStr) => {
      if (!dateStr) return null;
      if (dateStr.includes("T")) return dateStr;
      return `${dateStr}T09:00:00`; // Default time as seen in sample
    };

    // Automatic Tour Code generation (e.g., DU123015)
    const generateTourCode = (name) => {
      const prefix = (name || "TRP").substring(0, 2).toUpperCase();
      const suffix = Date.now().toString().slice(-6);
      return `${prefix}${suffix}`;
    };

    const payload = {
      tour_name: formData.tour_name,
      tour_code: isEdit ? formData.tour_code : generateTourCode(formData.tour_name),
      start_date: formatDateTime(formData.start_date),
      end_date: formatDateTime(formData.end_date),
      slots: Number(formData.slots),
      tour_description: formData.tour_description,
      package_price: Number(formData.package_price),
      available_slots: formData.available_slots ? Number(formData.available_slots) : Number(formData.slots),
      booked_slots: formData.booked_slots ? Number(formData.booked_slots) : 0,
      arrival_at: formatDateTime(formData.arrival_at),
      depature_at: formatDateTime(formData.depature_at),
      arrivals_place: formData.arrivals_place,
      depature_place: formData.depature_place,
      days_count: Number(formData.days_count),
      nights_count: Number(formData.nights_count),
      emi_per_month: Number(formData.emi_per_month),
      tour_image_url: formData.tour_image_url,
    };

    // console.log("Tour Management Payload:", payload);

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || "Save failed");
        }
        return res.json();
      })
      .then(() => {
        setShowCreateModal(false);
        resetForm();
        refreshCurrentPage();
        addToast(isEdit ? "Tour updated successfully" : "Tour created successfully", "success");
      })
      .catch((err) => {
        console.error("Save tour failed:", err);
        addToast(`Failed: ${err.message}`, "error");
      });
  };

  const handleDeleteTour = async (tourCode) => {
    const isConfirmed = await confirm({
      title: "Delete Tour?",
      message: "Are you sure you want to delete this tour? This will remove all tour configurations.",
      confirmText: "Delete",
      type: "danger"
    });

    if (!isConfirmed) return;

    fetch(`https://marktours-services-jn6cma3vvq-el.a.run.app/tours-config/${tourCode}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        refreshCurrentPage();
        addToast("Tour deleted successfully", "success");
      })
      .catch((err) => {
        console.error("Delete tour failed:", err);
        addToast("Failed to delete tour", "error");
      });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      addToast("Image is too large. Please select a file smaller than 2MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadstart = () => setUploading(true);
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, tour_image_url: reader.result }));
      setUploading(false);
      // Reset input value so same file can be selected again if needed
      e.target.value = "";
    };
    reader.onerror = () => {
      addToast("Failed to read file.", "error");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateClick = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleEditClick = (tour) => {
    setFormData({
      ...tour,
      slots: tour.slots?.toString() || "",
      package_price: tour.package_price?.toString() || "",
      available_slots: tour.available_slots?.toString() || "",
      booked_slots: tour.booked_slots?.toString() || "",
      days_count: tour.days_count?.toString() || "",
      nights_count: tour.nights_count?.toString() || "",
      emi_per_month: tour.emi_per_month?.toString() || "",
      tour_image_url: tour.tour_image_url || "",
      start_date: tour.start_date?.split("T")[0] || "",
      end_date: tour.end_date?.split("T")[0] || "",
      arrival_at: tour.arrival_at?.split("T")[0] || "",
      depature_at: tour.depature_at?.split("T")[0] || "",
      tour_description: tour.tour_description || "",
      arrivals_place: tour.arrivals_place || "",
      depature_place: tour.depature_place || "",
    });
    setIsEdit(true);
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setFormData({
      id: null,
      tour_name: "",
      tour_code: "",
      slots: "",
      tour_description: "",
      package_price: "",
      emi_per_month: "",
      available_slots: "",
      booked_slots: "",
      start_date: "",
      end_date: "",
      arrival_at: "",
      depature_at: "",
      arrivals_place: "",
      depature_place: "",
      days_count: "",
      nights_count: "",

      tour_image_url: "",
    });
    setIsEdit(false);
  };

  const filteredTours = tours.filter((t) =>
    `${t.tour_name} ${t.tour_code}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <SkeletonLoader type="card" count={6} />;
  }

  return (
    <div className="space-y-6 mb-5">
      <div className="sticky top-0 z-30 bg-gray-50 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-bold text-gray-800">Tour Management</h2>

        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:border-indigo-500 outline-none transition-all shadow-sm"
              placeholder="Search tours..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={handleCreateClick}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-indigo-700 whitespace-nowrap shadow-sm"
          >
            + Create Tour
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        {filteredTours.map((tour) => (
          <div
            key={tour.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex flex-col"
          >
            <div className="flex gap-3">
              <div className="w-[60%] h-[80px] rounded-lg overflow-hidden">
                <TourImage
                  key={tour.tour_image_url}
                  src={tour.tour_image_url}
                  tourName={tour.tour_name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-lg font-bold leading-tight">
                  {tour.tour_name.toUpperCase()}
                </h2>
                <p className="mt-1 text-gray-600 text-xs">
                  TRIP CODE : {tour.tour_code}
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="border border-gray-300 bg-gray-50 rounded-lg py-1 text-center">
                <p className="text-black text-[10px] tracking-wider">
                  BOOKED
                </p>
                <p className="text-md font-semibold">{tour.booked_slots}</p>
              </div>

              <div className="border border-gray-300 bg-gray-50 rounded-lg py-1 text-center">
                <p className="text-black text-[10px] tracking-wider">
                  REVENUE
                </p>
                <p className="text-md font-semibold">
                  ₹{(tour.package_price * tour.booked_slots).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleEditClick(tour)}
                className="flex-1 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTour(tour.tour_code)}
                className="flex-1 py-2 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION CONTROLS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 items-center px-6 py-4 border-t border-gray-200 bg-white rounded-xl shadow-sm gap-4">
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

      {/* CREATE TOUR MODAL */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">
              {isEdit ? "Edit Tour" : "Create New Tour"}
            </h3>

            <form onSubmit={handleSaveTour} className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500">Tour Name</label>
                  <input
                    name="tour_name"
                    placeholder="Tour Name"
                    value={formData.tour_name}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500">Package Price (₹)</label>
                  <input
                    type="number"
                    name="package_price"
                    placeholder="Package Price"
                    value={formData.package_price}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">EMI Per Month (₹)</label>
                  <input
                    type="number"
                    name="emi_per_month"
                    placeholder="EMI"
                    value={formData.emi_per_month}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500">End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500">Arrival At</label>
                  <input
                    type="date"
                    name="arrival_at"
                    value={formData.arrival_at}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500">Departure At</label>
                  <input
                    type="date"
                    name="depature_at"
                    value={formData.depature_at}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500">Arrival Place</label>
                  <input
                    name="arrivals_place"
                    placeholder="Arrival Place"
                    value={formData.arrivals_place}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500">Departure Place</label>
                  <input
                    name="depature_place"
                    placeholder="Departure Place"
                    value={formData.depature_place}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>





                <div>
                  <label className="text-xs font-semibold text-gray-500">Days Count</label>
                  <input
                    type="number"
                    name="days_count"
                    placeholder="Days"
                    value={formData.days_count}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500">Nights Count</label>
                  <input
                    type="number"
                    name="nights_count"
                    placeholder="Nights"
                    value={formData.nights_count}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">Total Slots</label>
                  <input
                    type="number"
                    name="slots"
                    placeholder="Total Slots"
                    value={formData.slots}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 text-sm"
                    required
                  />
                </div>

                {isEdit && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500">Available Slots</label>
                    <input
                      type="number"
                      name="available_slots"
                      placeholder="Available Slots"
                      value={formData.available_slots}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2 text-sm"
                    />
                  </div>
                )}

                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500">Image URL</label>
                  <div className="flex gap-2">
                    <input
                      name="tour_image_url"
                      placeholder="Image URL"
                      value={formData.tour_image_url?.startsWith('data:') ? 'Local Image Selected' : formData.tour_image_url}
                      onChange={handleChange}
                      className="flex-1 border rounded-lg p-2 text-sm"
                      readOnly={formData.tour_image_url?.startsWith('data:')}
                    />
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => document.getElementById('tour-file-input').click()}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border flex items-center shrink-0 transition-colors ${uploading
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                        }`}
                    >
                      {uploading ? "Reading..." : "Upload"}
                    </button>
                    <input
                      id="tour-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                  {formData.tour_image_url && (
                    <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                      <img
                        src={formData.tour_image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, tour_image_url: "" }))}
                        className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500">Description</label>
                  <textarea
                    name="tour_description"
                    placeholder="Description"
                    value={formData.tour_description}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 text-sm h-20"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
                >
                  {isEdit ? "Save Changes" : "Create Tour"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-200 py-2 rounded-lg text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
