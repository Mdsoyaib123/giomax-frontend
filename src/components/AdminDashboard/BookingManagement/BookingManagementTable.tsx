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
  note: string;
  type: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  dateTime: string;
  payment: "Pending" | "Confirmed" | "Refused";
}

const BookingManagementTable: React.FC = () => {
  const [openProfile, setOpenProfile] = useState<Booking | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const bookings: Booking[] = [
    {
      id: "BK-001",
      patientName: "Samsel Arfin",
      clinicName: "Dr. Michael Brown",
      note: "have a good day",
      type: "Online",
      status: "Confirmed",
      dateTime: "2025-11-06, 10:30 AM",
      payment: "Confirmed",
    },
    {
      id: "BK-002",
      patientName: "Ariana Gomez",
      clinicName: "Dr. Sarah Lee",
      note: "have a good day",
      type: "Offline",
      status: "Pending",
      dateTime: "2025-11-08, 02:00 PM",
      payment: "Pending",
    },
    {
      id: "BK-003",
      patientName: "Michael Johnson",
      clinicName: "Clinic Medico",
      note: "have a good day",
      type: "In-Clinic",
      status: "Cancelled",
      dateTime: "2025-11-05, 09:00 AM",
      payment: "Refused",
    },
    {
      id: "BK-004",
      patientName: "Emily Carter",
      clinicName: "Dr. Daniel Smith",
      note: "have a good day",
      type: "Online",
      status: "Confirmed",
      dateTime: "2025-11-10, 03:00 PM",
      payment: "Confirmed",
    },
    {
      id: "BK-005",
      patientName: "David Brown",
      clinicName: "Wellness Clinic",
      note: "have a good day",
      type: "Offline",
      status: "Pending",
      dateTime: "2025-11-11, 04:00 PM",
      payment: "Pending",
    },
    {
      id: "BK-006",
      patientName: "Sophia Turner",
      clinicName: "Dr. Rachel Adams",
      note: "have a good day",
      type: "In-Clinic",
      status: "Cancelled",
      dateTime: "2025-11-04, 11:30 AM",
      payment: "Refused",
    },
  ];
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = bookings.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleView = (patient: Booking) => {
    setOpenProfile(patient);
  };

  return (
    <div className="">
      <div className="rounded-xl border border-[#DBE0E5] bg-white shadow-sm p-6">
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            {/* Left Section - Title */}
            <h2 className="text-lg md:text-xl font-semibold text-[#343A40]">
              All Booking Information
            </h2>

            {/* Right Section - Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Filter 1 - Status */}
              <div className="w-full sm:w-[250px] md:w-[220px]">
                <Select defaultValue="all">
                  <SelectTrigger className="w-full h-10 border border-[#B3B3B3] rounded-xl px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm flex items-center justify-between hover:border-gray-400 transition-all duration-200 cursor-pointer">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[#B3B3B3] rounded-md shadow-md">
                    <SelectGroup>
                      <SelectLabel className="px-4 pt-2 text-gray-500 text-sm">
                        All Status Data
                      </SelectLabel>
                      <SelectItem
                        value="all"
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                      >
                        All Status
                      </SelectItem>
                      <SelectItem
                        value="confirmed"
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                      >
                        Confirmed
                      </SelectItem>
                      <SelectItem
                        value="pending"
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                      >
                        Pending
                      </SelectItem>
                      <SelectItem
                        value="completed"
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                      >
                        Completed
                      </SelectItem>
                      <SelectItem
                        value="Cancelled"
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                      >
                        Cancelled
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter 2 - Type */}
              <div className="w-full sm:w-[250px] md:w-[220px]">
                <Select defaultValue="all">
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
                        Offline
                      </SelectItem>
                      <SelectItem
                        value="hybrid"
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                      >
                        Hybrid
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
                        Clinic Name
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
                    {bookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                          {booking.id}
                        </td>
                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                          {booking.patientName}
                        </td>
                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                          {booking.clinicName}
                        </td>
                        <td className="px-6 py-4 text-sky-500 whitespace-nowrap">
                          {booking.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
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
                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                          {booking.dateTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              booking.payment === "Confirmed"
                                ? "bg-blue-100 text-blue-700"
                                : booking.payment === "Pending"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
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
            Showing <span className="font-medium">{currentUsers.length}</span>{" "}
            of <span className="font-medium">{bookings.length}</span> patients
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

      {/* Patient Profile Dialog */}
      {openProfile && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-0.9">
          <div className="bg-white rounded-lg w-full max-w-5xl shadow-2xl p-8 relative border border-gray-300 transform scale-100 transition-transform duration-200">
            {/* Close Icon */}
            <button
              onClick={() => setOpenProfile(null)}
              className="absolute cursor-pointer top-4 right-4 text-gray-600 hover:text-gray-800 hover:scale-110 transition-transform"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-[#1f3a44] mb-2">
              Booking Details - BK001
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              View complete booking information and consultation notes
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
                  clinicName Name
                </label>
                <input
                  type="text"
                  value={openProfile.clinicName}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Clinic Name
                </label>
                <input
                  type="text"
                  value={openProfile.clinicName}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Booking Type
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
                  Amount
                </label>
                <input
                  type="text"
                  value={openProfile.payment}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Consultation Note
                </label>
                <input
                  type="text"
                  value={openProfile.note}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Status
                </label>
                <input
                  type="text"
                  value={openProfile.status}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Payment Status
                </label>
                <input
                  type="text"
                  value={openProfile.payment}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagementTable;
