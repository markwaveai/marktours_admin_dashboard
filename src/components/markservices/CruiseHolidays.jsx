import { useRef, useState, useEffect } from "react";
import BookNowButton from "../BookNowButton";
import BookingModal from "../BookingModal";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

const cruises = [
  {
    title: "Singapore to Bali Cruise",
    nights: "5 Nights",
    image: "/assets/cruice-holidays/holidays1.png",
  },
  {
    title: "Mumbai–Goa–Kochi Cruise",
    nights: "4 Days",
    image: "/assets/cruice-holidays/holidays2.png",
  },
  {
    title: "Dubai to Oman Adventure",
    nights: "7 Nights",
    image: "/assets/cruice-holidays/holidays3.png",
  },
  {
    title: "International Med Cruise",
    nights: "5 Nights",
    image: "/assets/cruice-holidays/holidays4.png",
  },
  {
    title: "Goa to Lakshadweep",
    nights: "3 Nights",
    image: "/assets/cruice-holidays/holidays5.png",
  },
];

export default function CruiseHolidays() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [liked, setLiked] = useState({});
  const [openModal, setOpenModal] = useState(false);

  const toggleLike = (i) => {
    setLiked((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const updateScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  const scroll = (dir) => {
    const cardWidth = scrollRef.current.clientWidth / 4;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateScroll();
    const el = scrollRef.current;
    el.addEventListener("scroll", updateScroll);
    window.addEventListener("resize", updateScroll);
    return () => {
      el.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  return (
    <div className="rounded-[28px] p-10 relative border bg-white">
      <h2 className="text-blue-700 font-semibold mb-6 ml-4">
        Cruise Holidays
      </h2>

      {/* LEFT ARROW */}
      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className={`absolute left-8 top-1/2 -translate-y-1/2 p-2 rounded-full shadow z-20
          ${
            canScrollLeft
              ? "bg-[#EDF957] text-black"
              : "bg-white text-gray-300 cursor-not-allowed"
          }`}
      >
        <ChevronLeft size={22} />
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className={`absolute right-8 top-1/2 -translate-y-1/2 p-2 rounded-full shadow z-20
          ${
            canScrollRight
              ? "bg-[#EDF957] text-black"
              : "bg-white text-gray-300 cursor-not-allowed"
          }`}
      >
        <ChevronRight size={22} />
      </button>

      {/* Cards */}
      <div ref={scrollRef} className="flex overflow-hidden">
        {cruises.map((c, i) => (
          <div key={i} className="w-1/4 px-3 flex-shrink-0">
            <div className="h-[320px] rounded-[22px] overflow-hidden relative">
              <img
                src={c.image}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />

              <span className="absolute top-3 -left-1 bg-[#EEFB56] text-xs font-semibold px-4 py-1 z-10">
                {c.nights}
              </span>

              <button
                onClick={() => toggleLike(i)}
                className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow z-10"
              >
                <Heart
                  size={16}
                  className={
                    liked[i]
                      ? "fill-red-500 text-red-500"
                      : "text-gray-500"
                  }
                />
              </button>

              <h3 className="absolute bottom-4 left-12 text-white font-semibold z-10">
                {c.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* BOOK NOW */}
      <div className="flex justify-center mt-10">
        <BookNowButton
          variant="yellow"
          onClick={() => setOpenModal(true)}
        />
      </div>

      {/* MODAL */}
      <BookingModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}
