import visaImg from "/assets/images/visas.png"; 
export default function Visas() {
  return (
    <div className="w-full rounded-[28px] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between  border">

      {/* LEFT CONTENT */}
      <div className="max-w-xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Visa Assistance
        </h2>

        <p className="text-sm leading-relaxed text-black/90 mb-6">
          Planning your dream trip is exciting, but visa paperwork can feel confusing. 
          Our Visa Assistance team helps you understand requirements, prepare documents, 
          and submit your application correctly for a smooth approval process.
        </p>

        <h4 className="font-semibold mb-3">
          What we help with
        </h4>

        <ul className="space-y-2 text-sm text-black/90 list-disc list-inside">
          <li>Tourist, business, and visitor visa guidance as per the rules of each destination</li>
          <li>Personalized document checklist (passport, photos, bank statements, itinerary)</li>
          <li>Hotel bookings, insurance, and travel tickets</li>
          <li>Form filling support, appointment scheduling, and updates on processing times</li>
          <li>We work hard to remove stress from your travel experience</li>
        </ul>

        <p className="mt-6 text-xs text-black/80">
          <strong>Important notes for travelers:</strong><br />
          Apply well in advance of your travel date. Processing times vary by embassy and season.
        </p>
      </div>

      {/* RIGHT IMAGE */}
      <div className="flex-shrink-0">
        <div className="w-[260px] h-[340px] md:w-[300px] md:h-[380px] rounded-[22px] overflow-hidden shadow-lg">
          <img
            src={visaImg}
            alt="Visa Assistance"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

    </div>
  );
}
