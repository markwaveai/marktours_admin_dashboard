import airplane from "/assets/packages/airplane.png";
import BookNowButton from "../BookNowButton";
export default function AirTicketing() {
  return (
    <div className="relative bg-white rounded-[32px] px-6 md:px-10 py-12 border overflow-hidden">
      <section className="w-full px-4 md:px-10 py-16">
        <div
          className="
          
          flex
          flex-col
          md:flex-row
          items-center
          justify-between
          gap-6
          
        "
        >
          {/* LEFT CONTENT */}
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-4xl font-bold text-[#4B2EFF] leading-tight">
              FLY IN STYLE ARRIVE <br /> IN COMFORT
            </h1>

            <p className="my-4 text-sm md:text-base font-semibold">
              Discover Exclusive Deals On Premium And First-Class
              Flights For Your Ultimate Travel Experience
            </p>

            <BookNowButton></BookNowButton>
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-full md:w-[45%] flex justify-center">
            <img
              src={airplane}
              alt="Airplane"
              className="w-[280px] md:w-[420px]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
