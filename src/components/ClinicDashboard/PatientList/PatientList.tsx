import React, { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Dialogue from "./Dialogue";

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  lastAppointment: string;
}

interface Props {
  id: string | number;
}

const PatientList: React.FC<Props> = ({ id }) => {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState<Patient | null>(null);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Navigate to payment history page
  const handleClick = (patientId: number) => {
    navigate(`/admin-dashboard/payment-history/${patientId}`);
  };

  // Provided Patient Data
  const patients: Patient[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@gmail.com",
      phone: "+995 595 123 456",
      totalBookings: 12,
      lastAppointment: "Oct 12, 2025",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.c@gmail.com",
      phone: "+995 577 987 654",
      totalBookings: 20,
      lastAppointment: "Oct 10, 2025",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.r@gmail.com",
      phone: "+995 599 001 223",
      totalBookings: 4,
      lastAppointment: "Oct 8, 2025",
    },
    {
      id: 4,
      name: "James Wilson",
      email: "james.w@gmail.com",
      phone: "+995 32 245 6789",
      totalBookings: 10,
      lastAppointment: "Oct 5, 2025",
    },
    {
      id: 5,
      name: "Lisa Anderson",
      email: "lisa.a@gmail.com",
      phone: "+995 431 102 345",
      totalBookings: 1,
      lastAppointment: "Oct 3, 2025",
    },
    {
      id: 6,
      name: "Ekvom Nabuin",
      email: "ekvom_nabuin@gmail.com",
      phone: "+995 422 789 012",
      totalBookings: 2,
      lastAppointment: "Sep 28, 2025",
    },
    {
      id: 7,
      name: "Jonathan Kimali",
      email: "j.kimali@gmail.com",
      phone: "+995 555 334 455",
      totalBookings: 5,
      lastAppointment: "Sep 25, 2025",
    },
    {
      id: 8,
      name: "Hon. Naomi Wapo",
      email: "naomiwap@gmail.com",
      phone: "+995 341 568 708",
      totalBookings: 15,
      lastAppointment: "Sep 20, 2025",
    },
    {
      id: 9,
      name: "Brian Kirkogali Koech",
      email: "brian.kiplog@gmail.com",
      phone: "+995 503 678 901",
      totalBookings: 10,
      lastAppointment: "Sep 15, 2025",
    },
  ];

  const totalPages = Math.ceil(patients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentpatients = patients.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleRemove = (id: number) => {
    alert(`Patient ${id} removed successfully!`);
  };

  const handleAddPatient = () => {
    // Handle add patient logic here
    alert("Patient added successfully!");
    setShowAddPatientModal(false);
  };

  return (
    <div>
      <div className="rounded-xl border border-[#DBE0E5] bg-white shadow-sm p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h2 className="text-lg font-semibold text-[#343A40]">
            All Patients Information
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search */}
            <div className="flex items-center w-full sm:w-[320px] h-9 bg-[#F5F7FB] rounded-lg px-3 py-1.5">
              <IoIosSearch className="text-gray-500 text-lg ml-2" />
              <input
                type="search"
                placeholder="Search patients..."
                className="bg-transparent flex-1 pl-2 text-sm text-gray-700 focus:outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Add New Patient Button */}
            <button
              onClick={() => setShowAddPatientModal(true)}
              className="h-9 px-4 bg-[#2E6FF3] text-white text-sm font-medium rounded-lg hover:bg-[#034ee6] transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <span className="text-lg font-bold">+</span>
              Add New Patient
            </button>
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
                      <th className="px-6 py-4 whitespace-nowrap text-left">
                        Name
                      </th>
                      <th className="px-6 py-4 whitespace-nowrap text-left">
                        Email
                      </th>
                      <th className="px-6 py-4 whitespace-nowrap text-left">
                        Phone
                      </th>
                      <th className="px-6 py-4 whitespace-nowrap text-center">
                        Total Bookings
                      </th>
                      <th className="px-6 py-4 whitespace-nowrap text-center">
                        Last Appointment
                      </th>
                      <th className="px-6 py-4 whitespace-nowrap text-center">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {currentpatients.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-3 whitespace-nowrap font-semibold text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          {user.email}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          {user.phone}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-center">
                          {user.totalBookings}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-center">
                          {user.lastAppointment}
                        </td>

                        <td className="px-6 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setOpenProfile(user)}
                              className="flex items-center gap-1 bg-[#2E6FF3] text-white px-3 py-1.5 rounded-md hover:bg-[#034ee6] transition-colors cursor-pointer"
                            >
                              <FaEye /> View
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
            Showing {currentpatients.length} of {patients.length} patients
          </p>

          <div className="flex gap-2 items-center">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 border rounded-lg text-sm cursor-pointer ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Prev
            </button>

            <div className="px-3 py-1.5 border rounded-md bg-gray-50">
              {currentPage} / {totalPages}
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 border rounded-lg text-sm cursor-pointer ${
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

      {/* View Patient Dialogue Modal */}
      {openProfile && (
        <Dialogue
          patient={openProfile}
          onClose={() => setOpenProfile(null)}
          onViewPaymentHistory={handleClick}
        />
      )}

      {/* Add New Patient Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl relative shadow-2xl border border-[#DBE0E5]">
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#DBE0E5]">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Add New Patient
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Enter patient information
                </p>
              </div>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6">
              <div className="space-y-5">
                {/* Patient Name & Gender Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: David Gongonza"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500">
                      <option>Select Patient Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* Email & Phone Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter Patient Email Address"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter Patient Phone Number"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Service & Service Type Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500">
                      <option>Select Service</option>
                      <option>General Checkup</option>
                      <option>Consultation</option>
                      <option>Follow-up</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500">
                      <option>Select Service Type</option>
                      <option>Clinic Visit</option>
                      <option>Online Consultation</option>
                    </select>
                  </div>
                </div>

                {/* Select Date & Select Time Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 p-5 sm:p-6 border-t border-[#DBE0E5] bg-gray-50">
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleAddPatient}
                className="flex-1 py-3 bg-[#2E6FF3] text-white rounded-lg hover:bg-[#034ee6] font-medium text-sm transition-colors cursor-pointer"
              >
                Add patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;