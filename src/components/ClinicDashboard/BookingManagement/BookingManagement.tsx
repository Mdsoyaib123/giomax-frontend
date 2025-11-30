import { useState } from "react";
import Completed from "./Completed";
import Cancelled from "./Cancelled";
import AppointmentDetails from "./AppointmentDetails";
import All from "./All";
import Approved from "./Approved";
import Pending from "./Pending";
import SectionTitle from "@/common/SectionTitle";
import { Plus, X, Check } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";

const BookingManagement = () => {
  const [activeTab, setActiveTab] = useState<
    | "All"
    | "Approved"
    | "Completed"
    | "Pending"
    | "Cancelled"
    | "AppointmentDetails"
  >("All");

  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    phoneNumber: "",
    selectDate: "",
    service: "",
    selectTime: "",
    serviceType: "",
    selectDoctor: ""
  });

  // Updated Tabs
  const tabs = [
    { id: "All", label: "All" },
    { id: "Approved", label: "Approved" },
    { id: "Completed", label: "Completed" },
    { id: "Pending", label: "Pending" },
    { id: "Cancelled", label: "Cancelled" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateBooking = () => {
    setShowAppointmentDialog(false);
    setShowSuccessDialog(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
    setFormData({
      patientName: "",
      age: "",
      phoneNumber: "",
      selectDate: "",
      service: "",
      selectTime: "",
      serviceType: "",
      selectDoctor: ""
    });
  };

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
        <button 
          onClick={() => setShowAppointmentDialog(true)}
          className="w-full cursor-pointer sm:w-auto flex items-center justify-center sm:justify-start gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-xs md:text-sm font-medium shadow-sm transition"
        >
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

      {/* Add New Appointment Dialog */}
      {showAppointmentDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[0.2px] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                {/* <button 
                  
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                 
                </button> */}
                <div className=" flex justify-start ">
                  <FaArrowLeft onClick={() => setShowAppointmentDialog(false)} className=" inline-block mr-2 mt-2 cursor-pointer" />
                   <div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Add New Appointment</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Fill in the details to schedule a new patient appointment
                  </p>
                  </div>
                </div>
                </div>
               
              </div>
              <button 
                onClick={() => setShowAppointmentDialog(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 pt-0">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Patient Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    placeholder="Enter Patient Name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Enter Age"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+880 596 123 456"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Select Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="selectDate"
                    value={formData.selectDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  />
                </div>

                {/* Service */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer appearance-none bg-white"
                  >
                    <option value="">Select Service Name</option>
                    <option value="consultation">Consultation</option>
                    <option value="checkup">Health Checkup</option>
                    <option value="vaccination">Vaccination</option>
                  </select>
                </div>

                {/* Select Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="selectTime"
                    value={formData.selectTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  />
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer appearance-none bg-white"
                  >
                    <option value="">Select Service Type</option>
                    <option value="online">Online Consultation</option>
                    <option value="clinic">Clinic Visit</option>
                    <option value="home">Home Visit</option>
                  </select>
                </div>

                {/* Select Doctor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Doctor <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="selectDoctor"
                    value={formData.selectDoctor}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer appearance-none bg-white"
                  >
                    <option value="">Select your Clinic Doctor</option>
                    <option value="dr-smith">Dr. John Smith</option>
                    <option value="dr-johnson">Dr. Sarah Johnson</option>
                    <option value="dr-williams">Dr. Michael Williams</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  onClick={() => setShowAppointmentDialog(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium cursor-pointer transition"
                >
                  Close
                </button>
                <button
                  onClick={handleCreateBooking}
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium cursor-pointer transition"
                >
                  Create New Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[0.2px] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 text-center">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <Check size={32} className="text-white" />
            </div>

            {/* Success Message */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Appointment has been created successfully
            </h3>

            {/* Back Button */}
            <button
              onClick={handleCloseSuccess}
              className="w-full mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium cursor-pointer transition"
            >
              Back to Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;