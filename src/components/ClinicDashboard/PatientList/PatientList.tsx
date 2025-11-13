import { useState } from "react";
import { Search, Eye } from "lucide-react";

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  lastAppointment: string;
}

const PatientList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Sample patient data
  const patients: Patient[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@gmail.com",
      phone: "+995 595 123 456",
      totalBookings: 12,
      lastAppointment: "Oct 12, 2025",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.c@gmail.com",
      phone: "+995 577 987 654",
      totalBookings: 20,
      lastAppointment: "Oct 10, 2025",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.r@gmail.com",
      phone: "+995 599 001 223",
      totalBookings: 4,
      lastAppointment: "Oct 8, 2025",
    },
    {
      id: 4,
      name: "James Wilson",
      email: "james.w@gmail.com",
      phone: "+995 32 245 6789",
      totalBookings: 10,
      lastAppointment: "Oct 5, 2025",
    },
    {
      id: 5,
      name: "Lisa Anderson",
      email: "lisa.a@gmail.com",
      phone: "+995 431 102 345",
      totalBookings: 1,
      lastAppointment: "Oct 3, 2025",
    },
    {
      id: 6,
      name: "Ekvom Nabuin",
      email: "ekvom_nabuin@gmail.com",
      phone: "+995 422 789 012",
      totalBookings: 2,
      lastAppointment: "Sep 28, 2025",
    },
    {
      id: 7,
      name: "Jonathan Kimali",
      email: "j.kimali@gmail.com",
      phone: "+995 555 334 455",
      totalBookings: 5,
      lastAppointment: "Sep 25, 2025",
    },
    {
      id: 8,
      name: "Hon. Naomi Wapo",
      email: "naomiwap@gmail.com",
      phone: "+995 341 568 708",
      totalBookings: 15,
      lastAppointment: "Sep 20, 2025",
    },
    {
      id: 9,
      name: "Brian Kirkogali Koech",
      email: "brian.kiplog@gmail.com",
      phone: "+995 503 678 901",
      totalBookings: 10,
      lastAppointment: "Sep 15, 2025",
    },
  ];

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
  );

  const totalPages = 9;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          All Patients Information
        </h2>
      </div>

      {/* Search Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fatima Adon, [11/13/2025 3:29 PM] Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Bookings
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Appointment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {patient.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {patient.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {patient.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {patient.totalBookings.toString().padStart(2, "0")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {patient.lastAppointment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">9</span> of{" "}
          <span className="font-medium text-blue-600">9 entries</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
            Prev
          </button>
          <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
            ...
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
            9
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientList;
