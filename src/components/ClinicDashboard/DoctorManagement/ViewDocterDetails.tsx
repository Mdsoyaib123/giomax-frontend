import React from "react";
import { X, FileText, Edit } from "lucide-react";
import { DoctorData } from "@/redux/types/doctorType";
import { useGetSingleDoctorAppointmentByIdQuery } from "@/redux/features/doctorAppoinment/doctorAppoinmentApi";
import { skipToken } from "@reduxjs/toolkit/query";

// --- Interfaces ---
interface Appointment {
  dateAndTime: string;
  patientName: string;
  serviceType: "Clinic Visit" | "Both" | "Online";
  status: "Completed" | "Upcoming" | "Cancelled";
}

interface ViewDoctorDetailsProps {
  doctor: DoctorData;
  onClose: () => void;
}

// --- Status Badge Helper ---
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let colorClasses = "";
  switch (status) {
    case "completed":
      colorClasses = "bg-green-100 text-green-700";
      break;
    case "confirmed":
      colorClasses = "bg-green-100 text-green-700";
      break;
    case "upcoming":
      colorClasses = "bg-blue-100 text-blue-700";
      break;
    case "cancelled":
      colorClasses = "bg-red-100 text-red-700";
      break;
    case "pending":
      colorClasses = "bg-red-100 text-red-700";
      break;
    default:
      colorClasses = "bg-gray-100 text-gray-700";
  }
  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${colorClasses}`}
    >
      {status}
    </span>
  );
};

// --- Main Component: ViewDoctorDetails ---
const ViewDoctorDetails: React.FC<ViewDoctorDetailsProps> = ({
  doctor,
  onClose,
}) => {
  // Helper to render the main information fields
  const InfoField: React.FC<{
    label: string;
    value: string;
    icon?: React.ReactNode;
  }> = ({ label, value, icon }) => (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          readOnly
          disabled
          className="w-full px-4 py-3 border border-gray-100 rounded-lg bg-gray-50 text-gray-900 text-sm disabled:opacity-100 disabled:cursor-default"
        />
        {icon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
  console.log(doctor);
  const handleEdit = () => {
    console.log("Edit clicked for doctor:", doctor.userId);
    // This would typically open the edit modal
  };
  const { data: appointments } = useGetSingleDoctorAppointmentByIdQuery(
    doctor._id ?? skipToken
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-inter">
      <div className="bg-white w-[1100px] h-[1446px] rounded-[8px] max-w-4xl relative shadow-2xl border border-gray-200 transform transition-all max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Doctor Details</h2>
            <p className="text-sm text-gray-500 mt-1">
              Complete information about this Details
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-4 p-1 rounded-full hover:bg-gray-50"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area (Scrollable) */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {/* Basic Info Grid (Responsive 2-column) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoField
              label="Doctor Name"
              value={doctor?.userId?.fullName || "Not Set"}
            />
            <InfoField
              label="Email Address"
              value={doctor?.userId?.email || "Not set"}
            />
            <InfoField
              label="Specialty"
              value={doctor?.professionalInformation?.speciality || "not set"}
            />
            <InfoField
              label="Service Type"
              value={doctor?.serviceType || "not set"}
            />
            <InfoField label="Phone Number" value={doctor?.phoneNumber || ""} />
            <InfoField
              label="License Number"
              value={doctor?.licenseNumber || "not set"}
            />
          </div>

          {/* Availability & Working Hour */}
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">
              Availability
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Availability Days */}
              <div className="flex flex-wrap gap-2 py-3">
                {doctor?.availabilityScheduleDays?.map((day) => (
                  <span
                    key={day}
                    className="px-3 py-3 text-sm font-medium text-blue-700 capitalize bg-[#EFF6FF] border border-[#BEDBFF] rounded-md"
                  >
                    {day}
                  </span>
                ))}
              </div>
              {/* Working Hour */}
              <InfoField
                label="Working Hour"
                value={
                  (doctor?.workingHour &&
                    `${doctor?.workingHour?.startTime} - ${doctor?.workingHour?.endTime}`) ||
                  "not set"
                }
              />
            </div>
          </div>

          {/* Verification Documents */}
          <div className="pt-2">
            <h3 className="text-base font-bold text-gray-900 mb-3">
              Verification Documents
            </h3>
            <div className="space-y-3">
              {/* Medical License */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 text-gray-700">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">Medical License</span>
                </div>
                <button className="text-blue-600 text-sm font-medium hover:underline transition">
                  View Document
                </button>
              </div>
              {/* ID Verification */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 text-gray-700">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">ID Verification</span>
                </div>
                <button className="text-blue-600 text-sm font-medium hover:underline transition">
                  View Document
                </button>
              </div>
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="pt-2">
            <h3 className="text-base font-bold text-gray-900 mb-3">
              Recent Appointments
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-x-auto">
              <table className="min-w-[700px] w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Patient Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Service Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {appointments?.data.map((appt, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {appt.prefarenceDate}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {appt.prefarenceTime}
                      </td>
                      <td className="px-4 py-3 text-sm text-blue-600">
                        <span className="inline-block px-2 py-0.5 bg-blue-50 rounded-md text-xs font-medium">
                          {appt.serviceType}
                        </span>
                      </td>
                      <td className="px-4 py-3 capitalize">
                        <StatusBadge status={appt.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer/Action Buttons */}
        <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 bg-white w-full">
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 cursor-pointer text-sm font-semibold w-full sm:w-[493px] h-[56px] rounded-[6px] text-gray-700 bg-[#EFF4FF] hover:bg-gray-200 transition-colors"
          >
            Close
          </button>

          {/* Edit Button */}
          <button
            type="button"
            onClick={handleEdit}
            className="px-3 py-2 cursor-pointer text-sm font-semibold w-full sm:w-[493px] h-[56px] rounded-[6px] text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/30 flex items-center justify-center gap-2 transition-colors"
          >
            <Edit className="w-4 h-4 text-white" />
            Edit Doctor Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDoctorDetails;

// import React, { useState } from "react";
// import { X, FileText, Edit } from "lucide-react";

// // --- Mock Data Interfaces ---
// interface Appointment {
//   dateAndTime: string;
//   patientName: string;
//   serviceType: "Clinic Visit" | "Both" | "Online";
//   status: "Completed" | "Upcoming" | "Cancelled";
// }

// interface Doctor {
//   name: string;
//   email: string;
//   specialty: string;
//   serviceType: string;
//   phone: string;
//   licenseNumber: string;
//   workingHour: string;
//   availability: string[];
// }

// // --- Mock Data ---
// const mockDoctor: Doctor = {
//   name: "Dr. David Giorgadze",
//   email: "david.g@gmail.com",
//   specialty: "General Practitioner",
//   serviceType: "Both (Online & Clinic Visit)",
//   phone: "+995 595 123 456",
//   licenseNumber: "MED-001-2024",
//   workingHour: "10.00 AM - 05.00 PM",
//   availability: [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ],
// };

// const mockAppointments: Appointment[] = [
//   {
//     dateAndTime: "25/10/2025 - 10:20 AM",
//     patientName: "Dr. Mike Shinoda",
//     serviceType: "Clinic Visit",
//     status: "Completed",
//   },
//   {
//     dateAndTime: "25/10/2025 - 10:20 AM",
//     patientName: "Dr. Emily Rodriguez",
//     serviceType: "Clinic Visit",
//     status: "Completed",
//   },
//   {
//     dateAndTime: "25/10/2025 - 10:20 AM",
//     patientName: "Dr. Lisa Anderson",
//     serviceType: "Clinic Visit",
//     status: "Completed",
//   },
//   {
//     dateAndTime: "25/10/2025 - 10:20 AM",
//     patientName: "Dr. Michael Chan",
//     serviceType: "Both",
//     status: "Completed",
//   },
//   {
//     dateAndTime: "25/10/2025 - 10:20 AM",
//     patientName: "Dr. Sarah Johnson",
//     serviceType: "Clinic Visit",
//     status: "Upcoming",
//   },
// ];

// // --- Status Badge Helper ---
// const StatusBadge: React.FC<{ status: Appointment["status"] }> = ({
//   status,
// }) => {
//   let colorClasses = "";
//   switch (status) {
//     case "Completed":
//       colorClasses = "bg-green-100 text-green-700";
//       break;
//     case "Upcoming":
//       colorClasses = "bg-blue-100 text-blue-700";
//       break;
//     case "Cancelled":
//       colorClasses = "bg-red-100 text-red-700";
//       break;
//     default:
//       colorClasses = "bg-gray-100 text-gray-700";
//   }
//   return (
//     <span
//       className={`px-3 py-1 text-xs font-medium rounded-full ${colorClasses}`}
//     >
//       {status}
//     </span>
//   );
// };

// // --- Main Component: DoctorDetailsView (Modal Content) ---
// const DoctorDetailsView: React.FC<{
//   doctor: Doctor;
//   appointments: Appointment[];
//   onClose: () => void;
//   onEdit: () => void;
// }> = ({ doctor, appointments, onClose, onEdit }) => {
//   // Helper to render the main information fields
//   const InfoField: React.FC<{
//     label: string;
//     value: string;
//     icon?: React.ReactNode;
//   }> = ({ label, value, icon }) => (
//     <div className="w-full">
//       <label className="block text-sm font-semibold text-gray-700 mb-1">
//         {label}
//       </label>
//       <div className="relative">
//         <input
//           type="text"
//           value={value}
//           readOnly
//           disabled
//           className="w-full px-4 py-3 border border-gray-100 rounded-lg bg-gray-50 text-gray-900 text-sm disabled:opacity-100 disabled:cursor-default"
//         />
//         {icon && (
//           <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//             {icon}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     // The modal overlay container
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-inter ">
//       <div className="bg-white w-[1100px] h-[1446px] rounded-[8px]   max-w-4xl relative shadow-2xl border border-gray-200 transform transition-all max-h-[95vh] overflow-hidden flex flex-col">
//         {/* Header */}
//         <div className="flex items-start justify-between p-6 border-b border-gray-100 flex-shrink-0">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900">Doctor Details</h2>
//             <p className="text-sm text-gray-500 mt-1">
//               Complete information about this Details
//             </p>
//           </div>
//           {/* Close button in header - uses onClose prop to close the modal */}
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors ml-4 p-1 rounded-full hover:bg-gray-50"
//             aria-label="Close"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Content Area (Scrollable) */}
//         <div className="flex-grow overflow-y-auto p-6 space-y-6">
//           {/* Basic Info Grid (Responsive 2-column) */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <InfoField label="Doctor Name" value={doctor.name} />
//             <InfoField label="Email Address" value={doctor.email} />
//             <InfoField label="Specialty" value={doctor.specialty} />
//             <InfoField label="Service Type" value={doctor.serviceType} />
//             <InfoField label="Phone Number" value={doctor.phone} />
//             <InfoField label="License Number" value={doctor.licenseNumber} />
//           </div>

//           {/* Availability & Working Hour */}
//           <div>
//             <label className="block text-base font-bold text-gray-900 mb-2">
//               Availability
//             </label>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Availability Days */}
//               <div className="flex flex-wrap gap-2 py-3">
//                 {doctor.availability.map((day) => (
//                   <span
//                     key={day}
//                     className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md"
//                   >
//                     {day}
//                   </span>
//                 ))}
//               </div>
//               {/* Working Hour */}
//               <InfoField label="Working Hour" value={doctor.workingHour} />
//             </div>
//           </div>

//           {/* Verification Documents */}
//           <div className="pt-2">
//             <h3 className="text-base font-bold text-gray-900 mb-3">
//               Verification Documents
//             </h3>
//             <div className="space-y-3">
//               {/* Medical License */}
//               <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
//                 <div className="flex items-center gap-3 text-gray-700">
//                   <FileText className="w-5 h-5 text-gray-500" />
//                   <span className="text-sm font-medium">Medical License</span>
//                 </div>
//                 <button className="text-blue-600 text-sm font-medium hover:underline transition">
//                   View Document
//                 </button>
//               </div>
//               {/* ID Verification */}
//               <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
//                 <div className="flex items-center gap-3 text-gray-700">
//                   <FileText className="w-5 h-5 text-gray-500" />
//                   <span className="text-sm font-medium">ID Verification</span>
//                 </div>
//                 <button className="text-blue-600 text-sm font-medium hover:underline transition">
//                   View Document
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Recent Appointments */}
//           <div className="pt-2">
//             <h3 className="text-base font-bold text-gray-900 mb-3">
//               Recent Appointments
//             </h3>
//             <div className="border border-gray-200 rounded-lg overflow-x-auto">
//               <table className="min-w-[700px] w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
//                       Date & Time
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
//                       Patient Name
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
//                       Service Type
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
//                       Status
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-100">
//                   {appointments.map((appt, index) => (
//                     <tr key={index} className="hover:bg-gray-50 transition">
//                       <td className="px-4 py-3 text-sm text-gray-900">
//                         {appt.dateAndTime}
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-700">
//                         {appt.patientName}
//                       </td>
//                       <td className="px-4 py-3 text-sm text-blue-600">
//                         <span className="inline-block px-2 py-0.5 bg-blue-50 rounded-md text-xs font-medium">
//                           {appt.serviceType}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <StatusBadge status={appt.status} />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* Footer/Action Buttons */}
//         <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 bg-white w-full">
//           {/* Close Button */}
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-3 py-2  cursor-pointer text-sm font-semibold w-full sm:w-[493px] h-[56px] rounded-[6px] text-gray-700  bg-[#EFF4FF] hover:bg-gray-200 transition-colors"
//           >
//             Close
//           </button>

//           {/* Edit Button */}
//           <button
//             type="button"
//             onClick={onEdit}
//             className="px-3 py-2 cursor-pointer text-sm font-semibold w-full sm:w-[493px] h-[56px] rounded-[6px] text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/30 flex items-center justify-center gap-2 transition-colors"
//           >
//             <Edit className="w-4 h-4 text-white" />
//             Edit Doctor Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const App = () => {
//   const [isModalOpen, setIsModalOpen] = useState(true);
//   const handleClose = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="bg-gray-100 p-8 h-screen w-full flex items-center justify-center font-inter">
//       {/* Conditionally render the modal based on state */}
//       {isModalOpen && (
//         <DoctorDetailsView
//           doctor={mockDoctor}
//           appointments={mockAppointments}
//           onClose={handleClose} // This closes the modal/page
//           onEdit={() => console.log("Edit clicked - placeholder action")}
//         />
//       )}
//     </div>
//   );
// };

// export default App;
