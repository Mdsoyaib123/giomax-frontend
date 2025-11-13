import React, { useState } from "react";
import { FaEye, FaEdit, FaSearch } from "react-icons/fa";
import SectionTitle from "@/common/SectionTitle";

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  serviceType: "Both" | "Clinic Visit" | "Home Visit";
  phone: string;
  appointments: number;
}

const DoctorTable: React.FC = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const doctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. David Giorgadze",
      email: "david.gj@gmail.com",
      specialty: "General Practitioner",
      serviceType: "Both",
      phone: "+995 595 123 456",
      appointments: 145,
    },
    {
      id: "2",
      name: "Dr. Lasha Beridze",
      email: "michael.g@gmail.com",
      specialty: "Cardiologist",
      serviceType: "Clinic Visit",
      phone: "+995 577 987 854",
      appointments: 50,
    },
    {
      id: "3",
      name: "Dr. Nino Kapanadze",
      email: "emily.r@gmail.com",
      specialty: "Pediatrician",
      serviceType: "Clinic Visit",
      phone: "+995 599 001 223",
      appointments: 20,
    },
    {
      id: "4",
      name: "Dr. Irakli Tvalavadze",
      email: "irakli.tvalavadze@gmail.com",
      specialty: "Orthopedic Surgeon",
      serviceType: "Both",
      phone: "+995 32 245 6789",
      appointments: 30,
    },
    {
      id: "5",
      name: "Dr. Salome Abashidze",
      email: "salome.abashidze@gmail.com",
      specialty: "Dermatologist",
      serviceType: "Clinic Visit",
      phone: "+995 434 102 345",
      appointments: 10,
    },
    {
      id: "6",
      name: "Dr. Giorgi Lomidze",
      email: "giorgi.lomidze@gmail.com",
      specialty: "Neurologist",
      serviceType: "Clinic Visit",
      phone: "+995 423 789 012",
      appointments: 15,
    },
    {
      id: "7",
      name: "Dr. Eka Mchedlishvili",
      email: "eka.mchedlishvili@gmail.com",
      specialty: "Gynecologist",
      serviceType: "Both",
      phone: "+995 555 334 455",
      appointments: 25,
    },
    {
      id: "8",
      name: "Dr. Levan Khutsishvili",
      email: "levan.khutsishvili@gmail.com",
      specialty: "ENT Specialist",
      serviceType: "Clinic Visit",
      phone: "+995 341 506 708",
      appointments: 30,
    },
    {
      id: "9",
      name: "Dr. Maia Kereselidze",
      email: "maia.kereselidze@gmail.com",
      specialty: "Psychiatrist",
      serviceType: "Both",
      phone: "+995 593 678 901",
      appointments: 25,
    },
  ];

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      doctor.email.toLowerCase().includes(search.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedDoctors = filteredDoctors.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div>
      <div className="ml-3 mb-10">
        <SectionTitle
          title="Clinic Management"
          description="Manage and approve clinic registrations"
        />
      </div>

      <div className="p-6 ml-2 w-full xl:w-[1599px] mx-auto bg-white rounded-xl shadow-md border border-gray-200">
        {/* Header and search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
          <h2 className="text-lg font-semibold text-gray-800">
            All Doctors Information
          </h2>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-[800px] w-full text-sm">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                  Doctor Name
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                  Email Address
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                  Specialty
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                  Service Type
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                  Phone Number
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-700 whitespace-nowrap">
                  Total Appointments
                </th>
                <th className="px-6 py-4 text-center font-medium text-gray-700 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {displayedDoctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {doctor.name}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{doctor.email}</td>
                  <td className="px-6 py-4 text-gray-700">{doctor.specialty}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full pt-[8px] pr-[12px] pb-[8px] w-[86px] ${
                        doctor.serviceType === "Both"
                          ? "bg-[#BEDBFF] text-[#2E6FF3]"
                          : "bg-[#BEDBFF] text-[#2E6FF3]"
                      }`}
                    >
                      {doctor.serviceType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{doctor.phone}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {doctor.appointments}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="flex items-center gap-1 bg-[#2E6FF3] text-white px-3 py-1.5 rounded-md text-xs hover:bg-blue-600 transition">
                        <FaEye className="text-xs" /> View
                      </button>
                      <button className="flex items-center gap-1 bg-[#0B9CAC] text-white px-3 py-1.5 rounded-md text-xs hover:bg-teal-600 transition">
                        <FaEdit className="text-xs" /> Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p className="text-center sm:text-left">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {startIndex + displayedDoctors.length}
            </span>{" "}
            of <span className="font-medium text-blue-600 cursor-pointer hover:underline">
              {filteredDoctors.length} entries
            </span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100"
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
            >
              Prev
            </button>
            <button
              className="w-8 h-8 rounded-md border border-gray-300 bg-blue-500 text-white font-medium"
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
            <button
              className="w-8 h-8 rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
              onClick={() => setCurrentPage(2)}
            >
              2
            </button>
            <span className="px-2 text-gray-500">...</span>
            <button
              className="w-8 h-8 rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
              onClick={() => setCurrentPage(9)}
            >
              9
            </button>
            <button
              className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, 9))
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorTable;



// import React, { useState } from "react";
// import { FaEye, FaEdit, FaSearch } from "react-icons/fa";
// import SectionTitle from "@/common/SectionTitle";

// interface Doctor {
//   id: string;
//   name: string;
//   email: string;
//   specialty: string;
//   serviceType: "Both" | "Clinic Visit" | "Home Visit";
//   phone: string;
//   appointments: number;
// }

// const DoctorTable: React.FC = () => {
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 9;
// console.log(setCurrentPage);
//   const doctors: Doctor[] = [
//     {
//       id: "1",
//       name: "Dr. David Giorgadze",
//       email: "david.gj@gmail.com",
//       specialty: "General Practitioner",
//       serviceType: "Both",
//       phone: "+995 595 123 456",
//       appointments: 145,
//     },
//     {
//       id: "2",
//       name: "Dr. Lasha Beridze",
//       email: "michael.g@gmail.com",
//       specialty: "Cardiologist",
//       serviceType: "Clinic Visit",
//       phone: "+995 577 987 854",
//       appointments: 50,
//     },
//     {
//       id: "3",
//       name: "Dr. Nino Kapanadze",
//       email: "emily.r@gmail.com",
//       specialty: "Pediatrician",
//       serviceType: "Clinic Visit",
//       phone: "+995 599 001 223",
//       appointments: 20,
//     },
//     {
//       id: "4",
//       name: "Dr. Irakli Tvalavadze",
//       email: "irakli.tvalavadze@gmail.com",
//       specialty: "Orthopedic Surgeon",
//       serviceType: "Both",
//       phone: "+995 32 245 6789",
//       appointments: 30,
//     },
//     {
//       id: "5",
//       name: "Dr. Salome Abashidze",
//       email: "salome.abashidze@gmail.com",
//       specialty: "Dermatologist",
//       serviceType: "Clinic Visit",
//       phone: "+995 434 102 345",
//       appointments: 10,
//     },
//     {
//       id: "6",
//       name: "Dr. Giorgi Lomidze",
//       email: "giorgi.lomidze@gmail.com",
//       specialty: "Neurologist",
//       serviceType: "Clinic Visit",
//       phone: "+995 423 789 012",
//       appointments: 15,
//     },
//     {
//       id: "7",
//       name: "Dr. Eka Mchedlishvili",
//       email: "eka.mchedlishvili@gmail.com",
//       specialty: "Gynecologist",
//       serviceType: "Both",
//       phone: "+995 555 334 455",
//       appointments: 25,
//     },
//     {
//       id: "8",
//       name: "Dr. Levan Khutsishvili",
//       email: "levan.khutsishvili@gmail.com",
//       specialty: "ENT Specialist",
//       serviceType: "Clinic Visit",
//       phone: "+995 341 506 708",
//       appointments: 30,
//     },
//     {
//       id: "9",
//       name: "Dr. Maia Kereselidze",
//       email: "maia.kereselidze@gmail.com",
//       specialty: "Psychiatrist",
//       serviceType: "Both",
//       phone: "+995 593 678 901",
//       appointments: 25,
//     },
//   ];

//   const filteredDoctors = doctors.filter(
//     (doctor) =>
//       doctor.name.toLowerCase().includes(search.toLowerCase()) ||
//       doctor.email.toLowerCase().includes(search.toLowerCase()) ||
//       doctor.specialty.toLowerCase().includes(search.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const displayedDoctors = filteredDoctors.slice(
//     startIndex,
//     startIndex + itemsPerPage

//   );

//   return (
//     <div className="">
//       <div className="ml-3 mb-10">
//         <SectionTitle
//           title="Clinic Management"
//           description="Manage and approve clinic registrations"
//         />
//       </div>

//       <div className="p-6 ml-2 w-full xl:w-[1599px] mx-auto bg-white rounded-xl shadow-md border border-gray-200">
//         {/* Header and search */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
//           <h2 className="text-lg font-semibold text-gray-800">
//             All Doctors Information
//           </h2>

//           <div className="relative w-full md:w-72">
//             <input
//               type="text"
//               placeholder="Search patients..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//             />
//             <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto border border-gray-200 rounded-lg">
//           <table className="min-w-[800px] w-full text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 {[
//                   "Doctor Name",
//                   "Email Address",
//                   "Specialty",
//                   "Service Type",
//                   "Phone Number",
//                   "Total Appointments",
//                   "Actions",
//                 ].map((heading, index) => (
//                   <th
//                     key={index}
//                     className={`px-6 py-3 font-medium text-gray-600 ${
//                       heading === "Actions"
//                         ? "text-center"
//                         : "text-left"
//                     }`}
//                   >
//                     {heading}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-100">
//               {displayedDoctors.map((doctor) => (
//                 <tr
//                   key={doctor.id}
//                   className="hover:bg-gray-50 transition-colors duration-200"
//                 >
//                   <td className="px-6 py-4 text-gray-900 font-medium">
//                     {doctor.name}
//                   </td>
//                   <td className="px-6 py-4 text-gray-700">{doctor.email}</td>
//                   <td className="px-6 py-4 text-gray-700">{doctor.specialty}</td>
//                   <td className="px-6 py-4">
//                     <span
//                       className={`px-3 py-1 text-xs font-medium rounded-full pt-[8px] pr-[12px] pb-[8px]w-[86px] ${
//                         doctor.serviceType === "Both"
//                           ? "bg-[#BEDBFF] text-[#2E6FF3]"
//                           : doctor.serviceType === "Clinic Visit"
//                           ? "bg-[#BEDBFF] text-[#2E6FF3]"
//                           : "bg-[#BEDBFF] text-[#2E6FF3]"
//                       }`}
//                     >
//                       {doctor.serviceType}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-gray-700">{doctor.phone}</td>
//                   <td className="px-6 py-4 text-gray-700">
//                     {doctor.appointments}
//                   </td>
//                   <td className="px-6 py-4 text-center">
//                     <div className="flex justify-center gap-2">
//                       <button className="flex items-center gap-1 bg-[#2E6FF3] text-white px-3 py-1.5 rounded-md text-xs hover:bg-blue-600 transition">
//                         <FaEye className="text-xs" /> View
//                       </button>
//                       <button className="flex items-center gap-1 bg-[#0B9CAC] text-white px-3 py-1.5 rounded-md text-xs hover:bg-teal-600 transition">
//                         <FaEdit className="text-xs" /> Edit
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* ✅ Pagination section (responsive, no logic changed) */}
//         <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
//           <p className="text-center sm:text-left">
//             Showing <span className="font-medium">1</span> to{" "}
//             <span className="font-medium">9</span> of{" "}
//             <span className="font-medium text-blue-600 cursor-pointer hover:underline">
//               9 entries
//             </span>
//           </p>

//           <div className="flex flex-wrap items-center justify-center gap-2">
//             <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100">
//               Prev
//             </button>
//             <div className="flex items-center gap-1">
//               <button className="w-8 h-8 rounded-md border border-gray-300 bg-blue-500 text-white font-medium">
//                 1
//               </button>
//               <button className="w-8 h-8 rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-gray-700">
//                 2
//               </button>
//               <button className="w-8 h-8 rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-gray-700">
//                 3
//               </button>
//               <span className="px-2 text-gray-500">...</span>
//               <button className="w-8 h-8 rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-gray-700">
//                 9
//               </button>
//             </div>
//             <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100">
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorTable;
