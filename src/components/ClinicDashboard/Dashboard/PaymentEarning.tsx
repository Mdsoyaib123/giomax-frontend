import React, { useState } from "react";
// Removed: import PaymentEarningCard from "./PaymentEarningCard";
import PaymentEarningCard from "@/components/ClinicDashboard/Dashboard/PaymentEarningCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Transaction type-ti define kora holo
interface Transaction {
  transactionId: string;
  receiver: string;
  service: string;
  amount: number;
  date: string;
  status: "Pending" | "Completed" | "Cancelled";
}

// Status Badge Component
const StatusBadge: React.FC<{ status: Transaction["status"] }> = ({
  status,
}) => {
  let colorClasses = "";

  switch (status) {
    case "Completed":
      colorClasses = "bg-[#D9F7E1] text-[#28A745]";
      break;
    case "Pending":
      colorClasses = "bg-[#FFF8E6] text-[#FFC107]";
      break;
    case "Cancelled":
      colorClasses = "bg-gray-200 text-gray-700";
      break;
    default:
      colorClasses = "bg-gray-100 text-gray-600";
  }

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${colorClasses}`}
    >
      {status}
    </span>
  );
};

// Component-er naam TransactionHistory deoya holo
const TransactionHistory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Items Per Page-ke 5 kora holo
  const itemsPerPage = 5;

  // Mukhya data-ti 9-ti transactions niye
  const mockTransactions: Transaction[] = [
    {
      transactionId: "TRX001",
      receiver: "Dr. Michael Brown",
      service: "Cardiology Consultation",
      amount: 2500.0,
      date: "25/10/2025",
      status: "Pending",
    },
    {
      transactionId: "TRX002",
      receiver: "Dr. Sarah Johnson",
      service: "Pediatric Checkup",
      amount: 2500.0,
      date: "25/10/2025",
      status: "Completed",
    },
    {
      transactionId: "TRX003",
      receiver: "Dr. Emily Rodriguez",
      service: "Dermatology Consultation",
      amount: 2500.0,
      date: "25/10/2025",
      status: "Completed",
    },
    {
      transactionId: "TRX004",
      receiver: "Dr. Lisa Anderson",
      service: "Neurology Consultation",
      amount: 2500.0,
      date: "25/10/2025",
      status: "Completed",
    },
    {
      transactionId: "TRX005",
      receiver: "Dr. Lisa Anderson",
      service: "General Checkup",
      amount: 2500.0,
      date: "25/10/2025",
      status: "Completed",
    },
    // Baki 4-ti entry
    {
      transactionId: "TRX006",
      receiver: "Dr. Jane Smith",
      service: "Orthopedic Checkup",
      amount: 1800.0,
      date: "24/10/2025",
      status: "Completed",
    },
    {
      transactionId: "TRX007",
      receiver: "Dr. Alex Lee",
      service: "Ophthalmology Exam",
      amount: 1200.0,
      date: "24/10/2025",
      status: "Completed",
    },
    {
      transactionId: "TRX008",
      receiver: "Dr. Ben Carter",
      service: "Physical Therapy",
      amount: 800.0,
      date: "23/10/2025",
      status: "Pending",
    },
    {
      transactionId: "TRX009",
      receiver: "Dr. Chloe Green",
      service: "General Consultation",
      amount: 1500.0,
      date: "23/10/2025",
      status: "Completed",
    },
  ];

  // PAGINATION LOGIC
  const transactionList = mockTransactions;

  const totalPages = Math.ceil(transactionList.length / itemsPerPage);

  // Bortoman page-er data
  const currentTransactions = transactionList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  // Showing X to Y of Z entries er jonno hishab
  const firstEntry = (currentPage - 1) * itemsPerPage + 1;
  const lastEntry = Math.min(
    currentPage * itemsPerPage,
    transactionList.length
  );
  const totalEntries = transactionList.length;

  return (
    <div>
      <div className="  font-sans">
        <div className="mt-5">
          {/* Payment Earning Card */}
          <div className="mb-4 sm:mb-5">
            <PaymentEarningCard></PaymentEarningCard>
          </div>

          {/* Main Table Card */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 sm:p-6 border-1px">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-[#343A40]">
                Transaction History
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="w-full sm:w-[250px] md:w-[220px]">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full h-10 border border-[#B3B3B3] rounded-xl px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm flex items-center justify-between hover:border-gray-400 transition-all duration-200 cursor-pointer">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-[#B3B3B3] rounded-md shadow-md">
                      <SelectGroup>
                        <SelectLabel className="px-4 pt-2 text-gray-500 text-sm">
                          All Status Data
                        </SelectLabel>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Table Container - Responsive Horizontal Scroll */}
            <div className="p-5 border border-[#E4E4E4] rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4  gap-5">
                <div className="xl:col-span-4 w-full">
                  {/* Table */}

                  <div className="overflow-x-auto rounded-lg border border-gray-200 w-full">
                    <table className="w-full text-xs sm:text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                            Transaction ID
                          </th>
                          <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-medium text-gray-700 whitespace-nowrap hidden sm:table-cell">
                            Receiver
                          </th>
                          <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-medium text-gray-700 whitespace-nowrap hidden md:table-cell">
                            Service
                          </th>
                          <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                            Amount
                          </th>
                          <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-medium text-gray-700 whitespace-nowrap hidden lg:table-cell">
                            Date
                          </th>
                          <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-200">
                        {currentTransactions.map((u) => (
                          <tr
                            key={u.transactionId}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-medium text-gray-900 whitespace-nowrap text-xs sm:text-sm">
                              <div className="truncate max-w-[120px] sm:max-w-none">
                                {u.transactionId}
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-gray-700 whitespace-nowrap hidden sm:table-cell text-xs sm:text-sm">
                              {u.receiver}
                            </td>
                            <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-gray-700 whitespace-nowrap hidden md:table-cell text-xs sm:text-sm">
                              {u.service}
                            </td>
                            <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-blue-600 whitespace-nowrap text-xs sm:text-sm">
                              ${u.amount.toFixed(2)}
                            </td>
                            <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-gray-500 whitespace-nowrap hidden lg:table-cell text-xs sm:text-sm">
                              {u.date}
                            </td>
                            <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                              <StatusBadge status={u.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-4 sm:mt-6 flex items-center justify-between gap-4">
              {/* Entries Info */}
              <p className="text-xs sm:text-sm text-gray-600">
                Showing <span className="font-medium">{firstEntry}</span> to{" "}
                <span className="font-medium">{lastEntry}</span> of{" "}
                <span className="font-medium">{totalEntries}</span> entries
              </p>

              {/* Pagination */}
              <div className="flex items-center gap-1">
                {/* Prev Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm transition ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed text-gray-400"
                      : "hover:bg-gray-100 bg-white text-blue-600"
                  }`}
                >
                  Prev
                </button>

                {/* Number Pages */}
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`min-w-[32px] px-3 py-1.5 border rounded-lg text-xs sm:text-sm transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm transition ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed text-gray-400"
                      : "hover:bg-gray-100 bg-white text-blue-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
