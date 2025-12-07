import React, { useState } from "react";
import { X, ArrowLeft, UploadCloud, Clock, Edit } from "lucide-react";

interface DoctorData {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  serviceType: string;
  status: string;
  workingHour: string;
  totalAppointments: number;
  availabilitySchedule: string;
  certificateFile?: File; // Only this key is File
}

// 🔥 Exclude `certificateFile` so inputs never receive File type
type FormField = Exclude<keyof DoctorData, "certificateFile">;

const serviceTypeOptions = [
  "Select Service Type",
  "Online Only",
  "Clinic Visit Only",
  "Both (Online & Clinic Visit)",
];

const statusOptions = ["Select Status", "Active", "Inactive", "On Leave"];

const AddDoctorForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState<DoctorData>({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    serviceType: serviceTypeOptions[0],
    status: statusOptions[0],
    workingHour: "",
    availabilitySchedule: "",
    totalAppointments: 0,
  });

  const [_loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.certificateFile) {
      alert("Please upload the doctor's certificate!");
      return;
    }
    setLoading(true);
    console.log("Adding new doctor:", formData);

    setTimeout(() => {
      setLoading(false);
      alert("New doctor added successfully!");
      onClose();
    }, 1500);
  };

  // 🔥 Updated to use FormField (NO File type issues)
  const renderInput = (
    label: string,
    name: FormField,
    type: string = "text",
    placeholder: string,
    required: boolean = true,
    icon?: React.ReactNode
  ) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
        />
        {icon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
      </div>
    </div>
  );

  // 🔥 Updated to use FormField (only string fields allowed)
  const renderSelect = (
    label: string,
    name: FormField,
    options: string[],
    required: boolean = true
  ) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          required={required}
          className="w-full appearance-none px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
              disabled={option.includes("Select")}
            >
              {option}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-inter">
      <div className="bg-white rounded-xl max-w-4xl w-[1100px] relative shadow-2xl border border-gray-200 transform transition-all max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 mr-2 rounded-full hover:bg-gray-50"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Add New Doctor
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Fill in the doctor's information to add them to your clinic
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-4 p-1 rounded-full hover:bg-gray-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grow overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput(
                "Doctor Name",
                "name",
                "text",
                "Dr. David Giorgadze"
              )}
              {renderInput(
                "Email Address",
                "email",
                "email",
                "david.g@gmail.com"
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("Phone Number", "phone", "text", "+995 595 123456")}
              {renderInput(
                "License Number",
                "licenseNumber",
                "text",
                "MED-001-2024"
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderSelect("Service Type", "serviceType", serviceTypeOptions)}
              {renderSelect("Status", "status", statusOptions)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Upload Certificate <span className="text-red-500">*</span>
                </label>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  id="doctorCertificate"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      setFormData((prev) => ({
                        ...prev,
                        certificateFile: e.target.files![0],
                      }));
                    }
                  }}
                />

                <label
                  htmlFor="doctorCertificate"
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-blue-600 bg-white border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-5 h-5 mr-2" />
                  {formData.certificateFile
                    ? formData.certificateFile.name
                    : "Upload your doctor certificate"}
                </label>

                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, JPG, PNG (Max 5MB)
                </p>
              </div>

              {renderInput(
                "Working Hour",
                "workingHour",
                "text",
                "Select Doctor's Working Hour",
                true,
                <Clock className="w-4 h-4 text-gray-400" />
              )}
            </div>

            <div>
              {renderInput(
                "Availability Schedule",
                "availabilitySchedule",
                "text",
                "Monday, Tuesday, Wednesday, Friday"
              )}
              <p className="text-xs text-gray-500 mt-1">
                Separate days with commas
              </p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold w-[493px] h-[50px] rounded-2xl cursor-pointer text-gray-700 bg-[#EFF4FF] hover:bg-gray-200 transition-colors"
            >
              Close
            </button>

            <button
              type="submit"
              className="px-6 py-2 cursor-pointer text-sm font-semibold w-[493px] h-[50px] rounded-2xl text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Add Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorForm;

// import React, { useState } from "react";
// import { X, ArrowLeft, UploadCloud, Clock, Edit } from "lucide-react";

// interface DoctorData {
//   name: string;
//   email: string;
//   phone: string;
//   licenseNumber: string;
//   serviceType: string;
//   status: string;
//   workingHour: string;
//   availabilitySchedule: string;
//   certificateFile?: File; // Added for uploaded file
// }

// const serviceTypeOptions = [
//   "Select Service Type",
//   "Online Only",
//   "Clinic Visit Only",
//   "Both (Online & Clinic Visit)",
// ];
// const statusOptions = ["Select Status", "Active", "Inactive", "On Leave"];

// const AddDoctorForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
//   const [formData, setFormData] = useState<DoctorData>({
//     name: "",
//     email: "",
//     phone: "",
//     licenseNumber: "",
//     serviceType: serviceTypeOptions[0],
//     status: statusOptions[0],
//     workingHour: "",
//     availabilitySchedule: "",
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.certificateFile) {
//       alert("Please upload the doctor's certificate!");
//       return;
//     }
//     setLoading(true);
//     console.log("Adding new doctor:", formData);
//     // Simulate API call
//     setTimeout(() => {
//       setLoading(false);
//       alert("New doctor added successfully!");
//       onClose();
//     }, 1500);
//   };

//   // Helper for input fields
//   const renderInput = (
//     label: string,
//     name: keyof DoctorData,
//     type: string = "text",
//     placeholder: string,
//     required: boolean = true,
//     icon?: React.ReactNode
//   ) => (
//     <div>
//       <label className="block text-sm font-semibold text-gray-700 mb-1">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       <div className="relative">
//         <input
//           type={type}
//           name={name as string}
//           value={formData[name]}
//           onChange={handleChange}
//           placeholder={placeholder}
//           required={required}
//           className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
//         />
//         {icon && (
//           <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//             {icon}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   // Helper for select fields
//   const renderSelect = (
//     label: string,
//     name: keyof DoctorData,
//     options: string[],
//     required: boolean = true
//   ) => (
//     <div>
//       <label className="block text-sm font-semibold text-gray-700 mb-1">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       <div className="relative">
//         <select
//           name={name as string}
//           value={formData[name]}
//           onChange={handleChange}
//           required={required}
//           className="w-full appearance-none px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
//         >
//           {options.map((option) => (
//             <option
//               key={option}
//               value={option}
//               disabled={option.includes("Select")}
//             >
//               {option}
//             </option>
//           ))}
//         </select>
//         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//           <svg
//             className="fill-current h-4 w-4"
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 20 20"
//           >
//             <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
//           </svg>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-inter">
//       <div className="bg-white rounded-xl max-w-4xl w-[1100px] relative shadow-2xl border border-gray-200 transform transition-all max-h-[95vh] overflow-hidden flex flex-col">
//         {/* Header */}
//         <div className="flex items-start justify-between p-6 border-b border-gray-100 shrink-0">
//           <div className="flex items-center">
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700 transition-colors p-1 mr-2 rounded-full hover:bg-gray-50"
//               aria-label="Go Back"
//             >
//               <ArrowLeft className="w-6 h-6" />
//             </button>
//             <div>
//               <h2 className="text-xl font-bold text-gray-900">
//                 Add New Doctor
//               </h2>
//               <p className="text-sm text-gray-500 mt-1">
//                 Fill in the doctor's information to add them to your clinic
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors ml-4 p-1 rounded-full hover:bg-gray-50"
//             aria-label="Close"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Form Content Area */}
//         <form onSubmit={handleSubmit} className="grow overflow-y-auto">
//           <div className="p-6 space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {renderInput(
//                 "Doctor Name",
//                 "name",
//                 "text",
//                 "Dr. David Giorgadze"
//               )}
//               {renderInput(
//                 "Email Address",
//                 "email",
//                 "email",
//                 "david.g@gmail.com"
//               )}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {renderInput("Phone Number", "phone", "text", "+995 595 123456")}
//               {renderInput(
//                 "License Number",
//                 "licenseNumber",
//                 "text",
//                 "MED-001-2024"
//               )}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {renderSelect("Service Type", "serviceType", serviceTypeOptions)}
//               {renderSelect("Status", "status", statusOptions)}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* File Upload */}
//               <div>
//                 <label className="block text-sm font-sans font-semibold text-gray-700 mb-1">
//                   Upload Certificate <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="file"
//                   accept=".pdf,.jpg,.jpeg,.png"
//                   id="doctorCertificate"
//                   className="hidden"
//                   onChange={(e) => {
//                     if (e.target.files && e.target.files.length > 0) {
//                       const file = e.target.files[0];
//                       console.log("Selected file:", file);
//                       setFormData((prev) => ({
//                         ...prev,
//                         certificateFile: file,
//                       }));
//                     }
//                   }}
//                 />
//                 <label
//                   htmlFor="doctorCertificate"
//                   className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-blue-600 bg-white border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
//                 >
//                   <UploadCloud className="w-5 h-5 mr-2" />
//                   {formData.certificateFile
//                     ? formData.certificateFile.name
//                     : "Upload your doctor certificate"}
//                 </label>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Supported formats: PDF, JPG, PNG (Max 5MB)
//                 </p>
//               </div>

//               {renderInput(
//                 "Working Hour",
//                 "workingHour",
//                 "text",
//                 "Select Doctor's Working Hour",
//                 true,
//                 <Clock className="w-4 h-4 text-gray-400" />
//               )}
//             </div>

//             <div>
//               {renderInput(
//                 "Availability Schedule",
//                 "availabilitySchedule",
//                 "text",
//                 "Monday, Tuesday, Wednesday, Friday"
//               )}
//               <p className="text-xs text-gray-500 mt-1">
//                 Separate days with commas (e.g., Monday, Tuesday, Wednesday)
//               </p>
//             </div>
//           </div>

//           {/* Footer/Action Buttons */}
//           <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 shrink-0 w-full bg-white">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2.5 text-sm font-semibold w-[493px] h-[50px] rounded-2xl  cursor-pointer text-gray-700 bg-[#EFF4FF] hover:bg-gray-200 transition-colors border border-transparent"
//             >
//               Close
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2 cursor-pointer text-sm font-semibold w-[493px] h-[50px] rounded-2xl text-[#FFFFFF] bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/30 flex items-center justify-center gap-2 transition-colors"
//             >
//               <Edit className="w-4 h-4" />
//               Add Doctor
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddDoctorForm;
