import React from "react";
import { X } from "lucide-react";
import { Patient } from "@/types/patientsType";
import { useGetSinglePenitentAppointmentByIdQuery } from "@/redux/features/doctorAppoinment/doctorAppoinmentApi";
import { skipToken } from "@reduxjs/toolkit/query";
import AppointmentCardSkeleton from "@/components/Skeleton/AppointmentCardSkeleton";
import { formatLocalDate } from "@/utils/DateDisplayLocal";
import TableSkeleton from "../DoctorManagement/TableSkeleton";

interface DialogueProps {
  patient: Patient | null;
  onClose: () => void;
  onViewPaymentHistory?: (id: number) => void;
}

const Dialogue: React.FC<DialogueProps> = ({
  patient,
  onClose,
  // onViewPaymentHistory,
}) => {
  const { data: appointmentData, isLoading } =
    useGetSinglePenitentAppointmentByIdQuery(patient?._id ?? skipToken);

  console.log(patient?._id);
  console.log("h", appointmentData?.data);
  const allAppointment = appointmentData?.data;
  console.log(allAppointment);
  if (!patient) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ">
      <div className="bg-white rounded-lg w-full max-w-4xl relative shadow-2xl border border-[#DBE0E5] max-h-[94vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#DBE0E5] ">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Patient Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Complete information about this patient
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {/* Patient Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name
              </label>
              <input
                type="text"
                readOnly
                value={patient.userId?.fullName}
                className="w-full px-3 py-2 border border-[#DBE0E5] rounded-lg bg-gray-50 text-gray-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                readOnly
                value={patient.userId?.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <input
                readOnly
                value={patient.gender}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                readOnly
                value={
                  patient?.dateOfBirth
                    ? new Date().getFullYear() -
                      new Date(patient.dateOfBirth).getFullYear()
                    : 0
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                readOnly
                value={patient.phoneNumber}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Bookings
              </label>
              <input
                readOnly
                value={patient?.medicalHistory?.length ?? 0} // show 0 if array is undefined
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
              />
            </div>
          </div>

          {/* Appointment History */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Appointment History
            </h3>
            <div className=" border border-[#E4E4E4] rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4  gap-5">
                <div className="xl:col-span-4 w-full">
                  {/*  */}
                  <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-[#DBE0E5]">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                            Date & Time
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                            Doctor Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                            Service
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                          <TableSkeleton rows={8} />
                        ) : allAppointment && allAppointment.length > 0 ? (
                          <>
                            {allAppointment?.map((apt, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                                  {formatLocalDate(apt.createdAt)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap capitalize text-gray-900">
                                  {apt?.doctorId?.userId?.fullName ?? "N/A"}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap capitalize text-gray-900">
                                  {apt?.serviceType}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                    {apt.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </>
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-4 py-3 text-center">
                              No Appointments
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

          {/* Consulate Doctor */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Consulate Doctor
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <AppointmentCardSkeleton key={i} />
                ))
              ) : allAppointment && allAppointment.length > 0 ? (
                allAppointment?.map((doctor, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border border-[#DBE0E5] rounded-lg bg-[#F4F6F8] hover:border-blue-300 transition-colors"
                  >
                    {doctor.doctorId?.userId?.profileImage ? (
                      <img
                        src={doctor.doctorId?.userId?.profileImage}
                        alt={doctor.doctorId?.userId?.fullName}
                        className="size-14 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="border size-14 rounded-lg flex items-center justify-center text-2xl bg-[#BEDBFF] text-[#2E6FF3]">
                        <span>{doctor.doctorId?.userId?.fullName[0]}</span>
                      </div>
                    )}

                    <div className="flex-1 flex flex-col gap-3 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate capitalize">
                        {doctor.doctorId?.userId?.fullName || "N/A"}
                      </h4>
                      <p className="text-xs text-gray-600 truncate">
                        {doctor.doctorId?.professionalInformation?.speciality ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                // 👉 No items case
                <p className="text-gray-500 col-span-3 text-sm text-center py-6">
                  No appointments found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialogue;
