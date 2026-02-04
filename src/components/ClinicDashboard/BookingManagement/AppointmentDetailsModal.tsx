import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDoctorAppointmentStatusUpdateMutation } from "@/redux/features/doctorAppoinment/doctorAppoinmentApi";
import { Appointment } from "@/redux/features/doctorAppoinment/getAllAppointmet.type";

import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { useState } from "react";
import { X, ZoomIn } from "lucide-react";

interface AppointmentDetailsProps {
  appointment: Appointment | null;
  open: boolean;
  onClose: () => void;
}

export function AppointmentDetailsModal({
  appointment,
  open,
  onClose,
}: AppointmentDetailsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [doctorAppointmentStatusUpdate, { isLoading }] =
    useDoctorAppointmentStatusUpdateMutation();
  if (!appointment) return null;
  const handleStatusChange = async (
    appointmentId: string,
    newStatus: string
  ) => {
    try {
      const result = await doctorAppointmentStatusUpdate({
        id: appointmentId,
        status: newStatus,
      }).unwrap();
      toast.success("Status updated successfully!");
      console.log("Status updated successfully:", result);
      onClose();
    } catch (error) {
      toast.error("Failed to update status!");
      console.error("Failed to update status:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[700px] w-[95vw] md:w-full border-none p-0 bg-white overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="px-4 sm:px-9 pt-6 pb-4 border-b flex-none">
          <div className="flex items-center gap-3.5 mb-1">
            <DialogTitle className="text-black text-2xl font-semibold">
              Appointment Details
            </DialogTitle>
            <span
              className={`px-3 py-1 rounded-full text-xs capitalize font-medium ${
                appointment.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : appointment.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : appointment.status === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {appointment.status}
            </span>
          </div>
          <DialogDescription className="text-gray-500 text-sm">
            View and manage appointment information
          </DialogDescription>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-9 py-6 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Patient Name</label>
              <input
                readOnly
                value={appointment?.patientId?.userId?.fullName ?? "N/A"}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Doctor Name</label>
              <input
                readOnly
                value={appointment?.doctorId?.userId?.fullName ?? "N/A"}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Service Name</label>
              <input
                readOnly
                value={appointment.reasonForVisit ?? "N/A"}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none capitalize"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date & Time</label>
              <input
                readOnly
                value={`${appointment.prefarenceDate} ${appointment.prefarenceTime}`}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">Service Type</label>
              <input
                readOnly
                value={appointment.serviceType || "N/A"}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">Visiting Type</label>
              <input
                readOnly
                value={appointment.visitingType || "N/A"}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input
                readOnly
                value={appointment?.patientId?.phoneNumber ?? "N/A"}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">National ID</label>
              <input
                readOnly
                value={appointment?.patientId?.nationalIdNumber ?? "N/A"}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <input
                readOnly
                value={appointment?.patientId?.gender ?? "N/A"}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none capitalize"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Blood Group</label>
              <input
                readOnly
                value={appointment?.patientId?.bloodGroup ?? "N/A"}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Age</label>
              <input
                readOnly
                value={appointment?.patientId?.age ?? "N/A"}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* NID Images Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Patient NID </h3>
            <div className="flex flex-wrap gap-4 pb-2">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-tight">NID Front</label>
                <div 
                  onClick={() => appointment?.patientId?.nidFrontImageUrl && setSelectedImage(appointment.patientId.nidFrontImageUrl)}
                  className={`relative group overflow-hidden rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center w-20 h-20 sm:w-40 sm:h-20 ${appointment?.patientId?.nidFrontImageUrl ? 'cursor-zoom-in' : 'cursor-default'}`}
                >
                  {appointment?.patientId?.nidFrontImageUrl ? (
                    <>
                      <img 
                        src={appointment.patientId.nidFrontImageUrl} 
                        alt="NID Front" 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ZoomIn className="text-white w-4 h-4" />
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400 text-[8px] text-center px-1">No front image</div>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-tight">NID Back</label>
                <div 
                  onClick={() => appointment?.patientId?.nidBackImageUrl && setSelectedImage(appointment.patientId.nidBackImageUrl)}
                  className={`relative group overflow-hidden rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center w-20 h-20 sm:w-40 sm:h-20 ${appointment?.patientId?.nidBackImageUrl ? 'cursor-zoom-in' : 'cursor-default'}`}
                >
                  {appointment?.patientId?.nidBackImageUrl ? (
                    <>
                      <img 
                        src={appointment.patientId.nidBackImageUrl} 
                        alt="NID Back" 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ZoomIn className="text-white w-4 h-4" />
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400 text-[8px] text-center px-1">No back image</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Screen Image Lightbox */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-100 bg-white/15 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedImage(null)}
          >
            <div 
              className="relative w-full max-w-2xl aspect-[1.586/1] bg-white rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors p-2 rounded-full bg-black/50 hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                <X className="w-5 h-5" />
              </button>
              <img 
                src={selectedImage} 
                alt="NID Full Screen" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Footer - Fixed */}
        <DialogFooter className="px-4 sm:px-9 py-4 border-t flex-none bg-gray-50/50 flex flex-col sm:flex-row gap-3">
          <DialogClose asChild>
            <Button
              className="flex-1 text-[#2E6FF3] border border-[#2E6FF3] bg-white hover:bg-gray-50"
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
          </DialogClose>

          {appointment.status !== "cancelled" &&
            appointment.status !== "completed" && (
              <>
                <Button
                  type="button"
                  onClick={() =>
                    handleStatusChange(appointment._id, "cancelled")
                  }
                  variant={"destructive"}
                  className="flex-1 bg-[#FFEAEB] text-[#F04438] hover:bg-[#F04438] hover:text-white border-none shadow-none"
                >
                  Cancel Appointment
                </Button>

                {appointment.status === "pending" && (
                  <Button
                    onClick={() =>
                      handleStatusChange(appointment._id, "confirmed")
                    }
                    type="button"
                    className="flex-1 text-white bg-[#1B9268] hover:bg-[#157953]"
                  >
                    {isLoading ? "Loading..." : "Confirm Appointment"}
                  </Button>
                )}
              </>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
