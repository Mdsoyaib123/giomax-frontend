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
import { useNavigate } from "react-router-dom";
import { MdOutlineDoNotDisturb } from "react-icons/md";
import { useGetAllClinicsQuery } from "@/redux/features/clinicMnagemant/clinicManagementApi";

interface Booking {
  id: string;
  licenceNumber: string;
  earnings: string;
  clinicName: string;
  services: string;
  status: "Pending" | "Active" | "Cancelled";
  totalDoctors: string;
  address: string;
  servicesProvided: string;
}

interface Props {
  id: string | number; // assuming you have an id for each user/payment
}

const ClinicManagementTable: React.FC<Props> = ({ id }) => {
  const { data: clinics } = useGetAllClinicsQuery({});
  console.log(clinics);
  const [openProfile, setOpenProfile] = useState<Booking | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to payment-history page with id
    navigate(`/admin-dashboard/clinic-management/${id}`);
  };

  const bookings: Booking[] = [
    {
      id: "BK-001",
      licenceNumber: "CL-98766",
      earnings: "4500",
      clinicName: "Dr. Michael Brown",
      services: "General Consultation",
      status: "Active",
      totalDoctors: "11",
      address: "Magura, Khulna, Bangladesh",
      servicesProvided: "General Consultation, Laboratory, Radiology",
    },
    {
      id: "BK-002",
      licenceNumber: "CL-56432",
      earnings: "3200",
      clinicName: "Dr. Sarah Johnson",
      services: "Dental Care",
      status: "Pending",
      totalDoctors: "8",
      address: "Dhanmondi, Dhaka, Bangladesh",
      servicesProvided: "Dental Cleaning, Orthodontics, X-Ray Imaging",
    },
    {
      id: "BK-003",
      licenceNumber: "CL-77654",
      earnings: "5200",
      clinicName: "Dr. Robert Smith",
      services: "Cardiology",
      status: "Active",
      totalDoctors: "15",
      address: "Chattogram, Bangladesh",
      servicesProvided:
        "Heart Checkups, ECG, Stress Test, Blood Pressure Monitoring",
    },
    {
      id: "BK-004",
      licenceNumber: "CL-99231",
      earnings: "2750",
      clinicName: "Dr. Emily Davis",
      services: "Pediatrics",
      status: "Cancelled",
      totalDoctors: "9",
      address: "Sylhet, Bangladesh",
      servicesProvided:
        "Child Vaccination, Growth Monitoring, General Pediatric Care",
    },
    {
      id: "BK-005",
      licenceNumber: "CL-44321",
      earnings: "6100",
      clinicName: "Dr. David Wilson",
      services: "Orthopedics",
      status: "Active",
      totalDoctors: "12",
      address: "Rajshahi, Bangladesh",
      servicesProvided:
        "Bone Fracture Treatment, Joint Replacement, Physiotherapy",
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
              All Clinics
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
                        Clinic Name
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Services
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Total Doctor
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Status
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
                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                          {booking.clinicName}
                        </td>
                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                          {booking.services}
                        </td>
                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                          {booking.totalDoctors}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              booking.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : booking.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleView(booking)}
                              className="inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-md bg-[#2E6FF3] text-white text-xs hover:bg-[#1B54D3] transition"
                            >
                              <FaEye className="text-sm" /> View
                            </button>
                            <button className="flex items-center cursor-pointer gap-1 text-sm bg-[#E9575A] hover:bg-[#b81113] text-white font-medium px-3 py-1.5 rounded-md transition">
                              <MdOutlineDoNotDisturb className="text-white" />{" "}
                              Suspend
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
          <div className="bg-white rounded-lg w-full max-w-5xl shadow-2xl p-8 relative border border-gray-300 transform scale-100 transition-transform duration-200 max-h-[94vh] overflow-y-auto">
            {/* Close Icon */}
            <button
              onClick={() => setOpenProfile(null)}
              className="absolute cursor-pointer top-4 right-4 text-gray-600 hover:text-gray-800 hover:scale-110 transition-transform"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-[#1f3a44] mb-2">
              Clinic Details
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              View clinic information, affiliated doctors, and verification
              status
            </p>

            {/* Input Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Clinic Name
                </label>
                <input
                  type="text"
                  value={openProfile.clinicName}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  value={openProfile.licenceNumber}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={openProfile.address}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Total Doctors
                </label>
                <input
                  type="text"
                  value={openProfile.totalDoctors}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Total Earnings
                </label>
                <input
                  type="text"
                  value={openProfile.earnings}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Services Provided
                </label>
                <input
                  type="text"
                  value={openProfile.servicesProvided}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>
            </div>

            {/* Divider */}
            <hr className="my-6 border-gray-200" />

            <div className="w-full space-y-6">
              <div className="flex flex-col lg:flex-row gap-8 w-full">
                {/* Left Section - Affiliated Doctors */}
                <div className="flex-1 space-y-4 bg-white p-2">
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-900  pb-2">
                    Affiliated Doctors
                  </h1>

                  {/* Row 1 */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      value={openProfile.clinicName}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-[#F9FAFB] text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a54]"
                    />
                    <input
                      type="text"
                      value={openProfile.clinicName}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-[#F9FAFB] text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a54]"
                    />
                  </div>

                  {/* Row 2 */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      value={openProfile.clinicName}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-[#F9FAFB] text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a54]"
                    />
                    <input
                      type="text"
                      value={openProfile.clinicName}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-[#F9FAFB] text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a54]"
                    />
                  </div>

                  {/* Row 3 */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      value={openProfile.clinicName}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-[#F9FAFB] text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a54]"
                    />
                    <input
                      type="text"
                      value={openProfile.clinicName}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-[#F9FAFB] text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a54]"
                    />
                  </div>
                </div>

                {/* Right Section - Verification Documents */}
                <div className="flex-1 space-y-4 bg-white p-2">
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-900  pb-2">
                    Verification Documents
                  </h1>

                  {/* Document 1 */}
                  <div className="p-5 rounded-xl bg-[#F8FAFC] border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-all duration-300">
                    <p className="font-medium text-gray-800">
                      Business License
                    </p>
                    <button className="px-4 py-2 text-sm font-semibold text-[#2E6FF3] cursor-pointer hover:text-[#002775] transition-all duration-300">
                      View Document
                    </button>
                  </div>

                  {/* Document 2 */}
                  <div className="p-5 rounded-xl bg-[#F8FAFC] border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-all duration-300">
                    <p className="font-medium text-gray-800">
                      Medical Facility Registration
                    </p>
                    <button className="px-4 py-2 text-sm font-semibold text-[#2E6FF3] cursor-pointer hover:text-[#2E6FF3]  transition-all duration-300">
                      View Document
                    </button>
                  </div>

                  {/* Document 3 */}
                  <div className="p-5 rounded-xl bg-[#F8FAFC] border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-all duration-300">
                    <p className="font-medium text-gray-800">
                      Professional Accreditation
                    </p>
                    <button className="px-4 py-2 text-sm font-semibold text-[#2E6FF3] cursor-pointer hover:text-[#2E6FF3] transition-all duration-300">
                      View Document
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={() => setOpenProfile(null)}
                className="w-full cursor-pointer px-5 py-2.5 rounded-lg border border-[#ECEFF1] bg-[#EFF4FF] text-gray-700 hover:bg-gray-100 transition"
              >
                Close
              </button>

              <button
                onClick={handleClick}
                className="w-full cursor-pointer px-5 py-2.5 rounded-lg bg-[#2E6FF3] text-white hover:bg-[#0b51de] transition"
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
