import React, { useState } from "react";
// Removed: import PaymentEarningCard from "./PaymentEarningCard"; 
import PaymentEarningCard from '@/components/ClinicDashboard/Dashboard/PaymentEarningCard';

// Transaction type-ti define kora holo
interface Transaction {
  transactionId: string;
  receiver: string;
  service: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

// Status Badge Component
const StatusBadge: React.FC<{ status: Transaction['status'] }> = ({ status }) => {
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
    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${colorClasses}`}>
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
      status: "Pending"
    },
    {
      transactionId: "TRX002",
      receiver: "Dr. Sarah Johnson",
      service: "Pediatric Checkup",
      amount: 2500.0,
      date: "25/10/2025",
      status: "Completed"
    },
    {
      transactionId: "TRX003",
      receiver: "Dr. Emily Rodriguez",
      service: "Dermatology Consultation",
      amount: 2500.0,
      date: "25/10/2025",
      status: "Completed"
    },
    {
      transactionId: "TRX004",
      receiver: "Dr. Lisa Anderson",
      service: "Neurology Consultation",
      amount: 2500.0,
      date: "25/10/2025",
      status: "Completed"
    },
    {
      transactionId: "TRX005",
      receiver: "Dr. Lisa Anderson",
      service: "General Checkup",
      amount: 2500.0,
      date: "25/10/2025",
      status: "Completed"
    },
    // Baki 4-ti entry
    {
      transactionId: "TRX006",
      receiver: "Dr. Jane Smith",
      service: "Orthopedic Checkup",
      amount: 1800.0,
      date: "24/10/2025",
      status: "Completed"
    },
    {
      transactionId: "TRX007",
      receiver: "Dr. Alex Lee",
      service: "Ophthalmology Exam",
      amount: 1200.0,
      date: "24/10/2025",
      status: "Completed"
    },
    {
      transactionId: "TRX008",
      receiver: "Dr. Ben Carter",
      service: "Physical Therapy",
      amount: 800.0,
      date: "23/10/2025",
      status: "Pending"
    },
    {
      transactionId: "TRX009",
      receiver: "Dr. Chloe Green",
      service: "General Consultation",
      amount: 1500.0,
      date: "23/10/2025",
      status: "Completed"
    }
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
  const lastEntry = Math.min(currentPage * itemsPerPage, transactionList.length);
  const totalEntries = transactionList.length;











  return (



    
    <div>
      <div className="  font-sans">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          {/* Payment Earning Card */}
          <div className="mb-4 sm:mb-5">
            <PaymentEarningCard></PaymentEarningCard>
          </div>

          {/* Main Table Card */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 sm:p-6 border-1px">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-5 w-full">
              <h2 className="text-lg sm:text-xl font-semibold text-[#343A40]">Transaction History</h2>

              {/* Status Dropdown */}
              <div className="relative w-full sm:w-auto">
                <select
                  className="appearance-none block w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-xs sm:text-sm leading-5 focus:outline-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  defaultValue="All Status"
                >
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Table Container - Responsive Horizontal Scroll */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 w-full">
              <table className="w-full text-xs sm:text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-medium text-gray-700 whitespace-nowrap">Transaction ID</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-medium text-gray-700 whitespace-nowrap hidden sm:table-cell">Receiver</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-medium text-gray-700 whitespace-nowrap hidden md:table-cell">Service</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-medium text-gray-700 whitespace-nowrap">Amount</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-medium text-gray-700 whitespace-nowrap hidden lg:table-cell">Date</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-medium text-gray-700 whitespace-nowrap">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {currentTransactions.map((u) => (
                    <tr key={u.transactionId} className="hover:bg-gray-50 transition">
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-medium text-gray-900 whitespace-nowrap text-xs sm:text-sm">
                        <div className="truncate max-w-[120px] sm:max-w-none">{u.transactionId}</div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-gray-700 whitespace-nowrap hidden sm:table-cell text-xs sm:text-sm">{u.receiver}</td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-gray-700 whitespace-nowrap hidden md:table-cell text-xs sm:text-sm">{u.service}</td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-blue-600 whitespace-nowrap text-xs sm:text-sm">${u.amount.toFixed(2)}</td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-gray-500 whitespace-nowrap hidden lg:table-cell text-xs sm:text-sm">{u.date}</td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        <StatusBadge status={u.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
              <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                Showing <span className="font-medium">{firstEntry}</span> to <span className="font-medium">{lastEntry}</span> of <span className="font-medium">{totalEntries}</span> entries
              </p>

              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                {/* Prev Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-2 sm:px-3 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm transition whitespace-nowrap ${currentPage === 1
                      ? "opacity-50 cursor-not-allowed text-gray-400"
                      : "hover:bg-gray-100 bg-white text-blue-600"
                    }`}
                >
                  Prev
                </button>

                {/* Numbered Page Buttons */}
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`min-w-[32px] px-2 sm:px-3 py-1.5 border rounded-lg text-xs sm:text-sm transition ${currentPage === page
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
                  className={`px-2 sm:px-3 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm transition whitespace-nowrap ${currentPage === totalPages
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