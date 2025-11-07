import React, { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
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

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  email: string;
  phone: string;
  totalBooking: string;
}

const BookingManagementTable: React.FC = () => {
  const [openProfile, setOpenProfile] = useState<Patient | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const users: Patient[] = [
    {
      id: "USR-001",
      name: "Samsel Arfin",
      age: 26,
      gender: "Male",
      location: "Shota Rustaveli Ave. No. 22, Apt 5",
      email: "sarah.j@gmail.com",
      phone: "+995 595 123 456",
      totalBooking: "12",
    },
    {
      id: "USR-002",
      name: "Ariana Gomez",
      age: 23,
      gender: "Female",
      location: "Shota Rustaveli Ave. No. 18, Apt 2",
      email: "ariana.gomez@gmail.com",
      phone: "+995 595 111 222",
      totalBooking: "8",
    },
    {
      id: "USR-003",
      name: "Michael Johnson",
      age: 35,
      gender: "Male",
      location: "Rustavi Blvd 5, Flat 12",
      email: "michael.johnson@gmail.com",
      phone: "+995 595 333 444",
      totalBooking: "15",
    },
    {
      id: "USR-004",
      name: "Emily Carter",
      age: 29,
      gender: "Female",
      location: "Vazha Pshavela Ave 42",
      email: "emily.carter@gmail.com",
      phone: "+995 595 555 666",
      totalBooking: "10",
    },
    {
      id: "USR-005",
      name: "David Brown",
      age: 31,
      gender: "Male",
      location: "Freedom Sq. Building 1",
      email: "david.brown@gmail.com",
      phone: "+995 595 777 888",
      totalBooking: "6",
    },
    {
      id: "USR-006",
      name: "Sophia Turner",
      age: 27,
      gender: "Female",
      location: "Tamarashvili St. No. 8",
      email: "sophia.turner@gmail.com",
      phone: "+995 595 999 000",
      totalBooking: "9",
    },
  ];

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleView = (patient: Patient) => {
    setOpenProfile(patient);
  };

  const handleRemove = (id: string) => {
    alert(`Patient ${id} removed successfully!`);
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
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-[800px] w-full text-sm">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Group Name
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Email Address
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Phone Number
                      </th>
                      <th className="px-6 py-4 text-center font-medium text-gray-700 whitespace-nowrap">
                        Total Bookings
                      </th>
                      <th className="px-6 py-4 text-center font-medium text-gray-700 whitespace-nowrap">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="px-6 whitespace-nowrap py-3 font-semibold text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 whitespace-nowrap py-3 text-gray-700">
                          {user.location}
                        </td>
                        <td className="px-6 whitespace-nowrap py-3 text-gray-700">
                          {user.email}
                        </td>
                        <td className="px-6 whitespace-nowrap py-3 text-gray-700">
                          {user.phone}
                        </td>
                        <td className="px-6 whitespace-nowrap py-3 text-center text-gray-700">
                          {user.totalBooking}
                        </td>
                        <td className="px-6 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleView(user)}
                              className="flex cursor-pointer items-center gap-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-3 py-1.5 rounded-md transition"
                            >
                              <FaEye className="text-blue-600" /> View
                            </button>
                            <button
                              onClick={() => handleRemove(user.id)}
                              className="flex items-center cursor-pointer gap-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 font-medium px-3 py-1.5 rounded-md transition"
                            >
                              <RiDeleteBinLine className="text-red-600" />{" "}
                              Remove
                            </button>
                          </div>
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
            of <span className="font-medium">{users.length}</span> patients
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
                  value={openProfile.name}
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
                  value={openProfile.age}
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
                  value={openProfile.gender}
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
                  value={openProfile.phone}
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
                  value={openProfile.email}
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
                  value={openProfile.location}
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

export default BookingManagementTable;
