import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X, ArrowLeft } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  speciallity: string;
  type: string;
  earnings: string;
  status: string;
  email?: string;
  phone?: string;
}

const TransactionDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor as Doctor;

  if (!doctor) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">No doctor data available</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-[#2E6FF3] text-white rounded-lg hover:bg-[#1d5dd8] transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#0A0A0A] transition mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Doctor Management</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#0A0A0A]">
          Transaction Details
        </h1>
      </div>

      {/* Transaction Details Modal */}
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6 sm:p-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#0A0A0A] mb-1">
              Transaction Details
            </h2>
            <p className="text-sm text-[#6B7280]">
              Complete information about this transaction
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-[#6B7280] hover:text-[#0A0A0A] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transaction Info Grid */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Transaction ID */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Transaction ID
              </label>
              <div className="px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#0A0A0A]">
                {doctor.id}
              </div>
            </div>

            {/* Receiver */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Receiver
              </label>
              <div className="px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#0A0A0A]">
                {doctor.name}
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Type
              </label>
              <div className="px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#2E6FF3] font-medium">
                {doctor.type}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Amount
              </label>
              <div className="px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#0A0A0A] font-semibold">
                {doctor.earnings}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Date
              </label>
              <div className="px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#0A0A0A]">
                2025-10-12
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Status
              </label>
              <div className="px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    doctor.status === "Active"
                      ? "bg-[#D4F4DD] text-[#06A561]"
                      : doctor.status === "Pending"
                      ? "bg-[#FFF4E5] text-[#FF9800]"
                      : "bg-[#FFE5E5] text-[#D32F2F]"
                  }`}
                >
                  {doctor.status === "Active" ? "Completed" : doctor.status}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {doctor.email && (
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Email
              </label>
              <div className="px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#0A0A0A]">
                {doctor.email}
              </div>
            </div>
          )}

          {doctor.phone && (
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Phone
              </label>
              <div className="px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#0A0A0A]">
                {doctor.phone}
              </div>
            </div>
          )}

          {doctor.speciallity && (
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Speciality
              </label>
              <div className="px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#0A0A0A]">
                {doctor.speciallity}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-[#E5E7EB] my-6"></div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 px-5 py-2.5 border border-[#E5E7EB] bg-white text-[#374151] rounded-lg hover:bg-gray-50 transition cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => alert("View Payment History clicked!")}
            className="flex-1 px-5 py-2.5 bg-[#2E6FF3] text-white rounded-lg hover:bg-[#1d5dd8] transition cursor-pointer"
          >
            View Payment History
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
