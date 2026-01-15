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
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiLoader,
  FiCopy,
  FiCreditCard,
  FiCalendar,
  FiUser,
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
  const [copiedField, setCopiedField] = useState<{
    id: string;
    type: string;
  } | null>(null);

  // Use your acceptRefundRequest mutation for both accept and reject
  const [updateRefundRequest, { isLoading: isUpdating }] =
    useAcceptRefundRequestMutation();

  const refundData = (response as RefundResponse)?.data || [];

  const handleMenuToggle = (event: React.MouseEvent, requestId: string) => {
    event.stopPropagation();
    setSelectedRequest(requestId);
    console.log(requestId);
    setMenuPosition({ x: event.clientX, y: event.clientY });
    setIsMenuOpen(true);
  };

  const handleUpdateRefundStatus = async (status: "approved" | "rejected") => {
    if (!selectedRequest) return;

    try {
      setProcessingRequest(selectedRequest);

      // Find the selected request to get all its data
      const request = refundData.find((r) => r._id === selectedRequest);
      console.log(request, "fchd");
      if (!request) {
        toast.error("Refund request not found");
        return;
      }
      console.log(request.appointmentType);
      // Try Option 1 first (most common RTK Query pattern)
      const response = await updateRefundRequest({
        id: selectedRequest,
        data: { status: status, appointmentType: request.appointmentType },
      }).unwrap();

      if (response.success) {
        const actionText = status === "approved" ? "approved" : "rejected";
        toast.success(response.message || `Refund ${actionText} successfully!`);
        refetch();
      } else {
        toast.error(response.message || `Failed to ${status} refund`);
      }
    } catch (error: any) {
      console.error(`Error ${status} refund:`, error);
      const actionText = status === "approved" ? "approving" : "rejecting";
      toast.error(
        error?.data?.message ||
          error?.message ||
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

  const toggleRowExpand = (requestId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(requestId)) {
      newExpandedRows.delete(requestId);
    } else {
      newExpandedRows.add(requestId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleCopyToClipboard = async (
    text: string,
    requestId: string,
    fieldType: string
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField({ id: requestId, type: fieldType });
      toast.success(
        `${
          fieldType.charAt(0).toUpperCase() + fieldType.slice(1)
        } copied to clipboard`
      );

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy to clipboard");
    }
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
    if (!cardNumber) return "N/A";
    const cleaned = cardNumber.replace(/\s/g, "");
    if (cleaned.length < 4) return cardNumber;
    return `**** **** **** ${cleaned.slice(-4)}`;
  };

  const formatCardNumber = (cardNumber: string) => {
    if (!cardNumber) return "";
    const cleaned = cardNumber.replace(/\s/g, "");
    return cleaned.replace(/(\d{4})/g, "$1 ").trim();
  };

  const showFullCardNumber = (cardNumber: string) => {
    if (!cardNumber) return "N/A";
    return formatCardNumber(cardNumber);
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
              <FiCreditCard className="text-blue-500 text-xl" />
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
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                            {request.cardHolderName || "N/A"}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyToClipboard(
                                request.cardHolderName,
                                request._id,
                                "name"
                              );
                            }}
                            className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Copy cardholder name"
                          >
                            <FiCopy
                              className={`text-sm ${
                                copiedField?.id === request._id &&
                                copiedField?.type === "name"
                                  ? "text-green-500"
                                  : "text-gray-400"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500 font-mono">
                            {maskCardNumber(request.cardNumber)}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyToClipboard(
                                request.cardNumber,
                                request._id,
                                "card"
                              );
                            }}
                            className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Copy card number"
                          >
                            <FiCopy
                              className={`text-sm ${
                                copiedField?.id === request._id &&
                                copiedField?.type === "card"
                                  ? "text-green-500"
                                  : "text-gray-400"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="text-xs text-gray-400">
                          Exp: {request.expiryDate || "N/A"} | CVV: ***
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-900 font-mono">
                          {request.userId?.slice(0, 10)}...
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyToClipboard(
                              request.userId,
                              request._id,
                              "userId"
                            );
                          }}
                          className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Copy User ID"
                        >
                          <FiCopy
                            className={`text-sm ${
                              copiedField?.id === request._id &&
                              copiedField?.type === "userId"
                                ? "text-green-500"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
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
                        <div className="flex items-center ml-2">
                          <span className="text-sm text-gray-500 font-mono">
                            {request.appointmentId?.slice(0, 8)}...
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyToClipboard(
                                request.appointmentId,
                                request._id,
                                "appointmentId"
                              );
                            }}
                            className="ml-1 p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Copy Appointment ID"
                          >
                            <FiCopy
                              className={`text-xs ${
                                copiedField?.id === request._id &&
                                copiedField?.type === "appointmentId"
                                  ? "text-green-500"
                                  : "text-gray-400"
                              }`}
                            />
                          </button>
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
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Card Details Section */}
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                <FiCreditCard className="mr-2" />
                                Card Details
                              </h4>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-xs text-gray-500 mb-1 block">
                                    Cardholder Name
                                  </label>
                                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                    <p className="font-medium truncate">
                                      {request.cardHolderName || "N/A"}
                                    </p>
                                    <button
                                      onClick={() =>
                                        handleCopyToClipboard(
                                          request.cardHolderName,
                                          request._id,
                                          "fullName"
                                        )
                                      }
                                      className="ml-2 p-1 hover:bg-gray-200 rounded flex-shrink-0"
                                      title="Copy cardholder name"
                                    >
                                      <FiCopy
                                        className={`text-sm ${
                                          copiedField?.id === request._id &&
                                          copiedField?.type === "fullName"
                                            ? "text-green-500"
                                            : "text-gray-400"
                                        }`}
                                      />
                                    </button>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-xs text-gray-500 mb-1 block">
                                    Card Number
                                  </label>
                                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                    <p className="font-mono font-medium">
                                      {showFullCardNumber(request.cardNumber)}
                                    </p>
                                    <button
                                      onClick={() =>
                                        handleCopyToClipboard(
                                          request.cardNumber.replace(/\s/g, ""),
                                          request._id,
                                          "fullCard"
                                        )
                                      }
                                      className="ml-2 p-1 hover:bg-gray-200 rounded flex-shrink-0"
                                      title="Copy full card number"
                                    >
                                      <FiCopy
                                        className={`text-sm ${
                                          copiedField?.id === request._id &&
                                          copiedField?.type === "fullCard"
                                            ? "text-green-500"
                                            : "text-gray-400"
                                        }`}
                                      />
                                    </button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-xs text-gray-500 mb-1 block">
                                      Expiry Date
                                    </label>
                                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                      <p className="font-medium">
                                        {request.expiryDate || "N/A"}
                                      </p>
                                      <button
                                        onClick={() =>
                                          handleCopyToClipboard(
                                            request.expiryDate,
                                            request._id,
                                            "expiry"
                                          )
                                        }
                                        className="ml-2 p-1 hover:bg-gray-200 rounded flex-shrink-0"
                                        title="Copy expiry date"
                                      >
                                        <FiCopy
                                          className={`text-sm ${
                                            copiedField?.id === request._id &&
                                            copiedField?.type === "expiry"
                                              ? "text-green-500"
                                              : "text-gray-400"
                                          }`}
                                        />
                                      </button>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 mb-1 block">
                                      CVV
                                    </label>
                                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                      <p className="font-medium">
                                        {request.cvv || "N/A"}
                                      </p>
                                      <button
                                        onClick={() =>
                                          handleCopyToClipboard(
                                            request.cvv,
                                            request._id,
                                            "cvv"
                                          )
                                        }
                                        className="ml-2 p-1 hover:bg-gray-200 rounded flex-shrink-0"
                                        title="Copy CVV"
                                      >
                                        <FiCopy
                                          className={`text-sm ${
                                            copiedField?.id === request._id &&
                                            copiedField?.type === "cvv"
                                              ? "text-green-500"
                                              : "text-gray-400"
                                          }`}
                                        />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Timestamps Section */}
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                <FiCalendar className="mr-2" />
                                Timestamps
                              </h4>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-xs text-gray-500 mb-1 block">
                                    Created At
                                  </label>
                                  <div className="bg-gray-50 p-2 rounded">
                                    <p className="text-sm">
                                      {formatDateTime(request.createdAt)}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500 mb-1 block">
                                    Last Updated
                                  </label>
                                  <div className="bg-gray-50 p-2 rounded">
                                    <p className="text-sm">
                                      {formatDateTime(request.updatedAt)}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500 mb-1 block">
                                    Status
                                  </label>
                                  <div className="flex items-center">
                                    <span
                                      className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(
                                        request.status
                                      )}`}
                                    >
                                      {getStatusText(request.status)}
                                    </span>
                                    <span className="ml-2 text-sm text-gray-500">
                                      {request.status === "pending"
                                        ? "Waiting for action"
                                        : `Processed on ${formatDate(
                                            request.updatedAt
                                          )}`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Additional Info */}
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                              <FiUser className="mr-2" />
                              Additional Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">
                                  Appointment Type
                                </label>
                                <div className="flex items-center">
                                  <span
                                    className={`px-3 py-1 text-sm rounded-full border ${
                                      request.appointmentType === "doctor"
                                        ? "bg-blue-100 text-blue-800 border-blue-200"
                                        : "bg-purple-100 text-purple-800 border-purple-200"
                                    }`}
                                  >
                                    {request.appointmentType}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">
                                  Request ID
                                </label>
                                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                  <p className="font-mono text-sm truncate">
                                    {request._id}
                                  </p>
                                  <button
                                    onClick={() =>
                                      handleCopyToClipboard(
                                        request._id,
                                        request._id,
                                        "requestId"
                                      )
                                    }
                                    className="ml-2 p-1 hover:bg-gray-200 rounded flex-shrink-0"
                                    title="Copy Request ID"
                                  >
                                    <FiCopy
                                      className={`text-sm ${
                                        copiedField?.id === request._id &&
                                        copiedField?.type === "requestId"
                                          ? "text-green-500"
                                          : "text-gray-400"
                                      }`}
                                    />
                                  </button>
                                </div>
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
