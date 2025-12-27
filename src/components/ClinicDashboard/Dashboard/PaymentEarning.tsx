/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
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
import { useGetWithdrawRequestsQuery } from "@/redux/features/admin/payment/clinicPaymentsApi";
import { useAppSelector } from "@/redux/hooks/redux-hook";

// Transaction type definition based on API response
interface Transaction {
  id: string;
  transactionId?: string;
  receiver?: string;
  service: string;
  amount: number;
  date: string;
  status: "Pending" | "Completed" | "Cancelled" | "PAID" | "PENDING";
  ownerType: string;
}

// Status Badge Component
const StatusBadge: React.FC<{ status: Transaction["status"] }> = ({
  status,
}) => {
  let colorClasses = "";
  let displayStatus = status;

  // Map API status values to display values
  if (status === "PAID") {
    displayStatus = "Completed";
    colorClasses = "bg-[#D9F7E1] text-[#28A745]";
  } else if (status === "PENDING") {
    displayStatus = "Pending";
    colorClasses = "bg-[#FFF8E6] text-[#FFC107]";
  } else if (status === "Cancelled") {
    displayStatus = "Cancelled";
    colorClasses = "bg-gray-200 text-gray-700";
  } else if (status === "Completed") {
    colorClasses = "bg-[#D9F7E1] text-[#28A745]";
  } else if (status === "Pending") {
    colorClasses = "bg-[#FFF8E6] text-[#FFC107]";
  } else {
    colorClasses = "bg-gray-100 text-gray-600";
  }

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${colorClasses}`}
    >
      {displayStatus}
    </span>
  );
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
};

// Helper function to format amount
const formatAmount = (amount: number) => {
  return `$${amount.toFixed(2)}`;
};

// Helper function to get service name based on ownerType
const getServiceName = (ownerType: string) => {
  switch (ownerType) {
    case "SOLO_NURSE":
      return "Nursing Services";
    case "CLINIC":
      return "Clinic Services";
    case "SOLO_DOCTOR":
      return "Medical Consultation";
    case "HOSPITAL":
      return "Hospital Services";
    default:
      return "Healthcare Services";
  }
};

const TransactionHistory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const userId = useAppSelector((state) => state.auth.user?.id);
  const {
    data: withdrawRequests,
    isLoading,
    error,
  } = useGetWithdrawRequestsQuery(userId);

  const itemsPerPage = 5;

  // Transform API data to match Transaction interface
  const transformApiData = (): Transaction[] => {
    if (!withdrawRequests?.data || !Array.isArray(withdrawRequests.data)) {
      return [];
    }

    return withdrawRequests.data.map((item: any, index: number) => ({
      id: item._id || `trx-${index}`,
      transactionId:
        item._id?.slice(-6) || `TRX${String(index + 1).padStart(3, "0")}`, // Use last 6 chars of _id
      receiver: item.ownerType || "System",
      service: getServiceName(item.ownerType),
      amount: item.amount || 0,
      date: formatDate(item.createdAt || new Date().toISOString()),
      status:
        item.status === "PAID"
          ? "PAID"
          : item.status === "PENDING"
          ? "PENDING"
          : ("Pending" as Transaction["status"]),
      ownerType: item.ownerType || "UNKNOWN",
    }));
  };

  // Get all transactions
  const allTransactions = transformApiData();

  // Filter transactions based on status
  const filteredTransactions =
    statusFilter === "all"
      ? allTransactions
      : allTransactions.filter((transaction) => {
          if (statusFilter === "Active" || statusFilter === "Completed") {
            return (
              transaction.status === "Completed" ||
              transaction.status === "PAID"
            );
          }
          if (statusFilter === "Pending") {
            return (
              transaction.status === "Pending" ||
              transaction.status === "PENDING"
            );
          }
          if (statusFilter === "Suspended") {
            return transaction.status === "Cancelled";
          }
          return true;
        });

  // PAGINATION LOGIC
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Current page data
  const currentTransactions = filteredTransactions.slice(
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
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  // Showing X to Y of Z entries calculation
  const firstEntry = (currentPage - 1) * itemsPerPage + 1;
  const lastEntry = Math.min(
    currentPage * itemsPerPage,
    filteredTransactions.length
  );
  const totalEntries = filteredTransactions.length;

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-4 sm:mb-5">
          <PaymentEarningCard />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="mb-4 sm:mb-5">
          <PaymentEarningCard />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="text-center py-10 text-red-600">
            <p>Error loading transactions. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <div className="mt-5">
        {/* Payment Earning Card */}
        <div className="mb-4 sm:mb-5">
          <PaymentEarningCard />
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
                <Select value={statusFilter} onValueChange={handleFilterChange}>
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

          {/* Table Container */}
          <div className="p-5 border border-[#E4E4E4] rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 gap-5">
              <div className="xl:col-span-4 w-full">
                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 w-full">
                  {filteredTransactions.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      No transactions found
                    </div>
                  ) : (
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
                        {currentTransactions.map((transaction) => (
                          <tr
                            key={transaction.id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-medium text-gray-900 whitespace-nowrap text-xs sm:text-sm">
                              <div className="truncate max-w-[120px] sm:max-w-none">
                                {transaction.transactionId}
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-gray-700 whitespace-nowrap hidden sm:table-cell text-xs sm:text-sm">
                              {transaction.receiver}
                            </td>
                            <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-gray-700 whitespace-nowrap hidden md:table-cell text-xs sm:text-sm">
                              {transaction.service}
                            </td>
                            <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-blue-600 whitespace-nowrap text-xs sm:text-sm">
                              {formatAmount(transaction.amount)}
                            </td>
                            <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-gray-500 whitespace-nowrap hidden lg:table-cell text-xs sm:text-sm">
                              {transaction.date}
                            </td>
                            <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                              <StatusBadge status={transaction.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pagination - Only show if there are transactions */}
          {filteredTransactions.length > 0 && (
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
