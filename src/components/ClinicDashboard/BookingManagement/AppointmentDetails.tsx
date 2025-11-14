import React from 'react';
import { Clock } from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  visitType: 'Online' | 'Clinic Visit';
  time: string;
  status: string;
}

interface AppointmentDetailsProps {
  appointments?: Appointment[];
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({ appointments = [] }) => {
  return (
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
                <span className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer">
                  {appointment.status}
                </span>

                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">{appointment.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {appointments.length === 0 && (
          <div className="p-6 text-center text-gray-500">No appointments found</div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetails;
