import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { X } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useGetNurseAppointmentsQuery,
  // useUpdateNurseAppointmentMutation,
  useCancelNurseAppointmentMutation,
  useGetNurseSingleAppointmentQuery,
  useConfirmNurseAppointmentMutation,
} from "@/redux/features/admin/nurseAppointment/nurseAppointmentApi";
import { setSelectedAppointment } from "@/redux/features/admin/nurseAppointment/nurseAppointmentSlice";
import {
  Appointment,
  AppointmentStatus,
} from "@/redux/types/admin/nurseAppointmentTypes";
import { useAppDispatch } from "@/redux/hooks/redux-hook";

const NurseAppointmentTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [showRefundSuccess, setShowRefundSuccess] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 6;

  // Get appointments from API
  const {
    data: appointmentsResponse,
    isLoading,
    error,
    refetch,
  } = useGetNurseAppointmentsQuery({
    status:
      statusFilter !== "all" ? (statusFilter as AppointmentStatus) : undefined,
  });

  // Get single appointment details
  const {
    data: singleAppointmentResponse,
    isLoading: isLoadingSingle,
    refetch: refetchSingle,
  } = useGetNurseSingleAppointmentQuery(selectedAppointmentId || "", {
    skip: !selectedAppointmentId,
  });

  // RTK Query mutations
  // const [_updateAppointment] = useUpdateNurseAppointmentMutation();
  const [cancelAppointment] = useCancelNurseAppointmentMutation();
  const [confirmAppointment] = useConfirmNurseAppointmentMutation();

  const appointmentsData = appointmentsResponse?.data || [];
  const selectedAppointment = singleAppointmentResponse?.data || null;

  // Calculate total pages and paginate data
  useEffect(() => {
    if (appointmentsData.length > 0) {
      const total = Math.ceil(appointmentsData.length / itemsPerPage);
      setTotalPages(total);
      // Reset to page 1 if current page exceeds total pages
      if (currentPage > total) {
        setCurrentPage(1);
      }
    }
  }, [appointmentsData, currentPage]);

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return appointmentsData.slice(startIndex, endIndex);
  };

  // Format date for display
  const formatDisplayDate = (dateStr: string, timeStr: string) => {
    try {
      const date = new Date(`${dateStr}T${timeStr}`);
      return format(date, "yyyy-MM-dd, hh:mm a");
    } catch (error) {
      console.error("Error formatting date:", error);
      return `${dateStr}, ${timeStr}`;
    }
  };

  // Handle view appointment
  const handleView = (appointment: Appointment) => {
    setSelectedAppointmentId(appointment._id);
    dispatch(setSelectedAppointment(appointment));
  };

  // Close view modal
  const handleCloseModal = () => {
    setSelectedAppointmentId(null);
    dispatch(setSelectedAppointment(null));
  };

  // Handle status change
  // const handleStatusChange = async (
  //   appointmentId: string,
  //   status: AppointmentStatus
  // ) => {
  //   try {
  //     await updateAppointment({
  //       id: appointmentId,
  //       data: { status },
  //     }).unwrap();

  //     refetch(); // Refresh the list
  //     if (selectedAppointmentId === appointmentId) {
  //       refetchSingle();
  //     }
  //   } catch (error) {
  //     console.error("Failed to update appointment:", error);
  //   }
  // };

  // Handle cancel appointment
  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await cancelAppointment(appointmentId).unwrap();
      refetch();
      if (selectedAppointmentId === appointmentId) {
        refetchSingle();
      }
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    }
  };

  // Handle confirm appointment
  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      await confirmAppointment(appointmentId).unwrap();
      refetch();
      if (selectedAppointmentId === appointmentId) {
        refetchSingle();
      }
    } catch (error) {
      console.error("Failed to confirm appointment:", error);
    }
  };

  // const handleRefundConfirm = () => {

  //   setShowRefundSuccess(true);
  // };

  // Get patient name safely
  const getPatientName = (appointment: Appointment) => {
    if (!appointment.patientId) return "Guest";

    if (
      typeof appointment.patientId === "object" &&
      appointment.patientId.userId
    ) {
      if (typeof appointment.patientId.userId === "object") {
        return appointment.patientId.userId.fullName || "Unknown Patient";
      }
      return "Patient Panel";
    }
    return "Guest";
  };

  // Get nurse name safely
  const getNurseName = (appointment: Appointment) => {
    if (!appointment.soloNurseId) return "Not Assigned";

    if (
      typeof appointment.soloNurseId === "object" &&
      appointment.soloNurseId.userId
    ) {
      if (typeof appointment.soloNurseId.userId === "object") {
        return appointment.soloNurseId.userId.fullName || "Unknown Nurse";
      }
      return "Nurse Panel";
    }
    return "Not Assigned";
  };

  // Get status badge color
  const getStatusBadgeClass = (status: AppointmentStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than or equal to max visible pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show ellipsis logic
      if (currentPage <= 3) {
        // Show first 5 pages
        for (let i = 1; i <= maxVisiblePages - 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show last 5 pages
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - (maxVisiblePages - 2); i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Show middle pages
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Failed to load appointments</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const paginatedData = getPaginatedData();
  const pageNumbers = generatePageNumbers();

  return (
    <div className="">
      <div className="rounded-xl border border-[#DBE0E5] bg-white shadow-sm p-6">
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-[#343A40]">
              Nurse Appointments
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="w-full sm:w-[250px] md:w-[220px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full cursor-pointer h-10 border border-[#B3B3B3] rounded-xl px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-none">
                    <SelectGroup>
                      <SelectLabel className="px-4 pt-2 text-gray-500 text-sm">
                        All Status Data
                      </SelectLabel>
                      <SelectItem
                        className=" cursor-pointer hover:bg-gray-100"
                        value="all"
                      >
                        All Status
                      </SelectItem>
                      <SelectItem
                        className=" cursor-pointer hover:bg-gray-100"
                        value="confirmed"
                      >
                        Confirmed
                      </SelectItem>
                      <SelectItem
                        className=" cursor-pointer hover:bg-gray-100"
                        value="pending"
                      >
                        Pending
                      </SelectItem>
                      <SelectItem
                        className=" cursor-pointer hover:bg-gray-100"
                        value="cancelled"
                      >
                        Cancelled
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
          <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4  gap-5">
            <div className="xl:col-span-4 w-full">
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-[800px] w-full text-sm">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 whitespace-nowrap text-left font-medium text-gray-700">
                        Appointment ID
                      </th>
                      <th className="px-6 py-4 whitespace-nowrap text-left font-medium text-gray-700">
                        Patient Name
                      </th>
                      <th className="px-6 py-4 font-medium  whitespace-nowrap text-left text-gray-700">
                        Service
                      </th>
                      <th className="px-6 py-4 whitespace-nowrap text-left font-medium text-gray-700">
                        Address
                      </th>
                      <th className="px-6 py-4 whitespace-nowrap text-left font-medium text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-4 whitespace-nowrap text-left font-medium text-gray-700">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 whitespace-nowrap text-left font-medium text-gray-700">
                        Fee
                      </th>
                      <th className="px-6 py-4 whitespace-nowrap text-center font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedData.map((appointment) => (
                      <tr
                        key={appointment._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                          {appointment._id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {getPatientName(appointment)}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {appointment.subService?.slice(0, 5)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {appointment.homeAddress?.slice(0, 20)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                              appointment.status
                            )}`}
                          >
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {formatDisplayDate(
                            appointment.prefarenceDate,
                            appointment.prefarenceTime
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">
                          ₾ {appointment.appointmentFee}
                        </td>
                        <td className="px-6 py-4 text-center space-x-2 flex justify-center">
                          <button
                            onClick={() => handleView(appointment)}
                            className="inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-md bg-[#2E6FF3] text-white text-xs hover:bg-[#1B54D3] transition"
                          >
                            <FaEye className="text-sm" /> View
                          </button>
                          {/* {appointment.status === "pending" && (
                            <button
                              onClick={() =>
                                handleConfirmAppointment(appointment._id)
                              }
                              className="inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-md bg-green-600 text-white text-xs hover:bg-green-700 transition"
                            >
                              Confirm
                            </button>
                          )} */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination - Enhanced with clickable page numbers */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">
              {Math.min(paginatedData.length, itemsPerPage)}
            </span>{" "}
            of <span className="font-medium">{appointmentsData.length}</span>{" "}
            entries
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 border rounded-lg text-sm flex items-center justify-center ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed text-gray-400"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Prev
            </button>

            <div className="flex items-center gap-1">
              {pageNumbers.map((pageNumber, index) =>
                pageNumber === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-1.5 text-gray-500"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber as number)}
                    className={`px-3 py-1.5 min-w-[40px] border rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNumber
                        ? "bg-blue-500 text-white border-blue-500"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 border rounded-lg text-sm flex items-center justify-center ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed text-gray-400"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              Next
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointmentId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm px-3 sm:px-4">
          <div className="bg-white rounded-lg w-full max-w-3xl shadow-2xl p-6 sm:p-8 relative border border-gray-300 max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
              Appointment Details - {selectedAppointmentId.substring(0, 8)}...
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              View complete appointment information
            </p>

            {isLoadingSingle ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : selectedAppointment ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={getPatientName(selectedAppointment)}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Nurse Name
                  </label>
                  <input
                    type="text"
                    value={getNurseName(selectedAppointment)}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Home Address
                  </label>
                  <input
                    type="text"
                    value={selectedAppointment.homeAddress}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Visiting Type
                  </label>
                  <input
                    type="text"
                    value={
                      selectedAppointment.visitingType === "fristVisit"
                        ? "First Visit"
                        : "Follow Up"
                    }
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Date & Time
                  </label>
                  <input
                    type="text"
                    value={formatDisplayDate(
                      selectedAppointment.prefarenceDate,
                      selectedAppointment.prefarenceTime
                    )}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Service Fee
                  </label>
                  <input
                    type="text"
                    value={`₾ ${selectedAppointment.appointmentFee}`}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Service Type
                  </label>
                  <input
                    type="text"
                    value={selectedAppointment.subService}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Status
                  </label>
                  <input
                    type="text"
                    value={
                      selectedAppointment.status.charAt(0).toUpperCase() +
                      selectedAppointment.status.slice(1)
                    }
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                  />
                </div>

                {selectedAppointment.reasonForVisit && (
                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                      Reason for Visit
                    </label>
                    <textarea
                      value={selectedAppointment.reasonForVisit}
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                      rows={3}
                    />
                  </div>
                )}

                {selectedAppointment.followUpDetails && (
                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                      Follow-up Details
                    </label>
                    <textarea
                      value={selectedAppointment.followUpDetails}
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-red-500">
                  Failed to load appointment details
                </p>
                <button
                  onClick={() => refetchSingle()}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Action Buttons */}
            {selectedAppointment && (
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 py-3 cursor-pointer px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors"
                >
                  Close
                </button>

                {selectedAppointment.status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        handleConfirmAppointment(selectedAppointment._id)
                      }
                      className="flex-1 py-3 px-4 cursor-pointer bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-colors"
                    >
                      Confirm Appointment
                    </button>
                    <button
                      onClick={() =>
                        handleCancelAppointment(selectedAppointment._id)
                      }
                      className="flex-1 py-3 px-4 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm transition-colors"
                    >
                      Cancel Appointment
                    </button>
                  </>
                )}

                {selectedAppointment.status === "confirmed" && (
                  <button
                    onClick={() =>
                      handleCancelAppointment(selectedAppointment._id)
                    }
                    className="flex-1 py-3 px-4 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm transition-colors"
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Refund Success Modal */}
      {showRefundSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl w-full max-w-md p-8 relative shadow-2xl">
            <button
              onClick={() => setShowRefundSuccess(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Refund Initiated
              </h2>

              <p className="text-gray-600 text-sm mb-6">
                The refund process has been successfully started. The funds will
                be transferred to the patient's account shortly, and they have
                been sent a notification regarding this transaction.
              </p>

              <button
                onClick={() => setShowRefundSuccess(false)}
                className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseAppointmentTable;
// import React, { useState } from "react";
// import { FaEye } from "react-icons/fa";
// import { X } from "lucide-react";
// import { format } from "date-fns";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import {
//   useGetNurseAppointmentsQuery,
//   useUpdateNurseAppointmentMutation,
//   useCancelNurseAppointmentMutation,
//   useGetNurseSingleAppointmentQuery,
//   useConfirmNurseAppointmentMutation,
// } from "@/redux/features/admin/nurseAppointment/nurseAppointmentApi";
// import { setSelectedAppointment } from "@/redux/features/admin/nurseAppointment/nurseAppointmentSlice";
// import {
//   Appointment,
//   AppointmentStatus,
// } from "@/redux/types/admin/nurseAppointmentTypes";
// import { useAppDispatch } from "@/redux/hooks/redux-hook";

// const NurseAppointmentTable: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [selectedAppointmentId, setSelectedAppointmentId] = useState<
//     string | null
//   >(null);
//   const [showRefundSuccess, setShowRefundSuccess] = useState(false);

//   const itemsPerPage = 6;

//   // Get appointments from API
//   const {
//     data: appointmentsResponse,
//     isLoading,
//     error,
//     refetch,
//   } = useGetNurseAppointmentsQuery({
//     status:
//       statusFilter !== "all" ? (statusFilter as AppointmentStatus) : undefined,
//     page: currentPage,
//     limit: itemsPerPage,
//   });

//   // Get single appointment details
//   const {
//     data: singleAppointmentResponse,
//     isLoading: isLoadingSingle,
//     refetch: refetchSingle,
//   } = useGetNurseSingleAppointmentQuery(selectedAppointmentId || "", {
//     skip: !selectedAppointmentId,
//   });

//   // RTK Query mutations
//   const [updateAppointment] = useUpdateNurseAppointmentMutation();
//   const [cancelAppointment] = useCancelNurseAppointmentMutation();
//   const [confirmAppointment] = useConfirmNurseAppointmentMutation();

//   const appointmentsData = appointmentsResponse?.data || [];
//   const selectedAppointment = singleAppointmentResponse?.data || null;

//   // Format date for display
//   const formatDisplayDate = (dateStr: string, timeStr: string) => {
//     try {
//       const date = new Date(`${dateStr}T${timeStr}`);
//       return format(date, "yyyy-MM-dd, hh:mm a");
//     } catch (error) {
//       return `${dateStr}, ${timeStr}`;
//     }
//   };

//   // Handle view appointment
//   const handleView = (appointment: Appointment) => {
//     setSelectedAppointmentId(appointment._id);
//     dispatch(setSelectedAppointment(appointment));
//   };

//   // Close view modal
//   const handleCloseModal = () => {
//     setSelectedAppointmentId(null);
//     dispatch(setSelectedAppointment(null));
//   };

//   // Handle status change
//   const handleStatusChange = async (
//     appointmentId: string,
//     status: AppointmentStatus
//   ) => {
//     try {
//       await updateAppointment({
//         id: appointmentId,
//         data: { status },
//       }).unwrap();

//       refetch(); // Refresh the list
//       if (selectedAppointmentId === appointmentId) {
//         refetchSingle();
//       }
//     } catch (error) {
//       console.error("Failed to update appointment:", error);
//     }
//   };
//   console.log(handleStatusChange);

//   // Handle cancel appointment
//   const handleCancelAppointment = async (appointmentId: string) => {
//     try {
//       await cancelAppointment(appointmentId).unwrap();
//       refetch();
//       if (selectedAppointmentId === appointmentId) {
//         refetchSingle();
//       }
//     } catch (error) {
//       console.error("Failed to cancel appointment:", error);
//     }
//   };

//   // Handle confirm appointment
//   const handleConfirmAppointment = async (appointmentId: string) => {
//     try {
//       await confirmAppointment(appointmentId).unwrap();
//       refetch();
//       if (selectedAppointmentId === appointmentId) {
//         refetchSingle();
//       }
//     } catch (error) {
//       console.error("Failed to confirm appointment:", error);
//     }
//   };
//   const handleRefundConfirm = () => {
//     console.log(handleRefundConfirm);
//     setShowRefundSuccess(true);
//   };

//   // Get patient name safely
//   const getPatientName = (appointment: Appointment) => {
//     if (!appointment.patientId) return "Guest";

//     if (
//       typeof appointment.patientId === "object" &&
//       appointment.patientId.userId
//     ) {
//       if (typeof appointment.patientId.userId === "object") {
//         return appointment.patientId.userId.fullName || "Unknown Patient";
//       }
//       return "Patient Panel";
//     }
//     return "Guest";
//   };

//   // Get nurse name safely
//   const getNurseName = (appointment: Appointment) => {
//     if (!appointment.soloNurseId) return "Not Assigned";

//     if (
//       typeof appointment.soloNurseId === "object" &&
//       appointment.soloNurseId.userId
//     ) {
//       if (typeof appointment.soloNurseId.userId === "object") {
//         return appointment.soloNurseId.userId.fullName || "Unknown Nurse";
//       }
//       return "Nurse Panel";
//     }
//     return "Not Assigned";
//   };

//   // Get status badge color
//   const getStatusBadgeClass = (status: AppointmentStatus) => {
//     switch (status) {
//       case "confirmed":
//         return "bg-green-100 text-green-700";
//       case "pending":
//         return "bg-yellow-100 text-yellow-700";
//       case "cancelled":
//         return "bg-red-100 text-red-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-10">
//         <p className="text-red-500">Failed to load appointments</p>
//         <button
//           onClick={() => refetch()}
//           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="">
//       <div className="rounded-xl border border-[#DBE0E5] bg-white shadow-sm p-6">
//         <div className="w-full">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//             <h2 className="text-lg md:text-xl font-semibold text-[#343A40]">
//               Nurse Appointments
//             </h2>

//             <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
//               <div className="w-full sm:w-[250px] md:w-[220px]">
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger className="w-full cursor-pointer h-10 border border-[#B3B3B3] rounded-xl px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm">
//                     <SelectValue placeholder="Select Status" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white border-none">
//                     <SelectGroup>
//                       <SelectLabel className="px-4 pt-2 text-gray-500 text-sm">
//                         All Status Data
//                       </SelectLabel>
//                       <SelectItem
//                         className=" cursor-pointer hover:bg-gray-100"
//                         value="all"
//                       >
//                         All Status
//                       </SelectItem>
//                       <SelectItem
//                         className=" cursor-pointer hover:bg-gray-100"
//                         value="confirmed"
//                       >
//                         Confirmed
//                       </SelectItem>
//                       <SelectItem
//                         className=" cursor-pointer hover:bg-gray-100"
//                         value="pending"
//                       >
//                         Pending
//                       </SelectItem>
//                       <SelectItem
//                         className=" cursor-pointer hover:bg-gray-100"
//                         value="cancelled"
//                       >
//                         Cancelled
//                       </SelectItem>
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="p-5 border border-[#E4E4E4] rounded-lg">
//           <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4  gap-5">
//             <div className="xl:col-span-4 w-full">
//               <div className="overflow-x-auto rounded-lg border border-gray-200">
//                 <table className="min-w-[800px] w-full text-sm">
//                   <thead className="bg-gray-100 border-b border-gray-200">
//                     <tr>
//                       <th className="px-6 py-4 whitespace-nowrap text-left font-medium text-gray-700">
//                         Appointment ID
//                       </th>
//                       <th className="px-6 py-4 whitespace-nowrap text-left font-medium text-gray-700">
//                         Patient Name
//                       </th>
//                       <th className="px-6 py-4 font-medium  whitespace-nowrap text-left text-gray-700">
//                         Service
//                       </th>
//                       <th className="px-6 py-4 whitespace-nowrap text-left font-medium text-gray-700">
//                         Address
//                       </th>
//                       <th className="px-6 py-4 whitespace-nowrap text-left font-medium text-gray-700">
//                         Status
//                       </th>
//                       <th className="px-6 py-4 whitespace-nowrap text-left font-medium text-gray-700">
//                         Date & Time
//                       </th>
//                       <th className="px-6 py-4 whitespace-nowrap text-left font-medium text-gray-700">
//                         Fee
//                       </th>
//                       <th className="px-6 py-4 whitespace-nowrap text-center font-medium text-gray-700">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {appointmentsData.map((appointment) => (
//                       <tr
//                         key={appointment._id}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
//                           {appointment._id.substring(0, 8)}...
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-gray-700">
//                           {getPatientName(appointment)}
//                         </td>
//                         <td className="px-6 py-4 text-gray-700">
//                           {appointment.subService?.slice(0, 5)}
//                         </td>

//                         <td className="px-6 py-4 whitespace-nowrap text-gray-700">
//                           {appointment.homeAddress?.slice(0, 20)}
//                         </td>

//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
//                               appointment.status
//                             )}`}
//                           >
//                             {appointment.status.charAt(0).toUpperCase() +
//                               appointment.status.slice(1)}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-gray-700">
//                           {formatDisplayDate(
//                             appointment.prefarenceDate,
//                             appointment.prefarenceTime
//                           )}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">
//                           $ {appointment.appointmentFee}
//                         </td>
//                         <td className="px-6 py-4 text-center space-x-2 flex justify-center">
//                           <button
//                             onClick={() => handleView(appointment)}
//                             className="inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-md bg-[#2E6FF3] text-white text-xs hover:bg-[#1B54D3] transition"
//                           >
//                             <FaEye className="text-sm" /> View
//                           </button>
//                           {appointment.status === "pending" && (
//                             <button
//                               onClick={() =>
//                                 handleConfirmAppointment(appointment._id)
//                               }
//                               className="inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-md bg-green-600 text-white text-xs hover:bg-green-700 transition"
//                             >
//                               Confirm
//                             </button>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Pagination */}
//         <div className="mt-6 flex items-center justify-between">
//           <p className="text-sm text-gray-600">
//             Showing{" "}
//             <span className="font-medium">
//               {Math.min(appointmentsData.length, itemsPerPage)}
//             </span>{" "}
//             of <span className="font-medium">{appointmentsData.length}</span>{" "}
//             entries
//           </p>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className={`px-3 py-1.5 border rounded-lg text-sm ${
//                 currentPage === 1
//                   ? "opacity-50 cursor-not-allowed"
//                   : "hover:bg-gray-100"
//               }`}
//             >
//               Prev
//             </button>
//             <div className="min-w-[50px] text-center border px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 bg-gray-50">
//               {currentPage} /{" "}
//               {Math.ceil(appointmentsData.length / itemsPerPage)}
//             </div>
//             <button
//               onClick={() =>
//                 setCurrentPage((prev) =>
//                   prev < Math.ceil(appointmentsData.length / itemsPerPage)
//                     ? prev + 1
//                     : prev
//                 )
//               }
//               disabled={
//                 currentPage ===
//                 Math.ceil(appointmentsData.length / itemsPerPage)
//               }
//               className={`px-3 py-1.5 border rounded-lg text-sm ${
//                 currentPage ===
//                 Math.ceil(appointmentsData.length / itemsPerPage)
//                   ? "opacity-50 cursor-not-allowed"
//                   : "hover:bg-gray-100"
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Appointment Details Modal */}
//       {selectedAppointmentId && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm px-3 sm:px-4">
//           <div className="bg-white rounded-lg w-full max-w-3xl shadow-2xl p-6 sm:p-8 relative border border-gray-300 max-h-[90vh] overflow-y-auto">
//             <button
//               onClick={handleCloseModal}
//               className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
//               Appointment Details - {selectedAppointmentId.substring(0, 8)}...
//             </h2>
//             <p className="text-gray-500 text-sm mb-6">
//               View complete appointment information
//             </p>

//             {isLoadingSingle ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//               </div>
//             ) : selectedAppointment ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2 text-sm">
//                     Patient Name
//                   </label>
//                   <input
//                     type="text"
//                     value={getPatientName(selectedAppointment)}
//                     readOnly
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2 text-sm">
//                     Nurse Name
//                   </label>
//                   <input
//                     type="text"
//                     value={getNurseName(selectedAppointment)}
//                     readOnly
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2 text-sm">
//                     Home Address
//                   </label>
//                   <input
//                     type="text"
//                     value={selectedAppointment.homeAddress}
//                     readOnly
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2 text-sm">
//                     Visiting Type
//                   </label>
//                   <input
//                     type="text"
//                     value={
//                       selectedAppointment.visitingType === "fristVisit"
//                         ? "First Visit"
//                         : "Follow Up"
//                     }
//                     readOnly
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2 text-sm">
//                     Date & Time
//                   </label>
//                   <input
//                     type="text"
//                     value={formatDisplayDate(
//                       selectedAppointment.prefarenceDate,
//                       selectedAppointment.prefarenceTime
//                     )}
//                     readOnly
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2 text-sm">
//                     Service Fee
//                   </label>
//                   <input
//                     type="text"
//                     value={`$${selectedAppointment.appointmentFee}`}
//                     readOnly
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2 text-sm">
//                     Service Type
//                   </label>
//                   <input
//                     type="text"
//                     value={selectedAppointment.subService}
//                     readOnly
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2 text-sm">
//                     Status
//                   </label>
//                   <input
//                     type="text"
//                     value={
//                       selectedAppointment.status.charAt(0).toUpperCase() +
//                       selectedAppointment.status.slice(1)
//                     }
//                     readOnly
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                   />
//                 </div>

//                 {selectedAppointment.reasonForVisit && (
//                   <div className="sm:col-span-2">
//                     <label className="block text-gray-700 font-medium mb-2 text-sm">
//                       Reason for Visit
//                     </label>
//                     <textarea
//                       value={selectedAppointment.reasonForVisit}
//                       readOnly
//                       className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                       rows={3}
//                     />
//                   </div>
//                 )}

//                 {selectedAppointment.followUpDetails && (
//                   <div className="sm:col-span-2">
//                     <label className="block text-gray-700 font-medium mb-2 text-sm">
//                       Follow-up Details
//                     </label>
//                     <textarea
//                       value={selectedAppointment.followUpDetails}
//                       readOnly
//                       className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                       rows={3}
//                     />
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="text-center py-10">
//                 <p className="text-red-500">
//                   Failed to load appointment details
//                 </p>
//                 <button
//                   onClick={() => refetchSingle()}
//                   className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                   Retry
//                 </button>
//               </div>
//             )}

//             {/* Action Buttons */}
//             {selectedAppointment && (
//               <div className="flex flex-col sm:flex-row gap-3 mt-6">
//                 <button
//                   onClick={handleCloseModal}
//                   className="flex-1 py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors"
//                 >
//                   Close
//                 </button>

//                 {selectedAppointment.status === "pending" && (
//                   <>
//                     <button
//                       onClick={() =>
//                         handleConfirmAppointment(selectedAppointment._id)
//                       }
//                       className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-colors"
//                     >
//                       Confirm Appointment
//                     </button>
//                     <button
//                       onClick={() =>
//                         handleCancelAppointment(selectedAppointment._id)
//                       }
//                       className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm transition-colors"
//                     >
//                       Cancel Appointment
//                     </button>
//                   </>
//                 )}

//                 {selectedAppointment.status === "confirmed" && (
//                   <button
//                     onClick={() =>
//                       handleCancelAppointment(selectedAppointment._id)
//                     }
//                     className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm transition-colors"
//                   >
//                     Cancel Appointment
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Refund Success Modal */}
//       {showRefundSuccess && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
//           <div className="bg-white rounded-xl w-full max-w-md p-8 relative shadow-2xl">
//             <button
//               onClick={() => setShowRefundSuccess(false)}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             <div className="flex flex-col items-center text-center">
//               <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
//                 <svg
//                   className="w-8 h-8 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2.5}
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//               </div>

//               <h2 className="text-xl font-semibold text-gray-900 mb-2">
//                 Refund Initiated
//               </h2>

//               <p className="text-gray-600 text-sm mb-6">
//                 The refund process has been successfully started. The funds will
//                 be transferred to the patient's account shortly, and they have
//                 been sent a notification regarding this transaction.
//               </p>

//               <button
//                 onClick={() => setShowRefundSuccess(false)}
//                 className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm transition-colors"
//               >
//                 Done
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NurseAppointmentTable;
