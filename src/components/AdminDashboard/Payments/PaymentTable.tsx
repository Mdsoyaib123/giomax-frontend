/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { X } from "lucide-react";
import aap from "@/assets/aap.png";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Booking {
  id: string;
  receiver: string;
  role: string;
  amount: string;
  status: "Pending" | "Completed" | "Processing";
  dateTime: string;
  payment: "Pending" | "Completed" | "Refused";
}

const PaymentTable: React.FC = () => {
  const [openProfile, setOpenProfile] = useState<Booking | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  console.log(currentPage)
  const itemsPerPage = 9;

  const bookings: Booking[] = [
    {
      id: "TRX001",
      receiver: "Dr. Michael Brown",
      role: "Solo Doctor",
      amount: "$2500.00",
      status: "Pending",
      dateTime: "25/10/2025",
      payment: "Completed",
    },
    {
      id: "TRX002",
      receiver: "City Medical Center",
      role: "Clinic",
      amount: "$2500.00",
      status: "Completed",
      dateTime: "25/10/2025",
      payment: "Completed",
    },
    {
      id: "TRX003",
      receiver: "Nurse Emily Davis",
      role: "Nurse",
      amount: "$2500.00",
      status: "Completed",
      dateTime: "25/10/2025",
      payment: "Completed",
    },
    {
      id: "TRX004",
      receiver: "Downtown Health Hub",
      role: "Clinic",
      amount: "$2500.00",
      status: "Processing",
      dateTime: "25/10/2025",
      payment: "Pending",
    },
    {
      id: "TRX005",
      receiver: "Dr. Sarah Wilson",
      role: "Solo Doctor",
      amount: "$2500.00",
      status: "Completed",
      dateTime: "25/10/2025",
      payment: "Completed",
    },
  ];

  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const handleView = (patient: Booking) => setOpenProfile(patient);

  return (
    <div>
      <div className="rounded-xl border border-[#DBE0E5] bg-white shadow-sm p-6">
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-[#343A40]">
              Transaction History
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="w-full sm:w-[250px] md:w-[220px]">
                <Select defaultValue="all">
                  <SelectTrigger className="w-full h-10 border border-[#B3B3B3] rounded-xl px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="px-4 pt-2 text-gray-500 text-sm">
                        All Status Data
                      </SelectLabel>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="p-0">
          <div className="w-full overflow-x-auto rounded-lg border border-gray-300">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Receiver
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-300">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-700">{booking.id}</td>

                    <td className="px-6 py-4 text-gray-700">
                      {booking.receiver}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-blue-600 font-medium">
                        {booking.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {booking.amount}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {booking.dateTime}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1.5 text-xs font-semibold rounded-xl
                          ${
                            booking.status === "Completed"
                              ? "bg-[#E7F8EE] text-[#1E9E46]"
                              : booking.status === "Pending"
                              ? "bg-[#FEF7E8] text-[#C07F00]"
                              : "bg-[#E8F1FF] text-[#1A73E8]"
                          }`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {booking.status === "Pending" ? (
                        <button
                          onClick={() => handleView(booking)}
                          className="px-4 py-2 bg-[#1E9E46] text-white text-sm font-medium hover:bg-[#18843B] rounded-none inline-flex items-center gap-2"
                        >
                          <img src={aap} alt="Approve" className="w-4 h-4" />
                          Approve Payout
                        </button>
                      ) : (
                        <button
                          onClick={() => handleView(booking)}
                          className="px-4 py-2 rounded-lg bg-[#1A73E8] text-white text-sm font-medium hover:bg-[#165FC2] inline-flex items-center gap-2"
                        >
                          <FaEye className="text-sm" /> View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">1 to 9</span> of{" "}
            <span className="font-semibold">9 entries</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-lg border bg-gray-50 text-gray-700"
            >
              Prev
            </button>

            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white">
              1
            </button>

            <button className="px-4 py-2 rounded-lg border text-gray-700">
              2
            </button>

            <button className="px-4 py-2 rounded-lg border text-gray-700">
              3
            </button>

            <span className="px-2 text-gray-500">...</span>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-lg border bg-gray-50 text-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {openProfile && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-4xl p-8 relative border shadow-xl">
            <button
              onClick={() => setOpenProfile(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Transaction Details
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Complete information about this transaction
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: "Transaction ID", value: openProfile.id },
                { label: "Receiver", value: openProfile.receiver },
                { label: "Role", value: openProfile.role },
                { label: "Amount", value: openProfile.amount },
                { label: "Date", value: openProfile.dateTime },
                { label: "Status", value: openProfile.status },
              ].map((item) => (
                <div key={item.label}>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    {item.label}
                  </label>
                  <input
                    value={item.value}
                    readOnly
                    className="w-full px-4 py-3 border rounded-lg bg-gray-50"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTable;