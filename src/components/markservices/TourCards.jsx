import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faPlane,
  faStar,
  faCar,
} from "@fortawesome/free-solid-svg-icons";

import singapore from "/assets/packages/singpoor.png";
import malaysia from "/assets/packages/malasiyaaa.png";
import bali from "/assets/packages/bali.png";
import thailand from "/assets/packages/thailand.png";
import srilanka from "/assets/packages/srilanka.png";
import dubai from "/assets/packages/dubhai.png";

import BookNowButton from "../BookNowButton";
import BookingModal from "../BookingModal";

const packages = [
  { name: "Singapore", image: singapore },
  { name: "Malaysia", image: malaysia },
  { name: "Bali", image: bali },
  { name: "Thailand", image: thailand },
  { name: "Srilanka", image: srilanka },
  { name: "Dubai", image: dubai },
];

export default function TourCards() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      {/*  INLINE CSS — SHIMMER FIRST, THEN ZOOM */}
      <style>{`
        @keyframes loop-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .animate-loop {
          animation: loop-scroll 30s linear infinite;
        }

        /* SHIMMER */
        @keyframes shimmer-down {
          0% { transform: translateY(-120%); opacity: 0; }
          30% { opacity: 0.6; }
          60% { opacity: 0.4; }
          100% { transform: translateY(120%); opacity: 0; }
        }

        .shimmer-layer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.35) 40%,
            rgba(255,255,255,0.6) 50%,
            rgba(255,255,255,0.35) 60%,
            rgba(255,255,255,0) 100%
          );
          transform: translateY(-120%);
          pointer-events: none;
          filter: blur(6px);
        }

        .card:hover .shimmer-layer {
          animation: shimmer-down 1.4s cubic-bezier(0.4,0,0.2,1);
        }

        /* IMAGE ZOOM AFTER SHIMMER */
        .card img {
          transform: scale(1);
          transition: transform 1.2s cubic-bezier(0.4,0,0.2,1);
        }

        .card:hover img {
          transition-delay: 1.4s; /* ⏳ wait till shimmer ends */
          transform: scale(1.12);
        }

        .card:not(:hover) img {
          transition-delay: 0s;
          transform: scale(1);
        }
      `}</style>

      {/* 🌫 GLASS CONTAINER */}
      <div className="relative rounded-[32px] px-6 md:px-10 py-12
        bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">

        {/*  INFINITE SCROLL */}
        <div className="overflow-hidden">
          <div className="flex gap-4 w-fit animate-loop">

            {[...packages, ...packages].map((item, i) => (
              <div
                key={i}
                className="card relative min-w-[240px] h-[340px]
                rounded-[28px] overflow-hidden shadow-xl
                bg-white/10 backdrop-blur-lg border border-white/20"
              >
                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-black/30 z-[1]" />

                {/*  SHIMMER */}
                <div className="shimmer-layer z-[3]" />

                {/* TITLE */}
                <div className="absolute inset-0 flex items-center justify-center z-[4]">
                  <h3 className="text-white text-2xl font-bold drop-shadow-lg">
                    {item.name}
                  </h3>
                </div>

                {/* ICON INFO */}
                <div className="absolute bottom-6 left-0 right-0 px-4 z-[4]">
                  <div className="flex justify-between text-white text-[11px]">
                    <div className="flex flex-col items-center gap-1">
                      <FontAwesomeIcon icon={faClock} />
                      <span>2N / 3D</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <FontAwesomeIcon icon={faPlane} />
                      <span>Flight</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <FontAwesomeIcon icon={faStar} />
                      <span>Hotels</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <FontAwesomeIcon icon={faCar} />
                      <span>Transport</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* BOOK NOW */}
        <div className="flex justify-center mt-12">
          <BookNowButton
            variant="yellow"
            className="px-12 py-3 text-base rounded-full"
            onClick={() => setOpenModal(true)}
          />
        </div>
      </div>

      <BookingModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}
