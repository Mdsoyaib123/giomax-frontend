import { useState } from "react";
import Cancelled from "./Cancelled";
import Upcoming from "./Upcoming";
import Completed from "./Completed";
import AppointmentDetails from "./AppointmentDetails";

const BookingManagement = () => {
  const [activeTab, setActiveTab] = useState<
    "Upcoming" | "Completed" | "Cancelled" | "AppointmentDetails"
  >("Upcoming");

  // Tabs that should appear in the header
  const tabs = [
    { id: "Upcoming", label: "Upcoming" },
    { id: "Completed", label: "Completed" },
    { id: "Cancelled", label: "Cancelled" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Upcoming":
        return <Upcoming onViewDetails={() => setActiveTab("AppointmentDetails")} />;
      case "Completed":
        return <Completed onViewDetails={() => setActiveTab("AppointmentDetails")} />;
      case "Cancelled":
        return <Cancelled onViewDetails={() => setActiveTab("AppointmentDetails")} />;
      case "AppointmentDetails":
        return <AppointmentDetails />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto mt-10 w-full space-y-6">
      {/* ===== Tabs Header ===== */}
      {activeTab !== "AppointmentDetails" && (
        <div className="w-full bg-[#F5F6F9] border border-blue-200 rounded-2xl overflow-hidden flex flex-col sm:flex-row">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`w-full sm:flex-1 cursor-pointer flex items-center justify-center gap-2 py-4 text-base font-medium transition-all duration-300
                ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white shadow-md font-semibold"
                    : "text-[#81807D] hover:bg-blue-100"
                }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ===== Tab Content ===== */}
      <div className="w-full">{renderContent()}</div>
    </div>
  );
};

export default BookingManagement;
