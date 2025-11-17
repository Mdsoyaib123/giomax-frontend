          
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
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    { 
      id: "License", 
      label: "License & Documents",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      id: "Availability", 
      label: "Availability Settings",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: "Payout", 
      label: "Payout Methods",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    { 
      id: "Notification", 
      label: "Notification Settings",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    },
    { 
      id: "Help", 
      label: "Help & Support",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  return (
    <div className=" bg-gray-50 mt-5">
      <div className=" ">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Clinic Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your clinic's public profile and contact information
          </p>
        </div>

        {/* Settings Navigation Buttons */}
        <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mt-5">
          <div className="flex flex-wrap">
            {settingsButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => setActiveTab(button.id as typeof activeTab)}
                className={`flex-1 min-w-[140px] px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer
                  ${
                    activeTab === button.id
                      ? "bg-blue-600 text-white"
: "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                  }`}
              >
                {button.icon}
                <span className="hidden sm:inline">{button.label}</span>
                <span className="sm:hidden">{button.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ClinicSettings Content */}
        <div className="w-full">
          <ClinicSettings activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;   
          
          
          
          
          
          
          
          
          // import { useState } from "react";
// import icon1 from "@assets/1.png";
// import icon2 from "@assets/2.png";
// import icon3 from "@assets/3.png";
// import icon4 from "@assets/4.png";
// import icon5 from "@assets/5.png";
// import icon6 from "@assets/6.png";

// // ClinicSettings Component (inline)
// const ClinicSettings = ({ activeTab }: { activeTab: string }) => {
//   const [clinicName, setClinicName] = useState("Wardier Medical Clinic");
//   const [email, setEmail] = useState("wardier.clinic@gmail.com");
//   const [phone, setPhone] = useState("(+995) 126 - 245 -78936");
//   const [address, setAddress] = useState(" 12 Rustaveli Street, Vake District, Tbilisi, Georgia");

//   const renderClinicProfile = () => (
//     <div className="bg-white rounded-xl border border-gray-200 p-6">
//       <h2 className="text-xl font-semibold text-gray-800 mb-6">Clinic Information</h2>
      
//       <div className="space-y-5">
//         {/* Clinic Name & Email Address Row */}
//         <div className="grid grid-cols-2 gap-5">
//           <div>
//             <label className="block text-sm font-medium text-black mb-2">
//               Clinic Name <span className="text-black mb-2">*</span>
//             </label>
//             <input
//               type="text"
//               value={clinicName}
//               onChange={(e) => setClinicName(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-black mb-2">
//               Email Address <span className="text-black mb-2">*</span>
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//             />
//           </div>
//         </div>

//         {/* Phone Number & Address Row */}
//         <div className="grid grid-cols-2 gap-5">
//           <div>
//             <label className="block text-sm font-medium text-black mb-2">
//               Phone Number <span className="text-black mb-2">*</span>
//             </label>
//             <input
//               type="tel"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-black mb-2">
//               Address <span className="text-black mb-2">*</span>
//             </label>
//             <input
//               type="text"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//             />
//           </div>
//         </div>

//       </div>
//     </div>
//   );

//   const renderLicense = () => (
//     <div className="bg-white rounded-xl border border-gray-200 p-6">
//       <h2 className="text-xl font-semibold text-gray-800 mb-4">License & Documents</h2>
//       <p className="text-gray-600 mb-6">Upload and manage your clinic's licenses and legal documents</p>
      
//       <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//         <div className="text-5xl mb-3">📄</div>
//         <p className="text-gray-600 mb-2">Drag and drop your documents here</p>
//         <p className="text-sm text-gray-500 mb-4">or</p>
//         <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium">
//           Browse Files
//         </button>
//       </div>
//     </div>
//   );

//   const renderAvailability = () => (
//     <div className="bg-white rounded-xl border border-gray-200 p-6">
//       <h2 className="text-xl font-semibold text-gray-800 mb-4">Availability Settings</h2>
//       <p className="text-gray-600 mb-6">Set your working hours and availability schedule</p>
      
//       <div className="space-y-4">
//         {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
//           <div key={day} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
//             <input type="checkbox" className="w-5 h-5" defaultChecked={day !== "Sunday"} />
//             <span className="font-medium text-gray-700 w-24">{day}</span>
//             <input type="time" className="px-3 py-2 border border-gray-300 rounded" defaultValue="09:00" />
//             <span className="text-gray-500">to</span>
//             <input type="time" className="px-3 py-2 border border-gray-300 rounded" defaultValue="17:00" />
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const renderPayout = () => (
//     <div className="bg-white rounded-xl border border-gray-200 p-6">
//       <h2 className="text-xl font-semibold text-gray-800 mb-4">Payout Methods</h2>
//       <p className="text-gray-600 mb-6">Manage your payment methods and billing information</p>
      
//       <div className="space-y-4">
//         <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
//               <span className="text-2xl">💳</span>
//             </div>
//             <div>
//               <p className="font-medium text-gray-800">Bank Account</p>
//               <p className="text-sm text-gray-500">•••• 4567</p>
//             </div>
//           </div>
//           <button className="text-blue-500 hover:text-blue-600 font-medium">Edit</button>
//         </div>
        
//         <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-500 transition font-medium">
//           + Add Payment Method
//         </button>
//       </div>
//     </div>
//   );

//   const renderNotification = () => (
//     <div className="bg-white rounded-xl border border-gray-200 p-6">
//       <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Settings</h2>
//       <p className="text-gray-600 mb-6">Choose what notifications you want to receive</p>
      
//       <div className="space-y-4">
//         {[
//           { title: "Email Notifications", desc: "Receive appointment updates via email" },
//           { title: "SMS Notifications", desc: "Get text messages for urgent updates" },
//           { title: "Push Notifications", desc: "Browser notifications for new bookings" },
//           { title: "Booking Reminders", desc: "Daily summary of upcoming appointments" },
//         ].map((item) => (
//           <div key={item.title} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//             <div>
//               <p className="font-medium text-gray-800">{item.title}</p>
//               <p className="text-sm text-gray-500">{item.desc}</p>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input type="checkbox" className="sr-only peer" defaultChecked />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//             </label>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const renderHelp = () => (
//     <div className="bg-white rounded-xl border border-gray-200 p-6">
//       <h2 className="text-xl font-semibold text-gray-800 mb-4">Help & Support</h2>
//       <p className="text-gray-600 mb-6">Get assistance and find answers to common questions</p>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-400 transition cursor-pointer">
//           <div className="text-3xl mb-3">📚</div>
//           <h3 className="font-semibold text-gray-800 mb-2">Documentation</h3>
//           <p className="text-sm text-gray-600">Browse our comprehensive guides</p>
//         </div>
        
//         <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-400 transition cursor-pointer">
//           <div className="text-3xl mb-3">💬</div>
//           <h3 className="font-semibold text-gray-800 mb-2">Live Chat</h3>
//           <p className="text-sm text-gray-600">Chat with our support team</p>
//         </div>
        
//         <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-400 transition cursor-pointer">
//           <div className="text-3xl mb-3">📧</div>
//           <h3 className="font-semibold text-gray-800 mb-2">Email Support</h3>
//           <p className="text-sm text-gray-600">support@clinic.com</p>
//         </div>
        
//         <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-400 transition cursor-pointer">
//           <div className="text-3xl mb-3">❓</div>
//           <h3 className="font-semibold text-gray-800 mb-2">FAQ</h3>
//           <p className="text-sm text-gray-600">Find quick answers</p>
//         </div>
//       </div>
//     </div>
//   );

//   switch (activeTab) {
//     case "ClinicProfile":
//       return renderClinicProfile();
//     case "License":
//       return renderLicense();
//     case "Availability":
//       return renderAvailability();
//     case "Payout":
//       return renderPayout();
//     case "Notification":
//       return renderNotification();
//     case "Help":
//       return renderHelp();
//     default:
//       return renderClinicProfile();
//   }
// };

// // Main SettingsManagement Component
// export default function SettingsManagement() {
//   const [activeTab, setActiveTab] = useState<
//     "ClinicProfile" | "License" | "Availability" | "Payout" | "Notification" | "Help"
//   >("ClinicProfile");

//   // Settings Tabs
//   const tabs = [
//     { id: "ClinicProfile", label: "Clinic Profile", icon: icon1 },
//     { id: "License", label: "License & Documents", icon: icon2 },
//     { id: "Availability", label: "Availability Settings", icon: icon3 },
//     { id: "Payout", label: "Payout Methods", icon: icon4 },
//     { id: "Notification", label: "Notification Settings", icon: icon5 },
//     { id: "Help", label: "Help & Support", icon: icon6 },
//   ];

//   const renderContent = () => {
//     return <ClinicSettings activeTab={activeTab} />;
//   };

//   return (
//     <div className="w-full space-y-6">
//       {/* Tabs Header */}
//       <div className="w-full bg-[#F5F6F9] border border-[#DBE0E5] rounded-xl overflow-hidden flex flex-wrap gap-2 p-2">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id as typeof activeTab)}
//             className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-2
//               ${
//                 activeTab === tab.id
//                   ? "bg-blue-500 text-white shadow-md font-semibold"
//                   : "text-gray-600 hover:bg-blue-50"
//               }`}
//           >
//             <img src={tab.icon} alt={tab.label} className="w-5 h-5 object-contain" />
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* Tab Content */}
//       <div className="w-full">{renderContent()}</div>
//     </div>
//   );
// }