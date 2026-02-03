/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  useAcceptRefundRequestMutation,
  useGetAllrefundRequestsQuery,
} from "@/redux/features/admin/payment/adminPaymentApi";
import {
  FiCopy,
  FiEye,
} from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Interfaces
interface UserInfo {
  _id: string;
  fullName: string;
  email: string;
  profileImage: string;
}

interface PatientId {
  _id: string;
  userId: UserInfo;
  bloodGroup: string;
  age: number;
  gender: string;
  phoneNumber: string;
}

interface PaymentId {
  _id: string;
  amount: number;
  status: string;
  refundStatus: string;
}

interface RefundRequest {
  _id: string;
  paymentId: PaymentId;
  appointmentId: string;
  patientId: PatientId;
  appointmentType: string;
  reason: string;
  status: string;
  createdAt: string;
}

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
  
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [updateRefundRequest, { isLoading: isUpdating }] = useAcceptRefundRequestMutation();

  const refundData = (response as RefundResponse)?.data || [];

  const handleOpenDetails = (request: RefundRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (status: "APPROVED" | "REJECTED") => {
    if (!selectedRequest) return;

    try {
      const resp = await updateRefundRequest({
        id: selectedRequest._id,
        data: { status: status, appointmentType: selectedRequest.appointmentType },
      }).unwrap();

      if (resp.success) {
        toast.success(resp.message || `Refund ${status} successfully!`);
        setIsModalOpen(false);
        refetch();
      } else {
        toast.error(resp.message || `Failed to ${status} refund`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "approved":
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Approved</span>;
      case "rejected":
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Rejected</span>;
      case "pending":
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">Pending</span>;
      default:
        return <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalPages = Math.ceil(refundData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = refundData.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading refund requests. Please try again.
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="rounded-xl border border-[#DBE0E5] bg-white shadow-sm p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-[#343A40]">
            Refund Requests
          </h2>
        </div>

        {/* Table Wrapper */}
        <div className="p-5 border border-[#E4E4E4] rounded-lg">
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-[1000px] w-full text-sm">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">Patient</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">Phone</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">Payment ID</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">Status</th>
                  <th className="px-6 py-4 text-center font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">
                      No refund requests found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-gray-100">
                            <AvatarImage src={request.patientId?.userId?.profileImage} />
                            <AvatarFallback>{request.patientId?.userId?.fullName?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-gray-900">{request.patientId?.userId?.fullName || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{request.patientId?.userId?.email || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{request.patientId?.phoneNumber || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                        {request.paymentId?._id?.substring(0, 12)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(request.status)}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleOpenDetails(request)}
                          className="inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-md bg-[#2E6FF3] text-white text-xs hover:bg-[#1B54D3] transition"
                        >
                          <FiEye className="text-sm" /> View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">{Math.min(startIndex + itemsPerPage, refundData.length)}</span> of{" "}
              <span className="font-medium">{refundData.length}</span> entries
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                }`}
              >
                <IoIosArrowBack /> Prev
              </button>
              <div className="min-w-[50px] text-center border px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 bg-gray-50">
                {currentPage} / {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm ${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                }`}
              >
                Next <IoIosArrowForward />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-white rounded-lg border border-gray-300">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center justify-between">
              Refund Request Details
              {selectedRequest && getStatusBadge(selectedRequest.status)}
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Patient Info Card */}
                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedRequest.patientId?.userId?.profileImage} />
                      <AvatarFallback>{selectedRequest.patientId?.userId?.fullName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs text-gray-500">Patient</p>
                      <p className="font-medium">{selectedRequest.patientId?.userId?.fullName}</p>
                    </div>
                 </div>

                 {/* Payment Info Card */}
                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-bold">$</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="font-medium text-green-600">${selectedRequest.paymentId?.amount}</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-3">
                 <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Reason for Refund</p>
                    <p className="text-sm mt-1">{selectedRequest.reason}</p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                       <p className="text-xs text-gray-500">Appointment Type</p>
                       <p className="font-medium capitalize">{selectedRequest.appointmentType?.toLowerCase()}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                       <p className="text-xs text-gray-500">Date</p>
                       <p className="font-medium">{formatDate(selectedRequest.createdAt)}</p>
                    </div>
                 </div>

                 <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Payment ID</p>
                    <div className="flex items-center justify-between">
                       <p className="font-mono text-xs">{selectedRequest.paymentId?._id}</p>
                       <Button variant="ghost" size="sm" onClick={() => {
                          navigator.clipboard.writeText(selectedRequest.paymentId?._id);
                          toast.success("ID Copied");
                       }}>
                          <FiCopy />
                       </Button>
                    </div>
                 </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-3 mt-6 sm:justify-start">
            {selectedRequest?.status.toUpperCase() === "PENDING" ? (
              <>
                 <Button
                  onClick={() => handleUpdateStatus("APPROVED")}
                  disabled={isUpdating}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg"
                >
                  Approve Refund
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleUpdateStatus("REJECTED")}
                  disabled={isUpdating}
                  className="flex-1 border-gray-300 rounded-lg"
                >
                  Reject
                </Button>
              </>
            ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full border-gray-300 rounded-lg"
                >
                  Close
                </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
