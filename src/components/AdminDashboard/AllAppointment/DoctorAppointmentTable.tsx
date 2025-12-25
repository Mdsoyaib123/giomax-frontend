import React, { useEffect, useState } from "react";
import {
  FaEye,
  FaCalendarAlt,
  FaHospital,
  FaUserMd,
  FaMoneyBillWave,
} from "react-icons/fa";
// import { MdNote, MdEvent, MdPayment } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { X, CheckCircle, AlertCircle, Clock, DollarSign } from "lucide-react";
import { format } from "date-fns";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useGetAllAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
  useRefundAppointmentMutation,
} from "@/redux/features/admin/doctorAppoinment/doctorAppointmentApi";
import {
  setAppointments,
  setSelectedAppointment,
  setFilter,
  setCurrentPage,
  // clearFilters,
} from "@/redux/features/admin/doctorAppoinment/doctorAppointmentSlice";
import { IAppointment } from "@/redux/types/adminDoctorAppointment";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";

const DoctorAppointmentTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filteredAppointments, selectedAppointment, filters, pagination } =
    useAppSelector((state) => state.doctorAppointment);

  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showRefundSuccess, setShowRefundSuccess] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // RTK Query hooks
  const {
    data: appointmentsData,
    isLoading,
    error,
  } = useGetAllAppointmentsQuery({
    status: filters.status !== "all" ? filters.status : undefined,
    serviceType:
      filters.serviceType !== "all" ? filters.serviceType : undefined,
  });

  console.log("al dfdfdfd", appointmentsData);

  const [updateStatus] = useUpdateAppointmentStatusMutation();
  const [refundAppointment] = useRefundAppointmentMutation();

  // Initialize data
  useEffect(() => {
    if (appointmentsData?.data) {
      dispatch(setAppointments(appointmentsData.data));
    }
  }, [appointmentsData, dispatch]);

  // Handle view details
  const handleView = (appointment: IAppointment) => {
    dispatch(setSelectedAppointment(appointment));
    setShowDetailsModal(true);

    // If status is cancelled, show refund dialog
    if (appointment.status === "cancelled") {
      setShowRefundDialog(true);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (
    status: "confirmed" | "cancelled" | "completed"
  ) => {
    if (!selectedAppointment) return;

    try {
      await updateStatus({
        appointmentId: selectedAppointment._id,
        status,
      }).unwrap();

      setShowDetailsModal(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // Handle refund
  const handleRefund = async () => {
    if (!selectedAppointment) return;

    try {
      await refundAppointment(selectedAppointment._id).unwrap();
      setShowRefundDialog(false);
      setShowDetailsModal(false);
      setShowRefundSuccess(true);
    } catch (error) {
      console.error("Failed to process refund:", error);
    }
  };

  // Handle filter change
  const handleFilterChange = (key: "status" | "serviceType", value: string) => {
    dispatch(setFilter({ key, value }));
  };

  // Calculate pagination
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const endIndex = startIndex + pagination.itemsPerPage;
  const currentAppointments = filteredAppointments.slice(startIndex, endIndex);
  const totalPages = Math.ceil(
    filteredAppointments.length / pagination.itemsPerPage
  );

  const handlePrev = () => {
    if (pagination.currentPage > 1) {
      dispatch(setCurrentPage(pagination.currentPage - 1));
    }
  };

  const handleNext = () => {
    if (pagination.currentPage < totalPages) {
      dispatch(setCurrentPage(pagination.currentPage + 1));
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Get payment badge style
  const getPaymentBadge = (status: string, fee: number) => {
    if (status === "cancelled") {
      return "bg-[#FFEAEB] text-[#E9575A]";
    }
    if (fee > 0) {
      return "bg-[#E9F9EF] text-[#1B9268]";
    }
    return "bg-[#F2E7FE] text-[#7243FF]";
  };

  // Get payment text
  const getPaymentText = (status: string, fee: number) => {
    if (status === "cancelled") {
      return "Refund Pending";
    }
    if (fee > 0) {
      return "Paid";
    }
    return "Free";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading appointments. Please try again.
      </div>
    );
  }

  return (
    <div className="">
      <div className="rounded-xl border border-[#DBE0E5] bg-white shadow-sm p-6">
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-[#343A40]">
              Doctor Appointment
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Status Filter */}
              <div className="w-full sm:w-[250px] md:w-[220px]">
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger className="w-full cursor-pointer  h-10 border border-[#B3B3B3] rounded-xl px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-none">
                    <SelectGroup>
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
                      <SelectItem
                        className=" cursor-pointer hover:bg-gray-100"
                        value="completed"
                      >
                        Completed
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Service Type Filter */}
              <div className="w-full sm:w-[250px] md:w-[220px]">
                <Select
                  value={filters.serviceType}
                  onValueChange={(value) =>
                    handleFilterChange("serviceType", value)
                  }
                >
                  <SelectTrigger className="w-full cursor-pointer h-10 border border-[#B3B3B3] rounded-xl px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-none">
                    <SelectGroup>
                      <SelectItem
                        className=" cursor-pointer hover:bg-gray-100"
                        value="all"
                      >
                        All Type
                      </SelectItem>
                      <SelectItem
                        className=" cursor-pointer hover:bg-gray-100"
                        value="online"
                      >
                        Online
                      </SelectItem>
                      <SelectItem
                        className=" cursor-pointer hover:bg-gray-100"
                        value="inClinic"
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
                      <th className="px-6 py-4 whitespace-nowrap text-left font-medium text-gray-700">
                        Doctor Name
                      </th>
                      <th className="px-6 py-4 whitespace-nowrap text-left font-medium text-gray-700">
                        Type
                      </th>
                      <th className="px-6 py-4 whitespace-nowrap text-left font-medium text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-4 whitespace-nowrap text-left font-medium text-gray-700">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 whitespace-nowrap text-left font-medium text-gray-700">
                        Payment
                      </th>
                      <th className="px-6 py-4 whitespace-nowrap text-center font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentAppointments.map((appointment) => (
                      <tr
                        key={appointment._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                          {appointment._id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {appointment.patientId?.userId.fullName || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {appointment.doctorId.userId.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              appointment.serviceType === "online"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {appointment.serviceType === "online"
                              ? "Online"
                              : "In-Clinic"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                              appointment.status
                            )}`}
                          >
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {formatDate(appointment.prefarenceDate)}{" "}
                          {appointment.prefarenceTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${getPaymentBadge(
                              appointment.status,
                              appointment.appoinmentFee
                            )}`}
                          >
                            {getPaymentText(
                              appointment.status,
                              appointment.appoinmentFee
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleView(appointment)}
                            className="inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-md bg-[#2E6FF3] text-white text-xs hover:bg-[#1B54D3] transition"
                          >
                            <FaEye className="text-sm" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">
              {Math.min(startIndex + 1, pagination.totalItems)}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(endIndex, pagination.totalItems)}
            </span>{" "}
            of <span className="font-medium">{pagination.totalItems}</span>{" "}
            entries
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={pagination.currentPage === 1}
              className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm ${
                pagination.currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              <IoIosArrowBack /> Prev
            </button>
            <div className="min-w-[50px] text-center border px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 bg-gray-50">
              {pagination.currentPage} / {totalPages}
            </div>
            <button
              onClick={handleNext}
              disabled={pagination.currentPage === totalPages}
              className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm ${
                pagination.currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Next <IoIosArrowForward />
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm px-3 sm:px-4">
          <div className="bg-white rounded-lg w-full max-w-3xl shadow-2xl p-6 sm:p-8 relative border border-gray-300">
            <button
              onClick={() => {
                setShowDetailsModal(false);
                dispatch(setSelectedAppointment(null));
              }}
              className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
              Appointment Details
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Complete appointment information
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Patient Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaUserMd className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Patient</p>
                  <p className="font-medium">
                    {selectedAppointment.patientId?.userId.fullName ||
                      "Not Assigned"}
                  </p>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <FaUserMd className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Doctor</p>
                  <p className="font-medium">
                    {selectedAppointment.doctorId.userId.fullName}
                  </p>
                </div>
              </div>

              {/* Appointment Type */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  {selectedAppointment.serviceType === "online" ? (
                    <FaHospital className="text-purple-600" />
                  ) : (
                    <FaHospital className="text-purple-600" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Service Type</p>
                  <p className="font-medium">
                    {selectedAppointment.serviceType === "online"
                      ? "Online"
                      : "In-Clinic"}
                  </p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <FaCalendarAlt className="text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date & Time</p>
                  <p className="font-medium">
                    {formatDate(selectedAppointment.prefarenceDate)}{" "}
                    {selectedAppointment.prefarenceTime}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <FaMoneyBillWave className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="font-medium">
                    ${selectedAppointment.appoinmentFee}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedAppointment.status === "confirmed"
                      ? "bg-green-100"
                      : selectedAppointment.status === "pending"
                      ? "bg-yellow-100"
                      : selectedAppointment.status === "cancelled"
                      ? "bg-red-100"
                      : "bg-blue-100"
                  }`}
                >
                  {selectedAppointment.status === "confirmed" ? (
                    <CheckCircle className="text-green-600" />
                  ) : selectedAppointment.status === "pending" ? (
                    <Clock className="text-yellow-600" />
                  ) : selectedAppointment.status === "cancelled" ? (
                    <AlertCircle className="text-red-600" />
                  ) : (
                    <CheckCircle className="text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-medium">
                    {selectedAppointment.status.charAt(0).toUpperCase() +
                      selectedAppointment.status.slice(1)}
                  </p>
                </div>
              </div>

              {/* Reason for Visit */}
              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Reason for Visit
                </label>
                <textarea
                  value={selectedAppointment.reasonForVisit}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm min-h-[80px]"
                />
              </div>

              {/* Follow-up Details */}
              {selectedAppointment.followUpDetails && (
                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Follow-up Details
                  </label>
                  <textarea
                    value={selectedAppointment.followUpDetails}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm min-h-[80px]"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  dispatch(setSelectedAppointment(null));
                }}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors"
              >
                Close
              </button>

              {/* Status Update Buttons */}
              {selectedAppointment.status === "pending" && (
                <button
                  onClick={() => handleStatusUpdate("confirmed")}
                  className="flex-1 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium text-sm transition-colors"
                >
                  Confirm Appointment
                </button>
              )}

              {selectedAppointment.status === "confirmed" && (
                <button
                  onClick={() => handleStatusUpdate("completed")}
                  className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm transition-colors"
                >
                  Mark as Completed
                </button>
              )}

              {/* Refund Button - Only show for cancelled appointments */}
              {selectedAppointment.status === "cancelled" &&
                !showRefundDialog && (
                  <button
                    onClick={() => setShowRefundDialog(true)}
                    className="flex-1 py-3 px-4 bg-[#2E6FF3] text-white rounded-lg hover:bg-[#1B54D3] font-medium text-sm transition-colors"
                  >
                    Refund Payment
                  </button>
                )}

              {/* Cancel Appointment Button */}
              {selectedAppointment.status !== "cancelled" &&
                selectedAppointment.status !== "completed" && (
                  <button
                    onClick={() => handleStatusUpdate("cancelled")}
                    className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium text-sm transition-colors"
                  >
                    Cancel Appointment
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Refund Confirmation Modal */}
      {showRefundDialog && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-3 sm:px-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-2xl p-6 relative border border-gray-300">
            <button
              onClick={() => setShowRefundDialog(false)}
              className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Confirm Refund
              </h2>
              <p className="text-gray-600 text-sm">
                Are you sure you want to refund $
                {selectedAppointment.appoinmentFee} to the patient?
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-6">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Patient:</span>
                <span className="font-medium">
                  {selectedAppointment.patientId?.userId.fullName || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Appointment ID:</span>
                <span className="font-medium">
                  {selectedAppointment._id.substring(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Amount to Refund:</span>
                <span className="font-medium text-green-600">
                  ${selectedAppointment.appoinmentFee}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowRefundDialog(false)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRefund}
                className="flex-1 py-3 px-4 bg-[#2E6FF3] text-white rounded-lg hover:bg-[#1B54D3] font-medium text-sm transition-colors"
              >
                Confirm Refund
              </button>
            </div>
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
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
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

export default DoctorAppointmentTable;

// import React, { useState } from "react";
// import { FaEye } from "react-icons/fa";
// import { X } from "lucide-react";

// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface Booking {
//   id: string;
//   patientName: string;
//   clinicName: string;
//   doctorName: string;
//   note: string;
//   type: string;
//   status: "Pending" | "Confirmed" | "Cancelled";
//   dateTime: string;
//   payment: "Paid" | "Refund Pending" | "Refunded";
//   amount: string;
// }

// const DoctorAppointmentTable: React.FC = () => {
//   const [openProfile, setOpenProfile] = useState<Booking | null>(null);
//   const [showRefundDialog, setShowRefundDialog] = useState(false);
//   const [showRefundSuccess, setShowRefundSuccess] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [bookings, setBookings] = useState<Booking[]>([
//     {
//       id: "BK-001",
//       patientName: "Sarah Johnson",
//       clinicName: "City Medical Center",
//       doctorName: "Dr. Kevin Khan",
//       note: "Regular checkup and blood pressure monitoring",
//       type: "Online",
//       status: "Pending",
//       dateTime: "2025-11-06, 10:30 AM",
//       payment: "Paid",
//       amount: "$150.00",
//     },
//     {
//       id: "BK-002",
//       patientName: "Michael Chen",
//       clinicName: "Downtown Health Hub",
//       doctorName: "Dr. Sarah Lee",
//       note: "Follow-up consultation",
//       type: "In-Clinic",
//       status: "Confirmed",
//       dateTime: "2025-11-08, 02:00 PM",
//       payment: "Paid",
//       amount: "$200.00",
//     },
//     {
//       id: "BK-003",
//       patientName: "Emily Rodriguez",
//       clinicName: "Wellness Clinic Plus",
//       doctorName: "Dr. Michael Brown",
//       note: "Annual physical examination",
//       type: "Online",
//       status: "Cancelled",
//       dateTime: "2025-11-05, 09:00 AM",
//       payment: "Refund Pending",
//       amount: "$180.00",
//     },
//     {
//       id: "BK-004",
//       patientName: "James Wilson",
//       clinicName: "City Medical Center",
//       doctorName: "Dr. Daniel Smith",
//       note: "Dental checkup and cleaning",
//       type: "In-Clinic",
//       status: "Confirmed",
//       dateTime: "2025-11-10, 03:00 PM",
//       payment: "Refunded",
//       amount: "$120.00",
//     },
//     {
//       id: "BK-005",
//       patientName: "Lisa Anderson",
//       clinicName: "City Medical Center",
//       doctorName: "Dr. Rachel Adams",
//       note: "Eye examination",
//       type: "Online",
//       status: "Pending",
//       dateTime: "2025-11-11, 04:00 PM",
//       payment: "Paid",
//       amount: "$90.00",
//     },
//   ]);

//   const itemsPerPage = 6;
//   const totalPages = Math.ceil(bookings.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentUsers = bookings.slice(startIndex, startIndex + itemsPerPage);

//   const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
//   const handleNext = () =>
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));

//   const handleView = (booking: Booking) => {
//     setOpenProfile(booking);
//     // If payment is "Refund Pending", open refund dialog directly
//     if (booking.payment === "Refund Pending") {
//       setShowRefundDialog(true);
//     }
//   };

//   const handleRefundClick = () => {
//     setShowRefundDialog(true);
//   };

//   const handleRefundConfirm = () => {
//     if (openProfile) {
//       // Update booking payment status to Refunded
//       setBookings((prev) =>
//         prev.map((booking) =>
//           booking.id === openProfile.id
//             ? { ...booking, payment: "Refunded" as const }
//             : booking
//         )
//       );
//       setShowRefundDialog(false);
//       setOpenProfile(null);
//       setShowRefundSuccess(true);
//     }
//   };

//   return (
//     <div className="">
//       <div className="rounded-xl border border-[#DBE0E5] bg-white shadow-sm p-6">
//         <div className="w-full">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//             <h2 className="text-lg md:text-xl font-semibold text-[#343A40]">
//               Doctor Appointment
//             </h2>

//             <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
//               <div className="w-full sm:w-[250px] md:w-[220px]">
//                 <Select defaultValue="all">
//                   <SelectTrigger className="w-full h-10 border border-[#B3B3B3] rounded-xl px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm">
//                     <SelectValue placeholder="Select Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       <SelectLabel className="px-4 pt-2 text-gray-500 text-sm">
//                         All Status Data
//                       </SelectLabel>
//                       <SelectItem value="all">All Status</SelectItem>
//                       <SelectItem value="confirmed">Confirmed</SelectItem>
//                       <SelectItem value="pending">Pending</SelectItem>
//                       <SelectItem value="cancelled">Cancelled</SelectItem>
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="w-full sm:w-[250px] md:w-[220px]">
//                 <Select defaultValue="all">
//                   <SelectTrigger className="w-full h-10 border border-[#B3B3B3] rounded-xl px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm">
//                     <SelectValue placeholder="Select Type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       <SelectLabel className="px-4 pt-2 text-gray-500 text-sm">
//                         Type
//                       </SelectLabel>
//                       <SelectItem value="all">All Type</SelectItem>
//                       <SelectItem value="online">Online</SelectItem>
//                       <SelectItem value="in-clinic">In-Clinic</SelectItem>
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
//                       <th className="px-6 py-4 whitespace-nowrap  text-left font-medium text-gray-700">
//                         Booking ID
//                       </th>
//                       <th className="px-6 py-4 whitespace-nowrap  text-left font-medium text-gray-700">
//                         Patient Name
//                       </th>
//                       <th className="px-6 py-4 whitespace-nowrap  text-left font-medium text-gray-700">
//                         Clinic Name
//                       </th>
//                       <th className="px-6 py-4 whitespace-nowrap  text-left font-medium text-gray-700">
//                         Type
//                       </th>
//                       <th className="px-6 py-4 whitespace-nowrap  text-left font-medium text-gray-700">
//                         Status
//                       </th>
//                       <th className="px-6 py-4 whitespace-nowrap  text-left font-medium text-gray-700">
//                         Date & Time
//                       </th>
//                       <th className="px-6 py-4 whitespace-nowrap  text-left font-medium text-gray-700">
//                         Payment
//                       </th>
//                       <th className="px-6 py-4 whitespace-nowrap  text-center font-medium text-gray-700">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {bookings.map((booking) => (
//                       <tr
//                         key={booking.id}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap  font-semibold text-gray-900">
//                           {booking.id}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap  text-gray-700">
//                           {booking.patientName}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap  text-gray-700">
//                           {booking.clinicName}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap  text-sky-500">
//                           {booking.type}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap ">
//                           <span
//                             className={`px-3 py-1 text-xs font-medium rounded-full ${
//                               booking.status === "Confirmed"
//                                 ? "bg-green-100 text-green-700"
//                                 : booking.status === "Pending"
//                                 ? "bg-yellow-100 text-yellow-700"
//                                 : "bg-red-100 text-red-700"
//                             }`}
//                           >
//                             {booking.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap  text-gray-700">
//                           {booking.dateTime}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap ">
//                           <span
//                             className={`px-3 py-1 text-xs font-medium rounded-full ${
//                               booking.payment === "Paid"
//                                 ? "bg-[#E9F9EF] text-[#1B9268]"
//                                 : booking.payment === "Refund Pending"
//                                 ? "bg-[#FFEAEB] text-[#E9575A]"
//                                 : "bg-[#F2E7FE] text-[#7243FF]"
//                             }`}
//                           >
//                             {booking.payment}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 text-center">
//                           <button
//                             onClick={() => handleView(booking)}
//                             className="inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-md bg-[#2E6FF3] text-white text-xs hover:bg-[#1B54D3] transition"
//                           >
//                             <FaEye className="text-sm" /> View
//                           </button>
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
//             Showing <span className="font-medium">{currentUsers.length}</span>{" "}
//             of <span className="font-medium">{bookings.length}</span> entries
//           </p>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={handlePrev}
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
//               {currentPage} / {totalPages}
//             </div>
//             <button
//               onClick={handleNext}
//               disabled={currentPage === totalPages}
//               className={`px-3 py-1.5 border rounded-lg text-sm ${
//                 currentPage === totalPages
//                   ? "opacity-50 cursor-not-allowed"
//                   : "hover:bg-gray-100"
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Booking Details Modal - First Image */}
//       {openProfile &&
//         !showRefundDialog &&
//         openProfile.payment !== "Refund Pending" && (
//           <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm px-3 sm:px-4">
//             <div className="bg-white rounded-lg w-full max-w-3xl shadow-2xl p-6 sm:p-8 relative border border-gray-300">
//               <button
//                 onClick={() => setOpenProfile(null)}
//                 className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600"
//               >
//                 <X className="w-5 h-5" />
//               </button>

//               <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
//                 Booking Details - {openProfile.id}
//               </h2>
//               <p className="text-gray-500 text-sm mb-6">
//                 View complete booking information and consultation notes
//               </p>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2 text-sm">
//                     Patient Name
//                   </label>
//                   <input
//                     type="text"
//                     value={openProfile.patientName}
//                     readOnly
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2 text-sm">
//                     Doctor Name
//                   </label>
//                   <input
//                     type="text"
//                     value={openProfile.doctorName}
//                     readOnly
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2 text-sm">
//                     Clinic Name
//                   </label>
//                   <input
//                     type="text"
//                     value={openProfile.clinicName}
//                     readOnly
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2 text-sm">
//                     Booking Type
//                   </label>
//                   <input
//                     type="text"
//                     value={openProfile.type}
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
//                     value={openProfile.dateTime}
//                     readOnly
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2 text-sm">
//                     Amount
//                   </label>
//                   <input
//                     type="text"
//                     value={openProfile.amount}
//                     readOnly
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2 text-sm">
//                     Consultation Note
//                   </label>
//                   <input
//                     type="text"
//                     value={openProfile.note}
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
//                     value={openProfile.status}
//                     readOnly
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                   />
//                 </div>

//                 <div className="sm:col-span-2">
//                   <label className="block text-gray-700 font-medium mb-2 text-sm">
//                     Payment Status
//                   </label>
//                   <input
//                     type="text"
//                     value={openProfile.payment}
//                     readOnly
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                   />
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-col sm:flex-row gap-3 mt-6">
//                 <button
//                   onClick={() => setOpenProfile(null)}
//                   className="flex-1 py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 {openProfile && !showRefundDialog && (
//                   <button
//                     onClick={handleRefundClick}
//                     className="flex-1 py-3 px-4 bg-[#2E6FF3] text-white rounded-lg hover:bg-[#1B54D3] font-medium text-sm transition-colors"
//                   >
//                     Refund Payment
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//       {/* Refund Confirmation Modal - Second Image */}
//       {showRefundDialog && openProfile && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-3 sm:px-4">
//           <div className="bg-white rounded-lg w-full max-w-3xl shadow-2xl p-6 sm:p-8 relative border border-gray-300">
//             <button
//               onClick={() => setShowRefundDialog(false)}
//               className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
//               Booking Details - {openProfile.id}
//             </h2>
//             <p className="text-gray-500 text-sm mb-6">
//               View complete booking information and consultation notes
//             </p>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-gray-700 font-medium mb-2 text-sm">
//                   Patient Name
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.patientName}
//                   readOnly
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-2 text-sm">
//                   Doctor Name
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.doctorName}
//                   readOnly
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-2 text-sm">
//                   Clinic Name
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.clinicName}
//                   readOnly
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-2 text-sm">
//                   Booking Type
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.type}
//                   readOnly
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-2 text-sm">
//                   Date & Time
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.dateTime}
//                   readOnly
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-2 text-sm">
//                   Amount
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.amount}
//                   readOnly
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-2 text-sm">
//                   Consultation Note
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.note}
//                   readOnly
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-2 text-sm">
//                   Status
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.status}
//                   readOnly
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                 />
//               </div>

//               <div className="sm:col-span-2">
//                 <label className="block text-gray-700 font-medium mb-2 text-sm">
//                   Payment Status
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.payment}
//                   readOnly
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
//                 />
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 mt-6">
//               <button
//                 onClick={() => setShowRefundDialog(false)}
//                 className="flex-1 py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleRefundConfirm}
//                 className="flex-1 py-3 px-4 bg-[#2E6FF3] text-white rounded-lg hover:bg-[#1B54D3] font-medium text-sm transition-colors"
//               >
//                 Refund Payment
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Refund Success Modal - Third Image */}
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

// export default DoctorAppointmentTable;
