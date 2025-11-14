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

interface CancelledProps {
  onViewDetails: () => void;  // Accepting the prop to handle view details action
}

const Cancelled: React.FC<CancelledProps> = ({ onViewDetails }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Static cancelled appointment data
  const appointments: Appointment[] = [
    {
      id: '1',
      patientName: 'Alex Johnson',
      doctorName: 'Dr. Michael Chen',
      visitType: 'Online',
      time: '2:00 PM',
      status: 'Cancelled',
    },
    {
      id: '2',
      patientName: 'Clara Watson',
      doctorName: 'Dr. Michael Chen',
      visitType: 'Clinic Visit',
      time: '2:00 PM',
      status: 'Cancelled',
    },
  ];

  // Filter appointments based on the search query
  const filteredAppointments = appointments.filter((apt) =>
    apt.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50">
      {/* Search Bar */}
      <div className="p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by patient name"
          className="w-full p-2 border rounded-lg shadow-sm"
        />
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Cancelled Appointments</h2>
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
                  <span className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer">
                    {appointment.status}
                  </span>

                  {/* Time */}
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{appointment.time}</span>
                  </div>
                </div>
              </div>

              {/* View Details Button */}
              <button
                onClick={onViewDetails}
                className="mt-4 text-blue-600 hover:text-blue-700"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cancelled;
