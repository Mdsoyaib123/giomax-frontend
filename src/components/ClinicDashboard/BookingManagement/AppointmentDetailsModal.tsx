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
      <DialogContent className="max-w-[700px] w-full border-none px-9 bg-white focus:border-none">
        <div className="flex items-center  gap-3.5 ">
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
        <DialogDescription>
          View and manage appointment information
        </DialogDescription>

        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name
              </label>
              <input
                readOnly
                value={appointment?.patientId?.userId?.fullName ?? "N/A"}
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor Name
              </label>
              <input
                readOnly
                value={appointment?.doctorId?.userId?.fullName ?? "N/A"}
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name
              </label>
              <input
                readOnly
                // value={appointment.serviceName ?? "N/A"}
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date & Time
              </label>
              <input
                readOnly
                value={`${appointment.prefarenceDate} ${appointment.prefarenceTime}`}
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type
              </label>
              <input
                readOnly
                value={appointment.serviceType || "N/A"}
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visiting Type
              </label>
              <input
                readOnly
                value={appointment.visitingType || "N/A"}
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="w-full flex justify-between gap-3">
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
                  className="flex-1 bg-[#FFEAEB] text-[#F04438] hover:bg-[#F04438] hover:text-white"
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
