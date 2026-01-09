import { useEffect, useState, useRef } from "react";
import { FiX, FiCalendar, FiInbox } from "react-icons/fi";
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

  // Local state for pagination input to allow free typing
  const [pageInput, setPageInput] = useState(1);
  useEffect(() => {
    setPageInput(currentPage);
  }, [currentPage]);

  // Helper to get today as dd-mm-yyyy
  const getTodayDDMMYYYY = () => {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    return `${d}-${m}-${y}`;
  };

  const [formData, setFormData] = useState({
    id: null,
    tour_id: "",
    tour_name: "",
    tour_code: "",
    start_date: getTodayDDMMYYYY(),
    end_date: getTodayDDMMYYYY(),
    slots: "",
    tour_description: "",
    package_price: "",
    available_slots: "",
    booked_slots: "",
    source_start_at: getTodayDDMMYYYY(),
    destination_end_at: getTodayDDMMYYYY(),
    source_start_place: "",
    destination_end_place: "",
    days_count: "",
    nights_count: "",
    emi_per_month: "",
    tour_image_url: "",
    tour_images: [],
    tourjsondata: {
      activities: [],
      guide: "",
      hotel: ""
    }
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
    // Helper to format date for API (dd-mm-yyyy -> yyyy-mm-ddT...)
    const formatDateTime = (dateStr) => {
      if (!dateStr) return null;
      if (dateStr.includes("T")) return dateStr;

      // Convert dd-mm-yyyy to yyyy-mm-dd
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const [d, m, y] = parts;
        return `${y}-${m}-${d}T09:00:00`;
      }
      return null;
    };

    // Automatic Tour Code generation (e.g., DU123015)
    const generateTourCode = (name) => {
      const prefix = (name || "TRP").substring(0, 2).toUpperCase();
      const suffix = Date.now().toString().slice(-6);
      return `${prefix}${suffix}`;
    };

    const payload = {
      tour_id: formData.tour_id || Date.now(),
      tour_name: formData.tour_name,
      tour_code: isEdit ? formData.tour_code : generateTourCode(formData.tour_name),
      start_date: formatDateTime(formData.start_date),
      end_date: formatDateTime(formData.end_date),
      slots: Number(formData.slots),
      tour_description: formData.tour_description,
      package_price: Number(formData.package_price),
      available_slots: formData.available_slots ? Number(formData.available_slots) : Number(formData.slots),
      booked_slots: formData.booked_slots ? Number(formData.booked_slots) : 0,
      source_start_at: formatDateTime(formData.source_start_at),
      destination_end_at: formatDateTime(formData.destination_end_at),
      source_start_place: formData.source_start_place,
      destination_end_place: formData.destination_end_place,
      days_count: Number(formData.days_count),
      nights_count: Number(formData.nights_count),
      emi_per_month: Number(formData.emi_per_month),
      tour_image_url: formData.tour_image_url,
      tour_images: formData.tour_images,
      tourjsondata: formData.tourjsondata,
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

  const handleMultipleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Check file sizes
    const oversizedFiles = files.filter(file => file.size > 2 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      addToast(`${oversizedFiles.length} image(s) are too large. Please select files smaller than 2MB.`, "error");
      return;
    }

    setUploading(true);
    const readers = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers)
      .then(results => {
        setFormData(prev => ({
          ...prev,
          tour_images: [...(prev.tour_images || []), ...results]
        }));
        setUploading(false);
        e.target.value = ""; // Reset input
        addToast(`${results.length} image(s) uploaded successfully`, "success");
      })
      .catch(() => {
        addToast("Failed to read some files.", "error");
        setUploading(false);
      });
  };

  const handleCreateClick = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleEditClick = (tour) => {
    // Helper to convert yyyy-mm-dd (or ISO) to dd-mm-yyyy
    const toDDMMYYYY = (isoStr) => {
      if (!isoStr) return "";
      const datePart = isoStr.split("T")[0]; // yyyy-mm-dd
      const [y, m, d] = datePart.split("-");
      return `${d}-${m}-${y}`;
    };

    setFormData({
      ...tour,
      tour_id: tour.tour_id?.toString() || "",
      slots: tour.slots?.toString() || "",
      package_price: tour.package_price?.toString() || "",
      available_slots: tour.available_slots?.toString() || "",
      booked_slots: tour.booked_slots?.toString() || "",
      days_count: tour.days_count?.toString() || "",
      nights_count: tour.nights_count?.toString() || "",
      emi_per_month: tour.emi_per_month?.toString() || "",
      tour_image_url: tour.tour_image_url || "",
      tour_images: tour.tour_images || [],
      start_date: toDDMMYYYY(tour.start_date),
      end_date: toDDMMYYYY(tour.end_date),
      source_start_at: toDDMMYYYY(tour.source_start_at),
      destination_end_at: toDDMMYYYY(tour.destination_end_at),
      tour_description: tour.tour_description || "",
      source_start_place: tour.source_start_place || "",
      destination_end_place: tour.destination_end_place || "",
      tourjsondata: tour.tourjsondata || { activities: [], guide: "", hotel: "" },
    });
    setIsEdit(true);
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setFormData({
      id: null,
      tour_id: "",
      tour_name: "",
      tour_code: "",
      slots: "",
      tour_description: "",
      package_price: "",
      emi_per_month: "",
      available_slots: "",
      booked_slots: "",
      start_date: getTodayDDMMYYYY(),
      end_date: getTodayDDMMYYYY(),
      source_start_at: getTodayDDMMYYYY(),
      destination_end_at: getTodayDDMMYYYY(),
      source_start_place: "",
      destination_end_place: "",
      days_count: "",
      nights_count: "",
      tour_image_url: "",
      tour_images: [],
      tourjsondata: {
        activities: [],
        guide: "",
        hotel: ""
      }
    });
    setIsEdit(false);
  };

  const handleDateChange = (e, fieldName) => {
    let val = e.target.value.replace(/[^0-9]/g, ""); // Only numbers
    if (val.length > 8) val = val.slice(0, 8); // Max 8 digits (ddmmyyyy)

    // Masking logic
    let formatted = val;
    if (val.length > 4) {
      formatted = `${val.slice(0, 2)}-${val.slice(2, 4)}-${val.slice(4)}`;
    } else if (val.length > 2) {
      formatted = `${val.slice(0, 2)}-${val.slice(2)}`;
    }

    setFormData({ ...formData, [fieldName]: formatted });
  };

  const handlePickerChange = (e, fieldName) => {
    // Picker returns yyyy-mm-dd
    const val = e.target.value;
    if (!val) return;
    const [y, m, d] = val.split("-");
    const formatted = `${d}-${m}-${y}`;
    setFormData({ ...formData, [fieldName]: formatted });
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

      {filteredTours.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
             <div className="bg-gray-50 p-6 rounded-full mb-4">
                 <FiInbox className="w-10 h-10 text-gray-400" />
             </div>
             <h3 className="text-lg font-medium text-gray-900">No records found</h3>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        {filteredTours.map((tour) => (
          <div
            key={tour.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex flex-col"
          >
            <div className="flex gap-3">
              <div className="w-[60%] h-[80px] rounded-lg overflow-hidden">
                <TourImage
                  key={tour.tour_images?.[0] || tour.tour_image_url}
                  src={tour.tour_images?.[0] || tour.tour_image_url}
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

            <div className="mt-3 grid grid-cols-2 gap-3 mt-auto">
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
      )}

      {/* ================= PAGINATION CONTROLS ================= */}
      {filteredTours.length > 0 && (
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
      )}

      {/* CREATE TOUR MODAL */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 -top-6"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white w-[95%] sm:max-w-md rounded-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {isEdit ? "Edit Tour" : "Create New Tour"}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSaveTour} className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
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
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="dd-mm-yyyy"
                      maxLength={10}
                      value={formData.start_date}
                      onChange={(e) => handleDateChange(e, "start_date")}
                      className="w-full border rounded-lg p-2 text-sm pr-8 bg-transparent"
                      required
                    />
                    {/* Hidden Date Input for Picker */}
                    <input
                      type="date"
                      className="absolute inset-0 opacity-0 pointer-events-none w-0 h-0"
                      id="picker-start_date"
                      onChange={(e) => handlePickerChange(e, "start_date")}
                    />
                    <FiCalendar
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                      onClick={() => document.getElementById("picker-start_date")?.showPicker()}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500">End Date</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="dd-mm-yyyy"
                      maxLength={10}
                      value={formData.end_date}
                      onChange={(e) => handleDateChange(e, "end_date")}
                      className="w-full border rounded-lg p-2 text-sm pr-8 bg-transparent"
                      required
                    />
                    <input
                      type="date"
                      className="absolute inset-0 opacity-0 pointer-events-none w-0 h-0"
                      id="picker-end_date"
                      onChange={(e) => handlePickerChange(e, "end_date")}
                    />
                    <FiCalendar
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                      onClick={() => document.getElementById("picker-end_date")?.showPicker()}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500">Source Start At</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="dd-mm-yyyy"
                      maxLength={10}
                      value={formData.source_start_at}
                      onChange={(e) => handleDateChange(e, "source_start_at")}
                      className="w-full border rounded-lg p-2 text-sm pr-8 bg-transparent"
                    />
                    <input
                      type="date"
                      className="absolute inset-0 opacity-0 pointer-events-none w-0 h-0"
                      id="picker-source_start_at"
                      onChange={(e) => handlePickerChange(e, "source_start_at")}
                    />
                    <FiCalendar
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                      onClick={() => document.getElementById("picker-source_start_at")?.showPicker()}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500">Destination End At</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="dd-mm-yyyy"
                      maxLength={10}
                      value={formData.destination_end_at}
                      onChange={(e) => handleDateChange(e, "destination_end_at")}
                      className="w-full border rounded-lg p-2 text-sm pr-8 bg-transparent"
                    />
                    <input
                      type="date"
                      className="absolute inset-0 opacity-0 pointer-events-none w-0 h-0"
                      id="picker-destination_end_at"
                      onChange={(e) => handlePickerChange(e, "destination_end_at")}
                    />
                    <FiCalendar
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                      onClick={() => document.getElementById("picker-destination_end_at")?.showPicker()}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500">Source Start Place</label>
                  <input
                    name="source_start_place"
                    placeholder="Source Start Place"
                    value={formData.source_start_place}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500">Destination End Place</label>
                  <input
                    name="destination_end_place"
                    placeholder="Destination End Place"
                    value={formData.destination_end_place}
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


                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500">Activities (comma-separated)</label>
                  <input
                    name="activities"
                    placeholder="Desert Safari, Burj Khalifa, etc."
                    value={Array.isArray(formData.tourjsondata?.activities) ? formData.tourjsondata.activities.join(', ') : ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      tourjsondata: {
                        ...formData.tourjsondata,
                        activities: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                      }
                    })}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500">Guide Name</label>
                  <input
                    name="guide"
                    placeholder="John Doe"
                    value={formData.tourjsondata?.guide || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      tourjsondata: {
                        ...formData.tourjsondata,
                        guide: e.target.value
                      }
                    })}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500">Hotel Name</label>
                  <input
                    name="hotel"
                    placeholder="JW Marriott"
                    value={formData.tourjsondata?.hotel || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      tourjsondata: {
                        ...formData.tourjsondata,
                        hotel: e.target.value
                      }
                    })}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>

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
                    <div className="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100 hover:border-indigo-400 transition-all group">
                      <img
                        src={formData.tour_image_url}
                        alt="Main Tour Image"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, tour_image_url: "" }))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity shadow-lg"
                        title="Remove image"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500">Tour Description</label>
                  <textarea
                    name="tour_description"
                    placeholder="Describe the tour..."
                    value={formData.tour_description}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 text-sm"
                    rows="3"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500">Tour Images</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => document.getElementById('tour-images-input').click()}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold border flex items-center justify-center gap-2 transition-colors ${uploading
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                        }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {uploading ? "Uploading..." : "Upload Images"}
                    </button>
                    <input
                      id="tour-images-input"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleFileUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Select multiple images (max 2MB each)</p>
                  {formData.tour_images && formData.tour_images.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-3">
                      {formData.tour_images.map((imgUrl, idx) => (
                        <div key={idx} className="relative group">
                          <div className="relative w-full h-24 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100 hover:border-indigo-400 transition-all">
                            <img
                              src={imgUrl}
                              alt={`Tour ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                tour_images: prev.tour_images.filter((_, i) => i !== idx)
                              }))}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity shadow-lg"
                              title="Remove image"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 text-center truncate">Image {idx + 1}</p>
                        </div>
                      ))}
                    </div>
                  )}
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
