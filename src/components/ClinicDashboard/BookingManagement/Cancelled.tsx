import { Clock } from 'lucide-react';
import { useState } from 'react';

// Types
interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  visitType: 'Online' | 'Clinic Visit';
  time: string;
  status: 'Cancelled';
}

const Cancelled = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Static cancelled appointment data
  const appointments: Appointment[] = [
    {
      id: '1',
      patientName: 'Alex Johnson',
      doctorName: 'Dr. Michael Chen',
      visitType: 'Online',
      time: '2:00 PM',
      status: 'Cancelled'
    },
    {
      id: '2',
      patientName: 'Clara Watson',
      doctorName: 'Dr. Michael Chen',
      visitType: 'Clinic Visit',
      time: '2:00 PM',
      status: 'Cancelled'
    },
   
  ];

  const filteredAppointments = appointments.filter(apt =>
    apt.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto hidden lg:block">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
        </div>
        <nav className="px-4 space-y-1">
          <div className="bg-blue-500 text-white rounded-lg px-4 py-3 font-medium">
            Booking Management
          </div>
          <div className="px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
            Doctor Management
          </div>
          <div className="px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
            Messages
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div>
        {/* Content Area */}
        <div>
          {/* Appointments List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">All Appointments</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-blue-500">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                    {/* Patient Info */}
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-2">
                        {appointment.patientName}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">Appointment with</p>
                      <p className="text-sm text-gray-600 mb-2">{appointment.doctorName}</p>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        {appointment.visitType}
                      </button>
                    </div>

                    {/* Right Side: Status and Time */}
                    <div className="flex flex-col items-end space-y-3">
                      {/* Status Badge */}
                      <span className="px-3 py-1 rounded text-sm font-medium border border-red-600 text-red-600 bg-white">
                        {appointment.status}
                      </span>

                      {/* Time */}
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{appointment.time}</span>
                      </div>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cancelled;

// import { Clock, Search, Bell, ChevronDown } from 'lucide-react';
// import { useState } from 'react';

// // Types
// interface Appointment {
//   id: string;
//   patientName: string;
//   doctorName: string;
//   visitType: 'Online' | 'Clinic Visit';
//   time: string;
//   status: 'Cancelled';
// }

// const Cancelled = () => {
//   const [searchQuery, setSearchQuery] = useState('');

//   // Static cancelled appointment data
//   const appointments: Appointment[] = [
//     {
//       id: '1',
//       patientName: 'Alex Johnson',
//       doctorName: 'Dr. Michael Chen',
//       visitType: 'Online',
//       time: '2:00 PM',
//       status: 'Cancelled'
//     },
//     {
//       id: '2',
//       patientName: 'Clara Watson',
//       doctorName: 'Dr. Michael Chen',
//       visitType: 'Online',
//       time: '2:00 PM',
//       status: 'Cancelled'
//     }
//   ];

//   const filteredAppointments = appointments.filter(apt =>
//     apt.patientName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

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
//                 <p className="text-sm text-gray-500">All Appointments/Cancelled</p>
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
//           <div className="flex space-x-1 mb-6 overflow-x-auto">
//             <button
//               onClick={() => handleTabChange('upcoming')}
//               className="px-6 py-3 font-medium rounded-t-lg whitespace-nowrap bg-gray-200 text-gray-600 hover:bg-gray-300"
//             >
//               Upcoming
//             </button>
//             <button
//               onClick={() => handleTabChange('completed')}
//               className="px-6 py-3 font-medium rounded-t-lg whitespace-nowrap bg-gray-200 text-gray-600 hover:bg-gray-300"
//             >
//               Completed
//             </button>
//             <button
//               onClick={() => handleTabChange('cancelled')}
//               className="px-6 py-3 font-medium rounded-t-lg whitespace-nowrap bg-blue-500 text-white"
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
//                 <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-red-500">
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
//                       <span className="px-3 py-1 rounded text-sm font-medium border border-red-600 text-red-600 bg-white">
//                         {appointment.status}
//                       </span>

//                       {/* Time */}
//                       <div className="flex items-center text-gray-500">
//                         <Clock className="w-4 h-4 mr-1" />
//                         <span className="text-sm">{appointment.time}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </main>
//       </div>

//       {/* User Info Footer */}
//       <div className="fixed bottom-4 left-4 lg:left-auto lg:right-4 bg-white rounded-full shadow-lg px-4 py-2 flex items-center space-x-2">
//         <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
//         <div className="hidden sm:block">
//           <p className="text-xs font-medium text-gray-700">Snorg M</p>
//           <p className="text-xs text-gray-500">Admin</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cancelled;