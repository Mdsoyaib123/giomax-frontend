import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Appointment } from "@/redux/features/doctorAppoinment/getAllAppointmet.type";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
interface AppointmentDetailsProps {
  appointment: Appointment;
  children: React.ReactNode;
}

export function AppointmentDetailsModal({
  appointment,
  children,
}: AppointmentDetailsProps) {
  console.log("apparent", appointment);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>{children}</button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px] w-full border-none px-9 bg-white focus:border-none">
        <DialogTitle className="text-black text-2xl font-semibold">
          Appointment Details
        </DialogTitle>
        <DialogDescription>
          View and manage appointment information
        </DialogDescription>

        <div className="">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date & Time
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="w-full  flex justify-between">
          <DialogClose asChild>
            <Button
              className="flex-1 text-[#2E6FF3] border-none bg-[#EFF4FF]"
              variant="outline"
            >
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={"destructive"}
            className="flex-1 bg-[#FFEAEB] text-[#F04438] hover:bg-[#F04438] hover:text-white"
          >
            Cancel Appointment
          </Button>
          <Button type="submit" className="flex-1 text-white bg-[#1B9268]">
            Approve Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
