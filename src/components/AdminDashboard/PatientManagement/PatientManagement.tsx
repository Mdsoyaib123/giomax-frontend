/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { X } from "lucide-react";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import {
  useDeletePatientMutation,
  useGetAllPatientsQuery,
  useGetSinglePatientQuery,
} from "@/redux/features/admin/patient/adminPatientApi";
import {
  closeViewModal,
  setCurrentPage,
  setSearchTerm,
  setSelectedPatient,
} from "@/redux/features/admin/patient/adminPatientSlice";
import { Patient, PatientTableData } from "@/redux/types/adminPatientTypes";
import { toast } from "sonner";

// Format patient data for table
const formatPatientForTable = (patient: Patient): PatientTableData => {
  return {
    id: patient._id,
    patientId: patient?._id || "",
    name: patient?.userId?.fullName || "N/A",
    email: patient.userId?.email || "N/A",
    phone: patient?.phoneNumber || "N/A",
    age: patient?.age || 0,
    gender: patient?.gender || "N/A",
    bloodGroup: patient?.bloodGroup || "N/A",
    totalBookings: "0",
    lastAppointment: new Date().toLocaleDateString(),
    createdAt: patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : "N/A",
  };
};

// Filter patients based on search term
const filterPatients = (
  patients: PatientTableData[],
  searchTerm: string
): PatientTableData[] => {
  if (!searchTerm.trim()) return patients;

  const term = searchTerm.toLowerCase();
  return patients.filter(
    (patient) =>
      (patient?.name?.toLowerCase() || "").includes(term) ||
      (patient?.email?.toLowerCase() || "").includes(term) ||
      (patient?.phone?.toLowerCase() || "").includes(term) ||
      (patient?.gender?.toLowerCase() || "").includes(term) ||
      (patient?.bloodGroup?.toLowerCase() || "").includes(term) ||
      (patient?.age?.toString() || "").includes(term)
  );
};

// Paginate patients
const paginatePatients = (
  patients: PatientTableData[],
  currentPage: number,
  itemsPerPage: number
): PatientTableData[] => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return patients.slice(startIndex, endIndex);
};

// Medical History Display Component
const MedicalHistoryDisplay: React.FC<{ patient: Patient }> = ({ patient }) => {
  const { medicalHistory } = patient;

  return (
    <div className="space-y-4">
      {/* Conditions */}
      {medicalHistory.conditions.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Medical Conditions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {medicalHistory.conditions.map((condition) => (
              <div key={condition._id} className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium">{condition.name}</p>
                <p className="text-sm text-gray-600">
                  Diagnosed:{" "}
                  {new Date(condition.diagnosedDate).toLocaleDateString()} |
                  Status: {condition.status}
                </p>
                {condition.notes && (
                  <p className="text-sm text-gray-500 mt-1">
                    {condition.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medications */}
      {medicalHistory.Medications.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Medications</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {medicalHistory.Medications.map((med) => (
              <div key={med._id} className="bg-blue-50 p-3 rounded-lg">
                <p className="font-medium">
                  {med.name} - {med.dosage}
                </p>
                <p className="text-sm text-gray-600">
                  {med.frequency} | Started:{" "}
                  {new Date(med.startDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Allergies */}
      {medicalHistory.Allergies.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Allergies</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {medicalHistory.Allergies.map((allergy) => (
              <div key={allergy._id} className="bg-red-50 p-3 rounded-lg">
                <p className="font-medium">{allergy.allergyOn}</p>
                <p className="text-sm text-gray-600">
                  Severity: {allergy.severity} | Reaction: {allergy.reaction}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {medicalHistory.conditions.length === 0 &&
        medicalHistory.Medications.length === 0 &&
        medicalHistory.Allergies.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No medical history available
          </p>
        )}
    </div>
  );
};

// Address Display Component
const AddressDisplay: React.FC<{ patient: Patient }> = ({ patient }) => {
  const { address } = patient;

  return (
    <div className="space-y-4">
      {address.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {address.map((addr) => (
            <div
              key={addr._id}
              className={`p-4 rounded-lg border ${
                addr.isDefault
                  ? "border-blue-300 bg-blue-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">
                  {addr.addressLabel}
                </h4>
                {addr.isDefault && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  {addr.streetNumber}, {addr.apartmentNumber}
                </p>
                <p>
                  {addr.city}, {addr.state}
                </p>
                <p>Zip Code: {addr.zipCode}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">
          No address information available
        </p>
      )}
    </div>
  );
};

// Patient Profile Modal Component
const PatientProfileModal: React.FC<{
  selectedPatient: PatientTableData;
  fullPatient: Patient | undefined;
  onClose: () => void;
  onViewFullDetails: () => void;
}> = ({ selectedPatient, fullPatient, onClose }) => {
  /* onViewFullDetails */

  const formatDateOfBirth = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Calculate age from date of birth (as fallback)
  const calculateAge = (dateString: string) => {
    try {
      const today = new Date();
      const birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    } catch {
      return selectedPatient.age;
    }
  };

  return (
    <div className="fixed px-3 sm:px-4 inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-5xl shadow-2xl p-8 relative border border-gray-300 max-h-[90vh] overflow-y-auto">
        {/* Close Icon */}
        <button
          onClick={onClose}
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

        {/* Profile Image and Basic Info */}
        {fullPatient?.userId?.profileImage && (
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300">
              <img
                src={fullPatient.userId.profileImage}
                alt={selectedPatient.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedPatient.name}
              </h3>
              <p className="text-gray-600">Patient ID: {selectedPatient.id}</p>
            </div>
          </div>
        )}

        {/* Patient Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={selectedPatient.name}
              readOnly
              className="w-full px-3 py-2.5 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA] text-gray-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="text"
              value={selectedPatient.email}
              readOnly
              className="w-full px-3 py-2.5 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA] text-gray-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={selectedPatient.phone}
              readOnly
              className="w-full px-3 py-2.5 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA] text-gray-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Age</label>
            <input
              type="text"
              value={
                fullPatient
                  ? calculateAge(fullPatient.dateOfBirth)
                  : selectedPatient.age
              }
              readOnly
              className="w-full px-3 py-2.5 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA] text-gray-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Gender
            </label>
            <input
              type="text"
              value={selectedPatient.gender}
              readOnly
              className="w-full px-3 py-2.5 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA] text-gray-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Blood Group
            </label>
            <input
              type="text"
              value={selectedPatient.bloodGroup}
              readOnly
              className="w-full px-3 py-2.5 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA] text-gray-900 focus:outline-none"
            />
          </div>

          {fullPatient?.dateOfBirth && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Date of Birth
              </label>
              <input
                type="text"
                value={formatDateOfBirth(fullPatient.dateOfBirth)}
                readOnly
                className="w-full px-3 py-2.5 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA] text-gray-900 focus:outline-none"
              />
            </div>
          )}

          {fullPatient?.createdAt && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Member Since
              </label>
              <input
                type="text"
                value={new Date(fullPatient.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
                readOnly
                className="w-full px-3 py-2.5 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA] text-gray-900 focus:outline-none"
              />
            </div>
          )}

          {fullPatient?.updatedAt && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Last Updated
              </label>
              <input
                type="text"
                value={new Date(fullPatient.updatedAt).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
                readOnly
                className="w-full px-3 py-2.5 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA] text-gray-900 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Address Section */}
        {fullPatient && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Address Information
            </h3>
            <AddressDisplay patient={fullPatient} />
          </div>
        )}

        {/* Medical History Section */}
        {fullPatient && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Medical History
            </h3>
            <MedicalHistoryDisplay patient={fullPatient} />
          </div>
        )}

        {/* Payment Methods */}
        {fullPatient?.paymentMethods &&
          fullPatient.paymentMethods.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Payment Methods
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fullPatient.paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    className="bg-green-50 p-4 rounded-lg border border-green-200"
                  >
                    <p className="font-medium text-gray-800">
                      {method.type} - ****{method.lastFourDigits}
                    </p>
                    <p className="text-sm text-gray-600">
                      Expires: {method.expiryMonth}/{method.expiryYear}
                    </p>
                    {method.isDefault && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Default Payment Method
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full">
          <button
            onClick={onClose}
            className="w-full cursor-pointer px-5 py-2.5 rounded-lg border border-[#ECEFF1] bg-[#EFF4FF] text-gray-700 hover:bg-gray-100 transition"
          >
            Close
          </button>

          {/* <button
            onClick={onViewFullDetails}
            className="w-full cursor-pointer px-5 py-2.5 rounded-lg bg-[#2E6FF3] text-white hover:bg-[#0b51de] transition"
          >
            View Payment Historydfd
          </button> */}
        </div>
      </div>
    </div>
  );
};

// Main Component
const PatientManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [patientToDelete, setPatientToDelete] = React.useState<string | null>(null);

  // Get state from Redux store
  const {
    searchTerm,
    selectedPatient,
    currentPage,
    itemsPerPage,
    isViewModalOpen,
  } = useAppSelector((state) => state.adminPatient);

  // API hooks
  const {
    data: patientsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllPatientsQuery();

  const { data: singlePatientResponse } = useGetSinglePatientQuery(
    selectedPatient?.id,
    {
      skip: !selectedPatient?.id || !isViewModalOpen,
    }
  );

  const [deletePatient, { isLoading: isDeleting }] = useDeletePatientMutation();

  // Transform API data to table data
  const tableData: PatientTableData[] = useMemo(() => {
    if (!patientsResponse?.data) return [];
    return patientsResponse.data.map(formatPatientForTable);
  }, [patientsResponse]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    return filterPatients(tableData, searchTerm);
  }, [tableData, searchTerm]);

  // Paginate filtered data
  const paginatedData = useMemo(() => {
    return paginatePatients(filteredData, currentPage, itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Get full patient data from single patient query
  const fullPatientData = useMemo(() => {
    if (singlePatientResponse?.data) {
      return singlePatientResponse.data;
    }
    // Fallback to find in the list if single patient query hasn't loaded yet
    if (!selectedPatient || !patientsResponse?.data) return undefined;
    return patientsResponse.data.find((p) => p._id === selectedPatient.id);
  }, [singlePatientResponse, selectedPatient, patientsResponse]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  // Handle view patient details
  const handleView = (patient: PatientTableData) => {
    dispatch(setSelectedPatient(patient));
  };


  // Handle delete patient click
  const handleDeleteClick = (patientId: string) => {
    setPatientToDelete(patientId);
    setIsDeleteDialogOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (patientToDelete) {
      try {
        await deletePatient(patientToDelete).unwrap();
        toast.success("Patient deleted successfully!");
        refetch();
      } catch (error: any) {
        console.error("Failed to delete patient:", error);
        const errorMessage =
          error?.data?.message || "Failed to delete patient. Please try again.";
        toast.error(errorMessage);
      } finally {
        setIsDeleteDialogOpen(false);
        setPatientToDelete(null);
      }
    }
  };

  // Handle navigation to payment history
  const handlePaymentHistory = () => {
    if (selectedPatient) {
      navigate(`/admin-dashboard/patient-management/${selectedPatient.id}`);
    }
  };

  // Handle pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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

  // Handle close modal
  const handleCloseModal = () => {
    dispatch(closeViewModal());
  };

  // Loading state for main table
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state for main table
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-red-500 text-lg font-medium mb-4">
          Failed to load patients
        </div>
        <p className="text-gray-600 mb-4">
          {(error as any)?.data?.message ||
            "An error occurred while fetching patients."}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="">
      <div className="rounded-xl border border-[#DBE0E5] bg-white shadow-sm p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-lg font-semibold text-[#343A40]">
              All Patients Information ({tableData.length})
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage and view all patient records
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex items-center w-full sm:w-[320px] h-9 bg-[#F5F7FB] rounded-lg px-3 py-1.5">
            <IoIosSearch className="text-gray-500 text-lg" />
            <input
              type="search"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={handleSearch}
              className="bg-transparent flex-1 pl-2 text-sm text-gray-700 focus:outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="p-5 border border-[#E4E4E4] rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 gap-5">
            <div className="xl:col-span-4 w-full">
              {/* Table */}
              <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-[800px] w-full text-sm">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 md:px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Patient Name
                      </th>
                      <th className="px-4 md:px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Email Address
                      </th>
                      <th className="px-4 md:px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Phone Number
                      </th>
                      <th className="px-4 md:px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Age / Gender
                      </th>
                      <th className="px-4 md:px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Blood Group
                      </th>
                      <th className="px-4 md:px-6 py-4 text-center font-medium text-gray-700 whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((patient) => (
                        <tr
                          key={patient.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                          <td className="px-4 md:px-6 whitespace-nowrap py-3 font-semibold text-gray-900">
                            {patient.name}
                          </td>
                          <td className="px-4 md:px-6 whitespace-nowrap py-3 text-gray-700">
                            {patient.email}
                          </td>
                          <td className="px-4 md:px-6 whitespace-nowrap py-3 text-gray-700">
                            {patient.phone}
                          </td>
                          <td className="px-4 md:px-6 whitespace-nowrap py-3 text-gray-700">
                            {patient.age} / {patient.gender}
                          </td>
                          <td className="px-4 md:px-6 whitespace-nowrap py-3 text-gray-700">
                            {patient.bloodGroup}
                          </td>
                          <td className="px-4 md:px-6 py-3">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleView(patient)}
                                disabled={isDeleting}
                                className="flex cursor-pointer items-center gap-1 text-sm bg-[#2E6FF3] hover:bg-[#034ee6] text-white font-medium px-3 py-1.5 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <FaEye className="text-white" /> View
                              </button>
                              <button
                                onClick={() => handleDeleteClick(patient.id)}
                                disabled={isDeleting}
                                className="flex items-center cursor-pointer gap-1 text-sm bg-[#E9575A] hover:bg-[#b81113] text-white font-medium px-3 py-1.5 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <RiDeleteBinLine className="text-white" />
                                {isDeleting && patientToDelete === patient.id
                                  ? "Deleting..."
                                  : "Remove"}
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
                          {searchTerm
                            ? "No patients found matching your search"
                            : "No patients available"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">{paginatedData.length}</span> of{" "}
              <span className="font-medium">{filteredData.length}</span>{" "}
              patients
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
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              patient record and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Patient Profile Modal */}
      {isViewModalOpen && selectedPatient && (
        <PatientProfileModal
          selectedPatient={selectedPatient}
          fullPatient={fullPatientData}
          onClose={handleCloseModal}
          onViewFullDetails={handlePaymentHistory}
        />
      )}
    </div>
  );
};

export default PatientManagement;

