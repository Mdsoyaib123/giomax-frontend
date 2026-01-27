/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClinicDoctorAllAppointmentsQuery } from "@/redux/features/doctorAppoinment/doctorAppoinmentApi";
import { useDoctorAppointmentStatusUpdateMutation } from "@/redux/features/doctorAppoinment/doctorAppoinmentApi";
import { useSingleClinicId } from "@/hooks/userClinicId";

interface Appointment {
  _id: string;
  patientId: {
    _id: string;
    userId: {
      _id: string;
      fullName: string;
      email: string;
      role: string;
      profileImage?: string;
    } | string; // userId can be a string ID or an object
    gender: string;
    bloodGroup: string;
    age: number;
    email?: string; // Fallback email if directly on patientId
    fullName?: string; // Fallback name if directly on patientId
  } | null;
  doctorId: {
    _id: string;
    userId: {
      _id: string;
      fullName: string;
      role: string;
    } | string | null;
  };
  clinicId: string;
  serviceType: string;
  visitingType: string;
  reasonForVisit: string;
  followUpDetails: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
  prefarenceDate: string;
  prefarenceTime: string;
  appoinmentFee: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Booking {
  id: string;
  patientName: string;
  doctorName: string;
  note: string;
  type: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed" | "Rejected";
  dateTime: string;
  payment: string;
  fee: number;
  bloodGroup?: string;
  gender?: string;
  age?: number;
  reasonForVisit: string;
  patientEmail: string;
  appointmentId: string; // Add original appointment ID
}

const ClinicBookingManagementTable: React.FC = () => {
  const [openProfile, setOpenProfile] = useState<Booking | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<string>("all");
  const itemsPerPage = 6;
  const { clinicId, isLoading: isClinicIdLoading } = useSingleClinicId();
  const {
    data: apiData,
    isLoading,
    refetch,
  } = useClinicDoctorAllAppointmentsQuery(
    { id: clinicId, status: " " },
    { skip: !clinicId }
  );
  const [doctorAppointmentStatusUpdate, { isLoading: isUpdating }] =
    useDoctorAppointmentStatusUpdateMutation();

  // Transform API data to Booking format
  const transformAppointmentsToBookings = (
    appointments: Appointment[] = []
  ): Booking[] => {
    // Filter out appointments where patientId is null or doctorId.userId is null
    const validAppointments = appointments

    return validAppointments.map((appointment) => {
      const patient = appointment.patientId;
      const patientUser = typeof patient?.userId === "object" ? patient.userId : null;
      
      const doctor = appointment.doctorId;
      const doctorUser = typeof doctor?.userId === "object" ? doctor.userId : null;

      return {
        id: appointment._id.substring(appointment._id.length - 6).toUpperCase(),
        patientName: patientUser?.fullName || patient?.fullName || "Unknown Patient",
        doctorName: doctorUser?.fullName || "Unknown Doctor",
        note: appointment.reasonForVisit,
        type: appointment.serviceType === "inClinic" ? "In-Clinic" : "Online",
        status: (appointment.status.charAt(0).toUpperCase() +
          appointment.status.slice(1)) as
          | "Pending"
          | "Confirmed"
          | "Completed"
          | "Cancelled"
          | "Rejected",
        dateTime: `${appointment.prefarenceDate}, ${appointment.prefarenceTime}`,
        payment:
          appointment.appoinmentFee > 0
            ? `₾ ${appointment.appoinmentFee.toFixed(2)}`
            : "Free",
        fee: appointment.appoinmentFee,
        bloodGroup: patient?.bloodGroup,
        gender: patient?.gender,
        age: patient?.age,
        reasonForVisit: appointment.reasonForVisit,
        patientEmail: patientUser?.email || patient?.email || "N/A",
        appointmentId: appointment._id, // Store the original appointment ID
      };
    });
  };

  // Get appointments from API response
  const appointments = apiData?.data || [];
  const allBookings = transformAppointmentsToBookings(appointments);

  // Filter bookings by type
  const filteredBookings =
    selectedType === "all"
      ? allBookings
      : allBookings.filter((booking) =>
          selectedType === "online"
            ? booking.type === "Online"
            : selectedType === "offline"
            ? booking.type === "In-Clinic"
            : allBookings
        );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = filteredBookings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleView = (booking: Booking) => {
    setOpenProfile(booking);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleStatusChange = async (
    appointmentId: string,
    newStatus: string
  ) => {
    try {
      const result = await doctorAppointmentStatusUpdate({
        id: appointmentId,
        status: newStatus,
      }).unwrap();
      toast.success(`Appointment ${newStatus} successfully!`);
      console.log("Status updated successfully:", result);

      // Close the modal
      setOpenProfile(null);

      // Refresh the appointments list
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status!");
      console.error("Failed to update status:", error);
    }
  };

  const handleAccept = () => {
    if (openProfile) {
      handleStatusChange(openProfile.appointmentId, "confirmed");
    }
  };

  const handleReject = () => {
    if (openProfile) {
      handleStatusChange(openProfile.appointmentId, "rejected");
    }
  };

  // Loading state
  if (isLoading || isClinicIdLoading) {
    return (
      <div className="rounded-xl border border-[#DBE0E5] bg-white shadow-sm p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="rounded-xl border border-[#DBE0E5] bg-white shadow-sm p-6">
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            {/* Left Section - Title */}
            <h2 className="text-lg md:text-xl font-semibold text-[#343A40]">
              Recent Bookings ({filteredBookings.length})
            </h2>

            {/* Right Section - Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Filter - Type */}
              <div className="w-full sm:w-[250px] md:w-[220px]">
                <Select value={selectedType} onValueChange={handleTypeChange}>
                  <SelectTrigger className="w-full h-10 border border-[#B3B3B3] rounded-xl px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm flex items-center justify-between hover:border-gray-400 transition-all duration-200 cursor-pointer">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[#B3B3B3] rounded-md shadow-md">
                    <SelectGroup>
                      <SelectLabel className="px-4 pt-2 text-gray-500 text-sm">
                        Type
                      </SelectLabel>
                      <SelectItem
                        value="all"
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                      >
                        All Type
                      </SelectItem>
                      <SelectItem
                        value="online"
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                      >
                        Online
                      </SelectItem>
                      <SelectItem
                        value="offline"
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                      >
                        In-Clinic
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="p-5 border border-[#E4E4E4] rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 gap-5">
            <div className="xl:col-span-4 w-full">
              {/* Table */}
              <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-[800px] w-full text-sm">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Booking ID
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Patient Name
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Doctor Name
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Payment
                      </th>
                      <th className="px-6 py-4 text-center font-medium text-gray-700 whitespace-nowrap">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentBookings.length > 0 ? (
                      currentBookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                            BK-{booking.id}
                          </td>
                          <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                            {booking.patientName}
                          </td>
                          <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                            {booking.doctorName}
                          </td>
                          <td className="px-6 py-4 text-sky-500 whitespace-nowrap">
                            {booking.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                booking.status === "Confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : booking.status === "Completed"
                                  ? "bg-blue-100 text-blue-700"
                                  : booking.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : booking.status === "Rejected"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                            {booking.dateTime}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                booking.fee > 0
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {booking.payment}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleView(booking)}
                              className="inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-md bg-[#2E6FF3] text-white text-xs hover:bg-[#1B54D3] transition"
                            >
                              <FaEye className="text-sm" /> View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No appointments found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {filteredBookings.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">{currentBookings.length}</span> of{" "}
              <span className="font-medium">{filteredBookings.length}</span>{" "}
              appointments
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 border rounded-lg text-sm ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                Prev
              </button>
              <div className="min-w-[50px] text-center border px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 bg-gray-50">
                {currentPage} / {totalPages}
              </div>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 border rounded-lg text-sm ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Patient Profile Dialog */}
      {openProfile && (
        <div className="fixed px-3 sm:px-4 inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-0.9">
          <div className="bg-white rounded-lg w-full max-w-5xl shadow-2xl p-8 relative border border-gray-300 transform scale-100 transition-transform duration-200">
            {/* Close Icon */}
            <button
              onClick={() => setOpenProfile(null)}
              className="absolute cursor-pointer top-4 right-4 text-gray-600 hover:text-gray-800 hover:scale-110 transition-transform"
              disabled={isUpdating}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-[#1f3a44] mb-2">
              Appointment Details
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Complete information about this Appointment
            </p>

            {/* Input Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={openProfile.patientName}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={openProfile.doctorName}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Patient Age
                </label>
                <input
                  type="text"
                  value={openProfile.age || "N/A"}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Patient Gender
                </label>
                <input
                  type="text"
                  value={
                    openProfile.gender
                      ? openProfile.gender.charAt(0).toUpperCase() +
                        openProfile.gender.slice(1)
                      : "N/A"
                  }
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Blood Group
                </label>
                <input
                  type="text"
                  value={openProfile.bloodGroup || "N/A"}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>
              {/* <div>
                <label className="block text-gray-700 font-medium mb-1">
                Patient Email
                </label>
                <input
                  type="text"
                  value={openProfile.patientEmail || "N/A"}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div> */}

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Appointment Type
                </label>
                <input
                  type="text"
                  value={openProfile.type}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Date & Time
                </label>
                <input
                  type="text"
                  value={openProfile.dateTime}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Appointment Fee
                </label>
                <input
                  type="text"
                  value={openProfile.payment}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-1">
                  Reason for Visit
                </label>
                <textarea
                  value={openProfile.reasonForVisit}
                  readOnly
                  rows={3}
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54] resize-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Appointment Status
                </label>
                <input
                  type="text"
                  value={openProfile.status}
                  readOnly
                  className={`w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54] ${
                    openProfile.status === "Confirmed"
                      ? "text-green-600"
                      : openProfile.status === "Pending"
                      ? "text-yellow-600"
                      : openProfile.status === "Completed"
                      ? "text-blue-600"
                      : openProfile.status === "Rejected"
                      ? "text-red-600"
                      : "text-red-600"
                  }`}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Payment Status
                </label>
                <input
                  type="text"
                  value={openProfile.fee > 0 ? "Paid" : "Free"}
                  readOnly
                  className={`w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54] ${
                    openProfile.fee > 0 ? "text-green-600" : "text-blue-600"
                  }`}
                />
              </div>
            </div>

            {/* Action Buttons - Only show for pending appointments */}
            {openProfile.status === "Pending" && (
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mx-auto mt-4">
                <button
                  onClick={handleReject}
                  disabled={isUpdating}
                  className={`w-full md:w-[492px] cursor-pointer h-[40px] rounded-md bg-[#FFEAEB] text-red-500 font-medium hover:bg-red-500 hover:text-white transition-colors ${
                    isUpdating ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUpdating ? "Processing..." : "Reject"}
                </button>

                <button
                  onClick={handleAccept}
                  disabled={isUpdating}
                  className={`w-full md:w-[492px] h-[40px] cursor-pointer rounded-md bg-[#1B9268] text-white font-medium hover:bg-green-600 transition-colors ${
                    isUpdating ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUpdating ? "Processing..." : "Accept"}
                </button>
              </div>
            )}

            {/* Show completed/cancelled status message */}
            {openProfile.status !== "Pending" && (
              <div className="mt-4 text-center">
                <p
                  className={`text-sm font-medium ${
                    openProfile.status === "Confirmed"
                      ? "text-green-600"
                      : openProfile.status === "Completed"
                      ? "text-blue-600"
                      : openProfile.status === "Rejected"
                      ? "text-red-600"
                      : "text-red-600"
                  }`}
                >
                  This appointment is already {openProfile.status.toLowerCase()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicBookingManagementTable;
