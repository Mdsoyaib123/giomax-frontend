import { Clock } from 'lucide-react';

// Types
interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  visitType: 'Online' | 'Clinic Visit';
  time: string;
  status: 'Confirmed' | 'Pending';
}

interface UpcomingProps {
  onViewDetails: () => void; // Accept the onViewDetails prop here
}

const Upcoming: React.FC<UpcomingProps> = ({ onViewDetails }) => {
  const appointments: Appointment[] = [
    // Static appointment data...
  ];

  return (
    <div className="bg-gray-50">
      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">All Appointments</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-6 hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-blue-500"
            >
              {/* Patient Info */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{appointment.patientName}</h3>
                  <p className="text-sm text-gray-500 mb-1">Appointment with</p>
                  <p className="text-sm text-gray-600 mb-2">{appointment.doctorName}</p>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    {appointment.visitType}
                  </button>
                </div>

                {/* Status and Time */}
                <div className="flex flex-col items-end space-y-3">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium border ${
                      appointment.status === 'Confirmed'
                        ? 'border-green-600 text-green-600 cursor-pointer'
                        : 'border-yellow-600 text-yellow-600 bg-white cursor-pointer'
                    }`}
                    style={{
                      backgroundColor: appointment.status === 'Confirmed' ? '#D1F3DE' : 'transparent',
                    }}
                  >
                    {appointment.status}
                  </span>

                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{appointment.time}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Pending Appointments */}
              {appointment.status === 'Pending' && (
                <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer">
                    Accept
                  </button>
                  <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer">
                    Reject
                  </button>
                </div>
              )}

              {/* Button to trigger onViewDetails */}
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

export default Upcoming;
