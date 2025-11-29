import { useState } from "react";
import ClinicSettings from "./ClinicSettings";

const SettingsManagement = () => {
  const [activeTab, setActiveTab] = useState<
    | "ClinicProfile"
    | "License"
    | "Availability"
    | "Payout"
    | "Notification"
    | "Help"
  >("ClinicProfile");

  const settingsButtons = [
    {
      id: "ClinicProfile",
      label: "Clinic Profile",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      id: "License",
      label: "License & Documents",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      id: "Availability",
      label: "Availability Settings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "Payout",
      label: "Payout Methods",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
    {
      id: "Notification",
      label: "Notification Settings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      ),
    },
    {
      id: "Help",
      label: "Help & Support",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Clinic Settings
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Manage your clinic's public profile and contact information
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 sm:gap-2">
          {settingsButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => setActiveTab(button.id as typeof activeTab)}
              className={`flex items-center justify-center gap-2 px-3 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all duration-200 rounded-lg cursor-pointer
                ${
                  activeTab === button.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`}
            >
              {button.icon}
              <span className="hidden sm:inline">{button.label}</span>
              <span className="sm:hidden">{button.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
        <ClinicSettings activeTab={activeTab} />
      </div>
    </div>
  );
};

export default SettingsManagement;


// import { useState } from "react";
// import ClinicSettings from "./ClinicSettings";

// const SettingsManagement = () => {
//   const [activeTab, setActiveTab] = useState<
//     | "ClinicProfile"
//     | "License"
//     | "Availability"
//     | "Payout"
//     | "Notification"
//     | "Help"
//   >("ClinicProfile");

//   const settingsButtons = [
//     {
//       id: "ClinicProfile",
//       label: "Clinic Profile",
//       icon: (
//         <svg
//           className="w-4 h-4"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
//           />
//         </svg>
//       ),
//     },
//     {
//       id: "License",
//       label: "License & Documents",
//       icon: (
//         <svg
//           className="w-4 h-4"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//           />
//         </svg>
//       ),
//     },
//     {
//       id: "Availability",
//       label: "Availability Settings",
//       icon: (
//         <svg
//           className="w-4 h-4"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//           />
//         </svg>
//       ),
//     },
//     {
//       id: "Payout",
//       label: "Payout Methods",
//       icon: (
//         <svg
//           className="w-4 h-4"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
//           />
//         </svg>
//       ),
//     },
//     {
//       id: "Notification",
//       label: "Notification Settings",
//       icon: (
//         <svg
//           className="w-4 h-4"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//           />
//         </svg>
//       ),
//     },
//     {
//       id: "Help",
//       label: "Help & Support",
//       icon: (
//         <svg
//           className="w-4 h-4"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//           />
//         </svg>
//       ),
//     },
//   ];

//   return (
//     <div className=" bg-gray-50 ">
//       <div className=" ">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-semibold text-gray-800">
//             Clinic Settings
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Manage your clinic's public profile and contact information
//           </p>
//         </div>

//         {/* Settings Navigation Buttons */}
//         <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mt-5">
//           <div className="flex flex-wrap">
//             {settingsButtons.map((button) => (
//               <button
//                 key={button.id}
//                 onClick={() => setActiveTab(button.id as typeof activeTab)}
//                 className={`flex-1 min-w-[140px] px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer
//                   ${
//                     activeTab === button.id
//                       ? "bg-blue-600 text-white"
//                       : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
//                   }`}
//               >
//                 {button.icon}
//                 <span className="hidden sm:inline">{button.label}</span>
//                 <span className="sm:hidden">{button.label.split(" ")[0]}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ClinicSettings Content */}
//         <div className="w-full">
//           <ClinicSettings activeTab={activeTab} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SettingsManagement;
