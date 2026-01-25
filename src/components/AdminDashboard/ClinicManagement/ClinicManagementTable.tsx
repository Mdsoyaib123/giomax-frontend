import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { X, FileText } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useNavigate } from "react-router-dom";
// import { MdOutlineDoNotDisturb, MdCheckCircle } from "react-icons/md";
import {
  useAcceptUserMutation,
  useGetAllClinicsQuery,
} from "@/redux/features/admin/clinic/clinicManagementApi";
import { Clinic } from "@/redux/types/admin/clinicManagementTypes";
import {
  // setFilterStatus,
  setSearchTerm,
} from "@/redux/features/admin/clinic/clinicManagementSlice";

import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import { toast } from "sonner";
import ConformModal from "@/components/Modals/ConformModal";

interface Props {
  id?: string | number;
}

const ClinicManagementTable: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const { filterStatus, searchTerm, currentPage, itemsPerPage } =
    useAppSelector((state) => state.clinicManagement);

  const {
    data: clinicsResponse,
    isLoading,
    error,
    refetch,
  } = useGetAllClinicsQuery();
  const [openProfile, setOpenProfile] = useState<Clinic | null>(null);
  // const navigate = useNavigate();

  // Get clinics from response or empty array
  const clinics = clinicsResponse?.data || [];
  const [acceptUser, { isLoading: isAcceptingUser }] = useAcceptUserMutation();

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
  const handleAcceptUser = async (clinicId: string) => {
    console.log(clinicId);
    try {
      await acceptUser(clinicId).unwrap();
      toast.success("User accepted successfully!");
      setOpenProfile(null);
      refetch();
    } catch (error) {
      console.error("Error accepting user:", error);
      toast.error("Failed to accept user!");
    }
  };
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
  if (clinic.userId.isAdminVerified) return "Active";
    return "Pending";
  };

  // Helper function to get total doctors (placeholder - you'll need to fetch this from another endpoint)
  // const getTotalDoctors = (clinicId: string): string => {
  //   // Implement actual doctor count logic
  //   return "0"; // Placeholder
  // };

  // const handleClick = () => {
  //   if (openProfile) {
  //     navigate(`/admin-dashboard/clinic-management/${openProfile._id}`);
  //   }
  // };

  const handleView = (clinic: Clinic) => {
    setOpenProfile(clinic);
  };

  // const handleStatusChange = (value: string) => {
  //   dispatch(setFilterStatus(value));
  // };

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
              {/* <div className="w-full sm:w-[250px] md:w-[220px]">
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
              </div> */}
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
                            {/* <button className="flex items-center cursor-pointer gap-1 text-sm bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-1.5 rounded-md transition">
                              <MdCheckCircle className="text-white" /> Approve
                            </button> */}
                             <ConformModal title="Delete" description="Are you sure you want to delete this clinic?" id={clinic.userId._id} />
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
              {openProfile.userId.isAdminVerified ? (
                <button
                  disabled
                  className="w-full cursor-not-allowed px-5 py-2.5 rounded-lg border border-blue-200 bg-blue-500 text-white white opacity-70"
                >
                  Approved
                </button>
              ) : (
                <button
                  onClick={() => handleAcceptUser(openProfile.userId._id)}
                  className="w-full cursor-pointer px-5 py-2.5 rounded-lg border border-[#ECEFF1] bg-blue-500 text-gray-700  transition text-white hover:bg-blue-700"
                >
                  {isAcceptingUser ? "Approving..." : "Approve"}
                </button>
              )}

              {/* <button
                onClick={handleClick}
                className="w-full cursor-pointer px-5 py-2.5 rounded-lg bg-[#2E6FF3] text-white hover:bg-[#0b51de] transition"
              >
                View Payment History
              </button> */}
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
