/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { X, CheckCircle, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useGetAllWithdrawRequestsQuery,
  useMarkAsPaidMutation,
  useRejectWithdrawRequestMutation,
} from "@/redux/features/admin/payment/adminPaymentApi";
import {
  setSelectedRequest,
  setCurrentPage,
} from "@/redux/features/admin/payment/adminPaymentSlice";
import { WithdrawRequest } from "@/redux/types/admin/adminPaymentTypes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";

const PaymentTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filters, currentPage, itemsPerPage, selectedRequest } =
    useAppSelector((state) => state.adminPayment);

  // API Queries
  const [statusFilter, setStatusFilter] = useState("ALL");

  // API Queries
  const {
    data: withdrawRequests,
    isLoading,
    isError,
    refetch,
  } = useGetAllWithdrawRequestsQuery({
    page: currentPage,
    limit: itemsPerPage,
    status: undefined, // Client-side filtering: fetch all statuses
    ownerType: filters.ownerType === "ALL" ? undefined : filters.ownerType,
    search: filters.search || undefined,
  });

  // Client-side filtering logic
  const filteredRequests =  withdrawRequests?.data?.filter((request) => {
    if (statusFilter === "ALL") return true;
    return request.status === statusFilter;
  }) || [];

  // const { data: statsData } = useGetPaymentStatsQuery();
  const [markAsPaid] = useMarkAsPaidMutation();
  const [rejectWithdrawRequest] = useRejectWithdrawRequestMutation();

  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate total pages
  const totalRequests = withdrawRequests?.data.length || 0;
  const totalPages = Math.ceil(totalRequests / itemsPerPage);

  // Get owner type display name
  const getOwnerTypeDisplay = (type: string) => {
    switch (type) {
      case "SOLO_NURSE":
        return "Solo Nurse";
      case "CLINIC":
        return "Clinic";
      case "SOLO_DOCTOR":
        return "Solo Doctor";
      default:
        return type;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "PAID":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Paid
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Rejected
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Handle status update
  const handleStatusUpdate = async (
    id: string,
    action: "PAID" | "REJECTED"
  ) => {
    try {
      setIsProcessing(true);
      if (action === "PAID") {
        await markAsPaid(id).unwrap();
      } else {
        await rejectWithdrawRequest(id).unwrap();
      }
      // Close modal after successful update
      dispatch(setSelectedRequest(null));
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format amount with Lari symbol (₾) before the amount
  const formatAmount = (amount: number) => {
    // Format with 2 decimal places
    const formatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));

    // Add negative sign if needed and prefix with ₾
    const sign = amount < 0 ? "-" : "";
    return `${sign}₾${formatted}`;
  };

  // Get wallet balance from request
  const getWalletBalance = (request: WithdrawRequest) => {
    if (typeof request.walletId === "object" && request.walletId !== null) {
      return request.walletId.balance;
    }
    return 0; // Return 0 instead of "N/A" to keep it as number
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Failed to load withdraw requests</p>
        <Button onClick={refetch} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-xl border border-[#DBE0E5] bg-white shadow-sm p-6">
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-[#343A40]">
              Withdraw History
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Status Filter */}
              <div className="w-full sm:w-[180px]">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full h-10 cursor-pointer border border-[#B3B3B3] rounded-xl px-5 py-2.5 bg-[#FCFCFC] text-[#484848] text-sm">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[#B3B3B3] rounded-md shadow-md">
                    <SelectGroup>
                      <SelectItem
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                        value="ALL"
                      >
                        All Status
                      </SelectItem>
                      <SelectItem
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                        value="PENDING"
                      >
                        Pending
                      </SelectItem>
                      <SelectItem
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                        value="PAID"
                      >
                        Paid
                      </SelectItem>
                      <SelectItem
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded"
                        value="REJECTED"
                      >
                        Rejected
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="p-5 border border-[#E4E4E4] rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4  gap-5">
            <div className="xl:col-span-4 w-full">
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-[800px] w-full text-sm">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700 whitespace-nowrap">
                        Request ID
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">
                        Owner
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
                    {filteredRequests.map((request) => (
                      <tr key={request._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-mono text-sm">
                          {request._id.slice(-8)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {request.ownerId.slice(-8)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-blue-600 font-medium">
                            {getOwnerTypeDisplay(request.ownerType)}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                          {formatAmount(request.amount)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {formatDate(request.createdAt)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(request.status)}
                        </td>

                        <td className="px-6 py-4 text-center space-x-2">
                          <Button
                            onClick={() =>
                              dispatch(setSelectedRequest(request))
                            }
                            variant="outline"
                            size="sm"
                            className="px-4 py-2 rounded-lg bg-[#1A73E8] whitespace-nowrap text-white text-sm font-medium hover:bg-[#165FC2] inline-flex items-center gap-2 cursor-pointer"
                          >
                            <FaEye className="text-sm" /> View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {(!withdrawRequests?.data ||
                withdrawRequests.data.length === 0) && (
                <div className="text-center py-10 text-gray-500">
                  No withdraw requests found
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Pagination */}
        {totalRequests > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">
                {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalRequests)}
              </span>{" "}
              of <span className="font-semibold">{totalRequests} entries</span>
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </Button>

              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              {totalPages > 3 && currentPage < totalPages - 1 && (
                <span className="px-2">...</span>
              )}

              {totalPages > 3 && currentPage < totalPages && (
                <Button
                  className=" border border-[#cacdd4]"
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </Button>
              )}

              <Button
                className=" border border-[#cacdd4]"
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW DETAILS MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Withdraw Request Details
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Complete information about this transaction
                  </p>
                </div>
                <button
                  onClick={() => dispatch(setSelectedRequest(null))}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Name
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-medium">
                    {selectedRequest.ownerUserId?.fullName || "N/A"}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Email
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-medium">
                    {selectedRequest.ownerUserId?.email || "N/A"}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Role
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    {getOwnerTypeDisplay(selectedRequest.ownerType)}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Amount
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-semibold">
                    {formatAmount(selectedRequest.amount)}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Created Date
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Status
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Wallet Balance
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    {formatAmount(getWalletBalance(selectedRequest) as number)}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Last Updated
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    {new Date(selectedRequest.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Action Buttons for Pending Requests */}
              {selectedRequest.status === "PENDING" && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleStatusUpdate(selectedRequest._id, "REJECTED")
                      }
                      disabled={isProcessing}
                      className="flex items-center gap-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Request
                    </Button>
                    <Button
                      onClick={() =>
                        handleStatusUpdate(selectedRequest._id, "PAID")
                      }
                      disabled={isProcessing}
                      className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {isProcessing ? "Processing..." : "Approve & Pay"}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Approving will mark this request as paid and process the
                    payment
                  </p>
                </div>
              )}

              {/* Info for non-pending requests */}
              {selectedRequest.status !== "PENDING" && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    This request has already been{" "}
                    <span className="font-semibold">
                      {selectedRequest.status.toLowerCase()}
                    </span>
                    {selectedRequest.status === "PAID" && " on "}
                    {selectedRequest.status === "PAID" &&
                      new Date(selectedRequest.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTable;
