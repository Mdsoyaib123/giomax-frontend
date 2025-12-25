/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import SectionTitle from "@/common/SectionTitle";
import { Plus, X, Check } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import { useGetAllAppointmentsQuery } from "@/redux/features/doctorAppoinment/doctorAppoinmentApi";
import { getStatusColor } from "@/utils/utfuntion";
import sitescope from "../../../assets/icons/sitescope.svg";
import { AppointmentSkeleton } from "@/components/Skeleton/AppointmentSkliton";
import { AppointmentDetailsModal } from "./AppointmentDetailsModal";
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
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { data, isLoading } = useGetAllAppointmentsQuery(
    activeTab === "All" ? "" : activeTab
  );

  console.log(data?.data);
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    phoneNumber: "",
    selectDate: "",
    service: "",
    selectTime: "",
    serviceType: "",
    selectDoctor: "",
  });

  // Updated Tabs
  const tabs = [
    { id: "All", label: "All" },
    { id: "approved", label: "Approved" },
    { id: "completed", label: "Completed" },
    { id: "pending", label: "Pending" },
    { id: "cancelled", label: "Cancelled" },
    { id: "rejected", label: "Rejected" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      selectDoctor: "",
    });
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
              </button>
            ))}
          </div>
        )}

        {/* Tab Content */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <AppointmentSkeleton key={i} />
              ))
            : data?.data.map((appointment) => (
                <AppointmentDetailsModal
                  key={appointment._id}
                  appointment={selectedAppointment}
                >
                  <div
                    onClick={() => {
                      setSelectedAppointment(appointment);
                    }}
                    className="bg-white border border-[#DBE0E5] rounded-xl p-5 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  >
                    {/* Header with patient info and status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={appointment.patientId?.userId.profileImage}
                          alt={appointment.patientId?.userId.fullName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {appointment.patientId?.userId.fullName || "N/A"}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {appointment?.serviceType}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span
                          className={`px-3 py-2 capitalize rounded-full text-xs font-medium ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>

                    {/* Appointment details */}
                    <div className="flex mb-4 items-center justify-between ">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <img src={sitescope} alt="" />
                        <span>{appointment?.doctorId?.userId?.fullName}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{appointment.prefarenceDate}</span>
                      </div>

                      <div className="flex items-center gap-2  text-sm text-gray-600">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{appointment.prefarenceTime}</span>
                      </div>
                    </div>

                    {/* Footer with visit type */}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs font-medium px-2 py-1 rounded text-blue-600 bg-blue-50">
                        {appointment.visitingType}
                      </span>
                    </div>
                  </div>
                </AppointmentDetailsModal>
              ))}
        </div>
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
                  <FaArrowLeft
                    onClick={() => setShowAppointmentDialog(false)}
                    className=" inline-block mr-2 mt-2 cursor-pointer"
                  />
                  <div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Add New Appointment
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">
                        Fill in the details to schedule a new patient
                        appointment
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
