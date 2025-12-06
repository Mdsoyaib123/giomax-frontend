import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AppointmentDetailsModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer"
          variant="default"
        >
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px] w-full border-none p-1.5 bg-white">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Appointment Details
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                View and manage appointment information
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F9AA00] text-black">
              Pending
            </span>
          </div>
        </div>

        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name
              </label>
              <input
                type="text"
                // value={selectedAppointment.patientName}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor Name
              </label>
              <input
                type="text"
                // value={selectedAppointment.doctorName}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name
              </label>
              <input
                type="text"
                // value={selectedAppointment.service}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date & Time
              </label>
              <input
                type="text"
                // value={`${selectedAppointment.date} - ${selectedAppointment.time}`}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type
              </label>
              <input
                type="text"
                // value={selectedAppointment.visitType}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleClose}
              className="flex-1 py-3 rounded-lg bg-[#EFF4FF] text-[#2E6FF3] hover:bg-[#d2e3ff] font-medium text-sm transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
            //   onClick={handleCancel}
              className="flex-1 py-3 bg-[#FFEAEB] text-[#E9575A] rounded-lg hover:bg-[#ffd5d7] font-medium text-sm transition-colors cursor-pointer"
            >
              Cancel Appointment
            </button>
            <button
            //   onClick={handleApprove}
              className="flex-1 py-3 bg-[#1B9268] text-white rounded-lg hover:bg-[#157a56] font-medium text-sm transition-colors cursor-pointer"
            >
              Approve Appointment
            </button>
          </div> */}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
