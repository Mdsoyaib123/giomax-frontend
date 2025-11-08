import React, { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { X } from "lucide-react";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  email: string;
  phone: string;
  totalBooking: string;
}

interface Props {
  id: string | number; // assuming you have an id for each user/payment
}

const PatientManagement: React.FC<Props> = ({ id }) => {
  const [openProfile, setOpenProfile] = useState<Patient | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to payment-history page with id
    navigate(`/admin-dashboard/patient-management/${id}`);
  };

  const users: Patient[] = [
    {
      id: "USR-001",
      name: "Samsel Arfin",
      age: 26,
      gender: "Male",
      location: "Shota Rustaveli Ave. No. 22, Apt 5",
      email: "sarah.j@gmail.com",
      phone: "+995 595 123 456",
      totalBooking: "12",
    },
    {
      id: "USR-002",
      name: "Ariana Gomez",
      age: 23,
      gender: "Female",
      location: "Shota Rustaveli Ave. No. 18, Apt 2",
      email: "ariana.gomez@gmail.com",
      phone: "+995 595 111 222",
      totalBooking: "8",
    },
    {
      id: "USR-003",
      name: "Michael Johnson",
      age: 35,
      gender: "Male",
      location: "Rustavi Blvd 5, Flat 12",
      email: "michael.johnson@gmail.com",
      phone: "+995 595 333 444",
      totalBooking: "15",
    },
    {
      id: "USR-004",
      name: "Emily Carter",
      age: 29,
      gender: "Female",
      location: "Vazha Pshavela Ave 42",
      email: "emily.carter@gmail.com",
      phone: "+995 595 555 666",
      totalBooking: "10",
    },
    {
      id: "USR-005",
      name: "David Brown",
      age: 31,
      gender: "Male",
      location: "Freedom Sq. Building 1",
      email: "david.brown@gmail.com",
      phone: "+995 595 777 888",
      totalBooking: "6",
    },
    {
      id: "USR-006",
      name: "Sophia Turner",
      age: 27,
      gender: "Female",
      location: "Tamarashvili St. No. 8",
      email: "sophia.turner@gmail.com",
      phone: "+995 595 999 000",
      totalBooking: "9",
    },
  ];

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleView = (patient: Patient) => {
    setOpenProfile(patient);
  };

  const handleRemove = (id: string) => {
    alert(`Patient ${id} removed successfully!`);
  };

  return (
    <div className="">
      <div className="rounded-xl border border-[#DBE0E5] bg-white shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          {/* Title */}
          <h2 className="text-lg font-semibold text-[#343A40]">
            All Patients Information
          </h2>

          {/* Search Bar */}
          <div className="flex items-center w-full sm:w-[320px] h-9 bg-[#F5F7FB] rounded-lg px-3 py-1.5">
            {/* Search Icon */}
            <IoIosSearch className="text-gray-500 text-lg ml-2" />

            {/* Input Field */}
            <input
              type="search"
              placeholder="Search patients..."
              className="bg-transparent flex-1 pl-2 text-sm text-gray-700 focus:outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="p-5 border border-[#E4E4E4] rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4  gap-5">
            <div className="xl:col-span-4 w-full">
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-[800px] w-full text-sm">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Group Name
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Email Address
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                        Phone Number
                      </th>
                      <th className="px-6 py-4 text-center font-medium text-gray-700 whitespace-nowrap">
                        Total Bookings
                      </th>
                      <th className="px-6 py-4 text-center font-medium text-gray-700 whitespace-nowrap">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="px-6 whitespace-nowrap py-3 font-semibold text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 whitespace-nowrap py-3 text-gray-700">
                          {user.location}
                        </td>
                        <td className="px-6 whitespace-nowrap py-3 text-gray-700">
                          {user.email}
                        </td>
                        <td className="px-6 whitespace-nowrap py-3 text-gray-700">
                          {user.phone}
                        </td>
                        <td className="px-6 whitespace-nowrap py-3 text-center text-gray-700">
                          {user.totalBooking}
                        </td>
                        <td className="px-6 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleView(user)}
                              className="flex cursor-pointer items-center gap-1 text-sm bg-[#2E6FF3] hover:bg-[#034ee6] text-white font-medium px-3 py-1.5 rounded-md transition"
                            >
                              <FaEye className="text-white" /> View
                            </button>
                            <button
                              onClick={() => handleRemove(user.id)}
                              className="flex items-center cursor-pointer gap-1 text-sm bg-[#E9575A] hover:bg-[#b81113] text-white font-medium px-3 py-1.5 rounded-md transition"
                            >
                              <RiDeleteBinLine className="text-white" /> Remove
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
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{currentUsers.length}</span>{" "}
            of <span className="font-medium">{users.length}</span> patients
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 border rounded-lg text-sm ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Prev
            </button>
            <div className="min-w-[50px] text-center border px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 bg-gray-50">
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 border rounded-lg text-sm ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Patient Profile Dialog */}
      {openProfile && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-0.9">
          <div className="bg-white rounded-lg w-full max-w-5xl shadow-2xl p-8 relative border border-gray-300 transform scale-100 transition-transform duration-200">
            {/* Close Icon */}
            <button
              onClick={() => setOpenProfile(null)}
              className="absolute cursor-pointer top-4 right-4 text-gray-600 hover:text-gray-800 hover:scale-110 transition-transform"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-[#1f3a44] mb-2">
              Patient Profile
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              View detailed patient information and history
            </p>

            {/* Input Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={openProfile.name}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-lg bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Age
                </label>
                <input
                  type="text"
                  value={openProfile.age}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Gender
                </label>
                <input
                  type="text"
                  value={openProfile.gender}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={openProfile.phone}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Email
                </label>
                <input
                  type="text"
                  value={openProfile.email}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={openProfile.location}
                  readOnly
                  className="w-full px-3 py-3 border border-[#ECEFF1] rounded-xl bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54]"
                />
              </div>
            </div>

            {/* Divider */}
            <hr className="my-6 border-gray-200" />

            <div className="space-y-6 w-full">
              <h2 className="text-xl font-semibold text-gray-800">
                Appointment History
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                {/* Appointment Card */}
                <div className="bg-[#F4F6F8] p-5 rounded-2xl border border-[#CED4DA] shadow-sm flex justify-between items-center w-full sm:w-1/2 hover:shadow-md transition-shadow duration-200">
                  {/* Left side: Name and Date */}
                  <div>
                    <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                      Dr. Michael Brown
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">2025-10-15</p>
                    <p className="text-gray-400 text-sm mt-0.5">
                      Cardiologist
                    </p>{" "}
                    {/* Optional profession */}
                  </div>

                  {/* Right side: Status */}
                  <div>
                    <p className="px-3 py-1 text-sm font-medium rounded-full bg-[#1D4ED8] text-white">
                      Completed
                    </p>
                  </div>
                </div>

                <div className="bg-[#F4F6F8] p-5 rounded-2xl border border-[#CED4DA] shadow-sm flex justify-between items-center w-full sm:w-1/2 hover:shadow-md transition-shadow duration-200">
                  <div>
                    <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                      Dr. Sarah Lee
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">2025-09-28</p>
                    <p className="text-gray-400 text-sm mt-0.5">
                      Dermatologist
                    </p>
                  </div>
                  <div>
                    <p className="px-3 py-1 text-sm font-medium rounded-full bg-[#1B9268] text-white">
                      Upcoming
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex  gap-4 mt-6">
              <button
                onClick={() => setOpenProfile(null)}
                className=" w-full cursor-pointer px-5 py-2 rounded-lg border border-[#ECEFF1] bg-[#EFF4FF] text-gray-700 hover:bg-gray-100 transition"
              >
                Close
              </button>
              <button
                onClick={handleClick} // Replace with actual handler
                className="w-full cursor-pointer px-5 py-2 rounded-lg bg-[#2E6FF3] text-white hover:bg-[#0b51de] transition"
              >
                View Payment History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;

// import React, { useState } from "react";
// import { HiDotsVertical } from "react-icons/hi";
// import { FiEdit3 } from "react-icons/fi";
// import { RiDeleteBinLine } from "react-icons/ri";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const PatientManagement: React.FC = () => {
//   const [openMenuId, setOpenMenuId] = useState<string | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [newStaff, setNewStaff] = useState({ fullName: "", role: "" });
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   const users = [
//     {
//       id: "USR-001",
//       name: "Samsel Arfin",
//       role: "Admin",
//       status: "Active",
//       loginStatus: "2024-01-15 09:15",
//     },
//     {
//       id: "USR-002",
//       name: "Ariana Gomez",
//       role: "Moderator",
//       status: "Inactive",
//       loginStatus: "2024-01-15 09:15",
//     },
//     {
//       id: "USR-003",
//       name: "Michael Johnson",
//       role: "User",
//       status: "Active",
//       loginStatus: "2024-01-15 09:15",
//     },
//     {
//       id: "USR-004",
//       name: "Emily Carter",
//       role: "User",
//       status: "Suspended",
//       loginStatus: "2024-01-15 09:15",
//     },
//     {
//       id: "USR-005",
//       name: "David Brown",
//       role: "Moderator",
//       status: "Active",
//       loginStatus: "2024-01-15 09:15",
//     },
//     {
//       id: "USR-006",
//       name: "Sophia Turner",
//       role: "User",
//       status: "Inactive",
//       loginStatus: "2024-01-15 09:15",
//     },
//     {
//       id: "USR-007",
//       name: "John Doe",
//       role: "Admin",
//       status: "Active",
//       loginStatus: "2024-01-15 09:15",
//     },
//     {
//       id: "USR-008",
//       name: "Emma Wilson",
//       role: "User",
//       status: "Suspended",
//       loginStatus: "2024-01-15 09:15",
//     },
//     {
//       id: "USR-009",
//       name: "Liam Miller",
//       role: "User",
//       status: "Active",
//       loginStatus: "2024-01-15 09:15",
//     },
//     {
//       id: "USR-010",
//       name: "Olivia Davis",
//       role: "Moderator",
//       status: "Inactive",
//       loginStatus: "2024-01-15 09:15",
//     },
//     {
//       id: "USR-011",
//       name: "Lucas White",
//       role: "User",
//       status: "Active",
//       loginStatus: "2024-01-15 09:15",
//     },
//     {
//       id: "USR-012",
//       name: "Charlotte Green",
//       role: "User",
//       status: "Suspended",
//       loginStatus: "2024-01-15 09:15",
//     },
//     {
//       id: "USR-013",
//       name: "Henry Clark",
//       role: "Admin",
//       status: "Active",
//       loginStatus: "2024-01-15 09:15",
//     },
//     {
//       id: "USR-014",
//       name: "Ava Moore",
//       role: "User",
//       status: "Inactive",
//       loginStatus: "2024-01-15 09:15",
//     },
//     {
//       id: "USR-015",
//       name: "Mason Taylor",
//       role: "User",
//       status: "Active",
//       loginStatus: "2024-01-15 09:15",
//     },
//     {
//       id: "USR-016",
//       name: "Isabella Hall",
//       role: "Moderator",
//       status: "Active",
//       loginStatus: "2024-01-15 09:15",
//     },
//     {
//       id: "USR-017",
//       name: "James Allen",
//       role: "User",
//       status: "Suspended",
//       loginStatus: "2024-01-15 09:15",
//     },
//     {
//       id: "USR-018",
//       name: "Ethan Adams",
//       role: "User",
//       status: "Inactive",
//       loginStatus: "2024-01-15 09:15",
//     },
//     {
//       id: "USR-019",
//       name: "Mia Scott",
//       role: "Admin",
//       status: "Active",
//       loginStatus: "2024-01-15 09:15",
//     },
//     {
//       id: "USR-020",
//       name: "Noah Lewis",
//       role: "User",
//       status: "Active",
//       loginStatus: "2024-01-15 09:15",
//     },
//   ];

//   const totalPages = Math.ceil(users.length / itemsPerPage);

//   const toggleMenu = (id: string) => {
//     setOpenMenuId((prev) => (prev === id ? null : id));
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setNewStaff((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCreateStaff = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("New Staff Created:", newStaff);
//     setIsDialogOpen(false);
//     setNewStaff({ fullName: "", role: "" });
//   };

//   const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
//   const handleNext = () =>
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));

//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

//   return (
//     <div className="">
//       <div className="rounded-xl border border-[#DBE0E5] bg-[#F8F9FA] shadow-sm p-6">
//         {/* Search and Button Row */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//           {/* <div className="flex-1 w-full sm:max-w-md">
//             <input
//               type="search"
//               placeholder="Search by name or user ID..."
//               className="w-full px-4 py-2 border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54] placeholder-gray-400"
//             />
//           </div> */}
//           <h1>All Patients Information</h1>

//           <div className="w-full sm:w-auto">
//             {/* <button
//               onClick={() => setIsDialogOpen(true)}
//               className="w-full sm:w-auto text-base cursor-pointer flex items-center justify-center sm:justify-start gap-2 bg-[#346778] hover:bg-[#2c4a54] text-white font-medium px-4 py-3 rounded-lg transition-all duration-200 shadow-sm"
//             >
//               <span className="text-lg leading-none">+</span>
//               Add New Staff Account
//             </button> */}

//             <input
//               type="search"
//               placeholder="Search by name or user ID..."
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a54] focus:border-[#2c4a54] placeholder-gray-400"
//             />
//           </div>
//         </div>

//         {/* Table */}
//         <div>
//           <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4  gap-5">
//             <div className="xl:col-span-4 w-full">
//               <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
//                 <table className="min-w-[800px] w-full text-sm">
//                   <thead className="bg-gray-100 border-b border-gray-200">
//                     <tr>
//                       <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
//                         Group Name
//                       </th>
//                       <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
//                         Location
//                       </th>
//                       <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
//                         Email Address
//                       </th>
//                       <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
//                         Phone Number
//                       </th>
//                       <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
//                         Total Bookings
//                       </th>
//                       <th className="px-6 py-4 text-center font-medium text-gray-700 whitespace-nowrap">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {currentUsers.map((user) => (
//                       <tr
//                         key={user.id}
//                         className="border-b border-gray-100 hover:bg-gray-50 transition"
//                       >
//                         <td className="px-6 py-3 font-semibold text-gray-900 whitespace-nowrap">
//                           {user.name}
//                         </td>
//                         <td className="px-6 py-3 text-gray-700 whitespace-nowrap">
//                           {user.id}
//                         </td>
//                         <td className="px-6 py-3">
//                           <span
//                             className={`rounded-full px-3 py-1 text-xs font-medium ${
//                               user.role === "Admin"
//                                 ? "bg-purple-100 text-purple-700"
//                                 : user.role === "Moderator"
//                                 ? "bg-blue-100 text-blue-700"
//                                 : "bg-gray-100 text-gray-700"
//                             }`}
//                           >
//                             {user.role}
//                           </span>
//                         </td>
//                         <td className="px-6 py-3">
//                           <span
//                             className={`inline-flex w-24 items-center justify-center rounded-xl px-3 py-1 text-xs font-medium ${
//                               user.status === "Active"
//                                 ? "bg-green-100 text-green-800"
//                                 : user.status === "Inactive"
//                                 ? "bg-yellow-100 text-yellow-700"
//                                 : "bg-red-100 text-red-700"
//                             }`}
//                           >
//                             {user.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-3 text-gray-700 whitespace-nowrap">
//                           {user.loginStatus}
//                         </td>

//                         {/* Action Dropdown */}
//                         <td className="relative px-6 py-3 text-center">
//                           <button
//                             onClick={() => toggleMenu(user.id)}
//                             className="rounded-md p-2 cursor-pointer hover:bg-gray-100 transition"
//                           >
//                             <HiDotsVertical className="h-5 w-5 text-gray-600" />
//                           </button>

//                           {openMenuId === user.id && (
//                             <div className="absolute right-10 sm:right-12 md:right-14 lg:right-16 xl:right-18 2xl:right-20 mt-2.5 w-44 bg-white border border-gray-200 rounded-lg shadow-md z-20">
//                               <button className="flex cursor-pointer w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition">
//                                 <FiEdit3 className="h-4 w-4 text-blue-600" />
//                                 <span>To Modify</span>
//                               </button>
//                               <button className="flex cursor-pointer w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-gray-100 transition">
//                                 <RiDeleteBinLine className="h-4 w-4" />
//                                 <span>Delete</span>
//                               </button>
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>

//           {/* Pagination */}
//           <div className="mt-6 flex items-center justify-between px-4 py-3">
//             <div className="text-sm text-gray-600">
//               Showing <span className="font-medium">{currentUsers.length}</span>{" "}
//               of <span className="font-medium">{users.length}</span> users
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={handlePrev}
//                 disabled={currentPage === 1}
//                 className={`cursor-pointer rounded-lg border px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 ${
//                   currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               >
//                 Prev
//               </button>
//               <div className="min-w-[50px] rounded-md border border-[#E3E3E4] bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700 shadow-sm">
//                 {currentPage} / {totalPages}
//               </div>
//               <button
//                 onClick={handleNext}
//                 disabled={currentPage === totalPages}
//                 className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 ${
//                   currentPage === totalPages
//                     ? "opacity-50 cursor-not-allowed"
//                     : ""
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Create New Staff Dialog */}
//       {isDialogOpen && (
//         <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-200">
//             <h2 className="text-xl font-semibold text-gray-900 mb-3">
//               Create New Staff Account
//             </h2>
//             <p className="text-sm text-gray-500 mb-4">
//               Fill in the details below to create a new staff account.
//             </p>
//             <hr className="my-4 border-gray-200" />

//             <form onSubmit={handleCreateStaff} className="space-y-4">
//               {/* Full Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   name="fullName"
//                   value={newStaff.fullName}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="Enter full name"
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-[#346778] focus:border-[#346778] focus:outline-none placeholder-gray-400"
//                 />
//               </div>

//               <div>
//                 <Label className="text-sm text-[#333] font-semibold mb-1 block">
//                   Role
//                 </Label>
//                 <Select>
//                   <SelectTrigger className="w-full cursor-pointer border border-[#C6CAD1] py-2.5 rounded-xl bg-white">
//                     <SelectValue placeholder="Select role" />
//                   </SelectTrigger>
//                   <SelectContent className="border-none cursor-pointer">
//                     <SelectGroup className="bg-white shadow-2xl rounded-sm ">
//                       <SelectLabel>Select role</SelectLabel>
//                       <SelectItem
//                         value="admin"
//                         className="hover:bg-[#E4E8EA] cursor-pointer"
//                       >
//                         Admin
//                       </SelectItem>
//                       <SelectItem
//                         value="moderator"
//                         className="hover:bg-[#E4E8EA] cursor-pointer"
//                       >
//                         Moderator
//                       </SelectItem>
//                       <SelectItem
//                         value="user"
//                         className="hover:bg-[#E4E8EA] cursor-pointer"
//                       >
//                         User
//                       </SelectItem>
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Buttons */}
//               <div className="flex justify-end gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setIsDialogOpen(false)}
//                   className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="cursor-pointer px-4 py-2 text-sm font-semibold text-white bg-[#346778] rounded-lg hover:bg-[#2c4a54] transition"
//                 >
//                   + Add New Staff Account
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PatientManagement;
