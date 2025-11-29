import React, { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { X } from "lucide-react";

import documents from "@/assets/Logo/documents.png";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoWarningOutline } from "react-icons/io5";
import { LuClipboardList } from "react-icons/lu";

interface Doctor {
  id: string;
  name: string;
  speciallity: string;
  type: string;
  earnings: string;
  status: "Active" | "Pending" | "Suspended";
  email?: string;
  phone?: string;
  age?: string;
  gender?: string;
  experience?: string;
  licenseNumber?: string;
  documents?: { title: string; fileUrl: string }[];
}

const NurseManagement: React.FC = () => {
  const [openProfile, setOpenProfile] = useState<Doctor | null>(null);
  const [openDocuments, setOpenDocuments] = useState<Doctor | null>(null);
  const [confirmApproved, setConfirmApproved] = useState<Doctor | null>(null);
  const [confirmSuspend, setConfirmSuspend] = useState<Doctor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const doctors: Doctor[] = [
    {
      id: "DOC-001",
      name: " Michael Brown",
      speciallity: "Cardiology",
      type: "Solo Doctor",
      earnings: "$2500.00",
      status: "Pending",
      email: "michael.brown@email.com",
      licenseNumber: "MD-35345",
      experience: "12 year",
      phone: "123-456-7890",
    },
    {
      id: "DOC-002",
      name: " Sarah Lee",
      speciallity: "Dermatology",
      type: "Clinic",
      earnings: "$4500.00",
      status: "Active",
      email: "sarah.lee@email.com",
      licenseNumber: "MD-35345",
      experience: "15 year",
      phone: "987-654-3210",
    },
    {
      id: "DOC-003",
      name: "Nurse Alina",
      speciallity: "Pediatrics",
      type: "Nurse",
      earnings: "$3100.00",
      status: "Active",
      email: "alina.nurse@email.com",
      licenseNumber: "MD-35345",
      experience: "4 year",
      phone: "456-789-1230",
    },
    {
      id: "DOC-004",
      name: " Daniel Smith",
      speciallity: "Orthopedics",
      type: "Clinic",
      earnings: "$3800.00",
      status: "Active",
      email: "daniel.smith@email.com",
      licenseNumber: "MD-35345",
      experience: "6 year",
      phone: "321-654-9870",
    },
    {
      id: "DOC-005",
      name: " Sarah Wilson",
      speciallity: "Cardiology",
      type: "Solo Doctor",
      earnings: "$2700.00",
      status: "Suspended",
      email: "sarah.wilson@email.com",
      licenseNumber: "MD-35345",
      experience: "9 year",
      phone: "123-456-7890",
    },
  ];

  const totalPages = Math.ceil(doctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDoctors = doctors.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleView = (doctor: Doctor) => {
    setOpenProfile(doctor);
  };
  const handleDocuments = (document: Doctor) => {
    setOpenDocuments(document);
  };

  /* Approve Popup */
  const handleApprovedConfirm = (doctor: Doctor) => {
    setConfirmApproved(doctor); // open approved dialog
  };

  const handleConfirmApproved = () => {
    if (confirmApproved) {
      alert(`${confirmApproved.name} has been approved successfully!`);
      setConfirmApproved(null);
    }
  };

  /* Suspend Popup */
  const handleSuspendConfirm = (doctor: Doctor) => {
    setConfirmSuspend(doctor); // open suspend dialog
  };

  const handleConfirmSuspend = () => {
    if (confirmSuspend) {
      alert(`${confirmSuspend.name} has been suspended successfully!`);
      setConfirmSuspend(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Suspended":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="">
      <div className="rounded-xl border border-[#DBE0E5] bg-white shadow-sm p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-[#343A40]">
            All Nurse
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
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
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
                      <th className="px-6 py-4 text-left font-medium text-gray-700">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700">
                        Speciality
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700">
                        Type
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
                    {currentDoctors.map((doctor) => (
                      <tr
                        key={doctor.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                          {doctor.name}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {doctor.speciallity}
                        </td>
                        <td className="px-6 py-4 text-sky-500 whitespace-nowrap">
                          {doctor.type}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {doctor.earnings}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              doctor.status
                            )}`}
                          >
                            {doctor.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleView(doctor)}
                              className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-[#2E6FF3] hover:bg-[#1B54D3] text-white text-xs rounded-md transition"
                            >
                              <FaEye className="text-sm" /> View
                            </button>
                            <button
                              onClick={() => handleSuspendConfirm(doctor)}
                              className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-[#EF4444] hover:bg-[#D92D2D] text-white text-xs rounded-md transition"
                            >
                              <RiDeleteBinLine className="text-sm" /> Suspend
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>{" "}
        </div>
        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{currentDoctors.length}</span>{" "}
            of <span className="font-medium">{doctors.length}</span> doctors
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

      {/* Doctor Profile Modal */}
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
              {/* openProfile} */}
            </h2>
            <p className="text-gray-600 text-sm mb-3">
              View Nurse details, credentials, and verification documents
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={openProfile.name}
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
                  value={openProfile.email}
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
                  value={openProfile.phone}
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
                  value={openProfile.speciallity}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Type
                </label>
                <input
                  type="text"
                  value={openProfile.type}
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
                  value={openProfile.licenseNumber}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Earnings
                </label>
                <input
                  type="text"
                  value={openProfile.earnings}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
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
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                />
              </div>
            </div>
            {/*  Verification Documents*/}
            <div className="mt-4">
              <h3 className=" font-semibold  font-sans">
                Verification Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className=" space-y-4">
                  <div className="flex justify-between items-center px-4 py-4 bg-gray-100 rounded-xl border border-gray-300">
                    <div className="flex items-center text-gray-800 font-medium">
                      <LuClipboardList className="inline-block mr-2 text-lg" />
                      Medical License
                    </div>

                    <button
                      onClick={() =>
                        openProfile && handleDocuments(openProfile)
                      }
                      className="text-[#2E6FF3] hover:text-[#0a43b6] font-semibold cursor-pointer  transition"
                    >
                      View Document
                    </button>
                  </div>
                  <div className="flex justify-between items-center px-4 py-4 bg-gray-100 rounded-xl border border-gray-300">
                    <div className="flex items-center text-gray-800 font-medium">
                      <LuClipboardList className="inline-block mr-2 text-lg" />
                      Medical License
                    </div>

                    <button
                      onClick={() =>
                        openProfile && handleDocuments(openProfile)
                      }
                      className="text-[#2E6FF3] hover:text-[#0a43b6] font-semibold cursor-pointer  transition"
                    >
                      View Document
                    </button>
                  </div>
                  <div className="flex justify-between items-center px-4 py-4 bg-gray-100 rounded-xl border border-gray-300">
                    <div className="flex items-center text-gray-800 font-medium">
                      <LuClipboardList className="inline-block mr-2 text-lg" />
                      Medical License
                    </div>

                    <button
                      onClick={() =>
                        openProfile && handleDocuments(openProfile)
                      }
                      className="text-[#2E6FF3] hover:text-[#0a43b6] font-semibold cursor-pointer  transition"
                    >
                      View Document
                    </button>
                  </div>{" "}
                  <div className="flex justify-between items-center px-4 py-4 bg-gray-100 rounded-xl border border-gray-300">
                    <div className="flex items-center text-gray-800 font-medium">
                      <LuClipboardList className="inline-block mr-2 text-lg" />
                      Medical License
                    </div>

                    <button
                      onClick={() =>
                        openProfile && handleDocuments(openProfile)
                      }
                      className="text-[#2E6FF3] hover:text-[#0a43b6] font-semibold cursor-pointer  transition"
                    >
                      View Document
                    </button>
                  </div>{" "}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={openProfile.experience}
                    readOnly
                    className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
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
            </div>
          </div>
        </div>
      )}

      {/* Doctor  Modal */}
      {openDocuments && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm px-3 sm:px-4">
          <div className="bg-white rounded-lg w-full max-w-4xl shadow-2xl p-6 relative border border-gray-300 max-h-[94vh] overflow-y-auto  space-y-6">
            <div>
              <button
                onClick={() => setOpenDocuments(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 hover:scale-110 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-semibold text-[#1f3a44] mb-2">
                Medical License
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                View and download verification document
              </p>
            </div>

            {/* Doctor Details */}

            <div className=" space-y-4">
              <div className=" flex justify-between items-center p-5 bg-[#EFF4FF] rounded-2xl">
                <div className=" space-y-2">
                  <h3>Medical License</h3>
                  <p>Submitted by Dr. Michael Brown</p>
                  <p>License No: MD-12345 • Verified: October 15, 2025</p>
                </div>
                <div>
                  <button className="px-2 py-1 text-sm rounded bg-[#1D4ED8] cursor-pointer text-white hover:bg-[#002ca3] transition">
                    Verified
                  </button>
                </div>
              </div>
              <div className=" space-y-2">
                <div className=" flex justify-between items-center">
                  <h3 className=" font-semibold font-sans">Document Viewer</h3>
                  <p>100%</p>
                </div>

                <div>
                  <img src={documents} alt="" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Document Type */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Document Type
                </label>
                <input
                  type="text"
                  value={openDocuments.name}
                  placeholder="Medical License"
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                />
              </div>

              {/* File Format */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  File Format
                </label>
                <input
                  type="text"
                  value={openDocuments.email}
                  placeholder="PDF Document"
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                />
              </div>

              {/* Upload Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Upload Date
                </label>
                <input
                  type="text"
                  value={openDocuments.phone}
                  placeholder="October 15,2025"
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                />
              </div>

              {/* Verification Status */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Verification Status
                </label>
                <input
                  type="text"
                  value={openDocuments.speciallity}
                  placeholder="Verified"
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button className="w-full cursor-pointer px-5 py-2 rounded-lg bg-[#2E6FF3] text-white hover:bg-[#0b51de] transition">
                Download Original
              </button>
              <button className="w-full cursor-pointer px-5 py-2 rounded-lg bg-[#EFF4FF] text-[#2E6FF3] hover:bg-gray-100 transition">
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm ApprovedDialog */}
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
                {confirmApproved.name}{" "}
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

      {/* Reject Suspend Dialog */}
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
                {confirmSuspend.name}{" "}
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
    </div>
  );
};

export default NurseManagement;
