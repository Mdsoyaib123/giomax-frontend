/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import SectionTitle from "@/common/SectionTitle";
import { Plus, X, Check, User, ChevronLeft, ChevronRight } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import { getStatusColor } from "@/utils/utfuntion";
import sitescope from "../../../assets/icons/sitescope.svg";
import { AppointmentSkeleton } from "@/components/Skeleton/AppointmentSkliton";
import { AppointmentDetailsModal } from "./AppointmentDetailsModal";
import { Appointment } from "@/redux/features/doctorAppoinment/getAllAppointmet.type";
import {
  useClinicDoctorAllAppointmentsQuery,
  useCreateDoctorAppointmentMutation,
} from "@/redux/features/doctorAppoinment/doctorAppoinmentApi";
import { useGetAllPatientsQuery } from "@/redux/features/patients/patientsApi";
import {
  useGetAllDoctorsQuery,
  useGetSignalClinicQuery,
} from "@/redux/features/doctors/doctorsApi";
import { useAppSelector } from "@/redux/hooks/redux-hook";
import { toast } from "sonner";
import { useSingleClinicId } from "@/hooks/userClinicId";

const ITEMS_PER_PAGE = 12; // You can adjust this number based on your needs

const BookingManagement = () => {
  const [activeTab, setActiveTab] = useState<
    | "All"
    | "Approved"
    | "Completed"
    | "Pending"
    | "Cancelled"
    | "AppointmentDetails"
  >("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const userId = useAppSelector((state) => state.auth.user?.id);

  const { data: clinicData } = useGetSignalClinicQuery(userId!, {
    skip: !userId,
  });
  const { clinicId } = useSingleClinicId();
  console.log(clinicId);

  const { data: patientsData, isLoading: isLoadingPatient } =
    useGetAllPatientsQuery();
  const { data: doctorsData, isLoading: isLoadingDoctors } =
    useGetAllDoctorsQuery();
  console.log("object", patientsData, doctorsData);
  const { data, isLoading, isFetching } = useClinicDoctorAllAppointmentsQuery(
    activeTab === "All" ? "" : activeTab
  );
  const [createDoctorAppointment, { isLoading: isCreating }] =
    useCreateDoctorAppointmentMutation();
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    prefarenceDate: "",
    reasonForVisit: "",
    prefarenceTime: "",
    visitingType: "",
    serviceType: "",
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

  // Calculate pagination
  const appointments = data?.data || [];
  const totalAppointments = appointments.length;
  const totalPages = Math.ceil(totalAppointments / ITEMS_PER_PAGE);

  // Get current page appointments
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAppointments = appointments.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset page when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as typeof activeTab);
    setCurrentPage(1);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateBooking = async () => {
    if (
      !formData.patientId ||
      !formData.doctorId ||
      !formData.prefarenceDate ||
      !formData.reasonForVisit ||
      !formData.prefarenceTime ||
      !formData.visitingType ||
      !formData.serviceType
    ) {
      toast.error("Please fill in all the required fields.");
      return;
    }
    try {
      await createDoctorAppointment({
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        clinicId: clinicId,
        prefarenceDate: formData.prefarenceDate,
        reasonForVisit: formData.reasonForVisit,
        prefarenceTime: formData.prefarenceTime,
        visitingType: formData.visitingType,
        serviceType: formData.serviceType,
      }).unwrap();
      setShowAppointmentDialog(false);
      setShowSuccessDialog(true);
      setShowAppointmentDialog(true);
    } catch (error: any) {
      toast.error(error.data.message);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
    console.log("formDAta", formData);
    setFormData({
      patientId: "",
      prefarenceDate: "",
      reasonForVisit: "",
      prefarenceTime: "",
      serviceType: "",
      doctorId: "",
      visitingType: "",
    });
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of visible page range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at the beginning
      if (currentPage <= 2) {
        end = 4;
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pageNumbers.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always show last page if there's more than 1 page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
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
                onClick={() => handleTabChange(tab.id)}
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
          {isLoading || isFetching ? (
            Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <AppointmentSkeleton key={i} />
            ))
          ) : currentAppointments.length > 0 ? (
            currentAppointments.map((appointment: any) => (
              <div
                onClick={() => {
                  setSelectedAppointment(appointment);
                  setShowDetailsModal(true);
                }}
                key={appointment._id}
                className="bg-white border border-[#DBE0E5] rounded-xl p-5 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              >
                {/* Header with patient info and status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 ">
                    {appointment?.patientId?.userId?.profileImage ? (
                      <img
                        src={appointment?.patientId?.userId?.profileImage}
                        alt=""
                        className="size-14 rounded-lg"
                      />
                    ) : (
                      <div className="size-14 flex items-center justify-center bg-[#2E6FF3] rounded-lg ">
                        <User size={20} className="text-white" />
                      </div>
                    )}
                    <div className="flex flex-col items-start gap-2 h-full justify-between ">
                      <h3 className="font-semibold text-gray-900">
                        {appointment.patientId?.userId.fullName || "N/A"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {appointment?.serviceType}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span
                      className={`px-3 py-2 capitalize rounded-full text-xs font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                    <div className="text-sm">
                      <span className="text-[#1D4ED8]">
                        {appointment.visitingType}
                      </span>
                    </div>
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
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No appointments found
            </div>
          )}
        </div>

        {/* Pagination Component */}
        {totalAppointments > ITEMS_PER_PAGE && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
            {/* Items per page info */}
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, totalAppointments)} of {totalAppointments}{" "}
              appointments
            </div>

            {/* Pagination controls */}
            <div className="flex items-center space-x-2">
              {/* Previous button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border ${
                  currentPage === 1
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                }`}
              >
                <ChevronLeft size={20} />
              </button>

              {/* Page numbers */}
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      typeof page === "number" && handlePageChange(page)
                    }
                    className={`min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition-colors ${
                      page === currentPage
                        ? "bg-blue-500 text-white"
                        : page === "..."
                        ? "text-gray-400 cursor-default"
                        : "text-gray-700 hover:bg-gray-100 border border-gray-300 cursor-pointer"
                    }`}
                    disabled={page === "..."}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border ${
                  currentPage === totalPages
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add New Appointment Dialog */}
      {showAppointmentDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[0.2px] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
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
                  <select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
             focus:outline-none focus:ring-2 focus:ring-blue-500
             disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    {isLoadingPatient ? (
                      <option>Loading patients...</option>
                    ) : (
                      <>
                        <option value="">Select patient</option>
                        {patientsData?.data?.map((patient) => (
                          <option key={patient._id} value={patient?._id ?? ""}>
                            {patient?.userId?.fullName}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visiting Type <span className="text-red-500">*</span>
                  </label>

                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    name="visitingType"
                    value={formData.visitingType}
                    onChange={handleInputChange}
                  >
                    <option value="fristVisit">First Visit</option>
                    <option value="followUp">Walk-in</option>
                  </select>
                </div>

                {/* Phone Number */}

                {/* Select Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="prefarenceDate"
                    value={formData.prefarenceDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  />
                </div>

                {/* Service */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason For Visit <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="reasonForVisit"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter Reason For Visit"
                    value={formData.reasonForVisit}
                    onChange={handleInputChange}
                    type="text"
                  />
                </div>

                {/* Select Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="prefarenceTime"
                    value={formData.prefarenceTime}
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
                    <option value="inClinic">Clinic Visit</option>
                    <option value="online">Online</option>
                  </select>
                </div>

                {/* Select Doctor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Doctor <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer appearance-none bg-white"
                  >
                    {isLoadingDoctors ? (
                      <option>Loading doctors...</option>
                    ) : (
                      <>
                        <option value="">Select Doctor</option>
                        {doctorsData?.data.map((doctor) => (
                          <option key={doctor._id} value={doctor._id}>
                            {doctor?.userId?.fullName || "unknown"}
                          </option>
                        ))}
                      </>
                    )}
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
                  {isCreating ? "Creating..." : "Create Appointment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          open={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
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
