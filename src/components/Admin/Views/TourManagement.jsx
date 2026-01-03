import { useEffect, useState } from "react";
import SkeletonLoader from "../../Common/SkeletonLoader";

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

  const fetchTours = (isInitial = false) => {
    // if (isInitial) setLoading(true); // Removed to avoid sync state update in effect
    fetch("https://marktours-services-jn6cma3vvq-el.a.run.app/tours-config")
      .then((res) => res.json())
      .then((data) => {
        setTours(data.tours || []);
        if (isInitial) setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        if (isInitial) setLoading(false);
      });
  };

  useEffect(() => {
    fetchTours(true);
  }, []);


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

    console.log("Tour Management Payload:", payload);

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
        fetchTours();
      })
      .catch((err) => {
        console.error("Save tour failed:", err);
        alert(`Failed: ${err.message}`);
      });
  };

  const handleDeleteTour = (tourCode) => {
    if (!window.confirm("Are you sure you want to delete this tour?")) return;

    fetch(`https://marktours-services-jn6cma3vvq-el.a.run.app/tours-config/${tourCode}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        fetchTours();
      })
      .catch((err) => console.error("Delete tour failed:", err));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large. Please select a file smaller than 2MB.");
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
      alert("Failed to read file.");
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
    setIsEdit(false);
  };

    if (loading) {
        return <SkeletonLoader type="card" count={6} />;
    }

    return (
        <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Tour Management</h2>
        <button
          onClick={handleCreateClick}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-indigo-700"
        >
          Create New Tour
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        {tours.map((tour) => (
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
