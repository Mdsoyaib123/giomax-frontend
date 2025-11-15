/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { X } from "lucide-react";
import dr1 from "@assets/dr1.png";
import dr2 from "@assets/dr2.png";
import dr3 from "@assets/dr3.png";

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  lastAppointment: string;
}

interface Appointment {
  dateTime: string;
  doctorName: string;
  service: string;
  status: string;
}

interface Doctor {
  name: string;
  specialization: string;
  image: string;
}

interface DialogueProps {
  patient: Patient | null;
  onClose: () => void;
  onViewPaymentHistory?: (id: number) => void;
}

const Dialogue: React.FC<DialogueProps> = ({
  patient,
  onClose,
  onViewPaymentHistory,
}) => {
  if (!patient) return null;

  // Appointment History Data
  const appointments: Appointment[] = [
    {
      dateTime: "25/10/2025 - 10:00 AM",
      doctorName: "Dr. Mike Shinoda",
      service: "General Checkup",
      status: "Completed",
    },
    {
      dateTime: "28/10/2025 - 10:00 AM",
      doctorName: "Dr. Emily Rodriguez",
      service: "Blood Test",
      status: "Completed",
    },
    {
      dateTime: "29/10/2025 - 10:00 AM",
      doctorName: "Dr. Lisa Anderson",
      service: "Follow-up",
      status: "Completed",
    },
    {
      dateTime: "25/10/2025 - 10:00 AM",
      doctorName: "Dr. Michael Chan",
      service: "Medical Consultation",
      status: "Completed",
    },
    {
      dateTime: "28/10/2025 - 10:00 AM",
      doctorName: "Dr. Sarah Johnson",
      service: "General Checkup",
      status: "Completed",
    },
  ];

  // Consulate Doctor Data
  const doctors: Doctor[] = [
    {
      name: "Dr. Michael Brown",
      specialization: "General Physician",
      image: dr1,
    },
    {
      name: "Dr. Michael Brown",
      specialization: "General Physician",
      image: dr2,
    },
    {
      name: "Dr. Michael Brown",
      specialization: "General Physician",
      image: dr3,
    },
  ];

  const handleViewPaymentHistory = () => {
    if (onViewPaymentHistory) {
      onViewPaymentHistory(patient.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl relative shadow-2xl border border-[#DBE0E5]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#DBE0E5]">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Patient Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Complete information about this patient
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
                readOnly
                value={patient.name}
                className="w-full px-3 py-2 border border-[#DBE0E5] rounded-lg bg-gray-50 text-gray-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                readOnly
                value={patient.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <input
                readOnly
                value="Female"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                readOnly
                value="34"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                readOnly
                value={patient.phone}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Bookings
              </label>
              <input
                readOnly
                value={patient.totalBookings}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
              />
            </div>
          </div>

          {/* Appointment History */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Appointment History
            </h3>
            <div className="border border-[#DBE0E5] rounded-lg">
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
                  {appointments.map((apt, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                        {apt.dateTime}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                        {apt.doctorName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                        {apt.service}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Consulate Doctor */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Consulate Doctor
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {doctors.map((doctor, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border border-[#DBE0E5] rounded-lg hover:border-blue-300 transition-colors"
                >
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {doctor.name}
                    </h4>
                    <p className="text-xs text-gray-600 truncate">
                      {doctor.specialization}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialogue;