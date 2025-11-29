import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Booking {
  id: string;
  patientName: string;
  clinicName: string;
  doctorName: string;
  note: string;
  type: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  dateTime: string;
  payment: "Paid" | "Refund Pending" | "Refunded";
  amount: string;
}

const BookingManagementTable: React.FC = () => {
  const [openProfile, setOpenProfile] = useState<Booking | null>(null);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showRefundSuccess, setShowRefundSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "BK-001",
      patientName: "Sarah Johnson",
      clinicName: "City Medical Center",
      doctorName: "Dr. Kevin Khan",
      note: "Regular checkup and blood pressure monitoring",
      type: "Online",
      status: "Pending",
      dateTime: "2025-11-06, 10:30 AM",
      payment: "Paid",
      amount: "$150.00",
    },
    {
      id: "BK-002",
      patientName: "Michael Chen",
      clinicName: "Downtown Health Hub",
      doctorName: "Dr. Sarah Lee",
      note: "Follow-up consultation",
      type: "In-Clinic",
      status: "Confirmed",
      dateTime: "2025-11-08, 02:00 PM",
      payment: "Paid",
      amount: "$200.00",
    },
    {
      id: "BK-003",
      patientName: "Emily Rodriguez",
      clinicName: "Wellness Clinic Plus",
      doctorName: "Dr. Michael Brown",
      note: "Annual physical examination",
      type: "Online",
      status: "Cancelled",
      dateTime: "2025-11-05, 09:00 AM",
      payment: "Refund Pending",
      amount: "$180.00",
    },
    {
      id: "BK-004",
      patientName: "James Wilson",
      clinicName: "City Medical Center",
      doctorName: "Dr. Daniel Smith",
      note: "Dental checkup and cleaning",
      type: "In-Clinic",
      status: "Confirmed",
      dateTime: "2025-11-10, 03:00 PM",
      payment: "Refunded",
      amount: "$120.00",
    },
    {
      id: "BK-005",
      patientName: "Lisa Anderson",
      clinicName: "City Medical Center",
      doctorName: "Dr. Rachel Adams",
      note: "Eye examination",
      type: "Online",
      status: "Pending",
      dateTime: "2025-11-11, 04:00 PM",
      payment: "Paid",
      amount: "$90.00",
    },
  ]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = bookings.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleView = (booking: Booking) => {
    setOpenProfile(booking);
    // If payment is "Refund Pending", open refund dialog directly
    if (booking.payment === "Refund Pending") {
      setShowRefundDialog(true);
    }
  };

  const handleRefundClick = () => {
    setShowRefundDialog(true);
  };

  const handleRefundConfirm = () => {
    if (openProfile) {
      // Update booking payment status to Refunded
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === openProfile.id
            ? { ...booking, payment: "Refunded" as const }
            : booking
        )
      );
      setShowRefundDialog(false);
      setOpenProfile(null);
      setShowRefundSuccess(true);
    }
  };

  return (
    <div className="">
      <div className="rounded-xl border border-[#DBE0E5] bg-white shadow-sm p-6">
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-[#343A40]">
              All Booking Information
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="w-full sm:w-[250px] md:w-[220px]">
                <Select defaultValue="all">
                  <SelectTrigger className="w-full h-10 border border-[#B3B3B3] rounded-xl px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="px-4 pt-2 text-gray-500 text-sm">
                        All Status Data
                      </SelectLabel>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-[250px] md:w-[220px]">
                <Select defaultValue="all">
                  <SelectTrigger className="w-full h-10 border border-[#B3B3B3] rounded-xl px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="px-4 pt-2 text-gray-500 text-sm">
                        Type
                      </SelectLabel>
                      <SelectItem value="all">All Type</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="in-clinic">In-Clinic</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="p-5 border border-[#E4E4E4] rounded-lg">
          <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-[800px] w-full text-sm">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">
                    Booking ID
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">
                    Patient Name
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">
                    Clinic Name
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-center font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {booking.patientName}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {booking.clinicName}
                    </td>
                    <td className="px-6 py-4 text-sky-500">{booking.type}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          booking.status === "Confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {booking.dateTime}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          booking.payment === "Paid"
                            ? "bg-[#E9F9EF] text-[#1B9268]"
                            : booking.payment === "Refund Pending"
                            ? "bg-[#FFEAEB] text-[#E9575A]"
                            : "bg-[#F2E7FE] text-[#7243FF]"
                        }`}
                      >
                        {booking.payment}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleView(booking)}
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

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{currentUsers.length}</span> of{" "}
            <span className="font-medium">{bookings.length}</span> entries
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
      </div>

      {/* Booking Details Modal - First Image */}
      {openProfile && !showRefundDialog && openProfile.payment !== "Refund Pending" && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm px-3 sm:px-4">
          <div className="bg-white rounded-lg w-full max-w-3xl shadow-2xl p-6 sm:p-8 relative border border-gray-300">
            <button
              onClick={() => setOpenProfile(null)}
              className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
              Booking Details - {openProfile.id}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              View complete booking information and consultation notes
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={openProfile.patientName}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={openProfile.doctorName}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Clinic Name
                </label>
                <input
                  type="text"
                  value={openProfile.clinicName}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Booking Type
                </label>
                <input
                  type="text"
                  value={openProfile.type}
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
                  value={openProfile.dateTime}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Amount
                </label>
                <input
                  type="text"
                  value={openProfile.amount}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Consultation Note
                </label>
                <input
                  type="text"
                  value={openProfile.note}
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
                  value={openProfile.status}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Payment Status
                </label>
                <input
                  type="text"
                  value={openProfile.payment}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => setOpenProfile(null)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors"
              >
                Cancel
              </button>
             {openProfile && !showRefundDialog  && (
                <button
                  onClick={handleRefundClick}
                  className="flex-1 py-3 px-4 bg-[#2E6FF3] text-white rounded-lg hover:bg-[#1B54D3] font-medium text-sm transition-colors"
                >
                  Refund Payment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Refund Confirmation Modal - Second Image */}
      {showRefundDialog && openProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-3 sm:px-4">
          <div className="bg-white rounded-lg w-full max-w-3xl shadow-2xl p-6 sm:p-8 relative border border-gray-300">
            <button
              onClick={() => setShowRefundDialog(false)}
              className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
              Booking Details - {openProfile.id}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              View complete booking information and consultation notes
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={openProfile.patientName}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={openProfile.doctorName}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Clinic Name
                </label>
                <input
                  type="text"
                  value={openProfile.clinicName}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Booking Type
                </label>
                <input
                  type="text"
                  value={openProfile.type}
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
                  value={openProfile.dateTime}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Amount
                </label>
                <input
                  type="text"
                  value={openProfile.amount}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Consultation Note
                </label>
                <input
                  type="text"
                  value={openProfile.note}
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
                  value={openProfile.status}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Payment Status
                </label>
                <input
                  type="text"
                  value={openProfile.payment}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => setShowRefundDialog(false)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRefundConfirm}
                className="flex-1 py-3 px-4 bg-[#2E6FF3] text-white rounded-lg hover:bg-[#1B54D3] font-medium text-sm transition-colors"
              >
                Refund Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Success Modal - Third Image */}
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
                The refund process has been successfully started. The funds will be
                transferred to the patient's account shortly, and they have been sent a
                notification regarding this transaction.
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

export default BookingManagementTable;

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
//   note: string;
//   type: string;
//   status: "Pending" | "Confirmed" | "Cancelled";
//   dateTime: string;
//   payment: "Paid" | "Refund Pending" | "Refunded";
// }

// const BookingManagementTable: React.FC = () => {
//   const [openProfile, setOpenProfile] = useState<Booking | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   const bookings: Booking[] = [
//     {
//       id: "BK-001",
//       patientName: "Samsel Arfin",
//       clinicName: "Dr. Michael Brown",
//       note: "have a good day",
//       type: "Online",
//       status: "Pending",
//       dateTime: "2025-11-06, 10:30 AM",
//       payment: "Paid",
//     },
//     {
//       id: "BK-002",
//       patientName: "Ariana Gomez",
//       clinicName: "Dr. Sarah Lee",
//       note: "have a good day",
//       type: "Offline",
//       status: "Confirmed",
//       dateTime: "2025-11-08, 02:00 PM",
//       payment: "Paid",
//     },
//     {
//       id: "BK-003",
//       patientName: "Michael Johnson",
//       clinicName: "Clinic Medico",
//       note: "have a good day",
//       type: "In-Clinic",
//       status: "Cancelled",
//       dateTime: "2025-11-05, 09:00 AM",
//       payment: "Refund Pending",
//     },
//     {
//       id: "BK-004",
//       patientName: "Emily Carter",
//       clinicName: "Dr. Daniel Smith",
//       note: "have a good day",
//       type: "Online",
//       status: "Confirmed",
//       dateTime: "2025-11-10, 03:00 PM",
//       payment: "Refunded",
//     },
//     {
//       id: "BK-005",
//       patientName: "David Brown",
//       clinicName: "Wellness Clinic",
//       note: "have a good day",
//       type: "Offline",
//       status: "Pending",
//       dateTime: "2025-11-11, 04:00 PM",
//       payment: "Paid",
//     },
//     {
//       id: "BK-006",
//       patientName: "Sophia Turner",
//       clinicName: "Dr. Rachel Adams",
//       note: "have a good day",
//       type: "In-Clinic",
//       status: "Cancelled",
//       dateTime: "2025-11-04, 11:30 AM",
//       payment: "Paid",
//     },
//   ];
//   const totalPages = Math.ceil(bookings.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentUsers = bookings.slice(startIndex, startIndex + itemsPerPage);

//   const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
//   const handleNext = () =>
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));

//   const handleView = (patient: Booking) => {
//     setOpenProfile(patient);
//   };

//   return (
//     <div className="">
//       <div className="rounded-xl border border-[#DBE0E5] bg-white shadow-sm p-6">
//         <div className="w-full">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//             {/* Left Section - Title */}
//             <h2 className="text-lg md:text-xl font-semibold text-[#343A40]">
//               All Booking Information
//             </h2>

//             {/* Right Section - Filters */}
//             <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
//               {/* Filter 1 - Status */}
//               <div className="w-full sm:w-[250px] md:w-[220px]">
//                 <Select defaultValue="all">
//                   <SelectTrigger className="w-full h-10 border border-[#B3B3B3] rounded-xl px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm flex items-center justify-between hover:border-gray-400 transition-all duration-200 cursor-pointer">
//                     <SelectValue placeholder="Select Status" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white border border-[#B3B3B3] rounded-md shadow-md">
//                     <SelectGroup>
//                       <SelectLabel className="px-4 pt-2 text-gray-500 text-sm">
//                         All Status Data
//                       </SelectLabel>
//                       <SelectItem
//                         value="all"
//                         className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
//                       >
//                         All Status
//                       </SelectItem>
//                       <SelectItem
//                         value="confirmed"
//                         className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
//                       >
//                         Confirmed
//                       </SelectItem>
//                       <SelectItem
//                         value="pending"
//                         className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
//                       >
//                         Pending
//                       </SelectItem>
//                       <SelectItem
//                         value="completed"
//                         className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
//                       >
//                         Completed
//                       </SelectItem>
//                       <SelectItem
//                         value="Cancelled"
//                         className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
//                       >
//                         Cancelled
//                       </SelectItem>
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Filter 2 - Type */}
//               <div className="w-full sm:w-[250px] md:w-[220px]">
//                 <Select defaultValue="all">
//                   <SelectTrigger className="w-full h-10 border border-[#B3B3B3] rounded-xl px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm flex items-center justify-between hover:border-gray-400 transition-all duration-200 cursor-pointer">
//                     <SelectValue placeholder="Select Type" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white border border-[#B3B3B3] rounded-md shadow-md">
//                     <SelectGroup>
//                       <SelectLabel className="px-4 pt-2 text-gray-500 text-sm">
//                         Type
//                       </SelectLabel>
//                       <SelectItem
//                         value="all"
//                         className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
//                       >
//                         All Type
//                       </SelectItem>
//                       <SelectItem
//                         value="online"
//                         className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
//                       >
//                         Online
//                       </SelectItem>
//                       <SelectItem
//                         value="offline"
//                         className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
//                       >
//                         Offline
//                       </SelectItem>
//                       <SelectItem
//                         value="hybrid"
//                         className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
//                       >
//                         Hybrid
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
//               {/* Table */}
//               <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
//                 <table className="min-w-[800px] w-full text-sm">
//                   <thead className="bg-gray-100 border-b border-gray-200">
//                     <tr>
//                       <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
//                         Booking ID
//                       </th>
//                       <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
//                         Patient Name
//                       </th>
//                       <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
//                         Clinic Name
//                       </th>
//                       <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
//                         Type
//                       </th>
//                       <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
//                         Status
//                       </th>
//                       <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
//                         Date & Time
//                       </th>
//                       <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
//                         Payment
//                       </th>
//                       <th className="px-6 py-4 text-center font-medium text-gray-700 whitespace-nowrap">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {bookings.map((booking) => (
//                       <tr
//                         key={booking.id}
//                         className="hover:bg-gray-50 transition-colors duration-200"
//                       >
//                         <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
//                           {booking.id}
//                         </td>
//                         <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
//                           {booking.patientName}
//                         </td>
//                         <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
//                           {booking.clinicName}
//                         </td>
//                         <td className="px-6 py-4 text-sky-500 whitespace-nowrap">
//                           {booking.type}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
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
//                         <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
//                           {booking.dateTime}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                            <span
//                             className={`px-3 py-1 text-xs font-medium rounded-full ${
//                              booking.payment === "Paid"
//                             ? "bg-[#E9F9EF] text-[#1B9268]" // Green
//                             : booking.payment === "Refund Pending"
//                             ? "bg-[#FFEAEB] text-[#E9575A]" // Light red bg + red text
//                              : booking.payment === "Refunded"
//                             ? "bg-[#F2E7FE] text-[#7243FF]" // Pink bg + purple text
//                             : ""
//                           }`}
//                        >
//                        {booking.payment}
//                           </span>
//                       </td>

//                         <td className="px-6 py-4 text-center whitespace-nowrap">
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
//             of <span className="font-medium">{bookings.length}</span> patients
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

//       {/* Patient Profile Dialog */}
//       {openProfile && (
//         <div className="fixed px-3 sm:px-4 inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-0.9">
//           <div className="bg-white rounded-lg w-full max-w-5xl shadow-2xl p-8 relative border border-gray-300 transform scale-100 transition-transform duration-200">
//             {/* Close Icon */}
//             <button
//               onClick={() => setOpenProfile(null)}
//               className="absolute cursor-pointer top-4 right-4 text-gray-600 hover:text-gray-800 hover:scale-110 transition-transform"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             {/* Title */}
//             <h2 className="text-2xl font-semibold text-[#1f3a44] mb-2">
//               Booking Details - BK001
//             </h2>
//             <p className="text-gray-600 text-sm mb-6">
//               View complete booking information and consultation notes
//             </p>

//             {/* Input Grid */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-gray-700 font-medium mb-1">
//                   Patient Name
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.patientName}
//                   readOnly
//                   className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-1">
//                   clinicName Name
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.clinicName}
//                   readOnly
//                   className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-1">
//                   Clinic Name
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.clinicName}
//                   readOnly
//                   className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-1">
//                   Booking Type
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.type}
//                   readOnly
//                   className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-1">
//                   Date & Time
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.dateTime}
//                   readOnly
//                   className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-1">
//                   Amount
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.payment}
//                   readOnly
//                   className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-1">
//                   Consultation Note
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.note}
//                   readOnly
//                   className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-1">
//                   Status
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.status}
//                   readOnly
//                   className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 font-medium mb-1">
//                   Payment Status
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.payment}
//                   readOnly
//                   className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingManagementTable;
