/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { FaEye, FaSpinner } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Dialogue from "./Dialogue";
import SectionTitle from "@/common/SectionTitle";
import text from "@/assets/text.png";
import {
  useCreatePatientMutation,
  useGetAllPatientsQuery,
} from "@/redux/features/patients/patientsApi";
import { Patient } from "@/types/patientsType";
import TableRowSkeleton from "@/components/Skeleton/TableRowSkeleton";
import { toast } from "sonner";

const PatientList = () => {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState<Patient | null>(null);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage] = useState(9);
  const [patientData, setPatientData] = useState({
    fullName: "",
    gender: "",
    email: "",
    phoneNumber: "",
    service: "",
    serviceType: "",
    date: "",
    time: "",
    password: "",
    comfirmPassword: "",
    bloodGroup: "",
    dateOfBirth: "",
  });

  const { data: apiResponse, isLoading } = useGetAllPatientsQuery();
  const [createPatient, { isLoading: isCreating }] = useCreatePatientMutation();

  // Navigate to payment history page
  const handleClick = (patientId: number) => {
    navigate(`/admin-dashboard/payment-history/${patientId}`);
  };

  const handleMessageClick = () => {
    navigate("/clinic-dashboard/message");
  };

  // Get patients from API response
  const allPatients = apiResponse?.data || [];

  // Filter patients based on search query
  const filteredPatients = allPatients.filter((patient) => {
    const fullName = patient?.userId?.fullName?.toLowerCase() || "";
    const email = patient?.userId?.email?.toLowerCase() || "";
    const phone = patient?.phoneNumber?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();

    return (
      fullName.includes(query) || email.includes(query) || phone.includes(query)
    );
  });

  // Calculate pagination values
  const totalPatients = filteredPatients.length;
  const totalPages = Math.ceil(totalPatients / itemsPerPage);

  // Calculate start and end index for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalPatients);

  // Get current page patients
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  // Calculate showing text
  const getShowingText = () => {
    if (totalPatients === 0) return "Showing 0 patients";
    if (totalPatients <= itemsPerPage)
      return `Showing ${totalPatients} of ${totalPatients} patients`;
    return `Showing ${
      startIndex + 1
    } to ${endIndex} of ${totalPatients} patients`;
  };

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Function to handle page number click
  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers with ellipsis for better UX
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Maximum number of page buttons to show

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than or equal to maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first page, last page, and pages around current page
      if (currentPage <= 3) {
        // Near the beginning
        pageNumbers.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        // In the middle
        pageNumbers.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pageNumbers;
  };

  const handleAddPatient = async () => {
    try {
      await createPatient(patientData).unwrap();
      toast.success("Patient created successfully!");
      setShowAddPatientModal(false);
      setPatientData({
        fullName: "",
        gender: "",
        email: "",
        phone: "",
        service: "",
        serviceType: "",
        date: "",
        time: "",
        password: "",
        comfirmPassword: "",
        bloodGroup: "",
        dateOfBirth: "",
      });
    } catch (error: any) {
      toast.error(error.data.message);
    }
    // send to API or Redux
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle input/select change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
                value={searchQuery}
                onChange={handleSearchChange}
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
                        ) : currentPatients.length > 0 ? (
                          currentPatients.map((user) => (
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
                              <td className="px-6 flex items-center justify-center  py-4 whitespace-nowrap text-sm">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={handleMessageClick}
                                    className="flex items-center gap-1.5  px-5 py-2 bg-[#E5E7EB] text-[#374151] rounded-md hover:bg-[#D1D5DB] justify-center transition-colors cursor-pointer text-sm font-medium"
                                  >
                                    <img
                                      src={text}
                                      alt="Message"
                                      className="w-4 h-4 "
                                    />
                                    <span>Message</span>{" "}
                                    <span className="hidden md:block">
                                      Patient
                                    </span>
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
                              colSpan={4}
                              className="px-6 py-8 text-center text-gray-500"
                            >
                              {searchQuery
                                ? "No patients found matching your search"
                                : "No patients found"}
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
          {totalPatients > 0 && (
            <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-[#E5E7EB]">
              <p className="text-sm text-gray-600 mb-3 sm:mb-0">
                {getShowingText()}
              </p>

              <div className="flex gap-2 items-center">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 border rounded-lg text-sm cursor-pointer ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed text-gray-400"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  Prev
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {getPageNumbers().map((pageNum, index) => (
                    <React.Fragment key={index}>
                      {pageNum === "..." ? (
                        <span className="px-3 py-1.5 text-gray-500">...</span>
                      ) : (
                        <button
                          onClick={() => handlePageClick(pageNum as number)}
                          className={`px-3 py-1.5 border rounded-md text-sm cursor-pointer ${
                            currentPage === pageNum
                              ? "bg-[#2E6FF3] text-white border-[#2E6FF3]"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 border rounded-lg text-sm cursor-pointer ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed text-gray-400"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
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
              <div className="p-5 sm:p-6 space-y-5">
                {/* Patient Name & Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Ex: David Gongonza"
                      value={patientData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={patientData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                    >
                      <option value="">Select Patient Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      {/* <option value="Other">Other</option> */}
                    </select>
                  </div>
                </div>

                {/* Date of Birth & Blood Group */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={patientData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Group <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="bloodGroup"
                      value={patientData.bloodGroup}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter Patient Email Address"
                      value={patientData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Enter Patient Phone Number"
                      value={patientData.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Service & Service Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="service"
                      value={patientData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                    >
                      <option value="">Select Service</option>
                      <option value="inClinic">In Clinic</option>
                      <option value="Consultation">Consultation</option>
                      <option value="Follow-up">Follow-up</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="serviceType"
                      value={patientData.serviceType}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                    >
                      <option>General Checkup</option>
                      <option>Consultation</option>
                      <option>Follow-up</option>
                    </select>
                  </div>
                </div>

                {/* Appointment Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={patientData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={patientData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter Password"
                      value={patientData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="comfirmPassword"
                      placeholder="Confirm Password"
                      value={patientData.comfirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
                  disabled={isCreating}
                  onClick={handleAddPatient}
                  className="flex-1 font-medium text-sm cursor-pointer px-5 py-2 rounded-lg bg-[#2E6FF3] text-white border border-[#2E6FF3] hover:bg-[#0b51de] transition"
                >
                  {isCreating ? (
                    <div className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2" />
                      <span className="ml-2">Adding...</span>
                    </div>
                  ) : (
                    "Add Patient"
                  )}
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
