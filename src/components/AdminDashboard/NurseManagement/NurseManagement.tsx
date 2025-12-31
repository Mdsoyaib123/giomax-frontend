/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
// import { TiDeleteOutline } from "react-icons/ti";
import { FaEye } from "react-icons/fa";
import { X } from "lucide-react";
import { IoWarningOutline } from "react-icons/io5";
import { LuClipboardList } from "react-icons/lu";
import { toast } from "sonner";
import {
  useGetAllNursesQuery,
  useDeleteNurseMutation,
  useUpdateNurseStatusMutation,
} from "@/redux/features/admin/nurse/adminNurseManagementApi";
import {
  setSelectedNurse,
  setStatusFilter,
  setCurrentPage,
  removeNurse,
} from "@/redux/features/admin/nurse/adminNurseManagementSlice";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import { useAcceptUserMutation } from "@/redux/features/admin/clinic/clinicManagementApi";

interface Document {
  title: string;
  fileUrl: string;
}

const NurseManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: nursesResponse, isLoading, error } = useGetAllNursesQuery();
  const [deleteNurse] = useDeleteNurseMutation();
  const [updateNurseStatus] = useUpdateNurseStatusMutation();
  const [acceptUser, { isLoading: isAcceptingUser }] = useAcceptUserMutation();

  const { statusFilter, currentPage } = useAppSelector(
    (state) => state.nurseManagement
  );

  const [openProfile, setOpenProfile] = useState<any>(null);
  const [openDocuments, setOpenDocuments] = useState<{
    nurse: any;
    document: Document;
  } | null>(null);
  console.log("open profile", openProfile);
  const [confirmApproved, setConfirmApproved] = useState<any>(null);
  const [confirmSuspend, setConfirmSuspend] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<any>(null);

  const itemsPerPage = 6;

  // Calculate filtered nurses based on status
  const filteredNurses =
    nursesResponse?.data?.filter((nurse) => {
      if (statusFilter === "all") return true;

      // Assuming nurse object has a status field
      // You might need to adjust this based on your actual data structure
      const nurseStatus = nurse.status || nurse.userId?.status || "active";

      if (statusFilter === "active") return nurseStatus === "active";
      if (statusFilter === "pending") return nurseStatus === "pending";
      if (statusFilter === "suspended") return nurseStatus === "suspended";

      return true;
    }) || [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredNurses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNurses = filteredNurses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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

  const handleView = (nurse: any) => {
    dispatch(setSelectedNurse(nurse));
    setOpenProfile(nurse);
  };

  const handleDocuments = (nurse: any, certificate: any) => {
    setOpenDocuments({
      nurse,
      document: {
        title: certificate.certificateName,
        fileUrl: certificate.uploadCertificates,
      },
    });
  };

  // const handleApprovedConfirm = (nurse: any) => {
  //   setConfirmApproved(nurse);
  // };
  const handleAcceptUser = async (clinicId: string) => {
    console.log(clinicId);
    try {
      await acceptUser(clinicId).unwrap();
      toast.success("User accepted successfully!");
      setOpenProfile(null);
    } catch (error) {
      console.error("Error accepting user:", error);
      toast.error("Failed to accept user!");
    }
  };
  const handleConfirmApproved = async () => {
    if (confirmApproved) {
      try {
        await updateNurseStatus({
          nurseId: confirmApproved._id,
          status: "active",
        }).unwrap();

        toast.success("Nurse Approved", {
          description: `${confirmApproved.userId.fullName} has been approved successfully!`,
        });

        setConfirmApproved(null);
      } catch (error) {
        console.error("Failed to update status:", error);
        toast.error("Approval Failed", {
          description: "Failed to update nurse status. Please try again.",
        });
      }
    }
  };

  // const handleSuspendConfirm = (nurse: any) => {
  //   setConfirmSuspend(nurse);
  // };

  const handleConfirmSuspend = async () => {
    if (confirmSuspend) {
      try {
        await updateNurseStatus({
          nurseId: confirmSuspend._id,
          status: "suspended",
        }).unwrap();

        toast.success("Nurse Suspended", {
          description: `${confirmSuspend.userId.fullName} has been suspended successfully!`,
        });

        setConfirmSuspend(null);
      } catch (error) {
        console.error("Failed to suspend:", error);
        toast.error("Suspension Failed", {
          description: "Failed to suspend nurse. Please try again.",
        });
      }
    }
  };

  const handleDeleteConfirm = (nurse: any) => {
    setConfirmDelete(nurse);
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete) {
      try {
        await deleteNurse(confirmDelete._id).unwrap();
        dispatch(removeNurse(confirmDelete._id));

        toast.success("Nurse Deleted", {
          description: `${confirmDelete.userId.fullName} has been deleted successfully!`,
        });

        setConfirmDelete(null);
      } catch (error) {
        console.error("Failed to delete:", error);
        toast.error("Deletion Failed", {
          description: "Failed to delete nurse. Please try again.",
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "suspended":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Get nurse status from data
  const getNurseStatus = (nurse: any) => {
    return nurse.status || nurse.userId?.status || "active";
  };

  // Calculate earnings
  const calculateEarnings = (nurse: any) => {
    const earnings =
      nurse.paymentAndEarnings?.totalEarnings?.totalThisMonth || 0;
    return `$${earnings.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    toast.error("Loading Error", {
      description: "Failed to load nurses data. Please try again.",
    });

    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error loading nurses</div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="rounded-xl border border-[#DBE0E5] bg-white shadow-sm p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-[#343A40]">
            All Nurse ({filteredNurses.length})
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="w-full sm:w-[250px] md:w-[220px]">
              <Select
                value={statusFilter}
                onValueChange={(value) => dispatch(setStatusFilter(value))}
              >
                <SelectTrigger className="w-full h-10 border border-[#B3B3B3] rounded-xl px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm flex items-center justify-between hover:border-gray-400 transition-all duration-200 cursor-pointer">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-[#B3B3B3] rounded-md shadow-md">
                  <SelectGroup>
                    <SelectLabel className="px-4 pt-2 text-gray-500 text-sm">
                      All Status Data
                    </SelectLabel>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="p-5 border border-[#E4E4E4] rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 gap-5">
            <div className="xl:col-span-4 w-full">
              <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-[800px] w-full text-sm">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium text-gray-700">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700">
                        Speciality
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700">
                        Earnings
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-4 text-center font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {currentNurses.map((nurse) => {
                      const nurseStatus = getNurseStatus(nurse);

                      return (
                        <tr
                          key={nurse._id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                            {nurse.userId.fullName}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {nurse.professionalInformation.speciality}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {nurse.userId.email}
                          </td>
                          <td className="px-6 py-4 text-gray-800">
                            {calculateEarnings(nurse)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                nurseStatus
                              )}`}
                            >
                              {nurseStatus.charAt(0).toUpperCase() +
                                nurseStatus.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleView(nurse)}
                                className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-[#2E6FF3] hover:bg-[#1B54D3] text-white text-xs rounded-md transition"
                              >
                                <FaEye className="text-sm" /> View
                              </button>
                              {/* {nurseStatus !== "suspended" ? (
                                <button
                                  onClick={() => handleSuspendConfirm(nurse)}
                                  className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-[#EFF4FF] text-[#2E6FF3] border border-[#ECEFF1] hover:bg-gray-100 text-xs rounded-md transition"
                                >
                                  <TiDeleteOutline className="text-sm" />{" "}
                                  Suspend
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleApprovedConfirm(nurse)}
                                  className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md transition"
                                >
                                  Activate
                                </button>
                              )} */}
                              <button
                                onClick={() => handleDeleteConfirm(nurse)}
                                className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{currentNurses.length}</span>{" "}
            of <span className="font-medium">{filteredNurses.length}</span>{" "}
            nurses
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

      {/* Nurse Profile Modal */}
      {openProfile && (
        <div className="fixed px-3 sm:px-4 inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-0.5">
          <div className="bg-white rounded-lg w-full max-w-4xl shadow-2xl p-6 relative border border-gray-300 max-h-[94vh] overflow-y-auto">
            <button
              onClick={() => setOpenProfile(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 hover:scale-110 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-semibold text-[#1f3a44] mb-2">
              Nurse Profile
              {/* {openProfile.userId.fullName} */}
            </h2>
            <p className="text-gray-600 text-sm mb-3">
              View nurse details, credentials, and verification documents
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={openProfile.userId.fullName}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="text"
                  value={openProfile.userId.email}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={openProfile.phoneNumber || "N/A"}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Speciality
                </label>
                <input
                  type="text"
                  value={openProfile.professionalInformation.speciality}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  value={openProfile.professionalInformation.experience}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  value={openProfile.professionalInformation.MedicalLicense}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Consultation Fee
                </label>
                <input
                  type="text"
                  value={`$${openProfile.professionalInformation.consultationFee}`}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
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
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
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
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Average Rating
                </label>
                <input
                  type="text"
                  value={openProfile.avarageRating.toFixed(1)}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                />
              </div>
            </div>

            {/* About Section */}
            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-1">
                About
              </label>
              <textarea
                value={openProfile.professionalInformation.about}
                readOnly
                rows={3}
                className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
              />
            </div>

            {/* Services Section */}
            <div className="mt-4">
              <h3 className="font-semibold font-sans mb-2">Services</h3>
              <div className="space-y-3">
                {openProfile.professionalInformation.services.map(
                  (service: any) => (
                    <div
                      key={service._id}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <h4 className="font-medium text-gray-800">
                        {service.serviceName}
                      </h4>
                      <div className="mt-2 space-y-1">
                        {service.subServices.map((sub: any) => (
                          <div
                            key={sub._id}
                            className="flex justify-between text-sm text-gray-600"
                          >
                            <span>{sub.name}</span>
                            <span>${sub.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Verification Documents */}
            <div className="mt-4">
              <h3 className="font-semibold font-sans mb-3">
                Verification Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  {openProfile.certificates.map((certificate: any) => (
                    <div
                      key={certificate._id}
                      className="flex justify-between items-center px-4 py-4 bg-gray-100 rounded-xl border border-gray-300"
                    >
                      <div className="flex items-center text-gray-800 font-medium">
                        <LuClipboardList className="inline-block mr-2 text-lg" />
                        {certificate.certificateName} (
                        {certificate.certificateType})
                      </div>
                      <button
                        onClick={() =>
                          handleDocuments(openProfile, certificate)
                        }
                        className="text-[#2E6FF3] hover:text-[#0a43b6] font-semibold cursor-pointer transition"
                      >
                        View Document
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Availability
                    </label>
                    <input
                      type="text"
                      value={`${openProfile.availability.startTime} - ${openProfile.availability.endTime}`}
                      readOnly
                      className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Working Days
                    </label>
                    <input
                      type="text"
                      value={openProfile.availability.workingDays.join(", ")}
                      readOnly
                      className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                    />
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
                  className="w-full cursor-pointer px-5 py-2.5 rounded-lg border border-[#ECEFF1] bg-blue-500   transition text-white hover:bg-blue-700"
                >
                  {isAcceptingUser ? "Approving..." : "Approve"}
                </button>
              )}
            </div>
            {/* <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={() => handleApprovedConfirm(openProfile)}
                className="w-full cursor-pointer px-5 py-2 rounded-lg bg-[#2E6FF3] text-white border border-[#2E6FF3] hover:bg-[#0b51de] transition"
              >
                Approve Nurse
              </button>
              <button
                onClick={() => handleSuspendConfirm(openProfile)}
                className="w-full cursor-pointer px-5 py-2 rounded-lg bg-[#EFF4FF] text-[#2E6FF3] border border-[#ECEFF1] hover:bg-gray-100 transition"
              >
                Reject Application
              </button>
            </div> */}
          </div>
        </div>
      )}

      {/* Documents Modal */}
      {openDocuments && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm px-3 sm:px-4">
          <div className="bg-white rounded-lg w-full max-w-4xl shadow-2xl p-6 relative border border-gray-300 max-h-[94vh] overflow-y-auto space-y-6">
            <div>
              <button
                onClick={() => setOpenDocuments(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 hover:scale-110 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-semibold text-[#1f3a44] mb-2">
                {openDocuments.document.title}
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                View and download verification document
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-5 bg-[#EFF4FF] rounded-2xl">
                <div className="space-y-2">
                  <h3 className="font-medium">
                    {openDocuments.document.title}
                  </h3>
                  <p>Submitted by {openDocuments.nurse.userId.fullName}</p>
                  <p>
                    Uploaded:{" "}
                    {new Date(
                      openDocuments.nurse.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <button className="px-2 py-1 text-sm rounded bg-[#1D4ED8] cursor-pointer text-white hover:bg-[#002ca3] transition">
                    Verified
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold font-sans">Document Viewer</h3>
                </div>

                <div className="border rounded-lg p-4 border-gray-200">
                  {openDocuments.document.fileUrl.match(
                    /\.(jpg|jpeg|png|gif)$/i
                  ) ? (
                    <img
                      src={openDocuments.document.fileUrl}
                      alt={openDocuments.document.title}
                      className="w-full max-h-96 object-contain"
                    />
                  ) : (
                    <div className="text-center p-8">
                      <p className="text-gray-600">
                        Document cannot be previewed inline.
                      </p>
                      <a
                        href={openDocuments.document.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline mt-2 inline-block"
                      >
                        Open in new tab
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Document Type
                </label>
                <input
                  type="text"
                  value={openDocuments.document.title}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  File Format
                </label>
                <input
                  type="text"
                  value={
                    openDocuments.document.fileUrl
                      .split(".")
                      .pop()
                      ?.toUpperCase() || "Unknown"
                  }
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Upload Date
                </label>
                <input
                  type="text"
                  value={new Date(
                    openDocuments.nurse.createdAt
                  ).toLocaleDateString()}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Verification Status
                </label>
                <input
                  type="text"
                  value="Verified"
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <a
                href={openDocuments.document.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full cursor-pointer px-5 py-2 text-center rounded-lg bg-[#2E6FF3] text-white hover:bg-[#0b51de] transition"
              >
                Download Original
              </a>
              <button
                onClick={() => setOpenDocuments(null)}
                className="w-full cursor-pointer px-5 py-2 rounded-lg bg-[#EFF4FF] text-[#2E6FF3] hover:bg-gray-100 transition"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Approved Dialog */}
      {confirmApproved && (
        <div className="fixed px-2 sm:px-4 inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-0.9">
          <div className="bg-white w-full max-w-md rounded-[20px] shadow-2xl p-6 text-center border border-gray-200">
            <div className="flex justify-center items-center mb-6 mt-4">
              <div className="w-12 h-12 rounded-full bg-[#FFEDED] flex justify-center items-center">
                <IoWarningOutline className="text-[#E20509] text-2xl" />
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Approve Nurse
            </h2>

            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to approve
              <span className="font-medium text-gray-900">
                {" "}
                {confirmApproved.userId.fullName}{" "}
              </span>
              ?
              <br /> They will be activated immediately.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setConfirmApproved(null)}
                className="w-full px-4 py-3 cursor-pointer rounded-md bg-[#EFF4FF] border border-gray-300 text-[#2E6FF3] text-sm hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmApproved}
                className="w-full px-5 py-3 cursor-pointer rounded-md bg-[#1D4ED8] hover:bg-[#155ad1] text-white text-sm transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Dialog */}
      {confirmSuspend && (
        <div className="fixed px-2 sm:px-4 inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-0.9">
          <div className="bg-white w-full max-w-md rounded-[20px] shadow-2xl p-6 text-center border border-gray-200">
            <div className="flex justify-center items-center mb-6 mt-4">
              <div className="w-12 h-12 rounded-full bg-[#FFEDED] flex justify-center items-center">
                <IoWarningOutline className="text-[#E20509] text-2xl" />
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Suspend Nurse
            </h2>

            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to suspend
              <span className="font-medium text-gray-900">
                {" "}
                {confirmSuspend.userId.fullName}{" "}
              </span>
              ?
              <br /> They will not be able to accept new appointments.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setConfirmSuspend(null)}
                className="w-full px-4 py-3 cursor-pointer rounded-md bg-[#EFF4FF] border border-gray-300 text-[#2E6FF3] text-sm hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmSuspend}
                className="w-full px-5 py-3 cursor-pointer rounded-md bg-[#1D4ED8] hover:bg-[#155ad1] text-white text-sm transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {confirmDelete && (
        <div className="fixed px-2 sm:px-4 inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-0.9">
          <div className="bg-white w-full max-w-md rounded-[20px] shadow-2xl p-6 text-center border border-gray-200">
            <div className="flex justify-center items-center mb-6 mt-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex justify-center items-center">
                <IoWarningOutline className="text-red-600 text-2xl" />
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Delete Nurse
            </h2>

            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete
              <span className="font-medium text-gray-900">
                {" "}
                {confirmDelete.userId.fullName}{" "}
              </span>
              ?
              <br /> This action cannot be undone.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="w-full px-4 py-3 cursor-pointer rounded-md bg-gray-100 border border-gray-300 text-gray-700 text-sm hover:bg-gray-200 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="w-full px-5 py-3 cursor-pointer rounded-md bg-red-600 hover:bg-red-700 text-white text-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseManagement;
