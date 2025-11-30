/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { X, Check } from "lucide-react";
import a from "@assets/a.png";
import c from "@assets/c.png";

// --- Interfaces for Type Safety ---

interface PendingProps {
  onViewDetails: () => void;
}

interface Appointment {
  id: number;
  patientName: string;
  service: string;
  doctorName: string;
  date: string;
  time: string;
  status: "Pending";
  visitType: string;
  patientImage: string;
}

// --- Exported Dialog Component for Pending Appointments ---

export interface PendingDialogProps {
  appointment: Appointment | null;
  onClose: () => void;
  onApprove: () => void;
  onCancel: () => void;
}

export const PendingDialog: React.FC<PendingDialogProps> = ({
  appointment,
  onClose,
  onApprove,
  onCancel,
}) => {
  if (!appointment) return null;

  return (
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
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F9AA00] text-black">
              Pending
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 pt-0">
          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Patient Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name
              </label>
              <input
                type="text"
                value={appointment.patientName}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            {/* Doctor Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor Name
              </label>
              <input
                type="text"
                value={appointment.doctorName}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name
              </label>
              <input
                type="text"
                value={appointment.service}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date & Time
              </label>
              <input
                type="text"
                value={`${appointment.date} - ${appointment.time}`}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            {/* Service Type */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type
              </label>
              <input
                type="text"
                value={appointment.visitType}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg bg-[#EFF4FF] text-[#2E6FF3] hover:bg-[#d2e3ff] font-medium text-sm transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={onCancel}
              className="flex-1 py-3 bg-[#FFEAEB] text-[#E9575A] rounded-lg hover:bg-[#ffd5d7] font-medium text-sm transition-colors cursor-pointer"
            >
              Cancel Appointment
            </button>
            <button
              onClick={onApprove}
              className="flex-1 py-3 bg-[#1B9268] text-white rounded-lg hover:bg-[#157a56] font-medium text-sm transition-colors cursor-pointer"
            >
              Approve Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Exported Success Dialog Component ---

export interface SuccessDialogProps {
  onClose: () => void;
}

export const SuccessDialog: React.FC<SuccessDialogProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[0.2px] bg-opacity-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md relative shadow-2xl p-8 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <Check size={32} className="text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          The Appointment has been successfully approved.
        </h2>

        {/* Back Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm transition-colors cursor-pointer"
        >
          Back to Appointment
        </button>
      </div>
    </div>
  );
};

// --- Main Pending Component (Default Export) ---

const Pending: React.FC<PendingProps> = ({ onViewDetails }) => {
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

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
      patientName: "Jane Doe",
      service: "Orthopedic Consultation",
      doctorName: "Dr. Mike Taylor",
      date: "Nov 14, 2025",
      time: "2:00 PM",
      status: "Pending",
      visitType: "Online Consultation",
      patientImage: c,
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

  const handleApprove = () => {
    if (selectedAppointment) {
      setAppointments((prev) =>
        prev.filter((apt) => apt.id !== selectedAppointment.id)
      );
    }
    setShowModal(false);
    setShowSuccessModal(true);
  };

  const handleCancel = () => {
    if (selectedAppointment) {
      setAppointments((prev) =>
        prev.filter((apt) => apt.id !== selectedAppointment.id)
      );
    }
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSelectedAppointment(null);
  };

  const getVisitTypeColor = (type: string) => {
    return type === "Online Consultation"
      ? "text-green-600 bg-green-50"
      : "text-blue-600 bg-blue-50";
  };

  return (
    <div className="relative w-full">
      {/* Grid of Pending appointment cards */}
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
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#F9AA00] text-black">
                Pending
              </span>
            </div>

            {/* Appointment details */}
            <div className="space-y-2.5 mb-4">
              {/* Doctor */}
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

              {/* Date */}
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

              {/* Time */}
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

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(appointment);
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors bg-yellow-100 text-yellow-600 hover:bg-yellow-200 cursor-pointer"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Use PendingDialog component */}
      {showModal && (
        <PendingDialog
          appointment={selectedAppointment}
          onClose={handleClose}
          onApprove={handleApprove}
          onCancel={handleCancel}
        />
      )}

      {/* Use SuccessDialog component */}
      {showSuccessModal && <SuccessDialog onClose={handleSuccessClose} />}
    </div>
  );
};

export default Pending;