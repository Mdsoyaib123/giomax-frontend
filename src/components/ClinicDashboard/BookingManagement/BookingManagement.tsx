import { useState } from "react";
import Cancelled from "./Cancelled";
import Upcoming from "./Upcoming";
import Completed from "./Completed";

const BookingManagement = () => {
  const [activeTab, setActiveTab] = useState<
    "Upcoming" | "Completed" | "Cancelled"
  >("Upcoming");

  const tabs = [
    { id: "Upcoming", label: "Upcoming" },
    { id: "Completed", label: "Completed" },
    { id: "Cancelled", label: "Cancelled" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Upcoming":
        return <Upcoming />;
      case "Completed":
        return <Completed />;
      case "Cancelled":
        return <Cancelled />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto mt-10 w-full space-y-6">
      {/* ===== Tabs Header ===== */}
      <div className="w-full bg-[#F5F6F9] border border-blue-200 rounded-2xl overflow-hidden flex flex-col sm:flex-row">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`w-full sm:flex-1 cursor-pointer flex items-center justify-center gap-2 py-4 text-base font-medium transition-all duration-300
              ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white shadow-md font-semibold"
                  : "text-[#81807D] hover:bg-blue-100"
              }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ===== Tab Content ===== */}
      <div className="w-full">{renderContent()}</div>
    </div>
  );
};

export default BookingManagement;


// import { Clock, Search, Bell, ChevronDown } from 'lucide-react';
// import { useState } from 'react';

// // Types
// interface Appointment {
//   id: string;
//   patientName: string;
//   doctorName: string;
//   visitType: 'Online' | 'Clinic Visit';
//   time: string;
//   status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
// }

// const BookingManagement = () => {
//   const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
//   const [searchQuery, setSearchQuery] = useState('');

//   // All appointments data
//   const allAppointments: Appointment[] = [
//     // Upcoming
//     {
//       id: '1',
//       patientName: 'Alex Johnson',
//       doctorName: 'Dr. Michael Chen',
//       visitType: 'Online',
//       time: '2:00 PM',
//       status: 'Confirmed'
//     },
//     {
//       id: '2',
//       patientName: 'Clara Watson',
//       doctorName: 'Dr. Michael Chen',
//       visitType: 'Online',
//       time: '2:00 PM',
//       status: 'Pending'
//     },
//     {
//       id: '3',
//       patientName: 'James Bond',
//       doctorName: 'Dr. Michael Chen',
//       visitType: 'Online',
//       time: '2:00 PM',
//       status: 'Confirmed'
//     },
//     {
//       id: '4',
//       patientName: 'Lawal Mogue',
//       doctorName: 'Dr. Michael Chen',
//       visitType: 'Online',
//       time: '2:00 PM',
//       status: 'Confirmed'
//     },
//     // Completed
//     {
//       id: '5',
//       patientName: 'Alex Johnson',
//       doctorName: 'Dr. Michael Chen',
//       visitType: 'Online',
//       time: '2:00 PM',
//       status: 'Completed'
//     },
//     {
//       id: '6',
//       patientName: 'Clara Watson',
//       doctorName: 'Dr. Michael Chen',
//       visitType: 'Clinic Visit',
//       time: '2:00 PM',
//       status: 'Completed'
//     },
//     {
//       id: '7',
//       patientName: 'James Bond',
//       doctorName: 'Dr. Michael Chen',
//       visitType: 'Clinic Visit',
//       time: '2:00 PM',
//       status: 'Completed'
//     },
//     // Cancelled
//     {
//       id: '8',
//       patientName: 'Alex Johnson',
//       doctorName: 'Dr. Michael Chen',
//       visitType: 'Online',
//       time: '2:00 PM',
//       status: 'Cancelled'
//     },
//     {
//       id: '9',
//       patientName: 'Clara Watson',
//       doctorName: 'Dr. Michael Chen',
//       visitType: 'Online',
//       time: '2:00 PM',
//       status: 'Cancelled'
//     }
//   ];

//   // Filter appointments by tab
//   const getFilteredAppointments = () => {
//     let filtered = allAppointments;
    
//     if (activeTab === 'upcoming') {
//       filtered = filtered.filter(apt => apt.status === 'Confirmed' || apt.status === 'Pending');
//     } else if (activeTab === 'completed') {
//       filtered = filtered.filter(apt => apt.status === 'Completed');
//     } else if (activeTab === 'cancelled') {
//       filtered = filtered.filter(apt => apt.status === 'Cancelled');
//     }

//     // Apply search filter
//     if (searchQuery) {
//       filtered = filtered.filter(apt =>
//         apt.patientName.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     return filtered;
//   };

//   const filteredAppointments = getFilteredAppointments();

//   const getBorderColor = () => {
//     if (activeTab === 'cancelled') return 'hover:border-red-500';
//     if (activeTab === 'completed') return 'hover:border-blue-500';
//     return 'hover:border-blue-500';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto hidden lg:block">
//         <div className="p-6">
//           <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
//         </div>
//         <nav className="px-4 space-y-1">
//           <div className="bg-blue-500 text-white rounded-lg px-4 py-3 font-medium">
//             Booking Management
//           </div>
//           <div className="px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
//             Doctor Management
//           </div>
//           <div className="px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
//             Messages
//           </div>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <div className="lg:ml-64">
//         {/* Header */}
//         <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
//                 <span className="text-white font-semibold">🏥</span>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">
//                   All Appointments/{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <button className="relative p-2 hover:bg-gray-100 rounded-full">
//                 <Bell className="w-5 h-5 text-gray-600" />
//                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//               </button>
//               <div className="flex items-center space-x-2">
//                 <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
//                 <span className="text-sm font-medium text-gray-700 hidden sm:block">Snorg M</span>
//                 <ChevronDown className="w-4 h-4 text-gray-400" />
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Content Area */}
//         <main className="p-4 lg:p-8">
//           {/* Page Title */}
//           <div className="bg-cyan-100 rounded-lg px-6 py-4 mb-6">
//             <h1 className="text-2xl font-bold text-gray-800">All Appointments</h1>
//           </div>

//           {/* Search Bar */}
//           <div className="mb-6">
//             <div className="relative max-w-md">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search anything here..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="flex gap-2 mb-6 overflow-x-auto">
//             <button
//               onClick={() => setActiveTab('upcoming')}
//               className={`px-8 py-3 text-base font-medium rounded-lg whitespace-nowrap transition-all ${
//                 activeTab === 'upcoming'
//                   ? 'bg-blue-500 text-white shadow-md'
//                   : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
//               }`}
//             >
//               Upcoming
//             </button>
//             <button
//               onClick={() => setActiveTab('completed')}
//               className={`px-8 py-3 text-base font-medium rounded-lg whitespace-nowrap transition-all ${
//                 activeTab === 'completed'
//                   ? 'bg-blue-500 text-white shadow-md'
//                   : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
//               }`}
//             >
//               Completed
//             </button>
//             <button
//               onClick={() => setActiveTab('cancelled')}
//               className={`px-8 py-3 text-base font-medium rounded-lg whitespace-nowrap transition-all ${
//                 activeTab === 'cancelled'
//                   ? 'bg-blue-500 text-white shadow-md'
//                   : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
//               }`}
//             >
//               Cancelled
//             </button>
//           </div>

//           {/* Appointments List */}
//           <div className="bg-white rounded-lg shadow-sm">
//             <div className="p-4 border-b border-gray-200">
//               <h2 className="text-lg font-semibold text-gray-800">All Appointments</h2>
//             </div>
//             <div className="divide-y divide-gray-200">
//               {filteredAppointments.map((appointment) => (
//                 <div key={appointment.id} className={`p-6 hover:bg-gray-50 transition-colors border-l-4 border-transparent ${getBorderColor()}`}>
//                   <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
//                     {/* Patient Info */}
//                     <div className="flex-1">
//                       <h3 className="text-base font-semibold text-gray-900 mb-2">
//                         {appointment.patientName}
//                       </h3>
//                       <p className="text-sm text-gray-500 mb-1">
//                         Appointment with
//                       </p>
//                       <p className="text-sm text-gray-600 mb-2">
//                         {appointment.doctorName}
//                       </p>
//                       <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
//                         {appointment.visitType}
//                       </button>
//                     </div>

//                     {/* Right Side: Status and Time */}
//                     <div className="flex flex-col items-end space-y-3">
//                       {/* Status Badge */}
//                       <span className={`px-3 py-1 rounded text-sm font-medium border ${
//                         appointment.status === 'Confirmed'
//                           ? 'border-green-600 text-green-600 bg-white'
//                           : appointment.status === 'Pending'
//                           ? 'border-yellow-600 text-yellow-600 bg-white'
//                           : appointment.status === 'Completed'
//                           ? 'border-blue-600 text-blue-600 bg-white'
//                           : 'border-red-600 text-red-600 bg-white'
//                       }`}>
//                         {appointment.status}
//                       </span>

//                       {/* Time */}
//                       <div className="flex items-center text-gray-500">
//                         <Clock className="w-4 h-4 mr-1" />
//                         <span className="text-sm">{appointment.time}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Action Buttons - Only for Pending appointments */}
//                   {appointment.status === 'Pending' && (
//                     <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
//                       <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
//                         Accept
//                       </button>
//                       <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors">
//                         Reject
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </main>
//       </div>


//     </div>
//   );
// };

// export default BookingManagement;