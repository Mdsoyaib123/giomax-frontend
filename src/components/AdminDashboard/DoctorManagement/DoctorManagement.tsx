import React, { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
// import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Doctor interface
interface Doctor {
  id: string;
  name: string;
  speciallity: string;
  type: string;
  earnings: string;
  status: string;
  actions?: string;
  email?: string;
  phone?: string;
  age?: string;
  gender?: string;
}

const DoctorManagement: React.FC = () => {
  const navigate = useNavigate();
  // const [openProfile, setOpenProfile] = useState<Doctor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  // const [statusFilter, setStatusFilter] = useState("All Status");
  const itemsPerPage = 9;

  const doctors: Doctor[] = [
    {
      id: "DOC-001",
      name: "Dr. Michael Brown",
      speciallity: "Cardiology",
      type: "Solo Doctor",
      earnings: "$2500.00",
      status: "Pending",
      email: "michael.brown@email.com",
      phone: "123-456-7890",
    },
    {
      id: "DOC-002",
      name: "Dr. Michael Brown",
      speciallity: "Dermatology",
      type: "Clinic",
      earnings: "$2500.00",
      status: "Active",
      email: "michele.brown@email.com",
      phone: "987-654-3210",
    },
    {
      id: "DOC-003",
      name: "Nurse Alina",
      speciallity: "Pediatrics",
      type: "Nurse",
      earnings: "$2500.00",
      status: "Active",
      email: "alina.nurse@email.com",
      phone: "456-789-1230",
    },
    {
      id: "DOC-004",
      name: "Dr. Michael Brown",
      speciallity: "Dermatology",
      type: "Clinic",
      earnings: "$2500.00",
      status: "Active",
      email: "sarah.wilson@email.com",
      phone: "321-654-9870",
    },
    {
      id: "DOC-005",
      name: "Dr. Sarah Wilson",
      speciallity: "Cardiology",
      type: "Solo Doctor",
      earnings: "$2500.00",
      status: "Suspended",
      email: "michael.brown@email.com",
      phone: "123-456-7890",
    },
  ];

  const totalPages = Math.ceil(doctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDoctors = doctors.slice(startIndex, endIndex);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleView = (doctor: Doctor) => {
    navigate("/transaction-details", { state: { doctor } });
  };

  const handleRemove = (id: string) => {
    alert(`Doctor ${id} suspended successfully!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-[#D4F4DD] text-[#06A561]";
      case "Pending":
        return "bg-[#FFF4E5] text-[#FF9800]";
      case "Suspended":
        return "bg-[#FFE5E5] text-[#D32F2F]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Solo Doctor":
        return "text-[#2E6FF3]";
      case "Clinic":
        return "text-[#2E6FF3]";
      case "Nurse":
        return "text-[#2E6FF3]";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#0A0A0A] mb-2">
          Doctor Management
        </h1>
        <p className="text-sm text-gray-600">
          Manage and approve doctor registrations
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-[#E5E7EB] gap-4">
          <h2 className="text-lg font-semibold text-[#0A0A0A]">All Doctors</h2>
          {/* <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm hover:bg-gray-50 transition">
              {statusFilter}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div> */}
        </div>

        {/* Table Container */}
        <div className="p-4 sm:p-6">

          <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4  gap-5">
            <div className="xl:col-span-4 w-full">
  <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#374151]">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#374151]">
                    Speciality
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#374151]">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#374151]">
                    Earnings
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#374151]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-[#374151]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F3F4F6]">
                {currentDoctors.map((doctor, index) => (
                  <tr
                    key={`${doctor.id}-${index}`}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-4 text-sm text-[#0A0A0A] whitespace-nowrap">
                      {doctor.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#6B7280]">
                      {doctor.speciallity}
                    </td>
                    <td
                      className={`px-4 py-4 text-sm font-medium ${getTypeColor(
                        doctor.type
                      )}`}
                    >
                      {doctor.type}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#0A0A0A]">
                      {doctor.earnings}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          doctor.status
                        )}`}
                      >
                        {doctor.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(doctor)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2E6FF3] hover:bg-[#1d5dd8] text-white text-sm rounded-md transition cursor-pointer"
                        >
                          <FaEye className="w-3.5 h-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => handleRemove(doctor.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EF4444] hover:bg-[#dc2626] text-white text-sm rounded-md transition cursor-pointer"
                        >
                          <RiDeleteBinLine className="w-3.5 h-3.5" />
                          Suspend
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </div>
             </div>

        
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-[#E5E7EB] gap-4">
          <p className="text-sm text-[#6B7280]">
            Showing <span className="font-medium text-[#0A0A0A]">{startIndex + 1}</span> to{" "}
            <span className="font-medium text-[#0A0A0A]">{Math.min(endIndex, doctors.length)}</span> of{" "}
            <span className="text-[#2E6FF3] font-medium">{doctors.length} entries</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 border border-[#E5E7EB] rounded-md text-sm transition ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed bg-gray-50"
                  : "hover:bg-gray-50 cursor-pointer"
              }`}
            >
              Prev
            </button>

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1.5 rounded-md text-sm transition cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-[#2E6FF3] text-white"
                      : "border border-[#E5E7EB] hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && (
              <>
                <span className="px-2">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-3 py-1.5 border border-[#E5E7EB] rounded-md text-sm hover:bg-gray-50 transition cursor-pointer"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 border border-[#E5E7EB] rounded-md text-sm transition ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed bg-gray-50"
                  : "hover:bg-gray-50 cursor-pointer"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorManagement;



// import React, { useState } from "react";
// import { RiDeleteBinLine } from "react-icons/ri";
// import { FaEye } from "react-icons/fa";
// import {  ChevronDown } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// // Doctor interface
// interface Doctor {
//   id: string;
//   name: string;
//   speciallity: string;
//   type: string;
//   earnings: string;
//   status: string;
//   actions?: string;
//   email?: string;
//   phone?: string;
//   age?: string;
//   gender?: string;
// }

// const DoctorManagement: React.FC = () => {
//   const navigate = useNavigate();
//   const [openProfile, setOpenProfile] = useState<Doctor | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [statusFilter, setStatusFilter] = useState("All Status");
//   const itemsPerPage = 9;

//   const doctors: Doctor[] = [
//     {
//       id: "DOC-001",
//       name: "Dr. Michael Brown",
//       speciallity: "Cardiology",
//       type: "Solo Doctor",
//       earnings: "$2500.00",
//       status: "Pending",
//       email: "michael.brown@email.com",
//       phone: "123-456-7890",
//     },
//     {
//       id: "DOC-002",
//       name: "Dr. Michael Brown",
//       speciallity: "Dermatology",
//       type: "Clinic",
//       earnings: "$2500.00",
//       status: "Active",
//       email: "michele.brown@email.com",
//       phone: "987-654-3210",
//     },
//     {
//       id: "DOC-003",
//       name: "Nurse Alina",
//       speciallity: "Pediatrics",
//       type: "Nurse",
//       earnings: "$2500.00",
//       status: "Active",
//       email: "alina.nurse@email.com",
//       phone: "456-789-1230",
//     },
//     {
//       id: "DOC-004",
//       name: "Dr. Michael Brown",
//       speciallity: "Dermatology",
//       type: "Clinic",
//       earnings: "$2500.00",
//       status: "Active",
//       email: "sarah.wilson@email.com",
//       phone: "321-654-9870",
//     },
//     {
//       id: "DOC-005",
//       name: "Dr. Sarah Wilson",
//       speciallity: "Cardiology",
//       type: "Solo Doctor",
//       earnings: "$2500.00",
//       status: "Suspended",
//       email: "michael.brown@email.com",
//       phone: "123-456-7890",
//     },
//   ];

//   const totalPages = Math.ceil(doctors.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentDoctors = doctors.slice(startIndex, endIndex);

//   const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
//   const handleNext = () =>
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));

//   const handleView = (doctor: Doctor) => {
//     navigate("/transaction-details", { state: { doctor } });
//   };

//   const handleRemove = (id: string) => {
//     alert(`Doctor ${id} suspended successfully!`);
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Active":
//         return "bg-[#D4F4DD] text-[#06A561]";
//       case "Pending":
//         return "bg-[#FFF4E5] text-[#FF9800]";
//       case "Suspended":
//         return "bg-[#FFE5E5] text-[#D32F2F]";
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   };

//   const getTypeColor = (type: string) => {
//     switch (type) {
//       case "Solo Doctor":
//         return "text-[#2E6FF3]";
//       case "Clinic":
//         return "text-[#2E6FF3]";
//       case "Nurse":
//         return "text-[#2E6FF3]";
//       default:
//         return "text-gray-600";
//     }
//   };

//   return (
//     <div className="">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl sm:text-3xl font-semibold text-[#0A0A0A] mb-2">
//           Doctor Management
//         </h1>
//         <p className="text-sm text-gray-600">
//           Manage and approve doctor registrations
//         </p>
//       </div>

//       {/* Main Card */}
//       <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
//         {/* Card Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-[#E5E7EB] gap-4">
//           <h2 className="text-lg font-semibold text-[#0A0A0A]">All Doctors</h2>
//           <div className="relative">
//             <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm hover:bg-gray-50 transition">
//               {statusFilter}
//               <ChevronDown className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {/* Table Container */}
//         <div className="p-4 sm:p-6">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[800px]">
//               <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-sm font-medium text-[#374151]">
//                     Name
//                   </th>
//                   <th className="px-4 py-3 text-left text-sm font-medium text-[#374151]">
//                     Speciality
//                   </th>
//                   <th className="px-4 py-3 text-left text-sm font-medium text-[#374151]">
//                     Type
//                   </th>
//                   <th className="px-4 py-3 text-left text-sm font-medium text-[#374151]">
//                     Earnings
//                   </th>
//                   <th className="px-4 py-3 text-left text-sm font-medium text-[#374151]">
//                     Status
//                   </th>
//                   <th className="px-4 py-3 text-center text-sm font-medium text-[#374151]">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-[#F3F4F6]">
//                 {currentDoctors.map((doctor, index) => (
//                   <tr
//                     key={`${doctor.id}-${index}`}
//                     className="hover:bg-gray-50 transition"
//                   >
//                     <td className="px-4 py-4 text-sm text-[#0A0A0A]">
//                       {doctor.name}
//                     </td>
//                     <td className="px-4 py-4 text-sm text-[#6B7280]">
//                       {doctor.speciallity}
//                     </td>
//                     <td
//                       className={`px-4 py-4 text-sm font-medium ${getTypeColor(
//                         doctor.type
//                       )}`}
//                     >
//                       {doctor.type}
//                     </td>
//                     <td className="px-4 py-4 text-sm text-[#0A0A0A]">
//                       {doctor.earnings}
//                     </td>
//                     <td className="px-4 py-4">
//                       <span
//                         className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                           doctor.status
//                         )}`}
//                       >
//                         {doctor.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4">
//                       <div className="flex items-center justify-center gap-2">
//                         <button
//                           onClick={() => handleView(doctor)}
//                           className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2E6FF3] hover:bg-[#1d5dd8] text-white text-sm rounded-md transition cursor-pointer"
//                         >
//                           <FaEye className="w-3.5 h-3.5" />
//                           View
//                         </button>
//                         <button
//                           onClick={() => handleRemove(doctor.id)}
//                           className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EF4444] hover:bg-[#dc2626] text-white text-sm rounded-md transition cursor-pointer"
//                         >
//                           <RiDeleteBinLine className="w-3.5 h-3.5" />
//                           Suspend
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination Footer */}
//         <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-[#E5E7EB] gap-4">
//           <p className="text-sm text-[#6B7280]">
//             Showing <span className="font-medium text-[#0A0A0A]">{startIndex + 1}</span> to{" "}
//             <span className="font-medium text-[#0A0A0A]">{Math.min(endIndex, doctors.length)}</span> of{" "}
//             <span className="text-[#2E6FF3] font-medium">{doctors.length} entries</span>
//           </p>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={handlePrev}
//               disabled={currentPage === 1}
//               className={`px-3 py-1.5 border border-[#E5E7EB] rounded-md text-sm transition ${
//                 currentPage === 1
//                   ? "opacity-50 cursor-not-allowed bg-gray-50"
//                   : "hover:bg-gray-50 cursor-pointer"
//               }`}
//             >
//               Prev
//             </button>

//             {[...Array(Math.min(5, totalPages))].map((_, i) => {
//               const pageNum = i + 1;
//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => setCurrentPage(pageNum)}
//                   className={`px-3 py-1.5 rounded-md text-sm transition cursor-pointer ${
//                     currentPage === pageNum
//                       ? "bg-[#2E6FF3] text-white"
//                       : "border border-[#E5E7EB] hover:bg-gray-50"
//                   }`}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}

//             {totalPages > 5 && (
//               <>
//                 <span className="px-2">...</span>
//                 <button
//                   onClick={() => setCurrentPage(totalPages)}
//                   className="px-3 py-1.5 border border-[#E5E7EB] rounded-md text-sm hover:bg-gray-50 transition cursor-pointer"
//                 >
//                   {totalPages}
//                 </button>
//               </>
//             )}

//             <button
//               onClick={handleNext}
//               disabled={currentPage === totalPages}
//               className={`px-3 py-1.5 border border-[#E5E7EB] rounded-md text-sm transition ${
//                 currentPage === totalPages
//                   ? "opacity-50 cursor-not-allowed bg-gray-50"
//                   : "hover:bg-gray-50 cursor-pointer"
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorManagement;