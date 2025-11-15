import React, { useState } from 'react';
import { X, ArrowLeft, UploadCloud, Clock } from 'lucide-react';

// --- Interface & Mock Data ---

interface DoctorData {
  id: number;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  specialty: string;
  yearsOfExperience: number;
  serviceType: string;
  status: 'Active' | 'Inactive';
  workingDays: string; // Comma-separated string of days
  workingHour: string;
}

const mockDoctorData: DoctorData = {
  id: 1,
  name: "Dr. David Giorgadze",
  email: "david.gi@mail.com",
  phone: "+995 595 123 456",
  licenseNumber: "MED-001-2024",
  specialty: "Cardiology",
  yearsOfExperience: 12,
  serviceType: "Both (Online & Clinic Visit)",
  status: "Active",
  workingDays: "Monday, Tuesday, Wednesday, Friday",
  workingHour: "10:00 AM - 05:00 PM",
};

interface DialogueProps {
  doctor: DoctorData;
  onClose: () => void;
}

// --- Main Component: EditDoctorDetails ---

const EditDoctorDetails: React.FC<DialogueProps> = ({ doctor, onClose }) => {
  const [formData, setFormData] = useState(doctor);
  const [loading, setLoading] = useState(false);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Saving changes:", formData);
    if (certificateFile) {
      console.log("Certificate file:", certificateFile);
    }

    setTimeout(() => {
      setLoading(false);
      console.log("Save successful!");
      alert("Doctor details saved successfully!");
    }, 1500);
  };

  const specialtyOptions = ["Cardiology", "General Practitioner", "Pediatrics", "Neurology", "Dermatology"];
  const serviceTypeOptions = ["Both (Online & Clinic Visit)", "Online Only", "Clinic Visit Only"];
  const statusOptions = ["Active", "Inactive"];

  // --- Helpers ---

  const renderInput = (label: string, name: keyof DoctorData, type: string = "text", required: boolean = true) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name as string}
        value={formData[name] as string}
        onChange={handleChange}
        required={required}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    </div>
  );

  const renderSelect = (label: string, name: keyof DoctorData, options: string[]) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <select
          name={name as string}
          value={formData[name] as string}
          onChange={handleChange}
          required
          className="w-full appearance-none px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
        >
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-inter">
      <div className="bg-white rounded-xl w-[1100px] max-w-4xl relative shadow-2xl border border-gray-200 transform transition-all max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center">
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 mr-2 rounded-full hover:bg-gray-50"
                aria-label="Go Back"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Doctor Information
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update Dr. {doctor.name.split(' ')[2]}'s details
                </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-4 p-1 rounded-full hover:bg-gray-50"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
          <div className="p-6 space-y-8">

            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {renderInput("Doctor Name", "name")}
                {renderInput("Email Address", "email", "email")}
                {renderInput("Phone Number", "phone")}
                {renderInput("License Number", "licenseNumber")}
              </div>
            </div>

            {/* Professional Info */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-t border-gray-100 pt-6">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {renderSelect("Specialty", "specialty", specialtyOptions)}
                {renderInput("Years of Experience", "yearsOfExperience", "number")}
              </div>

              {/* Certificate Upload */}
              <div className="mt-6 flex justify-center">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  id="doctorCertificate"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setCertificateFile(e.target.files[0]);
                      console.log("Selected certificate:", e.target.files[0]);
                    }
                  }}
                />
                <label
                  htmlFor="doctorCertificate"
                  className="flex items-center justify-center w-full max-w-sm px-6 py-3 text-sm font-semibold text-blue-600 bg-white border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-5 h-5 mr-2" />
                  {certificateFile ? certificateFile.name : "Upload New Certificate"}
                </label>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Supported formats: PDF, JPG, PNG (Max 5MB)
              </p>
            </div>

            {/* Service Configuration */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-t border-gray-100 pt-6">Service Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {renderSelect("Service Type", "serviceType", serviceTypeOptions)}
                {renderSelect("Status", "status", statusOptions)}
              </div>
            </div>

            {/* Availability Schedule */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-t border-gray-100 pt-6">Availability Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  {renderInput("Working Days", "workingDays")}
                  <p className="text-xs text-gray-500 mt-1">Separate days with commas (e.g., Monday, Tuesday, Wednesday)</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Working Hour <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="workingHour"
                      value={formData.workingHour}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., 10:00 AM - 05:00 PM"
                    />
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold w-[493px] h-[56px] rounded-[6px] text-gray-700 bg-[#EFF4FF] hover:bg-gray-200 transition-colors border border-transparent"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-semibold w-[493px] h-[56px] rounded-[6px] bg-[#2E6FF3] text-white hover:bg-blue-700 transition-colors border border-transparent"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {isOpen ? (
        <EditDoctorDetails doctor={mockDoctorData} onClose={() => setIsOpen(false)} />
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md"
        >
          {/* Open Edit Form */}
        </button>
      )}
    </div>
  );
};

export default App;
