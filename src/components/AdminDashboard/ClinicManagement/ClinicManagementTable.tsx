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
  doctor: string;
  type: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  dateTime: string;
  payment: "Pending" | "Confirmed" | "Refused";
}

const ClinicManagementTable: React.FC = () => {
  const [openProfile, setOpenProfile] = useState<Booking | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const bookings: Booking[] = [
    {
      id: "BK-001",
      patientName: "Samsel Arfin",
      doctor: "Dr. Michael Brown",
      type: "Online",
      status: "Confirmed",
      dateTime: "2025-11-06, 10:30 AM",
      payment: "Confirmed",
    },
    {
      id: "BK-002",
      patientName: "Ariana Gomez",
      doctor: "Dr. Sarah Lee",
      type: "Offline",
      status: "Pending",
      dateTime: "2025-11-08, 02:00 PM",
      payment: "Pending",
    },
    {
      id: "BK-003",
      patientName: "Michael Johnson",
      doctor: "Clinic Medico",
      type: "Hybrid",
      status: "Cancelled",
      dateTime: "2025-11-05, 09:00 AM",
      payment: "Refused",
    },
    {
      id: "BK-004",
      patientName: "Emily Carter",
      doctor: "Dr. Daniel Smith",
      type: "Online",
      status: "Confirmed",
      dateTime: "2025-11-10, 03:00 PM",
      payment: "Confirmed",
    },
    {
      id: "BK-005",
      patientName: "David Brown",
      doctor: "Wellness Clinic",
      type: "Offline",
      status: "Pending",
      dateTime: "2025-11-11, 04:00 PM",
      payment: "Pending",
    },
    {
      id: "BK-006",
      patientName: "Sophia Turner",
      doctor: "Dr. Rachel Adams",
      type: "Hybrid",
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
              All Patients Information
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
                        Doctor / Clinic
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
                          {booking.doctor}
                        </td>
                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
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
              Patient Profile
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              View detailed patient information and history
            </p>

            {/* Input Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Name
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
                  Age
                </label>
                <input
                  type="text"
                  value={openProfile.doctor}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Gender
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
                  Phone
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
                  Email
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
                  Location
                </label>
                <input
                  type="text"
                  value={openProfile.payment}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>
            </div>

            {/* Divider */}
            <hr className="my-6 border-gray-200" />

            <div className="space-y-6 w-full">
              <h2 className="text-xl font-semibold text-gray-800">
                Appointment History
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                {/* Appointment Card */}
                <div className="bg-[#F4F6F8] p-5 rounded-2xl border border-[#CED4DA] shadow-sm flex justify-between items-center w-full sm:w-1/2 hover:shadow-md transition-shadow duration-200">
                  {/* Left side: Name and Date */}
                  <div>
                    <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                      Dr. Michael Brown
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">2025-10-15</p>
                    <p className="text-gray-400 text-sm mt-0.5">
                      Cardiologist
                    </p>{" "}
                    {/* Optional profession */}
                  </div>

                  {/* Right side: Status */}
                  <div>
                    <p className="px-3 py-1 text-sm font-medium rounded-full bg-[#1D4ED8] text-white">
                      Completed
                    </p>
                  </div>
                </div>

                <div className="bg-[#F4F6F8] p-5 rounded-2xl border border-[#CED4DA] shadow-sm flex justify-between items-center w-full sm:w-1/2 hover:shadow-md transition-shadow duration-200">
                  <div>
                    <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                      Dr. Sarah Lee
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">2025-09-28</p>
                    <p className="text-gray-400 text-sm mt-0.5">
                      Dermatologist
                    </p>
                  </div>
                  <div>
                    <p className="px-3 py-1 text-sm font-medium rounded-full bg-[#1B9268] text-white">
                      Upcoming
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex  gap-4 mt-6">
              <button
                onClick={() => setOpenProfile(null)}
                className=" w-full cursor-pointer px-5 py-2 rounded-lg border border-[#ECEFF1] bg-[#EFF4FF] text-gray-700 hover:bg-gray-100 transition"
              >
                Close
              </button>
              <button
                onClick={() => alert("View Payment History clicked!")} // Replace with actual handler
                className="w-full cursor-pointer px-5 py-2 rounded-lg bg-[#2E6FF3] text-white hover:bg-[#0b51de] transition"
              >
                View Payment History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicManagementTable;
