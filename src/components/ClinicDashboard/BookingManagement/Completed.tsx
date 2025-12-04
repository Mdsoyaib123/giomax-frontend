/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { X } from "lucide-react";
import a from "@assets/a.png";
import c from "@assets/c.png";
import d from "@assets/d.png";
import f from "@assets/f.png";

interface CompletedProps {
  onViewDetails: () => void;
}

interface Appointment {
  id: number;
  patientName: string;
  service: string;
  doctorName: string;
  date: string;
  time: string;
  status: "Completed";
  visitType: string;
  patientImage: string;
}

const Completed: React.FC<CompletedProps> = ({}) => {
  /* onViewDetails */
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [appointments] = useState<Appointment[]>([
    {
      id: 1,
      patientName: "John Smith",
      service: "Cardiology Consultation",
      doctorName: "Dr. Sarah Johnson",
      date: "Nov 13, 2025",
      time: "10:00 AM",
      status: "Completed",
      visitType: "Clinic Visit",
      patientImage: a,
    },
    {
      id: 2,
      patientName: "John Smith",
      service: "Dermatology Consultation",
      doctorName: "Dr. John Smith",
      date: "Nov 14, 2025",
      time: "11:00 AM",
      status: "Completed",
      visitType: "Online Consultation",
      patientImage: c,
    },
    {
      id: 3,
      patientName: "John Smith",
      service: "Orthopedic Consultation",
      doctorName: "Dr. John Smith",
      date: "Nov 15, 2025",
      time: "2:00 PM",
      status: "Completed",
      visitType: "Clinic Visit",
      patientImage: d,
    },
    {
      id: 4,
      patientName: "John Smith",
      service: "Psychiatry Consultation",
      doctorName: "Dr. John Smith",
      date: "Nov 16, 2025",
      time: "4:00 PM",
      status: "Completed",
      visitType: "Clinic Visit",
      patientImage: f,
    },
  ]);

  const handleCardClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const getVisitTypeColor = (type: string) => {
    return type === "Online Consultation"
      ? "text-green-600 bg-green-50"
      : "text-blue-600 bg-blue-50";
  };

  return (
    <div className="relative w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            onClick={() => handleCardClick(appointment)}
            className="bg-white border border-[#DBE0E5] rounded-xl p-5 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={appointment.patientImage}
                  alt={appointment.patientName}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {appointment.patientName}
                  </h3>
                  <p className="text-xs text-gray-500">{appointment.service}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-700 text-white ">
                Completed
              </span>
            </div>

            <div className="space-y-2.5 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{appointment.doctorName}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{appointment.date}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{appointment.time}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${getVisitTypeColor(
                  appointment.visitType
                )}`}
              >
                {appointment.visitType}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(appointment);
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[0.2px] bg-opacity-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Appointment Details
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    View and manage appointment information
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-700 text-white">
                  Completed
                </span>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={selectedAppointment.patientName}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    value={selectedAppointment.doctorName}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={selectedAppointment.service}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={selectedAppointment.service}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type
                  </label>
                  <input
                    type="text"
                    value={selectedAppointment.visitType}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Completed;
