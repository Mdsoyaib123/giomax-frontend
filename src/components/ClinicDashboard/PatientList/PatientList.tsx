/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Dialogue from "./Dialogue";
import SectionTitle from "@/common/SectionTitle";
import text from "@/assets/text.png";
import { useGetAllPatientsQuery } from "@/redux/features/patients/patientsApi";
import { Patient } from "@/types/patientsType";
import TableRowSkeleton from "@/components/Skeleton/TableRowSkeleton";

interface Props {
  id: string | number;
}

const PatientList: React.FC<Props> = ({ id }) => {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState<Patient | null>(null);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: apiResponse, isLoading } = useGetAllPatientsQuery();
  // Navigate to payment history page
  const handleClick = (patientId: number) => {
    navigate(`/admin-dashboard/payment-history/${patientId}`);
  };
  console.log(id);

  const handleMessageClick = () => {
    navigate("/clinic-dashboard/message");
  };
  const patients = apiResponse?.data || [];
  // // Provided Patient Data
  // const patients: Patient[] = [
  //   {
  //     id: 1,
  //     name: "Sarah Johnson",
  //     email: "sarah.j@gmail.com",
  //     phone: "+995 595 123 456",
  //     totalBookings: 12,
  //     lastAppointment: "Oct 12, 2025",
  //   },
  //   {
  //     id: 2,
  //     name: "Michael Chen",
  //     email: "michael.c@gmail.com",
  //     phone: "+995 577 987 654",
  //     totalBookings: 20,
  //     lastAppointment: "Oct 10, 2025",
  //   },
  //   {
  //     id: 3,
  //     name: "Emily Rodriguez",
  //     email: "emily.r@gmail.com",
  //     phone: "+995 599 001 223",
  //     totalBookings: 4,
  //     lastAppointment: "Oct 8, 2025",
  //   },
  //   {
  //     id: 4,
  //     name: "James Wilson",
  //     email: "james.w@gmail.com",
  //     phone: "+995 32 245 6789",
  //     totalBookings: 10,
  //     lastAppointment: "Oct 5, 2025",
  //   },
  //   {
  //     id: 5,
  //     name: "Lisa Anderson",
  //     email: "lisa.a@gmail.com",
  //     phone: "+995 431 102 345",
  //     totalBookings: 1,
  //     lastAppointment: "Oct 3, 2025",
  //   },
  //   {
  //     id: 6,
  //     name: "Ekvom Nabuin",
  //     email: "ekvom_nabuin@gmail.com",
  //     phone: "+995 422 789 012",
  //     totalBookings: 2,
  //     lastAppointment: "Sep 28, 2025",
  //   },
  //   {
  //     id: 7,
  //     name: "Jonathan Kimali",
  //     email: "j.kimali@gmail.com",
  //     phone: "+995 555 334 455",
  //     totalBookings: 5,
  //     lastAppointment: "Sep 25, 2025",
  //   },
  //   {
  //     id: 8,
  //     name: "Hon. Naomi Wapo",
  //     email: "naomiw@gmail.com",
  //     phone: "+995 341 508 708",
  //     totalBookings: 15,
  //     lastAppointment: "Sep 20, 2025",
  //   },
  //   {
  //     id: 9,
  //     name: "Brian Kirkogali Koech",
  //     email: "brian.kiplog@gmail.com",
  //     phone: "+995 503 678 901",
  //     totalBookings: 10,
  //     lastAppointment: "Sep 15, 2025",
  //   },
  // ];
  console.log(apiResponse);

  const totalPages = Math.ceil(patients.length / 9);
  const [currentpatients, setCurrentpatients] = useState<Patient[]>([]);

  if (currentPage === 1) {
    setCurrentpatients(patients);
  } else if (currentPage === 2) {
    setCurrentpatients(patients.slice(0, 5));
  } else {
    setCurrentpatients([]); // Pages 3-9 are empty
  }

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleAddPatient = () => {
    // Handle add patient logic here
    alert("Patient added successfully!");
    setShowAddPatientModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="w-full sm:w-auto">
          <SectionTitle
            title="Patients List"
            description="View and manage all registered patients"
          />
        </div>
        <div className="w-full sm:w-auto">
          {/* Add New Patient Button */}
          <button
            onClick={() => setShowAddPatientModal(true)}
            className="h-10 px-4 bg-[#2E6FF3] text-white text-sm font-medium rounded-lg hover:bg-[#034ee6] transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 w-full sm:w-auto"
          >
            <span className="text-lg font-bold">+</span>
            Add New Patient
          </button>
        </div>
      </div>

      <div>
        <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 ">
            <h2 className="text-lg font-semibold text-[#111827]">
              All Patients Information
            </h2>

            <div className="flex items-center w-full sm:w-[320px] h-10 bg-[#F9FAFB] rounded-lg px-3 border border-[#E5E7EB]">
              <IoIosSearch className="text-gray-400 text-xl" />
              <input
                type="search"
                placeholder="Search patients..."
                className="bg-transparent flex-1 pl-2 text-sm text-gray-700 focus:outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="px-6">
            <div className="p-5 border border-[#E4E4E4] rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4  gap-5">
                <div className="xl:col-span-4 w-full">
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-[800px] w-full text-sm">
                      <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap w-1/4">
                            Patient Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap w-1/4">
                            Email Address
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap w-1/4">
                            Phone Number
                          </th>
                          {/* <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">
                          Total Bookings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">
                          Last Appointment
                        </th> */}
                          <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap w-1/4">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-[#E5E7EB] bg-white  ">
                        {isLoading ? (
                          <>
                            <TableRowSkeleton columns={4} rows={9} />
                          </>
                        ) : currentpatients.length > 0 ? (
                          currentpatients.map((user) => (
                            <tr
                              key={user._id}
                              className="hover:bg-gray-50 transition-colors duration-150 "
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">
                                {user?.userId?.fullName || "No Name"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                                {user?.userId?.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                                {user?.phoneNumber}
                              </td>
                              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-[#111827]">
                              {user.medicalHistory?.length > 0
                                ? user.medicalHistory.lengt h
                                : "0"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                              {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )
                                : "No Date"}
                            </td> */}
                              <td className="px-6 flex items-center justify-center  py-4 whitespace-nowrap text-sm">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={handleMessageClick}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-[#E5E7EB] text-[#374151] rounded-md hover:bg-[#D1D5DB] transition-colors cursor-pointer text-sm font-medium"
                                  >
                                    <img
                                      src={text}
                                      alt="Message"
                                      className="w-4 h-4"
                                    />
                                    Message Patient
                                  </button>
                                  <button
                                    onClick={() => setOpenProfile(user)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-[#2E6FF3] text-white rounded-md hover:bg-[#034ee6] transition-colors cursor-pointer text-sm font-medium"
                                  >
                                    <FaEye className="w-4 h-4" />
                                    View
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-6 py-8 text-center text-gray-500"
                            >
                              No patients found on this page
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between  border-[#E5E7EB]">
            <p className="text-sm text-gray-600">
              {currentPage === 1 && `Showing 9 of 9 patients`}
              {currentPage === 2 && `Showing 5 of 5 patients`}
              {currentPage > 2 && `Showing 0 patients`}
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
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-5">
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
                  className="flex-1 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 text-gray-700 font-medium text-sm transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleAddPatient}
                  className="flex-1 font-medium text-sm cursor-pointer px-5 py-2 rounded-lg bg-[#2E6FF3] text-white border border-[#2E6FF3] hover:bg-[#0b51de] transition"
                >
                  Add patient
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;
