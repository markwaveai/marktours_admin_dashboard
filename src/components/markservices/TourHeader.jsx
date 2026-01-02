import { NavLink } from "react-router-dom";

const tabs = [
  { label: "Holiday Packages", path: "/tour-services" },
  { label: "Air Ticketing", path: "/tour-services/air" },
  { label: "Visas", path: "/tour-services/visa" },
  { label: "Cruise Holidays", path: "/tour-services/cruise" },
  { label: "Hotels & Resort Planning", path: "/tour-services/hotels" },
];

export default function TourHeader() {
  return (
    <>
      <div className="text-center mb-8">
        <p className="text-sm text-gray-500">Modern & Beautiful</p>
        <h2 className="text-2xl md:text-3xl font-bold">
          MARK TOURS SERVICES
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {tabs.map((tab, i) => (
          <NavLink
            key={i}
            to={tab.path}
            end
            className={({ isActive }) =>
              `px-6 py-2 rounded-full border text-sm transition ${
                isActive
                  ? "bg-white shadow font-semibold"
                  : "bg-gray-100 hover:bg-white"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </>
  );
}
