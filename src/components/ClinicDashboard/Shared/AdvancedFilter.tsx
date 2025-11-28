import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface AdvancedFilterProps {
  onClose: () => void;
}

const AdvancedFilter = ({ onClose }: AdvancedFilterProps) => {
  console.log(onClose);

  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const handleClear = () => {
    setPatientName("");
    setDoctorName("");
    setAppointmentDate("");
    setAppointmentTime("");
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-96 p-6 relative shadow-lg">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <AiOutlineClose size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Advanced Filter</h2>

        {/* Avatar */}
        <div className="absolute top-4 right-12">
          <img
            src="https://i.pravatar.cc/40"
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Patient Name</label>
            <input
              type="text"
              placeholder="Enter Patient Name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Doctor Name</label>
            <input
              type="text"
              placeholder="Enter Doctor Name"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Select Appointment Date
            </label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Select Appointment Time
            </label>
            <input
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear All
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilter;

// import { useState } from "react";
// import { AiOutlineClose } from "react-icons/ai";

// const AdvancedFilter = ({ onClose }) => {
//     console.log(onClose)
//   const [patientName, setPatientName] = useState("");
//   const [doctorName, setDoctorName] = useState("");
//   const [appointmentDate, setAppointmentDate] = useState("");
//   const [appointmentTime, setAppointmentTime] = useState("");

//   const handleClear = () => {
//     setPatientName("");
//     setDoctorName("");
//     setAppointmentDate("");
//     setAppointmentTime("");
//   };

//   return (
//     <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//       <div className="bg-white rounded-2xl w-96 p-6 relative shadow-lg">
//         {/* Close */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
//         >
//           <AiOutlineClose size={20} />
//         </button>

//         <h2 className="text-xl font-semibold mb-6">Advanced Filter</h2>

//         {/* Avatar */}
//         <div className="absolute top-4 right-12">
//           <img
//             src="https://i.pravatar.cc/40"
//             alt="Avatar"
//             className="w-10 h-10 rounded-full"
//           />
//         </div>

//         {/* Form */}
//         <div className="space-y-4">
//           <div>
//             <label className="text-sm font-medium">Patient Name</label>
//             <input
//               type="text"
//               placeholder="Enter Patient Name"
//               value={patientName}
//               onChange={(e) => setPatientName(e.target.value)}
//               className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">Doctor Name</label>
//             <input
//               type="text"
//               placeholder="Enter Doctor Name"
//               value={doctorName}
//               onChange={(e) => setDoctorName(e.target.value)}
//               className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">
//               Select Appointment Date
//             </label>
//             <input
//               type="date"
//               value={appointmentDate}
//               onChange={(e) => setAppointmentDate(e.target.value)}
//               className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">
//               Select Appointment Time
//             </label>
//             <input
//               type="time"
//               value={appointmentTime}
//               onChange={(e) => setAppointmentTime(e.target.value)}
//               className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-between mt-6">
//           <button
//             onClick={handleClear}
//             className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
//           >
//             Clear All
//           </button>

//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
//           >
//             Cancel
//           </button>

//           <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
//             Apply Filter
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdvancedFilter;


// import { useState } from "react";
// import { AiOutlineClose } from "react-icons/ai";

// const AdvancedFilter = () => {
//     const [open, setOpen] = useState(false);
//     const [patientName, setPatientName] = useState("");
//     const [doctorName, setDoctorName] = useState("");
//     const [appointmentDate, setAppointmentDate] = useState("");
//     const [appointmentTime, setAppointmentTime] = useState("");
//     console.log(open);
//     const handleClear = () => {
//         setPatientName("");
//         setDoctorName("");
//         setAppointmentDate("");
//         setAppointmentTime("");
//     };

//     return (
//         <>
//             <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//                 <div className="bg-white rounded-2xl w-96 p-6 relative shadow-lg">
//                     {/* Close Button */}
//                     <button
//                         onClick={() => setOpen(false)}
//                         className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
//                     >
//                         <AiOutlineClose size={20} />
//                     </button>

//                     <h2 className="text-xl font-semibold mb-6">Advanced Filter</h2>

//                     {/* Avatar */}
//                     <div className="absolute top-4 right-12">
//                         <img
//                             src="https://i.pravatar.cc/40"
//                             alt="Avatar"
//                             className="w-10 h-10 rounded-full"
//                         />
//                     </div>

//                     {/* Form Fields */}
//                     <div className="space-y-4">
//                         <div>
//                             <label className="text-sm font-medium">Patient Name</label>
//                             <input
//                                 type="text"
//                                 placeholder="Enter Patient Name"
//                                 value={patientName}
//                                 onChange={(e) => setPatientName(e.target.value)}
//                                 className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>

//                         <div>
//                             <label className="text-sm font-medium">Doctor Name</label>
//                             <input
//                                 type="text"
//                                 placeholder="Enter Doctor Name"
//                                 value={doctorName}
//                                 onChange={(e) => setDoctorName(e.target.value)}
//                                 className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>

//                         <div>
//                             <label className="text-sm font-medium">Select Appointment Date</label>
//                             <input
//                                 type="date"
//                                 value={appointmentDate}
//                                 onChange={(e) => setAppointmentDate(e.target.value)}
//                                 className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>

//                         <div>
//                             <label className="text-sm font-medium">Select Appointment Time</label>
//                             <input
//                                 type="time"
//                                 value={appointmentTime}
//                                 onChange={(e) => setAppointmentTime(e.target.value)}
//                                 className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>
//                     </div>

//                     {/* Buttons */}
//                     <div className="flex justify-between mt-6">
//                         <button
//                             onClick={handleClear}
//                             className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
//                         >
//                             Clear All
//                         </button>
//                         <button
//                             onClick={() => setOpen(false)}
//                             className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                         >
//                             Apply Filter
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AdvancedFilter;
