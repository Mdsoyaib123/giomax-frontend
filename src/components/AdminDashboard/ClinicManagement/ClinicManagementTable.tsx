import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { X, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { MdOutlineDoNotDisturb, MdCheckCircle } from "react-icons/md";
import { useGetAllClinicsQuery } from "@/redux/features/admin/clinic/clinicManagementApi";
import { Clinic } from "@/redux/types/admin/clinicManagementTypes";
import {
  setFilterStatus,
  setSearchTerm,
} from "@/redux/features/admin/clinic/clinicManagementSlice";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";

interface Props {
  id?: string | number;
}

const ClinicManagementTable: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const { filterStatus, searchTerm, currentPage, itemsPerPage } =
    useAppSelector((state) => state.clinicManagement);

  const { data: clinicsResponse, isLoading, error } = useGetAllClinicsQuery();
  const [openProfile, setOpenProfile] = useState<Clinic | null>(null);
  const navigate = useNavigate();

  // Get clinics from response or empty array
  const clinics = clinicsResponse?.data || [];

  // Filter clinics based on status and search term
  const filteredClinics = clinics.filter((clinic) => {
    const user = typeof clinic.userId === "object" ? clinic.userId : null;
    const clinicName = user?.fullName || "";
    const email = user?.email || "";

    // Status filter
    if (filterStatus !== "all") {
      // You'll need to add a status field to your Clinic type
      // For now, using a placeholder
      const clinicStatus = getClinicStatus(clinic);
      if (clinicStatus !== filterStatus) return false;
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        clinicName.toLowerCase().includes(searchLower) ||
        email.toLowerCase().includes(searchLower) ||
        clinic.medicalLicenseNumber?.toLowerCase().includes(searchLower) ||
        clinic.phoneNumber?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredClinics.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentClinics = filteredClinics.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Helper function to determine clinic status (placeholder)
  const getClinicStatus = (clinic: Clinic): string => {
    // Implement your actual status logic here
    // For now, using a simple logic based on reviews count
    if (clinic.reviews.length > 5) return "Active";
    if (clinic.reviews.length > 0) return "Pending";
    return "Pending";
  };

  // Helper function to get total doctors (placeholder - you'll need to fetch this from another endpoint)
  // const getTotalDoctors = (clinicId: string): string => {
  //   // Implement actual doctor count logic
  //   return "0"; // Placeholder
  // };

  const handleClick = () => {
    if (openProfile) {
      navigate(`/admin-dashboard/clinic-management/${openProfile._id}`);
    }
  };

  const handleView = (clinic: Clinic) => {
    setOpenProfile(clinic);
  };

  const handleStatusChange = (value: string) => {
    dispatch(setFilterStatus(value));
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  // const formatDate = (dateString: string) => {
  //   try {
  //     return format(new Date(dateString), "MMM dd, yyyy");
  //   } catch {
  //     return dateString;
  //   }
  // };

  const getClinicName = (clinic: Clinic): string => {
    if (typeof clinic.userId === "object") {
      return clinic.userId.fullName;
    }
    return "Unknown Clinic";
  };

  const getClinicEmail = (clinic: Clinic): string => {
    if (typeof clinic.userId === "object") {
      return clinic.userId.email;
    }
    return "N/A";
  };

  const getServicesString = (clinic: Clinic): string => {
    return clinic.servicesOffered?.join(", ") || "No services listed";
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
      <div className="text-center p-8 text-red-500">
        Error loading clinics. Please try again.
      </div>
    );
  }

  return (
    <div className="">
      <div className="rounded-xl border border-[#DBE0E5] bg-white shadow-sm p-6">
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            {/* Left Section - Title */}
            <h2 className="text-lg md:text-xl font-semibold text-[#343A40]">
              All Clinics ({filteredClinics.length})
            </h2>

            {/* Right Section - Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Search Input */}
              <div className="w-full sm:w-[250px]">
                <input
                  type="text"
                  placeholder="Search clinics..."
                  value={searchTerm}
                  onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                  className="w-full h-10 border border-[#B3B3B3] rounded-xl px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filter 1 - Status */}
              <div className="w-full sm:w-[250px] md:w-[220px]">
                <Select value={filterStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full h-10 border border-[#B3B3B3] rounded-xl px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[#B3B3B3] rounded-md shadow-md">
                    <SelectGroup>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
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
              {/* Table */}
              <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-[800px] w-full text-sm">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Clinic Name
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Services
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Rating
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
                    {currentClinics.map((clinic) => (
                      <tr
                        key={clinic._id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                          <div className="font-medium">
                            {getClinicName(clinic)}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {clinic._id.slice(-6)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                          {getClinicEmail(clinic)}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          <div className="max-w-[200px] truncate">
                            {getServicesString(clinic)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                          {clinic.phoneNumber || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">
                              {clinic.avarageRating.toFixed(1)}
                            </span>
                            <span className="text-gray-400">/5</span>
                            <span className="text-xs text-gray-500">
                              ({clinic.reviews.length} reviews)
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              getClinicStatus(clinic) === "Active"
                                ? "bg-green-100 text-green-700"
                                : getClinicStatus(clinic) === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {getClinicStatus(clinic)}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleView(clinic)}
                              className="inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-md bg-[#2E6FF3] text-white text-xs hover:bg-[#1B54D3] transition"
                            >
                              <FaEye className="text-sm" /> View
                            </button>
                            <button className="flex items-center cursor-pointer gap-1 text-sm bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-1.5 rounded-md transition">
                              <MdCheckCircle className="text-white" /> Approve
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
        {filteredClinics.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">{currentClinics.length}</span> of{" "}
              <span className="font-medium">{filteredClinics.length}</span>{" "}
              clinics
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
        )}

        {/* No Results */}
        {filteredClinics.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">No clinics found</div>
            <div className="text-sm text-gray-500">
              Try adjusting your filters or search term
            </div>
          </div>
        )}
      </div>

      {/* Clinic Details Dialog */}
      {openProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-0.9">
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
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Clinic Name
                </label>
                <input
                  type="text"
                  value={getClinicName(openProfile)}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Email
                </label>
                <input
                  type="text"
                  value={getClinicEmail(openProfile)}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={openProfile.phoneNumber || "N/A"}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Medical License
                </label>
                <input
                  type="text"
                  value={openProfile.medicalLicenseNumber || "N/A"}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  National ID
                </label>
                <input
                  type="text"
                  value={openProfile.nationalIdNumber}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Nationality
                </label>
                <input
                  type="text"
                  value={openProfile.nationality}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={openProfile.address || "N/A"}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Rating
                </label>
                <input
                  type="text"
                  value={`${openProfile.avarageRating.toFixed(1)}/5 (${
                    openProfile.reviews.length
                  } reviews)`}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Clinic Description
              </label>
              <textarea
                value={
                  openProfile.clinicDescription || "No description provided"
                }
                readOnly
                rows={3}
                className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 resize-none"
              />
            </div>

            {/* Services Offered */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Services Offered
              </label>
              <div className="flex flex-wrap gap-2">
                {openProfile.servicesOffered?.map((service, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {service}
                  </span>
                )) || <span className="text-gray-500">No services listed</span>}
              </div>
            </div>

            {/* Divider */}
            <hr className="my-6 border-gray-200" />

            <div className="w-full space-y-6">
              <div className="flex flex-col lg:flex-row gap-8 w-full">
                {/* Left Section - Availability */}
                <div className="flex-1 space-y-4 bg-white p-2">
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-900 pb-2">
                    Availability
                  </h1>

                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Start Time
                          </label>
                          <input
                            type="text"
                            value={openProfile.availability.startTime}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            End Time
                          </label>
                          <input
                            type="text"
                            value={openProfile.availability.endTime}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="block text-sm text-gray-600 mb-1">
                          Appointment Type
                        </label>
                        <input
                          type="text"
                          value={openProfile.availability.appointmentType}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Verification Documents */}
                <div className="flex-1 space-y-4 bg-white p-2">
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-900 pb-2">
                    Verification Documents
                  </h1>

                  {openProfile.clinicCertificates.map((cert) => (
                    <div
                      key={cert._id}
                      className="p-4 rounded-xl bg-[#F8FAFC] border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-all duration-300"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {cert.certificateName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Type: {cert.certificateType}
                        </p>
                      </div>
                      {cert.uploadCertificates ? (
                        <a
                          href={cert.uploadCertificates}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#2E6FF3] hover:text-[#002775] transition-all duration-300 cursor-pointer"
                        >
                          <FileText className="w-4 h-4" />
                          View Document
                        </a>
                      ) : (
                        <span className="text-sm text-gray-500">
                          No document uploaded
                        </span>
                      )}
                    </div>
                  ))}

                  {openProfile.clinicCertificates.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No certificates uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Earnings Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">
                Earnings Information
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    This Month
                  </label>
                  <div className="text-lg font-semibold">
                    $
                    {
                      openProfile.paymentAndEarnings.totalEarnings
                        .totalThisMonth
                    }
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Pending
                  </label>
                  <div className="text-lg font-semibold">
                    ${openProfile.paymentAndEarnings.totalEarnings.pending}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Available
                  </label>
                  <div className="text-lg font-semibold">
                    $
                    {
                      openProfile.paymentAndEarnings.totalEarnings
                        .availbleForWithdrawal
                    }
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

// Add missing dispatch function
const setCurrentPage = (page: number) => ({
  type: "clinicManagement/setCurrentPage",
  payload: page,
});

export default ClinicManagementTable;

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
// import { useNavigate } from "react-router-dom";
// import { MdOutlineDoNotDisturb } from "react-icons/md";

// interface Booking {
//   id: string;
//   licenceNumber: string;
//   earnings: string;
//   clinicName: string;
//   services: string;
//   status: "Pending" | "Active" | "Cancelled";
//   totalDoctors: string;
//   address: string;
//   servicesProvided: string;
// }

// interface Props {
//   id: string | number; // assuming you have an id for each user/payment
// }

// const ClinicManagementTable: React.FC<Props> = ({ id }) => {
//   const [openProfile, setOpenProfile] = useState<Booking | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   const navigate = useNavigate();

//   const handleClick = () => {
//     // Navigate to payment-history page with id
//     navigate(`/admin-dashboard/clinic-management/${id}`);
//   };

//   const bookings: Booking[] = [
//     {
//       id: "BK-001",
//       licenceNumber: "CL-98766",
//       earnings: "4500",
//       clinicName: "Dr. Michael Brown",
//       services: "General Consultation",
//       status: "Active",
//       totalDoctors: "11",
//       address: "Magura, Khulna, Bangladesh",
//       servicesProvided: "General Consultation, Laboratory, Radiology",
//     },
//     {
//       id: "BK-002",
//       licenceNumber: "CL-56432",
//       earnings: "3200",
//       clinicName: "Dr. Sarah Johnson",
//       services: "Dental Care",
//       status: "Pending",
//       totalDoctors: "8",
//       address: "Dhanmondi, Dhaka, Bangladesh",
//       servicesProvided: "Dental Cleaning, Orthodontics, X-Ray Imaging",
//     },
//     {
//       id: "BK-003",
//       licenceNumber: "CL-77654",
//       earnings: "5200",
//       clinicName: "Dr. Robert Smith",
//       services: "Cardiology",
//       status: "Active",
//       totalDoctors: "15",
//       address: "Chattogram, Bangladesh",
//       servicesProvided:
//         "Heart Checkups, ECG, Stress Test, Blood Pressure Monitoring",
//     },
//     {
//       id: "BK-004",
//       licenceNumber: "CL-99231",
//       earnings: "2750",
//       clinicName: "Dr. Emily Davis",
//       services: "Pediatrics",
//       status: "Cancelled",
//       totalDoctors: "9",
//       address: "Sylhet, Bangladesh",
//       servicesProvided:
//         "Child Vaccination, Growth Monitoring, General Pediatric Care",
//     },
//     {
//       id: "BK-005",
//       licenceNumber: "CL-44321",
//       earnings: "6100",
//       clinicName: "Dr. David Wilson",
//       services: "Orthopedics",
//       status: "Active",
//       totalDoctors: "12",
//       address: "Rajshahi, Bangladesh",
//       servicesProvided:
//         "Bone Fracture Treatment, Joint Replacement, Physiotherapy",
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
//               All Clinics
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
//                         Clinic Name
//                       </th>
//                       <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
//                         Services
//                       </th>
//                       <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
//                         Total Doctor
//                       </th>
//                       <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
//                         Status
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
//                         <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
//                           {booking.clinicName}
//                         </td>
//                         <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
//                           {booking.services}
//                         </td>
//                         <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
//                           {booking.totalDoctors}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`px-3 py-1 text-xs font-medium rounded-full ${
//                               booking.status === "Active"
//                                 ? "bg-green-100 text-green-700"
//                                 : booking.status === "Pending"
//                                 ? "bg-yellow-100 text-yellow-700"
//                                 : "bg-red-100 text-red-700"
//                             }`}
//                           >
//                             {booking.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-3 text-center">
//                           <div className="flex justify-center gap-2">
//                             <button
//                               onClick={() => handleView(booking)}
//                               className="inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-md bg-[#2E6FF3] text-white text-xs hover:bg-[#1B54D3] transition"
//                             >
//                               <FaEye className="text-sm" /> View
//                             </button>
//                             <button className="flex items-center cursor-pointer gap-1 text-sm bg-[#E9575A] hover:bg-[#b81113] text-white font-medium px-3 py-1.5 rounded-md transition">
//                               <MdOutlineDoNotDisturb className="text-white" />{" "}
//                               Suspend
//                             </button>
//                           </div>
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
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-0.9">
//           <div className="bg-white rounded-lg w-full max-w-5xl shadow-2xl p-8 relative border border-gray-300 transform scale-100 transition-transform duration-200 max-h-[94vh] overflow-y-auto">
//             {/* Close Icon */}
//             <button
//               onClick={() => setOpenProfile(null)}
//               className="absolute cursor-pointer top-4 right-4 text-gray-600 hover:text-gray-800 hover:scale-110 transition-transform"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             {/* Title */}
//             <h2 className="text-2xl font-semibold text-[#1f3a44] mb-2">
//               Clinic Details
//             </h2>
//             <p className="text-gray-600 text-sm mb-6">
//               View clinic information, affiliated doctors, and verification
//               status
//             </p>

//             {/* Input Grid */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-gray-700 font-medium mb-1">
//                   Clinic Name
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.clinicName}
//                   readOnly
//                   className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-1">
//                   License Number
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.licenceNumber}
//                   readOnly
//                   className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-1">
//                   Address
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.address}
//                   readOnly
//                   className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-1">
//                   Total Doctors
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.totalDoctors}
//                   readOnly
//                   className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-1">
//                   Total Earnings
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.earnings}
//                   readOnly
//                   className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-1">
//                   Services Provided
//                 </label>
//                 <input
//                   type="text"
//                   value={openProfile.servicesProvided}
//                   readOnly
//                   className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
//                 />
//               </div>
//             </div>

//             {/* Divider */}
//             <hr className="my-6 border-gray-200" />

//             <div className="w-full space-y-6">
//               <div className="flex flex-col lg:flex-row gap-8 w-full">
//                 {/* Left Section - Affiliated Doctors */}
//                 <div className="flex-1 space-y-4 bg-white p-2">
//                   <h1 className="text-xl md:text-2xl font-semibold text-gray-900  pb-2">
//                     Affiliated Doctors
//                   </h1>

//                   {/* Row 1 */}
//                   <div className="flex flex-col sm:flex-row gap-4">
//                     <input
//                       type="text"
//                       value={openProfile.clinicName}
//                       readOnly
//                       className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-[#F9FAFB] text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a54]"
//                     />
//                     <input
//                       type="text"
//                       value={openProfile.clinicName}
//                       readOnly
//                       className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-[#F9FAFB] text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a54]"
//                     />
//                   </div>

//                   {/* Row 2 */}
//                   <div className="flex flex-col sm:flex-row gap-4">
//                     <input
//                       type="text"
//                       value={openProfile.clinicName}
//                       readOnly
//                       className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-[#F9FAFB] text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a54]"
//                     />
//                     <input
//                       type="text"
//                       value={openProfile.clinicName}
//                       readOnly
//                       className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-[#F9FAFB] text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a54]"
//                     />
//                   </div>

//                   {/* Row 3 */}
//                   <div className="flex flex-col sm:flex-row gap-4">
//                     <input
//                       type="text"
//                       value={openProfile.clinicName}
//                       readOnly
//                       className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-[#F9FAFB] text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a54]"
//                     />
//                     <input
//                       type="text"
//                       value={openProfile.clinicName}
//                       readOnly
//                       className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-[#F9FAFB] text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a54]"
//                     />
//                   </div>
//                 </div>

//                 {/* Right Section - Verification Documents */}
//                 <div className="flex-1 space-y-4 bg-white p-2">
//                   <h1 className="text-xl md:text-2xl font-semibold text-gray-900  pb-2">
//                     Verification Documents
//                   </h1>

//                   {/* Document 1 */}
//                   <div className="p-5 rounded-xl bg-[#F8FAFC] border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-all duration-300">
//                     <p className="font-medium text-gray-800">
//                       Business License
//                     </p>
//                     <button className="px-4 py-2 text-sm font-semibold text-[#2E6FF3] cursor-pointer hover:text-[#002775] transition-all duration-300">
//                       View Document
//                     </button>
//                   </div>

//                   {/* Document 2 */}
//                   <div className="p-5 rounded-xl bg-[#F8FAFC] border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-all duration-300">
//                     <p className="font-medium text-gray-800">
//                       Medical Facility Registration
//                     </p>
//                     <button className="px-4 py-2 text-sm font-semibold text-[#2E6FF3] cursor-pointer hover:text-[#2E6FF3]  transition-all duration-300">
//                       View Document
//                     </button>
//                   </div>

//                   {/* Document 3 */}
//                   <div className="p-5 rounded-xl bg-[#F8FAFC] border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-all duration-300">
//                     <p className="font-medium text-gray-800">
//                       Professional Accreditation
//                     </p>
//                     <button className="px-4 py-2 text-sm font-semibold text-[#2E6FF3] cursor-pointer hover:text-[#2E6FF3] transition-all duration-300">
//                       View Document
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4 mt-6">
//               <button
//                 onClick={() => setOpenProfile(null)}
//                 className="w-full cursor-pointer px-5 py-2.5 rounded-lg border border-[#ECEFF1] bg-[#EFF4FF] text-gray-700 hover:bg-gray-100 transition"
//               >
//                 Close
//               </button>

//               <button
//                 onClick={handleClick}
//                 className="w-full cursor-pointer px-5 py-2.5 rounded-lg bg-[#2E6FF3] text-white hover:bg-[#0b51de] transition"
//               >
//                 View Payment History
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClinicManagementTable;
