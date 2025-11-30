/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import a from "@assets/a.png";
import b from "@assets/b.png";
import c from "@assets/c.png";
import d from "@assets/d.png";
import e from "@assets/e.png";
import f from "@assets/f.png";

interface AllProps {
  onViewDetails: () => void;
}

interface Appointment {
  id: number;
  patientName: string;
  service: string;
  doctorName: string;
  date: string;
  time: string;
  status: "Pending" | "Approved" | "Completed" | "Cancelled";
  visitType: string;
  patientImage: string;
}

const All: React.FC<AllProps> = ({ onViewDetails }) => {
  const [showModal, setShowModal] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelledModal, setShowCancelledModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Appointment data - using state to update status
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      patientName: "John Smith",
      service: "Cardiology Consultation",
      doctorName: "Dr. Sarah Johnson",
      date: "Nov 13, 2025",
      time: "10:00 AM",
      status: "Pending",
      visitType: "Clinic Visit",
      patientImage: a,
    },
    {
      id: 2,
      patientName: "Emma Williams",
      service: "Pediatric Checkup",
      doctorName: "Dr. Michael Chen",
      date: "Nov 13, 2025",
      time: "10:00 AM",
      status: "Approved",
      visitType: "Online Consultation",
      patientImage: b,
    },
    {
      id: 3,
      patientName: "Robert Brown",
      service: "Dermatology Consultation",
      doctorName: "Dr. Michael Chen",
      date: "Nov 13, 2025",
      time: "10:00 AM",
      status: "Cancelled",
      visitType: "Clinic Visit",
      patientImage: c,
    },
    {
      id: 4,
      patientName: "Sophia Davis",
      service: "Follow-up Appointment",
      doctorName: "Dr. Emily Rodriguez",
      date: "Nov 13, 2025",
      time: "10:00 AM",
      status: "Completed",
      visitType: "Online Consultation",
      patientImage: d,
    },
    {
      id: 5,
      patientName: "Michael Johnson",
      service: "Neurology Consultation",
      doctorName: "Dr. Lisa Anderson",
      date: "Nov 13, 2025",
      time: "10:00 AM",
      status: "Approved",
      visitType: "Clinic Visit",
      patientImage: e,
    },
    {
      id: 6,
      patientName: "John Smith",
      service: "Cardiology Consultation",
      doctorName: "Dr. Sarah Johnson",
      date: "Nov 13, 2025",
      time: "10:00 AM",
      status: "Completed",
      visitType: "Clinic Visit",
      patientImage: f,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-[#F9AA00] text-black";
      case "Approved":
        return "bg-[#1B9268] text-white";
      case "Completed":
        return "bg-[#1D4ED8] text-white";
      case "Cancelled":
        return "bg-[#E9575A] text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getVisitTypeColor = (type: string) => {
    return type === "Online Consultation"
      ? "text-green-600 bg-green-50"
      : "text-blue-600 bg-blue-50";
  };

  const handleCardClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    
    if (appointment.status === "Pending") {
      setShowModal(true);
    } else if (appointment.status === "Approved") {
      setShowSuccessModal(true);
    } else if (appointment.status === "Completed") {
      setShowCompletedModal(true);
    } else if (appointment.status === "Cancelled") {
      setShowCancelledModal(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const handleCompletedClose = () => {
    setShowCompletedModal(false);
    setSelectedAppointment(null);
  };

  const handleCancelledClose = () => {
    setShowCancelledModal(false);
    setSelectedAppointment(null);
  };

  const handleApprove = () => {
    if (selectedAppointment) {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === selectedAppointment.id
            ? { ...apt, status: "Approved" as const }
            : apt
        )
      );
    }
    setShowModal(false);
    setSelectedAppointment(null);
    setShowSuccessModal(true);
  };

  const handleCancel = () => {
    if (selectedAppointment) {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === selectedAppointment.id
            ? { ...apt, status: "Cancelled" as const }
            : apt
        )
      );
      setShowModal(false);
      setShowCancelledModal(true);
    } else {
      setShowModal(false);
      setSelectedAppointment(null);
    }
  };

  return (
    <div className="relative w-full">
      {/* Grid of appointment cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            onClick={() => handleCardClick(appointment)}
            className="bg-white border border-[#DBE0E5] rounded-xl p-5 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          >
            {/* Header with patient info and status */}
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
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  appointment.status
                )}`}
              >
                {appointment.status}
              </span>
            </div>

            {/* Appointment details */}
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

            {/* Footer with visit type */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${getVisitTypeColor(
                  appointment.visitType
                )}`}
              >
                {appointment.visitType}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[0.2px] bg-opacity-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
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
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F9AA00] text-black">
                  Pending
                </span>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

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
                    Date & Time
                  </label>
                  <input
                    type="text"
                    value={`${selectedAppointment.date} - ${selectedAppointment.time}`}
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

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 rounded-lg bg-[#EFF4FF] text-[#2E6FF3] hover:bg-[#d2e3ff] font-medium text-sm transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 bg-[#FFEAEB] text-[#E9575A] rounded-lg hover:bg-[#ffd5d7] font-medium text-sm transition-colors cursor-pointer"
                >
                  Cancel Appointment
                </button>
                <button
                  onClick={handleApprove}
                  className="flex-1 py-3 bg-[#1B9268] text-white rounded-lg hover:bg-[#157a56] font-medium text-sm transition-colors cursor-pointer"
                >
                  Approve Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completed Modal */}
      {showCompletedModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[0.2px] bg-opacity-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    View and manage appointment information
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-700 text-white">
                  Completed
                </span>
              </div>
              <button
                onClick={handleCompletedClose}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

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
                    Date & Time
                  </label>
                  <input
                    type="text"
                    value={`${selectedAppointment.date} - ${selectedAppointment.time}`}
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

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleCompletedClose}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approved Modal */}
      {showSuccessModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[0.2px] bg-opacity-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
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
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
                  Approved
                </span>
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

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
                    Date & Time
                  </label>
                  <input
                    type="text"
                    value={`${selectedAppointment.date} - ${selectedAppointment.time}`}
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

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="py-3 px-6 rounded-lg font-medium text-sm transition-colors text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancelled Modal - Updated to match Cancelled component style */}
      {showCancelledModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl relative shadow-2xl border border-[#DBE0E5]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#DBE0E5]">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900">
                  Appointment Details
                </h2>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  Cancelled
                </span>
              </div>
              <button
                onClick={handleCancelledClose}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-6">
                View appointment information
              </p>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Patient Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={selectedAppointment.patientName}
                    readOnly
                    className="w-full px-4 py-2.5 border border-[#DBE0E5] rounded-lg bg-gray-50 text-gray-900 text-sm"
                  />
                </div>

                {/* Doctor Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    value={selectedAppointment.doctorName}
                    readOnly
                    className="w-full px-4 py-2.5 border border-[#DBE0E5] rounded-lg bg-gray-50 text-gray-900 text-sm"
                  />
                </div>

                {/* Service Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={selectedAppointment.service}
                    readOnly
                    className="w-full px-4 py-2.5 border border-[#DBE0E5] rounded-lg bg-gray-50 text-gray-900 text-sm"
                  />
                </div>

                {/* Date & Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date & Time
                  </label>
                  <input
                    type="text"
                    value={`${selectedAppointment.date} - ${selectedAppointment.time}`}
                    readOnly
                    className="w-full px-4 py-2.5 border border-[#DBE0E5] rounded-lg bg-gray-50 text-gray-900 text-sm"
                  />
                </div>

                {/* Service Type */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type
                  </label>
                  <input
                    type="text"
                    value={selectedAppointment.visitType}
                    readOnly
                    className="w-full px-4 py-2.5 border border-[#DBE0E5] rounded-lg bg-gray-50 text-gray-900 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Footer Button */}
            <div className="flex gap-3 p-6 border-t border-[#DBE0E5] bg-gray-50">
              <button
                onClick={handleCancelledClose}
                className="ml-auto py-3 px-6 bg-[#EFF4FF] text-[#2E6FF3] rounded-lg hover:bg-[#d2e3ff] hover:text-[#1a5db0] font-medium text-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default All;