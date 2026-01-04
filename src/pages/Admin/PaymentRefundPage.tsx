/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  useAcceptRefundRequestMutation,
  useGetAllrefundRequestsQuery,
} from "@/redux/features/admin/payment/adminPaymentApi";
import {
  FiMoreVertical,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  //   FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiLoader,
} from "react-icons/fi";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { toast } from "sonner";

// Define the type for refund request
interface RefundRequest {
  _id: string;
  appointmentId: string;
  userId: string;
  appointmentType: string;
  status: "pending" | "approved" | "rejected";
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Define the API response type
interface RefundResponse {
  success: boolean;
  message: string;
  data: RefundRequest[];
}

export default function PaymentRefundPage() {
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useGetAllrefundRequestsQuery();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [processingRequest, setProcessingRequest] = useState<string | null>(
    null
  );

  // Use your acceptRefundRequest mutation for both accept and reject
  const [updateRefundRequest, { isLoading: isUpdating }] =
    useAcceptRefundRequestMutation();

  const refundData = (response as RefundResponse)?.data || [];

  const handleMenuToggle = (event: React.MouseEvent, requestId: string) => {
    event.stopPropagation();
    setSelectedRequest(requestId);
    setMenuPosition({ x: event.clientX, y: event.clientY });
    setIsMenuOpen(true);
  };

  const handleUpdateRefundStatus = async (status: "approved" | "rejected") => {
    if (!selectedRequest) return;

    try {
      setProcessingRequest(selectedRequest);

      // Prepare the payload exactly as your RTK Query expects
      const payload = {
        id: selectedRequest,
        data: { status }, // This will be sent in the request body
      };

      const response = await updateRefundRequest(payload).unwrap();

      if (response.success) {
        const actionText = status === "approved" ? "approved" : "rejected";
        toast.success(response.message || `Refund ${actionText} successfully!`);
        // The mutation already invalidates the REFUND_REQUEST tag, so data will be refetched automatically
        // But we can also manually refetch if needed
        refetch();
      } else {
        toast.error(response.message || `Failed to ${status} refund`);
      }
    } catch (error: any) {
      console.error(`Error ${status} refund:`, error);
      const actionText = status === "approved" ? "approving" : "rejecting";
      toast.error(
        error?.data?.message ||
          `An error occurred while ${actionText} the refund`
      );
    } finally {
      setProcessingRequest(null);
      setIsMenuOpen(false);
    }
  };

  const handleAcceptRefund = async () => {
    await handleUpdateRefundStatus("approved");
  };

  const handleRejectRefund = async () => {
    await handleUpdateRefundStatus("rejected");
  };

  // Handle view details
  //   const handleViewDetails = () => {
  //     if (!selectedRequest) return;

  //     // Find the selected request
  //     const request = refundData.find((r) => r._id === selectedRequest);
  //     if (request) {
  //       console.log("Request details:", request);
  //       // You could show a modal with detailed information here
  //       toast.info(`Viewing details for request: ${selectedRequest}`);
  //     }
  //     setIsMenuOpen(false);
  //   };

  const toggleRowExpand = (requestId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(requestId)) {
      newExpandedRows.delete(requestId);
    } else {
      newExpandedRows.add(requestId);
    }
    setExpandedRows(newExpandedRows);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <FiCheckCircle className="text-green-500 text-lg" />;
      case "rejected":
        return <FiXCircle className="text-red-500 text-lg" />;
      case "pending":
        return <FiClock className="text-yellow-500 text-lg" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const maskCardNumber = (cardNumber: string) => {
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };

  // Check if a request is currently being processed
  const isProcessing = (requestId: string) => {
    return processingRequest === requestId;
  };

  // Pagination calculations
  const totalPages = Math.ceil(refundData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = refundData.slice(startIndex, endIndex);

  // Close menu when clicking outside
  const handleClickOutside = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mt-4">
        <p className="font-medium">Error loading refund requests</p>
        <p className="text-sm">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="p-6" onClick={handleClickOutside}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Refund Requests</h1>
        <p className="text-gray-600 mt-2">
          Manage and process refund requests from users
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">
                {refundData.length}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiClock className="text-blue-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {refundData.filter((r) => r.status === "pending").length}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <FiClock className="text-yellow-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Processed</p>
              <p className="text-2xl font-bold text-gray-900">
                {refundData.filter((r) => r.status !== "pending").length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <FiCheckCircle className="text-green-500 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Card Information
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Appointment
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Requested
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((request) => (
                <>
                  <tr
                    key={request._id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => toggleRowExpand(request._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.cardHolderName}
                        </div>
                        <div className="text-sm text-gray-500 font-mono">
                          {maskCardNumber(request.cardNumber)}
                        </div>
                        <div className="text-xs text-gray-400">
                          Exp: {request.expiryDate}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">
                        {request.userId.slice(0, 10)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`px-2 py-1 text-xs rounded-full border ${
                            request.appointmentType === "doctor"
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : "bg-purple-100 text-purple-800 border-purple-200"
                          }`}
                        >
                          {request.appointmentType}
                        </span>
                        <div className="ml-2 text-sm text-gray-500 font-mono">
                          {request.appointmentId.slice(0, 8)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {isProcessing(request._id) ? (
                          <FiLoader className="animate-spin text-blue-500 text-lg" />
                        ) : (
                          getStatusIcon(request.status)
                        )}
                        <span
                          className={`ml-2 px-2 py-1 text-xs rounded-full border ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {getStatusText(request.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuToggle(e, request._id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors disabled:cursor-not-allowed"
                          disabled={
                            request.status !== "pending" ||
                            isProcessing(request._id)
                          }
                          title={
                            request.status !== "pending"
                              ? "Only pending requests can be modified"
                              : ""
                          }
                        >
                          {isProcessing(request._id) ? (
                            <FiLoader className="animate-spin text-gray-400 text-lg" />
                          ) : (
                            <FiMoreVertical
                              className={`text-lg ${
                                request.status !== "pending" ||
                                isProcessing(request._id)
                                  ? "text-gray-300"
                                  : "text-gray-600 hover:text-gray-900"
                              }`}
                            />
                          )}
                        </button>
                        {expandedRows.has(request._id) ? (
                          <MdExpandLess className="text-gray-400" />
                        ) : (
                          <MdExpandMore className="text-gray-400" />
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row Details */}
                  {expandedRows.has(request._id) && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Request ID</p>
                            <p className="font-mono text-gray-900">
                              {request._id}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Full Appointment ID</p>
                            <p className="font-mono text-gray-900">
                              {request.appointmentId}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Created At</p>
                            <p className="text-gray-900">
                              {formatDateTime(request.createdAt)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Last Updated</p>
                            <p className="text-gray-900">
                              {formatDateTime(request.updatedAt)}
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-gray-500">
                              Full Card Details (Masked)
                            </p>
                            <div className="flex space-x-4 mt-1">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Card Number
                                </p>
                                <p className="font-mono">
                                  {maskCardNumber(request.cardNumber)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Expiry</p>
                                <p>{request.expiryDate}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">CVV</p>
                                <p>***</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {refundData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="flex items-center mb-4 sm:mb-0">
              <span className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(endIndex, refundData.length)}
                </span>{" "}
                of <span className="font-medium">{refundData.length}</span>{" "}
                results
              </span>
              <select
                className="ml-4 border border-gray-300 rounded-md text-sm py-1 px-2"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`p-2 rounded ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiChevronsLeft />
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiChevronLeft />
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded text-sm ${
                        currentPage === pageNum
                          ? "bg-blue-500 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="text-gray-400">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-8 h-8 rounded text-sm text-gray-600 hover:bg-gray-100"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiChevronRight />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiChevronsRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Menu (Positioned Absolutely) */}
      {isMenuOpen && selectedRequest && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsMenuOpen(false)}
          />
          <div
            className="absolute z-20 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
            style={{
              top: menuPosition.y,
              left: menuPosition.x,
              transform: "translateX(-100%)",
            }}
          >
            {/* <button
              onClick={handleViewDetails}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FiEye className="mr-3 text-gray-400" />
              View Details
            </button> */}
            <button
              onClick={handleAcceptRefund}
              disabled={isUpdating}
              className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating && processingRequest === selectedRequest ? (
                <FiLoader className="animate-spin mr-3 text-green-500" />
              ) : (
                <FiCheckCircle className="mr-3 text-green-500" />
              )}
              {isUpdating && processingRequest === selectedRequest
                ? "Processing..."
                : "Approve Refund"}
            </button>
            <button
              onClick={handleRejectRefund}
              disabled={isUpdating}
              className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating && processingRequest === selectedRequest ? (
                <FiLoader className="animate-spin mr-3 text-red-500" />
              ) : (
                <FiXCircle className="mr-3 text-red-500" />
              )}
              {isUpdating && processingRequest === selectedRequest
                ? "Processing..."
                : "Reject Refund"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
