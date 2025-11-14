import React, { useState } from "react";
import { X } from "lucide-react";
import All from "./All";

interface PendingProps {
  onViewDetails: () => void;
}

const Pending: React.FC<PendingProps> = ({ onViewDetails }) => {
  const [showModal, setShowModal] = useState(false);

  // Open modal when component mounts or when clicking a card
  const handleCardClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleApprove = () => {
    alert("Appointment Approved!");
    setShowModal(false);
  };

  const handleCancel = () => {
    alert("Appointment Cancelled!");
    setShowModal(false);
  };

  return (
    <div className="relative">
      {/* Background - All component */}
      <div onClick={handleCardClick}>
        <All onViewDetails={onViewDetails} />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl relative shadow-2xl border border-[#DBE0E5]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#DBE0E5]">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900">
                  Appointment Details
                </h2>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                  Pending
                </span>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-6">
                View and manage appointment information
              </p>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Patient Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value="John Smith"
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
                    value="Dr. Sarah Johnson"
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
                    value="Cardiology Consultation"
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
                    value="25/10/2025 - 10:20 AM"
                    readOnly
                    className="w-full px-4 py-2.5 border border-[#DBE0E5] rounded-lg bg-gray-50 text-gray-900 text-sm"
                  />
                </div>

                {/* Service Type - Full Width */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type
                  </label>
                  <input
                    type="text"
                    value="Clinic Visit"
                    readOnly
                    className="w-full px-4 py-2.5 border border-[#DBE0E5] rounded-lg bg-gray-50 text-gray-900 text-sm"
                  />
                </div>
              </div>

              {/* Footer Buttons - Inside content area */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                <button
                  onClick={handleClose}
                  className="py-3 px-4 rounded-lg font-medium text-sm transition-colors text-blue-600 bg-blue-50 hover:bg-blue-100"
                >
                  Close
                </button>
                <button
                  onClick={handleCancel}
                  className="py-3 px-4 rounded-lg font-medium text-sm transition-colors text-red-600 bg-red-50 hover:bg-red-100"
                >
                  Cancel Appointment
                </button>
                <button
                  onClick={handleApprove}
                  className="py-3 px-4 rounded-lg font-medium text-sm transition-colors text-white bg-green-600 hover:bg-green-700 shadow-sm"
                >
                  Approve Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pending;