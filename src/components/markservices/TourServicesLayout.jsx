import { Outlet } from "react-router-dom";
import TourHeader from "./TourHeader";

export default function TourServicesLayout() {
  return (
    <section className="w-full px-4 md:px-10 py-16">
      <TourHeader />
      <Outlet />
    </section>
  );
}
