import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { Plus } from "lucide-react";
import { FiEdit2 } from "react-icons/fi";
import AddDoctorForm from "@/components/ClinicDashboard/DoctorManagement/AddDoctorForm";
import EditDoctorDetails from "@/components/ClinicDashboard/DoctorManagement/EditDoctorDetails";
import ViewDoctorDetails from "./ViewDocterDetails";
// import ViewDoctorDetails from "./ViewDoctorDetails";

// Update the Doctor interface to include all required properties
interface Doctor {
  id: number;
  name: string;
  email: string;
  specialty: string;
  serviceType: string;
  phone: string;
  totalAppointments: number;
  licenseNumber: string;
  workingHour: string;
  availability: string[];
}

const DoctorManagement: React.FC = () => {
  const [openProfile, setOpenProfile] = useState<Doctor | null>(null);
  const [openAddDoctor, setOpenAddDoctor] = useState(false);
  const [openEditDoctor, setOpenEditDoctor] = useState<Doctor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. David Giorgadze",
      email: "david.g@gmail.com",
      specialty: "General Practitioner",
      serviceType: "Both",
      phone: "+995 595 123 456",
      totalAppointments: 145,
      licenseNumber: "MED-001-2024",
      workingHour: "10:00 AM - 05:00 PM",
      availability: ["Monday", "Tuesday", "Wednesday", "Friday"],
    },
    {
      id: 2,
      name: "Dr. Lasha Beridze",
      email: "michael.c@gmail.com",
      specialty: "Cardiologist",
      serviceType: "Clinic Visit",
      phone: "+995 577 987 654",
      totalAppointments: 50,
      licenseNumber: "MED-002-2024",
      workingHour: "09:00 AM - 04:00 PM",
      availability: ["Monday", "Wednesday", "Thursday", "Saturday"],
    },
    {
      id: 3,
      name: "Dr. Nino Kapanadze",
      email: "emily.r@gmail.com",
      specialty: "Pediatrician",
      serviceType: "Clinic Visit",
      phone: "+995 599 001 223",
      totalAppointments: 20,
      licenseNumber: "MED-003-2024",
      workingHour: "08:00 AM - 03:00 PM",
      availability: ["Tuesday", "Thursday", "Friday"],
    },
    {
      id: 4,
      name: "Dr. Irakli Tvalavadze",
      email: "irakli.tvalavadze@gmail.com",
      specialty: "Orthopedic Surgeon",
      serviceType: "Both",
      phone: "+995 32 245 6789",
      totalAppointments: 30,
      licenseNumber: "MED-004-2024",
      workingHour: "10:00 AM - 06:00 PM",
      availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    {
      id: 5,
      name: "Dr. Salome Abashidze",
      email: "salome.abashidze@gmail.com",
      specialty: "Dermatologist",
      serviceType: "Clinic Visit",
      phone: "+995 431 102 345",
      totalAppointments: 10,
      licenseNumber: "MED-005-2024",
      workingHour: "09:00 AM - 05:00 PM",
      availability: ["Monday", "Wednesday", "Friday"],
    },
    {
      id: 6,
      name: "Dr. Giorgi Lomidze",
      email: "giorgi.lomidze@gmail.com",
      specialty: "Neurologist",
      serviceType: "Clinic Visit",
      phone: "+995 422 789 012",
      totalAppointments: 15,
      licenseNumber: "MED-006-2024",
      workingHour: "08:30 AM - 04:30 PM",
      availability: ["Tuesday", "Thursday", "Saturday"],
    },
    {
      id: 7,
      name: "Dr. Eka Mchedlishvili",
      email: "eka.mchedlishvili@gmail.com",
      specialty: "Gynecologist",
      serviceType: "Both",
      phone: "+995 555 334 455",
      totalAppointments: 25,
      licenseNumber: "MED-007-2024",
      workingHour: "10:00 AM - 05:00 PM",
      availability: ["Monday", "Tuesday", "Thursday", "Friday"],
    },
    {
      id: 8,
      name: "Dr. Levan Khutishvili",
      email: "levan.khutishvili@gmail.com",
      specialty: "ENT Specialist",
      serviceType: "Clinic Visit",
      phone: "+995 341 506 708",
      totalAppointments: 30,
      licenseNumber: "MED-008-2024",
      workingHour: "09:00 AM - 04:00 PM",
      availability: ["Monday", "Wednesday", "Friday", "Saturday"],
    },
    {
      id: 9,
      name: "Dr. Maia Kereselidze",
      email: "maia.kereselidze@gmail.com",
      specialty: "Psychiatrist",
      serviceType: "Both",
      phone: "+995 593 078 901",
      totalAppointments: 25,
      licenseNumber: "MED-009-2024",
      workingHour: "10:00 AM - 06:00 PM",
      availability: ["Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  ];

  let currentDoctors: Doctor[] = [];
  let startIndex = 0;
  let endIndex = 0;

  if (currentPage === 1) {
    currentDoctors = doctors;
    startIndex = 1;
    endIndex = doctors.length;
  } else {
    currentDoctors = doctors.slice(-4);
    startIndex = doctors.length - 3;
    endIndex = doctors.length;
  }

  return (
    <div>
      <div className="bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-auto">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              Doctors Management
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              Manage your clinic's medical staff
            </p>
          </div>

          {/* Add Doctor Button */}
          <button
            onClick={() => setOpenAddDoctor(true)}
            className="w-full cursor-pointer sm:w-auto flex items-center justify-center sm:justify-start gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-xs md:text-sm font-medium shadow-sm transition"
          >
            <Plus size={16} />
            Add New Doctor
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm md:p-6 gap-2 border border-gray-300 px-4 md:px-5 py-2.5">
          {/* Title and Search */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
            <h2 className="text-base text-gray-900 gap-2 bg-white rounded-md px-3 py-1.5">
              All Doctors Information
            </h2>

            <div className="w-full md:w-60 flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-1.5">
              <IoIosSearch className="text-gray-400 text-lg flex-shrink-0" />
              <input
                type="search"
                placeholder="Search doctors..."
                className="bg-transparent flex-1 text-sm text-gray-700 focus:outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Table Container - Horizontal Scroll on Mobile */}
          <div className="p-5 border border-[#E4E4E4] rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4  gap-5">
              <div className="xl:col-span-4 w-full">
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-[800px] w-full text-sm">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">
                          Doctor Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">
                          Email Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">
                          Specialty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">
                          Service Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">
                          Phone Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">
                          Total Appointments
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentDoctors.map((doctor) => (
                        <tr
                          key={doctor.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                          <td className="px-6 whitespace-nowrap py-3 font-semibold text-gray-900">
                            {doctor.name}
                          </td>

                          <td className="px-6 whitespace-nowrap py-3 text-gray-700">
                            {doctor.email}
                          </td>

                          <td className="px-6 whitespace-nowrap py-3 text-gray-700">
                            {doctor.specialty}
                          </td>

                          <td className="px-6 whitespace-nowrap py-3 text-gray-700">
                            <span className="inline-flex px-3 py-1.5 rounded-md bg-[#BEDBFF] text-[#2E6FF3] text-xs font-medium">
                              {doctor.serviceType}
                            </span>
                          </td>

                          <td className="px-6 whitespace-nowrap py-3 text-gray-700">
                            {doctor.phone}
                          </td>

                          <td className="px-6 whitespace-nowrap py-3 text-center text-gray-700">
                            {doctor.totalAppointments}
                          </td>

                          <td className="px-6 py-3 text-center">
                            <div className="flex justify-center gap-2">
                              {/* View */}
                              <button
                                onClick={() => setOpenProfile(doctor)}
                                className="flex cursor-pointer items-center gap-1 text-sm bg-[#2E6FF3] hover:bg-[#034ee6] text-white font-medium px-3 py-1.5 rounded-md transition"
                              >
                                <FaEye className="text-white" /> View
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => setOpenEditDoctor(doctor)}
                                className="flex cursor-pointer items-center gap-1 text-sm bg-[#E9575A] hover:bg-[#b81113] text-white font-medium px-3 py-1.5 rounded-md transition"
                              >
                                <FiEdit2 className="text-white" /> Edit
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

          {/* Pagination */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4">
            <p className="text-xs md:text-sm text-gray-600">
              Showing <span className="font-medium">{startIndex}</span> to{" "}
              <span className="font-medium">{endIndex}</span> of{" "}
              <span className="font-medium">{doctors.length}</span> entries
            </p>

            <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`px-2 md:px-3 py-1 text-xs md:text-sm border rounded transition whitespace-nowrap ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Prev
              </button>

              <button
                onClick={() => setCurrentPage(1)}
                className={`px-2 md:px-3 py-1 cursor-pointer text-xs md:text-sm border rounded transition ${
                  currentPage === 1
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                1
              </button>

              <button
                onClick={() => setCurrentPage(2)}
                className={`px-2 md:px-3 cursor-pointer py-1 text-xs md:text-sm border rounded transition ${
                  currentPage === 2
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                2
              </button>

              <button
                onClick={() => setCurrentPage(2)}
                disabled={currentPage === 2}
                className={`px-2 md:px-3 py-1 text-xs md:text-sm border rounded transition whitespace-nowrap ${
                  currentPage === 2
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* View Doctor Modal */}
        {openProfile && (
          <ViewDoctorDetails
            doctor={openProfile}
            onClose={() => setOpenProfile(null)}
          />
        )}

        {/* Add Doctor Modal */}
        {openAddDoctor && (
          <AddDoctorForm onClose={() => setOpenAddDoctor(false)} />
        )}

        {/* Edit Doctor Modal */}
        {openEditDoctor && (
          <EditDoctorDetails
            doctor={openEditDoctor}
            onClose={() => setOpenEditDoctor(null)}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorManagement;

// import React, { useState } from "react";
// import { FaEye } from "react-icons/fa";
// import { IoIosSearch } from "react-icons/io";
// import { Plus } from "lucide-react";
// import { FiEdit2 } from "react-icons/fi";
// import ViewDocterDetails from "@/components/ClinicDashboard/DoctorManagement/ViewDocterDetails";
// import AddDoctorForm from "@/components/ClinicDashboard/DoctorManagement/AddDoctorForm";
// import EditDoctorDetails from "@/components/ClinicDashboard/DoctorManagement/EditDoctorDetails";
// // ⭐ ADDED ↑↑↑

// interface Doctor {
//   id: number;
//   name: string;
//   email: string;
//   specialty: string;
//   serviceType: string;
//   phone: string;
//   totalAppointments: number;
// }

// const DoctorManagement: React.FC = () => {
//   const [openProfile, setOpenProfile] = useState<Doctor | null>(null);

//   // ⭐ ADDED ↓↓↓
//   const [openAddDoctor, setOpenAddDoctor] = useState(false);
//   const [openEditDoctor, setOpenEditDoctor] = useState<Doctor | null>(null);
//   // ⭐ ADDED ↑↑↑

//   const [currentPage, setCurrentPage] = useState(1);

//   const doctors: Doctor[] = [
//     {
//       id: 1,
//       name: "Dr. David Giorgadze",
//       email: "david.g@gmail.com",
//       specialty: "General Practitioner",
//       serviceType: "Both",
//       phone: "+995 595 123 456",
//       totalAppointments: 145,
//     },
//     {
//       id: 2,
//       name: "Dr. Lasha Beridze",
//       email: "michael.c@gmail.com",
//       specialty: "Cardiologist",
//       serviceType: "Clinic Visit",
//       phone: "+995 577 987 654",
//       totalAppointments: 50,
//     },
//     {
//       id: 3,
//       name: "Dr. Nino Kapanadze",
//       email: "emily.r@gmail.com",
//       specialty: "Pediatrician",
//       serviceType: "Clinic Visit",
//       phone: "+995 599 001 223",
//       totalAppointments: 20,
//     },
//     {
//       id: 4,
//       name: "Dr. Irakli Tvalavadze",
//       email: "irakli.tvalavadze@gmail.com",
//       specialty: "Orthopedic Surgeon",
//       serviceType: "Both",
//       phone: "+995 32 245 6789",
//       totalAppointments: 30,
//     },
//     {
//       id: 5,
//       name: "Dr. Salome Abashidze",
//       email: "salome.abashidze@gmail.com",
//       specialty: "Dermatologist",
//       serviceType: "Clinic Visit",
//       phone: "+995 431 102 345",
//       totalAppointments: 10,
//     },
//     {
//       id: 6,
//       name: "Dr. Giorgi Lomidze",
//       email: "giorgi.lomidze@gmail.com",
//       specialty: "Neurologist",
//       serviceType: "Clinic Visit",
//       phone: "+995 422 789 012",
//       totalAppointments: 15,
//     },
//     {
//       id: 7,
//       name: "Dr. Eka Mchedlishvili",
//       email: "eka.mchedlishvili@gmail.com",
//       specialty: "Gynecologist",
//       serviceType: "Both",
//       phone: "+995 555 334 455",
//       totalAppointments: 25,
//     },
//     {
//       id: 8,
//       name: "Dr. Levan Khutishvili",
//       email: "levan.khutishvili@gmail.com",
//       specialty: "ENT Specialist",
//       serviceType: "Clinic Visit",
//       phone: "+995 341 506 708",
//       totalAppointments: 30,
//     },
//     {
//       id: 9,
//       name: "Dr. Maia Kereselidze",
//       email: "maia.kereselidze@gmail.com",
//       specialty: "Psychiatrist",
//       serviceType: "Both",
//       phone: "+995 593 078 901",
//       totalAppointments: 25,
//     },
//   ];

//   let currentDoctors: Doctor[] = [];
//   let startIndex = 0;
//   let endIndex = 0;

//   if (currentPage === 1) {
//     currentDoctors = doctors;
//     startIndex = 1;
//     endIndex = doctors.length;
//   } else {
//     currentDoctors = doctors.slice(-4);
//     startIndex = doctors.length - 3;
//     endIndex = doctors.length;
//   }

//   return (
//     <div>
//       <div className=" bg-gray-50 min-h-screen">
//         {/* Header Section */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
//           <div className="w-full sm:w-auto">
//             <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
//               Doctors Management
//             </h1>
//             <p className="text-xs md:text-sm text-gray-500 mt-0.5">
//               Manage your clinic's medical staff
//             </p>
//           </div>

//           {/* Add Doctor Button */}
//           <button
//             onClick={() => setOpenAddDoctor(true)}
//             className="w-full cursor-pointer sm:w-auto flex items-center justify-center sm:justify-start gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-xs md:text-sm font-medium shadow-sm transition"
//           >
//             <Plus size={16} />
//             Add New Doctor
//           </button>
//         </div>

//         {/* Main Content */}
//         <div className="bg-white rounded-lg shadow-sm  md:p-6 gap-2 border border-gray-300  px-4 md:px-5 py-2.5">
//           {/* Title and Search */}
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
//             <h2 className="text-base text-gray-900 gap-2 bg-white rounded-md px-3 py-1.5">
//               All Doctors Information
//             </h2>

//             <div className="w-full md:w-60 flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-1.5">
//               <IoIosSearch className="text-gray-400 text-lg flex-shrink-0" />
//               <input
//                 type="search"
//                 placeholder="Search doctors..."
//                 className="bg-transparent flex-1 text-sm text-gray-700 focus:outline-none placeholder:text-gray-400"
//               />
//             </div>
//           </div>

//           {/* Table Container - Horizontal Scroll on Mobile */}
//           <div className="border border-gray-200 rounded-lg overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gray-50 border-b border-gray-200">
//                   <th className="px-2 md:px-3 py-3 text-left text-xs text-gray-700 font-bold whitespace-nowrap">
//                     Doctor Name
//                   </th>
//                   <th className="px-2 md:px-3 py-3 text-left text-xs font-bold text-gray-700 whitespace-nowrap hidden sm:table-cell">
//                     Email Address
//                   </th>
//                   <th className="px-2 md:px-3 py-3 text-left text-xs font-bold text-gray-700 whitespace-nowrap">
//                     Specialty
//                   </th>
//                   <th className="px-2 md:px-3 py-3 text-left text-xs font-bold text-gray-700 whitespace-nowrap hidden md:table-cell">
//                     Service Type
//                   </th>
//                   <th className="px-2 md:px-3 py-3 text-left text-xs font-bold text-gray-700 whitespace-nowrap hidden lg:table-cell">
//                     Phone Number
//                   </th>
//                   <th className="px-2 md:px-3 py-3 text-left text-xs font-bold text-gray-700 whitespace-nowrap hidden xl:table-cell">
//                     Total Appointments
//                   </th>
//                   <th className="px-2 md:px-3 py-3 text-left text-xs font-bold text-gray-700 whitespace-nowrap">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {currentDoctors.map((doctor, index) => (
//                   <tr
//                     key={doctor.id}
//                     className={`hover:bg-gray-50/50 transition ${
//                       index !== currentDoctors.length - 1
//                         ? "border-b border-gray-200"
//                         : ""
//                     }`}
//                   >
//                     <td className="px-2 md:px-3 py-3 text-xs md:text-sm text-gray-900 font-medium">
//                       {doctor.name}
//                     </td>
//                     <td className="px-2 md:px-3 py-3 text-xs md:text-sm text-gray-600 hidden sm:table-cell">
//                       {doctor.email}
//                     </td>
//                     <td className="px-2 md:px-3 py-3 text-xs md:text-sm text-gray-600">
//                       {doctor.specialty}
//                     </td>
//                     <td className="px-2 md:px-3 py-3 hidden md:table-cell">
//                       <span className="inline-flex px-2.5 py-2 rounded text-xs font-medium bg-[#BEDBFF] text-[#2E6FF3] whitespace-nowrap">
//                         {doctor.serviceType}
//                       </span>
//                     </td>
//                     <td className="px-2 md:px-3 py-3 text-xs md:text-sm text-gray-600 hidden lg:table-cell">
//                       {doctor.phone}
//                     </td>
//                     <td className="px-2 md:px-3 py-3 text-xs md:text-sm text-gray-600 hidden xl:table-cell">
//                       {doctor.totalAppointments}
//                     </td>

//                     <td className="px-2 md:px-3 py-3">
//                       <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
//                         {/* View Button */}
//                         <button
//                           onClick={() => setOpenProfile(doctor)}
//                           className="w-full cursor-pointer sm:w-auto flex items-center justify-center gap-1.5 bg-[#2E6FF3] text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-600 transition"
//                         >
//                           <FaEye size={12} /> View
//                         </button>

//                         {/* Edit Button */}
//                         <button
//                           onClick={() => setOpenEditDoctor(doctor)}
//                           className="w-full cursor-pointer sm:w-auto flex items-center justify-center gap-1.5 bg-[#0B9CAC] text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-teal-600 transition"
//                         >
//                           <FiEdit2 size={12} /> Edit
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4">
//             <p className="text-xs md:text-sm text-gray-600">
//               Showing <span className="font-medium">{startIndex}</span> to{" "}
//               <span className="font-medium">{endIndex}</span> of{" "}
//               <span className="font-medium">{doctors.length}</span> entries
//             </p>

//             <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto">
//               <button
//                 onClick={() => setCurrentPage(1)}
//                 disabled={currentPage === 1}
//                 className={`px-2 md:px-3 py-1 text-xs md:text-sm border rounded transition whitespace-nowrap ${
//                   currentPage === 1
//                     ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
//                     : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//                 }`}
//               >
//                 Prev
//               </button>

//               <button
//                 onClick={() => setCurrentPage(1)}
//                 className={`px-2 md:px-3 py-1 cursor-pointer text-xs md:text-sm border rounded transition ${
//                   currentPage === 1
//                     ? "bg-blue-500 text-white border-blue-500"
//                     : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//                 }`}
//               >
//                 1
//               </button>

//               <button
//                 onClick={() => setCurrentPage(2)}
//                 className={`px-2 md:px-3 cursor-pointer py-1 text-xs md:text-sm border rounded transition ${
//                   currentPage === 2
//                     ? "bg-blue-500 text-white border-blue-500"
//                     : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//                 }`}
//               >
//                 2
//               </button>

//               <button
//                 onClick={() => setCurrentPage(2)}
//                 disabled={currentPage === 2}
//                 className={`px-2 md:px-3 py-1 text-xs md:text-sm border rounded transition whitespace-nowrap ${
//                   currentPage === 2
//                     ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
//                     : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* View Doctor Modal */}
//         {openProfile && (
//           <ViewDocterDetails
//             doctor={openProfile}
//             onClose={() => setOpenProfile(null)}
//           />
//         )}

//         {/* Add Doctor Modal */}
//         {openAddDoctor && (
//           <AddDoctorForm onClose={() => setOpenAddDoctor(false)} />
//         )}

//         {/* Edit Doctor Modal */}
//         {openEditDoctor && (
//           <EditDoctorDetails
//             doctor={openEditDoctor}
//             onClose={() => setOpenEditDoctor(null)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default DoctorManagement;
