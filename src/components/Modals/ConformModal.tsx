/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useDeleteClinicMutation } from "@/redux/features/admin/clinic/clinicManagementApi";
import { Trash } from "lucide-react"
import { toast } from "sonner";
interface Props {
  title: string;
    description: string;
    id: string;
 }

const ConformModal = ({ title, description, id }: Props) => {
    const [deleteClinic] = useDeleteClinicMutation();
    const handleDelete = async () => {
       try {
           await deleteClinic(id).unwrap();
           toast.success("Clinic deleted successfully");
       } catch (error: any) {
           toast.error(error.data?.message || "Failed to delete clinic");
       }
    }
  return (
    <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button className="flex items-center gap-1 text-sm bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1.5 rounded-md transition" variant="destructive"><Trash className="text-white text-sm  size-4" />Delete</Button>
    </AlertDialogTrigger>
    <AlertDialogContent className="bg-white border-none">
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>
          {description}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-3 py-1.5 rounded-md transition">Cancel</AlertDialogCancel>
        <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1.5 rounded-md transition" onClick={handleDelete}>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}

export default ConformModal
