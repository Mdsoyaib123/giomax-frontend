import { AlertTriangle } from 'lucide-react';

const SuspendDoctorConfirmation = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Suspend Doctor</h3>
          <p className="text-gray-600 text-sm mb-1">Are you sure you want to suspend</p>
          <p className="font-semibold text-gray-900">Dr. John Doe?</p>
          <p className="text-gray-500 text-xs mt-2">They will not be able to accept new appointments.</p>
        </div>

        <div className="flex gap-3 justify-center">
          <button 
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button 
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Confirm Suspension
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuspendDoctorConfirmation;
