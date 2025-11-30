import { useState } from "react";
import Completed from "./Completed";
import Cancelled from "./Cancelled";
import AppointmentDetails from "./AppointmentDetails";
import All from "./All";
import Approved from "./Approved";
import Pending from "./Pending";
import SectionTitle from "@/common/SectionTitle";
import { Plus } from "lucide-react";

const BookingManagement = () => {
  const [activeTab, setActiveTab] = useState<
    | "All"
    | "Approved"
    | "Completed"
    | "Pending"
    | "Cancelled"
    | "AppointmentDetails"
  >("All");

  // Updated Tabs
  const tabs = [
    { id: "All", label: "All" },
    { id: "Approved", label: "Approved" },
    { id: "Completed", label: "Completed" },
    { id: "Pending", label: "Pending" },
    { id: "Cancelled", label: "Cancelled" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "All":
        return <All onViewDetails={() => setActiveTab("AppointmentDetails")} />;
      case "Approved":
        return (
          <Approved onViewDetails={() => setActiveTab("AppointmentDetails")} />
        );
      case "Completed":
        return (
          <Completed onViewDetails={() => setActiveTab("AppointmentDetails")} />
        );
      case "Pending":
        return (
          <Pending onViewDetails={() => setActiveTab("AppointmentDetails")} />
        );
      case "Cancelled":
        return (
          <Cancelled onViewDetails={() => setActiveTab("AppointmentDetails")} />
        );
      case "AppointmentDetails":
        return <AppointmentDetails />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <SectionTitle
          title="Appointments Management"
          description="View and manage all clinic appointments"
        />
        {/* Add Doctor Button */}
        <button className="w-full cursor-pointer sm:w-auto flex items-center justify-center sm:justify-start gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-xs md:text-sm font-medium shadow-sm transition">
          <Plus size={16} />
          Add New Appointment
        </button>
      </div>
      <div className="mx-auto mt-10 w-full space-y-6">
        {/* Header */}

        {/* Tabs Header - Smaller buttons */}
        {activeTab !== "AppointmentDetails" && (
          <div className="w-full bg-[#F5F6F9] border border-[#DBE0E5] rounded-xl overflow-hidden flex flex-wrap gap-2 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 cursor-pointer py-2 text-sm font-medium rounded-lg transition-all duration-300
                ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white shadow-md font-semibold"
                    : "text-gray-600 hover:bg-blue-50"
                }`}
              >
                {tab.label}
                {tab.id === "Approved" && " (2)"}
                {tab.id === "Completed" && " (4)"}
                {tab.id === "Pending" && " (2)"}
                {tab.id === "Cancelled" && " (1)"}
              </button>
            ))}
          </div>
        )}

        {/* Tab Content */}
        <div className="w-full">{renderContent()}</div>
      </div>
    </div>
  );
};

export default BookingManagement;
