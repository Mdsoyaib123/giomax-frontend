/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { FaEye, FaSpinner } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Dialogue from "./Dialogue";
import SectionTitle from "@/common/SectionTitle";
import text from "@/assets/text.png";
import {
  useCreatePatientMutation,
  useGetClinicAllPatientsQuery,
} from "@/redux/features/patients/patientsApi";
import { Patient } from "@/types/patientsType";
import TableRowSkeleton from "@/components/Skeleton/TableRowSkeleton";
import { toast } from "sonner";
import { useSingleClinicId } from "@/hooks/userClinicId";

// Define the appointment type based on your response
interface Appointment {
  _id: string;
  patientId: {
    _id: string;
    userId: {
      _id: string;
      fullName: string;
      email: string;
      role: string;
      profileImage?: string;
    };
    bloodGroup: string;
    gender: string;
    phoneNumber?: string;
  } | null;
  // ... other appointment fields
}

const PatientList = () => {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState<any | null>(null);
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
    password: "",
    comfirmPassword: "",
    role: "patient",
    bloodGroup: "",
    dateOfBirth: "",
  });

  const { clinicId: id } = useSingleClinicId();
  const { data: apiResponse, isLoading } = useGetClinicAllPatientsQuery(
    { id },
    {
      skip: !id,
    }
  );
  const [createPatient, { isLoading: isCreating }] = useCreatePatientMutation();
  const [uniquePatients, setUniquePatients] = useState<any[]>([]);

  // Process appointments to get unique patients
  useEffect(() => {
    if (apiResponse?.data) {
      const appointments = apiResponse.data as Appointment[];

      // Filter out appointments without patientId and get unique patients
      const patientMap = new Map();

      appointments.forEach((appointment) => {
        if (appointment.patientId && appointment.patientId.userId) {
          const patientId = appointment.patientId._id;
          const userId = appointment.patientId.userId._id;

          // If patient not in map, add it
          if (!patientMap.has(patientId)) {
            patientMap.set(patientId, {
              _id: patientId,
              userId: {
                _id: userId,
                fullName: appointment.patientId.userId.fullName,
                email: appointment.patientId.userId.email,
                role: appointment.patientId.userId.role,
                profileImage: appointment.patientId.userId.profileImage,
              },
              bloodGroup: appointment.patientId.bloodGroup,
              gender: appointment.patientId.gender,
              phoneNumber: appointment.patientId.phoneNumber || "No Phone",
              // Calculate appointment count for this patient
              appointmentCount: 1,
            });
          } else {
            // If patient already in map, increment appointment count
            const existingPatient = patientMap.get(patientId);
            patientMap.set(patientId, {
              ...existingPatient,
              appointmentCount: (existingPatient.appointmentCount || 0) + 1,
            });
          }
        }
      });

      // Convert map to array
      const patientsArray = Array.from(patientMap.values());
      setUniquePatients(patientsArray);

      console.log("Unique Patients:", patientsArray);
      console.log("Total unique patients:", patientsArray.length);
    }
  }, [apiResponse]);

  // Navigate to payment history page
  const handleClick = (patientId: string) => {
    navigate(`/admin-dashboard/payment-history/${patientId}`);
  };

  const handleMessageClick = () => {
    navigate("/clinic-dashboard/message");
  };

  // Filter patients based on search query
  const filteredPatients = uniquePatients.filter((patient: any) => {
    if (!patient) return false;

    const fullName = patient.userId?.fullName?.toLowerCase() || "";
    const email = patient.userId?.email?.toLowerCase() || "";
    const phone = patient.phoneNumber?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();

    return (
      fullName.includes(query) || email.includes(query) || phone.includes(query)
    );
  });

  // Debug: Log filtered patients
  console.log("Filtered Patients:", filteredPatients);

  // Calculate pagination values
  const totalPatients = filteredPatients.length;
  const totalPages = Math.ceil(totalPatients / itemsPerPage);

  // Calculate start and end index for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalPatients);

  // Get current page patients
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  // Debug: Log current patients
  console.log("Current Patients:", currentPatients);

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
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
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
        phoneNumber: "",
        service: "",
        serviceType: "",
        date: "",
        password: "",
        role: "patient",
        comfirmPassword: "",
        bloodGroup: "",
        dateOfBirth: "",
      });
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to create patient");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
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

  // Get appointment count for a patient
  const getAppointmentCount = (patient: any) => {
    return patient.appointmentCount || 0;
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
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({totalPatients} patients found)
              </span>
            </h2>

            <div className="flex items-center w-full sm:w-[320px] h-10 bg-[#F9FAFB] rounded-lg px-3 border border-[#E5E7EB]">
              <IoIosSearch className="text-gray-400 text-xl" />
              <input
                type="search"
                placeholder="Search patients by name, email, or phone..."
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
                          <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">
                            Patient Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">
                            Email Address
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">
                            Phone Number
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">
                            Appointments
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-[#E5E7EB] bg-white">
                        {isLoading ? (
                          <>
                            <TableRowSkeleton columns={5} rows={9} />
                          </>
                        ) : currentPatients.length > 0 ? (
                          currentPatients.map((patient: any) => (
                            <tr
                              key={patient._id}
                              className="hover:bg-gray-50 transition-colors duration-150"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">
                                {patient.userId?.fullName || "No Name"}
                                <span className="ml-2 text-xs text-gray-500">
                                  ({patient.userId?.role || "patient"})
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                                {patient.userId?.email || "No Email"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                                {patient.phoneNumber || "No Phone"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {getAppointmentCount(patient)} visits
                                </span>
                              </td>
                              <td className="px-6 flex items-center justify-center py-4 whitespace-nowrap text-sm">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={handleMessageClick}
                                    className="flex items-center gap-1.5 px-5 py-2 bg-[#E5E7EB] text-[#374151] rounded-md hover:bg-[#D1D5DB] justify-center transition-colors cursor-pointer text-sm font-medium"
                                  >
                                    <img
                                      src={text}
                                      alt="Message"
                                      className="w-4 h-4"
                                    />
                                    <span>Message</span>
                                    <span className="hidden md:block">
                                      Patient
                                    </span>
                                  </button>
                                  <button
                                    onClick={() => setOpenProfile(patient)}
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
                              colSpan={5}
                              className="px-6 py-8 text-center text-gray-500"
                            >
                              <div className="flex flex-col items-center justify-center">
                                <IoIosSearch className="w-12 h-12 text-gray-300 mb-2" />
                                <p className="text-lg font-medium text-gray-600 mb-1">
                                  {searchQuery
                                    ? "No patients found matching your search"
                                    : "No patients found"}
                                </p>
                                {searchQuery && (
                                  <p className="text-sm text-gray-500">
                                    Try a different search term
                                  </p>
                                )}
                              </div>
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
            onViewPaymentHistory={() => handleClick(openProfile._id)}
          />
        )}

        {/* Add New Patient Modal (Keep this as is) */}
        {showAddPatientModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            {/* ... Modal content remains the same ... */}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;
